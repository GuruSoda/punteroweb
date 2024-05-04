const config = require('../../config')
const store = require('./store')

function add(dataTracking) {
    return new Promise((resolve, reject) => {
        if (!dataTracking.url) return reject({message: 'Invalid parameters (url cannot be empty)', status: 400})

        dataTracking.url = dataTracking.url.toLowerCase().trim()
        dataTracking.title = dataTracking.title.trim()

        try {
            store.add(dataTracking)
            resolve('ok')
        } catch (e) {
            reject({
                message: 'Error al agregar Tracking',
                status: 500,
                details: e
            })
        }
    })
}

function get(conf) {
    return new Promise((resolve, reject) => {

        try {
            const records = store.get(conf.userid)
            resolve(records)
        } catch (e) {
            reject({
                message: 'Error al agregar Tracking',
                status: 500,
                details: e
            })
        }
    })
}

module.exports = {
    add: add,
    get: get
}
