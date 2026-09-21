# Video do kampaně NZÚ Light – scénáře

Cíl: 15sekundový vertikální spot (9:16, Reels / Stories / feed) pro lead kampaň na https://nzulight.schlieger.cz. Stejný vizuální jazyk jako bannery a LP: tmavý fotopás, Poppins, zelený blok na částce, žlutá nálepka „Dotace předem 320 000 Kč na účet“, červené CTA, logo NZÚ Light + Schlieger.

Pravidla, ze kterých vycházím (research Meta 2026): hook do 3 s a před brandem, design na vypnutý zvuk (vše podstatné je v titulcích), délka do 15 s, 9:16 pro Stories/Reels, 4:5 nebo 1:1 pro feed, safe zóny 250 px nahoře a 340 px dole. Titulky neběží přes celou plochu, ale jako stejné prvky, jaké má LP, takže po prokliku návštěvník poznává, kde je.

---

## Koncept A – „Pobíráte důchod?“ (kvalifikační hook, doporučený)

Publikum: senioři, superdávka, OSVČ (tři verze se liší jen hookem, zbytek stejný).

| Čas | Obraz | Text v obraze | Zvuk (volitelný VO) |
|---|---|---|---|
| 0–2 s | Detail tváře seniora před domem, mírný nájezd kamery. | **Pobíráte starobní důchod?** (bílá + zelený blok) | „Pobíráte důchod?“ |
| 2–5 s | Střih na střechu, dron stoupá, na střeše černé panely. | Dlaždice **Fotovoltaika** vjede zleva | „Fotovoltaika…“ |
| 5–8 s | Vnitřek půdy, ruka vkládá minerální vlnu mezi krokve. | Dlaždice **Zateplení střechy** vjede zprava, mezi nimi zelené **+** | „…i zateplení střechy.“ |
| 8–11 s | Tmavý podklad, žlutá nálepka „Dotace předem 320 000 Kč na účet“ se přilepí (rychlé pootočení). | **320 000 Kč přijde na účet předem** | „Dotace 320 tisíc přijde na účet předem, ještě před montáží.“ |
| 11–14 s | Zelený blok se rozroste: **65 500 Kč**, vedle „místo ~~385 500 Kč~~“. | **Vy doplatíte jen 65 500 Kč** | „Vy doplatíte jen 65 a půl tisíce.“ |
| 14–15 s | Červené CTA + logo Schlieger a NZÚ Light, dům v pozadí. | **Ověřit nárok zdarma →** · Do 24 h víte, zda máte nárok | „Ověřte si nárok, zabere to minutu.“ |

Proč: otázka jako hook filtruje publikum v první sekundě (stejný princip jako krok 1 na LP), pořadí produkt → peníze předem → doplatek → CTA kopíruje hero stránky.

## Koncept B – „POZOR!“ (zpravodajský, breaking news)

Publikum: široké.

| Čas | Obraz | Text v obraze |
|---|---|---|
| 0–2 s | Červená plocha s výstražnou páskou, obří **POZOR!** se „přicvakne“ na střed, krátké zablikání tečky jako živé vysílání. | POZOR! |
| 2–5 s | Střih na dům s panely, lišta „AKTUÁLNĚ“ dole jako v TV. | **FOTOVOLTAIKA SE ZATEPLENÍM STŘECHY** |
| 5–9 s | Cena naskočí jako odpočet: 385 500 → škrt → **65 500 Kč** v zeleném bloku. | POUZE ZA 65 500 Kč · místo 385 500 Kč |
| 9–12 s | Nálepka 320 000 Kč, ticker „Pro důchodce, OSVČ a nízkopříjmové domácnosti“. | Dotace 320 000 Kč přijde na účet předem |
| 12–15 s | CTA + loga. | **Ověřit nárok zdarma →** |

Proč: pattern interrupt, funguje bez zvuku, na Metě prokazatelně zvedá CTR u starší cílovky. Riziko: může působit křiklavě, proto ho testovat proti A.

## Koncept C – „Před a po“ (dům)

Publikum: široké, bez lidí.

| Čas | Obraz | Text v obraze |
|---|---|---|
| 0–3 s | Stejný dům, nejdřív holá střecha s tašky, přejezd „stěrky“ zleva a střecha je s panely a novou půdou. | **Fotovoltaika i zateplení střechy** |
| 3–7 s | Nájezd na střechu, pak střih na půdu s izolací. | za **65 500 Kč** · místo ~~385 500 Kč~~ |
| 7–11 s | Účtenka z LP (Cena celkem → Dotace → Váš doplatek) se „natiskne“ řádek po řádku. | 385 500 − 320 000 = **65 500 Kč** |
| 11–15 s | Nálepka „Dotace předem“ + CTA. | **Spočítat doplatek →** |

Proč: vizualizuje výsledek, výborné pro retargeting těch, co viděli LP. Vyžaduje dva konzistentní záběry domu (před/po), to je v AI generování nejtěžší část.

---

## Doporučení

Vyrobit **A ve třech hook verzích** (senior / superdávka / OSVČ) jako hlavní sadu a **B** jako druhý test. C nechat na retargeting, až bude reálná fotka domu se zateplením.

## Výroba

- **Záběry** (Higgsfield, model Seedance 2.5, 1080p, 9:16): ~60 kreditů za 5s klip. Koncept A = 4 klipy (senior, střecha dron, půda, dům pro závěr) ≈ 240 kreditů, tři hook verze sdílejí tři klipy, mění se jen první ≈ 360 kreditů celkem. B = 2 klipy ≈ 120. Zůstatek 1 000 kreditů stačí na A i B s rezervou na opakování.
- **Text, nálepka, cenovka, CTA, loga**: ne v AI videu, ale jako HTML overlay ve stejné šabloně jako bannery (`banners/template.html`) vykreslený po snímcích, nebo v Figmě / CapCutu přes exportované klipy. Tím je typografie přesná a text se dá měnit bez nového generování.
- **Zvuk**: verze bez VO (titulky nesou vše) + verze s klidným mužským VO v češtině (Higgsfield TTS) pro placement se zvukem.
- **Formáty**: 1080×1920 master, ořez 1080×1350 a 1080×1080 pro feed (text držet v safe zónách už v masteru).
- **Název kreativy**: `sch-fve-{publikum}-video15-{YYYYMM}-vNN`, stejné jako u bannerů, `utm_content` = název reklamy.
