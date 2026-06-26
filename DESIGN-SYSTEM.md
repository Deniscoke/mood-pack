# DESIGN-SYSTEM — Mood Pack

> Všetky vizuálne hodnoty (farby, písmo, rozostupy, zaoblenia, tiene) sú na
> **jednom mieste**: `styles/tokens.css`. Tu je vysvetlené, čo znamenajú.

## CSS prístup
**Vlastný malý framework + metóda BEM** (možnosť A). Postavíme si jednoduché
štýly na mieru (`styles/base.css`), triedy pomenúvame `blok__prvok--variant`
(napr. `card`, `card__title`, `button--primary`). Plná kontrola, ľahké, bez
balastu. Tento základ rozširujeme v rovnakom systéme, nie ad-hoc inde.

## Paleta (a prečo)
Nálada: **svetlá, dôveryhodná, profesionálna** — vhodná pre realitný nástroj.
Modrá nesie dôveru (proptech štandard), teplá zlatá dáva prémiový nádych.

| Token | Hodnota | Na čo |
|---|---|---|
| `--color-bg` | `#ffffff` | pozadie stránky |
| `--color-surface` | `#f7f8fa` | karty, panely |
| `--color-surface-2` | `#eef1f5` | hover / jemné plochy |
| `--color-border` | `#e2e6ec` | okraje, čiary |
| `--color-text` | `#131722` | hlavný text |
| `--color-text-muted` | `#5a6273` | popisky, vedľajší text |
| `--color-primary` | `#2b59ff` | tlačidlá, odkazy, akcia |
| `--color-primary-hover` | `#1e45d6` | tlačidlo pri prejdení myšou |
| `--color-primary-subtle` | `#eaf0ff` | svetlé modré zvýraznenie |
| `--color-accent` | `#e0a33d` | teplý akcent, "before/after" štítok |
| `--color-success` | `#1ba971` | úspech / hotovo |
| `--color-danger` | `#e5484d` | chyba |

## Písmo
**Inter** pre celé UI — výborne čitateľné, neutrálne, dôveryhodné. Jedno písmo
pre všetko (jednoduchosť, konzistencia). Prémiové párovanie s pätkovým nadpisom
zvážime až neskôr, ak bude treba.

## Škály
- **Rozostupy:** `--space-xs`(4) `sm`(8) `md`(16) `lg`(24) `xl`(40) `2xl`(64).
- **Veľkosti písma:** `sm`(14) `md`(16) `lg`(20) `xl`(28) `2xl`(40).
- **Zaoblenie:** `--radius-sm`(6) `--radius`(10) `--radius-lg`(16) `--radius-full`.
- **Tiene:** `--shadow-sm/md/lg` (jemné, premyslené).
