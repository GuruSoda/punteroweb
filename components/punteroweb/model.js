const db = require('../../db').getdb()

const puntero = "\
CREATE TABLE if not exists puntero (\
    id text not null primary key collate nocase,\
    url text unique not null collate nocase,\
    title text,\
    description text,\
    added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
    stars integer,\
    directory text nocase default '/',\
    userid text not null collate nocase,\
    FOREIGN KEY (userid) REFERENCES user (userid) on delete cascade ON UPDATE NO ACTION\
) WITHOUT ROWID;\
CREATE INDEX if not exists puntero_url_idx ON puntero (url);\
CREATE TABLE if not exists label (\
    id integer not null primary key autoincrement,\
    label text unique not null collate nocase,\
    userid integer not null collate nocase,\
    FOREIGN KEY (userid) REFERENCES user (userid) on delete cascade ON UPDATE NO ACTION\
);\
CREATE TABLE if not exists punterolabel (\
    id_puntero text not null collate nocase,\
    id_label integer not null,\
    unique(id_puntero, id_label),\
    FOREIGN KEY (id_puntero) REFERENCES puntero (id) on delete cascade ON UPDATE NO ACTION\
    FOREIGN KEY (id_label) REFERENCES label (id) on delete cascade ON UPDATE NO ACTION\
);";

db.exec(puntero)

module.exports = db
