import express from 'express'
import * as controlador from './controlador.componentes.mjs'
import * as validaciones from '../../middleware/validaciones.mjs'

const rutasComponentes = express.Router()

//Get
rutasComponentes.get('/componentes', controlador.obtenerComponentes)

//Get
rutasComponentes.get('/componentes/:id', controlador.obtenerComponentePorId)

//Post
rutasComponentes.post('/componentes', validaciones.comprobarToken, validaciones.validarDatosComponente, controlador.agregarComponente)

//Put
rutasComponentes.put('/componentes/:id', validaciones.comprobarToken, validaciones.validarDatosComponente, controlador.editarComponente)

//Delete
rutasComponentes.delete('/componentes/:id', validaciones.comprobarToken, controlador.borrarComponente)

export default rutasComponentes