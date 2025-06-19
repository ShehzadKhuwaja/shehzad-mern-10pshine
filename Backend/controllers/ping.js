const pingRouter = require('express').Router()

pingRouter.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});


module.exports = pingRouter