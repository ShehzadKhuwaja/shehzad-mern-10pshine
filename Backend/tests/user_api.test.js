const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bycrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bycrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash, email: 'root@gmail.com', name: 'root' })

        await user.save()
    })

    test('creation succeeds with fresh username', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            email: 'matti@yahoo.com',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length + 1)

        const usernames = userAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if user already taken', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "Superuser",
            email: "testing@gmail.com",
            password: "superuser"   
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const userAtEnd = await helper.usersInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length)
            
    })

    test('creation fails with proper statuscode and message if invalid request is made', async () => {
        const userAtStart = await helper.usersInDb()

        const invalidUser = {
            username: 'test3',
            name: 'test3'
        }

        const result = await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password is missing')

        const invalidUser2 = {
            username: 'test3',
            name: 'test3',
            password: '12'
        }

        const result2 = await api
            .post('/api/users')
            .send(invalidUser2)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result2.body.error).toContain('password length should be atleast 3')

        const invalidUser3 = {
            username: 'te',
            name: 'test3',
            password: '12334'
        }

        const result3 = await api
            .post('/api/users')
            .send(invalidUser3)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result3.body.error).toContain('User validation failed: username: Path `username` (`te`) is shorter than the minimum allowed length (3).')

        const invalidUser4 = {
            name: 'test',
            password: '1234'
        }

        const result4 = await api
            .post('/api/users')
            .send(invalidUser4)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result4.body.error).toContain('User validation failed: username: Path `username` is required.')

        const userAtEnd = await helper.usersInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length)
    })
})

describe('Updating the user', () => {

    let token = null
    let userId = null
    beforeEach(async () => {
        await User.deleteMany({});
        const passwordHash = await bycrypt.hash('testuser', 10) 
        const user = new User({ username: 'testuser', name: 'testuser', password: passwordHash, email: 'testuser@gmail.com'})
        const savedUser = await user.save()

        const userToken = {
            username: 'testuser',
            id: savedUser._id
        }
        token = jwt.sign(userToken, process.env.SECRET)
        userId = savedUser._id.toString()
    }, 100000)

    test('should update user information', async () => {
        const response = await api
            .put('/api/users')
            .send({
            username: 'new_username',
            name: 'New Name',
            email: 'new.email@example.com',
            avatar: 'new_avatar_url',
            })
            .set({ Authorization: `bearer ${token}` })
            .expect(200)
    
        expect(response.body).toEqual({
            username: 'new_username',
            name: 'New Name',
            email: 'new.email@example.com',
            avatar: 'new_avatar_url',
            id: userId,
            notes: []
        })
    })

    test('should not update username if it is the same', async () => {

        await api
            .put('/api/users')
            .send({
                username: 'old_username',
                name: 'New Name',
                email: 'new.email@example.com',
                avatar: 'new_avatar_url',
            })
            .set({ Authorization: `bearer ${token}` })
            .expect(200)

        const response = await api
            .put('/api/users')
            .send({
                username: 'old_username', // Same as the current username
                name: 'New Name',
                email: 'new.email@example.com',
                avatar: 'new_avatar_url',
            })
            .expect(200)
            .set({ Authorization: `bearer ${token}` })
    
        expect(response.body).toEqual({
            username: 'old_username',
            name: 'New Name',
            email: 'new.email@example.com',
            avatar: 'new_avatar_url',
            notes: [],
            id: userId
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})