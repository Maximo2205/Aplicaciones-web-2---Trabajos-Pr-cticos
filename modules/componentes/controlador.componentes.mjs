import * as modelo from './modelo.componentes.mjs'

export async function obtenerComponentes(req, res) {
    try {
        const productos = await modelo.obtenerComponentes()
        res.status(200).json(productos)
    }
    catch (error) {

    }
}

export async function obtenerComponentePorId(req, res) {
    try {
        const componente = await modelo.obtenerComponentePorId(req.params.id)
        res.status(200).json(componente)
    }
    catch (error) {

    }
}

export async function agregarComponente(req, res) {
    try {
        const datos = req.body
        const componentes = await modelo.agregarComponente(datos)
        res.status(201).json(componentes)
    }
    catch (error) {

    }
}

export async function editarComponente(req, res) {
    try {
        const datos = req.body
        const componentes = await modelo.editarComponente(req.params.id, datos)
        res.status(200).json(componentes)
    }
    catch (error) {

    }
}

export async function borrarComponente(req, res) {
    try {
        const componentes = await modelo.borrarComponente(req.params.id)
        res.status(200).json(componentes)
    }
    catch (error) {

    }
}