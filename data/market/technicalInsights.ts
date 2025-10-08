import type { TechnicalSignalInsight } from '@/types';

export const marketTechnicalSummary: TechnicalSignalInsight[] = [
  {
    id: 'moving-average',
    label: 'میانگین‌های متحرک',
    stance: 'bullish',
    value: '۱۲ خرید',
    detail: '۹ سیگنال خرید • ۲ خنثی • ۱ فروش',
    timeframe: 'کوتاه‌مدت',
  },
  {
    id: 'oscillators',
    label: 'اسیلاتورها',
    stance: 'neutral',
    value: '۵ خنثی',
    detail: 'RSI ۵۴ • MACD در آستانه کراس صعودی',
    timeframe: 'میان‌مدت',
  },
  {
    id: 'trend',
    label: 'روند کلی بازار',
    stance: 'bullish',
    value: 'روند صعودی',
    detail: '۲۳ نماد در سقف هفتگی • تنها ۶ نماد در کف',
    timeframe: 'بلندمدت',
  },
];
