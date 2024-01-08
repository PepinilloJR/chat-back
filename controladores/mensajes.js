const Mensajes = []

export class MensajesControler {
    static async RecibirMensajes (io) {
        io.on("connection", (socket) => {
            
            socket.on('chat message', (msg) => {
                //console.log("mensaje: " + msg.name + msg.message + msg.Color)
                console.log(msg)
                Mensajes.push(msg)
                io.emit('chat message', Mensajes)
            })
        
            socket.on('getMessages', () => {
                io.emit('chat message', Mensajes)
            })
        })

    }
}