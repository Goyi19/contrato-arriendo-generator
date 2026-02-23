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

# Lista de reemplazos simplificada
xml = replace_with_tag('01 Septiembre de 2025', 'fecha_contrato', xml)
xml = replace_with_tag('78.033.678-1', 'arrendatario_rut', xml)
xml = replace_with_tag('Chalinga 9121, comuna de La Granja', 'arrendatario_domicilio', xml)
xml = replace_with_tag('Felipe Alvear', 'representante_nombre', xml)
xml = replace_with_tag('19.846.903-3', 'representante_rut', xml)

# Para las oficinas, buscaremos el texto exacto que vimos en el XML
# Nota: En el XML original, 'número' suele estar como 'nmero' si hay problemas de encoding, 
# pero aqu usamos regex flexible.
xml = replace_with_tag('803 y 802 ubicada en el octavo piso, ambas oficinas, conjuntamente el estacionamiento 195 del cuarto subterráneo', 'oficinas_texto_val', xml)
xml = xml.replace('{oficinas_texto_val}', '{oficinas_texto}')

xml = replace_with_tag('803, 802 del octavo piso y estacionamiento 195 del cuarto subterráneo', 'oficinas_texto_2_val', xml)
xml = xml.replace('{oficinas_texto_2_val}', '{oficinas_texto_2}')

xml = replace_with_tag('32,00 y 20,81 metros cuadrados', 'superficie_texto', xml)
xml = replace_with_tag('plazo de 12 meses', 'plazo de {plazo_meses} meses', xml)
xml = replace_with_tag('menos 60 días', 'menos {dias_aviso} días', xml)
xml = replace_with_tag('28 Unidades de Fomento', '{monto_renta_uf} Unidades de Fomento', xml)
xml = replace_with_tag('5% de la renta pactada', 'multa_val', xml)
xml = xml.replace('{multa_val}', '{porcentaje_multa_atraso}% de la renta pactada')

xml = replace_with_tag('JOYERIA 2BLEA SpA', 'arrendatario_nombre', xml)
xml = replace_with_tag('JOYERIA 2BLEA', 'arrendatario_nombre', xml)

with zipfile.ZipFile(docx_path, 'r') as z_in:
    with zipfile.ZipFile(new_path, 'w') as z_out:
        for item in z_in.infolist():
            if item.filename == 'word/document.xml':
                z_out.writestr(item, xml.encode('utf-8'))
            else:
                z_out.writestr(item, z_in.read(item.filename))

print("Plantilla actualizada.")
