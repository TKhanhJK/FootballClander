import React from 'react';
import { PlusCircle, SearchX, RefreshCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Không tìm thấy dữ liệu',
  description = 'Hiện tại chưa có thông tin nào phù hợp với điều kiện hiển thị hoặc bộ lọc.',
  actionText = 'Đăng ký thuê sân mới',
  onAction,
  secondaryActionText,
  onSecondaryAction
}) => {
  return (
    <div className="w-full py-16 px-6 rounded-2xl border border-dashed border-slate-750 bg-slate-850/50 flex flex-col items-center justify-center text-center">
      {/* Visual illustration / soccer pitch icon */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner">
          <span className="text-4xl">🏟️</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <SearchX className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{actionText}</span>
          </button>
        )}

        {onSecondaryAction && secondaryActionText && (
          <button
            onClick={onSecondaryAction}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>{secondaryActionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

