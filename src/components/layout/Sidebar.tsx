import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  CreditCard, 
  Users, 
  Settings, 
  Menu, 
  X,
  QrCode,
  Archive,
  Plus
} from 'lucide-react'
import { clsx } from 'clsx'

const navigation = [
  { name: 'My Cards', href: '/dashboard', icon: Home },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Scanner', href: '/scanner', icon: QrCode },
  { name: 'Archived', href: '/archived', icon: Archive },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isMobileMenuOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700',
          'lg:translate-x-0 lg:block'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
            <h1 className="text-xl font-bold text-white">vCard</h1>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-700">
            <Link
              to="/add-card"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Card
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              © 2024 vCard. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Desktop sidebar spacer */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0" />
    </>
  )
}

export default Sidebar