const config = require('../../config')
const store = require('./store')
const utilsweb = require('./utilsweb')
const nanoid = require('nanoid').customAlphabet(config.model.alphabetIDURL, config.model.lengthIDURL)

function addURL(dataPuntero) {
    return new Promise((resolve, reject) => {
        if (!dataPuntero.url) {
            reject('Invalid parameters (url cannot be empty)')
            return
        }

        dataPuntero.url = dataPuntero.url.toLowerCase().trim()

        const urltest = new URL(dataPuntero.url)

        if (!urltest.protocol) reject('URL must be have a protocol (http, https, etc...)')

        dataPuntero.urlid = nanoid()

        store.add(dataPuntero)
            .then(message => resolve(message))
            .catch(message => {
                if (message.code === 'SQLITE_CONSTRAINT_UNIQUE') reject('URL Existe.')
                else reject(message)
            })
    })
}

function infoURL(url) {
    return new Promise((resolve, reject) => {
        url = url.toLowerCase().trim()
        store.info(url)
            .then(message => { resolve(message) })
            .catch(message => { reject(message) })
    })
}

function deleteURL(url) {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject('Invalid parameters (url cannot be empty)')
            return
        }

        url = url.toLowerCase().trim()

        const urltest = new URL(url)

        if (!urltest.protocol) reject('URL must be have a protocol (http, https, etc...)')

        store.delete(url)
            .then(message => resolve(message))
            .catch(message => {
                if (message.code === 'SQLITE_CONSTRAINT_UNIQUE') reject('URL Existe.')
                else reject(message)
            })
    })
}

function listURLs(count, page) {
    return new Promise((resolve, reject) => {

        count = count || 100
        page = page || 1

        store.list(count, page)
            .then(message => resolve(message))
            .catch(message => reject(message))
    })
}

function countURLs() {
    return new Promise((resolve, reject) => {
        store.count()
            .then(message => resolve(message))
            .catch(message => reject(message))
    })
}

function titleURL(url) {
    return new Promise((resolve, reject) => {

        const urltest = new URL(url)

        if (!urltest.protocol) url = "https://" + url

        try {
            const titulo = utilsweb.title(url)
            resolve(titulo)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    add: addURL,
    list: listURLs,
    count: countURLs,
    info: infoURL,
    gettitle: titleURL,
    delete: deleteURL
}
