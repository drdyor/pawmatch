// User Roles
export type UserRole = 'breeder_registered' | 'breeder_independent' | 'buyer' | 'shelter' | 'vet';

// User Profile
export interface User {
  id: string;
  email: string;
  role: UserRole | null;
  fullName: string;
  phoneNumber?: string;
  city?: string;
  country: string;
  kennelName?: string;
  shelterName?: string;
  clinicName?: string;
  isFirstTimeBreeder?: boolean;
  profilePhoto?: string;
  createdAt: string;
}

// Pet
export interface Pet {
  id: string;
  ownerId: string;
  ownerRole: UserRole;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  sex: 'male' | 'female';
  dateOfBirth: string;
  weight?: number;
  photos: string[];
  healthRecords: HealthRecord[];
  status: 'available' | 'reserved' | 'adopted' | 'stud_available' | 'in_heat';
  city: string;
  country: string;
  description?: string;
  createdAt: string;
}

// Health Record
export interface HealthRecord {
  id: string;
  petId: string;
  type: 'vaccination' | 'test' | 'certificate' | 'checkup';
  title: string;
  date: string;
  vetName?: string;
  notes?: string;
  fileUrl?: string;
}

// Heat Cycle
export interface HeatCycle {
  id: string;
  petId: string;
  startDate: string;
  cycleDay: number;
  cycleLength: number; // typical 21 days
  fertileWindowStart?: string;
  fertileWindowEnd?: string;
  notes?: string;
}

// Listing
export interface Listing {
  id: string;
  petId: string;
  ownerId: string;
  ownerRole: UserRole;
  type: 'adoption' | 'stud' | 'litter_announcement';
  title: string;
  description: string;
  price: number; // in EUR cents
  deposit?: number; // in EUR cents
  status: 'draft' | 'live' | 'reserved' | 'closed';
  city: string;
  country: string;
  photos: string[];
  availableDate?: string;
  pupsAvailable?: number;
  views: number;
  createdAt: string;
}

// Message
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
  read: boolean;
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'litter_alert' | 'price_alert' | 'shelter_urgent' | 'vet_reminder' | 'message' | 'match';
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

// Contract
export interface Contract {
  id: string;
  litterId: string;
  breederId: string;
  buyerId: string;
  status: 'draft' | 'sent' | 'signed' | 'completed';
  priceEUR: number;
  depositEUR: number;
  healthGuaranteeDays: number;
  deliveryCity: string;
  pdfUrl?: string;
  breederSignature?: Signature;
  buyerSignature?: Signature;
  createdAt: string;
}

export interface Signature {
  name: string;
  signedAt: string;
}
