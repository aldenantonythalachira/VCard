'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import BusinessCardForm from '@/components/cards/BusinessCardForm'
import { getBusinessCard } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { BusinessCard } from '@/types'
import toast from 'react-hot-toast'

export default function EditCard() {
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
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          href={`/dashboard/cards/${card.id}`}
          className="inline-flex items-center gap-2 text-dark-300 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Card
        </Link>
        
        <h1 className="text-3xl font-bold text-white">Edit Business Card</h1>
        <p className="text-dark-300 mt-1">Update your business card information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <BusinessCardForm initialData={card} isEditing />
      </motion.div>
    </div>
  )
}