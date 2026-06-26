"use client";

import { useRef, useState } from "react";

// Zóna na nahranie viacerých fotiek: ťahaj-a-pusti alebo klik.
export function UploadZone({ onAdd }: { onAdd: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  function handleFiles(list: FileList | null) {
    if (list) onAdd(Array.from(list));
  }

  return (
    <div
      className={drag ? "upload upload--drag" : "upload"}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>
        Pretiahni sem fotky bytu alebo klikni a vyber
      </p>
      <p style={{ margin: "var(--space-xs) 0 0", fontSize: "var(--font-size-sm)" }}>
        Môžeš nahrať viac fotiek naraz (JPG, PNG)
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
