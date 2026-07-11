---
name: Scaleshift
description: A clean, confident, cinematic portfolio system for a reels editing studio.
colors:
  cinematic-red: "#ED0F24"
  cut-black: "#000000"
  edit-off-white: "#F2EBEB"
  clean-white: "#FFFFFF"
  muted-ink: "#525252"
typography:
  display:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0"
  label:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "clamp(72px, 10vw, 144px)"
components:
  button-primary:
    backgroundColor: "{colors.cinematic-red}"
    textColor: "{colors.clean-white}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.cut-black}"
    textColor: "{colors.edit-off-white}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
    typography: "{typography.label}"
  media-frame:
    backgroundColor: "{colors.cut-black}"
    rounded: "{rounded.lg}"
    padding: "8px"
---

# Design System: Scaleshift

## 1. Overview

**Creative North Star: "The Cinematic Cut"**

Scaleshift's visual system should feel like a precise edit: clean surfaces, confident scale, sharp red emphasis, and motion that reveals content with the timing of a reel. The brand is not a generic agency site. It is a portfolio surface where the work, spacing, and transitions create trust before the CTA appears.

The current foundation is intentionally minimal: a Next.js site with the official logo assets, brand color tokens, and a placeholder home screen. Future sections should expand from this foundation with premium Framer-like pacing, generous spacing, and vertical video as the primary visual material.

**Key Characteristics:**

- Off-white and black carry the page structure; red is a precise edit mark, not decoration.
- Layouts should be spacious, cinematic, and portfolio-led.
- Motion should feel smooth and intentional, with reduced-motion alternatives.
- UI components stay sharp and restrained: small radii, no nested cards, no generic agency filler.

## 2. Colors

The palette is tight and official: one bright red, one true black, one branded off-white, and clean white for contrast.

### Primary

- **Cinematic Red**: The Scaleshift accent and action color. Use it for the logo mark, primary calls to action, active states, and rare emphasis moments. Its rarity is the point.

### Neutral

- **Cut Black**: The strongest structural color. Use it for text, dark sections, video frames, and high-contrast surfaces.
- **Edit Off-White**: The default brand background. Use it for calm sections and wide negative space around portfolio work.
- **Clean White**: Use for high-contrast text on red or black, and for simple light surfaces when off-white would muddy media.
- **Muted Ink**: Use sparingly for secondary text on light backgrounds. Verify contrast before use.

### Named Rules

**The Red Is The Cut Rule.** Red marks the decisive action or edit point. Do not spread it across every card, divider, or icon.

**The Identity Lock Rule.** The official colors are fixed: red, black, off-white, and white. Do not invent purple gradients, blue SaaS accents, or soft pastel variants.

## 3. Typography

**Display Font:** Geist, with Arial and Helvetica fallbacks  
**Body Font:** Geist, with Arial and Helvetica fallbacks  
**Label/Mono Font:** Geist Mono is available but should not become a lazy "technical" motif.

**Character:** The current type system is a single clean sans family with strong weight and scale contrast. It should feel edited, direct, and cinematic rather than decorative.

### Hierarchy

- **Display** (600, `clamp(3rem, 8vw, 6rem)`, `0.95`): Use for the main hero claim and rare full-width section statements. Keep letter spacing at `-0.03em` or looser.
- **Headline** (600, `clamp(2rem, 5vw, 4rem)`, `1`): Use for major section headings.
- **Title** (600, `1.5rem`, `1.2`): Use for service names, portfolio captions, and compact content groups.
- **Body** (400, `1.125rem`, `1.75`): Use for explanatory copy. Keep line length near 65-75 characters.
- **Label** (600, `0.875rem`, `0.08em`): Use for short controls and metadata only. Do not turn every section heading into an uppercase label.

### Named Rules

**The No Template Eyebrows Rule.** Avoid repeated tiny uppercase section kickers. A label can appear when it earns its place, but it must not become page scaffolding.

**The Clean Scale Rule.** Use size, weight, and spacing for hierarchy. Do not use gradient text, italic editorial affectation, or noisy font pairings.

## 4. Elevation

Scaleshift should be flat by default. Depth comes from contrast, scale, video framing, and motion rather than decorative shadows. Shadows may appear only as subtle interactive feedback or media depth, never as the default card treatment.

### Shadow Vocabulary

- **Media Lift** (`0 18px 60px rgba(0, 0, 0, 0.18)`): Use only for featured video or reel frames that need to separate from the background.
- **Action Hover** (`0 10px 24px rgba(237, 15, 36, 0.24)`): Use only on red interactive elements when the hover state needs a tactile lift.

### Named Rules

**The Flat First Rule.** Surfaces are flat at rest. If a section needs depth, use composition and media before shadow.

## 5. Components

### Buttons

- **Shape:** Full pill for CTA buttons (`999px`) with tight, confident padding.
- **Primary:** Cinematic Red background with Clean White text. Use for Instagram DM or the strongest conversion action.
- **Hover / Focus:** Slight lift or red shadow is allowed. Always include a visible focus outline.
- **Secondary / Ghost:** Black pill on light backgrounds, or transparent text button when the action is secondary to portfolio viewing.

### Chips

- **Style:** Use chips only for portfolio metadata such as platform, format, or edit type. Prefer black text on off-white with a thin black border, or red fill for active state.
- **State:** Selected chips can use Cinematic Red with white text. Avoid using chips as decoration.

### Cards / Containers

- **Corner Style:** Small to moderate radii only (`8px` to `12px`). Large 32px+ rounded cards are prohibited.
- **Background:** Use Off-White, Black, or White according to contrast needs.
- **Shadow Strategy:** Flat by default. Media frames may use Media Lift.
- **Border:** Thin borders are allowed for structure. No colored side stripes.
- **Internal Padding:** Use generous but purposeful spacing (`24px` to `40px`) for content containers.

### Inputs / Fields

- **Style:** Clean fields with black or red focus treatment, Off-White or White background, and `8px` radius.
- **Focus:** Use a visible outline or border shift; never rely on color alone.
- **Error / Disabled:** Error states should use Cinematic Red with clear text. Disabled states must remain readable.

### Navigation

- **Style:** Minimal top navigation with the official mixed logo on light backgrounds. Keep labels short and direct.
- **States:** Active and hover states can use Cinematic Red; do not add icon-heavy nav or decorative status pills.
- **Mobile:** Collapse to a simple menu. Preserve logo clarity and keep the primary contact action visible.

### Reel Frame

The signature component should be a vertical video or reel frame. It should use stable aspect ratios, strong black framing, and clean captions. Avoid fake dashboard UI; the media is the product proof.

## 6. Do's and Don'ts

### Do:

- **Do** use the official Scaleshift palette: Cinematic Red, Cut Black, Edit Off-White, and Clean White.
- **Do** let portfolio work and vertical video carry the persuasion.
- **Do** use smooth, Framer-like motion with reduced-motion fallbacks.
- **Do** keep spacing generous and section rhythm cinematic.
- **Do** make Instagram DM the clearest final contact path after portfolio viewing.

### Don't:

- **Don't** build a generic agency template.
- **Don't** use repeated card grids, fake SaaS/dashboard sections, decorative gradients, filler icons, or safe layouts that could belong to any studio.
- **Don't** copy Clario's finance dashboard structure; only borrow the smooth transitions, wide spacing, and premium Framer feel.
- **Don't** add purple gradients, blue SaaS accents, glassmorphism, nested cards, or large 32px+ rounded content cards.
- **Don't** use gradient text, colored side-stripe borders, repeated tiny uppercase section eyebrows, or numbered section markers unless the content is truly sequential.
