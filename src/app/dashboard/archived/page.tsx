'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowLeft } from 'lucide-react'
import BusinessCardList from '@/components/cards/BusinessCardList'
import { useBusinessCards } from '@/hooks/useBusinessCards'
import Link from 'next/link'

export default function ArchivedCards() {
  const [searchTerm, setSearchTerm] = useState('')
  const { cards, loading } = useBusinessCards()

  const archivedCards = cards.filter(card => card.status === 'invalid')
  const filteredCards = archivedCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-dark-300 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold text-white">Archived Cards</h1>
          <p className="text-dark-300 mt-1">Manage your archived business cards</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search archived cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </motion.div>

      {/* Cards List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredCards.length > 0 ? (
          <BusinessCardList cards={filteredCards} showArchived />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-dark-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No archived cards found</h3>
            <p className="text-dark-400">
              {searchTerm ? 'Try adjusting your search terms' : 'You have no archived cards'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}