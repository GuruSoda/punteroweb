const config = require('../../config')
const store = require('./store')
const utilsweb = require('./utilsweb')
const nanoid = require('nanoid').customAlphabet(config.model.alphabetIDURL, config.model.lengthIDURL)

function addPointer(dataPuntero) {
    return new Promise((resolve, reject) => {
        if (!dataPuntero.url) return reject({message: 'Invalid parameters (url cannot be empty)', status: 400})

        dataPuntero.url = dataPuntero.url.toLowerCase().trim()

        if (store.getPointerByURL(dataPuntero.url, dataPuntero.userid)) return reject({message: 'URL Exists', status: 400, details: {message: `Ya existe la URL ${dataPuntero.url}`}})

//        const urltest = new URL(dataPuntero.url)
//        if (!urltest.protocol) reject('URL must be have a protocol (http, https, etc...)')

        dataPuntero.id = nanoid()

        try {
            store.add(dataPuntero)
            resolve({id: dataPuntero.id})
        } catch (e) {
            reject({
                message: 'Error al agregar Puntero',
                status: 500,
                details: e
            })
        }
    })
}

function modifyPointer (dataPointer) {
    return new Promise((resolve, reject) => {
        try {
            let data = store.info(dataPointer.id, dataPointer.userid)
            if (!data) return reject({message: 'Pointer not found', statu: 400})

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
            reject({
                message: 'Error al modificar puntero',
                details: e
            })
        }
    })
}

function infoPointer(id, userid) {
    return new Promise((resolve, reject) => {
        try {
            const pointer = store.info(id, userid)
            return (pointer) ? resolve(pointer) : reject({message: 'Pointer not found', statu: 400})
        } catch (e) {
            reject({
                message: 'Error obteniendo puntero',
                details: e
            })
        }
    })
}

function deletePointer(id, userid) {
    return new Promise((resolve, reject) => {
        if (!id) return reject({message: 'Invalid parameters (id cannot be empty)', status: 400})
        if (!userid) return reject({message: 'Invalid parameters (userid cannot be empty)', status: 400})

        try {
            if (store.delete(id, userid)) resolve('Puntero Borrado')
            else reject({message: 'Puntero NO Encontrado', status: 400})
        } catch (e) {
            reject({
                message: 'Error borrando puntero',
                details: e
            })
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
            reject({
                message: 'Error listando punteros',
                details: e
            })
        }
    })
}

function countPointers(userid) {
    return new Promise((resolve, reject) => {
        try {
            const countPointers = store.count(userid)
            const countLabels = store.countLabels(userid)

            resolve({pointers: countPointers, labels: countLabels})
        } catch (e) {
            reject({
                message: 'Error contando punteros',
                details: e
            })
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
            reject({
                message: 'Error solicitando titulo de URL',
                details: e
            })
        }
    })
}

function listLabels(userid) {
    return new Promise((resolve, reject) => {
        try {
            resolve(store.listLabels(userid))
        } catch (e) {
            reject({
                message: 'Error listando etiquetas',
                details: e
            })
        }
    })
}

function getPointerByURL (url, userid) {
    return new Promise((resolve, reject) => {
        if (!url) return reject({message: 'Invalid parameters (url cannot be empty)', status: 400})
        try {
            const infoURL = store.getPointerByURL(url, userid)
            if (infoURL) resolve(infoURL)
            else reject({message: 'URL Not Found', status: 404})
        } catch (e) {
            reject({
                message: 'Error informando URL',
                details: e
            })

        }
    })
}

function dump() {
    return new Promise((resolve, reject) => {
        try {
            store.dump()
            resolve('Dump!')
        } catch (e) {
            reject({
                message: 'Error haciendo Dump',
                details: e
            })
        }

    })
}

function exportPointers (userid) {
    return new Promise((resolve, reject) => {
        try {
            resolve(store.exportPointers(userid))
        } catch (e) {
            reject({
                message: 'Error haciendo export',
                details: e
            })
        }
    })
}

function importPointers (userid, pointers) {
    return new Promise(async (resolve, reject) => {
        try {
            const noImport = []
            for (let pointer of pointers) {
                try {
                    await addPointer(pointer)
                } catch (e) {
                    noImport.push(pointer)
                }
            }

            return noImport
        } catch (e) {
            reject({
                message: 'Error import export',
                details: e
            })
        }
    })
}

function deleteAll (userid) {
    return new Promise((resolve, reject) => {
        try {
            resolve(store.deleteAll(userid))
        } catch (e) {
            reject({
                message: 'Error haciendo export',
                details: e
            })
        }
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
    dump,
    exportPointers,
    importPointers,
    deleteAll
}
