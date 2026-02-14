<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './Sidebar/Sidebar.vue'
import Header from './Header.vue'
import StatusBar from './StatusBar/StatusBar.vue'

const sidebarWidth = ref(240)
</script>

<template>
  <div class="app-layout">
    <Sidebar :width="sidebarWidth" />
    <div class="main-container">
      <Header />
      <main class="content">
        <slot />
      </main>
      <StatusBar />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content {
  flex: 1;
  overflow: auto;
  background-color: var(--bg-secondary);
}
</style>
