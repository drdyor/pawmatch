import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';

// FCI Breed structure
export interface FCIBreed {
  id: number;
  name: string;
  group: string;
  section: string;
  country: string;
  image?: string;
}

// Load FCI breeds from CSV (parsed at build time)
const loadFCIBreeds = (): FCIBreed[] => {
  try {
    // In production, you'd parse the CSV here or convert it to JSON at build time
    // For now, we'll use require if available, or return empty array
    const breeds = require('../../assets/data/fci-breeds.csv');
    return breeds;
  } catch (error) {
    console.warn('FCI breeds CSV not found, using Supabase only');
    return [];
  }
};

export interface UseBreedSearchProps {
  species: 'dog' | 'cat' | null;
  minQueryLength?: number;
}

export interface BreedResult {
  id: string;
  name: string;
  group?: string;
  country?: string;
  source: 'local' | 'supabase';
}

/**
 * Hook for searching dog/cat breeds with local-first approach
 * 
 * Features:
 * - Local fuzzy search in FCI breeds (offline-capable)
 * - Falls back to Supabase for cats and rare breeds
 * - Debounced search
 * - Case-insensitive matching
 * 
 * @example
 * const { results, loading, search } = useBreedSearch({ species: 'dog' });
 * search('labrador'); // Returns Labrador Retriever, etc.
 */
export function useBreedSearch({ species, minQueryLength = 2 }: UseBreedSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BreedResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Load FCI breeds once
  const fciBreeds = useMemo(() => loadFCIBreeds(), []);

  // Fuzzy match function
  const fuzzyMatch = (text: string, search: string): boolean => {
    const textLower = text.toLowerCase();
    const searchLower = search.toLowerCase();
    
    // Exact match or substring match
    if (textLower.includes(searchLower)) return true;
    
    // Fuzzy match: allow some characters to be missing
    // e.g., "labrador" matches "Labrador Retriever"
    let searchIndex = 0;
    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
      if (textLower[i] === searchLower[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === searchLower.length;
  };

  // Search FCI breeds locally
  const searchLocal = (searchQuery: string): BreedResult[] => {
    if (!searchQuery || searchQuery.length < minQueryLength) return [];
    if (species !== 'dog') return []; // FCI is dogs only

    const matches = fciBreeds
      .filter((breed) => fuzzyMatch(breed.name, searchQuery))
      .slice(0, 20) // Limit results
      .map((breed) => ({
        id: `fci-${breed.id}`,
        name: breed.name,
        group: breed.group,
        country: breed.country,
        source: 'local' as const,
      }));

    return matches;
  };

  // Search Supabase (for cats, or as fallback)
  const searchSupabase = async (searchQuery: string): Promise<BreedResult[]> => {
    if (!searchQuery || searchQuery.length < minQueryLength) return [];
    if (!species) return [];

    try {
      const { data, error } = await supabase
        .from('breeds')
        .select('id, name, group, country')
        .eq('species', species)
        .ilike('name', `%${searchQuery}%`)
        .limit(20);

      if (error) throw error;

      return (data || []).map((breed: any) => ({
        id: breed.id,
        name: breed.name,
        group: breed.group,
        country: breed.country,
        source: 'supabase' as const,
      }));
    } catch (error) {
      console.error('Supabase breed search error:', error);
      return [];
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (!query || query.length < minQueryLength) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        // Try local first (dogs only)
        if (species === 'dog') {
          const localResults = searchLocal(query);
          
          if (localResults.length > 0) {
            setResults(localResults);
            setLoading(false);
            return;
          }
        }

        // Fallback to Supabase (for cats or if no local matches)
        const supabaseResults = await searchSupabase(query);
        setResults(supabaseResults);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, species, minQueryLength]);

  return {
    results,
    loading,
    query,
    search: setQuery,
    clear: () => {
      setQuery('');
      setResults([]);
    },
  };
}

/**
 * Get popular breeds for quick selection
 */
export function usePopularBreeds(species: 'dog' | 'cat' | null, limit = 10): BreedResult[] {
  return useMemo(() => {
    if (species !== 'dog') return [];

    // Popular dog breeds
    const popular = [
      'LABRADOR RETRIEVER',
      'GERMAN SHEPHERD',
      'GOLDEN RETRIEVER',
      'FRENCH BULLDOG',
      'BULLDOG',
      'POODLE',
      'BEAGLE',
      'ROTTWEILER',
      'GERMAN SHORT-HAIRED POINTING DOG',
      'YORKSHIRE TERRIER',
    ];

    const fciBreeds = loadFCIBreeds();
    
    return popular
      .map((name) => fciBreeds.find((b) => b.name === name))
      .filter((breed): breed is FCIBreed => breed !== undefined)
      .slice(0, limit)
      .map((breed) => ({
        id: `fci-${breed.id}`,
        name: breed.name,
        group: breed.group,
        country: breed.country,
        source: 'local' as const,
      }));
  }, [species, limit]);
}
