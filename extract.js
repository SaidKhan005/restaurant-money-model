/**
 * extract.js — One-time script to split index.html into src/css/ and src/partials/
 * Run with: node extract.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const CSS_DIR = path.join(SRC, 'css');
const PARTIALS_DIR = path.join(SRC, 'partials');

// Read the original file
const raw = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const lines = raw.split('\n');

// Helper: extract lines (1-indexed, inclusive) and join with newline
function getLines(start, end) {
    return lines.slice(start - 1, end).join('\n');
}

// Helper: extract CSS lines, stripping the 8-space indent from the <style> block
function getCSSLines(start, end) {
    return lines.slice(start - 1, end).map(line => {
        // Strip exactly 8 leading spaces (the indent inside <style>)
        if (line.startsWith('        ')) {
            return line.substring(8);
        }
        return line;
    }).join('\n');
}

// Create directories
fs.mkdirSync(CSS_DIR, { recursive: true });
fs.mkdirSync(PARTIALS_DIR, { recursive: true });

// ============================================================
// CSS FILES (strip 8-space indent)
// ============================================================

const cssFiles = [
    { name: 'base.css',        start: 9,    end: 26   },
    { name: 'layout.css',      start: 28,   end: 143  },
    { name: 'flow-chart.css',  start: 145,  end: 273  },
    { name: 'components.css',  start: 275,  end: 808  },
    { name: 'connections.css', start: 810,  end: 861  },
    { name: 'closing.css',     start: 863,  end: 904  },
    { name: 'responsive.css',  start: 906,  end: 952  },
    { name: 'navigation.css',  start: 954,  end: 1038 },
    { name: 'collapsible.css', start: 1040, end: 1095 },
    { name: 'back-to-top.css', start: 1096, end: 1132 },
];

cssFiles.forEach(({ name, start, end }) => {
    const content = getCSSLines(start, end);
    fs.writeFileSync(path.join(CSS_DIR, name), content + '\n', 'utf8');
    console.log(`  CSS: ${name} (lines ${start}-${end})`);
});

// ============================================================
// HTML PARTIALS (exact line copy, no modifications)
// ============================================================

const htmlPartials = [
    { name: 'body-open.html',         start: 1136, end: 1136 },
    { name: 'navigation.html',        start: 1137, end: 1145 },
    { name: 'container-open.html',    start: 1146, end: 1147 },
    { name: 'header.html',            start: 1148, end: 1152 },
    { name: 'core-beliefs.html',      start: 1153, end: 1182 },
    { name: 'system-overview.html',   start: 1183, end: 1209 },
    { name: 'flow-chart-open.html',   start: 1210, end: 1212 },
    { name: 'node-1-demand.html',     start: 1213, end: 1747 },
    { name: 'connection-1-2.html',    start: 1748, end: 1758 },
    { name: 'node-2-capacity.html',   start: 1759, end: 2573 },
    { name: 'connection-2-3.html',    start: 2574, end: 2586 },
    { name: 'node-3-experience.html', start: 2587, end: 3060 },
    { name: 'connection-3-4.html',    start: 3061, end: 3075 },
    { name: 'node-4-behavior.html',   start: 3076, end: 3742 },
    { name: 'connection-4-5.html',    start: 3743, end: 3755 },
    { name: 'node-5-economics.html',  start: 3756, end: 4446 },
    { name: 'connection-5-6.html',    start: 4447, end: 4459 },
    { name: 'node-6-profit.html',     start: 4460, end: 4771 },
    { name: 'flow-chart-close.html',  start: 4772, end: 4773 },
    { name: 'closing-sections.html',  start: 4774, end: 4810 },
    { name: 'footer.html',           start: 4811, end: 4818 },
];

htmlPartials.forEach(({ name, start, end }) => {
    const content = getLines(start, end);
    fs.writeFileSync(path.join(PARTIALS_DIR, name), content + '\n', 'utf8');
    console.log(`  HTML: ${name} (lines ${start}-${end})`);
});

// ============================================================
// HEAD.HTML — Written fresh with <link> tags
// ============================================================

const headHtml = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Restaurant Money Model - Complete System</title>
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/layout.css">
    <link rel="stylesheet" href="css/flow-chart.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/connections.css">
    <link rel="stylesheet" href="css/closing.css">
    <link rel="stylesheet" href="css/navigation.css">
    <link rel="stylesheet" href="css/collapsible.css">
    <link rel="stylesheet" href="css/back-to-top.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
`;

fs.writeFileSync(path.join(PARTIALS_DIR, 'head.html'), headHtml, 'utf8');
console.log('  HTML: head.html (written fresh)');

console.log('\n✅ Extraction complete!');
console.log(`  CSS files: ${cssFiles.length} → ${CSS_DIR}`);
console.log(`  HTML partials: ${htmlPartials.length + 1} → ${PARTIALS_DIR}`);
