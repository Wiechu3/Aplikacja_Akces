# Akces NCBR MVP

Lokalne MVP aplikacji webowej do prezentacji kierunku rozwoju systemu Akces NCBR.

## Uruchomienie

```bash
npm install
npm start
```

Aby serwer automatycznie restartował się po zmianach plików:

```bash
npm run dev
```

Aplikacja startuje domyslnie pod adresem:

```text
http://localhost:3001
```

## Dane lokalne

Wszystkie dane uzytkowe sa zapisywane w katalogu `local-data/`, ktory jest wpisany do `.gitignore`.
Dzieki temu dokumenty, zalaczniki i robocze dane beneficjentow nie beda przenoszone przez GitHub pomiedzy instancjami.

Po dodaniu beneficjenta backend tworzy strukture:

```text
local-data/
  beneficiaries/
    nazwa-beneficjenta/
      documents/
      expenses/
      uploads/
      reports/
```
