let cacheLabel = []

function add (label) {
    cacheLabel.push(label)
}

function get (pointerid) {

    const labelPointer = cacheLabel.filter((item) => item.id_puntero === pointerid)

    if (labelPointer.length === 0) return []
    
    let labels = []

    labelPointer.forEach((item) => {labels.push(item.label)})

    return labels
}

function dumpCacheLabel() {
    console.table(cacheLabel)
}

module.exports = {
    add,
    get,
    dumpCacheLabel
}