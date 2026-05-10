export type TeacherStatus = "PENDING" | "APPROVED" | "REJECTED";
export type SessionStatus =
  | "SCHEDULED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";
export type PaymentMethod = "PIX" | "CREDIT_CARD";

export type Subject = {
  id: string;
  name: string;
  description?: string;
};

export type TeacherListing = {
  id: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  status: TeacherStatus;
  hourlyRateCents: number;
  subjects: Subject[];
};

export type BookingView = {
  id: string;
  subject: string;
  teacherName: string;
  studentName?: string;
  scheduledAt: string;
  status: SessionStatus;
  paymentMethod: PaymentMethod;
  meetLink?: string;
};
