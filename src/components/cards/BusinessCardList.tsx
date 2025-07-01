'use client'

import { motion } from 'framer-motion'
import BusinessCardItem from './BusinessCardItem'
import { BusinessCard } from '@/types'

interface BusinessCardListProps {
  cards: BusinessCard[]
  showArchived?: boolean
}

export default function BusinessCardList({ cards, showArchived = false }: BusinessCardListProps) {
  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <BusinessCardItem card={card} showArchived={showArchived} />
        </motion.div>
      ))}
    </div>
  )
}