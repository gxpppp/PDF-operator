declare global {
  interface Window {
    __TAURI__?: {
      invoke: (cmd: string, args?: Record<string, any>) => Promise<any>
    }
    pdfjsLib?: any
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      VITE_API_URL?: string
      VITE_APP_VERSION?: string
    }
  }
}

export interface GlobalComponents {
  Button: typeof import('@/components/common/Button/Button.vue').default
  Input: typeof import('@/components/common/Input/Input.vue').default
  Modal: typeof import('@/components/common/Modal/Modal.vue').default
  Select: typeof import('@/components/common/Select/Select.vue').default
  Checkbox: typeof import('@/components/common/Checkbox/Checkbox.vue').default
  Tabs: typeof import('@/components/common/Tabs/Tabs.vue').default
  Card: typeof import('@/components/common/Card/Card.vue').default
  Alert: typeof import('@/components/common/Alert/Alert.vue').default
  Progress: typeof import('@/components/common/Progress/Progress.vue').default
  Loading: typeof import('@/components/common/Loading/Loading.vue').default
  Tooltip: typeof import('@/components/common/Tooltip/Tooltip.vue').default
  Badge: typeof import('@/components/common/Badge/Badge.vue').default
  Avatar: typeof import('@/components/common/Avatar/Avatar.vue').default
  Skeleton: typeof import('@/components/common/Skeleton/Skeleton.vue').default
  Divider: typeof import('@/components/common/Divider/Divider.vue').default
  Tag: typeof import('@/components/common/Tag/Tag.vue').default
  Switch: typeof import('@/components/common/Switch/Switch.vue').default
  Radio: typeof import('@/components/common/Radio/Radio.vue').default
  Textarea: typeof import('@/components/common/Textarea/Textarea.vue').default
  Breadcrumb: typeof import('@/components/common/Breadcrumb/Breadcrumb.vue').default
  Pagination: typeof import('@/components/common/Pagination/Pagination.vue').default
  Empty: typeof import('@/components/common/Empty/Empty.vue').default
  Dropdown: typeof import('@/components/common/Dropdown/Dropdown.vue').default
  Popover: typeof import('@/components/common/Popover/Popover.vue').default
  Drawer: typeof import('@/components/common/Drawer/Drawer.vue').default
  FileDropZone: typeof import('@/components/common/FileInput/FileDropZone.vue').default
  PdfViewer: typeof import('@/components/pdf/Viewer/PdfViewer.vue').default
  PdfSearchPanel: typeof import('@/components/pdf/Search/PdfSearchPanel.vue').default
  PdfAnnotationPanel: typeof import('@/components/pdf/Annotation/PdfAnnotationPanel.vue').default
  PdfBookmarkPanel: typeof import('@/components/pdf/Bookmark/PdfBookmarkPanel.vue').default
  PdfToolbar: typeof import('@/components/pdf/Toolbar/PdfToolbar.vue').default
  PdfPropertiesPanel: typeof import('@/components/pdf/Properties/PdfPropertiesPanel.vue').default
  ThumbnailPanel: typeof import('@/components/pdf/Thumbnail/ThumbnailPanel.vue').default
  OutlinePanel: typeof import('@/components/pdf/Outline/OutlinePanel.vue').default
  ColorPicker: typeof import('@/components/tools/ColorPicker/ColorPicker.vue').default
  Slider: typeof import('@/components/tools/Slider/Slider.vue').default
  DatePicker: typeof import('@/components/tools/DatePicker/DatePicker.vue').default
  Upload: typeof import('@/components/tools/Upload/Upload.vue').default
  Rate: typeof import('@/components/tools/Rate/Rate.vue').default
  AppLayout: typeof import('@/components/layout/AppLayout.vue').default
  Sidebar: typeof import('@/components/layout/Sidebar/Sidebar.vue').default
  Header: typeof import('@/components/layout/Header.vue').default
  StatusBar: typeof import('@/components/layout/StatusBar/StatusBar.vue').default
  Collapse: typeof import('@/components/layout/Collapse/Collapse.vue').default
  Steps: typeof import('@/components/layout/Steps/Steps.vue').default
  Timeline: typeof import('@/components/layout/Timeline/Timeline.vue').default
  Tree: typeof import('@/components/layout/Tree/Tree.vue').default
  ContextMenu: typeof import('@/components/layout/ContextMenu/ContextMenu.vue').default
}

export {}
