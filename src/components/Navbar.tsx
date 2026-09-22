import React, { useState } from 'react';
import { Trophy, CalendarCheck, PlusCircle, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: 'pitches' | 'book' | 'bookings';
  onSelectTab: (tab: 'pitches' | 'book' | 'bookings') => void;
  bookingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, bookingCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'pitches' as const,
      label: 'Danh Sách Sân 11',
      icon: Trophy,
      badge: null
    },
    {
      id: 'book' as const,
      label: 'Đăng Ký Thuê Sân',
      icon: PlusCircle,
      badge: null
    },
    {
      id: 'bookings' as const,
      label: 'Lịch Đặt & Quản Lý',
      icon: CalendarCheck,
      badge: bookingCount > 0 ? bookingCount : null
    }
  ];

  const handleTabClick = (tab: 'pitches' | 'book' | 'bookings') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleTabClick('pitches')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
              <span className="text-xl">⚽</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  PITCH<span className="text-emerald-500">MASTER</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  11 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Quản lý & Cho thuê Sân bóng đá tiêu chuẩn</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action / Right side badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chuẩn FIFA Quality</span>
            </div>
            <button
              onClick={() => handleTabClick('book')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đặt Sân Nhanh</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Mở menu điều hướng"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-lg px-4 pt-2 pb-5 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-emerald-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleTabClick('book')}
              className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Ký Thuê Sân Ngay</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

