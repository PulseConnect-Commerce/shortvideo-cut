/* Liest eine Seite von purelei.com (ohne Login, Handy-Ansicht 412 css-px): ganzer sichtbarer Text und ein Bild der ganzen Seite
   (klein, nur zum Ansehen).  node lesen.cjs <url> <bild.png> */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const [url, bild] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 412, height: 900 }, deviceScaleFactor: 1, locale: 'de-DE' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  for (const t of ['Alle akzeptieren', 'Akzeptieren', 'Einverstanden', 'Alle Cookies akzeptieren', 'Accept', 'Accept all', 'Zustimmen']) {
    const b = page.getByRole('button', { name: t });
    if (await b.count()) { try { await b.first().click({ timeout: 2000 }); console.log('Cookie:', t); break; } catch (e) {} }
  }
  // langsam scrollen, damit Bilder laden
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(250); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.replace(/\n\s*\n+/g, '\n').slice(0, 6000));
  if (bild) await page.screenshot({ path: bild, fullPage: true });
  await browser.close();
})();
