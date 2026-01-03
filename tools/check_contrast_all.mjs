#!/usr/bin/env node
import { exec as execCb } from 'child_process';
import util from 'util';
import puppeteer from 'puppeteer';
const exec = util.promisify(execCb);

const url = process.argv[2] || 'http://localhost:3000/blog/the-grocery-gap';

async function runStatic() {
  console.log('\n--- STATIC CSS SCAN ---');
  try {
    const { stdout, stderr } = await exec('node tools/find_contrast_issues.js', { maxBuffer: 10 * 1024 * 1024 });
    console.log(stdout);
    if (stderr && stderr.trim()) console.error('Static scan stderr:', stderr);
  } catch (e) {
    console.error('Static scan failed:', e.message);
    if (e.stdout) console.log(e.stdout);
    if (e.stderr) console.error(e.stderr);
  }
}

function parseRGBAString(s) {
  if (!s) return null;
  const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 1 };
}

function sameRGBA(a, b) {
  if (!a || !b) return false;
  return a.r === b.r && a.g === b.g && a.b === b.b && Math.abs((a.a || 1) - (b.a || 1)) < 0.001;
}

async function runRuntime(targetUrl) {
  console.log('\n--- RUNTIME CONTRAST SCAN (PUPPETEER) ---');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 2000 });

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (e) {
    console.error('Navigation failed:', e.message);
    await browser.close();
    return { error: 'navigation-failed', message: e.message };
  }

  const issues = await page.evaluate(() => {
    function parseRGBA(s) {
      if (!s) return null;
      const d = document.createElement('div');
      d.style.color = s;
      document.body.appendChild(d);
      const cs = getComputedStyle(d).color;
      d.remove();
      const m = cs.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
      if (!m) return null;
      return { r: parseInt(m[1], 10), g: parseInt(m[2], 10), b: parseInt(m[3], 10), a: m[4] ? parseFloat(m[4]) : 1 };
    }
    function sameRGBA(a, b) {
      if (!a || !b) return false;
      return a.r === b.r && a.g === b.g && a.b === b.b && Math.abs((a.a || 1) - (b.a || 1)) < 0.001;
    }
    function resolvedBackground(el) {
      let cur = el;
      while (cur && cur.nodeType === 1) {
        const cs = getComputedStyle(cur);
        const bg = cs.backgroundColor;
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
        if (m && (!m[4] || parseFloat(m[4]) > 0)) {
          return { r: parseInt(m[1], 10), g: parseInt(m[2], 10), b: parseInt(m[3], 10), a: m[4] ? parseFloat(m[4]) : 1 };
        }
        cur = cur.parentElement;
      }
      return null;
    }
    const all = Array.from(document.querySelectorAll('body *'));
    const issues = [];
    all.forEach(el => {
      if (!el.textContent || el.textContent.trim().length === 0) return;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) === 0) return;
      const colorStr = style.color;
      const color = (function (s) {
        const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
        if (!m) return null;
        return { r: parseInt(m[1], 10), g: parseInt(m[2], 10), b: parseInt(m[3], 10), a: m[4] ? parseFloat(m[4]) : 1 };
      })(colorStr);
      const bg = resolvedBackground(el);
      if (!color || !bg) return;
      if (sameRGBA(color, bg)) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '';
        issues.push({ selector: tag + id + cls, text: el.textContent.trim().slice(0, 120), color: style.color, background: `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${bg.a})` });
      }
    });
    return issues;
  });

  console.log('Runtime issues found:', issues.length);
  if (issues.length) console.log(JSON.stringify(issues, null, 2));
  await browser.close();
  return { issues };
}

(async () => {
  await runStatic();
  const runtimeResult = await runRuntime(url);
  if (runtimeResult && runtimeResult.error) {
    console.error('\nRuntime check failed:', runtimeResult.message);
    process.exitCode = 2;
  } else {
    console.log('\nAll checks complete.');
  }
})();
