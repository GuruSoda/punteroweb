const db = require('../db').getdb()

const puntero = "\
CREATE TABLE if not exists user (\
    userid text unique primary key collate nocase,\
    username text unique not null collate nocase,\
    email text unique not null collate nocase,\
    name text,\
    lastname text,\
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP\
)WITHOUT ROWID;\
CREATE TABLE if not exists password (\
    userid text unique primary key collate nocase,\
    password text not null collate nocase,\
    unique(userid, password),\
    FOREIGN KEY (userid) REFERENCES user (userid) on delete cascade ON UPDATE NO ACTION\
);\
CREATE TABLE if not exists role (\
    id integer primary key autoincrement,\
    name text unique not null collate nocase,\
    description text\
);\
CREATE TABLE if not exists user_role (\
    userid text not null,\
    roleid integer not null,\
    unique(userid, roleid),\
    FOREIGN KEY (userid) REFERENCES user (userid) on delete cascade ON UPDATE NO ACTION,\
    FOREIGN KEY (roleid) REFERENCES role (id) on delete cascade ON UPDATE NO ACTION\
);";

/*
CREATE TABLE if not exists config (\
    excludeLabel text,\
    enableExcludeLabel boolean,\
    unique(userid, roleid),\
    FOREIGN KEY (userid) REFERENCES user (userid) on delete cascade ON UPDATE NO ACTION\
);
*/

db.exec(puntero)

module.exports = db
