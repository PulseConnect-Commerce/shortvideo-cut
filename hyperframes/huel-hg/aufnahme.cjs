/* Nimmt die Seiten für M08 · Huel auf (Vorlage hyperframes/ooia-hg/aufnahme.cjs; de.huel.com über das Cookie huel_locale=de-DE, sonst leitet
   die Seite nach Standort auf die US-Seite um; die Seite lädt sich nach dem ersten Aufruf einmal neu) (Playwright/Chromium, ohne Login, Handy-Ansicht 432 css-px, 2,5-fach = 1080 px breit):
   je Ziel ein Bild der ganzen Seite (nach /dev/shm, groß) und die css-y der Überschriften, Bilder und Markierungen in
   aufnahme.json. Cookie-Hinweis bestätigt bzw. ausgeblendet, schwebende Knöpfe und Popups (Newsletter, Chat) ausgeblendet;
   im Shopify-Beitrag die Sätze, über die er spricht, mit <mark> grün hinterlegt (karten-aufbau.md "Quelle groß"). Sonst nichts
   verändert. Die Bilder der ganzen Seiten nur nach /dev/shm (Speicher knapp).  node aufnahme.cjs <ordner-ganze-seiten> <ordner-json> [name ...] */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const ZIELE = {
  home: { url: 'https://de.huel.com/' },
  alle: { url: 'https://de.huel.com/collections/other-huel-products' },
  ueber: { url: 'https://de.huel.com/pages/ueber-uns' },
  jobs: { url: 'https://careers.huel.com/jobs' },
  teams: { url: 'https://careers.huel.com/departments' },
  orte: { url: 'https://careers.huel.com/locations' },
  laender: { url: 'https://de.huel.com/', laender: true },
  shopify: {
    url: 'https://www.shopify.com/de/case-studies/huel',
    marken: [
      'With the new Shopify Plus Admin, Huel onboards staff 9X faster',
      'An ability to onboard new staff 9x faster',
      'Functionality to quickly assign, and unassign, new staff roles across its global workforce',
      'with nine global online stores and 120 staff',
      'Huel used the new Shopify Plus Admin, which allows it to easily add and remove staff accounts, assigning them to different roles as needed across its global stores.',
    ],
  },
};
(async () => {
  const [out, jsonDir, ...nur] = process.argv.slice(2);
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const info = {};
  for (const [name, z] of Object.entries(ZIELE)) {
    if (nur.length && !nur.includes(name)) continue;
    const ctx = await browser.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true, locale: 'de-DE',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    await ctx.addCookies([{ name: 'huel_locale', value: 'de-DE', domain: '.huel.com', path: '/', secure: true, sameSite: 'None' }, { name: 'huel_user_country_iso', value: 'DE', domain: '.huel.com', path: '/', secure: true, sameSite: 'None' }]);
    const page = await ctx.newPage();
    const r = await page.goto(z.url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(8000);
    for (const t of ['Alle Cookies akzeptieren', 'Accept all cookies', 'Alle akzeptieren', 'Akzeptieren', 'Alle Cookies akzeptieren', 'Einverstanden', 'Zustimmen', 'Accept', 'Accept all', 'OK']) {
      const b = page.getByRole('button', { name: t, exact: true });
      if (await b.count()) { try { await b.first().click({ timeout: 2000 }); console.log(name, 'Cookie:', t); await page.waitForTimeout(2500); break; } catch (e) {} }
    }
    await page.waitForTimeout(800);
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let yy = 0; yy < h; yy += 500) { await page.evaluate((v) => window.scrollTo(0, v), yy); await page.waitForTimeout(250); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(2000);
    const daten = await page.evaluate(({ marken }) => {
      // schwebende Elemente (Popups, Chat, Cookie-Leisten, Bewertungs-Badges) ausblenden; die Kopfleiste oben bleibt
      for (const el of document.querySelectorAll('body *')) {
        const st = getComputedStyle(el);
        if (st.position === 'fixed' || st.position === 'sticky') {
          const rr = el.getBoundingClientRect();
          if (rr.top > 60 || rr.height > 200 || /cookie|consent|newsletter|popup|modal|klaviyo|chat|gorgias|intercom|onetrust|dialog/i.test(el.id + ' ' + el.className)) el.style.display = 'none';
          else { el.style.position = 'absolute'; el.style.left = '0'; el.style.right = '0'; el.style.width = '100%'; el.style.top = rr.top + 'px'; }
        }
      }
      for (const e of document.querySelectorAll('[class*=GeolocatorBar]')) e.style.display = 'none';
      document.documentElement.style.overflow = 'visible'; document.body.style.overflow = 'visible';
      const pos = {};
      for (const m of marken || []) {
        for (const el of document.querySelectorAll('p, li, div, span, time, h1, h2, h3')) {
          if (el.querySelector('p, li, div')) continue;
          const knoten = []; let text = '';
          const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          while (w.nextNode()) { knoten.push([w.currentNode, text.length]); text += w.currentNode.textContent; }
          const i = text.replace(/\u00a0/g, ' ').indexOf(m);
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
      const kopf = [...document.querySelectorAll('h1, h2, h3, img, video, a[href*="collections"], button')].map((e) => {
        const rr = e.getBoundingClientRect();
        return rr.width > 40 && rr.height > 20 ? [Math.round(rr.top + scrollY), Math.round(rr.height), e.tagName, (e.innerText || e.alt || '').trim().slice(0, 70)] : null;
      }).filter(Boolean);
      return { pos, kopf, hoehe: document.body.scrollHeight, titel: document.title };
    }, { marken: z.marken });
    await page.waitForTimeout(1200);
    if (z.laender) {
      // Newsletter-Fenster schließen (falls offen), dann die Länderauswahl im Seitenkopf öffnen
      for (const d of await page.locator('[role=dialog] button, [aria-modal=true] button').all()) { const t = (await d.getAttribute('aria-label')) || ''; if (/close|schlie/i.test(t)) { try { await d.click({ timeout: 1500 }); } catch (e) {} } }
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
      // Länderauswahl im Seitenfuß ("DE", aria-label "Deutschland"); oben steht bei einem Aufruf aus dem Ausland zusätzlich eine
      // Standort-Leiste (GeolocatorBar), die deutsche Besucher nicht sehen: ausgeblendet
      await page.evaluate(() => { for (const e of document.querySelectorAll('[class*=GeolocatorBar]')) e.style.display = 'none'; });
      const knopf = page.locator('button[aria-label="Deutschland"]').last();
      await knopf.scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
      await knopf.click({ timeout: 5000 }); await page.waitForTimeout(2500);
      // in der Liste "Alle Läden" bis zu Europa scrollen (Deutschland, Österreich, ...); in der Liste nichts angeklickt
      await page.evaluate(() => { const e = [...document.querySelectorAll('[role=dialog] *')].find((x) => x.childElementCount === 0 && x.textContent.trim() === 'Europe'); if (e) e.scrollIntoView({ block: 'start' }); });
      await page.waitForTimeout(1200);
      const liste = await page.evaluate(() => document.body.innerText.slice(0, 20000));
      fs.writeFileSync(`${jsonDir}/laender.txt`, liste);
      await page.screenshot({ path: `${out}/${name}.png`, fullPage: false });
    } else {
      await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
    }
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
