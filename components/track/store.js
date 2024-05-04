const model = require('./model')
const error = require('../../utils/error')

const stmtAdd = model.prepare('insert into track(url, title, userid) values(?, ?, ?)')
const stmtAll = model.prepare('select url, title, added from track where userid=?')

function addTracking (dataTrack) {
    try {
        const salidaadd = stmtAdd.run(dataTrack.url, dataTrack.title, dataTrack.userid)

        if (salidaadd.changes > 0) return dataTrack
    } catch(e) {
        throw error(e.message, e.code)
    }
}

function getTracking (conf) {
    try {
        const out = stmtAll.all(conf.userid)

        return out
    } catch(e) {
        throw error(e.message, e.code)
    }
}

module.exports = {
    add: addTracking,
    get: getTracking
}
