import React, { useState } from "react";
import { 
  Building, 
  Heart, 
  MapPin, 
  ArrowLeft, 
  Send, 
  Award, 
  Sparkles, 
  Zap, 
  Coffee, 
  ShieldAlert,
  FileCheck2,
  CheckCircle2
} from "lucide-react";

interface CareersPageProps {
  onNavigate: (view: string) => void;
}

export default function CareersPage({ onNavigate }: CareersPageProps) {
  const [selectedRole, setSelectedRole] = useState<string>("Lead Full-Stack Queue Service Architect");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // ... (retaining existing jobs list)
  const jobs = [
    {
      title: "Lead Full-Stack Queue Service Architect",
      department: "Engineering (Backend Authoritative)",
      location: "Upper Hill Office, Nairobi / Hybrid",
      salary: "KES 280,000 - 410,000 /mo",
      description: "Own the core queueing scheduling engine logic. Scale Africa's Talking SMS triggers, design tenant-isolated cache hierarchies, and build ultra-reliable websocket event broadcast protocols.",
      requirements: [
        "4+ Years scaling Node.js endpoints with strict type structures",
        "Deep familiarity with concurrent database transactions, indexing, and redis memory tables",
        "Comfortable deploying fully production-grade Docker microservices in cloud systems"
      ]
    },
    {
      title: "Senior Frontend Engineer (React / Tailwind)",
      department: "Product Design & Interfaces",
      location: "Upper Hill Office, Nairobi / Hybrid",
      salary: "KES 180,000 - 290,000 /mo",
      description: "Form the primary high-uptime dashboards for Business Admins, staff controllers, and customer booking tunnels. Refine responsive visual feedback and micro-interactions.",
      requirements: [
        "Proven expertise in TypeScript, React, and intensive custom Tailwind utility layering",
        "Rigorous commitment to layouts, user conversion rates, and accessible mobile touch-targets",
        "Aesthetic refinement; can turn strict product wireframes into beautiful frontends instantly"
      ]
    },
    {
      title: "Regional Sales & Customer Success Lead",
      department: "Growth & Customer Experience",
      location: "Dar es Salaam, Tanzania / Nairobi, Kenya",
      salary: "KES 150,000 - 220,000 /mo + Commission",
      description: "Onboard clinics, hospitals, premier salons, SACCO branches, and government bureaus. Deliver outstanding integration support and manage M-Pesa client accounts.",
      requirements: [
        "3+ Years in SaaS business-to-business sales or key account customer support roles",
        "Strong familiarity with regional service networks in East Africa",
        "Excellent communication in Swahili, English, and regional dialects"
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !coverLetter) {
      alert("Please complete all required fields (Name, Email, and Cover Letter).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          roleApply: selectedRole,
          resumeUrl: resumeUrl || "https://nyuki.co.ke/resumes/simulated_resume.pdf",
          coverLetter
        })
      });

      if (res.ok) {
        setSuccess(true);
        // Clear forms
        setName("");
        setEmail("");
        setPhone("");
        setCoverLetter("");
        setResumeUrl("");
      } else {
        const errData = await res.json();
        alert(errData.error || "Application submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="careers-root" className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-950 pb-20">
      
      {/* HEADER BAR */}
      <div className="bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-50 py-4.5 px-6">
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
            <span className="font-bold text-stone-900 tracking-tight text-base italic">Nyuki Careers</span>
          </div>
        </div>
      </div>

      {/* TOP HEADER INTRO */}
      <section className="bg-gradient-to-b from-amber-500/10 to-transparent py-16 text-center max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center space-x-2 bg-amber-500/15 text-amber-900 px-3 py-1 rounded-full text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JOIN THE SWARM</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight leading-none mb-6">
          Help Africa Spend Less Time<br/>
          <span className="text-amber-600">Waiting in Line</span>
        </h1>
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-semibold">
          Wait time is lost potential. At Nyuki, we are engineering the decentralized customer flow operating system for global service hubs. Join us in shaping absolute convenience.
        </p>
      </section>

      {/* WORKSPACE & BENEFITS BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-4 gap-6">
          
          <div className="bg-stone-900 text-white p-8 rounded-2xl md:col-span-2 border border-stone-800">
            <span className="text-amber-500 font-black uppercase text-[10px] tracking-widest block mb-1">OUR CORE MISSION</span>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">Eradicate Clutter, Fasten Services</h3>
            <p className="text-stone-400 text-xs leading-relaxed mb-6">
              Paper slips are wasteful. Shout-out line calls are confusing. We believe every human has the sovereign right to know precisely when they will receive care, a haircut, or a SACCO check.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-stone-350">
              <div>
                <span className="text-amber-500 block text-lg font-black">1.4 Million</span>
                <span>Minutes Saved Daily</span>
              </div>
              <div>
                <span className="text-amber-500 block text-lg font-black">99.98%</span>
                <span>SMS Triggers Uptime</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200">
            <div className="bg-stone-100 text-stone-700 w-10 h-10 rounded-xl flex items-center justify-center mb-6">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm mb-2 uppercase">Agile Compensation</h4>
            <p className="text-stone-500 text-xs leading-relaxed">
              Highly competitive base pay in local KES, premium health cover matching, and stock option frameworks.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200">
            <div className="bg-stone-100 text-stone-700 w-10 h-10 rounded-xl flex items-center justify-center mb-6">
              <Coffee className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm mb-2 uppercase font-sans">Upper Hill Hive</h4>
            <p className="text-stone-500 text-xs leading-relaxed">
              Unlimited specialty tea, delicious lunches, custom ergonomic workspaces, and full standby solar inverter backups.
            </p>
          </div>

        </div>
      </section>

      {/* DETAILED ACTIVE JOBS & THE DYNAMIC FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="job-apply-section" className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* JOB LISTINGS CELL */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-black text-stone-900 tracking-tight uppercase mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2 text-amber-500" />
              <span>Available Opportunities</span>
            </h3>

            {jobs.map((job) => (
              <div 
                key={job.title}
                className={`bg-white rounded-2xl border p-6 sm:p-8 cursor-pointer transition-all ${
                  selectedRole === job.title 
                    ? "border-amber-500 ring-2 ring-amber-500/15 bg-amber-50/10" 
                    : "border-stone-200 hover:border-stone-400"
                }`}
                onClick={() => setSelectedRole(job.title)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-600 block uppercase tracking-wider">{job.department}</span>
                    <h4 className="font-bold text-lg text-stone-900 leading-tight mt-1">{job.title}</h4>
                  </div>
                  <span className="bg-stone-100 text-stone-650 text-xs font-extrabold px-3 py-1 rounded-full whitespace-nowrap self-start">
                    {job.salary.split(" ")[0] === "KES" ? job.salary.substring(0, 15) : "Fulltime"}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-500 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>

                <p className="text-stone-600 text-xs leading-relaxed mb-6">{job.description}</p>

                <div className="border-t border-stone-100 pt-4">
                  <span className="text-stone-400 text-[10px] font-black uppercase tracking-wider block mb-2">Qualifications desired:</span>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-amber-600 font-bold mr-1.5 text-xs">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* APPLICATION FORM CELL */}
          <div id="application-form" className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-xl shadow-stone-200/50 sticky top-24">
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight uppercase">Quick Submit Application</h3>
              <p className="text-xs text-stone-500 leading-normal mt-1">
                Applying for: <strong className="text-amber-800 font-bold">{selectedRole}</strong>
              </p>
            </div>

            {success ? (
              <div id="apply-success-alert" className="bg-amber-50 border border-amber-500/25 rounded-2xl p-6 text-center animate-fade-in">
                <div className="bg-amber-500 text-stone-950 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-base uppercase mb-1">Application Submitted!</h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-6">
                  ASANTE SANA! We have captured your submission and logged it into our recruitment database. Our leadership team will review and get back within 7 working days.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  Apply Another Role
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Your Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Silas Kipruto"
                    required
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-stone-200 hover:border-stone-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-xl px-4 py-3 text-sm font-semibold text-stone-800 transition-all placeholder:text-stone-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="silas@kiptech.io"
                      required
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-stone-200 hover:border-stone-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-xl px-4 py-3 text-sm font-semibold text-stone-800 transition-all placeholder:text-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+254 7..."
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-stone-200 hover:border-stone-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-xl px-4 py-3 text-sm font-semibold text-stone-800 transition-all placeholder:text-stone-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Simulated Resume Link (Google Drive / GitHub) *</label>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/..."
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-stone-200 hover:border-stone-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-xl px-4 py-3 text-sm font-semibold text-stone-800 transition-all placeholder:text-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Tell Us Why You Are Perfect For Nyuki *</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Breeding high-concurrency systems is my sweet honey. I built..."
                    value={coverLetter} 
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-stone-200 hover:border-stone-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-xl px-4 py-3 text-sm font-semibold text-stone-800 transition-all placeholder:text-stone-400 resize-none"
                  ></textarea>
                </div>

                <div className="text-[10px] text-stone-450 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-150">
                  By submitting this application, you authorize the Nyuki Swarm talent acquisition team to verify academic or regional coordinates directly.
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-205 disabled:text-stone-400 text-stone-950 font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center space-x-2 cursor-pointer border border-amber-600"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Transmitting..." : "Submit Job Application"}</span>
                </button>

              </form>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}
