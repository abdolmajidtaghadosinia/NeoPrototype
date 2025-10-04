import React from 'react';
import clsx from 'clsx';
import { SignalIcon } from './icons/SignalIcon';
import { TechnicalSignalInsight, SignalStance } from '../types';
import { composeHomeCardClasses, HomeCardTone } from './designSystem';

interface TechnicalSummaryPanelProps {
  signals: TechnicalSignalInsight[];
  className?: string;
}

const signalToneStyles: Record<SignalStance, {
  tone: HomeCardTone;
  badge: string;
  value: string;
  chip: string;
  bullet: string;
}> = {
  bullish: {
    tone: 'positive',
    badge: 'border border-neo-green/45 bg-neo-green/15 text-neo-green',
    value: 'text-neo-green',
    chip: 'border border-neo-green/40 bg-neo-green/10 text-neo-green',
    bullet: 'bg-neo-green',
  },
  bearish: {
    tone: 'negative',
    badge: 'border border-rose-400/45 bg-rose-500/15 text-rose-200',
    value: 'text-rose-200',
    chip: 'border border-rose-400/35 bg-rose-500/10 text-rose-200',
    bullet: 'bg-rose-300',
  },
  neutral: {
    tone: 'muted',
    badge: 'border border-white/25 bg-white/15 text-gray-200',
    value: 'text-gray-100',
    chip: 'border border-white/20 bg-white/10 text-gray-200',
    bullet: 'bg-gray-300',
  },
};

const signalStanceLabels: Record<SignalStance, string> = {
  bullish: 'سیگنال صعودی',
  bearish: 'سیگنال نزولی',
  neutral: 'سیگنال خنثی',
};

const TechnicalSummaryPanel: React.FC<TechnicalSummaryPanelProps> = ({ signals, className }) => {
  return (
    <div className={composeHomeCardClasses('default', 'md', clsx('space-y-4', className))}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white md:text-base">خلاصه تکنیکال</h3>
        <span className="text-[11px] text-gray-500">به‌روزرسانی لحظه‌ای</span>
      </div>
      <div className="mt-4 space-y-4">
        {signals.map((signal) => {
          const tone = signalToneStyles[signal.stance];
          const detailSegments = signal.detail
            .split('•')
            .map((segment) => segment.trim())
            .filter(Boolean);

          return (
            <article
              key={signal.id}
              className={composeHomeCardClasses(
                tone.tone,
                'sm',
                'flex flex-col gap-3 text-right text-sm text-white transition duration-200 hover:-translate-y-0.5',
              )}
            >
              <header className="flex flex-row-reverse items-start justify-between gap-3">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[12px] text-gray-400">{signal.label}</span>
                  <span className={clsx('text-xl font-extrabold leading-tight', tone.value)}>{signal.value}</span>
                </div>
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                    tone.badge,
                  )}
                >
                  <SignalIcon className="h-4 w-4" />
                  {signalStanceLabels[signal.stance]}
                </span>
              </header>
              <div className="space-y-2 text-[12px] leading-6 text-gray-200">
                {detailSegments.length > 0 ? (
                  detailSegments.map((segment, index) => (
                    <div key={`${signal.id}-detail-${index}`} className="flex flex-row-reverse items-start gap-2">
                      <span className={clsx('mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full', tone.bullet)} />
                      <span className="flex-1 break-words">{segment}</span>
                    </div>
                  ))
                ) : (
                  <span className="block break-words">{signal.detail}</span>
                )}
              </div>
              <footer className="flex items-center justify-between text-[11px] text-gray-400">
                <span className={clsx('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-semibold', tone.chip)}>
                  بازه {signal.timeframe}
                </span>
                <span>ارزیابی ترکیبی</span>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default TechnicalSummaryPanel;
