# UX + copy brief: LP „Fotovoltaika + zateplení střechy s dotací NZÚ“ (Schlieger)

**Verze:** 1.0 · **Datum:** 15. 9. 2026 · **Autor:** CRO/UX
**Cíl stránky:** 1 konverze = lead (jméno, telefon, e-mail, PSČ) z multi-step kvízu. Sekundárně klik na telefon.
**Traffic:** Meta Ads + Google Ads (Search + PMax/Demand Gen), ~80 % mobil, 390 px.
**Tech:** jeden `index.html`, čisté HTML + CSS + vanilla JS, mobile-first, bez frameworků.
**Brand:** červená `#E30A1A` (potvrdit), logo Schlieger, telefon `226 223 800`, Po–Pá 8–16.

> **Zdrojová nabídka (interní):** FVE 3,69 kWp „do vody a domu“ 185 500 Kč vč. 12 % DPH + zateplení šikmé střechy 100 m² za 2 000 Kč/m² = 200 000 Kč. Celkem **385 500 Kč**. Dotace NZÚ 120 000 (FVE) + 200 000 (zateplení) = **320 000 Kč**. **Doplatek 65 500 Kč**, krytí 83 %. Ceny platí do **24. 9. 2026** (datum musí být konfigurovatelné).

---

## 0. Klíčový insight, na kterém stojí celá stránka

Pokud je sazba zateplení 2 000 Kč/m² a dotace na zateplení je také 2 000 Kč/m², pak **zateplení se v celkovém doplatku vůbec neprojeví** – až do stropu stavební části 250 000 Kč (tj. do 125 m²).

```
doplatek = (185 500 + m² × 2 000) − (120 000 + min(m² × 2 000; 250 000))
         = 65 500 Kč   … pro každé m² ≤ 125
         = 65 500 + (m² − 125) × 2 000   … nad 125 m²
```

To je nejsilnější a přitom **pravdivý** prodejní argument stránky: *„Zateplení střechy je dotované korunu za korunu. Platíte jen doplatek za fotovoltaiku – 65 500 Kč, ať máte 60 nebo 125 m².“*
Celá hierarchie sdělení, kalkulačka i H1 z toho vycházejí. Neprodáváme „slevu“, prodáváme **matematiku**.

---

## 1. Publikum, stadium uvědomění, persony, hierarchie sdělení

### 1.1 Cílové publikum

Majitelé rodinných domů s **obydleným/obyvatelným podkrovím** a šikmou střechou, 35–65 let, vlastníci nemovitosti, ČR mimo Prahu-centrum (PSČ je proto kvalifikační pole). Rozhodují typicky ve dvou (partner/ka). Vysoká averze k riziku, nízká důvěra k „dotačním firmám“, střední finanční gramotnost, silná citlivost na „kolik zaplatím ze svého“.

### 1.2 Stadium uvědomění (Schwartz)

| Kanál | Stadium | Co to znamená pro copy |
|---|---|---|
| Google Search („dotace na zateplení střechy“, „fotovoltaika cena“) | **Solution aware** → **Product aware** | Zná řešení, hledá cenu, dodavatele a podmínky. Jde rovnou na čísla, „co je v ceně“, „co není v ceně“, reference. |
| Meta Ads (cold) | **Problem aware** → **Solution aware** | Ví, že platí moc za energie / má studené podkroví. Neví, že jde kombinovat a že zateplení může vyjít „nastejno“. Potřebuje mechanismus + jednoduchou matematiku. |
| Meta retargeting | **Most aware** | Potřebuje jen důvod jednat teď (termín platnosti ceny, volné kapacity) a snížení rizika. |

**Dominantní stadium pro tuto LP = Solution aware.** Proto **H1 nese číslo a mechanismus**, ne obecný benefit. Stránka musí fungovat i pro problem-aware návštěvníka z Meta – proto je hned pod hero blok „Jak to počítáme“, který mechanismus vysvětlí za 15 sekund.

### 1.3 Persony a jejich top námitky

**Persona A – „Počtář Petr“ (42, IT/technik, dům 2005, podkroví obydlené)**
Motivace: návratnost, čísla, technická specifikace. Přečte si, jaký je střídač.
Top námitky:
1. „Kolik to reálně vyrobí a za jak dlouho se mi to vrátí?“
2. „Co přesně tam dáte – jaké panely, jaká vata, jaká tloušťka?“
3. „Není to jen marketing s dotací, kterou stejně nedostanu?“
Co ho konvertuje: konkrétní kusovník, výroba 3 875 kWh/rok, úspora 12 732 Kč/rok, propočet doplatku, sekce „Co není v ceně“.

**Persona B – „Opatrná Olga“ (57, účetní, dům po rodičích, řeší i manžel)**
Motivace: jistota, „ať nás neopíchnou“, kdo to zaplatí předem.
Top námitky:
1. „Musím to celé zaplatit dopředu a čekat na dotaci?“
2. „Co když nám dotaci neschválí – zůstane nám dluh?“
3. „Kdo to bude dělat, jsou to zaměstnanci nebo náhodná parta?“
Co ji konvertuje: jasně popsaný průběh plateb a záloh (FVE záloha 30 %), věta o tom, co se stane, když dotace nevyjde, počet realizací, recenze s obcí/regionem, fotka technika, „nezávazně a zdarma“.

**Persona C – „Spěchající Standa“ (48, podnikatel, střechu stejně chystal řešit)**
Motivace: vyřešit to najednou, minimum vlastní práce, rychlý termín.
Top námitky:
1. „Jak dlouho to bude trvat a budu muset být doma?“
2. „Bude se muset měnit krytina / stavět lešení? Kolik to přihodí?“
3. „Kdy se mi ozvete – nemám čas obvolávat.“
Co ho konvertuje: 4 kroky procesu, doba realizace, „co není v ceně“ bez kliček, „ozveme se do 24 hodin (Po–Pá 8–16)“, klik na telefon.

### 1.4 Hierarchie sdělení (co musí zaznít v tomto pořadí)

1. **Doplatek 65 500 Kč** (z 385 500 Kč) – jediné číslo, které si má návštěvník zapamatovat.
2. **Mechanismus:** dotace NZÚ 320 000 Kč, zateplení dotované korunu za korunu.
3. **Co za to dostanu:** kompletní FVE 3,69 kWp do vody i domu + 100 m² zateplené střechy, vše na klíč.
4. **Kolik ušetřím:** 12 732 Kč/rok jen na elektřině + úspora za vytápění.
5. **Proč Schlieger:** 15+ let, 23 000+ instalací, vlastní montážní týmy, dotace vyřídíme.
6. **Snížení rizika:** nezávazné, zdarma, zaměření technikem, co není v ceně, co když dotace nevyjde.
7. **Důvod jednat teď:** ceny platí do {{datum_platnosti}}, omezené montážní kapacity.

---

## 2. Doporučená struktura stránky

### 2.1 Pořadí sekcí

| # | Sekce | Účel | Poznámka |
|---|---|---|---|
| 0 | **Header** (logo + telefon + „Po–Pá 8–16“) | důvěra, okamžitý call-out | sticky jen na scroll-up (viz 5.3) |
| 1 | **Hero** – H1, podnadpis, 3 bullety, cenový pruh 385 500 → 320 000 → 65 500, CTA, mikrotext, trust strip | rozhodnutí „zůstat / odejít“ během 3 s | žádná velká fotka nad ohybem (viz 2.2) |
| 2 | **Kalkulačka doplatku** (slider m²) | interaktivní důkaz, že zateplení nic nepřidá | největší diferenciátor stránky |
| 3 | **Jak to počítáme** – rozpad ceny | racionální ospravedlnění čísla z hero | 3 řádky + vysvětlivka o stropu 250 000 |
| 4 | **Co dostanete** – 2 karty (FVE / Střecha) + „Co není v ceně“ | odpověď na „co za to“ a férovost | „co není v ceně“ **nedávat schované do FAQ** |
| 5 | **Čísla a úspory** – výroba, roční úspora, návratnost | Persona A | vše označené jako orientační |
| 6 | **Proč Schlieger** – 4 fakta + logo pruh | důvěra, Persona B | `{{fakta}}` doplnit reálnými |
| 7 | **Jak to probíhá** – 4 kroky | snížení nejistoty, „co ode mě chcete“ | krok 1 = nezávazný hovor |
| 8 | **Reference** – 3 recenze + 2 realizace před/po | sociální důkaz | jen reálné, s lokalitou |
| 9 | **Formulář** (kotva `#kalkulace`, kam míří všechna CTA) | konverze | 5 kroků, viz §4 |
| 10 | **FAQ** – 10 otázek | vyřízení námitek před hovorem | + FAQPage schema |
| 11 | **Finální CTA** + termín platnosti | poslední zachycení | druhá kotva na formulář |
| 12 | **Footer** – právní, IČ, ochrana údajů, cookies | legalita | + disclaimer k dotaci |
| — | **Sticky mobile CTA bar** (Zavolat / Spočítat doplatek) | trvalá dostupnost konverze | zobrazit po odscrollování hero |

### 2.2 Co je nad ohybem na 390 × 844 px (užitná plocha ~640 px)

```
┌─────────────────────────────────────┐ 0
│ Header 56px  [logo]      [☎ 226…]   │
├─────────────────────────────────────┤ 56
│ eyebrow 20px  Dotace NZÚ · rodinné domy
│ H1 ~3 řádky, 30/36px        ~108px  │
│ podnadpis 2 řádky 15/22px    ~44px  │
│ cenový pruh (385 500→320 000→65 500) │
│                              ~76px  │
│ [ Spočítat můj doplatek ]    ~56px  │  ← primární CTA celoplošné
│ mikrotext pod CTA 2 řádky    ~34px  │
│ trust strip (15 let · 23 000 inst.) │
│                              ~30px  │
└─────────────────────────────────────┘ ~424 px → CTA je vidět bez scrollu
   ↓ pod ohybem: sekundární CTA „Raději zavolám“, foto realizace, kalkulačka
```

**Opinionated rozhodnutí:** nad ohybem **nedávat velkou hero fotografii**. Na mobilu sežere 220–280 px, odsune CTA pod ohyb a stane se LCP elementem (pomalý start). Místo toho plochý brandový gradient / jednobarevné pozadí a **LCP = textový blok H1**. Fotka realizace přijde hned pod CTA jako `loading="lazy"` – nese vizuální důvěryhodnost, ale neblokuje první dojem ani rychlost.

**Cenový pruh v hero** musí být čitelný za 1 sekundu: `385 500 Kč` přeškrtnuté a šedé → `− 320 000 Kč dotace` → `65 500 Kč váš doplatek` (červeně, největší).

### 2.3 Zdůvodnění pořadí

- **Kalkulačka hned jako sekce 2**, ne dole: je to jediný interaktivní prvek, který převede abstraktní nabídku na „můj dům“. Zároveň měkce kvalifikuje (uživatel si sám zjistí m²) a přirozeně navazuje na formulář, kde se na plochu ptáme znovu → hodnotu už zadal, dokončení je psychologicky levnější (efekt konzistence).
- **„Co není v ceně“ vysoko (sekce 4), ne v FAQ:** u zakázky za 385 tisíc je transparentnost silnější akcelerátor než skrývání. Sníží počet „zklamaných“ leadů a zvedne kvalitu, o kterou obchod stojí víc než o objem.
- **Formulář až po sociálním důkazu:** studená Meta návštěva potřebuje 4–6 argumentů, než dá telefon. Všechna dřívější CTA ale scrollují na `#kalkulace`, takže rozhodnutý uživatel se k formuláři dostane jedním klikem kdykoli.
- **FAQ až za formulářem:** kdo scrolluje dál, má námitku; FAQ je záchranná síť, ne úvod.

### 2.4 Co A/B testovat jako první (v tomto pořadí)

1. **H1: „doplatek 65 500 Kč“ vs. „zateplení zdarma“ rámování.** Největší očekávaný dopad (±20–35 % CVR). Varianty A vs. C z §3.1.
2. **Formulář v hero vs. tlačítko.** Varianta B: první krok kvízu („Jaký máte typ střechy?“ – 4 chipy) přímo v hero pod cenovým pruhem. Na mobilu typicky +10–25 % na start formuláře; riziko poklesu kvality leadu → sledovat i podíl kvalifikovaných.
3. **CTA text:** „Spočítat můj doplatek“ vs. „Ověřit nárok na dotaci“. První slibuje číslo, druhý ověření nároku – jiné publikum, jiná motivace.
4. **Kalkulačka nahoře vs. pod „Co dostanete“.** Zda interaktivita pomáhá, nebo rozptyluje.
5. **Urgence:** datum platnosti cen vs. kapacitní rámování („volné montážní termíny na {{mesic}}“).

Testovat sekvenčně, jednu proměnnou; minimum ~200 konverzí na variantu, jinak výsledek nečíst.

---

## 3. Kompletní česká copy

> Konvence: **vykání**, žádné vykřičníky, žádné vymyšlené odpočty. `{{placeholder}}` = doplnit reálný ověřený údaj před spuštěním. Nezlomitelné mezery v částkách: `385 500 Kč` = `385&nbsp;500&nbsp;Kč`.

### 3.1 Hero

**Eyebrow (nad H1):**
`Nová zelená úsporám · rodinné domy · celá ČR`

**H1 – varianta A (doporučená, nasadit jako výchozí):**
> **Fotovoltaika i zateplení střechy za 65 500 Kč. Zbytek pokryje dotace.**

**H1 – varianta B (racionální, „sales line“):**
> **Zakázka za 385 500 Kč. Z vašich peněz jde 65 500 Kč.**

**H1 – varianta C (mechanismus „zdarma“):**
> **Zateplení střechy vás nestojí nic navíc. Platíte jen fotovoltaiku – 65 500 Kč.**

**Podnadpis (společný):**
> Kompletní fotovoltaika 3,69 kWp s ohřevem vody a zateplení šikmé střechy 100 m². Celková cena 385 500 Kč, dotace NZÚ 320 000 Kč. Váš doplatek 65 500 Kč.

**Cenový pruh (vizuální komponenta):**
```
Cena celkem        385 500 Kč
Dotace NZÚ       − 320 000 Kč
────────────────────────────
Váš doplatek        65 500 Kč
```
Popiska pod pruhem: `Modelový příklad pro 100 m² střechy. Přesnou cenu potvrdíme po bezplatném zaměření.`

**Bullety (3, pod ohybem nebo v hero dle varianty):**
- Fotovoltaika 3,69 kWp „do vody i do domu“ – 9 celočerných panelů, ohřívač vody 200 l
- Zateplení šikmé střechy 100 m² minerální vatou, včetně parozábrany a posudku
- Dotaci vyřídíme za vás – projekt, revize i žádost jsou v ceně

**Primární CTA:** `Spočítat můj doplatek`
*(varianta pro test: `Ověřit nárok na dotaci`)*

**Sekundární CTA:** `Raději zavolám: 226 223 800`

**Mikrotext pod CTA:**
> 5 otázek, vyplnění zabere necelou minutu. Nezávazně a zdarma – nic tím neobjednáváte.

**Trust strip (jeden řádek, odděleno tečkami):**
> 15 let na trhu · přes 23 000 instalací v EU · vlastní montážní týmy · dotaci vyřídíme za vás

### 3.2 Kalkulačka doplatku

**Nadpis:** `Spočítejte si doplatek pro vaši střechu`
**Perex:** `Posuňte jezdcem plochu střechy k zateplení. Uvidíte, jak se mění cena, dotace i to, co zaplatíte ze svého.`

**Label slideru:** `Plocha šikmé střechy: <strong>100 m²</strong>` (rozsah 40–200 m², krok 5)

**Výstupní karty (živě přepočítávané):**
| Popisek | Hodnota |
|---|---|
| `Cena celkem` | `385 500 Kč` |
| `Dotace NZÚ` | `320 000 Kč` |
| `Váš doplatek` | `65 500 Kč` |

**Dynamická hláška pod výsledkem (≤ 125 m²):**
> Zateplení je dotované korunu za korunu – ve vašem doplatku se neprojeví. Platíte jen doplatek za fotovoltaiku.

**Dynamická hláška (> 125 m²):**
> U plochy nad 125 m² je vyčerpán strop dotace na stavební úpravy (250 000 Kč). Každý další metr je už za plnou cenu 2 000 Kč.

**Vysvětlivka (vždy viditelná, malým písmem):**
> Orientační propočet podle podmínek programu Nová zelená úsporám. Výši dotace schvaluje Státní fond životního prostředí ČR, ne Schlieger. Přesnou cenu i výši dotace potvrdíme po zaměření technikem.

### 3.3 „Jak to počítáme“ – rozpad ceny

**Nadpis:** `Jak se dostaneme z 385 500 Kč na 65 500 Kč`
**Perex:** `Žádné kličky. Tady je celý propočet, řádek po řádku.`

| Položka | Částka |
|---|---|
| Fotovoltaika 3,69 kWp „do vody a domu“ (vč. 12 % DPH) | `185 500 Kč` |
| Zateplení šikmé střechy 100 m² × 2 000 Kč/m² | `200 000 Kč` |
| **Cena celkem vč. DPH** | **`385 500 Kč`** |
| Dotace NZÚ na fotovoltaiku s ohřevem vody | `− 120 000 Kč` |
| Dotace NZÚ na zateplení střechy (100 m² × 2 000 Kč) | `− 200 000 Kč` |
| **Dotace celkem** | **`− 320 000 Kč`** |
| **Váš doplatek** | **`65 500 Kč`** |

**Zvýrazněný box pod tabulkou:**
> **Dotace pokryje 83 % celé zakázky.**
> Zateplení je dotované korunu za korunu – nezaplatíte za něj nic navíc. Ze stropu dotace na stavební úpravy (250 000 Kč) vám navíc zbývá 50 000 Kč, které lze využít například na výměnu oken.

**Poznámka:** `Výše dotace závisí na schválení žádosti u Státního fondu životního prostředí ČR a na splnění podmínek programu. Podklady i žádost připravíme a podáme za vás.`

### 3.4 Co dostanete

**Nadpis:** `Co je v ceně`
**Perex:** `Dvě kompletní realizace v jedné zakázce, na klíč a od jednoho dodavatele.`

**Karta 1 – Fotovoltaika 3,69 kWp „do vody a domu“**
- 9× celočerný panel Amerisolar 410 Wp
- Střídač SOFAR 4.4KTL-X
- Ohřívač vody 200 l a topná patrona
- Router pro monitoring výroby
- Projekt, revize a veškerá dokumentace
- Kompletní instalace vlastním montážním týmem
- `Předpokládaná výroba 3 875 kWh za rok`

**Karta 2 – Zateplení šikmé střechy 100 m²**
- Minerální vata mezi krokve i pod krokve
- Parozábrana a pojistná hydroizolace
- Vyřešení detailů a napojení
- Odborný posudek a energetické hodnocení pro žádost o dotaci
- Kompletní montáž
- `Rozsah upřesníme podle zaměření technikem`

**Blok „Co v ceně není“ (rovnocenně velký, ne schovaný):**
**Nadpis:** `Co v ceně naopak není`
**Perex:** `Říkáme to rovnou, ať vás nic nepřekvapí u podpisu smlouvy.`
- Výkopové práce
- Sádrokartonový podhled
- Výměna střešní krytiny
- Oprava krovu
- Klempířské prvky
- Lešení

`Pokud něco z toho bude potřeba, technik vám to řekne při zaměření a naceníme to zvlášť – předem, ne dodatečně.`

### 3.5 Benefity s čísly

**Nadpis:** `Co vám to přinese`

| Číslo | Popisek |
|---|---|
| `12 732 Kč` | ročně ušetříte na elektřině díky vlastní výrobě |
| `3 875 kWh` | vyrobí vaše fotovoltaika za rok |
| `83 %` | zakázky pokryje dotace NZÚ |
| `{{uspora_vytapeni}} %` | nižší náklady na vytápění po zateplení střechy |

**Doplňkový odstavec:**
> Jen úspora za elektřinu ve výši 12 732 Kč ročně znamená, že se doplatek 65 500 Kč vrátí přibližně za 5 let. K tomu se přidává úspora za vytápění, teplejší podkroví v zimě a znatelně snesitelnější léto pod střechou. Hodnoty jsou orientační a závisí na spotřebě domácnosti a cenách energií.

### 3.6 Proč Schlieger (trust blok)

**Nadpis:** `Proč to svěřit Schliegeru`

- **15 let na trhu** – působíme v Česku, na Slovensku, v Německu a Rakousku
- **Přes 23 000 instalací v zemích EU** – fotovoltaika, tepelná čerpadla i solární ohřev
- **Vlastní proškolené montážní týmy** – nespoléháme na náhodné subdodavatele
- **Dotaci vyřídíme kompletně za vás** – od posudku přes žádost po vyúčtování
- **{{hodnoceni}} / 5** – průměrné hodnocení od {{pocet_recenzi}} zákazníků
- **{{zaruka_montaz}} záruka na montáž, {{zaruka_panely}} na výkon panelů**

**Uzavírací věta:** `Jsme výrobce a dodavatel v jednom. Za instalací i za dotací si stojíme my, ne tři různé firmy.`

*(Placeholdery `{{hodnoceni}}`, `{{pocet_recenzi}}`, `{{zaruka_montaz}}`, `{{zaruka_panely}}`, `{{uspora_vytapeni}}`, `{{datum_platnosti}}`, `{{doba_realizace}}`, `{{clenstvi_asociace}}` doplnit před spuštěním – nic z toho neodhadovat.)*

### 3.7 Jak to probíhá (4 kroky)

**Nadpis:** `Jak to probíhá`
**Perex:** `Čtyři kroky. Papírování necháte na nás.`

1. **Vyplníte 5 otázek** – Zjistíme typ a plochu střechy a vaši lokalitu. Zabere to necelou minutu.
2. **Ozveme se do 24 hodin** – Projdeme s vámi po telefonu možnosti, orientační cenu i výši dotace. Nezávazně.
3. **Technik přijede zaměřit** – Zdarma a bez závazku. Ověří stav střechy a krovu, navrhne rozsah a potvrdí přesnou cenu.
4. **Vyřídíme dotaci a namontujeme** – Připravíme posudek i žádost, zajistíme montáž, revize a dokumentaci. Vy jen převezmete hotovou práci.

### 3.8 Reference (placeholdery)

**Nadpis:** `Co říkají zákazníci`

- „{{recenze_1_text}}“ — **{{jmeno_1}}**, {{mesto_1}} · {{realizace_1}}
- „{{recenze_2_text}}“ — **{{jmeno_2}}**, {{mesto_2}} · {{realizace_2}}
- „{{recenze_3_text}}“ — **{{jmeno_3}}**, {{mesto_3}} · {{realizace_3}}

**Pod recenzemi:** `Hodnocení {{hodnoceni}} / 5 · {{pocet_recenzi}} recenzí`
**Galerie realizací:** popisek `{{mesto}} · fotovoltaika {{kWp}} kWp + zateplení střechy {{m2}} m² · dotace {{dotace}} Kč`

*Guardrail: recenze i fotky musí být reálné a dohledatelné. Nepoužívat stock fotky lidí u jmenných recenzí.*

### 3.9 FAQ (10 otázek – finální znění)

**Nadpis:** `Nejčastější dotazy`

**1. Mám na dotaci nárok?**
Program Nová zelená úsporám je určen majitelům rodinných domů v ČR. Rozhoduje především to, že jste vlastníkem nemovitosti a že opatření splní technické podmínky programu. Nárok neposuzujeme my – posuzuje ho Státní fond životního prostředí ČR. Zdarma vám ale předem ověříme, zda podmínky splňujete, a řekneme vám to na rovinu i v případě, že ne.

**2. Kdy dostanu dotaci – musím platit všechno předem?**
Ne, celou zakázku předem neplatíte. U fotovoltaiky se hradí záloha 30 %, zbytek podle smluvního harmonogramu. Konkrétní podmínky čerpání dotace i splatnost vám ukážeme ještě před podpisem smlouvy, abyste přesně věděli, kdy z vašeho účtu odejde jaká částka. Žádost o dotaci podáváme a vyřizujeme za vás.

**3. Co když má moje střecha jinou plochu než 100 m²?**
Pak se změní cena i dotace, ale váš doplatek většinou zůstane stejný. Zateplení stojí 2 000 Kč/m² a dotace je také 2 000 Kč/m² – u plochy do 125 m² se tedy ve vašem doplatku neprojeví. Nad 125 m² je vyčerpán strop dotace na stavební úpravy (250 000 Kč) a každý další metr je už za plnou cenu. Přesnou plochu určí technik při zaměření.

**4. Co není v ceně?**
V ceně nejsou výkopové práce, sádrokartonový podhled, výměna střešní krytiny, oprava krovu, klempířské prvky a lešení. Pokud bude cokoli z toho u vás potřeba, dozvíte se to při zaměření a naceníme to samostatně – vždy předem.

**5. Jak dlouho trvá realizace?**
Samotná montáž fotovoltaiky i zateplení střechy zabere typicky {{doba_montaze}}. Od podpisu smlouvy po hotovou realizaci počítejte {{doba_realizace}} podle aktuálních montážních kapacit a termínu zaměření. Konkrétní termín potvrdíme ve smlouvě.

**6. Musím měnit krytinu?**
Ve většině případů ne. Zateplení šikmé střechy děláme zevnitř – mezi krokve a pod krokve – takže krytinu nesundáváme. Pokud je ale krytina na konci životnosti nebo zatéká, dává smysl ji vyměnit dřív, než střechu zateplíte. Technik vám při zaměření řekne, jak na tom jste, a případnou výměnu naceníme zvlášť.

**7. Co když mám azbestovou krytinu nebo starý krov?**
Řekněte nám to rovnou, poradíme si s tím. Azbestová krytina vyžaduje odbornou likvidaci podle zákona a řeší se samostatně. Napadený nebo poddimenzovaný krov je potřeba nejdřív opravit – oprava krovu není součástí ceny. V obou případech vám technik při zaměření navrhne postup a nacenění, aby se zateplení nedělalo na špatném podkladu.

**8. Jak funguje fotovoltaika „do vody a domu“?**
Panely vyrábějí elektřinu, kterou přednostně spotřebuje váš dům. Přebytek automaticky putuje do topné patrony v zásobníku o objemu 200 l a ohřívá vám teplou vodu místo toho, aby se posílal zadarmo do sítě. V praxi to znamená, že v létě máte teplou vodu prakticky bez nákladů a po zbytek roku snižujete spotřebu ze sítě.

**9. Kolik reálně ušetřím?**
Fotovoltaika 3,69 kWp vyrobí zhruba 3 875 kWh ročně, což odpovídá úspoře přibližně 12 732 Kč za rok. Zateplení střechy k tomu přidá úsporu na vytápění a hlavně stabilnější teplotu v podkroví. Skutečná úspora závisí na vaší spotřebě, na tom, kdy elektřinu odebíráte, a na cenách energií – proto ji berte jako orientační. Konkrétní propočet pro váš dům uděláme při konzultaci.

**10. Co když se dotaci nepodaří získat?**
Nárok ověřujeme dřív, než cokoli podepíšete – právě proto, aby k tomu nedocházelo. Pokud by žádost přesto neprošla, nejste nuceni do realizace za plnou cenu: podmínky pro tento případ máme popsané ve smlouvě a projdeme je s vámi ještě před podpisem. Rozhodnutí o dotaci vydává Státní fond životního prostředí ČR, proto ji nemůže garantovat žádná firma – a kdo vám ji garantuje, tomu nevěřte.

*(U otázek 2 a 10 musí přesné znění schválit obchod + právník podle reálného znění smlouvy. Neslibovat nic, co smlouva neobsahuje.)*

### 3.10 Finální CTA

**Nadpis:** `Zjistěte, kolik zaplatíte ze svého`
**Text:** `Odpovíte na 5 otázek, my vám do 24 hodin (Po–Pá 8–16) zavoláme s orientační cenou a výší dotace pro váš dům. Nezávazně, zdarma a bez nátlaku.`
**Urgence (datum-driven):** `Uvedené ceny platí do {{datum_platnosti}}.`
**Primární CTA:** `Spočítat můj doplatek`
**Sekundární CTA:** `Zavolat: 226 223 800`

### 3.11 Footer – právní text

```
Schlieger s.r.o. · IČ: {{ico}} · Sídlo: {{sidlo}} · Zapsáno v obchodním rejstříku
vedeném {{soud}}, sp. zn. {{spisova_znacka}}.
Kontakt: info@schlieger.cz · 226 223 800 (Po–Pá 8–16)

Ochrana osobních údajů · Nastavení cookies · Reklamační a záruční řád ·
Odstoupení od smlouvy

Uvedené ceny, úspory a výše dotace jsou orientační, platí pro modelový rodinný dům
se šikmou střechou o ploše 100 m² a nejsou nabídkou ve smyslu § 1732 odst. 2
občanského zákoníku. Konečnou cenu i rozsah prací stanovíme po zaměření technikem.
O přiznání dotace z programu Nová zelená úsporám rozhoduje Státní fond životního
prostředí ČR na základě podané žádosti a splnění podmínek programu.
Ceny uvedené na této stránce platí do {{datum_platnosti}}.

Tato stránka je chráněna službou reCAPTCHA, platí Zásady ochrany soukromí
a Smluvní podmínky společnosti Google.

© Schlieger {{rok}}
```

### 3.12 Formulář – kompletní texty

**Nadpis nad formulářem:** `Ověřte si nárok na dotaci a spočítejte doplatek`
**Perex:** `5 krátkých otázek. Výsledek probereme telefonicky do 24 hodin – nezávazně a zdarma.`

**Indikátor postupu:** `Krok 2 z 5` + progress bar (20 / 40 / 60 / 80 / 100 %)
**Tlačítko zpět:** `Zpět`

**Krok 1 – `Jaký typ střechy máte?`**
Chipy: `Sedlová` · `Valbová` · `Pultová` · `Plochá` · `Nevím`
*(Výběrem automaticky pokračujete dál.)*
Podmíněná hláška po výběru „Plochá“: `Na ploché střeše se zateplení šikmé střechy neprovádí, ale fotovoltaiku i jiné formy zateplení pro vás vyřešíme. Pokračujte prosím dál.`

**Krok 2 – `Jakou má střecha přibližně plochu?`**
Chipy: `do 60 m²` · `60–100 m²` · `100–150 m²` · `nad 150 m²` · `Nevím`
Mikrotext: `Stačí odhad, přesnou plochu změří technik.`

**Krok 3 – `V jakém stavu je střecha?`**
Chipy: `Novější, bez problémů` · `Starší, ale funkční` · `Potřebuje opravu nebo novou krytinu` · `Nevím`

**Krok 4 – `Kdy plánujete realizaci?`**
Chipy: `Co nejdřív` · `Do 3 měsíců` · `Do 6–12 měsíců` · `Zatím jen zjišťuji informace`
Druhá, doplňková otázka na stejné obrazovce: `Jste majitelem nemovitosti?` → `Ano` · `Ne` · `Spoluvlastník`
Mikrotext: `Vlastnictví je jednou z podmínek dotace, proto se ptáme.`

**Krok 5 – `Kam vám máme zavolat s výsledkem?`**
Pole: `Jméno a příjmení` · `Telefon` · `E-mail` · `PSČ`
Placeholdery: `Jan Novák` · `+420 777 123 456` · `jan.novak@email.cz` · `250 01`
Mikrotext nad tlačítkem: `Voláme z čísla 226 223 800, Po–Pá 8–16.`
Tlačítko odeslání: `Odeslat a zjistit doplatek`

**Text o zpracování údajů (pod tlačítkem, doporučená varianta bez povinného checkboxu):**
> Odesláním formuláře nám předáváte své údaje, abychom vás mohli kontaktovat a připravit nezávaznou nabídku. Vaše údaje zpracovává Schlieger s.r.o. za tímto účelem, nepředáváme je třetím stranám pro jejich marketing a kdykoli je můžete nechat vymazat. Podrobnosti najdete v [Zásadách zpracování osobních údajů]({{url_gdpr}}).

**Volitelný marketingový souhlas (nepovinný checkbox, nesmí být předzaškrtnutý):**
> ☐ Chci občas dostávat informace o akčních nabídkách a dotacích e-mailem. Souhlas můžete kdykoli odvolat.

*(Pokud právní oddělení trvá na explicitním souhlasu, použít znění: „☐ Souhlasím se zpracováním osobních údajů za účelem zpracování nezávazné nabídky.“ – ale upozornit, že pro přípravu nabídky na žádost zákazníka je právním titulem čl. 6 odst. 1 písm. b) GDPR, tedy opatření před uzavřením smlouvy, a povinný checkbox je jen zbytečná friction.)*

**Validační hlášky (inline, pod polem, vlevo, červeně, s ikonou):**
| Situace | Text |
|---|---|
| Nevybraná možnost | `Vyberte prosím jednu z možností.` |
| Prázdné jméno | `Napište prosím své jméno a příjmení.` |
| Krátké jméno | `Vypadá to na překlep – zkontrolujte prosím jméno.` |
| Prázdný telefon | `Bez telefonu vám nezavoláme – doplňte ho prosím.` |
| Neplatný telefon | `Zkontrolujte prosím telefonní číslo. Očekáváme 9 číslic, např. 777 123 456.` |
| Prázdný e-mail | `Doplňte prosím e-mail, pošleme na něj shrnutí.` |
| Neplatný e-mail | `Tenhle e-mail nevypadá správně – chybí v něm zavináč nebo doména.` |
| Prázdné PSČ | `Doplňte prosím PSČ, ať víme, který technik k vám má dojet.` |
| Neplatné PSČ | `PSČ zadejte prosím jako 5 číslic, např. 250 01.` |
| Nezaškrtnutý povinný souhlas (jen varianta s checkboxem) | `Bez souhlasu vás bohužel nemůžeme kontaktovat.` |

**Chybová hláška při selhání odeslání:**
> Formulář se teď nepodařilo odeslat. Zkuste to prosím ještě jednou, nebo nám rovnou zavolejte na 226 223 800 (Po–Pá 8–16).
*(Tlačítko: `Zkusit znovu` + telefonní odkaz. Zadané údaje zůstávají vyplněné.)*

**Stav při odesílání:** tlačítko `Odesíláme…`, disabled, spinner.

**Mezistav „ověřujeme“ (0,8–1,5 s, nepovinný):**
> `Procházíme podmínky dotace pro vaši lokalitu…`
*Guardrail: použít jen jako reálné čekání na odpověď serveru, ne jako falešnou animaci – uživatelé to poznají a stojí to důvěru.*

**Obrazovka poděkování (success screen):**
> ### Máme to. Ozveme se vám do 24 hodin.
> Děkujeme, {{jmeno}}. Váš požadavek jsme přijali a předali technikovi pro oblast {{psc}}.
>
> **Co bude dál:**
> 1. Zavoláme vám z čísla **226 223 800** (Po–Pá 8–16) – uložte si ho prosím, ať vám hovor neproklouzne.
> 2. Po telefonu projdeme plochu střechy, orientační cenu a výši dotace.
> 3. Pokud bude dávat smysl pokračovat, domluvíme bezplatné zaměření technikem.
>
> Nechcete čekat? **Zavolejte nám rovnou: 226 223 800**
>
> *Nic jste si neobjednali a k ničemu jste se nezavázali.*

---

## 4. UX specifikace multi-step formuláře

### 4.1 Pořadí otázek a proč

| Krok | Otázka | Typ | Proč zde |
|---|---|---|---|
| 1 | Typ střechy | 5 chipů, auto-advance | Nejsnazší možná otázka, nulová kognitivní zátěž, spouští efekt konzistence. Zároveň kvalifikuje (plochá = jiná nabídka). |
| 2 | Plocha střechy | 5 chipů (rozsahy) | Navazuje na kalkulačku; rozsahy místo čísla = žádné „nevím přesně“, tedy žádný drop-off. |
| 3 | Stav střechy | 4 chipy | Nejcennější kvalifikační informace pro obchod (krytina/krov = vícenáklady). Uprostřed, kde je závazek už rozjetý, ale únava ještě nenastoupila. |
| 4 | Termín + vlastnictví | 4 chipy + 3 chipy | Termín = priorizace leadu pro call centrum. Vlastnictví = tvrdá podmínka dotace. Obojí binární, rychlé. |
| 5 | Kontakt | 4 pole | Až na konci. Uživatel už investoval 4 kliky, sunk cost hraje pro nás. |

**Zásada: žádná otázka, na kterou obchod nepotřebuje odpověď před prvním hovorem.** Každé pole navíc = měřitelný pokles. Nepřidávat „kolik osob v domácnosti“, „typ vytápění“ apod. – to zjistí technik.

### 4.2 Snížení tření – konkrétní požadavky na implementaci

- **Jedna otázka na obrazovku**, žádné scrollování uvnitř kroku na 390 px.
- **Chipy místo radiobuttonů** – min. touch target 48 × 48 px, mezery 8–12 px, celá plocha klikatelná.
- **Auto-advance** po výběru chipu u kroků 1–3 (delay 180 ms, ať uživatel vidí, co vybral). Krok 4 má dvě otázky → posun až po zodpovězení obou.
- **Tlačítko Zpět** v každém kroku vlevo nahoře, textové, ne ikona bez popisku. Vrácení zachová předchozí výběr.
- **Progress bar + „Krok X z 5“** – vždy viditelný. Dělá z formuláře konečný úkol.
- **Bez autofocusu na krocích 1–4** (nejsou tam textová pole). Na kroku 5 **ano, ale až po vstupu na krok**, a na mobilu **nefokusovat automaticky**, pokud by to vyvolalo klávesnici a zakrylo kontext – doporučuji fokus na první pole až po tapnutí uživatele; na desktopu autofocus zapnout.
- **Typy a atributy polí:**
  - `type="text" name="jmeno" autocomplete="name" autocapitalize="words" enterkeyhint="next"`
  - `type="tel" name="telefon" autocomplete="tel" inputmode="tel" enterkeyhint="next"`
  - `type="email" name="email" autocomplete="email" inputmode="email" spellcheck="false" autocapitalize="off" enterkeyhint="next"`
  - `type="text" name="psc" autocomplete="postal-code" inputmode="numeric" pattern="[0-9 ]{5,6}" maxlength="6" enterkeyhint="done"`
- **Normalizace na blur, ne při psaní:** z telefonu odstranit mezery a předvolbu, PSČ naformátovat na `250 01`. Nikdy uživateli neblokovat psaní znaků.
- **Validace až na blur / při pokusu odeslat**, nikdy při každém stisku klávesy. Po opravě chybu okamžitě skrýt.
- **Zachování dat:** stav formuláře ukládat do `sessionStorage` a obnovit při návratu (uživatel odskočí na FAQ a vrátí se). Kontaktní údaje **neukládat** déle než do odeslání.
- **Jedno tlačítko odeslání**, ochrana proti dvojkliku (disable + flag).
- **Honeypot pole** (`display:none`, `tabindex="-1"`, `autocomplete="off"`) + časová kontrola (odeslání pod 3 s = bot) místo agresivní CAPTCHA. reCAPTCHA v3 badge skrýt, ale ponechat právní text v patičce.
- **Bez povinného checkboxu souhlasu** (viz 3.12) – nahradit informačním textem.
- **Chyba sítě neztratí data** (viz chybová hláška).

### 4.3 Co dělat na obrazovce poděkování

1. Potvrzení + **konkrétní očekávání** (do 24 hodin, Po–Pá 8–16).
2. **Číslo, ze kterého voláme** – měřitelně zvyšuje dovolatelnost.
3. **3 kroky, co bude dál.**
4. **Klik na telefon** pro netrpělivé.
5. **Odstranění pocitu závazku** („nic jste si neobjednali“).
6. Technicky: `dataLayer.push({event:'generate_lead'})`, Meta `Lead`, Google Ads konverze; URL změnit na `#dekujeme` (history.pushState) kvůli měření a tlačítku zpět.
7. **Nedávat sem** další nabídku, cross-sell ani sdílení na sociální sítě. Nechat to čisté.

### 4.4 Měření (návaznost na lp-tracking standard)

Události: `form_start` (krok 1 zodpovězen), `form_step` (s parametrem `step`, `step_name`), `form_back`, `form_error` (s `field`), `generate_lead`, `click_to_call` (s `placement`: header / hero / sticky / faq / footer), `calc_interaction` (první pohyb slideru), `faq_open` (s `question`).
Drop-off mezi kroky sledovat jako hlavní diagnostiku – u zdravého 5krokového kvízu čekejte cca 100 → 88 → 80 → 74 → 62 % a odeslání 45–55 % z těch, kdo začali.

---

## 5. Persvazivní a UX prvky (standard 2026)

### 5.1 Sociální důkaz – kam a jaký

| Umístění | Typ | Poznámka |
|---|---|---|
| Hero, pod CTA | jednořádkový trust strip (15 let · 23 000+ instalací) | numerický, ne hvězdičky |
| Po kalkulačce | 1 krátká citace zákazníka | „přemostí“ z čísel k lidem |
| Samostatná sekce před formulářem | 3 recenze + hodnocení | s lokalitou a typem realizace |
| Uvnitř formuláře, krok 5 | mikro-důkaz: `Minulý měsíc jsme takto kontaktovali {{pocet}} domácností.` | **jen pokud je číslo reálné a aktualizované** |
| FAQ | odkaz na recenze / realizace | pro pochybovače |

### 5.2 „Živé“ prvky – ano, ale jen poctivě

- **Ano:** reálná montážní vytíženost / počet probíhajících realizací, pokud jde o skutečný údaj tažený z interního systému nebo ručně aktualizovaný (Schlieger takový prvek už používá na webu).
- **Ano:** platnost cen k reálnému datu.
- **Ne:** „právě si prohlíží 14 lidí“, „zbývají 2 termíny“ generované z `Math.random()`, odpočty, které se po refreshi resetují. Česká cílovka na tohle reaguje nedůvěrou a v této cenové hladině je to přímá ztráta konverzí.
- **Formulace, která je bezpečná:** `Volné montážní termíny máme aktuálně na {{mesic}}.` – pravdivé, časově relevantní, bez falešné paniky.

### 5.3 Sticky CTA – chování

- **Mobil:** spodní lišta, dva prvky – `☎ Zavolat` (outline, 40 % šířky) + `Spočítat doplatek` (plná, 60 %). Výška 64 px + `env(safe-area-inset-bottom)`.
- **Zobrazit** až po odscrollování hero (IntersectionObserver na hero CTA), **skrýt**, když je ve viewportu formulář nebo patička.
- **Nepřekrývat** poslední prvek stránky: `body { padding-bottom: 80px }`.
- **Header:** na mobilu neskrývat telefon nikdy. Header může být `position: sticky` a zmenšit se při scrollu (transform, ne změna výšky – kvůli CLS).

### 5.4 Kalkulačka / slider – přesná specifikace

```js
const CENA_FVE       = 185500;   // Kč vč. 12 % DPH
const CENA_ZAT_M2    = 2000;     // Kč/m²
const DOTACE_FVE     = 120000;   // Kč
const SAZBA_ZAT_M2   = 2000;     // Kč/m²
const STROP_STAVEBNI = 250000;   // Kč – strop dotace na stavební úpravy

function spocitat(m2) {
  const cena          = CENA_FVE + m2 * CENA_ZAT_M2;
  const dotaceZat     = Math.min(m2 * SAZBA_ZAT_M2, STROP_STAVEBNI);
  const dotaceCelkem  = DOTACE_FVE + dotaceZat;
  const doplatek      = cena - dotaceCelkem;
  const zbyvaVeStropu = STROP_STAVEBNI - dotaceZat;   // pro sdělení o oknech
  const kryti         = Math.round(dotaceCelkem / cena * 100);
  return { cena, dotaceCelkem, doplatek, zbyvaVeStropu, kryti };
}
// Kontrola: spocitat(100) → 385 500 / 320 000 / 65 500 / 50 000 / 83 %
```

Detaily: rozsah 40–200 m², krok 5, výchozí 100. Čísla animovat krátkým tweenem (150 ms), formátovat `toLocaleString('cs-CZ')` a přidat `Kč` s nezlomitelnou mezerou. `input` event = živý přepočet, `change` event = odeslat `calc_interaction`. Hodnotu slideru předvyplnit do kroku 2 formuláře (mapovat na odpovídající rozsah) a zobrazit: `Předvyplnili jsme podle kalkulačky, klidně změňte.`

**Poctivostní pojistka u kalkulačky:** nikde nepsat „doplatek 65 500 Kč“ bez hvězdičky o schválení dotace a o zaměření technikem.

### 5.5 Exit intent

**Na desktopu ano, na mobilu ne.** Mobilní „exit intent“ (scroll nahoru, blur okna) je nespolehlivý a otravný; na této cílovce spíš uškodí.
Desktopová varianta: jednoduchý panel, jednou za relaci (`sessionStorage`), s nabídkou, která něco dává:
> **Než odejdete – chcete propočet poslat e-mailem?**
> Pošleme vám shrnutí nabídky a orientační propočet dotace. Bez volání, pokud si ho nevyžádáte.
> [ pole e-mail ] [ Poslat propočet ]
Zavření křížkem i klávesou Esc, focus trap, žádné druhé zobrazení.

### 5.6 Click-to-call, WhatsApp, chat

- **Click-to-call:** `<a href="tel:+420226223800">` v headeru, v hero (sekundární CTA), ve sticky liště, na konci FAQ a v patičce. Vždy s viditelným číslem a s časy dostupnosti. Mimo provozní dobu měnit popisek na `Zavolejte nám zítra od 8:00` nebo přesměrovat na formulář (JS podle `Date`, timezone Europe/Prague).
- **WhatsApp: ne.** V českém B2C segmentu 45+ pro služby k nemovitosti je penetrace nízká a přidání ikony jen tříští pozornost od primární konverze. Případně zvážit až v retargetingu.
- **Live chat: ne**, pokud není obsluhován reálným člověkem do 60 s. Neobsluhovaný chat konverze snižuje.

### 5.7 Trust badges a garance

- Logo pruh: členství v asociacích `{{clenstvi_asociace}}`, výrobci technologií, případně certifikace montážních techniků.
- „Záruka“ formulovat jen podle reálných smluvních podmínek: `{{zaruka_montaz}} na montáž`, `{{zaruka_panely}} na výkon panelů`.
- Silné a poctivé rámování nízkého rizika: **„Zaměření zdarma a bez závazku. Cenu potvrdíme ve smlouvě.“**
- Nepoužívat symboly „100% garance dotace“, „schválení jisté“ – viz guardrails.

### 5.8 Guardrails – co se NESMÍ slíbit

1. **Negarantovat přiznání dotace.** Vždy uvádět, že rozhoduje Státní fond životního prostředí ČR. Přípustné: *„dotaci vyřídíme za vás“*, *„nárok předem ověříme“*. Nepřípustné: *„dotaci máte jistou“*, *„garantujeme 320 000 Kč“*.
2. **Negarantovat výši úspory** jako fakt. Vždy „orientační“, „předpokládaná“, s uvedením modelového předpokladu.
3. **Nepsat „zdarma“ o zateplení bez kontextu.** Přípustné: *„zateplení je dotované korunu za korunu, v doplatku se neprojeví“*. Nepřípustné: *„zateplení střechy zdarma“* jako samostatné tvrzení – to je zavádějící obchodní praktika podle zákona o ochraně spotřebitele.
4. **Cena 385 500 Kč platí pro modelový dům se 100 m² střechy** – u každého výskytu částky musí být tato podmínka dohledatelná v téže obrazovce nebo ve vysvětlivce.
5. **Termín platnosti cen musí být pravdivý a konfigurovatelný** (`data-deadline="2026-09-24"`). Po jeho uplynutí buď datum posunout, nebo prvek skrýt – nikdy nenechat zobrazený prošlý termín ani odpočet, který se sám resetuje.
6. **Nepoužívat DPH bez označení.** Vždy „vč. DPH“ / „vč. 12 % DPH“.
7. **Recenze musí být pravé** (§ 4a zákona o ochraně spotřebitele – zákaz falešných recenzí).
8. **Žádné předzaškrtnuté souhlasy**, žádné skryté přihlášení k newsletteru.
9. Před spuštěním **ověřit aktuální sazby a stropy NZÚ** (`{{overit_sazbu_NZU}}`, `{{overit_strop_NZU}}`) – copy i kalkulačka na nich stojí a program se v čase mění. Doporučuji všechny konstanty držet v jednom `CONFIG` objektu na začátku JS, aby šla stránka aktualizovat jednou editací.

---

## 6. Mikro-interakce a animace

Zásada: animace slouží ke srozumitelnosti, ne k ozdobě. Pouze `transform` a `opacity`, nic, co spouští layout.

| Prvek | Chování | Parametry |
|---|---|---|
| Chip – tap | zmenšení + změna barvy | `transform: scale(.97)`, 90 ms, `ease-out` |
| Chip – vybraný | červený rámeček + fajfka | fajfka `opacity/scale` 150 ms |
| Přechod mezi kroky | odsun doleva + fade in zprava | 220 ms, `cubic-bezier(.4,0,.2,1)`, `will-change: transform, opacity` jen po dobu přechodu |
| Progress bar | plynulé dotažení šířky | `transform: scaleX()`, 300 ms |
| Čísla v kalkulačce | počítadlo | 150 ms, `requestAnimationFrame`, max 20 kroků |
| Sekce při scrollu | jemný fade-up | `opacity 0→1`, `translateY(12px→0)`, 350 ms, IntersectionObserver `threshold: .15`, **jednorázově** (`unobserve`) |
| FAQ akordeon | rozbalení | `grid-template-rows: 0fr → 1fr`, 250 ms (bez měření `scrollHeight`) |
| Sticky lišta | vysunutí zdola | `translateY(100% → 0)`, 200 ms |
| Tlačítko odeslat | spinner + změna textu | CSS-only spinner, žádná knihovna |
| Hover na desktopu | mírné ztmavení + stín | 120 ms; na mobilu neřešit (`@media (hover: hover)`) |

**Povinné:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Žádné parallaxy, žádné auto-play video na pozadí, žádné animace v hero před LCP.

---

## 7. Přístupnost a výkon – must-have

### 7.1 Přístupnost (cíl WCAG 2.2 AA)

- **Sémantika:** jeden `<h1>`, logická posloupnost `h2`/`h3`, `<main>`, `<nav>`, `<footer>`, sekce jako `<section aria-labelledby>`.
- **Formulář:** každé pole má viditelný `<label>` (ne jen placeholder), chyby svázané přes `aria-describedby`, chybová zóna `role="alert"` / `aria-live="polite"`, změna kroku oznámena `aria-live` („Krok 3 z 5“), fokus po přechodu na nadpis kroku (`tabindex="-1"` + `.focus()`).
- **Chipy** implementovat jako `<input type="radio">` + `<label>` (nikoli `<div onclick>`) → funguje klávesnice, šipky i čtečky zdarma.
- **Focus-visible** viditelný všude: `outline: 3px solid #E30A1A; outline-offset: 2px` (na červeném pozadí přepnout na bílou).
- **Kontrast:** `#E30A1A` vs. bílá = **4,86 : 1** (ratio je symetrický, platí pro červený text na bílé i bílý text na červeném tlačítku) → projde AA pro běžný text, ale s malou rezervou. Důsledky: (a) červený text nepoužívat na světle šedém či krémovém pozadí – spadne pod 4,5 : 1; (b) pro drobný text a ikony používat tmavší odstín `#B8070F` (≈ 6,2 : 1); (c) u bílého textu na červeném tlačítku sázet min. 17–18 px semibold, ať je čitelný i na slunci, a pro jistotu zvážit pozadí `#C50915`. Vždy ověřit finální odstín po potvrzení brand manuálu.
- **Touch targety** min. 44 × 44 px (chipy 48 px), rozestupy ≥ 8 px.
- **Zoom** do 200 % bez horizontálního scrollu; `user-scalable` nezakazovat.
- **Obrázky:** smysluplné `alt` (u dekorativních `alt=""`), u fotek realizací popsat, co je vidět.
- **Telefon jako odkaz** s `aria-label="Zavolat na číslo 226 223 800"`.
- **Jazyk:** `<html lang="cs">`.

### 7.2 Výkon (cíl: LCP < 2,0 s na 4G mobilu, INP < 200 ms, CLS < 0,05)

- **LCP = textový blok H1** na plochém pozadí → žádný obrázek na kritické cestě. Pokud produkt trvá na hero fotce: `<img fetchpriority="high" decoding="async" width height>` + `<link rel="preload" as="image" imagesrcset>`, AVIF + WebP fallback, ≤ 80 kB pro 390 px šířku.
- **Fonty:** self-hosted `woff2`, max **2 řezy** (regular + bold), `font-display: swap`, `<link rel="preload" as="font" type="font/woff2" crossorigin>`, `size-adjust`/`ascent-override` pro fallback stack, aby swap nezpůsobil CLS. Systémový fallback: `-apple-system, "Segoe UI", Roboto, Arial, sans-serif`.
- **CSS:** vše inline v `<style>` v `<head>` (jednosouborová LP, ≤ ~35 kB) – nulový render-blocking request navíc.
- **JS:** vanilla, na konci `<body>`, bez `document.write`. Cíl ≤ 15 kB nekomprimovaně.
- **Obrázky pod ohybem:** `loading="lazy"`, `decoding="async"`, vždy `width`/`height` nebo `aspect-ratio` (CLS).
- **Třetí strany:** GTM/Meta Pixel/reCAPTCHA načítat **až po interakci nebo po `load`** (případně po souhlasu s cookies), ne synchronně v hlavičce. reCAPTCHA v3 skript líně načíst až při vstupu do kroku 5.
- **Consent:** navázat na stávající `lp-consent.js` / `lp-tracking.js` standard, Consent Mode v2 v default stavu `denied`.
- **CLS pojistky:** rezervovaná výška pro sticky lištu, pro cookie banner a pro kontejner formuláře (`min-height` na nejvyšší krok), aby přechod mezi kroky neposkakoval.
- **Bez knihoven** – žádné jQuery, žádné icon fonty (SVG inline), žádné Google Fonts z CDN.

---

## 8. Message match: reklama → stránka

H1 musí doslova obsahovat **číslo 65 500 Kč** nebo frázi o dotaci pokrývající zbytek. Reklamní headline a H1 musí sdílet minimálně jedno stejné číslo a jedno stejné podstatné jméno.

**5 headline nápadů (Google RSA ≤ 30 znaků / Meta primary text – varianty):**

| # | Headline (Meta / dlouhá) | Google RSA (≤ 30 zn.) | Navazuje na H1 |
|---|---|---|---|
| 1 | Fotovoltaika i zateplení střechy za 65 500 Kč | `Zaplatíte jen 65 500 Kč` (23) | A – doslovná shoda čísla |
| 2 | Zakázka za 385 500 Kč. Vy zaplatíte 65 500 Kč | `Z 385 500 Kč platíte 65 500` (27) | B |
| 3 | Zateplení střechy se vám do doplatku nepromítne | `Zateplení hradí dotace` (22) | C |
| 4 | Dotace NZÚ pokryje 83 % vaší zakázky | `Dotace pokryje 83 % ceny` (24) | A i B |
| 5 | Spočítejte si doplatek pro svou střechu za minutu | `Spočítat doplatek za minutu` (27) | shoda s CTA |

**Pravidla message matche:**
- Headline reklamy → stejné číslo v H1 **nad ohybem**, bez scrollování.
- Použitý vizuál reklamy (černé panely na šikmé střeše) → stejný typ fotky v první sekci pod hero.
- Search kampaň na dotační dotazy → pro tuto skupinu nasadit variantu H1 č. 4 („Dotace pokryje 83 %“) dynamicky přes URL parametr `?v=dotace`, aby scent zůstal spojitý.
- UTM z Meta → hero varianta s mechanismem (C), UTM ze Search → varianta s číslem (A).
- **Nikdy** neinzerovat částku, která na stránce není doslova napsaná.

---

## Shrnutí pro rychlé čtení

**Struktura:** Header → Hero (H1 + cenový pruh 385 500 → −320 000 → 65 500 + CTA nad ohybem, bez velké fotky) → Kalkulačka doplatku se sliderem m² → Jak to počítáme → Co je v ceně + Co v ceně není → Čísla a úspory → Proč Schlieger → Jak to probíhá (4 kroky) → Reference → 5krokový formulář → FAQ (10 otázek) → Finální CTA s datem platnosti → Footer s právním disclaimerem; k tomu sticky mobilní lišta Zavolat / Spočítat doplatek.

**Zvolená H1:** **„Fotovoltaika i zateplení střechy za 65 500 Kč. Zbytek pokryje dotace.“**
Podnadpis: *„Kompletní fotovoltaika 3,69 kWp s ohřevem vody a zateplení šikmé střechy 100 m². Celková cena 385 500 Kč, dotace NZÚ 320 000 Kč. Váš doplatek 65 500 Kč.“*

**Nosná myšlenka celé stránky:** doplatek zůstává 65 500 Kč pro jakoukoli plochu střechy do 125 m², protože zateplení je dotované korunu za korunu. Kalkulačka to ukazuje živě a je to zároveň pravdivé – proto z toho stavíme H1, hlavní sekci i reklamy.
