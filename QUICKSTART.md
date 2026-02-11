# Szybki start — UniSearch Landing Page

## 1. Instalacja

```bash
npm install
```

## 2. Assety

Podmień pliki w `public/assets/`:

- `logo.png`
- `app-screenshot.png`

Opcjonalnie podmień `public/og-image.png` i favicony.

## 3. Konfiguracja

Edytuj `src/config/brand.ts`:

- `PLAY_STORE_URL`
- `CONTACT_EMAIL`
- `SITE_URL`

## 4. Uruchom lokalnie

```bash
npm run dev
```

Otwórz `http://localhost:3000`.

## 5. Deploy (GitHub Pages)

- Repo pages: ustaw `NEXT_PUBLIC_BASE_PATH=/<nazwa-repo>`
- Custom domain: zostaw `NEXT_PUBLIC_BASE_PATH` puste i podmień `public/CNAME`

Workflow w `.github/workflows/deploy.yml` zdeployuje stronę po pushu do `main`.
