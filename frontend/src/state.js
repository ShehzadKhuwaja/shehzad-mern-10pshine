import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import noteReducer from './reducers/noteReducer'
import authenticationReducer from './reducers/authenticationReducer'
import usersReducer from './reducers/usersReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
    reducer: {
        message: notificationReducer,
        notes: noteReducer,
        auth: authenticationReducer,
        users: usersReducer,
        user: userReducer
    },
})

export default store