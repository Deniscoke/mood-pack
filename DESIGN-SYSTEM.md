# DESIGN-SYSTEM — Mood Pack

> Všetky vizuálne hodnoty (farby, písmo, rozostupy, zaoblenia, tiene) sú na
> **jednom mieste**: `styles/tokens.css`. Tu je vysvetlené, čo znamenajú.

## CSS prístup
**Vlastný malý framework + metóda BEM** (`styles/base.css`). Triedy pomenúvame
`blok__prvok--variant`. Tento základ rozširujeme v rovnakom systéme.

## Paleta — prémiová TMAVÁ + teplé zlato
Nálada: **tmavá elegancia, luxusný interiér + dôvera.** Tmavé pozadie dáva
fotkám vyniknúť, teplé zlato (namiesto „rockovej" červenej) pôsobí draho a seriózne.

| Token | Hodnota | Na čo |
|---|---|---|
| `--color-bg` | `#0c0c0d` | pozadie stránky (jemný teplý gradient) |
| `--color-surface` | `#161617` | karty, panely |
| `--color-surface-2` | `#202022` | hover / jemné plochy |
| `--color-border` | `#2c2c2e` | okraje, čiary |
| `--color-text` | `#f6f5f3` | hlavný text |
| `--color-text-muted` | `#a6a6aa` | popisky, vedľajší text |
| `--color-primary` | `#d4a24e` | tlačidlá, odkazy, aktívne prvky (zlato) |
| `--color-primary-hover` | `#e2b365` | zlato pri prejdení myšou |
| `--color-text-inverse` | `#14110a` | tmavý text na zlatom pozadí |
| `--color-success` | `#5cc98f` | úspech / hotovo |
| `--color-danger` | `#ff5d61` | chyba |

## Písmo
- **Inter** — telo a UI (čitateľné, neutrálne).
- **Georgia (serif)** `--font-display` — **nadpisy** (h1, h2): prémiový,
  editorial nádych.

## Škály
- **Rozostupy:** `--space-xs`(4) `sm`(8) `md`(16) `lg`(24) `xl`(40) `2xl`(64).
- **Veľkosti písma:** `sm`(14) `md`(16) `lg`(20) `xl`(28) `2xl`(42).
- **Zaoblenie:** `--radius-sm`(8) `--radius`(12) `--radius-lg`(20) `--radius-full`.
- **Tiene:** `--shadow-sm/md/lg` (hlbšie, na tmavé pozadie).

## Špeciálne prvky
- **Leštené zlaté tlačidlo** (`.button--primary`): zlatý gradient s vnútornými
  odleskmi (inšpirované referenciou, prefarbené z červenej do zlata).
