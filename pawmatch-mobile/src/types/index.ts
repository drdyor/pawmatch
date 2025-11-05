// User Roles
export type UserRole = 'breeder_registered' | 'breeder_independent' | 'buyer' | 'vet';

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
  clinicName?: string;
  isFirstTimeBreeder?: boolean;
  profilePhoto?: string;
  
  // Buyer adoption preferences
  preferredSpecies?: 'dog' | 'cat' | 'both';
  preferredDogSize?: 'small' | 'medium' | 'large' | 'any';
  preferredAge?: 'young' | 'adult' | 'senior' | 'any';
  
  createdAt: string;
}

// Pet (matches Paws database schema - snake_case)
export interface Pet {
  id: string;
  owner_user_id: string; // DB uses snake_case
  owner_role: UserRole;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  breed_id?: string;
  sex: 'male' | 'female';
  date_of_birth: string; // DB uses snake_case
  weight?: number;
  size?: 'small' | 'medium' | 'large';
  photos: string[];
  status: 'available' | 'reserved' | 'adopted' | 'stud_available' | 'in_heat' | 'at_risk';
  city: string;
  country: string;
  description?: string;
  adopted_at?: string; // DB uses snake_case
  geo?: any; // PostGIS geography type
  at_risk_until?: string;
  litter_id?: string;
  created_at: string; // DB uses snake_case
  updated_at?: string;
  
  // Aliases for backwards compatibility
  ownerId?: string; // @deprecated - use owner_user_id
  ownerRole?: UserRole; // @deprecated - use owner_role
  dateOfBirth?: string; // @deprecated - use date_of_birth
  createdAt?: string; // @deprecated - use created_at
  healthRecords?: HealthRecord[]; // Joined data
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

// Heat Cycle (matches Paws database schema - snake_case)
export interface HeatCycle {
  id: string;
  pet_id: string; // DB uses snake_case
  heat_start_date: string; // DB uses snake_case
  estimated_ovulation?: string;
  fertile_window_start?: string; // DB uses snake_case
  fertile_window_end?: string; // DB uses snake_case
  next_heat_estimate?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  
  // Aliases for backwards compatibility
  petId?: string; // @deprecated
  startDate?: string; // @deprecated
  cycleDay?: number; // @deprecated
  cycleLength?: number; // @deprecated
  fertileWindowStart?: string; // @deprecated
  fertileWindowEnd?: string; // @deprecated
  notificationsSent?: boolean; // @deprecated
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
  type: 'litter_alert' | 'price_alert' | 'shelter_urgent' | 'vet_reminder' | 'message' | 'match' | 'heat_notification';
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

// Stud Interest (for heat notifications)
export interface StudInterest {
  id: string;
  heatCycleId: string;
  femalePetId: string;
  studPetId: string;
  studOwnerId: string;
  status: 'pending' | 'interested' | 'declined';
  message?: string;
  createdAt: string;
}
