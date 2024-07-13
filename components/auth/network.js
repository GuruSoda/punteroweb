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

router.post('/refreshtoken', function (req, res, next) {
    dataToken = {}
    dataToken.accessToken = req.body.accessToken
    dataToken.refreshToken = req.body.refreshToken

    controller.refreshtoken(dataToken)
        .then((message) => response.success(req, res, dataToken, 201))
        .catch(next)
})

router.get('/dump', function (req, res, next) {
    controller.dump()
        .then((message) => response.success(req, res, message, 200))
        .catch (next)
})

router.delete('/deletealltokens', checkAuth('admin'), async function (req, res, next) {
    controller.deleteAllTokens()
        .then((message) => response.success(req, res, message, 200))
        .catch (next)
})

router.put('/changepassword', checkAuth('logged'), function (req, res, next) {
    dataUser = {}

    dataUser.oldpassword = req.body.oldpassword
    dataUser.newpassword = req.body.newpassword
    dataUser.userid = req.headers.tokenDecoded.sub

    controller.changepassword(dataUser)
        .then((message) => response.success(req, res, message, 201))
        .catch(next)
})

module.exports = router
