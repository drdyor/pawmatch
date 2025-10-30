import React, { useState } from 'react';

// Mobile frame wrapper
const Mobile = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-amber-50 to-rose-50 p-6">
    <div className="relative w-[390px] max-w-full bg-white rounded-[28px] shadow-xl ring-1 ring-black/5 overflow-hidden">
      {/* mobile notch */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-6 w-40 bg-black/10 rounded-b-2xl z-50" />
      {children}
    </div>
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm ${className}`}>{children}</div>
);

const Chip = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 border transition shadow-sm ${
      active
        ? "bg-amber-500 text-white border-amber-500"
        : "bg-white border-neutral-200 hover:border-neutral-300"
    }`}
  >
    {children}
  </button>
);

interface Pet {
  id: string;
  name: string;
  breed: string;
  img: string;
  votes: number;
}

const popularPets: Pet[] = [
  { id: '1', name: 'Luna', breed: 'Border Collie', img: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop', votes: 500 },
  { id: '2', name: 'Max', breed: 'Border Collie', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop', votes: 320 },
  { id: '3', name: 'Bella', breed: 'Golden Retriever', img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop', votes: 180 },
  { id: '4', name: 'Charlie', breed: 'Labrador', img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=400&fit=crop', votes: 95 },
];

const trendingPairs = [
  {
    petA: { name: 'Luna', breed: 'Border Collie', img: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=300&h=200&fit=crop' },
    petB: { name: 'Max', breed: 'Border Collie', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300&h=200&fit=crop' },
    votes: 250,
    preOrders: 50,
  },
  {
    petA: { name: 'Bella', breed: 'Golden Retriever', img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=300&h=200&fit=crop' },
    petB: { name: 'Charlie', breed: 'Labrador', img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=300&h=200&fit=crop' },
    votes: 120,
    preOrders: 15,
  },
];

export const VotingPage: React.FC = () => {
  const [tab, setTab] = useState<'popular' | 'pairs'>('popular');
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [showCommitment, setShowCommitment] = useState<number | null>(null);

  const toggleVote = (id: string) => {
    setVoted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Mobile>
      <div className="px-5 pt-10 pb-6 h-[800px] overflow-y-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🐾</span>
            <h1 className="text-2xl font-bold text-neutral-900">PawMatch</h1>
          </div>
          <p className="text-neutral-600 text-sm">Vote for puppies you want to see in Malta!</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-neutral-100 rounded-2xl">
          <button
            onClick={() => setTab('popular')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm ${
              tab === 'popular'
                ? 'bg-white shadow-sm text-neutral-900'
                : 'text-neutral-600'
            }`}
          >
            🔥 Popular
          </button>
          <button
            onClick={() => setTab('pairs')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all text-sm ${
              tab === 'pairs'
                ? 'bg-white shadow-sm text-neutral-900'
                : 'text-neutral-600'
            }`}
          >
            💛 Dream Pairs
          </button>
        </div>

        {/* Content */}
        {tab === 'popular' && (
          <div className="space-y-4">
            {popularPets.map(pet => (
              <Card key={pet.id} className="overflow-hidden">
                <div className="h-48 bg-neutral-100 relative">
                  <img src={pet.img} alt={pet.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900">{pet.name}</h3>
                      <p className="text-sm text-neutral-600">{pet.breed}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl">🔥</span>
                      <span className="font-bold text-neutral-900">{pet.votes + (voted[pet.id] ? 1 : 0)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleVote(pet.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      voted[pet.id]
                        ? 'bg-amber-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {voted[pet.id] ? '💛 Voted' : '🤍 Vote for puppies'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'pairs' && (
          <div className="space-y-4">
            {trendingPairs.map((pair, idx) => (
              <Card key={idx} className="overflow-hidden border-2 border-amber-500">
                {/* Photos */}
                <div className="flex h-32">
                  <div className="flex-1 bg-neutral-100">
                    <img src={pair.petA.img} alt={pair.petA.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 bg-neutral-100">
                    <img src={pair.petB.img} alt={pair.petB.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                
                {/* Heart overlay */}
                <div className="relative -mt-5 flex justify-center">
                  <div className="bg-white rounded-full p-2 shadow-lg border-2 border-amber-500">
                    <span className="text-2xl">💛</span>
                  </div>
                </div>

                <div className="p-4 pt-2">
                  <h3 className="text-center font-bold text-lg text-neutral-900 mb-1">
                    {pair.petA.name} × {pair.petB.name}
                  </h3>
                  <p className="text-center text-sm text-neutral-600 mb-3">
                    {pair.petA.breed} + {pair.petB.breed}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-center gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-900">{pair.votes}</div>
                      <div className="text-xs text-neutral-600">votes</div>
                    </div>
                    {pair.preOrders > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">{pair.preOrders}</div>
                        <div className="text-xs text-neutral-600">pre-orders!</div>
                      </div>
                    )}
                  </div>

                  {showCommitment === idx ? (
                    <div className="space-y-2">
                      <p className="text-center text-sm font-medium text-neutral-700 mb-3">How interested?</p>
                      <button
                        onClick={() => setShowCommitment(null)}
                        className="w-full py-3 rounded-xl font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition"
                      >
                        👀 Interested
                      </button>
                      <button
                        onClick={() => setShowCommitment(null)}
                        className="w-full py-3 rounded-xl font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition"
                      >
                        💛 Very Interested
                      </button>
                      <button
                        onClick={() => setShowCommitment(null)}
                        className="w-full py-3 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600 transition"
                      >
                        🎯 Reserve a Puppy!
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCommitment(idx)}
                      className="w-full py-3 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600 transition"
                    >
                      💛 I want these puppies!
                    </button>
                  )}
                </div>

                {pair.votes >= 100 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    🔥 TRENDING
                  </div>
                )}
              </Card>
            ))}

            {/* Info box */}
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">💡</span>
                <div>
                  <h4 className="font-semibold text-neutral-900 text-sm mb-2">How it works:</h4>
                  <ul className="space-y-1 text-xs text-neutral-700">
                    <li>• Vote for pairs you'd love to see</li>
                    <li>• Both owners get notified</li>
                    <li>• Pre-order shows serious demand</li>
                    <li>• Owners decide if they breed!</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Mobile>
  );
};
