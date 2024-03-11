const userModel = require('./userModel')

const stmtAddUser = userModel.prepare('insert into user(userid, username, email, name, lastname) values(?, ?, ?, ?, ?)')
const stmtAddPassword = userModel.prepare('insert into password(userid, password) values(?, ?)')
const stmtDeletePassword = userModel.prepare('delete from password where userid = ?')
const stmtGetUserPassword = userModel.prepare('select password from password where userid = ?')
const stmtDeleteUser = userModel.prepare('delete from user where userid = ?')
const stmtEmailtoUserID = userModel.prepare('select userid from user where email = ?')
const stmtUserIDtoEmail = userModel.prepare('select email from user where userid = ?')
const stmtListEmail = userModel.prepare('select email from user')
const stmtGetUser = userModel.prepare('select userid, username, name, lastname, email, createdat from user where userid = ?')
const stmtGetFullUser = userModel.prepare('select u.userid, username, name, lastname, email, password from user u,password p where u.userid==p.userid and u.email = ?')
const stmtAllUsers = userModel.prepare('select userid, username, name, lastname, email from user')
//
const stmtAddRole = userModel.prepare('insert into role (name) values(?)')
const stmtDeleteRoleUser = userModel.prepare('delete from user_role where userid = ?')
const stmtGetRole = userModel.prepare('select id, name, description from role where name = ?')
const stmtGetRoles = userModel.prepare('select id, name, description from role')
const stmtAddUserRole = userModel.prepare('insert or ignore into user_role (userid, roleid) values (?, ?)')
const stmtGetRolesUser = userModel.prepare('select r.id, r.name, r.description from role r, user_role ur, user u where r.id = ur.roleid and u.userid = ur.userid and u.email == ?')

function addUser (dataUser) {
    return new Promise(async (resolve, reject) => {
        try {
            const userid = await getUserIDfromEmail(dataUser.email)
            if (userid) return reject('Email exists')
        } catch (error) {
            return reject({code: error.code, message: error.message})
        }

        try {
            const outAddPassword = stmtAddPassword.run(dataUser.userid, dataUser.password)
            const outUser = stmtAddUser.run(dataUser.userid, dataUser.username, dataUser.email, dataUser.name, dataUser.lastname)
        } catch(error) {
            const outDeletePassword = stmtDeletePassword.run(dataUser.userid)
            const outDeleteUser = stmtDeleteUser.run(dataUser.userid)
            const outDeleteRoleUser = stmtDeleteRoleUser.run(dataUser.userid)            
            return reject({code: error.code, message: error.message})
        }

        resolve({
            userid: dataUser.userid,
            password: dataUser.password,
            username: dataUser.username,
            email: dataUser.email,
            name: dataUser.name,
            lastname: dataUser.lastname
        })
    })
}

function deleteUser (userid) {
    return new Promise(async (resolve, reject) => {
        try {
            const out = stmtDeleteUser.run(userid)
            if (out.changes === 1) resolve('User Deleted')
            else resolve('User not deleted o not found')
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function modifyUser() {

}

function listUsers() {
    return new Promise(async (resolve, reject) => {
        try {
            let out = []
            out = stmtListEmail.all()

            let usuarios = []
            for (const item of out){
                const userid = await getUserIDfromEmail(item.email)
                usuarios.push(await getUser(userid))
            }            
            resolve(usuarios)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function getUser(userid) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = stmtGetUser.get(userid)
            if (user) user.roles = await getRolesUser(user.email)
            resolve(user)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function getUserPassword(userid) {
    return new Promise(async (resolve, reject) => {
        try {
            let pass = stmtGetUserPassword.get(userid)
            if (pass.password) resolve(pass.password)
            else resolve('')
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function getUserIDfromEmail(email) {
    return new Promise((resolve, reject) => {
        try {
            const datauser = stmtEmailtoUserID.get(email)
            if (datauser.userid) resolve(datauser.userid)
            else resolve('')
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function getEmailfromID(id) {    
    return new Promise((resolve, reject) => {
        try {
            const user = stmtUserIDtoEmail.get(id)
            resolve(user.email)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function newRole(name) {
    return new Promise((resolve, reject) => {
        try {
            const role = stmtAddRole.run(name)
            resolve('ok')
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function addRoleToUser(email, role) {
    return new Promise(async (resolve, reject) => {
        try {
            const userid = await getUserIDfromEmail(email)
            const dataRole = await getRole(role)
            const output = stmtAddUserRole.run(userid, dataRole.id)

            resolve('Role ' + role + ' added to user ' + email)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function getRole(name) {
    return new Promise((resolve, reject) => {
        try {
            const role = stmtGetRole.get(name)
            resolve(role)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function getListRoles(name) {
    return new Promise((resolve, reject) => {
        try {
            const role = stmtGetRoles.all()
            let roleuser = []

            roles.forEach(rol => {
                roleuser.push(rol.name)
            });

            resolve(roleuser)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function getRolesUser(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const roles = stmtGetRolesUser.all(email)

            let roleuser = []

            roles.forEach(rol => {
                roleuser.push(rol.name)
            });

            resolve(roleuser)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

module.exports = {
    add: addUser,
    deleteUser: deleteUser,
    modify: modifyUser,
    list: listUsers,
    getUser: getUser,
    getUserID: getUserIDfromEmail,
    getUserEmail: getEmailfromID,
    getUserPassword: getUserPassword,
    addRole: newRole,
    addRoleToUser: addRoleToUser,
    getRole: getRole,
    getListRoles: getListRoles,
    getRolesUser: getRolesUser,
}
