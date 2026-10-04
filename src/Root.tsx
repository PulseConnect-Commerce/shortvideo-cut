import type React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "./fonts";

/**
 * Jedes Projekt unter src/projekte/<projekt>/Video.tsx wird automatisch als Komposition angemeldet (exportiert
 * `meta` und `Video`). Ordner mit "_" am Anfang (die Vorlage) werden übersprungen.
 */
type Projekt = {
  meta: { id: string; durationInFrames: number };
  Video: React.FC<{ voice?: boolean; sfx?: boolean }>;
};
const ctx = require.context("./projekte", true, /^\.\/[^_/][^/]*\/Video\.tsx$/);

/** solange es noch kein Projekt gibt: ein Platzhalter mit dem nächsten Schritt */
const Leer: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: "#F4F1EA",
      color: "#14161A",
      fontFamily: "Geist, system-ui, sans-serif",
      fontSize: 56,
      fontWeight: 700,
      padding: 90,
      justifyContent: "center",
      lineHeight: 1.2,
    }}
  >
    Noch kein Projekt. Leg einen Clip in eingang/ und sag Claude: „Schneide mir dieses Video.“
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    {ctx.keys().length === 0 && (
      <Composition id="Leer" component={Leer} durationInFrames={30} fps={30} width={1080} height={1920} />
    )}
    {ctx.keys().map((k) => {
      const p = ctx(k) as Projekt;
      return (
        <Composition
          key={k}
          id={p.meta.id}
          component={p.Video}
          durationInFrames={Math.max(1, p.meta.durationInFrames)}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ voice: true, sfx: true }}
        />
      );
    })}
  </>
);
