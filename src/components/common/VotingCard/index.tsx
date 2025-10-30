import React, { useState } from 'react';
import { Colors, Spacing } from '../../../constants/colors';
import './styles.css';

interface Pet {
  id: string;
  name: string;
  breed: string;
  photo?: string;
  voteCount: number;
  hasVoted?: boolean;
}

interface VotingCardProps {
  pet: Pet;
  onVote: (petId: string) => void;
  onUnvote: (petId: string) => void;
}

export const VotingCard: React.FC<VotingCardProps> = ({ pet, onVote, onUnvote }) => {
  const [voted, setVoted] = useState(pet.hasVoted || false);
  const [count, setCount] = useState(pet.voteCount);

  const handleVote = () => {
    if (voted) {
      setVoted(false);
      setCount(count - 1);
      onUnvote(pet.id);
    } else {
      setVoted(true);
      setCount(count + 1);
      onVote(pet.id);
    }
  };

  return (
    <div className="voting-card">
      <div className="voting-card-photo">
        {pet.photo ? (
          <img src={pet.photo} alt={pet.name} />
        ) : (
          <div className="voting-card-placeholder">🐕</div>
        )}
      </div>
      
      <div className="voting-card-content">
        <div className="voting-card-info">
          <h3 className="voting-card-name">{pet.name}</h3>
          <p className="voting-card-breed">{pet.breed}</p>
        </div>
        
        <div className="voting-card-section">
          <div className="voting-card-count">
            <span className="voting-card-fire">🔥</span>
            <span className="voting-card-number">{count}</span>
            <span className="voting-card-label">want puppies</span>
          </div>
          
          <button
            className={`voting-card-button ${voted ? 'voting-card-button-active' : ''}`}
            onClick={handleVote}
          >
            {voted ? '💛 Voted' : '🤍 Vote'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface BreedingPair {
  petA: Pet;
  petB: Pet;
  voteCount: number;
  preOrders: number;
  hasVoted?: boolean;
}

interface PairVotingCardProps {
  pair: BreedingPair;
  onVote: (petAId: string, petBId: string, commitment: string) => void;
}

export const PairVotingCard: React.FC<PairVotingCardProps> = ({ pair, onVote }) => {
  const [showCommitment, setShowCommitment] = useState(false);

  const handleCommitment = (level: string) => {
    onVote(pair.petA.id, pair.petB.id, level);
    setShowCommitment(false);
  };

  return (
    <div className="pair-voting-card">
      <div className="pair-voting-photos">
        <div className="pair-photo">
          {pair.petA.photo ? (
            <img src={pair.petA.photo} alt={pair.petA.name} />
          ) : (
            <div className="pair-photo-placeholder">🐕</div>
          )}
        </div>
        <div className="pair-heart-overlay">
          <span className="pair-heart">💛</span>
        </div>
        <div className="pair-photo">
          {pair.petB.photo ? (
            <img src={pair.petB.photo} alt={pair.petB.name} />
          ) : (
            <div className="pair-photo-placeholder">🐕</div>
          )}
        </div>
      </div>
      
      <div className="pair-voting-content">
        <h3 className="pair-title">
          {pair.petA.name} × {pair.petB.name}
        </h3>
        <p className="pair-breeds">
          {pair.petA.breed} + {pair.petB.breed}
        </p>
        
        <div className="pair-stats">
          <div className="pair-stat">
            <span className="pair-stat-number">{pair.voteCount}</span>
            <span className="pair-stat-label">votes</span>
          </div>
          {pair.preOrders > 0 && (
            <div className="pair-stat">
              <span className="pair-stat-number pair-stat-preorder">{pair.preOrders}</span>
              <span className="pair-stat-label">pre-orders!</span>
            </div>
          )}
        </div>
        
        {!showCommitment ? (
          <button
            className="pair-vote-button"
            onClick={() => setShowCommitment(true)}
          >
            {pair.hasVoted ? '✅ Voted' : '💛 I want these puppies!'}
          </button>
        ) : (
          <div className="commitment-options">
            <p className="commitment-title">How interested?</p>
            <button
              className="commitment-button"
              onClick={() => handleCommitment('interested')}
            >
              👀 Interested
            </button>
            <button
              className="commitment-button"
              onClick={() => handleCommitment('very_interested')}
            >
              💛 Very Interested
            </button>
            <button
              className="commitment-button commitment-button-primary"
              onClick={() => handleCommitment('pre_order')}
            >
              🎯 Reserve a Puppy!
            </button>
          </div>
        )}
      </div>
      
      {pair.voteCount >= 100 && (
        <div className="trending-badge">
          🔥 TRENDING
        </div>
      )}
    </div>
  );
};
