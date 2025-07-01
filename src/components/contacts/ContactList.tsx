'use client'

import { motion } from 'framer-motion'
import ContactItem from './ContactItem'
import { Contact } from '@/types'

interface ContactListProps {
  contacts: Contact[]
}

export default function ContactList({ contacts }: ContactListProps) {
  return (
    <div className="space-y-4">
      {contacts.map((contact, index) => (
        <motion.div
          key={contact.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ContactItem contact={contact} />
        </motion.div>
      ))}
    </div>
  )
}