import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RoleSelectScreen } from './RoleSelectScreen';
import { PetQuickAddScreen } from './PetQuickAddScreen';
import { CatHealthGateScreen } from './CatHealthGateScreen';
import { HeatTrackerScreen } from './HeatTrackerScreen';
import { SwipePreviewScreen } from './SwipePreviewScreen';
import { DashboardScreen } from './DashboardScreen';
import { VetIntroScreen } from './VetIntroScreen';
import { VetDashboardScreen } from './VetDashboardScreen';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  role: string;
  pets?: any[];
  heatMatch?: boolean;
  clinic?: any;
  patients?: any[];
  initialTab?: string;
  fivFlow?: 'vet' | 'upload';
}

// Helper function to check if any cats need FIV/FeLV test
function requiresCatGate(pets: any[] = []) {
  return pets.some(
    (p) =>
      p.species === 'Cat' &&
      !(p.badges && p.badges.fiv_felv === true)
  );
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({ role: 'independent' });

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const role = data.role;
  const needsCatGate = requiresCatGate(data.pets || []);

  // Independent/Breeder/Buyer/Shelter flow
  if (role !== 'vet') {
    if (step === 0) {
      return (
        <RoleSelectScreen
          onNext={(d) => {
            updateData(d);
            setStep(1);
          }}
        />
      );
    }
    if (step === 1) {
      return (
        <PetQuickAddScreen
          onBack={() => setStep(0)}
          onNext={(d) => {
            updateData(d);
            // Check if we need cat health gate
            if (requiresCatGate(d.pets)) {
              setStep(2); // Go to CatHealthGate
            } else {
              setStep(3); // Skip to HeatTracker
            }
          }}
        />
      );
    }
    // Cat Health Gate (only if user has cats without FIV/FeLV badge)
    if (step === 2 && needsCatGate) {
      return (
        <CatHealthGateScreen
          onBack={() => setStep(1)}
          onNext={(d) => {
            updateData(d);
            setStep(3);
          }}
        />
      );
    }
    if (step === 3) {
      return (
        <HeatTrackerScreen
          onBack={() => (needsCatGate ? setStep(2) : setStep(1))}
          onNext={(d) => {
            updateData(d);
            setStep(4);
          }}
        />
      );
    }
    if (step === 4) {
      return (
        <SwipePreviewScreen
          onBack={() => setStep(3)}
          onNext={(d) => {
            updateData(d);
            setStep(5);
          }}
        />
      );
    }
    if (step === 5) {
      return <DashboardScreen initialTab={data.initialTab} />;
    }
  }

  // Vet flow
  if (role === 'vet') {
    if (step === 0) {
      return (
        <RoleSelectScreen
          onNext={(d) => {
            updateData(d);
            setStep(1);
          }}
        />
      );
    }
    if (step === 1) {
      return (
        <VetIntroScreen
          onBack={() => setStep(0)}
          onNext={(d) => {
            updateData(d);
            setStep(2);
          }}
        />
      );
    }
    if (step === 2) {
      return <VetDashboardScreen />;
    }
  }

  // Default fallback
  return (
    <RoleSelectScreen
      onNext={(d) => {
        updateData(d);
        setStep(1);
      }}
    />
  );
}

// Styles removed - not used
