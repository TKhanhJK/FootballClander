import React, { useState } from 'react';
import { Pitch, UIState, PitchType } from '../types/booking';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { formatCurrencyVND } from '../utils/validation';
import { 
  Users, 
  Maximize2, 
  Zap, 
  CheckCircle2, 
  Search, 
  ChevronRight, 
  SlidersHorizontal,
  Info,
  X
} from 'lucide-react';

interface PitchDashboardProps {
  pitches: Pitch[];
  uiState: UIState;
  onSelectPitchToBook: (pitchId: string) => void;
  onRetry: () => void;
}

export const PitchDashboard: React.FC<PitchDashboardProps> = ({
  pitches,
  uiState,
  onSelectPitchToBook,
  onRetry
}) => {
  const [filterType, setFilterType] = useState<'all' | PitchType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalPitch, setSelectedModalPitch] = useState<Pitch | null>(null);

  // Filter pitches
  const filteredPitches = pitches.filter((pitch) => {
    const matchesType = filterType === 'all' || pitch.type === filterType;
    const matchesSearch = 
      pitch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pitch.surfaceQuality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pitch.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getPitchTypeBadge = (type: PitchType) => {
    switch (type) {
      case 'natural_grass':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">Cỏ Tự Nhiên FIFA</span>;
      case 'artificial_grass':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-semibold">Cỏ Nhân Tạo Pro</span>;
      case 'hybrid_grass':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">Cỏ Lai Hybrid</span>;
    }
  };

  const getStatusBadge = (status: Pitch['status']) => {
    if (status === 'available') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-xs font-medium backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Sẵn sàng đón khách
        </span>
      );
    }
    if (status === 'maintenance') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/40 text-xs font-medium backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          Bảo dưỡng mặt cỏ
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/40 text-xs font-medium backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-rose-400"></span>
        Đang có trận đấu
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span>⚽ Hệ Thống Sân Bóng Đá 11 Người Chuẩn Thi Đấu</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Tổ Hợp Sân Bóng Đá 11 Người <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Tiêu Chuẩn FIFA & Quốc Tế
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Mặt cỏ cao cấp, hệ thống đèn chiếu sáng 1200 Lux không điểm mù, khán đài có mái che lên tới 5.000 chỗ và đầy đủ dịch vụ trọng tài, flycam chuyên nghiệp.
          </p>

          {/* Quick Specs Highlights */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-emerald-400 font-bold text-lg block">105m × 68m</span>
              <span className="text-slate-400 text-xs">Kích thước chuẩn FIFA</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-emerald-400 font-bold text-lg block">1.200 Lux</span>
              <span className="text-slate-400 text-xs">Dàn đèn LED chống chói</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-emerald-400 font-bold text-lg block">5.000 Chỗ</span>
              <span className="text-slate-400 text-xs">Sức chứa khán đài A</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <span className="text-emerald-400 font-bold text-lg block">100% VFF</span>
              <span className="text-slate-400 text-xs">Trọng tài cấp quốc gia</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên sân, loại cỏ, tiện ích..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Mặt sân:</span>
          </div>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            Tất cả (3)
          </button>
          <button
            onClick={() => setFilterType('natural_grass')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'natural_grass'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            Cỏ Tự Nhiên
          </button>
          <button
            onClick={() => setFilterType('artificial_grass')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'artificial_grass'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            Cỏ Nhân Tạo
          </button>
          <button
            onClick={() => setFilterType('hybrid_grass')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'hybrid_grass'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            Cỏ Lai Hybrid
          </button>
        </div>
      </section>

      {/* Main Content Area based on 4 UI states */}
      {uiState === 'loading' && (
        <section aria-label="Loading State Demo">
          <SkeletonLoader count={3} />
        </section>
      )}

      {uiState === 'error' && (
        <section aria-label="Error State Demo">
          <ErrorState 
            onRetry={onRetry}
            message="Không thể kết nối đến máy chủ quản lý lịch sân bóng trung tâm (Mô phỏng lỗi HTTP 500 để kiểm chứng khả năng xử lý ngoại lệ theo yêu cầu Homework 3A)."
          />
        </section>
      )}

      {uiState === 'empty' && (
        <section aria-label="Empty State Demo">
          <EmptyState
            title="Chưa có sân bóng nào khả dụng"
            description="Tất cả các sân bóng hiện đang trong thời gian bảo dưỡng định kỳ hoặc dữ liệu đã được làm trống để kiểm thử giao diện Empty State."
            actionText="Tạo Lịch Đặt Trước"
            onAction={() => onSelectPitchToBook('pitch-01')}
            secondaryActionText="Khôi phục danh sách sân"
            onSecondaryAction={onRetry}
          />
        </section>
      )}

      {uiState === 'success' && (
        <>
          {filteredPitches.length === 0 ? (
            <EmptyState
              title="Không tìm thấy sân phù hợp"
              description={`Không có sân nào khớp với từ khóa "${searchQuery}" hoặc bộ lọc bạn đã chọn.`}
              actionText="Xóa bộ lọc tìm kiếm"
              onAction={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
            />
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPitches.map((pitch) => (
                <article
                  key={pitch.id}
                  className="group bg-slate-850/90 rounded-2xl border border-slate-800 hover:border-emerald-500/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col"
                >
                  {/* Pitch Image with overlay badges */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={pitch.imageUrl}
                      alt={pitch.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    {/* Top badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      {getPitchTypeBadge(pitch.type)}
                    </div>
                    <div className="absolute top-3.5 right-3.5">
                      {getStatusBadge(pitch.status)}
                    </div>

                    {/* Bottom overlay in image */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded">
                          {pitch.code}
                        </span>
                        <h2 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                          {pitch.name}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Specs Row */}
                      <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-800 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{pitch.dimensions}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Khán đài {pitch.tribuneCapacity} chỗ</span>
                        </div>
                      </div>

                      {/* Surface quality */}
                      <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                        {pitch.surfaceQuality}
                      </p>

                      {/* Amenities checklist */}
                      <div className="mt-3 space-y-1">
                        {pitch.amenities.slice(0, 3).map((amenity, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer: Price & Actions */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Giá thuê sân 11</span>
                        <span className="text-base font-extrabold text-white">
                          {formatCurrencyVND(pitch.hourlyRate)}
                          <span className="text-xs font-normal text-slate-400"> / ca</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedModalPitch(pitch)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Xem chi tiết thông số sân"
                        >
                          <Info className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onSelectPitchToBook(pitch.id)}
                          disabled={pitch.status === 'maintenance'}
                          className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1 transition-all ${
                            pitch.status === 'maintenance'
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                          }`}
                        >
                          <span>{pitch.status === 'maintenance' ? 'Đang bảo dưỡng' : 'Chọn thuê'}</span>
                          {pitch.status !== 'maintenance' && <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}

      {/* Modal chi tiết quy cách sân */}
      {selectedModalPitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-850 rounded-2xl border border-slate-750 max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedModalPitch(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                🏟️
              </div>
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{selectedModalPitch.code}</span>
                <h3 className="text-xl font-bold text-white">{selectedModalPitch.name}</h3>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold block mb-1">Quy cách mặt sân:</span>
                <p className="text-xs leading-relaxed">{selectedModalPitch.surfaceQuality}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Kích thước:</span>
                  <span className="text-sm font-bold text-white">{selectedModalPitch.dimensions}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Khán đài:</span>
                  <span className="text-sm font-bold text-white">{selectedModalPitch.tribuneCapacity} chỗ ngồi</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold block mb-2">Tất cả tiện ích kèm theo sân:</span>
                <ul className="space-y-1.5">
                  {selectedModalPitch.amenities.map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Đơn giá thuê:</span>
                <span className="text-lg font-bold text-emerald-400">
                  {formatCurrencyVND(selectedModalPitch.hourlyRate)} / ca
                </span>
              </div>
              <button
                onClick={() => {
                  const id = selectedModalPitch.id;
                  setSelectedModalPitch(null);
                  onSelectPitchToBook(id);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-900/30"
              >
                Đặt sân này ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

