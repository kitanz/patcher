<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: `${progress}%` }">
      <span class="progress-text" v-if="progress > 5">{{ progress }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  progress: number
}>()
</script>

<style scoped>
.progress-container {
  width: 100%;
  height: 30px;
  background-color: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  margin: 10px 0;
  border: 1px solid #333;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #388E3C 0%, #4CAF50 100%);
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-text {
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style> 