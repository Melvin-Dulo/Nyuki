import { supabase } from '../supabaseClient';
import React, { useState } from "react";
import { 
  Lock, 
  Mail, 
  User, 
  Building2, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  ChevronRight, 
  PhoneCall,
  Activity,
  UserCheck,
  Eye,
  EyeOff
} from "lucide-react";
import { BusinessPlan, UserRole } from "../types";

interface AuthPagesProps {
  onNavigate: (view: string) => void;
  onLoginSuccess: (user: any, business: any) => void;
  initialRolePreset?: string; // "admin" | "customer" | "staff"
}

export default function AuthPages({ onNavigate, onLoginSuccess, initialRolePreset }: AuthPagesProps) {
  const [isRegister, setIsRegister] = useState<boolean>(initialRolePreset === "admin");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("password");
  const [showPassword, setShowPassword] = useState(false);
  // Registration States
  const [businessName, setBusinessName] = useState<string>("");
  const [adminName, setAdminName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [industry, setIndustry] = useState<string>("Clinics/Hospitals");
  const [selectedPlan, setSelectedPlan] = useState<BusinessPlan>(BusinessPlan.MEDIUM);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [accountType, setAccountType] = useState<"customer" | "business" | null>(null);
  const handleLogin = async (e: React.FormEvent, customEmail?: string) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    if (!loginEmail || !password) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    
    try {
      // Direct Real-time Auth with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data?.user) {
        // Fetch matching provider details if they exist
        const { data: providerData } = await supabase
          .from('providers')
          .select('*')
          .eq('id', data.user.id)
          .single();

        onLoginSuccess(data.user, providerData || null);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected authentication timeout occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !adminName || !email || !phone) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Create Login Account in Supabase Auth Engine
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password, // Uses default development "password" block or state
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      const userId = data.user?.id;

      if (userId) {
        // 2. Drop the business profile entry straight into your 'providers' database grid
        const { error: insertError } = await supabase
          .from('providers')
          .insert([
            { 
              id: userId, 
              business_name: businessName, 
              category: industry, 
              phone_number: phone 
            }
          ]);

        if (insertError) {
          setErrorMsg("Profile setup failed: " + insertError.message);
          return;
        }

        alert("Onboarding Complete! Checking parameters.");
        onLoginSuccess(data.user, { business_name: businessName, category: industry });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("A network timeout or error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const quickDemoProfiles = [
    {
      roleLabel: "BUSINESS ADMIN (AfyaCare Clinic)",
      email: "admin@afyacare.co.ke",
      badge: "Medium Plan Trial",
      color: "border-emerald-500 hover:bg-emerald-50/20"
    },
    {
      roleLabel: "BUSINESS ADMIN (Taji Hair Studio)",
      email: "kendi@tajistudio.com",
      badge: "Standard Plan Trial",
      color: "border-amber-500 hover:bg-amber-50/20"
    },
    {
      roleLabel: "CLINIC STAFF (Dr. David Kiprop GP)",
      email: "dr.kiprop@afyacare.co.ke",
      badge: "AfyaCare Practitioner",
      color: "border-blue-500 hover:bg-blue-50/20"
    },
    {
      roleLabel: "REGULAR CUSTOMER (Peter Mwangi)",
      email: "peter@example.com",
      badge: "Free Customer",
      color: "border-[#854d0e] hover:bg-amber-50/20"
    }
  ];

  return (
    <div id="auth-root" className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-amber-200 selection:text-amber-950">
      
      {/* AUTH TOP HEADER */}
      <header className="p-6 border-b border-stone-200 bg-[#FDFBF7]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => onNavigate("landing")}
            className="flex items-center space-x-2 text-stone-600 hover:text-amber-600 font-bold text-sm cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Landing</span>
          </button>

          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate("landing")}>
            <div className="w-10 h-10 bg-amber-500 flex items-center justify-center clip-hex shadow-md shadow-amber-500/10">
              <span className="font-extrabold text-white text-lg">N</span>
            </div>
            <span className="font-bold text-stone-900 tracking-tight text-base italic">Nyuki Platform</span>
          </div>
        </div>
      </header>

      {/* CORE SPLIT SCREEN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow grid lg:grid-cols-12 gap-12 items-center">
        
        {/* DESCRIPTIVE TEXT & EAST AFRICA DEMO ACCESS PANEL */}
        <div className="lg:col-span-6 space-y-8">
          
          <div className="space-y-4">
            <span className="text-amber-600 font-black tracking-widest uppercase text-xs">SOCIALLY CONNECTED PLATFORM</span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
              Instant Tenant Provisioning Services
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed max-w-xl">
              Nyuki provides isolated sandbox profiles to test appointment slots, predictive queues, and M-Pesa automatic STK pushes instantly. Select any direct profile on the right or quick-link underneath to explore immediately.
            </p>
          </div>

          {/* QUICK DEMO PROFILES BLOCK */}
          <div id="demo-profiles-container" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl shadow-stone-200/50">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center">
              <UserCheck className="w-4 h-4 mr-2 text-amber-500" />
              <span>Click to Instant Login as Demorole:</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {quickDemoProfiles.map((prof, i) => (
                <button
                  id={`btn-demo-prof-${i}`}
                  key={prof.email}
                  onClick={(e) => handleLogin(e, prof.email)}
                  disabled={loading}
                  className={`border p-4 rounded-xl text-left transition-all ${prof.color} whitespace-normal leading-normal select-none cursor-pointer disabled:opacity-50`}
                >
                  <span className="block text-[10px] font-black tracking-wider text-amber-800 uppercase leading-none mb-1">
                    {prof.badge}
                  </span>
                  <span className="block font-bold text-stone-900 text-sm leading-tight mb-2">
                    {prof.roleLabel.split(" ")[0]} {prof.roleLabel.substring(prof.roleLabel.indexOf(" "))}
                  </span>
                  <span className="block text-stone-500 text-xs font-mono">{prof.email}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 text-[11px] text-stone-450 text-center leading-normal">
              No registration payload needed to test! Just click any button to skip auth forms. Password default is <code className="font-mono bg-stone-100 px-1 rounded">password</code>.
            </div>
          </div>

        </div>

        {/* AUTHENTICATION SHADOW CARD OR ONBOARD FORM */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-3.5xl p-8 sm:p-10 shadow-xl shadow-stone-200/50">
          
          {/* TABS CONTROLLER */}
          {accountType === null ? (
  <div className="space-y-4 mb-8">

    <h3 className="text-center text-sm font-black uppercase tracking-wider text-stone-500">
      Choose Account Type
    </h3>

    <button
      onClick={() => setAccountType("customer")}
      className="w-full p-5 border rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
    >
      <div className="font-black text-lg">👤 Customer</div>
      <div className="text-sm text-stone-500">
        Book appointments, join queues, and receive updates for free.
      </div>
    </button>

    <button
      onClick={() => setAccountType("business")}
      className="w-full p-5 border rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
    >
      <div className="font-black text-lg">🏢 Business</div>
      <div className="text-sm text-stone-500">
        Manage appointments, staff, and customer queues.
      </div>
    </button>

  </div>
) : accountType === "business" ? (
<>
  <button
    type="button"
    onClick={() => setAccountType(null)}
    className="mb-4 text-sm font-bold text-amber-600 hover:text-amber-700"
  >
    
  ← Back
</button>
  <div className="flex border-b border-stone-200 mb-8">
    <button
      onClick={() => { setIsRegister(false); setErrorMsg(""); }}
      className={`flex-1 text-center font-bold text-sm uppercase pb-4 cursor-pointer transition-all ${
        !isRegister
          ? "border-b-2 border-amber-500 text-stone-950"
          : "text-stone-400 hover:text-stone-700"
      }`}
    >
      Business Sign In
    </button>

    <button
      onClick={() => { setIsRegister(true); setErrorMsg(""); }}
      className={`flex-1 text-center font-bold text-sm uppercase pb-4 cursor-pointer transition-all ${
        isRegister
          ? "border-b-2 border-amber-500 text-stone-950"
          : "text-stone-400 hover:text-stone-700"
      }`}
    >
      Onboard My Business
    </button>
    </div>
{!isRegister ? (
  <form onSubmit={handleLogin} className="space-y-5">

    {/* LOGIN FIELDS HERE */}

  </form>
) : (
  <form onSubmit={handleRegister} className="space-y-5">

    {/* REGISTRATION FIELDS HERE */}

  </form>
)}

</>
) : (
<>
  <button
    type="button"
    onClick={() => setAccountType(null)}
    className="mb-4 text-sm font-bold text-amber-600 hover:text-amber-700"
  >
    ← Back
  </button>

  <div className="mb-8 p-6 border rounded-xl bg-white space-y-5">
    <h3 className="font-black text-lg">
      👤 Create Free Customer Account
    </h3>

    <div>
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
        Full Name *
      </label>
      <input
        type="text"
        placeholder="e.g. Peter Mwangi"
        className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-4 py-3 text-sm"
      />
    </div>

    <div>
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
        Phone Number *
      </label>
      <input
        type="tel"
        placeholder="+254712345678"
        className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-4 py-3 text-sm"
      />
    </div>

    <div>
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
        Email Address *
      </label>
      <input
        type="email"
        placeholder="peter@gmail.com"
        className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-4 py-3 text-sm"
      />
    </div>

    <div>
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
        Password *
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-4 py-3 pr-12 text-sm"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-stone-500" />
          ) : (
            <Eye className="w-4 h-4 text-stone-500" />
          )}
        </button>
      </div>
    </div>

    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800">
      ✓ Unlimited appointment bookings<br />
      ✓ Remote queue access<br />
      ✓ Wait-time tracking<br />
      ✓ SMS service updates<br />
      ✓ Free customer account
    </div>

    <button
      type="button"
      className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 rounded-xl"
    >
      Create Free Account
    </button>
</div>
</>
)}
</div>

</main>

      {/* FOOTER AREA */}
      <footer className="py-6 px-6 border-t border-stone-200 bg-white text-center text-xs text-stone-400 font-semibold uppercase tracking-wider">
  © 2026 Nyuki. All rights reserved.
      </footer>
          </div>
  );
}
