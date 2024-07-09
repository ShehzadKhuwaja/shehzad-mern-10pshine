import { createSlice } from "@reduxjs/toolkit"
import userService from '../services/user'


const userReducer = createSlice({
    name: 'user',
    initialState: [],
    reducers: {
        setAll(state, action) {
            return action.payload
        }
    }
})

export const { setAll } = userReducer.actions

export const getUsers = () => {
    return async dispatch => {
        const users = await userService.getAll()
        dispatch(setAll(users))
    }
}

export default userReducer.reducer