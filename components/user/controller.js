const store = require('../../store/userStore')

function getUser(userid) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = store.getUser(userid)
            if (user) resolve(user)
            else reject({userMessage: 'User not found'})
        } catch (e) {
            e.userMessage = 'Error tomando informacion del usuario'
            reject (e)
        }
    })
}

function updateUser(dataUser) {
    return new Promise((resolve, reject) => {
        try {
            const infoUser = store.getUser(dataUser.userid)
            if (!infoUser) return reject({userMessage: 'User not found'})

            if (!dataUser.roles) dataUser.roles = ["user"]

            // verifico que existan los roles
            for (const rol of dataUser.roles) {
                let infoRole = store.getRole(rol)
                if (!infoRole) {
                    return reject ({userMessage: 'Role \'' + rol + '\' Not found'})
                }
            }

            let user = store.updateUser(dataUser)
            user.roles = store.updateRolesUser(dataUser.userid, dataUser.roles)
            resolve(user)
        } catch (error) {
            error.userMessage = 'No se pudo actualizar el estado'
            reject(error)
        }
    })
}

function getAllUsers() {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(store.list())
        } catch (e) {
            e.userMessage = 'Error adquiriendo listado de usuarios'
            reject(e)
        }
    })
}

function deleteUser(userid) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = store.getUser(userid)

            if (!user) return reject({userMessage: 'User not found'})

            resolve (store.deleteUser(userid))
        } catch (e) {
            e.userMessage = 'Error al borrar usuario'
            reject (e)
        }
    })
}

module.exports = {
    getUser: getUser,
    updateUser: updateUser,
    getall: getAllUsers,
    deleteUser: deleteUser,
}
