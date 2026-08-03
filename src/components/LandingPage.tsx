import React, { useState } from "react";
import { 
  Activity, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Bell, 
  ArrowRight, 
  Zap, 
  Award, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  ChevronRight,
  MonitorCheck
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (role?: string) => void;
}

export default function LandingPage({ onNavigate, onOpenAuth }: LandingPageProps) {
  const [activeIndustry, setActiveIndustry] = useState<string>("Healthcare");

  const industries = [
    {
      name: "Health & Wellness",
      title: "Clinics, Hospitals & Specialists",
      desc: "Book appointments with clinics, hospitals, specialists, and wellness providers from one place.",
      stats: "24/7 Appointment Booking",
      icon: Activity
    },
    {
      name: "Beauty & Salon",
      title: "Salons, Barbers & Spas",
      desc: "Discover trusted beauty professionals, compare services, and schedule appointments instantly.",
      stats:  "Instant Online Booking",
      icon: Sparkles
    },
    {
      name: "Professional Services",
      title: "Consultants & Business Services",
      desc: "Connect with accountants, consultants, legal professionals, and other service providers.",
      stats:  "Verified Providers",
      icon: Building2
    },
    {
      name: "Education & Tutoring",
      title: "Tutors, Coaches & Training",
      desc: "Book tutoring sessions, training programs, coaching appointments, and educational services.",
      stats: "Flexible Scheduling",
      icon: Users
    }
  ];

  return (
    <div id="landing-root" className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* HEADER NAVIGATION */}
      <header id="landing-header" className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center space-x-3">
            <img
              src="/nyuki-logo.png"
              alt="Nyuki"
              className="w-10 h-10 object-contain"
            />

            <div>
              <span className="text-2xl font-bold tracking-tight text-stone-900 italic">
                Nyuki
              </span>
              <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none mt-0.5">
                Bee First
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-stone-600">
            <a href="#features" className="hover:text-amber-600 transition-colors">Features</a>
            <a href="#industries" className="hover:text-amber-600 transition-colors">Industries</a>
            <a href="#pricing" className="hover:text-amber-600 transition-colors">Pricing</a>
            <button onClick={() => onNavigate("careers")} className="hover:text-amber-600 transition-colors cursor-pointer">Careers</button>
            <a href="#contact" className="hover:text-amber-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              id="btn-nav-login"
              onClick={() => onOpenAuth()} 
              className="text-stone-700 font-bold text-sm px-4 py-2 hover:text-amber-600 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button 
              id="btn-nav-getstarted"
              onClick={() => onOpenAuth("admin")} 
              className="bg-stone-950 text-[#faf8f5] hover:bg-stone-800 border-2 border-stone-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
<section id="hero-sec" className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-radial from-amber-100/50 to-transparent">  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center max-w-3xl mx-auto">

      <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-none mb-6">
        Find and Book<br/>
        <span className="text-amber-600">Trusted Services.</span>
      </h1>
      
      <p className="text-lg sm:text-xl text-stone-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
        Discover trusted service providers, book appointments, and pay securely—all in one place with Nyuki.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          id="btn-hero-cta"
          onClick={() => onOpenAuth("admin")}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-8 py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer border border-amber-600"
        >
          <span>Find Services</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>

    </div>  
  </div>      
</section>      


      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-24 bg-stone-900 text-[#faf8f5] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(217,119,6,0.1),transparent)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">Explore Services</h2>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-white">
              Find the Right Service for Every Need
            </h3>
            <p className="text-stone-400">
              Browse trusted providers across multiple categories, and book appointments in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Appointment Booking */}
            <div className="bg-stone-800 p-8 rounded-2xl border border-stone-800 hover:border-amber-500/30 transition-all group">
              <div className="bg-amber-500/10 text-amber-500 p-4 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              {/* FIXED LINE 200 SYNTX ERROR HERE */}
              <h4 className="text-xl font-bold mb-3 text-white">
                Book Services Instantly
              </h4>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Find trusted providers, view available times, and book appointments in minutes from any device.
              </p>
              <ul className="space-y-2 text-xs font-bold text-stone-300">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Verified Service Providers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Real-Time Availability</span>
                </li>
              </ul>
            </div>

            {/* Queue Board Engine */}
            <div className="bg-stone-800 p-8 rounded-2xl border border-stone-800 hover:border-amber-500/30 transition-all group">
              <div className="bg-amber-500/10 text-amber-500 p-4 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">Grow Your Business</h4>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Reach more customers, manage bookings effortlessly, and accept payments through one simple platform.
              </p>
              <ul className="space-y-2 text-xs font-bold text-stone-300">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>More Customer Bookings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Integrated M-Pesa Payments</span>
                </li>
              </ul>
            </div>

            {/* Micro Alerts */}
            <div className="bg-stone-800 p-8 rounded-2xl border border-stone-800 hover:border-amber-500/30 transition-all group">
              <div className="bg-amber-500/10 text-amber-500 p-4 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
                <Bell className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">Stay Informed Every Step</h4>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Receive instant notifications about bookings, payments, reminders, and appointment updates directly to your phone.
              </p>
              <ul className="space-y-2 text-xs font-bold text-stone-300">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Appointment Reminders</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Booking & Payment Updates</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* INDUSTRIES FOCUS SECTION */}
      <section id="industries" className="py-24 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Service Categories</h2>
              <h3 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-6">
                Find Services for Every Need
              </h3>
              <p className="text-stone-600 mb-8 leading-relaxed">
                Explore trusted providers across multiple categories. Book appointments, compare services, and discover businesses near you.
              </p>

              <div className="space-y-3">
                {industries.map((ind) => (
                  <button
                    key={ind.name}
                    onClick={() => setActiveIndustry(ind.name)}
                    className={`w-full flex items-center justify-between p-4.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeIndustry === ind.name
                        ? "bg-amber-500/10 border-amber-500 text-stone-900 shadow-sm"
                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ind.icon className={`w-5 h-5 ${activeIndustry === ind.name ? "text-amber-600" : "text-stone-400"}`} />
                      <span className="font-bold text-sm">{ind.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              {industries.map((ind) => {
                if (ind.name !== activeIndustry) return null;
                const IndIcon = ind.icon;
                return (
                  <div key={ind.name} className="bg-stone-900 leading-normal rounded-3xl p-8 sm:p-12 text-[#faf8f5] shadow-2xl relative overflow-hidden animate-fade-in border border-stone-800">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="flex items-center space-x-3 text-amber-500 mb-8 bg-amber-500/10 px-4 py-2 rounded-xl w-fit border border-amber-500/20">
                      <IndIcon className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wider">{ind.name} Specialized</span>
                    </div>

                    <h4 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-white">
                      {ind.title} Customer Flow
                    </h4>
                    <p className="text-stone-400 leading-relaxed text-sm mb-8">
                      {ind.desc} Experience complete tenant-level security ensuring compliance, direct assignment trackers, and instant operational reporting.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-8 border-t border-stone-800">
                      <div>
                        <span className="block text-4xl font-extrabold text-white tracking-tight">
                          {ind.stats.split(" ")[0]}
                        </span>
                        <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
                          {ind.stats.substring(ind.stats.indexOf(" ") + 1)}
                        </span>
                      </div>
                      <div>
                        <span className="block text-4xl font-extrabold text-[#faf8f5] tracking-tight">✓ Live</span>
                        <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
                          M-Pesa STK Pay ready
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* PRICING PLANS SECTION */}
      <section id="pricing" className="py-24 bg-stone-50 border-t border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Clear KES Billing</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-4">
              Transaction-Based Pricing
            </h3>
          </div>

          {/* Customer Pricing Tier Notice */}
          <div className="mt-12 text-center bg-amber-50/60 border border-amber-500/15 p-6 rounded-2xl max-w-2xl mx-auto">
            <h4 className="text-sm font-bold text-stone-900 mb-1">Are you a regular customer/patient?</h4>
            <p className="text-xs text-stone-600">
              <p className="text-stone-600">
  Create a free customer account to book appointments, join queues remotely, track wait times, and receive service updates at no cost.
</p>
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-stone-900 text-[#faf8f5] pt-20 pb-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 pb-16 border-b border-stone-800">
            
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-amber-500 text-stone-950 p-2 rounded-lg">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">NYUKI</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
                Nyuki represents Swedish coordination design fused with Swahili agility. Operating decentralized, highly robust customer-routing systems in Africa.
              </p>
              <div className="mt-6 text-xs text-stone-500 font-semibold uppercase">
                Bee First. Anywhere.
              </div>
            </div>

            <div>
              <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform</h5>
              <ul className="space-y-2.5 text-xs font-semibold text-stone-400">
                <li><a href="#features" className="hover:text-amber-500 transition-all">Core Features</a></li>
                <li><a href="#industries" className="hover:text-amber-500 transition-all">Vertical Industries</a></li>
                <li><a href="#pricing" className="hover:text-amber-500 transition-all">Monthly Pricing</a></li>
                <li><button onClick={() => onNavigate("careers")} className="hover:text-amber-500 transition-all text-left">Careers Inside Nyuki</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Regional Reach</h5>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li>Nairobi</li>
                <li>Mombasa</li>
                <li>Kisumu</li>
                <li>Eldoret</li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support & Contact</h5>
              <ul className="text-xs font-semibold text-stone-300 space-y-2">
                <li>nyukiafrica@gmail.com</li>
                <li>+254 712 345678</li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider">
            <p>© 2026 Nyuki Flow Inc. All rights reserved.</p>
            <p>Sovereign multi-tenant architectural compliance v1.0.1</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
