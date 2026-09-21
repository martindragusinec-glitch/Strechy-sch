# LP Schlieger – Fotovoltaika + zateplení střechy (nabídka 2)

Lokální statická landing page pro www.schlieger.cz. Zdroj nabídky: interní podklad „Čtyři nabídky“ (11. 9. 2026), **Nabídka 2 – FVE 3,69 kWp do vody a domu + zateplení šikmé střechy 100 m²**: cena 385 500 Kč vč. DPH, dotace 320 000 Kč, doplatek 65 500 Kč, krytí 83 %.

## Soubory

| Soubor | K čemu |
|---|---|
| `index.html` | celá LP (inline CSS + JS), jediný soubor k úpravám |
| `lp-tracking.js`, `lp-consent.js` | měřicí standard **v2.2** (19. 9. 2026), **beze změny** zkopírovaný z `Schlieger-org/marketing-playbook/lp-tracking-standard/`; kopie README standardu v `docs/lp-tracking-standard-v2.1.md` |
| `assets/img/` | hero + fotky (viz `docs/IMAGES.md`), logo SVG (barevné i bílé), favicon |
| `assets/fonts/` | Poppins 400/500/600/700 (latin + latin-ext), self-hosted kvůli GDPR |
| `tools/serve.js` | lokální server: `node tools/serve.js 8766` → http://localhost:8766 |
| `docs/` | podklady: obrázky, research konkurence, UX brief |

Na web se nahrává: `index.html`, `lp-tracking.js`, `lp-consent.js`, `assets/`.

## Zásadní zjištění k dotaci (před spuštěním kampaně)

Sazby z nabídky (FVE 120 000 Kč, zateplení 2 000 Kč/m², strop 250 000 Kč) jsou sazby programu **NZÚ Light**, který od 25. 6. 2026 vyplácí přímou dotaci předem na účet **jen zranitelným domácnostem** (starobní důchod, invalidní důchod 3. stupně, superdávka). Ostatní domácnosti mají nárok jen na bezúročný úvěr až 400 000 Kč. Potvrzuje to i vlastní stránka schlieger.cz/dotace/nzu/.

LP je proto postavená poctivě na tuto cílovku: eyebrow + řádek v hero, samostatná sekce „Pro koho je nabídka“ (3 karty + větev „bezúročný úvěr“), kvalifikační otázka jako **1. krok formuláře** (odpověď jde do CRM v poznámce i v `productParameters.eligibility`). Cílení reklam tomu musí odpovídat.

Detaily a zdroje: `docs/research-competitors.md`, sekce 0 a 2.

## Design (verze 2, 15. 9. 2026 večer)

Směr „teplý papírový editorial“ podle researche moderních energy LP (`docs/design-direction.md`): kontejner **1300 px**, Poppins 400–600 s negativním trackingem, hairline oddělovače místo karet, bento grid jen u „Co je v ceně“, tmavé pásy pro rytmus, pill tlačítka **červená** (rozhodnutí klienta, research doporučoval zelená) se šipkou v bílém kroužku, zelená jen pro zvýraznění částky a dotací.

- **Hero (100 vh):** fotka z Higgsfield (Z Image: dům s černými panely, parta s rolí izolace, červená dodávka; záložní varianta za soumraku `hero-house-dusk-1920.jpg`), oficiální logo NZÚ Light nad H1 (z manuálu SFŽP 05/2023, průhlednost jen vnějšího pozadí), H1 se zeleným blokem „za 65 500 Kč“, řádek pro koho (vč. OSVČ na přání klienta), 3 proof odrážky, telefon. Vpravo karta **„Krok 1 z 6“ se 3 CTA** (senior / ID 3. st. / nízkopříjmová domácnost + „Nic z toho“, „Nevím“). Klik předvyplní 1. krok a skočí na krok 2 (`data-quick`, `cta_click` s `hero-step-*`).
- **Formulář hned pod hero:** breakout blok max. 1920 px, tmavý, vlevo H2 se zvýrazněním „dotaci předem“, 3 odrážky, hvězdičky (účtenka je jen v sekci Jak to počítáme, na přání klienta); vpravo bílá karta: „KROK X Z 6 · ≈ 1 minuta“, červený progress, pilulka „Vaše volba … změnit“, dlaždice s ikonami, lišta důvěry.
- **Nabídková karta** (sekce Co dostanete za 65 500 Kč): balíček FVE + zateplení střechy, cena → dotace → doplatek, CTA „Chci tento balíček“ (`pkg-fve-strecha`), obsah obou částí, „Co v ceně není“.
- Každá sekce končí CTA do formuláře (`included/why/process/reviews/faq-primary`). „Dotace předem na účet“ zvýrazněno zeleným blokem v sekci Pro koho (s logem NZÚ Light).
- **Galerie:** mřížka 3×2 reálných realizací Schlieger s obcí a výkonem (Brandov, Zbraslavice, Špindlerův Mlýn, Tuřany, dron, Vratimov) ze schlieger.cz/detail-realizace.
- Opakování kroku 1 (4 dlaždice) po sekci „Co je v ceně“.

## Verze 3 (15. 9. 2026 večer, po auditu)

Zapracován design/UX/CRO audit (`docs/audit.md`) a pravidla z nainstalovaných skillů (`.claude/skills/`: taste-skill v2, redesign-skill, Anthropic frontend-design, Vercel web-design-guidelines, ui-ux-pro-max, mobile-app-ui-design). Hlavní změny: hero 86 vh se stropem 820 px, bez štítků nad nadpisy, bez fade-in animací, formulář jako 3. sekce a zkrácený na 6 kroků (nárok → střecha typ+plocha → stav+vlastnictví → kontakt), kalkulačka sloučená s účtenkou (účtenka se přepočítává živě), nabídková karta přestavěná (tmavá hlavička, bílá účtenka 65 500 Kč, zelený pás 83 %, A + B obsah), plovoucí trust karta, kontrast drobného textu na AA, cookie lišta odsunutá nad sticky lištu, každá sekce končí CTA.

## Struktura stránky

Header (logo, telefon s otevírací dobou, CTA) → Hero 86 vh (logo NZÚ Light, H1, cílovka, telefon, karta krok 1 se 3 CTA, skleněný pás s čísly 15 let / 23 000+ / 80+ / 24 h) → Pro koho (bílý panel se 3 skupinami) → Nabídková karta „Co dostanete za 65 500 Kč“ → Formulář (6 kroků, 20 px od okrajů okna) → Kalkulačka (kompaktní karta, živý propočet) → Čísla → Proč Schlieger → Proces → Reference + galerie → FAQ → Finální CTA → Footer. (Starší popis níže platí jen orientačně.)

Původní popis: Header (tmavá fotka, H1 se zeleným blokem „za 65 500 Kč“, cenová karta 385 500 → −320 000 → 65 500 + lišta krytí 83 %, CTA, telefon) → trust strip → **Formulář** `#kalkulace` (6 kroků) → **Pro koho je nabídka** → Kalkulačka doplatku (slider 40–200 m², živý přepočet, hláška o stropu nad 125 m²) → Jak to počítáme (účtenka + callout 83 %) → Co je v ceně (2 karty + „Co v ceně není“) → Čísla (tmavá sekce) → Proč Schlieger (fotka + 6 faktů) → Jak to probíhá (6 kroků) → Reference (3 reálné recenze ze schlieger.cz/recenze + 3 fotky realizací Schlieger) → FAQ (10) → Finální CTA s datem platnosti → Footer (IČ, právní disclaimer, cookies, reCAPTCHA text) + sticky mobilní lišta.

Konstanty (ceny, sazby, strop, datum platnosti, otevírací doba) jsou v jednom objektu `CONFIG` na začátku skriptu v `index.html`. Po `deadline` se prvky s `[data-deadline-wrap]` samy skryjí.

## QA

Headless Chrome full-page screenshot: `?qa=1` vypne 100vh hera (jinak hero zabere celé vysoké okno). Řezy přes `sips -c H W --cropOffset y 0` s offsetem ≥ 1.

## Formulář (6 kroků, dřív 6)

1. Nárok na dotaci (starobní důchod / ID 3. st. / superdávka / nic z toho / nevím) – „nic z toho“ zobrazí větev bezúročný úvěr a pokračuje
2. Typ střechy (ikony) – „plochá“ zobrazí upozornění
3. Plocha střechy (předvyplní se z kalkulačky, pokud s ní návštěvník hýbal)
4. Stav střechy
5. Termín + vlastnictví
6. Kontakt (jméno, telefon, PSČ, e-mail) + honeypot + časová kontrola (<3 s = bot)

Odeslání jde výhradně přes `LPTracking.sendLead` (žádný vlastní fetch, žádné fbq/gtag). Mapování: `type` = typ střechy, `note_fields` = všechny odpovědi + hodnota kalkulačky, `extra` → `user_data.custom_*` (Make), `productDetail.productParameters` = {eligibility, area, condition, timing, bundle}, `additionalUserData` = {roofType, ownerOfProperty, buildingType}.

## Měření – stav

`LP_TRACKING_CONFIG` v `<head>`: company `schlieger`, product `FVE`, product_type `fotovoltaika_zatepleni_strechy`, form_id `MULTI_STEP_FORM_FVE_STRECHA`, tenant_id `fve_nove` (marketing-manual §1.3, Schlieger FVE; v manuálu označeno „odvozeno z názvu – ověřit“), gw_lead_products `['FVE','ZAT']`, gateway **DEV** (`vdgvdjdjsdbncudzzibx`, manual §1.2: PROD až po ověřeném testovacím leadu). GTM: `GTM-NWL639K` (kontejner webu schlieger.cz), **na localhost se GTM nenačítá**.

**Standard v2.2 (playbook 19. 9. 2026)** je nasazený: `lp-tracking.js` vyměněný 1:1 (v2.2 přidává jen přepínač `lead_target` pro náborové LP, gateway větev je proti v2.1 beze změny), API stejné (`sendLead(answers, hooks)`), v configu přidáno `attribution_session_storage: true`, `send_ga_client_id: false` (viz DOPLNIT), `attribution_only: false`.

Test dle §6 (18. 9. 2026, podstrčený fetch, URL s utm + campaign_id/adset_id/ad_id + fbclid=TEST, souhlas přes LPConsent.acceptAll): `form_sent → leadCapture`, stejné `lead_id` = `eventDetails.leadId`; gateway (DEV URL) dostává jen `{ eventDetails }` s hlavičkou `x-gateway-key` a **plným tvarem §5.1** (31 klíčů: tenantId, leadSource, customerType, leadProducts, note, userData, leadId, submittedAt, formId, pageUrl, landingUrl, referrer, campaignId=111, adsetId=222, adId=333, sourcePlatform=META, utm*, gclid/gbraid/wbraid/fbclid=TEST/msclkid/sznclid, gaClientId="", device=desktop, firstTouch, consent.status=granted). `sessionStorage.lp_attr_first/last` zapsané hned při načtení, cookies `_attribution_first/last` až po souhlasu. `typeof fbq` i `gtag` = `undefined`.

## Nasazení – nzulight.schlieger.cz (21. 9. 2026)

LP běží jako Cloudflare Worker se statickými assety `fve-strecha-nzulight` (účet Cloudflare@schlieger.cz), custom doména **https://nzulight.schlieger.cz** (DNS v zóně schlieger.cz vzniklo automaticky), náhled https://fve-strecha-nzulight.obkladac-schlieger.workers.dev. Nasazuje se z čisté kopie (`index.html`, `lp-tracking.js`, `lp-consent.js`, `assets/`, `_headers`, `_redirects`, `wrangler.jsonc`) příkazem `wrangler deploy`; repo v organizaci není na Cloudflare napojené (privátní repo, bez GitHub tokenu).

**Do spuštění je stránka `noindex, nofollow`** (meta robots i hlavička `X-Robots-Tag` v `_headers`). Při spuštění obojí přepnout na `index, follow`, resp. řádek z `_headers` smazat.

**Souhlas:** na subdoméně se z GTM (`GTM-NWL639K`) načte Cookiebot, ale subdoména **není v jeho domain group** (`d9a57f9f-…`), takže Cookiebot lištu nezobrazí a souhlas nevrátí. Modul by přitom Cookiebot upřednostnil a ignoroval naši lištu (ověřeno živě 21. 9.: po „Přijmout vše“ vracel `known: false`). Proto je v `LP_TRACKING_CONFIG` `consent_adapter`, který čte `LPConsent`. **Až marketing přidá `nzulight.schlieger.cz` do Cookiebot domain group:** smazat `consent_adapter`, `LP_CONSENT_CONFIG`, `<script src="lp-consent.js">` a `[data-consent-open]` napojit na `Cookiebot.renew()`.

**Pozor při testování na živé doméně:** GTM se načítá (blokuje se jen na localhostu), takže testovací odeslání formuláře odpálí `form_sent` a s ním konverze v Ads/Meta. Testovat s podstrčeným `fetch` podle §6 standardu, nebo na localhostu.

## DOPLNIT před nasazením

> Kompletní audit měření proti playbooku (co máme / co chybí, včetně dvou rozporů mezi standardem a GTM manuálem) je v **[`docs/mereni-stav.md`](docs/mereni-stav.md)**.

Podle `Schlieger-org/marketing-playbook` (AGENTS.md, docs/marketing-manual.md, docs/gtm-tracking-manual.md, lp-tracking-standard v2.1):

**Rozhodnutí vlastníka**
- [ ] **Hero fotka je AI** (Higgsfield, `docs/IMAGES.md`). Playbook AGENTS.md §0 a GTM manuál §7: „Hero vizuál = reálné foto realizace, ne AI“. Nahradit reálnou fotkou z databáze realizací (v `assets/img/realizace-*.jpg` je 7 reálných, žádná ale nemá zateplení + montáž). Stejně `zatepleni-strechy.jpg` a `konzultace.jpg`.
- [ ] **Umístění repa**: AGENTS.md §2 chce každou LP v `marketing-playbook/landing-pages/<slug>/`. LP je zatím v samostatném repu `Schlieger-org/fve-strecha-nzulight` – buď přesunout, nebo repo v playbooku odkázat.
- [ ] **GTM pro subdoménu** (GTM manuál §10.0): (a) měřit společně se schlieger.cz = nechat `GTM-NWL639K` + property `G-CTSNDPMX5P` (LP takto nastavená), nebo (b) vlastní kontejner + property pro samostatné konverze.
- [ ] **CMP**: s `GTM-NWL639K` naběhne Cookiebot z kontejneru (manuál §6: „nepřepisuj souhlas vlastním řešením“). Na subdoméně schlieger.cz proto **odstranit `lp-consent.js`** + jeho `LP_CONSENT_CONFIG` a `[data-consent-open]` napojit na `Cookiebot.renew()`; v Cookiebot přidat subdoménu do domain group `d9a57f9f-eeb3-4af2-9d35-a107ee14014a`. `lp-consent.js` nechat jen při samostatné doméně bez Cookiebotu.

**Hodnoty od správců**
- [x] `gateway_key` + `gateway_url` **PROD** jsou v nasazené kopii (21. 9. 2026). Klíč je v `deploy/secrets.env` (gitignore), `deploy/publish.sh` ho vloží při nasazení; v repu zůstává prázdný. Dodaný klíč platí jen pro PROD (DEV ho odmítá), krok „DEV lead“ z manuálu §1.2 proto neproběhl – první ostrý test jde rovnou do PROD CRM
- [ ] `tenant_id` `fve_nove` potvrdit se správcem CRM (alternativa `nzu_schlieger_nove`, pokud má NZÚ Light LP jít do NZÚ kampaně)
- [ ] `gw_lead_source` – kód zdroje leadu (CRM); `gw_lead_products` – potvrdit `FVE` + `ZAT`
- [ ] `form_id` / `form_name` – potvrdit s analytikou
- [ ] `make_webhook_url` – Make webhook + Router podle `type` (`lead` / `gateway_result`), reCAPTCHA siteverify jen v Make
- [x] `recaptcha_site_key` doplněn (v3, doména nzulight.schlieger.cz). **Secret key není v repu** – patří do Make scénáře do větve `gateway_result` (siteverify s `{{1.recaptcha_token}}`), viz standard §5.7
- [ ] **Správce gateway musí namapovat nová pole v2.1** (leadId, submittedAt, formId, pageUrl, landingUrl, referrer, campaignId, adsetId, sourcePlatform, utm*, click IDs, device, firstTouch, consent) do CRM – gateway je jinak jen zaloguje (README standardu §5.1). Ověřit DEV leadem, že v CRM dorazila atribuce.
- [ ] `send_ga_client_id` je **vypnuté**. Zapnout až zásady ochrany OÚ na schlieger.cz zmíní, že měřicí identifikátor (cookie `_ga`) spojujeme s poptávkou kvůli vyhodnocení zdrojů (README standardu §8, podmínka 2). Odkaz v souhlasu formuláře míří na `schlieger.cz/podminky-ochrany-osobnich-udaju/`.
- [ ] `attribution_session_storage: true` (zápis atribuce do sessionStorage před souhlasem) – právník potvrdí výklad „nezbytné pro službu“, jinak přepnout na `false` (README §8).

**Kampaň a nasazení**
- [ ] Google Ads: zapnutý **auto-tagging** (gclid/gbraid); v Meta se `fbclid` nepíše ručně (README §4)
- [ ] Žádný redirect na subdoméně nesmí zahazovat query string (`_redirects` má jen `/index.html → /`)
- [ ] UTM podle `konvence-nazvoslovi-kreativ.md`: `utm_campaign` = `sch-fve-lead-YYYYMM`, `utm_content` = kód kreativy `sch-fve-{publikum}-{format}-{YYYYMM}-vNN`, název reklamy = stejný kód
- [ ] Custom doména v Cloudflare (Worker `fve-strecha-nzulight`, účet Cloudflare@schlieger.cz), pak `<link rel="canonical">` a absolutní `og:image`
- [ ] Po nasazení GTM Preview / GA4 DebugView: `form_sent` + `leadCapture` dorazí (GTM manuál §8)
- [ ] `CONFIG.deadline` – platnost cen (v podkladu 24. 9. 2026)
- [ ] Otevírací doba: LP má Po–Pá 9–16, patička webu jinde 8–16 – sjednotit
- [ ] Zateplení střechy není na schlieger.cz jako produkt – potvrdit, kdo stavební část realizuje a fakturuje
- [ ] Ověřit sazby/stropy NZÚ Light ke dni spuštění
- [ ] **OSVČ v cílovce** (hero) – podle pravidel NZÚ Light rozhoduje status domácnosti, ověřit formulaci s právníkem
- [ ] Právník: FAQ 2 a 10 (platby, neschválení dotace) podle reálné smlouvy; 93 % spokojenosti v sekci Proč Schlieger ověřit

## Obrázky

Hero + zateplení + konzultace: generováno přes Higgsfield MCP (kredity vyčerpány, zbývá 0,4). Realizace a logo: schlieger.cz. Detaily v `docs/IMAGES.md`. Miniatury recenzí ze schlieger.cz (`miniatura_*.png`) jsou video náhledy s textem – na LP nepoužity, ponechány v assets pro případné použití.

## A/B testy (doporučené pořadí, z UX briefu)

1. H1 „za 65 500 Kč“ vs. „Zateplení střechy vás nestojí nic navíc“
2. První krok kvízu přímo v hero
3. CTA „Spočítat můj doplatek“ vs. „Ověřit nárok na dotaci“
4. Kalkulačka nahoře vs. pod „Co je v ceně“
- Sdílecí náhled (og:image) je `assets/img/og-image.jpg` 1200×630, vyrenderovaný z hero fotky s logem a titulkem. Po nasazení zkontrolujte absolutní URL v `<meta property="og:image">`.
- Hero na mobilu je zkrácený: bez řádku „Raději zavolám“ (telefon je v hlavičce i ve sticky liště), menší logo NZÚ a kompaktnější karta prvního kroku.

## Varianta pro OSVČ (`/osvc`)

`osvc.html` je samostatná verze LP pro živnostníky, sladěná s OSVČ bannery a videem (stejný muž, stejný hook „Jste OSVČ s nižšími příjmy?“):

- **Hero:** vlastní fotka `assets/img/hero-osvc-{1920,960}.jpg` (Higgsfield GPT Image 2.5, identita z `banners/src/osvc-story.jpg`, živnostník mezi textem a kartou), H1 začíná řádkem „Jste OSVČ s nižšími příjmy?“, zvýrazněná věta „Živnost vám nárok nebere.“ Vlastní OG obrázek `og-image-osvc.jpg`.
- **Krok 1 v hero i ve formuláři:** „Podnikáte a příjem vaší domácnosti je nižší?“ (Ano jsem OSVČ / Podnikám v důchodu / ID 3. st. / Superdávka / Příjem máme vyšší). Hodnoty odpovědí jsou stejné jako na hlavní LP, CRM i Make dostávají stejná data; varianta se pozná podle `pageUrl` a `utm_content`.
- **Sekce nároku:** panel „✕ Podle živnosti / ✓ Podle příjmu domácnosti a stavu domu“ + tři situace s hranicemi 25 426 Kč (3. decil) a 31 058 Kč (5. decil) na osobu. Zdroj: Závazné pokyny NZÚ Light v1.1 (SFŽP, 6/2026) kap. 2.1; decilové hranice 2026 z veřejných kalkulaček (E.ON, Refsite), SFŽP je v pokynech neuvádí.
- **Kalkulačka nároku `#narok`:** sekce je „launcher“ (text + jedno CTA „Spustit kalkulačku“ s ikonou + živá ukázka v kódu: pevná karta, tři obrazovky, kurzor, posuvník fakturace, výsledek příjem vs. hranice, nálepka; smyčka, pauza mimo viewport, statický konec při prefers-reduced-motion). Po kliknutí se rozbalí karta se **3 kroky + výsledek** (progress lišta, Zpět, výška karty měřená podle aktivního kroku a animovaná). Metodika oficiálního nástroje SFŽP „příjmové decily“ v1.2 (24. 6. 2026, EU-SILC 2025): hranice všech 10 decilů, spotřební jednotky 1 + 0,5·(dospělí−1) + 0,5·děti 14–17 + 0,3·děti do 13, 3. decil / 5. decil (všichni dospělí v důchodu nebo ID 3. st.), superdávka = nárok vždy. Otázka 1 domácnost (dospělí a děti od 14 / děti do 13) + situace, otázka 2 roční fakturace OSVČ s paušálem **70 %** (zadání 21. 9.; zisk − daň 15 % po slevě − minimální pojistné 2026) nebo roční čistý zisk z DP ÷ 12, další příjmy domácnosti sbalené (výplaty, důchody, jiné, měsíčně), otázka 3 dům (E–G, výběr = výsledek, bez předvolby). Výsledek: verdikt (hedge „pravděpodobně“, superdávka nepřebíjí stav domu), dlaždice dotace/orientační doplatek, CTA hned pod verdiktem (klik předvyplní krok 1 formuláře a skočí na krok 2 jako hero karta), příjem **na osobu** vs. hranice **na osobu** (3./5. decil) na pruhu, věta „patříte mezi X % domácností“, tři řádky jako u SFŽP (dotace, úvěr 25 let pro decil < 5, renovační pas zdarma), „Co si připravit“. Nic se neposílá; výsledek jde do leadu (`note_fields['Kalkulačka nároku OSVČ']`, `extra.elig_calc`), dataLayer `calc_open`, `calc_step`, `eligibility_calc`. UX audit 21. 9. zapracován (graf na osobu, pořadí větví, sloučení skupin, auto-zvýraznění dalších příjmů u více dospělých, sticky lišta skrytá u karty, odkazy z hero/„Pro koho“ otevírají kalkulačku rovnou, aria-pressed/valuetext, kontrast hintů, mobil: nadpis a CTA před ukázkou, ukázka klikací). Vědomě neřešeno: přepínač paušálu 40/60/80 % (zadání = 70 %), cookie lišta. QA hashe: `#narok-otevrit`, `#narok-krok-N`, `#narok-vysledek`. Zdrojová oficiální kalkulačka: `~/Downloads/nzu-podrobny-vypocet.html` (klient, 21. 9.).
- **FAQ navíc:** nárok OSVČ, co dokládám (DP, paušální daň), svépomoc jako OSVČ není způsobilý výdaj (pokyny kap. 7.1 h), sídlo podnikání v domě.
- Nasazuje ji `deploy/publish.sh` (secrets do obou souborů), `_redirects` posílá `/osvc.html` a `/osvc/` na `/osvc`. Sdílené CSS/JS jsou v obou souborech zvlášť, změny dělat v obou. Formulace nároku OSVČ čeká na právníka.
