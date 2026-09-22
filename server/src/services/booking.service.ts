import { bookingRepository } from '../repositories/booking.repository.js';
import { pitchRepository } from '../repositories/pitch.repository.js';
import { 
  Booking, 
  CreateBookingInput, 
  BookingStatus,
  BadRequestError, 
  NotFoundError, 
  ConflictError 
} from '../types/index.js';

// Regex kiểm tra số điện thoại Việt Nam (10 chữ số)
const VN_PHONE_REGEX = /^(0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;

export class BookingService {
  // 1. Tạo đơn đặt sân mới kèm kiểm tra toàn diện nghiệp vụ
  async createBooking(input: CreateBookingInput): Promise<Booking> {
    const errors: string[] = [];

    // Validation cơ bản
    if (!input.customerName || input.customerName.trim().length < 3) {
      errors.push('Họ và tên người đại diện phải có ít nhất 3 ký tự.');
    }
    if (!input.teamName || input.teamName.trim().length < 3) {
      errors.push('Tên đội bóng thi đấu phải có ít nhất 3 ký tự.');
    }
    const cleanPhone = (input.phone || '').replace(/\s+/g, '');
    if (!cleanPhone || !VN_PHONE_REGEX.test(cleanPhone)) {
      errors.push('Số điện thoại không hợp lệ (Phải là 10 chữ số chuẩn đầu số VN 03, 05, 07, 08, 09).');
    }
    if (!input.pitchId) {
      errors.push('Vui lòng chọn 1 sân bóng đá 11 người.');
    }
    if (!input.date) {
      errors.push('Vui lòng chọn ngày thi đấu.');
    }
    if (!input.timeSlotId) {
      errors.push('Vui lòng chọn ca thi đấu.');
    }
    if (!input.agreeTerms) {
      errors.push('Bạn cần cam kết tuân thủ quy định sử dụng sân 11 người và bảo dưỡng mặt cỏ.');
    }

    // Kiểm tra tính hợp lệ của ngày
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (input.date && input.date < todayStr) {
      errors.push('Không thể đặt sân cho ngày trong quá khứ.');
    }

    if (errors.length > 0) {
      throw new BadRequestError('Dữ liệu yêu cầu đặt sân không hợp lệ.', errors);
    }

    // Kiểm tra sự tồn tại của sân
    const pitch = await pitchRepository.getPitchById(input.pitchId);
    if (!pitch) {
      throw new NotFoundError(`Sân bóng '${input.pitchId}' không tồn tại trong hệ thống.`);
    }
    if (pitch.status === 'maintenance') {
      throw new BadRequestError(`Sân '${pitch.name}' hiện đang bảo dưỡng mặt cỏ, không thể tiếp nhận đặt chỗ.`);
    }

    // Kiểm tra sự tồn tại của ca đá
    const slot = await pitchRepository.getTimeSlotById(input.timeSlotId);
    if (!slot) {
      throw new NotFoundError(`Ca thi đấu '${input.timeSlotId}' không tồn tại.`);
    }

    // QUY TẮC NGHIỆP VỤ CỐT LÕI: Chống trùng lịch (Double Booking / Slot Conflict)
    const existingBooking = await bookingRepository.findActiveSlotBooking(
      input.pitchId,
      input.date,
      input.timeSlotId
    );
    if (existingBooking) {
      throw new ConflictError(
        `Xung đột lịch đặt (409 Conflict): ${pitch.name} vào ngày ${input.date} (${slot.label}) đã được đội '${existingBooking.teamName}' đặt trước. Vui lòng chọn ca hoặc ngày khác.`
      );
    }

    // Tính toán chi phí dịch vụ phụ trợ
    const allAddons = await pitchRepository.getAllAddons();
    let addonsTotal = 0;
    const validAddonIds: string[] = [];

    if (Array.isArray(input.addons)) {
      for (const addonId of input.addons) {
        const found = allAddons.find(a => a.id === addonId);
        if (found) {
          addonsTotal += found.price;
          validAddonIds.push(found.id);
        }
      }
    }

    // Tính tổng tiền & cọc 30%
    const totalAmount = pitch.hourlyRate + slot.surcharge + addonsTotal;
    const depositAmount = Math.round(totalAmount * 0.3); // Bắt buộc 30%

    // Tạo mã đơn ngẫu nhiên duy nhất
    const year = today.getFullYear();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const nowIso = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newBooking: Booking = {
      id: `BK-${year}-${randomSuffix}`,
      customerName: input.customerName.trim(),
      teamName: input.teamName.trim(),
      phone: cleanPhone,
      pitchId: pitch.id,
      pitchName: pitch.name,
      date: input.date,
      timeSlotId: slot.id,
      timeSlotLabel: slot.label,
      addons: validAddonIds,
      totalAmount,
      depositAmount,
      status: 'pending',
      notes: input.notes?.trim() || undefined,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    return bookingRepository.create(newBooking);
  }

  // 2. Lấy danh sách đơn đặt kèm bộ lọc
  async getBookings(filter?: { status?: string; pitchId?: string; date?: string }): Promise<Booking[]> {
    return bookingRepository.findAll(filter);
  }

  // 3. Lấy chi tiết đơn đặt theo ID
  async getBookingById(id: string): Promise<Booking> {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError(`Không tìm thấy đơn đặt sân với mã: ${id}`);
    }
    return booking;
  }

  // 4. Cập nhật trạng thái đơn đặt sân (xác nhận cọc hoặc hủy đơn)
  async updateBookingStatus(id: string, newStatus: BookingStatus): Promise<Booking> {
    const booking = await this.getBookingById(id);

    const validStatuses: BookingStatus[] = ['confirmed', 'pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new BadRequestError(`Trạng thái '${newStatus}' không hợp lệ.`);
    }

    if (booking.status === 'cancelled' && newStatus !== 'cancelled') {
      throw new BadRequestError('Đơn đặt sân đã bị hủy không thể khôi phục trạng thái khác.');
    }

    const updated = await bookingRepository.update(id, { status: newStatus });
    if (!updated) {
      throw new NotFoundError(`Không thể cập nhật đơn đặt sân: ${id}`);
    }

    return updated;
  }
}

export const bookingService = new BookingService();

