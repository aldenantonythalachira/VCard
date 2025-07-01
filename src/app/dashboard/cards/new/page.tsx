'use client'

import { motion } from 'framer-motion'
import BusinessCardForm from '@/components/cards/BusinessCardForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewCard() {
  return (
    <div className="max-w-2xl mx-auto">
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
        
        <h1 className="text-3xl font-bold text-white">Create New Business Card</h1>
        <p className="text-dark-300 mt-1">Fill in your details to create a professional digital business card</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <BusinessCardForm />
      </motion.div>
    </div>
  )
}