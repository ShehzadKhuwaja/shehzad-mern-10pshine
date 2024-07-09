import { createSlice } from "@reduxjs/toolkit"
import loginService from '../services/login'
import blogService from '../services/blogs'
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
            window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

            blogService.setToken(user.token)
            dispatch(setUser(user))
            dispatch(setNotification(`You are Logged in Successfully`, 'success', 5000))
        } catch (error) {
            dispatch(setNotification('Wrong username or password', 'error', 5000))
        }
    }
} 

export default authenticationReducer.reducer