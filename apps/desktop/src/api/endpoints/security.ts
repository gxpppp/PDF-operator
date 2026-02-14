import client from './client'

export interface EncryptOptions {
  input_path: string
  output_path: string
  user_password: string
  owner_password?: string
  permissions?: {
    print?: boolean
    copy?: boolean
    modify?: boolean
    annotate?: boolean
  }
}

export interface DecryptOptions {
  input_path: string
  output_path: string
  password: string
}

export interface SignOptions {
  input_path: string
  output_path: string
  certificate_path: string
  certificate_password: string
  reason?: string
  location?: string
}

export const securityApi = {
  async encrypt(options: EncryptOptions): Promise<{ success: boolean; output_path: string }> {
    return client.post('/security/encrypt', options)
  },

  async decrypt(options: DecryptOptions): Promise<{ success: boolean; output_path: string }> {
    return client.post('/security/decrypt', options)
  },

  async sign(options: SignOptions): Promise<{ success: boolean; output_path: string }> {
    return client.post('/security/sign', options)
  },

  async verifySignature(filePath: string): Promise<{
    valid: boolean
    signer?: string
    signed_at?: string
    reason?: string
    location?: string
  }> {
    return client.post('/security/verify', null, {
      params: { file_path: filePath }
    })
  },

  async getPermissions(
    filePath: string,
    password?: string
  ): Promise<{
    encrypted: boolean
    permissions?: {
      print: boolean
      copy: boolean
      modify: boolean
      annotate: boolean
    }
  }> {
    return client.get(`/security/permissions/${encodeURIComponent(filePath)}`, {
      params: { password }
    })
  },

  async redact(
    inputPath: string,
    outputPath: string,
    redactions: Array<{
      page: number
      x: number
      y: number
      width: number
      height: number
    }>
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/security/redact', {
      input_path: inputPath,
      output_path: outputPath,
      redactions
    })
  }
}

export default securityApi
