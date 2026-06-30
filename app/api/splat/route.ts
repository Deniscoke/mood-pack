import { NextResponse } from "next/server";
import { imageProvider } from "@/lib/imageProvider";
import { generateSplat } from "@/lib/splat";

export const runtime = "nodejs";
export const maxDuration = 300;

// Príjme buď `imageUrl` (už hostovaná fotka, napr. zariadená "Po"),
// alebo súbor `image` (pôvodná fotka "Pred", ktorú najprv nahráme na fal storage).
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("image");
    let imageUrl = String(form.get("imageUrl") ?? "");

    if (!imageUrl && file instanceof Blob) {
      imageUrl = await imageProvider.upload(file);
    }
    if (!imageUrl) {
      return NextResponse.json({ error: "Chýba obrázok." }, { status: 400 });
    }

    const result = await generateSplat(imageUrl);
    return NextResponse.json({
      plyUrl: result.plyUrl,
      numGaussians: result.numGaussians,
      costCents: 5,
    });
  } catch (err) {
    const e = err as { body?: { detail?: string }; message?: string };
    const text = (e?.body?.detail ?? e?.message ?? "").toString();
    console.error("Splat error:", text || err);

    const friendly = /balance|exhausted|locked/i.test(text)
      ? "Účet fal.ai nemá kredit. Dobi ho na fal.ai/dashboard/billing."
      : "Generovanie 3D zlyhalo. Skús to znova o chvíľu.";
    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}
