"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, Images, Link as LinkIcon, ChevronDown, ChevronUp } from "lucide-react";
import { CropPicker } from "./CropPicker";
import { ImageLibraryModal } from "./ImageLibraryModal";
import { parseImageTransform } from "@/lib/image-transform";

export interface ImageEntry {
  url: string;
  position: string;
}

interface Props {
  entries: ImageEntry[];
  onChange: (entries: ImageEntry[]) => void;
}

export function ImageUploaderWithFocalPoints({ entries, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      const newEntries: ImageEntry[] = (data.urls as string[]).map((url) => ({
        url,
        position: JSON.stringify({ s: 1, x: 0, y: 0 }),
      }));
      const newIndex = entries.length + newEntries.length - 1;
      onChange([...entries, ...newEntries]);
      setExpandedIndex(newIndex); // auto-open crop for newly uploaded image
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (i: number) => {
    onChange(entries.filter((_, idx) => idx !== i));
    if (expandedIndex === i) setExpandedIndex(null);
  };

  const move = (from: number, to: number) => {
    const next = [...entries];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const updatePosition = (i: number, position: string) => {
    const next = [...entries];
    next[i] = { ...next[i], position };
    onChange(next);
  };

  const addByUrl = () => {
    const u = urlDraft.trim();
    if (!u.startsWith("http") && !u.startsWith("/")) return;
    if (entries.some((e) => e.url === u)) { setUrlDraft(""); return; }
    const newIndex = entries.length;
    onChange([...entries, { url: u, position: JSON.stringify({ s: 1, x: 0, y: 0 }) }]);
    setUrlDraft("");
    setExpandedIndex(newIndex); // auto-open crop for newly added URL
  };

  const addFromLibrary = (urls: string[]) => {
    const existing = new Set(entries.map((e) => e.url));
    const newOnes = urls
      .filter((u) => !existing.has(u))
      .map((url) => ({ url, position: JSON.stringify({ s: 1, x: 0, y: 0 }) }));
    const newIndex = entries.length + newOnes.length - 1;
    onChange([...entries, ...newOnes]);
    setLibraryOpen(false);
    if (newOnes.length > 0) setExpandedIndex(newIndex);
  };

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => {
        const t = parseImageTransform(entry.position);
        const isExpanded = expandedIndex === i;
        return (
          <div key={entry.url} className="border border-earth/20 bg-sand/50 overflow-hidden">
            {/* Compact header — always visible */}
            <div className="flex items-center gap-3 p-3">
              {/* Crop thumbnail preview */}
              <div className="relative w-12 h-[60px] bg-stone border border-earth/20 overflow-hidden shrink-0">
                <div
                  style={{
                    position: "absolute",
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    width: `${t.scale * 100}%`,
                    height: `${t.scale * 100}%`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={entry.url} alt="" className="w-full h-full object-cover" draggable={false} />
                </div>
                {i === 0 && (
                  <span className="absolute bottom-0 inset-x-0 text-[7px] bg-earth text-cream text-center uppercase tracking-widest leading-tight py-0.5">
                    Main
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-earth/60">
                  Image {i + 1}{i === 0 ? " — Main" : ""}
                </p>
                <p className="text-[9px] text-earth/40 font-mono truncate">
                  {Math.round(t.scale * 100)}% zoom{t.scale > 1 ? ` · offset ${Math.round(Math.abs(t.x))}% ${Math.round(Math.abs(t.y))}%` : ""}
                </p>
              </div>

              {/* Reorder (compact) */}
              {entries.length > 1 && (
                <div className="flex gap-1 shrink-0">
                  {i > 0 && (
                    <button type="button" onClick={() => move(i, i - 1)}
                      className="text-[9px] text-earth/50 hover:text-earth px-1.5 py-1 border border-earth/20 hover:border-earth/40 transition-colors uppercase tracking-widest"
                      title="Move up">↑</button>
                  )}
                  {i < entries.length - 1 && (
                    <button type="button" onClick={() => move(i, i + 1)}
                      className="text-[9px] text-earth/50 hover:text-earth px-1.5 py-1 border border-earth/20 hover:border-earth/40 transition-colors uppercase tracking-widest"
                      title="Move down">↓</button>
                  )}
                </div>
              )}

              {/* Edit crop toggle */}
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="flex items-center gap-1 text-[10px] text-earth/60 hover:text-earth uppercase tracking-widest font-semibold border border-earth/20 px-2 py-1 hover:border-earth/40 transition-colors shrink-0"
              >
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {isExpanded ? "Close" : "Crop"}
              </button>

              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-500/60 hover:text-red-600 shrink-0"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Expandable crop picker */}
            {isExpanded && (
              <div className="border-t border-earth/10 p-3 pt-2 bg-cream/30">
                <CropPicker
                  url={entry.url}
                  position={entry.position}
                  onChange={(pos) => updatePosition(i, pos)}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 border border-earth/20 bg-sand px-4 py-2.5 text-sm text-earth hover:border-earth/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Upload New"}
        </button>
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="flex items-center gap-2 border border-earth/20 bg-sand px-4 py-2.5 text-sm text-earth hover:border-earth/60 transition-colors"
        >
          <Images className="w-4 h-4" />
          Browse Library
        </button>
      </div>

      {/* URL input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-earth/40 pointer-events-none" />
          <input
            type="text"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addByUrl(); } }}
            placeholder="Or paste image URL directly..."
            className="w-full h-10 pl-9 pr-3 border border-earth/20 bg-cream text-earth text-sm focus:outline-none focus:ring-2 focus:ring-earth/40"
          />
        </div>
        <button
          type="button"
          onClick={addByUrl}
          disabled={!urlDraft.trim().startsWith("http")}
          className="h-10 px-4 border border-earth/20 bg-sand text-xs text-earth hover:border-earth/60 transition-colors disabled:opacity-40 shrink-0"
        >
          Add URL
        </button>
      </div>

      {error && <p className="text-red-600 text-xs">{error}</p>}
      <p className="text-[10px] text-earth/60">
        First image is the main display image. Click "Crop" to set zoom and position — what you see is what displays on the site. Max 10 MB per file.
      </p>

      {libraryOpen && (
        <ImageLibraryModal
          existingUrls={entries.map((e) => e.url)}
          onAdd={addFromLibrary}
          onClose={() => setLibraryOpen(false)}
        />
      )}
    </div>
  );
}
