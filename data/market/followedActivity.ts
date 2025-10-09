import type { FollowedActivity } from '@/types';

export const followedActivityData: FollowedActivity[] = [
  {
    id: 'act-1',
    user: { id: 2, name: 'علی عبدالمالکی', picture: 'https://randomuser.me/api/portraits/men/46.jpg' },
    type: 'trade_buy',
    asset: { id: 'shepna', name: 'شپنا', icon: '⛽️' },
    timestamp: '۵ دقیقه پیش',
    details: '۲۵۰۰ سهم شپنا در قیمت ۷۶۰ ریال خریداری شد.',
  },
  {
    id: 'act-2',
    user: { id: 1, name: 'زهرا مرادی', picture: 'https://randomuser.me/api/portraits/women/44.jpg', isPremium: true },
    type: 'trade_sell',
    asset: { id: 'foolad', name: 'فولاد', icon: '🏭' },
    timestamp: '۱۰ دقیقه پیش',
    details: '۱۲۰۰ سهم فولاد در قیمت ۴,۵۱۰ ریال فروخته شد.',
  },
  {
    id: 'act-3',
    user: { id: 5, name: 'سارا حسینی', picture: 'https://randomuser.me/api/portraits/women/55.jpg' },
    type: 'new_follower',
    asset: { id: 'foolad', name: 'فولاد', icon: '🏭' },
    timestamp: '۱۵ دقیقه پیش',
    details: 'سارا حسینی شما را دنبال کرد.',
  },
  {
    id: 'act-4',
    user: { id: 4, name: 'امیرحسین احمدی', picture: 'https://randomuser.me/api/portraits/men/66.jpg' },
    type: 'trade_buy',
    asset: { id: 'ayar', name: 'صندوق طلا عیار', icon: '💰' },
    timestamp: '۲۰ دقیقه پیش',
    details: '۴۰ واحد صندوق طلا عیار در قیمت ۱۵,۳۰۰ ریال خریداری شد.',
  },
  {
    id: 'act-5',
    user: { id: 6, name: 'کاربر حرفه‌ای', picture: 'https://randomuser.me/api/portraits/lego/2.jpg' },
    type: 'trade_sell',
    asset: { id: 'khodro', name: 'خودرو', icon: '🚗' },
    timestamp: '۳۵ دقیقه پیش',
    details: '۳۰۰ سهم خودرو در قیمت ۲,۱۰۰ ریال فروخته شد.',
  },
  {
    id: 'act-6',
    user: { id: 3, name: 'مریم رضایی', picture: 'https://randomuser.me/api/portraits/women/68.jpg' },
    type: 'new_idea',
    asset: { id: 'khodro', name: 'خودرو', icon: '🚗' },
    timestamp: 'دیروز',
    details: 'تحلیل تازه‌ای درباره محدوده حمایتی ۲,۰۰۰ ریالی منتشر کرد.',
  },
];
