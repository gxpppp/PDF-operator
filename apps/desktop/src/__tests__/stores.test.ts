import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores/app'
import { usePdfStore } from '@/stores/pdf'
import { useUserStore } from '@/stores/user'
import { useEditorStore } from '@/stores/editor'
import { useSettingsStore } from '@/stores/settings'

describe('App Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default values', () => {
    const store = useAppStore()
    
    expect(store.isLoading).toBe(false)
    expect(store.sidebarCollapsed).toBe(false)
    expect(store.theme).toBe('system')
  })

  it('toggles sidebar', () => {
    const store = useAppStore()
    
    store.toggleSidebar()
    expect(store.sidebarCollapsed).toBe(true)
    
    store.toggleSidebar()
    expect(store.sidebarCollapsed).toBe(false)
  })

  it('sets theme', () => {
    const store = useAppStore()
    
    store.setTheme('dark')
    expect(store.theme).toBe('dark')
    
    store.setTheme('light')
    expect(store.theme).toBe('light')
  })

  it('sets loading state', () => {
    const store = useAppStore()
    
    store.setLoading(true)
    expect(store.isLoading).toBe(true)
    
    store.setLoading(false)
    expect(store.isLoading).toBe(false)
  })
})

describe('PDF Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty state', () => {
    const store = usePdfStore()
    
    expect(store.currentFile).toBeNull()
    expect(store.pageCount).toBe(0)
    expect(store.currentPage).toBe(1)
  })

  it('sets current file', () => {
    const store = usePdfStore()
    
    const file = { path: '/test.pdf', name: 'test.pdf' }
    store.setCurrentFile(file)
    
    expect(store.currentFile).toEqual(file)
  })

  it('sets page count', () => {
    const store = usePdfStore()
    
    store.setPageCount(10)
    expect(store.pageCount).toBe(10)
  })

  it('navigates pages', () => {
    const store = usePdfStore()
    store.setPageCount(10)
    
    store.setCurrentPage(5)
    expect(store.currentPage).toBe(5)
    
    store.nextPage()
    expect(store.currentPage).toBe(6)
    
    store.prevPage()
    expect(store.currentPage).toBe(5)
  })

  it('prevents invalid page navigation', () => {
    const store = usePdfStore()
    store.setPageCount(10)
    
    store.setCurrentPage(1)
    store.prevPage()
    expect(store.currentPage).toBe(1)
    
    store.setCurrentPage(10)
    store.nextPage()
    expect(store.currentPage).toBe(10)
  })
})

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with no user', () => {
    const store = useUserStore()
    
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('sets user', () => {
    const store = useUserStore()
    
    const user = { id: '1', email: 'test@example.com', name: 'Test', role: 'user', createdAt: '' }
    store.setUser(user)
    
    expect(store.user).toEqual(user)
    expect(store.isAuthenticated).toBe(true)
  })

  it('logs out', () => {
    const store = useUserStore()
    
    const user = { id: '1', email: 'test@example.com', name: 'Test', role: 'user', createdAt: '' }
    store.setUser(user)
    store.logout()
    
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})

describe('Editor Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default values', () => {
    const store = useEditorStore()
    
    expect(store.state.mode).toBe('view')
    expect(store.state.tool).toBe('select')
    expect(store.state.zoom).toBe(1)
  })

  it('sets mode', () => {
    const store = useEditorStore()
    
    store.setMode('edit')
    expect(store.state.mode).toBe('edit')
    
    store.setMode('annotate')
    expect(store.state.mode).toBe('annotate')
  })

  it('sets tool', () => {
    const store = useEditorStore()
    
    store.setTool('text')
    expect(store.state.tool).toBe('text')
  })

  it('adjusts zoom', () => {
    const store = useEditorStore()
    
    store.setZoom(1.5)
    expect(store.state.zoom).toBe(1.5)
    
    store.zoomIn(0.1)
    expect(store.state.zoom).toBe(1.6)
    
    store.zoomOut(0.1)
    expect(store.state.zoom).toBe(1.5)
  })

  it('clamps zoom values', () => {
    const store = useEditorStore()
    
    store.setZoom(0)
    expect(store.state.zoom).toBe(0.1)
    
    store.setZoom(10)
    expect(store.state.zoom).toBe(5)
  })
})

describe('Settings Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default settings', () => {
    const store = useSettingsStore()
    
    expect(store.settings.theme).toBe('system')
    expect(store.settings.language).toBe('zh-CN')
    expect(store.settings.autoUpdate).toBe(true)
  })

  it('updates settings', () => {
    const store = useSettingsStore()
    
    store.updateSettings({ theme: 'dark' })
    expect(store.settings.theme).toBe('dark')
    
    store.updateSettings({ language: 'en-US' })
    expect(store.settings.language).toBe('en-US')
  })
})
