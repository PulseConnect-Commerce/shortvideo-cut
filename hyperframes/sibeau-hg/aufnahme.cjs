/* Nimmt die Quelle aus dem Briefing für M10 · SI BEAU auf (Vorlage hyperframes/huel-hg/aufnahme.cjs): den Shopify-Beitrag
   https://www.shopify.com/de/blog/kultur-und-kreativpilotenpreis-si-beau (6. Jan. 2020) und die Seite der Kultur- und Kreativpiloten
   (Playwright/Chromium, ohne Login, Handy-Ansicht 432 css-px, 2,5-fach = 1080 px breit): je Ziel ein Bild der ganzen Seite (nach
   /dev/shm, groß) und die css-y der Überschriften, Bilder und Markierungen in aufnahme.json. Cookie-Hinweis bestätigt bzw.
   ausgeblendet, schwebende Leisten ausgeblendet; im Shopify-Beitrag die Sätze, über die er spricht, mit <mark> grün hinterlegt
   (karten-aufbau.md "Quelle groß"). Sonst nichts verändert.  node aufnahme.cjs <ordner-ganze-seiten> <ordner-json> [name ...] */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  shopify: {
    url: 'https://www.shopify.com/de/blog/kultur-und-kreativpilotenpreis-si-beau',
    marken: [
      'Die digitale Fokusgruppe aus etwa 500 Frauen entstand kurz nach der Gründung.',
      'Unsere Shopify-Seite haben wir während dieser Zeit als Landingpage genutzt, um weitere Interessentinnen zu sammeln.',
      'Auf diese Weise haben wir entschieden, wie unsere Kollektion aufgebaut sein soll, welche Kleidungsstücke sie enthalten und in welchen Farben sie verfügbar sein werden.',
    ],
  },
  kkp: { url: 'https://kultur-kreativpiloten.de/titeltraeger-in/si-beau/' },
};
(async () => {
  const [out, jsonDir, ...nur] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const info = {};
  for (const [name, z] of Object.entries(ZIELE)) {
    if (nur.length && !nur.includes(name)) continue;
    const ctx = await browser.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true, locale: 'de-DE',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    const page = await ctx.newPage();
    const r = await page.goto(z.url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(6000);
    for (const t of ['Alle akzeptieren', 'Akzeptieren', 'Alle Cookies akzeptieren', 'Einverstanden', 'Zustimmen', 'Accept', 'Accept all', 'OK', 'Nur essenzielle Cookies akzeptieren']) {
      const b = page.getByRole('button', { name: t, exact: true });
      if (await b.count()) { try { await b.first().click({ timeout: 2000 }); console.log(name, 'Cookie:', t); await page.waitForTimeout(2000); break; } catch (e) {} }
    }
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let yy = 0; yy < h; yy += 500) { await page.evaluate((v) => window.scrollTo(0, v), yy); await page.waitForTimeout(250); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1500);
    const daten = await page.evaluate(({ marken }) => {
      for (const el of document.querySelectorAll('body *')) {
        const st = getComputedStyle(el);
        if (st.position === 'fixed' || st.position === 'sticky') {
          const rr = el.getBoundingClientRect();
          if (rr.top > 60 || rr.height > 200 || /cookie|consent|newsletter|popup|modal|chat|onetrust|dialog|eye-able/i.test(el.id + ' ' + el.className)) el.style.display = 'none';
          else { el.style.position = 'absolute'; el.style.left = '0'; el.style.right = '0'; el.style.width = '100%'; el.style.top = rr.top + 'px'; }
        }
      }
      document.documentElement.style.overflow = 'visible'; document.body.style.overflow = 'visible';
      const pos = {};
      for (const m of marken || []) {
        for (const el of document.querySelectorAll('p, li, div, span, time, h1, h2, h3')) {
          if (el.querySelector('p, li, div')) continue;
          const knoten = []; let text = '';
          const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          while (w.nextNode()) { knoten.push([w.currentNode, text.length]); text += w.currentNode.textContent; }
          const i = text.replace(/ /g, ' ').indexOf(m);
          if (i < 0) continue;
          const ende = i + m.length; let box = null;
          for (const [n, off] of knoten) {
            const a = Math.max(i, off), b = Math.min(ende, off + n.textContent.length);
            if (a >= b) continue;
            const rg = document.createRange(); rg.setStart(n, a - off); rg.setEnd(n, b - off);
            const mk = document.createElement('mark');
            mk.style.cssText = 'background:#7CF0C4;color:#0B0C0E;border-radius:4px;padding:0 2px;box-decoration-break:clone;-webkit-box-decoration-break:clone';
            rg.surroundContents(mk);
            const rr = mk.getBoundingClientRect();
            box = box ? [Math.min(box[0], rr.top + scrollY), Math.max(box[1], rr.bottom + scrollY)] : [rr.top + scrollY, rr.bottom + scrollY];
          }
          pos[m.slice(0, 40)] = box; break;
        }
      }
      const kopf = [...document.querySelectorAll('h1, h2, h3, img, time, p')].map((e) => {
        const rr = e.getBoundingClientRect();
        return rr.width > 40 && rr.height > 14 ? [Math.round(rr.top + scrollY), Math.round(rr.height), e.tagName, (e.innerText || e.alt || '').trim().slice(0, 80)] : null;
      }).filter(Boolean);
      return { pos, kopf, hoehe: document.body.scrollHeight, titel: document.title };
    }, { marken: z.marken });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
    info[name] = { url: page.url(), status: r && r.status(), ...daten };
    console.log(name, page.url(), r && r.status(), daten.titel, daten.hoehe, JSON.stringify(daten.pos));
    await ctx.close();
  }
  const p = `${jsonDir}/aufnahme.json`;
  const alt = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p)) : { ziele: {} };
  alt.datum = new Date().toISOString(); alt.viewport = '432x768 @2.5, iPhone-UA'; Object.assign(alt.ziele, info);
  fs.writeFileSync(p, JSON.stringify(alt, null, 1));
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
