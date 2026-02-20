# 📄 ContratoAI — Generador Inteligente de Contratos de Arriendo

Aplicación web que automatiza la generación de contratos de arriendo profesionales usando la API de Google Gemini. La IA ajusta automáticamente la gramática (singulares, plurales, artículos) según los datos ingresados.

---

## 📋 Tabla de Contenidos

1. [Cómo obtener tu API Key de Google Gemini](#-cómo-obtener-tu-api-key-de-google-gemini)
2. [Cómo usar la aplicación localmente](#-cómo-usar-la-aplicación-localmente)
3. [Cómo personalizar la plantilla del contrato](#-cómo-personalizar-la-plantilla-del-contrato)
4. [Cómo preparar un archivo para el Modo Masivo](#-cómo-preparar-un-archivo-para-el-modo-masivo)
5. [Cómo desplegar en Vercel (gratis)](#-cómo-desplegar-en-vercel-gratis)
6. [Librerías externas utilizadas](#-librerías-externas-utilizadas)
7. [Preguntas frecuentes](#-preguntas-frecuentes)

---

## 🔑 Cómo obtener tu API Key de Google Gemini

> **¿Qué es una API Key?** Es como una "contraseña" que le dice a Google: "Soy yo, déjame usar tu IA". Es un texto largo que pegas en la app. Google te da acceso gratuito con un límite generoso.

### Paso a paso:

1. **Abre tu navegador** y ve a esta URL exacta:
   
   👉 **https://aistudio.google.com/apikey**

2. **Inicia sesión** con tu cuenta de Google (la misma de Gmail). Si no tienes una, créala gratis en [accounts.google.com](https://accounts.google.com).

3. Verás la página de **Google AI Studio**. Busca el botón que dice **"Create API Key"** (Crear clave de API) y haz clic en él.

4. Te pedirá seleccionar o crear un **proyecto de Google Cloud**:
   - Si nunca has usado Google Cloud, selecciona **"Create API key in new project"** (Crear clave de API en proyecto nuevo).
   - Google creará un proyecto automáticamente. No necesitas configurar nada más.

5. **¡Listo!** Aparecerá tu API Key. Se ve algo así:
   ```
   AIzaSyB1a2C3d4E5f6G7h8I9j0K1L2M3N4O5P6Q
   ```

6. **Copia la API Key completa** (haz clic en el ícono de copiar o selecciónala y presiona Ctrl+C).

7. **Pégala en la aplicación ContratoAI**: en la parte superior de la página, en el campo "Pega tu API Key aquí" y presiona **"Guardar Key"**.

> ⚠️ **Importante**: Tu API Key se guarda SOLO en tu navegador (localStorage). Nunca se envía a ningún servidor nuestro. Sin embargo, no la compartas con nadie.

### Límites de la capa gratuita:
- **15 solicitudes por minuto** (suficiente para uso normal)
- **1,500 solicitudes por día** (suficiente para generar muchos contratos)
- **Gratis** sin necesidad de tarjeta de crédito

---

## 💻 Cómo usar la aplicación localmente

### Opción 1: Simplemente abrir el archivo
1. Descarga o clona esta carpeta completa.
2. Haz **doble clic en `index.html`**.
3. Se abrirá en tu navegador. ¡Listo!

### Opción 2: Usar Live Server (recomendado para desarrollo)
Si tienes **Visual Studio Code**:
1. Instala la extensión **"Live Server"** de Ritwick Dey.
2. Abre la carpeta del proyecto en VS Code.
3. Haz clic derecho en `index.html` → **"Open with Live Server"**.

### Opción 3: Usar Project IDX
1. Sube los archivos a tu proyecto en [Project IDX](https://idx.dev/).
2. Project IDX abrirá automáticamente un servidor web.

---

## 📝 Cómo personalizar la plantilla del contrato

La plantilla del contrato está en el archivo **`contrato-template.js`**. Ahí encontrarás:

1. **`CONTRATO_TEMPLATE`**: Una variable con todo el texto legal. Puedes editarla libremente:
   - Agregar o quitar cláusulas
   - Cambiar la redacción
   - Agregar nuevos campos con `{{MI_CAMPO}}`

2. **`getPromptForGemini(data)`**: La función que construye las instrucciones para la IA. Si agregas campos nuevos al formulario, agrégalos también aquí.

### ¿Por qué una variable de JS y no un archivo .docx?

Usar una variable de JavaScript es lo **más simple y confiable** porque:
- No necesitas servidor para leer archivos
- No necesitas librerías adicionales para parsear .docx
- Puedes editarla directamente en cualquier editor de texto
- Funciona en cualquier navegador sin configuración

Si en el futuro quieres cargar la plantilla desde un archivo externo, puedes crear un `plantilla.txt` y usar `fetch('plantilla.txt')` para leerlo.

---

## 📊 Cómo preparar un archivo para el Modo Masivo

El Modo Masivo acepta archivos **.csv** o **.xlsx** (Excel). Cada fila es un contrato.

### Columnas requeridas (los nombres deben ser exactos):

| Columna | Ejemplo | ¿Obligatoria? |
|---------|---------|:---:|
| `arrendador_nombre` | Inmobiliaria Los Robles SpA | ✅ |
| `arrendador_rut` | 76.543.210-K | ✅ |
| `arrendatario_nombre` | María González Soto | ✅ |
| `arrendatario_rut` | 15.678.901-2 | ✅ |
| `oficinas` | 803 y 802 | ✅ |
| `piso` | 8 | ✅ |
| `direccion` | Av. Providencia 1234 | ✅ |
| `comuna` | Providencia | ✅ |
| `ciudad` | Santiago | ✅ |
| `monto` | 450.000 | ✅ |
| `duracion_meses` | 12 | ✅ |
| `fecha_inicio` | 01/03/2026 | ✅ |
| `arrendador_representante` | Juan Pérez López | ❌ |
| `arrendador_representante_rut` | 12.345.678-9 | ❌ |
| `arrendatario_representante` | — | ❌ |
| `monto_palabras` | cuatrocientos cincuenta mil pesos | ❌ |
| `dia_pago` | 5 | ❌ |
| `garantia_meses` | 1 | ❌ |
| `notas_adicionales` | No podrá subarrendar... | ❌ |

### Ejemplo de archivo CSV:

```csv
arrendador_nombre,arrendador_rut,arrendatario_nombre,arrendatario_rut,oficinas,piso,direccion,comuna,ciudad,monto,duracion_meses,fecha_inicio
Inmobiliaria Los Robles SpA,76.543.210-K,María González,15.678.901-2,803,8,Av. Providencia 1234,Providencia,Santiago,450.000,12,01/03/2026
Inmobiliaria Los Robles SpA,76.543.210-K,Pedro Muñoz,18.234.567-3,802 y 803,8,Av. Providencia 1234,Providencia,Santiago,700.000,24,01/03/2026
```

---

## 🚀 Cómo desplegar en Vercel (gratis)

> **¿Qué es Vercel?** Es una plataforma que "hospeda" tu página web gratis en internet, para que cualquiera pueda acceder con un enlace.

### Prerrequisito: Tener una cuenta de GitHub

Si no tienes GitHub:
1. Ve a 👉 **https://github.com/signup**
2. Crea tu cuenta gratuita (usa el correo que quieras).

### Paso 1: Sube tu código a GitHub

1. Inicia sesión en **https://github.com**
2. Haz clic en el botón verde **"New"** (o el ícono "+" arriba a la derecha → "New repository")
3. Ponle un nombre, por ejemplo: `contrato-arriendo-generator`
4. Déjalo en **Public** (o Private, como prefieras)
5. Haz clic en **"Create repository"**
6. En la página que aparece, haz clic en **"uploading an existing file"**
7. **Arrastra TODOS los archivos** de tu carpeta del proyecto (`index.html`, `style.css`, `script.js`, `contrato-template.js`, `package.json`)
8. Haz clic en **"Commit changes"**

### Paso 2: Conecta Vercel con GitHub

1. Abre tu navegador y ve a 👉 **https://vercel.com**
2. Haz clic en **"Sign Up"** (Registrarte)
3. Selecciona **"Continue with GitHub"**
4. Autoriza a Vercel para acceder a tu cuenta de GitHub (es seguro, solo lee tus repositorios)
5. Ya estás dentro del dashboard de Vercel. 🎉

### Paso 3: Despliega tu proyecto

1. En el dashboard de Vercel, haz clic en **"Add New..." → "Project"**
2. Verás la lista de tus repositorios de GitHub. Busca `contrato-arriendo-generator` y haz clic en **"Import"**
3. En la pantalla de configuración:
   - **Framework Preset**: selecciona **"Other"**
   - **Root Directory**: déjalo como está (`.`)
   - **Build Command**: déjalo **vacío** (bórralo si tiene algo)
   - **Output Directory**: escribe **`.`** (un punto)
4. Haz clic en **"Deploy"**
5. Espera unos segundos... ¡Y listo! ✅

Vercel te dará una URL como:
```
https://contrato-arriendo-generator.vercel.app
```

¡Esa es tu página web en vivo! Compártela con quien quieras. 🎉

### Actualizar el sitio en el futuro

Cada vez que subas cambios a GitHub (haciendo commit), Vercel automáticamente actualizará tu sitio web. No necesitas hacer nada más.

---

## 📦 Librerías externas utilizadas

Todas se cargan automáticamente desde CDN (no necesitas instalar nada):

| Librería | ¿Para qué? | CDN |
|----------|-----------|-----|
| **Tailwind CSS 3** | Framework de estilos CSS | `cdn.tailwindcss.com` |
| **SheetJS (xlsx)** | Leer archivos .csv y .xlsx en el navegador | `cdn.sheetjs.com` |
| **JSZip** | Crear archivos .zip en el navegador | `cdnjs.cloudflare.com` |
| **docx** | Crear archivos .docx (Word) en el navegador | `unpkg.com/docx` |
| **FileSaver.js** | Forzar descarga de archivos generados | `cdnjs.cloudflare.com` |

---

## ❓ Preguntas frecuentes

### ¿La API Key es segura en el frontend?
La API Key se almacena solo en el `localStorage` de TU navegador. Nunca se envía a ningún servidor excepto el de Google (para hacer las consultas a la IA). Si despliegas la app, cada usuario deberá ingresar su propia API Key.

### ¿Puedo usar esto sin internet?
No. La aplicación necesita conexión a internet para consultar la API de Google Gemini. Sin embargo, los archivos .docx se generan localmente en tu navegador.

### ¿Puedo generar contratos de otro tipo (no arriendo)?
Actualmente solo el contrato de arriendo está implementado. Los demás tipos (Promesa de Compraventa, etc.) aparecen como "Próximamente" en el menú.

### ¿Cuántos contratos puedo generar en lote?
Con la capa gratuita de Gemini, puedes generar hasta ~15 contratos por minuto y ~1,500 por día. La app incluye un delay de 1.5 segundos entre cada llamada a la API para evitar exceder los límites.

### ¿Puedo editar el contrato después de generado?
Sí. El archivo .docx que descarga la app es un documento Word estándar. Puedes abrirlo en Microsoft Word, Google Docs o LibreOffice y editarlo libremente.
