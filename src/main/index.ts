import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { initialize } from '@electron/remote/main'

initialize()

const isDev = process.env.NODE_ENV === 'development'
let settingsWindow: BrowserWindow | null = null
let mainWindow: BrowserWindow | null = null

function createWindow() {
  // Prevent multiple windows
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
    return
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    transparent: false,
    resizable: false,
    backgroundColor: '#00000000'
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadFile(join(__dirname, '../index.html'))
  }

  require('@electron/remote/main').enable(mainWindow.webContents)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    transparent: false,
    resizable: false,
    backgroundColor: '#00000000'
  })

  if (isDev) {
    settingsWindow.loadURL('http://localhost:3000/settings.html')
  } else {
    settingsWindow.loadFile(join(__dirname, '../settings.html'))
  }

  require('@electron/remote/main').enable(settingsWindow.webContents)

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Handle settings window creation
ipcMain.on('open-settings', () => {
  createSettingsWindow()
}) 