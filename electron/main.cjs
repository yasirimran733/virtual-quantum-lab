const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  globalShortcut,
  dialog,
  ipcMain,
  shell,
} = require("electron");
const path = require("path");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require("electron-squirrel-startup")) {
//   app.quit();
// }

let mainWindow;
let splashWindow;
let tray = null;
const isDev = !app.isPackaged;

// Auto-updater configuration
autoUpdater.autoDownload = false;
autoUpdater.on("update-available", () => {
  dialog
    .showMessageBox(mainWindow, {
      type: "info",
      title: "Update Available",
      message:
        "A new version of Virtual Quantum Lab is available. Do you want to download it now?",
      buttons: ["Yes", "No"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox(mainWindow, {
      type: "info",
      title: "Update Ready",
      message: "Install and restart now?",
      buttons: ["Yes", "Later"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
});

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const splashHtml = `
    <!DOCTYPE html>
    <html>
      <body style="background: transparent; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; overflow: hidden;">
        <div style="background: #0f172a; padding: 40px; border-radius: 20px; text-align: center; color: white; font-family: sans-serif; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid #334155;">
          <div style="font-size: 60px; margin-bottom: 20px;">⚛️</div>
          <h1 style="margin: 0; font-size: 24px; background: linear-gradient(to right, #a855f7, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Virtual Quantum Lab</h1>
          <p style="color: #94a3b8; margin-top: 10px;">Initializing Quantum Core...</p>
        </div>
      </body>
    </html>
  `;

  splashWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(splashHtml)}`
  );
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Virtual Quantum Lab",
    icon: path.join(__dirname, "../public/favicon.svg"),
    frame: false, // Custom title bar
    show: false, // Hide initially until loaded
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow.show();
  });

  // Handle window close (minimize to tray)
  mainWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, "../public/favicon.svg");
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => mainWindow.show(),
    },
    {
      label: "Exit",
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Virtual Quantum Lab");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    mainWindow.show();
  });
}

// Export functionality
async function exportCurrentScreen() {
  if (!mainWindow) return;

  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Export Simulation",
      defaultPath: path.join(
        app.getPath("documents"),
        `quantum-lab-export-${Date.now()}.png`
      ),
      filters: [
        { name: "Images", extensions: ["png"] },
        { name: "PDF", extensions: ["pdf"] },
      ],
    });

    if (result.canceled) return;

    const filePath = result.filePath;

    if (filePath.endsWith(".pdf")) {
      const data = await mainWindow.webContents.printToPDF({});
      fs.writeFileSync(filePath, data);
    } else {
      // Default to PNG
      const image = await mainWindow.webContents.capturePage();
      fs.writeFileSync(filePath, image.toPNG());
    }

    // Optional: Notify user via renderer
    mainWindow.webContents.send("export-success", filePath);
  } catch (err) {
    console.error("Export failed:", err);
  }
}

app.whenReady().then(() => {
  createSplashWindow();
  createWindow();
  createTray();

  // Register Global Shortcuts
  globalShortcut.register("CommandOrControl+S", () => {
    exportCurrentScreen();
  });

  globalShortcut.register("CommandOrControl+F", () => {
    if (mainWindow) {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });

  globalShortcut.register("CommandOrControl+Q", () => {
    app.isQuitting = true;
    app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Check for updates
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // We don't quit here because we have a tray icon
    // app.quit();
  }
});

// --- IPC Handlers ---

// Window Controls
ipcMain.on("app-minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("app-maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on("app-close", () => {
  if (mainWindow) mainWindow.close(); // Triggers the 'close' event handler which minimizes to tray
});

// File System Operations
ipcMain.handle("dialog:saveFile", async (event, { content, filename }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: "Save Quantum Config",
    defaultPath: filename || "experiment.json",
    filters: [
      { name: "JSON Files", extensions: ["json"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (canceled) {
    return { success: false };
  } else {
    try {
      fs.writeFileSync(filePath, content);
      return { success: true, filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});

ipcMain.handle("dialog:openFile", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: "Open Quantum Config",
    properties: ["openFile"],
    filters: [
      { name: "JSON Files", extensions: ["json"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (canceled) {
    return { canceled: true };
  } else {
    try {
      const content = fs.readFileSync(filePaths[0], "utf-8");
      return { canceled: false, content, filePath: filePaths[0] };
    } catch (error) {
      return { canceled: false, error: error.message };
    }
  }
});
