import express from 'express'

//definicion del puerto
const puerto = 3000;

//instancia de server express
const app = express()

const componentes = [
    { id: 1, nombre: "Ryzen 7 5800X", tipo: "CPU" },
    { id: 2, nombre: "RTX 3060", tipo: "GPU" },
    { id: 3, nombre: "ASUS B550M", tipo: "Motherboard" },
    { id: 4, nombre: "Gabinete ATX", tipo: "Gabinete" }
]

//Get en /componentes
app.get('/componentes', (req, res) => {
    const tipo = req.query.tipo;

    if (tipo !== undefined) {
        const filtrados = componentes.filter(c => {
            return c.tipo.toLowerCase().trim() === tipo.toLowerCase().trim();
        });

        return res.json(filtrados);
    }
    res.status(200)
    return res.json(componentes);
})

//Post en /componentes
app.post('/componentes', (req, res) => {
    const { nombre, tipo } = req.body;

    if (!nombre || !tipo) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    const maxId = componentes.reduce((max, c) => Math.max(max, c.id), 0);


    const nuevoComponente = {
        id: maxId + 1,
        nombre: nombre,
        tipo: tipo
    };

    componentes.push(nuevoComponente);

    return res.status(201).json(nuevoComponente);
})

//Delete en /componentes
app.delete('/componentes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    const index = componentes.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Componente no encontrado" });
    }

    const eliminado = componentes.splice(index, 1);

    return res.json(eliminado[0]);
})

//Put en /componentes
app.put("/componentes/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    const { nombre, tipo } = req.body;

    if (!nombre || !tipo) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    const index = componentes.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Componente no encontrado" });
    }

    componentes[index] = { ...componentes[index], nombre, tipo };

    return res.json(componentes[index]);
});

app.listen(puerto, () => {
    console.log(`http://localhost:${puerto}`)
})