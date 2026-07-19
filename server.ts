import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { 
  UserRole, 
  AppointmentStatus, 
  QueueStatus,  
  CustomerPlan,
  Business, 
  User, 
  Service, 
  Appointment, 
  QueueEntry, 
  NotificationLog, 
  Invoice, 
  CareerApplication,
  AuditLog
} from "./src/types";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "nyuki_db.json");

// Core database structure
interface DatabaseSchema {
  businesses: Business[];
  users: User[];
  services: Service[];
  appointments: Appointment[];
  queueEntries: QueueEntry[];
  notificationLogs: NotificationLog[];
  invoices: Invoice[];
  careerApplications: CareerApplication[];
  auditLogs: AuditLog[];
}

// Initial state of seed data to provide a fully rich trial environment immediately
const DEFAULT_DB: DatabaseSchema = {
  businesses: [
    {
      id: "afyacare-id",
      name: "AfyaCare Medical Clinic",
      industry: "Clinics/Hospitals",
      address: "Upper Hill, Hospital Road, Nairobi",
      email: "contact@afyacare.co.ke",
      phone: "+254 712 345678",
      operatingHours: { start: "08:00", end: "18:00" },
      timezone: "EAT (UTC+3)",
      logoUrl: "",
      description: "A premier multi-specialty wellness clinic offering high-quality primary care, pediatrics, and emergency triage in Nairobi.",
  
    },
    {
      id: "taji-id",
      name: "Taji Hair Studio & Spa",
      industry: "Salons/Barbershops",
      address: "Galana Road, Kilimani, Nairobi",
      email: "styling@tajistudio.com",
      phone: "+254 722 000111",
      operatingHours: { start: "09:00", end: "20:00" },
      timezone: "EAT (UTC+3)",
      logoUrl: "",
      description: "Bespoke haircare, custom locks, modern styling, and relaxing body aesthetics for premium professionals.",
    
    }
  ],
  users: [
    {
      id: "admin-afya",
      email: "admin@afyacare.co.ke",
      name: "Jane Kamau (Admin)",
      role: UserRole.BUSINESS_ADMIN,
      businessId: "afyacare-id",
      phone: "+254 712 345678",
      monthlyBookingsCount: 142
    },
    {
      id: "staff-gp",
      email: "dr.kiprop@afyacare.co.ke",
      name: "Dr. David Kiprop (GP)",
      role: UserRole.STAFF,
      businessId: "afyacare-id",
      phone: "+254 712 999888",
      monthlyBookingsCount: 88
    },
    {
      id: "staff-dentist",
      email: "dr.mwangi@afyacare.co.ke",
      name: "Dr. Mercy Mwangi (Dentist)",
      role: UserRole.STAFF,
      businessId: "afyacare-id",
      phone: "+254 712 777666",
      monthlyBookingsCount: 54
    },
    {
      id: "admin-taji",
      email: "kendi@tajistudio.com",
      name: "Kendi Marangu",
      role: UserRole.BUSINESS_ADMIN,
      businessId: "taji-id",
      phone: "+254 722 000111",
      monthlyBookingsCount: 220
    },
    {
      id: "staff-stylist",
      email: "jomo@tajistudio.com",
      name: "Jomo Kenyatta (Stylist)",
      role: UserRole.STAFF,
      businessId: "taji-id",
      phone: "+254 722 555444",
      monthlyBookingsCount: 180
    },
    {
      id: "cust-1",
      email: "peter@example.com",
      name: "Peter Mwangi",
      role: UserRole.CUSTOMER,
      phone: "+254 711 222333",
      customerPlan: CustomerPlan.STANDARD,
      monthlyBookingsCount: 4
    },
    {
      id: "cust-2",
      email: "alice@example.com",
      name: "Alice Achieng",
      role: UserRole.CUSTOMER,
      phone: "+254 733 444555",
      customerPlan: CustomerPlan.PREMIUM,
      monthlyBookingsCount: 8
    }
  ],
  services: [
    // AfyaCare
    {
      id: "afya-gp",
      businessId: "afyacare-id",
      name: "General Medical Consultation",
      description: "Full checkup, vitals review, prescription issuing, and medical recommendation.",
      durationMinutes: 20,
      priceKES: 1500,
      assignedStaffIds: ["staff-gp"],
      isActive: true
    },
    {
      id: "afya-dent",
      businessId: "afyacare-id",
      name: "Dental Scaling & Fillings",
      description: "Professional cleaning, tartar removal, and cavity composite fillings.",
      durationMinutes: 45,
      priceKES: 3500,
      assignedStaffIds: ["staff-dentist"],
      isActive: true
    },
    {
      id: "afya-peds",
      businessId: "afyacare-id",
      name: "Pediatric Wellness Check",
      description: "Inoculation history review, growth tracking, and standard pediatric support.",
      durationMinutes: 30,
      priceKES: 2500,
      assignedStaffIds: ["staff-gp"],
      isActive: true
    },
    // Taji Hair
    {
      id: "taji-cut",
      businessId: "taji-id",
      name: "Sharp Fade & Royal Hot Towel Shave",
      description: "Artistic hair outline, precision razor shaving, essential oils, and refreshing steaming hot towel treatment.",
      durationMinutes: 45,
      priceKES: 1200,
      assignedStaffIds: ["staff-stylist"],
      isActive: true
    },
    {
      id: "taji-braid",
      businessId: "taji-id",
      name: "Knotless Braids - Mid Back",
      description: "Sleek, lightweight, painless individual braids using premium regional extensions.",
      durationMinutes: 180,
      priceKES: 4500,
      assignedStaffIds: ["staff-stylist"],
      isActive: true
    }
  ],
  appointments: [
    {
      id: "apt-1",
      businessId: "afyacare-id",
      customerId: "cust-1",
      customerName: "Peter Mwangi",
      customerPhone: "+254 711 222333",
      serviceId: "afya-gp",
      staffId: "staff-gp",
      date: "2026-06-19",
      time: "09:30",
      status: AppointmentStatus.CHECKED_IN,
      bookingReference: "NY-8495",
      createdAt: "2026-06-18T14:20:00Z"
    },
    {
      id: "apt-2",
      businessId: "afyacare-id",
      customerId: "cust-2",
      customerName: "Alice Achieng",
      customerPhone: "+254 733 444555",
      serviceId: "afya-dent",
      staffId: "staff-dentist",
      date: "2026-06-19",
      time: "10:15",
      status: AppointmentStatus.WAITING,
      bookingReference: "NY-5231",
      createdAt: "2026-06-18T16:10:00Z"
    },
    {
      id: "apt-3",
      businessId: "afyacare-id",
      customerName: "Martin Omondi (Walk-In)",
      customerPhone: "+254 712 111222",
      serviceId: "afya-gp",
      staffId: "staff-gp",
      date: "2026-06-19",
      time: "08:15",
      status: AppointmentStatus.COMPLETED,
      bookingReference: "NY-W001",
      createdAt: "2026-06-19T05:20:00Z"
    },
    {
      id: "apt-4",
      businessId: "taji-id",
      customerId: "cust-1",
      customerName: "Peter Mwangi",
      customerPhone: "+254 711 222333",
      serviceId: "taji-cut",
      staffId: "staff-stylist",
      date: "2026-06-19",
      time: "14:00",
      status: AppointmentStatus.SCHEDULED,
      bookingReference: "NY-4921",
      createdAt: "2026-06-19T06:15:00Z"
    }
  ],
  queueEntries: [
    {
      id: "q-1",
      businessId: "afyacare-id",
      appointmentId: "apt-1",
      customerName: "Peter Mwangi",
      customerPhone: "+254 711 222333",
      queueNumber: "GP-01",
      position: 1,
      status: QueueStatus.IN_SERVICE,
      waitTimeEstimateMinutes: 0,
      joinedAt: "2026-06-19T08:00:00Z",
      startedAt: "2026-06-19T08:10:00Z"
    },
    {
      id: "q-2",
      businessId: "afyacare-id",
      appointmentId: "apt-2",
      customerName: "Alice Achieng",
      customerPhone: "+254 733 444555",
      queueNumber: "DN-01",
      position: 2,
      status: QueueStatus.WAITING,
      waitTimeEstimateMinutes: 15,
      joinedAt: "2026-06-19T08:15:00Z"
    },
    {
      id: "q-3",
      businessId: "afyacare-id",
      customerName: "Grace Wanjiku (Walk-In)",
      customerPhone: "+254 740 555666",
      queueNumber: "WT-02",
      position: 3,
      status: QueueStatus.WAITING,
      waitTimeEstimateMinutes: 35,
      joinedAt: "2026-06-19T08:25:00Z"
    }
  ],
  notificationLogs: [
    {
      id: "notif-1",
      businessId: "afyacare-id",
      type: "SMS",
      recipient: "+254 711 222333",
      message: "HABARI, Peter. Your booking for General Medical Consultation at AfyaCare is CONFIRMED for 2026-06-19 at 09:30. Ref: NY-8495. Bee first!",
      eventType: "booking_confirmation",
      status: "Sent",
      sentAt: "2026-06-18T14:21:00Z"
    },
    {
      id: "notif-2",
      businessId: "afyacare-id",
      type: "SMS",
      recipient: "+254 733 444555",
      message: "Your dentist scaling queue is moving! You are now at position #1. Please proceed to Dr. Mercy Mwangi's cabinet. Ref: NY-5231.",
      eventType: "queue_update",
      status: "Sent",
      sentAt: "2026-06-19T08:16:00Z"
    }
  ],
  invoices: [
    {
      id: "inv-101",
      businessId: "afyacare-id",
      amountKES: 5000,
      planName: "MEDIUM BUSINESS PLAN",
      billingDate: "2026-06-19",
      dueDate: "2026-07-19",
      status: "Paid",
      paymentMethod: "M-Pesa STK"
    },
    {
      id: "inv-102",
      businessId: "taji-id",
      amountKES: 2500,
      planName: "STANDARD BUSINESS PLAN",
      billingDate: "2026-06-01",
      dueDate: "2026-07-01",
      status: "Pending",
      paymentMethod: "M-Pesa STK"
    }
  ],
  careerApplications: [
    {
      id: "career-1",
      name: "Silas Kipruto",
      email: "silas@kiptech.io",
      phone: "+254 722 888999",
      roleApply: "Lead Full-Stack Queue Service Architect",
      resumeUrl: "https://nyuki.co.ke/resumes/silas_kipruto.pdf",
      coverLetter: "Breeding high-concurrency systems is my sweet honey. I built real-time tracking scripts for regional logistics and I want to scale Nyuki across Africa's Service Hubs.",
      status: "Reviewed",
      appliedAt: "2026-06-19T06:00:00Z"
    }
  ],
  auditLogs: [
    {
      id: "audit-1",
      timestamp: "2026-06-19T08:00:00Z",
      userId: "admin-afya",
      userName: "Jane Kamau",
      action: "System loaded seed events and generated live dashboard indices",
      ipAddress: "127.0.0.1"
    }
  ]
};

// Database utility helpers
function loadDB(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    saveDB(DEFAULT_DB);
    return DEFAULT_DB;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Recovering damaged DB file:", error);
    saveDB(DEFAULT_DB);
    return DEFAULT_DB;
  }
}

function saveDB(data: DatabaseSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Middleware
app.use(express.json());

// API Endpoints
// --- HEALTH APIS ---
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", host: "nyuki-bee-grid", timestamp: new Date() });
});

// --- AUTH APIS ---
app.post("/api/auth/register-business", (req, res) => {
  const { businessName, industry, adminName, email, phone, password, plan } = req.body;
  if (!businessName || !adminName || !email || !phone || !password) {
    return res.status(400).json({ error: "Missing required onboarding properties." });
  }

  const db = loadDB();
  const businessId = "bz-" + Math.random().toString(36).substring(2, 9);
  const userId = "usr-" + Math.random().toString(36).substring(2, 9);

  const newBusiness: Business = {
    id: businessId,
    name: businessName,
    industry: industry || "Clinics/Hospitals",
    address: "Regus Suite Area, Nairobi",
    email,
    phone,
    operatingHours: { start: "08:00", end: "17:00" },
    timezone: "EAT (UTC+3)",
    logoUrl: "",
    description: `A registered provider in ${industry || "service delivery"}.`,
  
  };

  const newAdmin: User = {
    id: userId,
    email,
    name: adminName,
    role: UserRole.BUSINESS_ADMIN,
    businessId: businessId,
    phone,
    monthlyBookingsCount: 0
  };

  // Seed default service for new business to avoid empty pages
  const defaultService: Service = {
    id: "svc-" + Math.random().toString(36).substring(2, 9),
    businessId,
    name: `${industry || "Standard"} Services Consultation`,
    description: `Comprehensive setup service for ${businessName}.`,
    durationMinutes: 30,
    priceKES: 1500,
    assignedStaffIds: [userId],
    isActive: true
  };

  db.businesses.push(newBusiness);
  db.users.push(newAdmin);
  db.services.push(defaultService);

  // Initial free trial invoice
  db.invoices.push({
    id: "inv-" + Math.random().toString(36).substring(2, 9),
    businessId,
    amountKES: 0,
   planName: `Transaction-Based Business Account`,
    billingDate: new Date().toISOString().split("T")[0],
    dueDate: newBusiness.renewalDate,
    status: "Paid",
    paymentMethod: "M-Pesa STK"
  });

  db.auditLogs.push({
    id: "aud-" + Math.random().toString(36).substring(2, 9),
    userId,
    userName: adminName,
    action: `Registered new business ${businessName} under the transaction-based revenue model.`,
    timestamp: new Date().toISOString()
  });

  saveDB(db);

  // Return generated user & business directly to log inside Client storage
  res.json({ success: true, user: newAdmin, business: newBusiness });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter your email and password." });
  }

  const db = loadDB();
  const matchedUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!matchedUser) {
    // If testing standard templates, we can auto-register a mock user or return mock authentication success safely
    // Let's protect standard logs by finding or creating
    return res.status(401).json({ error: "Invalid login credentials. Note: demo accounts exist for admin@afyacare.co.ke and kendi@tajistudio.com with password 'password'." });
  }

  const matchedBusiness = db.businesses.find(b => b.id === matchedUser.businessId);

  res.json({
    success: true,
    user: matchedUser,
    business: matchedBusiness || null
  });
});

// --- SERVICE APIS ---
app.get("/api/services", (req, res) => {
  const { businessId } = req.query;
  const db = loadDB();
  if (businessId) {
    return res.json(db.services.filter(s => s.businessId === businessId));
  }
  res.json(db.services);
});

app.post("/api/services", (req, res) => {
  const { businessId, name, description, durationMinutes, priceKES, assignedStaffIds } = req.body;
  if (!businessId || !name || !priceKES) {
    return res.status(400).json({ error: "Missing required service parameters." });
  }

  const db = loadDB();
  const newSvc: Service = {
    id: "svc-" + Math.random().toString(36).substring(2, 9),
    businessId,
    name,
    description: description || "",
    durationMinutes: Number(durationMinutes) || 30,
    priceKES: Number(priceKES),
    assignedStaffIds: assignedStaffIds || [],
    isActive: true
  };

  db.services.push(newSvc);
  saveDB(db);
  res.json(newSvc);
});

app.put("/api/services/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const db = loadDB();

  const idx = db.services.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: "Service not found." });

  db.services[idx] = { ...db.services[idx], ...updateData };
  saveDB(db);
  res.json(db.services[idx]);
});

app.delete("/api/services/:id", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.services = db.services.filter(s => s.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// --- STAFF APIS ---
app.get("/api/staff", (req, res) => {
  const { businessId } = req.query;
  const db = loadDB();
  let staffList = db.users.filter(u => u.role === UserRole.STAFF || u.role === UserRole.BUSINESS_ADMIN);
  if (businessId) {
    staffList = staffList.filter(u => u.businessId === businessId);
  }
  res.json(staffList);
});

app.post("/api/staff", (req, res) => {
  const { businessId, name, email, phone } = req.body;
  if (!businessId || !name || !email) {
    return res.status(400).json({ error: "Name and Email are mandatory to create staff." });
  }

  const db = loadDB();
  const newStaff: User = {
    id: "staff-" + Math.random().toString(36).substring(2, 9),
    email,
    name,
    role: UserRole.STAFF,
    businessId,
    phone,
    monthlyBookingsCount: 0
  };

  db.users.push(newStaff);
  saveDB(db);
  res.json(newStaff);
});

// --- APPOINTMENT APIS ---
app.get("/api/appointments", (req, res) => {
  const { businessId, customerId } = req.query;
  const db = loadDB();
  let list = db.appointments;
  if (businessId) {
    list = list.filter(a => a.businessId === businessId);
  }
  if (customerId) {
    list = list.filter(a => a.customerId === customerId);
  }
  res.json(list);
});

app.post("/api/appointments", (req, res) => {
  const { businessId, customerId, customerName, customerPhone, serviceId, staffId, date, time } = req.body;
  if (!businessId || !customerName || !customerPhone || !serviceId || !date || !time) {
    return res.status(400).json({ error: "Missing required fields to book appointment." });
  }

  const db = loadDB();

  // Prevent double bookings
  const isDoubleBooked = db.appointments.some(
    a => a.businessId === businessId && 
         a.staffId === staffId && 
         a.date === date && 
         a.time === time && 
         [AppointmentStatus.SCHEDULED, AppointmentStatus.WAITING, AppointmentStatus.IN_SERVICE].includes(a.status)
  );

  if (isDoubleBooked) {
    return res.status(400).json({ error: "This time slot is already scheduled for this staff member. Please select a different time or coordinator." });
  }

  const ref = "NY-" + Math.floor(1000 + Math.random() * 9000);
  const newApp: Appointment = {
    id: "apt-" + Math.random().toString(36).substring(2, 9),
    businessId,
    customerId,
    customerName,
    customerPhone,
    serviceId,
    staffId: staffId || "auto-assign",
    date,
    time,
    status: AppointmentStatus.SCHEDULED,
    bookingReference: ref,
    createdAt: new Date().toISOString()
  };

  db.appointments.push(newApp);

  // Auto trigger confirmation notification
  const bz = db.businesses.find(b => b.id === businessId);
  const svc = db.services.find(s => s.id === serviceId);
  const msgText = `KWAHERI/HABARI, ${customerName}. Your booking for ${svc ? svc.name : 'Service'} at ${bz ? bz.name : 'Nyuki Centre'} is CONFIRMED for ${date} at ${time}. Ref: ${ref}. Bee first!`;
  
  db.notificationLogs.push({
    id: "notif-" + Math.random().toString(36).substring(2, 9),
    businessId,
    type: "SMS",
    recipient: customerPhone,
    message: msgText,
    eventType: "booking_confirmation",
    status: "Sent",
    sentAt: new Date().toISOString()
  });

  saveDB(db);
  res.json(newApp);
});

app.put("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = loadDB();

  const idx = db.appointments.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: "Appointment not found." });

  const originalStatus = db.appointments[idx].status;
  db.appointments[idx].status = status;

  // On Checked-In / Waiting, put into the active queue dashboard
  if (status === AppointmentStatus.CHECKED_IN || status === AppointmentStatus.WAITING) {
    const isAlreadyInQueue = db.queueEntries.some(q => q.appointmentId === id && q.status !== QueueStatus.COMPLETED);
    
    if (!isAlreadyInQueue) {
      const bzId = db.appointments[idx].businessId;
      const svcId = db.appointments[idx].serviceId;
      const svc = db.services.find(s => s.id === svcId);
      
      const categoryPrefix = svc ? svc.name.substring(0, 2).toUpperCase() : "NK";
      const qIndex = db.queueEntries.filter(q => q.businessId === bzId).length + 1;
      const queueNum = `${categoryPrefix}-${String(qIndex).padStart(2, '0')}`;
      
      const newQE: QueueEntry = {
        id: "q-" + Math.random().toString(36).substring(2, 9),
        businessId: bzId,
        appointmentId: id,
        customerName: db.appointments[idx].customerName,
        customerPhone: db.appointments[idx].customerPhone,
        queueNumber: queueNum,
        position: db.queueEntries.filter(q => q.businessId === bzId && q.status !== QueueStatus.COMPLETED).length + 1,
        status: QueueStatus.WAITING,
        waitTimeEstimateMinutes: 15 * (db.queueEntries.filter(q => q.businessId === bzId && q.status === QueueStatus.WAITING).length + 1),
        joinedAt: new Date().toISOString()
      };
      
      db.queueEntries.push(newQE);
    }
  }

  saveDB(db);
  res.json(db.appointments[idx]);
});

// --- QUEUE MANAGEMENT ENGINES ---
app.get("/api/queue", (req, res) => {
  const { businessId } = req.query;
  const db = loadDB();
  let list = db.queueEntries;
  if (businessId) {
    list = list.filter(q => q.businessId === businessId);
  }
  // Sort waiting list by position
  res.json(list);
});

// Add Walk-in to Queue directly
app.post("/api/queue/walkin", (req, res) => {
  const { businessId, customerName, customerPhone, serviceId } = req.body;
  if (!businessId || !customerName || !customerPhone) {
    return res.status(400).json({ error: "Walk-in name and telephone are mandatory." });
  }

  const db = loadDB();
  const svc = db.services.find(s => s.id === serviceId);
  const categoryPrefix = svc ? svc.name.substring(0, 2).toUpperCase() : "WK";
  const sameDayEntries = db.queueEntries.filter(q => q.businessId === businessId).length + 1;
  const queueNum = `${categoryPrefix}-${String(sameDayEntries).padStart(2, '0')}`;

  const currentActiveQueueCount = db.queueEntries.filter(
    q => q.businessId === businessId && q.status !== QueueStatus.COMPLETED
  ).length;

  const newQE: QueueEntry = {
    id: "q-" + Math.random().toString(36).substring(2, 9),
    businessId,
    customerName: customerName + " (Walk-In)",
    customerPhone,
    queueNumber: queueNum,
    position: currentActiveQueueCount + 1,
    status: QueueStatus.WAITING,
    waitTimeEstimateMinutes: 15 * (currentActiveQueueCount + 1),
    joinedAt: new Date().toISOString()
  };

  db.queueEntries.push(newQE);

  // Send walk-in booking notification SMS
  const bz = db.businesses.find(b => b.id === businessId);
  db.notificationLogs.push({
    id: "notif-" + Math.random().toString(36).substring(2, 9),
    businessId,
    type: "SMS",
    recipient: customerPhone,
    message: `HABARI. Joined waiting list at ${bz ? bz.name : 'Nyuki Depot'}. Your queue Ticket is ${queueNum}. Current Position: #${newQE.position}. Estimated wait: ${newQE.waitTimeEstimateMinutes} mins.`,
    eventType: "queue_update",
    status: "Sent",
    sentAt: new Date().toISOString()
  });

  saveDB(db);
  res.json(newQE);
});

// Queue Action Operations: CALL NEXT, START, COMPLETE, SKIP, REORDER
app.post("/api/queue/:id/action", (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "call", "start", "complete", "skip"
  const db = loadDB();

  const idx = db.queueEntries.findIndex(q => q.id === id);
  if (idx === -1) return res.status(404).json({ error: "Queue entry not found." });

  const entry = db.queueEntries[idx];
  const bzId = entry.businessId;

  if (action === "call") {
    entry.status = QueueStatus.CALLED;
    entry.calledAt = new Date().toISOString();
    // Notify customer via SMS
    db.notificationLogs.push({
      id: "notif-" + Math.random().toString(36).substring(2, 9),
      businessId: bzId,
      type: "SMS",
      recipient: entry.customerPhone,
      message: `TICKET CALL: ${entry.customerName}, Ticket ${entry.queueNumber} is now CALLED. Please proceed standard admission bay immediately.`,
      eventType: "queue_update",
      status: "Sent",
      sentAt: new Date().toISOString()
    });
  } else if (action === "start") {
    entry.status = QueueStatus.IN_SERVICE;
    entry.startedAt = new Date().toISOString();
    if (entry.appointmentId) {
      const aptIdx = db.appointments.findIndex(a => a.id === entry.appointmentId);
      if (aptIdx !== -1) db.appointments[aptIdx].status = AppointmentStatus.IN_SERVICE;
    }
  } else if (action === "complete") {
    entry.status = QueueStatus.COMPLETED;
    entry.completedAt = new Date().toISOString();
    entry.position = 0;
    if (entry.appointmentId) {
      const aptIdx = db.appointments.findIndex(a => a.id === entry.appointmentId);
      if (aptIdx !== -1) db.appointments[aptIdx].status = AppointmentStatus.COMPLETED;
    }

    // Trigger completion SMS & feedback request
    db.notificationLogs.push({
      id: "notif-" + Math.random().toString(36).substring(2, 9),
      businessId: bzId,
      type: "SMS",
      recipient: entry.customerPhone,
      message: `ASANTE! Service complete for Ticket ${entry.queueNumber}. Thank you for using Nyuki Flow to bypass waiting lines. Rate your coordinate experience!`,
      eventType: "service_completed",
      status: "Sent",
      sentAt: new Date().toISOString()
    });

    // Recalculate remaining active positions
    let posCount = 1;
    db.queueEntries.forEach(q => {
      if (q.businessId === bzId && q.status !== QueueStatus.COMPLETED) {
        q.position = posCount++;
        q.waitTimeEstimateMinutes = Math.max(5, 12 * q.position);
      }
    });
  } else if (action === "skip") {
    entry.status = QueueStatus.COMPLETED; // archived
    entry.position = 0;
    if (entry.appointmentId) {
      const aptIdx = db.appointments.findIndex(a => a.id === entry.appointmentId);
      if (aptIdx !== -1) db.appointments[aptIdx].status = AppointmentStatus.NO_SHOW;
    }
    // Reorder indices
    let posCount = 1;
    db.queueEntries.forEach(q => {
      if (q.businessId === bzId && q.status !== QueueStatus.COMPLETED) {
        q.position = posCount++;
        q.waitTimeEstimateMinutes = Math.max(5, 12 * q.position);
      }
    });
  }

  saveDB(db);
  res.json(entry);
});

// Reorder Ticket queue positions
app.post("/api/queue/reorder", (req, res) => {
  const { businessId, orderedIds } = req.body; // list of IDs in precise sequence
  if (!businessId || !Array.isArray(orderedIds)) {
    return res.status(400).json({ error: "An ordered array of IDs is required." });
  }

  const db = loadDB();
  let pos = 1;
  orderedIds.forEach(id => {
    const idx = db.queueEntries.findIndex(q => q.id === id);
    if (idx !== -1) {
      db.queueEntries[idx].position = pos++;
      db.queueEntries[idx].waitTimeEstimateMinutes = Math.max(5, 12 * db.queueEntries[idx].position);
    }
  });

  saveDB(db);
  res.json({ success: true, queue: db.queueEntries.filter(q => q.businessId === businessId) });
});

// --- NOTIFICATION APIS ---
app.get("/api/notifications/logs", (req, res) => {
  const { businessId } = req.query;
  const db = loadDB();
  if (businessId) {
    return res.json(db.notificationLogs.filter(n => n.businessId === businessId).reverse());
  }
  res.json(db.notificationLogs.reverse());
});

// --- BILLING, SUBSCRIPTIONS & M-PESA INTEGRATION ---
app.get("/api/billing/invoices", (req, res) => {
  const { businessId } = req.query;
  const db = loadDB();
  if (businessId) {
    return res.json(db.invoices.filter(i => i.businessId === businessId).reverse());
  }
  res.json(db.invoices.reverse());
});

app.post("/api/billing/upgrade", (req, res) => {
  const { businessId, plan } = req.body;
  if (!businessId || !plan) {
    return res.status(400).json({ error: "Business ID and plan designator are required." });
  }

  const db = loadDB();
  const bIdx = db.businesses.findIndex(b => b.id === businessId);
  if (bIdx === -1) return res.status(404).json({ error: "Business profile not found." });


  saveDB(db);
  res.json(db.businesses[bIdx]);
});

// Localized M-Pesa STK Push Simulation Endpoint with SMS/Delivery Logs
app.post("/api/billing/stk-push", (req, res) => {
  const { businessId, phone, amountKES, planName } = req.body;
  if (!businessId || !phone || !amountKES) {
    return res.status(400).json({ error: "Phone number and KES Amount are mandatory." });
  }

  const db = loadDB();
  const bz = db.businesses.find(b => b.id === businessId);

  // M-Pesa Safaricom Daraja STK execution transaction logs
  const txRef = "MPESA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const newInvoice: Invoice = {
    id: "inv-" + Math.floor(1000 + Math.random() * 9000),
    businessId,
    amountKES: Number(amountKES),
    planName: planName || "Subscription Renewal",
    billingDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "Paid",
    paymentMethod: "M-Pesa STK"
  };

  db.invoices.push(newInvoice);

  // Upgrade business status automatically on payment
  if (bz) {
  
  }

  // Record simulated logs
  db.notificationLogs.push({
    id: "notif-" + Math.random().toString(36).substring(2, 9),
    businessId,
    type: "SMS",
    recipient: phone,
    message: `LIPA NA M-PESA Confirmed. NYUKI received KES ${amountKES} for ${planName || "Service Subscription"}. Ref: ${txRef}. Current expiry is ${newInvoice.dueDate}.`,
    eventType: "billing",
    status: "Sent",
    sentAt: new Date().toISOString()
  });

  saveDB(db);
  res.json({
    success: true,
    message: "STK notification pushed successfully to Safaricom terminal.",
    referenceId: txRef,
    invoice: newInvoice
  });
});

// --- CAREERS PAGE APPLICATION PIPELINE ---
app.post("/api/careers/apply", (req, res) => {
  const { name, email, phone, roleApply, resumeUrl, coverLetter } = req.body;
  if (!name || !email || !roleApply || !coverLetter) {
    return res.status(400).json({ error: "Missing required properties on job application." });
  }

  const db = loadDB();
  const appItem: CareerApplication = {
    id: "app-" + Math.random().toString(36).substring(2, 9),
    name,
    email,
    phone: phone || "+254",
    roleApply,
    resumeUrl: resumeUrl || "https://nyuki.co.ke/resumes/default.pdf",
    coverLetter,
    status: "Pending",
    appliedAt: new Date().toISOString()
  };

  db.careerApplications.push(appItem);
  saveDB(db);

  res.json({ success: true, application: appItem });
});

app.get("/api/careers/applications", (req, res) => {
  const db = loadDB();
  res.json(db.careerApplications.reverse());
});

// --- ANALYTICS ENGINE DATA GENERATOR ---
app.get("/api/analytics", (req, res) => {
  const { businessId } = req.query;
  const db = loadDB();

  // Basic filters
  const bzApts = businessId ? db.appointments.filter(a => a.businessId === businessId) : db.appointments;
  const totalApts = bzApts.length;
  const completedApts = bzApts.filter(a => a.status === AppointmentStatus.COMPLETED).length;
  const noShowRate = totalApts > 0 ? (bzApts.filter(a => a.status === AppointmentStatus.NO_SHOW).length / totalApts) * 100 : 0;
  
  // Custom average wait calculation based on actual queue entries
  const bzQueue = businessId ? db.queueEntries.filter(q => q.businessId === businessId) : db.queueEntries;
  const completedQE = bzQueue.filter(q => q.status === QueueStatus.COMPLETED && q.startedAt && q.joinedAt);
  
  let averageWaitTime = 12; // default fallback in minutes
  if (completedQE.length > 0) {
    const totalDiffMinutes = completedQE.reduce((acc, q) => {
       const dStart = new Date(q.startedAt!).getTime();
       const dJoin = new Date(q.joinedAt).getTime();
       return acc + (dStart - dJoin) / (1000 * 60);
    }, 0);
    averageWaitTime = Math.max(2, Math.round(totalDiffMinutes / completedQE.length));
  }

  // Daily client counters (Mon - Sun traffic tracker)
  const dailyTraffic = [
    { day: "Mon", count: 24, wait: 14 },
    { day: "Tue", count: 32, wait: 11 },
    { day: "Wed", count: 41, wait: 9 },
    { day: "Thu", count: 38, wait: 13 },
    { day: "Fri", count: 52, wait: 18 },
    { day: "Sat", count: 68, wait: 22 },
    { day: "Sun", count: 18, wait: 10 }
  ];

  // Staff utilization statistics
  const staffUtil = [
    { name: "Dr. Kiprop", activeHours: 34, rating: 4.8, bookings: 88 },
    { name: "Dr. Mwangi", activeHours: 24, rating: 4.9, bookings: 54 },
    { name: "Jomo Kenyatta", activeHours: 48, rating: 4.7, bookings: 180 }
  ];

  res.json({
    totalAppointments: totalApts,
    completedAppointments: completedApts,
    noShowRate: Math.round(noShowRate),
    averageWaitTimeMinutes: averageWaitTime,
    dailyTraffic,
    staffUtilization: staffUtil,
    peakHours: "10:00 - 14:00"
  });
});

// Serve Vite SPA
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nyuki Bee Server buzzing live on http://localhost:${PORT}`);
  });
}

startServer();
