# 🔍 Quick Diagnostic Commands

**Run these in Terminal to diagnose your issue:**

---

## ✅ **BASIC CHECKS:**

```bash
# 1. Are you in the right place?
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
pwd
# Should show: /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile

# 2. Does the project exist?
ls -la | grep package.json
# Should show: package.json

# 3. Is Node.js installed?
node --version
# Should show: v18.x.x or v20.x.x

# 4. Is npm installed?
npm --version
# Should show: v9.x.x or v10.x.x

# 5. Do you have node_modules?
ls -d node_modules 2>/dev/null && echo "✅ node_modules EXISTS" || echo "❌ node_modules MISSING"
```

---

## 🌐 **NETWORK CHECKS:**

```bash
# 1. Can you reach the internet?
ping -c 3 google.com

# 2. Can you reach npm registry?
ping -c 3 registry.npmjs.org

# 3. Can npm reach registry?
npm ping
# Should say: "Ping successful"

# 4. Test HTTPS to npm registry
curl -I https://registry.npmjs.org/ 2>&1 | head -3
```

---

## 📦 **INSTALL ATTEMPT:**

```bash
# Try to install (this will show the exact error)
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
npm install 2>&1 | head -20
```

**Copy the error message** - this tells us exactly what's wrong!

---

## 🎯 **SHARE THIS OUTPUT:**

After running the above, share:
1. **Output of `npm ping`**
2. **Output of `npm install`** (first 20 lines of error)
3. **Output of `node --version` and `npm --version`**

This helps me give you the exact fix! 🚀
