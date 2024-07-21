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
import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './components/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/authenticationReducer'
import noteService from './services/notes'
import Dashboard from './components/Dashboard'
import { useEffect } from 'react'

function App() {

  const user = useSelector(state => state.auth)
  console.log(user)
  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        console.log(user.token)
        dispatch(setUser(user))
        noteService.setToken(user.token)
    }
  }, [])

  if (user === null) {
    console.log(38)
    return (
        <Container>
          <Auth />
        </Container>
    )
  }

  return (
    <Container>
      <Routes>
        <Route path='/auth' element={<Auth />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/' element={!user ? <Navigate replace to='/auth' />: <Navigate replace to='/Dashboard' />} />
      </Routes>
    </Container>
  )
}

export default App
