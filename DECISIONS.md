# DECISIONS — denník rozhodnutí

Formát: dátum — rozhodnutie — prečo (vrátane "toto sme zámerne NErobili").

## 2026-06-26
- **MVP = jeden AI provider: fal.ai Flux Kontext.** Je to "edit/context" model,
  ktorý drží pôvodnú geometriu miestnosti — presne na virtual staging.
- **NErobíme 3 providerov naraz** (fal/Stability/OpenAI). Bol by to bloat (YAGNI).
  Staviame jedno rozhranie `ImageProvider`, za ním 1 implementáciu; ďalšie neskôr.
- **OpenAI image API zámerne nepoužívame na jadro.** Prekresľuje obrázok nanovo a
  rozhádže geometriu — nevhodné na zachovanie miestnosti.
- **Prompty deterministicky zo šablóny, bez LLM volania.** Šetrí náklady aj
  latenciu; Claude pridáme až v bete na parsovanie voľného textu užívateľa.
- **Mood packy v JSON súbore, nie v DB.** Jeden zdroj pravdy, žiadna zbytočná
  tabuľka. Do DB až keď ich budú vytvárať používatelia.
- **"Zámok geometrie" je vždy rovnaká konštanta na začiatku promptu**, poznámka
  užívateľa ide na koniec — nemôže prepísať ochranu stavby.
- **MVP bez platieb a bez mobilnej appky.** Responzívny web stačí; platby až vo
  fáze "platený produkt".
- **CSS prístup A: vlastný malý framework + BEM.** Plná kontrola, ľahké, bez
  balastu knižnice. Štýly v `styles/base.css`, hodnoty v `styles/tokens.css`.
- **Paleta: svetlá, dôveryhodná, modrý akcent (#2B59FF) + teplá zlatá (#E0A33D).**
  Modrá = dôvera (proptech), zlatá = prémiový nádych a "AI/virtuálne" štítok.
- **Písmo: Inter pre celé UI.** Jedno písmo = jednoduchosť a konzistencia.

## 2026-06-27
- **fal.ai klient overený:** kľúč je platný, autentifikácia prešla; model
  `fal-ai/flux-pro/kontext` (Pro) pre náhľad, `.../kontext/max` pre finál.
  Render zatiaľ blokuje vyčerpaný kredit účtu (treba dobiť na fal.ai).
- **Negatívny prompt sa do Flux Kontext NEposiela** (model ho nemá ako parameter)
  — zakázané prvky sú zapracované priamo do pozitívneho promptu ("avoid: …").
- **Upload fotky cez fal.ai storage** (`fal.storage.upload`), nie cez Supabase.
  Šetrí to krok; Supabase Storage doplníme pri perzistencii výsledkov.
