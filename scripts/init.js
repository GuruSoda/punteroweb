const pointer = require('../components/punteroweb/controller')
const user = require('../components/auth/controller')

user.register({
    username: 'fabricio',
    email: 'fabricio.rossi@gmail.com',
    name: 'Fabricio',
    lastname: 'Rossi',
    password: 'profugos'
    }
)

user.register({
    username: 'bruno',
    email: 'bruno.joaquin.rossi@hotmail.com',
    name: 'Bruno',
    lastname: 'Rossi',
    password: 'bruno2014'
    }
)

pointer.add({
    userid: '',
    url: 'www.sega.com',
    title: 'Video Juegos Sega',
    description: 'Home page Sega inc.',
    starts: 5,
    labels: ["Juegos", "Sega", "Vicios"]
    }
)
