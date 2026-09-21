# Bannery pro LP nzulight.schlieger.cz

Vizuál záměrně kopíruje web: tmavý fotopás s přechodem, Poppins 600, zelený blok na částce, bílá cenovka „místo 385 500 Kč“, červené CTA 12 px, logo NZÚ Light (negativ z manuálu SFŽP), logo Schlieger. Stejné prvky, které návštěvník po prokliku uvidí v hero, takže reklama a stránka na sebe navazují (message match).

## Sada pro Metu (v2, 21. 9. 2026) – cílená podle publika

Jen formáty **1080×1080 (feed)** a **1080×1920 (Stories/Reels)**. Ve Stories je horních 250 px a spodních 340 px bez obsahu (safe zóny Meta), kontrola: `python3 banners/render.py senior --safe` vykreslí zóny červeně.

| Kód kreativy | Publikum | Hook | Fotka |
|---|---|---|---|
| `sch-fve-senior-…-v01` | starobní důchod | **Pobíráte starobní důchod?** | pár seniorů před domem s panely |
| `sch-fve-nizkoprijmove-…-v01` | superdávka | **Pobíráte superdávku?** | matka s dítětem u dveří domu |
| `sch-fve-osvc-…-v01` | OSVČ s nižšími příjmy | **Jste OSVČ s nižšími příjmy?** | živnostník před domem |
| `sch-fve-broad-…-v01` | široké cílení, bez lidí | **Fotovoltaika i zateplení střechy za 65 500 Kč** (= H1 z LP, message match) + řádek pro koho | dům s panely (stejný motiv jako hero LP) |
| `sch-fve-pozor-…-v01` | široké cílení, bez lidí | **POZOR! FOTOVOLTAIKA SE ZATEPLENÍM STŘECHY POUZE ZA 65 500 Kč** – zpravodajský styl (červený štítek, verzálky, ticker „Aktuálně“) | dům s panely |
| `sch-fve-ultrapozor-…-v01` | široké cílení, bez fotky | **ULTRA POZOR** – čistě typografický: červená plocha, výstražná páska, obří POZOR!, bílý box s cenou, bílé CTA | žádná |

Společné prvky (stejné jako na LP): dvě dlaždice **Fotovoltaika + Zateplení střechy** se zeleným plus (nabídka je vidět, ne jen napsaná), řádek „Obojí za **65 500 Kč**“ + cenovka „místo 385 500 Kč“, žlutá nálepka „Dotace předem 320 000 Kč na účet“ (jediný prvek mimo paletu webu, záměrně na pozornost), červené CTA, důvěra „Do 24 h víte, zda máte nárok · 23 000+ instalací · nezávazně“.

Starší obecná sada (v01–v04, 4 koncepty) zůstala jako `template-v1-obecne.html` a ve Figmě na stránce 1.

## Soubory

- `out/` – hotové PNG, název = kód kreativy podle `konvence-nazvoslovi-kreativ.md`
- `template.html` + `render.py` – zdroj; změna copy = objekt `T` v šabloně, `python3 banners/render.py` (běžící `node tools/serve.js 8766`)
- `src/` – fotky z Higgsfieldu (gpt_image_2_5, 2k): `couple-story`, `mother-story`, `osvc-story`, `attic`, `house-sq`, `house-story` (+ starší `couple`, `kitchen`, `install`, `house-story`)
- Figma: **Schlieger NZÚ Light – bannery** (tým Galosoft): stránka 1 = editovatelné rámy (6 variant × 1:1, 9:16, každá ve své sekci), 2 = PNG exporty, 3 = zdroje, 4 = archiv obecné sady v1

## UTM a název reklamy (směrnice kampaní)

Kód kreativy = název reklamy v Meta = `utm_content`:

```
https://nzulight.schlieger.cz/?utm_source=facebook&utm_medium=paid_social&utm_campaign=sch-fve-lead-202609&utm_content=sch-fve-senior-1080x1080-202609-v01
```

Kampaň v platformě: `SCH | FVE+střecha NZÚ Light | Lead | 2026-09`, ad sety podle publika (senior / nizkoprijmove / osvc).

## Pravidla z playbooku, na která pozor

- Loga jsou oficiální assety. Fotky lidí jsou z Higgsfieldu; playbook preferuje reálné fotky, dlaždice FVE už reálnou realizaci (Zbraslavice) používá. Jakmile budou reálné fotky zákazníků, vyměnit v objektu `IMG`.
- Text v obrázku držet přiměřený, hlavní sdělení opakovat v primárním textu inzerátu.
- Nová varianta = nové `vNN`, ne přepis staré.

## Video (koncept A, 15 s, 9:16)

- Scénáře: `video/scenar.md`. Vyrobeno: koncept A ve třech hook verzích (senior / nizkoprijmove / osvc), 1080×1920, 30 fps, ~19 s. **Zvuk:** český voiceover ElevenLabs (hlas Holden, přes Higgsfield, věty ve `video/vo/`), titulky slovo po slovu synchronizované s VO (časování slov = podíl znaků ve větě), tichý syntetický podkres `bed.mp3` jako placeholder, **před nasazením nahradit licencovaným trackem** (Meta Sound Collection nebo Epidemic) a stáhnout VO o pár dB pod něj.
- Záběry: Higgsfield Seedance 2.5 (5 s, 1080p, start_image = fotky ze `src/`), uložené ve `video/clips/`.
- Sestavení: **Remotion** ve `video/remotion/` (`npm install`, `npx remotion studio src/index.ts` pro náhled a úpravy textů v `src/Spot.tsx`, `npx remotion render src/index.ts spot-senior out.mp4`). Titulky, dlaždice, nálepka, cenovka a CTA jsou React komponenty se stejnými hodnotami jako bannery, safe zóny Meta dodržené.
- Výstupy: `video/out/sch-fve-{publikum}-video-1080x1920-{YYYYMM}-v04.mp4`, název = kód kreativy = `utm_content`. Rozvržení: vizuál nahoře, titulky uprostřed, vše centrované, safe zóny 250/340 px.
