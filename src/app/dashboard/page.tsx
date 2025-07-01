'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, QrCode, Archive, Search } from 'lucide-react'
import BusinessCardList from '@/components/cards/BusinessCardList'
import { useBusinessCards } from '@/hooks/useBusinessCards'
import Link from 'next/link'

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const { cards, loading } = useBusinessCards()

  const validCards = cards.filter(card => card.status === 'valid')
  const filteredCards = validCards.filter(card =>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">My Cards</h1>
          <p className="text-dark-300 mt-1">Manage your digital business cards</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/scanner"
            className="btn-secondary flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Scan QR</span>
          </Link>
          <Link
            href="/dashboard/cards/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Card</span>
          </Link>
        </div>
      </motion.div>

      {/* Search and Archive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <Link
          href="/dashboard/archived"
          className="btn-secondary flex items-center gap-2 justify-center sm:justify-start"
        >
          <Archive className="w-4 h-4" />
          Archived Cards
        </Link>
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
          <BusinessCardList cards={filteredCards} />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-dark-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No cards found</h3>
            <p className="text-dark-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first business card to get started'}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/cards/new" className="btn-primary">
                Create Your First Card
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}