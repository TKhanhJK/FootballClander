import React from 'react';
import { UIState } from '../types/booking';
import { Loader2, CheckCircle2, AlertTriangle, Inbox, RefreshCw, Sparkles } from 'lucide-react';

interface StateControllerProps {
  currentState: UIState;
  onChangeState: (state: UIState) => void;
  onSimulateFetch: () => void;
}

export const StateController: React.FC<StateControllerProps> = ({
  currentState,
  onChangeState,
  onSimulateFetch
}) => {
  const states: { id: UIState; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'loading', label: '1. Loading', icon: Loader2, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'empty', label: '2. Empty', icon: Inbox, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { id: 'success', label: '3. Success', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'error', label: '4. Error', icon: AlertTriangle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  ];

  return (
    <aside aria-label="Demo State Controller" className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Indicator for Homework 3A */}
        <div className="flex items-center gap-2 text-slate-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">Homework 3A State Inspector:</span>
          <span className="hidden sm:inline text-slate-400">Kiểm chứng 4 trạng thái giao diện UI</span>
        </div>

        {/* Center: State Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="group" aria-label="Lựa chọn trạng thái UI">
          {states.map((s) => {
            const Icon = s.icon;
            const isSelected = currentState === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onChangeState(s.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                  isSelected
                    ? `${s.color} border shadow-sm scale-105 font-bold`
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700/70 border border-slate-700/60'
                }`}
                aria-pressed={isSelected}
              >
                <Icon className={`w-3.5 h-3.5 ${s.id === 'loading' && isSelected ? 'animate-spin' : ''}`} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Simulate API Network Request */}
        <button
          onClick={onSimulateFetch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors font-semibold"
          title="Mô phỏng gọi API thực tế (Loading 1s -> Hiển thị kết quả)"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span className="hidden md:inline">Giả lập gọi API (1.2s)</span>
          <span className="md:hidden">API Mock</span>
        </button>
      </div>
    </aside>
  );
};

