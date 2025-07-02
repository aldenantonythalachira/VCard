'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { addContact } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function QRScanner() {
  const { user } = useAuth()
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
        
        // Start scanning for QR codes
        scanForQRCode()
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please ensure you have granted camera permissions.')
    }
  }

  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    const scan = () => {
      if (!isScanning || !video.videoWidth || !video.videoHeight) {
        if (isScanning) {
          requestAnimationFrame(scan)
        }
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      try {
        // Simple QR code detection simulation
        // In a real implementation, you would use a QR code library here
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        
        // For demo purposes, we'll simulate QR code detection
        // You can replace this with actual QR code detection logic
        
      } catch (error) {
        console.error('Error scanning QR code:', error)
      }

      if (isScanning) {
        requestAnimationFrame(scan)
      }
    }

    video.addEventListener('loadedmetadata', () => {
      scan()
    })
  }

  const handleManualInput = () => {
    // For demo purposes, simulate adding a contact
    const demoQRData = "thalachira,demo@example.com,demo-card-id,John Doe,valid"
    handleQRCodeDetected(demoQRData)
  }

  const handleQRCodeDetected = async (qrData: string) => {
    const marker = 'thalachira'
    
    if (!qrData.startsWith(marker)) {
      toast.error('Invalid QR code. This QR code is not supported.')
      return
    }

    const extractedData = qrData.substring(marker.length + 1)
    const dataArray = extractedData.split(',')
    
    if (dataArray.length < 3) {
      toast.error('Invalid QR code format')
      return
    }

    const [donorEmail, donorCardId, name] = dataArray

    if (!user?.email) {
      toast.error('User not authenticated')
      return
    }

    try {
      await addContact(user.email, donorEmail, donorCardId)
      toast.success(`${name} added to your contacts!`)
      stopCamera()
      router.push('/dashboard/contacts')
    } catch (error: any) {
      console.error('Error adding contact:', error)
      if (error.message === 'Contact already exists') {
        toast.error('This contact already exists in your collection.')
      } else {
        toast.error('Failed to add contact.')
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">QR Code Scanner</h2>
        <p className="text-dark-300">
          Scan a vCard QR code to add a new contact to your collection
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {!isScanning ? (
        <div className="space-y-4">
          <button
            onClick={startCamera}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Start Camera Scanner
          </button>
          
          <div className="text-center">
            <p className="text-sm text-dark-400 mb-4">
              Or try the demo functionality
            </p>
            <button
              onClick={handleManualInput}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Add Demo Contact
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-primary-500 rounded-lg relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary-400"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary-400"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary-400"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary-400"></div>
              </div>
            </div>
          </div>
          
          <button
            onClick={stopCamera}
            className="w-full btn-secondary py-3"
          >
            Stop Scanner
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-dark-700 rounded-lg">
        <h3 className="text-sm font-medium text-white mb-2">Instructions:</h3>
        <ul className="text-xs text-dark-300 space-y-1">
          <li>• Point your camera at a vCard QR code</li>
          <li>• Make sure the QR code is well-lit and centered</li>
          <li>• The contact will be automatically added when detected</li>
          <li>• Use the demo button to test the functionality</li>
        </ul>
      </div>
    </motion.div>
  )
}