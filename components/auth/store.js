const model = require('./model')
const cacheTokens = require('./cacheTokens')
const config = require('../../config')
const error = require('../../utils/error')

const stmtSetTokens = model.prepare('insert into tokens (access, refresh, userid) values(?,?,?)')
const stmtGetTokens = model.prepare('select access, refresh, userid from tokens where access=? or refresh=?')
const stmtGetTokensByAccessToken = model.prepare('select access, refresh, userid from tokens where access=?')
const stmtGetTokensByRefreshToken = model.prepare('select access, refresh, userid from tokens where refresh=?')
const stmtGetTokensByUserID = model.prepare('select access, refresh, userid from tokens where userid=?')
const stmtDeleteTokens = model.prepare('delete from tokens where access=? or refresh=?')
const stmtDeleteAllTokens = model.prepare('delete from tokens')

console.log('cache tokens:', config.cache.tokens)
if (config.cache.tokens) loadCacheTokens()

cacheTokens.dumpCacheTokens()

function loadCacheTokens() {
    try {
        const stmtGetAllTokens = model.prepare('select access, refresh, userid from tokens')
        let iterator = stmtGetAllTokens.iterate()

        for (const token of iterator) {
            cacheTokens.add({ access: token.access, refresh: token.refresh, userid: token.userid})
        }
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function setTokens(userid, access, refresh) {
    try {
        const out = stmtSetTokens.run(access, refresh, userid)
        cacheTokens.add({userid: userid, access: access, refresh: refresh})
        return (out.changes > 0) ? true : false
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function deleteTokens(token) {
    try {
        const out = stmtDeleteTokens.run(token, token)
        cacheTokens.deleteCache(token)
        return (out.changes > 0) ? true : false
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function getTokens(access) {
    try {
        let tokens = cacheTokens.get(access)

        if (!tokens) tokens = stmtGetTokens.get(access, access)

        return tokens
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function getTokensByAccessToken(access) {
    try {
        let tokens = cacheTokens.get(access)

        if (!tokens) tokens = stmtGetTokensByAccessToken.get(access)

        return tokens
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function getTokensByRefreshToken(refresh) {
    try {
        const tokens = stmtGetTokensByRefreshToken.get(refresh)
        return tokens
    } catch (error) {
        throw error(e.message, e.code)
    }
}

function getTokensByUserID(userid) {
    try {
        const tokens = stmtGetTokensByUserID.get(userid)
        return tokens
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function dump() {
    let stmt
    let out = []

    stmt = model.prepare('select * from tokens')
    out = stmt.all()
    console.table(out)
}

function deleteAllTokens() {
    try {
        const tokens = stmtDeleteAllTokens.run()
        cacheTokens.clear()
        return tokens.changes
    } catch (e) {
        throw error(e.message, e.code)
    }
}

module.exports = {
    setTokens,
    getTokens,
    deleteTokens,
    deleteAllTokens,
    getTokensByAccessToken,
    getTokensByRefreshToken,
    getTokensByUserID,
    dump
}
