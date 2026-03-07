/**
 * build.js  - Assembles HTML partials + copies CSS/JS/assets into docs-diagnostic/
 * Run with: node src/diagnostic/build.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PARTIALS = path.join(__dirname, 'partials');
const CSS_SRC = path.join(__dirname, 'css');
const JS_SRC = path.join(__dirname, 'js');
const ASSETS_SRC = path.join(__dirname, 'assets');
const DOCS = path.join(ROOT, 'docs-diagnostic');
const CSS_DEST = path.join(DOCS, 'css');
const JS_DEST = path.join(DOCS, 'js');

const partialOrder = [
    'head.html',
    'body-open.html',
    'navigation.html',
    'hero.html',
    'how-it-works.html',
    'quiz.html',
    'results.html',
    'faq.html',
    'footer.html',
];

// 1. Create output directories
fs.mkdirSync(CSS_DEST, { recursive: true });
fs.mkdirSync(JS_DEST, { recursive: true });

// 2. Concatenate HTML partials → docs-diagnostic/index.html
let html = '';
partialOrder.forEach(name => {
    const filePath = path.join(PARTIALS, name);
    const content = fs.readFileSync(filePath, 'utf8');
    html += content;
});

fs.writeFileSync(path.join(DOCS, 'index.html'), html, 'utf8');
console.log(`  Built: docs-diagnostic/index.html (${html.length.toLocaleString()} chars)`);

// 3. Copy CSS files → docs-diagnostic/css/
const cssFiles = fs.readdirSync(CSS_SRC).filter(f => f.endsWith('.css'));
cssFiles.forEach(name => {
    fs.copyFileSync(path.join(CSS_SRC, name), path.join(CSS_DEST, name));
    console.log(`  Copied: docs-diagnostic/css/${name}`);
});

// 4. Copy JS files → docs-diagnostic/js/
if (fs.existsSync(JS_SRC)) {
    const jsFiles = fs.readdirSync(JS_SRC).filter(f => f.endsWith('.js'));
    jsFiles.forEach(name => {
        fs.copyFileSync(path.join(JS_SRC, name), path.join(JS_DEST, name));
        console.log(`  Copied: docs-diagnostic/js/${name}`);
    });
}

// 5. Copy asset files (favicon, images) → docs-diagnostic/
if (fs.existsSync(ASSETS_SRC)) {
    const assetFiles = fs.readdirSync(ASSETS_SRC);
    assetFiles.forEach(name => {
        fs.copyFileSync(path.join(ASSETS_SRC, name), path.join(DOCS, name));
        console.log(`  Copied: docs-diagnostic/${name}`);
    });
}

console.log('\nBuild complete.');
