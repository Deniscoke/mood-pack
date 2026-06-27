# ARCHITECTURE — Mood Pack

> Stručne: aká technológia, štruktúra súborov a knižnice — a **prečo**.

## Technológie (a prečo)
| Vrstva | Voľba | Prečo |
|---|---|---|
| Frontend | Next.js (React) na Verceli | Štandard, beží natívne na Verceli, jeden jazyk FE+BE |
| Backend | Next.js Route Handlers (`app/api/*`) — serverless | Žiadny server 24/7, platíš za použitie |
| Databáza | Supabase (Postgres) | DB + Auth + Storage z jednej ruky, RLS bezpečnosť |
| Úložisko | Supabase Storage | Fotky vstup/výstup pri DB, podpísané URL |
| AI obrázky | **fal.ai Flux Kontext** (1 provider) | "Edit/context" model = drží geometriu, presne na staging |
| AI text | Claude — *až v bete*, voliteľne | Na voľný text užívateľa; v MVP netreba |

## Princíp providera (dôležité)
Jedno tenké rozhranie `ImageProvider` (jedna funkcia `stage()`), za ním **jediná**
implementácia (`fal.ts`). Vymeniť/pridať providera neskôr = jeden nový súbor,
žiadna prestavba. (Zámerne nestaviame 3 providerov — bol by to bloat.)

## Štruktúra projektu (plochá)
```
app/
  page.tsx                  # dashboard
  property/[id]/page.tsx     # detail nehnuteľnosti + rendery
  api/
    properties/route.ts
    render/route.ts          # spusti render
    render/[id]/route.ts     # stav + výsledok
    upload/route.ts          # podpísaná URL na upload
lib/
  supabase.ts
  moodPacks.json             # 8 packov = ZDROJ PRAVDY pre štýly
  moodPacks.ts               # typovaný loader + getMoodPack()
  promptEngine.ts            # skladá finálny image prompt (deterministicky)
  imageProvider/
    types.ts                 # rozhranie ImageProvider
    fal.ts                   # jediná implementácia (MVP)
    index.ts                 # výber providera podľa env
  cost.ts                    # ceny, limity, cache kľúč
components/                   # BeforeAfter, MoodPackPicker, RenderCard...
styles/
  tokens.css                 # jeden zdroj pravdy (farby/písma/rozostupy)
  base.css                   # vlastný malý CSS framework (BEM)
types.ts                     # spoločné TS typy
```

## Knižnice (zatiaľ)
- `@fal-ai/client` — volanie image modelu (ušetrí ručné HTTP + polling).
- `@supabase/supabase-js` — DB/Auth/Storage.
- (Ďalšie pridávame len po schválení — Pravidlo č. 3.)

## Stav implementácie
- ✅ Jadro bez nákladov: `types.ts`, `lib/moodPacks.*`, `lib/promptEngine.ts`.
- ✅ Next.js 16 + React 19 kostra, tokeny napojené (`styles/tokens.css` +
  `styles/base.css`), hlavná obrazovka `app/page.tsx`.
- ✅ Image provider za rozhraním `lib/imageProvider/` (fal.ai): `stage` = Flux
  Kontext (zariadenie), `describe` = Moondream (vízia). Ceny v `lib/cost.ts`.
- ✅ **Automatické rozpoznanie izby** `lib/roomDetect.ts` — pred zariadením
  Moondream určí typ miestnosti (kúpeľňa/kuchyňa…), užívateľ nič nevyberá.
- ✅ API `app/api/render`: upload → **rozpoznanie izby** → prompt → render. UI s
  viacnásobným nahraním, kvalitou, „pred/po" a zobrazením rozpoznaného typu.
  Render naživo overený (`npm run build` prechádza, fal.ai kredit funguje).
- ⏳ Ďalej: Supabase (DB/Storage), limit renderov, perzistencia výsledkov, cache.
