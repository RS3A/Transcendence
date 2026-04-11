const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        let filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath, callback);
        } else {
            callback(filepath);
        }
    });
}

// 1. Rename .css to .module.css (excluding globals.css or index.css)
const globalCss = ['globals.css', 'index.css', 'App.css']; // Will wait on App.css, let's keep globals only
walk(path.join(__dirname, 'src'), filepath => {
    if (filepath.endsWith('.css') && !filepath.endsWith('.module.css') && !filepath.includes('globals.css') && !filepath.includes('index.css')) {
        const newPath = filepath.replace('.css', '.module.css');
        fs.renameSync(filepath, newPath);
    }
});

// 2. Refactor .tsx / .tsx files
walk(path.join(__dirname, 'src'), filepath => {
    if (filepath.endsWith('.tsx') || filepath.endsWith('.jsx')) {
        let content = fs.readFileSync(filepath, 'utf8');
        let edited = false;

        // Change imports
        // import './SomeStyle.css' => import styles from './SomeStyle.module.css'
        content = content.replace(/import\s+['"]([^'"]+?)\.css['"]\s*;/g, (match, p1) => {
            if (p1.endsWith('globals') || p1.endsWith('index')) {
                return match; 
            }
            edited = true;
            return `import styles from '${p1}.module.css';`;
        });
        
        // Change simple strings: className="btn" => className={styles.btn}
        // or className="btn primary" => className={`${styles.btn} ${styles.primary}`}
        content = content.replace(/className=(['"])(.*?)\1/g, (match, quote, classesStr) => {
            if (!classesStr.trim()) return match;
            const classes = classesStr.trim().split(/\s+/);
            edited = true;
            if (classes.length === 1) {
                // simple case
                 if (classes[0].includes('-')) return `className={styles["${classes[0]}"]}`;
                 return `className={styles.${classes[0]}}`;
            } else {
                // multiple classes
                const mapped = classes.map(c => {
                    if (c.includes('-')) return `\${styles["${c}"]}`;
                    return `\${styles.${c}}`;
                }).join(' ');
                return `className={\`${mapped}\`}`;
            }
        });

        if (edited) fs.writeFileSync(filepath, content);
    }
});
