import React, { useEffect, useState } from "react";
import { 
  Building2, 
  Calendar, 
  Clock, 
  Search, 
  Bell, 
  CreditCard, 
  Smile, 
  MapPin, 
  Heart, 
  Mail, 
  ArrowRight,
  UserCheck2,
  CheckCircle,
  Ticket
} from "lucide-react";
import { Service, Appointment, QueueEntry, Business, CustomerPlan } from "../types";

interface CustomerDashboardProps {
  customerUser: any;
  onLogout: () => void;
}

export default function CustomerDashboard({ customerUser, onLogout }: CustomerDashboardProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queues, setQueues] = useState<QueueEntry[]>([]);
  const [notifLogs, setNotifLogs] = useState<any[]>([]);

  // Booking process states
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<string>("2026-06-19");
  const [bookingTime, setBookingTime] = useState<string>("11:00");
  const [customerPhone, setCustomerPhone] = useState<string>(customerUser.phone || "+254 711 222333");

  // Loading / Messages
  const [loading, setLoading] = useState<boolean>(true);
  const [recentLog, setRecentLog] = useState<string>("");

  useEffect(() => {
    fetchCustomerEnvironment();
  }, []);

  const fetchCustomerEnvironment = async () => {
    try {
      setLoading(true);
      const [bRes, aRes, qRes, nRes] = await Promise.all([
        fetch("/api/services"), // gets services to filter
        fetch(`/api/appointments?customerId=${customerUser.id}`),
        fetch("/api/queue"),
        fetch("/api/notifications/logs")
      ]);

      // Simple mock fetch for corporate businesses
      const mockBizRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@afyacare.co.ke", password: "password" })
      });
      if (mockBizRes.ok) {
        const dummy = await mockBizRes.json();
        // pre-loaded clinics
        setBusinesses([
          dummy.business,
          {
            id: "taji-id",
            name: "Taji Hair Studio & Spa",
            industry: "Salons/Barbershops",
            address: "Galana Road, Kilimani, Nairobi",
            email: "styling@tajistudio.com",
            phone: "+254 722 000111",
            operatingHours: { start: "09:00", end: "20:00" },
            timezone: "EAT (UTC+3)",
            description: "Bespoke haircare, custom locks, modern styling, and relaxing body aesthetics.",
            activePlan: "STANDARD" as any,
            billingStatus: "Active",
            renewalDate: "2026-07-01"
          }
        ]);
        setSelectedBusiness(dummy.business);
      }

      if (aRes.ok) setAppointments(await aRes.json());
      if (qRes.ok) setQueues(await qRes.json());
      if (nRes.ok) setNotifLogs(await nRes.json());

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch services when selected business changes
  useEffect(() => {
    if (selectedBusiness) {
      fetch(`/api/services?businessId=${selectedBusiness.id}`)
        .then(res => res.json())
        .then(data => {
          setServices(data);
          if (data.length > 0) {
            setSelectedServiceId(data[0].id);
          }
        });
    }
  }, [selectedBusiness]);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness || !selectedServiceId) {
      alert("Please select a service provider.");
      return;
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: selectedBusiness.id,
          customerId: customerUser.id,
          customerName: customerUser.name,
          customerPhone: customerPhone,
          serviceId: selectedServiceId,
          date: bookingDate,
          time: bookingTime
        })
      });

      if (res.ok) {
        const newApt = await res.json();
        setRecentLog(`Appointment Reference ${newApt.bookingReference} configured. Check-in logs updated.`);
        // Refresh Lists
        const aRes = await fetch(`/api/appointments?customerId=${customerUser.id}`);
        if (aRes.ok) setAppointments(await aRes.json());
        const nRes = await fetch("/api/notifications/logs");
        if (nRes.ok) setNotifLogs(await nRes.json());
      } else {
        const err = await res.json();
        alert(err.error || "Booking failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeCustomerTickets = queues.filter(
    q => q.customerPhone === customerUser.phone && q.status !== "Completed"
  );

  return (
    <div id="customer-dashboard-root" className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans">
      
      {/* HEADER SECTION */}
      <header className="bg-stone-900 text-[#faf8f5] px-6 py-4.5 border-b border-stone-850 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-amber-500 flex items-center justify-center clip-hex shadow shadow-amber-500/20">
            <span className="font-black text-white text-sm">N</span>
          </div>
          <div>
            <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-none">NYUKI INDEPENDENT CLIENT</span>
            <h1 className="font-extrabold text-white text-sm leading-tight mt-0.5">{customerUser.name} Portal</h1>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="text-stone-300 hover:text-white text-xs border border-stone-700 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          Logout Accounts
        </button>
      </header>

      {/* CORE CONTENT LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-12 gap-8 items-start">
        
        {recentLog && (
          <div className="lg:col-span-12 bg-emerald-50 border border-emerald-500/25 p-4 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between">
            <span>🎉 SUCCESS: {recentLog}</span>
            <button onClick={() => setRecentLog("")} className="text-emerald-800 font-black uppercase tracking-wider text-[10px] cursor-pointer">dismiss</button>
          </div>
        )}

        {/* RECOGNITION TICKETS (LIVE TICKET BROAD CASTER) */}
        {activeCustomerTickets.length > 0 && (
          <div id="active-tickets-panel" className="lg:col-span-12 bg-stone-900 text-white p-6 rounded-2xl border border-stone-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            
            <h2 className="text-amber-500 font-extrabold text-xs uppercase tracking-widest mb-4">
              Your Live Queue Ticket Monitors:
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {activeCustomerTickets.map(tkt => (
                <div key={tkt.id} className="bg-stone-850 rounded-xl p-5 border border-stone-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block leading-none">QUEUE TICKET</span>
                    <span className="text-2xl font-black text-amber-500 font-mono tracking-tight block leading-none py-1">
                      {tkt.queueNumber}
                    </span>
                    <span className="text-xs text-[#faf8f5]">{tkt.customerName}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest block text-stone-400">Position</span>
                    <span className="text-3xl font-black text-white block leading-none my-1">
                      #{tkt.position}
                    </span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/10 px-2 py-0.5 rounded-full font-bold">
                      ~{tkt.waitTimeEstimateMinutes} mins remaining
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKING TUNNEL CELL */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
            <h2 className="text-stone-900 font-extrabold text-base uppercase tracking-tight mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-amber-500" />
              <span>Step-by-Step Scheduling Tunnel</span>
            </h2>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Discover accredited regional providers, choose standard consultations or premium styling packages, configure dates, and reserve slots conveniently.
            </p>

            <form onSubmit={handleBookAppointment} className="space-y-6">
              
              {/* SELECT BUSINESS DIRECTORY */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">1. Select Accredited Provider</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {businesses.map((bz) => (
                    <div
                      key={bz.id}
                      onClick={() => setSelectedBusiness(bz)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedBusiness?.id === bz.id
                          ? "border-amber-500 bg-amber-50/10 shadow-sm"
                          : "border-stone-200 hover:border-stone-400 bg-[#faf8f5]"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Building2 className={`w-5 h-5 ${selectedBusiness?.id === bz.id ? "text-amber-655" : "text-stone-400"}`} />
                        <span className="font-bold text-sm text-stone-900">{bz.name}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-normal">{bz.description.substring(0, 100)}...</p>
                      <div className="mt-3 text-[10px] text-stone-450 flex justify-between items-center font-semibold">
                        <span>{bz.industry}</span>
                        <span className="text-amber-800 uppercase text-[9px]">Trial active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SELECT VALUE SPECTRUM SERVICE */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">2. Selected Care Specialty</label>
                {services.length === 0 ? (
                  <p className="text-xs text-stone-500">Retrieving available services spectrum from server...</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {services.map(s => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedServiceId(s.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          selectedServiceId === s.id
                            ? "border-amber-500 bg-amber-500/5"
                            : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-stone-900">{s.name}</span>
                          <span className="text-xs text-amber-700 font-black">KES {s.priceKES}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 leading-normal mb-2">{s.description}</p>
                        <span className="text-[9px] bg-stone-100 text-[#451a03] font-bold px-2 py-0.5 rounded-full uppercase">
                          Duration: {s.durationMinutes} Mins
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DATE & TIME REGISTRIES */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">3. Select Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-850 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">4. Target Time slot</label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-850 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">5. Safaricom Mobile ID</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-850 outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-4.5 rounded-xl border border-amber-500/10 text-[10px] text-stone-650 leading-relaxed">
                🔔 <strong>Nyuki Delivery Notice:</strong> Pressing Booking generates a dedicated <strong>Reservation Reference ID (NY-XXXX)</strong> and fires a simulated verification SMS.
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer border border-stone-800"
              >
                <span>Commit Reservation Request</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </button>

            </form>
          </div>

          {/* CUSTOMER PREVIOUS RESERVATIONS */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
            <h3 className="text-stone-900 font-extrabold text-sm uppercase mb-4">Your Booking Sequences</h3>
            {appointments.length === 0 ? (
              <p className="text-xs text-stone-450 font-medium">You do not have any appointments booked.</p>
            ) : (
              <div className="divide-y divide-stone-100">
                {appointments.map(apt => (
                  <div key={apt.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-800 block">{apt.bookingReference}</span>
                      <strong className="text-sm text-stone-800 font-semibold">{apt.customerName}</strong>
                      <span className="text-xs text-stone-500 block">{apt.date} at {apt.time}</span>
                    </div>

                    <span className="text-xs font-bold text-stone-400 uppercase">{apt.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

 {/* CUSTOMER BILLING METRIC & CLIENT APP NOTIFICATION MONITOR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SUBSCRIPTION PLAN OVERVIEW */}
          <div className="bg-white rounded-2.5xl p-6 sm:p-8 border border-stone-200">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Your Plan Status</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-stone-950">Active Tier:</span>
              <span className="bg-stone-100 text-stone-800 text-xs font-black uppercase px-2.5 py-1 rounded-full border">
                {customerUser.customerPlan || "STANDARD CLIENT"}
              </span>
            </div>

            <div className="text-[11px] text-stone-550 leading-normal mb-4">
              Includes queue tracking, SMS verification triggers, and dynamic slot selections. Max 10 bookings per month. Upgraded state ready.
            </div>

            <button className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs py-2.5 rounded-xl border border-amber-600 cursor-pointer text-center select-none shadow shadow-amber-500/5">
              Upgrade Premium (KES 500/mo)
            </button>
          </div>

          {/* REALTIME SMS SIMULATION LOGBOX */}
          <div className="bg-white rounded-2.5xl p-6 sm:p-8 border border-stone-200 space-y-4">
            <h3 className="text-stone-900 font-extrabold text-sm uppercase tracking-tight flex items-center">
              <Bell className="w-4 h-4 mr-2 text-amber-500 animate-pulse" />
              <span>Simulated SMS Console Log</span>
            </h3>

            <p className="text-[10px] text-stone-550 leading-normal mt-1">
              Test your simulated SMS broadcast triggers locally. These messages simulate real-time API integrations under the African Gateway!
            </p>

            <div className="bg-stone-950 border border-stone-800 text-amber-500 rounded-xl p-4.5 font-mono text-xs h-60 overflow-y-auto space-y-3 shadow-inner">
              {notifLogs.length === 0 ? (
                <div className="text-stone-600 leading-normal text-center pt-16">
                  Waiting for SMS alerts...
                </div>
              ) : (
                notifLogs.map(log => (
                  <div key={log.id} className="border-b border-stone-900 pb-2.5 last:border-0">
                    <div className="flex justify-between text-[8px] text-stone-500 font-sans uppercase font-bold">
                      <span>SMS Gateway IP: 196.254...</span>
                      <span>Delivery: {log.status}</span>
                    </div>
                    <div className="text-white text-[10.5px] font-sans break-words my-1 leading-normal">
                      {log.message}
                    </div>
                    <span className="text-[8px] text-[#fbbf24]">{log.sentAt.split("T")[1].substring(0, 5)} hrs UTC</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
