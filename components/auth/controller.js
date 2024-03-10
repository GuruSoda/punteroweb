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
            dataUser = await store.getAll(dataLogin.email)
            console.log(dataUser)
        } catch (e) {
            reject('No autorizado')
        }

        try {
            const result = await bcrypt.compare(dataLogin.password, dataUser.password)

            if (result) {
                resolve(auth.sign({userid: dataUser.userid, roles: dataUser.roles}))
            } else {
                reject('User or Pass incorrect.')
                // throw new Error('Informacion invalida');
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
            await store.add(dataUser)
            await store.addRoleToUser(dataUser.email, 'user')
            resolve('User Added')
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
        let role = await store.getRole('admin')
        if (!role) await store.addRole('admin')
        
        role = await store.getRole('user')
        if (!role) await store.addRole('user')
        
        // Agrego usuario por default
        let admin = await store.get('admin@localhost')
        if (!admin) {
            const nuevo = await newUser({
                email: "admin@localhost",
                password: "admin",
                username: "admin",
                name: "Admin",
                lastname: "User"
            })
        }

        // Le asigno al usuario admin que sea administrador
        await store.addRoleToUser('admin@localhost', 'admin')
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    login: login,
    logout: logout,
    register: newUser
}
