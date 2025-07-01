'use client'

import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Contact } from '@/types'
import Image from 'next/image'

interface ContactItemProps {
  contact: Contact
}

export default function ContactItem({ contact }: ContactItemProps) {
  const isInvalid = contact.status === 'invalid'

  return (
    <div className={`card hover:shadow-xl transition-all duration-300 ${isInvalid ? 'opacity-75' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Image
              src="https://cdn4.vectorstock.com/i/1000x1000/94/23/businessman-avatar-cartoon-vector-17729423.jpg"
              alt={contact.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${isInvalid ? 'text-red-400' : 'text-white'}`}>
              {contact.name}
            </h3>
            <p className={`text-sm ${isInvalid ? 'text-red-300' : 'text-dark-300'}`}>
              {isInvalid ? `Invalid - ${contact.role}@${contact.company}` : `${contact.role}@${contact.company}`}
            </p>
          </div>
        </div>

        {/* View Button */}
        <Link
          href={`/dashboard/cards/${contact.id}`}
          className="btn-primary flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View
        </Link>
      </div>
    </div>
  )
}