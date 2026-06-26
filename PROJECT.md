# PROJECT — Mood Pack (virtual staging pre realitky)

## Čo staviame (jednou vetou)
Webový nástroj, kde realitka nahrá fotku prázdnej/holej miestnosti, vyberie štýl
("mood pack"), a dostane fotorealistický obrázok **tej istej miestnosti, ale
zariadenej** — výstup ako dvojica **pred / po**.

## Pre koho (priorita)
1. **Realitné kancelárie** (primárny zákazník) — zariadené fotky = drahší a
   žiadanejší inzerát.
2. **Developeri** — predaj holostavby "z papiera", konzistencia naprieč projektom.
3. Architekti / interiéroví dizajnéri (sekundárny) — rýchly mood-board.

## Kľúčová požiadavka produktu
Zachovať **pôvodnú geometriu** miestnosti: okná, dvere, výšku stropu, perspektívu,
dispozíciu. AI iba **dopĺňa nábytok a štýl**, nemení stavbu.
> Úprimne: 100 % zachovanie geometrie sa nedá garantovať len promptom. Model
> Flux Kontext to drží výrazne lepšie než bežný img2img, ale občas treba re-roll.
> Produkt predávame ako "uveriteľné nafotenie zariadenia", nie ako záväzný návrh.

## Rozsah MVP (čo IDE do prvej verzie)
- Upload fotky + výber typu miestnosti + výber mood packu (8 štýlov).
- Lacný **náhľad** a platený **finálny HD** render.
- Výstup **pred/po**, stiahnutie / zdieľanie.
- Jeden AI provider (fal.ai Flux Kontext) za jedným rozhraním.
- Deterministické prompty (bez LLM volania).
- Limit renderov na používateľa.

## Čo zámerne NEIDE do MVP (aby sa to nerozliezlo)
- Platby (až vo fáze "platený produkt").
- Viacero AI providerov naraz.
- Automatické rozpoznanie typu miestnosti (vyberá ho užívateľ).
- Fine-tuning / vlastný model.
- Mobilná appka (stačí responzívny web).
- Tímy / viac používateľov na účet.

## Ako vyzerá úspech MVP
Reálna realitka nahrá fotku, dostane "po", a povie "toto by som dal do inzerátu".
