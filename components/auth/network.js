const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')
const { getToken, checkAuth} = require('../../network/security')

router.post('/login', function(req, res, next) {
    dataUser = {}

    dataUser.email = req.body.email
    dataUser.username = req.body.username
    dataUser.password = req.body.password

    controller.login(dataUser)
        .then((message) => response.success(req, res, message, 200))
        .catch(next)
})

router.get('/logout', checkAuth('logged'), function(req, res, next) {
    controller.logout(getToken(req))
        .then((message) => response.success(req, res, message, 200))
        .catch(e => response.error(req, res, e.message, 500, {code: e.details.code, message: e.details.message}))
})

router.post('/register', function(req, res, next) {
    dataUser = {}

    dataUser.username = req.body.username
    dataUser.email = req.body.email
    dataUser.name = req.body.name
    dataUser.lastname = req.body.lastname
    dataUser.password = req.body.password

    controller.register(dataUser)
        .then((message) => response.success(req, res, message, 201))
        .catch(next)
})

router.post('/refreshtoken', async function (req, res, next) {
    dataToken = {}
    dataToken.refreshToken = req.body.refreshToken

    try {
        let tokens = await controller.refreshtoken(dataToken)
        response.success(req, res, tokens, 201)
    } catch (e) {
        response.error(req, res, e.message, 401, {code: e.details.code, message: e.details.message})
    }
})

router.get('/dump', async function (req, res, next) {
    try {
        const message = await controller.dump()
        response.success(req, res, message, 201)
    } catch (e) {
        response.error(req, res, e.message, 401, {code: e.details.code, message: e.details.message})
    }
})

router.delete('/deletealltokens', checkAuth('admin'), async function (req, res, next) {
    try {
        const message = await controller.deleteAllTokens()
        response.success(req, res, message, 201)
    } catch (e) {
        response.error(req, res, message, 401, {code: e.code, message: e.message})
    }
})

router.put('/changepassword', checkAuth('logged'), function (req, res, next) {

    dataUser = {}

    dataUser.oldpassword = req.body.oldpassword
    dataUser.newpassword = req.body.newpassword
    dataUser.userid = req.headers.tokenDecoded.sub

    controller.changepassword(dataUser)
        .then((message) => response.success(req, res, message, 200))
        .catch(next)
})

module.exports = router
