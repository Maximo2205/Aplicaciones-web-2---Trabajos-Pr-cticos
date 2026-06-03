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

export async function agregarComponente(datos) {
    const {category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat} = datos
    const resultado = await pool.query('INSERT INTO componentes (category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id', [category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat])
    return resultado.rows
}

export async function editarComponente(datos) {
    const {id, category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat} = datos
    const resultado = await pool.query('', [category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat])
    return resultado.rows
}

export async function borrarComponente(datos) {
    const {id, category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat} = datos
    const resultado = await pool.query('', [category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat])
    return resultado.rows
}