const express = require('express');
const routes = express.Router();

const user = require('../components/user/network')
const file = require('../components/punteroweb/network')
const auth = require('../components/auth/network')
const track = require('../components/track/network')

routes.use('/users', user)
routes.use('/pointers', file)
routes.use('/auth', auth)
routes.use('/tracking', track)

module.exports = routes
