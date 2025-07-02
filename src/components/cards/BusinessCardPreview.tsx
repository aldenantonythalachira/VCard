'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, MessageCircle, Linkedin, Twitter, Facebook, Instagram, User } from 'lucide-react'
import { BusinessCard } from '@/types'

interface BusinessCardPreviewProps {
  card: BusinessCard
}

export default function BusinessCardPreview({ card }: BusinessCardPreviewProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Import QRCode dynamically to avoid SSR issues
        const QRCode = (await import('qrcode')).default
        const cardInfo = `thalachira,${card.id},${card.name},${card.status},${card.role},${card.profileURL || ''},${card.twitterURL || ''},${card.instagramURL || ''},${card.facebookURL || ''},${card.linkedinURL || ''},${card.mobile},${card.whatsapp || ''},${card.email},${card.company},${card.officeAddress},${card.companyWebsite},${card.status}`
        const url = await QRCode.toDataURL(cardInfo, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#3b82f6'
          }
        })
        setQrCodeUrl(url)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    generateQRCode()
  }, [card])

  const handleLinkClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_self')
  }

  const handleWhatsAppClick = (phone: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '')
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Desktop Card View */}
      <div className="hidden lg:block">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-black shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <div className="grid grid-cols-3 gap-8 h-96">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{card.name}</h1>
                <p className="text-lg">{card.role}</p>
                {card.profileURL && (
                  <button
                    onClick={() => handleLinkClick(card.profileURL!)}
                    className="text-sm underline hover:no-underline transition-all"
                  >
                    View Profile
                  </button>
                )}
              </div>
            </div>

            {/* Center Column */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Contact Actions */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handlePhoneClick(card.mobile)}
                  className="flex flex-col items-center p-3 bg-black/10 rounded-lg hover:bg-black/20 transition-colors"
                >
                  <Phone className="w-6 h-6 mb-1" />
                  <span className="text-xs">Call</span>
                </button>

                {(card.whatsapp || card.mobile) && (
                  <button
                    onClick={() => handleWhatsAppClick(card.whatsapp || card.mobile)}
                    className="flex flex-col items-center p-3 bg-black/10 rounded-lg hover:bg-black/20 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 mb-1" />
                    <span className="text-xs">WhatsApp</span>
                  </button>
                )}

                <button
                  onClick={() => handleEmailClick(card.email)}
                  className="flex flex-col items-center p-3 bg-black/10 rounded-lg hover:bg-black/20 transition-colors"
                >
                  <Mail className="w-6 h-6 mb-1" />
                  <span className="text-xs">Email</span>
                </button>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-2 gap-4">
                {card.linkedinURL && (
                  <button
                    onClick={() => handleLinkClick(card.linkedinURL!)}
                    className="flex items-center justify-center p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                )}

                {card.twitterURL && (
                  <button
                    onClick={() => handleLinkClick(card.twitterURL!)}
                    className="flex items-center justify-center p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                )}

                {card.instagramURL && (
                  <button
                    onClick={() => handleLinkClick(card.instagramURL!)}
                    className="flex items-center justify-center p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </button>
                )}

                {card.facebookURL && (
                  <button
                    onClick={() => handleLinkClick(card.facebookURL!)}
                    className="flex items-center justify-center p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="text-right">
                <p className="text-sm">{card.mobile}</p>
                <p className="text-sm truncate">{card.email}</p>
              </div>

              <div className="text-right">
                <h2 className="text-xl font-bold">{card.company}</h2>
                <p className="text-sm">{card.officeAddress}</p>
                <button
                  onClick={() => handleLinkClick(card.companyWebsite)}
                  className="text-sm underline hover:no-underline transition-all truncate block"
                >
                  {card.companyWebsite}
                </button>
              </div>

              {/* QR Code */}
              {qrCodeUrl && (
                <div className="flex justify-end">
                  <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-6">
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{card.name}</h1>
            <p className="text-dark-300">{card.role}</p>
            <p className="text-dark-400">{card.company}</p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary-400" />
              <span className="text-white">{card.mobile}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary-400" />
              <span className="text-white">{card.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary-400" />
              <span className="text-white">{card.officeAddress}</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary-400" />
              <span className="text-white">{card.companyWebsite}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handlePhoneClick(card.mobile)}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button
              onClick={() => handleEmailClick(card.email)}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>

          {/* Social Links */}
          {(card.linkedinURL || card.twitterURL || card.facebookURL || card.instagramURL) && (
            <div className="border-t border-dark-600 pt-6">
              <h3 className="text-white font-medium mb-4">Connect with me</h3>
              <div className="flex gap-4">
                {card.linkedinURL && (
                  <button
                    onClick={() => handleLinkClick(card.linkedinURL!)}
                    className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-primary-400" />
                  </button>
                )}
                {card.twitterURL && (
                  <button
                    onClick={() => handleLinkClick(card.twitterURL!)}
                    className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-primary-400" />
                  </button>
                )}
                {card.facebookURL && (
                  <button
                    onClick={() => handleLinkClick(card.facebookURL!)}
                    className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-primary-400" />
                  </button>
                )}
                {card.instagramURL && (
                  <button
                    onClick={() => handleLinkClick(card.instagramURL!)}
                    className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-primary-400" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="border-t border-dark-600 pt-6 text-center">
              <h3 className="text-white font-medium mb-4">Share this card</h3>
              <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}