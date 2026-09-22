import { BookingFormData, FormValidationErrors } from '../types/booking';

// Regex kiểm tra số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09)
export const VN_PHONE_REGEX = /^(0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;

// Định dạng tiền tệ VNĐ
export function formatCurrencyVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

// Lấy ngày hôm nay dưới dạng YYYY-MM-DD
export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Lấy ngày tối đa có thể đặt (30 ngày tới)
export function getMaxDateString(): string {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const year = maxDate.getFullYear();
  const month = String(maxDate.getMonth() + 1).padStart(2, '0');
  const day = String(maxDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateBookingForm(data: BookingFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};

  // 1. Họ tên người đặt
  if (!data.customerName || !data.customerName.trim()) {
    errors.customerName = 'Vui lòng nhập họ và tên người đại diện.';
  } else if (data.customerName.trim().length < 3) {
    errors.customerName = 'Họ tên phải có ít nhất 3 ký tự.';
  } else if (data.customerName.trim().length > 60) {
    errors.customerName = 'Họ tên không được vượt quá 60 ký tự.';
  }

  // 2. Tên đội bóng
  if (!data.teamName || !data.teamName.trim()) {
    errors.teamName = 'Vui lòng nhập tên đội bóng thi đấu.';
  } else if (data.teamName.trim().length < 3) {
    errors.teamName = 'Tên đội bóng phải có ít nhất 3 ký tự (VD: FC Tuổi Trẻ).';
  }

  // 3. Số điện thoại liên hệ
  const cleanPhone = data.phone.replace(/\s+/g, '');
  if (!cleanPhone) {
    errors.phone = 'Vui lòng nhập số điện thoại để nhận mã xác nhận.';
  } else if (!VN_PHONE_REGEX.test(cleanPhone)) {
    errors.phone = 'Số điện thoại không hợp lệ (Phải là 10 chữ số đầu 03, 05, 07, 08, 09).';
  }

  // 4. Chọn sân
  if (!data.pitchId) {
    errors.pitchId = 'Vui lòng chọn 1 sân bóng đá 11 người.';
  }

  // 5. Ngày thi đấu
  if (!data.date) {
    errors.date = 'Vui lòng chọn ngày muốn thuê sân.';
  } else {
    const todayStr = getTodayString();
    if (data.date < todayStr) {
      errors.date = 'Không thể đặt sân cho ngày trong quá khứ.';
    }
  }

  // 6. Khung giờ / Ca đá
  if (!data.timeSlotId) {
    errors.timeSlotId = 'Vui lòng chọn ca thi đấu phù hợp.';
  }

  // 7. Đồng ý điều khoản
  if (!data.agreeTerms) {
    errors.agreeTerms = 'Bạn cần cam kết tuân thủ quy định sử dụng sân 11 người và bảo dưỡng mặt cỏ.';
  }

  return errors;
}

