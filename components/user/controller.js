const store = require('../../store/userStore')

function getAllUsers() {
    return new Promise(async (resolve, reject) => {
        store.list()
            .then(message => resolve(message))
            .catch(message => reject(message))
    })
}

module.exports = {
    getall: getAllUsers
}
