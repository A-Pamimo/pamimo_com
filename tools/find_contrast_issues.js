const fs = require('fs');
const path = require('path');

function readAllCss(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(readAllCss(full));
    } else if (full.endsWith('.css')) {
      results.push(full);
    }
  }
  return results;
}

function findIssuesInFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  const issues = [];
  // Simple block parser: split by '}' to find selector blocks and search within each
  const blocks = text.split('}');
  let lineOffset = 0;
  for (const block of blocks) {
    // skip blocks explicitly marked to ignore contrast scanning
    if (block.indexOf('contrast-ignore') !== -1) {
      lineOffset += block.split(/\r?\n/).length;
      continue;
    }
    const lines = block.split(/\r?\n/);
    // determine starting line number for this block by counting previous newlines
    const blockText = block + '}';
    const colorMatches = [];
    const bgMatches = [];
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      const mc = ln.match(/color:\s*var\((--gg-[a-z0-9-]+)\)/i);
      if (mc) colorMatches.push({var: mc[1], line: lineOffset + i + 1});
      const mb = ln.match(/background(?:-color)?:\s*var\((--gg-[a-z0-9-]+)\)/i);
      if (mb) bgMatches.push({var: mb[1], line: lineOffset + i + 1});
    }
    // report when same var appears in both color and background within the same block
    for (const c of colorMatches) {
      for (const b of bgMatches) {
        if (c.var === b.var) {
          issues.push({line: c.line, var: c.var, bgLine: b.line, block: lines.join('\n')});
        }
      }
    }
    lineOffset += lines.length;
  }
  return issues;
}

const root = path.join(__dirname, '..', 'components', 'apps', 'grocery-gap');
const cssFiles = readAllCss(root);
let total = 0;
for (const f of cssFiles) {
  if (f.endsWith('theme.css')) continue; // skip theme variables file (intentional variable defs)
  const issues = findIssuesInFile(f);
  if (issues.length) {
    console.log('File:', f);
    issues.forEach(it => console.log('  color/bg same var', it));
    total += issues.length;
  }
}
console.log('Total issues found:', total);
