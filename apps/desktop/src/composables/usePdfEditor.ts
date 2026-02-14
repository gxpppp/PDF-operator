import { ref, computed, type Ref } from 'vue'
import { pdfApi } from '@/api'

export interface EditOperation {
  type: 'add-text' | 'add-image' | 'add-shape' | 'delete' | 'move' | 'resize' | 'rotate'
  pageNumber: number
  data: any
  timestamp: number
}

export interface TextEdit {
  id: string
  pageNumber: number
  x: number
  y: number
  width: number
  height: number
  content: string
  fontSize: number
  fontFamily: string
  color: string
  rotation: number
}

export interface ImageEdit {
  id: string
  pageNumber: number
  x: number
  y: number
  width: number
  height: number
  imagePath: string
  rotation: number
}

export interface ShapeEdit {
  id: string
  pageNumber: number
  type: 'rectangle' | 'circle' | 'line' | 'arrow'
  x: number
  y: number
  width: number
  height: number
  fillColor: string
  strokeColor: string
  strokeWidth: number
  rotation: number
}

export interface UsePdfEditorOptions {
  inputPath: Ref<string>
  outputPath?: Ref<string>
  autoSave?: boolean
  autoSaveInterval?: number
}

export function usePdfEditor(options: UsePdfEditorOptions) {
  const { inputPath, outputPath, autoSave = false, autoSaveInterval = 60000 } = options

  const operations = ref<EditOperation[]>([])
  const textEdits = ref<TextEdit[]>([])
  const imageEdits = ref<ImageEdit[]>([])
  const shapeEdits = ref<ShapeEdit[]>([])
  const selectedElement = ref<string | null>(null)
  const isDirty = ref(false)
  const isSaving = ref(false)
  const canUndo = computed(() => operations.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)
  const redoStack = ref<EditOperation[]>([])

  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function addOperation(operation: Omit<EditOperation, 'timestamp'>): void {
    operations.value.push({
      ...operation,
      timestamp: Date.now()
    })
    redoStack.value = []
    isDirty.value = true
  }

  function addTextEdit(edit: Omit<TextEdit, 'id'>): TextEdit {
    const newEdit: TextEdit = {
      ...edit,
      id: generateId()
    }
    textEdits.value.push(newEdit)
    addOperation({
      type: 'add-text',
      pageNumber: edit.pageNumber,
      data: newEdit
    })
    return newEdit
  }

  function updateTextEdit(id: string, updates: Partial<TextEdit>): void {
    const index = textEdits.value.findIndex(e => e.id === id)
    if (index !== -1) {
      const oldData = { ...textEdits.value[index] }
      textEdits.value[index] = { ...textEdits.value[index], ...updates }
      addOperation({
        type: 'move',
        pageNumber: textEdits.value[index].pageNumber,
        data: { id, oldData, newData: textEdits.value[index] }
      })
    }
  }

  function deleteTextEdit(id: string): void {
    const index = textEdits.value.findIndex(e => e.id === id)
    if (index !== -1) {
      const deleted = textEdits.value.splice(index, 1)[0]
      addOperation({
        type: 'delete',
        pageNumber: deleted.pageNumber,
        data: { type: 'text', item: deleted }
      })
    }
  }

  function addImageEdit(edit: Omit<ImageEdit, 'id'>): ImageEdit {
    const newEdit: ImageEdit = {
      ...edit,
      id: generateId()
    }
    imageEdits.value.push(newEdit)
    addOperation({
      type: 'add-image',
      pageNumber: edit.pageNumber,
      data: newEdit
    })
    return newEdit
  }

  function deleteImageEdit(id: string): void {
    const index = imageEdits.value.findIndex(e => e.id === id)
    if (index !== -1) {
      const deleted = imageEdits.value.splice(index, 1)[0]
      addOperation({
        type: 'delete',
        pageNumber: deleted.pageNumber,
        data: { type: 'image', item: deleted }
      })
    }
  }

  function addShapeEdit(edit: Omit<ShapeEdit, 'id'>): ShapeEdit {
    const newEdit: ShapeEdit = {
      ...edit,
      id: generateId()
    }
    shapeEdits.value.push(newEdit)
    addOperation({
      type: 'add-shape',
      pageNumber: edit.pageNumber,
      data: newEdit
    })
    return newEdit
  }

  function deleteShapeEdit(id: string): void {
    const index = shapeEdits.value.findIndex(e => e.id === id)
    if (index !== -1) {
      const deleted = shapeEdits.value.splice(index, 1)[0]
      addOperation({
        type: 'delete',
        pageNumber: deleted.pageNumber,
        data: { type: 'shape', item: deleted }
      })
    }
  }

  function selectElement(id: string | null): void {
    selectedElement.value = id
  }

  function undo(): void {
    if (operations.value.length === 0) return

    const operation = operations.value.pop()!
    redoStack.value.push(operation)

    switch (operation.type) {
      case 'add-text':
        textEdits.value = textEdits.value.filter(e => e.id !== operation.data.id)
        break
      case 'add-image':
        imageEdits.value = imageEdits.value.filter(e => e.id !== operation.data.id)
        break
      case 'add-shape':
        shapeEdits.value = shapeEdits.value.filter(e => e.id !== operation.data.id)
        break
      case 'delete':
        if (operation.data.type === 'text') {
          textEdits.value.push(operation.data.item)
        } else if (operation.data.type === 'image') {
          imageEdits.value.push(operation.data.item)
        } else if (operation.data.type === 'shape') {
          shapeEdits.value.push(operation.data.item)
        }
        break
      case 'move':
        if (operation.data.oldData.content !== undefined) {
          const index = textEdits.value.findIndex(e => e.id === operation.data.id)
          if (index !== -1) {
            textEdits.value[index] = operation.data.oldData
          }
        }
        break
    }

    isDirty.value = operations.value.length > 0
  }

  function redo(): void {
    if (redoStack.value.length === 0) return

    const operation = redoStack.value.pop()!
    operations.value.push(operation)

    switch (operation.type) {
      case 'add-text':
        textEdits.value.push(operation.data)
        break
      case 'add-image':
        imageEdits.value.push(operation.data)
        break
      case 'add-shape':
        shapeEdits.value.push(operation.data)
        break
      case 'delete':
        if (operation.data.type === 'text') {
          textEdits.value = textEdits.value.filter(e => e.id !== operation.data.item.id)
        } else if (operation.data.type === 'image') {
          imageEdits.value = imageEdits.value.filter(e => e.id !== operation.data.item.id)
        } else if (operation.data.type === 'shape') {
          shapeEdits.value = shapeEdits.value.filter(e => e.id !== operation.data.item.id)
        }
        break
      case 'move':
        if (operation.data.newData.content !== undefined) {
          const index = textEdits.value.findIndex(e => e.id === operation.data.id)
          if (index !== -1) {
            textEdits.value[index] = operation.data.newData
          }
        }
        break
    }

    isDirty.value = true
  }

  async function save(): Promise<{ success: boolean; outputPath?: string; error?: string }> {
    if (!inputPath.value) {
      return { success: false, error: 'No input file specified' }
    }

    isSaving.value = true

    try {
      const edits = {
        textEdits: textEdits.value,
        imageEdits: imageEdits.value,
        shapeEdits: shapeEdits.value
      }

      const result = await pdfApi.applyEdits(
        inputPath.value,
        outputPath?.value || inputPath.value.replace('.pdf', '_edited.pdf'),
        edits
      )

      if (result.success) {
        isDirty.value = false
        operations.value = []
        redoStack.value = []
      }

      return result
    } catch (error) {
      return { success: false, error: (error as Error).message }
    } finally {
      isSaving.value = false
    }
  }

  function clear(): void {
    operations.value = []
    redoStack.value = []
    textEdits.value = []
    imageEdits.value = []
    shapeEdits.value = []
    selectedElement.value = null
    isDirty.value = false
  }

  return {
    operations,
    textEdits,
    imageEdits,
    shapeEdits,
    selectedElement,
    isDirty,
    isSaving,
    canUndo,
    canRedo,
    addTextEdit,
    updateTextEdit,
    deleteTextEdit,
    addImageEdit,
    deleteImageEdit,
    addShapeEdit,
    deleteShapeEdit,
    selectElement,
    undo,
    redo,
    save,
    clear
  }
}

export default usePdfEditor
