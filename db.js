const Database = require('better-sqlite3')

// V1
let db = undefined

function conectar (filedb) {
    if (db) return db

    db = new Database(filedb, { verbose: console.log })
    db.pragma('journal_mode = WAL');

    return db
}

function getdb() {
    return db
}

module.exports = {conectar, getdb}

/*
//V2
const db = new Database('punteros.sqlite3', { verbose: console.log })
db.pragma('journal_mode = WAL');

module.exports = db
*/