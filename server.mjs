import express from 'express'
import './inyect.env.mjs'
import rutasComponentes from './modules/componentes/rutas.componentes.mjs'

const PUERTO = process.env.PUERTO || 3000
const app = express()

app.use(express.static('front'))
app.use(express.json())
app.use('/api/v1', rutasComponentes)

app.listen(PUERTO, () => {
    console.log(`http://localhost:${3000}`)
})