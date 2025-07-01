'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { subscribeToBusinessCards } from '@/lib/firebase'
import { BusinessCard } from '@/types'

export const useBusinessCards = () => {
  const { user } = useAuth()
  const [cards, setCards] = useState<BusinessCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.email) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToBusinessCards(user.email, (cards) => {
      setCards(cards)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user?.email])

  return { cards, loading }
}