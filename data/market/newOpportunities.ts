import type { Stock } from '@/types';

export const newOpportunitiesData: Stock[] = [
  {
    id: 'ipo-aseman',
    name: 'صندوق اهرمی آسمان',
    value: '۱۰,۰۰۰',
    status: 'buy',
    statusText: 'عرضه اولیه به زودی',
    change: 'جدید',
    chartData: [
      { name: 'A', value: 10000 },
      { name: 'B', value: 10000 },
      { name: 'C', value: 10000 },
      { name: 'D', value: 10000 },
      { name: 'E', value: 10000 },
      { name: 'F', value: 10000 },
      { name: 'G', value: 10000 },
    ],
  },
  {
    id: 'social-maroon',
    name: 'پتروشیمی مارون',
    value: '۱۴,۵۰۰',
    status: 'buy',
    statusText: 'خرید سنگین دنبال‌شوندگان',
    change: '+۳.۵٪',
    chartData: [
      { name: 'A', value: 13800 },
      { name: 'B', value: 13950 },
      { name: 'C', value: 14100 },
      { name: 'D', value: 14050 },
      { name: 'E', value: 14200 },
      { name: 'F', value: 14350 },
      { name: 'G', value: 14500 },
    ],
  },
];
