import zipfile
import re
import os

docx_path = 'Contrato de arriendo oficinas Cienfuego (1).docx'
new_path = 'template.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    xml = z.read('word/document.xml').decode('utf-8')

def safe_replace(xml, find_text, replace_with):
    if find_text in xml:
        return xml.replace(find_text, replace_with)
    
    # Flexible replacement for tags
    pattern = ''
    for char in find_text:
        if char == ' ':
            pattern += r' +(<[^>]+>)*'
        else:
            pattern += re.escape(char) + r'(<[^>]+>)*'
    
    return re.sub(pattern, lambda m: replace_with + ''.join(re.findall(r'<[^>]+>', m.group(0))), xml, flags=re.IGNORECASE)

# 1. Signature block (Handle this first to avoid partial matches)
xml = safe_replace(xml, 'Felipe Alvear', '{firma_nombre}')
xml = safe_replace(xml, 'pp. JOYERIA 2BLEA', '{firma_empresa}')

# 2. Representation text at the beginning
# We want to replace the whole "representada por don Felipe Alvear, cdula nacional de identidad nmero 19.846.903-3"
# but let's be careful.
xml = safe_replace(xml, 'representada por don {firma_nombre}, cédula nacional de identidad número 19.846.903-3', '{arrendatario_representante_texto}')

# 3. Rest of replacements
replacements = [
    ('01 Septiembre de 2025', '{fecha_contrato}'),
    ('78.033.678-1', '{arrendatario_rut}'),
    ('Chalinga 9121, comuna de La Granja', '{arrendatario_domicilio}'),
    ('32,00 y 20,81 metros cuadrados', '{superficie_texto}'),
    ('un plazo de 12 meses', 'un plazo de {plazo_meses} meses'),
    ('lo menos 60 días', 'lo menos {dias_aviso} días'),
    ('28 Unidades de Fomento', '{monto_renta_uf} Unidades de Fomento'),
    ('5% de la renta pactada', '{porcentaje_multa_atraso}% de la renta pactada'),
    ('JOYERIA 2BLEA SpA', '{arrendatario_nombre}'),
    ('JOYERIA 2BLEA', '{arrendatario_nombre}')
]

# Office strings
xml = safe_replace(xml, 'la oficina número 803 y 802 ubicada en el octavo piso, ambas oficinas, conjuntamente el estacionamiento 195 del cuarto subterráneo', '{oficinas_texto}')
xml = safe_replace(xml, 'la oficina número 803, 802 del octavo piso y estacionamiento 195 del cuarto subterráneo', '{oficinas_texto_2}')

for old, new in replacements:
    xml = safe_replace(xml, old, new)

with zipfile.ZipFile(docx_path, 'r') as z_in:
    with zipfile.ZipFile(new_path, 'w') as z_out:
        for item in z_in.infolist():
            if item.filename == 'word/document.xml':
                z_out.writestr(item, xml.encode('utf-8'))
            else:
                z_out.writestr(item, z_in.read(item.filename))

print("Template final regenerated.")
