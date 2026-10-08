"""Ganze Frames wie in der Timeline (src/lib/schnitt.ts): Math.round(s * fps).

Pythons round() rundet eine exakte Hälfte zur geraden Zahl (106.5 → 106), JavaScripts Math.round immer nach oben
(106.5 → 107). Die Werkzeuge rechnen Schnittstücke deshalb hiermit, damit ihre Frames die des Renderers sind.
Außerhalb exakter Hälften ändert sich nichts.
"""
import math


def js_round(x: float) -> int:
    """Math.round: die nächste ganze Zahl, eine Hälfte nach oben (auch bei negativen Zahlen: -2.5 → -2)."""
    f = math.floor(x)
    return int(f) + (1 if x - f >= 0.5 else 0)


def frame(s: float, fps: float) -> int:
    """Sekunden → Frame, genau wie createCut: Math.round(s * fps) auf demselben double"""
    return js_round(s * fps)
