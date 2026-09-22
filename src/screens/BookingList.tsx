import React, { useState } from 'react';
import { Booking, UIState, BookingStatus } from '../types/booking';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { formatCurrencyVND } from '../utils/validation';
import { 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Search, 
  CheckCircle, 
  Clock3, 
  CheckCheck, 
  Ban, 
  Trash2, 
  FileText,
  X,
  PlusCircle,
  Filter
} from 'lucide-react';

interface BookingListProps {
  bookings: Booking[];
  uiState: UIState;
  onNavigateToBook: () => void;
  onCancelBooking: (bookingId: string) => void;
  onConfirmBooking: (bookingId: string) => void;
  onRetry: () => void;
}

export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  uiState,
  onNavigateToBook,
  onCancelBooking,
  onConfirmBooking,
  onRetry
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState<Booking | null>(null);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      b.id.toLowerCase().includes(term) ||
      b.customerName.toLowerCase().includes(term) ||
      b.teamName.toLowerCase().includes(term) ||
      b.phone.includes(term) ||
      b.pitchName.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Đã cọc & Xác nhận</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Clock3 className="w-3.5 h-3.5" />
            <span>Chờ thanh toán cọc</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Đã hoàn thành</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold">
            <Ban className="w-3.5 h-3.5" />
            <span>Đã hủy</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <span>📋 Quản Lý Lịch Thi Đấu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Danh Sách Đơn Đặt Sân Bóng Đá 11
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Theo dõi tình trạng giữ chỗ, thời gian thi đấu và tình trạng cọc tiền sân.
          </p>
        </div>

        <button
          onClick={onNavigateToBook}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đặt Sân Mới</span>
        </button>
      </div>

      {/* Filter and search controls */}
      <div className="bg-slate-850/80 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, người đặt, đội bóng, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-750 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Trạng thái:</span>
          </div>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            Tất cả ({bookings.length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'confirmed'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            Đã cọc
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'pending'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            Chờ cọc
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            Hoàn thành
          </button>
        </div>
      </div>

      {/* Main Content Area based on 4 UI states */}
      {uiState === 'loading' && (
        <section aria-label="Loading Bookings State">
          <SkeletonLoader type="table" count={4} />
        </section>
      )}

      {uiState === 'error' && (
        <section aria-label="Error Bookings State">
          <ErrorState
            title="Lỗi tải danh sách lịch đặt sân"
            message="Không thể kết nối đến cơ sở dữ liệu lịch thi đấu sân bóng 11. Vui lòng bấm thử lại để tải lại dữ liệu."
            onRetry={onRetry}
          />
        </section>
      )}

      {uiState === 'empty' && (
        <section aria-label="Empty Bookings State">
          <EmptyState
            title="Chưa có lịch đặt sân nào"
            description="Hệ thống hiện tại chưa ghi nhận đơn thuê sân bóng đá 11 người nào trong danh sách. Hãy tạo đơn đầu tiên ngay!"
            actionText="Tạo Lịch Đặt Mới"
            onAction={onNavigateToBook}
            secondaryActionText="Tải lại dữ liệu"
            onSecondaryAction={onRetry}
          />
        </section>
      )}

      {uiState === 'success' && (
        <>
          {filteredBookings.length === 0 ? (
            <EmptyState
              title="Không tìm thấy đơn đặt nào phù hợp"
              description={`Không có đơn đặt sân nào khớp với tiêu chí tìm kiếm "${searchTerm}".`}
              actionText="Xóa điều kiện tìm kiếm"
              onAction={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            />
          ) : (
            <section className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-850/80 shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th scope="col" className="px-5 py-4">Mã Đơn & Ngày Đặt</th>
                      <th scope="col" className="px-5 py-4">Người Đặt & Đội Bóng</th>
                      <th scope="col" className="px-5 py-4">Sân & Ca Thi Đấu</th>
                      <th scope="col" className="px-5 py-4">Chi Phí / Cọc</th>
                      <th scope="col" className="px-5 py-4">Trạng Thái</th>
                      <th scope="col" className="px-5 py-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Mã & ngày */}
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-white block">{b.id}</span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">{b.createdAt}</span>
                        </td>

                        {/* Người đặt & Đội */}
                        <td className="px-5 py-4">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{b.teamName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <User className="w-3 h-3 text-slate-500" />
                            <span>{b.customerName}</span>
                            <span>•</span>
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{b.phone}</span>
                          </div>
                        </td>

                        {/* Sân & Ca đá */}
                        <td className="px-5 py-4">
                          <span className="font-medium text-emerald-400 block">{b.pitchName}</span>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{b.date}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{b.timeSlotLabel}</span>
                          </div>
                        </td>

                        {/* Chi phí */}
                        <td className="px-5 py-4">
                          <span className="font-bold text-white block">
                            {formatCurrencyVND(b.totalAmount)}
                          </span>
                          <span className="text-[11px] text-emerald-400 block mt-0.5">
                            Cọc: {formatCurrencyVND(b.depositAmount)}
                          </span>
                        </td>

                        {/* Trạng thái */}
                        <td className="px-5 py-4">
                          {getStatusBadge(b.status)}
                        </td>

                        {/* Thao tác */}
                        <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => onConfirmBooking(b.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold transition-colors"
                              title="Xác nhận khách đã nộp cọc 30%"
                            >
                              Nhận Cọc
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedReceiptBooking(b)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                            title="Xem chi tiết phiếu đặt sân"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          {b.status !== 'cancelled' && b.status !== 'completed' && (
                            <button
                              onClick={() => onCancelBooking(b.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                              title="Hủy lịch đặt"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="lg:hidden space-y-3.5">
                {filteredBookings.map((b) => (
                  <article
                    key={b.id}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-850/90 space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-750">
                        {b.id}
                      </span>
                      {getStatusBadge(b.status)}
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white">{b.teamName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Người đại diện: <strong className="text-slate-200">{b.customerName}</strong> ({b.phone})
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                      <div className="text-emerald-400 font-semibold">{b.pitchName}</div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.date}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.timeSlotLabel}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                      <div>
                        <span className="text-slate-400 block">Tổng tiền:</span>
                        <span className="font-bold text-white text-sm">{formatCurrencyVND(b.totalAmount)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block">Tiền cọc:</span>
                        <span className="font-bold text-emerald-400 text-sm">{formatCurrencyVND(b.depositAmount)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => onConfirmBooking(b.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs"
                        >
                          Xác Nhận Đã Nhận Cọc
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReceiptBooking(b)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Biên nhận</span>
                      </button>
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button
                          onClick={() => onCancelBooking(b.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          title="Hủy đơn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Modal Chi Tiết Phiếu Đặt Sân (Receipt Preview) */}
      {selectedReceiptBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-850 rounded-2xl border border-slate-750 max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedReceiptBooking(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto mb-2">
                ⚽
              </div>
              <h3 className="text-lg font-bold text-white">PHIẾU XÁC NHẬN THUÊ SÂN 11</h3>
              <p className="text-xs font-mono text-emerald-400 font-bold">{selectedReceiptBooking.id}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Đội bóng:</span>
                <span className="font-bold text-white">{selectedReceiptBooking.teamName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Người đại diện:</span>
                <span className="font-semibold">{selectedReceiptBooking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Số điện thoại:</span>
                <span className="font-mono">{selectedReceiptBooking.phone}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">Sân thi đấu:</span>
                <span className="font-bold text-emerald-400">{selectedReceiptBooking.pitchName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ngày đá:</span>
                <span className="font-bold">{selectedReceiptBooking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ca đá:</span>
                <span>{selectedReceiptBooking.timeSlotLabel}</span>
              </div>
              {selectedReceiptBooking.notes && (
                <div className="border-t border-slate-800 pt-2">
                  <span className="text-slate-400 block mb-1">Ghi chú:</span>
                  <p className="italic text-slate-300 text-[11px]">{selectedReceiptBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tổng chi phí:</span>
                <span className="font-bold text-white">{formatCurrencyVND(selectedReceiptBooking.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold text-sm">
                <span>Tiền cọc (30%):</span>
                <span>{formatCurrencyVND(selectedReceiptBooking.depositAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Tình trạng:</span>
                {getStatusBadge(selectedReceiptBooking.status)}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedReceiptBooking(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
              >
                Đóng Phiếu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

