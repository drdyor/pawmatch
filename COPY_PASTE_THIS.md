# 📋 COPY & PASTE THESE COMMANDS

**Open Terminal in Cursor Desktop and run these one by one:**

---

## 🚀 **STEP 1: Run This First (Diagnostic)**

Copy and paste this entire block:

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile && \
echo "🔍 DIAGNOSTIC CHECK" && \
echo "Location: $(pwd)" && \
echo "Node: $(node --version 2>&1)" && \
echo "npm: $(npm --version 2>&1)" && \
echo "Internet: $(ping -c 1 google.com >/dev/null 2>&1 && echo '✅ OK' || echo '❌ FAILED')" && \
echo "npm registry: $(npm ping 2>&1 | head -1)" && \
echo "node_modules: $([ -d node_modules ] && echo '✅ EXISTS' || echo '❌ MISSING')"
```

**Share the output!**

---

## 📦 **STEP 2: Try to Install (If Internet Works)**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
npm install
```

**Wait 5-10 minutes. Share any errors you see.**

---

## 🎯 **STEP 3: If Network Fails, Try Mirror**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
npm config set registry https://registry.npmmirror.com
npm install
```

---

## 📱 **STEP 4: Once Installed, Start App**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
npm start
```

**You'll see a QR code! 📱**

---

## 🆘 **WHAT TO SHARE WITH ME:**

After running Step 1, copy and paste the output here. That tells me:
- ✅ If Node.js/npm are installed
- ✅ If you have internet
- ✅ If npm can reach the registry
- ✅ If dependencies are installed

**Just paste the output and I'll tell you exactly what to do next!** 🚀
