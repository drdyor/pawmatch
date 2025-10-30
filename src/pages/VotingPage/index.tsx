import React, { useState } from 'react';

type Pet = { 
  id: string; 
  name: string; 
  breed: string; 
  img: string; 
  votes: number; 
};

type Pair = { 
  id: string; 
  a: Pet; 
  b: Pet; 
  votes: number; 
  preorders: number; 
};

const demoPets: Pet[] = [
  { id: 'luna', name: 'Luna', breed: 'Border Collie (F)', img: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop', votes: 500 },
  { id: 'max', name: 'Max', breed: 'Border Collie (M)', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop', votes: 320 },
  { id: 'bella', name: 'Bella', breed: 'Golden Retriever (F)', img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop', votes: 210 },
  { id: 'charlie', name: 'Charlie', breed: 'Labrador (M)', img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=400&fit=crop', votes: 190 },
];

const demoPairs: Pair[] = [
  { 
    id: 'luna-max', 
    a: demoPets[0], 
    b: demoPets[1], 
    votes: 250, 
    preorders: 50 
  },
  { 
    id: 'bella-charlie', 
    a: demoPets[2], 
    b: demoPets[3], 
    votes: 140, 
    preorders: 18 
  },
];

function Tab({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl2 border transition
        ${active 
          ? 'bg-brand-card border-brand-accent text-white'
          : 'bg-transparent border-brand-border text-brand-sub hover:border-brand-accent/50'
        }`}
    >
      {children}
    </button>
  );
}

function Card({ children }: any) {
  return (
    <div className="rounded-xl2 border border-brand-border bg-brand-card hover:shadow-lift transition p-4">
      {children}
    </div>
  );
}

function VotePill({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border transition
        ${active 
          ? 'border-brand-accent bg-brand-accent/20 text-white'
          : 'border-brand-border text-brand-sub hover:border-brand-accent/50'
        }`}
    >
      💛 Vote
    </button>
  );
}

export const VotingPage: React.FC = () => {
  const [tab, setTab] = useState<'pets' | 'pairs'>('pets');
  const [pets, setPets] = useState<Pet[]>(demoPets);
  const [pairs, setPairs] = useState<Pair[]>(demoPairs);
  const [votedPetIds, setVotedPetIds] = useState<Set<string>>(new Set());
  const [votedPairIds, setVotedPairIds] = useState<Set<string>>(new Set());

  const togglePet = (id: string) => {
    const next = new Set(votedPetIds);
    const updated = pets.map(p => {
      if (p.id !== id) return p;
      if (next.has(id)) { 
        next.delete(id); 
        return { ...p, votes: Math.max(0, p.votes - 1) }; 
      }
      next.add(id); 
      return { ...p, votes: p.votes + 1 };
    });
    setVotedPetIds(next); 
    setPets(updated);
  };

  const togglePair = (id: string) => {
    const next = new Set(votedPairIds);
    const updated = pairs.map(pr => {
      if (pr.id !== id) return pr;
      if (next.has(id)) { 
        next.delete(id); 
        return { ...pr, votes: Math.max(0, pr.votes - 1) }; 
      }
      next.add(id); 
      return { ...pr, votes: pr.votes + 1 };
    });
    setVotedPairIds(next); 
    setPairs(updated);
  };

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">🔥 Community Voting</h1>
            <p className="text-brand-sub mt-1">
              Vote for the puppies you want to see. Owners get notified when demand spikes.
            </p>
          </div>
          <div className="flex gap-2">
            <Tab active={tab === 'pets'} onClick={() => setTab('pets')}>
              🔥 Popular Pets
            </Tab>
            <Tab active={tab === 'pairs'} onClick={() => setTab('pairs')}>
              💛 Dream Pairs
            </Tab>
          </div>
        </header>

        {tab === 'pets' && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map(p => {
              const active = votedPetIds.has(p.id);
              return (
                <Card key={p.id}>
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 overflow-hidden rounded-xl2 border border-brand-border flex-shrink-0">
                      <img 
                        src={p.img} 
                        alt={p.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-sm text-brand-sub truncate">{p.breed}</div>
                    </div>
                    <div className="ml-auto text-sm text-right">
                      <div className="text-brand-sub text-xs">want puppies</div>
                      <div className="font-semibold">{p.votes.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <VotePill active={active} onClick={() => togglePet(p.id)} />
                  </div>
                </Card>
              );
            })}
          </section>
        )}

        {tab === 'pairs' && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {pairs.map(pr => {
              const active = votedPairIds.has(pr.id);
              return (
                <Card key={pr.id}>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl2 overflow-hidden border border-brand-border flex-shrink-0">
                      <img 
                        src={pr.a.img} 
                        alt={pr.a.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-2xl">💛</div>
                    <div className="relative w-16 h-16 rounded-xl2 overflow-hidden border border-brand-border flex-shrink-0">
                      <img 
                        src={pr.b.img} 
                        alt={pr.b.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-sm text-brand-sub">votes</div>
                      <div className="font-semibold">{pr.votes.toLocaleString()}</div>
                      <div className="text-xs text-brand-sub mt-1">{pr.preorders} pre-orders</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-brand-sub truncate">
                      {pr.a.name} × {pr.b.name}
                    </div>
                    <VotePill active={active} onClick={() => togglePair(pr.id)} />
                  </div>
                </Card>
              );
            })}
          </section>
        )}

        <aside className="rounded-xl2 border border-brand-border p-4 text-sm text-brand-sub">
          <strong className="text-brand-text">How it works:</strong> Vote on pets or pairs → owners see demand → when they enable breeding, voters get notified and first dibs.
        </aside>
      </div>
    </main>
  );
};
