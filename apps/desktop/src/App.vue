<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
