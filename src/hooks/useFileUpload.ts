import { useState, useCallback, useRef } from 'react'
import { BlockBlobClient } from '@azure/storage-blob'
import { getUploadUrl } from '../api/agentApi'
import type { UploadedFile } from '../types/agent'

const MAX_FILE_MB = 100
const MAX_FILES = 5
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export function useFileUpload() {
  const [uploads, setUploads] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queueRef = useRef<Array<{ file: File; tempId: string }>>([])
  const processingRef = useRef(false)

  async function processNext() {
    if (processingRef.current || queueRef.current.length === 0) return
    const { file, tempId } = queueRef.current.shift()!
    processingRef.current = true

    try {
      const { sasUrl, blobName } = await getUploadUrl({ fileName: file.name, contentType: file.type })
      const client = new BlockBlobClient(sasUrl)
      await client.uploadData(file, {
        blobHTTPHeaders: { blobContentType: file.type },
        onProgress: (e) => {
          const progress = Math.round((e.loadedBytes / file.size) * 100)
          setUploads(prev => prev.map(u => u.id === tempId ? { ...u, progress } : u))
        },
      })
      setUploads(prev => prev.map(u =>
        u.id === tempId ? { ...u, status: 'uploaded', progress: 100, blobName } : u
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
      setUploads(prev => prev.map(u =>
        u.id === tempId ? { ...u, status: 'error' } : u
      ))
    } finally {
      processingRef.current = false
      if (queueRef.current.length === 0) setIsUploading(false)
      processNext()
    }
  }

  const upload = useCallback((file: File) => {
    setError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, WebP, PDF, and Word documents are allowed.')
      return
    }
    const sizeMb = file.size / 1_048_576
    if (sizeMb > MAX_FILE_MB) {
      setError(`File too large. Maximum size is ${MAX_FILE_MB} MB.`)
      return
    }
    if (uploads.length >= MAX_FILES) {
      setError(`You can upload a maximum of ${MAX_FILES} files.`)
      return
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
    queueRef.current.push({ file, tempId })
    setUploads(prev => [
      { id: tempId, filename: file.name, sizeMb: parseFloat(sizeMb.toFixed(1)), status: 'uploading', progress: 0, blobName: null, uploadedAt: new Date().toISOString() },
      ...prev,
    ])
    setIsUploading(true)
    processNext()
  }, [uploads])

  return { uploads, isUploading, error, upload }
}
