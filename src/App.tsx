import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import CareersPage from "./components/CareersPage";
import AuthPages from "./components/AuthPages";
import BusinessAdminDashboard from "./components/BusinessAdminDashboard";
import StaffDashboard from "./components/StaffDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import { User, Business, UserRole } from "./types";

export default function App() {
  // Navigation Routing States
  // "landing" | "careers" | "auth" | "dashboard"
  const [currentView, setCurrentView] = useState<string>("landing");
  
  // Custom auth preset state when jumping from Landing to login
  const [authRolePreset, setAuthRolePreset] = useState<string | undefined>(undefined);

  // Authentication State Variables
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);

  // Synchronize dynamic Session Storage on client to skip logins during refreshes
  useEffect(() => {
    const cachedUser = sessionStorage.getItem("nyuki_user");
    const cachedBz = sessionStorage.getItem("nyuki_bz");
    if (cachedUser) {
      try {
        const u = JSON.parse(cachedUser);
        setCurrentUser(u);
        setCurrentView("dashboard");
        if (cachedBz) {
          setCurrentBusiness(JSON.parse(cachedBz));
        }
      } catch (err) {
        console.error("Cache restore failed:", err);
      }
    }
  }, []);

  const handleLoginSuccess = (user: User, business: Business | null) => {
    setCurrentUser(user);
    setCurrentBusiness(business);
    sessionStorage.setItem("nyuki_user", JSON.stringify(user));
    if (business) {
      sessionStorage.setItem("nyuki_bz", JSON.stringify(business));
    }
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentBusiness(null);
    sessionStorage.removeItem("nyuki_user");
    sessionStorage.removeItem("nyuki_bz");
    setCurrentView("landing");
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleOpenAuth = (rolePreset?: string) => {
    setAuthRolePreset(rolePreset);
    setCurrentView("auth");
  };

  const handleUpdateBusinessProfile = (updatedBz: Business) => {
    setCurrentBusiness(updatedBz);
    sessionStorage.setItem("nyuki_bz", JSON.stringify(updatedBz));
  };

  // MAIN CONTROLLER SWITCH ROUTING
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 antialiased selection:bg-amber-200">
      
      {currentView === "landing" && (
        <LandingPage 
          onNavigate={handleNavigate} 
          onOpenAuth={handleOpenAuth} 
        />
      )}

      {currentView === "careers" && (
        <CareersPage 
          onNavigate={handleNavigate} 
        />
      )}

      {currentView === "auth" && (
        <AuthPages 
          onNavigate={handleNavigate} 
          onLoginSuccess={handleLoginSuccess}
          initialRolePreset={authRolePreset}
        />
      )}

      {currentView === "dashboard" && currentUser && (
        <div id="active-dashboard-container" className="animate-fade-in">
          
          {/* BUSINESS OVERSEER PORTAL */}
          {currentUser.role === UserRole.BUSINESS_ADMIN && currentBusiness && (
            <BusinessAdminDashboard
              business={currentBusiness}
              adminUser={currentUser}
              onLogout={handleLogout}
              onUpdateBusiness={handleUpdateBusinessProfile}
            />
          )}

          {/* DESK COORDINATOR TERMINAL */}
          {currentUser.role === UserRole.STAFF && (
            <StaffDashboard
              businessId={currentUser.businessId || "afyacare-id"}
              staffUser={currentUser}
              onLogout={handleLogout}
            />
          )}

          {/* CUSTOMER DIRECT SCHEDULER */}
          {currentUser.role === UserRole.CUSTOMER && (
            <CustomerDashboard
              customerUser={currentUser}
              onLogout={handleLogout}
            />
          )}

        </div>
      )}

    </div>
  );
}
