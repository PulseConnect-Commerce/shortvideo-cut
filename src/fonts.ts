import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Geist / Geist Mono liegen lokal in public/fonts (Lizenz: public/fonts/GEIST-LICENSE.txt, SIL OFL 1.1),
// damit ein Render nie von einem Font-CDN abhängt.
loadFont({ family: "Geist", url: staticFile("fonts/Geist-Variable.woff2"), weight: "100 900" });
loadFont({ family: "Geist Mono", url: staticFile("fonts/GeistMono-Variable.woff2"), weight: "100 900" });
