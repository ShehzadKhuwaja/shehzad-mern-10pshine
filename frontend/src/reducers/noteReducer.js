import { createSlice } from "@reduxjs/toolkit"
import noteService from '../services/notes'
import { setNotification } from '../reducers/notificationReducer'

const noteSlice = createSlice({
    name: 'note',
    initialState: [],
    reducers: {
        setAll(state, action) {
            return action.payload
        },
        create(state, action) {
            console.log(action.payload)
            state.push(action.payload)
        },
        update(state, action) {
            return state.map(note => action.payload.id !== note.id ? note : action.payload)
        },
        remove(state, action) {
            return state.filter(note => note.id !== action.payload)
        },
        sort(state, action) {
            return state.sort((note1, note2) => note2.likes - note1.likes)
        },
    }
})

export const { setAll, create, update, remove, sort } = noteSlice.actions

export const initializeNote = () => {
    return async dispatch => {
        const notes = await noteService.getAll()
        dispatch(setAll(notes))
        dispatch(sort())
    }
}

export const createNote = (note) => {
    return async dispatch => {
        const newNote = await noteService.create(note)
        dispatch(create(newNote))
        dispatch(sort())
        dispatch(setNotification(`a new note ${newNote.title} added`, 'success', 5000))
    }
}

export const updateNote = (note) => {
    return async dispatch => {
        try {
            const updatedNote = await noteService.update(note)
            dispatch(update(updatedNote))
            dispatch(sort())
            dispatch(setNotification(`You have updated ${note.title} note`, 'success', 5000))
        }
        catch (error) {
            dispatch(setNotification(`Note '${note.title}' was already removed from server`, 'error', 5000))
        }
    }
}

export const deleteNote = (note) => {
    return async dispatch => {
        try {
            await noteService.deleteNote(note.id)
            dispatch(remove(note.id))
            dispatch(sort())
            dispatch(setNotification(`Note ${note.title} deleted`, 'success', 5000))
        } catch (error) {
            dispatch(setNotification('Unauthorized to delete this note', 'error', 5000))
        }
    }
}

export default noteSlice.reducer