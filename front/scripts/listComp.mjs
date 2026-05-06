const url = 'https://69f3f9acbd2396bf5310826e.mockapi.io/api/v1/componente';

// ─── HELPERS ────────────────────────────────────────────────────────────────

function toArray(val) {
    if (val === null || val === undefined) return [];
    return Array.isArray(val) ? val : [val];
}

function intersecta(a, b) {
    const arrA = toArray(a);
    const arrB = toArray(b);
    return arrA.some(x => arrB.includes(x));
}

function formatVal(val) {
    if (val === null || val === undefined) return '—';
    if (Array.isArray(val)) return val.join(', ');
    return String(val);
}

// ─── CHECKS DE COMPATIBILIDAD ───────────────────────────────────────────────
// Cada check devuelve: { compA, compB, caracteristica, valA, valB, estado: 'ok'|'error'|'warn', detalle }

function checks(componentes) {
    const resultados = [];

    const por = (cat) => componentes.find(c => c.category === cat);

    const cpu      = por('cpu');
    const mb       = por('motherboard');
    const ram      = por('ram');
    const cooler   = por('cpuCooler');
    const m2       = por('M2');
    const chassis  = por('chassis');
    const psu      = por('psu');
    const gpu      = por('gpu');

    // CPU ↔ Motherboard: socket
    if (cpu && mb) {
        const ok = cpu.cpuSocket === mb.cpuSocket;
        resultados.push({
            compA: cpu, compB: mb,
            caracteristica: 'Socket CPU',
            valA: formatVal(cpu.cpuSocket),
            valB: formatVal(mb.cpuSocket),
            estado: ok ? 'ok' : 'error',
        });
    }

    // CPU ↔ Motherboard: chipset
    if (cpu && mb) {
        const ok = intersecta(cpu.cpuChipset, mb.cpuChipset);
        resultados.push({
            compA: cpu, compB: mb,
            caracteristica: 'Chipset',
            valA: formatVal(cpu.cpuChipset),
            valB: formatVal(mb.cpuChipset),
            estado: ok ? 'ok' : 'error',
        });
    }

    // Motherboard ↔ RAM: DDR
    if (mb && ram) {
        const ok = mb.ramDdr === ram.ramDdr;
        resultados.push({
            compA: mb, compB: ram,
            caracteristica: 'Generación DDR',
            valA: `DDR${mb.ramDdr}`,
            valB: `DDR${ram.ramDdr}`,
            estado: ok ? 'ok' : 'error',
        });
    }

    // Cooler ↔ CPU: socket soportado
    if (cooler && cpu) {
        const ok = intersecta(cooler.cpuSocket, cpu.cpuSocket);
        resultados.push({
            compA: cooler, compB: cpu,
            caracteristica: 'Socket soportado',
            valA: formatVal(cooler.cpuSocket),
            valB: formatVal(cpu.cpuSocket),
            estado: ok ? 'ok' : 'error',
        });
    }

    // Chassis ↔ Cooler: altura
    if (chassis && cooler) {
        const ok = cooler.coolerHeight <= chassis.coolerHeight;
        resultados.push({
            compA: chassis, compB: cooler,
            caracteristica: 'Altura cooler',
            valA: `≤ ${chassis.coolerHeight} mm`,
            valB: `${cooler.coolerHeight} mm`,
            estado: ok ? 'ok' : 'error',
        });
    }

    // Chassis ↔ Motherboard: factor de forma
    if (chassis && mb) {
        const ok = intersecta(chassis.mbFormat, mb.mbFormat);
        resultados.push({
            compA: chassis, compB: mb,
            caracteristica: 'Factor de forma MB',
            valA: formatVal(chassis.mbFormat),
            valB: formatVal(mb.mbFormat),
            estado: ok ? 'ok' : 'error',
        });
    }

    // Chassis ↔ PSU: formato
    if (chassis && psu) {
        const ok = intersecta(chassis.psuFormat, psu.psuFormat);
        resultados.push({
            compA: chassis, compB: psu,
            caracteristica: 'Formato PSU',
            valA: formatVal(chassis.psuFormat),
            valB: formatVal(psu.psuFormat),
            estado: ok ? 'ok' : 'error',
        });
    }

    // Chassis ↔ GPU: longitud
    if (chassis && gpu) {
        const ok = gpu.gpuLenght <= chassis.gpuLenght;
        const warn = !ok && gpu.gpuLenght <= chassis.gpuLenght + 20;
        resultados.push({
            compA: chassis, compB: gpu,
            caracteristica: 'Longitud GPU',
            valA: `≤ ${chassis.gpuLenght} mm`,
            valB: `${gpu.gpuLenght} mm`,
            estado: ok ? 'ok' : warn ? 'warn' : 'error',
        });
    }

    // Motherboard ↔ GPU: PCIe
    if (mb && gpu) {
        const ok = mb.gpuPcie >= gpu.gpuPcie;
        resultados.push({
            compA: mb, compB: gpu,
            caracteristica: 'PCIe versión',
            valA: `PCIe ${mb.gpuPcie}`,
            valB: `PCIe ${gpu.gpuPcie}`,
            estado: ok ? 'ok' : 'warn',
        });
    }

    // Motherboard ↔ M2: formato y key
    if (mb && m2) {
        const fmtOk = intersecta(mb.m2Format, m2.m2Format);
        resultados.push({
            compA: mb, compB: m2,
            caracteristica: 'Formato M.2',
            valA: formatVal(mb.m2Format),
            valB: formatVal(m2.m2Format),
            estado: fmtOk ? 'ok' : 'error',
        });

        const keyOk = mb.m2Key === m2.m2Key;
        resultados.push({
            compA: mb, compB: m2,
            caracteristica: 'Key M.2',
            valA: formatVal(mb.m2Key),
            valB: formatVal(m2.m2Key),
            estado: keyOk ? 'ok' : 'error',
        });
    }

    return resultados;
}

// ─── RENDER ─────────────────────────────────────────────────────────────────

function renderChips(componentes) {
    const container = document.getElementById('chips-componentes');
    container.innerHTML = '';

    if (componentes.length === 0) {
        container.innerHTML = '<span style="font-size:0.82rem;color:var(--text-muted)">No hay componentes seleccionados. <a href="catalogo.html" style="color:var(--accent)">Ir al catálogo →</a></span>';
        return;
    }

    for (const c of componentes) {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `<span class="chip-category">${c.category}</span><span class="chip-name">${c.name}</span>`;
        container.appendChild(chip);
    }
}

function renderTabla(resultados) {
    const tbody = document.getElementById('tabla-body');
    const tabla = document.getElementById('tabla-compat');
    const empty = document.getElementById('tabla-empty');
    tbody.innerHTML = '';

    if (resultados.length === 0) {
        tabla.style.display = 'none';
        empty.style.display = 'block';
        empty.innerHTML = `
            <strong>Sin datos para analizar</strong>
            Seleccioná al menos dos componentes en el <a href="catalogo.html" style="color:var(--accent)">catálogo</a> para ver la tabla de compatibilidad.
        `;
        return;
    }

    tabla.style.display = 'table';
    empty.style.display = 'none';

    for (const r of resultados) {
        const tr = document.createElement('tr');
        if (r.estado === 'error') tr.classList.add('row-error');
        if (r.estado === 'warn')  tr.classList.add('row-warn');

        const badge = r.estado === 'ok'
            ? `<span class="badge-ok">✓ Compatible</span>`
            : r.estado === 'warn'
            ? `<span class="badge-warn">⚠ Aviso</span>`
            : `<span class="badge-error">✗ Incompatible</span>`;

        tr.innerHTML = `
            <td class="td-valor td-nombre">
                ${r.compA.name}
                <span class="td-category">${r.compA.category}</span>
            </td>
            <td class="td-valor td-nombre">
                ${r.compB.name}
                <span class="td-category">${r.compB.category}</span>
            </td>
            <td class="td-caracteristica">${r.caracteristica}</td>
            <td class="td-valor">${r.valA}</td>
            <td class="td-valor">${r.valB}</td>
            <td>${badge}</td>
        `;
        tbody.appendChild(tr);
    }
}

function renderSummary(resultados, componentes) {
    const iconEl    = document.getElementById('summary-icon');
    const tituloEl  = document.getElementById('summary-titulo');
    const subEl     = document.getElementById('summary-subtitulo');
    const okEl      = document.getElementById('count-ok');
    const errEl     = document.getElementById('count-error');
    const warnEl    = document.getElementById('count-warn');

    const ok    = resultados.filter(r => r.estado === 'ok').length;
    const err   = resultados.filter(r => r.estado === 'error').length;
    const warn  = resultados.filter(r => r.estado === 'warn').length;

    okEl.textContent   = ok;
    errEl.textContent  = err;
    warnEl.textContent = warn;

    if (resultados.length === 0) {
        iconEl.textContent  = '🔍';
        tituloEl.textContent = 'Sin datos suficientes';
        subEl.textContent   = 'Seleccioná componentes en el catálogo para analizar';
    } else if (err > 0) {
        iconEl.textContent  = '✗';
        iconEl.style.color  = 'var(--red)';
        tituloEl.textContent = `${err} incompatibilidad${err > 1 ? 'es' : ''} encontrada${err > 1 ? 's' : ''}`;
        subEl.textContent   = `Revisá los conflictos antes de comprar los componentes`;
    } else if (warn > 0) {
        iconEl.textContent  = '⚠';
        iconEl.style.color  = 'var(--yellow)';
        tituloEl.textContent = `${warn} aviso${warn > 1 ? 's' : ''} — verificar antes de comprar`;
        subEl.textContent   = `Los componentes son mayormente compatibles, con algunos puntos a revisar`;
    } else {
        iconEl.textContent  = '✓';
        iconEl.style.color  = 'var(--green)';
        tituloEl.textContent = '¡Todos los componentes son compatibles!';
        subEl.textContent   = `${componentes.length} componentes analizados sin conflictos`;
    }
}

// ─── INIT ────────────────────────────────────────────────────────────────────

async function init() {
    // Leemos los seleccionados del localStorage
    const data = localStorage.getItem('componentesSeleccionados');
    const seleccionados = data ? JSON.parse(data) : [];

    renderChips(seleccionados);

    const resultados = checks(seleccionados);

    renderSummary(resultados, seleccionados);
    renderTabla(resultados);
}

init();
