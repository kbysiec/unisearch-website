# Podsumowanie projektu — UniSearch Landing Page

## Co jest dostarczone

- Next.js App Router z eksportem statycznym (`output: "export"`)
- 26 lokalizacji z JSON copy w `src/messages`
- Sekcje: Navbar, Hero, Social proof, Features, How it works, Free vs Pro, CTA, FAQ, Footer
- Podstrony: `/[locale]`, `/[locale]/privacy`, `/[locale]/terms`
- Subtelne animacje Framer Motion (LazyMotion + reduced-motion)
- SEO: metadata, OG, Twitter
- Styl premium z gradientami, szkłem i dużą ilością whitespace

## Kluczowe pliki

- Branding: `src/config/brand.ts`
- i18n: `src/config/i18n.ts`, `src/messages/*.json`
- Dane treści: `src/content/*`
- Strony: `app/[locale]/page.tsx`, `app/[locale]/privacy/page.tsx`, `app/[locale]/terms/page.tsx`

## GitHub Pages

- Workflow: `.github/workflows/deploy.yml`
- Repo pages: ustaw `NEXT_PUBLIC_BASE_PATH=/<repo>`
- Custom domain: `NEXT_PUBLIC_BASE_PATH` puste + `public/CNAME`
