/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  BUSINESS_ADMIN = "BUSINESS_ADMIN",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER"
}

export enum AppointmentStatus {
  SCHEDULED = "Scheduled",
  CHECKED_IN = "Checked In",
  WAITING = "Waiting",
  IN_SERVICE = "In Service",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  NO_SHOW = "No Show"
}

export enum QueueStatus {
  WAITING = "Waiting",
  CALLED = "Called",
  IN_SERVICE = "In Service",
  COMPLETED = "Completed"
}

export enum CustomerPlan {
  STANDARD = "STANDARD",
  PREMIUM = "PREMIUM"
}

export interface Business {
  id: string;
  name: string;
  industry: string;
  address: string;
  email: string;
  phone: string;
  operatingHours: {
    start: string; // "08:00"
    end: string;   // "17:00"
  };
  timezone: string;
  logoUrl?: string;
  description: string;
 revenueModel: "TRANSACTION_BASED";
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessId?: string; // Standard isolation
  phone?: string;
  customerPlan?: CustomerPlan;
  monthlyBookingsCount: number;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceKES: number;
  assignedStaffIds: string[];
  isActive: boolean;
}

export interface Appointment {
  id: string;
  businessId: string;
  customerId?: string; // Optional if walk-in
  customerName: string;
  customerPhone: string;
  serviceId: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  bookingReference: string; // NY-XXXX
  createdAt: string;
}

export interface QueueEntry {
  id: string;
  businessId: string;
  appointmentId?: string;
  customerName: string;
  customerPhone: string;
  queueNumber: string; // e.g., B-02
  position: number;   // Current real-time position (1, 2, 3...)
  status: QueueStatus;
  waitTimeEstimateMinutes: number;
  joinedAt: string;
  calledAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface NotificationLog {
  id: string;
  businessId: string;
  type: "SMS" | "Email";
  recipient: string;
  message: string;
  eventType: "booking_confirmation" | "reminder" | "queue_update" | "service_completed" | "billing";
  status: "Sent" | "Failed";
  sentAt: string;
}

export interface Invoice {
  id: string;
  businessId?: string;
  customerId?: string;
  amountKES: number;
  planName: string;
  billingDate: string;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Pending";
  paymentMethod: "M-Pesa STK" | "M-Pesa Paybill" | "Credit Card" | "Debit Card";
}

export interface CareerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleApply: string;
  resumeUrl: string;
  coverLetter: string;
  status: "Pending" | "Reviewed" | "Contacted" | "Offered" | "Rejected";
  appliedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  ipAddress?: string;
}
