const config = require('../../config')
const store = require('../../store/userStore')
const auth = require('../../auth')
const bcrypt = require('bcrypt')
const nanoid = require('nanoid').customAlphabet(config.model.alphabetIDUser, config.model.lengthIDUser)

init()

function login(dataLogin) {
    return new Promise(async (resolve, reject) => {
        if (!dataLogin.email) reject('email is required.')
        if (!dataLogin.password) reject('password is required.')

        let  dataUser = {}
        try {
            dataUser.userid = store.getUserID(dataLogin.email)
            if (!dataUser.userid) return reject('User or Password Incorrect')
            dataUser.password = store.getUserPassword(dataUser.userid)
            if (!dataUser.password) return reject('User without pass?')
        } catch (e) {
            return reject('No autorizado')
        }

        try {
            const result = await bcrypt.compare(dataLogin.password, dataUser.password)

            if (result) {
                delete dataUser.password
                dataUser = store.getUser(dataUser.userid)
                dataUser.token = auth.sign({userid: dataUser.userid, roles: dataUser.roles})
                resolve(dataUser)
            } else {
                reject('User or Pass incorrect.')
            }
        } catch (e) {
            reject(e)
        }
    })
}

function newUser(dataUser) {
    return new Promise(async (resolve, reject) => {
        if (!dataUser.email) reject('email is required.')
        if (!dataUser.password) reject('password is required.')

        dataUser.userid = nanoid()
        dataUser.password = await bcrypt.hash(dataUser.password, 5)

        try {
            const user = store.add(dataUser)
            store.addRoleToUser('user', user.userid)
            resolve(user)
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') reject('Usuario existente')
            reject(error)
        }
    })
}

function logout() {
    return new Promise((resolve, reject) => {
        resolve('chau!')
    })
}

async function init() {
    try {
        // Agrego Roles por default
        let role = store.getRole('admin')
        if (!role) store.addRole({name: 'admin', description: 'Role for Administration'})
        
        role = store.getRole('user')
        if (!role) store.addRole({name: 'user', description: 'Role for basic usage'})
        
        // Agrego usuario por default si no existe
        let admin = {}
        let userid = store.getUserID('admin@localhost')
        if (!userid) {
            admin = await newUser({
                email: "admin@localhost",
                password: "admin",
                username: "admin",
                name: "Admin",
                lastname: "User"
            })

            // Le asigno al usuario admin que sea administrador
            store.addRoleToUser('admin', admin.userid)
        }
    } catch (e) {
        console.log('Error on init:', e)
    }
}

module.exports = {
    login: login,
    logout: logout,
    register: newUser
}
