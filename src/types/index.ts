export interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: string; // "60 min"
  image: string;
  category: string;
  featured?: boolean;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string; // ISO string for the date
  time: string; // "HH:mm"
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface DaySchedule {
  enabled: boolean;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  breakStartTime?: string; // "HH:mm"
  breakEndTime?: string; // "HH:mm"
}

export interface ScheduleSettings {
  slotDuration: number; // in minutes
  days: {
    sunday: DaySchedule;
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
  };
}

export interface AdminSettings {
  whatsappNumber: string;
  whatsappMessage: string;
  googleMapsUrl: string;
  aboutPageContent: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  schedule: ScheduleSettings;
}
