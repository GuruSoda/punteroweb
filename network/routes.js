const express = require('express');
const routes = express.Router();

const file = require('../components/punteroweb/network')
const user = require('../components/user/network')
const auth = require('../components/auth/network')

routes.use('/pointers', file)
routes.use('/users', user)
routes.use('/auth', auth)

module.exports = routes
