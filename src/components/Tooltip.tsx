import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; flip: boolean }>({
    top: 0,
    left: 0,
    flip: false,
  });
  const triggerRef = useRef<HTMLSpanElement>(null);

  const showTooltip = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const flip = rect.top < 70;
    setCoords({
      top: flip ? rect.bottom + 6 : rect.top - 6,
      left: Math.min(window.innerWidth - 160, Math.max(160, rect.left + rect.width / 2)),
      flip,
    });
    setVisible(true);
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  return (
    <span
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      className={`inline-flex items-center ${className}`}
      aria-label={content}
    >
      {children}
      {visible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: coords.flip ? 'translateX(-50%)' : 'translate(-50%, -100%)',
              zIndex: 99999,
            }}
            className="pointer-events-none w-72 max-w-sm p-2.5 rounded-lg bg-zinc-900/98 border border-zinc-700 text-[11px] font-normal text-zinc-100 leading-relaxed shadow-2xl backdrop-blur-md select-none text-left tracking-normal normal-case animate-in fade-in duration-100"
          >
            {content}
          </div>,
          document.body
        )}
    </span>
  );
};

export const HelpTip: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Tooltip content={text}>
      <span
        aria-label={text}
        className="inline-flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-help px-1 py-0.5"
      >
        <Info className="w-3 h-3" />
      </span>
    </Tooltip>
  );
};
