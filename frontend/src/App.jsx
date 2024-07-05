import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Box, Container } from '@mui/material'
import Stack from '@mui/material/Stack'
import './App.css'

function App() {
  return (
    <Container sx={{ backgroundColor: 'green', width: '80vw', height: '100vh'}}>
      <Stack direction='row' spacing={0} sx={{ backgroundColor: 'lightblue', height: '100%'}}>
        <Box sx={{ backgroundColor: 'red', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          login
        </Box>
        <Box sx={{ backgroundColor: 'yellow', p: 2, width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          Sign Up
        </Box>
      </Stack>
    </Container>
  )
}

export default App
