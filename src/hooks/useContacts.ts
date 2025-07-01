'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { subscribeToContacts } from '@/lib/firebase'
import { Contact } from '@/types'

export const useContacts = () => {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.email) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToContacts(user.email, (contacts) => {
      setContacts(contacts)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user?.email])

  return { contacts, loading }
}