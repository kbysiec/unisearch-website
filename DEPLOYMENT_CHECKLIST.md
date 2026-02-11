# Checklist przed deploymentem

## ✅ Obrazy i assety

- [ ] Podmieniono `public/assets/logo.png`
- [ ] Podmieniono `public/assets/app-screenshot.png`
- [ ] Podmieniono `public/og-image.png`
- [ ] Sprawdzono favicony

## ✅ Konfiguracja

- [ ] Zaktualizowano `PLAY_STORE_URL` w `src/config/brand.ts`
- [ ] Zaktualizowano `CONTACT_EMAIL` w `src/config/brand.ts`
- [ ] Zaktualizowano `SITE_URL` w `src/config/brand.ts`
- [ ] Ustawiono `NEXT_PUBLIC_BASE_PATH` dla GitHub Pages (jeśli potrzebne)
- [ ] Podmieniono `public/CNAME` dla custom domeny (jeśli potrzebne)

## ✅ Treść

- [ ] Sprawdzono copy w `src/messages/*.json`
- [ ] Sprawdzono Free vs Pro w `src/content/freePro.ts`
- [ ] Sprawdzono Privacy/Terms

## ✅ Testy

- [ ] `npm run dev`
- [ ] `npm run build`
- [ ] Sprawdzono responsywność i animacje

## ✅ Deploy

- [ ] GitHub Pages ustawione na GitHub Actions
- [ ] Push do `main`
