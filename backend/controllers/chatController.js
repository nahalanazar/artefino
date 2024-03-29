import asyncHandler from 'express-async-handler'
import ChatRoom from '../models/chatModel.js'
import User from '../models/userModel.js'
import Message from '../models/messageModel.js'
import cloudinary from '../utils/cloudinary.js'


// desc   Access particular chatRoom or create a new chatRoom
// route  POST /api/users/accessChat
// access Private
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        return res.status(400).json({ error: "UserId parameter is required" });
    }

    const currentUser = await User.findById(req.user._id);
    const otherUser = await User.findById(userId);

    const currentUserFollowsOther = currentUser.following.includes(userId);
    const otherUserFollowsCurrent = otherUser.following.includes(req.user._id);

    if (!currentUserFollowsOther || !otherUserFollowsCurrent) {
        return res.status(403).json({ error: "Unauthorized: Users must follow each other to access the chat" });
    }

    let isChat = await ChatRoom.find({
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq:userId} } }
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name profileImageName email"
    }) 

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        let chatData = {
            chatName: "sender",
            users: [req.user._id, userId]
        }
        try {
            const createChat = await ChatRoom.create(chatData)
            const fullChat = await ChatRoom.findOne({ _id: createChat._id }).populate("users", "-password")
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

// desc   Access all chatRooms of the user
// route  GET /api/users/fetchChats
// access Private
const fetchChats = asyncHandler(async (req, res) => {
    try {
        ChatRoom.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name profilePictureName email"
                })
                res.status(200).send(results)
            })
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

// desc   Send New Message
// route  POST /api/users/sendMessage
// access Private
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId, imageUrl } = req.body
    let imagesBuffer = [];

    if (imageUrl) {
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: "ChatImages",
            // width: 300,
            // crop: "scale"
        });
        imagesBuffer.push({
            public_id: result.public_id,
            url: result.url
        })
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
        images: imagesBuffer
    }

    try {
        var message = await Message.create(newMessage)
        message = await message.populate("sender", "name profileImageName")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name profileImageName email"
        })

        await ChatRoom.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })

        res.status(200).json(message)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// desc   Fetch All Messages for a Chat
// route  POST /api/users/allMessages/:chatId
// access Private
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name profileImageName email")
            .populate("chat")
        res.status(200).json(messages)
    } catch (error) {
        res.status(400)
        throw new Error
    }
})

export {
    accessChat,
    fetchChats,
    sendMessage,
    allMessages
}