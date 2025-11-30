const { contextBridge, ipcRenderer } = require("electron");

// Expose a secure bridge to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  quit: () => ipcRenderer.send("app-quit"),
  minimize: () => ipcRenderer.send("app-minimize"),
  maximize: () => ipcRenderer.send("app-maximize"),
  close: () => ipcRenderer.send("app-close"),
  onExportSuccess: (callback) =>
    ipcRenderer.on("export-success", (_event, value) => callback(value)),
  saveFile: (content, filename) =>
    ipcRenderer.invoke("dialog:saveFile", content, filename),
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
});

console.log("Electron secure preload script loaded");
