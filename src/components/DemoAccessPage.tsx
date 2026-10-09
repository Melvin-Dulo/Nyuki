
import React from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { UserRole, Business } from "../types";

interface DemoAccessPageProps {
  onNavigate: (view: string) => void;
  onLoginSuccess: (user: any, business: Business | null) => void;
}

export default function DemoAccessPage({
  onNavigate,
  onLoginSuccess,
}: DemoAccessPageProps) {
  const demoProfiles = [
    {
      roleLabel: "Business Admin",
      name: "AfyaCare Clinic",
      email: "admin@afyacare.co.ke",
      description: "Explore business operations and appointment management.",
      badge: "ADMIN DEMO",
      color: "border-emerald-200 hover:border-emerald-500",
      icon: ShieldCheck,
      demoRole: "admin-afyacare",
    },
    {
      roleLabel: "Clinic Staff",
      name: "Dr. David Kiprop",
      email: "dr.kiprop@afyacare.co.ke",
      description: "Explore the staff dashboard and clinic workflow.",
      badge: "STAFF DEMO",
      color: "border-blue-200 hover:border-blue-500",
      icon: Stethoscope,
      demoRole: "staff-afyacare",
    },
    {
      roleLabel: "Regular Customer",
      name: "Peter Mwangi",
      email: "peter@example.com",
      description: "Explore the customer experience and booking dashboard.",
      badge: "CUSTOMER DEMO",
      color: "border-amber-200 hover:border-amber-500",
      icon: UserRound,
      demoRole: "customer",
    },
  ];

  const handleDemoLogin = (role: string) => {
    if (role === "admin-afyacare") {
      onLoginSuccess(
        {
          id: "demo-admin-afyacare",
          name: "AfyaCare Admin",
          email: "admin@afyacare.co.ke",
          role: UserRole.BUSINESS_ADMIN,
          demoMode: true,
        },
        {
          id: "afyacare-demo",
          business_name: "AfyaCare Clinic",
          category: "Healthcare",
        } as Business
      );
    } else if (role === "staff-afyacare") {
      onLoginSuccess(
        {
          id: "demo-staff",
          name: "Dr. David Kiprop",
          email: "dr.kiprop@afyacare.co.ke",
          role: UserRole.STAFF,
          businessId: "afyacare-demo",
          demoMode: true,
        },
        null
      );
    } else if (role === "customer") {
      onLoginSuccess(
        {
          id: "demo-customer",
          name: "Peter Mwangi",
          email: "peter@example.com",
          role: UserRole.CUSTOMER,
          demoMode: true,
        },
        null
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans">
      <header className="border-b border-stone-200 bg-white/80">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/nyuki-logo.png"
              alt="Nyuki"
              className="w-10 h-10 object-contain"
            />
            <div>
              <span className="text-xl font-bold italic">Nyuki</span>
              <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                Bee First
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-amber-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest">
            Explore Nyuki
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 mb-5">
            Demo Access
          </h1>

          <p className="text-stone-600 leading-relaxed">
            Choose a demo profile to explore Nyuki from that user's
            perspective. No registration is required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {demoProfiles.map((profile) => {
            const Icon = profile.icon;

            return (
              <button
                key={profile.demoRole}
                onClick={() => handleDemoLogin(profile.demoRole)}
                className={`bg-white border-2 ${profile.color} rounded-2xl p-6 text-left shadow-sm hover:shadow-lg transition-all flex flex-col`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>

                  <span className="text-[10px] font-black tracking-wider text-stone-600 bg-stone-100 rounded-full px-3 py-2">
                    {profile.badge}
                  </span>
                </div>

                <h2 className="text-xl font-black mb-1">
                  {profile.roleLabel}
                </h2>

                <p className="text-amber-700 font-bold text-sm mb-3">
                  {profile.name}
                </p>

                <p className="text-sm text-stone-600 leading-relaxed mb-5">
                  {profile.description}
                </p>

                <div className="mt-auto pt-4 border-t border-stone-100">
                  <p className="text-xs text-stone-500 break-all mb-4">
                    {profile.email}
                  </p>

                  <span className="flex items-center justify-between text-sm font-bold text-stone-900">
                    Enter Demo
                    <ArrowRight className="w-4 h-4 text-amber-600" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-stone-500 mt-8">
          Demo profiles use sample data. Changes may not be permanently saved.
        </p>
      </main>
    </div>
  );
}
