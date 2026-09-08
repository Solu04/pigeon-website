# Pigeon website design system

## Typography

Use Ruder Plakat (local Pigeon Display face) for the hero heading. Use PP Neue Montreal for the events section heading, interface and body text. Do not introduce Bricolage from the reference frames.

| Role | Size | Letter spacing | Line height |
| --- | --- | --- | --- |
| Hero heading | Fluid, desktop cap 230px; mobile 64–120px | −1.2% desktop, −2% mobile | 0.86 desktop, 0.9 mobile |
| Section heading | 44–60px desktop; 45px mobile | −2% | 1.12 |
| Tab title | 28px desktop, 26px mobile | −2% | 1.12 |
| Tab label | 16px | −2% | 22px |
| Tab description | 15px | −1% | 1.4 at all breakpoints |
| Tab number | 20px, bold | −4% | 24px |
| Section body | 18px desktop, 17px mobile | −1% | 1.4 |
| Event label | 26–36px desktop, 24px mobile | −2% | 1.2 |

Shared CSS tokens: `--tracking-title`, `--tracking-body`, `--leading-title`, `--leading-body`. Tab tracking does not change across breakpoints. Apply font kerning and platform-supported font smoothing globally; do not blur or scale stationary text.

## Layout

The navbar and section containers have a 1280px maximum outer width. Horizontal gutters are 60px, 32px at 1100px and below, and 20px at 700px and below. Hero artwork remains outside the container and clipped by the hero. Product tabs retain their centered 900px composition inside the shared container.

The events section uses a 200px desktop column gap. At 1000px and below, copy moves above the animation and the secondary CTA is hidden to match the mobile reference.

## Buttons and motion

The shared waitlist button opens the same signup dialog from every section. Hero height is 80px desktop / 64px mobile; compact section height is 56px. Colored squares shuffle from yellow backward through blush, blue, and coral.

Event rows move continuously downward, with smooth lateral movement forming a bowed path. Labels and badges stay upright. A stationary gradient mask fades both ends, hiding the loop reset. Twelve rows share a 30-second cycle, spaced 2.5 seconds apart. The event animation runs by default as explicitly requested. A visible pause/play control lets visitors stop the continuous motion.
