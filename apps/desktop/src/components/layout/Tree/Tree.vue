<script setup lang="ts">
import { ref, computed } from 'vue'

interface TreeNode {
  key: string
  title: string
  icon?: string
  children?: TreeNode[]
  disabled?: boolean
  selectable?: boolean
}

const props = defineProps<{
  data: TreeNode[]
  selectedKeys?: string[]
  expandedKeys?: string[]
  checkable?: boolean
  selectable?: boolean
}>()

const emit = defineEmits<{
  select: [keys: string[]]
  expand: [keys: string[]]
  check: [keys: string[]]
}>()

const localExpandedKeys = ref<Set<string>>(new Set())
const localSelectedKeys = ref<Set<string>>(new Set())

function isExpanded(key: string): boolean {
  if (props.expandedKeys) {
    return props.expandedKeys.includes(key)
  }
  return localExpandedKeys.value.has(key)
}

function isSelected(key: string): boolean {
  if (props.selectedKeys) {
    return props.selectedKeys.includes(key)
  }
  return localSelectedKeys.value.has(key)
}

function toggleExpand(key: string) {
  if (props.expandedKeys) {
    const keys = [...props.expandedKeys]
    const index = keys.indexOf(key)
    if (index > -1) {
      keys.splice(index, 1)
    } else {
      keys.push(key)
    }
    emit('expand', keys)
  } else {
    if (localExpandedKeys.value.has(key)) {
      localExpandedKeys.value.delete(key)
    } else {
      localExpandedKeys.value.add(key)
    }
  }
}

function selectNode(key: string) {
  if (props.selectedKeys) {
    emit('select', [key])
  } else {
    localSelectedKeys.value.clear()
    localSelectedKeys.value.add(key)
  }
}

function hasChildren(node: TreeNode): boolean {
  return !!(node.children && node.children.length > 0)
}
</script>

<template>
  <div class="tree">
    <div v-for="node in data" :key="node.key">
      <div
        class="tree-node"
        :class="{ selected: isSelected(node.key), disabled: node.disabled }"
        @click="selectNode(node.key)"
      >
        <span
          v-if="hasChildren(node)"
          class="expand-icon"
          @click.stop="toggleExpand(node.key)"
        >
          {{ isExpanded(node.key) ? '▼' : '▶' }}
        </span>
        <span v-else class="expand-placeholder"></span>
        
        <span v-if="node.icon" class="node-icon">{{ node.icon }}</span>
        <span class="node-title">{{ node.title }}</span>
      </div>
      
      <div v-if="hasChildren(node) && isExpanded(node.key)" class="tree-children">
        <Tree
          :data="node.children"
          :selected-keys="selectedKeys"
          :expanded-keys="expandedKeys"
          :checkable="checkable"
          :selectable="selectable"
          @select="(keys) => $emit('select', keys)"
          @expand="(keys) => $emit('expand', keys)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tree {
  font-size: 14px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tree-node:hover {
  background-color: var(--bg-tertiary);
}

.tree-node.selected {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

.tree-node.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.expand-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--text-tertiary);
}

.expand-placeholder {
  width: 16px;
}

.node-icon {
  font-size: 14px;
}

.node-title {
  color: var(--text-primary);
}

.tree-children {
  padding-left: 20px;
}
</style>
