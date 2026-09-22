import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all animate-slideUp ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-300'
                : isError
                ? 'bg-slate-900/95 border-rose-500/50 text-rose-300'
                : 'bg-slate-900/95 border-sky-500/50 text-sky-300'
            }`}
          >
            {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-sm text-white">{t.title}</h5>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{t.message}</p>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

