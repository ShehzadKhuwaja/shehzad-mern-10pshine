const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bycrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

describe('if login', () => {
    let userId = null
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bycrypt.hash('secret', 10)
        const user = new User({ username: 'root', passwordHash, email: 'root@gmail.com', name: 'root' })

        const savedUser = await user.save()
        userId = savedUser._id
    })

    test('should login successfully with correct credentials', async () => {
        const response = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'secret',
            })
            .expect(200)

    expect(response.body).toEqual({
        token: response.body.token,
        username: 'root',
        name: 'root',
        id: userId.toString(),
    })

    const decodedToken = jwt.verify(response.body.token, process.env.SECRET)
    expect(decodedToken).toMatchObject({
        id: userId.toString(),
        username: 'root'
    })
    })

    test('should fail login with incorrect credentials', async () => {
        const response = await api
            .post('/api/login')
            .send({
            username: 'root',
            password: 'wrongpassword',
            })
            .expect(401)

        expect(response.body).toEqual({
            error: 'invalid username or password',
        })
    })

    test('should fail login with non-existent user', async () => {
        const response = await api
            .post('/api/login')
            .send({
            username: 'nonexistentuser',
            password: 'password',
            })
            .expect(401)

        expect(response.body).toEqual({
            error: 'invalid username or password',
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})