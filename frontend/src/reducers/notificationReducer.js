import { createSlice } from "@reduxjs/toolkit"

const initialState = {message: null, type: null}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        set(state, action) {
            return action.payload
        },
        remove(state, action) {
            return { message: null, type: null }
        }
    }
})

export const setNotification = (message, type, time) => {
    return async dispatch => {
        dispatch(set({message, type}))
        setTimeout(() => {
            dispatch(remove())
        }, time)
    }
}

export const { set, remove } = notificationSlice.actions

export default notificationSlice.reducer