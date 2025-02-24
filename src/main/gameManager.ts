import { spawn } from 'child_process'
import path from 'path'

export class GameManager {
  private gamePath: string

  constructor(gamePath: string) {
    this.gamePath = gamePath
  }

  async launchGame(): Promise<void> {
    try {
      const gameProcess = spawn(path.join(this.gamePath, 'Everlast.exe'), [], {
        detached: true,
        stdio: 'ignore'
      })
      
      gameProcess.unref()
    } catch (error) {
      console.error('Failed to launch game:', error)
      throw error
    }
  }
} 