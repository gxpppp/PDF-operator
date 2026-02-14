<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

const appStore = useAppStore()
const route = useRoute()

interface NavItem {
  name: string
  path: string
  icon: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { name: '首页', path: '/', icon: 'home' },
  { name: '编辑器', path: '/editor', icon: 'edit' },
  {
    name: '工具',
    path: '/tools',
    icon: 'tools',
    children: [
      { name: '合并PDF', path: '/tools/merge', icon: 'merge' },
      { name: '拆分PDF', path: '/tools/split', icon: 'split' },
      { name: '格式转换', path: '/tools/convert', icon: 'convert' },
      { name: '压缩PDF', path: '/tools/compress', icon: 'compress' },
      { name: 'OCR识别', path: '/tools/ocr', icon: 'ocr' },
      { name: '安全设置', path: '/tools/security', icon: 'security' },
      { name: '添加水印', path: '/tools/watermark', icon: 'watermark' },
      { name: '内容提取', path: '/tools/extract', icon: 'extract' },
      { name: '批量处理', path: '/tools/batch', icon: 'batch' },
    ],
  },
  { name: '工作流', path: '/workflow', icon: 'workflow' },
  { name: '插件', path: '/plugins', icon: 'plugin' },
  { name: '设置', path: '/settings', icon: 'settings' },
]

const props = defineProps<{
  width: number
}>()

const sidebarStyle = computed(() => ({
  width: `${props.width}px`,
}))

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <aside class="sidebar" :style="sidebarStyle">
    <div class="sidebar-header">
      <div class="logo">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
        </svg>
        <span class="logo-text">PDF Master</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <template v-for="item in navItems" :key="item.path">
        <RouterLink
          v-if="!item.children"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </RouterLink>
        
        <div v-else class="nav-group">
          <div class="nav-group-title">
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-text">{{ item.name }}</span>
          </div>
          <RouterLink
            v-for="child in item.children"
            :key="child.path"
            :to="child.path"
            class="nav-item nav-sub-item"
            :class="{ active: isActive(child.path) }"
          >
            <span class="nav-text">{{ child.name }}</span>
          </RouterLink>
        </div>
      </template>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  overflow: hidden;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: var(--primary-color);
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.nav-item.active {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

.nav-group {
  margin-bottom: 4px;
}

.nav-group-title {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: var(--text-primary);
  font-weight: 500;
}

.nav-sub-item {
  padding-left: 40px;
  font-size: 13px;
}

.nav-icon {
  font-size: 16px;
}
</style>
