import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  FolderDown, 
  CalendarCheck2, 
  Zap, 
  ChevronRight,
  Smile,
  CheckCircle2
} from "lucide-react";

interface AnalyticsData {
  totalAppointments: number;
  completedAppointments: number;
  noShowRate: number;
  averageWaitTimeMinutes: number;
  dailyTraffic: Array<{ day: string; count: number; wait: number }>;
  staffUtilization: Array<{ name: string; activeHours: number; rating: number; bookings: number }>;
  peakHours: string;
}

interface AnalyticsDashboardComponentProps {
  businessId?: string;
}

export default function AnalyticsDashboardComponent({ businessId }: AnalyticsDashboardComponentProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAnalytics();
  }, [businessId]);

  const fetchAnalytics = async () => {
    try {
      const url = businessId ? `/api/analytics?businessId=${businessId}` : "/api/analytics";
      const res = await fetch(url);
      if (res.ok) {
        const payload = await res.json();
        setData(payload);
      }
    } catch (err) {
      console.error("Error loaded analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!data) return;
    
    // Build CSV payload dynamically
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "NYUKI Operational Report\n";
    csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;
    csvContent += "METRIC,VALUE\n";
    csvContent += `Total Bookings,${data.totalAppointments}\n`;
    csvContent += `Completed Consultations,${data.completedAppointments}\n`;
    csvContent += `Average Client Wait Time (Minutes),${data.averageWaitTimeMinutes}\n`;
    csvContent += `No-Show Rate %,${data.noShowRate}\n`;
    csvContent += `Peak Service Traffic Slot,${data.peakHours}\n\n`;
    
    csvContent += "DAILY TRAFFIC LOG\n";
    csvContent += "Day,Customer Volume,Avg Wait Time (Mins)\n";
    data.dailyTraffic.forEach(t => {
      csvContent += `${t.day},${t.count},${t.wait}\n`;
    });
    
    csvContent += "\nCOORDINATOR UTILIZATION LOG\n";
    csvContent += "Staff Name,Active Hours (Weekly),Customer Rating,Total Bookings\n";
    data.staffUtilization.forEach(s => {
      csvContent += `"${s.name}",${s.activeHours},${s.rating},${s.bookings}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Nyuki_Analytics_Export_${businessId || 'General'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex animate-pulse flex-col items-center justify-center py-20">
        <Clock className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-stone-500 text-sm font-semibold uppercase tracking-widest">Compiling Analytics Data Stream...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
        <p className="text-stone-500 font-medium">Unable to calculate metrics. Trigger check-in events on the main dashboard first.</p>
      </div>
    );
  }

  // Find max traffic item to proportion chart height
  const maxTrafficCount = Math.max(...data.dailyTraffic.map(t => t.count), 1);

  return (
    <div id="analytics-component-root" className="space-y-8">
      
      {/* HEADER ROW WITH CSV EXPORTER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200">
        <div>
          <h2 className="text-stone-900 font-extrabold text-lg uppercase tracking-tight flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-amber-500" />
            <span>Operational Efficiency Insights</span>
          </h2>
          <p className="text-stone-505 text-xs text-stone-500 mt-0.5">Real-time analytical graphs computed from live queues.</p>
        </div>
        
        <button
          id="btn-analytics-csv"
          onClick={handleExportCSV}
          className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-xs px-5 py-3 rounded-xl shadow-md shadow-amber-500/10 flex items-center justify-center space-x-2 transition-all cursor-pointer border border-amber-600"
        >
          <FolderDown className="w-4 h-4" />
          <span>Export Analytics (.CSV)</span>
        </button>
      </div>

      {/* KPI BULLET INSIGHT CARDS */}
      <div id="kpi-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Bookings</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">{data.totalAppointments}</span>
            <span className="text-xs text-emerald-600 font-bold">✓ Active</span>
          </div>
          <p className="text-[10px] text-stone-450 mt-1">Bookings processed by platform</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Avg Waiting Duration</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">{data.averageWaitTimeMinutes}m</span>
            <span className="text-xs text-amber-655 font-bold">-34% optimum</span>
          </div>
          <p className="text-[10px] text-stone-450 mt-1">From join-queue to admission</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">No-Show Rate</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">{data.noShowRate}%</span>
            <span className="text-xs text-emerald-600 font-bold">Healthy Range</span>
          </div>
          <p className="text-[10px] text-stone-450 mt-1">Clients failing to arrive</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Peak Service Slots</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-sm sm:text-base font-black text-amber-800 uppercase tracking-wide leading-none py-1 block">
              {data.peakHours}
            </span>
          </div>
          <p className="text-[10px] text-stone-450 mt-35 mt-1">Times displaying highest congestion</p>
        </div>

      </div>

      {/* DETAILED STATS ROW: DAILY TRAFFIC BAR CHART & COORD STAFF TABLE */}
      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* DAILY GRAPH BAR PANEL (SVG DRIVEN) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider mb-2">Weekly Ticket Volume Flow</h3>
            <p className="text-xs text-stone-450">Track days experiencing heaviest patient/client intake.</p>
          </div>

          {/* Core Custom BAR visualization */}
          <div className="mt-8 flex items-end justify-between h-52 pt-4 border-b border-stone-100">
            {data.dailyTraffic.map((t) => {
              const heightPercent = Math.max(8, Math.round((t.count / maxTrafficCount) * 100));
              return (
                <div key={t.day} className="flex flex-col items-center flex-1 space-y-2 group">
                  <div className="text-[10px] font-bold text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white px-2 py-0.5 rounded -translate-y-1">
                    {t.count} tx ( {t.wait}m wait )
                  </div>
                  
                  {/* Colored visual Bar */}
                  <div 
                    className="w-8 sm:w-10 bg-amber-500 rounded-t-lg hover:bg-amber-600 transition-all border border-amber-600"
                    style={{ height: `${heightPercent * 1.4}px` }}
                  ></div>
                  
                  <span className="text-xs font-bold text-stone-500">{t.day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-stone-450 bg-stone-50 p-3 rounded-xl border border-stone-150">
            <span>💡 <strong>Tip:</strong> Friction peaks on <strong>Saturdays</strong>. Introduce standby coordinators.</span>
            <span className="font-bold text-amber-600">Nyuki Advisor</span>
          </div>
        </div>

        {/* STAFF PERFORMANCE AND UTILIZATION SECTION */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200">
          <div>
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider mb-2">Staff Utilization Indices</h3>
            <p className="text-xs text-stone-450 mb-6">Staff operational hours and average quality rating scoring.</p>
          </div>

          <div className="space-y-4">
            {data.staffUtilization.map((staff) => {
              // Draw small performance slider
              const maxHours = 50;
              const barPercent = Math.min(100, Math.round((staff.activeHours / maxHours) * 100));
              return (
                <div key={staff.name} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-sm text-stone-800">{staff.name}</span>
                    <span className="text-xs text-amber-700 font-extrabold flex items-center">
                      <Smile className="w-3.5 h-3.5 mr-1 text-amber-500" />
                      <span>{staff.rating} / 5.0</span>
                    </span>
                  </div>

                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mb-1">
                    <div 
                      className="bg-stone-900 h-2 rounded-full transition-all"
                      style={{ width: `${barPercent}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[10px] text-stone-450 font-semibold uppercase">
                    <span>{staff.activeHours} Hrs active weekly</span>
                    <span>{staff.bookings} clients served</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
