const Model = require('./model')
const error = require('../../utils/error')

const stmtAdd = Model.prepare('insert into puntero(id, url, title, description, stars, userid) values(?, ?, ?, ?, ?, ?)')
const stmtUpdate = Model.prepare('update puntero set url=?, title=?, description=?, stars=?, directory=? where id=? and userid=?')
const stmtInfo = Model.prepare('select id, url, title, description, added, stars, directory, userid from puntero where id = ? and userid=?')
const stmtGetPointerByURL = Model.prepare('select id, url, title, description, added, stars, userid from puntero where url = ? and userid=?')
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
    } catch(e) {
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
    } catch(e) {
        throw error(e.message, e.code)
    }
}

function addPointer (dataPuntero) {
    try {
        // Agrego las etiquetas, existan o no.
        for (let label of dataPuntero.labels) stmtAddLabel.run(label, dataPuntero.userid)

        // Agrego el puntero
        const salidaadd = stmtAdd.run(dataPuntero.id, dataPuntero.url, dataPuntero.title, dataPuntero.description, dataPuntero.stars, dataPuntero.userid)

        // saco el id y pueblo la tabla punterolabel
        for (let label of dataPuntero.labels) {
            let id_label = stmtIDLabel.get(label)
            stmtAddPunteroLabel.run(dataPuntero.id, id_label.id)
        }

        if (salidaadd.changes > 0) return dataPuntero
    } catch(e) {
        throw error(e.message, e.code)
    }
}

function infoPointer(id, userid) {
    try {
        let registro = stmtInfo.get(id, userid)

        if (!registro) return undefined
        
        registro.labels = labels(id)
        return registro
    } catch(e) {
        throw error(error.message, e.code)
    }
}

function getPointerByURL(url, userid) {
    try {
        let pointer = stmtGetPointerByURL.get(url, userid)

        if (!pointer) return undefined
        
        pointer.labels = labels(pointer.id)
        return pointer
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function deletePointer (id, userid) {
    try {
        const salida = stmtDelete.run(id, userid)
        return (salida.changes === 0) ? false : true
    } catch(e) {
        throw error(e.message, e.code)
    }
}

function modifyPointer(dataPointer) {
    try {
        const salida = stmtUpdate.run(dataPointer.url, dataPointer.title, dataPointer.description, dataPointer.stars, dataPointer.directory, dataPointer.id, dataPointer.userid)

        // Agrego las etiquetas, existan o no.
        for (let label of dataPointer.labels) stmtAddLabel.run(label, dataPointer.userid)

        // Borro las etiquetas del puntero
        stmtDeletePunteroLabel.run(dataPointer.id)

        // saco el id y pueblo la tabla punterolabel
        for (let label of dataPointer.labels) {
            let id_label = stmtIDLabel.get(label)
            stmtAddPunteroLabel.run(dataPointer.id, id_label.id)
        }

        return dataPointer
    } catch(e) {
        throw error(e.message, e.code)
    }
}

// SELECT * FROM tablaUsuarios LIMIT 5 OFFSET 3;
function listPointers (userid, count, page) {
    try {
        const salida = stmtList.all(userid)

        let punteros = []

        for (let pointer of salida) {
            pointer.labels = labels(pointer.id)
            delete pointer.userid
            punteros.push(pointer)
        }

        return punteros
    } catch(e) {
        throw error(e.message, e.code)
    }
}

function countPointers (dataFile) {
    try {
        const stmtCountPointers = Model.prepare('select count(id) as total from puntero')
        const salida = stmtCountPointers.get()
        if (salida) return salida.total
        else return -1
    } catch (e) {
        throw error(e.message, e.code)
    }
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
    } catch(e) {
        throw error(e.message, e.code)
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
