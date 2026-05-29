import * as modelo from './modelo.componentes.mjs'

export async function obtenerComponentes(req, res) {
    const productos = await modelo.obtenerComponentes()
    res.json(productos)
}

export async function obtenerComponentePorId(req, res) {
    const componente = await modelo.obtenerComponentePorId(req.params.id)
    res.json(componente)
}