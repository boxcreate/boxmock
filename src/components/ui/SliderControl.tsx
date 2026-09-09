import React from 'react';
import { HelpTip } from '../Tooltip';
import { RotateCcw } from 'lucide-react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  unit?: string;
  formatValue?: (val: number) => string;
  tip?: string;
  defaultValue?: number;
  className?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = '',
  formatValue,
  tip,
  defaultValue,
  className = '',
}) => {
  const displayVal = formatValue
    ? formatValue(value)
    : unit === '%'
    ? `${Math.round(value * 100)}%`
    : `${value > 0 && (label.includes('Angle') || label.includes('Position') || label.includes('Spread') || label.includes('Pan')) ? `+${value}` : value}${unit}`;

  const isModified = defaultValue !== undefined && value !== defaultValue;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <span className="text-zinc-300 font-medium">{label}</span>
          {tip && <HelpTip text={tip} />}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-zinc-300 bg-zinc-900/90 px-1.5 py-0.5 rounded border border-zinc-800/80 min-w-[3rem] text-right">
            {displayVal}
          </span>
          {isModified && (
            <button
              onClick={() => onChange(defaultValue)}
              title={`Reset to default (${formatValue ? formatValue(defaultValue) : defaultValue}${unit})`}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value, 10))}
        className="w-full accent-zinc-200 bg-zinc-850 h-1.5 rounded-full cursor-pointer hover:accent-white transition-all"
      />
    </div>
  );
};
