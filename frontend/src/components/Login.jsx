import { Alert, Avatar, Backdrop, Box, Button, CircularProgress, Collapse, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import FormControl from '@mui/material/FormControl'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from "react"
import { blue } from "@mui/material/colors"
import { useDispatch, useSelector } from 'react-redux'
import { setLogin } from "../reducers/authenticationReducer"
import loginService from "../services/login"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)

    const notification = useSelector(state => state.message)

    const navigate = useNavigate()

    const [ formData, setFormData ] = useState({
        username: '',
        password: '',
    })

    const [errors, setErrors] = useState({
        username: '',
        password: '',
    })

    const validateForm = () => {
        let valid = true
        let newErrors = {}

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
            valid = false
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
            valid = false
        }

        setErrors(newErrors)
        return valid
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

    const dispatch = useDispatch()

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const handleLogin = (event) => {
        event.preventDefault()
        if (!validateForm()) return
        dispatch(setLogin(formData.username, formData.password))
        setFormData({
            username: '',
            password: '',
        })
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100vh"
            position="relative"
            sx={{ width: '100%' }}
            component="form"
            onSubmit={handleLogin}
        >
            <Stack alignItems='center' justifyContent='center' spacing={2}>
                <Stack alignItems='center' justifyContent='center' spacing={1}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography>Sign in</Typography>
                </Stack>
                <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    sx={{ m: 1, width: '36ch' }}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                />

                <FormControl sx={{ m: 1, width: '36ch' }} variant="outlined" error={!!errors.password}>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        data-testid='form-password'
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            data-testid='icon-button-password'
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
                <Stack justifyContent='flex-start' alignItems='flex-start' direction='column'>
                    <Button variant="contained" type="submit" sx={{ m: 1, width: '36ch' }}>SIGN IN</Button>
                    <Link component="button" variant="body2" sx={{ m: 1 }}>Forget password?</Link>
                </Stack>
            </Stack>
            
            {
                notification?.message && (
                    <Box position="absolute" top="1%">
                        <Collapse in={!!notification.message} orientation="vertical">
                            <Alert severity={notification.type}>{notification.message}</Alert>
                        </Collapse>
                    </Box>
                )
            }
        </Box>
    )
}

export default Login
