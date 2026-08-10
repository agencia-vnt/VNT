# Design QA

## Comparison target

- Source visual truth:
  - `C:\Users\mater\AppData\Local\Temp\codex-clipboard-86d80873-a64c-412d-950e-37bb460d2640.png` (ES before)
  - `C:\Users\mater\AppData\Local\Temp\codex-clipboard-8d408ba9-18c7-4b63-a1fa-8f2d9654442e.png` (EN before)
- Browser-rendered implementation:
  - `C:\Users\mater\AppData\Local\Temp\vnt-hero-es-1482x710.png`
  - `C:\Users\mater\AppData\Local\Temp\vnt-hero-en-1482x710.png`
- Combined comparison evidence: `C:\Users\mater\AppData\Local\Temp\vnt-hero-language-comparison-normalized.png`
- Additional target-viewport evidence:
  - `C:\Users\mater\AppData\Local\Temp\vnt-hero-es-final-1089x732.png`
  - `C:\Users\mater\AppData\Local\Temp\vnt-hero-en-final-1089x732.png`
- State: landing hero at the top of the page, after the intro, in ES and EN.

## Normalization

- The supplied screenshots are 1852 x 888 physical pixels and were normalized to 1482 x 710 for the comparison board, matching their apparent 125% Windows display scale.
- Implementation captures use a 1482 x 710 CSS viewport at device scale factor 1.
- The annotated browser target was also checked directly at 1089 x 732 CSS pixels.

## Full-view comparison

- Before: the decorative layer inherited the content-driven hero height. The ES and EN copy therefore produced different isotipo scale and vertical placement.
- After: ES and EN have identical decorative-layer and isotipo geometry at the same viewport. The visible isotipo path ends at the viewport edge.
- The comparison board includes both source states on the top row and both implementation states on the bottom row.

## Focused region comparison

- A separate crop was not needed because the isotipo occupies most of the hero and its lower edge is clearly visible in the full-view board.
- At 1089 x 732, after switching ES to EN, the decorative layer remained `1074 x 652` at `(0, 81)` and the isotipo path remained identical, with its lower edge at `y = 733.18` (the one-pixel section boundary after the 732 px viewport).

## Required fidelity surfaces

- Fonts and typography: unchanged; Host Grotesk, weights, wrapping, and hierarchy remain controlled by the existing implementation.
- Spacing and layout rhythm: hero content spacing is unchanged. Only the minimum hero height now fills the viewport below the header.
- Colors and visual tokens: unchanged; the existing ink, violet, muted, white, and lime tokens are preserved.
- Image and asset fidelity: the existing official inline isotipo geometry is preserved; only its containing layer and position changed.
- Copy and content: unchanged in both locales.

## Comparison history

1. Initial P1: switching locale resized and repositioned the hero background because its percentage geometry depended on content height. In ES, the visible isotipo also ended above the viewport edge.
2. Fix: sized the decorative layer from the viewport minus the responsive header height, gave the hero the same minimum height, and compensated for the isotipo viewBox whitespace at the bottom edge.
3. Post-fix evidence: direct ES-to-EN navigation at 1089 x 732 preserved identical layer/path rectangles; screenshots at 1482 x 710 show the same background composition in both languages.

## Browser verification

- Page content and primary hero links rendered in both locales.
- The EN locale switch was clicked and navigated from `/es` to `/en`.
- No framework error overlay or browser page errors were present in a clean browser session.

## Findings

- No actionable P0, P1, or P2 visual differences remain for the requested background behavior.

## Follow-up polish

- None required for this scoped change.

final result: passed
