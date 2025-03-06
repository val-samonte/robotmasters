const SALT_LENGTH = 16
const IV_LENGTH = 12

function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(str).buffer
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  return btoa(String.fromCharCode(...bytes))
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

async function generateRandomBytes(length: number): Promise<Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(length))
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number = 100000
): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}

export async function encryptSecretKey(
  secretKey: Uint8Array,
  password: string
): Promise<string> {
  if (secretKey.length !== 64) {
    throw new Error('Secret key must be exactly 64 bytes')
  }

  const salt = await generateRandomBytes(SALT_LENGTH)
  const iv = await generateRandomBytes(IV_LENGTH)
  const key = await deriveKey(password, salt)

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128,
    },
    key,
    secretKey
  )

  const result = new Uint8Array(SALT_LENGTH + IV_LENGTH + encrypted.byteLength)
  result.set(salt, 0)
  result.set(iv, SALT_LENGTH)
  result.set(new Uint8Array(encrypted), SALT_LENGTH + IV_LENGTH)

  return arrayBufferToBase64(result.buffer)
}

export async function decryptSecretKey(
  encryptedData: string,
  password: string
): Promise<Uint8Array> {
  const data = base64ToArrayBuffer(encryptedData)

  if (data.byteLength < SALT_LENGTH + IV_LENGTH) {
    throw new Error('Encrypted data is too short')
  }

  const salt = new Uint8Array(data.slice(0, SALT_LENGTH))
  const iv = new Uint8Array(data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH))
  const ciphertext = new Uint8Array(data.slice(SALT_LENGTH + IV_LENGTH))

  const key = await deriveKey(password, salt)

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128,
    },
    key,
    ciphertext
  )

  const secretKey = new Uint8Array(decrypted)
  if (secretKey.length !== 64) {
    throw new Error('Decrypted key is not 64 bytes')
  }
  return secretKey
}
