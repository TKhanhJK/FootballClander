import React, { useState, useMemo } from 'react';
import { Pitch, TimeSlot, AddonService, BookingFormData, FormValidationErrors, Booking } from '../types/booking';
import { 
  validateBookingForm, 
  getTodayString, 
  getMaxDateString, 
  formatCurrencyVND 
} from '../utils/validation';
import { 
  Calendar, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Receipt, 
  ArrowRight,
  RotateCcw,
  Flag,
  Shirt,
  Droplets,
  CircleDot,
  Video,
  Check
} from 'lucide-react';

interface BookingFormProps {
  pitches: Pitch[];
  timeSlots: TimeSlot[];
  addons: AddonService[];
  initialPitchId?: string;
  onBookingCreated: (booking: Booking) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  pitches,
  timeSlots,
  addons,
  initialPitchId,
  onBookingCreated
}) => {
  const initialFormState: BookingFormData = {
    customerName: '',
    teamName: '',
    phone: '',
    pitchId: initialPitchId || pitches[0]?.id || '',
    date: getTodayString(),
    timeSlotId: timeSlots[1]?.id || '',
    addons: [],
    notes: '',
    agreeTerms: false
  };

  const [formData, setFormData] = useState<BookingFormData>(initialFormState);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BookingFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Selected pitch info
  const selectedPitch = useMemo(() => {
    return pitches.find(p => p.id === formData.pitchId);
  }, [pitches, formData.pitchId]);

  // Selected time slot info
  const selectedSlot = useMemo(() => {
    return timeSlots.find(s => s.id === formData.timeSlotId);
  }, [timeSlots, formData.timeSlotId]);

  // Calculate costs
  const pricing = useMemo(() => {
    const pitchPrice = selectedPitch ? selectedPitch.hourlyRate : 0;
    const slotSurcharge = selectedSlot ? selectedSlot.surcharge : 0;
    const addonsTotal = formData.addons.reduce((sum, addonId) => {
      const item = addons.find(a => a.id === addonId);
      return sum + (item ? item.price : 0);
    }, 0);

    const total = pitchPrice + slotSurcharge + addonsTotal;
    const deposit = Math.round(total * 0.3); // Cọc 30%

    return {
      pitchPrice,
      slotSurcharge,
      addonsTotal,
      total,
      deposit
    };
  }, [selectedPitch, selectedSlot, formData.addons, addons]);

  // Handle field change
  const handleChange = (field: keyof BookingFormData, value: any) => {
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);

    // If field was already touched, validate in real-time
    if (touched[field]) {
      const validationResult = validateBookingForm(updatedForm);
      setErrors(prev => ({
        ...prev,
        [field]: validationResult[field]
      }));
    }
  };

  // Handle field blur
  const handleBlur = (field: keyof BookingFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationResult = validateBookingForm(formData);
    setErrors(prev => ({
      ...prev,
      [field]: validationResult[field]
    }));
  };

  // Toggle addon checkbox
  const toggleAddon = (addonId: string) => {
    const exists = formData.addons.includes(addonId);
    const newAddons = exists 
      ? formData.addons.filter(id => id !== addonId) 
      : [...formData.addons, addonId];
    handleChange('addons', newAddons);
  };

  // Fill sample data for quick demo/testing
  const handleFillSampleData = () => {
    const sample: BookingFormData = {
      customerName: 'Hoàng Quốc Việt',
      teamName: 'FC Hà Nội Star 11',
      phone: '0988123456',
      pitchId: pitches[0]?.id || '',
      date: getTodayString(),
      timeSlotId: timeSlots[2]?.id || '',
      addons: ['referee', 'water', 'bibs'],
      notes: 'Yêu cầu trọng tài có kinh nghiệm điều khiển trận chung kết giao hữu',
      agreeTerms: true
    };
    setFormData(sample);
    setErrors({});
    setTouched({});
  };

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Partial<Record<keyof BookingFormData, boolean>> = {
      customerName: true,
      teamName: true,
      phone: true,
      pitchId: true,
      date: true,
      timeSlotId: true,
      agreeTerms: true
    };
    setTouched(allTouched);

    const validationResult = validateBookingForm(formData);
    setErrors(validationResult);

    if (Object.keys(validationResult).length > 0) {
      // Form has errors
      return;
    }

    // Simulate server submission
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);

      const newBooking: Booking = {
        id: `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        customerName: formData.customerName.trim(),
        teamName: formData.teamName.trim(),
        phone: formData.phone.trim(),
        pitchId: formData.pitchId,
        pitchName: selectedPitch?.name || 'Sân 11 Tiêu Chuẩn',
        date: formData.date,
        timeSlotId: formData.timeSlotId,
        timeSlotLabel: selectedSlot?.label || '',
        addons: [...formData.addons],
        totalAmount: pricing.total,
        depositAmount: pricing.deposit,
        status: 'pending',
        notes: formData.notes.trim() || undefined,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      onBookingCreated(newBooking);
    }, 900);
  };

  const getAddonIcon = (name?: string) => {
    switch (name) {
      case 'Whistle': return <Flag className="w-4 h-4 text-emerald-400" />;
      case 'Shirt': return <Shirt className="w-4 h-4 text-amber-400" />;
      case 'Droplets': return <Droplets className="w-4 h-4 text-sky-400" />;
      case 'CircleDot': return <CircleDot className="w-4 h-4 text-purple-400" />;
      case 'Video': return <Video className="w-4 h-4 text-rose-400" />;
      default: return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <span>🏟️ Form Đăng Ký Thuê Sân 11 Người</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Đặt Lịch Thi Đấu & Dịch Vụ Đi Kèm
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Nhập thông tin đăng ký để giữ sân và nhận hướng dẫn chuyển cọc 30% tự động.
          </p>
        </div>

        {/* Demo buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillSampleData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Điền nhanh dữ liệu mẫu hợp lệ để kiểm thử"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Điền Mẫu Nhanh</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData(initialFormState);
              setErrors({});
              setTouched({});
              setSubmittedSuccess(false);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-xs transition-colors"
            title="Làm mới form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Banner if submitted */}
      {submittedSuccess && (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 shadow-xl flex items-start gap-4 animate-slideDown">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-base font-bold text-emerald-300">Đặt sân thành công!</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Yêu cầu đặt sân của đội bóng <strong className="text-white">{formData.teamName}</strong> đã được ghi nhận. 
              Vui lòng chuyển tiền đặt cọc <strong className="text-emerald-400 font-bold">{formatCurrencyVND(pricing.deposit)}</strong> trong vòng 60 phút để giữ ca đá.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmittedSuccess(false)}
                className="text-xs font-semibold text-emerald-400 hover:underline"
              >
                Tạo thêm đơn đặt sân mới →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Phần 1: Thông tin liên hệ đội bóng */}
        <section className="bg-slate-850/80 rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-5 shadow-lg">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg border-b border-slate-800 pb-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
              1
            </span>
            <span>Thông Tin Người Đại Diện & Đội Bóng</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Họ tên */}
            <div>
              <label htmlFor="customerName" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Họ và tên người đại diện <span className="text-rose-400">*</span>
              </label>
              <input
                id="customerName"
                type="text"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                onBlur={() => handleBlur('customerName')}
                placeholder="VD: Nguyễn Văn Hùng"
                aria-invalid={touched.customerName && !!errors.customerName}
                aria-describedby={errors.customerName ? 'customerName-error' : undefined}
                className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 ${
                  touched.customerName && errors.customerName
                    ? 'border-rose-500 focus:ring-rose-500/40 bg-rose-950/10'
                    : 'border-slate-750 focus:ring-emerald-500/40 focus:border-emerald-500'
                }`}
              />
              {touched.customerName && errors.customerName && (
                <p id="customerName-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.customerName}</span>
                </p>
              )}
            </div>

            {/* Tên đội bóng */}
            <div>
              <label htmlFor="teamName" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tên câu lạc bộ / Đội bóng thi đấu <span className="text-rose-400">*</span>
              </label>
              <input
                id="teamName"
                type="text"
                value={formData.teamName}
                onChange={(e) => handleChange('teamName', e.target.value)}
                onBlur={() => handleBlur('teamName')}
                placeholder="VD: FC Bách Khoa All-Stars"
                aria-invalid={touched.teamName && !!errors.teamName}
                aria-describedby={errors.teamName ? 'teamName-error' : undefined}
                className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 ${
                  touched.teamName && errors.teamName
                    ? 'border-rose-500 focus:ring-rose-500/40 bg-rose-950/10'
                    : 'border-slate-750 focus:ring-emerald-500/40 focus:border-emerald-500'
                }`}
              />
              {touched.teamName && errors.teamName && (
                <p id="teamName-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.teamName}</span>
                </p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Số điện thoại liên hệ nhận OTP & cọc <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="VD: 0912345678"
                  aria-invalid={touched.phone && !!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 ${
                    touched.phone && errors.phone
                      ? 'border-rose-500 focus:ring-rose-500/40 bg-rose-950/10'
                      : 'border-slate-750 focus:ring-emerald-500/40 focus:border-emerald-500'
                  }`}
                />
              </div>
              {touched.phone && errors.phone ? (
                <p id="phone-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-500">
                  Chuẩn 10 số đầu 03, 05, 07, 08, 09 (ví dụ: 0988123456).
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Phần 2: Lựa chọn sân và thời gian */}
        <section className="bg-slate-850/80 rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-5 shadow-lg">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg border-b border-slate-800 pb-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
              2
            </span>
            <span>Chi Tiết Sân Bóng & Khung Giờ Thi Đấu</span>
          </div>

          <div className="space-y-5">
            {/* Chọn sân */}
            <div>
              <label htmlFor="pitchSelect" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Chọn sân bóng đá 11 người <span className="text-rose-400">*</span>
              </label>
              <select
                id="pitchSelect"
                value={formData.pitchId}
                onChange={(e) => handleChange('pitchId', e.target.value)}
                onBlur={() => handleBlur('pitchId')}
                className="w-full bg-slate-900 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              >
                {pitches.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.status === 'maintenance'}>
                    {p.name} ({p.code}) - {formatCurrencyVND(p.hourlyRate)}/ca {p.status === 'maintenance' ? '[BẢO DƯỠNG]' : ''}
                  </option>
                ))}
              </select>
              {selectedPitch && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-300">
                    <span className="font-semibold text-emerald-400">{selectedPitch.name}</span>
                    <span className="text-slate-400 block sm:inline sm:ml-2">({selectedPitch.dimensions} • Khán đài {selectedPitch.tribuneCapacity} chỗ)</span>
                  </div>
                  <span className="font-bold text-white whitespace-nowrap">
                    {formatCurrencyVND(selectedPitch.hourlyRate)}
                  </span>
                </div>
              )}
            </div>

            {/* Ngày và Giờ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Ngày thi đấu */}
              <div>
                <label htmlFor="bookingDate" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ngày thi đấu <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="bookingDate"
                    type="date"
                    min={getTodayString()}
                    max={getMaxDateString()}
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    onBlur={() => handleBlur('date')}
                    aria-invalid={touched.date && !!errors.date}
                    aria-describedby={errors.date ? 'date-error' : undefined}
                    className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-white transition-colors focus:outline-none focus:ring-2 ${
                      touched.date && errors.date
                        ? 'border-rose-500 focus:ring-rose-500/40'
                        : 'border-slate-750 focus:ring-emerald-500/40 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {touched.date && errors.date ? (
                  <p id="date-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.date}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500">
                    Hỗ trợ đặt trước trong vòng 30 ngày tới.
                  </p>
                )}
              </div>

              {/* Ca thi đấu */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Khung giờ / Ca thi đấu 120 phút <span className="text-rose-400">*</span>
                </label>
                <div className="space-y-2" role="radiogroup" aria-label="Chọn ca thi đấu">
                  {timeSlots.map((slot) => {
                    const isSelected = formData.timeSlotId === slot.id;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => handleChange('timeSlotId', slot.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-900 border-slate-750 text-slate-300 hover:border-slate-600'
                        }`}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleChange('timeSlotId', slot.id);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-500'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>}
                          </div>
                          <div>
                            <span className="text-xs font-bold block">{slot.label}</span>
                            <span className="text-[11px] text-slate-400">Thời lượng 120 phút</span>
                          </div>
                        </div>

                        {slot.surcharge > 0 && (
                          <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            +{formatCurrencyVND(slot.surcharge)} tiền đèn
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Phần 3: Dịch vụ cộng thêm & Tiện ích */}
        <section className="bg-slate-850/80 rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
                3
              </span>
              <span>Dịch Vụ Bổ Sung Chuẩn Trận Đấu 11 Người</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Tùy chọn</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {addons.map((addon) => {
              const isChecked = formData.addons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-sm'
                      : 'bg-slate-900/90 border-slate-750/80 hover:border-slate-650'
                  }`}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleAddon(addon.id);
                    }
                  }}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-colors ${
                    isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600 bg-slate-800'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                        {getAddonIcon(addon.iconName)}
                        <span className="truncate">{addon.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400 whitespace-nowrap">
                        +{formatCurrencyVND(addon.price)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {addon.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ghi chú thêm */}
          <div className="pt-2">
            <label htmlFor="notes" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ghi chú đặc biệt cho ban quản lý sân (Không bắt buộc)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="VD: Cần hỗ trợ khởi động sớm 15 phút, mượn thêm bình xịt lạnh giảm đau..."
              className="w-full bg-slate-900 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            ></textarea>
          </div>
        </section>

        {/* Phần 4: Tóm tắt chi phí & Cam kết */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-850 rounded-2xl border border-slate-750 p-5 sm:p-7 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg border-b border-slate-800 pb-3">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span>Biên Bản Dự Tính Chi Phí Thuê Sân 11</span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Đơn giá sân ({selectedPitch?.name || 'Chưa chọn'}):</span>
              <span className="font-semibold text-white">{formatCurrencyVND(pricing.pitchPrice)}</span>
            </div>

            {pricing.slotSurcharge > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>Phụ thu đèn chiếu sáng cao điểm:</span>
                <span className="font-semibold text-amber-400">+{formatCurrencyVND(pricing.slotSurcharge)}</span>
              </div>
            )}

            {pricing.addonsTotal > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>Dịch vụ kèm theo ({formData.addons.length} mục):</span>
                <span className="font-semibold text-emerald-400">+{formatCurrencyVND(pricing.addonsTotal)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm sm:text-base">
              <span className="font-bold text-white">Tổng chi phí dự kiến:</span>
              <span className="font-extrabold text-white text-lg sm:text-xl">
                {formatCurrencyVND(pricing.total)}
              </span>
            </div>

            {/* Highlight Cọc 30% */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-300 block">Số tiền cần đặt cọc trước (30%):</span>
                <span className="text-[11px] text-slate-400">Giữ sân chắc chắn và hỗ trợ chuẩn bị mặt cỏ</span>
              </div>
              <span className="text-base sm:text-lg font-black text-emerald-400">
                {formatCurrencyVND(pricing.deposit)}
              </span>
            </div>
          </div>

          {/* Điều khoản quy định */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                onBlur={() => handleBlur('agreeTerms')}
                aria-invalid={touched.agreeTerms && !!errors.agreeTerms}
                aria-describedby={errors.agreeTerms ? 'agreeTerms-error' : undefined}
                className="w-4 h-4 mt-1 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                Tôi đại diện đội bóng cam kết mang giày đinh phù hợp (AG/FG), không mang giày đế cứng kim loại sắc nhọn, không hút thuốc trong khu vực kỹ thuật và tuân thủ quyết định của tổ trọng tài. <span className="text-rose-400">*</span>
              </span>
            </label>
            {touched.agreeTerms && errors.agreeTerms && (
              <p id="agreeTerms-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.agreeTerms}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang xử lý đặt sân...</span>
                </>
              ) : (
                <>
                  <span>Xác Nhận Đặt Sân & Giữ Lịch Thi Đấu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};
