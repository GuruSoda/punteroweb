const express = require('express');
const routes = express.Router();

const file = require('../components/punteroweb/network')

routes.use('/pw', file)

module.exports = routes
