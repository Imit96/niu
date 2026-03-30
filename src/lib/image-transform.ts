/**
 * Shared utility for encoding/decoding the zoom+pan crop transform
 * stored in the imagePosition DB field.
 *
 * Format: JSON string {"s": scale, "x": panX%, "y": panY%}
 *   - s  : zoom scale (≥ 1)
 *   - x  : horizontal pan as % of container (-(scale-1)*100 .. 0)
 *   - y  : vertical pan as % of container   (-(scale-1)*100 .. 0)
 *
 * Legacy CSS strings ("center", "50% 30%") fall back to s=1, x=0, y=0.
 */

export interface ImageTransform {
  scale: number;
  x: number;
  y: number;
}

export function parseImageTransform(position: string | null | undefined): ImageTransform {
  if (!position) return { scale: 1, x: 0, y: 0 };
  try {
    if (position.trimStart().startsWith("{")) {
      const p = JSON.parse(position);
      return {
        scale: typeof p.s === "number" ? Math.max(1, p.s) : 1,
        x: typeof p.x === "number" ? p.x : 0,
        y: typeof p.y === "number" ? p.y : 0,
      };
    }
  } catch {
    // ignore malformed JSON
  }
  // Legacy CSS object-position value — show full image
  return { scale: 1, x: 0, y: 0 };
}

/** Returns the CSS properties to apply the transform on a storefront image wrapper div */
export function transformStyle(t: ImageTransform): React.CSSProperties {
  return {
    position: "absolute",
    left: `${t.x}%`,
    top: `${t.y}%`,
    width: `${t.scale * 100}%`,
    height: `${t.scale * 100}%`,
  };
}
