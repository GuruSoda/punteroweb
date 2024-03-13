const store = require('../../store/userStore')

function getUser(userid) {
    return new Promise(async (resolve, reject) => {
        store.getUser(userid)
            .then(message => resolve(message))
            .catch(message => reject(message))
    })
}

function updateUser(dataUser) {
    return new Promise(async (resolve, reject) => {

        try {
            // verifico que existan los roles
            for (rol of dataUser.roles) {
                let infoRol = await store.getRole(rol)
                if (infoRol === undefined) reject('Rol ' + rol + ' no existe')
            }

            let user = await store.updateUser(dataUser)
            user.roles = await updateRolesUser(dataUser.userid, dataUser.roles)
            resolve(user)
        } catch (error) {
            reject(error)
        }
    })
}

function updateRolesUser(userid, roles) {
    return new Promise(async (resolve, reject) => {
        store.updateRolesUser(userid, roles)
            .then(message => resolve(message))
            .catch(message => reject(message))
    })
}

function getAllUsers() {
    return new Promise(async (resolve, reject) => {
        store.list()
            .then(message => resolve(message))
            .catch(message => reject(message))
    })
}

function deleteUser(userid) {
    return new Promise(async (resolve, reject) => {
        store.deleteUser(userid)
            .then(message => resolve(message))
            .catch(message => reject(message))
    })
}

function roleToUser(role, user) {
    return new Promise(async (resolve, reject) => {
        // store.deleteUser(userid)
        //     .then(message => resolve(message))
        //     .catch(message => reject(message))
    })
}

module.exports = {
    getUser: getUser,
    updateUser: updateUser,
    updateRolesUser: updateRolesUser,
    getall: getAllUsers,
    deleteUser: deleteUser,
    roleToUser: roleToUser,
}
