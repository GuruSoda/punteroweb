const db = require('../../db').getdb()

const puntero = "\
CREATE TABLE if not exists puntero (\
    id integer not null primary key autoincrement,\
    urlid text not null,\
    url text unique not null collate nocase,\
    title text,\
    description text,\
    added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    starts integer,\
    user_id integer\
);\
CREATE INDEX if not exists puntero_url_idx ON puntero (url);\
CREATE TABLE if not exists label (\
    id integer not null primary key autoincrement,\
    label text unique not null collate nocase\
);\
CREATE TABLE if not exists punterolabel (\
    id_puntero integer not null,\
    id_label integer not null\
)";

db.exec(puntero)

module.exports = db
// FOREIGN KEY (id) REFERENCES punterolabel (id_puntero) on delete cascade\
