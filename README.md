# Sirawit Boonthong — Portfolio

Static personal site (HTML + CSS + vanilla JS, EN/TH) — https://sirawitpai.github.io/

## Run locally

```bash
npm install
npm start            # http://localhost:8080
```

## Tests

| Command | What it does |
| --- | --- |
| `npm test` | **Jest** + jsdom: utils, translations (EN/TH), page behaviour, content checks |
| `npm run test:coverage` | Jest with a coverage report |
| `npm run test:api` | Starts the local server and runs the **Postman** collection with Newman |
| `npm run test:api:prod` | Runs the same collection against the live site |
| `npm run test:all` | Jest, then the API tests |

The Postman collection lives in `postman/` — import `portfolio.postman_collection.json` plus
`local` / `production` environments into Postman to run it from the app.

## Structure

```
index.html
assets/js/utils.js        # experience length (Nov 2021 – Sep 2026), {{token}} filling, translate()
assets/js/i18n-data.js    # every EN/TH string, keyed by data-i18n
assets/js/portfolio.js    # interactions
tests/                    # Jest tests
postman/                  # Postman collection + environments
scripts/                  # tiny static server + Newman runner
```

Experience length is calculated at page load from `CAREER_START` to `CAREER_END` in `utils.js`
(Nov 2021 – Sep 2026), so text like "4 years 11 months" stays correct without manual edits.

## CV downloads

`assets/pdf/CV-SIRAWIT-EN.pdf` and `assets/pdf/CV-SIRAWIT-TH.pdf`. The nav **CV** button follows
the page language; the hero and contact sections link to both.
