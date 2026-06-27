# COMPONENTS — Mood Pack

Zoznam znovupoužiteľných komponentov. **Pri novej UI sa najprv pozri sem** — ak to
už existuje, použi to (Pravidlo č. 2).

## UploadZone — `components/UploadZone.tsx`
- **Na čo:** nahranie viacerých fotiek bytu (ťahaj-a-pusti alebo klik).
- **Props:** `onAdd(files: File[])`.
- **Stavy:** normálny, pri pretiahnutí súboru (zvýraznený modrý rámček).

## PhotoViewer — `components/PhotoViewer.tsx`
- **Na čo:** prehliadač nahraných fotiek s **listovaním** — jedna fotka veľká
  na celé okno, šípky ‹ › + počítadlo, prepínač **Pred | Po**, tlačidlo
  „Zariadiť priestor" a dole **pásik náhľadov**. Typ miestnosti rozpozná AI.
- **Props:** `photos` (pole), `onStage(photo)`, `onRemove(id)`.
- **Stavy fotky:** `idle`, `generating` (prekrytie „Zariaďujem…"), `done`
  (prepínač Po sa odomkne + cena/typ izby), `error`.
- **Exportuje typy:** `Photo`, `RenderResult`, `PhotoStatus`.

## CSS triedy (BEM) — `styles/base.css`
`button` (`--primary`, `--ghost`) · `card` · `pill` (`--active`) · `field` /
`input` / `select` / `textarea` · `swatch` · `prompt-box` · `upload` (`--drag`) ·
`badge` · `muted`.
