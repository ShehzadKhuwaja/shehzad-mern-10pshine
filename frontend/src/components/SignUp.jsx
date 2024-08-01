import { Avatar, Box, Button, IconButton, InputAdornment, Snackbar, InputLabel, Link, OutlinedInput, Stack, TextField, Typography, Collapse, Backdrop, CircularProgress } from "@mui/material"
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
import { createTheme, ThemeProvider } from '@mui/material/styles'


const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                '& .MuiInputBase-root': {
                    color: '#D3D3D3', // Input text color
                },
                '& .MuiInputLabel-root': {
                    color: '#D3D3D3', // Label color
                },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        color: '#D3D3D3', // Input text color
                    },
                    '& .MuiInputLabel-root': {
                        color: '#D3D3D3', // Label color
                    },
                }
            }
        }
    },
});

const SignUp = ({ setProgress }) => {
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

    const [snackbarMessage, setSnackbarMessage] = useState('')

    const [preview, setPreview] = useState(null)

    const [uploading, setUploading] = useState(false)

    const [success, setSucess] = useState(false)

    const [showAlert, setShowAlert] = useState(false)

    const resetAvatar = () => {
        setPreview(null)
        setFormData({
            ...formData,
            image: null
        })
        setProgress(50)
    }

    const handleNext = () => {
        if (!validateForm()) return
        setStep(step + 1)
        if (preview) {
            setProgress(100)
        }
        else {
            setProgress(50)
        }
    }
    
    const handleBack = () => {
        //if (step === 1) return
        setStep(step - 1)
        if (preview) {
            setProgress(100)
        }
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
            setProgress(100)
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

    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const handleSubmit = async () => {
        if (!validateForm()) return

        setProgress(100)
        setIsSubmitting(true)

        console.log(formData)
        // Submit the form data to your backend or perform any action needed
        if (formData.image) {
            setUploading(true)
            //const fileName = new Date().getTime() + formData.image.name
            const storageRef = ref(storage, `avatars/${formData.username}`)
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
                    setProgress(50)
                },
                async () => {
                    const downloadURL = `avatars/${formData.username}`
                    
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
                        setFormData({
                            username: '',
                            name: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            image: null
                        })
                        setPreview(null)
                        setProgress(0)
                        setSucess(true)
                        setSnackbarMessage('Sign up successful')
                        setIsSubmitting(false)
                        setShowAlert(true)
                        setTimeout(() => setShowAlert(false), 3000)
                      } catch (error) {
                        console.error(error)
                        setSucess(false)
                        setSnackbarMessage(`User creation failed. ${error.response.data.error}`)
                        setIsSubmitting(false)
                        setProgress(0)
                        setShowAlert(true)
                        setTimeout(() => setShowAlert(false), 3000)
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
                setFormData({
                    username: '',
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    image: null
                })
                setPreview(null)
                setProgress(0)
                setSucess(true)
                setSnackbarMessage('Sign up successful')
                setIsSubmitting(false)
                setShowAlert(true)
                setTimeout(() => setShowAlert(false), 3000)
            } catch (error) {
                console.error(error)
                setSucess(false)
                setSnackbarMessage(`User creation failed. ${error.response.data.error}`)
                setIsSubmitting(false)
                setProgress(0)
                setShowAlert(true)
                setTimeout(() => setShowAlert(false), 3000)
            } finally {
                setUploading(false)
            }
        }
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    if (step === 2) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                height="100vh"
                position="relative"
                className={isSubmitting ? 'blur-background' : ''}
                gap={1}
                sx={{ width: '100%' }}
            >
            <Stack alignItems='center' justifyContent='center' spacing={1} marginBottom={0}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography sx={{ color: '#D3D3D3' }}>Sign up (optional)</Typography>
            </Stack>
            
            {preview ? (
                <Avatar alt="Avatar Preview" src={preview} sx={{ width: 120, height: 120 }} />
            ) : (
                <AccountCircleIcon sx={{ width: 120, height: 120 }} />
            )}

            {formData.image && <Typography variant="body2">{formData.image.name}</Typography>}

            <label htmlFor="upload-button">
                <Input
                accept="image/*"
                id="upload-button"
                type="file"
                onChange={handleImageChange}
                />
                <Button variant="contained" component="span" sx={{ width: '36ch' }}>
                Upload Avatar
                </Button>
            </label>

            <Button variant="contained" onClick={resetAvatar} sx={{ width: '36ch' }}>
                Reset Avatar
            </Button>

            <Box display="flex" flexDirection="row" gap={1} justifyContent="space-between" sx={{ m: 1, width: '36ch' }}>
                <Button variant="contained" onClick={handleBack} sx={{ flexGrow: 1 }}>
                    BACK
                </Button>
                <Button variant='contained' sx={{ flexGrow: 1 }} onClick={handleSubmit}>SIGN UP</Button>
            </Box>

            <Box position="absolute" top="1%">
                <Collapse in={showAlert} orientation="vertical">
                    <Alert severity={success ? "success": "error"}>{snackbarMessage}</Alert>
                </Collapse>
            </Box>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isSubmitting}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            </Box>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                height="100vh"
                position="relative"
                className={isSubmitting ? 'blur-background' : ''}
                sx={{ width: '100%', color: '#D3D3D3' }}
            >
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

                <Box position="absolute" top="1%">
                    <Collapse in={showAlert} orientation="vertical">
                        <Alert severity={success ? "success": "error"}>{snackbarMessage}</Alert>
                    </Collapse>
                </Box>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isSubmitting}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        </ThemeProvider>
    )
}

export default SignUp
