export type PitchType = 'natural_grass' | 'artificial_grass' | 'hybrid_grass';
export type PitchStatus = 'available' | 'maintenance' | 'occupied';

export interface Pitch {
  id: string;
  name: string;
  code: string;
  type: PitchType;
  dimensions: string;
  hourlyRate: number;
  surfaceQuality: string;
  tribuneCapacity: number;
  hasFloodlights: boolean;
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
  isPeakHour: boolean;
  surcharge: number;
}

export interface AddonService {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
}

export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerName: string;
  teamName: string;
  phone: string;
  pitchId: string;
  pitchName: string;
  date: string; // YYYY-MM-DD
  timeSlotId: string;
  timeSlotLabel: string;
  addons: string[];
  totalAmount: number;
  depositAmount: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  customerName: string;
  teamName: string;
  phone: string;
  pitchId: string;
  date: string;
  timeSlotId: string;
  addons?: string[];
  notes?: string;
  agreeTerms: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  meta?: Record<string, any>;
}

// Custom Domain Errors for HTTP Status Code mapping
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: string[];

  constructor(message: string, statusCode = 500, details?: string[]) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: string[]) {
    super(message, 400, details);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

