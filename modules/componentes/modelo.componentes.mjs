import pool from '../../conexion.db.mjs'

export async function obtenerComponentes() {
    const resultado = await pool.query('SELECT * FROM componentes')
    return resultado.rows
}

export async function obtenerComponentePorId(id) {
    const query = 'SELECT * FROM componentes where id = ' & id
    const resultado = await pool.query(query)
    return resultado.rows
}