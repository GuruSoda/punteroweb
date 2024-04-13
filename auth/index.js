const jwt = require('jsonwebtoken')
const config = require('../config')

function sign (data) {
    return jwt.sign(data, config.jwt.secret, { expiresIn: config.jwt.ageAcces })
}

function signRefreshToken (data) {
    return jwt.sign(data, config.jwt.secret, { expiresIn: config.jwt.ageRefresh })
}

function verify(token) {
    return jwt.verify(token, config.jwt.secret)
}

module.exports = {
    sign,
    signRefreshToken,
    verify
}
