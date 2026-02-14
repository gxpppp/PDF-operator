import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/views/Editor.vue'),
  },
  {
    path: '/tools/merge',
    name: 'Merge',
    component: () => import('@/views/Tools/Merge.vue'),
  },
  {
    path: '/tools/split',
    name: 'Split',
    component: () => import('@/views/Tools/Split.vue'),
  },
  {
    path: '/tools/convert',
    name: 'Convert',
    component: () => import('@/views/Tools/Convert.vue'),
  },
  {
    path: '/tools/compress',
    name: 'Compress',
    component: () => import('@/views/Tools/Compress.vue'),
  },
  {
    path: '/tools/ocr',
    name: 'OCR',
    component: () => import('@/views/Tools/Ocr.vue'),
  },
  {
    path: '/tools/security',
    name: 'Security',
    component: () => import('@/views/Tools/Security.vue'),
  },
  {
    path: '/tools/watermark',
    name: 'Watermark',
    component: () => import('@/views/Tools/Watermark.vue'),
  },
  {
    path: '/tools/extract',
    name: 'Extract',
    component: () => import('@/views/Tools/Extract.vue'),
  },
  {
    path: '/tools/batch',
    name: 'Batch',
    component: () => import('@/views/Tools/Batch.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/Settings.vue'),
  },
  {
    path: '/workflow',
    name: 'Workflow',
    component: () => import('@/views/Workflow/WorkflowList.vue'),
  },
  {
    path: '/workflow/:id',
    name: 'WorkflowEditor',
    component: () => import('@/views/Workflow/WorkflowEditor.vue'),
  },
  {
    path: '/plugins',
    name: 'Plugins',
    component: () => import('@/views/Plugin/PluginMarket.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
