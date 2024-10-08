
import express from "express";

import { CorsConf2 } from "./middleware/CORS.js";
import logger from 'morgan'
import { Server } from "socket.io";
//import { createServer } from "node:https"
import { createServer } from "node:http"

import { MensajesControler } from "./controladores/mensajes.js";
import { UsuariosControler } from "./controladores/usuarios.js";
import { readFileSync } from "node:fs";

const port = process.env.PORT ?? 3000
const app = express()

app.use((req, res, next) => {
    CorsConf2(req, res)
    next()
})


//const server = createServer({cert: readFileSync('server.cer'), key: readFileSync('server.key')}, app) 
const server = createServer(app) 

// ademas, a partir de la version 4.0, se le debe pasar el origen 
// donde vendran las peticiones, del siguiente modo
// para mas info de esto consultar en https://socket.io/docs/v4/handling-cors/
const io = new Server(server, {
    cors: {
        //origin: "https://pepinillojr.github.io"
        origins: ['http://localhost:3000', "https://pepinillojr.github.io", "'http://localhost:3001'"],
        transports: ['websocket']
    }
})


UsuariosControler.RecibirUsuarios(io)
MensajesControler.RecibirMensajes(io)

/*
io.on("connection", (socket) => {
    // a partir de aqui, podemos manejar los enventos del socket
    console.log("usuario conectado")


    socket.on('disconnect', () => {
        console.log("usuario desconectado")
    })
    
    // algunos eventos son personalizados y enviados desde el cliente
    // en este caso, podemos llamarlo chat message
    socket.on('chat message', (msg) => {
        // puedo tomar msg que es el valor del envio (emit del cliente)
        console.log("mensaje: " + msg.name + msg.message + msg.color)
        // luego, podemos emitir el propio mensaje a todas las conecciones
        // esto permitira al resto de clientes ver el mensaje
        // entonces, NO USANDO EL SOCKET, si no el IO que es el server
        mensajes.push(msg)
        io.emit('chat message', mensajes)
    })

    socket.on('getMessages', () => {
        io.emit('chat message', mensajes)
    })
})
*/


app.use(logger('dev'))


app.get('/', (req, res) => {
    res.send('<h1>Esto es el servidor<h1>')
})

server.listen(port, "0.0.0.0", () => {
    console.log(`escuchando en https://localhost:${port}/`)
})
