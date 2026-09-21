# Bannery pro LP nzulight.schlieger.cz

Vizuál záměrně kopíruje web: tmavý fotopás s přechodem, Poppins 600, zelený blok na částce, bílá cenovka „místo 385 500 Kč“, červené CTA 12 px, logo NZÚ Light (negativ z manuálu SFŽP), logo Schlieger. Stejné prvky, které návštěvník po prokliku uvidí v hero, takže reklama a stránka na sebe navazují (message match).

## Koncepty (A/B test, každý = jedna hypotéza)

| Kód | Publikum | Hook | Proč by měl fungovat | Fotka |
|---|---|---|---|---|
| v01 | b2c | **Fotovoltaika i zateplení střechy za 65 500 Kč** + cenovka místo 385 500 | kotva ceny, stejný headline jako LP | dům s panely (hero LP) |
| v02 | b2c | **Dotace 320 000 Kč přijde na účet ještě před montáží** | největší odlišnost NZÚ Light: peníze předem, ne zpětně | žena s telefonem u stolu (peníze dorazily) |
| v03 | senior | **Pobíráte důchod nebo superdávku?** | otázka = kvalifikační hook, cílovka se pozná hned | pár seniorů před domem s panely |
| v04 | b2c | **Fotovoltaika + zateplení střechy** + bílá karta doplatku, 23 000 instalací | nabídková karta z webu, social proof výrobce | reálná realizace Schlieger (Brandov) |

Formáty: 1080×1350 (feed 4:5, hlavní), 1080×1080 (feed 1:1), 1080×1920 (Stories/Reels), 1200×628 (link ad, display).

## Soubory

- `out/` – hotové PNG, název = kód kreativy podle `konvence-nazvoslovi-kreativ.md`: `sch-fve-{publikum}-{WxH}-{YYYYMM}-v{NN}.png`
- `template.html` + `render.py` – zdroj; změna copy = úprava objektu `T` v šabloně a `python3 banners/render.py` (potřebuje běžící `node tools/serve.js 8766`)
- `src/` – fotky z Higgsfieldu (gpt_image_2_5, 2k): `couple.jpg`, `couple-r.jpg` (zrcadlo), `kitchen.jpg`, `install.jpg`, `house-story.jpg`
- Figma: **Schlieger NZÚ Light – bannery** (tým Galosoft), editovatelné master rámy 4:5 + exporty

## UTM a název reklamy (směrnice kampaní)

Kód kreativy = název reklamy v Meta/Ads = `utm_content`. Příklad pro v01 ve feedu:

```
https://nzulight.schlieger.cz/?utm_source=facebook&utm_medium=paid_social&utm_campaign=sch-fve-lead-202609&utm_content=sch-fve-b2c-1080x1350-202609-v01
```

Google Ads: auto-tagging zapnutý, `utm_source=google&utm_medium=cpc`. Kampaň v platformě: `SCH | FVE+střecha NZÚ Light | Lead | 2026-09`.

## Pravidla z playbooku, na která pozor

- Loga jsou oficiální assety, nikdy generovaná. Fotky v01–v03 jsou z Higgsfieldu; playbook preferuje reálné realizace (v04 ji používá). Jakmile bude reálná fotka domu se zateplením a montáží, vyměnit v `template.html` (objekt `IMG`).
- Text v obrázku držet pod ~20 % plochy u Meta (splněno, hlavní sdělení je i v primárním textu inzerátu).
- Nemíchat verze za běhu: nová varianta = nové `vNN`, ne přepis staré.
