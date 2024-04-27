const model = require('./model')
const error = require('../../utils/error')

const stmtSetTokens = model.prepare('insert into tokens (access, refresh, userid) values(?,?,?)')
const stmtGetTokens = model.prepare('select access, refresh, userid from tokens where access=? or refresh=?')
const stmtGetTokensByAccessToken = model.prepare('select access, refresh, userid from tokens where access=?')
const stmtGetTokensByRefreshToken = model.prepare('select access, refresh, userid from tokens where refresh=?')
const stmtGetTokensByUserID = model.prepare('select access, refresh, userid from tokens where userid=?')
const stmtDeleteTokens = model.prepare('delete from tokens where access=? or refresh=?')
const stmtDeleteAllTokens = model.prepare('delete from tokens')

function setTokens(userid, access_token, refresh_token) {
    try {
        const out = stmtSetTokens.run(access_token, refresh_token, userid)
        return (out.changes > 0) ? true : false
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function deleteTokens(token) {
    try {
        const out = stmtDeleteTokens.run(token, token)
        return (out.changes > 0) ? true : false
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function getTokens(token) {
    try {
        const tokens = stmtGetTokens.get(token, token)
        return tokens
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function getTokensByAccessToken(access_token) {
    try {
        const tokens = stmtGetTokensByAccessToken.get(access_token)
        return tokens
    } catch (e) {
        throw error(e.message, e.code)
    }
}

function getTokensByRefreshToken(refresh_token) {
    try {
        const tokens = stmtGetTokensByRefreshToken.get(refresh_token)
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
