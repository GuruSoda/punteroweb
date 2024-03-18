function userError (message, code) {

    let new_error = new Error()

    new_error.message = message || 'NoMessage'
    new_error.code = code || 'NoCode'

    return new_error
}

module.exports = userError
