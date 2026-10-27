/* Nimmt die zwei Quellen aus dem Briefing für N07 · Temu-Warenkorb auf (Playwright/Chromium, ohne Login, Handy-Ansicht
   412 css-px, 2,62-fach = 1079 px breit). Cookie-Hinweis bestätigt, schwebende Knöpfe und Werbe-Einblendungen ausgeblendet;
   die Sätze, über die er spricht, mit <mark> grün hinterlegt (stil-news "Quelle"). Sonst nichts verändert.
   Je Seite ein Bild der ganzen Seite und die css-y der Markierungen und Überschriften in aufnahme.json.
     node aufnahme.cjs <ziel-ordner> [nh] [cp]
   Vorbild: hyperframes/ebaykombi-hg/aufnahme.cjs (N09). Hier markiert der Marker auch Sätze, die über mehrere Textknoten
   laufen (Links wie "Temu" mitten im Satz): jeder Textknoten-Teil bekommt sein eigenes <mark>. */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  nh: {
    url: 'https://www.neuhandeln.de/beitraege/db/018477grollmann.html',
    marken: [
      'Ein identischer Warenkorb kostet beim Online-Marktplatz Temu in Deutschland 59 Prozent mehr als in der Schweiz.',
      '126,94 Euro bezahlen, während derselbe Einkauf in der Schweiz umgerechnet lediglich 80 Euro kostet.',
      'Die Untersuchung basiert auf einem Warenkorbvergleich vom 23. Oktober 2026.',
      'Im deutschen Warenkorb weist Temu Einfuhrabgaben von 21,42 Euro aus, übernimmt davon allerdings selbst 6,42 Euro.',
      'Selbst wenn diese vollständig herausgerechnet werden, liegt der deutsche Warenkorb allerdings mit 111,94 Euro noch deutlich über dem Schweizer Preisniveau.',
      'Carpathia vermutet deshalb, dass Temu in der Schweiz möglicherweise gezielt niedrigere Aktionspreise einsetzt',
      'Belege für diese Vermutungen liefert der Vergleich allerdings nicht.',
    ],
    anker: ['Regulierung wirkt', 'Einfuhrabgaben erklären nur einen Teil', 'Chinesische Plattformen'],
  },
  cp: {
    url: 'https://blog.carpathia.ch/2026/10/25/gleicher-temu-warenkorb-in-deutschland-59-teurer-als-in-der-schweiz/',
    marken: [
      'einen identischen Warenkorb mit Topsellern aus verschiedenen Produktkategorien zusammengestellt.',
      'In Deutschland ist derselbe Einkauf somit CHF 43.1 beziehungsweise 59 Prozent teurer als in der Schweiz.',
      'Im deutschen Checkout werden EUR 21.42 an Einfuhrabgaben ausgewiesen. Temu subventioniert davon EUR 6.42; für den Warenkorb bleiben EUR 15 übrig.',
      'Denkbar sind Schweiz-spezifische Aktionspreise',
    ],
    zellen: ['EUR 126.94', 'EUR 80.0'],
    anker: ['Gleicher Temu-Warenkorb', 'Abgaben erklären die Differenz nur teilweise', 'Regulierungen zeigen Wirkung'],
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
    for (const t of ['Erlauben', 'Alle akzeptieren', 'Einverstanden', 'Akzeptieren', 'Alle Cookies akzeptieren', 'Accept']) {
      const b = page.getByRole('button', { name: t, exact: true });
      if (await b.count()) { try { await b.first().click({ timeout: 2000 }); break; } catch (e) {} }
      const l = page.getByText(t, { exact: true });
      if (await l.count()) { try { await l.first().click({ timeout: 2000 }); break; } catch (e) {} }
    }
    await page.waitForTimeout(1500);
    // einmal langsam durchscrollen, damit Bilder (lazy) geladen sind
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(1500);
    const daten = await page.evaluate(({ marken, anker, zellen }) => {
      // schwebende Elemente (Cookie-Leiste, Chat, Werbe-Overlay, Zurück-nach-oben) ausblenden
      for (const el of document.querySelectorAll('body *')) {
        const st = getComputedStyle(el);
        if (st.position === 'fixed' || (st.position === 'sticky' && el.getBoundingClientRect().top > 40)) el.style.display = 'none';
      }
      for (const el of document.querySelectorAll('[class*="cookie"], [id*="cookie"], [class*="consent"], [id*="consent"], .modal-backdrop, ins.adsbygoogle, [id^="google_ads"], iframe')) el.style.display = 'none';
      document.body.style.overflow = 'visible';
      const norm = (s) => s.replace(/\s+/g, ' ');
      const pos = {};
      // Text eines Blocks als Folge von Textknoten; Satz suchen (Leerräume zusammengefasst) und jeden Teil umhüllen
      function markiere(m) {
        const bloecke = [...document.querySelectorAll('p, li, h1, h2, h3, td, figcaption, div')].filter((b) => norm(b.innerText || '').includes(m));
        if (!bloecke.length) return null;
        const b = bloecke.reduce((a, c) => ((c.innerText || '').length < (a.innerText || '').length ? c : a));
        const knoten = []; const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
        let voll = '';
        while (w.nextNode()) { const n = w.currentNode; knoten.push([n, voll.length]); voll += n.textContent; }
        // Abbildung normalisierter Index -> Rohindex
        let nz = ''; const map = [];
        for (let i = 0; i < voll.length; i++) { const c = voll[i]; if (/\s/.test(c)) { if (nz.endsWith(' ')) continue; nz += ' '; } else nz += c; map.push(i); }
        const a = nz.indexOf(m); if (a < 0) return null;
        const von = map[a], bis = map[a + m.length - 1] + 1;
        const rects = [];
        for (const [n, off] of knoten) {
          const s = Math.max(von, off), e = Math.min(bis, off + n.textContent.length);
          if (s >= e || !n.textContent.slice(s - off, e - off).trim()) continue;
          const rg = document.createRange(); rg.setStart(n, s - off); rg.setEnd(n, e - off);
          const mk = document.createElement('mark');
          mk.style.cssText = 'background:#7CF0C4;color:#0B0C0E;border-radius:4px;padding:0 2px;box-decoration-break:clone;-webkit-box-decoration-break:clone';
          try { rg.surroundContents(mk); rects.push(mk); } catch (e) {}
        }
        if (!rects.length) return null;
        const ys = rects.flatMap((mk) => [...mk.getClientRects()].map((r) => [r.top + scrollY, r.bottom + scrollY]));
        const top = Math.min(...ys.map((y) => y[0])), bot = Math.max(...ys.map((y) => y[1]));
        return [Math.round(top), Math.round(bot - top)];
      }
      for (const m of marken) pos[m] = markiere(m);
      for (const zt of (zellen || [])) {
        const td = [...document.querySelectorAll('td, th')].find((c) => c.textContent.trim() === zt);
        if (td) { td.style.background = '#7CF0C4'; td.style.color = '#0B0C0E'; const b = td.getBoundingClientRect(); pos[zt] = [Math.round(b.top + scrollY), Math.round(b.height)]; } else pos[zt] = null;
      }
      const ank = {};
      for (const a of anker) {
        for (const el of document.querySelectorAll('h1,h2,h3,h4,strong')) if (el.textContent.trim().startsWith(a)) { const b = el.getBoundingClientRect(); ank[a] = Math.round(b.top + scrollY); break; }
      }
      const bilder = [...document.querySelectorAll('img')].map((i) => { const b = i.getBoundingClientRect(); return [i.alt || i.src.slice(-60), Math.round(b.top + scrollY), Math.round(b.height), Math.round(b.width)]; }).filter((x) => x[2] > 80);
      return { pos, ank, bilder, hoehe: document.body.scrollHeight };
    }, { marken: z.marken, anker: z.anker, zellen: z.zellen });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}/${name}-ganz.png`, fullPage: true });
    info[name] = { url: page.url(), status: r && r.status(), titel: await page.title(), ...daten };
    console.log(name, page.url(), await page.title(), JSON.stringify(daten.pos), JSON.stringify(daten.ank));
    await ctx.close();
  }
  const p = `${out}/aufnahme.json`;
  const alt = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : { ziele: {} };
  alt.datum = new Date().toISOString(); alt.viewport = '412x732 @2.62'; Object.assign(alt.ziele, info);
  fs.writeFileSync(p, JSON.stringify(alt, null, 1));
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
