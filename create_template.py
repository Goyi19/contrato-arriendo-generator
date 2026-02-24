import zipfile
import re
import os

# Archivo de origen (Tu contrato oficial con ejemplos)
docx_path = 'Oficial_Contrato de arriendo oficinas Cienfuego.docx'
# Archivo de destino (La plantilla limpia para el sistema)
new_path = 'template.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    xml = z.read('word/document.xml').decode('utf-8')

# 1. Función Quirúrgica para reemplazar <VAR>{EJEMPLO} por {TAG}
# Esta regex busca específicamente el patrón que usaste para darme contexto
def clean_context_placeholders(xml):
    # Patrón: < NOMBRE > { ejemplo }
    # Incluimos posibles etiquetas XML intermedias que Word inserta
    def sub_placeholder(match):
        var_name = re.sub(r'<[^>]+>', '', match.group('var')).strip().upper()
        
        mapping = {
            'NOMBRE/RAZÓN SOCIAL': '{arrendatario_nombre}',
            'NOMBRE/RAZON SOCIAL': '{arrendatario_nombre}',
            'FECHA CONTRATO': '{fecha_contrato}',
            'RUT': '{arrendatario_rut}',
            'NOMBRE REPRESENTANTE LEGAL': '{representante_nombre}',
            'RUT REPRESENTANTE': '{representante_rut}',
            'DOMICILIO ARRENDATARIO': '{arrendatario_domicilio}',
            'OFICINA1': '{oficina_unica}',
            'OFICINA2': '{oficina_2_temp}',
            'PISO OFICINAS': '{piso}',
            'ESTACIONAMIENTO1': '{estac_unico}',
            'UBICACION ESTACIONAMIENTO': '{ubi_estac}',
            'M2 OFICINA1': '{sup_lista}',
            'M2 OFICINA2': '{sup_2_temp}',
            'PLAZO': '{plazo_meses}',
            'DIAS DE AVISO TERMINO': '{dias_aviso}',
            'RENTA UF MENSUAL': '{monto_renta_uf}',
            'MULTA POR ATRASO': '{porcentaje_multa_atraso}',
            'TELEFONO ARRENDATARIO': '{arrendatario_telefono}',
            'CORREO ARRENDATARIO': '{arrendatario_email}'
        }
        
        for key, tag in mapping.items():
            if key in var_name:
                return tag
        return match.group(0) # Si no coincide, dejarlo igual

    # Reemplazo de <VAR>{VAL}
    xml = re.sub(r'&lt;(?P<var>[^&>]+)&gt;(<[^>]+>)*\{[^\}]*\}', sub_placeholder, xml, flags=re.IGNORECASE | re.DOTALL)
    # Reemplazo de variables sueltas si quedaron
    xml = xml.replace('JOYERIA 2BLEA SpA', '{arrendatario_nombre}')
    xml = xml.replace('JOYERIA 2BLEA', '{arrendatario_nombre}')
    return xml

xml = clean_context_placeholders(xml)

# 2. Inserción de Lógica Gramatical (Singular/Plural)
# PRIMERO: Propiedad
# Buscamos la frase construida y le aplicamos los bloques lógicos
xml = xml.replace('dueña de la oficina número {oficina_unica} y {oficina_2_temp} ubicada en el {piso}, ambas oficinas, ', 
    'dueña de {#multiple_ofis}las oficinas número {oficinas_lista} ubicadas en el {piso}, {parentesis_plural}{/multiple_ofis}{^multiple_ofis}la oficina número {oficina_unica} ubicada en el {piso}{/multiple_ofis}, ')

xml = xml.replace('conjuntamente el estacionamiento {estac_unico} del {ubi_estac}',
    '{#tiene_estac}conjuntamente {#multiple_estac}los estacionamientos {estacs_lista}{/multiple_estac}{^multiple_estac}el estacionamiento {estac_unico}{/multiple_estac} del {ubi_estac}{/tiene_estac}')

# SEGUNDO: Arrendamiento
xml = xml.replace('la oficina N° {oficina_unica}, N°{oficina_2_temp} del {piso} y estacionamiento {estac_unico} del {ubi_estac}',
    '{#multiple_ofis}las oficinas número {oficinas_lista} del {piso}{/multiple_ofis}{^multiple_ofis}la oficina número {oficina_unica} del {piso}{/multiple_ofis} {#tiene_estac} y {#multiple_estac}los estacionamientos {estacs_lista}{/multiple_estac}{^multiple_estac}el estacionamiento {estac_unico}{/multiple_estac} del {ubi_estac}{/tiene_estac}')

# SEGUNDO: Superficies
xml = xml.replace('La oficina {oficina_unica} y N°{oficina_2_temp} tienen una superficie aproximada de {sup_lista} y {sup_2_temp} metros cuadrados',
    '{#multiple_ofis}Las oficinas N°{oficinas_lista} tienen una superficie aproximada de {sup_lista} metros cuadrados{/multiple_ofis}{^multiple_ofis}La oficina N°{oficina_unica} tiene una superficie aproximada de {sup_unica} metros cuadrados{/multiple_ofis}')

# 3. Garantía (DÉCIMO OCTAVO)
xml = xml.replace('la suma de {monto_renta_uf}Unidades de Fomento, sin IVA', 
                 'la suma de {monto_garantia_uf} Unidades de Fomento, sin IVA')

# 4. Limpieza de temporales y firmas
xml = xml.replace('{oficina_2_temp}', '').replace('{sup_2_temp}', '')
xml = xml.replace('pp. {arrendatario_nombre}', '{firma_empresa}')

# 5. Guardar nuevo template.docx
with zipfile.ZipFile(docx_path, 'r') as z_in:
    with zipfile.ZipFile(new_path, 'w') as z_out:
        for item in z_in.infolist():
            if item.filename == 'word/document.xml':
                z_out.writestr(item, xml.encode('utf-8'))
            else:
                z_out.writestr(item, z_in.read(item.filename))

print("Template generado exitosamente desde el contrato oficial.")
