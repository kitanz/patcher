<template>
  <div class="app-container">
    <Terms v-if="!termsAccepted" @accepted="handleTermsAccepted" />
    <template v-else>
      <div class="bg-pattern">
        <div class="content">
          <div class="window-controls">
            <button class="control-button minimize" @click="minimizeWindow">─</button>
            <button class="control-button close" @click="closeWindow">×</button>
          </div>
          <nav class="header-nav">
            <a href="#" class="nav-link">Website</a>
            <a href="#" class="nav-link">Forum</a>
            <a href="#" class="nav-link">Discord</a>
            <button @click="openSettings" class="nav-link settings-button">
              Settings
            </button>
          </nav>
          <header class="header">
            <div class="header-center">
              <img src="@/assets/logo.png" alt="Everlast" class="logo" />
            </div>
          </header>
          <Launcher />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ipcRenderer } from 'electron'
import Launcher from './components/Launcher.vue'
import Terms from './components/Terms.vue'
import Store from 'electron-store'

const store = new Store()
const CURRENT_TERMS_VERSION = '1.0'
const termsAccepted = ref(
  store.get('termsAccepted') && 
  store.get('termsVersion') === CURRENT_TERMS_VERSION
)

const handleTermsAccepted = () => {
  store.set('termsAccepted', true)
  store.set('termsVersion', CURRENT_TERMS_VERSION)
  termsAccepted.value = true
}

const minimizeWindow = () => {
  ipcRenderer.send('minimize-window')
}

const closeWindow = () => {
  ipcRenderer.send('close-window')
}

const openSettings = () => {
  ipcRenderer.send('open-settings')
}
</script>

<style>
 .app-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  border-radius: 15px;
  overflow: hidden;
  background: transparent;
} 

 .bg-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/BG_PATTERN.png');
  background-repeat: repeat;
  background-size: auto;
  opacity: 0.8;
} 

.content {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: rgba(26, 26, 26, 0.95);
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
} 

.window-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  -webkit-app-region: no-drag;
  z-index: 1000;
}

.control-button {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s;
}

.control-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.control-button.close:hover {
  background-color: #ff4444;
}

.header-nav {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px 0;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
  font-weight: 500;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.header {
  margin-bottom: 30px;
}

.header-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  height: 120px;
  width: auto;
}

.settings-button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
}

.settings-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style> 