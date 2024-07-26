const noteRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const middleware = require('../utils/middleware')


noteRouter.get('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const user = request.user

  const notes = await Note.find({ user: user._id }).populate('user', { username: 1, name: 1, email: 1 })
  response.json(notes)
})

noteRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const newNote = new Note({
    title: body.title,
    description: body.description,
    user: user.id,
  })

  if (!newNote.title) {
    return response.status(400).end()
  }

  const savedNote = await newNote.save()

  await savedNote.populate('user', { username: 1, name: 1 })
  user.notes = user.notes.concat(savedNote._id) 
  await user.save()

  response.status(201).json(savedNote)
})

noteRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const note = await Note.findById(request.params.id)
  const user = request.user

  if (note.user.toString() === user._id.toString()) {
    await Note.findByIdAndDelete(request.params.id)
    user.notes = user.notes.filter(id => id.toString() !== request.params.id)
    await user.save()
    return response.status(204).end()
  }
  else {
    return response.status(401).json({ error: 'token invalid' })
  } 
})

noteRouter.put('/:id', async (request, response) => {
  const body = request.body

  const note = {
    title: body.title,
    description: body.description
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  await updatedNote.populate('user', { username: 1, name: 1 })
  response.json(updatedNote)
})


module.exports = noteRouter