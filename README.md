# UniSearch Landing Page

Production-ready landing page for the Android app **UniSearch** — a universal search / launcher-like experience.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (subtle 60fps animations, reduced-motion safe)
- lucide-react (icons)
- @tailwindcss/typography (privacy/terms)

## Key Features

- Static export compatible with GitHub Pages
- 26 locales (as requested) with JSON-based copy in `src/messages`
- Performance-first UI (minimal JS, transform/opacity animations)
- SEO metadata + OG + Twitter
- Accessible components and focus states

## Project Structure

```
app/
  [locale]/
    layout.tsx
    page.tsx
    privacy/page.tsx
    terms/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  layout/
  motion/
  privacy/
  sections/
  ui/
src/
  config/
    brand.ts
    i18n.ts
  content/
    features.ts
    freePro.ts
    faq.ts
    howItWorks.ts
    privacy.ts
  lib/
    i18n.ts
    motion.ts
  messages/
    en.json
    pl.json
    ...
public/
  assets/
    logo.png
    app-screenshot.png
  CNAME
  og-image.png
  site.webmanifest
```

## Configuration

Edit `src/config/brand.ts`:

- `PLAY_STORE_URL`
- `CONTACT_EMAIL`
- `SITE_URL`
- Asset paths if you change file names

Replace assets:

- `public/assets/logo.png`
- `public/assets/app-screenshot.png`
- `public/og-image.png`

Translations live in `src/messages/{locale}.json`. English and Polish are filled. Other locales use English placeholders.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build Static Export

```bash
npm run build
```

Static output is generated in `out/`.

## GitHub Pages Deployment

This repo includes `.github/workflows/deploy.yml` for automatic deployment.

### Project Pages (repo pages)

Set a base path for correct asset routing:

- `NEXT_PUBLIC_BASE_PATH=/<your-repo-name>` (set as a GitHub Actions repository variable)

### Custom Domain

- Set `NEXT_PUBLIC_BASE_PATH` to an empty string
- Replace `public/CNAME` with your custom domain
- Configure DNS to point to GitHub Pages

## Notes

- `/` redirects to the default locale (`/en`).
- All routes are static (no SSR or API routes).
