"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      onChange([...value, ...data.urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  const move = (from: number, to: number) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Image previews */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, i) => (
            <div
              key={url}
              className="relative group w-24 h-24 border border-earth/20 bg-stone overflow-hidden flex-shrink-0"
            >
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />

              {/* Remove overlay */}
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-cream opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Main badge */}
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-[9px] bg-earth text-cream text-center py-0.5 uppercase tracking-widest">
                  Main
                </span>
              )}

              {/* Reorder arrows */}
              {value.length > 1 && (
                <div className="absolute top-1 left-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      className="bg-black/60 text-cream text-[10px] px-1 leading-none py-0.5"
                      aria-label="Move left"
                    >
                      ←
                    </button>
                  )}
                  {i < value.length - 1 && (
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      className="bg-black/60 text-cream text-[10px] px-1 leading-none py-0.5"
                      aria-label="Move right"
                    >
                      →
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload trigger */}
      <div>
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
          className="flex items-center gap-2 border border-earth/20 bg-sand px-4 py-3 text-sm text-earth hover:border-earth/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
        <p className="text-[10px] text-earth/60 mt-2">
          Select one or more images. First image is the main display image. Use arrows to reorder. Max 10 MB per file.
        </p>
      </div>
    </div>
  );
}
