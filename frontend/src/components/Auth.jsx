import { Box, Container, LinearProgress, Stack } from "@mui/material"
import Login from "./Login"
import SignUp from "./SignUp"
import React from 'react'

const Auth = () => {
    const [progress, setProgress] = React.useState(0)
    return (
        <Container sx={{ backgroundColor: 'green', width: '80vw', height: '100vh'}}>
        <Stack direction='row' spacing={0} sx={{ backgroundColor: 'lightblue', height: '100%'}}>
            <Box sx={{ backgroundColor: 'red', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid black'}}>
            <Login />
            </Box>
            <Box sx={{ backgroundColor: 'yellow', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative'}}>
            <Box sx={{ width: '100%', position: 'absolute', top: '0px'}}>
            {
                progress !== 0 && <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 24 }} />
            }
            </Box>
            <SignUp setProgress={setProgress}/>
            </Box>
        </Stack>
        </Container>
    )
}

export default Auth
