# kushalranaai.github.io

Source of my portfolio: **https://kushalranaai.github.io**

A single static page (HTML, CSS and a little JavaScript, no build step), served by GitHub Pages from `main`.

| Path | What it is |
|---|---|
| `index.html` | all content: hero, case studies, experience, open source, skills, about, contact |
| `assets/css/site.css` | styles; colours are CSS variables with dark and light themes |
| `assets/js/site.js` | theme toggle, mobile menu, section highlighting, project filters, reveal-on-scroll |
| `assets/img/` | portrait, project screenshots (WebP), favicon and the social preview image (`og.png`) |
| `Kushal_Rana_Resume.pdf` | the résumé linked from the page |

Preview locally with `python -m http.server` and open http://localhost:8000.

**Updating:** replace `Kushal_Rana_Resume.pdf` to update the résumé (the file name stays the same, so links keep
working). Project cards are plain `<article class="project">` blocks; the `data-tags` attribute controls which filter
shows them (`genai`, `ml`, `systems`, `learn`).
