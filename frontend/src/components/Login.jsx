import { Avatar, Box, Button, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import FormControl from '@mui/material/FormControl'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from "react"
import { blue } from "@mui/material/colors"

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }
    return (
        <Box>
            <Stack alignItems='center' justifyContent='center' spacing={2}>
                <Stack alignItems='center' justifyContent='center' spacing={1}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography>Sign in</Typography>
                </Stack>
                <TextField id="outlined-basic" label="Username" variant="outlined" sx={{ m: 1, width: '36ch' }} />

                <FormControl sx={{ m: 1, width: '36ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
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
                </FormControl>
                <Stack justifyContent='flex-start' alignItems='flex-start' direction='column'>
                    <Button variant="contained" sx={{ m: 1, width: '36ch' }}>SIGN IN</Button>
                    <Link component="button" variant="body2" sx={{ m: 1 }}>Forget password?</Link>
                </Stack>
            </Stack>
        </Box>
    )
}

export default Login
