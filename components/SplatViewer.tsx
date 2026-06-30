"use client";

import { useEffect, useRef } from "react";

interface SplatViewerInstance {
  addSplatScene: (url: string, opts: Record<string, unknown>) => Promise<void>;
  start: () => void;
  dispose: () => Promise<void> | void;
}

// 3D náhľad splatu cez celú obrazovku. Knižnicu načítavame dynamicky (len v
// prehliadači), takže nezaťažuje server ani prvé načítanie stránky.
export function SplatViewer({
  plyUrl,
  onClose,
}: {
  plyUrl: string;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let viewer: SplatViewerInstance | null = null;
    let disposed = false;

    (async () => {
      const GS = await import("@mkkellogg/gaussian-splats-3d");
      if (disposed || !containerRef.current) return;

      viewer = new GS.Viewer({
        rootElement: containerRef.current,
        sharedMemoryForWorkers: false, // nevyžaduje špeciálne hlavičky servera
        useBuiltInControls: true, // myš = otáčanie / zoom
        dynamicScene: false,
        cameraUp: [0, -1, 0],
        initialCameraPosition: [0, 1, 4],
        initialCameraLookAt: [0, 0, 0],
      }) as SplatViewerInstance;

      try {
        await viewer.addSplatScene(plyUrl, {
          format: GS.SceneFormat.Ply,
          showLoadingUI: true,
          splatAlphaRemovalThreshold: 5,
        });
        if (!disposed) viewer.start();
      } catch (err) {
        console.error("Splat viewer error:", err);
      }
    })();

    return () => {
      disposed = true;
      if (viewer) {
        try {
          viewer.dispose();
        } catch {
          /* ignorujeme — okno sa zatvára */
        }
      }
    };
  }, [plyUrl]);

  return (
    <div className="modal" role="dialog" aria-label="3D náhľad">
      <div className="modal__bar">
        <span className="modal__title">3D náhľad (splat)</span>
        <button
          type="button"
          className="button button--ghost"
          onClick={onClose}
          aria-label="Zavrieť 3D náhľad"
        >
          × Zavrieť
        </button>
      </div>
      <div ref={containerRef} className="modal__canvas" />
      <div className="modal__hint muted">
        Ťahaj myšou = otáčaj · koliesko = priblíženie
      </div>
    </div>
  );
}
