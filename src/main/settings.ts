import { BrowserWindow } from 'electron'
import path from 'path'

let settingsWindow: BrowserWindow | null = null

export const createSettingsWindow = () => {
  if (settingsWindow) {
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    parent: BrowserWindow.getFocusedWindow() || undefined,
    modal: true,
    show: false
  })

  settingsWindow.loadFile(path.join(__dirname, '../../settings.html'))

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })

  settingsWindow.webContents.on('did-finish-load', () => {
    settingsWindow?.show()
  })
}