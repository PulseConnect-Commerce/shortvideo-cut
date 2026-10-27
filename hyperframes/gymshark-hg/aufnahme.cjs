/* Nimmt die Gymshark-Seiten für M07 auf (Playwright/Chromium, ohne Login, Handy-Ansicht 432x768 css-px, 2,5-fach):
   je Ziel die Kopfleiste (oben, mit Logo) und den Abschnitt ab css-y, beide 1080 px breit. Cookie- und Länder-Hinweis
   werden ausgeblendet, sonst nichts verändert. Aufruf: node aufnahme.cjs <ziel-ordner> [name ...] */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  story: ['https://de.gymshark.com/blog/article/the-official-gymshark-story', 190],
  about: ['https://de.gymshark.com/pages/about-us', 330],
  neu: ['https://de.gymshark.com/collections/new-releases', 1060],
  g66: ['https://de.gymshark.com/blog/article/what-is-the-gymshark-66-challenge', 190],
  popup: ['https://www.gymshark.com/blog/article/the-next-gymshark-pop-up-is', 540],
  sulek: ['https://de.gymshark.com/pages/sam-sulek-collab', 3300],
  athlet: ['https://de.gymshark.com/blog/article/how-to-become-a-gymshark-athlete', 190],
  regent: ['https://www.gymshark.com/blog/article/the-gymshark-london-store', 3650],
  stores: ['https://de.gymshark.com/pages/stores', 1330],
};
(async () => {
  const [out, ...nur] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const info = {};
  for (const [name, [url, y]] of Object.entries(ZIELE)) {
    if (nur.length && !nur.includes(name)) continue;
    const ctx = await browser.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true, locale: 'de-DE',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);
    for (const t of ['Alle Cookies akzeptieren', 'Accept All Cookies', 'Accept All', 'Alle akzeptieren']) {
      const b = page.getByRole('button', { name: t });
      if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
    }
    await page.waitForTimeout(800);
    // Länder-Hinweis ("Bist du am richtigen Ort?") ausblenden, ohne die Seite zu wechseln
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        const t = (el.innerText || '').toUpperCase();
        if ((t.startsWith('BIST DU AM RICHTIGEN ORT') || t.startsWith('ARE YOU IN THE RIGHT PLACE')) && t.length < 400) {
          let p = el; while (p && p !== document.body && getComputedStyle(p).position !== 'fixed') p = p.parentElement;
          (p && p !== document.body ? p : el).style.display = 'none';
        }
      }
    });
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let yy = 0; yy < Math.min(h, y + 1500); yy += 500) { await page.evaluate((v) => window.scrollTo(0, v), yy); await page.waitForTimeout(400); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${name}-kopf.png` });
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true, clip: { x: 0, y, width: 432, height: 658 } });
    const texte = await page.evaluate(([y0]) => {
      const r = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) { const n = w.currentNode; const s = n.textContent.trim().replace(/\s+/g, ' '); if (!s) continue;
        const b = n.parentElement.getBoundingClientRect(); const top = b.top + scrollY;
        if (b.width > 1 && top >= y0 && top < y0 + 658) r.push([Math.round(top - y0), s.slice(0, 160)]); }
      return r;
    }, [y]);
    info[name] = { url: page.url(), titel: await page.title(), abschnitt_css_y: y, sichtbar: texte };
    console.log(name, page.url(), await page.title());
    await ctx.close();
  }
  const p = `${out}/aufnahme.json`;
  const alt = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : { ziele: {} };
  alt.datum = new Date().toISOString(); alt.viewport = '432x768 @2.5'; Object.assign(alt.ziele, info);
  fs.writeFileSync(p, JSON.stringify(alt, null, 1));
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
