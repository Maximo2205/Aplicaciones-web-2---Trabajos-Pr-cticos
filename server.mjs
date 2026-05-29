import express from 'express'
import rutasComponentes from './modules/componentes/rutas.componentes.mjs'

const PUERTO = 3000
const app = express()

app.use(express.static('front'))

app.use('/api/v1', rutasComponentes)

app.listen(PUERTO, () => {
    console.log(`http://localhost:${3000}`)
})