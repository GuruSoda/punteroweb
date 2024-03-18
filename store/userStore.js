const userModel = require('./userModel')
const userError = require('./userError')

const stmtAddUser = userModel.prepare('insert into user(userid, username, email, name, lastname) values(?, ?, ?, ?, ?)')
const stmtAddPassword = userModel.prepare('insert into password(userid, password) values(?, ?)')
const stmtDeletePassword = userModel.prepare('delete from password where userid = ?')
const stmtGetUserPassword = userModel.prepare('select password from password where userid = ?')
const stmtDeleteUser = userModel.prepare('delete from user where userid = ?')
const stmtUpdateUser = userModel.prepare('update user set username=?, name=?, lastname=?, email=? where userid=?')
const stmtEmailtoUserID = userModel.prepare('select userid from user where email = ?')
const stmtUserIDtoEmail = userModel.prepare('select email from user where userid = ?')
const stmtListEmail = userModel.prepare('select email from user')
const stmtListAllUsers = userModel.prepare('select userid, username, name, lastname, email, createdat from user')
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
        try {
            const userid = getUserIDfromEmail(dataUser.email)
            if (userid) return 'Email exists'
        } catch (error) {
            throw userError(error.message, error.code)
        }

        try {
            const outAddPassword = stmtAddPassword.run(dataUser.userid, dataUser.password)
            const outUser = stmtAddUser.run(dataUser.userid, dataUser.username, dataUser.email, dataUser.name, dataUser.lastname)
        } catch(error) {
            const outDeletePassword = stmtDeletePassword.run(dataUser.userid)
            const outDeleteUser = stmtDeleteUser.run(dataUser.userid)
            const outDeleteRoleUser = stmtDeleteRoleUser.run(dataUser.userid)
            throw userError(error.message, error.code)
        }

        return {
            userid: dataUser.userid,
            username: dataUser.username,
            email: dataUser.email,
            name: dataUser.name,
            lastname: dataUser.lastname
        }
}

function deleteUser (userid) {
        try {
            // borro los roles asociados al usuario
            const output = stmtDeleteRolesUser.run(user.userid)
            // borro el usuario
            stmtDeleteUser.run(user.userid)

            return 'User Deleted'
        } catch (error) {
            if (typeof error === 'string') return error
            throw userError(error.message, error.code)
        }
}

function updateUser(dataUser) {
        try {
            let user = stmtUpdateUser.run(dataUser.username, dataUser.name, dataUser.lastname, dataUser.email, dataUser.userid)

            user = getUser(dataUser.userid)
            console.log(user)
            return user
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function listUsers() {
        try {
            let out = []
            out = stmtListAllUsers.all()

            let usuarios = []
            for (const item of out){
                usuarios.push(getUser(item.userid))
            }            
            return usuarios
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function getUser(userid) {
        try {
            let user = stmtGetUser.get(userid)
            if (user) user.roles = getRolesUser(user.email)
            return user
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function getUserPassword(userid) {
        try {
            let pass = stmtGetUserPassword.get(userid)
            return (pass && pass.password) ? pass.password : undefined
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function getUserIDfromEmail(email) {
        try {
            const dataUser = stmtEmailtoUserID.get(email)
            return (dataUser && dataUser.userid) ? dataUser.userid : undefined
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function getEmailfromID(id) {
        try {
            const user = stmtUserIDtoEmail.get(id)
            return (user && user.email) ? user.email : undefined
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function newRole(dataRole) {
        try {
            const role = stmtAddRole.run(dataRole.name, dataRole.description)
            return (role.changes === 1) ? dataRole : 'ok'
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function addRoleToUser(role, userid) {
        try {
            const dataRole = getRole(role)
            const output = stmtAddUserRole.run(userid, dataRole.id)
            return 'Role ' + role + ' added to user ' + userid
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function updateRolesUser(userid, roles) {
        try {
            const output = stmtDeleteRolesUser.run(userid)

            let rolesAdded = []

            for (const rol of roles) {
                addRoleToUser(rol, userid)
                rolesAdded.push(rol)
            }

            return rolesAdded
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function getRole(name) {
        try {
            return stmtGetRole.get(name)
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function getListRoles(name) {
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

            return roleuser
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function getRolesUser(email) {
        try {
            const roles = stmtGetRolesUser.all(email)

            let roleuser = []

            for (const rol of roles) {
                roleuser.push(rol.name)
            }

            return roleuser
        } catch (error) {
            throw userError(error.message, error.code)
        }
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
}
