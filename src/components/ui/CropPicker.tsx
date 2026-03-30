"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ZoomIn } from "lucide-react";
import { parseImageTransform } from "@/lib/image-transform";

interface Props {
  url: string;
  /** JSON crop string {"s":scale,"x":panX,"y":panY} or legacy CSS string */
  position: string;
  onChange: (position: string) => void;
}

export function CropPicker({ url, position, onChange }: Props) {
  const initial = parseImageTransform(position);
  const [scale, setScale] = useState(initial.scale);
  const [pan, setPan] = useState({ x: initial.x, y: initial.y });
  const [isDragging, setIsDragging] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(initial.scale);
  const panRef = useRef({ x: initial.x, y: initial.y });
  const dragRef = useRef<{ sx: number; sy: number; sPan: { x: number; y: number }; moved: boolean } | null>(null);

  const clampPan = (p: { x: number; y: number }, s: number) => ({
    x: Math.max(-(s - 1) * 100, Math.min(0, p.x)),
    y: Math.max(-(s - 1) * 100, Math.min(0, p.y)),
  });

  const emit = useCallback(
    (s: number, p: { x: number; y: number }) => {
      onChange(
        JSON.stringify({
          s: parseFloat(s.toFixed(3)),
          x: parseFloat(p.x.toFixed(2)),
          y: parseFloat(p.y.toFixed(2)),
        }),
      );
    },
    [onChange],
  );

  const applyZoom = useCallback(
    (newScale: number, newPan: { x: number; y: number }) => {
      scaleRef.current = newScale;
      panRef.current = newPan;
      setScale(newScale);
      setPan(newPan);
      emit(newScale, newPan);
    },
    [emit],
  );

  const resetZoom = useCallback(() => applyZoom(1, { x: 0, y: 0 }), [applyZoom]);

  // Wheel zoom — non-passive so we can preventDefault
  useEffect(() => {
    const el = pickerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cxPct = ((e.clientX - rect.left) / rect.width) * 100;
      const cyPct = ((e.clientY - rect.top) / rect.height) * 100;
      const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      const newScale = Math.max(1, Math.min(5, scaleRef.current * factor));
      const ratio = newScale / scaleRef.current;
      applyZoom(
        newScale,
        clampPan(
          {
            x: cxPct - (cxPct - panRef.current.x) * ratio,
            y: cyPct - (cyPct - panRef.current.y) * ratio,
          },
          newScale,
        ),
      );
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, applyZoom]);

  // Document-level drag (pan when zoomed)
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d || !pickerRef.current || scaleRef.current <= 1) return;
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      if (Math.hypot(dx, dy) > 4) d.moved = true;
      if (d.moved) {
        const rect = pickerRef.current.getBoundingClientRect();
        const newPan = clampPan(
          {
            x: d.sPan.x + (dx / rect.width) * 100,
            y: d.sPan.y + (dy / rect.height) * 100,
          },
          scaleRef.current,
        );
        panRef.current = newPan;
        setPan(newPan);
        emit(scaleRef.current, newPan);
      }
    };
    const onUp = () => {
      dragRef.current = null;
      setIsDragging(false);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, emit]);

  const cursor =
    scale <= 1 ? undefined : isDragging ? "cursor-grabbing" : "cursor-grab";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-[10px] text-earth/50">
        <ZoomIn className="w-3 h-3 text-earth/30" />
        <span className="font-mono">{Math.round(scale * 100)}%</span>
        {scale > 1 && (
          <button
            type="button"
            onClick={resetZoom}
            className="text-bronze hover:text-earth transition-colors underline underline-offset-2"
          >
            Reset
          </button>
        )}
        <span className="ml-auto text-[9px] text-earth/30">
          {scale <= 1
            ? "Scroll to zoom — visible area becomes the crop"
            : "Drag to reposition · scroll to adjust zoom"}
        </span>
      </div>

      <div
        ref={pickerRef}
        className={`relative w-full overflow-hidden border border-earth/20 bg-stone select-none${cursor ? ` ${cursor}` : ""}`}
        style={{ aspectRatio: "4/5" }}
        onMouseDown={(e) => {
          if (scaleRef.current <= 1) return;
          e.preventDefault();
          dragRef.current = {
            sx: e.clientX,
            sy: e.clientY,
            sPan: panRef.current,
            moved: false,
          };
          setIsDragging(true);
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${pan.x}%`,
            top: `${pan.y}%`,
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />
        </div>

        {scale <= 1 && (
          <span className="absolute bottom-2 left-2 text-[9px] bg-black/55 text-cream px-2 py-0.5 pointer-events-none tracking-widest uppercase">
            Scroll to zoom & crop
          </span>
        )}
      </div>
    </div>
  );
}
