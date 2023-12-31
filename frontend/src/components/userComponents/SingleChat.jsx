import { Box, Text } from '@chakra-ui/layout'
import { FormControl} from '@chakra-ui/form-control'
import { Spinner, IconButton, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Input } from "@chakra-ui/input";
import { ChatState } from '../context/ChatProvider'
import { getSender } from '../config/ChatLogics'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import { useSendMessageMutation, useFetchMessagesMutation } from '../../slices/userApiSlice'
import "../../styles/message.css";
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../../animations/typing.json'

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const [sendNewMessage] = useSendMessageMutation()
    const [fetchAllMessages] = useFetchMessagesMutation()

    const { selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const { userInfo } = useSelector((state) => state.userAuth);
    const userId = userInfo.id

    const toast = useToast()

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const { data } = await sendNewMessage({ content: newMessage, chatId: selectedChat._id });
                socket.emit('new Message', data)
                setMessages([...messages, data]);
                setNewMessage(""); 
            } catch (error) {
                toast({
                    title: "Error occurred",
                    description: "Failed to send message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
            }
        }
    };

    const fetchMessages = async () => {
        if (!selectedChat) return
        setLoading(true)
        try {
            const { data } = await fetchAllMessages(selectedChat._id);
            setMessages(data)
            setLoading(false)

            socket.emit("join chat", selectedChat._id)
        } catch (error) { 
            toast({
                title: "Error occurred",
                description: "Failed to Load messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", userInfo)
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    console.log("-------", notification);

    // useEffect(() => {
    //     socket.on("message received", (newMessageReceived) => {
    //         if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
    //             if (!notification.includes(newMessageReceived)) {
    //                 setNotification([newMessageReceived, ...notification])
    //                 // setFetchAgain(!fetchAgain)
    //             }
    //         } else {
    //             setMessages([...messages, newMessageReceived])
    //         }
    //     })
    // })


useEffect(() => {
  socket.on("message received", (newMessageReceived) => {
    if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
      const existingNotification = notification.find((n) => n.chat._id === newMessageReceived.chat._id);

      if (!existingNotification) {
        setNotification([newMessageReceived, ...notification]);
      } else {
        // Update the existing notification
        setNotification([
          ...notification.filter((n) => n.chat._id !== newMessageReceived.chat._id),
          newMessageReceived,
        ]);
      }
    } else {
      setMessages([...messages, newMessageReceived]);
    }
  });
}, [notification, selectedChatCompare]);

    
    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        //typing indicator logic
        if (!socketConnected) return
        
        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        let timerLength = 2000
        setTimeout(() => {
            let timeNow = new Date().getTime()
            let timeDiff = timeNow - lastTypingTime

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength);
    }

  return (
    <>
        {selectedChat ? (
            <>
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="work sans"
                    display="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    <IconButton 
                        display={{base: "flex", md: "none"}}
                        icon={<ArrowBackIcon />}
                        onClick={()=>setSelectedChat("")}
                    />
                    {getSender(userId, selectedChat.users)}
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflow="hidden"
                >
                      {loading ? (
                          <Spinner
                              size="xl"
                              w={20}
                              h={20}
                              alignSelf='center'
                              margin="auto"
                          />
                      ) : (
                          <div className='messages'>
                            <ScrollableChat messages={messages} />
                          </div>
                      )}

                      <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                          {isTyping ? <div>
                              <Lottie
                                  options={defaultOptions}
                                  width={70}
                                  style={{marginBottom: 15, marginLeft: 0}}
                              />
                          </div> : <></>}
                          <Input
                              value={newMessage}
                              variant="filled"
                              bg="#E0E0E0"
                              placeholder='Enter New Message'
                              onChange={typingHandler}
                          />
                      </FormControl>
                </Box>
            </>
        ) : (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="work sans">
                    Click on a user to start chatting
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat