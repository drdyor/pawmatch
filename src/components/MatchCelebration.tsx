import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { PALETTE } from '../theme/palette';

// Lottie is optional - component works with or without it
let LottieView: any = null;
try {
  LottieView = require('lottie-react-native').default;
} catch (e) {
  // Lottie not installed yet - will use emoji fallback
}

interface MatchCelebrationProps {
  visible: boolean;
  name: string;
  onClose: () => void;
}

export function MatchCelebration({ visible, name, onClose }: MatchCelebrationProps) {
  const animationRef = useRef<LottieView | null>(null);
  const [hasConfetti, setHasConfetti] = React.useState(false);

  useEffect(() => {
    // Try to load confetti animation (optional)
    try {
      require('../../assets/confetti.json');
      setHasConfetti(true);
    } catch (e) {
      // Confetti file doesn't exist - use emoji fallback
      setHasConfetti(false);
    }
    
    if (visible && animationRef.current && hasConfetti) {
      animationRef.current.play();
    }
  }, [visible, hasConfetti]);

  return (
    <Modal 
      transparent 
      visible={visible} 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Confetti Animation - Only shows if confetti.json exists */}
          {hasConfetti && (
            <LottieView
              ref={animationRef}
              source={require('../../assets/confetti.json')}
              loop={false}
              style={{ width: 180, height: 180 }}
              autoPlay
            />
          )}
          
          {/* Fallback celebration emoji */}
          {!hasConfetti && (
            <Text style={styles.emoji}>🎉✨🎊</Text>
          )}

          <Text style={styles.title}>It's a Match!</Text>
          <Text style={styles.sub}>You and {name} are perfect together.</Text>
          
          <TouchableOpacity onPress={onClose} style={styles.btn}>
            <Text style={styles.btnText}>Start Conversation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    ...PALETTE.SHADOW?.card,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: PALETTE.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  sub: {
    color: PALETTE.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: PALETTE.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
