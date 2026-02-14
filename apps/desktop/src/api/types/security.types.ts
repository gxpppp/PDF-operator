export type EncryptionAlgorithm = 'aes-128' | 'aes-256' | 'rc4'
export type Permission = 'print' | 'copy' | 'modify' | 'annotate' | 'fill-forms' | 'extract' | 'assemble' | 'print-hq'

export interface EncryptOptions {
  inputPath: string
  outputPath: string
  userPassword?: string
  ownerPassword: string
  algorithm?: EncryptionAlgorithm
  permissions?: Permission[]
  allowScreenReaders?: boolean
}

export interface DecryptOptions {
  inputPath: string
  outputPath: string
  password: string
}

export interface DecryptResult {
  success: boolean
  outputPath: string
  wasEncrypted: boolean
}

export interface PermissionInfo {
  isEncrypted: boolean
  permissions: {
    print: boolean
    copy: boolean
    modify: boolean
    annotate: boolean
    fillForms: boolean
    extract: boolean
    assemble: boolean
    printHq: boolean
  }
  algorithm?: EncryptionAlgorithm
  ownerPasswordSet: boolean
  userPasswordSet: boolean
}

export interface SignatureOptions {
  inputPath: string
  outputPath: string
  certificatePath: string
  certificatePassword: string
  reason?: string
  location?: string
  contact?: string
  pageNumber?: number
  position?: { x: number; y: number; width: number; height: number }
  appearance?: SignatureAppearance
}

export interface SignatureAppearance {
  showName: boolean
  showDate: boolean
  showReason: boolean
  showLocation: boolean
  showLogo: boolean
  logoPath?: string
  backgroundColor?: string
  borderColor?: string
}

export interface SignatureInfo {
  hasSignature: boolean
  signatures: SignatureDetail[]
}

export interface SignatureDetail {
  name: string
  date: string
  reason?: string
  location?: string
  isValid: boolean
  certificateInfo: {
    issuer: string
    subject: string
    validFrom: string
    validTo: string
  }
}

export interface WatermarkOptions {
  inputPath: string
  outputPath: string
  type: 'text' | 'image'
  text?: string
  imagePath?: string
  fontSize?: number
  fontFamily?: string
  color?: string
  opacity?: number
  rotation?: number
  position?: 'center' | 'tile' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  pages?: 'all' | 'first' | 'last' | number[]
  layer?: 'over' | 'under'
}

export interface RedactionOptions {
  inputPath: string
  outputPath: string
  redactions: RedactionArea[]
}

export interface RedactionArea {
  pageNumber: number
  bbox: [number, number, number, number]
  color?: string
}

export interface RedactionPattern {
  type: 'regex' | 'text'
  pattern: string
  caseSensitive?: boolean
  pages?: 'all' | number[]
}

export interface AutoRedactOptions {
  inputPath: string
  outputPath: string
  patterns: RedactionPattern[]
  color?: string
}

export interface CertificateGenerateOptions {
  commonName: string
  organization?: string
  organizationalUnit?: string
  country?: string
  state?: string
  locality?: string
  emailAddress?: string
  validityYears?: number
  keySize?: 2048 | 4096
}

export interface CertificateInfo {
  subject: {
    commonName: string
    organization?: string
    country?: string
  }
  issuer: {
    commonName: string
    organization?: string
  }
  serialNumber: string
  validFrom: string
  validTo: string
  isExpired: boolean
  isSelfSigned: boolean
}
