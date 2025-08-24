export interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: string;
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
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface OperatingHour {
  id: string;
  day: string;
  time: string;
}

export interface AdminSettings {
  whatsappNumber: string;
  whatsappMessage: string;
  googleCalendarId: string;
  googleMapsUrl: string;
  aboutPageContent: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  operatingHours: OperatingHour[];
}
