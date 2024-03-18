const store = require('../../store/userStore')
const error = require('../../utils/error')

function getUser(userid) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = store.getUser(userid)
            if (user) resolve(user)
            else reject('User not found')
        } catch (e) {
            reject (e)
        }
    })
}

function updateUser(dataUser) {
    return new Promise((resolve, reject) => {
        try {
            const infoUser = store.getUser(dataUser.userid)
            if (!infoUser) return reject('User not found')

            // verifico que existan los roles
            for (const rol of dataUser.roles) {
                let infoRole = store.getRole(rol)                
                if (!infoRole) return reject ('Rol \'' + rol + '\' Not found')
            }

            let user = store.updateUser(dataUser)
            user.roles = store.updateRolesUser(dataUser.userid, dataUser.roles)
            resolve(user)
        } catch (error) {
            reject(error)
        }
    })
}

function getAllUsers() {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(store.list())
        } catch (e) {
            reject(e)
        }
    })
}

function deleteUser(userid) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = store.getUser(userid)

            if (!user) return reject('User not found')

            resolve (store.deleteUser(userid))
        } catch (e) {
            reject (e)
        }
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
    getall: getAllUsers,
    deleteUser: deleteUser,
    roleToUser: roleToUser,
}
