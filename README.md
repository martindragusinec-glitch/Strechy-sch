# LP Schlieger – Fotovoltaika + zateplení střechy (nabídka 2)

Lokální statická landing page pro www.schlieger.cz. Zdroj nabídky: interní podklad „Čtyři nabídky“ (11. 9. 2026), **Nabídka 2 – FVE 3,69 kWp do vody a domu + zateplení šikmé střechy 100 m²**: cena 385 500 Kč vč. DPH, dotace 320 000 Kč, doplatek 65 500 Kč, krytí 83 %.

## Soubory

| Soubor | K čemu |
|---|---|
| `index.html` | celá LP (inline CSS + JS), jediný soubor k úpravám |
| `lp-tracking.js`, `lp-consent.js` | měřicí standard v2.0, **beze změny** zkopírovaný z kořene repozitáře |
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

Zapracován design/UX/CRO audit (`docs/audit.md`) a pravidla z nainstalovaných skillů (`.claude/skills/`: taste-skill v2, redesign-skill, Anthropic frontend-design, Vercel web-design-guidelines, ui-ux-pro-max, mobile-app-ui-design). Hlavní změny: hero 86 vh se stropem 820 px, bez štítků nad nadpisy, bez fade-in animací, formulář jako 3. sekce a zkrácený na 4 kroky (nárok → střecha typ+plocha → stav+vlastnictví → kontakt), kalkulačka sloučená s účtenkou (účtenka se přepočítává živě), nabídková karta přestavěná (tmavá hlavička, bílá účtenka 65 500 Kč, zelený pás 83 %, A + B obsah), plovoucí trust karta, kontrast drobného textu na AA, cookie lišta odsunutá nad sticky lištu, každá sekce končí CTA.

## Struktura stránky

Header (logo, telefon s otevírací dobou, CTA) → Hero 86 vh (logo NZÚ Light, H1, cílovka, telefon, karta krok 1 se 3 CTA, skleněný pás s čísly 15 let / 23 000+ / 80+ / 24 h) → Pro koho (bílý panel se 3 skupinami) → Nabídková karta „Co dostanete za 65 500 Kč“ → Formulář (4 kroky, 20 px od okrajů okna) → Kalkulačka (kompaktní karta, živý propočet) → Čísla → Proč Schlieger → Proces → Reference + galerie → FAQ → Finální CTA → Footer. (Starší popis níže platí jen orientačně.)

Původní popis: Header (tmavá fotka, H1 se zeleným blokem „za 65 500 Kč“, cenová karta 385 500 → −320 000 → 65 500 + lišta krytí 83 %, CTA, telefon) → trust strip → **Formulář** `#kalkulace` (6 kroků) → **Pro koho je nabídka** → Kalkulačka doplatku (slider 40–200 m², živý přepočet, hláška o stropu nad 125 m²) → Jak to počítáme (účtenka + callout 83 %) → Co je v ceně (2 karty + „Co v ceně není“) → Čísla (tmavá sekce) → Proč Schlieger (fotka + 6 faktů) → Jak to probíhá (4 kroky) → Reference (3 reálné recenze ze schlieger.cz/recenze + 3 fotky realizací Schlieger) → FAQ (10) → Finální CTA s datem platnosti → Footer (IČ, právní disclaimer, cookies, reCAPTCHA text) + sticky mobilní lišta.

Konstanty (ceny, sazby, strop, datum platnosti, otevírací doba) jsou v jednom objektu `CONFIG` na začátku skriptu v `index.html`. Po `deadline` se prvky s `[data-deadline-wrap]` samy skryjí.

## QA

Headless Chrome full-page screenshot: `?qa=1` vypne 100vh hera (jinak hero zabere celé vysoké okno). Řezy přes `sips -c H W --cropOffset y 0` s offsetem ≥ 1.

## Formulář (4 kroky, dřív 6)

1. Nárok na dotaci (starobní důchod / ID 3. st. / superdávka / nic z toho / nevím) – „nic z toho“ zobrazí větev bezúročný úvěr a pokračuje
2. Typ střechy (ikony) – „plochá“ zobrazí upozornění
3. Plocha střechy (předvyplní se z kalkulačky, pokud s ní návštěvník hýbal)
4. Stav střechy
5. Termín + vlastnictví
6. Kontakt (jméno, telefon, PSČ, e-mail) + honeypot + časová kontrola (<3 s = bot)

Odeslání jde výhradně přes `LPTracking.sendLead` (žádný vlastní fetch, žádné fbq/gtag). Mapování: `type` = typ střechy, `note_fields` = všechny odpovědi + hodnota kalkulačky, `extra` → `user_data.custom_*` (Make), `productDetail.productParameters` = {eligibility, area, condition, timing, bundle}, `additionalUserData` = {roofType, ownerOfProperty, buildingType}.

## Měření – stav

`LP_TRACKING_CONFIG` v `<head>`: company `schlieger`, product `FVE`, product_type `fotovoltaika_zatepleni_strechy`, form_id `MULTI_STEP_FORM_FVE_STRECHA`, gw_lead_products `['FVE','ZAT']`. GTM: `GTM-NWL639K` (kontejner webu schlieger.cz), **na localhost se GTM nenačítá** (kontejner odpaluje Ads konverze i při lokálním testu).

Test dle §6 (15. 9. 2026, podstrčený fetch) prošel: pořadí `cta_click → form_step… → view_form → begin_form → form_sent → leadCapture`, `form_sent` bez gatewayID, stejné `lead_id`, `leadCapture.eventDetails.result = "success"`, `adId = "333"`, `gatewayID = "TEST-GW-ID"`, gateway dostává jen `{ eventDetails }` s hlavičkou `x-gateway-key`, `typeof fbq` i `gtag` = `undefined`.

## DOPLNIT před nasazením

- [ ] `gateway_key` (PROD i DEV) – od správce gateway, po souhlasu vlastníka LP (§8)
- [ ] `tenant_id` – správce CRM
- [ ] `gw_lead_source` – kód zdroje leadu (CRM)
- [ ] `gw_lead_products` – potvrdit kódy `FVE` + `ZAT` (nebo jiný kód pro zateplení)
- [ ] `form_id` / `form_name` – potvrdit s analytikou (web používá `MULTI_STEP_FORM_FVE`, `_TEPELKO`, `_SOLAR`, `_GENERIC`)
- [ ] `make_webhook_url` – Make webhook této LP + Router podle `type`
- [ ] `recaptcha_site_key` – reCAPTCHA v3 pro doménu (načítá se líně až v kroku 4+)
- [ ] **CMP:** schlieger.cz načítá Cookiebot přes GTM (domain group `d9a57f9f-eeb3-4af2-9d35-a107ee14014a`). Pokud LP poběží na schlieger.cz, **odstranit `lp-consent.js`** a nechat Cookiebot (modul ho detekuje sám). Na samostatné doméně zůstává `lp-consent.js`.
- [ ] `<link rel="canonical">` a `og:image` – finální URL LP
- [ ] `CONFIG.deadline` – platnost cen (v podkladu 24. 9. 2026 pro FVE)
- [ ] Otevírací doba: kontakt na webu uvádí Po–Pá 9–16, patička jinde 8–16 – sjednotit (LP má 9–16)
- [ ] Zateplení střechy není na schlieger.cz jako produkt – potvrdit, kdo stavební část realizuje a fakturuje (LP říká „od jednoho dodavatele“)
- [ ] Ověřit aktuální sazby/stropy NZÚ Light ke dni spuštění (program se v roce 2026 měnil vícekrát)
- [ ] DEV lead → `status: completed` → přepnout na PROD (§3 krok 7), GTM triggery `form_sent` + `leadCapture` (analytika)
- [ ] **OSVČ v cílovce** (hero) je na přání klienta; podle pravidel NZÚ Light rozhoduje status domácnosti (superdávka / důchod), ne OSVČ jako takové – ověřit formulaci s právníkem
- [ ] Fotka v sekci Proč Schlieger (`konzultace.jpg`) je generovaná; nahradit reálnou fotkou technika/týmu Schlieger
- [ ] Právník: znění FAQ 2 a 10 (platby, neschválení dotace) podle reálné smlouvy; záruky na montáž/panely (na LP záměrně nejsou čísla)

## Obrázky

Hero + zateplení + konzultace: generováno přes Higgsfield MCP (kredity vyčerpány, zbývá 0,4). Realizace a logo: schlieger.cz. Detaily v `docs/IMAGES.md`. Miniatury recenzí ze schlieger.cz (`miniatura_*.png`) jsou video náhledy s textem – na LP nepoužity, ponechány v assets pro případné použití.

## A/B testy (doporučené pořadí, z UX briefu)

1. H1 „za 65 500 Kč“ vs. „Zateplení střechy vás nestojí nic navíc“
2. První krok kvízu přímo v hero
3. CTA „Spočítat můj doplatek“ vs. „Ověřit nárok na dotaci“
4. Kalkulačka nahoře vs. pod „Co je v ceně“
