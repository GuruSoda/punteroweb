function error (userMessage, statusCode, errorDetails) {

    let new_error = new Error()

    new_error.message = userMessage || 'Unknow Error'
    new_error.status = statusCode || -1
    new_error.details = errorDetails || ''

    return new_error
}

module.exports = error
