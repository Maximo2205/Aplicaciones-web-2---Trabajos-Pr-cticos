const URL_API = 'http://localhost:3000/api/v1/componentes';

// ─── HELPERS ────────────────────────────────────────────────────────────────

// Convierte "AM5, LGA1700" → ["AM5", "LGA1700"] o null si está vacío
function parseCampo(valor) {
    if (!valor || !valor.trim()) return null;
    const partes = valor.split(',').map(v => v.trim()).filter(Boolean);
    if (partes.length === 0) return null;
    
    // Eliminamos la validación de (partes.length === 1)
    // De esta forma, si es "AM4", devolverá ["AM4"] (lo que PostgreSQL espera)
    return partes; 
}

// Convierte campo a número o null
function parseNum(valor) {
    const n = parseFloat(valor);
    return isNaN(n) ? null : n;
}

// Convierte array/valor a string para mostrar en tabla
function formatCelda(val) {
    if (val === null || val === undefined) return '—';
    if (Array.isArray(val)) return val.join(', ');
    return String(val);
}

// ─── API ─────────────────────────────────────────────────────────────────────

async function fetchTodos() {
    const res = await fetch(URL_API);
    if (!res.ok) throw new Error('Error al obtener componentes');
    return res.json();
}

async function crearComponente(datos) {
    const res = await fetch(URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    if (!res.ok) throw new Error('Error al crear componente');
    return res.json();
}

async function editarComponente(id, datos) {
    const res = await fetch(`${URL_API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    if (!res.ok) throw new Error('Error al editar componente');
    return res.json();
}

async function eliminarComponente(id) {
    const res = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar componente');
}

// ─── TABLA ───────────────────────────────────────────────────────────────────

async function cargarTabla() {
    const tbody = document.getElementById('tabla-body');
    const estado = document.getElementById('tabla-estado');
    const tabla = document.getElementById('tabla-admin');

    tbody.innerHTML = '';
    tabla.style.display = 'none';
    estado.textContent = 'Cargando componentes...';

    try {
        const componentes = await fetchTodos();
        estado.textContent = '';
        tabla.style.display = 'table';

        if (componentes.length === 0) {
            tabla.style.display = 'none';
            estado.textContent = 'No hay componentes todavía.';
            return;
        }

        for (const c of componentes) {
            tbody.appendChild(crearFila(c));
        }

    } catch (error) {
        console.error(error);
        tabla.style.display = 'none';
        estado.textContent = 'Error al cargar los componentes.';
    }
}

function crearFila(c) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td class="td-id">${c.id}</td>
        <td class="td-nombre">${c.name}</td>
        <td><span class="td-categoria">${c.category}</span></td>
        <td class="td-muted">${formatCelda(c.cpusocket)}</td>
        <td class="td-muted">${formatCelda(c.cpuchipset)}</td>
        <td class="td-muted">${c.ramddr ? `DDR${c.ramddr}` : '—'}</td>
        <td>
            <div class="td-acciones">
                <button class="btn-editar">Editar</button>
                <button class="btn-borrar">Borrar</button>
            </div>
        </td>
    `;

    tr.querySelector('.btn-editar').addEventListener('click', () => abrirModalEditar(c));
    tr.querySelector('.btn-borrar').addEventListener('click', () => abrirConfirm(c));

    return tr;
}

// ─── MODAL AGREGAR / EDITAR ──────────────────────────────────────────────────

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle   = document.getElementById('modal-title');
const btnGuardar   = document.getElementById('btn-guardar');

let modoEdicion = null; // null = agregar, id = editar

function abrirModalAgregar() {
    modoEdicion = null;
    modalTitle.textContent = 'Agregar componente';
    btnGuardar.textContent = 'Guardar';
    limpiarForm();
    modalOverlay.classList.add('visible');
}

function abrirModalEditar(componente) {
    modoEdicion = componente.id;
    modalTitle.textContent = 'Editar componente';
    btnGuardar.textContent = 'Guardar cambios';
    cargarForm(componente);
    modalOverlay.classList.add('visible');
}

function cerrarModal() {
    modalOverlay.classList.remove('visible');
    modoEdicion = null;
}

function limpiarForm() {
    ['f-name','f-category','f-cpuSocket','f-cpuChipset','f-ramDdr',
     'f-coolerHeight','f-m2Format','f-m2Key','f-psuFormat',
     'f-gpuPcie','f-gpuLenght','f-mbFormat'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function cargarForm(c) {
    document.getElementById('f-name').value         = c.name ?? '';
    document.getElementById('f-category').value     = c.category ?? '';
    document.getElementById('f-cpuSocket').value    = formatCelda(c.cpusocket).replace('—','');
    document.getElementById('f-cpuChipset').value   = formatCelda(c.cpuchipset).replace('—','');
    document.getElementById('f-ramDdr').value       = c.ramddr ?? '';
    document.getElementById('f-coolerHeight').value = c.coolerheight ?? '';
    document.getElementById('f-m2Format').value     = formatCelda(c.m2format).replace('—','');
    document.getElementById('f-m2Key').value        = c.m2key ?? '';
    document.getElementById('f-psuFormat').value    = formatCelda(c.psuformat).replace('—','');
    document.getElementById('f-gpuPcie').value      = c.gpupcie ?? '';
    document.getElementById('f-gpuLenght').value    = c.gpulenght ?? '';
    document.getElementById('f-mbFormat').value     = formatCelda(c.mbformat).replace('—','');
}

function leerForm() {
    return {
        name:         document.getElementById('f-name').value.trim(),
        category:     document.getElementById('f-category').value,
        cpuSocket:    parseCampo(document.getElementById('f-cpuSocket').value),
        cpuChipset:   parseCampo(document.getElementById('f-cpuChipset').value),
        ramDdr:       parseNum(document.getElementById('f-ramDdr').value),
        coolerHeight: parseNum(document.getElementById('f-coolerHeight').value),
        m2Format:     parseCampo(document.getElementById('f-m2Format').value),
        m2Key:        parseCampo(document.getElementById('f-m2Key').value),
        psuFormat:    parseCampo(document.getElementById('f-psuFormat').value),
        gpuPcie:      parseNum(document.getElementById('f-gpuPcie').value),
        gpuLenght:    parseNum(document.getElementById('f-gpuLenght').value),
        mbFormat:     parseCampo(document.getElementById('f-mbFormat').value),
    };
}

async function guardar() {
    const datos = leerForm();

    if (!datos.name) {
        alert('El nombre es obligatorio.');
        return;
    }
    if (!datos.category) {
        alert('La categoría es obligatoria.');
        return;
    }

    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';

    try {
        if (modoEdicion) {
            await editarComponente(modoEdicion, datos);
        } else {
            await crearComponente(datos);
        }
        cerrarModal();
        cargarTabla();
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al guardar. Revisá la consola.');
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = modoEdicion ? 'Guardar cambios' : 'Guardar';
    }
}

// ─── MODAL CONFIRMACIÓN BORRADO ──────────────────────────────────────────────

const confirmOverlay = document.getElementById('confirm-overlay');
const confirmNombre  = document.getElementById('confirm-nombre');
const confirmOk      = document.getElementById('confirm-ok');

let idAEliminar = null;

function abrirConfirm(componente) {
    idAEliminar = componente.id;
    confirmNombre.textContent = componente.name;
    confirmOverlay.classList.add('visible');
}

function cerrarConfirm() {
    confirmOverlay.classList.remove('visible');
    idAEliminar = null;
}

async function eliminar() {
    if (!idAEliminar) return;

    confirmOk.disabled = true;
    confirmOk.textContent = 'Eliminando...';

    try {
        await eliminarComponente(idAEliminar);
        cerrarConfirm();
        cargarTabla();
    } catch (error) {
        console.error(error);
        alert('Error al eliminar. Revisá la consola.');
    } finally {
        confirmOk.disabled = false;
        confirmOk.textContent = 'Eliminar';
    }
}

// ─── EVENTOS ─────────────────────────────────────────────────────────────────

document.getElementById('btn-agregar').addEventListener('click', abrirModalAgregar);
document.getElementById('btn-guardar').addEventListener('click', guardar);
document.getElementById('btn-cancelar').addEventListener('click', cerrarModal);
document.getElementById('modal-close').addEventListener('click', cerrarModal);

document.getElementById('confirm-ok').addEventListener('click', eliminar);
document.getElementById('confirm-cancelar').addEventListener('click', cerrarConfirm);
document.getElementById('confirm-close').addEventListener('click', cerrarConfirm);

// Cerrar modales al clickear fuera
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) cerrarModal(); });
confirmOverlay.addEventListener('click', (e) => { if (e.target === confirmOverlay) cerrarConfirm(); });

// ─── INIT ─────────────────────────────────────────────────────────────────────
cargarTabla();