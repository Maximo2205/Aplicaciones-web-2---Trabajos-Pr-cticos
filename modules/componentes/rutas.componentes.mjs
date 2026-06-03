import express from 'express'
import * as controlador from './controlador.componentes.mjs'
import { agregarComponente } from './modelo.componentes.mjs'

const rutasComponentes = express.Router()

//Get
rutasComponentes.get('/componentes', controlador.obtenerComponentes)

//Get
rutasComponentes.get('/componentes/:id', controlador.obtenerComponentePorId)

//Post
rutasComponentes.post('/componentes', controlador.agregarComponente)

//Put
rutasComponentes.put('/componentes/:id', controlador.editarComponente)

//Delete
rutasComponentes.delete('/componentes/:id', controlador.borrarComponente)

export default rutasComponentes