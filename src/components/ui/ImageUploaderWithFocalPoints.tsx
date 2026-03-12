"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, Images } from "lucide-react";
import { ImageLibraryModal } from "./ImageLibraryModal";

const POSITIONS = [
  { label: "Top Left",     value: "top left"    },
  { label: "Top",          value: "top"         },
  { label: "Top Right",    value: "top right"   },
  { label: "Left",         value: "left"        },
  { label: "Center",       value: "center"      },
  { label: "Right",        value: "right"       },
  { label: "Bottom Left",  value: "bottom left" },
  { label: "Bottom",       value: "bottom"      },
  { label: "Bottom Right", value: "bottom right"},
];

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
      const newEntries: ImageEntry[] = (data.urls as string[]).map((url) => ({ url, position: "center" }));
      onChange([...entries, ...newEntries]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (i: number) => onChange(entries.filter((_, idx) => idx !== i));

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

  const addFromLibrary = (urls: string[]) => {
    const existing = new Set(entries.map((e) => e.url));
    const newOnes = urls
      .filter((u) => !existing.has(u))
      .map((url) => ({ url, position: "center" }));
    onChange([...entries, ...newOnes]);
    setLibraryOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Image cards */}
      {entries.map((entry, i) => (
        <div key={entry.url} className="border border-earth/20 bg-sand/50 p-4 space-y-3">
          <div className="flex gap-5 items-start">
            {/* Live preview — 4:5 aspect, object-position updates in real time */}
            <div
              className="relative flex-shrink-0 overflow-hidden bg-stone border border-earth/20"
              style={{ width: 96, aspectRatio: "4/5" }}
            >
              <img
                src={entry.url}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover"
                style={{ objectPosition: entry.position }}
              />
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-[8px] bg-earth text-cream text-center py-0.5 uppercase tracking-widest">
                  Main
                </span>
              )}
            </div>

            {/* Focal point picker */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-earth">Focal Point</p>
              <div className="grid grid-cols-3 w-[72px] gap-0.5" title="Click to set where the image is cropped from">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos.value}
                    type="button"
                    title={pos.label}
                    onClick={() => updatePosition(i, pos.value)}
                    aria-label={pos.label}
                    aria-pressed={entry.position === pos.value}
                    className={`w-6 h-6 border transition-colors ${
                      entry.position === pos.value
                        ? "bg-bronze border-bronze"
                        : "bg-stone border-earth/20 hover:bg-earth/10"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-earth/50">Focal: {entry.position}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 pt-2 border-t border-earth/10">
            {i > 0 && (
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                className="text-[10px] text-earth/60 hover:text-earth uppercase tracking-widest font-semibold px-2 py-1 border border-earth/20 hover:border-earth/40 transition-colors"
              >
                ← Move Up
              </button>
            )}
            {i < entries.length - 1 && (
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                className="text-[10px] text-earth/60 hover:text-earth uppercase tracking-widest font-semibold px-2 py-1 border border-earth/20 hover:border-earth/40 transition-colors"
              >
                Move Down →
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="ml-auto flex items-center gap-1 text-[10px] text-red-500/70 hover:text-red-600 uppercase tracking-widest font-semibold"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        </div>
      ))}

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

      {error && <p className="text-red-600 text-xs">{error}</p>}
      <p className="text-[10px] text-earth/60">
        First image is the main display image. Click the grid dots to set the crop focal point. Max 10 MB per file.
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
