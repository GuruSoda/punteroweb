const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')

router.post('/login', function(req, res) {
    dataUser = {}

    dataUser.email = req.body.email
    dataUser.username = req.body.username
    dataUser.password = req.body.password

    controller.login(dataUser)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e.userMessage, 400, {code: e.code, message: e.message})
        })
})

router.post('/logout', function(req, res) {
    controller.logout()
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e.userMessage, 500, {code: e.code, message: e.message})
        })
})

router.post('/register', function(req, res) {
    dataUser = {}

    dataUser.username = req.body.username
    dataUser.email = req.body.email
    dataUser.name = req.body.name
    dataUser.lastname = req.body.lastname
    dataUser.password = req.body.password

    controller.register(dataUser)
        .then((message) => {
            response.success(req, res, message, 201)
        })
        .catch(e => {
            response.error(req, res, e.userMessage, 400, {code: e.code, message: e.message})
        })
})

module.exports = router
