# 🧪 How to Test Your Supabase Connection

## Quick Test Steps:

### 1. Open `App.tsx`

Located at: `/workspace/pawmatch-mobile/App.tsx`

### 2. Temporarily replace the export

Add this at the **very top** of the file (after imports):

```typescript
// 🧪 TEMPORARY: Remove this after testing!
import TestSupabaseConnection from './test-supabase-connection';
export default TestSupabaseConnection;
```

Then **comment out** the original `export default` at the bottom.

### 3. Run the app

```bash
cd /workspace/pawmatch-mobile
npm start
```

Press `i` for iOS simulator or `a` for Android emulator

### 4. What you'll see:

**✅ SUCCESS** - If everything is working:
```
✅ Supabase Connected Successfully!

✅ Credentials configured
✅ Database connected
✅ Users table exists (0 rows)
✅ Table 'pets' exists
✅ Table 'listings' exists
✅ Table 'messages' exists
✅ Storage bucket configured

🎉 Everything looks good!
```

**❌ ERROR - Tables not created**:
```
❌ Database Tables Not Created

✅ Connection successful!
❌ Tables not found

Next step: Run the SQL setup
```

👉 **Solution**: Run the SQL script in Supabase (see Step 5 below)

**❌ ERROR - Demo mode**:
```
❌ Demo Mode Detected

⚠️ Supabase credentials not configured
```

👉 **Solution**: Check your `.env` file has the correct values

### 5. Run SQL Setup (if tables don't exist)

1. Open **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your `pawmatch` project
3. Click **SQL Editor** in left sidebar
4. Click **"New query"**
5. Open file: `/workspace/pawmatch-mobile/SAFE_DATABASE_SETUP.sql`
6. **Copy ALL** the content (Ctrl+A, Ctrl+C)
7. **Paste** into Supabase SQL Editor (Ctrl+V)
8. Click **"Run"** (or press Ctrl+Enter)
9. Wait for: ✅ **"Success. No rows returned"**

### 6. Test again

Go back to your running app and tap **"🔄 Test Again"**

You should now see all green checkmarks! ✅

### 7. Remove test code

Once everything works, **restore your original `App.tsx`**:

1. Remove the test import
2. Uncomment the original export
3. Delete or comment out the test export line

---

## Alternative: Quick CLI Test

If you prefer a simple command-line test:

```bash
cd /workspace/pawmatch-mobile
node -e "
const { createClient } = require('@supabase/supabase-js');
const url = 'https://oyrsmfrpcegtrxrbadlu.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnNtZnJwY2VndHJ4cmJhZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTMxODIsImV4cCI6MjA3NzQyOTE4Mn0.e8jRrE-8EonGzIif_mRPBtc8fn9mefu122eo5f2ZaRE';
const supabase = createClient(url, key);
supabase.from('users').select('count').then(r => console.log(r.error ? '❌ Error: ' + r.error.message : '✅ Connected!'));
"
```

---

## Next Steps After Successful Test:

1. ✅ **Enable Authentication**:
   - Supabase → Authentication → Providers
   - Enable **Email** provider
   - Disable "Confirm email" (for testing)

2. ✅ **Test user sign-up**:
   - Run your app normally
   - Try creating an account

3. ✅ **Add test data** (optional):
   - Create a pet profile
   - Upload a photo
   - Test the swipe feature

4. 🚀 **You're ready to develop!**

---

## Troubleshooting

### "Invalid API key" error
- Verify you copied the **anon/public** key (NOT service_role)
- Check for extra spaces in `.env`
- Restart with cache clear: `npm start -- --clear`

### Tables exist but empty
- That's normal! Add data through the app or manually in Supabase

### Storage bucket missing
- Re-run the SQL setup script
- Check SQL output for errors

---

**Need help?** Check `/workspace/SUPABASE_SETUP_GUIDE.md` for detailed troubleshooting.
