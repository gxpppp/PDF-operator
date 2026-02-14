<script setup lang="ts">
import { ref } from 'vue'

interface WorkflowStep {
  id: string
  type: string
  name: string
  config: Record<string, any>
}

const workflowName = ref('新工作流')
const steps = ref<WorkflowStep[]>([])
const selectedStep = ref<string | null>(null)

const availableSteps = [
  { type: 'merge', name: '合并PDF', icon: '🔗' },
  { type: 'split', name: '拆分PDF', icon: '✂️' },
  { type: 'convert', name: '格式转换', icon: '🔄' },
  { type: 'compress', name: '压缩PDF', icon: '📦' },
  { type: 'watermark', name: '添加水印', icon: '💧' },
  { type: 'encrypt', name: '加密PDF', icon: '🔒' },
  { type: 'decrypt', name: '解密PDF', icon: '🔓' },
  { type: 'ocr', name: 'OCR识别', icon: '👁️' },
  { type: 'extract', name: '内容提取', icon: '📤' },
  { type: 'rename', name: '重命名', icon: '✏️' },
  { type: 'move', name: '移动文件', icon: '📁' },
  { type: 'email', name: '发送邮件', icon: '📧' },
]

function addStep(type: string) {
  const stepDef = availableSteps.find(s => s.type === type)
  if (stepDef) {
    steps.value.push({
      id: Date.now().toString(),
      type,
      name: stepDef.name,
      config: {},
    })
  }
}

function removeStep(id: string) {
  steps.value = steps.value.filter(s => s.id !== id)
}

function moveStepUp(index: number) {
  if (index > 0) {
    const temp = steps.value[index]
    steps.value[index] = steps.value[index - 1]
    steps.value[index - 1] = temp
  }
}

function moveStepDown(index: number) {
  if (index < steps.value.length - 1) {
    const temp = steps.value[index]
    steps.value[index] = steps.value[index + 1]
    steps.value[index + 1] = temp
  }
}

function saveWorkflow() {
  alert('工作流已保存')
}
</script>

<template>
  <div class="workflow-editor">
    <div class="editor-header">
      <div class="header-left">
        <input type="text" v-model="workflowName" class="workflow-name-input" />
      </div>
      <div class="header-right">
        <button class="btn btn-secondary">测试运行</button>
        <button class="btn btn-primary" @click="saveWorkflow">保存</button>
      </div>
    </div>
    
    <div class="editor-content">
      <div class="steps-panel">
        <h3>可用步骤</h3>
        <div class="available-steps">
          <button
            v-for="step in availableSteps"
            :key="step.type"
            class="step-button"
            @click="addStep(step.type)"
          >
            <span class="step-icon">{{ step.icon }}</span>
            <span class="step-name">{{ step.name }}</span>
          </button>
        </div>
      </div>
      
      <div class="workflow-canvas">
        <h3>工作流步骤</h3>
        <div class="steps-list" v-if="steps.length > 0">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="workflow-step"
            :class="{ selected: selectedStep === step.id }"
            @click="selectedStep = step.id"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-info">
              <span class="step-title">{{ step.name }}</span>
            </div>
            <div class="step-controls">
              <button class="btn-icon" @click.stop="moveStepUp(index)" :disabled="index === 0">↑</button>
              <button class="btn-icon" @click.stop="moveStepDown(index)" :disabled="index === steps.length - 1">↓</button>
              <button class="btn-icon danger" @click.stop="removeStep(step.id)">×</button>
            </div>
          </div>
        </div>
        <div class="empty-canvas" v-else>
          <p>从左侧拖拽或点击添加步骤</p>
        </div>
      </div>
      
      <div class="config-panel">
        <h3>步骤配置</h3>
        <div v-if="selectedStep" class="config-content">
          <p>配置选中的步骤...</p>
        </div>
        <div v-else class="empty-config">
          <p>选择一个步骤进行配置</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workflow-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.header-right {
  display: flex;
  gap: 12px;
}

.workflow-name-input {
  font-size: 18px;
  font-weight: 600;
  border: none;
  background: none;
  color: var(--text-primary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.workflow-name-input:focus {
  outline: none;
  background-color: var(--bg-tertiary);
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.steps-panel,
.config-panel {
  width: 250px;
  padding: 16px;
  background-color: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  overflow: auto;
}

.config-panel {
  border-right: none;
  border-left: 1px solid var(--border-color);
}

.steps-panel h3,
.config-panel h3,
.workflow-canvas h3 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.available-steps {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.step-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.step-button:hover {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.step-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.step-name {
  font-size: 11px;
  color: var(--text-secondary);
}

.workflow-canvas {
  flex: 1;
  padding: 16px;
  overflow: auto;
  background-color: var(--bg-secondary);
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.workflow-step {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.workflow-step:hover {
  border-color: var(--primary-color);
}

.workflow-step.selected {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.step-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  margin-right: 12px;
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.step-controls {
  display: flex;
  gap: 4px;
}

.btn-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
}

.btn-icon:hover {
  background-color: var(--bg-tertiary);
}

.btn-icon.danger:hover {
  color: var(--danger-color);
}

.empty-canvas,
.empty-config {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-tertiary);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
}
</style>
