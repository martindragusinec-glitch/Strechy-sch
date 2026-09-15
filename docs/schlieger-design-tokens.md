# Schlieger.cz — design tokens

Extracted from the live Elementor "Global Kit" CSS (`css/post-55-global.css`, selector `.elementor-kit-55`),
confirmed against `css/custom-*.css` overrides. Site runs on WordPress + Elementor (theme: Hello Elementor).

## Colors

| Token | Hex | Usage |
|---|---|---|
| `--e-global-color-primary` | `#DA000F` | Primary brand red — buttons, CTAs, links on hover, accents, badges |
| `--e-global-color-d1529d4` / `512e6b2` | `#AD0F1A` | Darker red — hover/active state of primary buttons, gradients |
| `--e-global-color-secondary` | `#24A531` | Green accent — "eco/savings" badges, success states |
| `--e-global-color-80a4fdd` | `#1B7C25` | Darker green — hover of secondary green elements |
| `--e-global-color-accent` | `#61CE70` | Light green accent |
| `--e-global-color-b1b30ce` | `#FFC800` | Yellow — highlights, star ratings, warning/promo badges |
| `--e-global-color-38a0bef` | `#383F47` | Primary text / heading color (near-black graphite) |
| `--e-global-color-text` | `#7A7A7A` | Secondary / body text gray |
| `--e-global-color-0906a04` | `#B0B6BB` | Muted gray (placeholders, borders, disabled) |
| `--e-global-color-506086a` | `#FFFFFF` | White — button text, cards on dark bg |
| `--e-global-color-616717d` | `#F9F9F9` | Off-white section background |
| `--e-global-color-694fea7` | `#00000017` | Black @ ~9% opacity — subtle overlays/borders |
| page transition | `#FFBC7D` | Loading/transition accent (apricot) |
| body background | `#FFFFFF` | Page background |

**Primary brand red `#DA000F`** and **graphite `#383F47`** are the two colors to anchor a palette on;
green (`#24A531`) is used specifically for savings/eco messaging, yellow (`#FFC800`) for stars/badges.

## Typography

- **Font family (everything — body, headings, buttons):** `"Poppins", Sans-serif`
- Loaded from **Google Fonts**: weights 100–900 incl. italics, subset `latin-ext` (needed for Czech diacritics)
  `https://fonts.googleapis.com/css?family=Poppins:100,100italic,200,...,900,900italic&display=swap&subset=latin-ext`
- Base body: `font-size: 16px; font-weight: 400; line-height: 24px;`
- Headings (from kit defaults, actual pages often override size per-widget via Elementor):
  - `h1`: 700 weight (size set per-page, typically 40–56px on hero sections)
  - `h2`: `36px / 48px line-height`, weight 600
  - `h3`: `16px` base / weight 600 (commonly overridden larger, ~24px, in content)
  - `h4`–`h6`: font-family inherited, size/weight set per widget
  - Links: primary font, color `#383F47`, turns brand red on hover in practice

## Buttons

```css
.elementor-button, button, input[type="submit"] {
  background-color: #DA000F;
  color: #FFFFFF;
  font-family: "Poppins", Sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  text-decoration: none;
  border-radius: 8px 8px 8px 8px;   /* 8px all corners */
  padding: 16px 16px 16px 16px;     /* 16px all sides */
}
.elementor-button:hover,
.elementor-button:focus {
  color: #FFFFFF;                    /* bg darkens to ~#AD0F1A in practice */
}
```
Secondary/outline buttons follow the same 8px radius pattern seen on cards and form-step chips
(e.g. `.jet-checkboxes-list__item{border:1px solid #DA000F;border-radius:8px}`).

## Border radius scale (observed across the site)

- `3px` — small pill/tag links (`.jet-listing-dynamic-terms__link`)
- `4px` / `8px` — dominant radius: buttons, cards, form wrappers, icon boxes, sliders, repeater items
- `12px` — tooltips
- `16px` — larger decorative panels (`.radius`)
- `50px` — pill/gradient backgrounds
- `50%` — circular icon buttons / avatar-style elements

**Recommended default radius for a clone: 8px** (buttons, cards, inputs), with 50% for circular icons/avatars.

## Shadows

- Card/element shadow: `box-shadow: 0 2px 12px 0 rgba(0,0,0,.12)`
- Small lift: `box-shadow: 0 4px 4px 0 rgba(0,0,0,.25)`
- Large soft hero/panel shadow: `box-shadow: 0px 20px 50px 0px rgba(18,17,39,0.08)`
- Multi-layer ambient shadow (used on floating cards):
  `0px 300px 84px rgba(0,0,0,0), 0px 192px 77px rgba(0,0,0,0), 0px 108px 65px rgba(0,0,0,.01), 0px 48px 48px rgba(0,0,0,.02), 0px 12px 26px rgba(0,0,0,.02)`

## Layout

- Container max-width: **1200px** (boxed Elementor sections), stepping down to **1024px** at the `max-width:1024px` breakpoint, and further at 767px for mobile.
- Section widget spacing defaults to 0 (Elementor container gap tokens `--widgets-spacing: 0px 0px`), i.e. spacing is set per-section/widget rather than globally.
- Grid: standard Elementor flex/CSS-grid containers (`.e-con`), no custom grid framework.

## Files saved

- `css/post-55-global.css` — Elementor global kit (source of all tokens above)
- `css/hello-elementor-style.min.css`, `css/hello-elementor-theme.min.css`, `css/header-footer.min.css` — base theme CSS
- `css/megamenu-style.css` — Max Mega Menu plugin styles
- `css/custom-9169.css` … `css/custom-54602.css` (12 files) — site-specific custom CSS/JS snippets (incl. Cookiebot dialog overrides, animations, form styling)
