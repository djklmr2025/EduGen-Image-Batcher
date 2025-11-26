import React from 'react';

interface ProgressBarProps {
  total: number;
  current: number;
  failures: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, current, failures }) => {
  const percentage = Math.min(100, (current / total) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-medium text-slate-700">
        <span>Progress: {current} / {total}</span>
        {failures > 0 && <span className="text-red-600">{failures} Failed</span>}
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
        <div 
          className="bg-blue-600 h-4 transition-all duration-300 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
