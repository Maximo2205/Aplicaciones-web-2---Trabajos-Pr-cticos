import './inyect.env.mjs'

import express from 'express'
import cookieParser from 'cookie-parser'

import rutasUsuarios from './modules/usuarios/rutas.usuarios.mjs'
import rutasComponentes from './modules/componentes/rutas.componentes.mjs'
//import * as validaciones from './middleware/validaciones.mjs'

const PUERTO = process.env.PUERTO || 3000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.FIRMA_COOKIE))

app.use('api/v1', rutasUsuarios)
app.use('/api/v1', rutasComponentes)


//app.use('/admin', validaciones.comprobarToken, express.static('./front/front-admin'))
//app.use('/login', express.static('./front/front-login'))
app.use(express.static('./front/front-user'))


app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use((err, req, res, next) => {
    console.error('Error no controlado en la aplicación:', err);
    res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor' });
})

app.listen(PUERTO, () => {
    console.log(`http://localhost:${3000}`)
})