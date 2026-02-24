import zipfile
import xml.etree.ElementTree as ET

def dump_docx_text(filename, limit=None):
    z = zipfile.ZipFile(filename)
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    output = []
    paragraphs = root.findall('.//w:p', ns)
    if limit:
        paragraphs = paragraphs[:limit]
        
    for p in paragraphs:
        p_text = ""
        for r in p.findall('.//w:r', ns):
            for t in r.findall('.//w:t', ns):
                if t.text:
                    p_text += t.text
        output.append(p_text)
    return "\n".join(output)

print("--- BEGINNING ---")
print(dump_docx_text('template.docx', 30))
print("\n--- END ---")
# Print last 30 paragraphs for contact section
z = zipfile.ZipFile('template.docx')
root = ET.fromstring(z.read('word/document.xml'))
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
paragraphs = root.findall('.//w:p', ns)
output = []
for p in paragraphs[-60:]:
    p_text = ""
    for r in p.findall('.//w:r', ns):
        for t in r.findall('.//w:t', ns):
            if t.text:
                p_text += t.text
    output.append(p_text)
print("\n".join(output))
