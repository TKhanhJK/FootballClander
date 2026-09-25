import React, { useState, useEffect } from 'react';
import { Pitch, Booking, UIState } from './types/booking';
import { MOCK_PITCHES, MOCK_TIME_SLOTS, MOCK_ADDONS, INITIAL_BOOKINGS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { StateController } from './components/StateController';
import { PitchDashboard } from './screens/PitchDashboard';
import { BookingForm } from './screens/BookingForm';
import { BookingList } from './screens/BookingList';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AIChatWidget } from './components/AIChatWidget';
import { apiClient } from './services/api';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'pitches' | 'book' | 'bookings'>('pitches');
  const [pitches, setPitches] = useState<Pitch[]>(MOCK_PITCHES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedPitchIdToBook, setSelectedPitchIdToBook] = useState<string>(MOCK_PITCHES[0]?.id || '');
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  
  // 4 Trạng thái theo yêu cầu Homework 3A (Loading, Empty, Success, Error)
  const [uiState, setUiState] = useState<UIState>('success');
  
  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync data from Backend on initial mount
  useEffect(() => {
    async function initData() {
      const isHealthy = await apiClient.checkHealth();
      setBackendOnline(isHealthy);
      if (isHealthy) {
        const [loadedPitches, loadedBookings] = await Promise.all([
          apiClient.getPitches(),
          apiClient.getBookings()
        ]);
        setPitches(loadedPitches);
        setBookings(loadedBookings);
      }
    }
    initData();
  }, []);

  // Switch to book tab with selected pitch
  const handleSelectPitchToBook = (pitchId: string) => {
    setSelectedPitchIdToBook(pitchId);
    setCurrentTab('book');
  };

  // Add new booking from form (calling backend API if available)
  const handleBookingCreated = async (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);

    // Send to backend API
    if (backendOnline) {
      const apiResult = await apiClient.createBooking({
        customerName: newBooking.customerName,
        teamName: newBooking.teamName,
        phone: newBooking.phone,
        pitchId: newBooking.pitchId,
        date: newBooking.date,
        timeSlotId: newBooking.timeSlotId,
        addons: newBooking.addons,
        notes: newBooking.notes || '',
        agreeTerms: true
      });

      if (!apiResult.success) {
        addToast('error', 'Lỗi từ máy chủ Backend', apiResult.error || 'Không thể lưu đơn vào máy chủ.');
        return;
      }
    }

    addToast(
      'success',
      'Đăng ký thuê sân thành công!',
      `Đã tạo đơn ${newBooking.id} cho đội ${newBooking.teamName}. Vui lòng chuyển cọc 30% để xác nhận.`
    );
    // Switch to booking list after a brief pause
    setTimeout(() => {
      setCurrentTab('bookings');
    }, 1200);
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    if (backendOnline) {
      await apiClient.updateStatus(bookingId, 'cancelled');
    }
    addToast('info', 'Đã hủy đơn đặt sân', `Đơn đặt ${bookingId} đã được chuyển sang trạng thái Hủy.`);
  };

  // Confirm booking deposit
  const handleConfirmBooking = async (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'confirmed' } : b))
    );
    if (backendOnline) {
      await apiClient.updateStatus(bookingId, 'confirmed');
    }
    addToast('success', 'Đã xác nhận tiền cọc', `Đơn ${bookingId} đã nhận đủ 30% cọc và được duyệt chính thức.`);
  };

  // Simulate API Fetch (Loading -> Success)
  const handleSimulateFetch = async () => {
    setUiState('loading');
    addToast('info', 'Đang gọi API...', 'Đang đồng bộ dữ liệu từ máy chủ Backend.');
    try {
      const isHealthy = await apiClient.checkHealth();
      setBackendOnline(isHealthy);
      if (isHealthy) {
        const [loadedPitches, loadedBookings] = await Promise.all([
          apiClient.getPitches(),
          apiClient.getBookings()
        ]);
        setPitches(loadedPitches);
        setBookings(loadedBookings);
      }
      setTimeout(() => {
        setUiState('success');
        addToast('success', 'Đồng bộ hoàn tất!', 'Dữ liệu sân và lịch thi đấu đã tải thành công.');
      }, 700);
    } catch {
      setUiState('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Thanh kiểm soát 4 trạng thái & Backend indicator */}
      <StateController
        currentState={uiState}
        onChangeState={(state) => {
          setUiState(state);
          if (state === 'error') {
            addToast('error', 'Chuyển sang Error State', 'Mô phỏng trạng thái lỗi kết nối máy chủ.');
          } else if (state === 'empty') {
            addToast('info', 'Chuyển sang Empty State', 'Mô phỏng trạng thái danh sách trống.');
          } else if (state === 'loading') {
            addToast('info', 'Chuyển sang Loading State', 'Mô phỏng hiệu ứng Skeleton Loader.');
          } else {
            addToast('success', 'Chuyển sang Success State', 'Hiển thị dữ liệu thực tế đầy đủ.');
          }
        }}
        onSimulateFetch={handleSimulateFetch}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        bookingCount={bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}
      />

      {/* 3. Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'pitches' && (
          <PitchDashboard
            pitches={pitches}
            uiState={uiState}
            onSelectPitchToBook={handleSelectPitchToBook}
            onRetry={handleSimulateFetch}
          />
        )}

        {currentTab === 'book' && (
          <BookingForm
            pitches={pitches}
            timeSlots={MOCK_TIME_SLOTS}
            addons={MOCK_ADDONS}
            initialPitchId={selectedPitchIdToBook}
            onBookingCreated={handleBookingCreated}
          />
        )}

        {currentTab === 'bookings' && (
          <BookingList
            bookings={bookings}
            uiState={uiState}
            onNavigateToBook={() => setCurrentTab('book')}
            onCancelBooking={handleCancelBooking}
            onConfirmBooking={handleConfirmBooking}
            onRetry={handleSimulateFetch}
          />
        )}
      </main>

      {/* 4. Footer with Week 4 Backend badge */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">PitchMaster 11</span>
            <span>•</span>
            <span>Hệ Thống Quản Lý Cho Thuê Sân Bóng Đá 11 Người</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>Backend API (Port 5000): <strong className={backendOnline ? 'text-emerald-400' : 'text-amber-400'}>{backendOnline ? 'Connected' : 'Standalone'}</strong></span>
            </div>
            <span>Week 4: Backend Vertical Slice (Homework 4A)</span>
          </div>
        </div>
      </footer>

      {/* 5. AI Assistant Chat Widget */}
      <AIChatWidget
        onNavigateToBook={(pitchId) => {
          if (pitchId) setSelectedPitchIdToBook(pitchId);
          setCurrentTab('book');
        }}
      />

      {/* 6. Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
