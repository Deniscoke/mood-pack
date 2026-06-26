"use client";

import { useState } from "react";
import { moodPacks } from "@/lib/moodPacks";
import { buildPrompt } from "@/lib/promptEngine";
import { PRICING } from "@/lib/cost";
import type { Quality } from "@/lib/cost";
import type { RoomType } from "@/types";

const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "living_room", label: "Obývačka" },
  { value: "bedroom", label: "Spálňa" },
  { value: "kitchen", label: "Kuchyňa" },
  { value: "dining_room", label: "Jedáleň" },
  { value: "home_office", label: "Pracovňa" },
  { value: "bathroom", label: "Kúpeľňa" },
  { value: "kids_room", label: "Detská izba" },
  { value: "hallway", label: "Predsieň" },
  { value: "studio", label: "Garsónka" },
];

type RenderResult = {
  inputUrl: string;
  outputUrl: string;
  seed: number;
  costCents: number;
};

export default function Home() {
  const [packId, setPackId] = useState<string>(moodPacks[0].id);
  const [roomType, setRoomType] = useState<RoomType>("living_room");
  const [note, setNote] = useState<string>("");
  const [quality, setQuality] = useState<Quality>("preview");

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<RenderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pack = moodPacks.find((p) => p.id === packId) ?? moodPacks[0];
  const { prompt } = buildPrompt({ moodPack: pack, roomType, userNote: note });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setResult(null);
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  async function handleGenerate() {
    if (!file) return;
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("moodPackId", packId);
      fd.append("roomType", roomType);
      fd.append("note", note);
      fd.append("quality", quality);
      const res = await fetch("/api/render", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Render zlyhal.");
      setResult(data as RenderResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Render zlyhal.");
    } finally {
      setGenerating(false);
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

      <section style={{ marginBottom: "var(--space-xl)", maxWidth: "520px" }}>
        <h3 style={{ marginBottom: "var(--space-sm)" }}>1 · Nahraj fotku miestnosti</h3>
        <input type="file" accept="image/*" onChange={handleFile} />
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Náhľad nahranej fotky"
            style={{
              display: "block",
              marginTop: "var(--space-md)",
              maxWidth: "100%",
              borderRadius: "var(--radius)",
              border: "1px solid var(--color-border)",
            }}
          />
        )}
      </section>

      <section style={{ marginBottom: "var(--space-xl)" }}>
        <h3 style={{ marginBottom: "var(--space-sm)" }}>2 · Vyber štýl (mood pack)</h3>
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
                  borderColor: active
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                  boxShadow: active
                    ? "0 0 0 3px var(--color-primary-subtle)"
                    : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    marginBottom: "var(--space-sm)",
                  }}
                >
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
        <h3 style={{ marginBottom: "var(--space-sm)" }}>
          3 · Typ miestnosti a poznámka
        </h3>
        <label className="field">
          <span className="field__label">Typ miestnosti</span>
          <select
            className="select"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value as RoomType)}
          >
            {ROOM_TYPES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">
            Voliteľná poznámka (napr. „viac zelene")
          </span>
          <textarea
            className="textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="viac zelene a kníh"
          />
        </label>
      </section>

      <section style={{ marginBottom: "var(--space-xl)", maxWidth: "520px" }}>
        <h3 style={{ marginBottom: "var(--space-sm)" }}>4 · Kvalita a generovanie</h3>
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
        <button
          type="button"
          className="button button--primary"
          onClick={handleGenerate}
          disabled={!file || generating}
        >
          {generating ? "Zariaďujem priestor…" : "Zariadiť priestor"}
        </button>
        {!file && (
          <p className="muted" style={{ fontSize: "var(--font-size-sm)", marginTop: "var(--space-sm)" }}>
            Najprv nahraj fotku v kroku 1.
          </p>
        )}
      </section>

      {error && (
        <section style={{ marginBottom: "var(--space-xl)" }}>
          <div
            className="prompt-box"
            style={{
              borderColor: "var(--color-danger)",
              color: "var(--color-danger)",
              background: "var(--color-bg)",
            }}
          >
            {error}
          </div>
        </section>
      )}

      {generating && (
        <section style={{ marginBottom: "var(--space-xl)" }}>
          <p className="muted">
            Zariaďujem priestor… zachovávam okná, dvere aj perspektívu. Chvíľku to trvá.
          </p>
        </section>
      )}

      {result && (
        <section style={{ marginBottom: "var(--space-xl)" }}>
          <h3 style={{ marginBottom: "var(--space-md)" }}>Výsledok — pred / po</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-md)",
            }}
          >
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.inputUrl}
                alt="Pred"
                style={{ width: "100%", borderRadius: "var(--radius)", border: "1px solid var(--color-border)" }}
              />
              <p className="muted" style={{ textAlign: "center", marginTop: "var(--space-xs)" }}>Pred</p>
            </div>
            <div style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.outputUrl}
                alt="Po — virtuálne zariadené"
                style={{ width: "100%", borderRadius: "var(--radius)", border: "1px solid var(--color-border)" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-accent)",
                  color: "#3d2a06",
                }}
              >
                AI · virtuálne
              </span>
              <p className="muted" style={{ textAlign: "center", marginTop: "var(--space-xs)" }}>Po</p>
            </div>
          </div>
          <p className="muted" style={{ fontSize: "var(--font-size-sm)", marginTop: "var(--space-md)" }}>
            Cena tohto renderu: ~{result.costCents} c · seed: {result.seed}
          </p>
          <p className="muted" style={{ fontSize: "var(--font-size-sm)", marginTop: "var(--space-xs)" }}>
            Toto je vizualizácia, nie záväzný architektonický návrh. Rozmery a proporcie
            sú orientačné. Priestor je virtuálne zariadený (AI).
          </p>
        </section>
      )}

      <section>
        <details>
          <summary className="muted" style={{ cursor: "pointer", fontSize: "var(--font-size-sm)" }}>
            Technický náhľad — prompt poslaný do AI
          </summary>
          <div className="prompt-box" style={{ marginTop: "var(--space-sm)" }}>{prompt}</div>
        </details>
      </section>
    </main>
  );
}
