# Marterm Natural Insulation - 2024 Corporate Site

This repository contains the source code for the Marterm official corporate website, built with HTML, CSS, JavaScript, and specialized custom build tools to handle localized translations securely. 

## Technical Overview
The site features dynamic translation without requiring a dynamic SSR server. By using a local Node.js `build.js` pipeline, templates located in `/src/pages` are combined with string dictionaries in `/locales/{lang}.json` to generate static pre-rendered SEO-friendly outputs in their respective language directories, ex: `/en/pages/urunler.html`.

## Features
- Dynamic client-side language switching script that remembers the user's preference in `localStorage`.
- Automated Static Site Generation (SSG) for all supported languages.
- Aesthetically driven custom responsive UI explicitly meant for the industry segment.

## How to build 
Run the build script:
```bash
npm run build
```

Then serve using any static http server.

## i18n Workflow
`tr.json` is the source of truth. New copy should be added to the locale files first, then referenced from templates with `{{ ... }}` or `{{{ ... }}}`. Avoid hardcoding user-facing text directly into `src/**/*.html`.

Useful commands:
```bash
npm run i18n:report
npm run i18n:baseline
OPENAI_API_KEY=... npm run i18n:sync
npm run build
```

What each command does:
- `npm run i18n:report`: checks missing translations, stale translations, and hardcoded template text.
- `npm run i18n:baseline`: marks the current translations as the accepted baseline in `locales/.translation-meta.json`.
- `npm run i18n:sync`: fills only missing or stale keys by translating from Turkish with the OpenAI Responses API.
- `npm run build`: generates the static site for `tr`, `en`, `es`, `ru`, and `ar`.

Notes:
- Arabic pages are built with `dir="rtl"` automatically.
- If you manually edit existing translations after a content pass, run `npm run i18n:baseline` once so the new state becomes the reference point.
- If you add a new page or section, first add the Turkish keys to `locales/tr.json`, wire them in the template, run `npm run i18n:report`, then `npm run i18n:sync`, and finally `npm run build`.
