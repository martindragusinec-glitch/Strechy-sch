# CRO + design audit LP „Fotovoltaika + zateplení střechy“ (Schlieger)

**Auditovaná verze:** `index.html`, MD5 `a363f3ffed4ff6e570029608aecb7f39`, 15. 9. 2026 20:25.
**Pozor:** soubor se během auditu třikrát změnil (20:07 → 20:14 → 20:25; zmizely eyebrow popisky sekcí, formulář se zkrátil ze 6 na 4 kroky, nabídková karta byla přestavěna na tmavý panel). Pokud na LP paralelně pracuje někdo další, ověřte si u každého bodu, že stále platí.

**Jak bylo měřeno:** headless Chrome přes CDP se skutečnými viewporty 390 / 768 / 1024 / 1440 px (`Emulation.setDeviceMetricsOverride`, ne `--window-size` – ten na macOS mlčky vynutí minimální šířku 500 px a vyrábí falešný horizontální přetok). Screenshoty: `v1440b.png`, `v390b.png`, `v768.png`, `v1024.png` + řezy `W_*.jpg` (1440), `R_*.jpg` (390), `S7_*.jpg` (768), `S10_*.jpg` (1024), průchod formulářem `f_step2/3/4.jpg`.
**Stav, který je v pořádku:** žádný horizontální přetok na žádné šířce (`scrollWidth == innerWidth` na 390/768/1024/1440), touch targety v kvízu 60–72 px, focus-visible je vidět, formulář má honeypot i časovou kontrolu, čísla sedí na jeden `CONFIG`.

---

## 1. Top 10 podle dopadu na konverzi

### 1. Cookie lišta překrývá formulář i CTA (mobil 390, tablet 768) — *friction*

**Kde:** `#lp-consent` (injektuje `lp-consent.js`), viz `R_1.jpg`, `f_step2.jpg`, `f_step4.jpg`, `S7_1.jpg`.
**Co je špatně:** lišta je karta `bottom:16px`, `padding:18px 20px`, font 14/1.5 system-ui a na 390 px zabírá 300 px, tj. 36 % obrazovky. Na `f_step2.jpg` a `f_step4.jpg` zakrývá poslední dvě možnosti kroku i tlačítko „Pokračovat“. Na 768 px leží navíc přesně na sticky liště a na trust kartě. Uživatel z placené reklamy tedy první obrazovku formuláře vidí rozpůlenou.
**Proč to je nejdůležitější:** je to jediná věc na stránce, která fyzicky brání kliknutí v prvním kroku kvízu. Všechno ostatní je optimalizace, tohle je ztráta.
**Oprava:** `lp-consent.js` se podle README nemění, ale inline styly jdou přebít z `index.html` (přidejte na konec `<style>`):

```css
#lp-consent{font-family:var(--ff)!important;font-size:13.5px!important;line-height:1.45!important;
  padding:14px 16px!important;border-radius:14px!important;max-width:520px!important;
  bottom:calc(84px + env(safe-area-inset-bottom))!important}   /* nad sticky lištu */
#lp-consent p{margin:0 0 10px!important}
@media (min-width:960px){#lp-consent{left:auto!important;right:20px!important;margin:0!important;bottom:20px!important;max-width:400px!important}}
```
Na desktopu ji tím odsunete do pravého dolního rohu (dnes visí uprostřed přes hero kartu, viz `V_1.jpg`). Druhá, silnější varianta: vykreslit lištu až po prvním scrollu nebo po 1 500 ms, ne hned při loadu.

---

### 2. Na mobilu je formulář schovaný za 600 px prodejního textu — *structure*

**Kde:** `.lead-box` (sekce `#kalkulace`), 390 px, `R_2500.jpg`.
**Co je špatně:** uvnitř tmavého bloku jde nejdřív H2 + perex + tři odrážky + hvězdičky (≈ 600 px) a teprve pak bílá karta formuláře. Na mobilu tedy „Ověřte si nárok“ znamená ještě jednou odscrollovat celou výšku telefonu.
**Proč to je důležité:** 80 % trafficu je mobil, hero karta je sice rychlý vstup, ale kdo ji přeskočí, narazí na sekci „Pro koho“ a pak na 600 px textu, než uvidí první otázku. Každá obrazovka navíc před formulářem stojí leady.
**Oprava:** na mobilu prohodit pořadí, na desktopu nechat.

```css
/* druhý potomek .lead-box je obal karty formuláře (bez třídy) */
@media (max-width:959px){.lead-box>:last-child{order:-1}}
```
Zároveň na mobilu zkraťte levý sloupec: hvězdičky `.lead__stars` a třetí odrážku skryjte pod formulář (`@media (max-width:759px){.lead__stars{display:none}}`) — důvěryhodnostní lišta `.form-foot` je hned pod kartou a říká totéž.

---

### 3. Stránka je 20 000 px dlouhá a třikrát opakuje tentýž kvíz — *structure / clarity*

**Kde:** celá LP, 390 px: `document.body.scrollHeight = 20 049 px` (≈ 24 obrazovek); 1440 px: 13 590 px.
**Co je špatně:** čtyři možnosti nároku (Senior / ID 3. stupně / Superdávka / Nic z toho) jsou na stránce **třikrát** (hero karta, 1. krok formuláře, sekce „Kdo z vaší domácnosti vlastní dům“ – `R_1.jpg`, `R_2500.jpg`, `R_10000.jpg`). Číslo 65 500 Kč se objevuje v sedmi sekcích, 320 000 Kč v šesti, 83 % ve třech (kalkulačka, „Žádné kličky“, zelený pás nabídkové karty). Sekce „Pro koho je nabídka“ a 1. krok formuláře říkají doslova totéž.
**Proč to je důležité:** opakování stejných čísel bez nové informace je hlavní důvod, proč stránka působí jako vygenerovaná šablona, a scroll depth pod 30 % je u takové délky normální. Sekce, které nepřidávají argument, jen oddalují formulář.
**Oprava (konkrétně, v tomto pořadí):**
- smazat samostatnou sekci `.qs` („Kdo z vaší domácnosti vlastní dům?“, `index.html` sekce s `class="section section--paper qs"`) — je to třetí kopie kroku 1;
- sekci „Pro koho je nabídka“ (`#pro-koho`) zkrátit na tři řádky hairline seznamu bez levého sloupce s velkým zeleným blokem a bez šedé karty `.elig__alt` — větev „bezúročný úvěr“ už je v kroku 1 formuláře i ve FAQ 1;
- kalkulačku `#kalkulacka` a sekci „Žádné kličky“ sloučit do jedné (slider + účtenka vedle sebe); dnes jsou to dvě sekce se stejným sdělením a stejnou účtenkou.
Cíl: pod 14 000 px na 390 px.

---

### 4. První a třetí otázka formuláře jsou dvojité a nejasné — *clarity*

**Kde:** `.fstep[data-name="eligibility"] h3` a `.fstep[data-name="condition"] h3`, `f_step4.jpg`.
**Co je špatně:** „Kdo z vaší domácnosti je vlastníkem domu a co se ho týká?“ — dvě otázky v jedné a odpovědi („Pobírá starobní důchod“) neodpovídají na to, na co se ptáte. Totéž „V jakém stavu je střecha a čí je dům?“. V hero kartě je varianta třetí: „Zjistěte za minutu, jestli máte nárok. Kdo z vaší domácnosti vlastní dům?“
**Proč to je důležité:** první krok kvízu je místo s největším odpadem. Nesrozumitelná otázka = odchod dřív, než uživatel vůbec něco vybere.
**Oprava (copy, jednotně na všech třech místech):**
- H3 kroku 1: `Pobírá někdo ve vaší domácnosti důchod nebo superdávku?`
  hint: `Podle toho poznáme, jestli máte nárok na dotaci předem na účet, nebo na bezúročný úvěr. Výběrem pokračujete dál.`
- H3 kroku 3: `V jakém stavu je vaše střecha?` a vlastnictví nechat jako druhou otázku na stejné obrazovce s nadpisem `Jste vlastníkem domu?` (`.fgroup h4`, už tam je).
- Hero karta: `Pobírá někdo u vás doma důchod nebo superdávku?` + podtitul `Za minutu víte, jestli dostanete dotaci předem na účet.`

---

### 5. Nabídková karta: „flair“ už tam je, ale zabíjí ho dvojice fotek a nečitelný zelený pás — *clarity / imagery*

**Kde:** `.offer`, 1440: `W_3000.jpg`, `W_4000.jpg`; 390: `R_6250.jpg`, `R_7500.jpg`.
**Co je špatně:**
a) **Fotka A** (`realizace-dum-panely.jpg`) je široký amatérský snímek celé zahrady — modré nebe, zelená fasáda, hrábě na trávníku, panely zabírají 8 % plochy. **Fotka B** (`zatepleni-strechy.jpg`) je teplý detail zevnitř. Dvě různé teploty, dvě různé vzdálenosti, dvě různé „kvality“. Vedle sebe to vypadá jako stock a jako omyl.
b) **Zelený pás 83 %**: bílý text 16 px na `--green #24A531` = kontrast **3,2 : 1** (WCAG AA vyžaduje 4,5). Popisky „Dotace 320 000 Kč“ / „Doplatek 65 500 Kč“ 13 px bílé na zelené jsou na mobilu prakticky nečitelné.
c) Matematika balíčku (185 500 + 200 000 = 385 500 − 320 000 = 65 500) je rozházená po třech místech karty v 13px šedé.
**Proč to je důležité:** tohle je sekce, která má prodat cenu. Když fotky vypadají jako z inzerátu a klíčové číslo obklopuje nečitelný text, karta ztratí přesně tu „údernost“, která klientovi chybí.
**Oprava:**
```css
.offer__band{background:var(--green-dark)}                 /* #1B7C25: bílá = 5,3:1 */
.offer__band-lead span{color:#fff}
.offer__meter-labels{font-size:14px;color:#fff}
.offer__figure img{filter:saturate(.94) contrast(1.04)}    /* sjednocení tonality */
.offer__join span{width:68px;height:68px;font-size:30px;border-width:1.5px}
```
– Fotku A (`realizace-dum-panely.jpg`) vyměnit za těsný výřez panelů na střeše — v assets už jsou `realizace-vratimov-0.jpg` i `realizace-turany-0.jpg`. Poměr `16/10` je u obou stejný, problém je motiv a expozice: A je celková zahrada s hráběmi, B je teplý detail zevnitř. Dvojice musí číst jako „technologie + stavební část“, tedy dva detaily materiálu.
– Co kartu udělá opravdu úderné (a navazuje na účtenkový motiv, který na LP už máte): **postavit ji kolem rovnice**. Dnes je v `.offer__ticket` číslo 65 500 Kč velké, ale rozklad `385 500 − 320 000` leží pod ním ve dvou 15px řádcích, takže z rovnice nic není vidět. Udělejte z ní hlavní grafiku: `185 500` (A) **+** `200 000` (B) na jednom řádku, pod ním `= 385 500 Kč` přeškrtnuté, pod tím `− 320 000 Kč` v zelené a teprve pak plotna `65 500 Kč` v 70–96 px. Plotnu vykreslete jako perforovanou účtenku — stejné zuby `::before/::after` a razítko „Krytí 83 %“, jaké má `.bd .receipt` — karta tím přestane být „další box“ a stane se dokladem. Tři řádky, tři velikosti, jeden zelený akcent.
– Prostřední `+` v `.offer__join` zvětšit na 68 px a na desktopu potlačit vodorovnou hairline (`.offer__join::before{display:none}` v `@media (min-width:960px)`), aby se plus četlo jako matematický znak, ne jako oddělovač sekcí.

---

### 6. Osiřelé CTA v sekci „Proč to svěřit Schliegeru“ — *structure*

**Kde:** `.why .sec-cta`, 1440 a 1024: `W_6000.jpg`.
**Co je špatně:** `.why` je grid `5fr 7fr` a `.sec-cta` je jeho přímý potomek bez `grid-column`, takže spadne do **levého** sloupce pod sticky fotku. Mezi spodní hranou fotky a tlačítkem je ≈ 300 px prázdna a tlačítko je vizuálně odtržené od seznamu argumentů, který má uzavírat.
**Proč to je důležité:** je to jediné CTA v nejdelší důvěryhodnostní sekci a vypadá jako omylem zapomenuté.
**Oprava:**
```css
@media (min-width:960px){
  .why{grid-template-areas:"media head" "media list" "media cta";grid-template-rows:auto auto 1fr}
  .why__media{grid-area:media}
  .why .sec-cta{grid-column:2;margin-top:32px;align-self:start}
}
```
Minimum bez přestavby: `@media (min-width:960px){.why .sec-cta{grid-column:2;margin-top:32px}}`.

---

### 7. Blok formuláře je full-bleed a jako jediný nesedí na grid stránky — *structure*

**Kde:** `.breakout` + `.lead-box`, 1440: `W_1000.jpg` / `V_1000.jpg`.
**Co je špatně:** `.breakout{max-width:none;margin:0;padding:0 20px}` (computed `padding-left: 0px`) → tmavý blok se dotýká obou okrajů okna, `.lead-box` má na ≥1400 px `padding:88px 96px`, takže H2 formuláře začíná na x≈96 px, zatímco všechny ostatní sekce začínají na x=70 px (kontejner 1300 px). Rozdíl 26 px je na velké ploše dobře vidět a blok působí jako cizí prvek.
**Proč to je důležité:** je to hlavní konverzní blok; když jediný nerespektuje mřížku, stránka působí poskládaně.
**Oprava:**
```css
.breakout{max-width:1340px;margin:0 auto;padding:0 20px}
@media (min-width:960px){.lead-box{padding:64px 50px}}
@media (min-width:1400px){.lead-box{padding:80px 50px;gap:96px}}
```
Vnitřní text pak začne přesně na 70 px jako zbytek stránky a blok bude mít po stranách vzduch.

---

### 8. Recenze: 350 px díry v levém sloupci — *trust / structure*

**Kde:** `.reviews` na ≥760 px, `W_8000.jpg` (1440), `S10_7800.jpg` (1024).
**Co je špatně:** `grid-template-columns:1.4fr 1fr` + `.review:first-child{grid-row:span 2}` počítá s tím, že první recenze bude dlouhá a velká (`font-size:22px`). Reálná recenze má dva řádky, takže levý sloupec je ze dvou třetin prázdný a pravidlo `22px` se navíc vizuálně neprojevuje.
**Proč to je důležité:** sociální důkaz je jediné, co na této stránce nese námitku „nejsou to podvodníci“; prázdná plocha ho vizuálně zlehčuje.
**Oprava:** rovnocenné tři sloupce, hairline nahoře, žádné karty:
```css
@media (min-width:760px){
  .reviews{grid-template-columns:repeat(3,1fr);gap:0 40px}
  .review:first-child{grid-row:auto;padding-right:0}
  .review:first-child p{font-size:17px;line-height:1.5}
  .review{align-content:start}
  .review__who{margin-top:auto}
}
```
Pokud chcete featured recenzi, doplňte k první citaci jednu dlouhou (4–5 řádků) a nechte `span 2` — jinak layout nemá čím prostor zaplnit.

---

### 9. Kontrast drobného textu pod normou WCAG AA — *trust / a11y*

**Kde:** `.footer__legal`, `.calc__foot`, `.bd__note`, `.gallery__more` (12,5–13,5 px, `--muted #98A0A8` na `--paper #F6F5F1`) = **2,4 : 1**. Dále bílý 16px text na `--green` v nabídkové kartě (**3,2 : 1**) a zelený `.hl` kolem 17px textu v hero („nízkopříjmové domácnosti“, `R_1.jpg`) = **3,2 : 1**.
**Proč to je důležité:** cílovka je 55+ a senioři, kteří to čtou na telefonu venku. Právní disclaimer, který nikdo nepřečte, je navíc právní riziko, ne ochrana.
**Oprava:**
```css
.footer__legal,.calc__foot,.bd__note,.gallery__more{color:var(--ink-3)}   /* #646B74 = 4,95:1 */
.footer__legal{font-size:13px}
.hero__who .hl--who,.offer__band{background:var(--green-dark)}            /* bílá = 5,3:1 */
```
`--muted` nechte jen pro text ≥ 18 px nebo pro dekorativní prvky.

---

### 10. Zelený `.hl`: interpunkce vypadává ven a blok přerůstá v billboard — *typografie*

**Kde:** H2 formuláře („Ověřte si nárok na **dotaci předem** . Za minutu…“ — `V_1000.jpg`, `R_2500.jpg`), hero řádek („**nízkopříjmové domácnosti** , seniory“ — `R_1.jpg`), H2 sekce Pro koho („**Dotace předem na účet** je / pro nízkopříjmové domácnosti“ — `V_1.jpg`).
**Co je špatně:** `.hl{display:inline-block;padding:0 14px;line-height:1.22}` (computed 70,76 px při H1 58 px) — tečka a čárka stojí až za 14px paddingem, takže před interpunkcí vzniká viditelná mezera a čte se to jako chyba sazby. Inline-block s velkým `line-height` navíc mění zvýraznění v plný zelený obdélník přes půl nadpisu, což popírá dohodu „zelená jen pro peníze“. V sekci Pro koho zůstává na konci prvního řádku osiřelé „je“.
**Oprava:**
```css
.hl{display:inline;box-decoration-break:clone;-webkit-box-decoration-break:clone;
  padding:.06em .3em;border-radius:10px;line-height:1.28}
```
a interpunkci vtáhnout dovnitř spanu: `<span class="hl">dotaci předem.</span>`, `<span class="hl">nízkopříjmové domácnosti,</span>`. V H2 sekce Pro koho zvýrazněte jen „předem na účet“, ne celou frázi, a přidejte `&nbsp;` mezi „je“ a „pro“.

---

## 2. Dalších 30 oprav

| # | Kde (šířka) | Co je špatně | Oprava |
|---|---|---|---|
| 11 | `.cover__legend` v kalkulačce (vše) `V_2000.jpg` | „Dotace 83 %“ se láme na „Dotace | 83 | %“ — `span{display:inline-flex;gap:6px}` dělá z každého textového uzlu flex položku | `.cover__legend span{gap:0}` + `.cover__dot{margin-right:6px}`; hodnotu a „%“ zabalte do jednoho `<b>83 %</b>` |
| 12 | `.step__time` (≥760) `W_7000.jpg`, `S10_7800.jpg` | Chipy „necelá minuta / Po–Pá 9–16 / zdarma / na klíč“ nejsou na společné základně — 4. krok má dvouřádkový nadpis | `.step{display:flex;flex-direction:column;height:100%}` + `.step__time{margin-top:auto;align-self:flex-start}` |
| 13 | `.final__in` (1440) `W_10000.jpg` | `max-width:820px;margin:0 310px` — blok je vycentrovaný, ale text zarovnaný vlevo; nesedí na 70px mřížku | `.final__in{max-width:820px;margin:0}` (zůstane vlevo jako zbytek), nebo `text-align:center` + `.final__cta{justify-content:center}` |
| 14 | Finální CTA, text (1440, 390) | „(Po–Pá 9–“ / „16)“ — rozpadlý interval přes řádek | `<span class="nowrap">(Po–Pá 9–16)</span>`, třída `.nowrap` v CSS už existuje |
| 15 | FAQ (1440) `W_9000.jpg` | Všech 10 otázek zavřených, první a nejdůležitější („Mám na dotaci nárok?“) skrytá; pravá polovina viewportu prázdná | Otevřít 1. položku defaultně (`aria-expanded="true"` + `class="faq__item is-open"`) a na ≥960 dát vedle FAQ sloupec s telefonem a „Zavolejte, projdeme to za 3 minuty“ |
| 16 | Galerie `realizace-brandov-0.jpg` vs `realizace-zbraslavice-0.jpg` (vše) `W_8000.jpg` | Vypadá to jako **týž zelený dům ze dvou úhlů**, popsaný jako dvě obce a dva různé výkony (7,7 / 9,9 kWp) | Ověřit u marketingu; jednu fotku vyměnit — jinak je to přesně ten detail, který nedůvěřivá cílovka najde |
| 17 | Galerie, 5. dlaždice | Popisek „Fotovoltaika + ohřev vody / realizace Schlieger“ vybočuje ze vzorce „Obec / Kraj · kWp“ | Doplnit obec a výkon, nebo dlaždici vyhodit (5 fotek ve 3 sloupcích = poslední řádek dvě, což je v pořádku) |
| 18 | `.reviews__foot`, `.gallery__more` | Dva odchozí odkazy `schlieger.cz/recenze` a `/realizace` s `target="_blank"` uprostřed placené LP | Nechat maximálně jeden, dát mu `rel="noopener nofollow"`, nebo nahradit textem bez odkazu („Ověřené recenze z webu schlieger.cz“) |
| 19 | `.review__who span` | Pod každou recenzí je potřetí `schlieger.cz/recenze` | Nechat jen datum |
| 20 | Hero (1440) `V_1.jpg` | Fotka je pod gradientem `rgba(18,22,28,.9→.86)` prakticky neviditelná; z domu s panely, party s izolací a červenou dodávkou nezůstalo nic | `.hero::before{background:linear-gradient(90deg,rgba(18,22,28,.92) 0%,rgba(18,22,28,.55) 45%,rgba(18,22,28,.12) 100%)}` — text vlevo zůstane čitelný, fotka vpravo bude vidět |
| 21 | Hero levý sloupec (1440, 390) | Po úpravách zmizely tři proof odrážky i řádek „Raději zavolám: 226 223 800“; pod textem je 80 px prázdna | Vrátit jeden řádek s telefonem pod text (`.hero__call`) — pro personu „Opatrná Olga“ je klik na telefon druhá konverze |
| 22 | Trust karta pod hero (vše) `V_1.jpg`, `R_1.jpg` | `.trust b i{color:var(--red)}` dělá červené jednotky („15 **let**“, „23 000 **+**“, „80 **+**“, „24 **h**“); červená je na LP barva CTA, tady ji ředí a „+“ s `gap:4px` vypadá odtrženě | `.trust b i{color:var(--ink-3)}` a `gap:2px`; červenou nechte výhradně pro tlačítka |
| 23 | `.stats` (1440) `W_5000.jpg` | Dělící linky mezi sloupci mají různou výšku a popisky se lámou na 2–3 řádky, spodní hrana je roztřepená | `.stat{display:flex;flex-direction:column}` + `.stat span{max-width:20ch;min-height:3.2em}` |
| 24 | `.stats` mobil `R_10000.jpg` | V 2×2 mřížce chybí spodní linka u levé buňky prvního řádku | `.stat{border-bottom:1px solid rgba(255,255,255,.14)}` a `:nth-last-child(-n+2)` nahradit `:nth-child(n+3)` |
| 25 | Sekce „Pro koho“ (1440) `V_950.jpg` | Dvě různé nádoby vedle sebe: bílá karta `.elig__panel` s hairline seznamem a šedá karta `.elig__alt` — „card soup“, proti dohodnutému směru | `.elig__panel{background:none;border:0;padding:0}` (hairline seznam sám o sobě), `.elig__alt` udělat jako jeden odstavec s odkazem, ne karta s duchovým tlačítkem |
| 26 | `.elig__alt .btn--ghost` | Duchové tlačítko „Ověřit, zda mám nárok“ je čtvrtý styl tlačítka na stránce a konkuruje červenému CTA | Nahradit textovým odkazem se šipkou, nebo sjednotit na `.btn--primary` a jedno CTA v sekci |
| 27 | `.quick__opt` (768) `S7_1.jpg` | Na tabletu jsou položky kvízu přes celou šířku a mezi textem a šipkou je 500 px prázdna | `@media (min-width:600px) and (max-width:959px){.quick__opts{grid-template-columns:1fr 1fr}}` |
| 28 | Krok 2 formuláře (mobil) `f_step3.jpg` | Typ střechy má vlastní tlačítko „Pokračovat“, i když jde o jednu volbu; krok 1 přitom pokračuje automaticky | Sjednotit: buď auto-advance i u kroku 2, nebo „Pokračovat“ ve všech krocích. Nekonzistence stojí jedno zbytečné ťuknutí |
| 29 | `.form-choice` „Vaše volba … změnit“ | Pilulka ukazuje jen poslední volbu, takže po kroku 2 zmizí odpověď o nároku, která je pro uživatele nejdůležitější | Zobrazovat nárok trvale: `Nárok: Starobní důchod · změnit` |
| 30 | Krok 4 – kontakt | Pod tlačítkem je 5 řádků souhlasu 12,5 px v `--muted` | `.form-consent{color:var(--ink-3);font-size:13px}` a text zkrátit na dvě věty (návrh v části Copy) |
| 31 | Krok 4 – pole PSČ | `maxlength="6"` u `inputmode="numeric"` a placeholder „250 01“ – uživatel s mezerou narazí na limit při přepisu | `maxlength="6"` ponechat, ale v JS mezeru normalizovat před validací (ověřit, že to `normalizeZip` dělá) |
| 32 | `.success` obrazovka | Nikde není vidět, co uživatel vyplnil, a chybí odhad doplatku, který mu slibujete v CTA („Odeslat a zjistit doplatek“) | Do success doplnit shrnutí: `Váš orientační doplatek: 65 500 Kč` + zvolený typ střechy |
| 33 | `#kalkulacka` H2 | „Posuňte jezdec.“ — chybný pád, správně „jezdce“ | `Kolik zaplatíte vy? Posuňte jezdcem.` (viz Copy) |
| 34 | `.bd__text` (vše) `W_3000.jpg` | Odstavec začíná malým písmenem („zakázky pokryje dotace…“), protože navazuje na grafické „83 %“ nad ním — čte se jako rozbitá věta | Napsat celou větu: `Dotace pokryje 83 % ceny zakázky.` a `83 %` nechat jen jako grafický akcent vedle |
| 35 | `.bd`, `.calc` (1440) | Pod levým sloupcem v obou sekcích zbývá 150–250 px prázdna, protože `align-items:center` sedí jen na jedné z nich | Sjednotit: `.bd{align-items:center}` i `.calc{align-items:center}` a levý sloupec doplnit o jeden konkrétní fakt (např. „Do 125 m² je doplatek pořád 65 500 Kč“) |
| 36 | `.section` rytmus | Všechny sekce mají `padding:120px 0` bez ohledu na váhu obsahu; „Pro koho“ a „Kdo vlastní dům“ tak dostávají stejný prostor jako nabídková karta | Zavést dvě hodnoty: `.section{padding:96px 0}` a `.section--hero-weight{padding:128px 0}` pro formulář, nabídkovou kartu a finální CTA |
| 37 | `.sec-head p` | Perex má `max-width:60ch` (≈ 700 px) a nadpis `18ch`; u „Od kliknutí po hotovou střechu“ vznikne trojřádkový úzký nadpis a vedle něj široký odstavec | `.sec-head h2{max-width:22ch}` + `.sec-head p{max-width:52ch}` |
| 38 | `index.html` CSS, pravidlo `.gallery` v `@media (min-width:960px)` | Přebytečná složená závorka `}}}` na konci řádku — parser si poradí, ale je to tikající mina při dalších úpravách | Smazat jednu `}` |
| 39 | `.why__media` | Fotka „konzultace“ je zjevně AI: nečitelné dokumenty na stole, generické úsměvy, tři lidé u tabletu | Nahradit skutečnou fotkou technika Schlieger (v assets jsou reálné realizace); u cílovky s averzí k riziku je falešná fotka měřitelné riziko |
| 40 | `.why__list` „Servis, který se dovolá“ vs. hlavička a patička | Tři různé otevírací doby: header „Po–Pá 9–16“, servis „Po–So 9–16, neděle a svátky 9–13“, README zmiňuje 8–16 na webu | Sjednotit a v sekci Proč Schlieger uvést jen jednu (rozdíl obchod × servis vysvětlit jedním slovem) |
| 41 | `#lp-consent` typografie | Lišta běží v `system-ui`, zbytek stránky v Poppins — okamžitě viditelná „cizí“ komponenta | `#lp-consent{font-family:var(--ff)!important}` (viz bod 1) |
| 42 | Sticky lišta (390) `P_1.jpg` | Ukazuje se hned po hero a překrývá obsah zároveň s cookie lištou | Zobrazovat až po opuštění sekce formuláře a skrýt, když je formulář ve viewportu (`IntersectionObserver` na `#lead-form-host`) |
| 43 | `.offer` spec grid (390) `R_6250.jpg` | „3,69 kWp | 100 m²“ a pod tím osiřelé „3 875 kWh“ | `grid-template-columns:repeat(3,auto)` na mobilu se zmenšeným písmem, nebo třetí údaj přesunout k odrážkám |
| 44 | `.offer` patička na mobilu `R_7500.jpg` | Ikona zámku je na samostatném řádku vlevo od dvouřádkového textu, opticky mimo | `display:flex;align-items:center;gap:8px;justify-content:center` + text na jeden řádek: `Nezávazně · zaměření zdarma` |
| 45 | H1 + `og:image` | `<title>` i `og:title` obsahují „65 500 Kč“, ale `og:image` ukazuje na URL, která ještě neexistuje (DOPLNIT v README) | Před spuštěním kampaně doplnit, jinak sdílení z Meta vypadá rozbitě |
| 46 | `<link rel="canonical">` | Míří na `schlieger.cz/fotovoltaika-a-zatepleni-strechy/`, což zatím nemusí být finální URL | Ověřit před nasazením (je i v README) |

---

## 3. Copy — přepisy

**Hero H1** (zůstává nejsilnější, jen zkrátit druhý řádek)
> Fotovoltaika i zateplení střechy **za 65 500 Kč**
> Zbytek zaplatí dotace, přijde předem na účet.

*(Dnešní „Zbytek pokryje dotace.“ + samostatný řádek o tom, že dotace přijde předem, říkají totéž dvakrát.)*

**Hero řádek pro koho**
> Pro domácnosti, kde někdo pobírá **starobní důchod, invalidní důchod 3. stupně nebo superdávku**.

*(Vyhoďte OSVČ, dokud to neprojde právníkem — podle podmínek NZÚ Light rozhoduje status domácnosti, ne to, že je někdo OSVČ. Viz README, bod DOPLNIT.)*

**Hero karta, nadpis**
> Pobírá někdo u vás doma důchod nebo superdávku?
> *(podtitul)* Za minutu víte, jestli dostanete dotaci předem na účet.

**Sekce Pro koho, H2**
> Dotaci **předem na účet** dostávají domácnosti s nižšími příjmy

**Formulář, H2**
> Ověřte si nárok a spočítejte doplatek
> *(perex)* Čtyři otázky k domu a střeše. Do 24 hodin voláme s výší dotace i doplatkem pro váš dům.

*(Dnešní „Ověřte si nárok na dotaci předem. Za minutu víte, kolik zaplatíte ze svého.“ je na H2 příliš dlouhé a rozpadá se na čtyři řádky.)*

**Formulář, krok 1**
> Pobírá někdo ve vaší domácnosti důchod nebo superdávku?
> *(hint)* Podle toho poznáme, jestli máte nárok na dotaci předem, nebo na bezúročný úvěr. Výběrem pokračujete dál.

**Formulář, krok 3**
> V jakém stavu je vaše střecha?
> *(druhá otázka na stejné obrazovce)* Jste vlastníkem domu?

**Kalkulačka, H2**
> Kolik zaplatíte vy? Posuňte jezdcem.
> *(perex)* Do 125 m² zůstává doplatek stejný. Zateplení je dotované korunu za korunu.

**Sekce Žádné kličky, úvodní věta**
> Dotace pokryje **83 % ceny**. Zateplení je dotované korunu za korunu, takže za něj nezaplatíte nic navíc. Ze stropu dotace na zateplení (250 000 Kč) vám zbývá 50 000 Kč, třeba na výměnu oken.

**Nabídková karta, nadpis a cenová plotna**
> Fotovoltaika **+** zateplení střechy
> *(nad číslem)* Cena balíčku 385 500 Kč − dotace 320 000 Kč
> *(číslo)* **65 500 Kč**
> *(pod číslem)* váš doplatek včetně DPH, dotaci vyplatí stát předem na účet

**Zelený pás**
> **83 %** ceny balíčku zaplatí dotace NZÚ Light. 320 000 Kč přijde na účet ještě před montáží.

*(Dnešní závorka „(120 000 Kč fotovoltaika + 200 000 Kč zateplení)“ patří do účtenky, ne do pásu.)*

**Sekce Proč Schlieger, podtitul**
> Vyrábíme, montujeme i vyřizujeme dotaci. Za instalaci ručí jedna firma, ne tři.

**Proces, nadpis**
> Od kliknutí po hotovou střechu ve čtyřech krocích

*(Perex pod ním dnes tutéž větu opakuje — nahradit za:)*
> Vy odpovíte na čtyři otázky, zbytek včetně úřadů je na nás.

**Finální CTA**
> Zjistěte, kolik zaplatíte ze svého
> Odpovíte na čtyři otázky, my do 24 hodin (Po–Pá 9–16) voláme s orientační cenou a výší dotace pro váš dům. Nezávazně a zdarma.

**Souhlas pod odesláním (zkráceno)**
> Odesláním nám předáváte údaje, abychom vám mohli zavolat a připravit nezávaznou nabídku. Zpracovává je Schlieger, s. r. o., třetím stranám je pro jejich marketing nepředáváme a kdykoli je můžete nechat vymazat. Podrobnosti v [zásadách ochrany osobních údajů](#).

**Success obrazovka, doplnit řádek**
> Váš orientační doplatek podle zadaných údajů: **65 500 Kč**. Přesnou cenu potvrdíme po zaměření.

**Mikrotexty, které se opakují a dají se zkrátit**
- „Nezávazně a zdarma · do 24 hodin zavoláme“ je pod pěti CTA. U dvou z nich stačí „Nezávazně a zdarma“, jinak to čte jako šablona.
- „Dotaci vyřídíme za vás“ je v hero, v lištách formuláře, v sekci Proč Schlieger i v procesu. Ponechte v hero a v procesu.
