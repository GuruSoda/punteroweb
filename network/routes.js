const express = require('express');
const routes = express.Router();

const user = require('../components/user/network')
const file = require('../components/punteroweb/network')
const auth = require('../components/auth/network')

routes.use('/users', user)
routes.use('/pointers', file)
routes.use('/auth', auth)

module.exports = routes
