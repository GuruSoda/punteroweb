const store = require('../../store/userStore')
const auth = require('../../auth')
const bcrypt = require('bcrypt')
const nanoid = require('nanoid').customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')

function login(dataLogin) {
    return new Promise(async (resolve, reject) => {
        if (!dataLogin.email) reject('email is required.')
        if (!dataLogin.password) reject('password is required.')

        let  dataUser = {}
        try {
            dataUser = await store.getAll(dataLogin.email)
        } catch (e) {
            reject('No autorizado');
        }

        try {
            const result = await bcrypt.compare(dataLogin.password, dataUser.password)

            if (result) {
                const userID = await store.getID(dataLogin.email)

                resolve(auth.sign({userid: userID}))
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
        dataUser.password = await bcrypt.hash(dataUser.password, 5);

        store.add(dataUser)
            .then(message => resolve(message))
            .catch(message => reject(message))
    })
}

module.exports = {
    login: login,
    register: newUser
}
