const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')
const { checkAuth } = require('../../network/security')

router.get('/', checkAuth('logged'), function(req, res, next) {
    const { count, page } = req.query
    const userid = req.headers.tokenDecoded.sub

    controller.list(userid, count, page)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
});

router.get('/labels', checkAuth('logged'), function(req, res, next) {
    const userid = req.headers.tokenDecoded.sub

    controller.listLabels(userid)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
});

router.get('/count', checkAuth('logged'), function(req, res, next) {
    const userid = req.headers.tokenDecoded.sub
    controller.count(userid)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
});

router.get('/title', checkAuth('logged'), function(req, res, next) {
    controller.gettitle(req.query.url)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
});

router.get('/pointer', function(req, res, next) {
    controller.getPointerByURL(req.query.url)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
});

router.get('/dump', checkAuth('admin'), function(req, res, next) {
    controller.dump()
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
});

router.post('/', checkAuth('logged'), function(req, res, next) {

    const dataPuntero = {
        userid: req.headers.tokenDecoded.sub,
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        stars: req.body.stars,
        labels: req.body.labels
    }

    controller.add(dataPuntero)
        .then((message) => {
            response.success(req, res, message, 201)
        })
        .catch(next)
})

router.get('/:id', checkAuth('logged'), function(req, res, next) {
    controller.info(req.params.id, req.headers.tokenDecoded.sub)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
});

router.put('/:id', checkAuth('logged'), function(req, res, next) {

    dataPointer = {}

    dataPointer.id = req.params.id
    dataPointer.userid = req.headers.tokenDecoded.sub
    dataPointer.url = req.body.url
    dataPointer.title = req.body.title
    dataPointer.description = req.body.description
    dataPointer.stars = req.body.stars
    dataPointer.directory = req.body.directory
    dataPointer.labels = req.body.labels

    controller.modify(dataPointer)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
});

router.delete('/:id', checkAuth('logged'), function(req, res, next) {
    controller.delete(req.params.id, req.headers.tokenDecoded.sub)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(next)
});

module.exports = router
