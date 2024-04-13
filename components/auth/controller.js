const config = require('../../config')
const store = require('./store')
const auth = require('../../auth')
const bcrypt = require('bcrypt')
const nanoid = require('nanoid').customAlphabet(config.model.alphabetIDUser, config.model.lengthIDUser)
const userStore = require('../../store/userStore')

init()

function login(dataLogin) {
    return new Promise(async (resolve, reject) => {
        if (!dataLogin.email) return reject({userMessage: 'email is required'})
        if (!dataLogin.password) return reject({userMessage: 'password is required'})

        let  dataUser = {}
        try {
            dataUser.userid = userStore.getUserByEmail(dataLogin.email)
            if (!dataUser.userid) return reject({userMessage: 'User or Password Incorrect'})

            dataUser.password = userStore.getUserPassword(dataUser.userid)
            if (!dataUser.password) return reject({userMessage: 'User without pass?'})
        } catch (e) {
            return reject({userMessage: 'No autorizado'})
        }

        try {
            const result = await bcrypt.compare(dataLogin.password, dataUser.password)

            if (result) {
                delete dataUser.password
                dataUser = userStore.getUser(dataUser.userid)
                dataUser.accessToken = auth.sign({sub: dataUser.userid, roles: dataUser.roles})
                dataUser.refreshToken = auth.signRefreshToken({sub: dataUser.userid})

                store.setTokens(dataUser.userid, dataUser.accessToken, dataUser.refreshToken)
            
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

        let user = userStore.getUserByEmail(dataUser.email)

        if (user) return reject({userMessage:'Email ' + dataUser.email + ' Already Exists'})

        if (userStore.getUserByUserName(dataUser.username)) return reject({userMessage:'UserName ' + dataUser.username + ' Already Exists'})

        dataUser.userid = nanoid()
        dataUser.password = await bcrypt.hash(dataUser.password, 5)

        try {
            user = userStore.add(dataUser)
            userStore.addRoleToUser('user', user.userid)
            resolve(user)
        } catch (error) {
            error.userMessage = 'Error Creando usuario'
            reject(error)
        }
    })
}

function logout(token) {
    return new Promise((resolve, reject) => {
        try {
            store.deleteTokens(token)
            resolve('chau!')
        } catch (e) {
            reject(e)
        }
    })
}

function refreshToken(dataToken) {
    return new Promise((resolve, reject) => {
        try {
            let payloadToken = {}

            const tokens = store.getTokensByRefreshToken(dataToken.refreshToken)

            if (!tokens) return reject ({userMessage: 'User Not Authorized'})

            payloadToken = auth.verify(tokens.access)

            store.deleteTokens(dataToken.refreshToken)

            let newTokens = {}
            newTokens.accessToken = auth.sign({sub: payloadToken.sub, roles: payloadToken.roles})
            newTokens.refreshToken = auth.signRefreshToken({sub: payloadToken.sub})

            store.setTokens(payloadToken.sub, newTokens.accessToken, newTokens.refreshToken)

            resolve(newTokens)
        } catch (e) {
            e.userMessage = 'Not Authorized'
            reject(e)
        }
    })
}

async function init() {
    try {
        // Agrego Roles por default
        let role = userStore.getRole('admin')
        if (!role) userStore.addRole({name: 'admin', description: 'Role for Administration'})
        
        role = userStore.getRole('user')
        if (!role) userStore.addRole({name: 'user', description: 'Role for basic usage'})
        
        // Agrego usuario por default si no existe
        let admin = {}
        let userid = userStore.getUserByEmail('admin@localhost')
        if (!userid) {
            admin = await newUser({
                email: "admin@localhost",
                password: "admin",
                username: "admin",
                name: "Admin",
                lastname: "User"
            })

            // Le asigno al usuario admin que sea administrador
            userStore.addRoleToUser('admin', admin.userid)
        }
    } catch (e) {
        console.log('Error on init:', e)
    }
}

function getTokens(token) {
    return new Promise(async (resolve, reject) => {
        try {
            let tokens = await store.getTokens(token)
            resolve(tokens)
        } catch (e) {
            reject(e)
        }
    })
}

function dump() {
    return new Promise((resolve, reject) => {
        store.dump()
        resolve()
    })    
}

function deleteAllTokens() {
    return new Promise((resolve, reject) => {
        store.deleteAllTokens()
        resolve()
    })    
}

module.exports = {
    login: login,
    logout: logout,
    register: newUser,
    refreshtoken: refreshToken,
    getTokens,
    deleteAllTokens,
    dump: dump
}
