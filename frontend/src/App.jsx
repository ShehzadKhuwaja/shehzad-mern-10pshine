import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Box, Container } from '@mui/material'
import Stack from '@mui/material/Stack'
import Login from './components/Login'
import './App.css'
import SignUp from './components/SignUp'
import PropTypes from 'prop-types'
import LinearProgress from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import * as React from 'react';
import UploadAvatar from './components/UploadAvatar'

function App() {
  const [progress, setProgress] = React.useState(10)

  return (
    <Container sx={{ backgroundColor: 'green', width: '80vw', height: '100vh'}}>
      <Stack direction='row' spacing={0} sx={{ backgroundColor: 'lightblue', height: '100%'}}>
        <Box sx={{ backgroundColor: 'red', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid black'}}>
          <Login />
        </Box>
        <Box sx={{ backgroundColor: 'yellow', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative'}}>
        <Box sx={{ width: '100%', position: 'absolute', top: '0px'}}>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 24 }} />
        </Box>
          <UploadAvatar />
        </Box>
      </Stack>
    </Container>
  )
}

export default App
