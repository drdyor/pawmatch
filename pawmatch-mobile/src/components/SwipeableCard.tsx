import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, PanResponder, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { Pet } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface SwipeableCardProps {
  pet: Pet;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function SwipeableCard({ pet, onSwipeLeft, onSwipeRight }: SwipeableCardProps) {
  const position = useRef(new Animated.ValueXY()).current;
  const swipeDirection = useRef<'left' | 'right' | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
        
        // Determine swipe direction
        if (gesture.dx > 30) {
          swipeDirection.current = 'right';
        } else if (gesture.dx < -30) {
          swipeDirection.current = 'left';
        } else {
          swipeDirection.current = null;
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe right - like
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe left - pass
          forceSwipe('left');
        } else {
          // Return to center
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (direction === 'right') {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
      position.setValue({ x: 0, y: 0 });
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
      outputRange: ['-15deg', '0deg', '15deg'],
      extrapolate: 'clamp',
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const getLikeOpacity = () => {
    return position.x.interpolate({
      inputRange: [0, SCREEN_WIDTH * 0.25],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  };

  const getNopeOpacity = () => {
    return position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 0.25, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
  };

  const getAge = () => {
    if (!pet.dateOfBirth) return 'Unknown age';
    const today = new Date();
    const birthDate = new Date(pet.dateOfBirth);
    const years = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    return `${years} ${years === 1 ? 'year' : 'years'} old`;
  };

  return (
    <Animated.View style={[styles.card, getCardStyle()]} {...panResponder.panHandlers}>
      {/* LIKE overlay */}
      <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: getLikeOpacity() }]}>
        <Text style={styles.overlayText}>INTERESTED</Text>
      </Animated.View>

      {/* NOPE overlay */}
      <Animated.View style={[styles.overlay, styles.nopeOverlay, { opacity: getNopeOpacity() }]}>
        <Text style={styles.overlayText}>PASS</Text>
      </Animated.View>

      {/* Card content */}
      <View style={styles.imageContainer}>
        {pet.photos && pet.photos.length > 0 ? (
          <Image source={{ uri: pet.photos[0] }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderEmoji}>🐕</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.age}>{getAge()}</Text>
        </View>

        <Text style={styles.breed}>{pet.breed}</Text>

        <View style={styles.details}>
          <Detail icon="📍" text={pet.city || 'Malta'} />
          {pet.weight && <Detail icon="⚖️" text={`${pet.weight}kg`} />}
          {pet.size && <Detail icon="📏" text={pet.size} />}
        </View>

        {pet.healthRecords && pet.healthRecords.length > 0 && (
          <View style={styles.healthBadges}>
            {pet.healthRecords.slice(0, 3).map((record, index) => (
              <View key={index} style={styles.healthBadge}>
                <Text style={styles.healthBadgeText}>✓ {record.title}</Text>
              </View>
            ))}
          </View>
        )}

        {pet.description && (
          <Text style={styles.description} numberOfLines={3}>
            {pet.description}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

function Detail({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: '85%',
    backgroundColor: colors.background,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    zIndex: 10,
    padding: 20,
    borderRadius: 16,
    borderWidth: 4,
  },
  likeOverlay: {
    right: 30,
    borderColor: colors.success,
    transform: [{ rotate: '20deg' }],
  },
  nopeOverlay: {
    left: 30,
    borderColor: colors.danger,
    transform: [{ rotate: '-20deg' }],
  },
  overlayText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.background,
  },
  imageContainer: {
    height: '60%',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  age: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  breed: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
  },
  healthBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  healthBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  healthBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
