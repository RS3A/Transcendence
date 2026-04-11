const fs = require('fs');
const path = require('path');

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

walk(path.join(__dirname, 'src'), filepath => {
    if (filepath.endsWith('.tsx') || filepath.endsWith('.jsx')) {
        let content = fs.readFileSync(filepath, 'utf8');
        let edited = false;

        content = content.replace(/import\s+['"](\.[^'"]+?)\.css['"]\s*;?/g, (match, p1) => {
            if (p1.endsWith('globals') || p1.endsWith('index')) {
                return match; 
            }
            edited = true;
            return `import styles from '${p1}.module.css';`;
        });

        if (edited) fs.writeFileSync(filepath, content);
    }
});
