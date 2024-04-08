const config = require('../config')
const db = require('../db')

db.conectar(config.database.filedb)

const user = require('../components/auth/controller')
const pointer = require('../components/punteroweb/controller')

async function main () {

    let nuevo_puntero, nuevo_usuario
    try {
        nuevo_usuario = await user.register({
            username: 'fabricio',
            email: 'fabricio.rossi@gmail.com',
            name: 'Fabricio',
            lastname: 'Rossi',
            password: 'profugos'
            }
        )

        console.log('fabricio:', nuevo_usuario)

        nuevo_puntero = await pointer.add({
            url: 'www.google.com.ar',
            title: 'Busncando Google',
            description: 'pagina principal de google',
            starts: 5,
            labels: ["Busquedas", "intentos"],
            userid: nuevo_usuario.userid
            }
        )

        nuevo_usuario = await user.register({
            username: 'bruno',
            email: 'bruno.joaquin.rossi@hotmail.com',
            name: 'Bruno',
            lastname: 'Rossi',
            password: 'bruno2014'
            }
        )

        console.log('bruno:', nuevo_usuario)

        nuevo_puntero = await pointer.add({
            url: 'www.sega.com',
            title: 'Video Juegos Sega',
            description: 'Home page Sega inc.',
            starts: 5,
            labels: ["Juegos", "Sega", "Vicios"],
            userid: nuevo_usuario.userid
            }
        )

        console.log('sega:', nuevo_puntero)

        nuevo_puntero = await pointer.add({
            url: 'www.nintendo.com',
            title: 'Video Juegos Nintendo',
            description: 'Home page Nintendo inc.',
            starts: 5,
            labels: ["Juegos", "Nintendo", "Vicios", "SNES"],
            userid: nuevo_usuario.userid
            }
        )

        console.log('sega:', nuevo_puntero)
    } catch (err) {
        console.error('Error:', err.userMessage)
    }
}

main()
