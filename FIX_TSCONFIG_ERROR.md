# 🔧 Fix "expo/tsconfig.base not found" Error

## ✅ **THE FIX**

Your `tsconfig.json` has a typo. It says:
```json
"extends": "expo/tsconfig.base"
```

But it should be:
```json
"extends": "expo/tsconfig.base.json"
```

---

## 📝 **UPDATE YOUR tsconfig.json**

**Location:** `/Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile/tsconfig.json`

**Replace the entire file with this:**

```json
{
  "extends": "expo/tsconfig.base.json",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node",
    "target": "esnext",
    "lib": ["esnext"],
    "module": "esnext"
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

---

## 🔄 **THEN RESTART TYPESCRIPT:**

1. Press **`Cmd+Shift+P`** (Mac) or **`Ctrl+Shift+P`** (Windows)
2. Type: **`TypeScript: Restart TS Server`**
3. Press Enter

**The error should disappear!** ✅

---

**That's it! Just change `tsconfig.base` to `tsconfig.base.json`** 🎯
