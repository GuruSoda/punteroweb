const jwt = require('jsonwebtoken')
const config = require('../config')

function sign (data) {
    return jwt.sign(data, config.jwt.secret, { expiresIn: '1d' })
}

function signRefreshToken (data) {
    return jwt.sign(data, config.jwt.secret, { expiresIn: '1y' })
}

function verify(token) {
    return jwt.verify(token, config.jwt.secret)
}

module.exports = {
    sign,
    signRefreshToken,
    verify
}
