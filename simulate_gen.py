import zipfile
import re
import os

# 1. Load the template we just created
with zipfile.ZipFile('template.docx', 'r') as z:
    xml = z.read('word/document.xml').decode('utf-8')

# 2. Simulate what docxtemplater does (shallowly)
# Note: docxtemplater is much more complex, but this will tell us if tags exist.

data = {
    "fecha_contrato": "01 de Octubre de 2026",
    "arrendatario_nombre": "CONSULTORA PRUEBA",
    "arrendatario_rut": "11.111.111-1",
    "oficinas_texto": "la oficina número 43 ubicada en el primer piso, conjuntamente sin estacionamientos",
    "oficinas_texto_2": "la oficina número 43 del primer piso sin estacionamientos",
    "superficie_texto": "25,00 metros cuadrados",
    "plazo_meses": "24",
    "dias_aviso": "30",
    "monto_renta_uf": "15",
    "porcentaje_multa_atraso": "10",
    "oficinas_simples": "43",
    "oficinas_simples_2": "",
    "estacionamientos_simples": "",
    "firma_nombre": "JUAN PEREZ",
    "firma_rut": "22.222.222-2",
    "firma_empresa": "pp. CONSULTORA PRUEBA"
}

# Basic replacement simulation
for key, val in data.items():
    xml = xml.replace('{' + key + '}', val)

# 3. Check if any "803", "802", "Felipe" or "JOYERIA" remain
residue = []
for test in ["803", "802", "Felipe", "JOYERIA"]:
    if test in xml:
        # Find context
        idx = xml.find(test)
        context = xml[idx-50:idx+50]
        residue.append(f"Found '{test}' at context: {context}")

if residue:
    print("RESIDUE FOUND:")
    for r in residue:
        print(r)
else:
    print("NO RESIDUE FOUND. Template seems clean for these variables.")
