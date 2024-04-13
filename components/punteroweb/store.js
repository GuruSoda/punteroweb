const Model = require('./model')
const error = require('../../utils/error')

const stmtAdd = Model.prepare('insert into puntero(id, url, title, description, stars, userid) values(?, ?, ?, ?, ?, ?)')
const stmtUpdate = Model.prepare('update puntero set url=?, title=?, description=?, stars=?, directory=? where id=?')
const stmtInfo = Model.prepare('select id, url, title, description, added, stars, directory, userid from puntero where id = ?')
const stmtGetPointerByURL = Model.prepare('select id, url, title, description, added, stars, userid from puntero where url = ?')
const stmtList = Model.prepare('select id, url, title, description, added, stars, directory, userid from puntero where userid=?')
const stmtLabels = Model.prepare('select l.label from puntero p,label l, punterolabel pl where p.id = pl.id_puntero and l.id = pl.id_label and p.id = ?')
const stmtDeletePunteroLabel = Model.prepare('delete from punterolabel where id_puntero = ?')
const stmtIDLabel = Model.prepare('select id from label where label = ?')
const stmtAddLabel = Model.prepare('insert or ignore INTO label (label, userid) values (?, ?)')
const stmtAddPunteroLabel = Model.prepare('insert INTO punterolabel (id_puntero, id_label) values (?, ?)')
const stmtDelete = Model.prepare('delete from puntero where id=? and userid=?')

function labels(id) {
    try {

        let labels = []

        let iterator = stmtLabels.iterate(id)

        for (const label of iterator) {
            labels.push(label.label)
        }

        return labels
    } catch(error) {
        return []
    }
}

function punteroToObject(url) {

    try {
        const salida = stmtInfo.get(url)
        let registro = {}

        if (salida) {
            registro.id = salida.id
            registro.url = salida.url
            registro.title = salida.title
            registro.description = salida.description
            registro.added = salida.added
            registro.starts = salida.starts
            registro.labels = labels(salida.id)
        }
        return registro
    } catch(error) {
        throw {code: error.code, mensaje: error.message}
    }
}

function addPointer (dataPuntero) {
    try {
        console.log('dataPuntero:', dataPuntero)
        // Agrego las etiquetas, existan o no.
        for (let label of dataPuntero.labels) stmtAddLabel.run(label, dataPuntero.userid)

        // Agrego el puntero
        const salidaadd = stmtAdd.run(dataPuntero.id, dataPuntero.url, dataPuntero.title, dataPuntero.description, dataPuntero.starts, dataPuntero.userid)

        // saco el id y pueblo la tabla punterolabel
        for (let label of dataPuntero.labels) {
            let id_label = stmtIDLabel.get(label)
            stmtAddPunteroLabel.run(dataPuntero.id, id_label.id)
        }

        if (salidaadd.changes > 0) return dataPuntero
    } catch(error) {
        console.log('Error agregando:', error)
        throw error({code: error.code, mensaje: error.message})
    }
}

function infoPointer(id) {
    try {
        let registro = stmtInfo.get(id)

        if (!registro) return undefined
        
        registro.labels = labels(id)
        return registro
    } catch(error) {
        throw({code: error.code, mensaje: error.message, userMessage: error.userMessage || ''})
    }
}

function getPointerByURL(url) {
    try {
        let pointer = stmtGetPointerByURL.get(url)
        return pointer
    } catch (error) {
        throw({code: error.code, mensaje: error.message})
    }
}

function deletePointer (id, userid) {
    try {
        const salida = stmtDelete.run(id, userid)
        if (!salida.changes) throw ('Pointer not found')
    } catch(error) {
        throw({code: error.code, mensaje: error.message})
    }
}

function modifyPointer(dataPointer) {
    try {
        const salida = stmtUpdate.run(dataPointer.url, dataPointer.title, dataPointer.description, dataPointer.stars, dataPointer.directory, dataPointer.id)

        // Agrego las etiquetas, existan o no.
        for (let label of dataPointer.labels) stmtAddLabel.run(label)

        // Borro las etiquetas del puntero
        stmtDeletePunteroLabel.run(dataPointer.id)

        // saco el id y pueblo la tabla punterolabel
        for (let label of dataPointer.labels) {
            let id_label = stmtIDLabel.get(label)
            stmtAddPunteroLabel.run(dataPointer.id, id_label.id)
        }

        return dataPointer
    } catch(error) {
        throw({code: error.code, mensaje: error.message})
    }
}

// SELECT * FROM tablaUsuarios LIMIT 5 OFFSET 3;
function listPointers (userid, count, page) {
    try {
        const salida = stmtList.all(userid)

        let punteros = []

        for (let pointer of salida) {
            pointer.labels = labels(pointer.id)
            punteros.push(pointer)
        }

        return punteros
    } catch(error) {
        throw({code: error.code, mensaje: error.message})
    }
}

function countPointers (dataFile) {
    Model.all('select count(id) as total from file', (err, rows) => {
        if (err) reject (err)
        else resolve(rows[0].total)
    })
}

function listLabels (userid) {
    const stmtListLabels = Model.prepare('select label from label where userid=?')
    try {
        const salida = stmtListLabels.all(userid)
        let labels = []

        salida.forEach(element => {
            labels.push(element.label)
        });

        return labels
    } catch(error) {
        throw({code: error.code, mensaje: error.message})
    }
}

function dump() {
    let stmt
    let out = []
    
    stmt = Model.prepare('select * from puntero')
    out = stmt.all()
    console.table(out)

    stmt = Model.prepare('select * from label')
    out = stmt.all()
    console.table(out)

    stmt = Model.prepare('select * from punterolabel')
    out = stmt.all()
    console.table(out)
}

module.exports = {
    add: addPointer,
    info: infoPointer,
    delete: deletePointer,
    list: listPointers,
    count: countPointers,
    modify: modifyPointer,
    listLabels,
    getPointerByURL,
    labels,
    dump
}
