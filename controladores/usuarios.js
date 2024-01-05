const Usuarios = {}


export class UsuariosControler {
    static async RecibirUsuarios (io) {
        io.on("connection", (socket) => {
            console.log("usuario conectado")
            socket.on('disconnect', () => {
                console.log("usuario desconectado")
            })
        })
    }
}