import type { TradingIdea } from '@/types';

export const tradingIdeasData: TradingIdea[] = [
  {
    id: 'idea-1',
    user: { id: 1, name: 'زهرا مرادی', picture: 'https://randomuser.me/api/portraits/women/44.jpg', isPremium: true },
    asset: { id: 'foolad', name: 'فولاد', icon: '🏭' },
    type: 'bullish',
    title: 'فرصت خرید فولاد پس از اصلاح',
    description:
      'نمودار فولاد پس از اصلاح کوتاه‌مدت به محدوده حمایتی ۴۳۰۰ ریالی واکنش مثبت نشان داده است. با توجه به رشد صادرات و گزارش تولید قوی، احتمال برگشت به سقف ۴۸۰۰ ریالی وجود دارد.',
    likes: 125,
    comments: 12,
    predictionTimeframe: '۱ ماهه',
    userHasLiked: true,
    commentsData: [
      {
        id: 'c1-1',
        user: { name: 'علی عبدالمالکی', picture: 'https://randomuser.me/api/portraits/men/46.jpg' },
        text: 'تحلیل خوبیه، منم باهاش موافقم. ورود کردم.',
        timestamp: '۱ ساعت پیش',
      },
      {
        id: 'c1-2',
        user: { name: 'کاربر مهمان', picture: 'https://randomuser.me/api/portraits/lego/1.jpg' },
        text: 'به نظرم هنوز برای ورود زوده، ممکنه بیشتر بریزه.',
        timestamp: '۴۵ دقیقه پیش',
      },
    ],
  },
  {
    id: 'idea-2',
    user: { id: 2, name: 'علی عبدالمالکی', picture: 'https://randomuser.me/api/portraits/men/46.jpg' },
    asset: { id: 'khodro', name: 'خودرو', icon: '🚗' },
    type: 'bearish',
    title: 'ریسک افزایش عرضه در نماد خودرو',
    description:
      'با توجه به حجم معاملات و اخبار پیش‌رو، احتمال فشار فروش و اصلاح قیمتی در نماد ایران‌خودرو وجود دارد. پیشنهاد می‌کنم فعلا نظاره‌گر باشید یا حد ضرر را فعال کنید.',
    likes: 42,
    comments: 5,
    predictionTimeframe: '۲ هفته',
    userHasLiked: false,
    commentsData: [
      {
        id: 'c2-1',
        user: { name: 'مریم رضایی', picture: 'https://randomuser.me/api/portraits/women/68.jpg' },
        text: 'دقیقا، حقوقی‌ها دارن خالی می‌کنن.',
        timestamp: '۲ ساعت پیش',
      },
    ],
  },
  {
    id: 'idea-3',
    user: { id: 3, name: 'مریم رضایی', picture: 'https://randomuser.me/api/portraits/women/68.jpg', isPremium: true },
    asset: { id: 'ayar', name: 'صندوق طلا عیار', icon: '💰' },
    type: 'bullish',
    title: 'طلا، پناهگاه امن سرمایه‌گذاری',
    description:
      'با توجه به نوسانات بازارهای جهانی و ریسک‌های سیستماتیک، صندوق‌های طلا می‌توانند گزینه مناسبی برای حفظ ارزش پول و کسب سود مطمئن در میان‌مدت باشند.',
    likes: 210,
    comments: 25,
    predictionTimeframe: '۳ ماهه',
    userHasLiked: false,
    commentsData: [],
  },
  {
    id: 'idea-4',
    user: { id: 4, name: 'امیرحسین احمدی', picture: 'https://randomuser.me/api/portraits/men/66.jpg' },
    asset: { id: 'ayar', name: 'صندوق طلا عیار', icon: '💰' },
    type: 'bullish',
    title: 'پتانسیل رشد صندوق طلا با توجه به نوسانات جهانی',
    description:
      'با توجه به افزایش قیمت اونس و رشد تقاضای داخلی برای سکه، صندوق طلا عیار می‌تواند در شش‌ماهه آینده بازدهی جذابی ثبت کند. پیشنهاد می‌شود وزن دارایی‌های امن در سبد حفظ شود.',
    likes: 98,
    comments: 18,
    predictionTimeframe: '۶ ماهه',
    userHasLiked: true,
    commentsData: [],
  },
];
