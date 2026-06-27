# COMPONENTS — Mood Pack

Zoznam znovupoužiteľných komponentov. **Pri novej UI sa najprv pozri sem** — ak to
už existuje, použi to (Pravidlo č. 2).

## UploadZone — `components/UploadZone.tsx`
- **Na čo:** nahranie viacerých fotiek bytu (ťahaj-a-pusti alebo klik).
- **Props:** `onAdd(files: File[])`.
- **Stavy:** normálny, pri pretiahnutí súboru (zvýraznený modrý rámček).

## PhotoCard — `components/PhotoCard.tsx`
- **Na čo:** jedna fotka miestnosti — názov súboru, náhľad, generovanie,
  výsledok „pred/po", odstránenie. **Typ miestnosti sa nevyberá** — rozpozná ho
  AI z fotky.
- **Props:** `photo`, `onStage(photo)`, `onRemove(id)`.
- **Stavy:** `idle` (nezariadené), `generating` (zariaďujem), `done` (pred/po + cena
  + doložka), `error` (chybová hláška).
- **Exportuje typy:** `Photo`, `RenderResult`, `PhotoStatus`.

## CSS triedy (BEM) — `styles/base.css`
`button` (`--primary`, `--ghost`) · `card` · `pill` (`--active`) · `field` /
`input` / `select` / `textarea` · `swatch` · `prompt-box` · `upload` (`--drag`) ·
`badge` · `muted`.
