const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let token = null
beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('testuser', 10) 
    const user = new User({ username: 'testuser', name: 'testuser', password: passwordHash, email: 'testuser@gmail.com'})
    const savedUser = await user.save()

    const userToken = {
        username: 'testuser',
        id: savedUser._id
    }
    token = jwt.sign(userToken, process.env.SECRET)

    await Note.deleteMany({})
    const noteObject = helper.initialNotes.map(note => new Note({
        ...note, user: savedUser._id
    }))
    const promiseArray = noteObject.map(note => note.save())
    await Promise.all(promiseArray)
}, 100000)

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .set({ Authorization: `bearer ${token}` })
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
    const response = await api
        .get('/api/notes')
        .set({ Authorization: `bearer ${token}` })

    expect(response.body).toHaveLength(helper.initialNotes.length)
})

test('every note has timeStamp on it', async () => {
    const response = await api
        .get('/api/notes')
        .set({ Authorization: `bearer ${token}` })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const notes = response.body
    expect(Array.isArray(notes)).toBe(true)

    notes.forEach(note => {
        expect(note).toHaveProperty('createdAt')
        expect(note).toHaveProperty('updatedAt')
        expect(new Date(note.createdAt).toString()).not.toBe('Invalid Date')
    });
})

test('a specific note is within the returned notes', async () => {
    const response = await api
        .get('/api/notes')
        .set({ Authorization: `bearer ${token}` })

    const title = response.body.map(note => note.title)

    expect(title).toContain('Go To Statement Considered Harmful')
})

describe('addition of a note', () => {
    test('a valid note can be added', async () => {
        const newNote = {
            title: 'Testing is Essential part of Software Development',
            description: 'it is also very boring.'
        }
    
        await api
            .post('/api/notes')
            .send(newNote)
            .set({ Authorization: `bearer ${token}` })
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
    
        const titles = notesAtEnd.map(notes => notes.title)
        expect(titles).toContain('Testing is Essential part of Software Development')
    })

    test('without a valid token note can not be created', async () => {
        const newNote = {
            title: 'Testing is Essential part of Software Development',
            description: 'it is also very boring.'
        }

        const response = await api
            .post('/api/notes')
            .send(newNote)
            .set({ Authorization: `bearer ` })
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length)

        expect(response.body.error).toEqual('jwt must be provided')
    })

    test('description defaults to empty string when a new note is created without description', async () => {
        const newNote = {
            title: 'Testing is Essential part of Software Development',
        }
    
        const response = await api
            .post('/api/notes')
            .send(newNote)
            .set({ Authorization: `bearer ${token}` })
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

        const createdNote = response.body
        expect(createdNote).toHaveProperty('description', '')
    })

    test('if the title is missing from the request data, respond to the request with the status code 400 Bad Request', async () => {
        const newNote = {
            description: 'hey there is no title'
        }
    
        // for missing title
        await api
            .post('/api/notes')
            .send(newNote)
            .set({ Authorization: `bearer ${token}` })
            .expect(400)
    })
})



test('unique identifier property of the note should be named as id', async () => {
    const response = await api.get('/api/notes').set({ Authorization: `bearer ${token}` })

    expect(response.body[0].id).toBeDefined()
})


describe('deletion of a note', () => {
    test('succeeds with the status code of 204 if id is valid', async () => {
        const notesAtStart = await helper.notesInDb()

        const newNote = {
            title: 'Testing is Essential part of Software Development',
            description: 'hello world'
        }
    
        const response = await api
            .post('/api/notes')
            .send(newNote)
            .set({ Authorization: `bearer ${token}` })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        await api
            .delete(`/api/notes/${response.body.id}`)
            .set({ Authorization: `bearer ${token}` })
            .expect(204)

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(notesAtStart.length)

        const titles = notesAtEnd.map(note => note.title)

        expect(titles).not.toContain(response.body.title) 
    })
})

describe('updation of a note', () => {
    test('succeeds with the status code of 200 if a valid update is performed', async () => {
        const notesAtStart = await helper.notesInDb()

        const noteToUpdate = {
            title: notesAtStart[0].title,
            description: "hello world!!",
        }
        
        const response = await api
                            .put(`/api/notes/${notesAtStart[0].id}`)
                            .send(noteToUpdate)
                            .expect(200)
                            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length)

        expect(response.body.id).toEqual(notesAtStart[0].id)
        expect(response.body.description).toEqual(noteToUpdate.description)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})