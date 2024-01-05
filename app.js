// iniciamos el servidor con express

// en esta manejaremos WEBSOCKETS, que son mas utiles para un chat por ejemplo
// ya que actua en tiempo real y la informacion se pasa de manera unidireccional
// ya que si utilizaramos http puro, necesitariamos hacer polling u otra tecnica
// menos optima que usar websockets
import express from "express";

import { CorsConf2 } from "./middleware/CORS.js";
// usamos morgan que es un logger, es una parte crucial de cualquier aplicación, 
// ya que permite rastrear y registrar eventos que ocurren durante la ejecución de un programa. 
// Esto puede incluir errores, excepciones, información de estado, etc.

import logger from 'morgan'

// para crear el websocket, usaremos socket.io, otro paquete util para esto
// debemos importar dos dependencias para que funcione
// Server de socket.io y createServer de node:http
import { Server } from "socket.io";
import { createServer } from "node:http"


import { MensajesControler } from "./controladores/mensajes.js";
import { UsuariosControler } from "./controladores/usuarios.js";

const port = process.env.PORT ?? 1234
const app = express()

const mensajes = []

app.use((req, res, next) => {
    CorsConf2(req, res)
    next()
})


const server = createServer(app) // creamos servidor http usando el app creado de express
// io viene de in y out, entrada y salida, referenciando a los sockets

// la clase Server de socket.io se instancia pasandole un servidor http

// ademas, a partir de la version 4.0, se le debe pasar el origen 
// donde vendran las peticiones, del siguiente modo
// para mas info de esto consultar en https://socket.io/docs/v4/handling-cors/
const io = new Server(server, {
    cors: {
        origin: "https://pepinillojr.github.io"
    }
})

// ahora el servidor io responde a los tipicos metodos de node y los callbacks,
// tal como .on, y demas

// por ejemplo, existe el evento connection, que responde a cuando se conecta
// un cliente al servidor

// podemos recuperar el socket en el callback
// y de ahi recuperar ciertos eventos


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



// el logger debe ser llamado antes de las request, por lo que lo usamos
// como middleware

// llamamos al logger en modo desarrollo 
// formato predefinido que proporciona un registro detallado de todas las solicitudes realizadas a tu aplicación. 
// Este formato es útil durante el desarrollo porque proporciona información detallada sobre cada solicitud, 
// incluyendo el método HTTP, la URL solicitada, el código de estado HTTP, el tiempo de respuesta, entre otros detalles

app.use(logger('dev'))


app.get('/', (req, res) => {
    res.send('<h1>Esto es el servidor<h1>')
})

// como creamos el server, el listen no viene de la mano de express y su app
// si no del servidor que creamos con ella

server.listen(port, () => {
    console.log(`escuchando en http://localhost:${port}/`)
})