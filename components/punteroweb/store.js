const Model = require('./model')

const stmtAdd = Model.prepare('insert into puntero(id, url, title, description, starts) values(?, ?, ?, ?, ?)')
const stmtInfo = Model.prepare('select id, url, title, description, added, starts from puntero where url = ?')
const stmtList = Model.prepare('select url from puntero')
const stmtLabels = Model.prepare('select l.label from puntero p,label l, punterolabel pl where p.id = pl.id_puntero and l.id = pl.id_label and p.id = ?')
const stmtIDLabel = Model.prepare('select id from label where label = ?')
const stmtAddLabel = Model.prepare('insert or ignore INTO label (label) values (?)')
const stmtAddPunteroLabel = Model.prepare('insert INTO punterolabel (id_puntero, id_label) values (?, ?)')
const stmtDelete = Model.prepare('delete from puntero where url = ?')

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

function addURL (dataPuntero) {
    try {
        const salidaadd = stmtAdd.run(dataPuntero.id, dataPuntero.url, dataPuntero.title, dataPuntero.description, dataPuntero.starts)

        const id_puntero = salidaadd.lastInsertRowid

        // Agrego las etiquetas, existan o no.
        dataPuntero.labels.forEach(strlabel => stmtAddLabel.run(strlabel))

        // saco el id y pueblo la tabla punterolabel
        dataPuntero.labels.forEach(strlabel => {
            let id_label = stmtIDLabel.get(strlabel)
            stmtAddPunteroLabel.run(id_puntero, id_label.id)
        })
    } catch(error) {
        throw({code: error.code, mensaje: error.message})
    }
}

function infoURL(url) {
    // Anteriormente la informacion era retornada en base al id
    //    const salida = stmtInfo.get(Math.trunc(parseInt(id, 10)))

    try {
        let registro = punteroToObject(url)

        if (Object.keys(registro).length() === 0) reject('URL no encontrada')
    } catch(error) {
        throw({code: error.code, mensaje: error.message})
    }
}

function deleteURL (url) {
    try {                
        const salida = stmtDelete.run(url)
        if (!salida.changes) throw ('URL not found.')
    } catch(error) {
        throw(error)
    }
}

function listURLs (count, page) {
    try {
        const salida = stmtList.all()
        let punteros = []

        salida.forEach(element => {
            punteros.push(punteroToObject(element.url))
        });
    } catch(error) {
        throw(error)
    }
}

function countURLs (dataFile) {
    Model.all('select count(id) as total from file', (err, rows) => {
        if (err) reject (err)
        else resolve(rows[0].total)
    })
}

module.exports = {
    add: addURL,
    info: infoURL,
    delete: deleteURL,
    list: listURLs,
    count: countURLs,
}
