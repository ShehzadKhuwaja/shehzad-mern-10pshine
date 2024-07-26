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
import userService from './services/user'
import Dashboard from './components/Dashboard'
import { useEffect } from 'react'

import NoteList from './components/NoteList'; // Import your components
import Calendar from './components/Calendar';
import Reminders from './components/Reminders';
import Archive from './components/Archive';
import Trash from './components/Trash';
import Favorites from './components/Favorites';
import Category from './components/Category';
import Tags from './components/Tags';
import DashProfile from './components/DashProfile';


const AppRoutes = ({ user }) => {
  return (
    <Routes>
      <Route path='/auth' element={<Auth />} />
      <Route path='/Dashboard' element={<Dashboard MainArea={NoteList}/>} />
      <Route path='/' element={!user ? <Navigate replace to='/auth' />: <Navigate replace to='/Dashboard' />} />
      <Route path='/all-notes' element={<Navigate replace to ='/Dashboard' />}/>
      <Route path="/calendar" element={<Dashboard MainArea={Calendar}/>} />
      <Route path="/reminders" element={<Dashboard MainArea={Reminders}/>} />
      <Route path="/archive" element={<Dashboard MainArea={Archive}/>} />
      <Route path="/trash" element={<Dashboard MainArea={Trash}/>} />
      <Route path="/favorites" element={<Dashboard MainArea={Favorites}/>} />
      <Route path="/category" element={<Dashboard MainArea={Category}/>} />
      <Route path="/tags" element={<Dashboard MainArea={Tags}/>} />
      <Route path="/profile" element={<Dashboard MainArea={DashProfile}/>} />
    </Routes>
  );
}

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
        userService.setUserToken(user.token)
        userService.setUserId(user.id)
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
    <div>
      <AppRoutes user={user} />
    </div>
  )
}

export default App
