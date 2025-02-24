<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2>Settings</h2>
      <button class="close-button" @click="closeWindow">×</button>
    </div>
    <div class="settings-content">
      <div class="setting-item">
        <label>Installation Directory</label>
        <div class="directory-selector">
          <input 
            type="text" 
            :value="installPath" 
            readonly 
            class="directory-input"
          />
          <button @click="selectDirectory" class="browse-button">Browse</button>
        </div>
      </div>
    </div>
    <div class="settings-footer">
      <button @click="saveSettings" class="save-button">Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getCurrentWindow, dialog } from '@electron/remote'
import Store from 'electron-store'

const store = new Store()
const installPath = ref(store.get('installPath') || 'C:/Games/Everlast')

const selectDirectory = async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  
  if (!result.canceled && result.filePaths.length > 0) {
    installPath.value = result.filePaths[0]
  }
}

const saveSettings = () => {
  store.set('installPath', installPath.value)
  closeWindow()
}

const closeWindow = () => {
  getCurrentWindow().close()
}
</script>

<style scoped>
.settings-container {
  background-color: rgba(26, 26, 26, 0.95);
  border-radius: 8px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: white;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.settings-content {
  flex: 1;
  padding: 20px;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  color: #888;
}

.directory-selector {
  display: flex;
  gap: 10px;
}

.directory-input {
  flex: 1;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-family: 'Roboto', sans-serif;
}

.browse-button, .save-button {
  padding: 8px 16px;
  background: linear-gradient(45deg, #388E3C, #4CAF50);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.browse-button:hover, .save-button:hover {
  background: linear-gradient(45deg, #43A047, #66BB6A);
}

.settings-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
}
</style> 