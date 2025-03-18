import { useState, useEffect } from 'react'

export const useBlobUrlToBase64 = (blobUrl: string | null): string | null => {
  const [base64Url, setBase64Url] = useState<string | null>(null)

  useEffect(() => {
    if (!blobUrl) {
      setBase64Url(null)
      return
    }

    const convertToBase64 = async () => {
      try {
        // Fetch the blob URL to get the Blob
        const response = await fetch(blobUrl)
        const blob = await response.blob()

        // Convert Blob to Base64 using FileReader
        const reader = new FileReader()
        reader.onload = () => {
          setBase64Url(reader.result as string)
        }
        reader.onerror = () => {
          console.error('Error converting blob URL to Base64')
        }
        reader.readAsDataURL(blob)
      } catch (error) {
        console.error('Failed to convert blob URL to Base64:', error)
      }
    }

    convertToBase64()
  }, [blobUrl])

  return base64Url
}
