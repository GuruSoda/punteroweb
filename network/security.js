const auth = require('../auth')
const authController = require('../components/auth/controller')

function checkAuth(action) {
    function middleware(req, res, next) {
        switch(action) {
            case 'admin':
                if (!req.headers['tokenDecoded']) {
                    next({message: 'not authorized', status: 401, details: { message: 'No tiene el header authorization o tokenDecoded', code: 401}})
                    break
                }
                
                if (req.headers.tokenDecoded.roles.indexOf("admin") === -1) {
                    next({message: 'not authorized', status: 403, details: { message: "userid " + req.headers.tokenDecoded.sub + ' NO es administrador', code: 403}})
                    break;
                }

                next()
                break;
            case 'logged':
                if (!req.headers['tokenDecoded']) {
                    next({message: 'not authorized', code: 401, details: {message:'No tiene el header authorization o tokenDecoded', code: 401}})
                    break
                }
                next()
                break
            default:
                next();
        }
    }

    return middleware;
}

function getToken(req) {
    return req.headers.authorization.replace('Bearer', '').trim()
}

function decodeToken () {
    return async function middleware(req, res, next) {
        const authorization = req.headers.authorization || undefined

        try {
            if (!authorization) return next()

            let tokens = await authController.getTokens(getToken(req))

            if (!tokens) return next({message: 'not authorized', status: 401, details: {message:'No existe el token', code: 401}})

            req.headers.tokenDecoded = auth.verify(tokens.access)

            next()
        } catch(err) {
            next({message: 'not authorized', status: 401, details: {message:'fallo la verificacion del token (' + authorization + ') - ' + err.message, code: 401}})
        }
    }
}

module.exports = {
    checkAuth,
    decodeToken,
    getToken
}
