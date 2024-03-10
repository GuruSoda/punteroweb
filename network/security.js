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
                        throw error('not authorized', 401, 'NO es administrador')                            
                    }
                }
                throw error('not authorized', 401, 'No tiene el header authorization o tokenDecoded')
                break;
            case 'logged':
                if (req.headers['authorization'] !== undefined && req.headers['tokenDecoded'] !== undefined) {
                    next()
                    break
                }
                throw error('not authorized', 401, 'No tiene el header authorization o tokenDecoded')
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

        try {
            if (authorization) req.headers.tokenDecoded = auth.verify(authorization.replace('Bearer ', ''))
        } catch(err) {
            throw error('Not Authorized', 401, 'fallo la verificacion del token (' + authorization + ') - ' + err.message)
        }
        next()
    }
}

module.exports = {
    checkAuth,
    decodeToken,
}