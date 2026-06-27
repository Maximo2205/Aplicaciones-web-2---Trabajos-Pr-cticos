import express from 'express'
import * as controlador from './controlador.usuarios.mjs'

const rutasUsuarios = express.Router()

//Modulo usuarios
//POST
rutasUsuarios.post('/autenticar', controlador.autenticar)

// GET - Logout
rutasUsuarios.get('/cerrar-sesion', controlador.cerrarSesion)

export default rutasUsuarios