# INFP Earthquake Monitor

Aplicație Electron pentru Windows care monitorizează evenimentele afișate de:

https://alerta.infp.ro/

autor: comunitate / distribuire gratuită.

## Pentru utilizatorii finali

Utilizatorul NU are nevoie de Node.js, npm, PowerShell sau alte programe de dezvoltare.

Se distribuie installerul:

`INFP-Earthquake-Monitor-1.0.0-Setup.exe`

După instalare, aplicația poate fi pornită din Start Menu sau de pe Desktop.

La prima pornire:

1. Se deschide pagina INFP.
2. Utilizatorul rezolvă manual verificarea „Nu sunt robot”.
3. Se lasă pagina să ajungă la „Lista Evenimente”.
4. Se revine în aplicație și se pornește monitorizarea.
5. Sesiunea Chromium este păstrată local, astfel încât CAPTCHA-ul nu trebuie rezolvat la fiecare verificare, cât timp sesiunea rămâne validă.

CAPTCHA-ul nu este ocolit sau automatizat.

## Build local (doar pentru dezvoltator)

```powershell
npm install
npm start
npm run dist
```

Installerul va apărea în `dist\`.

## Build automat pentru Windows

Repository-ul include GitHub Actions în:

`.github/workflows/build-windows.yml`

### Cum obții EXE-ul fără să instalezi Node pe PC-ul tău

1. Creează un repository GitHub nou.
2. Urcă toate fișierele acestui proiect.
3. Intră la **Actions**.
4. Selectează **Build Windows installer**.
5. Apasă **Run workflow**.
6. După terminarea build-ului, descarcă artifact-ul:
   `INFP-Earthquake-Monitor-Windows`
7. În arhiva artifact-ului vei găsi installerul `.exe`.

Dacă repository-ul primește un tag de forma `v1.0.0`, workflow-ul creează automat și un GitHub Release și atașează installerul `.exe`.

Exemplu:

```text
v1.0.0
    -> INFP-Earthquake-Monitor-1.0.0-Setup.exe
```

## Monitorizare

Aplicația verifică pagina la fiecare 30 de secunde și compară evenimentele cu cele deja văzute.

La detectarea unui eveniment nou, Windows afișează o notificare Toast cu:

- magnitudinea;
- data/ora evenimentului;
- adâncimea;
- coordonatele, dacă sunt disponibile.

Evenimentele deja existente la prima pornire nu produc notificări, pentru a evita spamul.

## Notă tehnică

Scraper-ul caută tabelul după antetele „Magnitudine” și „Adâncime”, nu după poziția fixă a tabelului. Dacă INFP modifică structura HTML, selectorul din `src/main.js` poate necesita ajustare.
