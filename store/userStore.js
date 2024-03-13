const userModel = require('./userModel')

const stmtAddUser = userModel.prepare('insert into user(userid, username, email, name, lastname) values(?, ?, ?, ?, ?)')
const stmtAddPassword = userModel.prepare('insert into password(userid, password) values(?, ?)')
const stmtDeletePassword = userModel.prepare('delete from password where userid = ?')
const stmtGetUserPassword = userModel.prepare('select password from password where userid = ?')
const stmtDeleteUser = userModel.prepare('delete from user where userid = ?')
const stmtUpdateUser = userModel.prepare('update user set username=?, name=?, lastname=?, email=? where userid=?')
const stmtEmailtoUserID = userModel.prepare('select userid from user where email = ?')
const stmtUserIDtoEmail = userModel.prepare('select email from user where userid = ?')
const stmtListEmail = userModel.prepare('select email from user')
const stmtGetUser = userModel.prepare('select userid, username, name, lastname, email, createdat from user where userid = ?')
//
const stmtAddRole = userModel.prepare('insert into role (name, description) values(?, ?)')
const stmtDeleteRoleUser = userModel.prepare('delete from user_role where userid = ? and roleid = ?')
const stmtDeleteRolesUser = userModel.prepare('delete from user_role where userid = ?')
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
            const user = await getUser(userid)
            if (!user.userid) reject('User not found')

            // borro el usuario
            stmtDeleteUser.run(user.userid)
            // borro los roles asociados al usuario
            stmtDeleteRoleUser.run(user.userid)

            resolve('User Deleted')
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function updateUser(dataUser) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = stmtUpdateUser.run(dataUser.username, dataUser.name, dataUser.lastname, dataUser.email, dataUser.userid)
            user = await getUser(dataUser.userid)
            resolve(user)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
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
            if (pass && pass.password) resolve(pass.password)
            else resolve(undefined)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function getUserIDfromEmail(email) {
    return new Promise((resolve, reject) => {
        try {
            const dataUser = stmtEmailtoUserID.get(email)
            if (dataUser && dataUser.userid) resolve(dataUser.userid)
            else resolve(undefined)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function getEmailfromID(id) {    
    return new Promise((resolve, reject) => {
        try {
            const user = stmtUserIDtoEmail.get(id)
            if (user && user.email)resolve(user.email)
            else resolve(undefined)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function newRole(dataRole) {
    return new Promise((resolve, reject) => {
        try {
            const role = stmtAddRole.run(dataRole.name, dataRole.description)
            if (role.changes === 1) resolve(dataRole)
            resolve('ok')
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function addRoleToUser(role, userid) {
    return new Promise(async (resolve, reject) => {
        try {
            const dataRole = await getRole(role)
            const output = stmtAddUserRole.run(userid, dataRole.id)
            resolve('Role ' + role + ' added to user ' + userid)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

function updateRolesUser(userid, roles) {
    return new Promise(async (resolve, reject) => {
        try {
            const output = stmtDeleteRolesUser.run(userid)

            let rolesAdded = []

            for (const rol of roles) {
                await addRoleToUser(rol, userid)
                rolesAdded.push(rol)
            }

            resolve(rolesAdded)
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

function deleteRoleUser(role, userid) {
    return new Promise((resolve, reject) => {
        try {
            resolve('Not Implemented')
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

            for (const rol of role){
                dataRole = {}

                dataRole.id = rol.id
                dataRole.name = rol.name
                dataRole.description = rol.description

                roleuser.push(dataRole)
            }

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

            for (const rol of roles) {
                roleuser.push(rol.name)
            }

            resolve(roleuser)
        } catch (error) {
            reject({code: error.code, message: error.message})
        }
    })
}

module.exports = {
    add: addUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
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
    updateRolesUser: updateRolesUser,
    deleteRoleUser: deleteRoleUser,
}
