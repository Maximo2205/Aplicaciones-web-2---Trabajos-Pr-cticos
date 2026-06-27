import pool from '../../conexion.db.mjs'

export async function obtenerUsuario(usuario) {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios WHERE username = $1', [usuario])
        return resultado.rows[0]
    }
    catch (error) {
        console.error(error)
        throw error
    }
}