import type { PortfolioSlice } from '@/types';

export const userPortfolioData: PortfolioSlice[] = [
  { name: 'سهام وبملت', value: 15, color: '#A0A0A0', amount: '۱۲۰ سهم', icon: '🏦', dailyChange: -0.2 },
  { name: 'سهام فولاد', value: 18, color: '#6A6A6A', amount: '۹۵۰ سهم', icon: '🏭', dailyChange: 0.85 },
  { name: 'صندوق درآمدثابت کمند', value: 12, color: '#808080', amount: '۵۰ واحد', icon: '📈', dailyChange: 0.09 },
  { name: 'سهام خودرو', value: 12, color: '#4A4A4A', amount: '۵۴۰ سهم', icon: '🚗', dailyChange: 1.5 },
  { name: 'صندوق طلا عیار', value: 30, color: '#1C1C1E', amount: '۲۵ واحد', icon: '💰', dailyChange: 0.8 },
  { name: 'اوراق مشارکت دولتی', value: 13, color: '#2C2C2E', amount: '۲۰۰ ورقه', icon: '📜', dailyChange: 0.12 },
];
