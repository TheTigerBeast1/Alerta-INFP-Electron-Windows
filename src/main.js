const { app, BrowserWindow, Menu, Tray, nativeImage, session } = require("electron");
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

  await maybeHandleFirstLaunch();

});

app.on("window-all-closed", (event) => {
  event.preventDefault();
});

app.on("before-quit", () => {
  isQuitting = true;
});
