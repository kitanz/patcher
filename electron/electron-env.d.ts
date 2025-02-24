/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
    
    // New definitions
    VITE_APP_NAME: string
    VITE_APP_VERSION: string
    VITE_API_URL: string
    VITE_CDN_URL: string
    VITE_GAME_EXECUTABLE: string
    VITE_DEFAULT_INSTALL_PATH: string
    VITE_UPDATE_SERVER: string
    VITE_UPDATE_CHANNEL: string
    VITE_WEBSITE_URL: string
    VITE_FORUM_URL: string
    VITE_DISCORD_URL: string
    VITE_ENABLE_DEVELOPER_TOOLS: string
    VITE_SKIP_UPDATE_CHECK: string
    VITE_MOCK_SERVER_STATUS: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
}
