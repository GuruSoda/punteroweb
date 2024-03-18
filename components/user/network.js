const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')
const { checkAuth } = require('../../network/security')

router.get('/info/:userid', checkAuth('admin'), function(req, res) {
    controller.getUser(req.params.userid)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e, 500, e)
        })
})

router.put('/update/:userid', checkAuth('admin'), function(req, res) {
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
            response.error(req, res, e, 500, e)
        })
})

router.delete('/delete/:userid', checkAuth('admin'), function(req, res) {
    controller.deleteUser(req.params.userid)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e, 500, e)
        })
})

router.get('/list', checkAuth('admin'), function(req, res) {
    controller.getall()
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e, 500, e)
        })
})

router.post('/roletouser', checkAuth('admin'), function(req, res) {

    dataUser.username = req.body.username
    dataUser.role = req.body.role

    controller.roleToUser()
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e, 500, e)
        })
})

module.exports = router
