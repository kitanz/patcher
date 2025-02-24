<template>
  <div class="launcher">
    <div class="news-section">
      <h1>News</h1>
      <div class="news-grid">
        <div class="news-card" v-for="(item, index) in newsItems" :key="index">
          <h3>{{ item.title }}</h3>
          <p>{{ item.content }}</p>
          <span class="date">{{ item.date }}</span>
        </div>
      </div>
    </div>

    <div class="download-section">
      <div class="download-info">
        <span>{{ downloadSpeed }} MB/s</span>
        <span>{{ downloadedSize }} / {{ totalSize }} GB</span>
      </div>
      <Progress :progress="downloadProgress" />
    </div>

    <div class="status-section">
      <div class="server-status">
        Server Status: <span :class="['status-indicator', serverStatus]">{{ serverStatus }}</span>
      </div>
      <div class="patch-version">
        Patch Version: {{ currentVersion }}
      </div>
      <button 
        class="play-button" 
        :class="{ 'update-available': needsUpdate }"
        @click="handlePlayButton"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Progress from './Progress.vue'

const downloadProgress = ref(0)
const serverStatus = ref('{serverStatus}')
const currentVersion = ref('{currentVersion}')
const downloadSpeed = ref('{downloadSpeed}')
const downloadedSize = ref('{downloadedSize}')
const totalSize = ref('{totalSize}')
const needsUpdate = ref<boolean>(false)

const buttonText = computed(() => {
  if (downloadProgress.value > 0 && downloadProgress.value < 100) {
    return 'DOWNLOADING...'
  }
  return needsUpdate.value ? 'UPDATE' : 'PLAY'
})

const handlePlayButton = () => {
  if (needsUpdate.value) {
    // Start update process
    downloadProgress.value = 1
    // Simulate download progress
    const interval = setInterval(() => {
      if (downloadProgress.value < 100) {
        downloadProgress.value += 1
      } else {
        clearInterval(interval)
        needsUpdate.value = false
      }
    }, 50)
  } else {
    // Launch game
    console.log('Launching game...')
  }
}

const newsItems = ref([
  {
    title: 'Update 6.5',
    content: 'New features and improvements',
    date: '31.08.2022'
  },
  {
    title: 'Server Maintenance',
    content: 'Technical restart scheduled',
    date: '31.08.2022'
  },
  {
    title: 'Bug Fixes',
    content: 'Various bug fixes and improvements',
    date: '30.08.2022'
  },
  {
    title: 'Event Update',
    content: 'New seasonal event starting soon',
    date: '30.08.2022'
  }
])
</script>

<style scoped>
.launcher {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
  height: calc(100vh - 250px); /* Account for header and nav */
  overflow: hidden;
}

.news-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0; /* Important for flex overflow */
}

h1 {
  font-size: 28px;
  color: #4CAF50;
  margin: 0;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  overflow-y: auto;
  flex: 1;
  padding-right: 10px;
}

.news-card {
  background-color: rgba(42, 42, 42, 0.5);
  padding: 20px;
  border-radius: 8px;
  position: relative;
  height: 150px;
  display: flex;
  flex-direction: column;
}

.news-card h3 {
  color: #4CAF50;
  margin-bottom: 10px;
}

.news-card .date {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 12px;
  color: #888;
}

.download-section {
  padding: 20px 0;
}

.download-info {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #888;
}

.status-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: rgba(42, 42, 42, 0.5);
  border-radius: 8px;
  margin-bottom: 20px;
}

.status-indicator {
  font-weight: bold;
}

.status-indicator.online {
  color: #4CAF50;
}

.status-indicator.offline {
  color: #f44336;
}

.play-button {
  background: linear-gradient(45deg, #388E3C, #4CAF50);
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.play-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  background: linear-gradient(45deg, #43A047, #66BB6A);
}

.play-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.play-button.update-available {
  background: linear-gradient(45deg, #FFA000, #FFC107);
}

.play-button.update-available:hover {
  background: linear-gradient(45deg, #FFB300, #FFD54F);
}
</style> 