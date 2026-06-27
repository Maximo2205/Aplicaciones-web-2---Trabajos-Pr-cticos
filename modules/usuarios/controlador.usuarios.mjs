import * as modelo from './modelo.usuarios.mjs'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export async function autenticar(req, res) {
    try {
        const { usuario, pass } = req.body
        const usuarioDB = await modelo.obtenerUsuario(usuario)

        if (!usuarioDB) {
            return res.status(401).json({ error: 'Credenciales incorrectas' })
        }

        const passwordCorrecto = await bcrypt.compare(pass, usuarioDB.password_hash)

        if (passwordCorrecto) {
            const payload = {
                usuario: usuario,
                rol: 0
            }

            jwt.sign(payload, process.env.FIRMA_JWT, { expiresIn: '1h' }, (error, token) => {
                if (error) {
                    console.error('Error al firmar el JWT:', error)
                    return res.status(500).json({ error: 'Error al generar la sesión' })
                }

                res.cookie('token', token, {
                    signed: true,
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: true,
                    maxAge: 1000 * 60 * 60 // 1 hora de duración
                })

                return res.redirect('/admin')
            })
        } else {
            return res.status(401).json({ error: 'Credenciales incorrectas' })
        }
    }
    catch (error) {
        console.error('Error en el proceso de autenticación:', error)
        return res.status(500).json({ error: 'Error interno del servidor en el login' })
    }
}

export function cerrarSesion(req, res) {
    try {
        res.clearCookie('token', {
            signed: true,
            httpOnly: true,
            sameSite: 'lax',
            secure: true
        })

        return res.redirect('/login')
    }
    catch (error) {
        console.error('Error al cerrar sesión:', error)
        return res.status(500).json({ error: 'No se pudo cerrar la sesión correctamente' })
    }
}