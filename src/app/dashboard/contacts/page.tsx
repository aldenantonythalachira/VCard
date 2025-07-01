'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, QrCode } from 'lucide-react'
import ContactList from '@/components/contacts/ContactList'
import { useContacts } from '@/hooks/useContacts'
import Link from 'next/link'

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState('')
  const { contacts, loading } = useContacts()

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-white">My Contacts</h1>
          <p className="text-dark-300 mt-1">Manage your collected business cards</p>
        </div>
        
        <Link
          href="/dashboard/scanner"
          className="btn-primary flex items-center gap-2 justify-center sm:justify-start"
        >
          <QrCode className="w-4 h-4" />
          Scan New Contact
        </Link>
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
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </motion.div>

      {/* Contacts List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredContacts.length > 0 ? (
          <ContactList contacts={filteredContacts} />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-dark-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No contacts found</h3>
            <p className="text-dark-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Scan QR codes to add contacts to your collection'}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/scanner" className="btn-primary">
                Scan Your First Contact
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}