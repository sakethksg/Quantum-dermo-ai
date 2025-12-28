"use client"

import React, { useState, useCallback, useRef } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileImage,
  Camera
} from "lucide-react"

interface ImageUploadProps {
  onImageSelect: (base64: string) => void
  isLoading?: boolean
  acceptedFormats?: string[]
  maxSizeKB?: number
  previewSize?: 'sm' | 'md' | 'lg'
}

export function ImageUpload({ 
  onImageSelect, 
  isLoading = false,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeKB = 5000, // 5MB default
  previewSize = 'md'
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageInfo, setImageInfo] = useState<{
    name: string
    size: string
    type: string
  } | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const processFile = useCallback((file: File) => {
    const validateFile = (file: File): boolean => {
      setError(null)
      
      // Check file type
      if (!acceptedFormats.includes(file.type)) {
        setError(`Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`)
        return false
      }

      // Check file size
      if (file.size > maxSizeKB * 1024) {
        setError(`File size too large. Maximum size: ${formatFileSize(maxSizeKB * 1024)}`)
        return false
      }

      return true
    }

    if (!validateFile(file)) return

    setUploadProgress(0)
    setImageInfo({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type
    })

    const reader = new FileReader()
    
    reader.onloadstart = () => {
      setUploadProgress(10)
    }
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 80) + 10
        setUploadProgress(progress)
      }
    }
    
    reader.onload = (event) => {
      setUploadProgress(90)
      const base64 = event.target?.result as string
      
      // Remove data:image/jpeg;base64, prefix for API compatibility
      const base64Data = base64.split(',')[1]
      
      setSelectedImage(base64)
      setUploadProgress(100)
      onImageSelect(base64Data)
    }
    
    reader.onerror = () => {
      setError('Error reading file. Please try again.')
      setUploadProgress(0)
    }

    reader.readAsDataURL(file)
  }, [acceptedFormats, maxSizeKB, onImageSelect])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [processFile])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }, [processFile])

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImageInfo(null)
    setUploadProgress(0)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getPreviewSize = () => {
    switch (previewSize) {
      case 'sm': return 'h-32 w-32'
      case 'lg': return 'h-64 w-64'
      default: return 'h-48 w-48'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="h-5 w-5" />
          <span>Medical Image Upload</span>
        </CardTitle>
        <CardDescription>
          Upload medical images for AI analysis. Supported formats: JPEG, PNG, WebP
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!selectedImage ? (
          // Upload Area
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-primary/50'}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />

            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {isDragOver ? 'Drop image here' : 'Upload medical image'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag & drop or click to select an image file
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">
                  <FileImage className="h-3 w-3 mr-1" />
                  JPEG
                </Badge>
                <Badge variant="secondary">
                  <FileImage className="h-3 w-3 mr-1" />
                  PNG
                </Badge>
                <Badge variant="secondary">
                  <FileImage className="h-3 w-3 mr-1" />
                  WebP
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Maximum file size: {formatFileSize(maxSizeKB * 1024)}
              </p>
            </div>
          </div>
        ) : (
          // Image Preview
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Image Preview</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                <div className={`${getPreviewSize()} rounded-lg border overflow-hidden bg-muted/50 relative`}>
                  <Image
                    src={selectedImage}
                    alt="Medical image preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Image Information */}
              <div className="flex-1 space-y-4">
                {imageInfo && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Filename</label>
                      <p className="text-sm font-mono truncate">{imageInfo.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">File Size</label>
                      <p className="text-sm">{imageInfo.size}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Format</label>
                      <p className="text-sm">{imageInfo.type}</p>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Success Status */}
                {uploadProgress === 100 && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Image successfully processed and ready for analysis
                    </AlertDescription>
                  </Alert>
                )}

                {/* Security & Privacy Notice */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Camera className="h-4 w-4 mt-0.5 text-primary" />
                    <div className="text-xs space-y-1">
                      <p className="font-medium">Privacy & Security</p>
                      <p className="text-muted-foreground">
                        Images are encrypted using post-quantum cryptography and 
                        processed securely through our HIPAA-compliant AI pipeline.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Guidelines */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Image Guidelines</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Ensure image is clear and well-lit</li>
            <li>• Avoid blurry or low-resolution images</li>
            <li>• Include proper patient identifiers if required</li>
            <li>• Remove any personal information from the image if not needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}