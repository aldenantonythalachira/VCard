'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Share2, Download } from 'lucide-react'
import Link from 'next/link'
import BusinessCardPreview from '@/components/cards/BusinessCardPreview'
import { getBusinessCard } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { BusinessCard } from '@/types'
import toast from 'react-hot-toast'

export default function CardDetail() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [card, setCard] = useState<BusinessCard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCard = async () => {
      if (!user || !params.id) return
      
      try {
        const cardData = await getBusinessCard(user.email!, params.id as string)
        setCard(cardData)
      } catch (error) {
        console.error('Error fetching card:', error)
        toast.error('Failed to load card')
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchCard()
  }, [user, params.id, router])

  const handleShare = async () => {
    if (!card) return
    
    const shareData = {
      title: `${card.name} - Business Card`,
      text: `Check out ${card.name}'s digital business card`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Card not found</h2>
        <Link href="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-dark-300 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{card.name}</h1>
            <p className="text-dark-300 mt-1">{card.role} at {card.company}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="btn-secondary flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <Link
              href={`/dashboard/cards/${card.id}/edit`}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <BusinessCardPreview card={card} />
      </motion.div>
    </div>
  )
}