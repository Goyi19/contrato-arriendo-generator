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
    // Bodegas fields
    oficinasInfoAdicional: $('#oficinasInfoAdicional'),
    oficinasContainerWrapper: $('#oficinasContainerWrapper'),
    estacionamientosContainerWrapper: $('#estacionamientosContainerWrapper'),
    multaGroup: $('#multaGroup'),
    rentaMensualGroup: $('#rentaMensualGroup'),
    bodegasGroup: $('#bodegasGroup'),
    bodegasContainer: $('#bodegasContainer'),
    btnAddBodega: $('#btnAddBodega'),
    diaPagoGroup: $('#diaPagoGroup'),
    // Multiple Reps fields
    representantesContainer: $('#representantesContainer'),
    btnAddRepresentante: $('#btnAddRepresentante'),
};

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
let batchData = null; // Parsed rows from CSV/Excel



// ──────────────────────────────────────────────
// VIEW SWITCHING
// ──────────────────────────────────────────────
function switchView(viewName) {
    const views = $$('.view-content');
    const navItems = $$('.nav-item');

    views.forEach(v => {
        if (v.id === `view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`) {
            v.classList.add('active');
            v.classList.remove('hidden');
        } else {
            v.classList.remove('active');
            v.classList.add('hidden');
        }
    });

    navItems.forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Reset status sections when switching views
    hideError();
    hideResults();
    hideProgress();
}

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
        let templateFile = 'template.docx';
        if (DOM.contractType.value === 'bodegas') {
            templateFile = 'template_bodegas_isabel_la_catolica.docx';
        } else if (DOM.contractType.value === 'locales') {
            templateFile = 'template_local_isabel_la_catolica.docx';
        }

        const response = await fetch(templateFile);
        if (!response.ok) {
            throw new Error(`No se pudo cargar la plantilla base (${templateFile}).`);
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
    let rentasLocales = [];

    if (rawData.oficina_num) {
        // From dynamic manual form
        oficinas = Array.isArray(rawData.oficina_num) ? rawData.oficina_num : [rawData.oficina_num];
        superficies = Array.isArray(rawData.oficina_m2) ? rawData.oficina_m2 : [rawData.oficina_m2];
        estacs = Array.isArray(rawData.estacionamiento_num) ? rawData.estacionamiento_num : [rawData.estacionamiento_num];
        rentasLocales = Array.isArray(rawData.renta_local_uf) ? rawData.renta_local_uf : [rawData.renta_local_uf];
    } else {
        // From bread/batch mode (CSV usually has strings)
        const ofisStr = String(rawData.oficinas || '');
        const supStr = String(rawData.superficie || '');
        const estStr = String(rawData.estacionamientos || '');
        const rentasStr = String(rawData.rentas_locales_uf || rawData.renta_local_uf || '');

        oficinas = ofisStr.split(/[y,]/).map(s => s.trim()).filter(Boolean);
        superficies = supStr.split(/[y,]/).map(s => s.trim()).filter(Boolean);
        estacs = estStr.split(/[y,]/).map(s => s.trim()).filter(Boolean);
        rentasLocales = rentasStr.split(/[y,]/).map(s => s.trim()).filter(Boolean);
    }

    // Filter and trim first
    // Deduplicate using Set while preserving order
    const validOfis = Array.from(new Set(oficinas.map(o => String(o).trim()).filter(Boolean)));
    const validSup = Array.from(new Set(superficies.map(s => String(s).trim()).filter(Boolean)));
    const validEstacs = Array.from(new Set(estacs.map(e => String(e).trim()).filter(Boolean)));
    // Map rental amounts positionally
    const validRentasLocales = validOfis.map((_, i) => (rentasLocales[i] ? String(rentasLocales[i]).trim() : String(rawData.monto_renta_uf || '').trim()));

    // For Bodegas
    let bodegas = [];
    if (rawData.bodega_num) {
        bodegas = Array.isArray(rawData.bodega_num) ? rawData.bodega_num : [rawData.bodega_num];
    } else {
        const bodStr = String(rawData.bodegas || '');
        bodegas = bodStr.split(/[y,]/).map(s => s.trim()).filter(Boolean);
    }
    const validBodegas = Array.from(new Set(bodegas.map(b => String(b).trim()).filter(Boolean)));

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

    // Representante Logic
    let repNames = [];
    let repRuts = [];
    if (rawData.representante_nombre) {
        repNames = Array.isArray(rawData.representante_nombre) ? rawData.representante_nombre : [rawData.representante_nombre];
        repRuts = Array.isArray(rawData.representante_rut) ? rawData.representante_rut : [rawData.representante_rut];
    } else {
        const rNameStr = String(rawData.representante_nombre || '');
        const rRutStr = String(rawData.representante_rut || '');
        repNames = rNameStr.split(/[y,]/).map(s => s.trim()).filter(Boolean);
        // Let's assume the same delimiter for Ruts (rarely comma separeted but handled just in case)
        repRuts = rRutStr.split(/[y,]/).map(s => s.trim()).filter(Boolean);
    }

    repNames = repNames.map(n => String(n).trim()).filter(Boolean);
    repRuts = repRuts.map(r => String(r).trim()).filter(Boolean);

    const validRepsObj = repNames.map((name, index) => {
        return {
            nombre: name,
            rut: repRuts[index] || ''
        }
    });

    const multipleReps = validRepsObj.length > 1;
    let formatRepsList = '';
    validRepsObj.forEach((rep, index) => {
        if (index === 0) {
            formatRepsList += `don ${rep.nombre}, cédula nacional de identidad número ${rep.rut}`;
        } else if (index === validRepsObj.length - 1) {
            formatRepsList += ` y don ${rep.nombre}, cédula nacional de identidad número ${rep.rut}`;
        } else {
            formatRepsList += `, don ${rep.nombre}, cédula nacional de identidad número ${rep.rut}`;
        }
    });

    // We keep legacy variable for the Arriendo/Bodegas that expect it in the old format
    // But since the new Locales uses `{reps_lista}` and `{rep_unico}` we provide them too.
    const rep_nombre = repNames[0] || '';
    const rep_rut = repRuts[0] || '';
    const arrendatario_representante_texto = rep_nombre ? `, representada por don ${rep_nombre}, cédula nacional de identidad número ${rep_rut}` : "";


    // Fiadores Variables (Same logic for naming, used in Locales)
    let formatFiadoresList = '';
    validRepsObj.forEach((rep, index) => {
        if (index === 0) {
            formatFiadoresList += `don ${rep.nombre}`;
        } else if (index === validRepsObj.length - 1) {
            formatFiadoresList += ` y don ${rep.nombre}`;
        } else {
            formatFiadoresList += `, don ${rep.nombre}`;
        }
    });


    // Signature Logic
    const rawFirmaNombre = rep_nombre || rawData.arrendatario_nombre || '';
    const rawFirmaRut = rep_rut || rawData.arrendatario_rut || '';

    // Locales specific: detalle renta 
    const isLocales = DOM.contractType && DOM.contractType.value === 'locales';
    let detalle_renta_locales = [];
    if (isLocales && validOfis.length > 0) {
        // This simulates the table/list structure docxtemplater expects for multiple item replacement blocks if we were to loop over them.
        // Wait, docxtemplater will loop over '{#detalle_renta_locales} - Local {num}: UF {monto} {/detalle_renta_locales}'.
        // The previous implementation used a single replaced variable '{detalle_renta_locales}' containing line breaks. Let's do that for now.
        validOfis.forEach((num, index) => {
            const montoUF = validRentasLocales[index] || rawData.monto_renta_uf;
            detalle_renta_locales.push(`\t\t\t\t- Local N° ${num}: la suma equivalente en pesos a ${montoUF} Unidades de Fomento mensuales.`);
        });
    }

    // Result object
    return {
        // Sections & Grammar
        multiple_ofis: validOfis.length > 1,
        multiple_locales: validOfis.length > 1, // Synonym for locales
        oficinas_lista: formatList(validOfis),
        locales_lista: formatList(validOfis), // Synonym for locales
        oficina_unica: validOfis[0] || '',
        local_unico: validOfis[0] || '', // Synonym for locales
        parentesis_plural: validOfis.length === 2 ? 'ambas oficinas' : 'todas estas oficinas',
        nivel_local: rawData.piso ? `en su ${rawData.piso},` : '',

        tiene_estac: validEstacs.length > 0,
        multiple_estac: validEstacs.length > 1,
        estacs_lista: formatList(validEstacs),
        estac_unico: validEstacs[0] || '',
        ubi_estac: ubiEstac,

        sup_lista: formatList(validSup),
        sup_unica: validSup[0] || '',
        oficinas_lista_d: formatListD(validOfis) + ' ', // Fix Bug 2 (plural)

        // Bodegas Grammar
        multiple_bodegas: validBodegas.length > 1,
        bodegas_lista: formatList(validBodegas),
        bodegas_unica: validBodegas[0] || '',
        nivel_bodega: rawData.nivel_bodega || '',
        dia_pago: rawData.dia_pago || '',

        // Locales Specific
        detalle_renta_locales: detalle_renta_locales.length > 0 ? detalle_renta_locales.join('\n') : '',

        // Basic Info
        fecha_contrato: rawData.fecha_contrato || '',
        arrendatario_nombre: rawData.arrendatario_nombre || '',
        arrendatario_rut: rawData.arrendatario_rut || '',

        // Reps Legacy
        arrendatario_representante_texto,
        representante_nombre: rep_nombre,
        representante_rut: rep_rut,

        // Reps Multiple (New)
        representante_nombre_lista: validRepsObj[0] ? validRepsObj[0].nombre : rawFirmaNombre,
        multiple_reps: multipleReps,
        reps_lista: formatRepsList,
        rep_unico: formatRepsList, // same string just grammar changes in word "representados" vs "representado" 
        fiadores_lista_completa: formatFiadoresList,
        fiador_unico_completo: formatFiadoresList,

        rep_1_nombre: validRepsObj[0] ? validRepsObj[0].nombre : rawFirmaNombre,
        rep_1_rut: validRepsObj[0] ? validRepsObj[0].rut : rawFirmaRut,
        rep_2_nombre: validRepsObj[1] ? validRepsObj[1].nombre : '',
        rep_2_rut: validRepsObj[1] ? validRepsObj[1].rut : '',

        arrendatario_domicilio: rawData.arrendatario_domicilio || '',
        piso: piso,

        plazo_meses: rawData.plazo_meses || '',
        dias_aviso: rawData.dias_aviso || '',
        fecha_termino_anticipado: rawData.fecha_termino_anticipado || '',
        monto_renta_uf: rawData.monto_renta_uf || '',
        monto_garantia_uf: rawData.monto_garantia_uf || '',
        porcentaje_multa_atraso: rawData.porcentaje_multa_atraso || '',

        arrendatario_telefono: Array.isArray(rawData.arrendatario_telefono) ? Array.from(new Set(rawData.arrendatario_telefono.map(v => String(v).trim()).filter(Boolean)))[0] || '' : String(rawData.arrendatario_telefono || '').trim(),
        arrendatario_email: (Array.isArray(rawData.arrendatario_email) ? Array.from(new Set(rawData.arrendatario_email.map(v => String(v).trim()).filter(Boolean)))[0] || '' : String(rawData.arrendatario_email || '').trim()) + '\n', // Fix Bug 1

        // Signature fields (Legacy)
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
        let typePrefix = "Arriendo";
        if (DOM.contractType.value === 'bodegas') typePrefix = "Bodegas";
        if (DOM.contractType.value === 'locales') typePrefix = "Locales";
        const downloadFileName = `Contrato_${typePrefix}_${safeName}.docx`;

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
        let templateFile = 'template.docx';
        if (DOM.contractType.value === 'bodegas') {
            templateFile = 'template_bodegas_isabel_la_catolica.docx';
        } else if (DOM.contractType.value === 'locales') {
            templateFile = 'template_local_isabel_la_catolica.docx';
        }

        const response = await fetch(templateFile);
        if (!response.ok) throw new Error(`No se pudo cargar la plantilla base (${templateFile}).`);
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
        const isLocales = DOM.contractType && DOM.contractType.value === 'locales';
        const placeholderText = isLocales ? "Local (ej. 101)" : "Oficina (ej. 802)";
        const div = document.createElement('div');
        div.className = 'flex gap-2 items-center';
        div.innerHTML = `
            <input type="text" name="oficina_num" required placeholder="${placeholderText}" class="input-field flex-1" />
            <input type="text" name="oficina_m2" required placeholder="M2 (ej. 20,81)" class="input-field w-24" />
            <input type="text" name="renta_local_uf" placeholder="UF (ej. 28)" class="input-field w-24" />
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

    // Bodegas
    DOM.btnAddBodega.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'bodega-row flex gap-2 items-center';
        div.innerHTML = `
            <input type="text" name="bodega_num" placeholder="Bodega (ej. 39)" class="input-field flex-1" />
            <button type="button" class="remove-row p-2 text-gray-500 hover:text-red-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        `;
        DOM.bodegasContainer.appendChild(div);
    });

    // Representantes
    if (DOM.btnAddRepresentante) {
        DOM.btnAddRepresentante.addEventListener('click', () => {
            const div = document.createElement('div');
            // Adding margin-top via 'mt-2' if it's dynamic
            div.className = 'rep-row flex flex-col sm:flex-row gap-2 items-start sm:items-center mt-2 p-3 sm:p-0 bg-gray-800/80 sm:bg-transparent rounded-lg border border-white/5 sm:border-transparent';
            div.innerHTML = `
                <input type="text" name="representante_nombre" placeholder="Nombre (ej. Juan Pérez)" class="input-field flex-1" />
                <input type="text" name="representante_rut" placeholder="RUT (ej. 12.345.678-9)" class="input-field w-full sm:w-48" />
                <button type="button" class="remove-row p-2 text-gray-500 hover:text-red-400 transition-colors self-end sm:self-auto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            `;
            DOM.representantesContainer.appendChild(div);
        });
    }

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
    // Sidebar navigation
    $$('.nav-item').forEach(item => {
        item.addEventListener('click', () => switchView(item.dataset.view));
    });

    // Tab switching
    DOM.tabManual.addEventListener('click', () => switchTab('manual'));
    DOM.tabBatch.addEventListener('click', () => switchTab('batch'));

    // Manual form submission
    DOM.manualForm.addEventListener('submit', handleManualGenerate);

    // Batch mode
    initDragAndDrop();
    DOM.btnGenerarLote.addEventListener('click', handleBatchGenerate);

    // Inventory Update
    const btnActualizarEstatus = $('#btnActualizarEstatus');
    if (btnActualizarEstatus) {
        btnActualizarEstatus.addEventListener('click', handleInventoryUpdate);
    }

    // Dynamic rows
    initDynamicRows();

    // Init Scraping / Analisis Territorial
    initScrapingEvents();

    // Contract type change (show alert for disabled types and toggle fields)
    DOM.contractType.addEventListener('change', (e) => {
        const arriendoFields = $$('input[name="piso"], input[name="ubi_estacionamiento"], input[name="oficina_num"], input[name="oficina_m2"]');
        const bodegasFields = $$('input[name="bodega_num"], input[name="nivel_bodega"]');

        if (e.target.value === 'arriendo') {
            DOM.oficinasInfoAdicional.classList.remove('hidden');
            DOM.oficinasContainerWrapper.classList.remove('hidden');
            DOM.oficinasContainerWrapper.querySelector('label').textContent = 'Oficinas y Superficies';
            DOM.estacionamientosContainerWrapper.classList.remove('hidden');
            DOM.multaGroup.classList.remove('hidden');
            DOM.bodegasGroup.classList.add('hidden');
            DOM.diaPagoGroup.classList.add('hidden');
            if (DOM.rentaMensualGroup) {
                DOM.rentaMensualGroup.classList.remove('hidden');
                const rentInput = DOM.rentaMensualGroup.querySelector('input');
                if (rentInput) rentInput.required = true;
            }
            arriendoFields.forEach(f => f.required = true);
            bodegasFields.forEach(f => f.required = false);

            // Revert placeholders and button text for oficinas
            $$('input[name="oficina_num"]').forEach(f => f.placeholder = "Oficina (ej. 803)");
            if (DOM.btnAddOffice) DOM.btnAddOffice.innerHTML = '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg> Agregar otra oficina';

        } else if (e.target.value === 'bodegas') {
            DOM.oficinasInfoAdicional.classList.add('hidden');
            DOM.oficinasContainerWrapper.classList.add('hidden');
            DOM.estacionamientosContainerWrapper.classList.add('hidden');
            DOM.multaGroup.classList.add('hidden');
            DOM.bodegasGroup.classList.remove('hidden');
            DOM.diaPagoGroup.classList.remove('hidden');
            if (DOM.rentaMensualGroup) {
                DOM.rentaMensualGroup.classList.remove('hidden');
                const rentInput = DOM.rentaMensualGroup.querySelector('input');
                if (rentInput) rentInput.required = true;
            }
            arriendoFields.forEach(f => f.required = false);
            bodegasFields.forEach(f => f.required = true);
        } else if (e.target.value === 'locales') {
            DOM.oficinasInfoAdicional.classList.add('hidden');
            DOM.oficinasContainerWrapper.classList.remove('hidden');
            DOM.oficinasContainerWrapper.querySelector('label').textContent = 'Locales y Superficies (M2)';
            DOM.estacionamientosContainerWrapper.classList.add('hidden');
            DOM.multaGroup.classList.remove('hidden');
            DOM.bodegasGroup.classList.add('hidden');
            DOM.diaPagoGroup.classList.add('hidden');
            if (DOM.rentaMensualGroup) {
                DOM.rentaMensualGroup.classList.add('hidden');
                const rentInput = DOM.rentaMensualGroup.querySelector('input');
                if (rentInput) rentInput.required = false;
            }
            arriendoFields.forEach(f => f.required = false); // some are false
            $$('input[name="oficina_num"], input[name="oficina_m2"]').forEach(f => f.required = true);
            bodegasFields.forEach(f => f.required = false);

            // Adjust placeholders and button text for locales
            $$('input[name="oficina_num"]').forEach(f => f.placeholder = "Local (ej. 101)");
            if (DOM.btnAddOffice) DOM.btnAddOffice.innerHTML = '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg> Agregar otro local';

        } else {
            // Disabled types fallback to arriendo
            e.target.value = 'arriendo';
        }
    });

    // Trigger initially to set required attributes correctly
    DOM.contractType.dispatchEvent(new Event('change'));

    // Template download
    DOM.btnDownloadTemplate.addEventListener('click', downloadExcelTemplate);

    // File input labels for inventory
    $('#file_crm')?.addEventListener('change', (e) => {
        $('#label_crm').textContent = e.target.files[0]?.name || 'Seleccionar archivo...';
    });
    $('#file_estatus')?.addEventListener('change', (e) => {
        $('#label_estatus').textContent = e.target.files[0]?.name || 'Seleccionar archivo...';
    });
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


// ──────────────────────────────────────────────
// TEMPLATE DOWNLOAD LOGIC
// ──────────────────────────────────────────────
function downloadExcelTemplate() {
    let headers = [];
    let exampleRow = {};

    if (DOM.contractType.value === 'bodegas') {
        headers = [
            "fecha_contrato", "arrendatario_nombre", "arrendatario_rut", "arrendatario_domicilio",
            "representante_nombre", "representante_rut", "arrendatario_email", "arrendatario_telefono",
            "plazo_meses", "dias_aviso", "monto_renta_uf", "monto_garantia_uf",
            "bodegas", "nivel_bodega", "dia_pago"
        ];
        exampleRow = {
            "fecha_contrato": "01 Marzo de 2026",
            "arrendatario_nombre": "Inversiones San Juan SpA",
            "arrendatario_rut": "76.123.456-7",
            "arrendatario_domicilio": "Av. Providencia 1234, Of. 501, Providencia",
            "representante_nombre": "Juan Pérez Rodríguez",
            "representante_rut": "12.345.678-9",
            "arrendatario_email": "contacto@empresa.cl",
            "arrendatario_telefono": "+569 1234 5678",
            "plazo_meses": 12,
            "dias_aviso": 60,
            "monto_renta_uf": 25.5,
            "monto_garantia_uf": 30,
            "bodegas": "39 y 40",
            "nivel_bodega": "-3 subterráneo",
            "dia_pago": 5
        };
    } else {
        headers = [
            "arrendatario_nombre", "arrendatario_rut", "arrendatario_domicilio",
            "arrendatario_telefono", "arrendatario_email", "representante_nombre",
            "representante_rut", "piso", "ubi_estacionamiento", "oficinas",
            "superficie", "estacionamientos", "fecha_contrato", "plazo_meses",
            "monto_renta_uf", "monto_garantia_uf", "porcentaje_multa_atraso", "dias_aviso"
        ];
        exampleRow = {
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
    }

    // Crear el libro de trabajo usando SheetJS (XLSX)
    const worksheet = XLSX.utils.json_to_sheet([exampleRow], { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla_Contratos");

    // Forzar descarga
    XLSX.writeFile(workbook, "Plantilla_Generacion_Masiva.xlsx");
}

// ──────────────────────────────────────────────
// SCRAPING & TERRITORIAL ANALYSIS LOGIC
// ──────────────────────────────────────────────
let map, mainMarker, radiusCircle;
let currentMode = "Comercial";
let categoriesData = null;
let scrapingPins = [];

async function fetchCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error("Network Error");
        categoriesData = await response.json();
    } catch (err) {
        console.warn("Fallo al obtener config de la API. Cargando configuración completa desde archivo local fallback...");
        try {
            const fbResponse = await fetch('/categories_dump.json');
            categoriesData = await fbResponse.json();
        } catch (fbErr) {
            console.error("No se pudo cargar el fallback local", fbErr);
        }
    }
    renderCheckboxes();
}

function renderCheckboxes() {
    const container = $('#categoriesContainer');
    if (!categoriesData) return;

    container.innerHTML = '';

    Object.keys(categoriesData).forEach(modo => {
        const cats = categoriesData[modo];
        if (Object.keys(cats).length === 0) return;

        const groupDiv = document.createElement('div');
        groupDiv.className = 'mb-4';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex items-center justify-between mb-2';

        const title = document.createElement('h4');
        title.className = `text-xs font-bold uppercase tracking-wider ${modo === 'Comercial' ? 'text-amber-500' : 'text-emerald-500'}`;
        title.innerHTML = modo === 'Comercial' ? '🏢 Locales Comerciales' : '📍 Fuentes de Flujo';

        const btnSelectAll = document.createElement('button');
        btnSelectAll.type = 'button';
        btnSelectAll.className = 'text-[10px] text-gray-400 hover:text-white transition-colors underline';
        btnSelectAll.innerText = 'Seleccionar Todos';
        let allSelected = false;

        headerDiv.appendChild(title);
        headerDiv.appendChild(btnSelectAll);
        groupDiv.appendChild(headerDiv);

        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'max-h-48 overflow-y-auto pr-2 border border-white/5 rounded-lg bg-black/20 p-2';

        const gridDiv = document.createElement('div');
        gridDiv.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2';

        const checkboxes = [];

        Object.keys(cats).forEach(key => {
            const cat = cats[key];
            const label = document.createElement('label');
            label.className = 'flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10';

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = key;
            cb.dataset.modo = modo;
            cb.className = 'w-3.5 h-3.5 rounded border-gray-600 text-brand-500 focus:ring-brand-500/50 bg-gray-900/50 cat-checkbox';

            const span = document.createElement('span');
            span.className = 'text-xs text-gray-300 select-none';
            span.innerText = cat.descripcion;

            label.appendChild(cb);
            label.appendChild(span);
            gridDiv.appendChild(label);

            checkboxes.push(cb);
        });

        btnSelectAll.addEventListener('click', () => {
            allSelected = !allSelected;
            checkboxes.forEach(cb => cb.checked = allSelected);
            btnSelectAll.innerText = allSelected ? 'Deseleccionar Todos' : 'Seleccionar Todos';
        });

        scrollWrapper.appendChild(gridDiv);
        groupDiv.appendChild(scrollWrapper);
        container.appendChild(groupDiv);
    });
}

function initGoogleMaps(apiKey) {
    if (window.google && window.google.maps) {
        setupMap();
        return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.onload = () => {
        setupMap();
    };
    script.onerror = () => {
        alert("La API Key ingresada no es válida o hay un error de conexión.");
        setLoadingState($('#btnInitMap'), false);
    };
    document.head.appendChild(script);
}

function setupMap() {
    $('#scrapingControls').classList.remove('hidden');
    $('#btnInitMap').classList.add('hidden');
    $('#gmapsApiKey').disabled = true;

    const center = { lat: -33.4372, lng: -70.6506 }; // Santiago default
    map = new google.maps.Map($('#mapContainer'), {
        center,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 13 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#144b53" }, { "lightness": 14 }, { "weight": 1.4 }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#08304b" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#0c4152" }, { "lightness": 5 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#0b434f" }, { "lightness": 25 }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#0b3d51" }, { "lightness": 16 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "color": "#146474" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#021019" }] }]
    });

    mainMarker = new google.maps.Marker({
        position: center,
        map,
        draggable: true,
        title: "Centro de Búsqueda"
    });

    radiusCircle = new google.maps.Circle({
        map,
        radius: 1000,
        fillColor: '#6366f1',
        fillOpacity: 0.15,
        strokeColor: '#818cf8',
        strokeWeight: 2,
    });
    radiusCircle.bindTo('center', mainMarker, 'position');

    const slider = $('#radiusSlider');
    const radVal = $('#radiusValue');
    slider.addEventListener('input', (e) => {
        let r = parseInt(e.target.value);
        if (r > 3000) { r = 3000; e.target.value = 3000; }
        radiusCircle.setRadius(r);
        radVal.textContent = r + 'm';
        map.fitBounds(radiusCircle.getBounds());
    });

    mainMarker.addListener('dragend', () => {
        map.panTo(mainMarker.getPosition());
    });

    const autocomplete = new google.maps.places.Autocomplete($('#mapSearchInput'));
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        map.panTo(place.geometry.location);
        map.setZoom(15);
        mainMarker.setPosition(place.geometry.location);
    });
}

function initScrapingEvents() {
    // Cargar categorías inmediatamente, sin depender de Google Maps
    fetchCategories();

    $('#btnInitMap')?.addEventListener('click', (e) => {
        const apiKey = $('#gmapsApiKey').value.trim();
        if (!apiKey) {
            alert("Por favor, ingresa tu API Key para cargar el mapa.");
            return;
        }
        setLoadingState(e.target, true);
        initGoogleMaps(apiKey);
    });



    $('#btnAnalizarZona')?.addEventListener('click', handleAnalyzeZone);
}

function clearScrapingPins() {
    scrapingPins.forEach(m => m.setMap(null));
    scrapingPins = [];
}

function extractBase64(base64Data, filename) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
    }
    const blob = new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
}

async function handleAnalyzeZone() {
    const checkedBoxes = Array.from(document.querySelectorAll('.cat-checkbox:checked')).map(cb => ({
        id: cb.value,
        modo: cb.dataset.modo
    }));

    if (checkedBoxes.length === 0) {
        alert("Selecciona al menos una categoría a buscar.");
        return;
    }

    const apiKey = $('#gmapsApiKey').value.trim();
    if (!apiKey || !mainMarker) return;

    const pos = mainMarker.getPosition();
    const payload = {
        api_key: apiKey,
        lat: pos.lat(),
        lng: pos.lng(),
        radius: parseInt($('#radiusSlider').value),
        categories: checkedBoxes
    };

    hideResults();
    hideError();
    setLoadingState($('#btnAnalizarZona'), true);
    showProgress('Buscando ubicaciones...', 40, 'Analizando la zona (' + payload.radius + 'm)');
    clearScrapingPins();

    try {
        const response = await fetch('/api/analyze_zone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Error al analizar la zona.");
        }

        const data = await response.json();
        const locations = data.places || [];
        showProgress('Empaquetando reporte...', 90, `Se encontraron ${locations.length} lugares.`);

        // Add pins to map
        locations.forEach(loc => {
            if (loc.Latitud && loc.Longitud) {
                const isComercial = loc['Modo'] === 'Comercial';
                const marker = new google.maps.Marker({
                    position: { lat: parseFloat(loc.Latitud), lng: parseFloat(loc.Longitud) },
                    map: map,
                    title: loc.Nombre,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: isComercial ? 6 : 5,
                        fillColor: isComercial ? '#f59e0b' : '#10b981',
                        fillOpacity: 0.9,
                        strokeColor: '#ffffff',
                        strokeWeight: 1,
                    }
                });

                const badge = isComercial ?
                    `<span class="px-1.5 py-0.5 bg-amber-500/20 text-amber-600 rounded text-[10px] uppercase font-bold tracking-wide">Comercial</span>` :
                    `<span class="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 rounded text-[10px] uppercase font-bold tracking-wide">Flujo</span>`;

                const info = new google.maps.InfoWindow({
                    content: `<div class="p-2 min-w-32"><strong class="block text-gray-800 text-sm mb-1">${loc.Nombre}</strong>${badge} <span class="text-xs text-gray-500 ml-1">${loc['Categoría']}</span></div>`
                });
                marker.addListener('click', () => info.open(map, marker));
                scrapingPins.push(marker);
            }
        });

        const catCounts = {};
        locations.forEach(l => {
            const c = l['Categoría'] || 'Otro';
            catCounts[c] = (catCounts[c] || 0) + 1;
        });

        const summaryText = Object.entries(catCounts).map(([cat, count]) => `${count} ${cat}`).join(', ');

        showProgress('¡Listo!', 100, '');
        showResult(`Análisis completado: ${locations.length} lugares únicos encontrados. (${summaryText})`, [{
            label: `Descargar Reporte Excel`,
            onClick: () => extractBase64(data.excel_b64, 'Reporte_Análisis_Territorial.xlsx')
        }]);

    } catch (error) {
        showError(error.message);
    } finally {
        setLoadingState($('#btnAnalizarZona'), false);
        hideProgress();
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);

