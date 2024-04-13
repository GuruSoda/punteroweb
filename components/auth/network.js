const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')
const { getToken, checkAuth} = require('../../network/security')

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

router.get('/logout', checkAuth('logged'), function(req, res) {

    controller.logout(getToken(req))
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

router.post('/refreshtoken', async function (req, res) {
    dataToken = {}
    dataToken.refreshToken = req.body.refreshToken

    try {
        let tokens = await controller.refreshtoken(dataToken)
        response.success(req, res, tokens, 201)
    } catch (e) {
        response.error(req, res, e.userMessage, 401, {code: e.code, message: e.message})
    }
})

router.get('/dump', checkAuth('logged'), async function (req, res) {
    try {
        await controller.dump()
        response.success(req, res, 'Todo Bien!', 201)
    } catch (e) {
        response.error(req, res, e.userMessage, 401, {code: e.code, message: e.message})

    }
})

router.delete('/deletealltokens', checkAuth('admin'), async function (req, res) {
    try {
        await controller.deleteAllTokens()
        response.success(req, res, 'Todo Bien!', 201)
    } catch (e) {
        response.error(req, res, e.userMessage, 401, {code: e.code, message: e.message})

    }
})

module.exports = router
