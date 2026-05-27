# Akces NCBR MVP

Demo aplikacji webowej do projektowania docelowego frontendu systemu Akces NCBR.

Na obecnym etapie aplikacja dziala jako statyczny mockup frontendu: widoki, formularze, powiadomienia, kalendarz i eksporty sa obslugiwane po stronie przegladarki. Dane demo sa zapisywane w `localStorage`, a gdy przegladarka blokuje storage, aplikacja korzysta z pamieci sesji strony.

## Uruchomienie lokalne

```bash
npm install
npm start
```

Aplikacja startuje domyslnie pod adresem:

```text
http://localhost:3001
```

Serwer lokalny sluzy teraz glownie do wygodnego podawania plikow z katalogu `public/`. Frontend demo nie wymaga endpointow backendowych do podstawowych klikanych funkcji.

## Deploy na Vercel

Mozesz wrzucic projekt na Vercel jako statyczna aplikacje. Vercel powinien serwowac katalog `public/`, w ktorym sa:

- `index.html`
- `app.js`
- `styles.css`
- lokalne pliki FullCalendar w `public/vendor/fullcalendar/`

Nie wrzucamy danych roboczych z `local-data/`, bo katalog jest wpisany do `.gitignore`.

## Backend pozniej

`server.js` zostaje w repo jako lokalna referencja do przyszlego backendu. Gdy front bedzie zatwierdzony, mozna na jego podstawie podmienic mock API z `public/app.js` na prawdziwe endpointy.
