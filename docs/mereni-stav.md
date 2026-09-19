# Měření LP – co máme a co chybí

Kontrola proti `Schlieger-org/marketing-playbook` ke dni **19. 9. 2026** (commit `7c9011d`):
`lp-tracking-standard/README.md` (standard v2.1), `hiring-tracking-standard-draive/` (modul v2.2),
`docs/gtm-tracking-manual.md`, `docs/marketing-manual.md`, `docs/smernice-kampane-crm-a-tracking.md`, `AGENTS.md`.

## Hotovo (ověřeno v prohlížeči 19. 9. 2026)

| Požadavek playbooku | Stav |
|---|---|
| Modul `lp-tracking.js` = kanonická verze | **v2.2** (19. 9.), zkopírovaný 1:1; gateway větev je proti v2.1 beze změny, přibyl jen přepínač `lead_target` pro nábor |
| `lp-consent.js` beze změny | shodný s playbookem |
| Pořadí v `<head>`: dataLayer → consent → GTM → config → modul | ano (řádky 24–56 `index.html`) |
| GTM snippet + noscript, `GTM-NWL639K` | ano, na localhostu se kontejner záměrně nenačítá |
| Všechna CTA mají `data-cta` | 16 CTA včetně `hero-step-*`, `mobile-sticky`, `form-submit` |
| `[data-consent-open]` v patičce | ano |
| reCAPTCHA badge skrytý + textová zmínka | ano (patička) |
| Submit jen přes `LPTracking.sendLead`, žádný vlastní fetch | ano |
| Žádné `fbq` / `gtag` v HTML | ověřeno, `typeof` = `undefined` |
| `observeForm`, `formStep`, `formError` napojené | ano |
| Telefon jako `tel:` odkaz | 8× |
| dataLayer eventy dle §5.6 | `cookie_consent_update → cta_click → view_form → begin_form → form_step ×5 → form_sent → leadCapture` |
| `form_sent` bez PII, 1× na `lead_id` | ano (9 klíčů, žádný e-mail ani telefon) |
| `leadCapture` s `userData` a stejným `leadId` | ano |
| Do gateway jde jen `{ eventDetails }` s `x-gateway-key` | ano |
| Plný `eventDetails` dle §5.1 (v2.1) | ano, **31 polí** včetně `leadId`, `submittedAt`, `formId`, `pageUrl`, `landingUrl`, `referrer`, `campaignId/adsetId/adId`, `sourcePlatform`, `utm*`, `gclid/gbraid/wbraid/fbclid/msclkid/sznclid`, `gaClientId`, `device`, `firstTouch`, `consent` |
| Atribuce v `sessionStorage` před souhlasem, cookies až po souhlasu | ano (`lp_attr_first` / `lp_attr_last` → `_attribution_first` / `_attribution_last`) |
| `tenantId` camelCase uvnitř `eventDetails` | ano, `fve_nove` |
| Gateway míří na DEV | ano (`vdgvdjdjsdbncudzzibx`), PROD až po ověřeném leadu |
| Žádný redirect nezahazuje query string | `_redirects` má jen `/index.html → /` |

## Chybí – hodnoty od správců

| Co | Kdo | Poznámka |
|---|---|---|
| `gateway_key` DEV, pak PROD | správce gateway | klíče z `lead-gateway.env`, do repa nikdy |
| Potvrdit `tenant_id` | správce CRM | teď `fve_nove`; alternativa `nzu_schlieger_nove`, pokud má NZÚ Light LP patřit do NZÚ kampaně |
| `gw_lead_source` | CRM | teď prázdné → prázdné je i `form_sent.lead_source` a `leadCapture.eventDetails.leadSource` |
| Potvrdit `gw_lead_products` `['FVE','ZAT']` | CRM | zateplení jako samostatný produktový kód |
| Potvrdit `form_id` `MULTI_STEP_FORM_FVE_STRECHA` | analytika | web jinde používá `MULTI_STEP_FORM_FVE` |
| `make_webhook_url` + Router podle `type` | marketing | bez něj není záloha leadu ani log; siteverify reCAPTCHA patří do Make, ne na LP |
| `recaptcha_site_key` pro finální doménu | marketing | modul ho načítá líně až v kontaktním kroku |
| **Namapovat nová pole v2.1/2.2 v gateway** | správce gateway | gateway neznámá pole nezamítne, ale bez mapování je jen zaloguje → atribuce nedojde do CRM |
| DEV lead → `status: completed` → přepnout na PROD | marketing + CRM | `GET …/lead-gateway/result/<id>` |

## Chybí – nastavení v GTM a GA4

1. **Soft eventy nemají v kontejneru triggery.** Standard (§5.6) posílá `view_form`, `begin_form`, `form_step`, `form_error`, `cta_click`, `phone_click`, `scroll_depth`. GTM manuál §4 uvádí, že kontejner `GTM-NWL639K` má tagy na `form_interaction_start` a `form_stepX`, tedy **jiné názvy**. Konverze (`form_sent`, `leadCapture`) měřené jsou, ostatní eventy se dnes nikde nezachytí. Rozhodnout: buď v GTM přidat triggery na nové názvy (doporučeno, standard je novější), nebo tyto eventy vědomě neměřit.
2. **Rozšířené konverze Google Ads.** GTM manuál §4 počítá s tím, že `email` a `telefon` přijdou **v pushi `form_sent`**. Standard je posílá záměrně až v `leadCapture` (form_sent je bez PII). Pokud má Ads tag brát e-mail a telefon, musí je číst z `leadCapture`, nebo se musí přepnout na trigger `leadCapture`.
3. **Volba kontejneru pro subdoménu** (GTM manuál §10.0): buď měřit společně se schlieger.cz (`GTM-NWL639K` + `G-CTSNDPMX5P`, tak je LP nastavená), nebo založit vlastní kontejner a GA4 property se samostatnými konverzemi.
4. **Ověřit v GTM Preview a GA4 DebugView** po nasazení na ostrou doménu, že `form_sent` i `leadCapture` reálně dorazí.
5. **Modul na všech stránkách webu** (§4.1): standard chce `lp-tracking.js` i na stránkách bez formuláře (`attribution_only: true`), jinak se atribuce ztratí při prokliku. Týká se schlieger.cz jako celku, ne jen téhle LP.

## Chybí – souhlas a právní část

- **Cookiebot vs. `lp-consent.js`.** Na subdoméně schlieger.cz naběhne Cookiebot z kontejneru, GTM manuál §6 zakazuje vlastní řešení. Před nasazením na subdoménu odstranit `lp-consent.js` i `LP_CONSENT_CONFIG`, `[data-consent-open]` napojit na `Cookiebot.renew()` a subdoménu přidat do domain group `d9a57f9f-eeb3-4af2-9d35-a107ee14014a`. Na samostatné doméně `lp-consent.js` zůstává.
- **`gaClientId` je vypnutý** (`send_ga_client_id: false`). Zapnout až zásady ochrany osobních údajů zmíní, že měřicí identifikátor spojujeme s poptávkou (standard §8, podmínka 2).
- **`sessionStorage` před souhlasem** (`attribution_session_storage: true`) je výklad „nezbytné pro službu“. Pokud ho právník neuzná, přepnout na `false`.

## Chybí – kampaň

- Google Ads: zapnutý **auto-tagging** (gclid/gbraid/wbraid); v Meta se `fbclid` nepíše ručně.
- UTM podle `konvence-nazvoslovi-kreativ.md`: `utm_campaign` = `sch-fve-lead-YYYYMM`, `utm_content` = kód kreativy `sch-fve-{publikum}-{format}-{YYYYMM}-vNN`, stejný kód i jako název reklamy v platformě.
- Registr kreativ (list `MKT_Creatives` v Google Sheets → BigQuery) – bez něj nejde spárovat spend s leady.
- GA4 → BigQuery export pro property, pod kterou LP poběží.
