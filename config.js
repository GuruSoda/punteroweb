const dotenv = require('dotenv')
dotenv.config()

const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    jwt: {
        secret: process.env.SECRETJWT || 'sssssh-silencio',
        ageAcces: process.env.AGEACCESSJWT || '1d',
        ageRefresh: process.env.AGEREFRESHJWT || '30d',
    },
    database: {
        pointerdb: process.env.POINTERDB || './database/pointerweb.sqlite',
        trackingdb: process.env.TRACKDB || './database/tracking.sqlite',
    },
    cache: {
        labels: process.env.CACHELABELS || true,
        tokens: process.env.CACHETOKENS || true,
    },
    model: {
        alphabetIDUser: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        alphabetIDURL: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        lengthIDUser: 21,
        lengthIDURL: 30
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
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
