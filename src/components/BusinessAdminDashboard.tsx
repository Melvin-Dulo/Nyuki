import React, { useEffect, useState } from "react";
import { 
  Building2, 
  Calendar, 
  Users, 
  Briefcase, 
  CreditCard, 
  FileSpreadsheet, 
  ShieldCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Tv, 
  Grid3X3, 
  PhoneCall, 
  Bell, 
  DollarSign, 
  UserPlus, 
  LogOut,
  Sparkles,
  Award
} from "lucide-react";
import {
  AuditLog,
  UserRole,
  AppointmentStatus
} from "../types";
import AnalyticsDashboardComponent from "./AnalyticsDashboardComponent";
// Import your Supabase client instance
import { supabase } from "../supabaseClient";
interface BusinessAdminDashboardProps {
  business: Business;
  adminUser: User;
  onLogout: () => void;
  onUpdateBusiness: (updated: Business) => void;
}

export default function BusinessAdminDashboard({ 
  business, 
  adminUser, 
  onLogout,
  onUpdateBusiness 
}: BusinessAdminDashboardProps) {
  
  const [activeTab, setActiveTab] = useState<string>("Overview");

  // Core business-isolated database states
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [notifLogs, setNotifLogs] = useState<any[]>([]);

  // Editing service states
  const [showAddSvc, setShowAddSvc] = useState<boolean>(false);
  const [svcName, setSvcName] = useState<string>("");
  const [svcPrice, setSvcPrice] = useState<number>(1500);
  const [svcDuration, setSvcDuration] = useState<number>(30);
  const [svcDesc, setSvcDesc] = useState<string>("");

  // Plan trigger states
  const [phoneForSTK, setPhoneForSTK] = useState<string>(adminUser.phone || "+254 712 345678");
  const [stkStateMsg, setStkStateMsg] = useState<string>("");
  const [stkLoading, setStkLoading] = useState<boolean>(false);

  // Invite Staff states
  const [showAddStaff, setShowAddStaff] = useState<boolean>(false);
  const [stfName, setStfName] = useState<string>("");
  const [stfEmail, setStfEmail] = useState<string>("");
  const [stfPhone, setStfPhone] = useState<string>( "");

  // Business settings profile edit states
  const [bzName, setBzName] = useState<string>(business.name);
  const [bzOperatingStart, setOperatingStart] = useState<string>(business.operatingHours?.start || "08:00");
  const [bzOperatingEnd, setOperatingEnd] = useState<string>(business.operatingHours?.end || "17:00");
  const [bzDesc, setBzDesc] = useState<string>(business.description || "");
  const [bzPhone, setBzPhone] = useState<string>(business.phone || "");

  useEffect(() => {
    fetchTenantPayload();
  }, [business.id]);

  const fetchServicesFromSupabase = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("provider_id", business.id);

    if (error) {
      console.error("Error reading services:", error.message);
    } else if (data) {
      // Map database schema to your local Service types if necessary
      const formattedServices: Service[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        priceKES: Number(item.price_kes),
        durationMinutes: item.duration_minutes,
        description: item.description || "",
        isActive: item.is_active ?? true,
        assignedStaffIds: []
      }));
      setServices(formattedServices);
    }
  };

  const fetchTenantPayload = async () => {
    try {
      // Fetch services directly from our new Supabase cluster table
      await fetchServicesFromSupabase();

      // Maintain internal infrastructure mocks for sibling pipelines
      const [stfRes, aptRes, qRes, invRes, appRes, nRes] = await Promise.all([
        fetch(`/api/staff?businessId=${business.id}`),
        fetch(`/api/appointments?businessId=${business.id}`),
        fetch(`/api/queue?businessId=${business.id}`),
        fetch(`/api/billing/invoices?businessId=${business.id}`),
        fetch("/api/careers/applications"),
        fetch(`/api/notifications/logs?businessId=${business.id}`)
      ]);

      if (stfRes.ok) setStaff(await stfRes.json());
      if (aptRes.ok) setAppointments(await aptRes.json());
      if (qRes.ok) setQueue(await qRes.json());
      if (invRes.ok) setInvoices(await invRes.json());
      if (appRes.ok) setApplications(await appRes.json());
      if (nRes.ok) setNotifLogs(await nRes.json());

    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSvc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!svcName || !svcPrice) return;

    try {
      const { data, error } = await supabase
        .from("services")
        .insert([
          {
            provider_id: business.id,
            name: svcName,
            price_kes: svcPrice,
            duration_minutes: svcDuration,
            description: svcDesc,
            is_active: true
          }
        ]);

      if (error) {
        alert("Could not save service to regional engine: " + error.message);
      } else {
        setSvcName("");
        setSvcPrice(1500);
        setSvcDuration(30);
        setSvcDesc("");
        setShowAddSvc(false);
        
        // Dynamic re-fetch down from database line
        await fetchServicesFromSupabase();
      }
    } catch (er) { 
      console.error(er); 
    }
  };

  const handleUpdateSvcStatus = async (svcId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ is_active: isActive })
        .eq("id", svcId);

      if (error) {
        alert("Could not update operational state: " + error.message);
      } else {
        await fetchServicesFromSupabase();
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stfName || !stfEmail) return;

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          name: stfName,
          email: stfEmail,
          phone: stfPhone
        })
      });

      if (res.ok) {
        setStfName("");
        setStfEmail("");
        setStfPhone("");
        setShowAddStaff(false);
        const stfRes = await fetch(`/api/staff?businessId=${business.id}`);
        if (stfRes.ok) setStaff(await stfRes.json());
      }
    } catch (er) { console.error(er); }
  };

  const handleTriggerSTKSim = async (plan: BusinessPlan, price: number) => {
    setStkLoading(true);
    setStkStateMsg("Contacting Safaricom Daraja STK Gateways...");
    try {
      const res = await fetch("/api/billing/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          phone: phoneForSTK,
          amountKES: price,
          planName: `${plan} BUSINESS PLAN`
        })
      });

      if (res.ok) {
        const payload = await res.json();
        setStkStateMsg(`STK PUSH EXECUTED! KES ${price} billed. Safaricom terminal reference: ${payload.referenceId || "N/A"}.`);
        onUpdateBusiness({
          ...business,
          activePlan: plan,
          billingStatus: "Active",
          renewalDate: payload.invoice?.dueDate || "30 Days"
        });
        const invRes = await fetch(`/api/billing/invoices?businessId=${business.id}`);
        if (invRes.ok) setInvoices(await invRes.json());
      } else {
        const err = await res.json();
        setStkStateMsg(`M-Pesa execution rejected: ${err.error}`);
      }
    } catch (er) {
      console.error(er);
      setStkStateMsg("A network timeout occurred.");
    } finally {
      setStkLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    onUpdateBusiness({
      ...business,
      name: bzName,
      operatingHours: { start: bzOperatingStart, end: bzOperatingEnd },
      description: bzDesc,
      phone: bzPhone
    });
    alert("Business Profile configurations saved successfully.");
  };

  return (
    <div id="admin-dashboard-root" className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION CONTROLS */}
      <aside className="w-full md:w-64 bg-stone-900 text-[#faf8f5] border-r border-stone-850 flex flex-col justify-between p-6 shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-10 pb-6 border-b border-stone-800">
            <div className="w-10 h-10 bg-amber-500 flex items-center justify-center rounded-xl shadow-md shadow-amber-500/15">
              <span className="font-extrabold text-white text-lg">N</span>
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-widest block leading-none italic">Nyuki Admin</span>
              <span className="text-[10px] text-stone-400 mt-1 block">Upper Hill Terminal</span>
            </div>
          </div>

          <p className="text-[10px] text-stone-500 font-black tracking-widest uppercase mb-4">Operations Center</p>
          
          <nav className="space-y-1.5">
            {["Overview", "Queue Board", "Care Catalog", "Staff Directory", "KES Billing", "Recruiting Board", "Settings Profile"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left font-bold text-xs uppercase px-4 py-3 rounded-xl transition-all cursor-pointer block leading-none ${
                    isActive 
                      ? "bg-amber-500 text-stone-950 shadow shadow-amber-500/10" 
                      : "text-stone-300 hover:bg-stone-850 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tenant Details Card */}
        <div id="tenant-details-card" className="mt-8 border-t border-stone-800 pt-6 space-y-3.5">
          <div className="flex items-center space-x-2 bg-stone-850 p-3.5 rounded-xl border border-stone-800">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="overflow-hidden">
              <span className="block text-[11px] text-white font-bold leading-none truncate">{business.name}</span>
              <span className="text-[9px] text-stone-400 font-medium block mt-1 truncate">Revenue Model: Transaction-Based (1% Customer Fee + 3% Business Commission)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-1 border border-stone-700 hover:border-white text-stone-400 hover:text-[#faf8f5] text-xs font-bold leading-none py-2 rounded-lg transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKING AREA PANEL */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* --- OVERVIEW TAB --- */}
        {activeTab === "Overview" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              <span className="bg-amber-500 text-stone-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full w-fit block leading-none border border-amber-600 mb-3">
                Live Console Area
              </span>
              <h1 className="text-stone-900 font-extrabold text-xl sm:text-2xl uppercase tracking-tight">
                Corporate Control center
              </h1>
              <p className="text-stone-500 text-xs mt-0.5">
                Overview metrics computed dynamically for <strong>{business.name}</strong>.
              </p>
            </div>
            <AnalyticsDashboardComponent businessId={business.id} />
          </div>
        )}

        {/* --- QUEUE BOARD TAB --- */}
        {activeTab === "Queue Board" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              <h2 className="text-stone-900 font-black text-lg uppercase">Global Queue Diagnostics</h2>
              <p className="text-stone-500 text-xs mt-0.5">Live listings of waiting and called customer references in your branch.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              {queue.length === 0 ? (
                <p className="text-stone-400 text-xs leading-normal">No customer queues generated yet. Use the customer console to book or test triggers.</p>
              ) : (
                <div className="space-y-3">
                  {queue.map(entry => (
                    <div key={entry.id} className="p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold bg-stone-50 border px-2.5 py-1 rounded text-stone-850">
                          {entry.queueNumber}
                        </span>
                        <div>
                          <strong className="text-stone-900 text-sm font-semibold">{entry.customerName}</strong>
                          <span className="block text-xs text-stone-500">Joined at: {entry.joinedAt.split("T")[1]?.substring(0, 5) || "Active"}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-stone-100 font-bold px-2 py-0.5 rounded text-stone-700">
                        {entry.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- CARE SERVICE CATALOG CONFIGURATION TAB --- */}
        {activeTab === "Care Catalog" && (
          <div className="space-y-8 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200">
              <div>
                <h2 className="text-stone-900 font-black text-lg uppercase flex items-center">
                  <span>Service Inventory & Pricing</span>
                </h2>
                <p className="text-stone-500 text-xs mt-0.5">Define consultation packages, pricing parameters (KES), and appointment durations.</p>
              </div>

              <button
                id="btn-add-svc-catalog"
                type="button"
                onClick={() => setShowAddSvc(!showAddSvc)}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4.5 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-500" />
                <span>{showAddSvc ? "Cancel Setup" : "Setup New Service"}</span>
              </button>
            </div>

            {showAddSvc && (
              <form onSubmit={handleCreateSvc} className="bg-white p-6 rounded-2xl border border-amber-500/30 max-w-xl space-y-4 animate-fade-in">
                <h3 className="font-bold text-sm text-stone-900 uppercase">Input Service Inventory Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Service Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Skin biopsy treatment"
                      value={svcName}
                      onChange={(e) => setSvcName(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Price (KES) *</label>
                    <input
                      type="number"
                      required
                      placeholder="1500"
                      value={svcPrice}
                      onChange={(e) => setSvcPrice(Number(e.target.value))}
                      className="w-full bg-[#faf8f5] border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Duration minutes *</label>
                    <input
                      type="number"
                      required
                      placeholder="30"
                      value={svcDuration}
                      onChange={(e) => setSvcDuration(Number(e.target.value))}
                      className="w-full bg-[#faf8f5] border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Brief Description</label>
                    <input
                      type="text"
                      placeholder="Professional checking, treatment..."
                      value={svcDesc}
                      onChange={(e) => setSvcDesc(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs px-5 py-2 rounded-lg cursor-pointer transition-all border border-amber-600"
                >
                  Confirm and Log Service
                </button>
              </form>
            )}

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {services.map(s => (
                <div key={s.id} className={`bg-white p-6 rounded-2xl border flex flex-col justify-between ${s.isActive ? "border-stone-200" : "border-stone-100 opacity-60"}`}>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] bg-stone-100 text-[#451a03] font-bold px-2 py-0.5 rounded-full uppercase">
                        {s.durationMinutes} Mins
                      </span>
                      <span className="font-extrabold text-sm text-amber-800">KES {s.priceKES}</span>
                    </div>

                    <h4 className="font-bold text-stone-900 text-sm leading-snug mb-2">{s.name}</h4>
                    <p className="text-stone-500 text-xs leading-normal mb-6">{s.description || "No customized details provided."}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-2">
                    <span className="text-[10px] font-bold text-stone-400">STATUS:</span>
                    <button 
                      type="button"
                      onClick={() => handleUpdateSvcStatus(s.id, !s.isActive)}
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded cursor-pointer ${
                        s.isActive ? "bg-emerald-100 text-emerald-850" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {s.isActive ? "Active (On)" : "Disabled (Off)"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* --- STAFF ROSTER DIRECTORY TAB --- */}
        {activeTab === "Staff Directory" && (
          <div className="space-y-8 animate-fade-in font-sans">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200">
              <div>
                <h2 className="text-stone-900 font-black text-lg uppercase flex items-center">
                  <span>Assigned Coordinators</span>
                </h2>
                <p className="text-stone-500 text-xs">Invite, review, and allocate doctors, hair stylists, or branch teller roles here.</p>
              </div>

              <button
                id="btn-invite-staff-catalog"
                type="button"
                onClick={() => setShowAddStaff(!showAddStaff)}
                className="bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs px-4.5 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-500" />
                <span>{showAddStaff ? "Cancel Invite" : "Invite New Coordinator"}</span>
              </button>
            </div>

            {showAddStaff && (
              <form onSubmit={handleAddStaff} className="bg-white p-6 rounded-2xl border border-amber-500/30 max-w-xl space-y-4 animate-fade-in">
                <h3 className="font-bold text-sm text-stone-950 uppercase">Invite Staff Credentials</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Mercy Mwangi"
                      value={stfName}
                      onChange={(e) => setStfName(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Corporate Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="mercy@business.co.ke"
                      value={stfEmail}
                      onChange={(e) => setStfEmail(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Safaricom Telephone</label>
                  <input
                    type="tel"
                    placeholder="+254 7..."
                    value={stfPhone}
                    onChange={(e) => setStfPhone(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 outline-none font-mono"
                  />
                </div>

                <div className="text-[10px] text-stone-500 leading-relaxed bg-[#faf8f5] p-3 rounded-xl">
                  🔔 Inviting creates a mock staff credential linked to this tenant automatically. Default password remains <code className="font-mono bg-stone-100 border px-1">password</code>.
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs px-5 py-2 rounded-lg cursor-pointer transition-all border border-amber-600"
                >
                  Generate Staff Invitations
                </button>
              </form>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map(member => (
                <div key={member.id} className="bg-white p-6 rounded-2xl border border-stone-200">
                  <span className="text-[9px] bg-amber-500/10 text-amber-800 font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/10 block w-fit mb-3">
                    {member.role === UserRole.BUSINESS_ADMIN ? "Branch Owner" : "Desk Staff"}
                  </span>
                  
                  <h4 className="font-bold text-stone-900 text-sm leading-snug mb-1">{member.name}</h4>
                  <span className="text-xs text-stone-500 font-mono block leading-none mb-3">{member.email}</span>

                  <div className="pt-4 border-t border-stone-100 flex justify-between text-[11px] font-semibold">
                    <span>PHONE: {member.phone || "N/A"}</span>
                    <span className="text-stone-800 uppercase text-[10px]">Active ✔</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* --- KES BILLING & PAYMENT MATRIX OVERVIEW --- */}
        {activeTab === "KES Billing" && (
          <div className="space-y-8 animate-fade-in font-sans">
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200">
              <h2 className="text-stone-900 font-black text-lg uppercase mb-2">Safaricom M-Pesa STK Integration Console</h2>
              <p className="text-stone-500 text-xs">Verify invoices, auto-renew trials, and upgrade your SaaS business level seamlessly using M-Pesa STK push simulations.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* STK SIMULATION BOX */}
              <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-5">
                <span className="text-amber-600 font-black uppercase tracking-widest text-[10px] block mb-1">LIPA NA M-PESA</span>
                <h3 className="font-bold text-sm text-stone-900 uppercase">Upgrade/Renew via STK Push:</h3>
                
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5">M-Pesa Telephone Number</label>
                  <input
                     type="tel"
                     value={phoneForSTK}
                     onChange={(e) => setPhoneForSTK(e.target.value)}
                     className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-4 py-3 text-xs font-semibold text-stone-850 outline-none font-mono"
                  />
                </div>

           <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
  <h4 className="font-black text-sm mb-2">
    Transaction-Based Revenue Model
  </h4>

  <p className="text-xs text-stone-600">
    Businesses join for free.
  </p>

  <p className="text-xs text-stone-600 mt-2">
    Customer Fee: 1% per booking (minimum KES 5)
  </p>

  <p className="text-xs text-stone-600">
    Business Commission: 3% per completed booking (minimum KES 10)
  </p>
</div>
                {stkStateMsg && (
                  <div id="stk-logs-alert" className="bg-[#faf8f5] p-3.5 rounded-xl border font-mono text-[10.5px] text-stone-700 leading-relaxed whitespace-normal break-words">
                    📋 Log Check: {stkStateMsg}
                  </div>
                )}
              </div>

              {/* INVOICES LIST */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200">
                <h3 className="text-stone-950 font-extrabold text-sm uppercase mb-4">KES Billing History</h3>
                
                {invoices.length === 0 ? (
                  <p className="text-xs text-stone-400">No invoices traced.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px] tracking-wider pb-2">
                          <th className="pb-3 font-semibold">ID</th>
                          <th className="pb-3 font-semibold">Service Plan Billed</th>
                          <th className="pb-3 font-semibold">Amount (KES)</th>
                          <th className="pb-3 font-semibold">Billing Date</th>
                          <th className="pb-3 font-semibold">Method</th>
                          <th className="text-right pb-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-semibold text-stone-700">
                        {invoices.map(inv => (
                          <tr key={inv.id}>
                            <td className="py-3 font-mono text-stone-500 text-[11px] max-w-[100px] truncate">{inv.id}</td>
                            <td className="py-3 uppercase text-stone-900">{inv.planName}</td>
                            <td className="py-3 font-black text-stone-900">KES {inv.amountKES.toLocaleString()}</td>
                            <td className="py-3 text-stone-500">{inv.billingDate}</td>
                            <td className="py-3 text-stone-500 font-mono">{inv.paymentMethod}</td>
                            <td className="py-3 text-right">
                              <span className="bg-emerald-100 text-emerald-850 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                                Paid
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- APPLICANT CANDIDATES RECRUIT BOARD --- */}
        {activeTab === "Recruiting Board" && (
          <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              <h2 className="text-stone-900 font-black text-lg uppercase flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-amber-500" />
                <span>Careers Submissions Monitor</span>
              </h2>
              <p className="text-stone-500 text-xs">Review jobs submitted via the Careers Tab locally. Simulates real HR management systems.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              {applications.length === 0 ? (
                <p className="text-stone-400 text-xs leading-normal">No recruitment applicants logged. Submit test applications on the Careers tab!</p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {applications.map(app => (
                    <div key={app.id} className="py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-amber-500/10 text-amber-850 font-black tracking-widest uppercase px-2 py-0.5 rounded border border-amber-500/10">
                          {app.roleApply}
                        </span>
                        <h4 className="font-extrabold text-base text-stone-900 leading-snug pt-1">{app.name}</h4>
                        <div className="text-xs font-mono text-stone-500 flex items-center space-x-2.5">
                          <span>{app.email}</span>
                          <span>•</span>
                          <span>{app.phone}</span>
                        </div>
                        <p className="text-stone-600 text-xs italic bg-stone-50 p-4 rounded-xl border font-sans mt-3">
                          "{app.coverLetter}"
                        </p>
                      </div>

                      <div className="text-right space-y-2 self-start sm:self-auto">
                        <span className="text-xs text-stone-400 font-bold block">{app.appliedAt?.substring(0, 10) || "Recent"}</span>
                        
                        <span className="bg-amber-100 border border-amber-500/10 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                          {app.status}
                        </span>

                        <a 
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-stone-100 text-[#451a03] font-bold text-[10px] uppercase px-3 py-1.5 rounded block text-center border cursor-pointer hover:bg-stone-200 transition-all mt-1"
                        >
                          Simulate PDF View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- SETTINGS PROFILE --- */}
        {activeTab === "Settings Profile" && (
          <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              <h2 className="text-stone-900 font-black text-lg uppercase">System Profile Configurations</h2>
              <p className="text-stone-500 text-xs">Directly edit branch addresses, operating hours blocks, and description guidelines.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 max-w-xl space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={bzName}
                  onChange={(e) => setBzName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-4 py-3 text-xs font-semibold text-stone-850 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5">Opening Hours</label>
                  <input
                    type="text"
                    value={bzOperatingStart}
                    onChange={(e) => setOperatingStart(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-4 py-3 text-xs font-semibold text-stone-850 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5">Closing Hours</label>
                  <input
                    type="text"
                    value={bzOperatingEnd}
                    onChange={(e) => setOperatingEnd(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-4 py-3 text-xs font-semibold text-stone-850 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5">Safaricom Representative Phone</label>
                <input
                  type="tel"
                  value={bzPhone}
                  onChange={(e) => setBzPhone(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-4 py-3 text-xs font-semibold text-stone-850 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1.5">Branch Profile Description Text</label>
                <textarea
                  rows={3}
                  value={bzDesc}
                  onChange={(e) => setBzDesc(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-4 py-3 text-xs font-semibold text-stone-850 outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs px-5 py-3 rounded-xl cursor-pointer transition-all uppercase border"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
