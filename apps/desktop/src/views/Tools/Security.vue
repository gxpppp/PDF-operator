<script setup lang="ts">
import { ref } from 'vue'
import { open, save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

const inputPath = ref('')
const inputName = ref('')
const mode = ref<'encrypt' | 'decrypt'>('encrypt')
const userPassword = ref('')
const ownerPassword = ref('')
const permissions = ref({
  print: true,
  copy: false,
  modify: false,
  annotate: true,
})
const isProcessing = ref(false)

async function selectFile() {
  const selected = await open({
    multiple: false,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  })
  
  if (selected) {
    inputPath.value = selected as string
    inputName.value = inputPath.value.split(/[/\\]/).pop() || ''
  }
}

async function process() {
  if (!inputPath.value) {
    alert('请选择PDF文件')
    return
  }
  
  if (mode.value === 'encrypt' && !userPassword.value) {
    alert('请输入密码')
    return
  }
  
  const outputPath = await save({
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
    defaultPath: inputName.value.replace('.pdf', mode.value === 'encrypt' ? '_encrypted.pdf' : '_decrypted.pdf'),
  })
  
  if (!outputPath) return
  
  isProcessing.value = true
  
  try {
    if (mode.value === 'encrypt') {
      await invoke('encrypt_pdf', {
        inputPath: inputPath.value,
        outputPath,
        userPassword: userPassword.value,
        ownerPassword: ownerPassword.value || userPassword.value,
        permissions: permissions.value,
      })
    } else {
      await invoke('decrypt_pdf', {
        inputPath: inputPath.value,
        outputPath,
        password: userPassword.value,
      })
    }
    alert(mode.value === 'encrypt' ? '加密成功！' : '解密成功！')
  } catch (error) {
    console.error('Security operation failed:', error)
    alert('操作失败：' + error)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="security-tool">
    <div class="tool-header">
      <h1>安全设置</h1>
      <p>加密或解密PDF文件，设置访问权限</p>
    </div>
    
    <div class="tool-content">
      <div class="file-select">
        <button class="btn btn-primary" @click="selectFile">
          选择PDF文件
        </button>
        <span v-if="inputName" class="selected-file">{{ inputName }}</span>
      </div>
      
      <div class="mode-section">
        <label class="mode-option" :class="{ active: mode === 'encrypt' }">
          <input type="radio" v-model="mode" value="encrypt" />
          <span class="mode-title">加密PDF</span>
          <span class="mode-desc">添加密码保护，限制访问权限</span>
        </label>
        <label class="mode-option" :class="{ active: mode === 'decrypt' }">
          <input type="radio" v-model="mode" value="decrypt" />
          <span class="mode-title">解密PDF</span>
          <span class="mode-desc">移除密码保护</span>
        </label>
      </div>
      
      <div class="password-section">
        <div class="option-group">
          <label>{{ mode === 'encrypt' ? '打开密码' : '输入密码' }}</label>
          <input
            type="password"
            v-model="userPassword"
            class="input"
            :placeholder="mode === 'encrypt' ? '设置打开PDF需要的密码' : '输入PDF密码'"
          />
        </div>
        
        <div v-if="mode === 'encrypt'" class="option-group">
          <label>权限密码（可选）</label>
          <input
            type="password"
            v-model="ownerPassword"
            class="input"
            placeholder="设置修改权限需要的密码"
          />
        </div>
      </div>
      
      <div v-if="mode === 'encrypt'" class="permissions-section">
        <h3>访问权限</h3>
        <div class="permission-options">
          <label class="permission-option">
            <input type="checkbox" v-model="permissions.print" />
            <span>允许打印</span>
          </label>
          <label class="permission-option">
            <input type="checkbox" v-model="permissions.copy" />
            <span>允许复制文本</span>
          </label>
          <label class="permission-option">
            <input type="checkbox" v-model="permissions.modify" />
            <span>允许修改</span>
          </label>
          <label class="permission-option">
            <input type="checkbox" v-model="permissions.annotate" />
            <span>允许注释</span>
          </label>
        </div>
      </div>
      
      <div class="actions-section">
        <button
          class="btn btn-primary btn-lg"
          @click="process"
          :disabled="!inputPath || isProcessing"
        >
          {{ isProcessing ? '处理中...' : (mode === 'encrypt' ? '加密文件' : '解密文件') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.security-tool {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 32px;
}

.tool-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.tool-header p {
  color: var(--text-secondary);
}

.file-select {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.selected-file {
  padding: 8px 16px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-primary);
}

.mode-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.mode-option {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-option:hover {
  border-color: var(--primary-color);
}

.mode-option.active {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.mode-option input {
  display: none;
}

.mode-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.mode-desc {
  font-size: 12px;
  color: var(--text-tertiary);
}

.password-section,
.permissions-section {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.option-group {
  margin-bottom: 16px;
}

.option-group:last-child {
  margin-bottom: 0;
}

.option-group label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.permissions-section h3 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.permission-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.permission-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.permission-option span {
  font-size: 14px;
  color: var(--text-primary);
}

.actions-section {
  text-align: center;
}

.btn-lg {
  padding: 12px 32px;
  font-size: 16px;
}
</style>
