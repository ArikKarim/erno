# erno

A minimalist local speedcubing timer and scramble provider inspired by cstimer.

The app is static and deploys cleanly on GitHub Pages. Third-party runtime libraries are loaded from jsDelivr.

## Run locally

Open `index.html` in a browser, or serve the folder:

```powershell
node server.cjs
```

Then visit `http://localhost:4173` for the landing page or `http://localhost:4173/app.html` for the timer and solver.

## Features

- 3x3 scramble generation with CFOP, Layer-by-Layer, and God's Number solver walkthroughs
- Separate scroll-led landing page with light/dark mode color treatment
- Lightweight Learn page with notation, a beginner solve path, brief context, and an embedded JPerm tutorial
- Full-screen timer workspace support
- Hold-to-start timer with keyboard and pointer support
- Optional inspection with +2 and DNF penalties
- Session history, best, mean, Ao5, and Ao12
- Local browser persistence

## Style Guide

- Use the system sans stack for product UI, hero text, controls, and timers.
- Use the serif stack for editorial moments: the erno wordmark, accordion statements, and Learn-page narrative copy.
- Keep controls borderless or softly filled, with 8px radii for panels and compact rounded pills only for navigation/actions.
- Keep the palette neutral: white/black page fields, low-contrast grey panels, and blue reserved for interactive feedback in the app.
