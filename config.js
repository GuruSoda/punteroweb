const dotenv = require('dotenv')

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

module.exports = singletonConfig.getInstance()
