const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const config = require('./config')
const db = require('./db')

db.conectar(config.filedb)

const routes = require('./network/routes')

const app = express()

app.use(cors())
// solo loggea si la variable de entorno NODE_ENV es PRODUCTION
app.use(logger('dev', { skip: (req, res) => process.env.NODE_ENV === 'PRODUCTION' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.set('etag', false)
app.disable('x-powered-by')
app.use(express.static('public'))

app.use(routes)

module.exports = app
