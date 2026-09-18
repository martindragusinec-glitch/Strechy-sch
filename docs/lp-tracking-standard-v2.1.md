# Standard měření a odesílání leadů z LP (DomiDomi / Schlieger / Čiperka / Warmteo)

> **Verze 2.1 · 18. 9. 2026.** Referenční implementace: LP *Rekonstrukce bytů a domů* (`rekonstrukce-bytu-a-domu/index.html`).
> Navazuje na `marketing-landingpage-manual.md` (§1 Lead Gateway, §3.4 form eventy) a na specifikaci měření a souhlasu od analytiky (8. 9. 2026).
> Dokument je psaný tak, aby ho **zvládl provést AI asistent (Claude) na jakoukoli LP**. §1 je instrukce pro něj, §2–§9 podklady.
>
> **Co je nové ve v2.1** (detail v §11): plná atribuce jde nově i **do gateway** (`eventDetails` §5.1), přibyly `leadId`, `submittedAt`, `formId`, `pageUrl`, `campaignId`/`adsetId`, `sourcePlatform`, `utm*`, `gclid`/`gbraid`/`wbraid`/`fbclid`/`msclkid`/`sznclid`, `gaClientId`, `device`, `firstTouch`, `consent`. Atribuce se drží v `sessionStorage` už **před** souhlasem (§4.1).

**Soubory standardu (držet pohromadě v tomto repozitáři):**

| Soubor | K čemu | Nahrává se na web? |
|---|---|---|
| `README.md` | tento návod | ne |
| `lp-tracking.js` | měřicí modul: atribuce, souhlas, gateway, dataLayer eventy | **ano**, vedle `index.html` |
| `lp-consent.js` | lehká cookie lišta se stejným API jako Cookiebot (jen když LP nemá vlastní CMP) | **ano**, vedle `index.html` |

Na web dané LP se nahrávají **tři soubory**: `index.html`, `lp-tracking.js`, `lp-consent.js` (pokud LP používá Cookiebot, `lp-consent.js` se nevkládá).

---

## 1. Instrukce pro Claude (zkopíruj do promptu spolu s tímto repozitářem)

```
Implementuj na tuto landing page standard měření podle přiloženého README.md a souborů
lp-tracking.js a lp-consent.js. Postupuj přesně podle §3 (krok za krokem), nic nevynechej,
nic nevymýšlej navíc. Soubory lp-tracking.js a lp-consent.js vlož beze změny, měň jen
konfiguraci v window.LP_TRACKING_CONFIG a window.LP_CONSENT_CONFIG.
Hodnoty, které nemáš (gateway klíč, tenantId, leadSource, reCAPTCHA site key, Make webhook),
nech prázdné a na konci mi vypiš seznam, co mám doplnit. Po implementaci proveď test podle §6
a ukaž mi výsledek z konzole (eventy form_sent a leadCapture).
Nikdy neposílej skutečný lead na PROD gateway s reálnými údaji.
```

Čeho se Claude musí držet:

- **dataLayer dostává jen eventy z tabulky v §5.5.** Žádné `lead_submit`, `generate_lead`, žádné vlastní názvy.
- **Žádné přímé volání `fbq()` ani `gtag()` v kódu LP.** Pixel i GA běží výhradně z GTM. Pokud je v HTML základní kód pixelu (`fbq('init', …)`), odstranit.
- **Neměnit tvar `eventDetails` (gateway) ani `leadCapture` / `form_sent` (GTM).** Pole navíc jsou v pořádku, přejmenování nebo vynechání ne. Do gateway jde **plný** `eventDetails` podle §5.1 včetně atribučních polí — nezkracovat na minimum.
- **Consent gating řeší modul, ne LP.** Atribuční a identifikační pole se bez souhlasu posílají jako `""` / `null` (§5.1a). Nikdy je nevyplňuj „náhradní" hodnotou.
- **Modul patří na každou stránku webu**, ne jen na LP s formulářem (§4.1) — jinak se atribuce ztratí při prvním prokliku jinam.
- **Žádné cookies ani storage před souhlasem.** Modul to řeší sám, LP nesmí nic ukládat vlastní cestou.
- **Jeden submit = jeden `form_sent` na `lead_id`.** Retry po chybě gateway drží stejné `lead_id`, modul to řeší.
- **Gateway klíč** patří do konfigurace jen po výslovném souhlasu vlastníka LP (viz §8).

---

## 2. Co potřebuješ vědět předem (vstupy)

| Vstup | Kde vzít | Příklad (LP Rekonstrukce) |
|---|---|---|
| `tenant_id` | manuál §1.3, potvrzuje správce CRM | `byty_nove` |
| `gw_lead_source` | kód zdroje leadu od CRM | `ACQ-LP-REK-DD_SL_50K` |
| `gw_lead_products` | produktové kódy | `['REK']` |
| `product` / `product_type` | kód produktu / slovní typ | `REK` / `rekonstrukce` |
| `form_id` / `form_name` | ID formuláře pro GTM (dohodnout, ať se neliší mezi LP) | `MULTI_STEP_FORM_REK` / `kontakt-rek-domidomi` |
| `company` | značka | `domidomi` |
| `gateway_url` | manuál §1.1: PROD `cwertkgbliffhzrynrxt`, DEV `vdgvdjdjsdbncudzzibx` | PROD |
| `gateway_key` | od správce gateway (jiný pro DEV a PROD) | `gw_…` |
| `make_webhook_url` | Make webhook dané LP = záloha leadu hned po submitu + log; od správce Make | `https://hook.eu1.make.com/…` |
| `recaptcha_site_key` | reCAPTCHA v3 **site key** pro doménu LP (secret key patří jen do Make, nikdy do LP) | `6LfcdPUs…` |
| CMP | Cookiebot na LP? Pokud ne, použije se `lp-consent.js` | `lp-consent.js` |
| `privacy_url` | odkaz na zásady ochrany osobních údajů (do cookie lišty) | `https://domidomi.cz/podminky-ochrany-osobnich-udaju/` |
| Otázky kvízu | co LP sbírá (typ, rozsah, velikost, PSČ…) | Typ / Rozsah / Velikost / PSČ |

---

## 3. Postup krok za krokem

### Krok 1 – Hlavička: cookie lišta → GTM → konfigurace → modul (v tomto pořadí)

```html
<!-- 1) dataLayer + cookie lišta + Consent Mode default — MUSÍ být před GTM -->
<script>window.dataLayer = window.dataLayer || [];</script>
<script>window.LP_CONSENT_CONFIG = { brand_color: '#E30A1A', privacy_url: 'https://…/ochrana-osobnich-udaju/' };</script>
<script src="lp-consent.js"></script>
<!-- (má-li LP Cookiebot, místo lp-consent.js sem patří Cookiebot script s data-cbid; Consent Mode pak řeší jeho GTM šablona) -->

<!-- 2) GTM snippet -->
<script>(function(w,d,s,l,i){ … })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- 3) konfigurace měření + modul -->
<script>
window.LP_TRACKING_CONFIG = {
  gateway_url: 'https://cwertkgbliffhzrynrxt.supabase.co/functions/v1/make-server-9924f985/lead-gateway/ingest',
  gateway_key: '',                 // DOPLNIT (x-gateway-key)
  make_webhook_url: '',            // DOPLNIT: Make webhook dané LP (záloha + log)
  log_gateway_result: true,
  recaptcha_site_key: '',          // reCAPTCHA v3 site key
  company: 'domidomi',
  product: 'REK',
  product_type: 'rekonstrukce',
  form_name: 'kontakt-rek-domidomi',
  form_id: 'MULTI_STEP_FORM_REK',
  tenant_id: 'byty_nove',
  gw_lead_source: 'ACQ-LP-REK-DD_SL_50K',
  gw_customer_type: 'B2C',
  gw_lead_products: ['REK']
};
</script>
<script src="lp-tracking.js"></script>
```

Konfigurace musí být definovaná **před** načtením modulu. Modul při načtení uloží atribuci z URL **jen do paměti** a naváže CTA/tel/scroll eventy.

### Krok 2 – reCAPTCHA v3 (pokud LP používá)

```html
<script src="https://www.google.com/recaptcha/api.js?render=SITE_KEY" async defer></script>
<style>.grecaptcha-badge { visibility: hidden !important; }</style>
```

Při skrytém badge je **povinná** textová zmínka na stránce (např. v patičce):

```html
<span>Chráněno reCAPTCHA – platí <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Ochrana soukromí</a>
a <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Smluvní podmínky</a> Google.</span>
```

### Krok 3 – Označit CTA tlačítka a odkaz na nastavení cookies

Každé tlačítko/odkaz vedoucí k formuláři dostane `data-cta="<umístění>"`:

```html
<a href="#poptavka" data-cta="hero-primary">Získat slevu 50 000 Kč</a>
```

Konvence názvů: `hero-primary`, `header-primary`, `bento-primary`, `final-primary`, `mobile-sticky`, `popup-primary`, `pkg-<balíček>`, `proces-finish`. Poslední kliknuté CTA se propíše do `form_sent.lead_cta` a `leadCapture.eventDetails.leadCTA` jako `"hero-primary - Získat slevu 50 000 Kč"` (jinak `"none"`).

Do patičky přidej odkaz, který znovu otevře cookie lištu:

```html
<a href="#" data-consent-open>Nastavení cookies</a>
```

### Krok 4 – Napojit formulář

```js
var LPT = window.LPTracking;
LPT.observeForm(document.getElementById('lead-form-host'));   // view_form / begin_form

/* přechod na další krok multi-step formuláře */
function goNext() { state.step++; LPT.formStep(state.step + 1, STEPS[state.step].key); render(); }

/* neúspěšná klientská validace */
if (!value) { LPT.formError('size', 'empty'); return; }
if (!pattern.test(value)) { LPT.formError('location', 'pattern'); return; }
form.addEventListener('invalid', function (e) { LPT.formError(e.target.name || 'consent', 'invalid'); }, true);

/* submit — nevolej fetch sám */
form.addEventListener('submit', function (e) {
  e.preventDefault();
  var fd = new FormData(form);
  if ((fd.get('website') || '').trim()) { showSuccess(); return; }   // honeypot
  setLoading(true);
  LPT.sendLead({
    name:  fd.get('name'),        // "Jméno Příjmení" – modul rozdělí podle první mezery
    phone: fd.get('phone'),
    email: fd.get('email'),
    zip:   answers.location,      // PSČ (modul vytáhne 5 číslic)
    type:  answers.type,          // → product_variant / productVariant + note "Typ: …"
    scope: answers.scope,         // → productParameters.scope + note "Rozsah: …"
    size:  answers.size           // → productParameters.size + note "Velikost: …"
  }, {
    onSuccess: function (gw, payload) { showSuccess(); },                       // result success i fallback
    onError:   function (gw, payload) { setLoading(false); showError('Odeslání se nezdařilo, zkuste to prosím znovu.'); }
  });
});
```

`onError` přijde jen když gateway lead **výslovně odmítne** (`success: false` / `accepted: false`). Uživatel může odeslat znovu: modul drží stejné `lead_id`, `form_sent` se znovu neodpálí. `onSuccess` přijde i při výpadku sítě (`result: "fallback"`, lead je v Make ze zálohy). Ať se stane cokoli, jeden z hooků přijde nejpozději do 7 s.

### Krok 5 – Přizpůsobit kvíz dané LP

```js
LPT.sendLead({
  name, phone, email, zip,
  type: 'Rodinný dům',
  note_fields: { 'Typ': 'Rodinný dům', 'Střecha': 'sedlová', 'Spotřeba': '4 MWh' },  // → note "Typ: …---Střecha: …---Spotřeba: …"
  extra: { roof: 'sedlová', consumption: '4 MWh' },                                    // → user_data.custom_roof, custom_consumption (Make)
  productDetail: { productVariant: 'Rodinný dům', productParameters: { power: '8 kWp' } },
  additionalUserData: { roofType: 'sedlová', ownerOfProperty: 'ano' },                // jen vyplněná pole, zbytek zůstane "null"
  electricConsumption: { unit: 'MWh', amount: '4', period: 'rok', cost: '32000' },
  contactTime: { callTime: 'dopoledne', meetTime: 'none' }
}, hooks);
```

Klíče v `additionalUserData` / `electricConsumption` / `contactTime` jsou pevně dané CRM (§5.4), nevymýšlej nové.

### Krok 6 – Otestovat lokálně (§6)

### Krok 7 – DEV → PROD

1. `gateway_url` na DEV + DEV klíč. Pošli testovací lead s **unikátním** e-mailem a telefonem.
2. Z odpovědi vezmi `gateway_log_id`, ověř `GET …/lead-gateway/result/<id>` → `status: completed`.
3. Přepni `gateway_url` + `gateway_key` na PROD.

### Krok 8 – GTM (dělá analytika)

Triggery *Custom Event* na `form_sent` (konverze GA4 + Meta Lead, dedup přes `lead_id`) a `leadCapture` (datový event). Consent Mode řeší GTM; LP posílá `consent` default/update přes `lp-consent.js` (nebo Cookiebot šablonu). Bez triggerů se konverze **neměří** (manuál §3.4).

### Krok 9 – URL parametry v reklamě (§4)

---

## 4. URL parametry reklamy

Meta Ads → reklama → *URL parameters*:

```
utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&campaignId={{campaign.id}}&adsetId={{adset.id}}&adId={{ad.id}}
```

Google Ads (final URL suffix):

```
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&campaignId={campaignid}&adsetId={adgroupid}&adId={creative}
```

**`gclid` / `gbraid` / `wbraid` se do suffixu nepíšou** — nejsou to ValueTrack parametry. Doplňuje je **auto-tagging** Google Ads (Nastavení účtu → *Automatické označování* = zapnuto). Na iOS 14.5+ Google u kliků z aplikací (Google app, YouTube app…) nesmí poslat `gclid`, místo něj posílá `gbraid` (app → web, **tohle nás zajímá**) nebo `wbraid` (web → app, u LP prakticky nenastane, modul ho čte pro jistotu). Klik z Google vyhledávání v Safari posílá dál normální `gclid`. Proto:

- auto-tagging musí být **zapnutý**, jinak přijde jen `utm_*` a žádné click ID,
- žádný redirect (zkracovač, cookie lišta, kanonizace URL, přesměrování z `/` na `/cz/`) **nesmí zahazovat query string** — modul čte parametry z URL, kde se stránka reálně načte,
- v Meta Ads stejně tak: `fbclid` doplňuje Meta sama, do *URL parameters* se nepíše.

Modul čte: `campaignId`, `adsetId`, `adId` (i `campaign_id`, `adset_id`, `ad_id`, u kampaně fallback `utm_id`), všech pět `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, `ttclid`, `sznclid`.

`sourcePlatform` se odvodí: `META` (fbclid / utm_source facebook, instagram, meta), `GOOGLE` (gclid, gbraid, wbraid / utm_source google*), `SEZNAM`, `TIKTOK`, `BING`, jinak `utm_source` velkými písmeny.

### 4.1 Uložení atribuce (first touch / last touch)

Atribuce se musí zachytit **při prvním příchodu** a přežít proklik na jinou stránku. Proto dvě vrstvy:

| Vrstva | Kdy se zapíše | Životnost | Co obsahuje |
|---|---|---|---|
| `sessionStorage` `lp_attr_first` / `lp_attr_last` | **hned při načtení**, bez souhlasu | do zavření záložky | utm, campaignId/adsetId/adId, click IDs, landingUrl, referrer, timestamp |
| cookie `_attribution_first` (90 dní) / `_attribution_last` (30 dní) | až po **marketingovém** souhlasu | 90 / 30 dní | totéž |

Pravidla:

- **`sessionStorage` spadá pod ePrivacy stejně jako cookie** (je to zápis do zařízení) — argument pro zápis bez souhlasu není „není to cookie", ale **nezbytnost**: drží jen probíhající návštěvu, zaniká se záložkou, neslouží k profilování a je nutný k tomu, aby poptávka, kterou uživatel sám odesílá, došla se správným přiřazením. Cookie (atribuce napříč návštěvami) až po souhlasu. Pokud právník trvá na souhlasu i pro `sessionStorage`, vypni ho přepínačem `attribution_session_storage: false` — modul pak funguje jako ve v2.0 (atribuce jen v paměti stránky).
- `first` se zapisuje **jen když ještě neexistuje** (ani v cookie, ani v `sessionStorage`), `last` se přepisuje při každém příchodu s neprázdnou atribucí.
- Po udělení souhlasu modul obsah `sessionStorage` **překlopí do cookies** — first touch z návštěvy před souhlasem se tím neztratí.
- **Přímý příchod** (bez parametrů **a** bez externího referreru) `last` **nepřepisuje** — návrat z e-mailu bez utm nesmaže placený zdroj. Příchod s externím referrerem bez parametrů (organic, odkaz z jiného webu) `last` **přepisuje**: utm i click IDs prázdné, `referrer` a `landingUrl` vyplněné, `sourcePlatform` prázdný.
- **`lp-tracking.js` musí být na každé stránce webu**, kam může uživatel z reklamy dorazit nebo odkud může jít k formuláři — ne jen na stránce s formulářem. Na stránkách bez formuláře stačí config `{ company: '…', attribution_only: true }` (§10), sběr atribuce běží vždy.
- Formulář na jakékoli stránce bere atribuci z tohoto úložiště, ne z aktuální URL.

---

## 5. Datové struktury (neměnit)

### 5.0 Krok 0 – záloha do Make

Úplně první věc po submitu, ještě před reCAPTCHA a před gateway: POST plného payloadu (§5.3, `type: "lead"`) na Make webhook s `keepalive`. Když člověk pošle lead a hned zavře prohlížeč, tahle zpráva stejně dojde.

### 5.1 Krok 1 – POST do Lead Gateway

```http
POST {gateway_url}
Content-Type: application/json
x-gateway-key: {gateway_key}
```

```json
{
  "eventDetails": {
    "tenantId": "byty_nove",
    "leadSource": "ACQ-LP-REK-DD_SL_50K",
    "customerType": "B2C",
    "leadProducts": ["REK"],
    "note": "Lead odeslaný z Webu. Typ: Byt---Rozsah: Kompletní rekonstrukce---Velikost: 68 m²",

    "userData": {
      "name": "Jan", "surname": "Novák",
      "email": "jan@example.cz", "phone": "+420700000000",
      "zip": "11000", "city": "neznáme", "address": "neznáme"
    },

    "leadId": "8f3b1c0e-4a2d-4f7b-9c31-5e6a7b8c9d01",
    "submittedAt": "2026-09-18T09:41:22.481Z",
    "formId": "MULTI_STEP_FORM_REK",
    "pageUrl": "https://www.domidomi.cz/rekonstrukce-bytu/",
    "landingUrl": "https://www.domidomi.cz/rekonstrukce-bytu/?utm_source=facebook&…&fbclid=IwAR…",
    "referrer": "https://l.facebook.com/",

    "campaignId": "120247164763920504",
    "adsetId": "120247164763930504",
    "adId": "120247164764010504",
    "sourcePlatform": "META",
    "utmSource": "facebook",
    "utmMedium": "paid",
    "utmCampaign": "META-WEB-DomiDomi-CZ-B2C-REK-rekonstrukce2026-09062026",
    "utmContent": "",
    "utmTerm": "",

    "gclid": "",
    "gbraid": "",
    "wbraid": "",
    "fbclid": "IwAR…",
    "msclkid": "",
    "sznclid": "",
    "gaClientId": "1234567890.1712345678",
    "device": "mobile",

    "firstTouch": {
      "utmSource": "google", "utmMedium": "cpc",
      "utmCampaign": "SRCH-Brand", "utmContent": "", "utmTerm": "",
      "campaignId": "22112233", "adsetId": "", "adId": "",
      "sourcePlatform": "GOOGLE",
      "gclid": "Cj0KCQ…", "gbraid": "", "wbraid": "", "fbclid": "", "msclkid": "", "sznclid": "",
      "landingUrl": "https://www.domidomi.cz/?utm_source=google&…",
      "referrer": "https://www.google.com/",
      "timestamp": "2026-09-11T18:03:10.002Z"
    },

    "consent": {
      "status": "granted",
      "marketing": true,
      "analytics": true,
      "timestamp": "2026-09-18T09:39:58.114Z"
    }
  }
}
```

Pravidla (manuál §1.1): `tenantId` camelCase **uvnitř** `eventDetails`; `userData` musí mít aspoň `email` nebo `phone`; neznámé hodnoty v `userData` = řetězec `"neznáme"`. Do gateway jde **jen** `eventDetails`.

Doplňující pravidla v2.1:

- **Kořenová utm/click pole = last touch.** First touch je vždy jen ve vnořeném objektu `firstTouch` (nikdy se nemíchá do kořene).
- **Prázdné atribuční pole = `""`**, ne `"neznáme"` a ne vynechaný klíč. Pravidlo `"neznáme"` platí jen pro `userData` (požadavek CRM).
- **`leadId`** = UUID v4 vygenerované na webu při prvním submitu, nezávislé na CRM. Při retry po chybě gateway se **nemění** (dedup na straně CRM i GA/Meta).
- **`submittedAt`** = ISO 8601 UTC, okamžik kliknutí na *Odeslat* u **daného pokusu** (při retry se aktualizuje, `leadId` ne). Není totožné s `form_sent.timestamp` (ten vzniká až při odchodu POSTu, po reCAPTCHA — rozdíl řádově sekundy). Klíč pro párování je vždy `leadId`, ne čas.
- **`pageUrl`** = URL stránky s formulářem, vždy bez query stringu. **`landingUrl`** = URL příchodu, který nastavil `last` touch (§4.1) — ne nutně stránka s formulářem; s query stringem jen při marketingovém souhlasu (§5.1a). `firstTouch.landingUrl` = URL úplně prvního příchodu.
- **`referrer`** = bez marketingového souhlasu jen origin (`https://l.facebook.com/`), se souhlasem plná URL včetně cesty a query.
- **`device`** = `"mobile"` / `"tablet"` / `"desktop"`, odvozeno z UA. Plný `userAgent` do gateway **nejde**, jen do Make (§5.3).
- **`msclkid`** (Bing) a **`sznclid`** (Seznam Sklik) jdou do gateway stejně jako ostatní click IDs — prázdný řetězec, pokud v URL nebyly. **`ttclid`** (TikTok) do gateway **nejde**, zůstává jen v Make payloadu (§5.3); doplnit až když ho CRM bude vyhodnocovat.
- **`gaClientId`** = hodnota z cookie `_ga` bez prvních dvou segmentů (`GA1.1.1234567890.1712345678` → `1234567890.1712345678`). Posílá se **jen při analytickém souhlasu**, jinak `""` (bez souhlasu cookie `_ga` při Consent Mode stejně nevznikne). Slouží k napojení leadu na GA4 session v BigQuery — viz právní poznámka v §8.
- **Gateway neznámá pole neodmítá** (§1), ale aby se do CRM propsala, musí je **správce gateway namapovat**. Bez toho jen projdou do logu. Ověřit DEV leadem — kontrola v §7. LP je posílá vždy, i když CRM ještě mapování nemá.

### 5.1a Consent gating polí v `eventDetails`

Řez se dělá na LP, ne v CRM. Hodnota bez souhlasu je vždy prázdný řetězec `""` (klíč zůstává).

| Pole | Bez souhlasu | Vyžaduje |
|---|---|---|
| `tenantId`, `leadSource`, `customerType`, `leadProducts`, `note`, `userData` | posílá se vždy | — (vyřízení poptávky, kterou uživatel odeslal) |
| `leadId`, `submittedAt`, `formId`, `device` | posílá se vždy | — |
| `pageUrl`, `referrer` (jen origin) | posílá se vždy | — |
| `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm` | posílá se vždy | — (kampaňové označení, ne identifikátor osoby; uložení přes `sessionStorage` řeší §4.1) |
| `campaignId`, `adsetId`, `adId`, `sourcePlatform` | posílá se vždy | — (dtto) |
| `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, `sznclid` | `""` | marketing (click ID = identifikátor kliku/uživatele) |
| `landingUrl` s query stringem, `referrer` jako plná URL | bez query / jen origin | marketing |
| `gaClientId` | `""` | **analytics** |
| `firstTouch` | objekt se posílá; v něm `gclid`/`gbraid`/`wbraid`/`fbclid`/`msclkid`/`sznclid` = `""`, `landingUrl` bez QS, `referrer` jen origin; utm/campaignId/timestamp zůstávají | marketing (jen click IDs a plné URL) |
| `consent` | `{ "status": "unknown", "marketing": false, "analytics": false, "timestamp": null }` | — |

Při **odmítnutí** souhlasu je tvar stejný jako bez souhlasu, jen `consent.status` = `"denied"` (nebo `"partial"`) a `timestamp` vyplněný.

### 5.2 Krok 2 – odpověď gateway

```json
{ "success": true, "accepted": true, "gateway_log_id": "931ab43a-…", "person_id": null, "campaign_lead_id": null, "warnings": [] }
```

Modul zvládne i obalené tvary `{ data: {…} }` a `[ { data: {…}, statusCode: 202 } ]`. `gatewayID` = `gateway_log_id`. Výsledek: `success` (success && accepted), `error` (odpověděla, ale odmítla), `fallback` (neodpověděla: timeout 5 s / chyba sítě; `gatewayID` prázdné, lead je v Make ze zálohy).

### 5.3 Plný payload (Make) – řez podle souhlasu se dělá na LP

| Vždy | Jen marketing = granted | Nikdy do Make |
|---|---|---|
| `eventDetails`, `user_data`, `lead_uuid` / `event_id`, `form_id`, `company`, `product` | `gclid`, `fbclid`, `gbraid`, `wbraid`, `msclkid`, `ttclid`, `sznclid` (kořen i `marketing.first_touch` / `last_touch`) | `session.session_id` (párování s GA přes `lead_id` v BigQuery) |
| `utm_*`, `campaignId` / `adsetId` / `adId`, `sourcePlatform`, `session.device` | `marketing.fbp`, `marketing.fbc`, `session.user_agent` | |
| `page.url` a `landingUrl` **bez** query stringu, `page.referrer_domain`, `consent`, `security.recaptcha_token`, `recaptchaToken` | `marketing.raw_query_string`, `page.url` a `landingUrl` **s** query stringem, `page.referrer_url`, `referrer` (plná URL) | |
| | `session.client_id` = `gaClientId` z cookie `_ga` — **jen při analytickém souhlasu** (v2.1, dřív se neposílal vůbec) | |

Bez marketingového souhlasu jsou klíče z prostředního sloupce `null` / prázdné. `_fbc` se **nikdy nevytváří vlastním kódem**, čte se jen cookie `_fbc`, kterou nastaví pixel z GTM.

Blok `consent`:

```js
consent_status:             "granted" | "partial" | "denied" | "unknown",
consent_ad_storage:         marketing ? "granted" : "denied",
consent_ad_user_data:       marketing ? "granted" : "denied",
consent_ad_personalization: marketing ? "granted" : "denied",
consent_analytics_storage:  analytics ? "granted" : "denied",
consent_timestamp:          known ? "<ISO>" : null
```

Do gateway jde zkrácená verze téhož (§5.1): `consent.status` = `consent_status`, `consent.marketing` / `consent.analytics` = boolean, `consent.timestamp` = `consent_timestamp`. CRM nepotřebuje čtyři Consent Mode klíče, potřebuje vědět, jestli smí lead použít pro remarketing a jestli je dohledatelný v GA4.

### 5.4 dataLayer event `form_sent` (konverzní)

Odpálí se ve stejném okamžiku, kdy odchází POST do gateway (po klientské validaci a získání captcha tokenu), **před** odpovědí gateway. Bez PII, bez `gatewayID`, 1× na `lead_id`.

```js
dataLayer.push({
  event: "form_sent",
  lead_id: "<lead_uuid>",                    // UUID vygenerované při prvním submitu, stejné i při retry
  lead_source: "ACQ-LP-REK-DD_SL_50K",
  form_id: "MULTI_STEP_FORM_REK",
  tenant_id: "byty_nove",
  product_type: "rekonstrukce",
  product_variant: "<custom_type>",
  lead_cta: "hero-primary - Získat slevu 50 000 Kč",   // nebo "none"
  timestamp: "<ISO>"
});
```

### 5.5 dataLayer event `leadCapture` (datový)

```js
dataLayer.push({
  event: "leadCapture",
  eventDetails: {
    leadId: "<lead_uuid>",                              // = form_sent.lead_id
    leadSource: "ACQ-LP-REK-DD_SL_50K",
    leadCTA: "hero-primary - Získat slevu 50 000 Kč",
    formId: "MULTI_STEP_FORM_REK",
    adId: "120247164764010504",                          // stejná hodnota jako do GW
    gatewayID: "931ab43a-…",                             // gateway_log_id; "" při fallback/error
    tenantId: "byty_nove",
    pageURL: "https://www.domidomi.cz/rekonstrukce-bytu/", // bez query stringu
    URLParams: "?utm_source=facebook&…",
    referrerURL: "https://l.facebook.com/",
    result: "success" | "fallback" | "error",
    timestamp: "<ISO>"
  },
  productDetail: { productType: "rekonstrukce", productVariant: "Byt", currency: "null", price: "null",
                   productParameters: { scope: "Kompletní rekonstrukce", size: "68 m²" } },
  userData: { zip: "11000", city: "neznáme", name: "Jan", email: "jan@example.cz", phone: "+420700000000", address: "neznáme", surname: "Novák" },
  additionalUserData: { floorArea: "null", roofPitch: "null", orientation: "null", conservationArea: "null",
                        roofType: "null", ownerOfProperty: "null", amountOfLivingPerson: "null",
                        buildingType: "null", currentHeatSolution: "null" },
  electricConsumption: { unit: "null", amount: "null", period: "null", cost: "null" },
  contactTime: { callTime: "none", meetTime: "none" }
});
```

`gtm.uniqueEventId` do pushe nedávat (doplňuje GTM).

### 5.6 Všechny dataLayer eventy (LP pushuje JEN tyto)

| Event | Kdy | Parametry |
|---|---|---|
| `view_form` | formulář ≥ 40 % ve viewportu, 1× | `form_name`, `form_id`, `company`, `product` |
| `begin_form` | první interakce s formulářem, 1× | `form_name`, `form_id`, `company`, `product` |
| `form_step` | přechod na další krok multi-step formuláře | `{ step: 2, step_name: "scope", form_id }` |
| `form_error` | neúspěšná klientská validace | `{ field: "phone", error: "empty" \| "pattern" \| "invalid", form_id }` |
| `cta_click` | klik na `[data-cta]` | `cta_location`, `cta_text` |
| `phone_click` | klik na `tel:` | `tel` |
| `scroll_depth` | 25 / 50 / 75 / 100 % | `depth_percent` |
| `form_sent` | při odchodu POSTu do gateway, před odpovědí, 1× na `lead_id` | §5.4 |
| `leadCapture` | po odpovědi gateway (nebo po fallbacku) | §5.5 |
| `cookie_consent_update` | po volbě v cookie liště (`lp-consent.js`) | `consent_status`, `consent_marketing`, `consent_analytics`, `consent_source` |

Zrušeno oproti v1: `lead_submit`, `generate_lead`, přímé `fbq('track','Lead')`, přímé `gtag('event','generate_lead')`.

### 5.7 Zprávy na Make webhook

| `type` | Kdy | Obsah |
|---|---|---|
| `lead` | okamžitě po submitu, před reCAPTCHA i gateway | plný payload (§5.3) + `attempt` (pořadí pokusu), `security.recaptcha_token` = `null` |
| `gateway_result` | po odpovědi gateway / fallbacku | `lead_uuid`, `event_id`, `attempt`, `tenantId`, `email`, `phone`, `gateway_log_id`, `recaptcha_token`, `result` (`success` / `fallback` / `error`), `http_status`, `error`, `response_raw` (max 2000 znaků), `page_url`, `timestamp` |

Make: Router podle `{{1.type}}`. siteverify reCAPTCHA (secret jen v Make!) ve větvi `gateway_result` s `{{1.recaptcha_token}}`; token platí 2 minuty a je jednorázový. Doporučený log: Google Sheets, list *Leads* (větev `lead`) a *Gateway* (větev `gateway_result`). Rychlé dohledání problému: `result = error` / `fallback`, sloupec `error` (`timeout`, `network: …`, `HTTP 401` = špatný klíč, text chyby z gateway).

---

## 6. Test bez odeslání skutečného leadu

Otevři LP s testovacími parametry (v anonymním okně, ať nemáš starý souhlas):

```
?utm_source=facebook&utm_medium=paid&utm_campaign=TEST&campaignId=111&adsetId=222&adId=333&fbclid=TEST
```

V konzoli **před** odesláním formuláře podstrč odpovědi (nic se nepošle ven):

```js
window.fetch = function (url, o) {
  console.log('POST', url, o.headers, o.body && JSON.parse(o.body));
  return new Promise(r => setTimeout(() => r({ status: 202, text: () => Promise.resolve(JSON.stringify(
    url.includes('lead-gateway') ? { success: true, accepted: true, gateway_log_id: 'TEST-GW-ID' } : 'Accepted')) }), 200));
};
```

**Před souhlasem** (lišta zobrazená): `document.cookie` neobsahuje `_attribution_*`; `LPTracking.getConsent()` → `known: false`. Odešli lead → v payloadu `type: "lead"` je `fbclid: ""`, `landingUrl` bez query stringu, `consent.consent_status: "unknown"`.

**Po „Přijmout vše“**: cookies `lp_consent`, `_attribution_first`, `_attribution_last` existují; nový lead má `fbclid: "TEST"`, plné URL, `consent_status: "granted"`.

**Musí platit vždy:**

- první POST po submitu jde na Make webhook s `type: "lead"` (před reCAPTCHA),
- pak `POST …/lead-gateway/ingest` s hlavičkou `x-gateway-key` a tělem jen `{ eventDetails: {…} }`,
- `form_sent` je v dataLayeru **před** `leadCapture`, bez `gatewayID`, se stejným `lead_id` jako `leadCapture.eventDetails.leadId`,
- `leadCapture.eventDetails.result === "success"`, `adId === "333"`, `gatewayID === "TEST-GW-ID"`,
- v těle POSTu na gateway je **plný** `eventDetails` (§5.1): `leadId` je UUID v4 a rovná se `form_sent.lead_id`, `submittedAt` je ISO čas (o pár sekund dřív než `form_sent.timestamp` — to je v pořádku), `campaignId === "111"`, `adsetId === "222"`, `adId === "333"`, `sourcePlatform === "META"`, `device` vyplněné, `consent.status` odpovídá stavu lišty,
- **před souhlasem**: `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, `sznclid`, `gaClientId` jsou `""`, `landingUrl` bez query stringu; **po souhlasu**: `fbclid === "TEST"`, `gaClientId` neprázdné (existuje-li `_ga`), `landingUrl` s query stringem,
- `firstTouch` existuje i při prvním příchodu (= stejné hodnoty jako last touch), po prokliku na jinou stránku a návratu zůstává **původní**,
- druhá stránka webu bez utm parametrů: `sessionStorage.lp_attr_last` se **nepřepíše** na prázdno a formulář tam odešle stejnou atribuci,
- pořadí: `cta_click`, `view_form`, `begin_form`, `form_step`…, `form_sent`, `leadCapture`; **žádné** `lead_submit` / `generate_lead`,
- `typeof fbq` i `typeof gtag` na stránce je `"undefined"` (dokud je nenačte GTM).

Chybová větev: vrať `{ success: false }` → `result: "error"`, formulář zobrazí chybu, tlačítko se odemkne; druhé odeslání má stejné `lead_id` a `form_sent` zůstává 1×. Fallback: nech `fetch` na gateway spadnout (`reject`) → `result: "fallback"`, uživatel vidí poděkování.

```js
dataLayer.filter(x => x.event === 'form_sent' || x.event === 'leadCapture')
```

Po nasazení stejný postup **bez** podstrčeného `fetch` s unikátním testovacím e-mailem/telefonem → `gatewayID` musí být reálné UUID.

---

## 7. Kontrolní seznam před předáním

- [ ] `LP_TRACKING_CONFIG` vyplněný, `gateway_key` a `tenant_id` potvrzené správcem CRM
- [ ] Pořadí v `<head>`: dataLayer → `lp-consent.js` (nebo Cookiebot) → GTM → config → `lp-tracking.js`
- [ ] Všechna CTA mají `data-cta`, v patičce je odkaz `[data-consent-open]`
- [ ] `observeForm` zavolaný, `formStep` / `formError` napojené na kroky a validaci
- [ ] Submit volá jen `LPTracking.sendLead`, žádný vlastní fetch, žádné `fbq` / `gtag` v HTML
- [ ] reCAPTCHA badge skrytý + textová zmínka
- [ ] `make_webhook_url` vyplněný, Make má Router podle `type`, siteverify ve větvi `gateway_result`
- [ ] Test dle §6 prošel (před i po souhlasu, retry, fallback)
- [ ] DEV lead → `status: completed`, pak přepnuto na PROD
- [ ] GTM triggery `form_sent` + `leadCapture`, Consent Mode (analytika)
- [ ] URL parametry v reklamách dle §4, v Google Ads zapnutý **auto-tagging** (gclid/gbraid/wbraid)
- [ ] Žádný redirect na doméně nezahazuje query string
- [ ] `lp-tracking.js` je na **všech** stránkách webu, ne jen na LP s formulářem (§4.1)
- [ ] Ověřeno, že gateway přijímá plný `eventDetails` (§5.1) — testovací lead prošel do CRM s atribucí
- [ ] `gaClientId` posílán jen při analytickém souhlasu a **zásady ochrany osobních údajů** ho zmiňují (§8)
- [ ] Na web nahrány `index.html`, `lp-tracking.js`, `lp-consent.js`

---

## 8. Bezpečnost a známá omezení

- **Gateway klíč ve statické LP je veřejně čitelný** (zdroják stránky). Manuál §1.1 doporučuje klíč držet mimo veřejný kód. Na LP Rekonstrukce je v kódu na základě rozhodnutí správce gateway (7. 9. 2026). Bezpečnější varianta: `gateway_url` nasměrovat na vlastní proxy (Make s Webhook Response, Netlify/Cloudflare funkce), která klíč doplní a vrátí odpověď gateway 1:1; modul pak funguje beze změny s prázdným `gateway_key`.
- CORS: gateway povoluje hlavičku `x-gateway-key` a origin LP (ověřeno 7. 9. 2026 pro `www.domidomi.cz`). Při nové doméně ověřit preflight (`OPTIONS` s `Access-Control-Request-Headers: content-type, x-gateway-key`).
- Timeouty: reCAPTCHA 3 s, fetch na gateway 5 s, tvrdý fallback 7 s (konfigurovatelné).
- Spam: LP neblokuje leady podle reCAPTCHA skóre. Skóre se ověřuje v Make (log). Blokovat před CRM může jen gateway.
- **`gaClientId` (v2.1)** je pseudonymní identifikátor z cookie `_ga` — podle GDPR **osobní údaj**. Podmínky pro nasazení: (1) posílá se jen při analytickém souhlasu, (2) zásady ochrany osobních údajů uvádějí, že měřicí identifikátor spojujeme s poptávkou kvůli vyhodnocení zdrojů, (3) neposílá se nikam mimo gateway/CRM a Make, (4) `session_id` zůstává mimo payload (párování v BigQuery přes `lead_id`). Bez splnění (1) a (2) pole nenasazovat.
- **`device` vs `userAgent` (v2.1)**: do gateway jde jen hrubá kategorie `mobile` / `tablet` / `desktop` — sama o sobě nikoho neidentifikuje, nečte se z úložiště zařízení a stačí na segmentaci reportů. Plný `userAgent` (fingerprintovatelný) zůstává jen v Make payloadu a jen při marketingovém souhlasu, pro debug. Doporučení: takto to nechat, neposílat plný UA do CRM.
- **`sessionStorage` před souhlasem (§4.1)**: je to zápis do zařízení, ePrivacy na něj dopadá stejně jako na cookie. Ukládá se do něj jen atribuce vlastní návštěvy, nepřežije zavření záložky a neslouží k profilování napříč weby. Vykládáme to jako nezbytné pro doručení služby, kterou uživatel sám vyžádal (odeslání poptávky se správným přiřazením). Je to výklad, ne jistota — pokud ho právník klienta neuzná, vypnout `attribution_session_storage`.
- `lp-consent.js` je minimální lišta bez správy scriptů třetích stran; blokaci tagů před souhlasem zajišťuje Consent Mode v GTM. Pokud právník vyžaduje plnou CMP (záznam souhlasů, seznam cookies), nasadit Cookiebot; modul ho detekuje automaticky.

---

## 9. Reference

- `marketing-landingpage-manual.md` – Lead Gateway (§1), měřicí ID (§3.1), díra v GTM (§3.4)
- Specifikace měření a souhlasu od analytiky (8. 9. 2026) – zdroj §5.3–5.6
- LP Rekonstrukce: `rekonstrukce-bytu-a-domu/index.html` – referenční napojení formuláře na modul
- Supabase gateway PROD `cwertkgbliffhzrynrxt` / DEV `vdgvdjdjsdbncudzzibx`

---

## 10. API modulu `lp-tracking.js` (v2.1)

| Volání | Účel |
|---|---|
| `LPTracking.sendLead(answers, hooks)` | celý odesílací flow (§5.0–5.5) |
| `LPTracking.observeForm(el)` | `view_form` / `begin_form` |
| `LPTracking.formStep(n, name)` | `form_step` |
| `LPTracking.formError(field, error)` | `form_error` |
| `LPTracking.getConsent()` | `{ known, marketing, analytics }` z CMP (Cookiebot / LPConsent / `consent_adapter`) |
| `LPTracking.pushDL(event, data)` | obecný push (používat jen pro eventy z §5.6) |
| `LPTracking.config` | výsledná konfigurace |
| `LPTracking.getAttribution()` | `{ first, last }` — aktuální first/last touch z `sessionStorage` / cookies (v2.1) |

Konfigurace navíc:

| Klíč | Default | K čemu |
|---|---|---|
| `consent_adapter` | – | `function () { return { known, marketing, analytics }; }` pro jinou CMP než Cookiebot / LPConsent |
| `attribution_session_storage` | `true` | sběr atribuce do `sessionStorage` před souhlasem (§4.1); `false` = chování v2.0 (jen paměť stránky) |
| `send_ga_client_id` | `true` | posílat `gaClientId` při analytickém souhlasu (§8); `false` pro klienty, kde to neprošlo právním posouzením |
| `attribution_only` | `false` | `true` na stránkách bez formuláře — modul jen sbírá atribuci a scroll/CTA eventy, nevyžaduje gateway config |

`lp-consent.js` (LPConsent): `hasResponse`, `consent.{necessary,statistics,marketing}`, `acceptAll()`, `rejectAll()`, `accept({statistics, marketing})`, `open()`, `on(fn)`, `status()`. Nastavuje Consent Mode `default` (vše denied, `wait_for_update: 500`) před GTM a `update` po volbě; pushuje `cookie_consent_update`; cookie `lp_consent` (365 dní).

---

## 11. Změny ve v2.1 (18. 9. 2026)

| Změna | Kde | Proč |
|---|---|---|
| `eventDetails` do gateway rozšířen z 7 polí na plnou atribuci | §5.1 | CRM dosud dostávalo jen `adId` + `note`; atribuce končila v Make a do reportů zdrojů se nedostala |
| Přidáno `leadId` (UUID v4), `submittedAt`, `formId`, `pageUrl` | §5.1 | vlastní identifikátor nezávislý na CRM + dohledání „lead nedorazil" (kdy, odkud, z jakého formuláře) |
| Přidáno `gbraid` / `wbraid` | §4, §5.1 | kliky z Google/YouTube aplikací na iOS nemají `gclid`, jen `gbraid`; bez něj je ztrácíme |
| Přidáno `gaClientId` (jen při analytickém souhlasu) | §5.1, §5.3, §8 | napojení leadu na GA4 session; dřív bylo `client_id` úplně zakázané |
| Přidáno `device` | §5.1 | segmentace a debug bez posílání plného UA do CRM |
| Přidáno `firstTouch` (kořen = last touch) | §4.1, §5.1 | první i poslední zdroj; dřív se posílal jen poslední |
| Přidán blok `consent` do gateway | §5.1 | CRM hned vidí, jestli lead smí do remarketingu a jestli je viditelný v GA4 |
| Atribuce v `sessionStorage` už před souhlasem (výklad nezbytnosti, vypínatelné) + překlopení do cookies po souhlasu | §4.1 | dřív se držela jen v JS proměnné → ztratila se při jakémkoli prokliku mimo landing page |
| `lp-tracking.js` povinně na všech stránkách webu | §1, §4.1, `attribution_only` | formulář na jiné stránce než landing měl prázdnou atribuci |
| Nové config klíče `attribution_session_storage`, `send_ga_client_id`, `attribution_only` | §10 | vypínače pro klienty s přísnějším právním posouzením |
| Přidány `msclkid` (Bing) a `sznclid` (Sklik) do gateway; `ttclid` zůstává jen v Make payloadu | §5.1 | Bing a Seznam kliky dohledatelné v CRM; TikTok až bude CRM mapovat |
| `userData`: neznámé hodnoty dál `"neznáme"` (beze změny) | §5.1 | požadavek CRM; prázdný řetězec platí jen pro atribuční pole |

**Dopad na `lp-tracking.js`:** modul se musí upravit (sestavení `eventDetails`, `sessionStorage` vrstva, čtení `_ga`, derivace `device`, nové config klíče). Tvar `form_sent` a `leadCapture` zůstává beze změny — GTM nasazení se nemění.
