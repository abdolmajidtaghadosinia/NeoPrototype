import React from 'react';

interface StockTickerSkeletonProps {
  className?: string;
}

const StockTickerSkeleton: React.FC<StockTickerSkeletonProps> = ({ className }) => (
  <div
    className={`bg-neo-dark-2 flex flex-col items-center gap-1.5 rounded-xl px-2 py-1.5 animate-pulse ${
      className ?? 'w-32'
    }`}
  >
    <div className="h-3.5 w-3/4 rounded bg-neo-dark-3" />
    <div className="h-10 w-full rounded bg-neo-dark-3" />
  </div>
);

export default StockTickerSkeleton;

