import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { createWriteStream } from 'fs'
import StreamZip from 'node-stream-zip'
import Store from 'electron-store'

interface VersionInfo {
  gameVersion: string
  launcherVersion: string
  serverStatus: string
  patchNotes: Array<{
    title: string
    content: string
    date: string
  }>
  downloadUrl: string
  totalSize: string
  requiredFiles: Array<{
    path: string
    version: string
    checksum: string
  }>
}

interface GameFiles {
  required: string[]
  folders: string[]
}

const GAME_FILES: GameFiles = {
  required: [
    'Everlast.exe',
    'UnityCrashHandler64.exe',
    'UnityPlayer.dll',
    'version.txt'
  ],
  folders: [
    'D3D12',
    'Everlast_Data',
    'MonoBleedingEdge'
  ]
}

export class PatchManager {
  private readonly VERSION_URL = 'localhost:80/launcher/version.json'
  private readonly store: Store
  private versionInfo: VersionInfo | null = null

  constructor() {
    this.store = new Store()
  }

  private get gamePath(): string {
    return this.store.get('installPath', 'C:/Games/Everlast') as string
  }

  async fetchVersionInfo(): Promise<VersionInfo> {
    try {
      const response = await axios.get<VersionInfo>(this.VERSION_URL)
      this.versionInfo = response.data
      return response.data
    } catch (error) {
      console.error('Failed to fetch version info:', error)
      throw error
    }
  }

  private validateGameFiles(): boolean {
    try {
      // Check required files
      for (const file of GAME_FILES.required) {
        if (!fs.existsSync(path.join(this.gamePath, file))) {
          console.log(`Missing required file: ${file}`)
          return false
        }
      }

      // Check required folders
      for (const folder of GAME_FILES.folders) {
        if (!fs.existsSync(path.join(this.gamePath, folder))) {
          console.log(`Missing required folder: ${folder}`)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error validating game files:', error)
      return false
    }
  }

  async downloadPatch(onProgress: (progress: number) => void): Promise<void> {
    if (!this.versionInfo) {
      throw new Error('Version info not fetched')
    }

    try {
      // Create game directory if it doesn't exist
      if (!fs.existsSync(this.gamePath)) {
        fs.mkdirSync(this.gamePath, { recursive: true })
      }

      const tempFile = path.join(this.gamePath, 'temp.rar')
      const writer = createWriteStream(tempFile)

      const response = await axios({
        url: this.versionInfo.downloadUrl,
        method: 'GET',
        responseType: 'stream',
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded))
          onProgress(progress)
        }
      })

      response.data.pipe(writer)

      await new Promise<void>((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })

      // Extract the RAR file
      await this.extractPatch(tempFile)

      // Clean up temp file
      fs.unlinkSync(tempFile)

      // Validate the extracted files
      if (!this.validateGameFiles()) {
        throw new Error('Game files validation failed after patch')
      }

      // Update local version
      fs.writeFileSync(
        path.join(this.gamePath, 'version.txt'),
        this.versionInfo.gameVersion
      )
    } catch (error) {
      console.error('Failed to download/extract patch:', error)
      throw error
    }
  }

  private getLocalVersion(): string {
    try {
      const versionPath = path.join(this.gamePath, 'version.txt')
      if (fs.existsSync(versionPath)) {
        return fs.readFileSync(versionPath, 'utf8').trim()
      }
      return '0.0.0'
    } catch (error) {
      console.error('Failed to read local version:', error)
      return '0.0.0'
    }
  }

  private async extractPatch(rarFile: string): Promise<void> {
    const zip = new StreamZip.async({ file: rarFile })
    await zip.extract(null, this.gamePath)
    await zip.close()
  }

  async checkForUpdates(): Promise<boolean> {
    try {
      const versionInfo = await this.fetchVersionInfo()
      const localVersion = this.getLocalVersion()
      return versionInfo.gameVersion !== localVersion
    } catch (error) {
      console.error('Failed to check for updates:', error)
      return false
    }
  }

  getServerStatus(): string {
    return this.versionInfo?.serverStatus || 'offline'
  }

  getPatchNotes() {
    return this.versionInfo?.patchNotes || []
  }
} 