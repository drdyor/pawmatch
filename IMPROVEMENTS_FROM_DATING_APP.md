# 🐾 Features Adapted from Dating App Best Practices

Based on: **https://github.com/andregit1/dating_app**

## What We Borrowed:

### 1. **Swipe Engine Logic** ✅
Dating apps perfected swipe mechanics. We adapted their core algorithms:

```typescript
// Dating App Pattern:
- Daily swipe limit: 10/day for free users
- Unlimited swipes for premium users
- Prevent duplicate swipes same day
- Track swipe history by date
```

**PawMatch Implementation:**
- `src/services/swipeEngine.ts` - Complete swipe engine
- `FREE_DAILY: 10` swipes for independent breeders
- `PREMIUM_DAILY: 999` swipes for registered breeders
- `hasSwipedToday()` - Duplicate prevention
- `recordSwipe()` - Tracks every swipe action

---

### 2. **Card Deck Algorithm** ✅
Their preference-based matching system:

```go
// From card.go:
- Fetch cards based on user preferences (age, gender)
- Filter out already-swiped profiles
- Don't show same profile twice in a day
- Log card shown timestamp
```

**PawMatch Implementation:**
- `getCardDeck()` - Fetches studs/listings based on:
  - Species preference
  - Breed preference
  - Price range
  - Location/city
- Excludes own pets
- Filters out swiped-today IDs
- Returns fresh deck of 20 max cards

---

### 3. **Premium Features** ✅

```sql
-- Their model:
users.is_premium = TRUE → unlimited swipes + verified badge
users.is_premium = FALSE → 10 swipes/day
```

**PawMatch Implementation:**
- `getUserPremiumStatus()` - Checks if user is registered breeder
- Registered Breeders = Premium (unlimited swipes)
- Independent Breeders = Free (10 swipes/day)
- Upgrade prompt when limit reached

---

### 4. **Database Schema Patterns** ✅

**Their swipes table:**
```sql
CREATE TABLE swipes (
  id SERIAL PRIMARY KEY,
  swiper_id INT REFERENCES users(id),
  profile_id INT REFERENCES users(id),
  swipe_type VARCHAR(10), -- 'left' or 'right'
  swipe_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Our adaptation:**
```sql
-- We use existing stud_interests table:
CREATE TABLE stud_interests (
  id UUID PRIMARY KEY,
  breeder_id UUID REFERENCES users(id),
  stud_id UUID REFERENCES pets(id),
  status TEXT CHECK (status IN ('interested', 'passed', 'matched')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

We map:
- `swiper_id` → `breeder_id`
- `profile_id` → `stud_id`
- `swipe_type` → `status` ('interested' = right, 'passed' = left)

---

### 5. **Swipe Limit Checking** ✅

**Their Go function:**
```go
func checkDailySwipeLimit(db *sql.DB, userID int) error {
  var count int
  db.QueryRow("SELECT COUNT(*) FROM swipes WHERE swiper_id = $1 AND swipe_date >= current_date", userID).Scan(&count)
  if count >= 10 {
    return errors.New("daily swipe limit exceeded")
  }
  return nil
}
```

**Our TypeScript version:**
```typescript
export const checkDailySwipeLimit = async (userId: string, isPremium: boolean) => {
  const today = new Date().toISOString().split('T')[0];
  const { count } = await supabase
    .from('stud_interests')
    .select('*', { count: 'exact' })
    .eq('breeder_id', userId)
    .gte('created_at', today);
  
  const limit = isPremium ? 999 : 10;
  return { canSwipe: count < limit, remaining: limit - count };
};
```

---

### 6. **Duplicate Swipe Prevention** ✅

**Their logic:**
```go
func checkDuplicateSwipe(db *sql.DB, userID, profileID int) error {
  db.QueryRow("SELECT COUNT(*) FROM swipes WHERE swiper_id = $1 AND profile_id = $2 AND swipe_date >= current_date")
  if count > 0 {
    return errors.New("profile already swiped today")
  }
}
```

**Our version:**
```typescript
export const hasSwipedToday = async (userId: string, targetId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('stud_interests')
    .select('id')
    .eq('breeder_id', userId)
    .eq('stud_id', targetId)
    .gte('created_at', today)
    .maybeSingle();
  
  return !!data;
};
```

---

## UI Implementation

### Swipe Counter Badge
Inspired by dating apps showing remaining "likes":

```tsx
<View style={styles.swipeCounter}>
  <Text style={styles.swipeCountText}>
    {swipeLimit.remaining} left
  </Text>
</View>
```

### Upgrade Prompt
When limit reached:

```typescript
Alert.alert(
  'Daily Limit Reached',
  'You've used all your swipes today. Upgrade to Premium for unlimited swipes!',
  [
    { text: 'Maybe Later' },
    { text: 'Go Premium', onPress: () => navigation.navigate('Settings') },
  ]
);
```

---

## Files Modified

1. **`src/services/swipeEngine.ts`** (NEW)
   - Complete swipe management system
   - Limit checking, duplicate prevention
   - Card deck algorithm
   - Premium status detection

2. **`src/screens/breeder/BreederMatchesScreen.tsx`** (UPDATED)
   - Integrated swipe engine
   - Added counter badge
   - Limit checks before swipe
   - Upgrade prompts

---

## What We Didn't Use

From their repo we skipped:
- ❌ OTP authentication (we use Supabase Auth)
- ❌ Phone number verification (planned for v2)
- ❌ Package/Purchase system (we'll use Stripe directly)
- ❌ Session management (Supabase handles this)
- ❌ Go backend (we use Supabase for backend)

---

## Results

✅ **Daily swipe limits** working (10 free, 999 premium)  
✅ **Duplicate prevention** (can't swipe same stud twice)  
✅ **Premium incentive** (upgrade prompt when limit hit)  
✅ **Smart card deck** (filters out swiped, sorts by preference)  
✅ **Counter UI** (shows remaining swipes)  

---

## Testing the Feature

1. **As Independent Breeder (Free):**
   - Go to "Find Studs"
   - Swipe 10 times
   - On 11th swipe → see "Daily Limit Reached" prompt

2. **As Registered Breeder (Premium):**
   - Go to "Find Studs"
   - Counter shows "999 left"
   - Swipe unlimited times

3. **Duplicate Prevention:**
   - Swipe right on a stud
   - Force-refresh app
   - Try swiping same stud → "Already Swiped" message

---

## Next Steps (Not Yet Implemented)

- [ ] Add swipe limits to buyer discovery deck
- [ ] Show "verified badge" for premium users
- [ ] Add swipe history screen ("Who you've swiped")
- [ ] Implement mutual match notifications
- [ ] Add "Rewind" feature (undo last swipe - premium only)
- [ ] Add "Boost" feature (show profile to more users - premium)

---

**Credit:** Algorithm patterns adapted from [andregit1/dating_app](https://github.com/andregit1/dating_app)
