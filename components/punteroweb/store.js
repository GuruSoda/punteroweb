const Model = require('./model')

const stmtAdd = Model.prepare('insert into puntero(id, url, title, description, starts) values(?, ?, ?, ?, ?)')
const stmtInfo = Model.prepare('select id, url, title, description, added, starts from puntero where id = ?')
const stmtList = Model.prepare('select url from puntero')
const stmtLabels = Model.prepare('select l.label from puntero p,label l, punterolabel pl where p.id = pl.id_puntero and l.id = pl.id_label and p.id = ?')
const stmtIDLabel = Model.prepare('select id from label where label = ?')
const stmtAddLabel = Model.prepare('insert or ignore INTO label (label) values (?)')
const stmtAddPunteroLabel = Model.prepare('insert INTO punterolabel (id_puntero, id_label) values (?, ?)')
const stmtDelete = Model.prepare('delete from puntero where id = ?')

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
        const salidaadd = stmtAdd.run(dataPuntero.id, dataPuntero.url, dataPuntero.title, dataPuntero.description, dataPuntero.starts)

        // Agrego las etiquetas, existan o no.
        for (let label of dataPuntero.labels) stmtAddLabel.run(label)

        // saco el id y pueblo la tabla punterolabel
        for (let label of dataPuntero.labels) {
            let id_label = stmtIDLabel.get(label)
            stmtAddPunteroLabel.run(id_puntero, id_label.id)
        }
    } catch(error) {
        throw({code: error.code, mensaje: error.message})
    }
}

function infoPointer(id) {
    try {
        let registro = stmtInfo.get(id)

        if (registro) return registro
        else throw ('Pointer not found')
    } catch(error) {
        throw({code: error.code, mensaje: error.message})
    }
}

function deletePointer (id) {
    try {                
        const salida = stmtDelete.run(id)
        if (!salida.changes) throw ('Pointer not found')
    } catch(error) {
        throw({code: error.code, mensaje: error.message})
    }
}

function listPointers (count, page) {
    try {
        const salida = stmtList.all()
        let punteros = []

        salida.forEach(element => {
            punteros.push(punteroToObject(element.url))
        });
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

module.exports = {
    add: addPointer,
    info: infoPointer,
    delete: deletePointer,
    list: listPointers,
    count: countPointers,
}
