'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload } from 'lucide-react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useAuth } from '@/contexts/AuthContext'
import { addContact } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function QRScanner() {
  const { user } = useAuth()
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null)
  const scannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear()
      }
    }
  }, [scanner])

  const handleScanSuccess = async (decodedText: string) => {
    const marker = 'thalachira'
    
    if (!decodedText.startsWith(marker)) {
      toast.error('Invalid QR code. This QR code is not supported.')
      return
    }

    const extractedData = decodedText.substring(marker.length + 1)
    const dataArray = extractedData.split(',')
    
    if (dataArray.length < 2) {
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
      router.push('/dashboard/contacts')
    } catch (error) {
      console.error('Error adding contact:', error)
      toast.error('Failed to add contact. This card may already exist in your contacts.')
    }

    if (scanner) {
      scanner.clear()
      setIsScanning(false)
    }
  }

  const handleScanError = (error: string) => {
    // Ignore frequent scanning errors
    console.log('Scan error:', error)
  }

  const startScanning = () => {
    if (!scannerRef.current) return

    const html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-scanner',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    )

    html5QrcodeScanner.render(handleScanSuccess, handleScanError)
    setScanner(html5QrcodeScanner)
    setIsScanning(true)
  }

  const stopScanning = () => {
    if (scanner) {
      scanner.clear()
      setScanner(null)
      setIsScanning(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Scan QR Code</h2>
        <p className="text-dark-300">
          Position the QR code within the frame to add a new contact
        </p>
      </div>

      {!isScanning ? (
        <div className="space-y-4">
          <button
            onClick={startScanning}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Start Camera
          </button>
          
          <div className="text-center">
            <p className="text-sm text-dark-400 mb-4">
              Or upload an image containing a QR code
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="qr-upload"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  // Handle file upload for QR code scanning
                  toast.info('File upload QR scanning coming soon!')
                }
              }}
            />
            <label
              htmlFor="qr-upload"
              className="btn-secondary inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            id="qr-scanner"
            ref={scannerRef}
            className="w-full max-w-md mx-auto"
          />
          
          <button
            onClick={stopScanning}
            className="w-full btn-secondary py-3"
          >
            Stop Scanning
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-dark-700 rounded-lg">
        <h3 className="text-sm font-medium text-white mb-2">Instructions:</h3>
        <ul className="text-xs text-dark-300 space-y-1">
          <li>• Point your camera at a vCard QR code</li>
          <li>• Make sure the QR code is well-lit and in focus</li>
          <li>• The contact will be automatically added when detected</li>
        </ul>
      </div>
    </motion.div>
  )
}