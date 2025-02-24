import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path, { join } from 'node:path'
import Store from 'electron-store'

// Initialize electron store
const store = new Store()

// Get __dirname equivalent in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let mainWindow: BrowserWindow | null = null

// Add electron-store IPC handlers
ipcMain.on('electron-store-get-data', (event, val) => {
  event.returnValue = store.get(val)
})

ipcMain.on('electron-store-set-data', (event, key, val) => {
  store.set(key, val)
  event.returnValue = true
})

ipcMain.on('electron-store-delete-data', (event, key) => {
  store.delete(key)
  event.returnValue = true
})

function createWindow() {
  // Prevent multiple windows
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
    return
  }

  mainWindow = new BrowserWindow({
    width: 1395,          // Window width
    height: 838,          // Window height
    resizable: false,     // Whether window can be resized
    center: true,         // Center window on screen
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      zoomFactor: 1    // Ensure no zoom is applied
    },
    frame: false,
    transparent: false,
    backgroundColor: '#00000000',
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    autoHideMenuBar: true,
    show: true
  })

  // Set a consistent zoom level
  mainWindow.webContents.setZoomFactor(1.0)

  // Remove the menu bar completely
  mainWindow.removeMenu()

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // Show window when ready to prevent flashing
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle IPC messages
  ipcMain.on('minimize-window', () => {
    mainWindow?.minimize()
  })

  ipcMain.on('close-window', () => {
    mainWindow?.close()
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

// Handle settings window
ipcMain.on('open-settings', () => {
  // Your settings window creation logic here
})
