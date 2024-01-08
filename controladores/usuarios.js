let Usuarios = []


export class UsuariosControler {
    static async RecibirUsuarios (io) {
        io.on("connection", (socket) => {
            console.log("usuario conectado")

            socket.on('nuevo usuario', (userTupla) => {
                while (true) {
                let nuevaId = userTupla[0].name + (Math.random() * (99999 - 10000) + 10000).toString()
                if (Usuarios.find(user => user.id === nuevaId) !== null) {
                    const nuevo_usuario = {id: nuevaId, socketID: socket.id, name: userTupla[0].name, color: userTupla[0].color}
                    socket.emit(`nuser ${userTupla[1] + nuevo_usuario.name}`, nuevo_usuario)
                    Usuarios.push(nuevo_usuario)
                    break
                } else {
                    nuevaId = userTupla[0].name + (Math.random() * (99999 - 10000) + 10000).toString()
                }
                }
                io.emit('userslen', Usuarios.length)
            })

            socket.on('get-users-lenght', () => {
               socket.emit('userslen', Usuarios.length)
            })

            socket.on('disconnect', () => {
                console.log("usuario desconectado")
                Usuarios = Usuarios.filter(usuario => usuario.socketID !== socket.id) 
                io.emit('userslen', Usuarios.length) // aca se usa io en vez de socket porque socket deja de existir con la desconexion
            })
        })
    }
}