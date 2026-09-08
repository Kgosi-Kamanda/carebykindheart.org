# Care by Kind Heart — Neumorphic Design System

Static site (vanilla HTML/CSS/JS, no build step, no framework). This document governs the visual
restyle from flat-card/bordered UI to soft neumorphism, applied on top of the existing brand
palette (forest green, teal, crimson, gold) and existing copy/content/structure, which are unchanged.

## 1. Visual Theme & Atmosphere

**Philosophy:** surfaces are carved from the same material as the page behind them. Cards,
buttons, icon tiles, and form fields read as soft, pressable, physical objects — raised where
they invite a tap, recessed where they collect input — rather than flat rectangles floating on
borders. Depth comes entirely from a dual light/shadow pair, never from a hard edge.

**Mood keywords:** soft, tactile, calm, warm-clinical, quietly premium. This is a healthcare
nonprofit serving seniors and medically fragile children — the softness should read as gentle and
reassuring, not trendy or toy-like. No glassmorphism, no hard drop shadows, no visible borders on
primary surfaces.

**One-line brief:** "A caregiver's hand resting on a table" — solid, warm, present, never sharp.

**Hard constraint carried over:** pure static site. All effects are CSS-only (`box-shadow`,
`transition`, existing IntersectionObserver reveal). No new JS libraries, no build step.

## 2. Color Palette & Roles

Brand hues are unchanged (see `assets/css/style.css` `:root`). Neumorphism is layered on top via
two new token families: the **base surface tone** (what things are carved from) and the
**light-source shadow pair** (what carves them).

```css
/* Light mode base + shadow pair */
--neu-base: #eef2f0;           /* was --neutral-50/alt split; now one carve-able base */
--neu-base-rgb: 238, 242, 240;
--neu-light: #ffffff;          /* highlight edge, light source top-left */
--neu-dark-rgb: 163, 177, 170; /* shadow edge, tinted toward brand green, not neutral gray */

/* Dark mode base + shadow pair */
--neu-base: #0a2a20;           /* was --bg #041b15; lifted one step so it can be carved */
--neu-base-rgb: 10, 42, 32;
--neu-light-rgb: 255, 255, 255; /* used at low alpha only — dark mode highlight is a glow, not white */
--neu-dark-rgb: 0, 0, 0;
```

Roles:
- **Neutral surfaces** (cards, icon tiles, nav pills, stat card, accordion, testimonial, footer
  input wells): carved from `--neu-base` using the shadow pair below. No `border`, no flat
  `--surface` white/near-black block anymore.
- **Brand color blocks** (primary CTA banner, donate button, section--brand stat strip) **stay
  flat, saturated color** — crimson, teal, gold. Neumorphism only applies to neutral chrome;
  applying it to saturated brand color would muddy the hue and kill contrast. This is the one
  deliberate departure from "everything is neumorphic," and it exists for accessibility (see §8).
- **Text** colors (`--text`, `--text-muted`) are unchanged — neumorphism must never be allowed to
  soften text-to-background contrast below AA.

## 3. Typography Rules

Unchanged: Lora (headings) + Inter (body), same Google Fonts import, same size scale. Neumorphism
is a surface treatment, not a type treatment — changing type here would be scope creep.

## 4. Component Stylings

### Shadow primitives (the only new mechanism)

```css
--neu-radius: 20px; /* slightly larger than old --radius-lg to read as "molded" not "cut" */

/* Raised / convex — default resting state for cards, buttons, icon tiles, nav pills */
--neu-shadow-raised:
  8px 8px 16px rgba(var(--neu-dark-rgb), 0.35),
  -8px -8px 16px rgba(var(--neu-light-rgb), 0.7);

/* Raised, larger — hover state, lifts further off the page */
--neu-shadow-raised-hover:
  12px 12px 24px rgba(var(--neu-dark-rgb), 0.4),
  -12px -12px 24px rgba(var(--neu-light-rgb), 0.75);

/* Pressed / concave — active button press, and resting state for input wells (recessed = "type here") */
--neu-shadow-pressed:
  inset 5px 5px 10px rgba(var(--neu-dark-rgb), 0.4),
  inset -5px -5px 10px rgba(var(--neu-light-rgb), 0.6);

/* Subtle — small chips/tags, low-emphasis */
--neu-shadow-subtle:
  4px 4px 8px rgba(var(--neu-dark-rgb), 0.25),
  -4px -4px 8px rgba(var(--neu-light-rgb), 0.6);
```

Dark mode redefines `--neu-light-rgb` to `255,255,255` at much lower alpha (a soft glow, not a
highlight) and keeps `--neu-dark-rgb` at `0,0,0` — dark-mode neumorphism reads as glow-vs-void
rather than the light-mode paper-fold look.

### Cards (`.card`, `.testimonial`, `.hero__stat-card`, `.toc`, `.map-frame`)
- `background: var(--neu-base)`, no border.
- `box-shadow: var(--neu-shadow-raised)`.
- `border-radius: var(--neu-radius)`.
- Hover: `box-shadow: var(--neu-shadow-raised-hover)`; keep the existing `translateY(-6px)` lift —
  neumorphism plus a lift reads as "picked up off the table."
- Focus-within (cards containing links): unchanged 3px outline, unaffected by shadow system.

### Buttons (`.btn`)
- `.btn--primary`, `.btn--gold` keep **flat saturated brand color** (teal / gold) per §2, but gain
  a neumorphic-style soft drop shadow instead of the old flat `--shadow-md`: a single soft shadow
  cast onto the base surface (`0 6px 16px rgba(var(--neu-dark-rgb), 0.3)`), not the dual-tone
  carve (dual-tone only works when the object is the *same color* as what it's carved from).
- `.btn--outline` on neutral surfaces: same tone as `--neu-base`, `box-shadow: var(--neu-shadow-raised)`,
  no visible border — becomes a true neumorphic button.
- Active/press state (`:active`) on `.btn--outline`: swap to `var(--neu-shadow-pressed)` — the
  button visibly depresses into the page on click. This is the signature neumorphic interaction.

### Icon tiles (`.card__icon`)
- `background: var(--neu-base)`, `box-shadow: var(--neu-shadow-subtle)`, icon color stays
  `--brand-teal-hover` for contrast (a monochrome icon-on-monochrome-tile would vanish).

### Nav (`.site-header`, `.nav__links a`, `.theme-toggle`, `.nav-toggle`)
- Header background becomes `var(--neu-base)` (opaque, no blur-glass) with a very soft
  bottom-edge shadow replacing the hard `border-bottom`.
- Nav links: active/current page pill gets `var(--neu-shadow-pressed)` (reads as "you are here,"
  pressed in) instead of the gold underline. Gold underline is dropped for nav (kept for eyebrow).
- `.theme-toggle` / `.nav-toggle`: circular neumorphic buttons, `var(--neu-shadow-raised)` resting,
  `var(--neu-shadow-pressed)` on `:active`.

### Form fields (`.form-field input/select/textarea`)
- Recessed by default: `background: var(--neu-base)`, `box-shadow: var(--neu-shadow-pressed)`,
  no border. Reads as a "well" waiting for input — the single most natural neumorphic metaphor.
- Focus: add the existing teal focus ring on top of the pressed shadow (ring must survive — see
  §8, this is the accessibility-critical exception).

### Accordion (`.accordion-item`, FAQ)
- Each item becomes a raised neumorphic bar (`var(--neu-shadow-subtle)`, radius `--radius-md`,
  margin between items) instead of a bordered list with dividers.
- Expanded panel: slightly pressed-in background tint to distinguish open state.

### Footer, CTA banner, stat strip
- Footer stays **flat deep-green** (`--green-950` / dark-mode near-black) — a full-bleed dark
  brand block, not a neumorphic surface (same logic as §2: saturated/near-black brand color
  blocks stay flat).
- `.cta-banner` stays flat crimson. `.stat-strip` stays on the flat green `section--brand` block.
  Neumorphism is confined to page-background-toned chrome; it never touches saturated brand
  sections, by design.

## 5. Layout Principles

Unchanged grid, container width (1180px), and spacing scale. Corner radius increases slightly
site-wide (`--radius-lg` 20px → neumorphic default 20-24px on carved surfaces) since molded-clay
shapes read better with generous rounding than sharp corners.

## 6. Depth & Elevation

Neumorphism replaces the old single-direction drop-shadow elevation scale
(`--shadow-sm/md/lg`, "object floats above a white page") with a **carve-depth scale**: everything
sits at the *same* base elevation as the page, and depth is signaled by which way light falls
across it (raised vs. pressed), not by how far it floats above the page. `--shadow-sm/md/lg`
tokens are kept only for the flat brand-color elements (buttons' cast shadow, cookie banner,
back-to-top) that intentionally sit outside the neumorphic system.

## 7. Animation & Interaction — L1 (Refined Static)

Site already implements L1: IntersectionObserver scroll-reveal (`.reveal`, `.reveal-stagger`),
hover lifts, and theme-toggle rotation. This restyle does not add new JS. It changes *what*
hover/active states transition between (shadow pair swaps) but keeps the same transition
mechanism and timing (`var(--ease)`, 0.25–0.4s). `prefers-reduced-motion` handling is unchanged
(existing global rule already zeroes transition/animation duration).

## 8. Do's and Don'ts

**Do:**
1. Keep all body/label/muted text colors and contrast ratios exactly as they are — the restyle is
   surface-only.
2. Keep the 3px solid focus-visible outline on every interactive element, drawn on top of any
   neumorphic shadow, never replaced by the shadow itself. Neumorphism has a well-documented
   accessibility failure mode of hiding focus/affordance; this site serves seniors and cannot
   afford it.
3. Keep primary CTAs (`.btn--primary`, `.btn--gold`, `.cta-banner`, donate button) on flat
   saturated brand color, not on carved neutral tone — a call-to-action must never be
   camouflaged into the page.
4. Tint the shadow pair toward the brand hue (`--neu-dark-rgb` leaning green, not pure gray) so
   the whole system still reads as "this site's" neumorphism, not a generic UI-kit demo.
5. Use pressed/inset shadows specifically for things that *receive* input or *are currently
   active* (form fields, current nav item, `:active` button) — reserve concave shadow for that
   semantic meaning consistently.
6. Test every carved surface at both a 4.5:1 text-contrast check and a "can a low-vision user
   tell this is a button" glance-test before shipping it.
7. Keep corner radii generous (18–24px) and shadow blur soft (12–24px) — tight radius + hard
   shadow reads as skeuomorphism, not neumorphism.
8. Preserve existing dark-mode/light-mode toggle mechanism; only the token values change.

**Don't:**
1. Don't apply neumorphism to text itself (no carved/embossed headings) — legibility over trend.
2. Don't let two adjacent neumorphic surfaces touch with no gap — the illusion depends on visible
   page material around every carved shape.
3. Don't use pure gray shadows on the green-tinted base — it reads muddy; shadows must be
   color-mixed from the base hue.
4. Don't put small (<16px) icons or text directly on a low-contrast carved surface with no
   secondary color cue — this is the #1 real-world neumorphism accessibility complaint.
5. Don't stack more than two elevation states (raised/pressed) — a three-tier fake-3D system
   reads as noisy, not calm.
6. Don't apply the carve effect to the footer, CTA banner, or any element already on saturated
   brand color — see §2/§4.
7. Don't remove the focus ring "because the shadow already shows state" — keyboard and
   screen-reader users get neither shadow nor state without it.
8. Don't introduce new dependencies, build steps, or JS animation libraries to achieve this look;
   it is a `box-shadow` and `background` change only.

## 9. Responsive Behavior

Breakpoints unchanged (900px, 760px, 620px, 560px, 500px). Neumorphic shadow blur/offset values
stay fixed across breakpoints (they're already subtle enough not to need scaling) except that
mobile nav (`.nav__links` full-screen panel) keeps its flat full-bleed background rather than
being carved, since a full-viewport neumorphic panel has no surrounding material to read against.
Touch targets remain ≥44×44px (`.theme-toggle`, `.nav-toggle`, `.back-to-top` already meet this).
