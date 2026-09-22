import React from 'react';
import { AlertOctagon, RotateCw, WifiOff, HelpCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Lỗi kết nối máy chủ sân bóng',
  message = 'Không thể đồng bộ danh sách sân và lịch đặt từ máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.',
  errorCode = 'ERR_HTTP_500_INTERNAL',
  onRetry,
  isRetrying = false
}) => {
  return (
    <div className="w-full py-14 px-6 rounded-2xl border border-rose-900/40 bg-rose-950/20 flex flex-col items-center justify-center text-center shadow-lg">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-rose-500/50 flex items-center justify-center text-rose-400 text-xs">
          <WifiOff className="w-3 h-3" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-medium mb-3">
        <span>Mã lỗi: {errorCode}</span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      {/* Suggested action */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-rose-900/30 transition-all flex items-center gap-2"
          >
            <RotateCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Đang thử lại...' : 'Thử tải lại dữ liệu'}</span>
          </button>
        )}
      </div>

      <div className="text-xs text-slate-400 flex items-center gap-1.5 border-t border-rose-900/30 pt-4 max-w-md">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
        <span>Gợi ý kỹ thuật (Homework 3A): Trạng thái này kiểm chứng cách frontend bắt lỗi mạng và hiển thị fallback UI an toàn thay vì màn hình trắng.</span>
      </div>
    </div>
  );
};

