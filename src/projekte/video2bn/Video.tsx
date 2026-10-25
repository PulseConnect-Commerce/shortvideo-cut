/** Video 2 "Meine E-Commerce-Story", Fassung B ohne Hook-Titel (seine Vorgabe 2026-10-25: nicht in jedem Video eine
 * Hook als Titel; beim ehrlichen Video 2 eine der anderen Fassungen ohne). Schnitt wie video2b, Körper: ../video2/Basis.tsx */
import { createCut } from "../../lib/schnitt";
import { makeVideo } from "../video2/Basis";
import cut from "../video2b/cut.json";

const C = createCut(cut);
export const meta = { id: "Video2BOhneHook", durationInFrames: C.DURATION, fps: C.FPS };
export const Video = makeVideo(C, null);
