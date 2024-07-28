const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
    {
        title: 'Go To Statement Considered Harmful',
        description: 'lecture 3',
    },
    {
        title: 'Superman Killed by Batman',
        description: 'lecture 4',
    }
]

const nonExistingId = async () => {
    const note = Note({title: 'willremovesoon'})
    await note.save()
    await note.deleteOne()

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialNotes,
    nonExistingId,
    notesInDb,
    usersInDb
}