const userModel = require('./userModel')
const userError = require('./userError')

const stmtAddUser = userModel.prepare('insert into user(userid, username, email, name, lastname) values(?, ?, ?, ?, ?)')
const stmtDeleteUser = userModel.prepare('delete from user where userid = ?')
const stmtAddPassword = userModel.prepare('insert into password(userid, password) values(?, ?)')
const stmtDeletePassword = userModel.prepare('delete from password where userid = ?')
const stmtGetUserPassword = userModel.prepare('select password from password where userid = ?')
const stmtUpdateUser = userModel.prepare('update user set username=?, name=?, lastname=?, email=? where userid=?')
const stmtGetUserByEmail = userModel.prepare('select userid from user where email = ?')
const stmtGetUserByUserID = userModel.prepare('select email from user where userid = ?')
const stmtGetUserByUserName = userModel.prepare('select username, email, userid from user where username = ?')
const stmtGetAllEmail = userModel.prepare('select email from user')
const stmtGetAllUsers = userModel.prepare('select userid, username, name, lastname, email, createdat from user')
const stmtGetUser = userModel.prepare('select userid, username, name, lastname, email, createdat from user where userid = ?')
//
const stmtAddRole = userModel.prepare('insert into role (name, description) values(?, ?)')
const stmtDeleteRoleUser = userModel.prepare('delete from user_role where userid = ? and roleid = ?')
const stmtDeleteRolesUser = userModel.prepare('delete from user_role where userid = ?')
const stmtGetRole = userModel.prepare('select id, name, description from role where name = ?')
const stmtGetRoles = userModel.prepare('select id, name, description from role')
const stmtAddUserRole = userModel.prepare('insert or ignore into user_role (userid, roleid) values (?, ?)')
const stmtGetRolesUser = userModel.prepare('select r.id, r.name, r.description from role r, user_role ur, user u where r.id = ur.roleid and u.userid = ur.userid and u.email == ?')
//

function addUser (dataUser) {

        try {
            const outUser = stmtAddUser.run(dataUser.userid, dataUser.username, dataUser.email, dataUser.name, dataUser.lastname)
            const outAddPassword = stmtAddPassword.run(dataUser.userid, dataUser.password)
        } catch(error) {
            const initialError = error
            try {
                const outDeletePassword = stmtDeletePassword.run(dataUser.userid)
                const outDeleteRolesUser = stmtDeleteRolesUser.run(dataUser.userid)
                const outDeleteUser = stmtDeleteUser.run(dataUser.userid)
            } catch (e) {
                console.log('Error limpiando...')
            }
            throw userError(initialError.message, initialError.code)
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
            const output = stmtDeleteRolesUser.run(userid)
            // borro el usuario
            stmtDeleteUser.run(userid)

            return 'User Deleted'
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function updateUser(dataUser) {
        try {
            let user = stmtUpdateUser.run(dataUser.username, dataUser.name, dataUser.lastname, dataUser.email, dataUser.userid)

            user = getUser(dataUser.userid)
            return user
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function listUsers() {
        try {
            let out = []
            out = stmtGetAllUsers.all()

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

function getUserByEmail(email) {
        try {
            const dataUser = stmtGetUserByEmail.get(email)
            return (dataUser && dataUser.userid) ? dataUser.userid : undefined
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function getUserByUserID(userid) {
        try {
            const user = stmtGetUserByUserID.get(userid)
            return (user && user.email) ? user.email : undefined
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function getUserByUserName(username) {
    try {
        const user = stmtGetUserByUserName.get(username)
        return (user) ? user : undefined
    } catch (error) {
        throw userError(error.message, error.code)
    }    
}

function newRole(dataRole) {
        try {
            const role = stmtAddRole.run(dataRole.name, dataRole.description)
            return (role.changes === 1) ? dataRole : undefined
        } catch (error) {
            throw userError(error.message, error.code)
        }
}

function addRoleToUser(role, userid) {
        try {
            const dataRole = getRole(role)
            if (!dataRole) throw userError('Role not found')
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

function userToObject(recordUser) {
    if (!recordUser) return undefined

    return {
        userID: recordUser.userid,
        userName: recordUser.username,
        email: recordUser.email,
        name: recordUser.name,
        lastName: recordUser.lastname,
        createdAt: recordUser.createdat        
    }
}

function dump() {
    let stmt
    let out = []
    
    stmt = userModel.prepare('select * from user')
    out = stmt.all()
    console.table(out)

    stmt = userModel.prepare('select * from password')
    out = stmt.all()
    console.table(out)

    stmt = userModel.prepare('select * from role')
    out = stmt.all()
    console.table(out)

    stmt = userModel.prepare('select * from user_role')
    out = stmt.all()
    console.table(out)
}

module.exports = {
    add: addUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    list: listUsers,
    getUser: getUser,
    getUserPassword: getUserPassword,
    getUserByEmail: getUserByEmail,
    getUserByUserID: getUserByUserID,
    getUserByUserName: getUserByUserName,
    addRole: newRole,
    addRoleToUser: addRoleToUser,
    getRole: getRole,
    getListRoles: getListRoles,
    getRolesUser: getRolesUser,
    updateRolesUser: updateRolesUser,
    dump: dump
}
