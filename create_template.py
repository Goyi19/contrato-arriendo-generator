import zipfile
import re
import os

docx_path = 'Contrato de arriendo oficinas Cienfuego (1).docx'
new_path = 'template.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    xml_content = z.read('word/document.xml').decode('utf-8')

# We want to replace actual text in the XML while preserving surrounding tags, or at least replace specific strings across tags.
# Since the strings might be split like `01 </w:t><w:t>Septiembre`, a trick is to remove tags temporarily for matching, 
# or use regex that allows `<[^>]+>` between characters.

def replace_with_tag(text_to_find, tag_name, xml):
    # Create a regex that places `(<[^>]+>)*` between each character of the text_to_find.
    # This allows it to match across XML node boundaries.
    regex_pattern = ''
    for char in text_to_find:
        if char == ' ':
            regex_pattern += r' +(<[^>]+>)*' # spaces might not be broken, but tags can precede/follow
        else:
            regex_pattern += re.escape(char) + r'(<[^>]+>)*'
            
    # Function to replace the matched block
    def sub_func(match):
        # The match spans from the first character of text_to_find to the last.
        # However, we must preserve the intermediate XML tags so we don't break the document structure!
        # Every <w:r> or <w:t> tag inside the match must be kept, but the text characters themselves dropped.
        matched_str = match.group(0)
        # Extract all XML tags inside the matched string
        tags = re.findall(r'<[^>]+>', matched_str)
        # We place our `{tag_name}` inside a single w:t if possible, or just append the tags.
        # A simpler way: just return all tags concatenated, plus `{tag_name}`.
        # But wait, docxtemplater tags should ideally be in a plain text flow.
        # If we just put `{tag_name}` followed by the preserved tags, it might cause weird formatting if tags contained font changes.
        return '{' + tag_name + '}' + ''.join(tags)
        
    return re.sub(regex_pattern, sub_func, xml, flags=re.IGNORECASE)

xml = xml_content

xml = replace_with_tag('01 Septiembre de 2025', 'fecha_contrato', xml)
xml = replace_with_tag('JOYERIA 2BLEA SpA', 'arrendatario_nombre', xml)
xml = replace_with_tag('JOYERIA 2BLEA', 'arrendatario_nombre', xml)
xml = replace_with_tag('78.033.678-1', 'arrendatario_rut', xml)
xml = replace_with_tag('Felipe Alvear', 'representante_nombre', xml)
xml = replace_with_tag('19.846.903-3', 'representante_rut', xml)
xml = replace_with_tag('Chalinga 9121, comuna de La Granja', 'arrendatario_domicilio', xml)

xml = replace_with_tag('la oficina número 803 y 802 ubicada en el octavo piso, ambas oficinas, conjuntamente el estacionamiento 195 del cuarto subterráneo', 'oficinas_texto', xml)
xml = replace_with_tag('la oficina número 803, 802 del octavo piso y estacionamiento 195 del cuarto subterráneo', 'oficinas_texto_2', xml)
xml = replace_with_tag('32,00 y 20,81 metros cuadrados respectivamente', 'superficie_texto', xml)
xml = replace_with_tag('un plazo de 12 meses', 'un plazo de {plazo_meses} meses', xml)
xml = replace_with_tag('lo menos 60 días', 'lo menos {dias_aviso} días', xml)
xml = replace_with_tag('28 Unidades de Fomento', '{monto_renta_uf} Unidades de Fomento', xml)
xml = replace_with_tag('el 5% de la renta pactada', 'el {porcentaje_multa_atraso}% de la renta pactada', xml)

# Re-zip
with zipfile.ZipFile(docx_path, 'r') as z_in:
    with zipfile.ZipFile(new_path, 'w') as z_out:
        for item in z_in.infolist():
            if item.filename == 'word/document.xml':
                z_out.writestr(item, xml.encode('utf-8'))
            else:
                z_out.writestr(item, z_in.read(item.filename))
               
print("Template created successfully!")
