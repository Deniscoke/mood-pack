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
- **Prompt prepísaný na edit-inštrukciu** (nie opis scény). Flux Kontext je
  editačný model — dlhý opis interiéru (palety, hex, materiály) spôsoboval, že
  si izbu vymyslel nanovo namiesto úpravy pôvodnej fotky → nekonzistentné
  výstupy. Nový prompt: akcia („zariaď túto prázdnu izbu") + dôrazné zachovanie
  geometrie („keep walls/windows/perspective identical") + krátky štýl.
  Podľa návodu BFL (docs.bfl.ml/guides/prompting_guide_kontext_i2i).
- **Zrušený manuálny výber typu miestnosti.** Užívateľ nič nevyberá — model si
  typ izby určí sám z fotky (vidí ju). Jednoduchšie UX, ubudol kód.
- **Pridaná automatická detekcia izby (vision).** Keďže Flux Kontext si typ izby
  počas generovania „hádal" zle (kúpeľňa → gauč), pred zariadením teraz fotku
  prečíta vision model **Moondream** (`fal-ai/moondream3-preview/query`) a vráti
  typ miestnosti → prompt je potom konkrétny („toto je kúpeľňa"). Beží na tom
  istom fal.ai účte (žiadny nový kľúč), ~1 c na fotku navyše. Spoľahlivejšie než
  nechať to hádať Kontextu. Detekcia má fallback "other" — nezhodí render.
- **Pridaný prepínateľný „motor" zariadenia** (`lib/stageEngine.ts`). Default
  **OpenAI gpt-image-1** (`input_fidelity:"high"`) — na žiadosť vyskúšať GPT.
  fal Flux Kontext ostáva dostupný cez env `STAGE_ENGINE=fal`. Úprimná poznámka:
  research naznačuje, že Kontext drží štruktúru lepšie, GPT môže orezať (pevné
  veľkosti) a je drahší (~7 c/25 c vs 4 c/8 c). Necháme prepínateľné, nech sa dá
  porovnať a vrátiť. fal sa stále používa na upload, detekciu a hosting výstupu.
  Vyžaduje `OPENAI_API_KEY` + overenú OpenAI organizáciu.
- **Model zmenený na `gpt-image-2`** (gpt-image-1 sa ruší 23.10.2026). Novší,
  lacnejší, vstupnú fotku drží vo vysokej vernosti automaticky.
- **Vzhľad zmenený na prémiový TMAVÝ** s teplým zlatým akcentom + serif nadpismi
  (Georgia). Inšpirované referenčným UI od používateľa, ale „rockovú" červenú sme
  zámerne vymenili za zlato — sedí k interiérom a pôsobí dôveryhodne pre realitky.
  Zmena cez tokeny (`tokens.css` + `base.css`), preto sa preoblékla celá appka naraz.
- **Rozloženie zmenené na jednotný „nástroj"**: horná lišta + dva panely (vľavo
  ovládanie: nahranie/štýl/kvalita, vpravo plocha s výsledkami „pred/po"), namiesto
  voľne plávajúcich sekcií. Pôsobí zomknuto a moderne, využíva šírku. Na mobile
  sa panely poskladajú pod seba.
- **Poznámka užívateľa sa teraz reálne aplikuje.** Predtým prompt obsahoval „nič
  iné na izbe nemeň", čo prebíjalo požiadavky meniace steny (napr. „grafity na
  stene"). Zmena: zachovávame len GEOMETRIU/perspektívu (steny sa nehýbu), zrušili
  sme „nič nemeň", a poznámku **zdôrazňujeme a dávame dopredu** ("you must apply
  it"). Pozn.: jedna fotka aj „všetky" používajú rovnaký vstup — nič sa nedelí.
