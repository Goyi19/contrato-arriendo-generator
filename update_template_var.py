import zipfile
import re

docx_path = 'template.docx'
out_path = 'template_updated.docx'

with zipfile.ZipFile(docx_path, 'r') as z_in:
    with zipfile.ZipFile(out_path, 'w') as z_out:
        for item in z_in.infolist():
            content = z_in.read(item.filename)
            if item.filename == 'word/document.xml':
                xml_content = content.decode('utf-8')
                # Search for the guarantee section pattern
                # It might have XML tags inside {monto_renta_uf}
                # But usually it's clean if edited manually.
                # I'll use a regex that handles XML tags inside the placeholder if any.
                
                # Pattern to find: suma de {monto_renta_uf}Unidades de Fomento
                # We want to change it to: suma de {monto_garantia_uf} Unidades de Fomento (adding a space too if missing)
                
                pattern = re.compile(r'suma de\s*(<[^>]+>)*\s*\{monto_renta_uf\}(<[^>]+>)*\s*Unidades de Fomento', re.IGNORECASE)
                
                def sub_func(m):
                    return f"suma de {m.group(1) or ''}{'{monto_garantia_uf}'}{m.group(2) or ''} Unidades de Fomento"

                # More robust: just search for the first {monto_renta_uf} after "Garantía de Arrendamiento"
                parts = re.split(r'(Garant[íi]a de Arrendamiento)', xml_content, flags=re.IGNORECASE)
                if len(parts) > 2:
                    # parts[2] is everything after the header
                    parts[2] = re.sub(r'\{monto_renta_uf\}', '{monto_garantia_uf}', parts[2], count=1)
                    xml_content = "".join(parts)
                
                z_out.writestr(item, xml_content.encode('utf-8'))
            else:
                z_out.writestr(item, content)

import os
os.replace(out_path, docx_path)
print("Template updated with monto_garantia_uf")
