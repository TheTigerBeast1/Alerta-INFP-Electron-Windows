# INFP Earthquake Monitor

![INFP Earthquake Monitor](/main.jpg)


**Aplicație Windows pentru acces rapid la Sistemul Alerta EWS al Institutului Național de Cercetare-Dezvoltare pentru Fizica Pământului (INFP / INCDFP).**

> [!IMPORTANT]
> **INFP Earthquake Monitor este o aplicație neoficială**, realizată pentru Windows, care oferă acces într-o fereastră dedicată la pagina web publică a Sistemului Alerta EWS. Aplicația nu este un produs oficial al INFP/INCDFP și nu modifică sistemul de alertare al acestora.

---

## Ce este INFP Earthquake Monitor?

INFP Earthquake Monitor este o aplicație Windows care deschide direct pagina oficială a Sistemului Alerta EWS:

**[https://alerta.infp.ro/](https://alerta.infp.ro/)**

Aplicația este gândită pentru cei care vor să aibă sistemul de alertare disponibil permanent, fără să fie nevoiți să țină un browser deschis doar pentru această pagină.

În loc să ai un tab separat în Chrome, Edge sau alt browser, poți lăsa **INFP Earthquake Monitor** să ruleze discret în system tray, lângă ceas.

### De ce poate fi utilă?

Aplicația este utilă mai ales dacă:

- nu vrei să ții un browser deschis permanent doar pentru pagina Sistemului Alerta EWS;
- închizi accidental browserul sau tab-ul în care aveai deschis site-ul;
- folosești browserul pentru alte activități și nu vrei ca pagina de alertare să fie amestecată printre celelalte tab-uri;
- vrei să ai sistemul EWS într-o aplicație separată, ușor de găsit din Start Menu;
- vrei să lași sistemul de alertare să ruleze discret în fundal, fără să ocupe un loc în taskbar.

**Practic, în loc să păstrezi un tab de browser deschis doar pentru alerte, poți lăsa aplicația să ruleze în fundal și să primești în continuare notificările oferite de pagina oficială INFP.**

---

## Cum funcționează?

Aplicația nu are propriul sistem de detectare a cutremurelor.

Ea funcționează ca un **wrapper Windows pentru pagina oficială INFP**.

Cu alte cuvinte, aplicația lasă sistemul INFP să facă ceea ce face deja în mod normal într-un browser.

Nu încercăm să reproducem sau să înlocuim mecanismele site-ului.

```text
INFP Earthquake Monitor
          │
          ▼
   alerta.infp.ro
          │
          ├── Sistemul Alerta EWS
          ├── detectarea evenimentelor
          ├── notificările
          ├── sunetele
          └── interfața site-ului
```

---

## Notificări

Pagina oficială INFP are propriul sistem de notificări.

Într-un browser normal, site-ul poate solicita permisiunea de a trimite notificări și poate utiliza sunete atunci când apar evenimente noi.

**INFP Earthquake Monitor permite paginii să folosească același mecanism în cadrul aplicației.**

La prima utilizare, site-ul poate solicita:

- permisiunea pentru notificări;
- opțiunile pentru sunete;
- alte permisiuni necesare funcționării sale.

Aceste opțiuni sunt controlate de pagina INFP, nu de un sistem separat creat de această aplicație.

---

## Prima pornire

La prima pornire, aplicația deschide pagina oficială INFP.

În funcție de situație, pagina poate solicita rezolvarea unui CAPTCHA sau alte acțiuni.

De exemplu:

1. Deschizi aplicația.
2. Pagina INFP se încarcă.
3. Rezolvi CAPTCHA-ul, dacă este solicitat.
4. Permiți notificările, dacă dorești.
5. Configurezi opțiunea pentru sunete.
6. Lași aplicația să ruleze.

După aceea, aplicația poate fi minimizată în system tray.

> [!NOTE]
> **INFP Earthquake Monitor nu încearcă să ocolească CAPTCHA-ul sau alte măsuri de securitate ale site-ului.**

---

## System Tray

Atunci când închizi fereastra aplicației, aceasta rămâne disponibilă în **system tray**, lângă ceas.

Iconița aplicației este cea a INFP.

Din tray poți:

- redeschide pagina;
- vedea că aplicația rulează;
- închide complet aplicația.

Acest comportament permite aplicației să rămână disponibilă fără să ocupe permanent spațiu în taskbar.

Dacă ai închis din greșeală fereastra, nu trebuie să pornești din nou aplicația. Trebuie doar să cauți iconița **INFP Earthquake Monitor** lângă ceas.

---

## Ce face aplicația?

Pe scurt, aplicația:

- deschide pagina oficială `alerta.infp.ro`;
- oferă o fereastră separată de browser;
- păstrează o sesiune proprie pentru site;
- permite site-ului să folosească notificările Windows;
- permite site-ului să folosească funcțiile audio necesare;
- poate rula în system tray;
- oferă acces rapid la pagina EWS;
- folosește identitatea vizuală INFP;
- poate fi instalată și dezinstalată ca o aplicație Windows obișnuită.

---

## Ce NU face aplicația?

Aplicația **nu înlocuiește sistemul EWS al INFP**.

Nu:

- descarcă separat datele despre cutremure;
- face scraping al tabelului de evenimente;
- calculează magnitudinea, adâncimea sau localizarea unui eveniment;
- menține o bază de date proprie de cutremure;
- generează propriile alerte seismice;
- încearcă să reproducă algoritmii de detectare ai INFP;
- ocolește CAPTCHA-ul sau alte măsuri de securitate ale site-ului.

Informațiile și funcționalitatea afișate în aplicație provin de la pagina oficială INFP.

---

## Conexiunea la internet

Aplicația are nevoie de internet pentru a încărca și utiliza Sistemul Alerta EWS.

Dacă:

- conexiunea la internet este întreruptă;
- `alerta.infp.ro` este indisponibil;
- serverele INFP nu sunt disponibile;

aplicația nu poate primi informații noi de la sistem.

Aplicația nu conține o bază de date locală care să poată înlocui sistemul online.

---

## CAPTCHA și permisiuni

Este posibil ca site-ul să solicite periodic verificarea CAPTCHA sau alte permisiuni.

Acestea sunt mecanisme ale site-ului INFP și trebuie rezolvate manual de utilizator.

Aplicația nu încearcă să le ocolească.

Dacă site-ul solicită din nou o acțiune, aceasta trebuie efectuată în fereastra aplicației.

---

## Date și confidențialitate

Aplicația nu are un server propriu și nu colectează în mod intenționat date personale.

Pagina încărcată este:

**[https://alerta.infp.ro/](https://alerta.infp.ro/)**

Aplicația folosește o sesiune locală separată pentru această pagină, astfel încât anumite informații de sesiune și cookie-uri să poată fi păstrate între porniri.

Comportamentul efectiv al paginii și serviciile externe utilizate de aceasta sunt determinate de site-ul INFP.

---

## Cerințe

Pentru utilizarea normală sunt necesare:

- **Windows 10** sau o versiune mai nouă;
- conexiune la internet;
- acces la `alerta.infp.ro`;
- notificările Windows activate, dacă dorești să primești notificări.

Nu este necesară instalarea separată a:

- Node.js;
- npm;
- Electron;

pentru versiunea distribuită ca installer Windows.

---

## Instalare

Aplicația este distribuită sub forma unui installer Windows:

```text
INFP-Earthquake-Monitor-1.0.0-Setup.exe
```

Pornește installerul și urmează pașii afișați.

În funcție de opțiunile disponibile, aplicația poate fi instalată pentru utilizatorul curent sau pentru toți utilizatorii calculatorului.

Installerul poate crea shortcut-uri în Start Menu și pe Desktop.

---

## Dezinstalare

Aplicația poate fi dezinstalată folosind mecanismele normale Windows.

În Windows 10/11:

**Settings → Apps → Installed apps**

Caută:

**INFP Earthquake Monitor**

și selectează **Uninstall**.

---

# Depanare

## Nu primesc notificări

Verifică:

1. dacă pagina INFP este încărcată;
2. dacă ai permis notificările atunci când site-ul le-a solicitat;
3. dacă notificările Windows sunt activate;
4. dacă ai conexiune la internet;
5. dacă aplicația încă rulează în system tray.

---

## Am închis fereastra și nu mai găsesc aplicația

Aplicația rămâne în system tray după închiderea ferestrei.

Caută iconița **INFP Earthquake Monitor** lângă ceas.

Un click pe aceasta redeschide aplicația.

---

## Site-ul îmi cere din nou CAPTCHA

Acest lucru este controlat de site-ul INFP.

Aplicația păstrează o sesiune locală pentru pagina web, dar nu poate garanta că site-ul nu va solicita o nouă verificare.

Dacă apare CAPTCHA, rezolvă-l normal în fereastra aplicației.

---

## Site-ul își schimbă interfața

Aplicația este concepută intenționat ca un wrapper pentru pagina oficială și nu depinde de structura internă a tabelului de evenimente.

Dacă INFP modifică interfața site-ului, modificările vor fi afișate automat în aplicație atunci când pagina este încărcată.

Acesta este unul dintre motivele pentru care aplicația nu încearcă să interpreteze separat datele de pe site.

---

# Pentru utilizatorii tehnici

Proiectul este construit folosind:

- **Electron** — runtime pentru aplicația desktop;
- **electron-builder** — împachetarea aplicației pentru Windows;
- **NSIS** — installerul Windows;
- o sesiune Electron persistentă (`persist:infp`) pentru pagina EWS;
- `AppUserModelId` `ro.infp.earthquake-monitor`;
- permisiuni Electron configurate pentru notificările web ale `alerta.infp.ro`.

### Structura proiectului

```text
INFP-Earthquake-Monitor/
├── assets/
│   ├── icon.ico
│   └── tray.ico
├── src/
│   └── main.js
├── package.json
└── README.md
```

Aplicația nu are un backend propriu și nu interoghează separat un API de cutremure.

---

## Rulare în dezvoltare

Cu Node.js instalat:

```bash
npm install
npm start
```

---

## Build Windows

```bash
npm run dist
```

Installerul rezultat va fi creat în:

```text
dist/
```

---

# Licență

Proiectul este distribuit împreună cu fișierul `LICENSE`.

Logo-ul și identitatea vizuală INFP/INCDFP aparțin proprietarilor lor și sunt utilizate în aplicație pentru identificarea serviciului web către care aceasta oferă acces.

---

# Disclaimer

> [!WARNING]
> **INFP Earthquake Monitor este o aplicație neoficială și nu este afiliată, sponsorizată sau aprobată de Institutul Național de Cercetare-Dezvoltare pentru Fizica Pământului (INFP/INCDFP), cu excepția cazului în care acest lucru este declarat explicit de proprietarii serviciului.**

Aplicația oferă un mod alternativ de accesare a paginii publice a Sistemului Alerta EWS.

Pentru informații oficiale despre activitatea seismică și alertele emise, consultați întotdeauna sursele oficiale ale INFP/INCDFP.

---

# Pe scurt

> **Nu vrei să ții browserul deschis doar pentru alerte?**

Instalezi **INFP Earthquake Monitor**, îl lași să ruleze lângă ceas și ai pagina Sistemului Alerta EWS într-o aplicație separată.

**INFP face monitorizarea. Aplicația doar îți oferă un mod mai comod de a ține sistemul la îndemână.**
