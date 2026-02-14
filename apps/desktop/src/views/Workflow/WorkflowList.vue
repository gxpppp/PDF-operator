<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Workflow {
  id: string
  name: string
  description: string
  steps: number
  lastRun: string
  status: 'active' | 'inactive'
}

const workflows = ref<Workflow[]>([
  { id: '1', name: '合同处理流程', description: '合并、添加水印、加密', steps: 3, lastRun: '2024-01-15', status: 'active' },
  { id: '2', name: '发票归档流程', description: 'OCR识别、提取数据、保存', steps: 4, lastRun: '2024-01-14', status: 'active' },
  { id: '3', name: '报告生成流程', description: '转换格式、压缩、发送', steps: 5, lastRun: '2024-01-10', status: 'inactive' },
])

function createNew() {
  router.push('/workflow/new')
}

function editWorkflow(id: string) {
  router.push(`/workflow/${id}`)
}

function runWorkflow(id: string) {
  alert('运行工作流: ' + id)
}

function deleteWorkflow(id: string) {
  if (confirm('确定要删除这个工作流吗？')) {
    workflows.value = workflows.value.filter(w => w.id !== id)
  }
}
</script>

<template>
  <div class="workflow-list-page">
    <div class="page-header">
      <h1>工作流</h1>
      <button class="btn btn-primary" @click="createNew">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新建工作流
      </button>
    </div>
    
    <div class="workflow-grid">
      <div
        v-for="workflow in workflows"
        :key="workflow.id"
        class="workflow-card"
      >
        <div class="workflow-header">
          <h3>{{ workflow.name }}</h3>
          <span class="workflow-status" :class="workflow.status">
            {{ workflow.status === 'active' ? '启用' : '停用' }}
          </span>
        </div>
        
        <p class="workflow-desc">{{ workflow.description }}</p>
        
        <div class="workflow-meta">
          <span>{{ workflow.steps }} 个步骤</span>
          <span>上次运行: {{ workflow.lastRun }}</span>
        </div>
        
        <div class="workflow-actions">
          <button class="btn btn-primary btn-sm" @click="runWorkflow(workflow.id)">运行</button>
          <button class="btn btn-secondary btn-sm" @click="editWorkflow(workflow.id)">编辑</button>
          <button class="btn btn-danger btn-sm" @click="deleteWorkflow(workflow.id)">删除</button>
        </div>
      </div>
      
      <div class="workflow-card add-new" @click="createNew">
        <div class="add-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <span>创建新工作流</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workflow-list-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.icon {
  width: 18px;
  height: 18px;
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.workflow-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: all 0.2s ease;
}

.workflow-card:hover {
  box-shadow: var(--shadow-md);
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.workflow-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.workflow-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.workflow-status.active {
  background-color: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.workflow-status.inactive {
  background-color: var(--bg-tertiary);
  color: var(--text-tertiary);
}

.workflow-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.workflow-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

.workflow-actions {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.add-new {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: 2px dashed var(--border-color);
  cursor: pointer;
}

.add-new:hover {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.02);
}

.add-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary);
  border-radius: 50%;
  margin-bottom: 12px;
}

.add-icon svg {
  width: 24px;
  height: 24px;
  color: var(--text-tertiary);
}

.add-new span {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
