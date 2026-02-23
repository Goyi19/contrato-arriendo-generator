/* ═══════════════════════════════════════════════════
   ContratoAI — Plantilla Prompt para LLM
   ═══════════════════════════════════════════════════
   
   CÓMO FUNCIONA ESTA PLANTILLA:
   ----------------------------------
   Usa a Gemini para adaptar UNICAMENTE las diferencias gramaticales y sintácticas 
   generadas por la cantidad de oficinas, estacionamientos, y variables del contrato.
   Retorna JSON para inyectar en docxtemplater preservando 100% el formato del original docx.
   ═══════════════════════════════════════════════════ */

/**
 * Construye el prompt completo que se enviará a la API de Google Gemini.
 * @param {Object} data - Objeto con los datos del formulario o CSV
 * @returns {string} - El prompt completo para Gemini
 */
function getPromptForGemini(data) {
   return `Eres un asistente experto gramatical. Tu tarea es recibir datos de un contrato de arriendo y generar un objeto JSON ESTRICTO con la estructura gramatical perfecta para inyectar en una plantilla Word.
   
IMPORTANTE:
- NO generes un documento de texto. Devuelve SOLO Y EXCLUSIVAMENTE UN OBJETO JSON VÁLIDO.
- No incluyas comentarios iniciales ni finales, ni etiquetas markdown (como \`\`\`json). Debe ser parseable directo con JSON.parse().
- Si falta algún dato del representante y no aplica, deja "representante_nombre" y "representante_rut" como vacíos ("").
- Asegúrate de adaptar singular y plural correctamente para las claves de texto de oficina.

INSTRUCCIONES GRAMATICALES:
1. "oficinas_texto": Ej. singular: "la oficina número 803 y el estacionamiento 195 del cuarto subterráneo,". Ej. plural: "las oficinas número 803 y 802 del octavo piso, y los estacionamientos 195 y 196 del cuarto subterráneo,".
2. "oficinas_texto_2": Igual, pero es para la cláusula SEGUNDA. Ej. múltiple: "las oficinas número 803, 802 del octavo piso y estacionamientos 195 y 196 del cuarto subterráneo,".
3. "superficie_texto": Ej: "32,00 y 20,81 metros cuadrados respectivamente" o "32,00 metros cuadrados".

CLAVES DEL JSON A GENERAR Y SUS VALORES A ADAPTAR:
"fecha_contrato": "${data.fecha_contrato || '01 Septiembre de 2025'}",
"arrendatario_nombre": "${data.arrendatario_nombre || ''}",
"arrendatario_rut": "${data.arrendatario_rut || ''}",
"representante_nombre": "${data.representante_nombre || ''}",
"representante_rut": "${data.representante_rut || ''}",
"arrendatario_domicilio": "${data.arrendatario_domicilio || ''}",
"oficinas_texto": "Texto redactado gramaticalmente considerando Oficinas: ${data.oficinas || ''}, Piso: ${data.piso || ''} y Estacionamientos: ${data.estacionamientos || ''}",
"oficinas_texto_2": "Texto redactado gramaticalmente considerando Oficinas: ${data.oficinas || ''}, Piso: ${data.piso || ''} y Estacionamientos: ${data.estacionamientos || ''}",
"superficie_texto": "Texto redactado con Superficie: ${data.superficie || ''}",
"plazo_meses": "${data.plazo_meses || '12'}",
"dias_aviso": "${data.dias_aviso || '60'}",
"monto_renta_uf": "${data.monto_renta_uf || '28'}",
"porcentaje_multa_atraso": "${data.porcentaje_multa_atraso || '5'}"

Asegúrate de que la salida empiece con '{' y termine con '}'. ¡Genera el JSON ahora!`;
}