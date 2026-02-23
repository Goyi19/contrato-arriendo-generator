import zipfile
import re
import os

docx_path = 'Contrato de arriendo oficinas Cienfuego (1).docx'
new_path = 'template.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    xml = z.read('word/document.xml').decode('utf-8')

def safe_replace(xml, find_text, replace_with):
    if not find_text: return xml
    pattern = ''
    for char in find_text:
        if char == ' ':
            pattern += r' +(<[^>]+>)*'
        else:
            pattern += re.escape(char) + r'(<[^>]+>)*'
    return re.sub(pattern, lambda m: replace_with + ''.join(re.findall(r'<[^>]+>', m.group(0))), xml, flags=re.IGNORECASE)

# 1. Signature and fixed strings
xml = safe_replace(xml, 'Felipe Alvear', '{firma_nombre}')
xml = safe_replace(xml, 'pp. JOYERIA 2BLEA', '{firma_empresa}')
xml = xml.replace('<w:highlight w:val="yellow"/>', '') # Remove all yellow highlights

# 2. Main Blocks (Plural/Singular sensitive)
# Block 1 (Clause 1)
xml = safe_replace(xml, 'la oficina número 803 y 802 ubicada en el octavo piso, ambas oficinas, conjuntamente el estacionamiento 195 del cuarto subterráneo', '{oficinas_texto}')
# Block 2 (Clause 2 start)
xml = safe_replace(xml, 'la oficina número 803, 802 del octavo piso y estacionamiento 195 del cuarto subterráneo', '{oficinas_texto_2}')
# Block 3 (Clause 2 surface part) - "La oficina Nº803 y 802 tienen una superficie aproximada de 32,00 y 20,81 metros cuadrados"
xml = safe_replace(xml, 'La oficina Nº803 y 802 tienen una superficie aproximada de 32,00 y 20,81 metros cuadrados', '{oficinas_texto_3}')
# Block 4 (Clause 2 D-part) - "D803 y D802"
xml = safe_replace(xml, 'D803 y D802', '{oficinas_texto_4}')

# 3. Individual fields
replacements = [
    ('Chalinga 9121, comuna de La Granja, Santiago', '{arrendatario_domicilio}'),
    ('Chalinga 9121, La Granja', '{arrendatario_domicilio}'),
    ('01 Septiembre de 2025', '{fecha_contrato}'),
    ('78.033.678-1', '{arrendatario_rut}'),
    ('19.846.903-3', '{representante_rut}'),
    ('JOYERIA 2BLEA SpA', '{arrendatario_nombre}'),
    ('JOYERIA 2BLEA', '{arrendatario_nombre}'),
    ('28 Unidades de Fomento', '{monto_renta_uf} Unidades de Fomento'),
    ('un plazo de 12 meses', 'un plazo de {plazo_meses} meses'),
    ('lo menos 60 días', 'lo menos {dias_aviso} días'),
    ('5% de la renta pactada', '{porcentaje_multa_atraso}% de la renta pactada'),
    ('+56946493714', '{arrendatario_telefono}'),
    ('falvear@gmail.com', '{arrendatario_email}')
]

for old, new in replacements:
    xml = safe_replace(xml, old, new)

# 4. Fallbacks for remaining fragments
xml = safe_replace(xml, '32,00 y 20,81', '{superficie_texto}')
xml = safe_replace(xml, '803', '{oficinas_simples}')
xml = safe_replace(xml, '802', '{oficinas_simples_2}')
xml = safe_replace(xml, '195', '{estacionamientos_simples}')
xml = xml.replace('{firma_nombre}', '{representante_nombre}') # Reuse representative name for firma

with zipfile.ZipFile(docx_path, 'r') as z_in:
    with zipfile.ZipFile(new_path, 'w') as z_out:
        for item in z_in.infolist():
            if item.filename == 'word/document.xml':
                z_out.writestr(item, xml.encode('utf-8'))
            else:
                z_out.writestr(item, z_in.read(item.filename))

print("Template exhaustive v3 generated.")
