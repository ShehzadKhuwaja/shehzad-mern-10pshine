const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const middleware = require('../utils/middleware')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes', {title: 1, description: 1})
    response.json(users)
})

usersRouter.get('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const id = request.params.id
    const user = request.user

    if (id === user._id.toString()) {
        return response.status(200).json(user)
    }

    return response.status(403).json()
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
    const { username, name, email, avatar } = request.body

    if (username && username !== user.username) {
        user.username = username
    }
    if (name) {
        user.name = name
    }
    if (email) {
        user.email = email
    }
    if (avatar) {
        user.avatar = avatar
    }

    const updatedUser = await user.save()
    response.json(updatedUser)
})

usersRouter.post('/forgot-password', async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'User not found' })

    const token = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'danial.merchant@nixorcollege.edu.pk',
        pass: 'zubquuzctm',
      },
    })

    const mailOptions = {
      to: user.email,
      from: 'danial.merchant@nixorcollege.edu.pk',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset-password/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    }

    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Password reset email sent' })
})

usersRouter.post('/reset-password/:token', async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
    })
    if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired' })
    
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
})


module.exports = usersRouter