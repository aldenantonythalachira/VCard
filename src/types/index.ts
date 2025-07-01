export interface BusinessCard {
  id: string
  name: string
  company: string
  role: string
  email: string
  mobile: string
  officeAddress: string
  companyWebsite: string
  whatsapp?: string
  profileURL?: string
  linkedinURL?: string
  twitterURL?: string
  facebookURL?: string
  instagramURL?: string
  status: 'valid' | 'invalid'
}

export interface Contact extends BusinessCard {}

export interface User {
  uid: string
  email: string
  displayName?: string
  emailVerified: boolean
}