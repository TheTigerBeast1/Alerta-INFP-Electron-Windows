const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("infp", {
  openSite: () => ipcRenderer.invoke("open-infp"),
  start: () => ipcRenderer.invoke("start-monitoring"),
  stop: () => ipcRenderer.invoke("stop-monitoring"),
  getMonitoring: () => ipcRenderer.invoke("get-monitoring"),
  setStartup: (enabled) => ipcRenderer.invoke("set-startup", enabled),
  onStatus: (callback) => ipcRenderer.on("status", (_event, data) => callback(data)),
  onEvents: (callback) => ipcRenderer.on("events", (_event, data) => callback(data)),
  onEarthquake: (callback) => ipcRenderer.on("earthquake", (_event, data) => callback(data))
});
