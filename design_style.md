# Pine Forge Soap Co. — Design Style Guide

> Source of truth for every section of the Pine Forge landing page.
> Reference image: [`design-reference/pine-forge-hero.jpg`](design-reference/pine-forge-hero.jpg) (hero, 16:9).
> Before building any new section, re-read **§1 Brand DNA**, **§3 Typography**, and **§10 Section Recipes**, then run the **§13 Checklist**.

---

## 1. Brand DNA (the "feel")

| Trait | What it means visually |
|---|---|
| **Rugged, outdoorsy, masculine** | Cold mountain/ski imagery, pine-tree crest, leather/wood/smoke notes. |
| **Bold & blunt** | Huge condensed all-caps headlines, short punchy sentences ending in periods ("REAL SCENT. REAL SOAP. REAL MAN."). |
| **Wry humor** | Italic serif sub-lines deliver the joke ("Built for men who actually shower."). |
| **Premium craft** | Lots of breathing room, thin 1px outlines, tracked micro-caps, restrained palette. |
| **Cinematic** | Full-bleed photography is the hero; UI floats over it in white. No boxed cards on the hero. |

**Content theme:** all copy and imagery are written by Claude around **skiing in snowy mountains**: powder runs, chairlifts, cold summits, après-ski and the hot shower after.

**Voice formula:** `BOLD CLAIM. BOLD CLAIM. BOLD CLAIM.` + *one italic, dry punchline.*
Every section headline should be 2–5 words, all caps, ending in a period.

---

## 2. Color System

Colors sampled directly from the reference image.

### Core tokens

| Token | Hex | Use |
|---|---|---|
| `--pf-ink` | `#0B0E15` | Primary dark — info bar, dark sections, footer. Near-black with a navy cast (never pure `#000`). |
| `--pf-ink-2` | `#151A24` | Raised dark surfaces (cards on dark sections, hover rows). |
| `--pf-white` | `#FFFFFF` | All text/icons on photography & dark backgrounds. |
| `--pf-frost` | `#E1E4E9` | Light section background (pale snowy sky). |
| `--pf-snow` | `#F4F5F7` | Alternate light background / card fill. |
| `--pf-sky` | `#A5BDD5` | Accent tint from the sky; subtle fills, gradients, focus rings. |
| `--pf-steel` | `#8EA8C1` | Muted blue-grey; secondary text on light bg, borders. |
| `--pf-slate` | `#6C7383` | Body text on light bg (secondary), disabled. |
| `--pf-ember` | `#D9894F` | Warm accent — sparingly (sale tags, "new" dots, hover highlights). Taken from the orange goggle-lens sunset. |
| `--pf-cream` | `#E8D9B5` | Soap-bar cream — product backdrops, badges. |
| `--pf-pine` | `#1F3A2E` | Deep pine green — optional accent for "natural" messaging / eco badges. |

### Transparency tokens (UI over photos)

| Token | Value | Use |
|---|---|---|
| `--pf-line` | `rgba(255,255,255,0.85)` | 1px outline buttons over photos. |
| `--pf-line-soft` | `rgba(255,255,255,0.35)` | Vertical dividers between features, separators in info bar. |
| `--pf-text-dim` | `rgba(255,255,255,0.75)` | Secondary white text (scent descriptor, micro labels). |
| `--pf-scrim` | `linear-gradient(90deg, rgba(11,14,21,.55) 0%, rgba(11,14,21,0) 45%)` | Left scrim to keep bottom-left text legible. |
| `--pf-scrim-bottom` | `linear-gradient(0deg, rgba(11,14,21,.6) 0%, rgba(11,14,21,0) 35%)` | Bottom scrim behind feature row. |

### Color rules
- **Hero / photo sections:** text is always white. No colored text on photos.
- **Dark sections:** `--pf-ink` background, white headings, `--pf-text-dim` body.
- **Light sections:** `--pf-frost` or `--pf-snow` background, `--pf-ink` headings, `--pf-slate` body.
- **Accent budget:** `--pf-ember` appears at most once or twice per viewport. The design is ~90% white/ink/blue-grey.
- Alternate section backgrounds: photo → frost → ink → snow → photo… to create rhythm.

---

## 3. Typography

Three families. Never introduce a fourth.

| Role | Font (Google Fonts) | Fallbacks | Notes |
|---|---|---|---|
| **Display** (headlines, logo wordmark) | `Anton` (primary) — alt: `Bebas Neue`, `Oswald 700` | `Impact, "Arial Narrow Bold", sans-serif` | Ultra-condensed, heavy, all caps, tight leading. |
| **UI / Label** (nav, buttons, eyebrows, micro-caps, product names) | `Oswald` 400–600 | `"Arial Narrow", sans-serif` | Uppercase with wide tracking. |
| **Accent Serif** (taglines, scent descriptors, quotes) | `Playfair Display` *Italic* 400–500 | `Georgia, serif` | Always italic. Sentence case. The "voice" of the brand. |
| **Body** (paragraphs, reviews, long copy) | `Inter` 400/500 | `system-ui, sans-serif` | Only for paragraphs > 1 line. |

```html
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@400;500;600&family=Playfair+Display:ital,wght@1,400;1,500&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

### Type scale (desktop 1440px → mobile 375px)

Measured from the 736px reference and scaled ×1.96 to 1440px.

| Token | Desktop | Mobile | Family | Weight | Case | Tracking | Line-height |
|---|---|---|---|---|---|---|---|
| `display-xl` (hero headline) | 96px (`clamp(3rem, 6.7vw, 6rem)`) | 48px | Anton | 400 | UPPER | `0.01em` | `0.98` |
| `display-lg` (section headline) | 64px (`clamp(2.5rem, 4.5vw, 4rem)`) | 40px | Anton | 400 | UPPER | `0.01em` | `1.0` |
| `display-md` (product/feature title) | 32px | 26px | Anton | 400 | UPPER | `0.02em` | `1.05` |
| `title-spaced` (e.g. "BARREL AGED") | 28px | 22px | Oswald | 500 | UPPER | `0.22em` | `1.1` |
| `tagline` (italic punchline) | 26px | 18px | Playfair Display Italic | 400 | Sentence | `0` | `1.3` |
| `descriptor` (scent line) | 17px | 15px | Playfair Display Italic | 400 | Title Case | `0` | `1.4` |
| `nav` | 13px | 14px (in drawer: 24px) | Oswald | 500 | UPPER | `0.14em` | `1` |
| `button` | 13px | 13px | Oswald | 500 | UPPER | `0.16em` | `1` |
| `eyebrow` (e.g. "— NEW DROP —") | 12px | 11px | Oswald | 500 | UPPER | `0.25em` | `1` |
| `micro` (feature labels, info bar) | 11px | 10px | Oswald | 400 | UPPER | `0.18em` | `1.35` |
| `body` | 16px | 15px | Inter | 400 | Sentence | `0` | `1.6` |

### Typography rules
- Headlines are **stacked**: one claim per line, each ending in a period. Use `<br>` or block spans, don't rely on wrapping.
- Headlines are **left-aligned** and placed in the right half of hero-type sections; centered only on narrow promo strips.
- Never bold the italic serif. Never put serif in uppercase.
- Micro labels split into two lines: **line 1 = what**, **line 2 = why** (e.g. `PINE SCENTED` / `BOLD. CLEAN.`).
- Logo wordmark: `PINE FORGE` in Anton ~22px, tracking `0.04em`; under it `SOAP CO.` in Oswald 9px, tracking `0.35em`, centered under the wordmark.

---

## 4. Layout & Grid

- **Canvas:** full-bleed sections; content container `max-width: 1320px`, side padding `clamp(16px, 4vw, 40px)`.
- **Grid:** 12 columns, `gap: 24px` desktop / `16px` mobile.
- **Hero split:** visual weight left (subject's face), copy block occupies **columns 8–12** (right ~40%), vertically at ~45–80% of hero height.
- **Asymmetric anchoring:** secondary info anchors to **bottom-left** (product drop card), features anchor to **bottom-right**. Reuse this "corner anchoring" in other image sections.
- **Hero height:** `min-height: 100svh` (desktop aspect ≈ 16:9), minus nothing — nav overlays the image.
- **Section vertical padding:** `clamp(72px, 10vw, 140px)`.

### Spacing scale (8-based)
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

| Context | Value |
|---|---|
| Headline line → tagline | 16–20px |
| Eyebrow → title | 8px |
| Title → descriptor | 4px |
| Descriptor → button | 20px |
| Feature item gap (incl. divider) | 24px each side of divider |
| Nav link gap | 40px |

---

## 5. Navigation (header)

Transparent, overlays the hero, white everything.

```
[PINE FORGE / SOAP CO.]   SHOP  BAR SOAPS  BUNDLES  ABOUT US        (FIND US AT DAYTONA RIVERFRONT MARKET →)  🛍 (0)
```

- Height: 80px desktop, 64px mobile. Padding-x matches container.
- Logo left; nav links immediately right of logo (gap ~56px from logo), **not centered**.
- Right cluster: **pill outline CTA** + bag icon with count `(0)` in Oswald (no badge bubble).
- On scroll (> 40px): background `rgba(11,14,21,0.85)` + `backdrop-filter: blur(12px)`, height shrinks to 64px. Text stays white.
- Hover on links: 1px white underline grows from left (`scaleX 0 → 1`, 300ms).
- Mobile (<1024px): hide links + pill; show hamburger (2 lines, 24px wide, 1.5px stroke). Drawer is full-screen `--pf-ink`, links in Anton 40px stacked, pill CTA at bottom.

---

## 6. Buttons & Interactive Elements

All buttons: Oswald 500, 13px, uppercase, tracking `0.16em`, trailing arrow `→` (Lucide `arrow-right`, 14px, 1.5px stroke) with 8px gap.

| Variant | Shape | Default | Hover |
|---|---|---|---|
| **Outline Rect** (primary on photos, e.g. "SHOP NOW →") | Sharp corners (`border-radius: 0`), 1px `--pf-line`, padding `12px 22px` | Transparent, white text | Fill white, text `--pf-ink`; arrow nudges `+4px` X |
| **Pill Outline** (utility/location CTA) | `border-radius: 999px`, 1px `--pf-line`, padding `9px 18px`, 11px text | Transparent, white text | Fill `rgba(255,255,255,.12)` |
| **Solid Dark** (light sections) | Sharp corners, `--pf-ink` bg, white text, padding `14px 26px` | — | bg `--pf-ink-2`, arrow nudges |
| **Outline Dark** (light sections) | Sharp corners, 1px `--pf-ink` | Transparent, ink text | Fill ink, text white |
| **Text Link** | No border; 1px underline offset 4px | — | underline thickens/arrow nudges |

Rules:
- Rectangles for **commerce actions** (shop, add to bag). Pills for **info/utility** (location, filters, tags).
- No drop shadows on buttons. No gradients on buttons.
- Focus: `outline: 2px solid var(--pf-sky); outline-offset: 3px`.

---

## 7. Iconography

- **Style:** thin line icons, 1.5px stroke, white (or ink on light bg), ~22–26px in features, 18–20px in nav. Use **Lucide**.
- Feature icons in the reference: pine tree (`tree-pine`), leaf/drop (`leaf`), shield (`shield-check`). Other suitable: `flame`, `droplets`, `mountain`, `package`, `truck`, `hand`.
- Logo crest: pine tree inside a shield/triangle — use a simple SVG pine glyph if needed.

### Feature row pattern (hero bottom-right)
```
[icon]  PINE SCENTED   |   [icon]  NATURAL OILS   |   [icon]  HANDMADE IN USA
        BOLD. CLEAN.   |           NO JUNK.       |           BUILT TO LAST.
```
- Icon left, two-line micro text right (gap 12px).
- Vertical dividers: 1px × 32px, `--pf-line-soft`.
- Reuse this exact pattern for trust/USP strips elsewhere (dark section version: same, on `--pf-ink`).

---

## 8. Signature Components

### 8.1 "Drop Card" (bottom-left of hero) — no box, just stacked type
```
— NEW DROP —            ← eyebrow, dashes are 16px × 1px lines
BARREL AGED             ← title-spaced (Oswald, tracking .22em)
Smoky Vanilla & Aged Leather Scent   ← descriptor (Playfair italic, dim white)
[ SHOP NOW → ]          ← Outline Rect button
```
Reuse for any featured product/announcement over imagery.

### 8.2 Eyebrow with dashes
`<span class="eyebrow">— NEW DROP —</span>` — render dashes as pseudo-elements (`::before/::after`, 16px wide, 1px, currentColor) with 10px gap. Use above every section headline.

### 8.3 Info Bar (bottom strip)
- Full-width, `--pf-ink`, height 44px, micro text white, tracking `0.18em`.
- Left: `FIND US AT DAYTONA RIVERFRONT MARKET | CORNER OF BEACH ST. & ORANGE AVE, DAYTONA BEACH, FL`
- Right: `@PINEFORGESOAPCO | PINEFORGESOAPCO.COM`
- Separators: `|` in `--pf-line-soft` with 16px horizontal margin.
- Mobile: becomes a horizontal marquee (slow, 40s loop) or stacks centered.

### 8.4 Product Card (for Shop / Bar Soaps / Bundles)
- Image area: 4:5 ratio, `--pf-cream` or `--pf-snow` background, soap bar centered, subtle drop shadow `0 20px 40px rgba(11,14,21,.18)` on the product only.
- Below image (16px gap):
  - Name: Anton 24px uppercase (`BARREL AGED`)
  - Descriptor: Playfair italic 15px, `--pf-slate` (`Smoky Vanilla & Aged Leather`)
  - Row: price (Oswald 500, 16px, tracking .08em) left · `ADD TO BAG →` text-link right
- Corners: **square** (radius 0). Border: none; hover lifts image `translateY(-6px)` + scale 1.03 on product.
- Optional tag top-left: pill, `--pf-ink` bg, white micro text (`NEW`, `BEST SELLER`); use `--pf-ember` bg for `LIMITED`.

### 8.5 Section Header (reusable)
```
— EYEBROW —
HEADLINE. HEADLINE.
Italic serif punchline that's a little funny.
```
Left-aligned by default; header block max-width ~640px. Optional right-aligned "VIEW ALL →" text link on the same baseline as the headline.

---

## 9. Imagery & Art Direction

- **Photography:** cinematic, high-contrast, cold blue-grey skies + warm skin/sunset accents. Action/outdoors (snow, mountains, rain, ocean spray, workshop, campfire).
- **Product shots:** soap bars as heroes — tactile textures, flying particles (snow, water droplets, wood chips), dramatic lighting.
- **Composition:** subject on the left, negative space (sky) on the right for copy.
- **Treatment:** add scrims, never colored overlays. Slight cool grade. Avoid stock-cheesy smiles.
- **Texture:** optional subtle snow/particle layer (small white dots, 20–40% opacity, blurred) floating over hero imagery — mirrors the snowflakes in the reference.
- Use `object-fit: cover` with `object-position: 30% center` so the face stays in frame on mobile.

---

## 10. Section Recipes (keep the site uniform)

Use these defaults for upcoming sections. Background rhythm noted in brackets.

1. **Hero** [photo] — as reference: nav overlay, stacked headline right, drop card bottom-left, feature row bottom-right, info bar under.
2. **Bar Soaps / Shop grid** [frost] — Section Header ("THE LINEUP." / *Pick your poison. All of them are safe.*) + 4-col product grid (2-col tablet, 1.2-col swipe carousel mobile).
3. **Featured Scent / Story split** [ink] — 50/50: big product photo left, right side eyebrow + display-lg + body + Outline-on-dark button; tasting-note list using the feature-row pattern (top/heart/base notes).
4. **Bundles** [snow] — 3 cards, middle one emphasized (ink background, white text, `BEST VALUE` ember pill). Square corners, 1px `--pf-steel` borders on others.
5. **Why Pine Forge / Ingredients** [photo with dark scrim] — centered display-lg, 3–4 icon features in the feature-row style, larger (icons 32px).
6. **About** [frost] — asymmetric: image spans cols 1–6, copy cols 8–12; pull-quote in Playfair italic 32px.
7. **Reviews** [ink] — horizontal carousel; quote in Playfair italic 22px white, name in micro caps, 5 stars as thin line icons in `--pf-cream`.
8. **Find Us / Market** [photo] — map or market photo, pill CTA, address in micro caps.
9. **Newsletter** [ink-2] — "JOIN THE CREW." + italic line; input with 1px bottom border only (white), square Outline Rect submit.
10. **Footer** [ink] — logo, 4 link columns (Oswald micro headings, Inter 14px links in dim white), bottom row = Info Bar pattern.

---

## 11. Motion

Keep motion confident and weighty, not bouncy-cute.

| Element | Animation |
|---|---|
| Hero headline | Each line slides up from `y: 100%` inside an `overflow:hidden` mask, stagger 0.12s, `power4.out`, 0.9s. |
| Tagline / drop card / features | Fade + `y: 20px → 0`, stagger 0.08s, after headline. |
| Section reveals (scroll) | Fade + `y: 40px → 0`, `power3.out`, 0.8s, trigger at 80% viewport. |
| Images | Subtle scale `1.08 → 1` on reveal; parallax ±6% on scroll. |
| Snow particles | Slow drift down, 8–14s loops, random x-sway. |
| Buttons | 250ms color fill, arrow translateX 4px. |
| Nav | Background fade-in on scroll, 300ms. |

- Easing tokens: `--ease-out: cubic-bezier(.16,1,.3,1)`; `--ease-in-out: cubic-bezier(.65,0,.35,1)`.
- Respect `prefers-reduced-motion: reduce` → disable transforms/particles, keep opacity fades ≤ 200ms.
- Content must be visible if JS fails (set initial hidden states via a `.js` class on `<html>`).

---

## 12. Code Tokens (copy into every build)

```css
:root {
  /* color */
  --pf-ink:#0B0E15; --pf-ink-2:#151A24; --pf-white:#FFFFFF;
  --pf-frost:#E1E4E9; --pf-snow:#F4F5F7; --pf-sky:#A5BDD5; --pf-steel:#8EA8C1;
  --pf-slate:#6C7383; --pf-ember:#D9894F; --pf-cream:#E8D9B5; --pf-pine:#1F3A2E;
  --pf-line:rgba(255,255,255,.85); --pf-line-soft:rgba(255,255,255,.35);
  --pf-text-dim:rgba(255,255,255,.75);

  /* type */
  --font-display:"Anton", Impact, "Arial Narrow Bold", sans-serif;
  --font-ui:"Oswald", "Arial Narrow", sans-serif;
  --font-serif:"Playfair Display", Georgia, serif;
  --font-body:"Inter", system-ui, sans-serif;

  /* layout */
  --container:1320px;
  --gutter:clamp(16px,4vw,40px);
  --section-y:clamp(72px,10vw,140px);

  /* motion */
  --ease-out:cubic-bezier(.16,1,.3,1);
  --ease-in-out:cubic-bezier(.65,0,.35,1);
}

.display-xl{font-family:var(--font-display);font-size:clamp(3rem,6.7vw,6rem);line-height:.98;letter-spacing:.01em;text-transform:uppercase}
.display-lg{font-family:var(--font-display);font-size:clamp(2.5rem,4.5vw,4rem);line-height:1;letter-spacing:.01em;text-transform:uppercase}
.title-spaced{font-family:var(--font-ui);font-weight:500;font-size:clamp(1.375rem,2vw,1.75rem);letter-spacing:.22em;text-transform:uppercase}
.tagline{font-family:var(--font-serif);font-style:italic;font-size:clamp(1.125rem,1.8vw,1.625rem);line-height:1.3}
.descriptor{font-family:var(--font-serif);font-style:italic;font-size:clamp(.9375rem,1.2vw,1.0625rem)}
.eyebrow{font-family:var(--font-ui);font-weight:500;font-size:.75rem;letter-spacing:.25em;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px}
.eyebrow::before,.eyebrow::after{content:"";width:16px;height:1px;background:currentColor}
.micro{font-family:var(--font-ui);font-size:.6875rem;letter-spacing:.18em;text-transform:uppercase;line-height:1.35}
.btn{font-family:var(--font-ui);font-weight:500;font-size:.8125rem;letter-spacing:.16em;text-transform:uppercase;display:inline-flex;align-items:center;gap:8px;transition:background .25s,color .25s}
.btn-outline{border:1px solid var(--pf-line);padding:12px 22px;color:#fff}
.btn-outline:hover{background:#fff;color:var(--pf-ink)}
.btn-pill{border:1px solid var(--pf-line);border-radius:999px;padding:9px 18px;font-size:.6875rem;color:#fff}
.btn .arrow{transition:transform .25s var(--ease-out)}
.btn:hover .arrow{transform:translateX(4px)}
```

### Tailwind (CDN) config equivalent
```js
tailwind.config = {
  theme: { extend: {
    colors: { ink:'#0B0E15', ink2:'#151A24', frost:'#E1E4E9', snow:'#F4F5F7',
              sky:'#A5BDD5', steel:'#8EA8C1', slate:'#6C7383', ember:'#D9894F',
              cream:'#E8D9B5', pine:'#1F3A2E' },
    fontFamily: { display:['Anton','Impact','sans-serif'], ui:['Oswald','sans-serif'],
                  serif:['"Playfair Display"','Georgia','serif'], body:['Inter','system-ui','sans-serif'] },
    letterSpacing: { micro:'.18em', btn:'.16em', eyebrow:'.25em', spaced:'.22em' },
    maxWidth: { container:'1320px' },
  } }
}
```

---

## 13. Responsive Behavior

| Breakpoint | Changes |
|---|---|
| ≥1280 | As designed. |
| 1024–1279 | Nav gap 28px; headline 80px; feature row may wrap to 2+1. |
| 768–1023 | Hamburger nav; hero copy moves to bottom-right over a bottom scrim; drop card above info bar on left; features become a row below hero (on ink). |
| <768 | Hero: image `object-position: 30% center`; headline 48px, right-aligned block becomes full-width, bottom-aligned; drop card + features stack below hero on `--pf-ink`; feature row becomes 3 stacked items with horizontal dividers; info bar → marquee. Grids 1 col / swipe carousel. 16px side gutter, no horizontal scroll. |

---

## 14. Consistency Checklist (run before shipping any section)

- [ ] Headline in **Anton, ALL CAPS, ends with a period**, stacked short lines.
- [ ] Exactly one **italic Playfair** punchline/descriptor near the headline.
- [ ] Eyebrow uses the **— DASHED —** pattern in Oswald micro caps.
- [ ] Buttons: **square outline for shop**, **pill for utility**, arrow `→`, no shadows/gradients/rounded rects.
- [ ] Only palette tokens used; ember accent ≤ 2 per viewport.
- [ ] Icons: Lucide, 1.5px stroke, line style.
- [ ] Section background follows the photo → frost → ink → snow rhythm.
- [ ] Wide tracking on all uppercase UI text (≥ 0.14em); none on display headlines.
- [ ] Square corners everywhere except pills.
- [ ] Reveal animations use `--ease-out`, reduced-motion respected.
- [ ] Works at 375px with no horizontal scroll.
