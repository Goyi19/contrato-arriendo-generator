/* ═══════════════════════════════════════════════════
   ContratoAI — Main Application Logic
   ═══════════════════════════════════════════════════ */

// ──────────────────────────────────────────────
// DOM REFERENCES
// ──────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
    apiKeyInput: $('#apiKeyInput'),
    saveApiKey: $('#saveApiKey'),
    toggleApiKeyVisibility: $('#toggleApiKeyVisibility'),
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
};

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
let batchData = null; // Parsed rows from CSV/Excel

// ──────────────────────────────────────────────
// API KEY MANAGEMENT
// ──────────────────────────────────────────────
function loadApiKey() {
    const saved = localStorage.getItem('gemini_api_key');
    if (saved) {
        DOM.apiKeyInput.value = saved;
        showApiKeyStatus('✓ API Key cargada desde tu navegador', 'text-emerald-400');
    }
}

function saveApiKey() {
    const key = DOM.apiKeyInput.value.trim();
    if (!key) {
        showApiKeyStatus('⚠ Ingresa una API Key válida', 'text-amber-400');
        return;
    }
    localStorage.setItem('gemini_api_key', key);
    showApiKeyStatus('✓ API Key guardada exitosamente', 'text-emerald-400');
}

function getApiKey() {
    return DOM.apiKeyInput.value.trim() || localStorage.getItem('gemini_api_key') || '';
}

function showApiKeyStatus(msg, colorClass) {
    DOM.apiKeyStatus.textContent = msg;
    DOM.apiKeyStatus.className = `mt-3 text-xs ${colorClass}`;
    DOM.apiKeyStatus.classList.remove('hidden');
    setTimeout(() => DOM.apiKeyStatus.classList.add('hidden'), 4000);
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
// GEMINI API CALL
// ──────────────────────────────────────────────
async function callGeminiAPI(prompt) {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error('No has configurado tu API Key de Google Gemini. Pégala en el campo de arriba y presiona "Guardar Key".');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 8192,
            }
        })
    });

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        if (response.status === 400) {
            throw new Error('API Key inválida o solicitud malformada. Verifica que tu API Key sea correcta.');
        } else if (response.status === 429) {
            throw new Error('Has excedido el límite de la API gratuita. Espera unos minutos e intenta de nuevo.');
        } else if (response.status === 403) {
            throw new Error('API Key sin permisos. Asegúrate de haber habilitado la API de Generative Language en tu proyecto de Google.');
        }
        throw new Error(`Error de la API (${response.status}): ${errBody?.error?.message || 'Error desconocido'}`);
    }

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error('La API no devolvió texto. Intenta de nuevo.');
    }

    return text.trim();
}

// ──────────────────────────────────────────────
// GENERATE .DOCX FILE
// ──────────────────────────────────────────────
async function generateDocx(contractText, fileName) {
    const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = docx;

    // Split text into lines and create paragraphs
    const lines = contractText.split('\n');
    const paragraphs = [];

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            paragraphs.push(new Paragraph({ spacing: { after: 120 } }));
            continue;
        }

        // Title detection
        if (trimmed === 'CONTRATO DE ARRIENDO' || trimmed === 'CONTRATO DE ARRENDAMIENTO') {
            paragraphs.push(new Paragraph({
                children: [new TextRun({ text: trimmed, bold: true, size: 32, font: 'Times New Roman' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            }));
            continue;
        }

        // Centered subtitle lines (company names, "Y" separator)
        if (trimmed === 'Y' || trimmed.startsWith('INVERSIONES') || trimmed.match(/^[A-ZÁÉÍÓÚÑ\s,.]+SpA$/)) {
            paragraphs.push(new Paragraph({
                children: [new TextRun({ text: trimmed, bold: true, size: 24, font: 'Times New Roman' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
            }));
            continue;
        }

        // Clause headers (PRIMERO:, DÉCIMO TERCERO:, VIGÉSIMO QUINTO:, PERSONERÍAS., etc.)
        const clauseMatch = trimmed.match(/^(PRIMERO|SEGUNDO|TERCERO|CUARTO|QUINTO|SEXTO|SÉPTIMO|OCTAVO|NOVENO|DÉCIMO(\s+(TERCERO|CUARTO|QUINTO|SEXTO|SÉPTIMO|OCTAVO|NOVENO))?|UNDÉCIMO|DUODÉCIMO|VIGÉSIMO(\s+(PRIMERO|SEGUNDO|TERCERO|CUARTO|QUINTO))?|PERSONERÍAS)[.:]/i);
        if (clauseMatch) {
            paragraphs.push(new Paragraph({
                children: [new TextRun({ text: trimmed, bold: true, size: 24, font: 'Times New Roman' })],
                spacing: { before: 300, after: 150 },
            }));
            continue;
        }

        // ALL-CAPS closing statement (e.g. "EL PRESENTE CONTRATO DE ARRENDAMIENTO SE SUSCRIBE...")
        if (trimmed === trimmed.toUpperCase() && trimmed.length > 30 && !trimmed.startsWith('_')) {
            paragraphs.push(new Paragraph({
                children: [new TextRun({ text: trimmed, bold: true, size: 24, font: 'Times New Roman' })],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { before: 300, after: 150 },
            }));
            continue;
        }

        // Signature lines (underscores)
        if (trimmed.startsWith('_')) {
            paragraphs.push(new Paragraph({
                children: [new TextRun({ text: trimmed, size: 24, font: 'Times New Roman' })],
                spacing: { before: 400, after: 80 },
            }));
            continue;
        }

        // Signature labels (pp. lines)
        if (trimmed.startsWith('pp.') || trimmed.startsWith('RUT:')) {
            paragraphs.push(new Paragraph({
                children: [new TextRun({ text: trimmed, size: 24, font: 'Times New Roman' })],
                spacing: { after: 80 },
            }));
            continue;
        }

        // Subclauses: /Uno/, /Dos/, /A/, /B/, /i/, /ii/, etc.
        if (/^\/[A-Za-záéíóú]+\//.test(trimmed)) {
            paragraphs.push(new Paragraph({
                children: [new TextRun({ text: trimmed, size: 24, font: 'Times New Roman' })],
                indent: { left: 720 },
                spacing: { after: 80 },
            }));
            continue;
        }

        // Traditional subclauses (a), b), etc.)
        if (/^[a-z]\)/.test(trimmed)) {
            paragraphs.push(new Paragraph({
                children: [new TextRun({ text: trimmed, size: 24, font: 'Times New Roman' })],
                indent: { left: 720 },
                spacing: { after: 80 },
            }));
            continue;
        }

        // Regular text
        paragraphs.push(new Paragraph({
            children: [new TextRun({ text: trimmed, size: 24, font: 'Times New Roman' })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
        }));
    }

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                }
            },
            children: paragraphs,
        }],
    });

    const blob = await Packer.toBlob(doc);
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
// MANUAL MODE: Collect form data
// ──────────────────────────────────────────────
function getFormData() {
    const formData = new FormData(DOM.manualForm);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
}

// ──────────────────────────────────────────────
// MANUAL MODE: Generate single contract
// ──────────────────────────────────────────────
async function handleManualGenerate(e) {
    e.preventDefault();
    hideResults();
    hideError();

    const data = getFormData();
    const prompt = getPromptForGemini(data);

    setLoadingState(DOM.btnGenerar, true);
    showProgress('Enviando datos a Google Gemini...', 20, 'La IA está redactando tu contrato con gramática perfecta.');

    try {
        showProgress('La IA está procesando tu contrato...', 50, 'Ajustando gramática, singulares, plurales y artículos...');
        const contractText = await callGeminiAPI(prompt);

        showProgress('Generando archivo .docx...', 85, 'Creando documento Word con formato profesional...');
        const blob = await generateDocx(contractText, 'contrato');

        showProgress('¡Listo!', 100, '');

        const safeName = (data.arrendatario_nombre || 'contrato').replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').replace(/\s+/g, '_');
        const downloadFileName = `Contrato_Arriendo_${safeName}.docx`;

        showResult(`Contrato generado para ${data.arrendatario_nombre}`, [{
            label: `Descargar ${downloadFileName}`,
            onClick: () => saveAs(blob, downloadFileName)
        }]);

        hideProgress();
    } catch (error) {
        hideProgress();
        showError(error.message);
    } finally {
        setLoadingState(DOM.btnGenerar, false);
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
                const prompt = getPromptForGemini(row);
                const contractText = await callGeminiAPI(prompt);
                const blob = await generateDocx(contractText, name);

                const safeName = name.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').replace(/\s+/g, '_');
                zip.file(`Contrato_${safeName}.docx`, blob);
                successful++;
            } catch (err) {
                console.error(`Error en fila ${rowNum}:`, err);
                failed++;
                // Add error log to zip
                zip.file(`ERROR_Fila_${rowNum}.txt`, `Error generando contrato para ${name}:\n${err.message}`);
            }

            // Rate limiting: wait 1.5 seconds between API calls to avoid 429
            if (i < total - 1) {
                await new Promise(r => setTimeout(r, 1500));
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
// API KEY VISIBILITY TOGGLE
// ──────────────────────────────────────────────
function initApiKeyToggle() {
    DOM.toggleApiKeyVisibility.addEventListener('click', () => {
        const input = DOM.apiKeyInput;
        input.type = input.type === 'password' ? 'text' : 'password';
    });
}

// ──────────────────────────────────────────────
// INITIALIZATION
// ──────────────────────────────────────────────
function init() {
    // Load saved API key
    loadApiKey();

    // API Key save button
    DOM.saveApiKey.addEventListener('click', saveApiKey);

    // Allow saving with Enter key
    DOM.apiKeyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); saveApiKey(); }
    });

    // Toggle API key visibility
    initApiKeyToggle();

    // Tab switching
    DOM.tabManual.addEventListener('click', () => switchTab('manual'));
    DOM.tabBatch.addEventListener('click', () => switchTab('batch'));

    // Manual form submission
    DOM.manualForm.addEventListener('submit', handleManualGenerate);

    // Batch mode
    initDragAndDrop();
    DOM.btnGenerarLote.addEventListener('click', handleBatchGenerate);

    // Contract type change (show alert for disabled types)
    DOM.contractType.addEventListener('change', (e) => {
        if (e.target.value !== 'arriendo') {
            e.target.value = 'arriendo';
        }
    });
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
