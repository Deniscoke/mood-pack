// Generovanie 3D Gaussian splatu z fotky cez fal.ai TripoSplat.
// Vstup: verejná URL obrázka. Výstup: URL .ply súboru (splat / point cloud).
// Cena ~0,05 $ za generovanie (flat). FAL_KEY z prostredia — nikdy nie v kóde.

import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

export interface SplatResult {
  plyUrl: string;
  numGaussians: number;
}

export async function generateSplat(
  imageUrl: string,
  numGaussians = 262144,
): Promise<SplatResult> {
  const result = await fal.subscribe("tripo3d/triposplat", {
    input: {
      image_url: imageUrl,
      num_gaussians: numGaussians,
      output_format: "ply",
    },
  });

  const data = result.data as {
    model_mesh: { url: string };
    num_gaussians: number;
  };
  return { plyUrl: data.model_mesh.url, numGaussians: data.num_gaussians };
}
