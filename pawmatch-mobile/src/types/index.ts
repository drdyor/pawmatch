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
  
  // Buyer adoption preferences
  preferredSpecies?: 'dog' | 'cat' | 'both';
  preferredDogSize?: 'small' | 'medium' | 'large' | 'any';
  preferredAge?: 'young' | 'adult' | 'senior' | 'any';
  
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
  age_months?: number; // Calculated age for display
  weight?: number;
  size?: 'small' | 'medium' | 'large'; // For dogs
  photos: string[];
  healthRecords: HealthRecord[];
  health_badges?: string[]; // e.g., ['vet_checked', 'dna_verified']
  status: 'available' | 'reserved' | 'adopted' | 'stud_available' | 'in_heat' | 'at_risk';
  city: string;
  country: string; // Current location
  origin_country?: string; // Original country (important for breeding to avoid inbreeding)
  listing_type?: 'breeding' | 'adoption' | 'sale' | 'playdate'; // What the pet/listing is for
  available_for_breeding?: boolean;
  description?: string;
  createdAt: string;
  // Shelter-specific metadata
  metadata?: {
    safeForChildren?: boolean | null; // true = safe, false = not safe, null = unknown
    temperament?: string[];
    personality?: string[];
    urgent?: boolean;
    urgencyReasons?: string[];
    euthanasiaDate?: string;
  };
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
  notificationsSent?: boolean; // Track if stud notifications sent
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

// Breeding Reimbursement Types
export type BreedingReimbursement = 'pick_of_litter' | 'half_litter' | 'financial' | 'service_trade';

export interface BreedingTerms {
  reimbursement: BreedingReimbursement;
  financialAmount?: number;
  serviceDetails?: string;
  healthRequirements: string[];
  contractRequired: boolean;
}

// Community Pairing (Arranged Marriage feature)
export interface CommunityPairing {
  id: string;
  malePet: Pet;
  femalePet: Pet;
  requestedBy: string; // The user who suggested the pair
  votes: number;
  waitlist: string[]; // Array of user IDs on the waitlist
  createdAt: string;
}
