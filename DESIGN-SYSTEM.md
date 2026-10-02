# Pigeon website design system

## Typography

Use Ruder Plakat (local `Pigeon Display` face) for branded display headings and PP Neue Montreal for interface copy, editorial headings, and body text. Pigeon Display always uses zero letter spacing.

| Role | Font | Size | Letter spacing | Line height |
| --- | --- | --- | --- | --- |
| Hero H1 | Pigeon Display | `clamp(88px, 13.23vw, 230px)`; mobile `clamp(65px, 17.2vw, 120px)` | 0 | 0.9 |
| Standard Pigeon display | Pigeon Display | `clamp(64px, 10vw, 150px)`; mobile `clamp(48px, 10.5vw, 74px)` | 0 | 0.9 |
| Pigeon H2 / rewards H2 | Pigeon Display | `clamp(54px, 6.4vw, 96px)`; mobile `clamp(52px, 10.5vw, 68px)` | 0 | 0.9 |
| About / Operations H1 | Pigeon Display | `clamp(68px, 10vw, 128px)`; mobile `clamp(54px, 14vw, 90px)` | 0 | 0.9 |
| Footer H2 | Pigeon Display | `clamp(80px, 10vw, 128px)`; mobile `clamp(70px, 15vw, 80px)` | 0 | 0.9 |
| Feature label | PP Neue Montreal | 16px | −0.01em | 1 |
| Feature title | PP Neue Montreal | 32px desktop, 28px tablet, 24px at 430px and below | −0.01em | 0.9 |
| Feature description | PP Neue Montreal | 15px | 0 | 1.4 |
| Feature number | PP Neue Montreal | 90px desktop, 65px tablet, 36px mobile | 0 | 1 |
| Social card H3 | PP Neue Montreal | 24px | −0.01em | 1.2 |
| Reward card H3 | PP Neue Montreal | 36px | −0.01em | 0.9 |
| Fair-market H3 | PP Neue Montreal | 19px | −0.01em | 1.25 |
| FAQ question | PP Neue Montreal | 22px medium | −0.01em | 1.25 |
| FAQ answer | PP Neue Montreal | 17px | 0 | 1.5 |
| Body/supporting copy | PP Neue Montreal | Section-specific | no tighter than −0.005em | Section-specific, usually 1.4 |
| Form copy | PP Neue Montreal | Component-specific | +0.005em | Component-specific |

Shared CSS tokens: `--tracking-title: -0.01em`, `--tracking-body: -0.005em`, `--leading-title: 1.12`, and `--leading-body: 1.4`. Tab tracking does not change across breakpoints. Apply font kerning and platform-supported font smoothing globally; do not blur or scale stationary text.

## Layout

The navbar and section containers have a 1280px maximum outer width. Horizontal gutters are 60px, 32px at 1100px and below, and 20px at 700px and below. Hero artwork remains outside the container and clipped by the hero. Product tabs retain their centered 900px composition inside the shared container.

The events section uses a 200px desktop column gap. At 1000px and below, copy moves above the animation and the secondary CTA is hidden to match the mobile reference.

## Buttons and motion

The shared waitlist button opens the same signup dialog from every section. Hero height is 80px desktop / 64px mobile; compact section height is 56px. Colored squares shuffle from yellow backward through blush, blue, and coral.

Event rows move continuously upward along two straight diagonal rails: bottom-left to middle-right, then middle-right to top-left. Linear interpolation creates a sharp midpoint direction change; there is no curved turn. Labels and badges stay upright. A stationary gradient mask fades both ends, hiding the loop reset. Twelve rows share a 30-second cycle, spaced 2.5 seconds apart. The event animation runs by default as explicitly requested. A visible pause/play control lets visitors stop the continuous motion.


## Additional landing sections

Discover, rewards, fair markets, and FAQ use Ruder Plakat display headings. All card titles, descriptions, questions and answers use PP Neue Montreal. FAQ questions are 22px; answers are 17px with 1.5 line height. Only one answer is open, starting with the first item.

The social-card section pins while its three cards reveal sequentially with scroll progress. Desktop retains revealed cards side by side; mobile uses one card at a time. Reduced-motion and short viewports present the complete cards in regular flow. Supplied reward SVG animations are preserved. The static live-pill export is supplemented with exact Figma scene assets and its 4.2-second vertical scene transition.


## Revised discovery and section motion

Discovery uses three separate lines, 0 letter spacing and 0.9 line height, with a 150px desktop cap. THE is offset -2px and NEXT +6px for optical alignment. NEXT and the corrected live SVG pin 5px below the viewport top with the social cards. Only card one is initially visible; cards two and three reveal over separate scroll intervals before the combined section releases.

The corrected social SVGs retain their internal animation. Reward SVGs play a single iteration in isolated SVG documents when entering view, and restart only after leaving and returning. The opinion artwork adds 16 units of top viewBox space. Reward titles use 0.9 line height, and reward descriptions use zero tracking. Fair-market cards and the FAQ wrapper slide up on entry. FAQ answers are 17px with zero tracking and 1.5 line height.
