const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')
const { checkAuth } = require('../../network/security')

router.put('/modify/:id', checkAuth('admin'), function(req, res) {
})

router.delete('/delete/:userid', checkAuth('admin'), function(req, res) {
    controller.deleteUser(req.params.userid)
        .then((message) => {
            response.success(req, res, message, 201)
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

module.exports = router
