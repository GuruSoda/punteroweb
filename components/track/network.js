const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')
const { checkAuth } = require('../../network/security')

router.post('/', checkAuth('logged'), function(req, res, next) {
    const dataTracking = {
        userid: req.headers.tokenDecoded.sub,
        url: req.body.url,
        title: req.body.title,
    }

    controller.add(dataTracking)
        .then((message) => {
            response.success(req, res, message, 201)
        })
        .catch(next)
})

router.get('/', checkAuth('logged'), function(req, res, next) {
    const userid = req.headers.tokenDecoded.sub
    controller.get(userid)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
})

module.exports = router
