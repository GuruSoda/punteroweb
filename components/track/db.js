const Database = require('better-sqlite3')

let db = undefined

function conectar (filedb) {
    if (db) return db

    db = new Database(filedb, { verbose: console.log })
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')

    return db
}

function getdb() {
    return db
}

module.exports = {conectar, getdb}
