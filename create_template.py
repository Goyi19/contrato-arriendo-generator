import zipfile
import re
import os

docx_path = 'Contrato de arriendo oficinas Cienfuego (1).docx'
new_path = 'template.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    xml = z.read('word/document.xml').decode('utf-8')

def replace_with_tag(text_to_find, tag_name, xml):
    regex_pattern = ''
    for char in text_to_find:
        if char == ' ':
            regex_pattern += r' +(<[^>]+>)*'
        else:
            regex_pattern += re.escape(char) + r'(<[^>]+>)*'
    
    def sub_func(match):
        tags = re.findall(r'<[^>]+>', match.group(0))
        return '{' + tag_name + '}' + ''.join(tags)
    
    return re.sub(regex_pattern, sub_func, xml, flags=re.IGNORECASE)

# 1. Reemplazos directos
xml = replace_with_tag('01 Septiembre de 2025', 'fecha_contrato', xml)
xml = replace_with_tag('78.033.678-1', 'arrendatario_rut', xml)
xml = replace_with_tag('Felipe Alvear', 'representante_nombre', xml)
xml = replace_with_tag('19.846.903-3', 'representante_rut', xml)
xml = replace_with_tag('Chalinga 9121, comuna de La Granja', 'arrendatario_domicilio', xml)

# 2. Oficinas (especficos por fragmentos para mayor seguridad)
xml = replace_with_tag('número 803 y 802 ubicada en el octavo piso, ambas oficinas, conjuntamente el estacionamiento 195 del cuarto subterráneo', 'oficinas_texto_val', xml)
xml = xml.replace('{oficinas_texto_val}', 'número {oficinas_texto}')

xml = replace_with_tag('número 803, 802 del octavo piso y estacionamiento 195 del cuarto subterráneo', 'oficinas_texto_2_val', xml)
xml = xml.replace('{oficinas_texto_2_val}', 'número {oficinas_texto_2}')

# 3. Superficie
xml = replace_with_tag('32,00 y 20,81 metros cuadrados', 'superficie_texto', xml)

# 4. Numricos
xml = replace_with_tag('un plazo de 12 meses', 'temp_p1', xml)
xml = xml.replace('{temp_p1}', 'un plazo de {plazo_meses} meses')

xml = replace_with_tag('a lo menos 60 días', 'temp_p2', xml)
xml = xml.replace('{temp_p2}', 'a lo menos {dias_aviso} días')

xml = replace_with_tag('28 Unidades de Fomento', 'temp_r', xml)
xml = xml.replace('{temp_r}', '{monto_renta_uf} Unidades de Fomento')

xml = replace_with_tag('5% de la renta pactada', 'temp_m', xml)
xml = xml.replace('{temp_m}', '{porcentaje_multa_atraso}% de la renta pactada')

# Empresa
xml = replace_with_tag('JOYERIA 2BLEA SpA', 'arrendatario_nombre', xml)
xml = replace_with_tag('JOYERIA 2BLEA', 'arrendatario_nombre', xml)

with zipfile.ZipFile(docx_path, 'r') as z_in:
    with zipfile.ZipFile(new_path, 'w') as z_out:
        for item in z_in.infolist():
            if item.filename == 'word/document.xml':
                z_out.writestr(item, xml.encode('utf-8'))
            else:
                z_out.writestr(item, z_in.read(item.filename))

print("Plantilla limpiada exitosamente.")
