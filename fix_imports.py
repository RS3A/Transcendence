import re
import os

src_dir = 'frontend/src'

for root, dirs, files in os.walk(src_dir):
    for ts_file in files:
        if ts_file.endswith(('.tsx', '.ts', '.jsx', '.js')):
            ts_path = os.path.join(root, ts_file)
            
            with open(ts_path, 'r') as f:
                content = f.read()
            
            # Find generic imports like `import './File.css'` or `import "./File.css"` (with or without semicolons)
            # excluding globals.css
            
            def replace_import(match):
                css_filename = match.group(1)
                if css_filename == 'globals.css' or css_filename.endswith('.module.css'):
                    return match.group(0) # don't touch
                
                new_module_name = css_filename.replace('.css', '.module.css')
                return f"import styles from './{new_module_name}'" + match.group(2)
            
            # regex to match: import './File.css'[;]
            original_content = content
            content = re.sub(r'import\s+[\'"]\.\/([^/]+\.css)[\'"](;|)', replace_import, content)
            
            if content != original_content:
                with open(ts_path, 'w') as f:
                    f.write(content)
                print(f"Updated imports in {ts_path}")

print("Fix completed.")
