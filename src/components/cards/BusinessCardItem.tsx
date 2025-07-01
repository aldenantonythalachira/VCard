'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Edit, Trash2, RotateCcw, Eye, MoreVertical } from 'lucide-react'
import { BusinessCard } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { updateBusinessCard } from '@/lib/firebase'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface BusinessCardItemProps {
  card: BusinessCard
  showArchived?: boolean
}

export default function BusinessCardItem({ card, showArchived = false }: BusinessCardItemProps) {
  const { user } = useAuth()
  const [showActions, setShowActions] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleArchive = async () => {
    if (!user?.email) return
    
    setLoading(true)
    try {
      await updateBusinessCard(user.email, card.id, {
        status: 'invalid'
      })
      toast.success('Card archived successfully')
    } catch (error) {
      toast.error('Failed to archive card')
    } finally {
      setLoading(false)
      setShowActions(false)
    }
  }

  const handleRestore = async () => {
    if (!user?.email) return
    
    setLoading(true)
    try {
      await updateBusinessCard(user.email, card.id, {
        status: 'valid'
      })
      toast.success('Card restored successfully')
    } catch (error) {
      toast.error('Failed to restore card')
    } finally {
      setLoading(false)
      setShowActions(false)
    }
  }

  const isInvalid = card.status === 'invalid'

  return (
    <div className="relative">
      <div className={`card hover:shadow-xl transition-all duration-300 ${isInvalid ? 'opacity-75' : ''}`}>
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Image
              src="https://cdn4.vectorstock.com/i/1000x1000/94/23/businessman-avatar-cartoon-vector-17729423.jpg"
              alt={card.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${isInvalid ? 'text-red-400' : 'text-white'}`}>
              {card.name}
            </h3>
            <p className={`text-sm ${isInvalid ? 'text-red-300' : 'text-dark-300'}`}>
              {isInvalid ? `Invalid - ${card.role}@${card.company}` : `${card.role}@${card.company}`}
            </p>
          </div>

          {/* Actions */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-dark-400 hover:text-white transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-2 w-48 bg-dark-700 border border-dark-600 rounded-lg shadow-lg z-10"
              >
                <div className="py-1">
                  <Link
                    href={`/dashboard/cards/${card.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-dark-600 transition-colors"
                    onClick={() => setShowActions(false)}
                  >
                    <Eye className="w-4 h-4" />
                    View Card
                  </Link>
                  
                  {!showArchived && (
                    <Link
                      href={`/dashboard/cards/${card.id}/edit`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-dark-600 transition-colors"
                      onClick={() => setShowActions(false)}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Card
                    </Link>
                  )}

                  {showArchived ? (
                    <button
                      onClick={handleRestore}
                      disabled={loading}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-400 hover:bg-dark-600 transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore Card
                    </button>
                  ) : (
                    <button
                      onClick={handleArchive}
                      disabled={loading}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-dark-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Archive Card
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  )
}