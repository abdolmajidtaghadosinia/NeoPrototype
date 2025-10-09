import type { MarketMapSector } from '@/types';

export const marketMapData: MarketMapSector[] = [
  {
    name: 'شاخص‌سازان بورس',
    stocks: [
      { id: 'fars', name: 'فارس', change: 8.65, size: 'xl' },
      { id: 'fameli', name: 'فملی', change: 15.27, size: 'xl' },
      { id: 'foolad', name: 'فولاد', change: 5.02, size: 'lg' },
      { id: 'kegol', name: 'کگل', change: 8.19, size: 'lg' },
      { id: 'kchad', name: 'کچاد', change: 10.03, size: 'lg' },
      { id: 'tapico', name: 'تاپیکو', change: 6.51, size: 'lg' },
      { id: 'shepna', name: 'شپنا', change: 7.08, size: 'lg' },
      { id: 'midco', name: 'میدکو', change: 1.52, size: 'md' },
      { id: 'vghadir', name: 'وغدیر', change: -1.8, size: 'md' },
      { id: 'shbandar', name: 'شبندر', change: -4.16, size: 'md' },
    ],
  },
  {
    name: 'صندوق قابل معامله',
    stocks: [
      { id: 'yaghoot', name: 'یاقوت', change: 33.47, size: 'xl' },
      { id: 'afran', name: 'افران', change: 34.07, size: 'xl' },
      { id: 'firooza', name: 'فیروزا', change: 34.37, size: 'xl' },
      { id: 'kara', name: 'کارا', change: 33.97, size: 'lg' },
      { id: 'mahoor', name: 'ماهور', change: 34.54, size: 'lg' },
      { id: 'orkideh', name: 'ارکیده', change: 34.74, size: 'lg' },
      { id: 'moj', name: 'موج', change: 33.77, size: 'lg' },
      { id: 'kamand', name: 'کمند', change: 2.26, size: 'md' },
      { id: 'kelid', name: 'کلید', change: 5.5, size: 'md' },
      { id: 'parand', name: 'پارند', change: 2.17, size: 'md' },
      { id: 'ahram', name: 'اهرم', change: 8.62, size: 'lg' },
      { id: 'homay', name: 'همای', change: -0.09, size: 'md' },
      { id: 'kian', name: 'کیان', change: 33.81, size: 'lg' },
    ],
  },
  {
    name: 'بانکی',
    stocks: [
      { id: 'webmelat', name: 'وبملت', change: 73.88, size: 'xl' },
      { id: 'tejarat', name: 'وتجارت', change: 21.74, size: 'lg' },
      { id: 'saderat', name: 'وبصادر', change: 13.37, size: 'md' },
    ],
  },
  {
    name: 'فلزات',
    stocks: [
      { id: 'fameli', name: 'فملی', change: 24.97, size: 'lg' },
      { id: 'foolad', name: 'فولاد', change: -16.58, size: 'lg' },
      { id: 'zoob', name: 'ذوب', change: 10.24, size: 'md' },
    ],
  },
  {
    name: 'خودرویی',
    stocks: [
      { id: 'khodro', name: 'خودرو', change: 37.15, size: 'xl' },
      { id: 'khsaipa', name: 'خساپا', change: 35.97, size: 'lg' },
      { id: 'khgostar', name: 'خگستر', change: -3.36, size: 'md' },
    ],
  },
];
