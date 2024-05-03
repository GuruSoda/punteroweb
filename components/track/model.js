const config = require('../../config')

const dataBaseTracking = require('./db')

const db = dataBaseTracking.conectar(config.database.trackingdb)

const track = "\
CREATE TABLE if not exists track (\
    id integer not null primary key autoincrement collate nocase,\
    url text not null collate nocase,\
    title text collate nocase,\
    added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    userid text not null collate nocase\
);";

db.exec(track)

module.exports = db
