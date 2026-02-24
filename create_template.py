import zipfile
import re
import os

docx_path = 'Contrato de arriendo oficinas Cienfuego (1).docx'
new_path = 'template.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    xml = z.read('word/document.xml').decode('utf-8')

# Remove yellow highlights
xml = xml.replace('<w:highlight w:val="yellow"/>', '')

def deep_clean_replace(xml, phrase, replacement):
    # This regex is extremely aggressive: it allows optional tags between EVERY character
    # and handles spaces as one or more spaces or tags.
    pattern = ""
    # Simplify phrase for matching (remove multiple spaces)
    phrase = ' '.join(phrase.split())
    for i, char in enumerate(phrase):
        if char == ' ':
            pattern += r'(\s|(<[^>]+>))+'
        elif char.lower() in 'aeiouáéíóúüñ':
            pattern += r'[a-zA-Záéíóúüñ](<[^>]+>)*' # Match any vowel/accented
        elif char.lower() == 'n':
            # Handle N, N°, Nº
            pattern += r'n(<[^>]+>)*(\.?.?)?(<[^>]+>)*'
        else:
            pattern += re.escape(char) + r'(<[^>]+>)*'
    
    return re.sub(pattern, replacement, xml, flags=re.IGNORECASE | re.DOTALL)

# 1. Signatures
xml = deep_clean_replace(xml, 'Felipe Alvear', '{representante_nombre}')
xml = deep_clean_replace(xml, 'pp. JOYERIA 2BLEA', '{firma_empresa}')

# 2. Section blocks (Prioritize longer phrases)
# CLAUSE 1
xml = deep_clean_replace(xml, 'la oficina número 803 y 802 ubicada en el octavo piso, ambas oficinas', 
    '{#multiple_ofis}las oficinas número {oficinas_lista} ubicadas en el {piso}, {parentesis_plural}{/multiple_ofis}{^multiple_ofis}la oficina número {oficina_unica} ubicada en el {piso}{/multiple_ofis}')

# CLAUSE 2 START
xml = deep_clean_replace(xml, 'la oficina número 803, 802 del octavo piso', 
    '{#multiple_ofis}las oficinas número {oficinas_lista} del {piso}{/multiple_ofis}{^multiple_ofis}la oficina número {oficina_unica} del {piso}{/multiple_ofis}')

# PARKING (Using ubi_estac)
xml = deep_clean_replace(xml, 'y estacionamiento 195 del cuarto subterráneo', 
    '{#tiene_estac} y {#multiple_estac}los estacionamientos {estacs_lista}{/multiple_estac}{^multiple_estac}el estacionamiento {estac_unico}{/multiple_estac} del {ubi_estac}{/tiene_estac}{^tiene_estac} sin estacionamientos{/tiene_estac}')

# SURFACE
xml = deep_clean_replace(xml, 'La oficina N 803 y 802 tienen una superficie aproximada de 32,00 y 20,81 metros cuadrados', 
    '{#multiple_ofis}Las oficinas N°{oficinas_lista} tienen una superficie aproximada de {sup_lista} metros cuadrados{/multiple_ofis}{^multiple_ofis}La oficina N°{oficina_unica} tiene una superficie aproximada de {sup_unica} metros cuadrados{/multiple_ofis}')

# D-PREFIX
xml = deep_clean_replace(xml, 'D803 y D802', 
    '{#multiple_ofis}{oficinas_lista_d} {/multiple_ofis}{^multiple_ofis}D{oficina_unica} {/multiple_ofis}')

# 3. Individual fields
fields = [
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
for f_text, f_rep in fields:
    xml = deep_clean_replace(xml, f_text, f_rep)

# 4. Final Cleanup of any remaining 803 or 802 tags that might be missed by long phrases
# Be careful not to replace tags themselves.
xml = xml.replace('32,00 y 20,81', '{sup_lista}')
xml = xml.replace('cuarto subterráneo', '{ubi_estac}')

with zipfile.ZipFile(docx_path, 'r') as z_in:
    with zipfile.ZipFile(new_path, 'w') as z_out:
        for item in z_in.infolist():
            if item.filename == 'word/document.xml':
                z_out.writestr(item, xml.encode('utf-8'))
            else:
                z_out.writestr(item, z_in.read(item.filename))

print("Template definitive V6 generated with extreme deep clean.")
