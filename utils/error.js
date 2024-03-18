function error (message, status, details) {

    let new_error = new Error()

    new_error.message = message || 'unknow error'
    new_error.status = status || 500
    new_error.details = details || ''

    return new_error
}

function serviceError (message, code, details) {

    let new_error = new Error()

    new_error.message = message || 'unknow error'
    new_error.code = code || '000'
    new_error.details = details || ''

    return new_error
}

module.exports = error
