const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const middleware = require('../utils/middleware')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes', {title: 1, description: 1})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const {username, name, password, email, avatar} = request.body

    if (!(password && password.length >= 3)) {
        const message = !password ? "password is missing" : "password length should be atleast 3"
        return response.status(400).json({ error: message })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        email,
        name,
        passwordHash,
        avatar: avatar || null
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.put('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user
    const { username, name, email, avatar } = req.body

    if (username != null && username !== user.username) {
        user.username = username
    }
    if (name != null) {
        user.name = name
    }
    if (email != null) {
        user.email = email
    }
    if (avatar != null) {
        user.avatar = avatar
    }

    const updatedUser = await user.save()
    response.json(updatedUser)
})


module.exports = usersRouter