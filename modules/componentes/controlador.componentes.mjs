import * as modelo from './modelo.componentes.mjs'

export async function obtenerComponentes(req, res) {
    try {
        const productos = await modelo.obtenerComponentes()
        res.status(200).json(productos)
    }
    catch (error) {
        console.error('Error al obtener los componentes:', error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export async function obtenerComponentePorId(req, res) {
    try {
        const componente = await modelo.obtenerComponentePorId(req.params.id)
        res.status(200).json(componente)
    }
    catch (error) {
        console.error('Error al obtener el componente:', error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export async function agregarComponente(req, res) {
    try {
        const datos = req.body
        const componentes = await modelo.agregarComponente(datos)
        res.status(201).json(componentes)
    }
    catch (error) {
        console.error('Error al agregar el componente:', error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export async function editarComponente(req, res) {
    try {
        const datos = req.body
        const componentes = await modelo.editarComponente(req.params.id, datos)
        res.status(200).json(componentes)
    }
    catch (error) {
        console.error('Error al editar el componente:', error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export async function borrarComponente(req, res) {
    try {
        const componentes = await modelo.borrarComponente(req.params.id)
        res.status(200).json(componentes)
    }
    catch (error) {
        console.error('Error al borrar el componente:', error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}