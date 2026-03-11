# UniSearch — Pełna Lista Funkcjonalności

> Ostatnia aktualizacja: 2026-03-08
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
18. [Podział Free vs Pro — stan faktyczny](#18-podział-free-vs-pro--stan-faktyczny-audyt-kodu-2026-03-08)
19. [Audyt isProFeature — stan z kodu](#19-audyt-isprofeature--stan-faktyczny-z-kodu-2026-03-08)
20. [Co jeszcze można dodać / zmienić](#20-co-jeszcze-można-dodać--zmienić)
21. [Lista do Paywallu (korzyści Pro)](#21-lista-do-paywallu-korzyści-pro)
22. [Lista do Onboardingu (co apka oferuje)](#22-lista-do-onboardingu-co-apka-oferuje)
23. [Lokalizacja](#23-lokalizacja)
24. [Haptic Feedback](#24-haptic-feedback)
25. [Receivers (zdarzenia systemowe)](#25-receivers-zdarzenia-systemowe)
26. [Luki w paywallu — co powinno być PRO a nie jest](#26-luki-w-paywallu--co-powinno-być-pro-a-nie-jest)
27. [Ocena Free vs Pro — rekomendacje zmian](#27-ocena-free-vs-pro--rekomendacje-zmian-2026-03-08)
28. [Problemy paywallu — co naprawić](#28-problemy-paywallu--co-naprawić-2026-03-08)

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

| #   | Sekcja              | SectionType      | Opis                                        |
| --- | ------------------- | ---------------- | ------------------------------------------- |
| 1   | **Aplikacje**       | `APPS`           | Grid/List aplikacji                         |
| 2   | **Kontakty**        | `CONTACTS`       | Lista kontaktów z akcjami                   |
| 3   | **Pliki**           | `FILES`          | Pliki i foldery z MediaStore                |
| 4   | **Treść plików**    | `FILE_CONTENT`   | FTS4 full-text search w treści dokumentów   |
| 5   | **Ustawienia**      | `SETTINGS`       | Ustawienia systemowe                        |
| 6   | **Akcje/Shortcuts** | `ACTIONS`        | App Shortcuts (manifest + curated)          |
| 7   | **Kalkulator**      | `CALCULATOR`     | Wbudowany kalkulator                        |
| 8   | **Search With**     | `SEARCH_WITH`    | Wyszukiwanie zewnętrzne                     |
| 9   | **AI Prompts**      | `AI`             | Prompty AI                                  |
| 10  | **Pliki chmurowe**  | `CLOUD_FILES`    | Pliki z Google Drive, Dropbox, OneDrive     |
| 11  | **Reklamy**         | `ADS`            | Native Ads (AdMob)                          |
| 12  | **Niestandardowe**  | `CUSTOM`         | Sekcje użytkownika                          |

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

### 2.7 Treść plików (File Content) — szczegóły

**Repozytorium:** `FileContentRepositoryImpl`

- Źródło: MediaStore + FTS4 (Room full-text search)
- Indeksowanie: `FileContentIndexWorker` (WorkManager, OneTimeWork)
- FTS4 query: prefix matching (`word*`), multi-word
- Snippet: 120 znaków z kontekstem, diacritics-aware
- Auto-sync: MediaStore ContentObserver (debounce 5s) + foreground trigger (cooldown 2min)
- Filtrowanie: wyłączanie rozszerzeń (`FileContentExtensionsPreferencesStore`), wykluczanie plików (`ExcludedFileContentPreferencesStore`)
- State: `FileContentIndexingState` (Idle, Indexing(indexed, total), Done(total))

**Obsługiwane rozszerzenia (`FileContentExtension.PREDEFINED`):**

| Kategoria | Rozszerzenia |
|---|---|
| Tekst | `.txt`, `.md`, `.csv`, `.log` |
| Dane strukturalne | `.json`, `.xml`, `.html`, `.htm`, `.yaml`, `.yml`, `.toml`, `.ini`, `.conf`, `.cfg`, `.properties` |
| Kod źródłowy | `.kt`, `.java`, `.py`, `.js`, `.ts`, `.sh`, `.bash` |
| Dokumenty Office | `.docx`, `.xlsx`, `.pptx` |
| PDF | `.pdf` *(wymaga Android 15 / API 35 — systemowy PdfRenderer)* |

- Wszystkie predefiniowane rozszerzenia domyślnie **włączone**
- Użytkownik może **wyłączać** poszczególne rozszerzenia w ustawieniach
- Użytkownik może **dodawać własne** rozszerzenia (custom, dowolne)
- Merge z defaults: nowe rozszerzenia dodane w przyszłych wersjach pojawiają się automatycznie

**UI:** `FileContentSection`

- Ikona: Article (Material), konfigurowalny kolor (`fileContentIconColor` Light/Dark)
- Wyświetlanie: nazwa pliku + snippet (podświetlanie) + ścieżka
- IndexingIndicator: CircularProgressIndicator w headerze podczas indeksowania

**Dane:** fileId, fileName, filePath, fileUri, mimeType, snippet, lastModified, originalContent (FTS)

### 2.8 Pliki chmurowe (Cloud Files) — szczegóły

**Providers:** `CloudProvider` enum

| Provider       | Klasa auth                | isProFeature | Opis                        |
| -------------- | ------------------------- | ------------ | --------------------------- |
| Google Drive   | Google Sign-In            | ❌ FREE      | Pliki z Google Drive        |
| Dropbox        | DropboxAuthActivity       | ✅ PRO       | Pliki z Dropbox             |
| OneDrive       | OneDriveAuthActivity      | ✅ PRO       | Pliki z OneDrive            |

- Konfiguracja w PermissionsUI.kt (zakładka Permissions → Cloud Access)
- Stan połączenia: email konta
- Preferences: `cloudDriveEnabled`, `cloudDropboxEnabled`, `cloudOneDriveEnabled`
- Wyniki włączane per-provider: `cloudIncludeDriveResults`, `cloudIncludeDropboxResults`, `cloudIncludeOneDriveResults`
- Sekcja `CLOUD_FILES` w SectionConfig (domyślnie włączona)

### 2.9 Reklamy — szczegóły

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
| Pliki chmurowe   | true     |
| Treść plików     | false    |
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

### 5.3 Kolory ikon elementów (3 opcje × 2 motywy = 6)

| Kolor               | Domyślna      |
| -------------------- | ------------- |
| Ikona plików         | 0 (z presetu) |
| Ikona treści plików  | 0 (z presetu) |
| Ikona ustawień       | 0 (z presetu) |

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

**Łącznie: 54 miejsca z możliwością zmiany koloru (Pasek wyszukiwania, Sekcje, Ikony elementów, Widget, Panel dolny)**

---

## 6. Style i motywy

### 6.1 Tryb motywu

| Wartość | Opis                     |
| ------- | ------------------------ |
| SYSTEM  | Automatycznie wg systemu |
| LIGHT   | Jasny                    |
| DARK    | Ciemny                   |

### 6.2 Style presets (14 w allPresets + MinimalDark jako fallback)

| # | Preset            | ID               | isProFeature | Opis                                            |
|---|-------------------|------------------|--------------|-------------------------------------------------|
| 1 | **UniSearch**     | `unisearch`      | ❌ FREE      | Brandowy preset z niebieskim akcentem           |
| 2 | **High Contrast** | `high_contrast`  | ❌ FREE      | Wysoki kontrast — border 1dp                    |
| 3 | **Glass**         | `glass`          | ✅ PRO       | Glassmorphism — border 1dp, opacity 70%         |
| 4 | **Soft Light**    | `soft_light`     | ✅ PRO       | Jasny, delikatny styl                           |
| 5 | **Midnight Blue** | `midnight_blue`  | ✅ PRO       | Ciemny niebieski akcent                         |
| 6 | **Mono Slate**    | `mono_slate`     | ✅ PRO       | Monochromatyczny, szary                         |
| 7 | **Warm Paper**    | `warm_paper`     | ✅ PRO       | Ciepłe, papierowe kolory                        |
| 8 | **Terminal**      | `terminal`       | ✅ PRO       | Styl terminala (zielony na czarnym)             |
| 9 | **Forest**        | `forest`         | ✅ PRO       | Zieleń i naturalne tony                         |
| 10 | **Pastel System** | `pastel_system`  | ✅ PRO       | Pastelowe kolory systemowe                      |
| 11 | **Nord**          | `nord`           | ✅ PRO       | Zimny niebieski (paleta Nord)                   |
| 12 | **Sepia Focus**   | `sepia_focus`    | ✅ PRO       | Sepii i brązów                                  |
| 13 | **Material You**  | `material_you`   | ✅ PRO       | Statyczny preset z hardcoded kolorami M3, border 1dp |
| 14 | **Custom**        | `custom`         | ✅ PRO       | Bazuje na Minimal Dark, pełna personalizacja    |
| — | **Minimal Dark**  | `minimal_dark`   | — (fallback) | Czysty, minimalny styl — nie w liście, tylko fallback |

**Domyślny:** `unisearch`

**Warunek PRO:** `preset.id != "unisearch" && preset.id != "high_contrast"` (GeneralSettingsSection.kt)

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

| Opcja              | Zakres | Domyślna | isProFeature |
| ------------------ | ------ | -------- | ------------ |
| Corner radius      | 0-40dp | 28dp     | ❌ FREE      |
| Horizontal padding | 0-20dp | 8dp      | ✅ PRO       |
| Border width       | 0-12dp | 0dp      | ✅ PRO       |
| Opacity            | 0-100% | 100%     | ✅ PRO       |

**Sekcje:**

| Opcja              | Zakres | Domyślna | isProFeature |
| ------------------ | ------ | -------- | ------------ |
| Corner radius      | 0-40dp | 24dp     | ✅ PRO       |
| Horizontal padding | 0-20dp | 8dp      | ✅ PRO       |
| Vertical padding   | 0-20dp | 6dp      | ✅ PRO       |
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

| Opcja                                | Typ kontrolki          | Domyślna       | isProFeature         |
| ------------------------------------ | ---------------------- | -------------- | -------------------- |
| Animacje włączone                    | Switch (master toggle) | true           | ❌ FREE              |
| Animacja ładowania SearchBar         | Radio (11 typów)       | NONE           | ❌ FREE (brak flagi) |
| Animacja ładowania sekcji            | Radio (11 typów)       | NONE           | ⚠️ NONE/FADE/SCALE = FREE, reszta PRO |
| Animacja zmiany rozmiaru sekcji      | Radio (2 typy)         | NONE           | ❌ FREE (brak flagi) |
| Kolejność ładowania sekcji           | Radio (3 typy)         | SIMULTANEOUSLY | ✅ PRO               |
| Prędkość animacji                    | Slider (5 wartości)    | MEDIUM         | ✅ PRO               |
| Opóźnij auto-focus do końca animacji | Switch                 | false          | ❌ FREE              |

### 7.2 Typy animacji ładowania (SectionLoadAnimationType)

| Typ                   | Opis                                                 | isProFeature (Section Load) |
| --------------------- | ---------------------------------------------------- | --------------------------- |
| NONE                  | Brak animacji                                        | ❌ FREE                     |
| FADE                  | Tylko fade-in (alpha)                                | ❌ FREE                     |
| SCALE                 | Skalowanie (0.85→1.0) + fade                         | ❌ FREE                     |
| FADE_DOWN             | Fade + translationY od góry                          | ✅ PRO                      |
| FADE_UP               | Fade + translationY od dołu                          | ✅ PRO                      |
| FADE_LEFT             | Fade + translationX od lewej                         | ✅ PRO                      |
| FADE_RIGHT            | Fade + translationX od prawej                        | ✅ PRO                      |
| SLIDE_UP_OVERSHOOT    | Przesunięcie w górę z lekkim odbiciem (cubic easing) | ✅ PRO                      |
| FADE_DOWN_BOUNCE      | Fade w dół z efektem bounce (sin oscillation)        | ✅ PRO                      |
| EXPAND_VERTICAL       | Rozszerzanie pionowe (scaleY 0.3→1.0)                | ✅ PRO                      |
| FLIP_IN_X             | Obrót 3D wokół osi X (90°→0°) z bounce               | ✅ PRO                      |

**SearchBar Load Animation:** brak isProFeature → wszystkie 11 typów FREE.
**Warunek Section Load FREE:** `type == NONE || type == FADE || type == SCALE`

Wszystkie animacje: `graphicsLayer` (GPU-accelerated), zero recomposition, zero alokacji.

### 7.3 Animacja zmiany rozmiaru (SectionResizeAnimationType)

Brak flagi isProFeature — obie opcje **FREE**.

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

### 13.2 Filtry treści plików (File Content)

| Filtr                          | Opis                                                                |
| ------------------------------ | ------------------------------------------------------------------- |
| Wykluczone pliki (content)     | `ExcludedFileContentPreferencesStore` — lista fileId                |
| Rozszerzenia plików            | `FileContentExtensionsPreferencesStore` — per-extension enable/disable |
| Rozszerzenia niestandardowe    | Custom extensions dodawane przez użytkownika                        |

### 13.3 Kolejność sekcji

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
| 4    | PaywallOnboardingScreen     | Ekran Pro (BillingManager connect, skip = free) |

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

| Komponent                             | Status          | Opis                                                       |
| ------------------------------------- | --------------- | ---------------------------------------------------------- |
| ProFeatureManager                     | ✅ Gotowy       | State w mutableStateOf + DataStore                         |
| ProFeatureCache                       | ✅ Gotowy       | Object singleton dla szybkiego UI access                   |
| BillingManager                        | ✅ Gotowy       | Google Play Billing Library (INAPP, auto-reconnect, acknowledge, restore) |
| PaywallActivity                       | ✅ Gotowy       | UI + BillingManager integration                            |
| PaywallOnboardingScreen               | ✅ Gotowy       | Onboarding step z PaywallContent                           |
| ProBadge                              | ✅ Gotowy       | Badge "PRO" w UI                                           |
| SettingsSwitch/LinkRow/RadioButtonRow | ✅ Gotowy       | Parametr isProFeature blokuje UI                           |
| initialize()                          | ✅ Wywoływane   | W ZenSearchApplication + billing verify                    |

### 17.2 Opcje z isProFeature = true (obecnie ~40+)

Pełna implementacja isProFeature we wszystkich odpowiednich komponentach:

| Kategoria             | Pliki                                                                       | Liczba opcji |
| --------------------- | --------------------------------------------------------------------------- | ------------ |
| Style presets         | LookAndFeelUI.kt, GeneralSettingsSection.kt                                | 12 PRO (warunek: id != "unisearch" && id != "high_contrast") |
| SearchBar style       | SearchBarStyleSettingsSection.kt                                            | ~7           |
| Section style         | SectionStyleSettingsSection.kt                                              | ~7           |
| Section icon colors   | SectionIconStyleSettingsSection.kt                                          | ~1           |
| BottomSheet colors    | BottomSheetStyleSettingsSection.kt                                          | ~5           |
| Widget style          | WidgetStyleSettingsSection.kt                                               | ~9           |
| Animacje              | AnimationsUI.kt                                                             | ~4           |
| Tapeta                | AppearanceUI.kt                                                             | ~2           |
| Custom sections       | BehaviorUI.kt                                                               | ~1           |
| Backup/Export         | InfoUI.kt                                                                   | ~2           |

### 17.3 Paywall UI — stan faktyczny z kodu (2026-03-08)

**Zdefiniowane strings (14 feature keys w values/strings.xml):**

| Klucz                            | Tekst (EN)                                                        | Wyświetlany? |
| -------------------------------- | ----------------------------------------------------------------- | ------------ |
| paywall_feature_colors           | 52 customizable color slots (Search bar, Sections, Widget, Bottom panel) | ✅ TAK |
| paywall_feature_themes           | Premium themes: Glass, Material You, Custom presets               | ✅ TAK |
| paywall_feature_animations       | 11 animation types + speed control                                | ✅ TAK |
| paywall_feature_file_content_search | File content search (PDF, DOCX, XLSX)                          | ✅ TAK |
| paywall_feature_geometry         | Full style control (radius, padding, opacity, borders)            | ❌ NIE |
| paywall_feature_custom_sections  | Unlimited custom sections (Free: 1 section)                       | ✅ TAK |
| paywall_feature_reorder          | Reorder sections with drag & drop                                 | ❌ NIE |
| paywall_feature_icon_packs       | Unlimited custom AI prompts (Free: 1 prompt) ⚠️ BUG: tekst o AI, klucz o icon packs | ✅ TAK |
| paywall_feature_search_providers | Custom search providers                                           | ❌ NIE |
| paywall_feature_ai_prompts       | AI prompts with custom templates                                  | ❌ NIE |
| paywall_feature_wallpaper        | Custom wallpaper color + blur effect                              | ❌ NIE |
| paywall_feature_backup           | Settings backup and restore (JSON)                                | ✅ TAK |
| paywall_feature_no_ads           | Remove all ads                                                    | ✅ TAK |
| paywall_feature_support          | and many many more...                                             | ✅ TAK |

**Wyświetlane w PaywallContent.kt (PAYWALL_FEATURES — 9 pozycji):**

| # | Ikona (MaterialSymbol) | String key                          |
|---|------------------------|-------------------------------------|
| 1 | Palette                | paywall_feature_colors              |
| 2 | Style                  | paywall_feature_themes              |
| 3 | Animation              | paywall_feature_animations          |
| 4 | Article                | paywall_feature_file_content_search |
| 5 | Dashboard              | paywall_feature_custom_sections     |
| 6 | Apps                   | paywall_feature_icon_packs ⚠️ BUG  |
| 7 | Save                   | paywall_feature_backup              |
| 8 | Close                  | paywall_feature_no_ads              |
| 9 | Favorite               | paywall_feature_support             |

**Problemy paywallu — patrz sekcja 28.**

### 17.4 Analytics events (zdefiniowane, nieużywane)

| Event            | Parametry                                    |
| ---------------- | -------------------------------------------- |
| paywall_shown    | source: SETTINGS / ONBOARDING / FEATURE_GATE |
| purchase_success | sku                                          |
| purchase_failed  | reason                                       |
| premium_enabled  | —                                            |

---

## 18. Podział Free vs Pro — STAN FAKTYCZNY (audyt kodu 2026-03-08)

### 🆓 FREE — zawsze dostępne (potwierdzone w kodzie)

#### Wyszukiwanie (100%)

- ✅ Wszystkie algorytmy (prefix, fuzzy, phonetic, acronym, token, contains)
- ✅ Frecency ranking dla WSZYSTKICH źródeł
- ✅ Kalkulator wbudowany
- ✅ Składnia "App: Shortcut"
- ✅ Noise filter
- ✅ Podświetlanie dopasowań
- ✅ Normalizacja (diakrytyki, camelCase)

#### Źródła danych

- ✅ Aplikacje (pełny indeks, tokeny, cache ikon)
- ✅ Akcje/Shortcuts (manifest + curated)
- ✅ Kontakty (token search, lazy loading, linked apps detection)
- ✅ Pliki (MediaStore, foldery, typy plików, wykluczenia)
- ✅ Ustawienia (overlay detection, token search)
- ✅ Pliki chmurowe — Google Drive (FREE, brak flagi isProFeature)
- ❌ Pliki chmurowe — Dropbox, OneDrive → **PRO** (isProFeature = true w PermissionsUI)
- ❌ Treść plików (FILE_CONTENT) — **PRO** (toggle w SectionsOrder zablokowany)

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
- ✅ Tryb kompaktowy kontaktów
- ✅ Rozmiar ikon akcji kontaktu (S/M/L)

#### Zachowanie

- ✅ Auto-focus + opóźnienie do animacji
- ✅ Wyczyść pole po wyborze
- ✅ Ukryj sekcję jeśli recents puste
- ✅ Widoczność sekcji na starcie (bez FILE_CONTENT)
- ✅ Limity wyników (3 slidery)

#### Zarządzanie widocznością

- ✅ Ukrywanie aplikacji
- ✅ Ukrywanie kontaktów
- ✅ Ukrywanie akcji/shortcuts (tri-state)
- ✅ Wykluczanie plików/folderów
- ✅ Typy plików (7 typów)
- ✅ Reindeksacja aplikacji

#### Kolory (częściowo free)

- ✅ 2 kolory SearchBar za darmo: **FocusedBackground** + **Text** (× 2 motywy = 4 free slots)
- ❌ Pozostałe 50 color slots → PRO

#### Motyw podstawowy

- ✅ Tryb motywu (SYSTEM/LIGHT/DARK)
- ✅ 2 presety: **UniSearch** + **High Contrast**
- ❌ Pozostałe 12 presetów → PRO (Glass, Soft Light, Midnight Blue, Mono Slate, Warm Paper, Terminal, Forest, Pastel System, Nord, Sepia Focus, Material You, Custom)

#### Search Providers

- ✅ Predefiniowane providers (Google, DuckDuckGo, etc.)
- ✅ Włączanie/wyłączanie providers
- ✅ "Zawsze pokazuj" switch
- ✅ Drag & drop reorder providers (brak flagi isProFeature w SearchProviderComponents.kt)

#### AI Prompts

- ✅ 1 prompt za darmo (limit `freePromptsLimit = 1`)
- ❌ Dodatkowe prompty → PRO

#### Widget

- ✅ Widget paska wyszukiwania (domyślne kolory/styl)

#### Animacje

- ✅ Master toggle (włącz/wyłącz)
- ✅ Animacje wbudowane (fade-in, header rotation, accordion, crossfade)
- ✅ SearchBar Load Animation: **wszystkie 11 typów FREE** (brak isProFeature)
- ✅ Section Load Animation: **NONE**, **FADE**, **SCALE** (3/11 free)
- ✅ Section Resize Animation: **NONE** + **ANIMATED** — obie FREE (brak isProFeature)
- ❌ Section Load Animation: pozostałe 8 typów → PRO
- ❌ Load Order (TOP_TO_BOTTOM, BOTTOM_TO_TOP) → PRO
- ❌ Animation Speed → PRO

#### Sekcje

- ✅ Ekran "Sections" (BehaviorUI link — brak isProFeature)
- ✅ Enable/disable sekcji (switch toggle)
- ✅ 1 custom section za darmo (`canAddSection = isPro || customSectionsCount < 1`)
- ❌ Drag & drop reorder sekcji → PRO (`canReorder = isPro`)
- ❌ Dodatkowe custom sections → PRO

#### Per-section style overrides

- ✅ Wejście do per-section override (context menu — brak flagi isProFeature)

#### Punkty wejścia

- ✅ Quick Settings Tile
- ✅ Assistant role
- ✅ NotificationListenerService

---

### 💎 PRO — za paywallem (potwierdzone `isProFeature = true` w kodzie)

#### 🔍 Treść plików (FILE_CONTENT)

| Funkcja | Plik |
|---------|------|
| Włączenie sekcji FILE_CONTENT | SectionsOrder.kt (`isPro && SettingsCache.filesEnabled`) |

#### 🎨 Personalizacja kolorów (54 miejsca)

| Kategoria | Plik | Opcje |
|-----------|------|-------|
| Kolory SearchBar | SearchBarStyleSettingsSection.kt | 5 kolorów × Light/Dark = 10 (FocusedBackground + Text = FREE) |
| Kolory sekcji | SectionStyleSettingsSection.kt | 7 kolorów × Light/Dark = 14 |
| Kolory ikon elementów | SectionIconStyleSettingsSection.kt | 3 kolory × Light/Dark = 6 |
| Kolory BottomSheet | BottomSheetStyleSettingsSection.kt | 5 kolorów × Light/Dark = 10 |
| Kolory widgetu | WidgetStyleSettingsSection.kt | 5 kolorów × Light/Dark = 10 |

#### 🖼️ Style i motywy

| Funkcja | Plik | Szczegóły |
|---------|------|-----------|
| Style presets: Glass, Material You, Custom | LookAndFeelUI.kt, GeneralSettingsSection.kt | `isProFeature = preset.id != "unisearch" && preset.id != "high_contrast"` |
| Custom Style Presets (zapis/load) | AppearanceUI.kt | `isProFeature = true` |
| Pakiety ikon (poza SYSTEM) | LayoutSettingsSection.kt | `isProFeature = pack.packageName != IconPackDefaults.SYSTEM` |

#### 📐 Style geometryczne

| Funkcja | Plik |
|---------|------|
| SearchBar: corner radius, padding, border, opacity | SearchBarStyleSettingsSection.kt |
| SearchBar: lewa ikona, ukryj placeholder | SearchBarStyleSettingsSection.kt |
| Sekcje: corner radius, paddings, border, opacity | SectionStyleSettingsSection.kt |
| Sekcje: show header icons | SectionStyleSettingsSection.kt |
| Widget: corner radius, padding, height, border, opacity | WidgetStyleSettingsSection.kt |
| Widget: lewa ikona, ukryj placeholder | WidgetStyleSettingsSection.kt |

#### 🎬 Animacje

| Funkcja | Plik | Szczegóły |
|---------|------|-----------|
| SearchBar Load Animation (wszystkie typy) | AnimationsUI.kt | `isProFeature = true` |
| Section Load Animation (9 z 11 typów) | LookAndFeelUI.kt | FADE i NONE = free, reszta PRO |
| Section Resize Animation | AnimationsUI.kt | `isProFeature = true` |
| Load Order (TOP_TO_BOTTOM, BOTTOM_TO_TOP) | AnimationsUI.kt | `isProFeature = true` |
| Animation Speed | AnimationsUI.kt | `isProFeature = true` |

#### 🖼️ Tapeta

| Funkcja | Plik |
|---------|------|
| Background type (kolor/obraz) | AppearanceUI.kt |
| Wallpaper opacity | AppearanceUI.kt |
| Wallpaper blur | AppearanceUI.kt |

#### 📦 Custom Sections

| Funkcja | Plik | Szczegóły |
|---------|------|-----------|
| Pinned Items link | BehaviorUI.kt | `isProFeature = true` |
| Dodatkowe custom sections (>1) | SectionsOrder.kt | `canAddSection = isPro \|\| customSectionsCount < 1` |
| Drag & drop reorder sekcji | SectionsOrder.kt | `canReorder = isPro` |

#### 🔍 Search Providers

| Funkcja | Plik |
|---------|------|
| Add custom provider | SearchWithSettingsActivity.kt (`val isLocked = !isPro`) |

#### 🤖 AI Prompts

| Funkcja | Plik | Szczegóły |
|---------|------|-----------|
| AI Prompts (>1) | AiPromptsSettingsSheet.kt | `freePromptsLimit = 1`, dodatkowe zablokowane |

#### 📱 Widget zaawansowany

| Funkcja | Plik |
|---------|------|
| Wszystkie opcje widgetu | WidgetStyleSettingsSection.kt (9 opcji) |

#### 💾 Backup i Export

| Funkcja | Plik |
|---------|------|
| Export Settings | InfoUI.kt |
| Import Settings | InfoUI.kt |

#### ☁️ Pliki chmurowe (Dropbox, OneDrive)

| Funkcja | Plik |
|---------|------|
| Dropbox | PermissionsUI.kt (`isProFeature = true`) |
| OneDrive | PermissionsUI.kt (`isProFeature = true`) |

#### 🚫 Brak reklam

| Funkcja | Plik |
|---------|------|
| Ukrycie sekcji ADS | SectionsOrder.kt (`isPro → filtruje SectionType.ADS`) |

---

### 📊 Podsumowanie podziału

| Kategoria | Free | Pro |
|-----------|------|-----|
| Wyszukiwanie (algorytmy + frecency) | ✅ 100% | — |
| Źródła: Apps, Actions, Contacts, Files, Settings | ✅ 100% | — |
| Źródło: Cloud Files (Google Drive) | ✅ FREE | — |
| Źródło: Cloud Files (Dropbox, OneDrive) | ❌ | ✅ PRO |
| Źródło: File Content (FTS4) | ❌ | ✅ PRO |
| Akcje i Deep Links (20+ typów) | ✅ 100% | — |
| UI podstawowe (layout, limity, zachowanie) | ✅ 100% | — |
| Zarządzanie widocznością | ✅ 100% | — |
| Kolory (54 miejsca) | 4 free (SearchBar: FocusedBg + Text × 2) | ✅ 50 PRO + 4 free = 54 total |
| Style presets | 2 (UniSearch + High Contrast) | ✅ 12 (Glass, Soft Light, Midnight Blue, Mono Slate, Warm Paper, Terminal, Forest, Pastel System, Nord, Sepia Focus, Material You, Custom) |
| Custom Style Presets | ❌ | ✅ Zapis/load |
| Pakiety ikon | SYSTEM | ✅ Zewnętrzne |
| Style geometryczne (SearchBar/Sekcje/Widget) | Domyślne | ✅ Pełna konfiguracja |
| Section Load Animation | NONE + FADE + SCALE (3/11) | ✅ 11 typów |
| SearchBar Load Animation | ✅ 11 typów FREE (brak isProFeature) | — |
| Section Resize Animation | ✅ Obie opcje FREE (brak isProFeature) | — |
| Load Order / Speed | ❌ | ✅ PRO |
| Tapeta | Systemowa | ✅ Custom kolor + opacity + blur |
| Custom sections | 1 za darmo | ✅ Bez limitu + pinned items |
| Kolejność sekcji (drag & drop) | ❌ | ✅ |
| Custom search providers | ❌ | ✅ URL template |
| AI Prompts | 1 za darmo | ✅ Bez limitu |
| Widget | Domyślny styl | ✅ Pełna personalizacja |
| Backup/Export | ❌ | ✅ JSON |
| Reklamy | ✅ Pokazywane | ❌ Ukryte |
| Search Provider reorder | ✅ Free | — |
| Per-section style entry | ✅ Free | — |

---

## 19. Audyt isProFeature — stan faktyczny z kodu (2026-03-08)

### Potwierdzone `isProFeature = true`

| # | Kategoria | Plik | Opcje | Komentarz |
|---|-----------|------|-------|-----------|
| 1 | Kolory SearchBar | SearchBarStyleSettingsSection.kt | 5 kolorów PRO (FocusedBg + Text = free) + leading icon + hide placeholder + corner/padding/border/opacity | 8 pozycji |
| 2 | Kolory Sekcji | SectionStyleSettingsSection.kt | 7 kolorów + corner/paddings/border/opacity + show header icons | 7 pozycji |
| 3 | Kolory ikon | SectionIconStyleSettingsSection.kt | files/file_content/settings icon colors | 1 pozycja (łączona) |
| 4 | Kolory BottomSheet | BottomSheetStyleSettingsSection.kt | 5 kolorów | 5 pozycji |
| 5 | Kolory Widget | WidgetStyleSettingsSection.kt | 5 kolorów + corner/padding/height/border/opacity + leading icon + hide placeholder | 9 pozycji |
| 6 | Style presets | LookAndFeelUI.kt + GeneralSettingsSection.kt | Glass, MaterialYou, Custom (dynamiczny check) | ~4 pozycje |
| 7 | Custom Style Presets | AppearanceUI.kt | Zapis/load presetów | 1 pozycja |
| 8 | Icon packs | LayoutSettingsSection.kt | Poza SYSTEM | dynamiczny check |
| 9 | Animacje | AnimationsUI.kt | Load order, Speed | 2 pozycje (SearchBar load i Section resize NIE mają isProFeature) |
| 10 | Section Load opcje | LookAndFeelUI.kt | 8/11 typów PRO (NONE + FADE + SCALE = free) | dynamiczny check: `!= NONE && != FADE && != SCALE` |
| 11 | Tapeta | AppearanceUI.kt | Background type + opacity + blur | 3 pozycje |
| 12 | Pinned Items | BehaviorUI.kt | Link do custom sections | 1 pozycja |
| 13 | Add custom provider | SearchWithSettingsActivity.kt | `!isPro` blokuje | 1 pozycja |
| 14 | AI Prompts | AiPromptsSettingsSheet.kt | `freePromptsLimit = 1` | limit-based |
| 15 | Export/Import | InfoUI.kt | Oba linki | 2 pozycje |
| 16 | FILE_CONTENT toggle | SectionsOrder.kt | `isPro && SettingsCache.filesEnabled` | 1 pozycja |
| 17 | Section reorder | SectionsOrder.kt | `canReorder = isPro` | 1 pozycja |
| 18 | Custom sections limit | SectionsOrder.kt | `canAddSection = isPro \|\| count < 1` | limit-based |
| 19 | ADS hidden | SectionsOrder.kt | Filtruje ADS dla Pro | implicit |
| 20 | Cloud: Dropbox | PermissionsUI.kt | `isProFeature = true` | 1 pozycja |
| 21 | Cloud: OneDrive | PermissionsUI.kt | `isProFeature = true` | 1 pozycja |

### Brakujące flagi (FREE mimo że powinno być PRO)

| # | Feature | Plik | Stan | Patrz sekcja 26 |
|---|---------|------|------|-----------------|
| 1 | Per-section style override entry | Context menu | FREE | #1 |
| 2 | Search Provider drag & drop | SearchProviderComponents.kt | FREE | #2 |
| 3 | Section Load Animation link | AnimationsUI.kt | `isProFeature = false` | #3 |
| 4 | Sections link | BehaviorUI.kt | FREE (wewnątrz drag zablokowany) | #5 |
| 5 | CustomSection CRUD (edit/delete) | CustomSectionEditSheet.kt | FREE | #4 |

### Celowo FREE (brak isProFeature — nie jest to luka)

| # | Feature | Plik | Uzasadnienie |
|---|---------|------|-------------|
| 1 | SearchBar Load Animation (wszystkie 11 typów) | AnimationsUI.kt | Celowo brak flagi — wszystkie typy dostępne |
| 2 | Section Resize Animation (NONE + ANIMATED) | AnimationsUI.kt | Celowo brak flagi |
| 3 | SearchBar Corner Radius | SearchBarStyleSettingsSection.kt | Celowo brak flagi |

---

## 20. Co jeszcze można dodać / zmienić

### ✅ Zrobione od ostatniej aktualizacji

| # | Feature | Status |
|---|---------|--------|
| 1 | **Haptic feedback** | ✅ Zaimplementowany (long-press, drag & drop, context menu, section headers) |
| 2 | **Google Play Billing** | ✅ BillingManager z auto-reconnect, acknowledge, restore |
| 3 | **ProFeatureManager.initialize()** | ✅ Wywoływane w ZenSearchApplication + billing verify |
| 4 | **File Content Search (FTS4)** | ✅ Nowa sekcja FILE_CONTENT z WorkManager indexer |
| 5 | **PaywallOnboardingScreen** | ✅ Nowy krok onboardingu |
| 6 | **isProFeature flags** | ✅ ~40+ opcji (z 2 wcześniej) |
| 7 | **Lokalizacja** | ✅ 25+ języków |
| 8 | **Cloud Files** | ✅ Nowa sekcja CLOUD_FILES — Google Drive (free), Dropbox (PRO), OneDrive (PRO) |

### 🟢 Warto dodać (niski wysiłek, duża wartość)

| # | Feature | Wysiłek | Wartość | Opis |
|---|---------|---------|---------|------|
| 1 | **"What's new" bottom sheet** | Niski | Średnia | Po aktualizacji — changelog w apce |
| 2 | **Share app link** | Niski | Średnia | "Podziel się UniSearch" w InfoUI |
| 3 | **Rate app** | Niski | Średnia | In-app review prompt (Google Play In-App Review API) |
| 4 | **Copy to clipboard** | Niski | Średnia | Kopiuj numer/email kontaktu, wynik kalkulatora long-press |

### 🟡 Rozważ (średni wysiłek)

| # | Feature | Wysiłek | Wartość | Opis |
|---|---------|---------|---------|------|
| 5 | **Więcej animacji wejścia** | Średni | PRO value | Bounce, elastic, stagger per-item (np. 3-4 nowe typy) |
| 6 | **Smart suggestions** | Średni | Wysoka | Sugestie na podstawie czasu dnia / dnia tygodnia |
| 7 | **Search history** | Średni | Średnia | Historia wyszukiwań (opcjonalne, off by default) |
| 8 | **Shortcut pinning** | Średni | Średnia | Pin ulubionego shortcuta do custom section jednym tapem |
| 9 | **Per-section collapse memory** | Niski | Średnia | Zapamiętaj stan rozwinięcia sekcji |

### 🔴 Na przyszłość (duży wysiłek)

| # | Feature | Wysiłek | Wartość | Opis |
|---|---------|---------|---------|------|
| 10 | **Accessibility (TalkBack)** | Średni | Ważna | Content descriptions, focus order |
| 11 | **Tablet/foldable layout** | Duży | Niszowa | Adaptive layout dla dużych ekranów |

### 🔧 Do poprawienia przed release

| # | Issue | Priorytet |
|---|-------|-----------|
| 1 | **Analytics SectionType** ma STATUS — usunąć | 🟡 Cleanup |
| 2 | **Ad unit ID** — zmienić z test na produkcyjny | 🔴 Release |
| 3 | **Paywall strings** — zaktualizować listę features (patrz sekcja 21) | 🟡 Ważne |
| 4 | **isProFeature** — zweryfikować brakujące flagi (sekcja 19, statusy ⚠️) | 🟡 Ważne |

---

## 21. Lista do Paywallu (korzyści Pro)

### Obecne paywall_feature_* strings (patrz sekcja 17.3 — 14 zdefiniowanych, 9 wyświetlanych, 5 pominiętych)

### Rekomendowana lista (bardziej szczegółowa, lepsza konwersja):

| # | Feature (EN) | Feature (PL) | Ikona |
|---|--------------|--------------|-------|
| 1 | **No ads** | Brak reklam | 🚫 |
| 2 | **54 customizable color slots** | 54 miejsca z możliwością zmiany koloru (Pasek wyszukiwania, Sekcje, Ikony, Widget, Panel dolny) | 🎨 |
| 3 | **12 premium themes** | Glass, Nord, Terminal, Material You, Midnight Blue i inne | 🖼️ |
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
| 14 | **Cloud storage** | Dropbox + OneDrive integration | ☁️ |
| 15 | **Support development** | Wspieraj dalszy rozwój | 💚 |

### Proponowane paywall_feature_* strings (do strings.xml):

```xml
<!-- Poprawione: 52→54, naprawiony icon_packs/AI mixup, dodane cloud + geometry, 12 PRO presets -->
<string name="paywall_feature_no_ads">Remove all ads</string>
<string name="paywall_feature_colors">54 customizable color slots (Search bar, Sections, Icons, Widget, Bottom panel)</string>
<string name="paywall_feature_themes">12 premium themes (Glass, Nord, Terminal, Material You, and more)</string>
<string name="paywall_feature_animations">11 animation types + speed control</string>
<string name="paywall_feature_file_content_search">File content search (PDF, DOCX, XLSX)</string>
<string name="paywall_feature_geometry">Full style control (radius, padding, opacity, borders)</string>
<string name="paywall_feature_custom_sections">Unlimited custom sections (Free: 1 section)</string>
<string name="paywall_feature_reorder">Reorder sections with drag &amp; drop</string>
<string name="paywall_feature_icon_packs">Third-party icon packs</string>
<string name="paywall_feature_ai_prompts">Unlimited AI prompts with custom templates (Free: 1 prompt)</string>
<string name="paywall_feature_search_providers">Custom search providers</string>
<string name="paywall_feature_wallpaper">Custom wallpaper color + blur effect</string>
<string name="paywall_feature_cloud">Dropbox &amp; OneDrive cloud search</string>
<string name="paywall_feature_backup">Settings backup and restore (JSON)</string>
<string name="paywall_feature_support">and many many more…</string>
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
| 3 | **Make it yours** | 5 themes, 54 miejsca z możliwością zmiany koloru, 11 animations. Upgrade to Pro for the full experience. |

---

## 23. Lokalizacja

Aplikacja obsługuje **25+ języków**:

| Język | Kod |
|-------|-----|
| Angielski (domyślny) | `values/` |
| Afrikaans | `af` |
| Arabski | `ar` |
| Amharski | `am` |
| Czeski | `cs` |
| Duński | `da` |
| Niemiecki | `de` |
| Hiszpański | `es` |
| Fiński | `fi` |
| Filipino | `fil` |
| Francuski | `fr` |
| Hindi | `hi` |
| Węgierski | `hu` |
| Indonezyjski | `id` |
| Włoski | `it` |
| Japoński | `ja` |
| Koreański | `ko` |
| Holenderski | `nl` |
| Norweski | `no` |
| Polski | `pl` |
| Portugalski | `pt` |
| Rumuński | `ro` |
| Rosyjski | `ru` |
| Słowacki | `sk` |
| Szwedzki | `sv` |
| Tajski | `th` |
| Turecki | `tr` |
| Wietnamski | `vi` |

Auto-reindeksacja przy zmianie locale: `LocaleChangeReceiver` → `LocaleReindexWorker` (WorkManager).

---

## 24. Haptic Feedback

Zaimplementowany w wielu komponentach:

| Komponent | Zdarzenie |
|-----------|-----------|
| AppItem / AppRow | Long-press → HapticFeedbackType.LongPress |
| ContactsSection | Long-press na kontakcie |
| FilesSection | Long-press na pliku |
| FileContentSection | Long-press na wyniku |
| SettingsSection | Long-press na ustawieniu |
| ActionsSection | Long-press na akcji |
| CalculatorSection | Long-press na wyniku |
| SectionHeader | Long-press na nagłówku |
| SearchInput | Clear button, back button |
| SectionsOrder / Drag & Drop | Rozpoczęcie drag |
| AiPromptsSettingsSheet | Drag & drop |
| SearchWithSettingsActivity | Drag & drop providers |
| WheelPicker | Scroll selection |
| CustomSectionRenderer | Long-press na elemencie |

---

## 25. Receivers (zdarzenia systemowe)

| Receiver | Zdarzenie | Opis |
|----------|-----------|------|
| `PackageChangeReceiver` | ACTION_PACKAGE_ADDED/REMOVED/CHANGED | Hot reload indeksu aplikacji i akcji |
| `LocaleChangeReceiver` | ACTION_LOCALE_CHANGED | Re-indeksowanie w tle (WorkManager) |
| `SearchBarWidgetProvider` | Widget events | Aktualizacja widgetu paska wyszukiwania |

---

## 26. Luki w paywallu — co powinno być PRO a nie jest

### 🔴 Krytyczne (wyciek wartości Pro)

| # | Feature | Obecny stan | Problem | Rekomendacja |
|---|---------|-------------|---------|-------------|
| 1 | **Per-section style override** (context menu) | FREE | Użytkownik może wejść w per-section styling bez Pro. Kolory w środku mają isProFeature, ale samo wejście nie. | Dodaj `isProFeature = true` lub check `isPro` na wejściu do per-section override (context menu "Customize section") |
| 2 | **Search Provider reorder** (drag & drop) | FREE | Zmiana kolejności search providers działa bez Pro, mimo że to zaawansowana personalizacja | Dodaj check `isPro` w `SearchProviderComponents.kt` na drag handle |
| 3 | **Section Load Animation link** (AnimationsUI.kt) | `isProFeature = false` | Link do Section Load Animation NIE pokazuje PRO badge, mimo że 9/11 opcji wewnątrz jest PRO. Użytkownik widzi niespójność. | Zmień na `isProFeature = true` lub przynajmniej pokaż badge gdy obecna wartość ≠ NONE/FADE |
| 4 | **CustomSectionEditSheet CRUD** | FREE (jeśli sekcja istnieje) | Jeśli user ma 1 free custom section, może ją edytować/usuwać bez Pro. To OK, ale dodawanie elementów powinno mieć limit. | Rozważ limit itemów per section dla free (np. 5) |
| 5 | **Sections link** (BehaviorUI.kt) | FREE | Wejście do ekranu sekcji nie ma `isProFeature`. Drag & drop wewnątrz jest zablokowany, ale enable/disable toggle jest free. | OK — ale rozważ dodanie PRO badge na linku |

### 🟡 Drobne niespójności

| # | Feature | Obecny stan | Uwaga |
|---|---------|-------------|-------|
| 6 | **AnimationsUI Section Load** | Link = FREE, opcje wewnątrz = częściowo PRO | Niespójność wizualna — link nie ma badge PRO ale wewnątrz jest paywall |
| 7 | **1 custom section gratis** | Free | Dobra strategia (teaser), ale CRUD na tej sekcji jest pełny — brak limitu itemów |
| 8 | **1 AI prompt gratis** | Free | Dobra strategia, spójne z custom sections |

### 🟢 Dobrze zaimplementowane

| # | Feature | Uwaga |
|---|---------|-------|
| 1 | Kolory (54 miejsca) | Wszystkie mają `isProFeature = true` |
| 2 | Style geometryczne (SearchBar/Sekcje/Widget) | Wszystkie zablokowane |
| 3 | Widget customization | 9 opcji za paywallem |
| 4 | Backup/Export | Oba zablokowane |
| 5 | Style presets (Glass/MaterialYou/Custom) | Dynamiczny check preset ID |
| 6 | Custom Style Presets | Zablokowane |
| 7 | Icon packs (poza SYSTEM) | Zablokowane |
| 8 | Tapeta (3 opcje) | Wszystkie zablokowane |
| 9 | Add custom search provider | Zablokowany |
| 10 | FILE_CONTENT toggle | Zablokowany |
| 11 | Section reorder drag & drop | Zablokowany |
| 12 | ADS hidden for Pro | Filtrowane w SectionsOrder |

### 💡 Sugestie co jeszcze dodać za paywall

| # | Feature | Obecny stan | Sugestia | Wysiłek |
|---|---------|-------------|----------|---------|
| 1 | **Limity wyników** (max per section, max recents, max collapsed) | FREE | Rozważ: free = domyślne wartości, PRO = pełny slider. Power userzy chcą więcej wyników. | Niski |
| 2 | **Pozycja SearchBar** (TOP/BOTTOM) | FREE | Zachowaj free — to podstawa UX | — |
| 3 | **Grid columns count** (4-6) | FREE | Rozważ PRO: free = 4-5, PRO = 4-6. Lub zachowaj free. | Niski |
| 4 | **Tryb kompaktowy kontaktów** | FREE | Mało istotne, zachowaj free | — |
| 5 | **Rozmiar ikon** (S/M/L) | FREE | Mało istotne, zachowaj free | — |
| 6 | **Opóźnij auto-focus do animacji** | FREE | Zachowaj free — to UX fix, nie premium feature | — |

---

## 27. Ocena Free vs Pro — rekomendacje zmian (2026-03-08)

### ✅ SCALE jest już FREE (potwierdzone w kodzie)

SCALE jest w `allPresets` jako FREE — warunek: `type == NONE || type == FADE || type == SCALE`. Rekomendacja z poprzedniej wersji dokumentu jest już zrealizowana.

### ✅ Material You preset — zachowaj PRO

Material You w UniSearch to **statyczny preset** z hardcoded kolorami M3 (np. `0xFF6750A4`, `0xFFD0BCFF`), NIE dynamiczne kolory z wallpapera/systemu. To po prostu kolejny motyw kolorystyczny — taki sam charakter jak Glass czy Custom. Nie ma argumentu za darmowym dostępem. Słusznie za paywallem.

### 🟡 Rozważ przeniesienie (dyskusyjne)

| # | Feature | Obecny stan | Argumenty ZA free | Argumenty ZA pro | Moja ocena |
|---|---------|-------------|-------------------|-----------------|------------|
| 3 | **File Content Search (FTS4)** | PRO | Apka reklamuje się jako "universal search" — blokowanie szukania w treści plików osłabia obietnicę. Negatywne recenzje typu "szuka tylko po nazwach". | Resource-intensive, konkurencja nie ma. Silny differentiator Pro. | **Zachowaj PRO**, ale rozważ limit (np. 50 plików free, unlimited Pro) lub daj free z ograniczeniem do .txt/.md (bez Office/PDF). |
| 4 | **Animation Speed** | PRO | Użytkownik free z FADE/SCALE ma domyślną prędkość (MEDIUM) — nie ma jak zmienić. | Kontrola prędkości = zaawansowana personalizacja. | **Zachowaj PRO** — domyślna prędkość jest OK. |
| 5 | **Sekcje: show header icons** | PRO | To drobna opcja wizualna, domyślnie włączona. Wyłączenie = power user. | Zwiększa liczbę "PRO options". | **Zachowaj PRO** — nisko wpływowy ale zwiększa postrzeganą wartość Pro. |

### 🟢 Zachowaj PRO (bez zmian — dobrze ustawione)

| # | Feature | Uzasadnienie |
|---|---------|-------------|
| 1 | Kolory (54 miejsca) | Core premium value — pełna personalizacja kolorów |
| 2 | Glass + Material You + Custom presety | Statyczne presety kolorów — premium look & feel |
| 3 | Custom Style Presets (zapis/load) | Power user feature |
| 4 | Icon packs | Nisze, ale wyraźnie premium |
| 5 | Style geometryczne (SearchBar/Sekcje/Widget) | Zaawansowana personalizacja |
| 6 | SearchBar Load Animation (11 typów) | Premium animations |
| 7 | Section Resize / Load Order | Zaawansowane |
| 8 | Tapeta (kolor/opacity/blur) | Premium visual |
| 9 | Custom sections (>1) + drag reorder | Silny Pro teaser (1 free) |
| 10 | Custom search providers | Power user |
| 11 | AI Prompts (>1) | Silny Pro teaser (1 free) |
| 12 | Widget customization | Premium visual |
| 13 | Backup/Export | Standard Pro feature |
| 14 | Dropbox + OneDrive | Premium cloud |

### 🟢 Zachowaj FREE (bez zmian — dobrze ustawione)

| # | Feature | Uzasadnienie |
|---|---------|-------------|
| 1 | Wszystkie algorytmy wyszukiwania | Core value — free musi dobrze szukać |
| 2 | Wszystkie źródła (Apps, Actions, Contacts, Files, Settings) | Core search |
| 3 | Google Drive | 1 cloud provider free = dobry teaser |
| 4 | Motyw (SYSTEM/LIGHT/DARK) | Podstawa UX |
| 5 | Layout (GRID/LIST, kolumny, rozmiary) | Podstawowa personalizacja |
| 6 | Zarządzanie widocznością | Użyteczność |
| 7 | 1 custom section + 1 AI prompt | Dobra strategia teasera |
| 8 | NONE + FADE + SCALE animacje (Section Load) | SearchBar Load i Section Resize wszystkie FREE |
| 9 | Search Provider reorder | Niska wartość Pro, frustracja free userów |
| 10 | Pozycja SearchBar (TOP/BOTTOM) | Podstawa UX |

### 📊 Aktualny stan podziału animacji (potwierdzony w kodzie)

| Kategoria | FREE | PRO |
|-----------|------|-----|
| Section Load Animation | 3/11 (NONE, FADE, SCALE) | 8/11 |
| SearchBar Load Animation | 11/11 (brak isProFeature) | 0/11 |
| Section Resize Animation | 2/2 (brak isProFeature) | 0/2 |
| Load Order | 1/3 (SIMULTANEOUSLY) | 2/3 |
| Animation Speed | — | 5/5 |

**Reszta podziału Free/Pro jest dobrze ustawiona** — presety (12 PRO, 2 FREE), kolory (50 PRO, 4 FREE), geometria, cloud, backup słusznie za paywallem.

---

## 28. Problemy paywallu — co naprawić (2026-03-08)

### 🔴 Bugi

| # | Problem | Plik | Opis | Priorytet |
|---|---------|------|------|-----------|
| 1 | **`paywall_feature_icon_packs` ma tekst o AI prompts** | strings.xml (25+ języków) | Klucz mówi "icon_packs", ale tekst: "Unlimited custom AI prompts (Free: 1 prompt)". Brak wzmianki o icon packs na paywallu. | 🔴 Krytyczny |
| 2 | **Liczba kolorów: 52 → 54** | strings.xml `paywall_feature_colors` | String mówi "52 customizable color slots", realna liczba to 54 (7+7+3+5+5 = 27 × 2 motywy). | 🟡 Drobny |

### 🟡 Brakujące features na paywallu

PaywallContent.kt wyświetla 9 pozycji. 5 zdefiniowanych stringów jest pominiętych:

| # | Pominięty string | Wartość dla konwersji |
|---|-----------------|---------------------|
| 1 | `paywall_feature_geometry` — Full style control | Wysoka — użytkownik widzi zablokowane opcje geometrii |
| 2 | `paywall_feature_wallpaper` — Custom wallpaper + blur | Średnia — wizualnie atrakcyjna feature |
| 3 | `paywall_feature_reorder` — Section drag & drop | Średnia — power users |
| 4 | `paywall_feature_search_providers` — Custom providers | Niska — niszowa |
| 5 | `paywall_feature_ai_prompts` — AI prompts (duplikat z icon_packs bug) | — |

### 🟡 Brakujące features — nie mają nawet stringa

| # | Feature PRO bez stringa | Sugestia |
|---|------------------------|---------|
| 1 | **Cloud storage (Dropbox + OneDrive)** | Dodaj `paywall_feature_cloud` |
| 2 | **Widget customization (9 opcji)** | Dodaj `paywall_feature_widget` |
| 3 | **Per-section styling** | Dodaj `paywall_feature_per_section` |

### 📋 Rekomendowana PAYWALL_FEATURES lista (do PaywallContent.kt)

Optymalna kolejność — od najsilniejszego argumentu do najsłabszego (~12 pozycji):

| # | Ikona | String key | Tekst |
|---|-------|-----------|-------|
| 1 | Block | paywall_feature_no_ads | Remove all ads |
| 2 | Palette | paywall_feature_colors | 54 customizable color slots |
| 3 | Style | paywall_feature_themes | Premium themes: Glass, Material You, Custom |
| 4 | Tune | paywall_feature_geometry | Full style control (radius, padding, opacity, borders) |
| 5 | Animation | paywall_feature_animations | 11 animation types + speed control |
| 6 | Article | paywall_feature_file_content_search | File content search (PDF, DOCX, XLSX) |
| 7 | Dashboard | paywall_feature_custom_sections | Unlimited custom sections (Free: 1) |
| 8 | SmartToy | paywall_feature_ai_prompts | Unlimited AI prompts (Free: 1) |
| 9 | AppsBadge | paywall_feature_icon_packs | Third-party icon packs |
| 10 | Cloud | paywall_feature_cloud | Dropbox & OneDrive cloud search |
| 11 | Wallpaper | paywall_feature_wallpaper | Custom wallpaper + blur |
| 12 | Save | paywall_feature_backup | Backup & restore settings |
| 13 | Favorite | paywall_feature_support | and many many more... |

---
