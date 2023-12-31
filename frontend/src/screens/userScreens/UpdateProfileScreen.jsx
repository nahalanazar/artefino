import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { setCredentials } from '../../slices/userAuthSlice'
import { useUpdateUserMutation } from '../../slices/userApiSlice'

const UpdateProfileScreen = () => {
    const VITE_PROFILE_IMAGE_DIR_PATH = import.meta.env.VITE_PROFILE_IMAGE_DIR_PATH;
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [profileImage, setProfileImage] = useState();

    const dispatch = useDispatch()

    const { userInfo } = useSelector((state) => state.userAuth)
    const [updateProfile, {isLoading}] = useUpdateUserMutation()
    
    useEffect(() => {
        setName(userInfo.name)
       setEmail(userInfo.email) 
    }, [userInfo.name, userInfo.email])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
        } else {
            try {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('profileImage', profileImage);

                const responseFromApiCall = await updateProfile( formData ).unwrap();

                dispatch( setCredentials( { ...responseFromApiCall } ) );
                toast.success('Profile updated')
            } catch (err) {
                console.log("blocked", err?.data?.error?.message)
                toast.error(err?.data?.message || err.error || err?.data?.error?.message)
            }
        }
    }
  return (
    <FormContainer>
        <h1>Update Profile</h1>

          {userInfo.profileImageName && (
            <img
            src={VITE_PROFILE_IMAGE_DIR_PATH + userInfo.profileImageName}
            alt={userInfo.name}
            style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                marginTop: "5px",
                marginLeft: "115px",
                marginBottom: "10px",
            }}                      
            />
          )}
          
        <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                ></Form.Control>
            </Form.Group>
              
            <Form.Group className='my-2' controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                type='email'
                placeholder='Enter Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                type='password'
                placeholder='Enter Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>  
              
            <Form.Group className='my-2' controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
              
            <Form.Group className="my-2" controlId="profileImage">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setProfileImage(e.target.files[0])}
              ></Form.Control>
            </Form.Group>
            
            {isLoading && <Loader />}

            <Button type='submit' variant='primary' className='mt-3'>
                Update
            </Button>  
        </Form>  
    </FormContainer>
  )
}

export default UpdateProfileScreen
