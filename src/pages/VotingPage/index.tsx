import React, { FC, useState } from 'react';
import { VotingCard, PairVotingCard } from '../../components/common/VotingCard';

export const VotingPage: FC = () => {
  const [activeTab, setActiveTab] = useState<'popular' | 'pairs'>('popular');
  
  // Demo voting data
  const popularPets = [
    { id: '1', name: 'Luna', breed: 'Border Collie', photo: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400', voteCount: 500, hasVoted: false },
    { id: '2', name: 'Max', breed: 'Border Collie', photo: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400', voteCount: 320, hasVoted: false },
    { id: '3', name: 'Bella', breed: 'Golden Retriever', photo: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400', voteCount: 180, hasVoted: false },
    { id: '4', name: 'Charlie', breed: 'Labrador', photo: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400', voteCount: 95, hasVoted: false },
  ];
  
  const trendingPairs = [
    {
      petA: { id: '1', name: 'Luna', breed: 'Border Collie', photo: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400', voteCount: 0 },
      petB: { id: '2', name: 'Max', breed: 'Border Collie', photo: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400', voteCount: 0 },
      voteCount: 250,
      preOrders: 50,
      hasVoted: false,
    },
    {
      petA: { id: '3', name: 'Bella', breed: 'Golden Retriever', photo: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400', voteCount: 0 },
      petB: { id: '4', name: 'Charlie', breed: 'Labrador', photo: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400', voteCount: 0 },
      voteCount: 120,
      preOrders: 15,
      hasVoted: false,
    },
  ];
  
  const handleVote = (petId: string) => {
    console.log('Voted for pet:', petId);
    // TODO: Implement vote API call
  };
  
  const handleUnvote = (petId: string) => {
    console.log('Unvoted pet:', petId);
    // TODO: Implement unvote API call
  };
  
  const handlePairVote = (petAId: string, petBId: string, commitment: string) => {
    console.log('Voted for pair:', petAId, petBId, 'with commitment:', commitment);
    // TODO: Implement pair vote API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🔥 Community Voting</h1>
          <p className="text-gray-600">
            Vote for the puppies you want to see in Malta!
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'popular'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🔥 Popular Pets
          </button>
          <button
            onClick={() => setActiveTab('pairs')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'pairs'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            💛 Dream Pairs
          </button>
        </div>
        
        {/* Content */}
        {activeTab === 'popular' && (
          <div>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-gray-800">Most Wanted Pets in Malta</h2>
              <p className="text-gray-600 text-sm mt-1">
                Vote for pets you'd love to see have puppies! Owners see the demand.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularPets.map((pet) => (
                <VotingCard
                  key={pet.id}
                  pet={pet}
                  onVote={handleVote}
                  onUnvote={handleUnvote}
                />
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'pairs' && (
          <div>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-gray-800">Dream Breeding Pairs</h2>
              <p className="text-gray-600 text-sm mt-1">
                Vote for pairings you'd love to see! Both owners get notified.
              </p>
            </div>
            <div className="space-y-4 max-w-2xl mx-auto">
              {trendingPairs.map((pair, index) => (
                <PairVotingCard
                  key={index}
                  pair={pair}
                  onVote={handlePairVote}
                />
              ))}
            </div>
            
            {/* Info Box */}
            <div className="mt-6 bg-white rounded-2xl p-6 border-2 border-primary-200 max-w-2xl mx-auto">
              <h3 className="font-bold text-gray-800 mb-2">💡 How it works:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span>1️⃣</span>
                  <span>Vote for pairs you'd love to see have puppies together</span>
                </li>
                <li className="flex gap-2">
                  <span>2️⃣</span>
                  <span>Both owners get notified when votes reach milestones (50, 100, 250+)</span>
                </li>
                <li className="flex gap-2">
                  <span>3️⃣</span>
                  <span>Pre-order option shows serious demand</span>
                </li>
                <li className="flex gap-2">
                  <span>4️⃣</span>
                  <span>Owners connect and decide if they want to breed!</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
