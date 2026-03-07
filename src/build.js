/**
 * build.js  - Assembles HTML partials + copies CSS into docs/
 * Run with: npm run build  (or: node src/build.js)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PARTIALS = path.join(__dirname, 'partials');
const CSS_SRC = path.join(__dirname, 'css');
const DOCS = path.join(ROOT, 'docs');
const CSS_DEST = path.join(DOCS, 'css');

// Assembly order  - matches the original index.html structure
const partialOrder = [
    'head.html',
    'body-open.html',
    'navigation.html',
    'container-open.html',
    'header.html',
    'core-beliefs.html',
    'system-overview.html',
    'flow-chart-open.html',
    'node-1-demand.html',
    'connection-1-2.html',
    'node-2-capacity.html',
    'connection-2-3.html',
    'node-3-experience.html',
    'connection-3-4.html',
    'node-4-behavior.html',
    'connection-4-5.html',
    'node-5-economics.html',
    'connection-5-6.html',
    'node-6-profit.html',
    'flow-chart-close.html',
    'closing-sections.html',
    'footer.html',
];

// ============================================================
// 1. Create output directories
// ============================================================
fs.mkdirSync(CSS_DEST, { recursive: true });

// ============================================================
// 2. Concatenate HTML partials → docs/index.html
// ============================================================
let html = '';
partialOrder.forEach(name => {
    const filePath = path.join(PARTIALS, name);
    const content = fs.readFileSync(filePath, 'utf8');
    html += content;
});

fs.writeFileSync(path.join(DOCS, 'index.html'), html, 'utf8');
console.log(`  Built: docs/index.html (${html.length.toLocaleString()} chars)`);

// ============================================================
// 3. Copy CSS files → docs/css/
// ============================================================
const cssFiles = fs.readdirSync(CSS_SRC).filter(f => f.endsWith('.css'));
cssFiles.forEach(name => {
    fs.copyFileSync(path.join(CSS_SRC, name), path.join(CSS_DEST, name));
    console.log(`  Copied: docs/css/${name}`);
});

console.log(`\n✅ Build complete! Serve docs/ to preview.`);
