# Akces NCBR Design System

Ten dokument opisuje bazowy standard wizualny aplikacji. Wszystkie kolejne zmiany UI powinny byc z nim zgodne.

## Kolory

- Tlo aplikacji: `--page`.
- Karty i panele: `--panel`, `--line`, `--card-shadow`.
- Glowny akcent Akces: `--akces-orange`; uzywac dla aktywnych elementow, glownej akcji, ikon i paskow postepu.
- Tekst glowny: `--ink`.
- Tekst pomocniczy: `--muted`.
- Statusy: `success`, `warning`, `danger`, `info`, `neutral` oraz ich warianty `*-soft`.

Pomaranczowy jest akcentem, nie kolorem dominujacym.

## Komponenty

- Karty: uzywac `.app-card`, `.card` albo istniejacych kart modulowych opartych o ten sam styl.
- Karty interaktywne powinny miec hover z delikatnym uniesieniem, mocniejszym cieniem i subtelna zmiana obramowania.
- Badge statusu: uzywac helpera `statusBadge(status)` w `public/app.js`.
- Powiadomienia: uzywac struktury `state.notifications` i helperow `renderNotificationMenu`, `addNotification`, `openNotification`.
- Wyszukiwanie globalne: nowe dane dodawac do `buildSearchIndex()` z polami `title`, `type`, `module`, `description`, `status`, `relatedObjectId`.
- Walidacje: uzywac helperow `showValidationErrors`, `setFieldError`, `validateNip`, `validateRegon`, `validateKrs`, `validateEmail`, `validateUrl`, `validatePdfFile`, `validateDateRange`.
- Przyciski:
  - `.button` dla glownej akcji.
  - `.button.secondary` dla akcji pomocniczych.
  - `.button.danger` dla akcji ryzykownych.
  - `.button.ghost` dla niskopriorytetowych akcji.
- Puste stany: uzywac helpera `emptyState(title, description, action)`.
- Podsumowania: uzywac `.summary-strip` albo modulowych summary opartych o ten sam styl.
- Toasty: uzywac `showToast(message, tone)`; dostepne tony to `success`, `danger`, `info`.
- Skeleton loading: uzywac `.skeleton-layout` i `.skeleton-card` przy widokach czekajacych na dane.
- Procesy: dokumenty powinny korzystac z wizualnego steppera `.signature-path`, a historia z timeline `.document-timeline`.
- Progress: limity godzin i checklisty powinny uzywac paskow postepu opartych o `.hours-progress`.

## Ruch i interakcje

- Animacje powinny trwac zwykle `150-250ms` i uzywac tokenow `--transition-fast`, `--transition-base`.
- Dropdowny, modale i zmiana paneli powinny miec subtelny fade/slide/scale.
- Kazdy element klikalny powinien miec hover, active i focus-visible.
- Nalezy respektowac `prefers-reduced-motion`; nie dodawac agresywnych lub dlugich animacji.

## Layout

- Glowne widoki powinny miec `pageHead(...)`: tytul, opis i opcjonalna akcja.
- Karty powinny miec padding okolo `20-24px`.
- Duze sekcje powinny miec odstep okolo `24-32px`.
- Formularze powinny miec logiczne sekcje i maksymalnie 2-3 kolumny na desktopie.
- Na mniejszych ekranach karty i pola ukladaja sie jedna pod druga.

## Tabele

Tabele zostaja dla danych operacyjnych:

- grant i wydatki,
- raporty i eksporty,
- dlugie listy wymagajace filtrowania.

Kontekstowe listy, takie jak dokumenty, mentorzy, cele, materialy marketingowe i kontakty, powinny byc kartami.

## Sidebar

- Rozwiniety sidebar pokazuje ikone i nazwe modulu.
- Zwiniety sidebar pokazuje same ikony i ma natywny tooltip przez `title`.
- Aktywny element ma jasne pomaranczowe tlo, kreske po lewej, pogrubiony tekst i pomaranczowa ikone.
