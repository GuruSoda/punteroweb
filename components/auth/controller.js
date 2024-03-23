const config = require('../../config')
const store = require('../../store/userStore')
const auth = require('../../auth')
const bcrypt = require('bcrypt')
const nanoid = require('nanoid').customAlphabet(config.model.alphabetIDUser, config.model.lengthIDUser)

init()

function login(dataLogin) {
    return new Promise(async (resolve, reject) => {
        if (!dataLogin.email) return reject({userMessage: 'email is required'})
        if (!dataLogin.password) return reject({userMessage: 'password is required'})

        let  dataUser = {}
        try {
            dataUser.userid = store.getUserByEmail(dataLogin.email)
            if (!dataUser.userid) return reject({userMessage: 'User or Password Incorrect'})
            dataUser.password = store.getUserPassword(dataUser.userid)
            if (!dataUser.password) return reject({userMessage: 'User without pass?'})
        } catch (e) {
            return reject({userMessage: 'No autorizado'})
        }

        try {
            const result = await bcrypt.compare(dataLogin.password, dataUser.password)

            if (result) {
                delete dataUser.password
                dataUser = store.getUser(dataUser.userid)
                dataUser.accessToken = auth.sign({userid: dataUser.userid, roles: dataUser.roles})
                resolve(dataUser)
            } else {
                reject({userMessage: 'Email or Password incorrect.'})
            }
        } catch (e) {
            reject(e)
        }
    })
}

function newUser(dataUser) {
    return new Promise(async (resolve, reject) => {
        if (!dataUser.email) return reject({userMessage: 'email is required'})
        if (!dataUser.password) return reject({userMessage: 'password is required'})
        if (!dataUser.username) return reject({userMessage: 'username is required'})

        let user = store.getUserByEmail(dataUser.email)

        if (user) return reject({userMessage:'Email ' + dataUser.email + ' Already Exists'})

        if (store.getUserByUserName(dataUser.username)) return reject({userMessage:'UserName ' + dataUser.username + ' Already Exists'})

        dataUser.userid = nanoid()
        dataUser.password = await bcrypt.hash(dataUser.password, 5)

        try {
            user = store.add(dataUser)
            store.addRoleToUser('user', user.userid)
            resolve(user)
        } catch (error) {
            error.userMessage = 'Error Creando usuario'
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
        let userid = store.getUserByEmail('admin@localhost')
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
