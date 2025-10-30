import React, { useMemo, useState } from "react";

/**
 * PawMatch – Independent Breeder Onboarding (Your bolt.new UI)
 * Fixed with role-based routing logic
 */

// --- Tiny in-file Icon system (emoji-based) ---
const Icon = ({ glyph, label, className = "", style = {} }: any) => (
  <span
    role="img"
    aria-label={label || glyph}
    className={`inline-flex items-center justify-center align-middle ${className}`}
    style={{ fontSize: "1.1rem", lineHeight: 1, ...style }}
  >
    {glyph}
  </span>
);

const I = {
  Check: (p: any) => <Icon glyph="✔️" label="check" {...p} />, 
  PawPrint: (p: any) => <Icon glyph="🐾" label="paw" {...p} />, 
  Calendar: (p: any) => <Icon glyph="📅" label="calendar" {...p} />, 
  Heart: (p: any) => <Icon glyph="❤️" label="heart" {...p} />, 
  Dog: (p: any) => <Icon glyph="🐶" label="dog" {...p} />, 
  Cat: (p: any) => <Icon glyph="🐱" label="cat" {...p} />, 
  Stethoscope: (p: any) => <Icon glyph="🩺" label="stethoscope" {...p} />, 
  Apartment: (p: any) => <Icon glyph="🏢" label="apartment" {...p} />, 
  Users2: (p: any) => <Icon glyph="👥" label="users" {...p} />, 
  MapPin: (p: any) => <Icon glyph="📍" label="map pin" {...p} />, 
  Upload: (p: any) => <Icon glyph="⬆️" label="upload" {...p} />, 
  ChevronRight: (p: any) => <Icon glyph="›" label="next" {...p} />, 
  ChevronLeft: (p: any) => <Icon glyph="‹" label="back" {...p} />, 
  MessageCircle: (p: any) => <Icon glyph="💬" label="messages" {...p} />, 
  ShieldCheck: (p: any) => <Icon glyph="✅" label="verified" {...p} />, 
  Sparkles: (p: any) => <Icon glyph="✨" label="sparkles" {...p} />, 
  Bell: (p: any) => <Icon glyph="🔔" label="bell" {...p} />, 
  PlusCircle: (p: any) => <Icon glyph="➕" label="plus" {...p} />, 
  Info: (p: any) => <Icon glyph="ℹ️" label="info" {...p} />,
};

// --- Health badges ---
const HEALTH_META: Record<string, any> = {
  fiv_felv: { label: 'FIV/FeLV negative', icon: '🐱', color: '#34C759' },
  hip_score: { label: 'No hip dysplasia', icon: '🦴', color: '#34C759' },
  dna_tested: { label: 'DNA tested clear', icon: '🧬', color: '#2F80ED' },
  vaccinated: { label: 'Vaccinated', icon: '💉', color: '#FF9500' },
  vet_checked: { label: 'Vet checked', icon: '⚕️', color: '#FF3B30' },
  custom: { label: 'Health certified', icon: '✅', color: '#9B59B6' },
};

function HealthBadges({ health = [] }: any) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {health.map((h: any, idx: number) => {
        const meta = HEALTH_META[h.type] || HEALTH_META.custom;
        const bg = `${meta.color}20`;
        return (
          <div key={idx} className="px-2 py-1 rounded-full text-[11px] border flex items-center gap-1"
               style={{ backgroundColor: bg, borderColor: meta.color, color: meta.color }}>
            <span aria-hidden>{meta.icon}</span>
            <span className="font-medium">{meta.label}</span>
            {h.date && <span className="opacity-70 ml-1">{h.date}</span>}
          </div>
        );
      })}
    </div>
  );
}

// --- Design tokens ---
const Mobile = ({ children }: any) => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-amber-50 to-rose-50 p-6">
    <div className="relative w-[390px] max-w-full bg-white rounded-[28px] shadow-xl ring-1 ring-black/5 overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-6 w-40 bg-black/10 rounded-b-2xl z-50" />
      {children}
    </div>
  </div>
);

const Header = ({ step, max, onBack }: any) => (
  <div className="px-5 pt-8 pb-3">
    <div className="flex items-center gap-3">
      {onBack ? (
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-black/5">
          <I.ChevronLeft className="h-5 w-5" />
        </button>
      ) : (
        <div className="w-9" />
      )}
      <div className="flex-1">
        <div className="text-xs tracking-wide text-neutral-500">Onboarding</div>
        <div className="h-2 w-full bg-neutral-100 rounded-full mt-2">
          <div
            className="h-2 bg-amber-500 rounded-full transition-all"
            style={{ width: `${(step / max) * 100}%` }}
          />
        </div>
      </div>
      <div className="w-9" />
    </div>
  </div>
);

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm ${className}`}>{children}</div>
);

const Chip = ({ active, children, onClick, icon: IconComp }: any) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 border transition shadow-sm ${
      active
        ? "bg-amber-500 text-white border-amber-500"
        : "bg-white border-neutral-200 hover:border-neutral-300"
    }`}
  >
    {IconComp && <IconComp className="h-4 w-4" />}
    {children}
  </button>
);

const Toggle = ({ checked, onChange, label, sub }: any) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-full flex items-start gap-3 p-4 rounded-2xl border transition ${
      checked ? "bg-amber-50 border-amber-300" : "bg-white border-neutral-200 hover:border-neutral-300"
    }`}
  >
    <div className={`h-5 w-5 rounded-md mt-0.5 flex items-center justify-center border ${checked ? "bg-amber-500 border-amber-500" : "bg-white border-neutral-300"}`}>
      {checked && <I.Check className="h-4 w-4 text-white" />}
    </div>
    <div className="text-left">
      <div className="font-medium">{label}</div>
      {sub && <div className="text-sm text-neutral-500 mt-0.5">{sub}</div>}
    </div>
  </button>
);

function RoleSelect({ onNext }: any) {
  const [role, setRole] = useState("independent");

  const items = [
    { key: "independent", label: "Independent Owner", icon: I.PawPrint, desc: "Breed once or twice, find matches nearby" },
    { key: "breeder", label: "Professional Breeder", icon: I.Users2, desc: "Studs, litters, records & analytics" },
    { key: "shelter", label: "Shelter", icon: I.Apartment, desc: "List animals & send urgent alerts" },
    { key: "buyer", label: "Buyer / Adopter", icon: I.Heart, desc: "Swipe to find your pet" },
    { key: "vet", label: "Vet / Clinic", icon: I.Stethoscope, desc: "Certificates & vaccine reminders" },
  ];

  return (
    <>
      <Header step={1} max={5} />
      <div className="px-5 pb-6 pt-2">
        <div className="flex items-center gap-2 mb-4">
          <I.PawPrint className="h-6 w-6 text-amber-600" />
          <h1 className="text-xl font-semibold">Welcome to PawMatch</h1>
        </div>
        <p className="text-neutral-600 mb-4">You're in Malta 🇲🇹—connect with local pet lovers. Choose how you'll use PawMatch:</p>
        <div className="grid grid-cols-1 gap-3">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => setRole(it.key)}
              className={`text-left p-4 rounded-2xl border transition group ${
                role === it.key ? "bg-amber-50 border-amber-300" : "bg-white border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${role === it.key ? "bg-amber-500 text-white" : "bg-neutral-100 text-neutral-700"}`}>
                  <it.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.label} {it.key === "independent" && <span className="ml-1 text-amber-600">(Recommended)</span>}</div>
                  <div className="text-sm text-neutral-500">{it.desc}</div>
                </div>
                <I.ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-600" />
              </div>
            </button>
          ))}
        </div>
        <button onClick={() => onNext({ role })} className="mt-5 w-full py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-sm hover:bg-amber-600">Continue</button>
        <div className="flex items-center gap-2 mt-3 text-xs text-neutral-500"><I.Info className="h-4 w-4"/> You can add more roles later in Settings.</div>
      </div>
    </>
  );
}

function BuyerPreferences({ onNext, onBack }: any) {
  const [prefs, setPrefs] = useState({
    species: 'Dog',
    size: [] as string[],
    age: [] as string[],
    distance: '10',
  });

  const toggleSize = (size: string) => {
    setPrefs(p => ({
      ...p,
      size: p.size.includes(size) ? p.size.filter(s => s !== size) : [...p.size, size]
    }));
  };

  const toggleAge = (age: string) => {
    setPrefs(p => ({
      ...p,
      age: p.age.includes(age) ? p.age.filter(a => a !== age) : [...p.age, age]
    }));
  };

  return (
    <>
      <Header step={2} max={3} onBack={onBack} />
      <div className="px-5 pb-6 pt-2">
        <h2 className="text-lg font-semibold mb-2">What are you looking for?</h2>
        <p className="text-neutral-600 mb-4">
          Set your preferences to find your perfect pet match.
        </p>

        <Card className="p-4 mb-4 space-y-4">
          <div>
            <div className="text-sm text-neutral-600 mb-2">I'm looking for</div>
            <div className="flex gap-2">
              <Chip active={prefs.species==='Dog'} onClick={()=>setPrefs({...prefs, species:'Dog'})} icon={I.Dog}>Dog</Chip>
              <Chip active={prefs.species==='Cat'} onClick={()=>setPrefs({...prefs, species:'Cat'})} icon={I.Cat}>Cat</Chip>
              <Chip active={prefs.species==='Both'} onClick={()=>setPrefs({...prefs, species:'Both'})}>Either</Chip>
            </div>
          </div>

          <div>
            <div className="text-sm text-neutral-600 mb-2">Size preference</div>
            <div className="flex flex-wrap gap-2">
              {['Small', 'Medium', 'Large'].map(size => (
                <Chip key={size} active={prefs.size.includes(size)} onClick={() => toggleSize(size)}>
                  {size}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-neutral-600 mb-2">Age preference</div>
            <div className="flex flex-wrap gap-2">
              {['Puppy', 'Young (1-3y)', 'Adult (3-7y)', 'Senior (7y+)'].map(age => (
                <Chip key={age} active={prefs.age.includes(age)} onClick={() => toggleAge(age)}>
                  {age}
                </Chip>
              ))}
            </div>
          </div>

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
              className="w-full accent-amber-500"
            />
          </div>
        </Card>

        <button onClick={() => onNext({ preferences: prefs })} className="w-full py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-sm hover:bg-amber-600">
          Find My Perfect Pet
        </button>
      </div>
    </>
  );
}

function PetQuickAdd({ onNext, onBack }: any) {
  const [pets, setPets] = useState<any[]>([]);
  const [draft, setDraft] = useState({ 
    name: "", 
    species: "Dog", 
    breed: "", 
    age: "3", 
    temperament: [] as string[], 
    badges: { vaccinated: true, dna: false } 
  });

  const toggleTemperament = (t: string) => {
    setDraft((d) => ({ ...d, temperament: d.temperament.includes(t) ? d.temperament.filter((x) => x !== t) : [...d.temperament, t] }));
  };

  const addPet = () => {
    if (!draft.name) return;
    setPets((p) => [...p, { ...draft }]);
    setDraft({ name: "", species: draft.species, breed: "", age: "", temperament: [], badges: { vaccinated: true, dna: false } });
  };

  return (
    <>
      <Header step={2} max={5} onBack={onBack} />
      <div className="px-5 pb-6 pt-2 max-h-[700px] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Add your pet(s)</h2>
        <p className="text-neutral-600 mb-4">Create quick profiles now—you can refine later.</p>

        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-neutral-600 mb-1">Name</div>
                <input value={draft.name} onChange={(e)=>setDraft({...draft, name:e.target.value})} placeholder="Luna" className="w-full rounded-xl border border-neutral-300 px-3 py-2" />
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Species</div>
                <div className="flex gap-2">
                  <Chip active={draft.species==='Dog'} onClick={()=>setDraft({...draft, species:'Dog'})} icon={I.Dog}>Dog</Chip>
                  <Chip active={draft.species==='Cat'} onClick={()=>setDraft({...draft, species:'Cat'})} icon={I.Cat}>Cat</Chip>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-neutral-600 mb-1">Breed</div>
                <input value={draft.breed} onChange={(e)=>setDraft({...draft, breed:e.target.value})} placeholder="Border Collie" className="w-full rounded-xl border border-neutral-300 px-3 py-2" />
              </div>
              <div>
                <div className="text-sm text-neutral-600 mb-1">Age (years)</div>
                <input value={draft.age} onChange={(e)=>setDraft({...draft, age:e.target.value})} placeholder="3" className="w-full rounded-xl border border-neutral-300 px-3 py-2" />
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-600 mb-2">Temperament</div>
              <div className="flex flex-wrap gap-2">
                {["Friendly","Calm","Energetic","Gentle","Good with kids","Dog-park pro"].map(tag=> (
                  <Chip key={tag} active={draft.temperament.includes(tag)} onClick={()=>toggleTemperament(tag)}>{tag}</Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-600 mb-2">Health badges</div>
              <div className="flex gap-2 flex-wrap">
                <Chip active={draft.badges.vaccinated} onClick={()=>setDraft({...draft, badges:{...draft.badges, vaccinated:!draft.badges.vaccinated}})} icon={I.ShieldCheck}>Vaccinated</Chip>
                <Chip active={draft.badges.dna} onClick={()=>setDraft({...draft, badges:{...draft.badges, dna:!draft.badges.dna}})} icon={I.Sparkles}>DNA Clear</Chip>
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-600 mb-2">Photos</div>
              <button className="w-full border border-dashed border-neutral-300 rounded-xl py-8 flex flex-col items-center gap-2 hover:bg-neutral-50">
                <I.Upload className="h-5 w-5"/>
                <span className="text-sm text-neutral-600">Drag & drop or click to add</span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button onClick={addPet} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-300 hover:border-neutral-400">
                <I.PlusCircle className="h-4 w-4"/> Add pet to list
              </button>
              <div className="text-sm text-neutral-500">You can add multiple pets.</div>
            </div>
          </div>
        </Card>

        {pets.length > 0 && (
          <Card className="p-4 mb-4">
            <div className="text-sm font-semibold mb-2">My pets</div>
            <div className="flex flex-col gap-2">
              {pets.map((p, i)=> (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-neutral-200">
                  <div>
                    <div className="font-medium">{p.name} · {p.breed || p.species}</div>
                    <div className="text-xs text-neutral-500">{p.age || "?"} yrs · {p.temperament.slice(0,2).join(", ")}</div>
                    <HealthBadges health={[
                      ...(p.badges?.vaccinated ? [{ type: 'vaccinated', date: new Date().toISOString().slice(0,10) }] : []),
                      ...(p.badges?.dna ? [{ type: 'dna_tested', date: new Date().toISOString().slice(0,10) }] : []),
                    ]} />
                  </div>
                  <div className="text-xs text-amber-600">Ready</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <button onClick={()=>onNext({ pets })} className="w-full py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-sm hover:bg-amber-600">Continue</button>
      </div>
    </>
  );
}

function computeFertileWindow(start = 1) {
  return new Set([8,9,10,11,12,13,14].map((d)=>d));
}

function percentCycle(day: number, length: number) {
  return Math.max(0, Math.min(1, day / length));
}

function HeatTracker({ onNext, onBack }: any) {
  const [enabled, setEnabled] = useState(true);
  const days = useMemo(()=>Array.from({length:28}, (_,i)=>i+1), []);
  const fertile = useMemo(()=>computeFertileWindow(1), []);
  const heatStart = 1;
  const cycleDay = 10;

  return (
    <>
      <Header step={3} max={5} onBack={onBack} />
      <div className="px-5 pb-6 pt-2">
        <div className="flex items-center gap-2 mb-2">
          <I.Calendar className="h-5 w-5 text-amber-600"/>
          <h2 className="text-lg font-semibold">Heat tracker</h2>
        </div>
        <p className="text-neutral-600 mb-4">Predict fertile days and auto-suggest matches during the window.</p>

        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Cycle day</div>
              <div className="text-2xl font-semibold">{cycleDay} <span className="text-sm text-neutral-500">/ 28</span></div>
            </div>
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-16 w-16">
                <path d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" stroke="#eee" strokeWidth="4" />
                <path d="M18 2 a 16 16 0 1 1 0 32" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${percentCycle(cycleDay,28)*100}, 100`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-600">{Math.round(percentCycle(cycleDay,28)*100)}%</div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mt-4">
            {days.map(d=> (
              <div key={d} className={`aspect-square rounded-lg flex items-center justify-center text-sm border ${
                d===heatStart ? "bg-red-100 border-red-300" : fertile.has(d) ? "bg-amber-100 border-amber-300" : "bg-white border-neutral-200"
              }`}>{d}</div>
            ))}
          </div>
          <div className="text-xs text-neutral-500 mt-2">Red = heat start · Amber = fertile window</div>
        </Card>

        <Toggle
          checked={enabled}
          onChange={setEnabled}
          label="Enable matchmaking during fertile window"
          sub="We'll notify compatible nearby pets when your pet is likely fertile."
        />

        <button onClick={()=>onNext({ heatMatch: enabled })} className="mt-5 w-full py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-sm hover:bg-amber-600">Continue</button>
      </div>
    </>
  );
}

function SwipePreview({ onNext, onBack }: any) {
  const cards = [
    { name: "Max", breed: "Border Collie", age: 4, distance: "3 km", health:[
      { type: 'vaccinated', date: '2025-09-10' }, { type: 'dna_tested', date: '2025-06-20' }
    ], temperament:["Friendly","Agile"], img:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop" },
    { name: "Odin", breed: "Australian Shepherd", age: 5, distance: "5 km", health:[
      { type: 'vaccinated', date: '2025-08-01' }
    ], temperament:["Energetic"], img:"https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=1200&auto=format&fit=crop" },
  ];
  const [index, setIndex] = useState(0);
  const [matched, setMatched] = useState(false);
  const c = cards[index];

  return (
    <>
      <Header step={4} max={5} onBack={onBack} />
      <div className="px-5 pb-6 pt-2">
        <h2 className="text-lg font-semibold mb-2">Swipe preview</h2>
        <p className="text-neutral-600 mb-4">Right = interested · Left = pass</p>

        <Card className="overflow-hidden">
          <div className="h-64 bg-neutral-100 relative">
            <img src={c.img} alt="pet" className="h-full w-full object-cover" />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <I.MapPin className="h-3 w-3"/> {c.distance}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-2">
              <div className="text-lg font-semibold">{c.name} · {c.breed}</div>
              <div className="text-sm text-neutral-500">{c.age} years</div>
            </div>
            <HealthBadges health={c.health || []} />
            <div className="flex flex-wrap gap-2 mt-3">
              {c.temperament.map((t: string) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-neutral-100 border border-neutral-200">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={()=> setIndex((i)=> (i+1) % cards.length)}
                className="flex-1 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-50"
              >Pass</button>
              <button
                onClick={()=> { setMatched(true); }}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600"
              >Interested</button>
            </div>
          </div>
        </Card>

        <button onClick={onNext} className="mt-5 w-full py-3 rounded-2xl bg-neutral-900 text-white font-medium shadow-sm hover:bg-black">Finish onboarding</button>

        {matched && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
            <Card className="p-5 w-full max-w-sm">
              <div className="text-center">
                <I.Heart className="h-8 w-8 text-rose-500 mx-auto"/>
                <h3 className="text-lg font-semibold mt-2">It's a match!</h3>
                <p className="text-sm text-neutral-600 mt-1">Open chat with Max's owner and choose an arrangement:</p>
                <div className="grid grid-cols-1 gap-2 mt-3 text-left">
                  <Toggle checked={false} onChange={()=>{}} label="Pick of litter"/>
                  <Toggle checked={false} onChange={()=>{}} label="Split puppies 50/50"/>
                  <Toggle checked={false} onChange={()=>{}} label="Stud fee"/>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={()=>setMatched(false)} className="flex-1 py-2 rounded-xl border border-neutral-300">Close</button>
                  <button onClick={()=>setMatched(false)} className="flex-1 py-2 rounded-xl bg-amber-500 text-white">Open Chat</button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

function Dashboard() {
  const [tab, setTab] = useState("match");
  
  return (
    <div className="h-[800px] relative bg-neutral-50">
      <div className="px-5 pt-10 pb-3">
        <div className="flex items-center gap-2">
          <I.PawPrint className="h-6 w-6 text-amber-600"/>
          <h1 className="text-xl font-semibold">PawMatch</h1>
        </div>
        <div className="text-sm text-neutral-600 mt-1">Independent Owner dashboard</div>
      </div>
      <div className="px-5 pb-28 overflow-y-auto">
        {tab === "match" && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><I.Heart className="h-5 w-5 text-rose-500"/><div className="font-semibold">Matches near you</div></div>
            <p className="text-sm text-neutral-600">Enable matchmaking during fertile days to get better matches.</p>
            <button className="mt-3 w-full py-2 rounded-xl bg-amber-500 text-white">Open Swipe Deck</button>
          </Card>
        )}
        {tab === "pets" && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><I.Dog className="h-5 w-5 text-amber-600"/><div className="font-semibold">My Pets</div></div>
            <div className="text-sm text-neutral-600">Add pets, update health info, manage visibility.</div>
            <button className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-300"><I.PlusCircle className="h-4 w-4"/> Add pet</button>
          </Card>
        )}
        {tab === "heat" && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><I.Calendar className="h-5 w-5 text-amber-600"/><div className="font-semibold">Heat Tracker</div></div>
            <div className="text-sm text-neutral-600">Luna is day 10/28. Fertile window: Nov 6–13.</div>
            <button className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-300"><I.Bell className="h-4 w-4"/> Notify compatible studs</button>
          </Card>
        )}
        {tab === "messages" && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><I.MessageCircle className="h-5 w-5 text-amber-600"/><div className="font-semibold">Messages</div></div>
            <div className="text-sm text-neutral-600">Start a chat once you match.</div>
          </Card>
        )}
        {tab === "community" && (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><I.Users2 className="h-5 w-5 text-amber-600"/><div className="font-semibold">Community</div></div>
            <div className="text-sm text-neutral-600">Tips, meetups & success stories in Malta.</div>
          </Card>
        )}
      </div>
      <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[360px] bg-white/90 backdrop-blur rounded-2xl border border-neutral-200 shadow-lg p-2 flex items-center justify-between">
        {[
          { key: "match", label: "Match", icon: I.Heart },
          { key: "pets", label: "My Pets", icon: I.Dog },
          { key: "heat", label: "Heat", icon: I.Calendar },
          { key: "messages", label: "Messages", icon: I.MessageCircle },
          { key: "community", label: "Community", icon: I.Users2 },
        ].map(({key,label,icon:IconComp})=> (
          <button key={key} onClick={()=>setTab(key)} className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl ${tab===key?"text-amber-600":"text-neutral-500 hover:text-neutral-700"}`}>
            <IconComp className="h-5 w-5"/>
            <span className="text-[11px]">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export const NewOnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>({ role: null });

  // Role-based routing logic
  const getFlow = (role: string | null) => {
    if (role === 'buyer') {
      return ['RoleSelect', 'BuyerPreferences', 'SwipePreview', 'Dashboard'];
    }
    if (role === 'shelter' || role === 'vet') {
      // Shelter/Vet: just role → dashboard (simplified for now)
      return ['RoleSelect', 'Dashboard'];
    }
    // Default: Independent/Breeder
    return ['RoleSelect', 'PetQuickAdd', 'HeatTracker', 'SwipePreview', 'Dashboard'];
  };

  const flow = getFlow(data.role);
  const currentScreen = flow[step];
  const maxSteps = flow.length;

  return (
    <Mobile>
      {currentScreen === 'RoleSelect' && (
        <RoleSelect onNext={(d: any) => { setData({...data, ...d}); setStep(1); }} />
      )}
      {currentScreen === 'BuyerPreferences' && (
        <BuyerPreferences onBack={() => setStep(0)} onNext={(d: any) => { setData({...data, ...d}); setStep(2); }} />
      )}
      {currentScreen === 'PetQuickAdd' && (
        <PetQuickAdd onBack={() => setStep(0)} onNext={(d: any) => { setData({...data, ...d}); setStep(2); }} />
      )}
      {currentScreen === 'HeatTracker' && (
        <HeatTracker onBack={() => setStep(step - 1)} onNext={(d: any) => { setData({...data, ...d}); setStep(step + 1); }} />
      )}
      {currentScreen === 'SwipePreview' && (
        <SwipePreview onBack={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />
      )}
      {currentScreen === 'Dashboard' && <Dashboard />}
    </Mobile>
  );
};
