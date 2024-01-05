import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import { useEffect, useState, useRef } from 'react'
// al ser un cliente temporal vamos a hacer todo en app, por que solo es un chat

function App() {

  const [nombre, setNombre] = useState(null)
  const [color, setColor] = useState(null)
  const NombreIngreso = useRef(null)
  const ColorIngreso = useRef(null)

  const [mensajes, setMensajes] = useState([])
  const [socket, setSocket] = useState(null)
  const [scrollAnterior, setScrollAnterior] = useState(0)

  useEffect(() => {

    // para el cliente, utilizamos io y pasamos la URL del servidor
    // esto de la libreria socket.io-client
    setSocket(io('http://localhost:1234'))
  }, []) 

  let mensaje = useRef(null)
  const cajaMensajes = useRef(null)
  const lastMensaje = useRef(null)
  // ESTE USE EFFECT ES IMPORTANTE
  // los eventos on tienen que activarse cada vez que el estado del socket cambia
  // de este modo, 
  useEffect(() => {
    if (socket) {
      
      socket.on('chat message', (msg) => {
        //console.log(msg)
        setMensajes(msg)
        // el socket off elimina el manejador de eventos que registramos
        // antes en el ON, debemos especificar su nombre, 
        // lo correcto es que se haga porque genera duplicaciones el no hacerlo
        // este comentario esta errado pero es util conoces que existe socket off 
        // para eliminar manejadores de eventos en algun momento
      })
    }
  }, [socket])
  useEffect(() => {
    if (lastMensaje.current && cajaMensajes.current.scrollTop >= scrollAnterior) {
       // esto me dice la altura del scroll de la caja de mensajes
      lastMensaje.current.scrollIntoView({behavior: 'smooth'})
      console.log(cajaMensajes.current.scrollTop)
      setScrollAnterior(cajaMensajes.current.scrollTop)
      console.log(nombre)
      }
  }, [mensajes,socket]) // cambia cada vez que o el socket o los mensajes se actualizan
  if (nombre) {
  return (
    <div className="App">
      <div className='chatBox'>

        <div ref={cajaMensajes} className='CajaMensajes'>
          {mensajes.map((men, key) => {
            return (
              <div key={key} ref={lastMensaje} className='mensg'>
                <p key={`${key} ${nombre}`} style={{
                  color: men.color 
                }}>{men.name}</p>
                <p key={key}>{men.message}</p>
              </div>
            )
          })}
        </div>

        <form className='sendBox' onSubmit={(event) => {
          event.preventDefault()
          if (mensaje.current.value !== '' && socket) {

            // el emit envia un evento y un valor al socket del servidor
            // el primer valor es el tipo de evento, que tomara el socket 
            // en el servidor para filtrar que deciciones tomar con esta
            socket.emit('chat message', {name: nombre, message: mensaje.current.value, color: color})
            mensaje.current.value = ''
          }
        }}>
          <input className='searchBox' ref={mensaje} type='text' placeholder='escribir mensaje...'>            
          </input>
          <button className='botonSend'>Enviar</button>
        </form>
      </div>
    </div>
    )} else {
      return (
        <div>
          <form onSubmit={(event) => {
            event.preventDefault()
            setNombre(NombreIngreso.current.value)
            setColor(ColorIngreso.current.value)
            console.log(ColorIngreso.current.value)
          }}>
            <h4>Ingresa el nombre que vas a usar ahora</h4>
            <input ref={NombreIngreso} type='text'></input>
            <input ref={ColorIngreso} type="color"></input>
          </form>
        </div>
      )
    }
}

export default App;
