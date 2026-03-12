"use client";

/**
 * FocalPointPicker — 3×3 grid for selecting CSS object-position.
 * The selected value is passed via an <input type="hidden"> so it
 * works inside any <form> without needing onChange wiring in the parent.
 */

import { useState } from "react";

const POSITIONS = [
  { label: "Top Left",     value: "top left"     },
  { label: "Top",          value: "top"           },
  { label: "Top Right",    value: "top right"     },
  { label: "Left",         value: "left"          },
  { label: "Center",       value: "center"        },
  { label: "Right",        value: "right"         },
  { label: "Bottom Left",  value: "bottom left"   },
  { label: "Bottom",       value: "bottom"        },
  { label: "Bottom Right", value: "bottom right"  },
];

interface Props {
  name: string;           // hidden input name — matches the formData key
  defaultValue?: string;  // pre-selected position (e.g. from saved product)
  label?: string;
}

export function FocalPointPicker({ name, defaultValue = "center", label }: Props) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-[10px] font-semibold tracking-widest uppercase text-earth">{label}</p>
      )}
      <div className="grid grid-cols-3 w-24 gap-0.5" title="Click to set the focal point">
        {POSITIONS.map((pos) => (
          <button
            key={pos.value}
            type="button"
            title={pos.label}
            onClick={() => setSelected(pos.value)}
            className={`w-7 h-7 border transition-colors ${
              selected === pos.value
                ? "bg-bronze border-bronze"
                : "bg-sand border-earth/20 hover:bg-earth/10"
            }`}
            aria-label={pos.label}
            aria-pressed={selected === pos.value}
          />
        ))}
      </div>
      <p className="text-[10px] text-earth/50">Focal: {selected}</p>
      <input type="hidden" name={name} value={selected} />
    </div>
  );
}
