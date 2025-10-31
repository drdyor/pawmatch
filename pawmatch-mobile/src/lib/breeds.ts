// Breed Database with Fuzzy Matching (Zero Dependencies - Works in Snack)
// Handles typo correction and autocomplete

export const DOG_BREEDS = [
  "Maltese",
  "German Shepherd",
  "Yorkshire Terrier",
  "French Bulldog",
  "Pomeranian",
  "Chihuahua",
  "Cavalier King Charles Spaniel",
  "Fox Terrier",
  "Jack Russell Terrier",
  "Golden Retriever",
  "Labrador Retriever",
  "Border Collie",
  "Poodle",
  "Beagle",
  "Pharaoh Hound",
  "Maltese Terrier",
  "Mixed Breed",
];

export const CAT_BREEDS = [
  "Abyssinian",
  "British Shorthair",
  "Maine Coon",
  "Persian",
  "Siamese",
  "Ragdoll",
  "Sphynx",
  "Bengal",
  "Turkish Angora",
  "Russian Blue",
  "Scottish Fold",
  "Mixed Breed",
];

// Normalize string for comparison
const norm = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();

// Damerau-Levenshtein distance for typo detection
function damerauLevenshtein(a: string, b: string): number {
  a = norm(a);
  b = norm(b);
  const al = a.length;
  const bl = b.length;
  
  if (!al) return bl;
  if (!bl) return al;
  
  const da: Record<string, number> = {};
  const maxDist = al + bl;
  const H: number[][] = Array(al + 2)
    .fill(0)
    .map(() => Array(bl + 2).fill(0));
  
  H[0][0] = maxDist;
  for (let i = 0; i <= al; i++) {
    H[i + 1][0] = maxDist;
    H[i + 1][1] = i;
  }
  for (let j = 0; j <= bl; j++) {
    H[0][j + 1] = maxDist;
    H[1][j + 1] = j;
  }
  
  for (let i = 1; i <= al; i++) {
    let db = 0;
    for (let j = 1; j <= bl; j++) {
      const i1 = da[b[j - 1]] || 0;
      const j1 = db;
      let cost = 1;
      if (a[i - 1] === b[j - 1]) {
        cost = 0;
        db = j;
      }
      H[i + 1][j + 1] = Math.min(
        H[i][j] + cost, // substitution
        H[i + 1][j] + 1, // insertion
        H[i][j + 1] + 1, // deletion
        H[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1) // transposition
      );
    }
    da[a[i - 1]] = i;
  }
  
  return H[al + 1][bl + 1];
}

// Score function for ranking matches
function score(candidate: string, input: string): number {
  const A = norm(candidate);
  const B = norm(input);
  if (!B) return 0;
  if (A.startsWith(B)) return 1; // Strong prefix hit
  const d = damerauLevenshtein(A, B);
  const worst = Math.max(A.length, B.length) || 1;
  return 1 - d / worst; // 1 = perfect, 0 = worst
}

// Suggest breeds with typo correction
export function suggestBreeds(
  input: string,
  species: 'dog' | 'cat',
  limit: number = 8
): string[] {
  const list = species === 'dog' ? DOG_BREEDS : CAT_BREEDS;
  const S = norm(input);
  
  if (!S) return list.slice(0, limit);
  
  return list
    .map((name) => ({ name, s: score(name, input) }))
    .sort((a, b) => b.s - a.s || a.name.localeCompare(b.name))
    .filter((x) => x.s > 0.35) // Threshold for "likely intended"
    .slice(0, limit)
    .map((x) => x.name);
}

// Get canonical breed name (finds closest match)
export function getCanonicalBreed(input: string, species: 'dog' | 'cat'): string | null {
  const suggestions = suggestBreeds(input, species, 1);
  if (suggestions.length === 0) return null;
  const topMatch = suggestions[0];
  const scoreValue = score(topMatch, input);
  // Only return if confidence is high enough
  return scoreValue > 0.6 ? topMatch : null;
}
