const db = require('../db').getdb()

const puntero = "\
CREATE TABLE if not exists user (\
    userid text unique not null collate nocase,\
    username text unique not null collate nocase,\
    email text unique not null collate nocase,\
    name text,\
    lastname text,\
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    FOREIGN KEY (userid) REFERENCES password (userid) on delete cascade\
);\
CREATE TABLE if not exists password (\
    userid text unique not null collate nocase,\
    password text not null collate nocase,\
    unique(userid, password)\
);\
CREATE TABLE if not exists role (\
    id integer not null primary key autoincrement,\
    name text unique not null collate nocase,\
    description text\
);\
CREATE TABLE if not exists user_role (\
    userid integer not null,\
    roleid integer not null,\
    unique(userid, roleid)\
)";

db.exec(puntero)

module.exports = db
