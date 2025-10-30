// Firebase/Firestore Seed Script
// Run this to populate demo data for testing

const admin = require('firebase-admin');

// Initialize (you'll need your serviceAccount.json)
// admin.initializeApp({
//   credential: admin.credential.cert(require('./serviceAccount.json'))
// });

const db = admin.firestore();

// ==========================================
// DEMO USERS
// ==========================================

const demoUsers = [
  {
    id: 'user_maria',
    email: 'maria@example.com',
    profile: {
      name: 'Maria Borg',
      location: 'Sliema',
      phone: '+356 7912 3456',
      role: 'independent_owner',
      breeding_intent: 'one_time',
      preferred_arrangement: 'share_puppies',
      avatar_url: 'https://i.pravatar.cc/150?img=5'
    }
  },
  {
    id: 'user_john',
    email: 'john@example.com',
    profile: {
      name: 'John Camilleri',
      location: 'Valletta',
      phone: '+356 7923 4567',
      role: 'independent_owner',
      breeding_intent: 'occasional',
      preferred_arrangement: 'pick_of_litter',
      avatar_url: 'https://i.pravatar.cc/150?img=12'
    }
  },
  {
    id: 'user_sarah',
    email: 'sarah@example.com',
    profile: {
      name: 'Sarah Vella',
      location: 'Gozo',
      phone: '+356 7934 5678',
      role: 'independent_owner',
      breeding_intent: 'experienced',
      preferred_arrangement: 'flexible',
      avatar_url: 'https://i.pravatar.cc/150?img=47'
    }
  },
  {
    id: 'user_breeder',
    email: 'breeder@example.com',
    profile: {
      name: 'David Zammit',
      location: 'Mosta',
      phone: '+356 7945 6789',
      role: 'breeder_professional',
      kennel_name: 'Malta Premier Kennels',
      registration_number: 'MKC-2018-045',
      years_experience: 12,
      preferred_arrangement: 'stud_fee',
      avatar_url: 'https://i.pravatar.cc/150?img=33'
    }
  },
  {
    id: 'user_shelter',
    email: 'shelter@example.com',
    profile: {
      name: 'Anna Farrugia',
      location: 'Birkirkara',
      phone: '+356 7956 7890',
      role: 'shelter',
      kennel_name: 'Paws of Malta Rescue',
      avatar_url: 'https://i.pravatar.cc/150?img=20'
    }
  },
  {
    id: 'user_buyer',
    email: 'buyer@example.com',
    profile: {
      name: 'Luke Azzopardi',
      location: 'St. Julians',
      phone: '+356 7967 8901',
      role: 'buyer',
      avatar_url: 'https://i.pravatar.cc/150?img=60'
    }
  }
];

// ==========================================
// DEMO PETS
// ==========================================

const demoPets = [
  // Maria's female dog (looking to breed)
  {
    id: 'pet_luna',
    owner_id: 'user_maria',
    name: 'Luna',
    species: 'dog',
    breed: 'Border Collie',
    sex: 'female',
    date_of_birth: '2020-03-15',
    size: 'medium',
    weight_kg: 18.5,
    color: 'Black & White',
    temperament: ['friendly', 'energetic', 'intelligent', 'playful'],
    health_status: 'healthy',
    vaccinated: true,
    spayed_neutered: false,
    dna_tested: true,
    hip_score: 'A',
    available_for_breeding: true,
    breeding_history: 0,
    photos: [
      'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'
    ],
    primary_photo: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400',
    description: 'Beautiful, healthy Border Collie. First-time breeding. Looking for a compatible male with great temperament!'
  },
  
  // John's male stud
  {
    id: 'pet_max',
    owner_id: 'user_john',
    name: 'Max',
    species: 'dog',
    breed: 'Border Collie',
    sex: 'male',
    date_of_birth: '2019-06-20',
    size: 'medium',
    weight_kg: 22.0,
    color: 'Tri-color',
    temperament: ['calm', 'friendly', 'loyal', 'gentle'],
    health_status: 'healthy',
    vaccinated: true,
    spayed_neutered: false,
    dna_tested: true,
    hip_score: 'A',
    genetic_conditions: [],
    available_for_breeding: true,
    breeding_history: 2,
    proven_parent: true,
    stud_fee_eur: 300,
    stud_terms: 'Open to pick of litter or 50/50 split. Previous litters: 6-8 healthy puppies.',
    photos: [
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
      'https://images.unsplash.com/photo-1529472119196-cb724127a98e?w=400'
    ],
    primary_photo: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
    description: 'Proven stud. 2 previous litters, all healthy puppies. Great with kids. Excellent temperament.'
  },
  
  // Sarah's female cat
  {
    id: 'pet_bella',
    owner_id: 'user_sarah',
    name: 'Bella',
    species: 'cat',
    breed: 'Ragdoll',
    sex: 'female',
    date_of_birth: '2021-01-10',
    size: 'medium',
    weight_kg: 4.8,
    color: 'Seal Point',
    temperament: ['calm', 'affectionate', 'gentle'],
    health_status: 'healthy',
    vaccinated: true,
    spayed_neutered: false,
    available_for_breeding: true,
    breeding_history: 1,
    proven_parent: true,
    photos: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400'
    ],
    primary_photo: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400',
    description: 'Ragdoll queen with one successful litter. Looking for Ragdoll male.'
  },
  
  // Professional Breeder's studs
  {
    id: 'pet_champion',
    owner_id: 'user_breeder',
    name: 'Champion Zeus',
    species: 'dog',
    breed: 'German Shepherd',
    sex: 'male',
    date_of_birth: '2018-04-12',
    size: 'large',
    weight_kg: 38.0,
    color: 'Black & Tan',
    temperament: ['protective', 'intelligent', 'loyal', 'confident'],
    health_status: 'healthy',
    vaccinated: true,
    spayed_neutered: false,
    dna_tested: true,
    hip_score: 'A',
    genetic_conditions: [],
    available_for_breeding: true,
    breeding_history: 8,
    proven_parent: true,
    stud_fee_eur: 800,
    stud_terms: 'Professional stud service. Pedigree papers provided. Stud fee or pick of litter.',
    photos: [
      'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400'
    ],
    primary_photo: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400',
    description: 'Champion bloodline. 8 successful litters. All puppies placed in excellent homes.'
  },
  
  // Shelter rescue (not for breeding)
  {
    id: 'pet_rescue_charlie',
    owner_id: 'user_shelter',
    name: 'Charlie',
    species: 'dog',
    breed: 'Mixed Breed',
    sex: 'male',
    date_of_birth: '2022-08-05',
    size: 'medium',
    weight_kg: 16.0,
    color: 'Brown',
    temperament: ['friendly', 'playful', 'energetic'],
    health_status: 'healthy',
    vaccinated: true,
    spayed_neutered: true, // Shelter animals are fixed
    available_for_breeding: false,
    photos: [
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400'
    ],
    primary_photo: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400',
    description: 'Sweet rescue looking for a loving home. Great with kids and other dogs!'
  },
  
  // More breeding pairs
  {
    id: 'pet_ruby',
    owner_id: 'user_maria',
    name: 'Ruby',
    species: 'dog',
    breed: 'Golden Retriever',
    sex: 'female',
    date_of_birth: '2019-11-20',
    size: 'large',
    weight_kg: 28.0,
    color: 'Golden',
    temperament: ['gentle', 'friendly', 'calm', 'loyal'],
    health_status: 'healthy',
    vaccinated: true,
    spayed_neutered: false,
    available_for_breeding: true,
    breeding_history: 0,
    photos: [
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400'
    ],
    primary_photo: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
    description: 'Sweet Golden Retriever. Never bred before. Looking for compatible male.'
  }
];

// ==========================================
// DEMO HEAT CYCLES
// ==========================================

const demoHeatCycles = [
  {
    id: 'heat_luna_current',
    pet_id: 'pet_luna',
    start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Started 5 days ago
    status: 'active',
    matchmaking_enabled: true,
    looking_for_breeds: ['Border Collie', 'Australian Shepherd'],
    notes: 'First heat cycle for breeding. Luna is in great health!'
  }
];

// ==========================================
// DEMO SWIPES & MATCHES
// ==========================================

const demoSwipes = [
  // Maria (Luna) swiped right on Max
  {
    id: 'swipe_1',
    swiper_id: 'user_maria',
    swiped_pet_id: 'pet_max',
    direction: 'right'
  },
  // John (Max) swiped right on Luna -> MATCH!
  {
    id: 'swipe_2',
    swiper_id: 'user_john',
    swiped_pet_id: 'pet_luna',
    direction: 'right'
  }
];

const demoMatches = [
  {
    id: 'match_luna_max',
    pet_a_id: 'pet_luna',
    pet_b_id: 'pet_max',
    owner_a_id: 'user_maria',
    owner_b_id: 'user_john',
    matched_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'chatting',
    arrangement_type: 'share_puppies',
    arrangement_details: 'Maria gets first pick, then alternate. Split 50/50.',
    expected_puppies: 6,
    expected_birth_date: new Date(Date.now() + 58 * 24 * 60 * 60 * 1000) // ~2 months
  }
];

// ==========================================
// DEMO MESSAGES
// ==========================================

const demoConversations = [
  {
    id: 'conv_maria_john',
    match_id: 'match_luna_max',
    participant_a_id: 'user_maria',
    participant_b_id: 'user_john'
  }
];

const demoMessages = [
  {
    conversation_id: 'conv_maria_john',
    sender_id: 'user_maria',
    content: 'Hi John! Luna and Max would make beautiful puppies! 🐾',
    read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    conversation_id: 'conv_maria_john',
    sender_id: 'user_john',
    content: 'Hi Maria! I agree! Max has had 2 litters before, all healthy puppies. What arrangement were you thinking?',
    read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)
  },
  {
    conversation_id: 'conv_maria_john',
    sender_id: 'user_maria',
    content: 'This is Luna\'s first time. I was hoping to keep 2-3 puppies for myself and friends. Could you take first pick and we split the rest?',
    read: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    conversation_id: 'conv_maria_john',
    sender_id: 'user_john',
    content: 'That sounds fair! Want to meet at the Sliema dog park this weekend so they can meet first?',
    read: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
  },
  {
    conversation_id: 'conv_maria_john',
    sender_id: 'user_maria',
    content: 'Perfect! Sunday at 10am? I\'ll bring Luna\'s health records too.',
    read: false,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
];

// ==========================================
// SEED FUNCTION
// ==========================================

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');
  
  try {
    // 1. Seed Users & Profiles
    console.log('📝 Creating users and profiles...');
    for (const user of demoUsers) {
      await db.collection('users').doc(user.id).set({
        email: user.email,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      
      await db.collection('profiles').doc(user.id).set({
        ...user.profile,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ Created ${demoUsers.length} users\n`);
    
    // 2. Seed Pets
    console.log('🐕 Creating pets...');
    for (const pet of demoPets) {
      await db.collection('pets').doc(pet.id).set({
        ...pet,
        date_of_birth: admin.firestore.Timestamp.fromDate(new Date(pet.date_of_birth)),
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ Created ${demoPets.length} pets\n`);
    
    // 3. Seed Heat Cycles
    console.log('📅 Creating heat cycles...');
    for (const cycle of demoHeatCycles) {
      await db.collection('heat_cycles').doc(cycle.id).set({
        ...cycle,
        start_date: admin.firestore.Timestamp.fromDate(cycle.start_date),
        fertile_start: admin.firestore.Timestamp.fromDate(
          new Date(cycle.start_date.getTime() + 7 * 24 * 60 * 60 * 1000)
        ),
        fertile_end: admin.firestore.Timestamp.fromDate(
          new Date(cycle.start_date.getTime() + 14 * 24 * 60 * 60 * 1000)
        ),
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ Created ${demoHeatCycles.length} heat cycles\n`);
    
    // 4. Seed Swipes
    console.log('👈 Creating swipes...');
    for (const swipe of demoSwipes) {
      await db.collection('swipes').doc(swipe.id).set({
        ...swipe,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ Created ${demoSwipes.length} swipes\n`);
    
    // 5. Seed Matches
    console.log('💛 Creating matches...');
    for (const match of demoMatches) {
      await db.collection('matches').doc(match.id).set({
        ...match,
        matched_at: admin.firestore.Timestamp.fromDate(match.matched_at),
        expected_birth_date: admin.firestore.Timestamp.fromDate(match.expected_birth_date),
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ Created ${demoMatches.length} matches\n`);
    
    // 6. Seed Conversations
    console.log('💬 Creating conversations...');
    for (const conv of demoConversations) {
      await db.collection('conversations').doc(conv.id).set({
        ...conv,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log(`✅ Created ${demoConversations.length} conversations\n`);
    
    // 7. Seed Messages
    console.log('💌 Creating messages...');
    for (const message of demoMessages) {
      await db.collection('messages').add({
        ...message,
        created_at: admin.firestore.Timestamp.fromDate(message.created_at)
      });
    }
    console.log(`✅ Created ${demoMessages.length} messages\n`);
    
    console.log('🎉 Database seeding complete!\n');
    console.log('📊 Summary:');
    console.log(`   - ${demoUsers.length} users`);
    console.log(`   - ${demoPets.length} pets`);
    console.log(`   - ${demoHeatCycles.length} heat cycles`);
    console.log(`   - ${demoMatches.length} matches`);
    console.log(`   - ${demoMessages.length} messages`);
    console.log('\n✅ Ready to test the app!\n');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = { seedDatabase };
