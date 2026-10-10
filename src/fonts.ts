import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Geist / Geist Mono liegen lokal in public/fonts (Lizenz: public/fonts/GEIST-LICENSE.txt, SIL OFL 1.1),
// damit ein Render nie von einem Font-CDN abhängt.
loadFont({ family: "Geist", url: staticFile("fonts/Geist-Variable.woff2"), weight: "100 900" });
loadFont({ family: "Geist Mono", url: staticFile("fonts/GeistMono-Variable.woff2"), weight: "100 900" });

// Schriften der Designs NACHT, MAGAZIN und STICKER (src/lib/design.tsx), ebenso lokal
// (Lizenz: public/fonts/DESIGN-FONTS-LICENSE.txt, SIL OFL 1.1)
loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" });
loadFont({ family: "Instrument Serif", url: staticFile("fonts/InstrumentSerif-Regular.woff2"), weight: "400" });
loadFont({ family: "Instrument Serif", url: staticFile("fonts/InstrumentSerif-Italic.woff2"), weight: "400", style: "italic" });
loadFont({ family: "Bricolage Grotesque", url: staticFile("fonts/BricolageGrotesque-Variable.woff2"), weight: "200 800" });
loadFont({ family: "Space Grotesk", url: staticFile("fonts/SpaceGrotesk-Variable.woff2"), weight: "300 700" });
