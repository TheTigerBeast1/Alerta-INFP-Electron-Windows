# INFP Earthquake Monitor

**Aplicație Windows pentru acces rapid la Sistemul Alerta EWS al Institutului Național de Cercetare-Dezvoltare pentru Fizica Pământului (INFP / INCDFP).**

> **Important:** INFP Earthquake Monitor este o aplicație neoficială, realizată pentru Windows, care oferă acces într-o fereastră dedicată la pagina web publică a Sistemului Alerta EWS. Aplicația nu este un produs oficial al INFP/INCDFP și nu modifică sistemul de alertare al acestora.

---

## Ce este INFP Earthquake Monitor?

INFP Earthquake Monitor este o aplicație Windows care deschide direct pagina oficială a Sistemului Alerta EWS:

**https://alerta.infp.ro/**

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
