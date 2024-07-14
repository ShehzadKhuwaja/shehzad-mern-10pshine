import { Avatar, Box, Button, IconButton, InputAdornment, Snackbar, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import FormControl from '@mui/material/FormControl'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useEffect, useState } from "react"
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { styled } from '@mui/system'
import { storage } from '../firebaseConfig'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import userService from "../services/user"
import Alert from '@mui/material/Alert'

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        image: null
    })

    const [errors, setErrors] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

    const handleSnackbarClose = () => {
        setSnackbarOpen(false)
    }

    const [preview, setPreview] = useState(null)

    const [uploading, setUploading] = useState(false)

    const [submissionError, setSubmissionError] = useState(false)

    const [success, setSucess] = useState(false)
    
    useEffect(() => {
        setSucess(true)
        setSnackbarMessage('sign up successful')
        setSnackbarOpen(true)
    }, [])

    const handleNext = () => {
        if (!validateForm()) return
        setStep(step + 1)
    }
    
    const handleBack = () => {
        setStep(step - 1)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
          ...formData,
          [name]: value
        })

        setErrors({
            ...errors,
            [name]: ''
        })
    }

    const Input = styled('input')({
        display: 'none',
      })
    
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData({
                ...formData,
                image: e.target.files[0]
            })
            const reader = new FileReader()
            reader.onloadend = () => {
            setPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const validateForm = () => {
        let valid = true
        let newErrors = {}

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
            valid = false
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
            valid = false
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
            valid = false
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
            valid = false
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            valid = false
        }

        setErrors(newErrors)
        return valid
    }
    
    const handleSubmit = async () => {
        if (!validateForm()) return

        console.log(formData)
        // Submit the form data to your backend or perform any action needed
        if (formData.image) {
            setUploading(true)
            const fileName = new Date().getTime() + formData.image.name
            const storageRef = ref(storage, `images/${fileName}`)
            const uploadTask = uploadBytesResumable(storageRef, formData.image)
            
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    //const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    //setImageFileUploadProgress(progress.toFixed(0))
                },
                (error) => {
                    console.error(error)
                    setUploading(false)
                    setPreview(null)
                    setFormData({...formData, image: null})
                    setSubmissionError(true)
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                    
                    const { username, name, email, password } = formData
                    const postData = {
                      username,
                      name,
                      email,
                      password,
                      avatar: downloadURL
                    }

                    handleBack()

                    try {
                        const newUser = await userService.signUp(postData)
                        console.log(newUser)
                        setSubmissionError(false)
                        setSucess(true)
                        setSnackbarMessage('Sign up successful')
                        setSnackbarOpen(true)
                      } catch (error) {
                        console.error(error)
                        setSubmissionError(true)
                        setSnackbarMessage(`User creation failed. ${error.name}`)
                        setSnackbarOpen(true)
                        const imageRef = ref(storage, `images/${fileName}`)
                        deleteObject(imageRef).catch((deleteError) => {
                            console.error('Failed to delete uploaded image:', deleteError)
                        })
                      } finally {
                        setUploading(false)
                      }
                }
            )
        }
        else {
            const { username, name, email, password } = formData
            const postData = {
              username,
              name,
              email,
              password,
            }

            handleBack()
    
            try {
                const newUser = await userService.signUp(postData)
                console.log(newUser)
                setSubmissionError(false)
                setSucess(true)
                setSnackbarOpen(true)
                setSnackbarMessage('Sign up successful')
            } catch (error) {
                console.error(error)
                setSubmissionError(true)
                setSnackbarMessage(`User creation failed. ${error.name}`)
                setSnackbarOpen(true)
            } finally {
                setUploading(false)
            }
        }

        if (!submissionError) {
            setFormData({
                username: '',
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                image: null
            })
    
            setPreview(null)
            handleBack()
        }

    }

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    if (step === 2) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Stack alignItems='center' justifyContent='center' spacing={1} marginBottom={0}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography>Sign up (optional)</Typography>
            </Stack>
            
            {preview ? (
                <Avatar alt="Avatar Preview" src={preview} sx={{ width: 120, height: 120 }} />
            ) : (
                <AccountCircleIcon sx={{ width: 120, height: 120 }} />
            )}
            <label htmlFor="upload-button">
                <Input
                accept="image/*"
                id="upload-button"
                type="file"
                onChange={handleImageChange}
                />
                <Button variant="contained" component="span" sx={{ m: 1, width: '36ch' }}>
                Upload Avatar
                </Button>
            </label>
            {formData.image && <Typography variant="body2">{formData.image.name}</Typography>}
            <Box display="flex" flexDirection="row" gap={1} justifyContent="space-between" sx={{ m: 1, width: '36ch' }}>
                <Button variant="contained" onClick={handleBack} sx={{ flexGrow: 1 }}>
                    BACK
                </Button>
                <Button variant='contained' sx={{ flexGrow: 1 }} onClick={handleSubmit}>SIGN UP</Button>
            </Box>

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            </Box>
        )
    }

    return (
        <Box>
            <Stack alignItems='center' justifyContent='center' spacing={2}>
                <Stack alignItems='center' justifyContent='center' spacing={1}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography>Sign up</Typography>
                </Stack>
                <TextField
                    label="Username"
                    variant="outlined"
                    sx={{ m: 1, width: '36ch' }}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                />
                <TextField
                    label="name"
                    variant="outlined"
                    sx={{ m: 1, width: '36ch' }}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    sx={{ m: 1, width: '36ch' }}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                />

                <FormControl sx={{ m: 1, width: '36ch' }} variant="outlined" error={!!errors.password}>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password-signup"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Password"
                    />
                    <Typography variant="body2" color="error">{errors.password}</Typography>
                </FormControl>

                <FormControl sx={{ m: 1, width: '36ch' }} variant="outlined" error={!!errors.confirmPassword}>
                    <InputLabel htmlFor="outlined-adornment-password">Confirm password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-retypepassword-signup"
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Retype-password"
                    />
                     <Typography variant="body2" color="error">{errors.confirmPassword}</Typography>
                </FormControl>

                <Button variant="contained" sx={{ m: 1, width: '36ch' }} onClick={handleNext}>Next</Button>
            </Stack>

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={success ? "success": "error"} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default SignUp
