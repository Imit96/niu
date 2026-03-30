"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Upload, X, Loader2, Link as LinkIcon, ZoomIn, Images } from "lucide-react";
import { parseImageTransform } from "@/lib/image-transform";
import { ImageLibraryModal } from "./ImageLibraryModal";

interface SingleImageUploaderProps {
  name: string;
  defaultValue?: string;
  /** When provided, zoom+pan crop controls are shown and this becomes the hidden input name */
  positionName?: string;
  defaultPosition?: string;
}

export function SingleImageUploader({
  name,
  defaultValue = "",
  positionName,
  defaultPosition = "",
}: SingleImageUploaderProps) {
  const initial = parseImageTransform(defaultPosition);
  const [url, setUrl] = useState(defaultValue);
  const [scale, setScale] = useState(initial.scale);
  const [pan, setPan] = useState({ x: initial.x, y: initial.y });
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const scaleRef = useRef(initial.scale);
  const panRef = useRef({ x: initial.x, y: initial.y });
  const dragRef = useRef<{
    sx: number; sy: number;
    sPan: { x: number; y: number };
    moved: boolean;
  } | null>(null);

  const transformValue = JSON.stringify({
    s: parseFloat(scale.toFixed(3)),
    x: parseFloat(pan.x.toFixed(2)),
    y: parseFloat(pan.y.toFixed(2)),
  });

  const clampPan = (p: { x: number; y: number }, s: number) => ({
    x: Math.max(-(s - 1) * 100, Math.min(0, p.x)),
    y: Math.max(-(s - 1) * 100, Math.min(0, p.y)),
  });

  const applyZoom = useCallback((newScale: number, newPan: { x: number; y: number }) => {
    scaleRef.current = newScale;
    panRef.current = newPan;
    setScale(newScale);
    setPan(newPan);
  }, []);

  const resetZoom = useCallback(() => applyZoom(1, { x: 0, y: 0 }), [applyZoom]);

  const selectFromLibrary = (imgUrl: string) => {
    setUrl(imgUrl);
    setError(null);
    resetZoom();
    setShowLibrary(false);
  };

  // Wheel zoom — non-passive
  useEffect(() => {
    const el = pickerRef.current;
    if (!el || !positionName) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cxPct = (e.clientX - rect.left) / rect.width * 100;
      const cyPct = (e.clientY - rect.top) / rect.height * 100;
      const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      const newScale = Math.max(1, Math.min(5, scaleRef.current * factor));
      const ratio = newScale / scaleRef.current;
      applyZoom(
        newScale,
        clampPan(
          { x: cxPct - (cxPct - panRef.current.x) * ratio, y: cyPct - (cyPct - panRef.current.y) * ratio },
          newScale,
        ),
      );
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionName, url, applyZoom]);

  // Document drag (pan)
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
          { x: d.sPan.x + dx / rect.width * 100, y: d.sPan.y + dy / rect.height * 100 },
          scaleRef.current,
        );
        panRef.current = newPan;
        setPan(newPan);
      }
    };
    const onUp = () => { dragRef.current = null; setIsDragging(false); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!positionName || scaleRef.current <= 1) return;
    e.preventDefault();
    dragRef.current = { sx: e.clientX, sy: e.clientY, sPan: panRef.current, moved: false };
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!positionName || scaleRef.current <= 1) return;
    const t = e.touches[0];
    dragRef.current = { sx: t.clientX, sy: t.clientY, sPan: panRef.current, moved: false };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!positionName || !dragRef.current || !pickerRef.current || scaleRef.current <= 1) return;
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - dragRef.current.sx;
    const dy = t.clientY - dragRef.current.sy;
    if (Math.hypot(dx, dy) > 4) dragRef.current.moved = true;
    if (dragRef.current.moved) {
      const rect = pickerRef.current.getBoundingClientRect();
      const newPan = clampPan(
        { x: dragRef.current.sPan.x + dx / rect.width * 100, y: dragRef.current.sPan.y + dy / rect.height * 100 },
        scaleRef.current,
      );
      panRef.current = newPan;
      setPan(newPan);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("files", files[0]);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json() as { urls?: string[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      const newUrl = data.urls![0];
      setUrl(newUrl);
      resetZoom();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const showPreview = url.startsWith("http") || url.startsWith("/");

  const cursor =
    !positionName ? undefined
    : scale <= 1   ? undefined
    : isDragging   ? "cursor-grabbing"
    :                "cursor-grab";

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={url} />
      {positionName && <input type="hidden" name={positionName} value={transformValue} />}

      {showPreview && (
        <div className="space-y-2">
          {positionName && (
            <div className="flex items-center gap-2 text-[10px] text-earth/50">
              <ZoomIn className="w-3 h-3 text-earth/30" />
              <span className="font-mono">{Math.round(scale * 100)}%</span>
              {scale > 1 && (
                <button type="button" onClick={resetZoom} className="text-bronze hover:text-earth transition-colors underline underline-offset-2">
                  Reset
                </button>
              )}
              <span className="ml-auto text-[9px] text-earth/30">
                {scale <= 1 ? "Scroll to zoom — visible area becomes the crop" : "Drag to reposition · scroll to adjust zoom"}
              </span>
            </div>
          )}

          <div
            ref={pickerRef}
            className={`relative w-full overflow-hidden border border-earth/20 bg-stone select-none${cursor ? ` ${cursor}` : ""}`}
            style={{ aspectRatio: "16/9" }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => { dragRef.current = null; setIsDragging(false); }}
          >
            <div style={{ position: "absolute", left: `${pan.x}%`, top: `${pan.y}%`, width: `${scale * 100}%`, height: `${scale * 100}%` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Preview" className="w-full h-full object-cover pointer-events-none select-none" onError={() => setError("Could not load image from this URL.")} draggable={false} />
            </div>

            {positionName && scale <= 1 && (
              <span className="absolute bottom-2 left-2 text-[9px] bg-black/55 text-cream px-2 py-0.5 pointer-events-none tracking-widest uppercase">
                Scroll to zoom in and crop
              </span>
            )}

            <button
              type="button"
              onClick={() => { setUrl(""); setError(null); resetZoom(); }}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1 text-cream transition-colors z-10"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Controls row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-earth/40 pointer-events-none" />
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); resetZoom(); }}
            placeholder="Paste image URL..."
            className="w-full h-10 pl-9 pr-3 border border-earth/20 bg-cream text-earth text-sm focus:outline-none focus:ring-2 focus:ring-earth/40"
          />
        </div>
        <span className="text-[10px] text-earth/40 shrink-0">or</span>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 border border-earth/20 bg-sand px-3 h-10 text-xs text-earth hover:border-earth/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          className="flex items-center gap-1.5 border border-earth/20 bg-sand px-3 h-10 text-xs text-earth hover:border-earth/60 transition-colors shrink-0"
        >
          <Images className="w-3.5 h-3.5" />
          Library
        </button>
      </div>

      {error && <p className="text-red-600 text-xs">{error}</p>}
      <p className="text-[10px] text-earth/40">
        Paste a URL, upload a new file, or pick from your library (JPEG, PNG, WebP — max 10 MB).
        {positionName && " Scroll to zoom, drag to reposition — what you see is what displays on the site."}
      </p>

      {showLibrary && (
        <ImageLibraryModal
          existingUrls={url ? [url] : []}
          onAdd={(urls) => { if (urls[0]) selectFromLibrary(urls[0]); }}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}
