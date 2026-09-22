import { Pitch, TimeSlot, AddonService, Booking } from '../types/booking';

export const MOCK_PITCHES: Pitch[] = [
  {
    id: 'pitch-01',
    name: 'Sân Vận Động Trung Tâm A1',
    code: 'STD-11-A1',
    type: 'natural_grass',
    dimensions: '105m x 68m (FIFA Standard)',
    hourlyRate: 2500000,
    surfaceQuality: 'Cỏ tự nhiên Bermuda nhập khẩu, phủ cát silica đạt chuẩn thi đấu V-League & Quốc tế',
    tribuneCapacity: 5000,
    hasFloodlights: true,
    status: 'available',
    amenities: [
      'Khán đài A có mái che',
      'Phòng thay đồ có điều hòa',
      'Phòng tắm nóng lạnh riêng',
      'Bảng tỷ số điện tử LED',
      'Bãi đỗ xe ô tô 50 chỗ'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'pitch-02',
    name: 'Sân Số 2 - FIFA Quality Pro',
    code: 'STD-11-B2',
    type: 'artificial_grass',
    dimensions: '105m x 68m (Chuẩn 11 người)',
    hourlyRate: 1800000,
    surfaceQuality: 'Cỏ nhân tạo kim cương sợi đúc 50mm, lót đệm Shock-pad hạt nhựa TPE an toàn chống chấn thương',
    tribuneCapacity: 1200,
    hasFloodlights: true,
    status: 'available',
    amenities: [
      'Dàn đèn LED 800 Lux không chói mắt',
      'Khu vực nghỉ ngơi có bình nước nóng lạnh',
      'Phòng thay đồ đội bóng',
      'Hệ thống thoát nước ngầm chống ngập'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'pitch-03',
    name: 'Sân Số 3 - Cỏ Lai Hybrid Grass',
    code: 'STD-11-C3',
    type: 'hybrid_grass',
    dimensions: '100m x 65m (Tiêu chuẩn tập luyện)',
    hourlyRate: 2200000,
    surfaceQuality: 'Cỏ lai tự nhiên kết hợp sợi tổng hợp gia cố, độ bám đinh giày cực cao, mặt sân siêu phẳng',
    tribuneCapacity: 800,
    hasFloodlights: true,
    status: 'maintenance',
    amenities: [
      'Hệ thống tưới nước tự động xoay 360',
      'Cột cờ góc lò xo đàn hồi',
      'Phòng y tế sơ cấp cứu tại sân',
      'Ghế ban huấn luyện tiêu chuẩn Recaro'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'
  }
];

export const MOCK_TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot-1',
    label: 'Ca Sáng Sớm (06:00 - 08:00)',
    startTime: '06:00',
    endTime: '08:00',
    durationMinutes: 120,
    isPeakHour: false,
    surcharge: 0
  },
  {
    id: 'slot-2',
    label: 'Ca Chiều Mát (15:30 - 17:30)',
    startTime: '15:30',
    endTime: '17:30',
    durationMinutes: 120,
    isPeakHour: false,
    surcharge: 0
  },
  {
    id: 'slot-3',
    label: 'Ca Tối Vàng (18:00 - 20:00) [Đèn LED]',
    startTime: '18:00',
    endTime: '20:00',
    durationMinutes: 120,
    isPeakHour: true,
    surcharge: 200000
  },
  {
    id: 'slot-4',
    label: 'Ca Đêm Nhiệt Huyết (20:15 - 22:15) [Đèn LED]',
    startTime: '20:15',
    endTime: '22:15',
    durationMinutes: 120,
    isPeakHour: true,
    surcharge: 200000
  }
];

export const MOCK_ADDONS: AddonService[] = [
  {
    id: 'referee',
    name: 'Tổ Trọng Tài VFF (1 Chính + 2 Biên)',
    price: 600000,
    unit: 'trận',
    description: 'Trọng tài có chứng chỉ VFF cấp 2, điều khiển trận đấu công tâm, có biên bản sau trận',
    iconName: 'Whistle'
  },
  {
    id: 'bibs',
    name: 'Bộ Áo Pitch Phân Đội (30 áo 2 màu Cam - Xanh)',
    price: 150000,
    unit: 'bộ / ca',
    description: 'Áo lưới thể thao giặt sấy thơm tho, số in rõ nét từ 1 đến 15 mỗi màu',
    iconName: 'Shirt'
  },
  {
    id: 'water',
    name: 'Combo Nước Khoáng & Đá Lạnh Tinh Khiết',
    price: 200000,
    unit: 'combo',
    description: '2 thùng nước suối chai 500ml + 1 thùng giữ nhiệt đá sạch 20kg',
    iconName: 'Droplets'
  },
  {
    id: 'ball',
    name: 'Bóng Thi Đấu Tiêu Chuẩn FIFA Quality Pro',
    price: 100000,
    unit: 'quả / ca',
    description: 'Bóng Động Lực UHV 2.05 chính hãng, độ nảy và áp suất chuẩn thi đấu',
    iconName: 'CircleDot'
  },
  {
    id: 'media',
    name: 'Quay Phim & Highlight Bàn Thắng (Flycam + 1 Máy quay)',
    price: 800000,
    unit: 'trận',
    description: 'Ghi hình toàn trận 1080p 60fps, cắt ghép video bàn thắng đẹp và bàn giao trong 24h',
    iconName: 'Video'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-2026-089',
    customerName: 'Nguyễn Văn Hùng',
    teamName: 'FC Thăng Long Warriors 11',
    phone: '0912345678',
    pitchId: 'pitch-01',
    pitchName: 'Sân Vận Động Trung Tâm A1',
    date: '2026-09-12',
    timeSlotId: 'slot-3',
    timeSlotLabel: 'Ca Tối Vàng (18:00 - 20:00)',
    addons: ['referee', 'water', 'ball'],
    totalAmount: 3400000,
    depositAmount: 1020000,
    status: 'confirmed',
    notes: 'Trận bóng giao hữu kỷ niệm thành lập công ty, yêu cầu chuẩn bị cờ lưu niệm',
    createdAt: '2026-09-08 14:30'
  },
  {
    id: 'BK-2026-090',
    customerName: 'Trần Minh Đức',
    teamName: 'FC Ngân Hàng Techcom',
    phone: '0987654321',
    pitchId: 'pitch-02',
    pitchName: 'Sân Số 2 - FIFA Quality Pro',
    date: '2026-09-13',
    timeSlotId: 'slot-2',
    timeSlotLabel: 'Ca Chiều Mát (15:30 - 17:30)',
    addons: ['bibs', 'water'],
    totalAmount: 2150000,
    depositAmount: 645000,
    status: 'pending',
    notes: 'Chờ đối tác chuyển tiền cọc 30%',
    createdAt: '2026-09-09 09:15'
  },
  {
    id: 'BK-2026-088',
    customerName: 'Lê Hoàng Long',
    teamName: 'FC Lão Tướng Bách Khoa',
    phone: '0903334455',
    pitchId: 'pitch-01',
    pitchName: 'Sân Vận Động Trung Tâm A1',
    date: '2026-09-07',
    timeSlotId: 'slot-4',
    timeSlotLabel: 'Ca Đêm Nhiệt Huyết (20:15 - 22:15)',
    addons: ['referee', 'water'],
    totalAmount: 3300000,
    depositAmount: 990000,
    status: 'completed',
    notes: 'Trận đấu kết thúc tốt đẹp với tỉ số hòa 2-2',
    createdAt: '2026-09-05 11:20'
  }
];

