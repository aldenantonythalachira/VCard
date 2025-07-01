'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Globe, LogOut, MessageSquare } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import toast from 'react-hot-toast'
import FeedbackModal from '@/components/settings/FeedbackModal'

export default function Settings() {
  const { user } = useAuth()
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-dark-300 mt-1">Welcome to vCard!</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Hello {user?.displayName || 'User'}
            </h2>
            <p className="text-dark-300">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary-400" />
              <span className="text-white">Country</span>
            </div>
            <span className="text-dark-300">US</span>
          </div>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Help</h3>
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="w-full flex items-center gap-3 p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
        >
          <MessageSquare className="w-5 h-5 text-primary-400" />
          <span className="text-white">Contact Us</span>
        </button>
      </motion.div>

      {/* Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 text-white" />
          <span className="text-white">Sign Out</span>
        </button>
      </motion.div>

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  )
}