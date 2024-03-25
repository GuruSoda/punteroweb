const express = require('express')
const router = express.Router()
const controller = require('./controller')
const response = require('../../network/response')

router.get('/list', async function(req, res) {
    controller.list(req.query.count, req.query.page)
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
            response.success(req, res, message, 200)
        })
        .catch(e => {
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
    controller.modify(req.params.id)
        .then((message) => {
            response.success(req, res, message, 200)
        })
        .catch(e => {
            if (e.error) response.error(req, res, 'Error tomando info', 500, e)
            else response.error(req, res, 'URL not found', 404, e)
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
