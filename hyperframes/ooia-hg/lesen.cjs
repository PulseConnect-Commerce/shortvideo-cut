/* Liest Seiten von ooia.de (ohne Login, Handy-Ansicht 412 css-px): sichtbarer Text und ein kleines Bild der ganzen Seite, nur
   zum Ansehen und Auswählen der Abschnitte für M09 · ooia.  node lesen.cjs <ziel-ordner> <name>=<url> ... */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
(async () => {
  const [out, ...paare] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const p of paare) {
    const i = p.indexOf('=');
    const name = p.slice(0, i), url = p.slice(i + 1);
    const ctx = await browser.newContext({ viewport: { width: 412, height: 900 }, deviceScaleFactor: 1, locale: 'de-DE', isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    try {
      const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(4000);
      for (const t of ['Alle akzeptieren', 'Akzeptieren', 'Einverstanden', 'Alle Cookies akzeptieren', 'Accept', 'Accept all', 'Zustimmen', 'Alle zulassen']) {
        const b = page.getByRole('button', { name: t, exact: true });
        if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
      }
      const h = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < h; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(200); }
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
      const text = await page.evaluate(() => document.body.innerText);
      fs.writeFileSync(`${out}/${name}.txt`, `${url}\n${page.url()} ${r && r.status()} ${await page.title()}\n\n` + text.replace(/\n\s*\n+/g, '\n'));
      await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
      console.log(name, page.url(), r && r.status(), h);
    } catch (e) { console.log(name, 'FEHLER', e.message); }
    await ctx.close();
  }
  await browser.close();
})();
