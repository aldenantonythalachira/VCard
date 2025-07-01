'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createBusinessCard, updateBusinessCard } from '@/lib/firebase'
import { BusinessCard } from '@/types'
import toast from 'react-hot-toast'

interface BusinessCardFormProps {
  initialData?: BusinessCard
  isEditing?: boolean
}

export default function BusinessCardForm({ initialData, isEditing = false }: BusinessCardFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    role: initialData?.role || '',
    email: initialData?.email || '',
    mobile: initialData?.mobile || '',
    officeAddress: initialData?.officeAddress || '',
    companyWebsite: initialData?.companyWebsite || '',
    whatsapp: initialData?.whatsapp || '',
    profileURL: initialData?.profileURL || '',
    linkedinURL: initialData?.linkedinURL || '',
    twitterURL: initialData?.twitterURL || '',
    facebookURL: initialData?.facebookURL || '',
    instagramURL: initialData?.instagramURL || '',
  })

  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'email':
        const emailRegex = /\S+@\S+\.\S+/
        return emailRegex.test(value)
      case 'mobile':
      case 'whatsapp':
        const phoneRegex = /^\+\d+\d+$/
        return phoneRegex.test(value)
      case 'linkedinURL':
        if (value.trim() === '') return true
        const linkedinRegex = /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]{5,30}\/?$/
        return linkedinRegex.test(value)
      case 'twitterURL':
        if (value.trim() === '') return true
        const twitterRegex = /^https?:\/\/twitter\.com\/(#!\/)?[a-zA-Z0-9_]{1,15}\/?$/
        return twitterRegex.test(value)
      case 'facebookURL':
        if (value.trim() === '') return true
        const facebookRegex = /^(https?:\/\/)?(www\.)?facebook.com\/(profile.php\?id=\d+|.*?\/)?([a-zA-Z0-9.]{5,})\/?$/
        return facebookRegex.test(value)
      case 'instagramURL':
        if (value.trim() === '') return true
        const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_]{1,30}\/?$/
        return instagramRegex.test(value)
      case 'profileURL':
      case 'companyWebsite':
        if (value.trim() === '') return true
        const urlRegex = /^https?:\/\/(www\.)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-z]{2,}(:[0-9]+)?(\/.*)?$/
        return urlRegex.test(value)
      default:
        return value.trim() !== ''
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.email) {
      toast.error('User not authenticated')
      return
    }

    const requiredFields = ['name', 'company', 'role', 'email', 'mobile', 'companyWebsite', 'officeAddress']
    const allFields = Object.keys(formData)

    // Check required fields
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in the ${field} field`)
        return
      }
    }

    // Validate all fields
    for (const field of allFields) {
      const fieldValue = formData[field as keyof typeof formData]
      if (fieldValue !== '') {
        const isValid = validateField(field, fieldValue)
        if (!isValid) {
          const errorMessages: Record<string, string> = {
            email: 'Please enter a valid email address.',
            mobile: 'Please enter a valid mobile number in the format +CountryCode Number.',
            whatsapp: 'Please enter a valid WhatsApp number in the format +CountryCode Number.',
            companyWebsite: 'Please enter a valid website starting with "https://".',
            profileURL: 'Please enter a valid profile URL starting with "https://".',
            linkedinURL: 'Please enter a valid LinkedIn profile URL.',
            twitterURL: 'Please enter a valid Twitter profile URL.',
            facebookURL: 'Please enter a valid Facebook profile URL.',
            instagramURL: 'Please enter a valid Instagram profile URL.',
          }
          toast.error(errorMessages[field] || `Please enter a valid ${field}`)
          return
        }
      }
    }

    setLoading(true)

    try {
      const cardData = {
        ...formData,
        status: 'valid' as const,
      }

      if (isEditing && initialData) {
        await updateBusinessCard(user.email, initialData.id, cardData)
        toast.success('Card updated successfully!')
        router.push(`/dashboard/cards/${initialData.id}`)
      } else {
        await createBusinessCard(user.email, cardData)
        toast.success('Card created successfully!')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error saving card:', error)
      toast.error('Failed to save card')
    } finally {
      setLoading(false)
    }
  }

  const formFields = [
    { key: 'name', label: 'Full Name', type: 'text', required: true },
    { key: 'company', label: 'Company Name', type: 'text', required: true },
    { key: 'role', label: 'Role/Designation', type: 'text', required: true },
    { key: 'email', label: 'Email Address', type: 'email', required: true },
    { key: 'mobile', label: 'Mobile Number', type: 'tel', required: true, placeholder: '+CountryCode Number' },
    { key: 'companyWebsite', label: 'Company Website', type: 'url', required: true },
    { key: 'officeAddress', label: 'Office Address', type: 'textarea', required: true },
    { key: 'whatsapp', label: 'WhatsApp Number', type: 'tel', placeholder: '+CountryCode Number (optional)' },
    { key: 'profileURL', label: 'Profile URL', type: 'url', placeholder: 'https://... (optional)' },
    { key: 'linkedinURL', label: 'LinkedIn Profile URL', type: 'url', placeholder: 'https://www.linkedin.com/in/... (optional)' },
    { key: 'twitterURL', label: 'Twitter Profile URL', type: 'url', placeholder: 'https://twitter.com/... (optional)' },
    { key: 'facebookURL', label: 'Facebook Profile URL', type: 'url', placeholder: 'https://www.facebook.com/... (optional)' },
    { key: 'instagramURL', label: 'Instagram Profile URL', type: 'url', placeholder: 'https://www.instagram.com/... (optional)' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field) => (
            <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label htmlFor={field.key} className="block text-sm font-medium text-white mb-2">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.key}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className="input-field h-20 resize-none"
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  required={field.required}
                />
              ) : (
                <input
                  id={field.key}
                  type={field.type}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className="input-field"
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Card' : 'Create Card'}
              </div>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 btn-secondary py-3"
          >
            <div className="flex items-center justify-center gap-2">
              <X className="w-4 h-4" />
              Cancel
            </div>
          </button>
        </div>
      </form>
    </motion.div>
  )
}