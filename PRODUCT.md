# Product

## Register

brand

## Platform

web

## Users

Scaleshift speaks primarily to brand and business owners who need polished short-form social content without managing the edit themselves. Secondary audiences include creators, influencers, agencies, and marketing teams looking for a reliable external editing partner. Visitors are usually evaluating taste, speed, and whether Scaleshift can make their brand look sharper on social.

## Product Purpose

This is a responsive Next.js portfolio website for Scaleshift, a company specialized in editing reels and short-form video. The site exists to show the quality of the work first, build trust through a cinematic brand experience, and then move convinced visitors toward direct contact. Success means a visitor watches or scans the portfolio, understands the editing standard, and reaches out because the work feels right for their brand.

## Positioning

Scaleshift turns brand footage into clean, cinematic reels that feel built for social.

## Conversion & proof

- Primary and secondary CTA: the hero uses "Build Retention Now", with later section CTAs still guiding visitors toward a custom plan or booking flow. The final destination is still a placeholder until the Instagram DM or booking link is supplied.
- The line a visitor remembers after 10 seconds: Scaleshift turns brand footage into clean, cinematic reels.
- Belief ladder: the visitor sees high-quality reel examples; understands that Scaleshift edits with a clean, confident, cinematic taste; trusts that the output can fit their own brand; then contacts Scaleshift through Instagram DM.
- Proof on hand: use the approved stats, testimonials, real client names, the trusted-by account slider from the supplied HTML reference, and the ten Cloudflare R2 portfolio reels now connected to the homepage hero orbit. Deeper before/after case studies should be added later when supplied.

## Brand Personality

The brand should feel clean, confident, and cinematic. The experience should carry the polish and spaciousness of a premium Framer-style site, with smooth motion and generous layout rhythm. Scaleshift should feel social-first and current, but not loud, gimmicky, or overbuilt.

## Anti-references

Avoid traditional AI-generated landing-page patterns: generic agency templates, repeated card grids, fake SaaS/dashboard sections, decorative gradients, filler icons, and safe layouts that could belong to any studio. The Clario Framer reference is useful for smooth transitions, wide spacing, and premium motion-led feel, not for copying its finance dashboard structure.

## Design Principles

Lead with the work. The portfolio and reel presentation should carry the persuasion, with copy supporting the proof rather than replacing it.

Make motion part of the brand. Transitions should feel smooth, intentional, and Framer-like, while still respecting reduced-motion preferences.

Keep the brand sharp. Use Scaleshift's red, black, off-white, and logo system as the source of truth; do not invent a new identity.

Localize the hero naturally. Arabic header copy should use common marketing language for creators and reels, not literal English phrasing.

Keep typography tight and editorial. English body/UI typography uses Inter, Arabic keeps IBM Plex Sans Arabic, and the English "Create" word uses a lighter Times-style italic treatment with tight tracking to match the requested reference.

Alternative hero concepts should be built as isolated preview routes first. The editorial-card hero remains available at `/header-concept` as a reference preview; its approved circular reel orbit has been promoted into the production homepage.

The approved homepage hero now uses the same enlarged circular reel orbit pattern from `/header-concept` in place of the previous three static hero reels. Its reel orbit sits above the hero copy, the hero stage contains the full hero composition inside the opening viewport, the retention-system pill, timeline strip, and horizontal proof ticker have been removed, and the primary/work CTAs now sit in their natural position below the copy. The reel orbit uses a subtle floor shadow instead of a heavy blurred patch. The English hero CTA is "Build Retention Now", and the hero support line is the 60+ clients / +1B views proof statement with `System™` emphasized in red.

The post-hero homepage now follows the supplied local HTML reference structure from `/Users/qenawey/Downloads/files/index.html`: trusted-by proof, ScaleShift comparison, Retention Editing System framework, account slider, numbers, testimonial and voice-note area, selected work reel carousel, results marquee, FAQ, final CTA, and footer. The How to Get Started process section and its navigation link have been removed from both languages. The trusted-by strip uses the same black cinematic surface as the hero/header, keeps the account slider as its only client-image pattern, and does not use the normal Scaleshift logo as a repeated section watermark. The trusted-by account slider now uses the Cloudflare R2 `scaleshift-content/clients-group/` CSV, Instagram links, and matching client images as its source of truth. The Retention Editing System framework is now a three-step title-only video system; each step uses an embedded reel and title, a thin connector joins numbered circles above the videos on desktop and runs vertically beside stacked steps on smaller screens; step descriptions remain removed, and the former `Growth Loop™` step has been removed.

Framework tiles stay visible. The red connector and arrow repeat a 3.6-second sequence while the section is visible, moving between stages in 1.2 seconds. The same sequence runs vertically on smaller screens; reduced-motion users see a static completed line.

Framework stages are Attention Hook™, Retention Structure™, and Watch Time Optimization™ in both languages. Attention Layering™ is removed; the three videos are centered in a three-column desktop layout with sequential numbering and two connecting lines.

Framework videos come from the R2 `Editing System/` folder: `001-Hook Attention.mp4`, `002-Retention Structure.mp4`, and `003-Watch time.mp4`, respectively. Both languages share this mapping and retain viewport playback and browser caching.

Passive videos share a viewport-managed player: sources load only on entry, playback pauses offscreen or in hidden tabs, and hidden orbit reels pause too. The main hero orbit also stops updating outside the viewport. R2 video requests stream through `/api/media`, preserving byte-range and conditional requests with a 24-hour browser cache lifetime. No full-file memory buffering or speculative video downloads are used. This application proxy consumes hosting bandwidth; direct CDN delivery with equivalent cache headers remains a future deployment optimization. Replacing an R2 object at the same path can take up to 24 hours to reach cached visitors; new filenames bypass that cache.

Create trust through restraint. The site should feel cinematic and premium without becoming generic, cluttered, or overly decorative.

Guide, then convert. The page should first help visitors judge the work, then make Instagram DM the obvious next step once they are convinced.

## Impact Section Update

The impact section places four unboxed metrics above a row of all 40 real screenshots from R2 results/ and a second row of six existing audience-retention charts: 1B+ views, 600+ videos, 96% happy clients, and 60+ creators. Each screenshot and its visually transcribed view count are paired in src/lib/result-screenshots.ts. Hover or keyboard focus pauses the row, dims and blurs the image, and shows only its view count (249K through 25.6M). Clicking screenshots opens nothing; only Selected Work videos open the reel dialog. Navigation, contact links, and inline playback controls remain functional. The views row has 40 distinct images; the retention row has six. Each uses one duplicate group for seamless looping. Retention charts preserve their landscape 758:519 proportions, stay sharp on hover, and remain non-interactive. The separate Real Results. Real Growth. section and its Instagram metric cards are removed; existing #proof navigation now lands at the impact metrics. Frames retain the 3:5 ratio and 8px corners; images use contain to avoid cropping evidence. Images lazy-load, motion pauses offscreen and for reduced motion, and duplicate view-count frames are excluded from keyboard navigation. Older and newer snapshots can show different counts for the same reel; these are not summed or used to derive the aggregate metrics. Counters start once on viewport entry. Desktop displays four metrics across; mobile uses a two-by-two grid. Aggregate claims remain user-supplied and unchanged.

## Footer Layout

The supporting invitation sentence beneath the Instagram link is removed in both languages; the contact heading, account link, and other footer elements remain.

The footer uses a black, two-column layout: linked Scaleshift logo with Retention Editing System branding and the existing Instagram contact. The Explore navigation column and descriptive tagline below the logo are removed in both languages. Mobile stacks the brand above contact details. A separated bottom row contains copyright, language switching, and an accessible back-to-top control targeting #top. Only existing destinations are used; no placeholder email or legal page links are introduced. Content is localized in English and Arabic.

## FAQ Interaction

The FAQ uses the shared FaqAccordion component with all six existing localized questions. Answers start collapsed; one answer can be open at a time, and clicking the open question closes it. Full-width button triggers expose aria-expanded and aria-controls; collapsed panels are inert and hidden from assistive technology. Height/opacity transitions respect reduced motion. Styling uses restrained divider rows, unnumbered questions and a rotating plus indicator; headings are 48px desktop and 32px mobile. Keyboard Enter/Space and RTL are supported.

## Client Feedback Update

The story player has no visible generic client-name heading, central play/pause overlay, or bottom seek slider. Playback and mute controls remain in the top toolbar; the accessible video label, story counter, navigation, and top segmented progress remain in both languages. Seeking within a video is no longer exposed.

Client feedback follows the Scrollz What Clients Say composition: centered heading, two vertically moving review columns, and a portrait story player between them on a black grid background. The former horizontal testimonial and voice-note strips are replaced. The side columns show seven original WhatsApp feedback screenshots from R2 screen-feedback/, replacing all text review cards and their added names, avatars, and stars. Screenshots retain their full 758:519 proportions as passive figures without links or zoom controls. Both columns pause on hover; duplicated animation copies are hidden from assistive technology. No Scrollz clients or testimonial claims are copied. The middle story now plays the 12 real R2 videos from `Client feedback/0001.mp4` through `00012.mp4` in numeric order, replacing the initial audio/photo prototype. Numeric files are labeled generically until client identity mapping is supplied. Playback starts muted on entering the section (except reduced motion), with top segmented progress, mute, previous/next, automatic advancement, and story selection. Only the active visible video receives a source, routed through the existing range-aware media cache. Playback pauses offscreen and when the document is hidden. On mobile the player appears first and both review columns follow; reduced-motion users get static scrollable reviews and manual video playback.

## Optional Intro Video (2026-09-09)

Implemented: a dismissible corner preview appears after 1.5 seconds on English and Arabic homepages. The preview is a locally generated six-second, silent 69 KB excerpt; the 33 MB full R2 video is requested only after an explicit click. Mobile uses a compact horizontal launcher. Reduced motion leaves a static poster, and the shared viewport owner pauses preview playback while the dialog is open or the tab is hidden. Dismissal persists in sessionStorage for the current tab session.

The existing ReelDialog owns the full 16:9 introduction player, close/Escape behavior and scroll locking. An intro-only call CTA points to the existing #contact section; no external booking destination has been supplied. This is an approved exception to the earlier works-only media-opening policy; result screenshots and client screenshots remain passive. Hero reels are unchanged. English captions for the Arabic spoken video remain planned, not implemented. Desktop/mobile interaction checks are recorded in design-qa.md; no Figma approval is claimed.

## Accessibility & Inclusion

No special accessibility requirements are known yet. The site should still use strong color contrast, semantic structure, keyboard-accessible controls, responsive layouts, alt text for imagery, captions or text alternatives for video where practical, and reduced-motion alternatives for animated sections.
