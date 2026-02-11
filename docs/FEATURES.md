# UniSearch — Pełna Lista Funkcjonalności

> Ostatnia aktualizacja: 2026-02-03
> Package: `com.webybox.unisearch`

---

## Spis treści

1. [Wyszukiwanie](#1-wyszukiwanie)
2. [Źródła danych i sekcje wyników](#2-źródła-danych-i-sekcje-wyników)
3. [Akcje i Deep Links](#3-akcje-i-deep-links)
4. [UI — Layout i zachowanie](#4-ui--layout-i-zachowanie)
5. [Personalizacja kolorów](#5-personalizacja-kolorów)
6. [Style i motywy](#6-style-i-motywy)
7. [Animacje](#7-animacje)
8. [Tapeta](#8-tapeta)
9. [Sekcje niestandardowe (Custom Sections)](#9-sekcje-niestandardowe-custom-sections)
10. [Search Providers](#10-search-providers)
11. [AI Prompts](#11-ai-prompts)
12. [Widget](#12-widget)
13. [Zarządzanie widocznością](#13-zarządzanie-widocznością)
14. [Backup i Export](#14-backup-i-export)
15. [Uprawnienia i Onboarding](#15-uprawnienia-i-onboarding)
16. [Reklamy i Consent](#16-reklamy-i-consent)
17. [System Pro / Paywall](#17-system-pro--paywall)
18. [Podział Free vs Pro — REKOMENDACJA](#18-podział-free-vs-pro--rekomendacja)
19. [Lista do prompta — oznaczenie isProFeature](#19-lista-do-prompta--oznaczenie-isprofeature)
20. [Co jeszcze można dodać / zmienić](#20-co-jeszcze-można-dodać--zmienić)
21. [Lista do Paywallu (korzyści Pro)](#21-lista-do-paywallu-korzyści-pro)
22. [Lista do Onboardingu (co apka oferuje)](#22-lista-do-onboardingu-co-apka-oferuje)

---

## 1. Wyszukiwanie

### 1.1 Algorytmy

| #   | Algorytm                     | Opis                                                         | Scoring                        |
| --- | ---------------------------- | ------------------------------------------------------------ | ------------------------------ |
| 1   | **Prefix matching**          | `nameNorm.startsWith(query)`                                 | +40 pkt                        |
| 2   | **N-gram fuzzy search**      | Bigramy (waga 3-4), trigramy (6-7), tetragramy (10-11)       | inverted index                 |
| 3   | **Phonetic matching**        | Soundex-like (spółgłoski → cyfry, max 6 znaków)              | +10 exact, +4 partial          |
| 4   | **Acronym / Initials**       | Pierwsze litery słów + camelCase split (np. "wa" → WhatsApp) | +30 startsWith, +15 contains   |
| 5   | **Token-based search**       | Split po spacjach (kontakty, ustawienia)                     | +2 prefix, +1 contains         |
| 6   | **Contains matching**        | Dla query ≥4 znaków, wymaga silnego sygnału                  | dołącza do score               |
| 7   | **Składnia "App: Shortcut"** | np. "Instagram: D" → Direct Messages                         | match appLabel + shortcutLabel |

### 1.2 Frecency (Frequency + Recency)

Działa dla **WSZYSTKICH** źródeł: Apps, Actions, Contacts, Files, Settings.

**Recency:**

| Czas od użycia | Bonus |
| -------------- | ----- |
| <1h            | +50   |
| <6h            | +35   |
| <24h           | +25   |
| <72h           | +15   |
| <7 dni         | +8    |
| >7 dni         | 0     |

**Frequency:**

| Liczba użyć | Bonus |
| ----------- | ----- |
| ≥50         | +30   |
| ≥20         | +25   |
| ≥10         | +20   |
| ≥5          | +15   |
| ≥3          | +10   |
| ≥1          | +5    |

### 1.3 Dodatkowe scoringi

| Scoring                      | Opis                                                                      |
| ---------------------------- | ------------------------------------------------------------------------- |
| **Length bonus/penalty**     | ≤4 zn: +10, ≤8 zn: +5, >20 zn: -5                                         |
| **Contact scoring**          | Starred +10, timesContacted ×0.5, lastContacted bonus, kompletność danych |
| **Settings priority**        | ACTION_PRIORITY map (10-100)                                              |
| **Overlay boost**            | +2 dla overlay producenta (Samsung, Xiaomi, OnePlus, Huawei)              |
| **AppLabel bonus (Actions)** | +20 startsWith, +10 contains na nazwie aplikacji                          |

### 1.4 Filtrowanie

| Filtr                 | Opis                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Noise filter**      | Anty-śmieciowy: 1 zn → tylko prefix; 2 zn → prefix/acronym/bigram≥20; 3 zn → contains/prefix/acronym; ≥4 zn → silny sygnał lub ngram≥40 |
| **Visibility filter** | Ukryte aplikacje/kontakty/akcje                                                                                                         |
| **File exclusions**   | Wykluczone pliki (ID), foldery (only/recursive)                                                                                         |
| **File types**        | DOCUMENTS, PICTURES, VIDEOS, MUSIC, APKS, OTHER                                                                                         |

### 1.5 Specjalne funkcje

| Funkcja                       | Opis                                                                     |
| ----------------------------- | ------------------------------------------------------------------------ |
| **Kalkulator**                | RPN, operatory +−×÷, nawiasy, BigDecimal (10 miejsc), obsługa przecinka  |
| **Recent apps (puste query)** | Ostatnio używane aplikacje (gridColumnCount × 2)                         |
| **Normalizacja**              | Lowercase, usuwanie diakrytyków (ł→l, NFD), camelCase split, only a-z0-9 |
| **Inverted index**            | O(1) lookup per token, in-memory                                         |
| **Podświetlanie dopasowań**   | OptimizedHighlightedText — podświetla fragment query w wynikach          |

---

## 2. Źródła danych i sekcje wyników

### 2.1 Sekcje (SectionType enum)

| #   | Sekcja              | SectionType   | Opis                               |
| --- | ------------------- | ------------- | ---------------------------------- |
| 1   | **Aplikacje**       | `APPS`        | Grid/List aplikacji                |
| 2   | **Kontakty**        | `CONTACTS`    | Lista kontaktów z akcjami          |
| 3   | **Pliki**           | `FILES`       | Pliki i foldery z MediaStore       |
| 4   | **Ustawienia**      | `SETTINGS`    | Ustawienia systemowe               |
| 5   | **Akcje/Shortcuts** | `ACTIONS`     | App Shortcuts (manifest + curated) |
| 6   | **Kalkulator**      | `CALCULATOR`  | Wbudowany kalkulator               |
| 7   | **Search With**     | `SEARCH_WITH` | Wyszukiwanie zewnętrzne            |
| 8   | **AI Prompts**      | `AI`          | Prompty AI                         |
| 9   | **Reklamy**         | `ADS`         | Native Ads (AdMob)                 |
| 10  | **Niestandardowe**  | `CUSTOM`      | Sekcje użytkownika                 |

### 2.2 Aplikacje — szczegóły

**Indekser:** `AppIndexer`

- Źródło: PackageManager (CATEGORY_LAUNCHER)
- Tokeny: n-gramy, inicjały, phonetic key
- Cache ikon: WebP, 256px, filesDir/icons/
- Frecency: UsageDao (lastUsed, launchCount)
- Filtrowanie: puste labele, techniczne nazwy, własna aplikacja

**Dane:** packageName, label, normalizedLabel, phoneticKey, iconPath, isSystemApp, installTime, isHidden

### 2.3 Akcje/Shortcuts — szczegóły

**Indekser:** `ActionIndexer`

- Źródła: manifest shortcuts (ActivityDiscoveryHelper) + curated shortcuts (JSON)
- Tokeny: shortcutLabel + appLabel (mniejsza waga)
- Cache: SharedPreferences (TTL 7 dni)
- Typy: DYNAMIC_SHORTCUT, STATIC_INTENT, DEEP_LINK_SHORTCUT_INFO_BACKPORT, MANIFEST_SHORTCUT
- Stability: STABLE, UNSTABLE

**Dane:** id, packageName, appLabel, shortcutLabel, shortcutId, targetClass, action, extras, intentUri, activityComponent, isVisible

### 2.4 Kontakty — szczegóły

**Cache:** `ContactsCache`

- Źródło: ContactsContract
- Token index: mapowanie token → contact IDs
- Lazy loading: phone/email ładowane on-demand
- Photo cache: LRU (max 50), 96×96px
- Auto-sync: ContentObserver
- Linked apps detection: WhatsApp, Signal, Telegram, Viber, Messenger, Skype

**Dane:** id, displayName, phones, emails, photoUri, lookupKey, structured name parts, starred, timesContacted, lastContactedTime, availableActions

### 2.5 Pliki — szczegóły

**Repozytorium:** `FilesRepositoryImpl`

- Źródło: MediaStore (live queries, brak indeksu)
- Foldery: RELATIVE_PATH lub DATA
- Cache: RecentFilesCache (TTL 8s)
- Frecency: UsageDao (prefix "file:")
- Folder Access: SAF persistable URI

**Dane:** id, uri, name, mimeType, sizeBytes, lastModified, displayPath, isFolder, folderPath

**Typy plików:** DOCUMENTS, PICTURES, VIDEOS, MUSIC, APKS, OTHER

### 2.6 Ustawienia — szczegóły

**Repozytorium:** `SettingsRepositoryImpl`

- Źródła: Settings.ACTION\_\*, SettingsCatalog (fallback), overlay entries
- Cache: SettingsIndexSnapshot w DataStore (wersja 13, locale-aware)
- Overlay detection: Samsung, Xiaomi, OnePlus, Huawei, etc.
- Tokeny: label + keywords

**Dane:** id, label, keywords, intentAction, intentPackage, intentData, overlayTag

### 2.7 Reklamy — szczegóły

**Komponent:** `AdsSection`

- Typ: Native Ads (Google AdMob)
- Consent: UMP (User Messaging Platform) via `ConsentManager`
- Ad unit: test ID (`ca-app-pub-3940256099942544/2247696110`)
- Layout: XML-based NativeAdView (headline, body, icon, CTA, media)

---

## 3. Akcje i Deep Links

### 3.1 Akcje aplikacji

| Akcja           | Opis                                             |
| --------------- | ------------------------------------------------ |
| Launch app      | Uruchomienie aplikacji                           |
| App info        | Szczegóły aplikacji (system settings)            |
| Uninstall       | Dialog odinstalowania                            |
| Add to home     | Skrót na ekran główny                            |
| App shortcut    | App Shortcuts API (dynamic, static, manifest)    |
| Search with app | Wyszukiwanie w aplikacji (składnia "App: Query") |

### 3.2 Akcje kontaktów

| Akcja             | Opis                   |
| ----------------- | ---------------------- |
| VIEW              | Szczegóły kontaktu     |
| CALL              | Telefon (`tel:`)       |
| SMS               | Wiadomość SMS (`sms:`) |
| EMAIL             | Email (`mailto:`)      |
| WHATSAPP_MESSAGE  | WhatsApp wiadomość     |
| WHATSAPP_CALL     | WhatsApp połączenie    |
| WHATSAPP_VIDEO    | WhatsApp wideo         |
| SIGNAL_MESSAGE    | Signal wiadomość       |
| SIGNAL_CALL       | Signal połączenie      |
| SIGNAL_VIDEO      | Signal wideo           |
| TELEGRAM_MESSAGE  | Telegram wiadomość     |
| VIBER_MESSAGE     | Viber wiadomość        |
| VIBER_CALL        | Viber połączenie       |
| MESSENGER_MESSAGE | Messenger wiadomość    |
| SKYPE_CALL        | Skype połączenie       |
| SKYPE_MESSAGE     | Skype wiadomość        |

### 3.3 Akcje plików

| Akcja         | Opis                      |
| ------------- | ------------------------- |
| Open file     | ACTION_VIEW z mimeType    |
| Share file    | ACTION_SEND               |
| Show in files | Pokaż w menedżerze plików |

### 3.4 Akcje ustawień

| Akcja        | Opis                       |
| ------------ | -------------------------- |
| Open setting | Settings.ACTION\_\* intent |

### 3.5 Search Providers — strategie launch

| Priorytet | Strategia                                             |
| --------- | ----------------------------------------------------- |
| 1         | Web URL deep link z setPackage                        |
| 2         | ACTION_SEND (share text)                              |
| 3         | ACTION_MAIN (launch app)                              |
| 4         | Browser fallback (URL w przeglądarce)                 |
| B         | app_search_mapping.json (specyficzne intenty per-app) |

---

## 4. UI — Layout i zachowanie

### 4.1 Ekrany

| Ekran                           | Opis                                                                  |
| ------------------------------- | --------------------------------------------------------------------- |
| **OptimizedSearchScreen**       | Główny ekran wyszukiwania                                             |
| **IndexingScreen**              | Pierwszy start — indeksowanie z progress bar                          |
| **ConsentOnboardingScreen**     | Consent reklam (UMP)                                                  |
| **PermissionsOnboardingScreen** | Zbiorczy ekran uprawnień                                              |
| **SettingsActivity**            | Ustawienia (4 zakładki: Look & Feel, Permissions, Result Items, Info) |
| **LookAndFeelActivity**         | Szczegółowe ustawienia wyglądu                                        |
| **SearchWithSettingsActivity**  | Ustawienia Search Providers                                           |
| **ShortcutsActivity**           | Zarządzanie widocznością apps/shortcuts                               |
| **ContactsVisibilityActivity**  | Zarządzanie widocznością kontaktów                                    |
| **PermissionsActivity**         | Zarządzanie uprawnieniami                                             |
| **IconPickerActivity**          | Picker ikon dla sekcji                                                |
| **MaterialIconPickerActivity**  | Picker Material Symbols                                               |
| **PaywallActivity**             | Ekran zakupu Pro                                                      |

### 4.2 Menu kontekstowe

| Komponent                 | Opis                                         |
| ------------------------- | -------------------------------------------- |
| AppContextMenu            | Context menu aplikacji                       |
| ContactContextMenu        | Context menu kontaktu                        |
| AppModalBottomSheet       | Bottom sheet z akcjami aplikacji             |
| ActionBottomSheet         | Bottom sheet z akcjami shortcuts             |
| ContactActionsBottomSheet | Bottom sheet z akcjami kontaktu              |
| AppActionsBottomSheet     | Bottom sheet z shortcuts w ShortcutsActivity |

### 4.3 Opcje layoutu

| Opcja                       | Wartości             | Domyślna |
| --------------------------- | -------------------- | -------- |
| Pozycja SearchBar           | TOP, BOTTOM          | TOP      |
| Layout aplikacji            | GRID, LIST           | GRID     |
| Liczba kolumn grid          | 4-6                  | 5        |
| Rozmiar ikon                | SMALL, MEDIUM, LARGE | MEDIUM   |
| Odstęp poziomy grid         | SMALL, MEDIUM, LARGE | MEDIUM   |
| Odstęp pionowy grid         | SMALL, MEDIUM, LARGE | MEDIUM   |
| Etykiety ikon               | true/false           | true     |
| Ikony nagłówków sekcji      | true/false           | true     |
| Tryb kompaktowy kontaktów   | true/false           | false    |
| Rozmiar ikon akcji kontaktu | SMALL, MEDIUM, LARGE | MEDIUM   |
| Lewa ikona SearchBar        | Material Symbol      | domyślna |
| Ukryj placeholder SearchBar | true/false           | false    |
| Lewa ikona Widgetu          | Material Symbol      | domyślna |
| Ukryj placeholder Widgetu   | true/false           | false    |

### 4.4 Limity wyników

| Opcja                    | Zakres | Domyślna |
| ------------------------ | ------ | -------- |
| Max wyników na sekcję    | 3-20   | 5        |
| Max ostatnich elementów  | 3-20   | 3        |
| Max zwiniętych elementów | 2-10   | 3        |

### 4.5 Widoczność sekcji na starcie

| Sekcja           | Domyślna |
| ---------------- | -------- |
| Aplikacje        | true     |
| Kontakty         | true     |
| Ustawienia       | true     |
| Pliki            | true     |
| Akcje            | true     |
| Search Providers | false    |
| AI Prompts       | false    |

### 4.6 Zachowanie

| Opcja                                | Domyślna |
| ------------------------------------ | -------- |
| Auto-focus                           | true     |
| Opóźnij auto-focus do końca animacji | false    |
| Wyczyść pole po wyborze              | true     |
| Ukryj sekcję jeśli recents puste     | true     |

### 4.7 Punkty wejścia

| Punkt wejścia              | Opis                                                |
| -------------------------- | --------------------------------------------------- |
| Widget (SearchBar)         | Pasek wyszukiwania na ekranie głównym               |
| Quick Settings Tile        | Kafelek w panelu szybkich ustawień (SearchTileService) |
| Assistant role             | Długie naciśnięcie Home / gesture assist            |
| NotificationListenerService | Utrzymuje proces przy życiu (performance boost)     |

---

## 5. Personalizacja kolorów

Wszystkie kolory konfigurowane osobno dla motywu Light i Dark.

### 5.1 Kolory SearchBar (7 opcji × 2 motywy = 14)

| Kolor         | Domyślna      |
| ------------- | ------------- |
| Tło           | 0 (z presetu) |
| Tło (focused) | 0 (z presetu) |
| Obramowanie   | 0 (z presetu) |
| Tekst         | 0 (z presetu) |
| Ikona         | 0 (z presetu) |
| Placeholder   | 0 (z presetu) |
| Kursor        | 0 (z presetu) |

### 5.2 Kolory sekcji (7 opcji × 2 motywy = 14)

| Kolor                     | Domyślna      |
| ------------------------- | ------------- |
| Tło                       | 0 (z presetu) |
| Obramowanie               | 0 (z presetu) |
| Tekst                     | 0 (z presetu) |
| Tekst nagłówka            | 0 (z presetu) |
| Podświetlenie (highlight) | 0 (z presetu) |
| Tekst podświetlenia       | 0 (z presetu) |
| Ikona nagłówka            | 0 (z presetu) |

### 5.3 Kolory ikon elementów (2 opcje × 2 motywy = 4)

| Kolor          | Domyślna      |
| -------------- | ------------- |
| Ikona plików   | 0 (z presetu) |
| Ikona ustawień | 0 (z presetu) |

### 5.4 Kolory BottomSheet (5 opcji × 2 motywy = 10)

| Kolor     | Domyślna      |
| --------- | ------------- |
| Tło       | 0 (z presetu) |
| Tekst     | 0 (z presetu) |
| Ikona     | 0 (z presetu) |
| Akcent    | 0 (z presetu) |
| Tło ikony | 0 (z presetu) |

### 5.5 Kolory widgetu (5 opcji × 2 motywy = 10)

| Kolor       | Domyślna      |
| ----------- | ------------- |
| Tło         | 0 (z presetu) |
| Obramowanie | 0 (z presetu) |
| Tekst       | 0 (z presetu) |
| Ikona       | 0 (z presetu) |
| Placeholder | 0 (z presetu) |

**Łącznie: 52 opcje kolorów**

---

## 6. Style i motywy

### 6.1 Tryb motywu

| Wartość | Opis                     |
| ------- | ------------------------ |
| SYSTEM  | Automatycznie wg systemu |
| LIGHT   | Jasny                    |
| DARK    | Ciemny                   |

### 6.2 Style presets (6)

| Preset            | ID              | Opis                                          |
| ----------------- | --------------- | --------------------------------------------- |
| **UniSearch**     | `unisearch`     | Brandowy preset z niebieskim akcentem          |
| **Glass**         | `glass`         | Glassmorphism — border 1dp, opacity 70%       |
| **High Contrast** | `high_contrast` | Wysoki kontrast — border 1dp (domyślny)       |
| **Material You**  | `material_you`  | Kolory Material Design 3, border 1dp          |
| **Custom**        | `custom`        | Bazuje na Minimal Dark, pełna personalizacja  |
| **Minimal Dark**  | `minimal_dark`  | Czysty, minimalny styl (dostępny, nie w liście) |

**Domyślny:** `high_contrast`

### 6.3 Custom Style Presets (NOWE)

| Funkcja                | Opis                                                |
| ---------------------- | --------------------------------------------------- |
| Zapis własnego presetu | Pełny snapshot: sekcje, searchbar, widget, bottomsheet |
| Ładowanie presetu      | Przywrócenie zapisanego presetu                     |
| Lista presetów         | CustomStylePresetsPreferencesStore (DataStore JSON) |
| Section overrides      | Per-sekcja override stylu (kolory, paddingi, etc.)  |

### 6.4 Section Style Overrides (NOWE)

| Funkcja                      | Opis                                         |
| ---------------------------- | -------------------------------------------- |
| Override per-sekcja          | Indywidualny styl dla każdej sekcji          |
| Reset override               | ResetSectionStyleOverrideUseCase             |
| Storage                       | SectionStyleOverridesPreferencesStore        |
| Obsługiwane parametry         | Kolory, paddingi, border, opacity, corner radius |

### 6.5 Pakiety ikon

| Opcja      | Opis                                 |
| ---------- | ------------------------------------ |
| SYSTEM     | Systemowe ikony aplikacji (domyślny) |
| Zewnętrzne | Wykryte icon packs z urządzenia      |

### 6.6 Style geometryczne

**SearchBar:**

| Opcja              | Zakres | Domyślna |
| ------------------ | ------ | -------- |
| Corner radius      | 0-40dp | 28dp     |
| Horizontal padding | 0-20dp | 8dp      |
| Border width       | 0-12dp | 0dp      |
| Opacity            | 0-100% | 100%     |

**Sekcje:**

| Opcja              | Zakres | Domyślna | isProFeature |
| ------------------ | ------ | -------- | ------------ |
| Corner radius      | 0-40dp | 24dp     | ❌           |
| Horizontal padding | 0-20dp | 8dp      | ❌           |
| Vertical padding   | 0-20dp | 6dp      | ❌           |
| Border width       | 0-12dp | 0dp      | ✅ PRO       |
| Opacity            | 0-100% | 100%     | ✅ PRO       |

**Widget:**

| Opcja              | Zakres  | Domyślna |
| ------------------ | ------- | -------- |
| Corner radius      | 0-40dp  | 28dp     |
| Horizontal padding | 0-20dp  | 8dp      |
| Height             | 48-80dp | 62dp     |
| Border width       | 0-12dp  | 0dp      |
| Opacity            | 0-100%  | 100%     |

---

## 7. Animacje

### 7.1 Opcje w ustawieniach

| Opcja                                | Typ kontrolki          | Domyślna       |
| ------------------------------------ | ---------------------- | -------------- |
| Animacje włączone                    | Switch (master toggle) | true           |
| Animacja ładowania SearchBar         | Radio (11 typów)       | NONE           |
| Animacja ładowania sekcji            | Radio (11 typów)       | NONE           |
| Animacja zmiany rozmiaru sekcji      | Radio (2 typy)         | NONE           |
| Kolejność ładowania sekcji           | Radio (3 typy)         | SIMULTANEOUSLY |
| Prędkość animacji                    | Slider (5 wartości)    | MEDIUM         |
| Opóźnij auto-focus do końca animacji | Switch                 | false          |

### 7.2 Typy animacji ładowania (SectionLoadAnimationType)

| Typ                   | Opis                                                 |
| --------------------- | ---------------------------------------------------- |
| NONE                  | Brak animacji                                        |
| FADE                  | Tylko fade-in (alpha)                                |
| FADE_DOWN             | Fade + translationY od góry                          |
| FADE_UP               | Fade + translationY od dołu                          |
| FADE_LEFT             | Fade + translationX od lewej                         |
| FADE_RIGHT            | Fade + translationX od prawej                        |
| SCALE                 | Skalowanie (0.85→1.0) + fade                         |
| SLIDE_UP_OVERSHOOT    | Przesunięcie w górę z lekkim odbiciem (cubic easing) |
| FADE_DOWN_BOUNCE      | Fade w dół z efektem bounce (sin oscillation)        |
| EXPAND_VERTICAL       | Rozszerzanie pionowe (scaleY 0.3→1.0)                |
| FLIP_IN_X             | Obrót 3D wokół osi X (90°→0°) z bounce               |

Wszystkie animacje: `graphicsLayer` (GPU-accelerated), zero recomposition, zero alokacji.

### 7.3 Animacja zmiany rozmiaru (SectionResizeAnimationType)

| Typ      | Opis                                  |
| -------- | ------------------------------------- |
| NONE     | Brak                                  |
| ANIMATED | Spring (StiffnessMediumLow, NoBouncy) |

### 7.4 Kolejność ładowania (SectionLoadOrder)

| Typ            | Opis            |
| -------------- | --------------- |
| SIMULTANEOUSLY | Jednocześnie    |
| TOP_TO_BOTTOM  | Od góry do dołu |
| BOTTOM_TO_TOP  | Od dołu do góry |

### 7.5 Prędkość (AnimationSpeed)

| Typ        | Multiplier |
| ---------- | ---------- |
| SUPER_SLOW | 4.5×       |
| SLOW       | 3.5×       |
| MEDIUM     | 2.5×       |
| FAST       | 1.7×       |
| SUPER_FAST | 1.0×       |

### 7.6 Animacje wbudowane w UI

| Animacja                  | Opis                                           |
| ------------------------- | ---------------------------------------------- |
| Screen fade-in            | screenAlphaAnimatable (tween 150ms)            |
| Section load              | graphicsLayer (translationY/X, scale, alpha)   |
| Section resize            | Animatable (spring)                            |
| Section header rotation   | animateFloatAsState (0°↔180°)                  |
| Accordion expand/collapse | AnimatedVisibility (expandVertically + fadeIn) |
| Crossfade                 | tween(200ms) dla sub-screens                   |
| Drag scale                | animateFloatAsState (1.0f↔1.02f/1.05f)         |
| TriStateSwitch            | animateColorAsState, animateDpAsState          |
| Onboarding transitions    | slideInHorizontally + fadeIn                   |

---

## 8. Tapeta

| Opcja  | Opis                                          |
| ------ | --------------------------------------------- |
| Źródło | System / Kolor niestandardowy (ColorPicker)   |
| Blur   | Switch (true/false, wymaga wallpaper ≠ kolor) |
| Kolor  | ColorPicker (0 = tapeta systemowa)            |

---

## 9. Sekcje niestandardowe (Custom Sections)

### 9.1 Model

```
CustomSection:
  - id: String
  - name: String
  - items: List<CustomSectionItem>
  - iconName: String?        (Material Symbol, np. "Star")
  - iconColorLight: Int      (0 = default)
  - iconColorDark: Int       (0 = default)

CustomSectionItem:
  - type: APP | ACTION | CONTACT | FILE | SETTING
  - id: String               (packageName / contactId / path)
```

### 9.2 Funkcjonalności

| Funkcja                     | Opis                                              |
| --------------------------- | ------------------------------------------------- |
| Tworzenie sekcji            | Nazwa + ikona Material Symbols                    |
| Dodawanie elementów         | Dowolny typ (app, action, contact, file, setting) |
| Zmiana kolejności elementów | Drag & drop                                       |
| Edycja/usuwanie sekcji      | Pełne CRUD                                        |
| Kolory ikony                | Osobno Light/Dark                                 |
| Pozycja w liście sekcji     | Drag & drop w SectionsOrder                       |

---

## 10. Search Providers

| Funkcja              | Opis                                            |
| -------------------- | ----------------------------------------------- |
| Predefiniowane       | Google, DuckDuckGo, Bing, etc. (auto-discovery) |
| Custom providers     | URL template z `{{Q}}`                          |
| Zmiana kolejności    | Drag & drop                                     |
| Włączanie/wyłączanie | Per provider                                    |
| Favicon              | Automatyczne pobieranie (attempts: 1, 5, 10)    |
| "Zawsze pokazuj"     | Switch alwaysShowSearchWith                     |

---

## 11. AI Prompts

### 11.1 Model

```
AiPrompt:
  - id: String
  - label: String            (np. "Translate to English")
  - prompt: String           (template z {{Q}})
  - targetPackage: String    (np. "com.openai.chatgpt")
  - isEnabled: Boolean
```

### 11.2 Funkcjonalności

| Funkcja           | Opis                             |
| ----------------- | -------------------------------- |
| Dodawanie         | Label + prompt + target app      |
| Edycja            | Zmiana dowolnego pola            |
| Usuwanie          | Swipe/przycisk                   |
| Zmiana kolejności | Drag & drop                      |
| Launch            | Uruchomienie z {{Q}} replacement |

---

## 12. Widget

### 12.1 SearchBarWidgetProvider

| Funkcja    | Opis                                                       |
| ---------- | ---------------------------------------------------------- |
| Typ        | AppWidgetProvider, pasek 1×4                               |
| Kliknięcie | Otwiera OptimizedMainActivity                              |
| Fallback   | Używa SearchBar preferences jeśli widget preferences puste |

### 12.2 Opcje stylu widgetu

| Opcja              | Zakres               | Domyślna      |
| ------------------ | -------------------- | ------------- |
| Kolory             | 5 opcji × Light/Dark | 0 (z presetu) |
| Corner radius      | 0-40dp               | 28dp          |
| Horizontal padding | 0-20dp               | 8dp           |
| Height             | 48-80dp              | 62dp          |
| Border width       | 0-12dp               | 0dp           |
| Opacity            | 0-100%               | 100%          |
| Lewa ikona         | Material Symbol       | domyślna      |
| Ukryj placeholder  | true/false            | false         |

---

## 13. Zarządzanie widocznością

| Typ             | Storage                | Ekran                         |
| --------------- | ---------------------- | ----------------------------- |
| Aplikacje       | AppDao.isHidden        | ShortcutsActivity             |
| Akcje/Shortcuts | AppActionDao.isVisible | ShortcutsActivity (tri-state) |
| Kontakty        | HiddenContactDao       | ContactsVisibilityActivity    |

### 13.1 Filtry plików

| Filtr                          | Opis                                                                |
| ------------------------------ | ------------------------------------------------------------------- |
| Wykluczone pliki               | Lista ID                                                            |
| Wykluczone foldery (only)      | Lista ścieżek                                                       |
| Wykluczone foldery (recursive) | Lista ścieżek z rekursją                                            |
| Typy plików                    | 7 typów (DOCUMENTS, PICTURES, VIDEOS, MUSIC, APKS, OTHER + Foldery) |
| Pliki systemowe                | Switch                                                              |
| Foldery                        | Switch                                                              |

### 13.2 Kolejność sekcji

| Funkcja        | Opis                                   |
| -------------- | -------------------------------------- |
| Drag & drop    | Zmiana kolejności sekcji               |
| Enable/disable | Włączanie/wyłączanie sekcji            |
| SectionConfig  | type + isEnabled + customId + iconName |

---

## 14. Backup i Export

### 14.1 Format JSON (wersja 2)

```json
{
  "version": 2,
  "exportedAt": timestamp,
  "preferences": { "...wszystkie preferencje..." },
  "db": {
    "hiddenApps": ["com.example.app1"],
    "hiddenAppActions": ["com.example.app1/shortcut1"],
    "hiddenContacts": [123, 456]
  }
}
```

### 14.2 Eksportowane dane

| Dane             | Opis                                 |
| ---------------- | ------------------------------------ |
| Preferencje      | Wszystko z UserPreferencesRepository |
| Ukryte aplikacje | Lista packageName                    |
| Ukryte akcje     | Lista action ID                      |
| Ukryte kontakty  | Lista contact ID                     |

### 14.3 Import

Parsowanie JSON → import preferencji → przywrócenie ukrytych elementów → refresh cache → invalidacja danych/ikon/plików.

---

## 15. Uprawnienia i Onboarding

### 15.1 Runtime permissions

| Uprawnienie                     | Cel                            |
| ------------------------------- | ------------------------------ |
| READ_CONTACTS                   | Wyszukiwanie kontaktów         |
| READ_MEDIA_IMAGES               | Zdjęcia (Android 13+)          |
| READ_MEDIA_VISUAL_USER_SELECTED | Częściowy dostęp (Android 14+) |
| READ_EXTERNAL_STORAGE           | Pliki (Android < 13)           |
| MANAGE_EXTERNAL_STORAGE         | Pełny dostęp (Android 11+)     |
| POST_NOTIFICATIONS              | Powiadomienia (Android 13+)    |

### 15.2 Special permissions

| Uprawnienie         | Cel             |
| ------------------- | --------------- |
| Notification Access | Opcjonalne      |
| Folder Access (SAF) | Persistable URI |

### 15.3 Onboarding flow

| Krok | Ekran                       | Opis                                        |
| ---- | --------------------------- | ------------------------------------------- |
| 1    | ConsentOnboardingScreen     | Consent reklam (UMP) — tylko jeśli wymagane |
| 2    | PermissionsOnboardingScreen | Zbiorczy ekran uprawnień (Contacts, Files, Wallpaper, Notifications) |
| 3    | IndexingScreen              | Indeksowanie aplikacji z progress bar       |

---

## 16. Reklamy i Consent

### 16.1 ConsentManager

| Funkcja         | Opis                                      |
| --------------- | ----------------------------------------- |
| UMP Integration | Google User Messaging Platform            |
| Consent states  | UNKNOWN, NOT_REQUIRED, REQUIRED, OBTAINED |
| Onboarding step | Pokazuje się jeśli consent wymagany       |
| canRequestAds   | Flaga sterująca ładowaniem reklam         |

### 16.2 AdsSection

| Funkcja     | Opis                                                |
| ----------- | --------------------------------------------------- |
| Typ reklamy | Native Ad (AdMob)                                   |
| Layout      | XML NativeAdView (headline, body, icon, CTA, media) |
| Wysokość    | ~240dp (6 wierszy)                                  |
| Fallback    | Tekst "No internet" jeśli brak reklamy              |

---

## 17. System Pro / Paywall

### 17.1 Obecna implementacja

| Komponent                             | Status            | Opis                                     |
| ------------------------------------- | ----------------- | ---------------------------------------- |
| ProFeatureManager                     | ✅ Gotowy         | State w mutableStateOf + DataStore       |
| ProFeatureCache                       | ✅ Gotowy         | Object singleton dla szybkiego UI access |
| PaywallActivity                       | ⚠️ Placeholder    | UI gotowe, brak Google Play Billing      |
| ProBadge                              | ✅ Gotowy         | Badge "PRO" w UI                         |
| SettingsSwitch/LinkRow/RadioButtonRow | ✅ Gotowy         | Parametr isProFeature blokuje UI         |
| Google Play Billing                   | ❌ Brak           | TODO w PaywallActivity                   |
| initialize()                          | ❌ Nie wywoływane | Brak w AppWarmupManager/Application      |

### 17.2 Opcje z isProFeature = true (obecnie 2)

| Opcja               | Plik                           |
| ------------------- | ------------------------------ |
| Border Width sekcji | SectionStyleSettingsSection.kt |
| Opacity sekcji      | SectionStyleSettingsSection.kt |

### 17.3 Paywall UI (strings)

| Klucz                       | Tekst                                                                     |
| --------------------------- | ------------------------------------------------------------------------- |
| paywall_title               | UniSearch Pro                                                             |
| paywall_headline            | Unlock Full Potential                                                     |
| paywall_description         | Get access to all premium features with a one-time purchase. No subscriptions, no ads. |
| paywall_feature_customization | Advanced customization options                                           |
| paywall_feature_themes      | Premium themes and styles                                                 |
| paywall_feature_animations  | Custom animation settings                                                 |
| paywall_feature_backup      | Settings backup and restore                                               |
| paywall_feature_support     | Support future development                                                |
| paywall_purchase_button     | Unlock Pro – One-time purchase                                            |
| paywall_restore_button      | Restore purchase                                                          |
| paywall_one_time_purchase   | One-time purchase. Unlock forever.                                        |

### 17.4 Analytics events (zdefiniowane, nieużywane)

| Event            | Parametry                                    |
| ---------------- | -------------------------------------------- |
| paywall_shown    | source: SETTINGS / ONBOARDING / FEATURE_GATE |
| purchase_success | sku                                          |
| purchase_failed  | reason                                       |
| premium_enabled  | —                                            |

---

## 18. Podział Free vs Pro — REKOMENDACJA

### 🆓 FREE — zawsze dostępne

#### Wyszukiwanie (100%)

- ✅ Wszystkie algorytmy (prefix, fuzzy, phonetic, acronym, token, contains)
- ✅ Frecency ranking dla WSZYSTKICH źródeł
- ✅ Kalkulator wbudowany
- ✅ Składnia "App: Shortcut"
- ✅ Noise filter
- ✅ Podświetlanie dopasowań
- ✅ Normalizacja (diakrytyki, camelCase)

#### Źródła danych (100%)

- ✅ Aplikacje (pełny indeks, tokeny, cache ikon)
- ✅ Akcje/Shortcuts (manifest + curated)
- ✅ Kontakty (token search, lazy loading, linked apps detection)
- ✅ Pliki (MediaStore, foldery, typy plików, wykluczenia)
- ✅ Ustawienia (overlay detection, token search)

#### Akcje i Deep Links (100%)

- ✅ Wszystkie akcje aplikacji (launch, info, uninstall, add to home)
- ✅ Wszystkie akcje kontaktów (16 typów: call, sms, email, messengers)
- ✅ Wszystkie akcje plików (open, share, show in files)
- ✅ Wszystkie akcje ustawień

#### UI podstawowe

- ✅ Pozycja SearchBar (TOP/BOTTOM)
- ✅ Layout aplikacji (GRID/LIST)
- ✅ Liczba kolumn grid (4-6)
- ✅ Rozmiar ikon (S/M/L)
- ✅ Odstępy grid (S/M/L)
- ✅ Etykiety ikon
- ✅ Ikony nagłówków sekcji
- ✅ Tryb kompaktowy kontaktów
- ✅ Rozmiar ikon akcji kontaktu (S/M/L)

#### Zachowanie

- ✅ Auto-focus + opóźnienie do animacji
- ✅ Wyczyść pole po wyborze
- ✅ Ukryj sekcję jeśli recents puste
- ✅ Widoczność sekcji na starcie (7 sekcji)
- ✅ Limity wyników (3 slidery)

#### Zarządzanie widocznością

- ✅ Ukrywanie aplikacji
- ✅ Ukrywanie kontaktów
- ✅ Ukrywanie akcji/shortcuts (tri-state)
- ✅ Wykluczanie plików/folderów
- ✅ Typy plików (7 typów)
- ✅ Reindeksacja aplikacji

#### Motyw podstawowy

- ✅ Tryb motywu (SYSTEM/LIGHT/DARK)
- ✅ 2 presety: **UniSearch** (domyślny) + **High Contrast**

#### Search Providers podstawowe

- ✅ Predefiniowane providers (Google, DuckDuckGo, etc.)
- ✅ Włączanie/wyłączanie providers
- ✅ "Zawsze pokazuj" switch

#### Widget podstawowy

- ✅ Widget paska wyszukiwania (domyślne kolory/styl)

#### Animacje podstawowe

- ✅ Włączenie/wyłączenie animacji (master toggle)
- ✅ Animacje wbudowane (fade-in, section resize, header rotation)

#### Punkty wejścia

- ✅ Quick Settings Tile
- ✅ Assistant role
- ✅ NotificationListenerService

---

### 💎 PRO — za paywallem

#### 🎨 Personalizacja kolorów (52 opcje)

| Kategoria                          | Opcje              |
| ---------------------------------- | ------------------ |
| Kolory SearchBar (Light/Dark)      | 7 kolorów × 2 = 14 |
| Kolory sekcji (Light/Dark)         | 7 kolorów × 2 = 14 |
| Kolory ikon elementów (Light/Dark) | 2 kolory × 2 = 4   |
| Kolory BottomSheet (Light/Dark)    | 5 kolorów × 2 = 10 |
| Kolory widgetu (Light/Dark)        | 5 kolorów × 2 = 10 |

#### 🖼️ Style i motywy

| Funkcja                                | Opis                                          |
| -------------------------------------- | --------------------------------------------- |
| Style presets: Glass                   | Glassmorphism z blur                          |
| Style presets: Material You            | Material Design 3                             |
| Style presets: Custom                  | Pełna personalizacja bazowa                   |
| Custom Style Presets (zapis/load)      | Tworzenie i zapisywanie własnych presetów     |
| Section Style Overrides (per-sekcja)   | Indywidualny styl per sekcja                  |
| Pakiety ikon (zewnętrzne)              | Icon packs z urządzenia                       |

#### 📐 Style geometryczne zaawansowane

| Funkcja                         | Opis                    |
| ------------------------------- | ----------------------- |
| SearchBar corner radius         | 0-40dp                  |
| SearchBar horizontal padding    | 0-20dp                  |
| SearchBar border width          | 0-12dp                  |
| SearchBar opacity               | 0-100%                  |
| SearchBar lewa ikona            | Material Symbol picker  |
| SearchBar ukryj placeholder     | Switch                  |
| **Sekcje border width** (✅ PRO)| 0-12dp                  |
| **Sekcje opacity** (✅ PRO)     | 0-100%                  |
| Sekcje corner radius            | 0-40dp                  |
| Sekcje horizontal padding       | 0-20dp                  |
| Sekcje vertical padding         | 0-20dp                  |

#### 🎬 Zaawansowane animacje

| Funkcja                         | Opis                                 |
| ------------------------------- | ------------------------------------ |
| Animacja ładowania SearchBar    | 11 typów (FADE, SCALE, FLIP, etc.)  |
| Animacja ładowania sekcji       | 11 typów                             |
| Animacja zmiany rozmiaru sekcji | ANIMATED (spring)                    |
| Kolejność ładowania             | TOP_TO_BOTTOM, BOTTOM_TO_TOP         |
| Prędkość animacji               | 5 wartości (SUPER_SLOW → SUPER_FAST) |

#### 🖼️ Tapeta

| Funkcja                     | Opis         |
| --------------------------- | ------------ |
| Niestandardowy kolor tapety | Color picker |
| Blur tapety                 | Switch       |

#### 📦 Sekcje niestandardowe (Custom Sections)

| Funkcja                     | Opis                                |
| --------------------------- | ----------------------------------- |
| Tworzenie sekcji            | Nazwa + ikona Material Symbols      |
| Dodawanie elementów         | APP, ACTION, CONTACT, FILE, SETTING |
| Zmiana kolejności elementów | Drag & drop                         |
| Kolory ikony sekcji         | Light/Dark                          |
| Edycja/usuwanie             | Pełne CRUD                          |

#### 🔀 Kolejność sekcji

| Funkcja                  | Opis                     |
| ------------------------ | ------------------------ |
| Zmiana kolejności sekcji | Drag & drop              |
| Przypięte elementy       | Zarządzanie pinned items |

#### 🔍 Search Providers zaawansowane

| Funkcja           | Opis                   |
| ----------------- | ---------------------- |
| Custom providers  | URL template z `{{Q}}` |
| Zmiana kolejności | Drag & drop            |

#### 🤖 AI Prompts

| Funkcja           | Opis                          |
| ----------------- | ----------------------------- |
| Własne prompty AI | Label + template + target app |
| Edycja/usuwanie   | Pełne CRUD                    |
| Zmiana kolejności | Drag & drop                   |

#### 📱 Widget zaawansowany

| Funkcja           | Opis                  |
| ----------------- | --------------------- |
| Kolory widgetu    | 5 opcji × Light/Dark  |
| Corner radius     | 0-40dp                |
| Horizontal padding| 0-20dp                |
| Height            | 48-80dp               |
| Border width      | 0-12dp                |
| Opacity           | 0-100%                |
| Lewa ikona        | Material Symbol picker|
| Ukryj placeholder | Switch                |

#### 💾 Backup i Export

| Funkcja          | Opis                                       |
| ---------------- | ------------------------------------------ |
| Eksport ustawień | JSON z preferencjami + ukrytymi elementami |
| Import ustawień  | Przywrócenie pełnej konfiguracji           |

#### 🚫 Brak reklam

| Funkcja              | Opis            |
| -------------------- | --------------- |
| Usunięcie AdsSection | Brak Native Ads |

---

### 📊 Podsumowanie podziału

| Kategoria                                  | Free                     | Pro                                           |
| ------------------------------------------ | ------------------------ | --------------------------------------------- |
| Wyszukiwanie (algorytmy + frecency)        | ✅ 100%                  | —                                             |
| Źródła danych (5 typów)                    | ✅ 100%                  | —                                             |
| Akcje i Deep Links (20+ typów)             | ✅ 100%                  | —                                             |
| UI podstawowe (layout, limity, zachowanie) | ✅ 100%                  | —                                             |
| Zarządzanie widocznością                   | ✅ 100%                  | —                                             |
| Kolory (52 opcje)                          | Domyślne z presetu       | ✅ Pełne                                      |
| Style presets                              | 2 (UniSearch + HighContrast) | ✅ 5 (+ Glass, Material You, Custom)       |
| Custom Style Presets                       | ❌                       | ✅ Zapis/load własnych presetów               |
| Section Style Overrides                    | ❌                       | ✅ Per-sekcja override                        |
| Pakiety ikon                               | System                   | ✅ Zewnętrzne                                 |
| Style geometryczne                         | Domyślne                 | ✅ Pełna konfiguracja SearchBar/Sekcje/Widget |
| Animacje                                   | On/Off                   | ✅ Pełna konfiguracja (11 typów + speed)      |
| Tapeta                                     | Systemowa                | ✅ Custom kolor + blur                        |
| Sekcje niestandardowe                      | ❌                       | ✅ Pełne                                      |
| Kolejność sekcji                           | ❌                       | ✅ Drag & drop                                |
| Custom search providers                    | ❌                       | ✅ URL template                               |
| AI Prompts własne                          | ❌                       | ✅ Pełne CRUD                                 |
| Widget                                     | Podstawowy               | ✅ Pełna personalizacja                       |
| Backup/Export                              | ❌                       | ✅ JSON                                       |
| Reklamy                                    | ✅ Pokazywane            | ❌ Ukryte                                     |

---

## 19. Lista do prompta — oznaczenie isProFeature

### 🔧 Obecny stan: 2 opcje z isProFeature = true

| # | Opcja | Plik | Status |
|---|-------|------|--------|
| 1 | Sekcje → Border Width | SectionStyleSettingsSection.kt:519 | ✅ Już PRO |
| 2 | Sekcje → Opacity | SectionStyleSettingsSection.kt:535 | ✅ Już PRO |

### 📋 Do dodania flagi isProFeature = true

#### A. Kolory (wszystkie SkydovesColorPicker)

| # | Plik | Opcje |
|---|------|-------|
| 1 | SearchBarStyleSettingsSection.kt | 7 kolorów (background, focused bg, border, text, icon, placeholder, cursor) |
| 2 | SectionStyleSettingsSection.kt | 7 kolorów (background, border, text, header text, highlight, highlight text, header icon) |
| 3 | SectionIconStyleSettingsSection.kt | 2 kolory (files icon, settings icon) |
| 4 | BottomSheetStyleSettingsSection.kt | 5 kolorów (background, text, icon, accent, icon background) |
| 5 | WidgetStyleSettingsSection.kt | 5 kolorów (background, border, text, icon, placeholder) |

#### B. Style presets (RadioButtonRow)

| # | Plik | Opcje do zablokowania |
|---|------|----------------------|
| 1 | LookAndFeelUI.kt (StylePreset sheet) | Glass, MaterialYou, Custom — oznacz isProFeature na RadioButtonRow |
| 2 | GeneralSettingsSection.kt (StylePreset) | j.w. |

#### C. Custom Style Presets

| # | Plik | Opcja |
|---|------|-------|
| 1 | LookAndFeelUI.kt / AppearanceUI.kt | Link "Custom Style Presets" — isProFeature = true |

#### D. Section Style Overrides

| # | Plik | Opcja |
|---|------|-------|
| 1 | LookAndFeelSectionStyleSettings.kt | Link / wejście do per-section override — isProFeature = true |

#### E. Pakiety ikon

| # | Plik | Opcja |
|---|------|-------|
| 1 | LayoutSettingsSection.kt (IconPack radio) | Wszystkie poza SYSTEM — isProFeature na RadioButtonRow |

#### F. Style geometryczne SearchBar

| # | Plik | Opcje |
|---|------|-------|
| 1 | SearchBarStyleSettingsSection.kt | Corner radius, Horizontal padding, Border width, Opacity — SettingsLinkRow isProFeature = true |
| 2 | SearchBarStyleSettingsSection.kt | Lewa ikona, Ukryj placeholder — isProFeature = true |

#### G. Style geometryczne Sekcje (częściowo zrobione)

| # | Plik | Opcje |
|---|------|-------|
| 1 | SectionStyleSettingsSection.kt | Corner radius, Horizontal padding, Vertical padding — isProFeature = true |
| 2 | SectionStyleSettingsSection.kt | Show header icons — isProFeature = true |

#### H. Animacje

| # | Plik | Opcje |
|---|------|-------|
| 1 | LookAndFeelUI.kt | Animacja ładowania SearchBar (RadioButtonRow) — isProFeature = true |
| 2 | LookAndFeelUI.kt | Animacja ładowania sekcji (RadioButtonRow) — isProFeature = true |
| 3 | LookAndFeelUI.kt | Animacja zmiany rozmiaru sekcji (RadioButtonRow) — isProFeature = true |
| 4 | LookAndFeelUI.kt | Kolejność ładowania (RadioButtonRow) — isProFeature = true |
| 5 | LookAndFeelUI.kt | Prędkość animacji (Slider) — isProFeature = true |

#### I. Tapeta

| # | Plik | Opcje |
|---|------|-------|
| 1 | WallpaperSettingsSection.kt | ColorPicker — isProFeature = true |
| 2 | AppearanceUI.kt | Blur wallpaper switch — isProFeature = true |

#### J. Sekcje niestandardowe

| # | Plik | Opcje |
|---|------|-------|
| 1 | BehaviorUI.kt | Link "Custom section items" (settings_pinned_items) — isProFeature = true |
| 2 | CustomSectionEditSheet.kt | Całe CRUD — check isPro na wejściu |

#### K. Kolejność sekcji

| # | Plik | Opcje |
|---|------|-------|
| 1 | BehaviorUI.kt | Link "Sections" (settings_sections) — isProFeature = true |

#### L. Search Providers zaawansowane

| # | Plik | Opcje |
|---|------|-------|
| 1 | SearchWithSettingsActivity.kt | "Add custom provider" — isProFeature = true |
| 2 | SearchProviderComponents.kt | Drag & drop reorder — check isPro |

#### M. AI Prompts

| # | Plik | Opcje |
|---|------|-------|
| 1 | AiPromptsSettingsSheet.kt | Tworzenie/edycja promptów — isProFeature = true |

#### N. Widget zaawansowany

| # | Plik | Opcje |
|---|------|-------|
| 1 | WidgetStyleSettingsSection.kt | Wszystkie opcje (kolory, radius, padding, height, border, opacity, ikona, placeholder) — isProFeature = true |

#### O. Backup/Export

| # | Plik | Opcje |
|---|------|-------|
| 1 | InfoUI.kt | Link "Export Settings" — isProFeature = true |
| 2 | InfoUI.kt | Link "Import Settings" — isProFeature = true |

---

## 20. Co jeszcze można dodać / zmienić

### 🟢 Warto dodać (niski wysiłek, duża wartość)

| # | Feature | Wysiłek | Wartość | Opis |
|---|---------|---------|---------|------|
| 1 | **Haptic feedback** | Niski | Wysoka | Wibracja przy tapie na wynik, drag & drop, context menu |
| 2 | **"What's new" bottom sheet** | Niski | Średnia | Po aktualizacji — changelog w apce |
| 3 | **Share app link** | Niski | Średnia | "Podziel się UniSearch" w InfoUI |
| 4 | **Rate app** | Niski | Średnia | In-app review prompt (Google Play In-App Review API) |
| 5 | **Copy to clipboard** | Niski | Średnia | Kopiuj numer/email kontaktu, wynik kalkulatora long-press |

### 🟡 Rozważ (średni wysiłek)

| # | Feature | Wysiłek | Wartość | Opis |
|---|---------|---------|---------|------|
| 6 | **Więcej animacji wejścia** | Średni | PRO value | Bounce, elastic, stagger per-item (np. 3-4 nowe typy) |
| 7 | **Smart suggestions** | Średni | Wysoka | Sugestie na podstawie czasu dnia / dnia tygodnia |
| 8 | **Search history** | Średni | Średnia | Historia wyszukiwań (opcjonalne, off by default) |
| 9 | **Shortcut pinning** | Średni | Średnia | Pin ulubionego shortcuta do custom section jednym tapem |
| 10 | **Per-section collapse memory** | Niski | Średnia | Zapamiętaj stan rozwinięcia sekcji |

### 🔴 Na przyszłość (duży wysiłek)

| # | Feature | Wysiłek | Wartość | Opis |
|---|---------|---------|---------|------|
| 11 | **Google Play Billing** | Duży | Krytyczna | Implementacja faktycznego zakupu Pro |
| 12 | **Accessibility (TalkBack)** | Średni | Ważna | Content descriptions, focus order |
| 13 | **Tablet/foldable layout** | Duży | Niszowa | Adaptive layout dla dużych ekranów |

### 🔧 Do poprawienia przed release

| # | Issue | Priorytet |
|---|-------|-----------|
| 1 | **ProFeatureManager.initialize()** nie jest wywoływane przy starcie | 🔴 Krytyczny |
| 2 | **Analytics SectionType** ma STATUS — usunąć | 🟡 Cleanup |
| 3 | **Ad unit ID** — zmienić z test na produkcyjny | 🔴 Release |
| 4 | **PaywallActivity** — podpiąć Google Play Billing | 🔴 Release |
| 5 | **Paywall strings** — zaktualizować listę features (patrz sekcja 21) | 🟡 Ważne |

---

## 21. Lista do Paywallu (korzyści Pro)

### Obecne paywall_feature_* strings — do aktualizacji:

```
paywall_feature_customization = "Advanced customization options"
paywall_feature_themes        = "Premium themes and styles"
paywall_feature_animations    = "Custom animation settings"
paywall_feature_backup        = "Settings backup and restore"
paywall_feature_support       = "Support future development"
```

### Rekomendowana lista (bardziej szczegółowa, lepsza konwersja):

| # | Feature (EN) | Feature (PL) | Ikona |
|---|--------------|--------------|-------|
| 1 | **No ads** | Brak reklam | 🚫 |
| 2 | **52 color options** | 52 opcje kolorów — SearchBar, sekcje, widget, bottom panel | 🎨 |
| 3 | **5 premium themes** | 5 motywów: Glass, Material You, Custom + własne presety | 🖼️ |
| 4 | **11 entrance animations** | 11 animacji wejścia z kontrolą prędkości | 🎬 |
| 5 | **Custom sections** | Twórz własne sekcje z pinami do ulubionych | 📦 |
| 6 | **AI Prompts** | Własne prompty AI — ChatGPT, Gemini, Claude | 🤖 |
| 7 | **Custom search providers** | Dodawaj własne wyszukiwarki (URL template) | 🔍 |
| 8 | **Widget customization** | Pełna personalizacja widgetu | 📱 |
| 9 | **Wallpaper & blur** | Niestandardowe tło + blur | 🖼️ |
| 10 | **Section reordering** | Zmień kolejność sekcji drag & drop | 🔀 |
| 11 | **Per-section styling** | Indywidualny styl per sekcja | ✨ |
| 12 | **Icon packs** | Zewnętrzne pakiety ikon | 🎭 |
| 13 | **Backup & restore** | Eksport/import pełnej konfiguracji | 💾 |
| 14 | **Support development** | Wspieraj dalszy rozwój | 💚 |

### Proponowane paywall_feature_* strings (do strings.xml):

```xml
<string name="paywall_feature_no_ads">No ads – clean, distraction-free experience</string>
<string name="paywall_feature_colors">52 color options for every component</string>
<string name="paywall_feature_themes">5 premium themes + save your own presets</string>
<string name="paywall_feature_animations">11 entrance animations with speed control</string>
<string name="paywall_feature_custom_sections">Create custom sections with pinned favorites</string>
<string name="paywall_feature_ai_prompts">Custom AI prompts – ChatGPT, Gemini, Claude</string>
<string name="paywall_feature_search_providers">Add custom search providers</string>
<string name="paywall_feature_widget">Full widget customization</string>
<string name="paywall_feature_wallpaper">Custom wallpaper color + blur effect</string>
<string name="paywall_feature_reorder">Drag &amp; drop section reordering</string>
<string name="paywall_feature_per_section">Individual styling per section</string>
<string name="paywall_feature_icon_packs">Third-party icon packs support</string>
<string name="paywall_feature_backup_restore">Backup &amp; restore all settings</string>
<string name="paywall_feature_support_dev">Support ongoing development</string>
```

---

## 22. Lista do Onboardingu (co apka oferuje)

### Propozycja ekranów onboardingu (po indexing, przed głównym UI):

| # | Tytuł (EN) | Opis (EN) | Ikona |
|---|------------|-----------|-------|
| 1 | **Search everything** | Find apps, contacts, files, settings and shortcuts — all in one place, instantly. | 🔍 |
| 2 | **Smart & fast** | Fuzzy search, frecency ranking, and instant results. The more you use it, the smarter it gets. | ⚡ |
| 3 | **Quick actions** | Call, message, or email contacts directly. Launch app shortcuts with one tap. | 🚀 |
| 4 | **Fully customizable** | Themes, colors, animations, layout — make it yours. Upgrade to Pro for the full experience. | 🎨 |
| 5 | **Privacy first** | All data stays on your device. No cloud, no tracking. | 🔒 |

### Proponowane onboarding_feature_* strings (do strings.xml):

```xml
<!-- Onboarding feature showcase (after permissions, before main UI) -->
<string name="onboarding_feature_search_title">Search everything</string>
<string name="onboarding_feature_search_desc">Find apps, contacts, files, settings and shortcuts — all in one place, instantly.</string>

<string name="onboarding_feature_smart_title">Smart &amp; fast</string>
<string name="onboarding_feature_smart_desc">Fuzzy search, smart ranking, and instant results. The more you use it, the smarter it gets.</string>

<string name="onboarding_feature_actions_title">Quick actions</string>
<string name="onboarding_feature_actions_desc">Call, message, or email contacts directly. Launch app shortcuts with one tap.</string>

<string name="onboarding_feature_custom_title">Fully customizable</string>
<string name="onboarding_feature_custom_desc">Themes, colors, animations, layout — make it yours. Upgrade to Pro for the full experience.</string>

<string name="onboarding_feature_privacy_title">Privacy first</string>
<string name="onboarding_feature_privacy_desc">All data stays on your device. No cloud, no tracking.</string>
```

### Alternatywnie — minimalna wersja (3 ekrany):

| # | Tytuł | Opis |
|---|-------|------|
| 1 | **One search for everything** | Apps, contacts, files, settings, shortcuts — all found in milliseconds. |
| 2 | **Quick actions, zero friction** | Call, message, search the web — directly from results. |
| 3 | **Make it yours** | 5 themes, 52 colors, 11 animations. Upgrade to Pro for the full experience. |

---

## Commit message proposal

```
docs: update FEATURES.md with complete pre-release feature audit

- Update to 6 style presets (add UniSearch, HighContrast)
- Add Custom Style Presets and Section Style Overrides
- Add leading icon and hide placeholder for SearchBar/Widget
- Add BottomSheet accent and icon background colors (52 total)
- Add Quick Settings Tile and NotificationListenerService
- Add complete isProFeature implementation checklist
- Add paywall benefits list (14 items with suggested strings)
- Add onboarding feature showcase (5 screens with strings)
- Add "what to add/change" recommendations
- Update Free vs Pro division
```
