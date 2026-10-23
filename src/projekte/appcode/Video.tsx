/**
 * Format HERO (stil-hero), heller Karten-Look ab 2026-10-22/23 (karten-hell.md): "P01 · App gelöscht – Code bleibt?"
 * (Briefing im Kalender, Veröffentlichung So 25.10.2026 19:00). Faktencheck: "Manche Apps hinterlassen Theme-Code; nicht alle."
 * Loop: das Video endet auf "Denn" (aus demselben Satz wie der Anfang) und beginnt mit "nur weil du deine Shopify App löscht".
 * Bild: Augen bei ~900-925 (scale 1.3), sanfte Farbe (STIL.gradeSanft), ruhiges Zoom-in, Untertitel unter dem Kopf (y 1400).
 * Oben: Hook-Titel (nacht-gruen), danach weiße HyperFrames-Karten (hyperframes/appcode-skizzen) und ein B-Roll-Ausschnitt
 * aus dem älteren Video "Zu viele Shopify-Apps" (out/final/ShopifyApps.mp4, stumm).
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "AppCode", durationInFrames: C.DURATION, fps: C.FPS };

const BILD = { scale: 1.5, hoch: 530, x: 75 };
const HOOK_ENDE = C.WE("ist");

const BETONT = ["shopify", "app", "weg", "apps", "theme-code", "automatisch", "kontrolliere", "deinstallation", "code-schnipsel", "theme-kopie", "absicherung", "jemanden", "wahllos"];
const FARBIG = ["weg", "automatisch", "absicherung", "wahllos"];

/** Sekunden im Video, an denen die Karten erscheinen (wie in hyperframes/appcode-skizzen/index.html) */
const KARTEN = [4.55, 6.95, 13.05, 16.6, 20.75, 24.5, 28.3, 31.75];
/** B-Roll aus dem älteren Video "Zu viele Shopify-Apps": von/bis in Sekunden im Video */
const BROLL = { von: 9.8, bis: 11.55 };

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "ruhig.mp3" }) => {
  const fr = useCurrentFrame();
  const s = fr / C.FPS;
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const zoom = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
  // B-Roll-Karte: rein 0,45 s (y 28 -> 0), raus 0,25 s
  const rein = interpolate(s, [BROLL.von, BROLL.von + 0.45], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
  const raus = interpolate(s, [BROLL.bis - 0.25, BROLL.bis], [1, 0], clamp);
  const o = Math.min(rein, raus);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 740px" }}>
        <Takes
          C={C}
          voice={voice}
          transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
          transformOrigin="50% 0%"
          grade={STIL.gradeSanft}
        />
      </AbsoluteFill>

      {/* Hook im Titel-Stil nacht-gruen (Briefing-Cover: "Shopify-App gelöscht – wirklich weg?") */}
      <DesignRahmen design="nacht-gruen">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="SHOPIFY-APP GELÖSCHT" line2="WIRKLICH WEG?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* helle Karten aus HyperFrames (transparentes WebM) */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/appcode/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>

      {/* B-Roll aus dem älteren Video, stumm, in heller Karte über dem Kopf */}
      {o > 0 && (
        <>
          <div style={{ position: "absolute", left: 110, top: 300, width: 860, height: 300, borderRadius: 36, overflow: "hidden", background: "#fff", boxShadow: "0 24px 60px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.08)", opacity: o, transform: `translateY(${(1 - o) * 28}px)` }}>
            <Sequence from={Math.round(BROLL.von * C.FPS)} layout="none">
              <OffthreadVideo src={staticFile("broll/appcode/shopifyapps-clip.mp4")} muted style={{ width: 860, height: 300 }} />
            </Sequence>
          </div>
          <div style={{ position: "absolute", left: 110, top: 616, opacity: o, fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 30, color: "#0B0C0E", background: "rgba(255,255,255,0.96)", borderRadius: 999, padding: "8px 24px" }}>
            Aus meinem Video über zu viele Shopify-Apps
          </div>
        </>
      )}

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} y={1400} farbe="#00E090" />}

      {sfx && (
        <>
          {KARTEN.map((k) => (
            <Sfx key={k} file="whoosh.mp3" at={k * C.FPS} volume={STIL.sfx * 0.7} />
          ))}
          <Sfx file="wusch-gross.mp3" at={BROLL.von * C.FPS} volume={STIL.sfx * 0.85} />
        </>
      )}
      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
