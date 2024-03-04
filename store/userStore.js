const userModel = require('./userModel')

const stmtAddUser = userModel.prepare('insert into user(userid, username, email, name, lastname) values(?, ?, ?, ?, ?)')
const stmtAddPassword = userModel.prepare('insert into password(userid, password) values(?, ?)')
const stmtDeletePassword = userModel.prepare('delete from password where userid = ?')
const stmtEmailtoUserID = userModel.prepare('select userid from user where email = ?')
const stmtUserIDtoEmail = userModel.prepare('select email from user where userid = ?')
const stmtGetUser = userModel.prepare('select username, name, lastname, email from user where email = ?')
const stmtGetFullUser = userModel.prepare('select u.userid, username, name, lastname, email, password from user u,password p where u.userid==p.userid and u.email = ?')
const stmtAllUsers = userModel.prepare('select userid, username, name, lastname, email from user')

function addUser (dataUser) {
    return new Promise((resolve, reject) => {
        try {
            const outAddPassword = stmtAddPassword.run(dataUser.userid, dataUser.password)
        } catch (error) {
            reject({code: error.code, mensaje: error.message})
        }

        try {
            const outUser = stmtAddUser.run(dataUser.userid, dataUser.username, dataUser.email, dataUser.name, dataUser.lastname)
        } catch(error) {
            const outDeletePassword = stmtDeletePassword.run(dataUser.userid)
            reject({code: error.code, mensaje: error.message})
        }
        
        resolve('ok')
    })
}

function deleteUser () {

}

function modifyUser() {

}

function listUsers() {
    return new Promise((resolve, reject) => {
        try {
            const out = stmtAllUsers.all()
            resolve(out)
        } catch (error) {
            reject({code: error.code, mensaje: error.message})
        }
    })
}

function getUser(username) {
    return new Promise((resolve, reject) => {
        try {
            const user = stmtGetUser.get(username)
            resolve(user)
        } catch (error) {
            reject({code: error.code, mensaje: error.message})
        }
    })
}

function getFullUser(username) {
    return new Promise((resolve, reject) => {
        try {
            const user = stmtGetFullUser.get(username)
            resolve(user)
        } catch (error) {
            reject({code: error.code, mensaje: error.message})
        }
    })
}

function getIDfromEmail(email) {    
    return new Promise((resolve, reject) => {
        try {
            const userid = stmtEmailtoUserID.get(email)
            resolve(userid)
        } catch (error) {
            reject({code: error.code, mensaje: error.message})
        }
    })
}

function getEmailfromID(id) {    
    return new Promise((resolve, reject) => {
        try {
            const email = stmtUserIDtoEmail.get(id)
            resolve(email)
        } catch (error) {
            reject({code: error.code, mensaje: error.message})
        }
    })
}

module.exports = {
    add: addUser,
    del: deleteUser,
    modify: modifyUser,
    list: listUsers,
    get: getUser,
    getAll: getFullUser,
    getID: getIDfromEmail,
    getEmail: getEmailfromID
}
