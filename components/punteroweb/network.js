const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')

router.get('/', async function(req, res) {
    const { count, page } = req.query

    controller.list(count, page)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error listando Punteros', 500, e)
        })
});

router.get('/labels', async function(req, res) {
    controller.listLabels()
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error listando Punteros', 500, e)
        })
});

router.get('/count', async function(req, res) {
    controller.count()
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error contando Punteros', 500, e)
        })
});

router.get('/title', async function(req, res) {
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

router.post('/', function(req, res) {

    const dataPuntero = {
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
            e.userMessage = "Error agregando puntero"
            response.error(req, res, e, 500, e)
        })
})

router.get('/:id', async function(req, res) {
    controller.info(req.params.id)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            if (e.error) response.error(req, res, 'Error tomando info', 500, e)
            else response.error(req, res, 'URL not found', 404, e)
        })
});

router.put('/:id', async function(req, res) {

    dataPointer = {}

    dataPointer.id = req.params.id
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

router.delete('/:id', async function(req, res) {
    controller.delete(req.params.id)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            if (e.error) response.error(req, res, 'Error borrando puntero', 500, e)
            else response.error(req, res, 'Puntero not found', 404, e)
        })
});

module.exports = router
