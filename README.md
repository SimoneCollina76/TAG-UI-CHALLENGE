# Marty Supreme — landing page concept

Unofficial UI concept for the *Marty Supreme* landing page.
**Not affiliated with A24.** Talent Garden UI Master challenge, led by Mirko Santangelo (Paper Tiger Agency – NJ, USA).

Live page: published with GitHub Pages from this repository.

## What it is
A static showcase page (HTML, CSS and vanilla JavaScript — no framework, no build step) rebuilt from the Figma design, with the interactions of the original prototype:

- fixed header menu with single-select active state and smooth scroll
- hero video, synopsis audio ("Marty's story"), trailer player (play/pause, sound, scroll to tickets at the end)
- resource cards that turn into video clips on hover
- cast list with the Timothée Chalamet bio overlay
- animated ping-pong ball, auto-fading press quotes, share overlay

## Responsive layout
Built from three Figma frames used as guidelines:

| Range | Guideline |
|---|---|
| ≥ 1024 px | Desktop — 1440 px canvas scaled to the viewport |
| 601–1023 px | Tablet — 768 px frame, fluid layout |
| ≤ 600 px | Mobile — 402 px frame, hamburger menu with centred overlay |

## Structure
```
index.html
css/fonts.css     PP Telegraf (self-hosted, 5 styles)
css/style.css     layout and responsive rules
js/main.js        interactions
assets/           images (WebP), icons (SVG), video (MP4), audio (MP3), fonts (WOFF2)
```

## Credits
Film stills, trailer and poster artwork belong to their respective owners and are used here only as part of a non-commercial design exercise.
Typeface: PP Telegraf by Pangram Pangram.
