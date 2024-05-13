const cacheLabel = new Map();
// {pointerid: 'xxxxx', {labels: ["a", "b", "c"]}}
function add (dataLabel) {
    cacheLabel.set(dataLabel.pointerid, dataLabel.labels);
}

function get (pointerid) {

    const labels = cacheLabel.get(pointerid)

    return labels ? labels : []
}

function dumpCacheLabel() {
    console.table(cacheLabel)
}

module.exports = {
    add,
    get,
    dumpCacheLabel
}