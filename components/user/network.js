const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')

router.get('/id/:id', function(req, res) {
})

router.delete('/id/:id', function(req, res) {
})

router.get('/list', function(req, res) {
    controller.getall()
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e, 500, e)
        })
})

module.exports = router
