const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')
const { checkAuth } = require('../../network/security')

router.get('/dump', function(req, res, next) {
    controller.dump()
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
})

router.get('/', checkAuth('admin'), function(req, res) {
    controller.getall()
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e.userMessage, 500, {code: e.code, message: e.message})
        })
})

router.get('/:userid', checkAuth('admin'), function(req, res) {
    controller.getUser(req.params.userid)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e.userMessage, 500, {code: e.code, message: e.message})
        })
})

router.put('/:userid', checkAuth('admin'), function(req, res) {
    dataUser = {}

    dataUser.userid = req.params.userid
    dataUser.username = req.body.username
    dataUser.name = req.body.name
    dataUser.lastname = req.body.lastname
    dataUser.email = req.body.email
    dataUser.roles = req.body.roles

    controller.updateUser(dataUser)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e.userMessage, 500, {code: e.code, message: e.message})
        })
})

router.delete('/:userid', checkAuth('admin'), function(req, res) {
    controller.deleteUser(req.params.userid)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e.userMessage, 500, {code: e.code, message: e.message})
        })
})

router.delete('/:userid', async function(req, res) {
    try {
        await controller.debug()
        response.success(req, res, 'Todo Bien!', 201)
    } catch (e) {
        response.error(req, res, e.userMessage, 401, {code: e.code, message: e.message})
    }
})

module.exports = router
