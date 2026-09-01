# Design QA

Source visual: `/Users/qenawey/Downloads/IMG_8325.jpg`

Prototype route: `/header-concept`

Production route checked: `/`

Checks:
- The production homepage hero now adopts the approved circular reel orbit; the `/header-concept` route remains available as a reference preview.
- The prototype follows the reference composition: centered editorial headline, light studio background, angled floating media cards, a circular reel cluster, and CTA under the visual group.
- Real Scaleshift assets are used: brand logo and ten Cloudflare R2 portfolio reel videos.
- Browser verification confirmed the extra "Retention edits" and "60+ creators" cards are not rendered in the concept hero.
- Browser verification confirmed only five reel cards are visible at once, matching the reference's reduced visible count.
- Browser verification confirmed the reel cards move through a narrower masked upper semicircle, with lower-path cards hidden below the hero.
- Browser verification confirmed reel rotation now comes only from the circular orbit angle, with no extra perspective tilt animation.
- Browser verification confirmed the orbit center was lowered so reel entry and exit happen from the lower edge of the header section.
- Browser verification confirmed the orbit no longer renders a visible rectangular background; the fade is applied as a mask on the reel group.
- Browser verification against the Trend Studio / supplied screenshot direction confirmed the concept reel frames were enlarged substantially while keeping the same masked lower-entry orbit behavior.
- Browser verification confirmed the production homepage hero now uses the same ten-video orbit pattern and no longer renders the previous three `.attention-phone` reel elements.
- Browser verification confirmed no `3reels-in-header` sources remain in the homepage hero; the hero orbit uses ten `/portfolio/` R2 videos.
- Server-rendered HTML verification found 10 `.hero-orbit-reel` instances, 0 `.attention-phone` instances, and 0 `3reels-in-header` sources.
- The production homepage hero reel orbit now sits above the `Create Attention` copy block, with compact primary and work CTAs positioned naturally below the support copy.
- The production homepage no longer renders the hero retention-system pill or timeline strip, and the English hero CTA now reads "Build Retention Now".
- The production homepage no longer renders the horizontal proof ticker that included "600+ videos delivered".
- The production homepage hero stage uses `100svh` for the opening viewport, with the reel orbit separated from the copy block below it.
- The production homepage hero composition is constrained to fit inside the opening hero stage, and the reel orbit shadow is a subtle floor glow rather than a heavy blurred patch.
- The latest hero pass softens the red ambient glow, narrows the floor shadow under the reel orbit, and lowers the reel path so cards are not clipped harshly at the top.
- The homepage hero reel orbit no longer uses a clipping mask or hidden overflow on the orbit container, and its vertical radius is reduced so visible reel frames are not cropped.
- The homepage reel orbit has added top spacing from the navigation bar across desktop, tablet, and mobile breakpoints.
- The homepage hero content group is shifted downward slightly so the reel orbit and copy sit farther from the navigation bar together.
- Browser verification confirmed the concept uses ten unique `/portfolio/` videos from the `scaleshift-content` R2 bucket and all videos autoplay without errors.
- Console verification found no browser errors.
- `npm run lint` passed.
- `npm run build` passed and includes `/header-concept`.

Known visual differences:
- The concept adapts the reference to Scaleshift's red/black identity and real reel assets instead of cloning the original community site's content.
- The preview is intentionally exploratory and should only replace the current hero after visual approval.

Final result: passed
