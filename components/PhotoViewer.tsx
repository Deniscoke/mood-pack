"use client";

import { useEffect, useState } from "react";

export type PhotoStatus = "idle" | "generating" | "done" | "error";

export interface RenderResult {
  inputUrl: string;
  outputUrl: string;
  seed: number;
  costCents: number;
  room?: string; // typ miestnosti rozpoznaný AI
}

export interface Photo {
  id: string;
  file: File;
  previewUrl: string;
  status: PhotoStatus;
  result: RenderResult | null;
  error: string | null;
}

const ROOM_LABELS: Record<string, string> = {
  living_room: "Obývačka",
  bedroom: "Spálňa",
  kitchen: "Kuchyňa",
  bathroom: "Kúpeľňa",
  dining_room: "Jedáleň",
  home_office: "Pracovňa",
  kids_room: "Detská izba",
  hallway: "Predsieň",
  other: "Iná miestnosť",
};

export function PhotoViewer({
  photos,
  onStage,
  onRemove,
}: {
  photos: Photo[];
  onStage: (photo: Photo) => void;
  onRemove: (id: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<"before" | "after">("before");

  const current = Math.min(index, photos.length - 1);
  const photo = photos[current];

  // Pri prepnutí fotky (alebo keď sa dorobí) nastav rozumný pohľad.
  useEffect(() => {
    setView(photo && photo.status === "done" ? "after" : "before");
  }, [photo?.id, photo?.status]);

  if (!photo) return null;

  const busy = photo.status === "generating";
  const done = photo.status === "done" && photo.result != null;
  const showAfter = view === "after" && done;
  const imgSrc = showAfter ? photo.result!.outputUrl : photo.previewUrl;

  const go = (dir: number) =>
    setIndex((i) => {
      const safe = Math.min(i, photos.length - 1);
      return Math.min(Math.max(0, safe + dir), photos.length - 1);
    });

  return (
    <div className="viewer">
      <div className="viewer__head">
        <span className="viewer__name">{photo.file.name}</span>
        <span className="viewer__count">
          {current + 1} / {photos.length}
        </span>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => onRemove(photo.id)}
          disabled={busy}
          aria-label="Odstrániť fotku"
        >
          ×
        </button>
      </div>

      <div className="viewer__stage">
        <button
          type="button"
          className="viewer__nav viewer__nav--prev"
          onClick={() => go(-1)}
          disabled={current === 0}
          aria-label="Predošlá fotka"
        >
          ‹
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="viewer__img"
          src={imgSrc}
          alt={showAfter ? "Po — virtuálne zariadené" : "Pred"}
        />
        {showAfter && <span className="badge viewer__badge">AI · virtuálne</span>}
        {busy && <div className="viewer__overlay">Zariaďujem priestor…</div>}

        <button
          type="button"
          className="viewer__nav viewer__nav--next"
          onClick={() => go(1)}
          disabled={current === photos.length - 1}
          aria-label="Ďalšia fotka"
        >
          ›
        </button>
      </div>

      <div className="seg">
        <button
          type="button"
          className={!showAfter ? "seg__btn seg__btn--active" : "seg__btn"}
          onClick={() => setView("before")}
        >
          Pred
        </button>
        <button
          type="button"
          className={showAfter ? "seg__btn seg__btn--active" : "seg__btn"}
          onClick={() => setView("after")}
          disabled={!done}
        >
          Po
        </button>
      </div>

      <div className="viewer__actions">
        <button
          type="button"
          className="button button--primary"
          onClick={() => onStage(photo)}
          disabled={busy}
        >
          {busy
            ? "Zariaďujem priestor…"
            : done
            ? "Zariadiť znova"
            : "Zariadiť priestor"}
        </button>

        {photo.status === "error" && photo.error && (
          <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>
            {photo.error}
          </p>
        )}
        {done && (
          <p className="muted" style={{ fontSize: "var(--font-size-sm)", textAlign: "center" }}>
            Rozpoznané: {ROOM_LABELS[photo.result!.room ?? "other"] ?? "Iná miestnosť"} ·
            {" "}~{photo.result!.costCents} c · vizualizácia, nie záväzný návrh
          </p>
        )}
      </div>

      <div className="viewer__thumbs">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={i === current ? "thumb thumb--active" : "thumb"}
            onClick={() => setIndex(i)}
            aria-label={`Fotka ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.result?.outputUrl ?? p.previewUrl} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
