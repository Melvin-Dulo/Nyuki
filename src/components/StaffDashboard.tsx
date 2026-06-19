import React, { useEffect, useState } from "react";
import { 
  Users, 
  CheckCircle2, 
  PhoneCall, 
  Play, 
  FileCheck, 
  Trash2, 
  UserPlus, 
  Clock, 
  HelpCircle,
  Tv
} from "lucide-react";
import { QueueEntry, Appointment, QueueStatus, AppointmentStatus, Service } from "../types";

interface StaffDashboardProps {
  businessId: string;
  staffUser: any;
  onLogout: () => void;
}

export default function StaffDashboard({ businessId, staffUser, onLogout }: StaffDashboardProps) {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  // Walk-in form states
  const [walkinName, setWalkinName] = useState<string>("");
  const [walkinPhone, setWalkinPhone] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [recentActionMsg, setRecentActionMsg] = useState<string>("");

  useEffect(() => {
    fetchStaffState();
  }, [businessId]);

  const fetchStaffState = async () => {
    try {
      setLoading(true);
      const [qRes, aRes, sRes] = await Promise.all([
        fetch(`/api/queue?businessId=${businessId}`),
        fetch(`/api/appointments?businessId=${businessId}`),
        fetch(`/api/services?businessId=${businessId}`)
      ]);

      if (qRes.ok) setQueue(await qRes.json());
      if (aRes.ok) setAppointments(await aRes.json());
      if (sRes.ok) {
        const fetchedSvcs = await sRes.json();
        setServices(fetchedSvcs);
        if (fetchedSvcs.length > 0) {
          setSelectedServiceId(fetchedSvcs[0].id);
        }
      }
    } catch (err) {
      console.error("Error loaded staff dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQueueAction = async (id: string, action: string) => {
    try {
      const res = await fetch(`/api/queue/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setRecentActionMsg(`Successfully triggered '${action.toUpperCase()}' action on Ticket ${updatedItem.queueNumber}`);
        // Refresh active layouts
        const qRes = await fetch(`/api/queue?businessId=${businessId}`);
        if (qRes.ok) setQueue(await qRes.json());
        const aRes = await fetch(`/api/appointments?businessId=${businessId}`);
        if (aRes.ok) setAppointments(await aRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone) {
      alert("Please enter the walk-in customer's name and Safaricom telephone.");
      return;
    }

    try {
      const res = await fetch("/api/queue/walkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          customerName: walkinName,
          customerPhone: walkinPhone,
          serviceId: selectedServiceId
        })
      });

      if (res.ok) {
        const newQE = await res.json();
        setRecentActionMsg(`Successfully generated walk-in Queue Ticket ${newQE.queueNumber}! Queue updated.`);
        setWalkinName("");
        setWalkinPhone("");
        // Reload queues list
        const qRes = await fetch(`/api/queue?businessId=${businessId}`);
        if (qRes.ok) setQueue(await qRes.json());
      } else {
        const errDetails = await res.json();
        alert(errDetails.error || "Failed to create walk-in.");
      }
    } catch (err) {
      console.error(err);
      alert("Network transport error.");
    }
  };

  // Automatically check in appointments dynamically if walk-ins arrive or button is pushed
  const handleCheckInAppointment = async (aptId: string) => {
    try {
      const res = await fetch(`/api/appointments/${aptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: AppointmentStatus.CHECKED_IN })
      });

      if (res.ok) {
        setRecentActionMsg("Successfully checked-in. Client generated queue indices.");
        const qRes = await fetch(`/api/queue?businessId=${businessId}`);
        if (qRes.ok) setQueue(await qRes.json());
        const aRes = await fetch(`/api/appointments?businessId=${businessId}`);
        if (aRes.ok) setAppointments(await aRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeQueue = queue.filter(q => q.status !== QueueStatus.COMPLETED);
  const completedQueue = queue.filter(q => q.status === QueueStatus.COMPLETED);

  return (
    <div id="staff-dashboard-root" className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans">
      
      {/* MINIMAL STAFF SUBHEADER */}
      <header className="bg-stone-900 text-[#faf8f5] px-6 py-4.5 border-b border-stone-850 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-amber-500 flex items-center justify-center clip-hex shadow shadow-amber-500/20">
            <span className="font-black text-white text-sm">N</span>
          </div>
          <div>
            <h1 className="font-extrabold text-sm uppercase leading-none text-white tracking-widest">NYUKI STAFF DESK</h1>
            <span className="text-[10px] text-stone-400 mt-0.5 block">{staffUser.name} • Active Coordinator</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline-block bg-stone-800 text-amber-500 font-bold text-[10px] uppercase px-3 py-1 rounded-full border border-stone-705">
            M-Pesa Connected
          </span>
          <button
            onClick={onLogout}
            className="text-stone-300 hover:text-white text-xs font-bold leading-none cursor-pointer border border-stone-700 px-3 py-1.5 rounded-lg transition-all"
          >
            Logout Terminals
          </button>
        </div>
      </header>

      {/* CORE WORKING PORTAL GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LOG MESSAGES FEEDBACK TO OPERATORS */}
        {recentActionMsg && (
          <div id="staff-notif-toast" className="lg:col-span-12 bg-amber-50 border border-amber-500/25 p-4 rounded-xl text-xs font-semibold text-amber-900 flex items-center justify-between animate-fade-in">
            <span>🐝 Action Log: {recentActionMsg}</span>
            <button onClick={() => setRecentActionMsg("")} className="text-amber-800 hover:text-amber-950 text-[10px] font-black uppercase tracking-wider cursor-pointer">dismiss</button>
          </div>
        )}

        {/* ACTIVE QUEUE BOARD CELL (Primary Operational Sector) */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-stone-900 font-extrabold text-base uppercase tracking-tight flex items-center">
                  <Users className="w-5 h-5 mr-2 text-amber-500" />
                  <span>Real-Time Active Queue Board</span>
                </h2>
                <p className="text-stone-500 text-xs mt-0.5">Use below quick-trigger operators to triage waiting queues seamlessly.</p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold bg-amber-500/10 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-500/15">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeQueue.length} Active Tickets</span>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-stone-400 font-bold text-xs uppercase animate-pulse">
                Fetching Current Client Indices...
              </div>
            ) : activeQueue.length === 0 ? (
              <div className="py-16 text-center bg-stone-50 border border-dashed border-stone-200 rounded-xl max-w-lg mx-auto p-8">
                <p className="text-stone-550 font-black text-sm uppercase tracking-tight text-stone-600 mb-1">Waiting list is clean!</p>
                <p className="text-xs text-stone-400">Add walk-ins using the panel on the right or check in Scheduled Appointments beneath.</p>
              </div>
            ) : (
              <div id="active-queue-list" className="space-y-4">
                {activeQueue.sort((a,b) => a.position - b.position).map((entry, index) => {
                  
                  // Color codes for statuses
                  let bgCard = "bg-white";
                  let borderCard = "border-stone-200";
                  if (entry.status === QueueStatus.CALLED) {
                    bgCard = "bg-amber-50/30";
                    borderCard = "border-amber-400 ring-2 ring-amber-500/5";
                  } else if (entry.status === QueueStatus.IN_SERVICE) {
                    bgCard = "bg-stone-900";
                    borderCard = "border-stone-900";
                  }

                  return (
                    <div 
                      key={entry.id}
                      className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${bgCard} ${borderCard}`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Huge Ticket Code Badge */}
                        <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-black leading-none uppercase border shadow-inner ${
                          entry.status === QueueStatus.IN_SERVICE
                            ? "bg-amber-500 border-amber-500 text-stone-950"
                            : "bg-stone-50 border-stone-200 text-stone-900"
                        }`}>
                          <span className="text-[10px] text-stone-550 block select-none">TKT</span>
                          <span className="text-lg tracking-tighter mt-0.5">{entry.queueNumber}</span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold text-sm ${entry.status === QueueStatus.IN_SERVICE ? "text-white" : "text-stone-900"}`}>
                              {entry.customerName}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              entry.status === QueueStatus.CALLED 
                                ? "bg-amber-500 text-stone-950" 
                                : entry.status === QueueStatus.IN_SERVICE 
                                ? "bg-emerald-500 text-white" 
                                : "bg-stone-200 text-stone-700"
                            }`}>
                              {entry.status}
                            </span>
                          </div>
                          
                          <div className={`text-xs mt-1 font-mono flex items-center space-x-3 ${entry.status === QueueStatus.IN_SERVICE ? "text-stone-400" : "text-stone-500"}`}>
                            <span>{entry.customerPhone}</span>
                            <span>•</span>
                            <span>Estimate Wait: {entry.waitTimeEstimateMinutes} mins</span>
                          </div>
                        </div>
                      </div>

                      {/* QUICK QUEUE ACTIONS ROW */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        
                        {entry.status === QueueStatus.WAITING && (
                          <button
                            onClick={() => handleQueueAction(entry.id, "call")}
                            className="bg-[#faf8f5] hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                            <span>Call Ticket</span>
                          </button>
                        )}

                        {(entry.status === QueueStatus.WAITING || entry.status === QueueStatus.CALLED) && (
                          <button
                            onClick={() => handleQueueAction(entry.id, "start")}
                            className="bg-stone-950 text-white hover:bg-stone-800 font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-all border border-stone-800"
                          >
                            <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                            <span>Start Service</span>
                          </button>
                        )}

                        {entry.status === QueueStatus.IN_SERVICE && (
                          <button
                            onClick={() => handleQueueAction(entry.id, "complete")}
                            className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs px-4 py-3 rounded-lg flex items-center space-x-1 cursor-pointer transition-all border border-amber-600"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Complete</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleQueueAction(entry.id, "skip")}
                          className="bg-[#faf8f5] hover:bg-red-50 text-red-700 border border-red-155 font-bold text-xs px-2 py-2 rounded-lg cursor-pointer transition-all"
                          title="Skip/Dismiss Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SCHEDULED APPOINTMENTS BULLET REGISTRY DOCKET */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
            <h3 className="text-stone-905 font-extrabold text-sm uppercase tracking-tight mb-4 text-stone-900">
              Today's Appointment Log
            </h3>
            
            {appointments.length === 0 ? (
              <p className="text-stone-400 text-xs">No reservations scheduled for today.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 uppercase font-black text-[10px] tracking-wider">
                      <th className="pb-3 font-semibold">Reference</th>
                      <th className="pb-3 font-semibold">Client Name</th>
                      <th className="pb-3 font-semibold">Service</th>
                      <th className="pb-3 font-semibold">Date/Time</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-semibold text-stone-700">
                    {appointments.map((apt) => {
                      const associatedSvc = services.find(s => s.id === apt.serviceId);
                      return (
                        <tr key={apt.id}>
                          <td className="py-3 font-mono text-amber-700">{apt.bookingReference}</td>
                          <td className="py-3">{apt.customerName}</td>
                          <td className="py-3">{associatedSvc ? associatedSvc.name : "Consultation"}</td>
                          <td className="py-3">{apt.date} at {apt.time}</td>
                          <td className="py-3">
                            <span className="text-[10px] uppercase font-bold text-stone-500">{apt.status}</span>
                          </td>
                          <td className="py-3 text-right">
                            {apt.status === AppointmentStatus.SCHEDULED && (
                              <button
                                onClick={() => handleCheckInAppointment(apt.id)}
                                className="bg-stone-100 border border-stone-300 hover:border-stone-400 text-stone-850 text-[10px] font-black uppercase px-2.5 py-1.5 rounded cursor-pointer leading-normal transition-all"
                              >
                                Check In
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* WALK-IN ONDEMAND SIDE PANEL DOCKET */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2.5xl p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-stone-900 font-extrabold text-sm uppercase tracking-tight flex items-center">
              <UserPlus className="w-4 h-4 mr-2 text-amber-500" />
              <span>Spontaneous Walk-ins</span>
            </h3>
            <p className="text-stone-505 text-[11px] text-stone-500 mt-1">Add clients directly arriving in-lobby to bypass reservations.</p>
          </div>

          <form onSubmit={handleCreateWalkin} className="space-y-4">
            
            <div>
              <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1.5">Direct Client Name *</label>
              <input 
                type="text"
                required
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                placeholder="e.g. Grace Wanjiku"
                className="w-full bg-[#faf8f5] border border-stone-200 hover:border-stone-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-xl px-4 py-2.5 text-xs font-semibold text-stone-850"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1.5">Safaricom Phone Number *</label>
              <input 
                type="tel"
                required
                value={walkinPhone}
                onChange={(e) => setWalkinPhone(e.target.value)}
                placeholder="e.g. +254 740 555666"
                className="w-full bg-[#faf8f5] border border-stone-200 hover:border-stone-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-xl px-4 py-2.5 text-xs font-semibold text-stone-850 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1.5">Selected Service</label>
              {services.length === 0 ? (
                <p className="text-[10px] text-stone-400">Loading services spectrum...</p>
              ) : (
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-stone-200 focus:border-amber-500 outline-none rounded-xl px-4 py-2.5 text-xs font-semibold text-stone-850 cursor-pointer"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (KES {s.priceKES})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-150 text-[10px] text-stone-500 leading-normal">
              🔔 Submitting automatically triggers check-in, assigns a sequential Ticket badge, and sends a Lipa/SMS greeting.
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 border border-amber-600 cursor-pointer"
            >
              <span>Verify and Add to Queue</span>
            </button>

          </form>
        </div>

      </main>

    </div>
  );
}
