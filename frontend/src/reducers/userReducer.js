import { createSlice } from "@reduxjs/toolkit"
import userService from '../services/user'
import { setNotification } from '../reducers/notificationReducer'


const userReducer = createSlice({
    name: 'profile',
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload
        },
        resetProfileUser(state, action) {
            return null
        }
    }
})

export const { setUser, resetProfileUser } = userReducer.actions

export const getProfileUser = () => {
    return async dispatch => {
        const user = await userService.getUser()
        dispatch(setUser(user))
    }
}

export const updateProfileUser = (newObject) => {
    return async dispatch => {
        try {
            const user = await userService.updateUser(newObject)
            dispatch(setUser(user))
            dispatch(setNotification('Profile successfully Updated', 'success', 5000))
        }
        catch (error) {
            dispatch(setNotification(`Update unsuccessful ${error.message}`, 'error', 3000))
        }
    }
}

export default userReducer.reducer