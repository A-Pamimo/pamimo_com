import puppeteer from 'puppeteer';

(async () => {
  const url = 'http://localhost:3001/blog/the-grocery-gap';
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({width:1280, height:2000});
  await page.goto(url, {waitUntil: 'networkidle2'});
  // Wait for main content
  await page.waitForSelector('body');
  // Take full page screenshot
  await page.screenshot({path: 'grocery-gap.png', fullPage: true});
  console.log('Saved screenshot: grocery-gap.png');
  await browser.close();
})();
