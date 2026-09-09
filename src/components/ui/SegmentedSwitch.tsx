import React from 'react';

interface SegmentedSwitchOption<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  tip?: string;
}

interface SegmentedSwitchProps<T extends string> {
  options: SegmentedSwitchOption<T>[];
  value: T;
  onChange: (val: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function SegmentedSwitch<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
}: SegmentedSwitchProps<T>) {
  return (
    <div
      className={`flex items-center p-0.5 bg-zinc-900/90 rounded-lg border border-zinc-800/80 text-xs select-none ${className}`}
    >
      {options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            title={opt.tip || opt.label}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md font-medium transition-all cursor-pointer truncate capitalize ${
              size === 'sm' ? 'py-1 text-[11px]' : 'py-1.5 text-xs'
            } ${
              isSelected
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50'
            }`}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
