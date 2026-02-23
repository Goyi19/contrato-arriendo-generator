import zipfile
import xml.etree.ElementTree as ET

docx_path = 'template.docx'
z = zipfile.ZipFile(docx_path, 'r')
xml_content = z.read('word/document.xml')
root = ET.fromstring(xml_content)

namespaces = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
}

yellow_texts = []
# Find all runs
for r in root.findall('.//w:r', namespaces=namespaces):
    # Check if it has highlight yellow
    rPr = r.find('w:rPr', namespaces=namespaces)
    if rPr is not None:
        high = rPr.find('w:highlight', namespaces=namespaces)
        if high is not None and high.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val') == 'yellow':
            t = r.find('w:t', namespaces=namespaces)
            if t is not None and t.text:
                yellow_texts.append(t.text)

# Print unique yellow texts
for i, txt in enumerate(yellow_texts):
    print(f"{i}: {txt}")
