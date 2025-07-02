import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "vcard-demo.firebaseapp.com",
  projectId: "vcard-demo",
  storageBucket: "vcard-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuvwxyz",
  measurementId: "G-XXXXXXXXXX"
}

let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

export const auth = getAuth(app)
export const db = getFirestore(app)

// Firebase helper functions
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  getDocs,
  getDoc 
} from 'firebase/firestore'
import { BusinessCard, Contact } from '@/types'

export const createBusinessCard = async (userEmail: string, cardData: Omit<BusinessCard, 'id'>) => {
  const docRef = await addDoc(
    collection(db, `${userEmail}/cards/businesscards`),
    cardData
  )
  return docRef.id
}

export const updateBusinessCard = async (userEmail: string, cardId: string, cardData: Partial<BusinessCard>) => {
  const docRef = doc(db, `${userEmail}/cards/businesscards/${cardId}`)
  await updateDoc(docRef, cardData)
}

export const getBusinessCard = async (userEmail: string, cardId: string): Promise<BusinessCard> => {
  const docRef = doc(db, `${userEmail}/cards/businesscards/${cardId}`)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BusinessCard
  } else {
    throw new Error('Card not found')
  }
}

export const subscribeToBusinessCards = (userEmail: string, callback: (cards: BusinessCard[]) => void) => {
  const unsubscribe = onSnapshot(
    collection(db, `${userEmail}/cards/businesscards`),
    (snapshot) => {
      const cards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BusinessCard[]
      callback(cards)
    }
  )
  return unsubscribe
}

export const addContact = async (userEmail: string, donorEmail: string, donorCardId: string) => {
  // Check if contact already exists
  const contactsRef = collection(db, `${userEmail}/contacts/details`)
  const querySnapshot = await getDocs(contactsRef)
  
  let cardExists = false
  querySnapshot.forEach((doc) => {
    const contact = doc.data()
    if (contact.donorCardID === donorCardId) {
      cardExists = true
    }
  })

  if (cardExists) {
    throw new Error('Contact already exists')
  }

  await addDoc(contactsRef, {
    donorEmail,
    donorCardID: donorCardId,
  })
}

export const subscribeToContacts = (userEmail: string, callback: (contacts: Contact[]) => void) => {
  const unsubscribe = onSnapshot(
    query(collection(db, `${userEmail}/contacts/details`)),
    async (querySnapshot) => {
      const fetchedContacts: Contact[] = []

      for (const docSnapshot of querySnapshot.docs) {
        const { donorEmail, donorCardID } = docSnapshot.data()
        const cardRef = doc(db, `${donorEmail}/cards/businesscards/${donorCardID}`)
        
        try {
          const cardDoc = await getDoc(cardRef)
          if (cardDoc.exists()) {
            fetchedContacts.push({ 
              id: cardDoc.id, 
              ...cardDoc.data() 
            } as Contact)
          }
        } catch (error) {
          console.error('Error fetching contact card:', error)
        }
      }

      callback(fetchedContacts)
    }
  )
  return unsubscribe
}

export const submitFeedback = async (userEmail: string, feedback: string) => {
  await addDoc(collection(db, userEmail), {
    feedback,
    timestamp: new Date(),
  })
}