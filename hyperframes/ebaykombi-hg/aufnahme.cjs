/* Nimmt die zwei Quellen aus dem Briefing für N09 · eBay-Kombirabatte auf (Playwright/Chromium, ohne Login, Handy-Ansicht
   412 css-px, 2,62-fach = 1079 px breit). Cookie-Hinweis bestätigt, schwebende Knöpfe (Chat-Hilfe, Barrierefreiheit) und
   die Werbe-Einblendung ausgeblendet; die Sätze, über die er spricht, mit <mark> grün hinterlegt (stil-news "Quelle").
   Sonst nichts verändert. Je Seite ein Bild der ganzen Seite (ohne Scrollen, eBay zeigt sonst eine Identitätsprüfung,
   die nicht umgangen wird) und die css-y der Markierungen in aufnahme.json.  node aufnahme.cjs <ziel-ordner> [ebay|hb] */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  ebay: {
    url: 'https://www.ebay.de/help/selling/selling-tools/selling-bundle-discounts?id=5842',
    faq: ['Muss ich diese Option aktivieren?', 'Was passiert, wenn ein Käufer einen Teil einer gebündelten Bestellung zurückgibt?'],
    marken: [
      'beim Kauf von 2, 3 oder mehr Exemplaren desselben Artikels oder beim Kauf mehrerer unterschiedlicher Artikel festlegen.',
      'An der Kasse wird der Endbetrag angezeigt, den Ihre Käufer bezahlen.',
      'Sie selbst müssen den Rabatt nicht berechnen oder bestätigen, dass er angewendet wurde.',
      'Wählen Sie danach den Rabattprozentsatz für 2, 3 und 4+ Artikel aus',
      'berechnen wir den neuen Preis für die Artikel, die der Käufer behält.',
      'Da der Käufer 2 Artikel behält, gilt für die Bestellung nun der Kombirabatt für den Kauf von 2 Artikeln.',
    ],
    anker: ['Kombirabatte für Verkäufer', 'So funktionieren Kombirabatte', 'Einrichten von Kombirabatten', 'So funktionieren Rückgaben', 'FAQs'],
  },
  hb: {
    url: 'https://ohn.haendlerbund.de/themen/marktplaetze/mehr-artikel-bestellung-ebay-kombirabatte-haendler',
    faq: [],
    marken: [
      'Möglich sind bis zu drei Stufen, etwa:',
      'Die Prozentwerte sind Beispiele aus der Ankündigung.',
      'Kombirabatte sind nicht standardmäßig aktiv.',
      'Schickt ein Käufer einen Teil der Bestellung zurück, berechnet Ebay den Rabatt anhand der verbleibenden Stückzahl neu.',
    ],
    anker: ['Mehr Artikel pro Bestellung? Ebay startet Kombirabatte für Händler', 'So funktionieren die Kombirabatte', 'Aktivierung und Auswahl der Artikel'],
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
    for (const t of ['Alle akzeptieren', 'Einverstanden', 'Akzeptieren', 'Alle Cookies akzeptieren']) {
      const b = page.getByRole('button', { name: t });
      if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
    }
    await page.waitForTimeout(1500);
    const pruef = await page.evaluate(() => /Identität/.test(document.body.innerText.slice(0, 600)));
    if (pruef) { console.log(name, 'Identitätsprüfung, nicht umgangen'); await ctx.close(); continue; }
    for (const f of z.faq) {
      const h = page.getByText(f, { exact: true });
      if (await h.count()) { try { await h.first().click({ timeout: 2000 }); await page.waitForTimeout(500); } catch (e) { console.log('faq?', f); } }
    }
    const daten = await page.evaluate(({ marken, anker }) => {
      // schwebende Elemente (Chat-Hilfe, Barrierefreiheit, Werbe-Overlay) ausblenden
      for (const el of document.querySelectorAll('body *')) {
        const st = getComputedStyle(el);
        if ((st.position === 'fixed' || st.position === 'sticky') && el.getBoundingClientRect().top > 40) el.style.display = 'none';
      }
      for (const el of document.querySelectorAll('[class*="chat"], [id*="chat"], [class*="incluvia"], [id*="incluvia"], [class*="ad-"], [id*="ad-"], .modal-backdrop')) {
        const b = el.getBoundingClientRect(); if (b.width < 500) el.style.display = 'none';
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
          try { rg.surroundContents(mk); } catch (e) { const s = document.createElement('mark'); n.parentElement.style.background = '#7CF0C4'; }
          const b = (mk.isConnected ? mk : n.parentElement).getBoundingClientRect();
          pos[m] = [Math.round(b.top + scrollY), Math.round(b.height)]; gefunden = true; break;
        }
        if (!gefunden) pos[m] = null;
      }
      const ank = {};
      for (const a of anker) {
        for (const el of document.querySelectorAll('h1,h2,h3')) if (el.textContent.trim().startsWith(a)) { const b = el.getBoundingClientRect(); ank[a] = Math.round(b.top + scrollY); break; }
      }
      const faq = [...document.querySelectorAll('h3')].map((h) => { const p = h.closest('details, [class*=accordion], [class*=faq], li, div'); return [h.textContent.trim(), p ? p.innerText.replace(/\s+/g, ' ').slice(0, 500) : '']; });
      return { pos, ank, faq, hoehe: document.body.scrollHeight };
    }, { marken: z.marken, anker: z.anker });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}/${name}-ganz.png`, fullPage: true });
    info[name] = { url: page.url(), status: r && r.status(), titel: await page.title(), ...daten };
    console.log(name, page.url(), await page.title(), JSON.stringify(daten.pos));
    await ctx.close();
  }
  const p = `${out}/aufnahme.json`;
  const alt = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : { ziele: {} };
  alt.datum = new Date().toISOString(); alt.viewport = '412x732 @2.62'; Object.assign(alt.ziele, info);
  fs.writeFileSync(p, JSON.stringify(alt, null, 1));
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
