// Demo seed data for Firestore
// Run this once to populate your Firebase

import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export const DEMO_USERS = [
  {
    uid: 'demo-breeder-1',
    role: 'breeder',
    name: 'Kasia Kennels',
    city: 'Malta',
    email: 'kasia@pawmatch.app',
  },
  {
    uid: 'demo-buyer-1',
    role: 'buyer',
    name: 'Adam Smith',
    city: 'Valletta',
    email: 'adam@pawmatch.app',
  },
  {
    uid: 'demo-shelter-1',
    role: 'shelter',
    name: 'Malta Animal Rescue',
    city: 'Sliema',
    email: 'shelter@pawmatch.app',
  },
  {
    uid: 'demo-vet-1',
    role: 'vet',
    name: 'Dr. Paws Clinic',
    city: 'Gozo',
    email: 'vet@pawmatch.app',
  },
]

export const DEMO_PETS = [
  {
    id: 'pet-1',
    ownerId: 'demo-breeder-1',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    sex: 'M',
    age: '2 years',
    size: 'Large',
    weight: '30kg',
    city: 'Malta',
    health: ['Vaccinated', 'Microchipped', 'Health checked'],
    photos: ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800'],
    description: 'Friendly and energetic golden retriever looking for a loving home!',
    status: 'available',
  },
  {
    id: 'pet-2',
    ownerId: 'demo-breeder-1',
    name: 'Luna',
    species: 'Dog',
    breed: 'Husky',
    sex: 'F',
    age: '3 years',
    size: 'Medium',
    weight: '25kg',
    city: 'Valletta',
    health: ['Vaccinated', 'Spayed'],
    photos: ['https://images.unsplash.com/photo-1568572933382-74d440642117?w=800'],
    description: 'Beautiful husky with striking blue eyes. Very playful!',
    status: 'available',
  },
  {
    id: 'pet-3',
    ownerId: 'demo-shelter-1',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Labrador',
    sex: 'M',
    age: '1 year',
    size: 'Large',
    weight: '28kg',
    city: 'Sliema',
    health: ['Vaccinated', 'Microchipped'],
    photos: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800'],
    description: 'Young and playful lab, great with kids and other dogs!',
    status: 'available',
  },
]

export async function seedFirestore() {
  if (!db) {
    console.error('Firebase not configured')
    return
  }

  try {
    // Seed users
    for (const user of DEMO_USERS) {
      await setDoc(doc(db, 'users', user.uid), user, { merge: true })
    }

    // Seed pets
    for (const pet of DEMO_PETS) {
      await setDoc(doc(db, 'pets', pet.id), pet, { merge: true })
    }

    console.log('✅ Firestore seeded successfully!')
    return { success: true, message: 'Seeded demo users and pets' }
  } catch (error) {
    console.error('Error seeding Firestore:', error)
    throw error
  }
}
