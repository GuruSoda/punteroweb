const db = require('../../db').getdb()

const puntero = "\
CREATE TABLE if not exists user (\
    id integer not null primary key autoincrement,\
    userid text unique not null collate nocase,\
    username text not null collate nocase,\
    email text not null collate nocase,\
    name text,\
    lastname text\
);\
CREATE TABLE if not exists password (\
    id integer not null primary key autoincrement,\
    userid text unique not null collate nocase,\
    password text unique not null collate nocase,\
    unique(userid, password)\
)";

db.exec(puntero)

module.exports = db
