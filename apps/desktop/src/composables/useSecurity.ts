import { ref, computed, type Ref } from 'vue'
import { securityApi } from '@/api'
import type {
  EncryptOptions,
  DecryptOptions,
  DecryptResult,
  PermissionInfo,
  SignatureOptions,
  SignatureInfo,
  WatermarkOptions,
  RedactionOptions,
  AutoRedactOptions
} from '@/api/types/security.types'

export interface UseSecurityOptions {
  onEncryptComplete?: (result: { success: boolean; outputPath: string }) => void
  onDecryptComplete?: (result: DecryptResult) => void
  onSignComplete?: (result: { success: boolean; outputPath: string }) => void
  onError?: (error: Error) => void
}

export function useSecurity(options: UseSecurityOptions = {}) {
  const {
    onEncryptComplete,
    onDecryptComplete,
    onSignComplete,
    onError
  } = options

  const isProcessing = ref(false)
  const currentOperation = ref<string | null>(null)
  const progress = ref(0)

  async function encrypt(encryptOptions: EncryptOptions): Promise<{ success: boolean; outputPath: string }> {
    isProcessing.value = true
    currentOperation.value = 'encrypt'
    progress.value = 0

    try {
      progress.value = 50
      const result = await securityApi.encrypt(encryptOptions)
      progress.value = 100
      onEncryptComplete?.(result)
      return result
    } catch (error) {
      onError?.(error as Error)
      throw error
    } finally {
      isProcessing.value = false
      currentOperation.value = null
    }
  }

  async function decrypt(decryptOptions: DecryptOptions): Promise<DecryptResult> {
    isProcessing.value = true
    currentOperation.value = 'decrypt'
    progress.value = 0

    try {
      progress.value = 50
      const result = await securityApi.decrypt(decryptOptions)
      progress.value = 100
      onDecryptComplete?.(result)
      return result
    } catch (error) {
      onError?.(error as Error)
      throw error
    } finally {
      isProcessing.value = false
      currentOperation.value = null
    }
  }

  async function getPermissions(filePath: string): Promise<PermissionInfo> {
    try {
      return await securityApi.getPermissions(filePath)
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  }

  async function sign(signatureOptions: SignatureOptions): Promise<{ success: boolean; outputPath: string }> {
    isProcessing.value = true
    currentOperation.value = 'sign'
    progress.value = 0

    try {
      progress.value = 50
      const result = await securityApi.sign(signatureOptions)
      progress.value = 100
      onSignComplete?.(result)
      return result
    } catch (error) {
      onError?.(error as Error)
      throw error
    } finally {
      isProcessing.value = false
      currentOperation.value = null
    }
  }

  async function verifySignature(filePath: string): Promise<SignatureInfo> {
    try {
      return await securityApi.verifySignature(filePath)
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  }

  async function addWatermark(watermarkOptions: WatermarkOptions): Promise<{ success: boolean; outputPath: string }> {
    isProcessing.value = true
    currentOperation.value = 'watermark'
    progress.value = 0

    try {
      progress.value = 50
      const result = await securityApi.addWatermark(watermarkOptions)
      progress.value = 100
      return result
    } catch (error) {
      onError?.(error as Error)
      throw error
    } finally {
      isProcessing.value = false
      currentOperation.value = null
    }
  }

  async function redact(redactOptions: RedactionOptions): Promise<{ success: boolean; outputPath: string }> {
    isProcessing.value = true
    currentOperation.value = 'redact'
    progress.value = 0

    try {
      progress.value = 50
      const result = await securityApi.redact(redactOptions)
      progress.value = 100
      return result
    } catch (error) {
      onError?.(error as Error)
      throw error
    } finally {
      isProcessing.value = false
      currentOperation.value = null
    }
  }

  async function autoRedact(autoRedactOptions: AutoRedactOptions): Promise<{ success: boolean; outputPath: string; redactionsCount: number }> {
    isProcessing.value = true
    currentOperation.value = 'auto-redact'
    progress.value = 0

    try {
      progress.value = 50
      const result = await securityApi.autoRedact(autoRedactOptions)
      progress.value = 100
      return result
    } catch (error) {
      onError?.(error as Error)
      throw error
    } finally {
      isProcessing.value = false
      currentOperation.value = null
    }
  }

  return {
    isProcessing,
    currentOperation,
    progress,
    encrypt,
    decrypt,
    getPermissions,
    sign,
    verifySignature,
    addWatermark,
    redact,
    autoRedact
  }
}

export default useSecurity
