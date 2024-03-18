const dotenv = require('dotenv')
dotenv.config()

const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    jwt: {
        secret: process.env.SECRETJWT || 'sssssh-silencio',
    },
    database: {
        filedb: process.env.FILEDB  || './database/punteroweb.sqlite',
    },
    model: {
        alphabetIDUser: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        alphabetIDURL: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        lengthIDUser: 21,
        lengthIDURL: 30
    }
}

module.exports = config

// en desuso
/*
function loadConfig() {
    dotenv.config()

    return {
        port: process.env.PORT || 65550,
        filedb: process.env.FILEDB  || ':memory:'
    }
}

const singletonConfig = (function () {

    let instance

    return {
        getInstance: function() {
            if (instance == null) {
                instance = loadConfig
            }

            return instance()
        }
    }
})()
*/
