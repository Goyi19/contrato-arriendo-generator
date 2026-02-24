import zipfile
import xml.etree.ElementTree as ET

z = zipfile.ZipFile('template.docx')
root = ET.fromstring(z.read('word/document.xml'))
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
for p in root.findall('.//w:p', ns):
    text = ''.join(t.text for r in p.findall('.//w:r', ns) for t in r.findall('.//w:t', ns) if t.text)
    if 'monto_garantia_uf' in text:
        print(f"FOUND: {text}")
    elif 'monto_renta_uf' in text and 'garantia' in text.lower():
        print(f"FOUND RENTA IN GUARANTEE: {text}")
