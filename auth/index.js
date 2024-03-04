const jwt = require('jsonwebtoken')

function sign (data) {
    return jwt.sign(data, 'elsecreto')
}

module.exports = {
    sign
}
