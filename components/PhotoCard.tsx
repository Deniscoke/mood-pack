"use client";

import type { CSSProperties } from "react";
import { ROOM_TYPES } from "@/lib/rooms";
import type { RoomType } from "@/types";

export type PhotoStatus = "idle" | "generating" | "done" | "error";

export interface RenderResult {
  inputUrl: string;
  outputUrl: string;
  seed: number;
  costCents: number;
}

export interface Photo {
  id: string;
  file: File;
  previewUrl: string;
  roomType: RoomType;
  status: PhotoStatus;
  result: RenderResult | null;
  error: string | null;
}

export function PhotoCard({
  photo,
  onRoomTypeChange,
  onStage,
  onRemove,
}: {
  photo: Photo;
  onRoomTypeChange: (id: string, roomType: RoomType) => void;
  onStage: (photo: Photo) => void;
  onRemove: (id: string) => void;
}) {
  const busy = photo.status === "generating";

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          gap: "var(--space-sm)",
          alignItems: "center",
          marginBottom: "var(--space-sm)",
        }}
      >
        <select
          className="select"
          value={photo.roomType}
          disabled={busy}
          onChange={(e) => onRoomTypeChange(photo.id, e.target.value as RoomType)}
          style={{ flex: 1 }}
        >
          {ROOM_TYPES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)" }}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.previewUrl} alt="Pred" style={imgStyle} />
          <p className="muted" style={capStyle}>Pred</p>
        </div>
        <div style={{ position: "relative" }}>
          {photo.status === "done" && photo.result ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.result.outputUrl} alt="Po — virtuálne zariadené" style={imgStyle} />
              <span className="badge" style={{ position: "absolute", top: 8, right: 8 }}>
                AI · virtuálne
              </span>
              <p className="muted" style={capStyle}>Po</p>
            </>
          ) : (
            <div style={placeholderStyle}>
              {busy ? "Zariaďujem…" : "Zatiaľ nezariadené"}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "var(--space-sm)" }}>
        <button
          type="button"
          className="button button--primary"
          onClick={() => onStage(photo)}
          disabled={busy}
        >
          {busy
            ? "Zariaďujem priestor…"
            : photo.status === "done"
            ? "Zariadiť znova"
            : "Zariadiť priestor"}
        </button>
      </div>

      {photo.status === "error" && photo.error && (
        <p
          style={{
            color: "var(--color-danger)",
            fontSize: "var(--font-size-sm)",
            marginTop: "var(--space-sm)",
          }}
        >
          {photo.error}
        </p>
      )}

      {photo.status === "done" && photo.result && (
        <p className="muted" style={{ fontSize: "var(--font-size-sm)", marginTop: "var(--space-sm)" }}>
          ~{photo.result.costCents} c · vizualizácia, nie záväzný návrh · virtuálne zariadené (AI)
        </p>
      )}
    </div>
  );
}

const imgStyle: CSSProperties = {
  width: "100%",
  borderRadius: "var(--radius)",
  border: "1px solid var(--color-border)",
  display: "block",
};
const capStyle: CSSProperties = {
  textAlign: "center",
  marginTop: "var(--space-xs)",
  fontSize: "var(--font-size-sm)",
};
const placeholderStyle: CSSProperties = {
  height: "100%",
  minHeight: "120px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--radius)",
  border: "1px dashed var(--color-border)",
  color: "var(--color-text-muted)",
  fontSize: "var(--font-size-sm)",
  textAlign: "center",
  padding: "var(--space-sm)",
};
