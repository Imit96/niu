"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Check, Trash2 } from "lucide-react";

interface LibraryImage {
  url: string;
  publicId: string;
  createdAt: string;
}

interface Props {
  existingUrls: string[];
  onAdd: (urls: string[]) => void;
  onClose: () => void;
}

export function ImageLibraryModal({ existingUrls, onAdd, onClose }: Props) {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/upload")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setImages(data.images || []);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const existingSet = new Set(existingUrls);

  const deleteImage = async (img: LibraryImage) => {
    if (!confirm("Delete this image from the library? This cannot be undone.")) return;
    setDeleting((prev) => new Set(prev).add(img.publicId));
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: img.publicId }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setImages((prev) => prev.filter((i) => i.publicId !== img.publicId));
      setSelected((prev) => { const next = new Set(prev); next.delete(img.url); return next; });
    } catch {
      alert("Failed to delete image. Please try again.");
    } finally {
      setDeleting((prev) => { const next = new Set(prev); next.delete(img.publicId); return next; });
    }
  };

  const toggle = (url: string) => {
    const next = new Set(selected);
    if (next.has(url)) next.delete(url);
    else next.add(url);
    setSelected(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="bg-cream w-full max-w-3xl max-h-[80vh] flex flex-col border border-earth/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-earth/10">
          <h2 className="font-serif text-earth text-lg uppercase tracking-widest">Image Library</h2>
          <button type="button" onClick={onClose} className="text-earth/50 hover:text-earth transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-40 gap-2 text-earth/60">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading library...</span>
            </div>
          )}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {!loading && !error && images.length === 0 && (
            <p className="text-earth/50 text-sm text-center py-12">No images found. Upload some images first.</p>
          )}
          {!loading && !error && images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img) => {
                const alreadyAdded = existingSet.has(img.url);
                const isSelected = selected.has(img.url);
                return (
                  <div key={img.publicId} className="relative group aspect-square">
                    <button
                      type="button"
                      onClick={() => !alreadyAdded && toggle(img.url)}
                      disabled={alreadyAdded || deleting.has(img.publicId)}
                      className={`relative w-full h-full overflow-hidden border-2 transition-all ${
                        alreadyAdded
                          ? "border-earth/20 opacity-50 cursor-not-allowed"
                          : isSelected
                          ? "border-bronze ring-1 ring-bronze"
                          : "border-earth/20 hover:border-bronze/60 cursor-pointer"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-bronze/30 flex items-center justify-center">
                          <div className="bg-bronze rounded-full p-1">
                            <Check className="w-3 h-3 text-cream" />
                          </div>
                        </div>
                      )}
                      {alreadyAdded && (
                        <div className="absolute bottom-0 left-0 right-0 bg-earth/70 py-0.5 text-[8px] text-cream text-center uppercase tracking-widest">
                          Added
                        </div>
                      )}
                      {deleting.has(img.publicId) && (
                        <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-cream animate-spin" />
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteImage(img)}
                      disabled={deleting.has(img.publicId)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                      title="Delete from library"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-earth/10">
          <p className="text-[10px] text-earth/60 uppercase tracking-widest">
            {selected.size > 0 ? `${selected.size} selected` : "Click images to select"}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-earth/20 text-earth hover:border-earth/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onAdd(Array.from(selected))}
              disabled={selected.size === 0}
              className="px-4 py-2 text-sm bg-earth text-cream hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add {selected.size > 0 ? `(${selected.size})` : "Selected"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
