# ⚡ Supabase Quick Start (5-min version)

## 1️⃣ Create Project
- Go to: https://supabase.com
- New Project → Name: `pawmatch` → Region: Europe West → Create

## 2️⃣ Get Keys
- Settings → API
- Copy **Project URL** and **anon public** key

## 3️⃣ Update .env
Edit `/workspace/pawmatch-mobile/.env`:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## 4️⃣ Run SQL
- Supabase → SQL Editor → New Query
- Copy all from: `/workspace/pawmatch-mobile/SAFE_DATABASE_SETUP.sql`
- Paste → Run

## 5️⃣ Enable Auth
- Authentication → Providers → Email → Enable
- Disable "Confirm email" for testing

## 6️⃣ Test
```bash
cd /workspace/pawmatch-mobile
npm start
```

**Done!** 🎉

---

For detailed instructions, see: `/workspace/SUPABASE_SETUP_GUIDE.md`
