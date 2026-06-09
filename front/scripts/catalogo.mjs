const url = 'http://localhost:3000/api/v1/componentes' //'https://69f3f9acbd2396bf5310826e.mockapi.io/api/v1/componente';

// --- HELPERS ---
function formatCelda(val) {
    if (val === null || val === undefined) return '—';
    if (Array.isArray(val)) return val.join(', ');
    return String(val);
}

// --- LOCALSTORAGE ---
function obtenerSeleccionados() {
    const data = localStorage.getItem("componentesSeleccionados");
    return data ? JSON.parse(data) : [];
}

function guardarSeleccionados(componentes) {
    localStorage.setItem("componentesSeleccionados", JSON.stringify(componentes));
}

// --- API ---
async function fetchPorId(id) {
    const res = await fetch(`${url}/${id}`);
    if (!res.ok) throw new Error('Error al obtener el componente');
    return res.json();
}

// --- FETCH ---
async function traerComponentes() {
    const container = document.getElementById("lista-componentes");
    container.innerHTML = "<p>Cargando componentes...</p>";

    try {
        const respuesta = await fetch(url);
        const componentes = await respuesta.json();

        container.innerHTML = "";

        if (componentes.length === 0) {
            container.innerHTML = "<p>No hay componentes disponibles.</p>";
            return;
        }

        document.getElementById("total-componentes").textContent = componentes.length;

        for (const componente of componentes) {
            cargarComponentes(componente);
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Error al cargar los componentes.</p>";
    }
}

// --- FILAS DE COMPONENTES ---
function cargarComponentes(componente) {
    const container = document.getElementById("lista-componentes");
    const seleccionados = obtenerSeleccionados();
    const yaAgregado = seleccionados.some(c => c.id === componente.id);

    const row = document.createElement("div");
    row.className = "componente-row";
    row.dataset.id = componente.id;

    const info = document.createElement("div");
    info.className = "componente-info";

    const nombre = document.createElement("span");
    nombre.className = "componente-nombre";
    nombre.textContent = componente.name;

    const tipo = document.createElement("span");
    tipo.className = "componente-tipo";
    tipo.textContent = componente.tipo ?? "Componente";

    const acciones = document.createElement("div");
    acciones.className = "componente-acciones";

    const btnVer = document.createElement("button");
    btnVer.className = "btn-ver-catalogo";
    btnVer.textContent = "Ver detalle";
    btnVer.addEventListener("click", () => abrirModalDetalle(componente.id));

    const btn = document.createElement("button");
    btn.className = "btn-agregar";
    btn.textContent = yaAgregado ? "Agregado ✓" : "Agregar";
    btn.disabled = yaAgregado;
    btn.addEventListener("click", () => agregarSeleccionado(componente, btn));

    info.appendChild(nombre);
    info.appendChild(tipo);
    acciones.appendChild(btnVer);
    acciones.appendChild(btn);
    row.appendChild(info);
    row.appendChild(acciones);
    container.appendChild(row);
}

// --- SELECCIONADOS ---
function agregarSeleccionado(componente, btn) {
    const seleccionados = obtenerSeleccionados();

    const yaExiste = seleccionados.some(c => c.id === componente.id);
    if (yaExiste) return;

    seleccionados.push(componente);
    guardarSeleccionados(seleccionados);

    btn.textContent = "Agregado ✓";
    btn.disabled = true;

    renderizarSeleccionados();
}

function quitarSeleccionado(id) {
    const seleccionados = obtenerSeleccionados();
    const nuevos = seleccionados.filter(c => c.id !== id);
    guardarSeleccionados(nuevos);

    renderizarSeleccionados();
    rehabilitarBoton(id);
}

function renderizarSeleccionados() {
    const lista = document.getElementById("lista-seleccionados");
    const mensaje = document.getElementById("mensaje-vacio");
    const badge = document.getElementById("cantidad-seleccionados");
    const btnLimpiar = document.getElementById("btn-limpiar");
    const seleccionados = obtenerSeleccionados();

    lista.innerHTML = "";
    badge.textContent = seleccionados.length;

    if (seleccionados.length === 0) {
        mensaje.style.display = "block";
        btnLimpiar.style.display = "none";
        return;
    }

    mensaje.style.display = "none";
    btnLimpiar.style.display = "block";

    for (const componente of seleccionados) {
        const li = document.createElement("li");

        const nombre = document.createElement("span");
        nombre.textContent = componente.name;

        const btnQuitar = document.createElement("button");
        btnQuitar.className = "btn-quitar";
        btnQuitar.textContent = "Quitar";
        btnQuitar.addEventListener("click", () => quitarSeleccionado(componente.id));

        li.appendChild(nombre);
        li.appendChild(btnQuitar);
        lista.appendChild(li);
    }
}

function rehabilitarBoton(id) {
    const rows = document.querySelectorAll(".componente-row");
    rows.forEach(row => {
        if (row.dataset.id === String(id)) {
            const btn = row.querySelector(".btn-agregar"); // ← corregido para no afectar btn-ver-catalogo
            btn.textContent = "Agregar";
            btn.disabled = false;
        }
    });
}

function limpiarTodo() {
    guardarSeleccionados([]);
    renderizarSeleccionados();
    document.querySelectorAll(".btn-agregar").forEach(btn => {
        btn.textContent = "Agregar";
        btn.disabled = false;
    });
}

// --- MODAL DETALLE ---
const detalleOverlay = document.getElementById('detalle-overlay');

// Nombres de campo en minúscula tal como los devuelve PostgreSQL
const LABELS = {
    cpusocket:    'Socket CPU',
    cpuchipset:   'Chipset',
    ramddr:       'Generación DDR',
    coolerheight: 'Altura cooler (mm)',
    m2format:     'Formato M.2',
    m2key:        'Key M.2',
    psuformat:    'Formato PSU',
    gpupcie:      'PCIe versión',
    gpulenght:    'Longitud GPU (mm)',
    mbformat:     'Factor de forma MB',
};

async function abrirModalDetalle(id) {
    document.getElementById('detalle-name').textContent = 'Cargando...';
    document.getElementById('detalle-category').textContent = '';
    document.getElementById('detalle-grid').innerHTML = '';
    detalleOverlay.classList.add('visible');

    try {
        const c = await fetchPorId(id);

        document.getElementById('detalle-name').textContent     = c.name;
        document.getElementById('detalle-category').textContent = c.category;

        const grid = document.getElementById('detalle-grid');
        grid.innerHTML = '';

        for (const [campo, label] of Object.entries(LABELS)) {
            const valor = c[campo];
            const vacio = valor === null || valor === undefined;

            const item = document.createElement('div');
            item.className = `detalle-item${vacio ? ' detalle-item-vacio' : ''}`;
            item.innerHTML = `
                <span class="detalle-item-label">${label}</span>
                <span class="detalle-item-valor">${vacio ? 'No aplica' : formatCelda(valor)}</span>
            `;
            grid.appendChild(item);
        }
    } catch (error) {
        console.error(error);
        document.getElementById('detalle-name').textContent = 'Error al cargar';
    }
}

function cerrarModalDetalle() {
    detalleOverlay.classList.remove('visible');
}

// --- INIT ---
document.getElementById("btn-limpiar").addEventListener("click", limpiarTodo);
document.getElementById('detalle-close').addEventListener('click', cerrarModalDetalle);
document.getElementById('detalle-cerrar').addEventListener('click', cerrarModalDetalle);
detalleOverlay.addEventListener('click', (e) => { if (e.target === detalleOverlay) cerrarModalDetalle(); });

traerComponentes();
renderizarSeleccionados();
