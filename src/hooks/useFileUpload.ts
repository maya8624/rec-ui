import { useState, useCallback, useRef, useEffect } from 'react'
import { uploadDocument, fetchUploadStatus } from '../api/agentApi'
import { recentUploads as initialUploads } from '../data/agent/demoData'
import type { UploadedFile } from '../types/agent'

const MAX_FILE_MB = 20
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

export function useFileUpload() {
  const [uploads, setUploads] = useState<UploadedFile[]>(initialUploads)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pollRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({})

  useEffect(() => {
    return () => { Object.values(pollRefs.current).forEach(clearInterval) }
  }, [])

  function startPolling(id: string) {
    pollRefs.current[id] = setInterval(async () => {
      try {
        const updated = await fetchUploadStatus(id)
        setUploads(prev => prev.map(u => u.id === id ? updated : u))
        if (updated.status !== 'processing') {
          clearInterval(pollRefs.current[id])
          delete pollRefs.current[id]
        }
      } catch {
        clearInterval(pollRefs.current[id])
        delete pollRefs.current[id]
      }
    }, 3000)
  }

  const upload = useCallback(async (file: File) => {
    if (isUploading) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only PDF, DOCX, and TXT files are allowed.')
      return
    }
    const sizeMb = file.size / 1_048_576
    if (sizeMb > MAX_FILE_MB) {
      setError(`File too large. Maximum size is ${MAX_FILE_MB} MB.`)
      return
    }
    setError(null)
    setIsUploading(true)
    const tempId = `temp-${Date.now()}`
    setUploads(prev => [
      { id: tempId, filename: file.name, sizeMb: parseFloat(sizeMb.toFixed(1)), status: 'processing', uploadedAt: new Date().toISOString() },
      ...prev,
    ])
    try {
      const { id } = await uploadDocument(file)
      setUploads(prev => prev.map(u => u.id === tempId ? { ...u, id } : u))
      startPolling(id)
    } catch {
      setError('Upload failed. Please try again.')
      setUploads(prev => prev.filter(u => u.id !== tempId))
    } finally {
      setIsUploading(false)
    }
  }, [isUploading])

  return { uploads, isUploading, error, upload }
}
