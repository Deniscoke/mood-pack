// Spoločné rozhranie pre AI providera. V MVP jediná implementácia (fal.ai).
// Okrem generovania (stage) zvláda aj "describe" — položí otázku k obrázku
// (vision), čo používame na automatické rozpoznanie typu miestnosti.

import type { Quality } from "../cost";

export interface StageParams {
  imageUrl: string; // verejná URL nahraného obrázka
  prompt: string;
  seed?: number; // pre opakovateľnosť / konzistenciu
  quality: Quality;
}

export interface StageResult {
  imageUrl: string; // URL výsledného (zariadeného) obrázka
  seed: number;
  costCents: number;
}

export interface ImageProvider {
  upload(file: Blob): Promise<string>;
  describe(imageUrl: string, question: string): Promise<string>;
  stage(params: StageParams): Promise<StageResult>;
}
