const config = require('../../config')
const store = require('./store')
const utilsweb = require('./utilsweb')
const nanoid = require('nanoid').customAlphabet(config.model.alphabetIDURL, config.model.lengthIDURL)

function addPointer(dataPuntero) {
    return new Promise((resolve, reject) => {
        if (!dataPuntero.url) return reject({userMessage: 'Invalid parameters (url cannot be empty)'})

        dataPuntero.url = dataPuntero.url.toLowerCase().trim()

        if (store.getPointerByURL(dataPuntero.url)) return reject({userMessage: 'URL Exists'})

//        const urltest = new URL(dataPuntero.url)
//        if (!urltest.protocol) reject('URL must be have a protocol (http, https, etc...)')

        dataPuntero.id = nanoid()

        try {
            store.add(dataPuntero)
            resolve({id: dataPuntero.id})
        } catch (e) {
            e.userMessage = 'Error al agregar Pointer'            
            reject(e)
        }
    })
}

function modifyPointer (dataPointer) {
    return new Promise((resolve, reject) => {
        try {
            let data = store.info(dataPointer.id)            
            if (!data || (data.userid !== dataPointer.userid)) return reject({userMessage: 'Pointer not found'})

            // si NO existe el llave "x" en el put, le asigno el valor que esta en la base de datos.
            if (!dataPointer.url)           dataPointer.url = data.url
            if (!dataPointer.stars)         dataPointer.stars = data.stars
            if (!dataPointer.title)         dataPointer.title = data.title
            if (!dataPointer.description)   dataPointer.description = data.description
            if (!dataPointer.directory)     dataPointer.directory = data.directory
            if (!dataPointer.labels)        dataPointer.labels = store.labels(dataPointer.id)

            data = store.modify(dataPointer)
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}

function infoPointer(id) {
    return new Promise((resolve, reject) => {
        try {
            resolve(store.info(id))
        } catch (e) {
            reject(e)
        }
    })
}

function deletePointer(id, userid) {
    return new Promise((resolve, reject) => {
        if (!id) return reject({userMessage: 'Invalid parameters (id cannot be empty)'})
        if (!userid) return reject({userMessage: 'Invalid parameters (userid cannot be empty)'})

        try {
            resolve(store.delete(id, userid))
        } catch (e) {
            reject(e)
        }
    })
}

function listPointers(userid, count, page) {
    return new Promise((resolve, reject) => {

        count = count || 100
        page = page || 1

        try {
            resolve(store.list(userid, count, page))
        } catch (e) {
            reject(e)
        }
    })
}

function countPointers() {
    return new Promise((resolve, reject) => {
        try {
            resolve(store.count())
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

function listLabels(userid) {
    return new Promise((resolve, reject) => {
        try {
            resolve(store.listLabels(userid))
        } catch (e) {
            reject(e)
        }
    })
}

function getPointerByURL (url) {
    return new Promise((resolve, reject) => {
        if (!url) return reject({userMessage: 'Invalid parameters (url cannot be empty)'})
        try {
            resolve(store.getPointerByURL(url))
        } catch (e) {
            reject(e)
        }
    })
}

function dump() {
    return new Promise((resolve, reject) => {
        store.dump()
        resolve()
    })    
}

module.exports = {
    add: addPointer,
    delete: deletePointer,
    modify: modifyPointer,
    list: listPointers,
    count: countPointers,
    info: infoPointer,
    gettitle: titleURL,
    listLabels,
    getPointerByURL,
    dump
}
