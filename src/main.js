const { app, BrowserWindow, Menu, Tray, nativeImage, session, shell } = require("electron");
const path = require("path");

const INFP_URL = "https://alerta.infp.ro/";
const PARTITION = "persist:infp";
const APP_ID = "ro.infp.earthquake-monitor";

app.setAppUserModelId(APP_ID);

let mainWindow = null;
let tray = null;
let isQuitting = false;

function iconPath(name) {
  return path.join(__dirname, "..", "assets", name);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 900,
    minHeight: 650,
    title: "INFP - Sistem Alerta EWS",
    backgroundColor: "#111217",
    icon: iconPath("icon.ico"),
    show: !process.argv.includes("--hidden"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      partition: PARTITION
    }
  });

  mainWindow.loadURL(INFP_URL);

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow();
    return;
  }

  mainWindow.show();
  mainWindow.focus();
}


function showAbout() {
  const aboutWindow = new BrowserWindow({
    width: 460,
    height: 500,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    title: "Despre INFP Earthquake Monitor",
    icon: iconPath("icon.ico"),
    parent: mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined,
    modal: Boolean(mainWindow && !mainWindow.isDestroyed()),
    backgroundColor: "#ffffff",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  const logo = "file://" + iconPath("icon.ico").replace(/\\/g, "/");
  const html = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<title>Despre INFP Earthquake Monitor</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 34px 32px 28px;
    font-family: "Segoe UI", Arial, sans-serif;
    text-align: center;
    color: #202124;
    background: #fff;
  }
  img { width: 108px; height: 108px; object-fit: contain; margin-bottom: 12px; }
  h1 { font-size: 22px; margin: 0 0 5px; font-weight: 600; }
  .version { color: #666; font-size: 13px; margin-bottom: 22px; }
  p { font-size: 13px; line-height: 1.5; margin: 9px 0; }
  .source { margin-top: 18px; }
  .copyright { margin-top: 22px; font-size: 12px; color: #666; }
  button {
    margin-top: 22px;
    min-width: 90px;
    padding: 7px 20px;
    font: inherit;
    border: 1px solid #aaa;
    border-radius: 4px;
    background: #f4f4f4;
    cursor: pointer;
  }
  button:hover { background: #e8e8e8; }
</style>
</head>
<body>
  <img src="${logo}" alt="INFP">
  <h1>INFP Earthquake Monitor</h1>
  <div class="version">Versiunea ${app.getVersion()}</div>
  <p>Aplicație Windows pentru accesarea Sistemului Alerta EWS al Institutului Național de Cercetare-Dezvoltare pentru Fizica Pământului (INFP/INCDFP).</p>
  <p>Aplicație neoficială, destinată facilitării accesului la serviciul public Alerta EWS.</p>
  <p class="source"><strong>Sistem Alerta EWS:</strong><br>alerta.infp.ro</p>
  <div class="copyright">© TheTigerBeast, 2026</div>
  <button onclick="window.close()">Închide</button>
</body>
</html>`;

  aboutWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(iconPath("tray.ico"));

  if (trayIcon.isEmpty()) {
    console.error("Could not load tray icon:", iconPath("tray.ico"));
  }

  tray = new Tray(trayIcon);
  tray.setToolTip("INFP Earthquake Monitor");

  const menu = Menu.buildFromTemplate([
    {
      label: "Deschide INFP",
      click: showMainWindow
    },
    { type: "separator" },
    {
      label: "Ieșire",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);
  tray.on("double-click", showMainWindow);
  tray.on("click", showMainWindow);
}

function buildApplicationMenu() {
  const template = [
    {
      label: "Fișier",
      submenu: [
        {
          label: "Reîncarcă pagina",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.reload();
          }
        },
        { type: "separator" },
        {
          label: "Ieșire",
          accelerator: "Alt+F4",
          click: () => {
            isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: "Vizualizare",
      submenu: [
        {
          label: "Mărește",
          accelerator: "CmdOrCtrl+Plus",
          click: () => mainWindow?.webContents.executeJavaScript("document.body.style.zoom = Math.min(3, (parseFloat(document.body.style.zoom)||1)+0.1)")
        },
        {
          label: "Micșorează",
          accelerator: "CmdOrCtrl+-",
          click: () => mainWindow?.webContents.executeJavaScript("document.body.style.zoom = Math.max(0.5, (parseFloat(document.body.style.zoom)||1)-0.1)")
        },
        {
          label: "Dimensiune normală",
          accelerator: "CmdOrCtrl+0",
          click: () => mainWindow?.webContents.executeJavaScript("document.body.style.zoom = 1")
        },
        { type: "separator" },
        {
          label: "Ecran complet",
          accelerator: "F11",
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        }
      ]
    },
    {
      label: "Fereastră",
      submenu: [
        {
          label: "Minimizează",
          accelerator: "CmdOrCtrl+M",
          click: () => mainWindow?.minimize()
        },
        {
          label: "Ascunde în bara de sistem",
          click: () => mainWindow?.hide()
        }
      ]
    },
    {
      label: "Ajutor",
      submenu: [
        {
          label: "Despre INFP Earthquake Monitor",
          click: showAbout
        },
        {
          label: "Deschide site-ul INFP",
          click: () => shell.openExternal("https://www.infp.ro/index.php")
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function configureSitePermissions() {
  const ses = session.fromPartition(PARTITION);

  // The INFP page handles the notification UI itself. Electron only needs
  // to allow the site's Notification API to work inside the application.
  ses.setPermissionRequestHandler((webContents, permission, callback) => {
    let origin = "";
    try {
      origin = new URL(webContents.getURL()).origin;
    } catch {}

    if (permission === "notifications" && origin === new URL(INFP_URL).origin) {
      callback(true);
      return;
    }

    callback(false);
  });

  ses.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
    if (permission !== "notifications") return false;
    return requestingOrigin === new URL(INFP_URL).origin;
  });
}

async function maybeHandleFirstLaunch() {
  const ses = session.fromPartition(PARTITION);
  const cookies = await ses.cookies.get({ url: INFP_URL });

  // Without an existing session, show the page so the user can complete
  // the site's CAPTCHA/permission flow manually.
  if (!cookies.length) {
    showMainWindow();
    return;
  }

  // Existing sessions launched with --hidden stay in the background;
  // the user can open the page at any time from the tray.
}

app.whenReady().then(async () => {
  configureSitePermissions();
  createMainWindow();
  createTray();
  buildApplicationMenu();

  await maybeHandleFirstLaunch();

});

app.on("window-all-closed", (event) => {
  event.preventDefault();
});

app.on("before-quit", () => {
  isQuitting = true;
});
