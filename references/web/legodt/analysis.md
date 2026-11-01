# LEGODT - Web Design Reference Analysis (2026-11-01)

## Topic & Direction
- **Topic:** brand intro page for LEGODT, the Korean modular tumbler brand (Loop Tumbler series, swappable parts, charms and stickers, collaborations). Not the LEGO toy company.
- **Audience:** MZ generation, teens to 30s, who like personalization and tumbler decorating.
- **Tone:** playful, colorful, pop. Bold type, saturated flat color blocks, sticker and charm motifs, rounded shapes. "Choose your color like playing."

## Capture limits
- Most original sites were offline or blocked, so no live-site or 390px mobile shots exist.
- gdweb shots are full-page design images hosted on gdweb. No motion was observed.
- dbcut shots are 452x250 thumbnails (hero area only).

## Per-reference analysis
1. **Lulupop World (gdweb 16180, pink)** - Full-bleed hero with character cluster; stacked centered-title sections (lineup, card carousel, quiz, hashtag cards, purple "where to buy" band). Palette: #FF8FC8, #FFB3DC, #B58BE6, #2EC4E8, #FFD93B, #5B2B8C. Heavy rounded caps, pill-outline buttons, dot patterns, marquee strips, 80-120px section gaps. Strength: a color per section. Caveat: busy, low-contrast pink-on-pink small text.
2. **Seoul Art Goods Festival 2026 (gdweb 27642, blue/yellow)** - One full-viewport poster: vertical title, top menu, countdown, giant letterform with key-ring graphics. Palette: #FFE600 and #0038D9. Ultra-bold grotesque with extreme size contrast. Caveat: vertical text works poorly on mobile.
3. **Tida Stationery (gdweb 21639)** - Rounded promo banner, giant two-tone headline, product cards, spiky sticker shapes, tilted-sticker event block. Palette: #8A63F0, #5AA8FF, #FF4B2B, #111, #F5F3EE. Strength: sticker-burst motif fits "decorate your tumbler". Caveat: too dense for a brand intro.
4. **TVING MALL (gdweb 15884)** - Yellow hero, 5-column product carousels on alternating pastel bands, BEST 10 grid, review carousel. Palette: #FFD800 with pastels #FFF4E0, #E8F5EE, #EEE8FA, #E3F1FB, #FCE9EA. Strength: pastel band rhythm. Caveat: generic commerce.
5. **eepop (gdweb 18149)** - Sparse hero with floating cards, centered titles, coverflow carousels with a highlighted center item. Palette: #F7F7F8, #E8392E, small multicolor dots. Strength: floating dots add playfulness cheaply.
6. **Vita500 (dbcut 15290, thumbnail)** - Framed stage on a full orange field, headline left, product right. Palette: #FF8A00 to #FF6A00, #F7F1EE. Strength: one dominant hue.
7. **tft mall (dbcut 19381, thumbnail)** - Round orange icon buttons, rounded hero slider with blob shapes, pill CTA. Palette: #FF5A1F, #F3E9DF. Strength: friendly rounded containers.
8. **HOSB (dbcut 23639, thumbnail)** - Full-width lifestyle scene hero. Palette: orange #E8501E against neutral white and wood.

## Common patterns
- Section color blocking with a different background per section.
- Oversized heavy display type, centered or clipped at the viewport edge.
- Pill buttons and round icon buttons.
- Sticker, burst, and tilted-label shapes plus dot patterns.
- Marquee strips as section dividers.
- Carousels for lineups.
- Product on a flat or soft background card.

## Recommendations
- **Direction:** "pop sticker sheet". Cream base, one saturated color per section, big rounded type, tilted sticker labels, modular-parts theme.
- **Section order:**
  1. Header: logo, links (Brand, Lineup, Customize, Collab, Where to buy), pill CTA.
  2. Hero: giant headline, tumbler on a colored blob, floating charms and stickers.
  3. Marquee strip.
  4. Brand intro: 3 cards (swap parts, 6-hour hot/cold, spill resistant).
  5. Interactive part picker (body, lid, handle, sleeve colors).
  6. Lineup: Multi, Handy, Module, Tritan cards on pastel bands. Mark prices as reseller values.
  7. Collab, charms and stickers gallery.
  8. Where to buy: Olive Young, 29CM, CJ OnStyle, legodt.jp, marked "as reported" (unverified).
  9. Footer.
- **Tokens:**

```css
:root {
  --color-bg:#FFFBF4; --color-ink:#1B1B2F;
  --color-pink:#FF6FB5; --color-yellow:#FFD60A; --color-blue:#2F5BFF;
  --color-mint:#2EE6B0; --color-orange:#FF7A2F; --color-purple:#8A5CF6;
  --color-pastel-pink:#FFE1F0; --color-pastel-mint:#DDF8EE;
  --color-pastel-blue:#E1EBFF; --color-pastel-yellow:#FFF3B8;
  --font-display:"Jua","Black Han Sans","Pretendard",sans-serif;
  --font-body:"Pretendard","Noto Sans KR",system-ui,sans-serif;
  --fs-hero:clamp(2.75rem,9vw,7rem); --fs-h2:clamp(2rem,5vw,3.5rem);
  --fs-h3:1.5rem; --fs-body:1rem; --fs-small:.875rem;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:64px; --space-6:96px;
  --radius-card:28px; --radius-pill:999px;
  --border-ink:3px solid var(--color-ink); --shadow-pop:6px 6px 0 var(--color-ink);
}
```

- **Components:**
  - Pill button: 14px 28px padding, 3px ink border, hard shadow, 2px shift on hover.
  - Cards: 28px radius, pastel fill, ink outline; 1 column on mobile, 2 at 720px, 4 at 1200px.
  - Sticker labels: rotated -6 to 6 degrees, starburst clip-path.
  - Marquee: translateX loop. Floating dots: slow vertical drift. Stop both under `prefers-reduced-motion`.
  - Body text at least 16px, dark ink on pastel fills.
  - Container max-width 1200px; section spacing 64px mobile, 96-120px desktop.
- **Assets:** use only free images (Unsplash, Pexels, or self-drawn SVG tumblers). Never reuse reference or official LEGODT images. Jua and Black Han Sans (Google Fonts, open license) and Pretendard (OFL) must be downloaded locally, no CDN.
