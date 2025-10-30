// Swipe Engine - Inspired by dating app best practices
// Manages daily swipe limits, duplicate prevention, and card deck algorithm

import { supabase } from './supabase';

export const SWIPE_LIMITS = {
  FREE_DAILY: 10,
  PREMIUM_DAILY: 999, // Effectively unlimited
};

export interface SwipeAction {
  user_id: string;
  target_id: string; // listing_id or stud_id
  target_type: 'listing' | 'stud';
  action: 'like' | 'pass';
  swipe_date: string;
}

// Check daily swipe limit
export const checkDailySwipeLimit = async (
  userId: string,
  isPremium: boolean = false
): Promise<{ canSwipe: boolean; remaining: number }> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Count swipes today
    const { count, error } = await supabase
      .from('stud_interests')
      .select('*', { count: 'exact', head: true })
      .eq('breeder_id', userId)
      .gte('created_at', today);

    if (error) throw error;

    const swipeCount = count || 0;
    const limit = isPremium ? SWIPE_LIMITS.PREMIUM_DAILY : SWIPE_LIMITS.FREE_DAILY;
    const remaining = Math.max(0, limit - swipeCount);

    return {
      canSwipe: swipeCount < limit,
      remaining,
    };
  } catch (error) {
    console.error('Error checking swipe limit:', error);
    return { canSwipe: true, remaining: 0 }; // Fail open
  }
};

// Check if user already swiped this target today
export const hasSwipedToday = async (
  userId: string,
  targetId: string,
  targetType: 'listing' | 'stud'
): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    if (targetType === 'stud') {
      const { data, error } = await supabase
        .from('stud_interests')
        .select('id')
        .eq('breeder_id', userId)
        .eq('stud_id', targetId)
        .gte('created_at', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } else {
      // For listings, check messages or a swipes table
      // For MVP, we'll just return false
      return false;
    }
  } catch (error) {
    console.error('Error checking duplicate swipe:', error);
    return false; // Fail open
  }
};

// Record a swipe action
export const recordSwipe = async (
  userId: string,
  targetId: string,
  targetType: 'listing' | 'stud',
  action: 'like' | 'pass'
): Promise<boolean> => {
  try {
    if (targetType === 'stud') {
      const { error } = await supabase.from('stud_interests').insert({
        breeder_id: userId,
        stud_id: targetId,
        status: action === 'like' ? 'interested' : 'passed',
      });

      if (error) throw error;

      // If "like", send notification to stud owner
      if (action === 'like') {
        const { data: stud } = await supabase
          .from('pets')
          .select('owner_id, name')
          .eq('id', targetId)
          .single();

        if (stud) {
          await supabase.from('notifications').insert({
            user_id: stud.owner_id,
            type: 'stud_match',
            title: 'New Stud Interest! 🐾',
            body: `Someone is interested in ${stud.name} for breeding`,
            data: { stud_id: targetId, breeder_id: userId },
            read: false,
          });
        }
      }

      return true;
    }

    return true;
  } catch (error) {
    console.error('Error recording swipe:', error);
    return false;
  }
};

// Get card deck for swiping
export const getCardDeck = async (
  userId: string,
  targetType: 'listing' | 'stud',
  preferences?: {
    species?: string;
    breed?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
  }
): Promise<any[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    if (targetType === 'stud') {
      // Get available studs, excluding already swiped today
      let query = supabase
        .from('pets')
        .select('*, owner:users!pets_owner_id_fkey(full_name, city, kennel_name)')
        .eq('status', 'stud_available')
        .neq('owner_id', userId) // Don't show own pets
        .order('created_at', { ascending: false })
        .limit(20);

      if (preferences?.species) {
        query = query.eq('species', preferences.species);
      }

      if (preferences?.breed) {
        query = query.eq('breed', preferences.breed);
      }

      const { data: studs, error } = await query;

      if (error) throw error;

      // Filter out already swiped today
      const swipedIds = await getSwipedIdsToday(userId);
      const filteredStuds = studs?.filter(s => !swipedIds.includes(s.id)) || [];

      return filteredStuds;
    } else {
      // Get active listings
      let query = supabase
        .from('listings')
        .select('*, pet:pets!listings_pet_id_fkey(*), owner:users!listings_owner_id_fkey(*)')
        .eq('status', 'live')
        .neq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (preferences?.species) {
        query = query.eq('pets.species', preferences.species);
      }

      if (preferences?.minPrice) {
        query = query.gte('price', preferences.minPrice);
      }

      if (preferences?.maxPrice) {
        query = query.lte('price', preferences.maxPrice);
      }

      const { data: listings, error } = await query;

      if (error) throw error;

      return listings || [];
    }
  } catch (error) {
    console.error('Error fetching card deck:', error);
    return [];
  }
};

// Get IDs of targets swiped today
const getSwipedIdsToday = async (userId: string): Promise<string[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('stud_interests')
      .select('stud_id')
      .eq('breeder_id', userId)
      .gte('created_at', today);

    if (error) throw error;

    return data?.map(d => d.stud_id) || [];
  } catch (error) {
    console.error('Error fetching swiped IDs:', error);
    return [];
  }
};

// Premium feature check
export const getUserPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // For now, registered breeders are "premium"
    return data?.role === 'breeder_registered';
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};
