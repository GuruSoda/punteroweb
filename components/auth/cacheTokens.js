const cacheTokens = new Map()

// {access: 'xxxxx', userid: 'yyyy', refresh: 'zzzzz'}
function add (dataToken) {
    cacheTokens.set(dataToken.access, {refresh: dataToken.refresh, userid: dataToken.userid})
}

function get (accessToken) {

    const info = cacheTokens.get(accessToken)

    if (info && info.userid) console.log(accessToken, 'from cache.')

    return info ? info : undefined
}

function clear() {
    cacheTokens.clear()
}

function deleteCache(accessToken) {
    cacheTokens.delete(accessToken)
}

function dumpCacheTokens() {
    console.table(cacheTokens)
}

module.exports = {
    add,
    get,
    clear,
    deleteCache,
    dumpCacheTokens
}
