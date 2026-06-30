"use client";

import { useState } from "react";
import { moodPacks } from "@/lib/moodPacks";
import { PRICING } from "@/lib/cost";
import type { Quality } from "@/lib/cost";
import { UploadZone } from "@/components/UploadZone";
import { PhotoViewer, type Photo, type SplatState } from "@/components/PhotoViewer";

export default function Home() {
  const [packId, setPackId] = useState<string>(moodPacks[0].id);
  const [quality, setQuality] = useState<Quality>("preview");
  const [note, setNote] = useState<string>("");
  const [photos, setPhotos] = useState<Photo[]>([]);

  const anyBusy = photos.some((p) => p.status === "generating");

  function addFiles(files: File[]) {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    const additions: Photo[] = imgs.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: "idle",
      result: null,
      error: null,
      splatBefore: { status: "idle", plyUrl: null, error: null },
      splatAfter: { status: "idle", plyUrl: null, error: null },
    }));
    setPhotos((prev) => [...prev, ...additions]);
  }

  function updatePhoto(id: string, patch: Partial<Photo>) {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const p = prev.find((x) => x.id === id);
      if (p) URL.revokeObjectURL(p.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  }

  async function stagePhoto(photo: Photo) {
    updatePhoto(photo.id, { status: "generating", error: null });
    try {
      const fd = new FormData();
      fd.append("image", photo.file);
      fd.append("moodPackId", packId);
      fd.append("note", note);
      fd.append("quality", quality);
      const res = await fetch("/api/render", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Render zlyhal.");
      updatePhoto(photo.id, { status: "done", result: data });
    } catch (err) {
      updatePhoto(photo.id, {
        status: "error",
        error: err instanceof Error ? err.message : "Render zlyhal.",
      });
    }
  }

  async function stageAll() {
    for (const p of photos) {
      if (p.status !== "done" && p.status !== "generating") {
        await stagePhoto(p);
      }
    }
  }

  // Generovanie 3D splatu z pôvodnej ("before") alebo zariadenej ("after") fotky.
  async function makeSplat(photo: Photo, source: "before" | "after") {
    const set = (s: SplatState) =>
      updatePhoto(photo.id, source === "before" ? { splatBefore: s } : { splatAfter: s });

    set({ status: "generating", plyUrl: null, error: null });
    try {
      const fd = new FormData();
      if (source === "after" && photo.result) {
        fd.append("imageUrl", photo.result.outputUrl);
      } else {
        fd.append("image", photo.file);
      }
      const res = await fetch("/api/splat", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generovanie 3D zlyhalo.");
      set({ status: "done", plyUrl: data.plyUrl, error: null });
    } catch (err) {
      set({
        status: "error",
        plyUrl: null,
        error: err instanceof Error ? err.message : "Generovanie 3D zlyhalo.",
      });
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar__inner">
          <span className="brand">Mood Pack</span>
          <span className="brand__tag muted">
            Virtuálne zariadenie priestorov pre realitky a developerov
          </span>
        </div>
      </header>

      <main className="app-grid">
        {/* ĽAVÝ PANEL — ovládanie */}
        <aside className="panel controls">
          <div className="panel__section">
            <h3 className="panel__title">1 · Nahraj fotky bytu</h3>
            <UploadZone onAdd={addFiles} />
            {photos.length > 0 && (
              <p className="muted small" style={{ marginTop: "var(--space-sm)" }}>
                Nahraných fotiek: {photos.length}
              </p>
            )}
          </div>

          <div className="panel__section">
            <h3 className="panel__title">2 · Štýl (jeden pre celý byt)</h3>
            <p className="muted small">Typ miestnosti rozpozná AI sama z fotky.</p>
            <div className="packs">
              {moodPacks.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  title={p.description}
                  onClick={() => setPackId(p.id)}
                  className={p.id === packId ? "pack pack--active" : "pack"}
                >
                  <div className="pack__swatches">
                    {p.colors.map((c) => (
                      <span key={c} className="swatch" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="pack__name">{p.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel__section">
            <h3 className="panel__title">3 · Kvalita a poznámka</h3>
            <div className="pills">
              <button
                type="button"
                className={quality === "preview" ? "pill pill--active" : "pill"}
                onClick={() => setQuality("preview")}
              >
                Náhľad · ~{PRICING.preview.costCents} c
              </button>
              <button
                type="button"
                className={quality === "final" ? "pill pill--active" : "pill"}
                onClick={() => setQuality("final")}
              >
                Finál (HD) · ~{PRICING.final.costCents} c
              </button>
            </div>
            <label className="field" style={{ marginTop: "var(--space-md)", marginBottom: 0 }}>
              <span className="field__label">Voliteľná poznámka (pre všetky fotky)</span>
              <textarea
                className="textarea"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="viac zelene a kníh"
              />
            </label>
          </div>

          <button
            type="button"
            className="button button--primary button--block"
            onClick={stageAll}
            disabled={photos.length === 0 || anyBusy}
          >
            {anyBusy ? "Pracujem…" : "Zariadiť všetky fotky"}
          </button>
        </aside>

        {/* PRAVÝ PANEL — výsledky */}
        <section className="panel results">
          {photos.length === 0 ? (
            <div className="results__empty">
              <p className="muted">
                Tu sa zobrazia tvoje fotky „pred → po".
                <br />
                Najprv nahraj fotky bytu.
              </p>
            </div>
          ) : (
            <PhotoViewer
              photos={photos}
              onStage={stagePhoto}
              onRemove={removePhoto}
              onSplat={makeSplat}
            />
          )}
        </section>
      </main>
    </>
  );
}
