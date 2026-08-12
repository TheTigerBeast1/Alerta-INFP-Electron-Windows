const { app, BrowserWindow, BrowserView, Notification, Tray, Menu, nativeImage, ipcMain, shell, session } = require("electron");
const path = require("path");
const fs = require("fs");

const INFP_URL = "https://alerta.infp.ro/";
const POLL_MS = 30_000;

// Identify the application correctly to Windows (notifications, tray, shortcuts).
app.setAppUserModelId("ro.infp.earthquake-monitor");

let mainWindow = null;
let siteWindow = null;
let tray = null;
let pollTimer = null;
let monitoring = false;
let lastEvents = new Set();
let firstSuccessfulPoll = true;

const stateFile = () => path.join(app.getPath("userData"), "state.json");

function loadState() {
  try {
    const data = JSON.parse(fs.readFileSync(stateFile(), "utf8"));
    lastEvents = new Set(Array.isArray(data.seen) ? data.seen : []);
  } catch {
    lastEvents = new Set();
  }
}

function saveState() {
  try {
    fs.mkdirSync(path.dirname(stateFile()), { recursive: true });
    fs.writeFileSync(
      stateFile(),
      JSON.stringify({ seen: [...lastEvents].slice(-100) }, null, 2),
      "utf8"
    );
  } catch (e) {
    console.error("Could not save state:", e);
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 920,
    height: 680,
    minWidth: 760,
    minHeight: 560,
    backgroundColor: "#111217",
    title: "INFP Earthquake Monitor",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  mainWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createSiteWindow() {
  if (siteWindow && !siteWindow.isDestroyed()) {
    siteWindow.show();
    siteWindow.focus();
    return;
  }

  siteWindow = new BrowserWindow({
    width: 1200,
    height: 850,
    minWidth: 900,
    minHeight: 650,
    title: "INFP - Sistem Alerta EWS",
    backgroundColor: "#111217",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      partition: "persist:infp"
    }
  });

  siteWindow.loadURL(INFP_URL);

  siteWindow.on("closed", () => {
    siteWindow = null;
  });
}

async function openPersistentPage() {
  const ses = session.fromPartition("persist:infp");

  if (!siteWindow || siteWindow.isDestroyed()) {
    siteWindow = new BrowserWindow({
      show: false,
      title: "INFP background monitor",
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        partition: "persist:infp"
      }
    });
  }

  await siteWindow.loadURL(INFP_URL);
  return siteWindow;
}

async function scrapeEvents() {
  if (!siteWindow || siteWindow.isDestroyed()) return { status: "no-window", events: [] };

  const url = siteWindow.webContents.getURL();
  if (url.includes("/login.php")) {
    return { status: "captcha", events: [] };
  }

  try {
    const events = await siteWindow.webContents.executeJavaScript(`
      (() => {
        const tables = [...document.querySelectorAll("table")];
        const table = tables.find(t =>
          [...t.querySelectorAll("th")].some(th => /magnitudine/i.test(th.innerText)) &&
          [...t.querySelectorAll("th")].some(th => /adâncime|adancime/i.test(th.innerText))
        );
        if (!table) return [];

        const headers = [...table.querySelectorAll("thead th")].map(x => x.innerText.trim().toLowerCase());
        const rows = [...table.querySelectorAll("tbody tr")];

        return rows.map(tr => {
          const cells = [...tr.querySelectorAll("td")].map(td => td.innerText.trim());
          if (!cells.length) return null;

          const get = (patterns) => {
            const i = headers.findIndex(h => patterns.some(p => h.includes(p)));
            return i >= 0 ? (cells[i] ?? "") : "";
          };

          return {
            date: get(["data eveniment", "data"]),
            magnitude: get(["magnitudine", "magnitude"]),
            lat: get(["lat"]),
            lon: get(["lon"]),
            depth: get(["adâncime", "adancime", "depth"])
          };
        }).filter(Boolean);
      })()
    `);

    return { status: "ok", events };
  } catch (e) {
    console.error("Scrape error:", e);
    return { status: "error", error: e.message, events: [] };
  }
}

function eventId(e) {
  return [e.date, e.magnitude, e.lat, e.lon, e.depth].join("|");
}

function notifyEvent(e) {
  const title = `Cutremur detectat — M ${e.magnitude || "?"}`;
  const body = [
    e.date || "Dată necunoscută",
    e.depth ? `Adâncime: ${e.depth} km` : "",
    e.lat && e.lon ? `Coordonate: ${e.lat}, ${e.lon}` : ""
  ].filter(Boolean).join("\n");

  if (Notification.isSupported()) {
    const notification = new Notification({
      title,
      body,
      silent: false,
      urgency: "critical"
    });

    notification.on("click", () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
      if (siteWindow && !siteWindow.isDestroyed()) {
        siteWindow.show();
        siteWindow.focus();
      } else {
        createSiteWindow();
      }
    });

    notification.show();
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("earthquake", e);
  }
}

async function poll() {
  if (!monitoring) return;

  const result = await scrapeEvents();

  if (result.status === "captcha") {
    monitoring = false;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("status", {
        state: "captcha",
        text: "Sesiunea INFP trebuie verificată din nou."
      });
    }
    createSiteWindow();
    return;
  }

  if (result.status !== "ok" || !result.events.length) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("status", {
        state: "error",
        text: result.error || "Nu am găsit tabelul de evenimente."
      });
    }
    return;
  }

  const current = result.events;
  const ids = current.map(eventId);

  if (firstSuccessfulPoll && lastEvents.size === 0) {
    // Nu trimitem notificări pentru evenimentele existente la prima pornire.
    ids.forEach(id => lastEvents.add(id));
    saveState();
    firstSuccessfulPoll = false;
  } else {
    for (const event of current) {
      const id = eventId(event);
      if (!lastEvents.has(id)) {
        lastEvents.add(id);
        notifyEvent(event);
      }
    }

    // Păstrăm o fereastră rezonabilă de evenimente vechi.
    while (lastEvents.size > 100) {
      lastEvents.delete(lastEvents.values().next().value);
    }
    saveState();
    firstSuccessfulPoll = false;
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("events", current);
    mainWindow.webContents.send("status", {
      state: "online",
      text: `Ultima verificare: ${new Date().toLocaleTimeString("ro-RO")}`
    });
  }
}

async function startMonitoring() {
  if (monitoring) return;

  if (!siteWindow || siteWindow.isDestroyed()) {
    await openPersistentPage();
  }

  // Dacă pagina e încă la login, utilizatorul trebuie să rezolve CAPTCHA.
  const url = siteWindow.webContents.getURL();
  if (url.includes("/login.php")) {
    createSiteWindow();
    monitoring = false;
    return;
  }

  monitoring = true;
  firstSuccessfulPoll = lastEvents.size === 0;
  await poll();

  clearInterval(pollTimer);
  pollTimer = setInterval(poll, POLL_MS);
}

function stopMonitoring() {
  monitoring = false;
  clearInterval(pollTimer);
  pollTimer = null;

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("status", {
      state: "offline",
      text: "Monitorizarea este oprită."
    });
  }
}

function createTray() {
  const trayIconPath = path.join(__dirname, "..", "assets", "tray.ico");
  const trayIcon = nativeImage.createFromPath(trayIconPath);

  if (trayIcon.isEmpty()) {
    console.error("Could not load tray icon:", trayIconPath);
  }

  tray = new Tray(trayIcon);
  tray.setToolTip("INFP Earthquake Monitor");

  const menu = Menu.buildFromTemplate([
    {
      label: "Deschide aplicația",
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: "Verifică acum",
      click: () => poll()
    },
    {
      label: "Deschide INFP",
      click: () => createSiteWindow()
    },
    { type: "separator" },
    {
      label: monitoring ? "Oprește monitorizarea" : "Pornește monitorizarea",
      click: () => monitoring ? stopMonitoring() : startMonitoring()
    },
    {
      label: "Ieșire",
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);
  tray.on("double-click", () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

ipcMain.handle("open-infp", () => {
  createSiteWindow();
});

ipcMain.handle("start-monitoring", async () => {
  await startMonitoring();
  return monitoring;
});

ipcMain.handle("stop-monitoring", () => {
  stopMonitoring();
  return true;
});

ipcMain.handle("get-monitoring", () => monitoring);

ipcMain.handle("set-startup", (_event, enabled) => {
  app.setLoginItemSettings({
    openAtLogin: Boolean(enabled),
    args: ["--hidden"]
  });
  return app.getLoginItemSettings().openAtLogin;
});

app.whenReady().then(async () => {
  loadState();
  createMainWindow();
  createTray();

  // Deschidem automat pagina INFP la prima pornire, pentru CAPTCHA.
  const ses = session.fromPartition("persist:infp");
  const cookies = await ses.cookies.get({ url: "https://alerta.infp.ro/" });

  if (!cookies.length) {
    createSiteWindow();
  } else {
    // Sesiunea poate fi deja validă; încercăm monitorizarea.
    try {
      await openPersistentPage();
      await startMonitoring();
    } catch (e) {
      console.error(e);
    }
  }

  if (process.argv.includes("--hidden")) {
    mainWindow.hide();
  }
});

app.on("window-all-closed", (event) => {
  event.preventDefault();
});

app.on("before-quit", () => {
  app.isQuitting = true;
  clearInterval(pollTimer);
});