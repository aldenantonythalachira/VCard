'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Bell, User } from 'lucide-react'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="lg:ml-64 bg-dark-800 border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-dark-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs text-dark-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}