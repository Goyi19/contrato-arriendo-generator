/* ═══════════════════════════════════════════════════
   ContratoAI — Main Application Logic
   ═══════════════════════════════════════════════════ */

// ──────────────────────────────────────────────
// DOM REFERENCES
// ──────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
    apiKeyStatus: $('#apiKeyStatus'),
    contractType: $('#contractType'),
    tabManual: $('#tabManual'),
    tabBatch: $('#tabBatch'),
    panelManual: $('#panelManual'),
    panelBatch: $('#panelBatch'),
    manualForm: $('#manualForm'),
    btnGenerar: $('#btnGenerar'),
    dropZone: $('#dropZone'),
    fileInput: $('#fileInput'),
    filePreview: $('#filePreview'),
    fileName: $('#fileName'),
    fileRows: $('#fileRows'),
    removeFile: $('#removeFile'),
    btnGenerarLote: $('#btnGenerarLote'),
    progressSection: $('#progressSection'),
    progressText: $('#progressText'),
    progressPercent: $('#progressPercent'),
    progressBar: $('#progressBar'),
    progressDetail: $('#progressDetail'),
    resultSection: $('#resultSection'),
    resultDetail: $('#resultDetail'),
    downloadButtons: $('#downloadButtons'),
    errorSection: $('#errorSection'),
    errorText: $('#errorText'),
    // Dynamic fields
    oficinasContainer: $('#oficinasContainer'),
    btnAddOffice: $('#btnAddOffice'),
    estacionamientosContainer: $('#estacionamientosContainer'),
    btnAddParking: $('#btnAddParking'),
    btnDownloadTemplate: $('#btnDownloadTemplate'),
};

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
let batchData = null; // Parsed rows from CSV/Excel



// ──────────────────────────────────────────────
// TAB SWITCHING
// ──────────────────────────────────────────────
function switchTab(tab) {
    if (tab === 'manual') {
        DOM.tabManual.classList.add('active');
        DOM.tabBatch.classList.remove('active');
        DOM.panelManual.classList.remove('hidden');
        DOM.panelBatch.classList.add('hidden');
    } else {
        DOM.tabBatch.classList.add('active');
        DOM.tabManual.classList.remove('active');
        DOM.panelBatch.classList.remove('hidden');
        DOM.panelManual.classList.add('hidden');
    }
    hideResults();
}



// ──────────────────────────────────────────────
// GENERATE .DOCX FILE
// ──────────────────────────────────────────────
// ACTUALIZADO: Acepta buffer opcional para evitar múltiples fetch en modo masivo
async function generateDocx(templateData, fileName, baseBuffer = null) {
    let arrayBuffer = baseBuffer;

    // 1. Cargar la plantilla original (solo si no se pasó un buffer)
    if (!arrayBuffer) {
        const response = await fetch('template.docx');
        if (!response.ok) {
            throw new Error('No se pudo cargar la plantilla base (template.docx).');
        }
        arrayBuffer = await response.arrayBuffer();
    }

    // 2. Cargar en PizZip
    const PizZip = window.PizZip;
    if (!PizZip) {
        throw new Error('La librería PizZip no se cargó correctamente.');
    }
    const zip = new PizZip(arrayBuffer);

    // 3. Crear instancia de docxtemplater
    const Docxtemplater = window.docxtemplater;
    if (!Docxtemplater) {
        throw new Error('La librería Docxtemplater no se cargó correctamente.');
    }
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    // 4. Renderizar con los datos adaptados por Gemini
    doc.render(templateData);

    // 5. Generar archivo Blob
    const blob = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    return blob;
}

// ──────────────────────────────────────────────
// UI HELPERS
// ──────────────────────────────────────────────
function showProgress(text, percent, detail) {
    DOM.progressSection.classList.remove('hidden');
    DOM.progressText.textContent = text;
    DOM.progressPercent.textContent = `${Math.round(percent)}%`;
    DOM.progressBar.style.width = `${percent}%`;
    DOM.progressDetail.textContent = detail || '';
}

function hideProgress() {
    DOM.progressSection.classList.add('hidden');
}

function showError(message) {
    DOM.errorSection.classList.remove('hidden');
    DOM.errorText.textContent = message;
    DOM.resultSection.classList.add('hidden');
}

function hideError() {
    DOM.errorSection.classList.add('hidden');
}

function showResult(detail, buttons) {
    DOM.resultSection.classList.remove('hidden');
    DOM.resultDetail.textContent = detail;
    DOM.downloadButtons.innerHTML = '';
    buttons.forEach(({ label, onClick }) => {
        const btn = document.createElement('button');
        btn.className = 'download-btn';
        btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>${label}`;
        btn.addEventListener('click', onClick);
        DOM.downloadButtons.appendChild(btn);
    });
}

function hideResults() {
    DOM.resultSection.classList.add('hidden');
    DOM.errorSection.classList.add('hidden');
    hideProgress();
}

function setLoadingState(button, loading) {
    button.disabled = loading;
    if (loading) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `<span class="spinner w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"></span> Generando...`;
    } else if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
    }
}

// ──────────────────────────────────────────────
// CONTRACT LOGIC: Deterministic String Building
// ──────────────────────────────────────────────
function buildContractData(rawData) {
    // Collect offices and surfaces
    let oficinas = [];
    let superficies = [];
    let estacs = [];

    if (rawData.oficina_num) {
        // From dynamic manual form
        oficinas = Array.isArray(rawData.oficina_num) ? rawData.oficina_num : [rawData.oficina_num];
        superficies = Array.isArray(rawData.oficina_m2) ? rawData.oficina_m2 : [rawData.oficina_m2];
        estacs = Array.isArray(rawData.estacionamiento_num) ? rawData.estacionamiento_num : [rawData.estacionamiento_num];
    } else {
        // From bread/batch mode (CSV usually has strings)
        const ofisStr = String(rawData.oficinas || '');
        const supStr = String(rawData.superficie || '');
        const estStr = String(rawData.estacionamientos || '');

        oficinas = ofisStr.split(/[y,]/).map(s => s.trim()).filter(Boolean);
        superficies = supStr.split(/[y,]/).map(s => s.trim()).filter(Boolean);
        estacs = estStr.split(/[y,]/).map(s => s.trim()).filter(Boolean);
    }

    // Filter and trim first
    // Deduplicate using Set while preserving order
    const validOfis = Array.from(new Set(oficinas.map(o => String(o).trim()).filter(Boolean)));
    const validSup = Array.from(new Set(superficies.map(s => String(s).trim()).filter(Boolean)));
    const validEstacs = Array.from(new Set(estacs.map(e => String(e).trim()).filter(Boolean)));

    const piso = rawData.piso || '';
    const ubiEstac = rawData.ubi_estacionamiento || 'cuarto subterráneo';

    // List formatters
    const formatList = (arr) => {
        if (arr.length === 0) return "";
        if (arr.length === 1) return arr[0];
        const last = arr[arr.length - 1];
        const rest = arr.slice(0, -1).join(', ');
        return `${rest} y ${last}`;
    };

    // Special formatter for D-prefix: "403 y D409"
    const formatListD = (arr) => {
        if (arr.length === 0) return "";
        if (arr.length === 1) return arr[0];
        const last = arr[arr.length - 1];
        const rest = arr.slice(0, -1).join(' y D');
        return `D${rest} y D${last}`;
    };

    // Representante
    const rep_nombre = rawData.representante_nombre || '';
    const rep_rut = rawData.representante_rut || '';
    const arrendatario_representante_texto = rep_nombre ? `, representada por don ${rep_nombre}, cédula nacional de identidad número ${rep_rut}` : "";

    // Signature Logic
    const rawFirmaNombre = rep_nombre || rawData.arrendatario_nombre || '';
    const rawFirmaRut = rep_rut || rawData.arrendatario_rut || '';

    // Result object
    return {
        // Sections & Grammar
        multiple_ofis: validOfis.length > 1,
        oficinas_lista: formatList(validOfis),
        oficina_unica: validOfis[0] || '',
        parentesis_plural: validOfis.length === 2 ? 'ambas oficinas' : 'todas estas oficinas',

        tiene_estac: validEstacs.length > 0,
        multiple_estac: validEstacs.length > 1,
        estacs_lista: formatList(validEstacs),
        estac_unico: validEstacs[0] || '',
        ubi_estac: ubiEstac,

        sup_lista: formatList(validSup),
        sup_unica: validSup[0] || '',
        oficinas_lista_d: formatListD(validOfis) + ' ', // Fix Bug 2 (plural)

        // Basic Info
        fecha_contrato: rawData.fecha_contrato || '',
        arrendatario_nombre: rawData.arrendatario_nombre || '',
        arrendatario_rut: rawData.arrendatario_rut || '',
        arrendatario_representante_texto,
        representante_nombre: rep_nombre,
        representante_rut: rep_rut,
        arrendatario_domicilio: rawData.arrendatario_domicilio || '',
        piso: piso,

        plazo_meses: rawData.plazo_meses || '',
        dias_aviso: rawData.dias_aviso || '',
        monto_renta_uf: rawData.monto_renta_uf || '',
        monto_garantia_uf: rawData.monto_garantia_uf || '',
        porcentaje_multa_atraso: rawData.porcentaje_multa_atraso || '',

        arrendatario_telefono: Array.isArray(rawData.arrendatario_telefono) ? Array.from(new Set(rawData.arrendatario_telefono.map(v => String(v).trim()).filter(Boolean)))[0] || '' : String(rawData.arrendatario_telefono || '').trim(),
        arrendatario_email: (Array.isArray(rawData.arrendatario_email) ? Array.from(new Set(rawData.arrendatario_email.map(v => String(v).trim()).filter(Boolean)))[0] || '' : String(rawData.arrendatario_email || '').trim()) + '\n', // Fix Bug 1

        // Signature fields
        firma_nombre: rawFirmaNombre + '\n', // Fix Bug 1
        firma_rut: rawFirmaRut,
        firma_empresa: rep_nombre ? `pp. ${rawData.arrendatario_nombre}` : ''
    };
}

// ──────────────────────────────────────────────
// MANUAL MODE: Generate single contract
// ──────────────────────────────────────────────
async function handleManualGenerate(e) {
    e.preventDefault();
    hideResults();
    hideError();

    setLoadingState(DOM.btnGenerar, true);
    showProgress('Preparando documento...', 20, 'Construyendo textos legales.');

    try {
        const formData = new FormData(DOM.manualForm);
        const rawData = {};
        for (const [key, value] of formData.entries()) {
            if (!rawData[key]) {
                rawData[key] = value;
            } else {
                if (!Array.isArray(rawData[key])) rawData[key] = [rawData[key]];
                rawData[key].push(value);
            }
        }

        const templateData = buildContractData(rawData);

        showProgress('Generando archivo .docx...', 70, 'Preservando formato original de la plantilla.');

        let blob;
        try {
            blob = await generateDocx(templateData, 'contrato');
        } catch (docxErr) {
            console.error('Error docxtemplater:', docxErr);
            throw new Error(`Error al generar el documento: ${docxErr.message}`);
        }

        showProgress('¡Listo!', 100, '');

        const safeName = (templateData.arrendatario_nombre || 'contrato').replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').replace(/\s+/g, '_');
        const downloadFileName = `Contrato_Arriendo_${safeName}.docx`;

        showResult(`Contrato generado exitosamente`, [{
            label: `Descargar ${downloadFileName}`,
            onClick: () => saveAs(blob, downloadFileName)
        }]);

    } catch (error) {
        showError(error.message);
    } finally {
        setLoadingState(DOM.btnGenerar, false);
        hideProgress();
    }
}

// ──────────────────────────────────────────────
// BATCH MODE: Parse uploaded file
// ──────────────────────────────────────────────
function parseUploadedFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                if (!jsonData || jsonData.length === 0) {
                    reject(new Error('El archivo está vacío o no tiene datos válidos.'));
                    return;
                }

                resolve(jsonData);
            } catch (err) {
                reject(new Error(`Error al leer el archivo: ${err.message}`));
            }
        };
        reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
        reader.readAsArrayBuffer(file);
    });
}

function handleFileSelect(file) {
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
        showError('Formato no soportado. Usa archivos .csv, .xlsx o .xls');
        return;
    }

    parseUploadedFile(file).then(data => {
        batchData = data;
        DOM.filePreview.classList.remove('hidden');
        DOM.fileName.textContent = file.name;
        DOM.fileRows.textContent = `${data.length} fila(s) detectada(s) — ${Object.keys(data[0]).length} columnas`;
        DOM.btnGenerarLote.disabled = false;
        hideError();
    }).catch(err => {
        showError(err.message);
    });
}

function removeUploadedFile() {
    batchData = null;
    DOM.filePreview.classList.add('hidden');
    DOM.btnGenerarLote.disabled = true;
    DOM.fileInput.value = '';
}

// ──────────────────────────────────────────────
// BATCH MODE: Generate all contracts
// ──────────────────────────────────────────────
async function handleBatchGenerate() {
    if (!batchData || batchData.length === 0) return;
    hideResults();
    hideError();

    setLoadingState(DOM.btnGenerarLote, true);

    const zip = new JSZip();
    const total = batchData.length;
    let successful = 0;
    let failed = 0;

    try {
        // OPTIMIZACIÓN: Cargar la plantilla una sola vez para todo el lote
        const response = await fetch('template.docx');
        if (!response.ok) throw new Error('No se pudo cargar la plantilla base.');
        const baseBuffer = await response.arrayBuffer();

        for (let i = 0; i < total; i++) {
            const row = batchData[i];
            const rowNum = i + 1;
            const name = row.arrendatario_nombre || row.nombre || `Fila_${rowNum}`;

            showProgress(
                `Procesando contrato ${rowNum} de ${total}...`,
                ((i) / total) * 90,
                `Generando contrato para: ${name}`
            );

            try {
                const templateData = buildContractData(row);
                // Pasar el baseBuffer para ganar velocidad
                const blob = await generateDocx(templateData, name, baseBuffer);

                const safeName = name.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').replace(/\s+/g, '_');
                // SOLUCIÓN: Agregar rowNum al nombre del archivo para evitar colisiones si el nombre se repite
                zip.file(`${rowNum}_Contrato_${safeName}.docx`, blob);
                successful++;
            } catch (err) {
                console.error(`Error en fila ${rowNum}:`, err);
                failed++;
                zip.file(`ERROR_Fila_${rowNum}.txt`, `Error generando contrato para ${name}:\n${err.message}`);
            }

            // No longer need a large timeout since we are not calling Gemini API
            if (i < total - 1) {
                await new Promise(r => setTimeout(r, 100));
            }
        }

        showProgress('Empaquetando archivos en .zip...', 95, '');

        const zipBlob = await zip.generateAsync({ type: 'blob' });

        showProgress('¡Listo!', 100, '');

        const timestamp = new Date().toISOString().slice(0, 10);
        const zipFileName = `Contratos_Arriendo_${timestamp}.zip`;

        showResult(
            `${successful} contrato(s) generado(s) exitosamente${failed > 0 ? `, ${failed} con errores` : ''}`,
            [{
                label: `Descargar ${zipFileName}`,
                onClick: () => saveAs(zipBlob, zipFileName)
            }]
        );

        hideProgress();
    } catch (error) {
        hideProgress();
        showError(`Error en el proceso masivo: ${error.message}`);
    } finally {
        setLoadingState(DOM.btnGenerarLote, false);
    }
}

// ──────────────────────────────────────────────
// DRAG & DROP HANDLERS
// ──────────────────────────────────────────────
function initDragAndDrop() {
    const dz = DOM.dropZone;

    dz.addEventListener('click', () => DOM.fileInput.click());

    dz.addEventListener('dragover', (e) => {
        e.preventDefault();
        dz.classList.add('drag-over');
    });

    dz.addEventListener('dragleave', () => {
        dz.classList.remove('drag-over');
    });

    dz.addEventListener('drop', (e) => {
        e.preventDefault();
        dz.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    });

    DOM.fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    DOM.removeFile.addEventListener('click', removeUploadedFile);
}



// ──────────────────────────────────────────────
// DYNAMIC ROWS
// ──────────────────────────────────────────────
function initDynamicRows() {
    // Offices
    DOM.btnAddOffice.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'flex gap-2 items-center';
        div.innerHTML = `
            <input type="text" name="oficina_num" required placeholder="Oficina (ej. 802)" class="input-field flex-1" />
            <input type="text" name="oficina_m2" required placeholder="M2 (ej. 20,81)" class="input-field w-32" />
            <button type="button" class="remove-row p-2 text-gray-500 hover:text-red-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        `;
        DOM.oficinasContainer.appendChild(div);
    });

    // Parkings
    DOM.btnAddParking.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'flex gap-2 items-center';
        div.innerHTML = `
            <input type="text" name="estacionamiento_num" placeholder="N° Estac. (ej. 196)" class="input-field flex-1" />
            <button type="button" class="remove-row p-2 text-gray-500 hover:text-red-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        `;
        DOM.estacionamientosContainer.appendChild(div);
    });

    // Global listener for removals
    document.addEventListener('click', (e) => {
        if (e.target.closest('.remove-row')) {
            e.target.closest('.flex').remove();
        }
        if (e.target.closest('.remove-office') || e.target.closest('.remove-parking')) {
            // Original static rows remove logic if needed
            e.target.closest('.flex').remove();
        }
    });
}

// ──────────────────────────────────────────────
// INITIALIZATION
// ──────────────────────────────────────────────
function init() {
    // Tab switching
    DOM.tabManual.addEventListener('click', () => switchTab('manual'));
    DOM.tabBatch.addEventListener('click', () => switchTab('batch'));

    // Manual form submission
    DOM.manualForm.addEventListener('submit', handleManualGenerate);

    // Batch mode
    initDragAndDrop();
    DOM.btnGenerarLote.addEventListener('click', handleBatchGenerate);

    // Dynamic rows
    initDynamicRows();

    // Contract type change (show alert for disabled types)
    DOM.contractType.addEventListener('change', (e) => {
        if (e.target.value !== 'arriendo') {
            e.target.value = 'arriendo';
        }
    });

    // Template download
    DOM.btnDownloadTemplate.addEventListener('click', downloadExcelTemplate);
}

// ──────────────────────────────────────────────
// INVENTORY UPDATE LOGIC
// ──────────────────────────────────────────────
async function handleInventoryUpdate() {
    const fileCrm = $('#file_crm').files[0];
    const fileEstatus = $('#file_estatus').files[0];
    const btn = $('#btnActualizarEstatus');

    if (!fileCrm || !fileEstatus) {
        showError('Por favor selecciona ambos archivos (CRM y Estatus).');
        return;
    }

    setLoadingState(btn, true);
    hideError();
    hideResults();
    showProgress('Actualizando inventario...', 30, 'Procesando archivos y calculando estados.');

    const formData = new FormData();
    formData.append('file_crm', fileCrm);
    formData.append('file_estatus', fileEstatus);

    try {
        const response = await fetch('/api/update_status', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Error en el servidor al actualizar el estatus.');
        }

        const blob = await response.blob();
        saveAs(blob, 'Estatus_Actualizado.xlsx');

        showProgress('¡Listo!', 100, 'El archivo se ha descargado correctamente.');
        showResult('Inventario actualizado con éxito.', [{
            label: 'Cerrar',
            onClick: hideResults
        }]);

    } catch (error) {
        showError(error.message);
    } finally {
        setLoadingState(btn, false);
        hideProgress();
    }
}

function initInventoryUpdateUI() {
    const inputCrm = $('#file_crm');
    const labelCrm = $('#label_crm');
    const inputEstatus = $('#file_estatus');
    const labelEstatus = $('#label_estatus');

    inputCrm.addEventListener('change', (e) => {
        const name = e.target.files[0]?.name || 'Seleccionar archivo...';
        labelCrm.textContent = name;
        labelCrm.classList.toggle('text-white', !!e.target.files[0]);
    });

    inputEstatus.addEventListener('change', (e) => {
        const name = e.target.files[0]?.name || 'Seleccionar archivo...';
        labelEstatus.textContent = name;
        labelEstatus.classList.toggle('text-white', !!e.target.files[0]);
    });

    $('#btnActualizarEstatus').addEventListener('click', handleInventoryUpdate);
}

// ──────────────────────────────────────────────
// TEMPLATE DOWNLOAD LOGIC
// ──────────────────────────────────────────────
function downloadExcelTemplate() {
    // Definimos los encabezados exactos que tu script espera
    const headers = [
        "arrendatario_nombre", "arrendatario_rut", "arrendatario_domicilio",
        "arrendatario_telefono", "arrendatario_email", "representante_nombre",
        "representante_rut", "piso", "ubi_estacionamiento", "oficinas",
        "superficie", "estacionamientos", "fecha_contrato", "plazo_meses",
        "monto_renta_uf", "monto_garantia_uf", "porcentaje_multa_atraso", "dias_aviso"
    ];

    // Fila de ejemplo con formato real
    const exampleRow = {
        "arrendatario_nombre": "Inversiones San Juan SpA",
        "arrendatario_rut": "76.123.456-7",
        "arrendatario_domicilio": "Av. Providencia 1234, Of. 501, Providencia",
        "arrendatario_telefono": "+569 1234 5678",
        "arrendatario_email": "contacto@empresa.cl",
        "representante_nombre": "Juan Pérez Rodríguez",
        "representante_rut": "12.345.678-9",
        "piso": "octavo piso",
        "ubi_estacionamiento": "cuarto subterráneo",
        "oficinas": "802 y 803",
        "superficie": "32,00 y 20,81",
        "estacionamientos": "195 y 196",
        "fecha_contrato": "01 Marzo de 2026",
        "plazo_meses": 12,
        "monto_renta_uf": 25.5,
        "monto_garantia_uf": 30,
        "porcentaje_multa_atraso": 5,
        "dias_aviso": 60
    };

    // Crear el libro de trabajo usando SheetJS (XLSX)
    const worksheet = XLSX.utils.json_to_sheet([exampleRow], { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla_Contratos");

    // Forzar descarga
    XLSX.writeFile(workbook, "Plantilla_Generacion_Masiva.xlsx");
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    init();
    initInventoryUpdateUI();
});
