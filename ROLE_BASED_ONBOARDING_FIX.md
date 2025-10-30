# 🚨 CRITICAL FIX: Role-Based Onboarding Logic

## THE BUG:

**Everyone gets the same flow regardless of role!**

```
Buyer selects: "I want to find a pet"
↓
App shows: "Add your pet" ❌ WRONG!
↓
User confused: "I DON'T have a pet yet!"
```

---

## ✅ THE FIX: Different Flows Per Role

### **1. INDEPENDENT OWNER / BREEDER**
```
Step 1: Role selection ✅
Step 2: Add your pet(s) ✅
Step 3: Heat tracker ✅
Step 4: Swipe preview (studs) ✅
Step 5: Dashboard ✅
```

### **2. BUYER / ADOPTER**
```
Step 1: Role selection ✅
Step 2: Set preferences (SKIP pet adding!) ✅
  - What are you looking for?
  - Dog or Cat?
  - Size preference?
  - Age range?
  - Location radius?
Step 3: Swipe preview (available pets) ✅
Step 4: Dashboard ✅
```

### **3. SHELTER**
```
Step 1: Role selection ✅
Step 2: Shelter info ✅
  - Shelter name
  - Location
  - License number
  - Capacity
Step 3: Add rescue animal ✅
  - Intake date
  - Rescue story
  - Health status
  - At-risk? (urgent)
Step 4: Dashboard ✅
```

### **4. VET / CLINIC**
```
Step 1: Role selection ✅
Step 2: Clinic setup ✅
  - Clinic name
  - Malta vet license
  - Services offered
  - Location
  - Hours
Step 3: Verification ✅
  - Upload license
  - Wait for approval
Step 4: Dashboard ✅
```

---

## 🔧 CODE FIX:

### **Updated App.tsx routing:**

```typescript
export default function App(){
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ role: null });

  // Role-based flow logic
  const getNextStep = (currentStep, role) => {
    if (role === 'buyer') {
      // Buyer flow: Role → Preferences → Swipe → Dashboard
      const buyerFlow = [
        'RoleSelect',
        'BuyerPreferences', 
        'SwipePreview',
        'Dashboard'
      ];
      return buyerFlow[currentStep];
    }
    
    if (role === 'shelter') {
      // Shelter flow: Role → Shelter Info → Add Animal → Dashboard
      const shelterFlow = [
        'RoleSelect',
        'ShelterSetup',
        'AddRescueAnimal',
        'Dashboard'
      ];
      return shelterFlow[currentStep];
    }
    
    if (role === 'vet') {
      // Vet flow: Role → Clinic Setup → Verification → Dashboard
      const vetFlow = [
        'RoleSelect',
        'ClinicSetup',
        'LicenseVerification',
        'Dashboard'
      ];
      return vetFlow[currentStep];
    }
    
    // Default: Independent Owner / Breeder flow
    const breederFlow = [
      'RoleSelect',
      'PetQuickAdd',
      'HeatTracker',
      'SwipePreview',
      'Dashboard'
    ];
    return breederFlow[currentStep];
  };

  const currentScreen = getNextStep(step, data.role);

  return (
    <Mobile>
      {currentScreen === 'RoleSelect' && (
        <RoleSelect onNext={(d) => {
          setData({...data, ...d});
          setStep(1);
        }} />
      )}
      
      {currentScreen === 'PetQuickAdd' && (
        <PetQuickAdd 
          onBack={() => setStep(0)} 
          onNext={(d) => { setData({...data, ...d}); setStep(2); }} 
        />
      )}
      
      {currentScreen === 'BuyerPreferences' && (
        <BuyerPreferences 
          onBack={() => setStep(0)} 
          onNext={(d) => { setData({...data, ...d}); setStep(2); }} 
        />
      )}
      
      {currentScreen === 'ShelterSetup' && (
        <ShelterSetup 
          onBack={() => setStep(0)} 
          onNext={(d) => { setData({...data, ...d}); setStep(2); }} 
        />
      )}
      
      {currentScreen === 'ClinicSetup' && (
        <ClinicSetup 
          onBack={() => setStep(0)} 
          onNext={(d) => { setData({...data, ...d}); setStep(2); }} 
        />
      )}
      
      {/* ... rest of screens ... */}
    </Mobile>
  );
}
```

---

## 🎨 NEW COMPONENTS NEEDED:

### **1. BuyerPreferences Component:**

```typescript
function BuyerPreferences({ onNext, onBack }) {
  const [prefs, setPrefs] = useState({
    species: 'Dog',
    size: [],
    age: [],
    distance: '10',
  });

  return (
    <>
      <Header step={2} max={4} onBack={onBack} />
      <div className="px-5 pb-6 pt-2">
        <h2 className="text-lg font-semibold mb-2">What are you looking for?</h2>
        <p className="text-neutral-600 mb-4">
          Set your preferences to find your perfect pet match.
        </p>

        <Card className="p-4 mb-4">
          {/* Species */}
          <div className="mb-4">
            <div className="text-sm text-neutral-600 mb-2">I'm looking for</div>
            <div className="flex gap-2">
              <Chip 
                active={prefs.species === 'Dog'} 
                onClick={() => setPrefs({...prefs, species: 'Dog'})}
                icon={I.Dog}
              >
                Dog
              </Chip>
              <Chip 
                active={prefs.species === 'Cat'} 
                onClick={() => setPrefs({...prefs, species: 'Cat'})}
                icon={I.Cat}
              >
                Cat
              </Chip>
              <Chip 
                active={prefs.species === 'Both'} 
                onClick={() => setPrefs({...prefs, species: 'Both'})}
              >
                Either
              </Chip>
            </div>
          </div>

          {/* Size */}
          <div className="mb-4">
            <div className="text-sm text-neutral-600 mb-2">Size preference</div>
            <div className="flex flex-wrap gap-2">
              {['Small', 'Medium', 'Large'].map(size => (
                <Chip 
                  key={size}
                  active={prefs.size.includes(size)}
                  onClick={() => {
                    const newSize = prefs.size.includes(size)
                      ? prefs.size.filter(s => s !== size)
                      : [...prefs.size, size];
                    setPrefs({...prefs, size: newSize});
                  }}
                >
                  {size}
                </Chip>
              ))}
            </div>
          </div>

          {/* Age */}
          <div className="mb-4">
            <div className="text-sm text-neutral-600 mb-2">Age preference</div>
            <div className="flex flex-wrap gap-2">
              {['Puppy/Kitten', 'Young (1-3y)', 'Adult (3-7y)', 'Senior (7y+)'].map(age => (
                <Chip 
                  key={age}
                  active={prefs.age.includes(age)}
                  onClick={() => {
                    const newAge = prefs.age.includes(age)
                      ? prefs.age.filter(a => a !== age)
                      : [...prefs.age, age];
                    setPrefs({...prefs, age: newAge});
                  }}
                >
                  {age}
                </Chip>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div>
            <div className="text-sm text-neutral-600 mb-2">
              Search radius: {prefs.distance} km
            </div>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={prefs.distance}
              onChange={(e) => setPrefs({...prefs, distance: e.target.value})}
              className="w-full"
            />
          </div>
        </Card>

        <button 
          onClick={() => onNext({ preferences: prefs })} 
          className="w-full py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-sm hover:bg-amber-600"
        >
          Find My Perfect Pet
        </button>
      </div>
    </>
  );
}
```

### **2. ShelterSetup Component:**

```typescript
function ShelterSetup({ onNext, onBack }) {
  const [shelter, setShelter] = useState({
    name: '',
    license: '',
    location: '',
    capacity: '',
    phone: '',
  });

  return (
    <>
      <Header step={2} max={4} onBack={onBack} />
      <div className="px-5 pb-6 pt-2">
        <h2 className="text-lg font-semibold mb-2">Shelter Information</h2>
        <p className="text-neutral-600 mb-4">
          Tell us about your shelter or rescue organization.
        </p>

        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-sm text-neutral-600 mb-1">Shelter Name *</div>
              <input 
                value={shelter.name}
                onChange={(e) => setShelter({...shelter, name: e.target.value})}
                placeholder="Paws of Malta Rescue"
                className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              />
            </div>

            <div>
              <div className="text-sm text-neutral-600 mb-1">License Number *</div>
              <input 
                value={shelter.license}
                onChange={(e) => setShelter({...shelter, license: e.target.value})}
                placeholder="MLT-SHL-2020-123"
                className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              />
            </div>

            <div>
              <div className="text-sm text-neutral-600 mb-1">Location *</div>
              <input 
                value={shelter.location}
                onChange={(e) => setShelter({...shelter, location: e.target.value})}
                placeholder="Valletta"
                className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-neutral-600 mb-1">Capacity</div>
                <input 
                  value={shelter.capacity}
                  onChange={(e) => setShelter({...shelter, capacity: e.target.value})}
                  placeholder="50"
                  type="number"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2"
                />
              </div>
              
              <div>
                <div className="text-sm text-neutral-600 mb-1">Phone</div>
                <input 
                  value={shelter.phone}
                  onChange={(e) => setShelter({...shelter, phone: e.target.value})}
                  placeholder="+356 ..."
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2"
                />
              </div>
            </div>
          </div>
        </Card>

        <button 
          onClick={() => onNext({ shelter })} 
          className="w-full py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-sm hover:bg-amber-600"
        >
          Continue
        </button>
      </div>
    </>
  );
}
```

### **3. ClinicSetup Component:**

```typescript
function ClinicSetup({ onNext, onBack }) {
  const [clinic, setClinic] = useState({
    name: '',
    vetName: '',
    license: '',
    location: '',
    services: [],
  });

  const SERVICES = [
    'Health Certificates',
    'DNA Testing',
    'Hip Scoring',
    'Vaccinations',
    'Pre-breeding Checkups',
    'Emergency Care',
  ];

  return (
    <>
      <Header step={2} max={4} onBack={onBack} />
      <div className="px-5 pb-6 pt-2">
        <h2 className="text-lg font-semibold mb-2">Clinic Information</h2>
        <p className="text-neutral-600 mb-4">
          Set up your veterinary clinic profile.
        </p>

        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-sm text-neutral-600 mb-1">Clinic Name *</div>
              <input 
                value={clinic.name}
                onChange={(e) => setClinic({...clinic, name: e.target.value})}
                placeholder="Malta Vet Clinic"
                className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              />
            </div>

            <div>
              <div className="text-sm text-neutral-600 mb-1">Your Name *</div>
              <input 
                value={clinic.vetName}
                onChange={(e) => setClinic({...clinic, vetName: e.target.value})}
                placeholder="Dr. Maria Borg"
                className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              />
            </div>

            <div>
              <div className="text-sm text-neutral-600 mb-1">Malta Vet License *</div>
              <input 
                value={clinic.license}
                onChange={(e) => setClinic({...clinic, license: e.target.value})}
                placeholder="MLT-VET-2018-453"
                className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              />
            </div>

            <div>
              <div className="text-sm text-neutral-600 mb-1">Location *</div>
              <input 
                value={clinic.location}
                onChange={(e) => setClinic({...clinic, location: e.target.value})}
                placeholder="Sliema"
                className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              />
            </div>

            <div>
              <div className="text-sm text-neutral-600 mb-2">Services Offered</div>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map(service => (
                  <Chip 
                    key={service}
                    active={clinic.services.includes(service)}
                    onClick={() => {
                      const newServices = clinic.services.includes(service)
                        ? clinic.services.filter(s => s !== service)
                        : [...clinic.services, service];
                      setClinic({...clinic, services: newServices});
                    }}
                  >
                    {service}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <button 
          onClick={() => onNext({ clinic })} 
          className="w-full py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-sm hover:bg-amber-600"
        >
          Continue to Verification
        </button>
      </div>
    </>
  );
}
```

---

## 🎯 SUMMARY OF FIX:

### **BEFORE (Broken):**
```
ALL roles → Add pet → Heat tracker → Swipe → Dashboard
```

### **AFTER (Fixed):**

| Role | Step 2 | Step 3 | Step 4 |
|------|--------|--------|--------|
| **Independent Owner** | Add Pet | Heat Tracker | Swipe Studs |
| **Breeder** | Add Pet | Heat Tracker | Swipe Studs |
| **Buyer** | Set Preferences | Swipe Available Pets | Dashboard |
| **Shelter** | Shelter Info | Add Rescue Animal | Dashboard |
| **Vet** | Clinic Setup | License Verification | Dashboard |

---

## ✅ USER EXPERIENCE NOW:

### **Buyer Journey:**
```
1. "I want to find a pet" ✅
2. "What are you looking for?" ✅
   - Dog or Cat?
   - Size?
   - Age?
3. "Here are pets near you!" ✅
4. Swipe & match! ✅
```

### **Vet Journey:**
```
1. "I'm a vet" ✅
2. "Set up your clinic" ✅
   - License number
   - Services
3. "Verify your license" ✅
4. "Issue certificates!" ✅
```

---

**This fix is CRITICAL for usability!**

Want me to implement these new components and routing logic now?
