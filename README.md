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

- 3x3 scramble generation with Beginner CFOP and God's Number solver walkthroughs
- Separate scroll-led landing page with light/dark mode color treatment
- Full-screen timer workspace support
- Hold-to-start timer with keyboard and pointer support
- Optional inspection with +2 and DNF penalties
- Session history, best, mean, Ao5, and Ao12
- Local browser persistence
