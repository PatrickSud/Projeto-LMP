import type { ReactNode } from 'react';

interface PillarSliderProps {
  label: string;
  icon: ReactNode;
  value: number;
  onChange: (value: number) => void;
}

export function PillarSlider({ label, icon, value, onChange }: PillarSliderProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col space-y-4 group transition-shadow hover:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 text-gray-700 group-hover:text-primary-dark transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-lilac/30 flex items-center justify-center text-primary">
            {icon}
          </div>
          <span className="font-semibold">{label}</span>
        </div>
        <span className="text-primary font-bold text-xl px-2 py-1 bg-primary-lilac/30 rounded-lg min-w-[2.5rem] text-center">
          {value}
        </span>
      </div>
      
      <div className="px-1">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between mt-2 text-xs font-medium text-gray-400">
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
