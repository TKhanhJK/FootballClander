import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'form';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'card', count = 3 }) => {
  if (type === 'table') {
    return (
      <div className="w-full bg-slate-850 rounded-2xl border border-slate-800 p-6 space-y-4 animate-pulse">
        <div className="h-7 bg-slate-800 rounded-lg w-1/4 mb-6"></div>
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-750">
              <div className="space-y-2 w-1/3">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700/70 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-slate-700 rounded w-1/5"></div>
              <div className="h-6 bg-slate-700 rounded-full w-20"></div>
              <div className="h-8 bg-slate-700 rounded-lg w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className="bg-slate-850/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg animate-pulse"
        >
          {/* Skeleton Image */}
          <div className="h-48 bg-slate-800 w-full relative">
            <div className="absolute top-4 left-4 h-6 w-24 bg-slate-700 rounded-full"></div>
            <div className="absolute top-4 right-4 h-6 w-20 bg-slate-700 rounded-full"></div>
          </div>
          
          {/* Skeleton Body */}
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <div className="h-5 bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700/60 rounded w-1/2"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800">
              <div className="space-y-1">
                <div className="h-3 bg-slate-700/60 rounded w-1/3"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
              <div className="space-y-1">
                <div className="h-3 bg-slate-700/60 rounded w-1/3"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="h-6 bg-slate-800 rounded w-1/3"></div>
              <div className="h-6 bg-slate-800 rounded w-1/3"></div>
              <div className="h-6 bg-slate-800 rounded w-1/3"></div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <div className="h-6 bg-slate-700 rounded w-1/3"></div>
              <div className="h-9 bg-slate-700 rounded-xl w-28"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

