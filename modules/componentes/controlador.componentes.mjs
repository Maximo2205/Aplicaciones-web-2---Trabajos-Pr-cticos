import * as modelo from './modelo.componentes.mjs'

export async function obtenerComponentes(req, res) {
    const productos = await modelo.obtenerComponentes()
    res.json(productos)
}

export async function obtenerComponentePorId(req, res) {
    const componente = await modelo.obtenerComponentePorId(req.params.id)
    res.json(componente)
}

export async function agregarComponente(req, res) {
    const datos = req.body
    const componentes = await modelo.agregarComponente(datos)
    res.status(201).json(componentes)
}

export async function editarComponente(req, res) {
    const datos = req.body
    const componentes = await modelo.editarComponente(req.params.id, datos)
    res.status(200).json(componentes)
}

export async function borrarComponente(req, res) {
    const componentes = await modelo.borrarComponente(req.params.id)
    res.status(200).json(componentes)
}