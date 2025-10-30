import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RoleSelectScreen } from './RoleSelectScreen';
import { PetQuickAddScreen } from './PetQuickAddScreen';
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
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({ role: 'independent' });

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const role = data.role;

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
            setStep(2);
          }}
        />
      );
    }
    if (step === 2) {
      return (
        <HeatTrackerScreen
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
        <SwipePreviewScreen
          onBack={() => setStep(2)}
          onNext={(d) => {
            updateData(d);
            setStep(4);
          }}
        />
      );
    }
    if (step === 4) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
