const auth = require('../auth')
const error = require('../utils/error')

function checkAuth(action) {
    function middleware(req, res, next) {
        switch(action) {
            case 'admin':
                if (req.headers['authorization'] !== undefined && req.headers['tokenDecoded'] !== undefined) {
                    if (req.headers.tokenDecoded.roles.indexOf("admin") > -1) {
                        next()
                        break
                    } else {
                        throw error('not authorized', 401, {message: "userid " + req.headers.tokenDecoded.userid + ' NO es administrador'})
                    }
                }
                throw error('not authorized', 401, {message: 'No tiene el header authorization o tokenDecoded'})
                break;
            case 'logged':
                if (req.headers['authorization'] !== undefined && req.headers['tokenDecoded'] !== undefined) {
                    next()
                    break
                }
                throw error('not authorized', 401, {message:'No tiene el header authorization o tokenDecoded'})
                break
            default:
                next();
        }
    }

    return middleware;
}

function decodeToken () {
    return function middleware(req, res, next) {
        const authorization = req.headers.authorization || undefined

        // puede venir la palabra Bearer sola
        let token = ''

        if (authorization)
            token = authorization.replace('Bearer', '').trim()

        try {
            if (token) req.headers.tokenDecoded = auth.verify(token)
        } catch(err) {
            throw error('Not Authorized', 401, {message: 'fallo la verificacion del token (' + authorization + ') - ' + err.message})
        }
        next()
    }
}

module.exports = {
    checkAuth,
    decodeToken,
}
