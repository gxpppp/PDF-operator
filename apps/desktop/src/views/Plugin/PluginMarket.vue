<script setup lang="ts">
import { ref } from 'vue'

interface Plugin {
  id: string
  name: string
  description: string
  author: string
  version: string
  downloads: number
  rating: number
  installed: boolean
}

const plugins = ref<Plugin[]>([
  { id: '1', name: 'PDF比较工具', description: '比较两个PDF文件的差异', author: 'PDF Master', version: '1.0.0', downloads: 1500, rating: 4.5, installed: false },
  { id: '2', name: '批量打印', description: '批量打印多个PDF文件', author: 'Community', version: '2.1.0', downloads: 3200, rating: 4.8, installed: true },
  { id: '3', name: 'PDF表单填充', description: '自动填充PDF表单', author: 'PDF Master', version: '1.2.0', downloads: 890, rating: 4.2, installed: false },
  { id: '4', name: '云端同步', description: '将PDF同步到云存储', author: 'Community', version: '3.0.0', downloads: 5600, rating: 4.9, installed: false },
  { id: '5', name: 'PDF转CAD', description: '将PDF转换为CAD格式', author: 'Pro Tools', version: '1.5.0', downloads: 450, rating: 3.8, installed: false },
  { id: '6', name: '电子签名', description: '添加电子签名到PDF', author: 'PDF Master', version: '2.0.0', downloads: 2100, rating: 4.6, installed: true },
])

const searchQuery = ref('')
const category = ref('all')

function installPlugin(id: string) {
  const plugin = plugins.value.find(p => p.id === id)
  if (plugin) {
    plugin.installed = true
    alert(`已安装: ${plugin.name}`)
  }
}

function uninstallPlugin(id: string) {
  const plugin = plugins.value.find(p => p.id === id)
  if (plugin) {
    plugin.installed = false
    alert(`已卸载: ${plugin.name}`)
  }
}

function filteredPlugins() {
  return plugins.value.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}
</script>

<template>
  <div class="plugin-market">
    <div class="market-header">
      <h1>插件市场</h1>
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          class="input"
          placeholder="搜索插件..."
        />
      </div>
    </div>
    
    <div class="market-content">
      <div class="categories">
        <button class="category-btn" :class="{ active: category === 'all' }" @click="category = 'all'">全部</button>
        <button class="category-btn" :class="{ active: category === 'installed' }" @click="category = 'installed'">已安装</button>
        <button class="category-btn" :class="{ active: category === 'popular' }" @click="category = 'popular'">热门</button>
        <button class="category-btn" :class="{ active: category === 'new' }" @click="category = 'new'">最新</button>
      </div>
      
      <div class="plugin-grid">
        <div
          v-for="plugin in filteredPlugins()"
          :key="plugin.id"
          class="plugin-card"
        >
          <div class="plugin-header">
            <div class="plugin-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
            </div>
            <div class="plugin-info">
              <h3>{{ plugin.name }}</h3>
              <span class="plugin-author">{{ plugin.author }}</span>
            </div>
          </div>
          
          <p class="plugin-desc">{{ plugin.description }}</p>
          
          <div class="plugin-meta">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {{ plugin.downloads.toLocaleString() }}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              {{ plugin.rating }}
            </span>
            <span class="meta-item">v{{ plugin.version }}</span>
          </div>
          
          <div class="plugin-actions">
            <button
              v-if="!plugin.installed"
              class="btn btn-primary btn-sm"
              @click="installPlugin(plugin.id)"
            >
              安装
            </button>
            <button
              v-else
              class="btn btn-secondary btn-sm"
              @click="uninstallPlugin(plugin.id)"
            >
              卸载
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plugin-market {
  padding: 24px;
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.market-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.search-box {
  width: 300px;
}

.market-content {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.categories {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.category-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  background-color: var(--bg-tertiary);
}

.category-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.plugin-card {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.plugin-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.plugin-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.plugin-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: var(--radius-md);
  color: var(--primary-color);
}

.plugin-icon svg {
  width: 20px;
  height: 20px;
}

.plugin-info h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.plugin-author {
  font-size: 12px;
  color: var(--text-tertiary);
}

.plugin-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.plugin-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.meta-item svg {
  width: 14px;
  height: 14px;
}

.plugin-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-sm {
  padding: 6px 16px;
  font-size: 13px;
}
</style>
