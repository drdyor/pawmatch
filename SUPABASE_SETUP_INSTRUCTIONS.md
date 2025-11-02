# 🗄️ Supabase Setup Instructions

## 📍 Current Status

You have **TWO options** for Supabase:

---

## ✅ OPTION 1: Use Paws Supabase Instance (RECOMMENDED)

### Credentials (ALREADY IN .env):
```env
EXPO_PUBLIC_SUPABASE_URL=https://oyrsmfrpcegtrxrbadlu.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnNtZnJwY2VndHJ4cmJhZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTMxODIsImV4cCI6MjA3NzQyOTE4Mn0.e8jRrE-8EonGzIif_mRPBtc8fn9mefu122eo5f2ZaRE
```

### ✅ Advantages:
- Already configured and working
- Has data (if Paws was tested)
- No setup needed
- Can start coding immediately

### ⚠️ Check First:
1. Go to: https://supabase.com/dashboard
2. Find project: `oyrsmfrpcegtrxrbadlu`
3. Check if SQL schema is loaded:
   - Go to **Database** → **Tables**
   - Should see: `profiles`, `pets`, `listings`, `breeds`, etc.

### If Schema Missing:
Run this SQL in Supabase SQL Editor:

**File:** `/workspace/PAWS_PRODUCTION_SCHEMA.sql`

```bash
# Copy contents of PAWS_PRODUCTION_SCHEMA.sql
# Paste into Supabase Dashboard → SQL Editor → New Query
# Click "Run"
```

---

## 🆕 OPTION 2: Create New Supabase Project

### Steps:

#### 1. Create Project
1. Go to: https://supabase.com/dashboard
2. Click **"New Project"**
3. Name: `pawmatch-production`
4. Region: **Europe (Frankfurt)** (closest to Malta)
5. Database Password: (save this securely!)
6. Click **"Create new project"** (takes 2-3 minutes)

#### 2. Get Credentials
1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

#### 3. Update .env
```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...YOUR_KEY_HERE
```

#### 4. Load Schema
1. Go to **SQL Editor** → **New Query**
2. Copy contents of `/workspace/PAWS_PRODUCTION_SCHEMA.sql`
3. Paste and click **"Run"**
4. Wait ~30 seconds for all tables to create

#### 5. Enable Row Level Security (RLS)
Already included in the schema! ✅

#### 6. Create Storage Buckets
```sql
-- Run in SQL Editor:
INSERT INTO storage.buckets (id, name, public) VALUES
  ('pet-photos', 'pet-photos', true),
  ('certificates', 'certificates', false),
  ('contracts', 'contracts', false);
```

---

## 🔍 How to Verify Setup

### Test Connection:
```bash
cd /workspace/pawmatch-mobile
npm start
```

### Check in App:
1. Open app on phone
2. Try to sign up
3. If successful, connection works! ✅

### Check Database:
```sql
-- Run in SQL Editor to test:
SELECT * FROM profiles LIMIT 5;
SELECT * FROM pets LIMIT 5;
SELECT * FROM breeds LIMIT 10;
```

---

## 📊 Which SQL Schema to Use?

### ✅ **Use Paws Production Schema** (RECOMMENDED)

**File:** `/workspace/PAWS_PRODUCTION_SCHEMA.sql`

**Why:**
- 30+ tables (vs 15 in PawMatch)
- PostGIS for geographic queries
- PostgreSQL ENUMs (better type safety)
- Payment infrastructure
- Normalized breeds table
- More triggers and automation
- Better RLS policies

**Tables included:**
- ✅ profiles (users)
- ✅ breeds (normalized)
- ✅ pets
- ✅ pet_images
- ✅ health_records
- ✅ badges & badge_grants
- ✅ litters
- ✅ heat_cycles
- ✅ listings
- ✅ favorites
- ✅ saved_searches
- ✅ waitlists
- ✅ stud_interests
- ✅ payments
- ✅ contracts
- ✅ pet_interactions
- ✅ matches
- ✅ pet_votes
- ✅ mating_pair_votes
- ✅ breeding_suggestions
- ✅ conversations
- ✅ messages
- ✅ notifications
- ✅ reports

---

## 🎯 RECOMMENDED SETUP (5 minutes)

### Quick Start:
```bash
# 1. .env already created with Paws credentials ✅

# 2. Check if schema is loaded in Paws Supabase:
# Go to: https://supabase.com/dashboard/project/oyrsmfrpcegtrxrbadlu
# Check: Database → Tables
# If empty, run PAWS_PRODUCTION_SCHEMA.sql

# 3. Test connection:
cd /workspace/pawmatch-mobile
npm install
npm start

# 4. Scan QR code and test signup
```

---

## 🔄 Migration Path (if switching databases)

### From Paws DB → New DB:
```sql
-- Export data from Paws:
-- Go to Paws Supabase → Database → Backups → Create backup
-- Download backup

-- Import to new DB:
-- Go to New Supabase → Database → Migrations
-- Upload backup
```

### From PawMatch Schema → Paws Schema:
```sql
-- 1. Backup current data
-- 2. Run PAWS_PRODUCTION_SCHEMA.sql
-- 3. Update table names:
--    users → profiles
--    owner_id → owner_user_id
-- 4. Migrate data
```

---

## ❓ FAQ

### Q: Which database should I use?
**A:** Use the Paws Supabase (`oyrsmfrpcegtrxrbadlu`) - it's already configured!

### Q: What if Paws DB is empty?
**A:** Run `/workspace/PAWS_PRODUCTION_SCHEMA.sql` in SQL Editor

### Q: Can I use both databases?
**A:** Yes! Just change `.env` to switch between them.

### Q: Is the Paws SQL better than PawMatch SQL?
**A:** YES! See `/workspace/SQL_COMPARISON_PAWS_VS_PAWMATCH.md`
- 15 more tables
- PostGIS
- Better type safety
- More features

### Q: Will switching break my app?
**A:** Only if table names changed. Main changes:
- `users` → `profiles`
- `owner_id` → `owner_user_id`

---

## 🚀 Next Steps

After database is configured:

1. ✅ Database connected
2. ⏭️ Port better swipe UI from Paws
3. ⏭️ Add breed search with FCI data
4. ⏭️ Test all features
5. ⏭️ Deploy to Expo

---

**Current Setup:**
- ✅ .env created with Paws credentials
- ✅ PAWS_PRODUCTION_SCHEMA.sql ready
- ⏭️ Check if schema loaded in Paws DB
- ⏭️ Test connection

**Time to working app:** 5-10 minutes! 🎉
