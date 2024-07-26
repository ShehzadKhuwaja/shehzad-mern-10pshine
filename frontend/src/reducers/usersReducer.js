import { createSlice } from "@reduxjs/toolkit"
import userService from '../services/user'


const usersReducer = createSlice({
    name: 'user',
    initialState: [],
    reducers: {
        setAll(state, action) {
            return action.payload
        }
    }
})

export const { setAll } = usersReducer.actions

export const getUsers = () => {
    return async dispatch => {
        const users = await userService.getAll()
        dispatch(setAll(users))
    }
}

export default usersReducer.reducer