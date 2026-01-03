import puppeteer from 'puppeteer';

(async () => {
  const url = 'http://localhost:3000/blog/the-grocery-gap';
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 2000 });
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (e) {
    console.error('Navigation failed:', e.message);
    await browser.close();
    process.exit(1);
  }

  const issues = await page.evaluate(() => {
    function parseRGBA(s) {
      if (!s) return null;
      // handle hex, rgb(a)
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = s;
      const computed = ctx.fillStyle; // this yields rgb(...) or #rrggbb
      // create a temp element to read computed color reliably
      const d = document.createElement('div');
      d.style.color = s;
      document.body.appendChild(d);
      const cs = getComputedStyle(d).color;
      d.remove();
      const m = cs.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9\.]+))?\)/);
      if (!m) return null;
      return {
        r: parseInt(m[1], 10),
        g: parseInt(m[2], 10),
        b: parseInt(m[3], 10),
        a: m[4] ? parseFloat(m[4]) : 1
      };
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
        const parsed = parseRGBA(bg);
        if (parsed && parsed.a > 0) return parsed;
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
      const color = parseRGBA(style.color);
      const bg = resolvedBackground(el);
      if (!color || !bg) return;
      if (sameRGBA(color, bg)) {
        // build a short selector
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '';
        issues.push({
          tag: tag + id + cls,
          text: el.textContent.trim().slice(0, 120),
          color: style.color,
          background: (bg.r !== undefined ? `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${bg.a})` : null)
        });
      }
    });
    return issues;
  });

  console.log('Contrast issues found:', issues.length);
  if (issues.length) console.log(JSON.stringify(issues, null, 2));
  await browser.close();
})();
