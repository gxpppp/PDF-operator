<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const activeTab = ref('general')

const settings = ref({
  language: 'zh-CN',
  theme: 'system',
  autoSave: true,
  autoSaveInterval: 5,
  showThumbnails: true,
  defaultZoom: 100,
  recentFilesCount: 10,
  checkUpdates: true,
})

const tabs = [
  { id: 'general', label: '常规' },
  { id: 'appearance', label: '外观' },
  { id: 'shortcuts', label: '快捷键' },
  { id: 'storage', label: '存储' },
  { id: 'ai', label: 'AI设置' },
  { id: 'about', label: '关于' },
]

const shortcuts = [
  { action: '打开文件', keys: 'Ctrl+O' },
  { action: '保存', keys: 'Ctrl+S' },
  { action: '另存为', keys: 'Ctrl+Shift+S' },
  { action: '打印', keys: 'Ctrl+P' },
  { action: '撤销', keys: 'Ctrl+Z' },
  { action: '重做', keys: 'Ctrl+Y' },
  { action: '查找', keys: 'Ctrl+F' },
  { action: '放大', keys: 'Ctrl++' },
  { action: '缩小', keys: 'Ctrl+-' },
  { action: '适应页面', keys: 'Ctrl+0' },
  { action: '上一页', keys: 'PageUp' },
  { action: '下一页', keys: 'PageDown' },
  { action: '首页', keys: 'Home' },
  { action: '末页', keys: 'End' },
]

function saveSettings() {
  appStore.setTheme(settings.value.theme as 'light' | 'dark' | 'system')
  alert('设置已保存')
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-header">
      <h1>设置</h1>
    </div>
    
    <div class="settings-content">
      <div class="settings-sidebar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="settings-main">
        <div v-if="activeTab === 'general'" class="settings-section">
          <h2>常规设置</h2>
          
          <div class="setting-item">
            <label>语言</label>
            <select v-model="settings.language" class="input">
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label>
              <input type="checkbox" v-model="settings.autoSave" />
              自动保存
            </label>
            <span class="setting-hint">每隔 {{ settings.autoSaveInterval }} 分钟自动保存</span>
          </div>
          
          <div class="setting-item">
            <label>自动保存间隔（分钟）</label>
            <input type="number" v-model="settings.autoSaveInterval" class="input" min="1" max="30" />
          </div>
          
          <div class="setting-item">
            <label>
              <input type="checkbox" v-model="settings.showThumbnails" />
              显示缩略图
            </label>
          </div>
          
          <div class="setting-item">
            <label>默认缩放比例</label>
            <select v-model="settings.defaultZoom" class="input">
              <option :value="50">50%</option>
              <option :value="75">75%</option>
              <option :value="100">100%</option>
              <option :value="125">125%</option>
              <option :value="150">150%</option>
              <option :value="200">200%</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label>
              <input type="checkbox" v-model="settings.checkUpdates" />
              自动检查更新
            </label>
          </div>
        </div>
        
        <div v-if="activeTab === 'appearance'" class="settings-section">
          <h2>外观设置</h2>
          
          <div class="setting-item">
            <label>主题</label>
            <div class="theme-options">
              <label class="theme-option" :class="{ active: settings.theme === 'light' }">
                <input type="radio" v-model="settings.theme" value="light" />
                <div class="theme-preview light"></div>
                <span>浅色</span>
              </label>
              <label class="theme-option" :class="{ active: settings.theme === 'dark' }">
                <input type="radio" v-model="settings.theme" value="dark" />
                <div class="theme-preview dark"></div>
                <span>深色</span>
              </label>
              <label class="theme-option" :class="{ active: settings.theme === 'system' }">
                <input type="radio" v-model="settings.theme" value="system" />
                <div class="theme-preview system"></div>
                <span>跟随系统</span>
              </label>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'shortcuts'" class="settings-section">
          <h2>快捷键</h2>
          
          <div class="shortcuts-list">
            <div v-for="shortcut in shortcuts" :key="shortcut.action" class="shortcut-item">
              <span class="shortcut-action">{{ shortcut.action }}</span>
              <span class="shortcut-keys">{{ shortcut.keys }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'storage'" class="settings-section">
          <h2>存储设置</h2>
          
          <div class="setting-item">
            <label>最近文件数量</label>
            <input type="number" v-model="settings.recentFilesCount" class="input" min="1" max="50" />
          </div>
          
          <div class="setting-item">
            <button class="btn btn-secondary">清除缓存</button>
          </div>
          
          <div class="setting-item">
            <button class="btn btn-danger">清除所有数据</button>
          </div>
        </div>
        
        <div v-if="activeTab === 'ai'" class="settings-section">
          <h2>AI设置</h2>
          
          <div class="setting-item">
            <label>AI服务</label>
            <select class="input">
              <option value="openai">OpenAI</option>
              <option value="ollama">Ollama (本地)</option>
              <option value="anthropic">Anthropic Claude</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label>API密钥</label>
            <input type="password" class="input" placeholder="输入API密钥" />
          </div>
          
          <div class="setting-item">
            <label>模型</label>
            <select class="input">
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
        </div>
        
        <div v-if="activeTab === 'about'" class="settings-section">
          <h2>关于</h2>
          
          <div class="about-info">
            <div class="app-logo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
            </div>
            <h3>PDF Master</h3>
            <p class="version">版本 0.1.0</p>
            <p class="description">企业级PDF处理软件</p>
            <p class="copyright">© 2024 PDF Master Team</p>
          </div>
          
          <div class="about-links">
            <a href="#" class="link">官方网站</a>
            <a href="#" class="link">使用文档</a>
            <a href="#" class="link">问题反馈</a>
            <a href="#" class="link">开源许可</a>
          </div>
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-primary" @click="saveSettings">保存设置</button>
          <button class="btn btn-secondary">重置默认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.settings-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.settings-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.settings-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.settings-sidebar {
  width: 200px;
  padding: 16px;
  border-right: 1px solid var(--border-color);
  background-color: var(--bg-primary);
}

.tab-button {
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.tab-button.active {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

.settings-main {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.settings-section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.setting-item {
  margin-bottom: 20px;
}

.setting-item > label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.setting-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-left: 24px;
}

.theme-options {
  display: flex;
  gap: 16px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-option:hover {
  border-color: var(--primary-color);
}

.theme-option.active {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.theme-option input {
  display: none;
}

.theme-preview {
  width: 80px;
  height: 50px;
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
}

.theme-preview.light {
  background: linear-gradient(135deg, #fff 50%, #f5f5f5 50%);
}

.theme-preview.dark {
  background: linear-gradient(135deg, #1e1e1e 50%, #2d2d2d 50%);
}

.theme-preview.system {
  background: linear-gradient(135deg, #fff 50%, #1e1e1e 50%);
}

.shortcuts-list {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.shortcut-item:last-child {
  border-bottom: none;
}

.shortcut-action {
  font-size: 14px;
  color: var(--text-primary);
}

.shortcut-keys {
  font-size: 13px;
  font-family: monospace;
  padding: 2px 8px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.about-info {
  text-align: center;
  padding: 32px;
}

.app-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: var(--primary-color);
}

.app-logo svg {
  width: 100%;
  height: 100%;
}

.about-info h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.version {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.description {
  font-size: 14px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

.copyright {
  font-size: 12px;
  color: var(--text-tertiary);
}

.about-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
}

.link {
  font-size: 14px;
  color: var(--primary-color);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.settings-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}
</style>
