import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import noteReducer from './reducers/noteReducer'
import authenticationReducer from './reducers/authenticationReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
    reducer: {
        message: notificationReducer,
        notes: noteReducer,
        auth: authenticationReducer,
        users: userReducer,
    }
})

export default store