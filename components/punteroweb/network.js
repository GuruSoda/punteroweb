const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')
const { checkAuth } = require('../../network/security')
const userController = require('../user/controller')

router.get('/', checkAuth('logged'), async function(req, res) {
    const { count, page } = req.query
    const userid = req.headers.tokenDecoded.sub

    controller.list(userid, count, page)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error listando Punteros', 500, e)
        })
});

router.get('/labels', checkAuth('logged'), async function(req, res) {
    const userid = req.headers.tokenDecoded.sub

    controller.listLabels(userid)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error listando Punteros', 500, e)
        })
});

router.get('/count', checkAuth('logged'), async function(req, res) {
    controller.count()
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error contando Punteros', 500, e)
        })
});

router.get('/title', checkAuth('logged'), async function(req, res) {
    controller.gettitle(req.query.url)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e, 500, e)
        })
});

router.get('/pointer', async function(req, res) {
    controller.getPointerByURL(req.query.url)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, e, 500, e)
        })
});

router.get('/dump', checkAuth('admin'), async function(req, res) {
    try {
        response.success(req, res, await controller.dump(), 200)
    } catch (e) {
        response.error(req, res, e.userMessage, 500, {code: e.code, message: e.message})
    }
});

router.post('/', checkAuth('logged'), function(req, res) {

    const dataPuntero = {
        userid: req.headers.tokenDecoded.sub,
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        starts: req.body.starts,
        labels: req.body.labels
    }

    controller.add(dataPuntero)
        .then((message) => {
            response.success(req, res, message, 201)
        })
        .catch(e => {
            response.error(req, res, e.userMessage, 500, {code: e.code, message: e.message})
        })
})

router.get('/:id', checkAuth('logged'), async function(req, res) {
    controller.info(req.params.id)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            if (e.error) response.error(req, res, 'Error tomando info', 500, e)
            else response.error(req, res, 'URL not found', 404, e)
        })
});

router.put('/:id', checkAuth('logged'), async function(req, res) {

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
        .catch(e => {
            response.error(req, res, e.userMessage, 400, {code: e.code, message: e.message})
        })
});

router.delete('/:id', checkAuth('logged'), async function(req, res) {
    controller.delete(req.params.id, req.headers.tokenDecoded.sub)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            if (e.error) response.error(req, res, 'Error borrando puntero', 500, e)
            else response.error(req, res, 'Puntero not found', 404, e)
        })
});

module.exports = router
