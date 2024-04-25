const config = require('../../config')
const store = require('./store')
const auth = require('../../auth')
const bcrypt = require('bcrypt')
const nanoid = require('nanoid').customAlphabet(config.model.alphabetIDUser, config.model.lengthIDUser)
const userStore = require('../../store/userStore')

init()

function login(dataLogin) {
    return new Promise(async (resolve, reject) => {
        if (!dataLogin.email) return reject({message: 'email is required', status: 400})
        if (!dataLogin.password) return reject({message: 'password is required', status: 400})

        let  dataUser = {}
        try {
            dataUser.userid = userStore.getUserByEmail(dataLogin.email)
            if (!dataUser.userid) return reject({message: 'User or Password Incorrect', status: 400})

            dataUser.password = userStore.getUserPassword(dataUser.userid)
            if (!dataUser.password) return reject({message: 'User without pass?', status: 400})
        } catch (e) {
            return reject({
                message: 'Login Error',
                details: e
            })
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
                reject({message: 'Email or Password incorrect.', status: 400})
            }
        } catch (e) {
            reject({
                message: 'Login Error',
                details: e
            })
        }
    })
}

function newUser(dataUser) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataUser.email) return reject({message: 'email is required', status: 400})
            if (!dataUser.password) return reject({message: 'password is required', status: 400})
            if (!dataUser.username) return reject({message: 'username is required', status: 400})

            let user = userStore.getUserByEmail(dataUser.email)

            if (user) return reject({message:'Email ' + dataUser.email + ' Already Exists', status: 400})

            if (userStore.getUserByUserName(dataUser.username)) return reject({message:'UserName ' + dataUser.username + ' Already Exists', status: 400})

            dataUser.userid = nanoid()
            dataUser.password = await bcrypt.hash(dataUser.password, 5)

            user = userStore.add(dataUser)
            userStore.addRoleToUser('user', user.userid)
            resolve(user)
        } catch (e) {
            reject({
                message: 'Login Error',
                details: e
            })
        }
    })
}

function logout(token) {
    return new Promise((resolve, reject) => {
        try {
            store.deleteTokens(token)
            resolve('By!')
        } catch (e) {
            reject({
                message: 'Not Authorized',
                details: e
            })
        }
    })
}

function refreshToken(dataToken) {
    return new Promise((resolve, reject) => {
        try {
            let payloadToken = {}

            const tokens = store.getTokensByRefreshToken(dataToken.refreshToken)

            if (!tokens) return reject ({message: 'User Not Authorized'})

            payloadToken = auth.verify(tokens.access)

            store.deleteTokens(dataToken.refreshToken)

            let newTokens = {}
            newTokens.accessToken = auth.sign({sub: payloadToken.sub, roles: payloadToken.roles})
            newTokens.refreshToken = auth.signRefreshToken({sub: payloadToken.sub})

            store.setTokens(payloadToken.sub, newTokens.accessToken, newTokens.refreshToken)

            resolve(newTokens)
        } catch (e) {
            reject({
                message: 'Not Authorized',
                details: e
            })
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
            reject({
                message: 'Cannot get tokens',
                details: e
            })
        }
    })
}

function dump() {
    return new Promise((resolve, reject) => {
        try {
            store.dump()
            resolve('dumped!')
        } catch (e) {
            reject({
                message: 'Cannot dump',
                details: e
            })
        }
    })    
}

function deleteAllTokens() {
    return new Promise((resolve, reject) => {
        try {
            store.deleteAllTokens()
            resolve('All Tokens Deleted')
        } catch (e) {
            reject({
                message: 'Cannot delete tokens',
                details: e
            })            
        }
    })
}

function changepassword(datapass) {
    return new Promise(async (resolve, reject) => {
        try{
            let password = await userStore.getUserPassword(datapass.userid)

            await bcrypt.compare(datapass.oldpassword, password)

            password = await bcrypt.hash(datapass.newpassword, 5)

            await userStore.setUserPassword(datapass.userid, password)

            resolve('Password Changed')
        } catch (e) {
            reject({
                message: 'Error Updating Password',
                details: e
            })
        }
    })
}

function resetpassword() {
    return new Promise(async (resolve, reject) => {
        try{
            let password = await userStore.getUserPassword(datapass.userid)

            await bcrypt.compare(datapass.oldpassword, password)

            password = await bcrypt.hash(datapass.newpassword, 5)

            await userStore.setUserPassword(datapass.userid, password)

            resolve('Password Changed')
        } catch (e) {
            reject({
                message: 'Error Updating Password',
                details: e
            })
        }
    })
}

module.exports = {
    login: login,
    logout: logout,
    register: newUser,
    refreshtoken: refreshToken,
    getTokens,
    deleteAllTokens,
    changepassword,
    resetpassword,
    dump: dump
}
