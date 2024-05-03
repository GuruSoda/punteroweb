const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')
const { checkAuth } = require('../../network/security')

router.post('/', function(req, res, next) {
    const dataTracking = {
//        userid: req.headers.tokenDecoded.sub || 'NvaAurS59bYDIIWDx1pS7',
        userid: 'NvaAurS59bYDIIWDx1pS7',
        url: req.body.url,
        title: req.body.title,
    }

    controller.add(dataTracking)
        .then((message) => {
            response.success(req, res, message, 201)
        })
        .catch(next)
})

router.get('/', function(req, res, next) {

    const userid = 'NvaAurS59bYDIIWDx1pS7'
    controller.get(userid)
        .then((message) => {
            response.success(req, res, message, 201)
        })
        .catch(next)
})

module.exports = router
