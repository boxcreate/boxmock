import React from 'react';
import { HelpTip } from '../Tooltip';

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tip?: string;
  badge?: string;
  className?: string;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  checked,
  onChange,
  tip,
  badge,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between py-1 text-xs select-none ${className}`}>
      <div className="flex items-center gap-1.5">
        <span className="text-zinc-300 font-medium">{label}</span>
        {tip && <HelpTip text={tip} />}
        {badge && (
          <span className="text-[9px] font-mono text-zinc-500 uppercase px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800">
            {badge}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
          checked ? 'bg-zinc-200' : 'bg-zinc-800 hover:bg-zinc-750'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full transition-transform duration-150 ${
            checked ? 'translate-x-3.5 bg-zinc-950 shadow-sm' : 'translate-x-0 bg-zinc-400'
          }`}
        />
      </button>
    </div>
  );
};
