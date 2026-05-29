import express from 'express'
import * as controlador from './controlador.componentes.mjs'

const rutasComponentes = express.Router()

//Get
rutasComponentes.get('/componentes', controlador.obtenerComponentes)

//Get
rutasComponentes.get('/componentes/:id', controlador.obtenerComponentePorId)

//Post
//rutasComponentes.post('/componentes')

//Put
//rutasComponentes.put('/componentes/:id')

//Delete
//rutasComponentes.delete('/componentes/:id')

export default rutasComponentes