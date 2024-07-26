import { createSlice } from "@reduxjs/toolkit"
import loginService from '../services/login'
import noteService from '../services/notes'
import UserService from '../services/user'
import { setNotification } from "./notificationReducer"

const authenticationReducer = createSlice({
    name: 'authentication',
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload
        },
    }
})

export const { setUser } = authenticationReducer.actions

export const setLogin = (username, password) => {
    return async dispatch => {
        try {
            const user = await loginService.login({
                username, password
            })
            window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))

            noteService.setToken(user.token)
            UserService.setUserToken(user.token)
            UserService.setUserId(user.id)
            dispatch(setUser(user))
            //dispatch(setNotification(`You are Logged in Successfully`, 'success', 5000))
        } catch (error) {
            dispatch(setNotification('Wrong username or password', 'error', 5000))
        }
    }
} 

export default authenticationReducer.reducer