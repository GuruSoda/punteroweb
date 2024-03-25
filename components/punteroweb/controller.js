const config = require('../../config')
const store = require('./store')
const utilsweb = require('./utilsweb')
const nanoid = require('nanoid').customAlphabet(config.model.alphabetIDURL, config.model.lengthIDURL)

function addURL(dataPuntero) {
    return new Promise((resolve, reject) => {
        if (!dataPuntero.url) return reject('Invalid parameters (url cannot be empty)')

        dataPuntero.url = dataPuntero.url.toLowerCase().trim()

//        const urltest = new URL(dataPuntero.url)
//        if (!urltest.protocol) reject('URL must be have a protocol (http, https, etc...)')

        dataPuntero.id = nanoid()

        try {
            store.add(dataPuntero)
            resolve(dataPuntero.id)
        } catch (e) {
            reject(e)
        }
    })
}

function infoURL(id) {
    return new Promise((resolve, reject) => {
        try {
            store.info(id)
            resolve(message)
        } catch (e) {
            reject(e)
        }
    })
}

function deleteURL(id) {
    return new Promise((resolve, reject) => {
        if (!url) return reject('Invalid parameters (id cannot be empty)')

        try {
            store.delete(id)
            resolve(message)
        } catch (e) {
            reject(e)
        }
    })
}

function listURLs(count, page) {
    return new Promise((resolve, reject) => {

        count = count || 100
        page = page || 1

        try {
            store.list(count, page)
            resolve(message)
        } catch (e) {
            reject(e)
        }
    })
}

function countURLs() {
    return new Promise((resolve, reject) => {
        try {
            store.count()
            resolve(message)
        } catch (e) {
            reject(e)
        }
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
