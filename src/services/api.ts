import { Pitch, Booking, BookingFormData } from '../types/booking';
import { MOCK_PITCHES, INITIAL_BOOKINGS } from '../data/mockData';

const API_BASE = '/api';

export const apiClient = {
  // Check backend health
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Get pitches
  async getPitches(): Promise<Pitch[]> {
    try {
      const res = await fetch(`${API_BASE}/pitches`);
      if (!res.ok) throw new Error('API failed');
      const json = await res.json();
      return json.data || MOCK_PITCHES;
    } catch {
      return MOCK_PITCHES;
    }
  },

  // Get bookings
  async getBookings(): Promise<Booking[]> {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      if (!res.ok) throw new Error('API failed');
      const json = await res.json();
      return json.data || INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  // Create booking
  async createBooking(formData: BookingFormData): Promise<{ success: boolean; data?: Booking; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const json = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: json.message || (json.errors ? json.errors.join(', ') : 'Lỗi khi tạo đơn')
        };
      }
      return { success: true, data: json.data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi mạng khi kết nối đến máy chủ backend.' };
    }
  },

  // Update status
  async updateStatus(id: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Send AI Chat
  async sendAIChat(
    message: string,
    history: { role: 'user' | 'model'; content: string }[] = []
  ): Promise<{ success: boolean; reply: string; isAiPowered?: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });
      const json = await res.json();
      if (!res.ok) {
        return {
          success: false,
          reply: '',
          error: json.message || 'Lỗi khi kết nối với Trợ lý AI'
        };
      }
      return {
        success: true,
        reply: json.data?.reply || '',
        isAiPowered: json.data?.isAiPowered
      };
    } catch (err: any) {
      return {
        success: false,
        reply: '',
        error: err.message || 'Không thể kết nối đến máy chủ trợ lý AI.'
      };
    }
  }
};

