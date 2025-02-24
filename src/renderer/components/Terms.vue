<template>
  <div class="terms-container">
    <div class="terms-content">
      <h2>Terms and Conditions</h2>
      <div class="terms-scroll">
        <p>Please read these terms and conditions carefully before using the application.</p>
        <!-- Add your terms content here -->
        <p>By clicking "I Agree", you acknowledge that you have read and agree to these terms.</p>
      </div>
      <div class="terms-buttons">
        <button @click="decline" class="decline-btn">Decline</button>
        <button @click="accept" class="accept-btn">I Agree</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['accepted'])

const accept = () => {
  emit('accepted')
}

const decline = () => {
  window.close()
}
</script>

<style scoped>
.terms-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(26, 26, 26, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.terms-content {
  background-color: #2a2a2a;
  border-radius: 15px;
  padding: 30px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.terms-scroll {
  overflow-y: auto;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  max-height: 400px;
}

h2 {
  color: #4CAF50;
  text-align: center;
}

.terms-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.accept-btn {
  background-color: #4CAF50;
  color: white;
}

.accept-btn:hover {
  background-color: #45a049;
}

.decline-btn {
  background-color: #f44336;
  color: white;
}

.decline-btn:hover {
  background-color: #da190b;
}
</style> 