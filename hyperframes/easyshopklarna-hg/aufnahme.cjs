/* Nimmt die Quellen für N10 · easyShop rüstet gegen Amazon auf – Klarna in 19 Ländern auf (Playwright/Chromium, ohne
   Login, Handy-Ansicht 412 css-px, 2,62-fach = 1079 px breit; Vorlage hyperframes/ebaykombi-hg/aufnahme.cjs).
   Cookie-Hinweis bestätigt, schwebende Elemente (Hinweisleiste, Chat) ausgeblendet; die Sätze, über die er spricht,
   mit <mark> grün hinterlegt (stil-news "Quelle"). Sonst nichts verändert. Je Seite ein Bild der ganzen Seite und die
   css-y der Markierungen und Überschriften in aufnahme.json.  node aufnahme.cjs <ziel-ordner> [klarna|launch] */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  // Briefing-Quelle: OnCommerce-Pressemitteilung vom 29.10.2026
  klarna: {
    url: 'https://www.oncommerce.com/ie/news/easyshop-rolls-out-klarna/',
    marken: [
      'Klarna is now available on easyShop across 19 European markets',
      'Shoppers can choose Pay in Full, Pay in 3 or Pay in 30*, with no interest',
      "The launch comes ahead of easyShop's first Black Friday and Christmas trading season",
      '*Klarna payment options vary by country and are subject to eligibility.',
    ],
    anker: ['easyShop rolls out Klarna', '29 October 2026'],
  },
  // Start im Oktober: OnCommerce-Pressemitteilung vom 13.10.2026 (21 Länder, ein Konto)
  launch: {
    url: 'https://www.oncommerce.com/ie/news/easyshop-launches-across-europe-challenging-amazon/',
    marken: [
      'easyShop.com launches across 21 European countries as a challenger to Amazon',
      'Retailers can sell into 21 markets through one account, with VAT calculated automatically',
    ],
    anker: ['Stelios took on the airlines', '13 October 2026'],
  },
};
(async () => {
  const [out, ...nur] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const info = {};
  for (const [name, z] of Object.entries(ZIELE)) {
    if (nur.length && !nur.includes(name)) continue;
    const ctx = await browser.newContext({ viewport: { width: 412, height: 732 }, deviceScaleFactor: 2.62, locale: 'de-DE' });
    const page = await ctx.newPage();
    const r = await page.goto(z.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3500);
    for (const t of ['Accept all', 'Accept All', 'Accept', 'Alle akzeptieren', 'Allow all', 'Einverstanden', 'Akzeptieren']) {
      const b = page.getByRole('button', { name: t });
      if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
    }
    await page.waitForTimeout(1500);
    const daten = await page.evaluate(({ marken, anker }) => {
      for (const el of document.querySelectorAll('body *')) {
        const st = getComputedStyle(el);
        if ((st.position === 'fixed' || st.position === 'sticky') && el.getBoundingClientRect().top > 40) el.style.display = 'none';
      }
      for (const el of document.querySelectorAll('[class*="chat"], [id*="chat"], [id*="hubspot"], [class*="cookie"], [id*="cookie"], .modal-backdrop')) {
        const b = el.getBoundingClientRect(); if (b.width < 500 || /cookie/i.test(el.className + el.id)) el.style.display = 'none';
      }
      document.body.style.overflow = 'visible';
      const pos = {};
      for (const m of marken) {
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let gefunden = false;
        while (w.nextNode()) {
          const n = w.currentNode; const txt = n.textContent.replace(/\s+/g, ' ');
          const i = txt.indexOf(m.slice(0, 30));
          if (i < 0) continue;
          const roh = n.textContent; const start = roh.replace(/\s+/g, ' ').indexOf(m.slice(0, 30));
          const rg = document.createRange(); rg.setStart(n, Math.max(0, start)); rg.setEnd(n, Math.min(roh.length, start + m.length));
          const mk = document.createElement('mark');
          mk.style.cssText = 'background:#7CF0C4;color:#0B0C0E;border-radius:4px;padding:0 2px;box-decoration-break:clone;-webkit-box-decoration-break:clone';
          try { rg.surroundContents(mk); } catch (e) { n.parentElement.style.background = '#7CF0C4'; }
          const b = (mk.isConnected ? mk : n.parentElement).getBoundingClientRect();
          pos[m] = [Math.round(b.top + scrollY), Math.round(b.height)]; gefunden = true; break;
        }
        if (!gefunden) pos[m] = null;
      }
      const ank = {};
      for (const a of anker) {
        for (const el of document.querySelectorAll('h1,h2,h3,p,span,time,div')) {
          if (el.children.length === 0 && el.textContent.trim().startsWith(a)) { const b = el.getBoundingClientRect(); ank[a] = [Math.round(b.top + scrollY), Math.round(b.height)]; break; }
        }
      }
      return { pos, ank, hoehe: document.body.scrollHeight };
    }, { marken: z.marken, anker: z.anker });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}/${name}-ganz.png`, fullPage: true });
    info[name] = { url: page.url(), status: r && r.status(), titel: await page.title(), ...daten };
    console.log(name, page.url(), r && r.status(), await page.title(), JSON.stringify(daten.pos), JSON.stringify(daten.ank));
    await ctx.close();
  }
  const p = `${out}/aufnahme.json`;
  const alt = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : { ziele: {} };
  alt.datum = new Date().toISOString(); alt.viewport = '412x732 @2.62'; Object.assign(alt.ziele, info);
  fs.writeFileSync(p, JSON.stringify(alt, null, 1));
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
