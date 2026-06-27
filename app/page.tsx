"use client";

import { useState } from "react";
import { moodPacks } from "@/lib/moodPacks";
import { PRICING } from "@/lib/cost";
import type { Quality } from "@/lib/cost";
import { UploadZone } from "@/components/UploadZone";
import { PhotoCard, type Photo } from "@/components/PhotoCard";

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
    // Sekvenčne — kvôli kontrole nákladov a záťaže.
    for (const p of photos) {
      if (p.status !== "done" && p.status !== "generating") {
        await stagePhoto(p);
      }
    }
  }

  return (
    <main className="container">
      <header style={{ marginBottom: "var(--space-xl)" }}>
        <h1>Mood Pack</h1>
        <p className="muted">
          Virtuálne zariadenie prázdnych priestorov pre realitky a developerov.
        </p>
      </header>

      <section style={{ marginBottom: "var(--space-xl)" }}>
        <h3 style={{ marginBottom: "var(--space-sm)" }}>1 · Nahraj fotky bytu</h3>
        <UploadZone onAdd={addFiles} />
        {photos.length > 0 && (
          <p className="muted" style={{ fontSize: "var(--font-size-sm)", marginTop: "var(--space-sm)" }}>
            Nahraných fotiek: {photos.length}
          </p>
        )}
      </section>

      <section style={{ marginBottom: "var(--space-xl)" }}>
        <h3 style={{ marginBottom: "var(--space-sm)" }}>2 · Spoločný štýl pre celý byt</h3>
        <p className="muted" style={{ fontSize: "var(--font-size-sm)", marginBottom: "var(--space-sm)" }}>
          Jeden mood pack pre všetky fotky — aby byt pôsobil jednotne. Typ miestnosti
          rozpozná AI sama z fotky.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "var(--space-sm)",
          }}
        >
          {moodPacks.map((p) => {
            const active = p.id === packId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPackId(p.id)}
                className="card"
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                  boxShadow: active ? "0 0 0 3px var(--color-primary-subtle)" : "none",
                }}
              >
                <div style={{ display: "flex", gap: "4px", marginBottom: "var(--space-sm)" }}>
                  {p.colors.map((c) => (
                    <span key={c} className="swatch" style={{ background: c }} />
                  ))}
                </div>
                <div style={{ fontWeight: 500 }}>{p.name}</div>
                <div className="muted" style={{ fontSize: "var(--font-size-sm)" }}>
                  {p.description}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-xl)", maxWidth: "520px" }}>
        <h3 style={{ marginBottom: "var(--space-sm)" }}>3 · Kvalita a poznámka</h3>
        <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
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
        <label className="field">
          <span className="field__label">Voliteľná poznámka (platí pre všetky fotky)</span>
          <textarea
            className="textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="viac zelene a kníh"
          />
        </label>
      </section>

      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-sm)",
            marginBottom: "var(--space-md)",
          }}
        >
          <h3 style={{ margin: 0 }}>4 · Zariadenie</h3>
          {photos.length > 0 && (
            <button
              type="button"
              className="button button--primary"
              onClick={stageAll}
              disabled={anyBusy}
            >
              {anyBusy ? "Pracujem…" : "Zariadiť všetky fotky"}
            </button>
          )}
        </div>

        {photos.length === 0 ? (
          <p className="muted">Najprv nahraj fotky v kroku 1.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "var(--space-md)",
            }}
          >
            {photos.map((p) => (
              <PhotoCard
                key={p.id}
                photo={p}
                onStage={stagePhoto}
                onRemove={removePhoto}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
