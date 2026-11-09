# kushalranaai.github.io

Source of my portfolio: **https://kushalranaai.github.io**

React 19 + Vite + TypeScript, with [Motion](https://motion.dev) for animation and [Lenis](https://lenis.darkroom.engineering) for smooth scrolling. Built and deployed to GitHub Pages by `.github/workflows/deploy.yml`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks, then builds to dist/
npm run preview  # serve the production build
```

## Where things live

| Path | What it is |
|---|---|
| `src/data/*.ts` | **All the content.** Edit these, not the components. |
| `src/components/` | One file per section (`Hero`, `Work`, `Lab`, `Experience`, `Skills`, `About`, `Contact`) plus shared pieces (`Nav`, `Cursor`, `Preloader`, `Diagram`, `CaseModal`) |
| `src/styles/global.css` | design tokens (dark + light themes), buttons, nav, cursor, preloader |
| `src/styles/sections.css` | styles for each section, in page order, with the responsive rules at the bottom |
| `public/` | copied as-is: `assets/img/` (portrait, project screenshots, `og.png`), `Kushal_Rana_Resume.pdf`, `404.html` |

## Common edits

- **Add a personal project:** append an object to `labProjects` in `src/data/lab.ts` (newest first) and drop a screenshot in `public/assets/img/projects/`. The card, the filters and the project count update by themselves. Delete the `<NextCard />` line in `src/components/Lab.tsx` once the first one ships.
- **Add or edit a case study:** `src/data/cases.ts`. Each one has card copy (`hook`, `metrics`), the full story, and a `diagram` (a `flow` of rows and nodes, or a `trace`).
- **Update the résumé:** replace `public/Kushal_Rana_Resume.pdf` (keep the file name).
- **Change colours:** the tokens at the top of `src/styles/global.css`.

## Deploying

In the repo settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions** (it was "Deploy from a branch" for the old static site). After that, every push to `main` builds and publishes.

## Design notes

- One idea per section; detail is revealed on demand (case studies open in a panel, project cards on a rail, experience and skills as tabs) instead of showing everything at once.
- Respects `prefers-reduced-motion` (no intro, no smooth scroll, no parallax, a still network graph) and only shows the custom cursor for mouse/trackpad users.
- Keyboard accessible: skip link, tab/arrow-key navigation in experience, focus trap and Esc in the case-study panel.
