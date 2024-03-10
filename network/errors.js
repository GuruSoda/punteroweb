const response = require('./response')

function errors(error, req, res, next) {

    const message = error.message || 'unknow message.'
    const status = error.status || 500
    const details = error.details || ''

    response.error(req, res, message, status, details)
}

module.exports = errors
