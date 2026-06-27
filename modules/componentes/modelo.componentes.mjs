import pool from '../../conexion.db.mjs'

export async function obtenerComponentes() {
    try {
        const resultado = await pool.query('SELECT * FROM componentes')
        return resultado.rows
    }
    catch (error) {
        console.error(error)
        throw error
    }
}

export async function obtenerComponentePorId(id) {
    try {
        const resultado = await pool.query('SELECT * FROM componentes where id = $1', [id])
        return resultado.rows[0]
    }
    catch (error) {
        console.error(error)
        throw error
    }
}

export async function agregarComponente(datos) {
    try {
        const { category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat } = datos
        const resultado = await pool.query('INSERT INTO componentes (category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id', [category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat])
        return resultado.rows
    }
    catch (error) {
        console.error(error)
        throw error
    }
}

export async function editarComponente(id, datos) {
    try {
        const { category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat } = datos
        const resultado = await pool.query('UPDATE componentes SET category = $1, name = $2, cpuSocket = $3, cpuChipset = $4, ramDdr = $5, coolerHeight = $6, m2Format = $7, m2Key = $8, psuFormat = $9, gpuPcie = $10, gpuLenght = $11, mbFormat = $12 WHERE id = $13 RETURNING id', [category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat, id])
        return resultado.rows[0]
    }
    catch (error) {
        console.error(error)
        throw error
    }
}

export async function borrarComponente(id) {
    try {
        const resultado = await pool.query('DELETE FROM componentes where id = $1', [id])
        return resultado.rows
    }
    catch (error) {
        console.error(error)
        throw error
    }
}