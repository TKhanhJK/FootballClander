export type PitchType = 'natural_grass' | 'artificial_grass' | 'hybrid_grass';

export type PitchStatus = 'available' | 'maintenance' | 'occupied';

export interface Pitch {
  id: string;
  name: string;
  code: string;
  type: PitchType;
  dimensions: string; // ví dụ: 105m x 68m (FIFA Standard)
  hourlyRate: number; // VNĐ / ca 90-120 phút
  surfaceQuality: string;
  tribuneCapacity: number; // Sức chứa khán đài
  hasFloodlights: boolean; // Dàn đèn 1000 Lux
  status: PitchStatus;
  amenities: string[];
  imageUrl: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isPeakHour: boolean; // Giờ cao điểm (buổi tối)
  surcharge: number; // Phụ thu tiền điện đèn nếu đá tối
}

export interface AddonService {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  iconName?: string;
}

export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerName: string;
  teamName: string;
  phone: string;
  pitchId: string;
  pitchName: string;
  date: string;
  timeSlotId: string;
  timeSlotLabel: string;
  addons: string[];
  totalAmount: number;
  depositAmount: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface BookingFormData {
  customerName: string;
  teamName: string;
  phone: string;
  pitchId: string;
  date: string;
  timeSlotId: string;
  addons: string[];
  notes: string;
  agreeTerms: boolean;
}

export type FormValidationErrors = {
  [K in keyof BookingFormData]?: string;
};

export type UIState = 'loading' | 'empty' | 'success' | 'error';

