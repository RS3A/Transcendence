import os
import re

def to_camel_case(snake_str):
    components = re.split(r'[-_]', snake_str)
    return components[0] + ''.join(x.title() for x in components[1:])

def process_css_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    class_names = set(re.findall(r'\.([a-zA-Z0-9_-]+)', content))
    # exclude common pseudo classes and global element selectors if any matched wrongly
    class_names = {c for c in class_names if not c in ('hover', 'active', 'focus', 'visited', 'before', 'after')}

    mapping = {}
    for c in class_names:
        camel = to_camel_case(c)
        mapping[c] = camel
        # Replace in CSS
        # This regex ensures we only replace the class name and not substrings
        content = re.sub(rf'\.{c}(?=[^a-zA-Z0-9_-])', f'.{camel}', content)

    new_filepath = filepath.replace('.css', '.module.css')
    with open(new_filepath, 'w') as f:
        f.write(content)
    
    os.remove(filepath)
    return mapping, new_filepath

def process_tsx_file(filepath, css_filename, mapping):
    with open(filepath, 'r') as f:
        content = f.read()

    # Update import
    old_import = f"import './{css_filename}';"
    new_module_name = css_filename.replace('.css', '.module.css')
    new_import = f"import styles from './{new_module_name}';"
    
    content = content.replace(old_import, new_import)

    # Simple replacement for className="something"
    def replace_literal_class(match):
        classes = match.group(1).split()
        new_classes = []
        for c in classes:
            if c in mapping:
                new_classes.append(f"styles.{mapping[c]}")
            else:
                # If class not in mapping (maybe global or not renamed), keep as string? 
                # For simplicity, we assume all classes are in styles or we just format them as styles.class
                camel_c = to_camel_case(c)
                new_classes.append(f"styles.{camel_c}")
        
        if len(new_classes) == 1:
            return f"className={{{new_classes[0]}}}"
        else:
            return f"className={{`${{{'} ${'.join(new_classes)}}}`}}"

    content = re.sub(r'className="([^"]+)"', replace_literal_class, content)

    # We won't perfectly handle conditional classNames in this simple script 
    # (e.g. className={`... ${active ? 'active' : ''}`}), but the user can manually fix edge cases.

    with open(filepath, 'w') as f:
        f.write(content)

src_dir = 'frontend/src'

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.css') and file != 'globals.css' and not file.endswith('.module.css'):
            css_path = os.path.join(root, file)
            mapping, new_css_path = process_css_file(css_path)
            
            # Find corresponding TSX/TS files in the same directory (or check all files)
            for ts_file in files:
                if ts_file.endswith(('.tsx', '.ts', '.jsx', '.js')):
                    ts_path = os.path.join(root, ts_file)
                    process_tsx_file(ts_path, file, mapping)

print("Migration script completed (Basic Pass).")
