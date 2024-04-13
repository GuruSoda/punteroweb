const db = require('../../db').getdb()

const auth = "\
CREATE TABLE if not exists tokens (\
    access text unique not null collate nocase,\
    refresh text unique not null collate nocase,\
    userid text not null collate nocase,\
    unique(access, refresh, userid)\
);";

db.exec(auth)

module.exports = db
