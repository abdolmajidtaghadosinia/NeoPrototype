import {
  MarketAsset,
  PortfolioSlice,
  LeaderboardUser,
  NewsArticle,
  TradingIdea,
  FinancialGoal,
  FollowedActivity,
  MarketMapSector,
  Stock,
  Trade,
  LoanStatus,
  MarketSession,
  TechnicalSignalInsight,
} from '../types';

const generateChartData = (base: number, points: number, volatility: number, timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    const data = [];
    let currentVal = base;
    const now = Date.now();
    let intervalMillis;

    switch (timeframe) {
        case 'daily':
            intervalMillis = 60 * 60 * 1000; // 1 hour
            break;
        case 'weekly':
            intervalMillis = 24 * 60 * 60 * 1000; // 1 day
            break;
        case 'monthly':
            intervalMillis = 24 * 60 * 60 * 1000; // 1 day
            break;
        case 'yearly':
            // Approximate a month as 30.44 days for a yearly view over 12 points
            intervalMillis = 30.44 * 24 * 60 * 60 * 1000; 
            break;
        default:
             intervalMillis = 24 * 60 * 60 * 1000;
    }

    // Go backwards from `now` to calculate the start time
    const startTimestamp = now - (points - 1) * intervalMillis;

    for (let i = 0; i < points; i++) {
        const timestamp = startTimestamp + i * intervalMillis;
        
        if (i > 0) {
            const change = (Math.random() - 0.5) * volatility * currentVal;
            currentVal += change;
        }

        data.push({
            name: String(Math.round(timestamp)),
            value: Math.max(0, currentVal)
        });
    }
    
    return data;
};


export const globalMarketSessions: MarketSession[] = [
  {
    id: 'tse',
    market: 'بورس تهران',
    city: 'تهران',
    timezone: 'IRST',
    status: 'open',
    openTime: '۰۹:۰۰',
    closeTime: '۱۲:۳۰',
    localTime: '۱۱:۱۵',
    note: 'حجم معاملات امروز ۱۸٪ بالاتر از میانگین هفتگی است.',
  },
  {
    id: 'forex-london',
    market: 'فارکس لندن',
    city: 'لندن',
    timezone: 'BST',
    status: 'pre',
    openTime: '۱۰:۳۰',
    closeTime: '۱۹:۳۰',
    localTime: '۰۸:۴۵',
    note: 'پیش‌گشایش با تمرکز بر داده‌های تورمی بریتانیا.',
  },
  {
    id: 'nyse',
    market: 'بورس نیویورک',
    city: 'نیویورک',
    timezone: 'EDT',
    status: 'closed',
    openTime: '۱۷:۰۰',
    closeTime: '۰۰:۳۰',
    localTime: '۰۳:۱۵',
    note: 'بازار بسته است؛ قراردادهای آتی رشد ۰.۳٪ داشته‌اند.',
  },
  {
    id: 'tse-japan',
    market: 'توکیو',
    city: 'توکیو',
    timezone: 'JST',
    status: 'post',
    openTime: '۰۴:۳۰',
    closeTime: '۱۰:۰۰',
    localTime: '۱۹:۱۵',
    note: 'جلسه امروز با افت ۰.۶٪ شاخص نیکی پایان یافت.',
  },
];

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

export const userPortfolioData: PortfolioSlice[] = [
  { name: 'سهام وبملت', value: 15, color: '#A0A0A0', amount: '۱۲۰ سهم', icon: '🏦', dailyChange: -0.2 },
  { name: 'سهام فولاد', value: 18, color: '#6A6A6A', amount: '۹۵۰ سهم', icon: '🏭', dailyChange: 0.85 },
  { name: 'صندوق درآمدثابت کمند', value: 12, color: '#808080', amount: '۵۰ واحد', icon: '📈', dailyChange: 0.09 },
  { name: 'سهام خودرو', value: 12, color: '#4A4A4A', amount: '۵۴۰ سهم', icon: '🚗', dailyChange: 1.5 },
  { name: 'صندوق طلا عیار', value: 30, color: '#1C1C1E', amount: '۲۵ واحد', icon: '💰', dailyChange: 0.8 },
  { name: 'اوراق مشارکت دولتی', value: 13, color: '#2C2C2E', amount: '۲۰۰ ورقه', icon: '📜', dailyChange: 0.12 },
];

const sharedNewsArticles: NewsArticle[] = [
  {
    id: 'user-news-1',
    category: 'بورس',
    title: 'اطلاعیه مجمع عمومی عادی سالیانه بانک ملت (وبملت)',
    summary:
      'بانک ملت اعلام کرد مجمع عمومی عادی سالیانه این بانک جهت تصویب صورت‌های مالی و تقسیم سود در تاریخ ۳۱ تیرماه برگزار خواهد شد.',
    source: 'کدال',
    time: '۲ ساعت پیش',
    imageUrl: 'https://picsum.photos/seed/webmelat-news/400/400',
    content: [
      'هیئت‌مدیره بانک ملت اعلام کرد مجمع عمومی عادی سالیانه در تاریخ ۳۱ تیر با محوریت بررسی صورت‌های مالی و سیاست تقسیم سود برگزار می‌شود. سهامداران می‌توانند به‌صورت حضوری یا برخط در جلسه شرکت کنند.',
      'گزارش عملکرد منتشرشده نشان می‌دهد سود عملیاتی بانک در سال گذشته رشد معناداری داشته است. تحلیلگران انتظار دارند تصویب برنامه سرمایه‌گذاری جدید، نقدشوندگی نماد وبملت را در هفته‌های پیش‌رو افزایش دهد.',
    ],
    relatedAssets: ['webmelat'],
    url: 'https://www.codal.ir/Reports/Decision.aspx?Symbol=%D9%88%D8%A8%D9%85%D9%84%D8%AA',
  },
  {
    id: 'user-news-5',
    category: 'بورس',
    title: 'بورس کالا اعلام کرد عرضه خودروهای داخلی تمدید شد',
    summary:
      'با توجه به استقبال متقاضیان، عرضه خودروهای داخلی در بورس کالا یک روز دیگر تمدید شد تا امکان ثبت سفارش برای خریداران بیشتری فراهم شود.',
    source: 'بورس کالا',
    time: '۴ ساعت پیش',
    imageUrl: 'https://picsum.photos/seed/ime-car/400/400',
    content: [
      'مدیریت عملیات بازار بورس کالا از تمدید عرضه خودروهای داخلی در تالار خودرو خبر داد. متقاضیان می‌توانند با مراجعه به درگاه کارگزاری‌های عضو، سفارش‌های خرید خود را ثبت کنند.',
      'با توجه به اختلاف قیمت بازار آزاد و قیمت پایه اعلام شده، کارشناسان توصیه می‌کنند خریداران هزینه‌های جانبی مانند مالیات و کارمزد را نیز در تصمیم‌گیری خود لحاظ کنند.',
    ],
    relatedAssets: ['khodro'],
    url: 'https://www.ime.co.ir/',
  },
  {
    id: 'user-news-2',
    category: 'بورس',
    title: 'ایران خودرو (خودرو) از برنامه افزایش تولید خود رونمایی کرد',
    summary:
      'مدیرعامل ایران خودرو در نشست خبری اعلام کرد که این شرکت قصد دارد تولید خود را در سه ماهه آینده ۲۰ درصد افزایش دهد.',
    source: 'سنا',
    time: '۸ ساعت پیش',
    imageUrl: 'https://picsum.photos/seed/khodro-news/400/400',
    content: [
      'مدیرعامل ایران‌خودرو اعلام کرد خطوط تولید جدید با تمرکز بر محصولات اقتصادی تا پایان تابستان راه‌اندازی می‌شود. ظرفیت تولید هفتگی پس از این به‌روزرسانی حدود ۲۰ درصد افزایش خواهد یافت.',
      'این خبر در شرایطی منتشر شد که موجودی انبار خودروسازان در حال کاهش است و انتظار می‌رود عرضه متعادل‌تری در بازار ایجاد شود. تحلیلگران معتقدند حاشیه سود خودرو با توجه به رشد قیمت قطعات همچنان تحت فشار باقی می‌ماند.',
    ],
    relatedAssets: ['khodro'],
    url: 'https://www.sena.ir/news/iran-khodro-production-plan',
  },
  {
    id: 'user-news-3',
    category: 'جهان',
    title: 'افزایش قیمت اونس جهانی طلا و تاثیر آن بر صندوق‌های طلا',
    summary:
      'با افزایش تنش‌های ژئوپلیتیکی، قیمت اونس جهانی طلا به بالاترین سطح خود در یک ماه اخیر رسید که می‌تواند منجر به رشد ارزش واحدهای صندوق طلا عیار شود.',
    source: 'بلومبرگ',
    time: 'دیروز',
    imageUrl: 'https://picsum.photos/seed/gold-news/400/400',
    content: [
      'قیمت اونس جهانی طلا پس از افزایش تنش‌های ژئوپلیتیکی به بالاترین سطح یک‌ماهه رسید. جریان سرمایه به صندوق‌های قابل معامله طلا در هفته گذشته بیشترین رشد از ابتدای سال را ثبت کرد.',
      'صندوق‌های طلای داخلی از جمله «عیار» در معاملات امروز با افزایش تقاضای حقیقی مواجه شدند. کارشناسان توصیه می‌کنند سرمایه‌گذاران میزان قرارگیری در دارایی‌های امن را متناسب با ریسک‌پذیری خود بازبینی کنند.',
    ],
    relatedAssets: ['ayar'],
    url: 'https://www.bloomberg.com/markets',
  },
  {
    id: 'user-news-6',
    category: 'بورس',
    title: 'افزایش نرخ بهره بین بانکی و تاثیر آن بر صندوق‌های درآمد ثابت',
    summary:
      'بانک مرکزی اعلام کرد که نرخ بهره بین بانکی با افزایش ۰.۲۵ درصدی به ۲۳.۷۵ درصد رسیده است. این موضوع می‌تواند بازدهی صندوق‌های درآمد ثابت را در آینده نزدیک افزایش دهد.',
    source: 'بانک مرکزی',
    time: 'دیروز',
    imageUrl: 'https://picsum.photos/seed/interest-rate-news/400/400',
    content: [
      'بانک مرکزی نرخ بهره بین‌بانکی را با افزایش ۰.۲۵ واحد درصدی به ۲۳.۷۵ درصد رساند. هدف از این اقدام کنترل تورم و مدیریت رشد نقدینگی در بازار پول عنوان شده است.',
      'افزایش نرخ بهره می‌تواند بازده صندوق‌های درآمد ثابت را در کوتاه‌مدت ارتقا دهد اما هزینه تأمین مالی شرکت‌ها را نیز بالا می‌برد. مدیران صندوق‌ها اعلام کرده‌اند در حال تنظیم مجدد سبد اوراق هستند.',
    ],
    relatedAssets: ['kamand'],
    url: 'https://www.cbi.ir/',
  },
  {
    id: 'user-news-4',
    category: 'بورس',
    title: 'تعیین سقف جدید برای تسعیر ارز شرکت‌های صادراتی',
    summary:
      'سازمان بورس در اطلاعیه‌ای از بازنگری در نحوه تسعیر ارز شرکت‌های صادرات محور خبر داد که می‌تواند بر سودآوری شرکت‌های پتروشیمی و فلزی اثرگذار باشد.',
    source: 'سازمان بورس',
    time: '۳ روز پیش',
    imageUrl: 'https://picsum.photos/seed/export-earnings/400/400',
    content: [
      'سازمان بورس و اوراق بهادار اعلام کرد سقف جدیدی برای نرخ تسعیر ارز درآمدهای صادراتی شرکت‌های بورسی ابلاغ شده است. این تصمیم در راستای همگرایی بیشتر نرخ‌های نیما و بازار آزاد اتخاذ شده است.',
      'کارشناسان معتقدند اجرای این دستورالعمل می‌تواند سود هر سهم شرکت‌های پتروشیمی و معدنی را بهبود دهد. در عین حال بر لزوم شفافیت در اعلام نرخ‌های فروش و تسویه تاکید شده است.',
    ],
    relatedAssets: ['shepna', 'foolad'],
    url: 'https://www.seo.ir/',
  },
  {
    id: 'bourse-1',
    category: 'بورس',
    title: 'شاخص کل بورس در آستانه کانال ۲.۲ میلیون واحدی',
    summary:
      'با افزایش تقاضا در نمادهای بزرگ، شاخص کل توانست رشد قابل توجهی را تجربه کند و به مقاومت مهمی نزدیک شود.',
    source: 'خبرگزاری اقتصاد آنلاین',
    time: '۱ ساعت پیش',
    imageUrl: 'https://picsum.photos/seed/bourse1/400/400',
    content: [
      'شاخص کل بورس تهران در معاملات امروز با رشد پرقدرت نمادهای بزرگ گروه فلزات و خودرویی تا آستانه کانال ۲.۲ میلیون واحدی پیش رفت. ارزش معاملات خرد همچنان بالای میانگین ماهانه قرار دارد.',
      'در صورت تثبیت شاخص در این محدوده، تحلیلگران امکان شکست مقاومت و ورود نقدینگی تازه را محتمل می‌دانند. با این حال، توصیه می‌شود سرمایه‌گذاران وزن صنایع دفاعی را در ترکیب دارایی‌های خود حفظ کنند.',
    ],
    url: 'https://www.eghtesadonline.com/%D8%A8%D8%AE%D8%B4-%D8%A8%D9%88%D8%B1%D8%B3-6/123456-%D8%B4%D8%A7%D8%AE%D8%B5-%DA%A9%D9%84-%D8%A8%D9%88%D8%B1%D8%B3',
  },
  {
    id: 'bourse-2',
    category: 'بورس',
    title: 'عرضه اولیه سهام شرکت پتروشیمی تابان در راه است',
    summary:
      'اطلاعیه عرضه اولیه سهام این شرکت بزرگ پتروشیمی منتشر شد و به زودی شاهد عرضه آن در بازار خواهیم بود.',
    source: 'کدال',
    time: 'دیروز',
    imageUrl: 'https://picsum.photos/seed/bourse2/400/400',
    content: [
      'سازمان بورس تاریخ عرضه اولیه سهام شرکت پتروشیمی تابان را اعلام کرد. قرار است ۱۰ درصد از سهام شرکت با سهمیه ۲۰۰ واحدی برای سرمایه‌گذاران حقیقی عرضه شود.',
      'این شرکت با تمرکز بر تولید متانول و اوره فعالیت می‌کند و ظرفیت صادراتی بالایی دارد. تحلیلگران برآورد می‌کنند نسبت قیمت به درآمد عرضه در محدوده هفت تا هشت واحد باشد.',
    ],
    url: 'https://www.codal.ir/',
  },
  {
    id: 'bourse-3',
    category: 'بورس',
    title: 'گزارش ماهانه صنعت فولاد منتشر شد: افزایش تولید در فولاد مبارکه',
    summary:
      'انجمن تولیدکنندگان فولاد ایران گزارش داد که شرکت فولاد مبارکه (فولاد) در ماه گذشته با افزایش ۵ درصدی تولید، رکورد جدیدی ثبت کرده است.',
    source: 'ایسنا',
    time: '۲ روز پیش',
    imageUrl: 'https://picsum.photos/seed/foolad-news/400/400',
    content: [
      'گزارش ماهانه انجمن تولیدکنندگان فولاد نشان می‌دهد فولاد مبارکه در ماه گذشته رشد تولید پنج درصدی ثبت کرده است. افزایش تقاضای داخلی در پروژه‌های عمرانی عامل اصلی رشد عنوان شده است.',
      'با توجه به رشد عرضه، انتظار می‌رود فشار بر قیمت ورق گرم در بازار داخلی کاهش یابد. شرکت اعلام کرده تمرکز بیشتری بر صادرات محصولات با ارزش افزوده بالا خواهد داشت.',
    ],
    relatedAssets: ['foolad'],
    url: 'https://www.isna.ir/news/14030101010/%D8%B1%D8%B4%D8%AF-%D8%AA%D9%88%D9%84%DB%8C%D8%AF-%D9%81%D9%88%D9%84%D8%A7%D8%AF',
  },
  {
    id: 'bourse-4',
    category: 'بورس',
    title: 'ارزش معاملات خرد به بالاترین سطح ماهانه رسید',
    summary:
      'آمارهای امروز نشان می‌دهد ارزش معاملات خرد بازار سهام با رشد ۲۵ درصدی نسبت به میانگین هفتگی رکورد جدیدی ثبت کرده است.',
    source: 'تحلیل بازار',
    time: '۳ ساعت پیش',
    imageUrl: 'https://picsum.photos/seed/tse-volume/400/400',
    content: [
      'امروز ارزش معاملات خرد بازار به بیش از ۱۰ هزار میلیارد تومان رسید که بالاترین سطح از ابتدای ماه محسوب می‌شود. گروه فلزات اساسی و خودرو بیشترین سهم را در این رشد داشته‌اند.',
      'کارشناسان معتقدند افزایش ورود پول حقیقی و انتشار گزارش‌های فصلی مثبت شرکت‌ها از عوامل اصلی رشد ارزش معاملات است. در عین حال هشدار داده می‌شود که مدیریت ریسک در نمادهای پرنوسان فراموش نشود.',
    ],
    relatedAssets: ['foolad', 'khodro'],
    url: 'https://www.tsetmc.com/',
  },
  {
    id: 'bourse-5',
    category: 'بورس',
    title: 'ابلاغ بسته حمایتی جدید برای افزایش سرمایه شرکت‌های بورسی',
    summary:
      'وزارت اقتصاد بسته‌ای حمایتی شامل تسهیل افزایش سرمایه از محل آورده نقدی و مطالبات را برای شرکت‌های بورسی تصویب کرد.',
    source: 'وزارت اقتصاد',
    time: '۲ روز پیش',
    imageUrl: 'https://picsum.photos/seed/support-package/400/400',
    content: [
      'وزارت امور اقتصادی و دارایی در اطلاعیه‌ای از بسته جدید حمایتی برای شرکت‌های پذیرفته شده در بورس تهران خبر داد. این بسته شامل تسریع در فرآیندهای اداری و اعطای معافیت‌های موقت مالیاتی برای افزایش سرمایه است.',
      'هدف از این بسته تقویت تامین مالی تولید و توسعه پروژه‌های نیمه تمام عنوان شده است. کارشناسان معتقدند اجرای دقیق این سیاست می‌تواند نقدشوندگی سهام شرکت‌های تولیدی را افزایش دهد.',
    ],
    relatedAssets: ['webmelat', 'shepna'],
    url: 'https://www.mefa.gov.ir/',
  },
  {
    id: 'global-1',
    category: 'جهان',
    title: 'نشست فدرال رزرو و تاثیر آن بر بازارهای جهانی',
    summary:
      'سرمایه‌گذاران در سراسر جهان منتظر تصمیم جدید فدرال رزرو برای نرخ بهره هستند که می‌تواند مسیر بازارها را تغییر دهد.',
    source: 'رویترز',
    time: '۵ ساعت پیش',
    imageUrl: 'https://picsum.photos/seed/global1/400/400',
    content: [
      'سرمایه‌گذاران جهانی در انتظار تصمیم جدید فدرال رزرو درباره نرخ بهره هستند. بازارهای سهام آمریکا با احتیاط معامله می‌شوند و بازده اوراق خزانه‌داری در محدوده چهار درصد باقی مانده است.',
      'نتیجه نشست می‌تواند جهت‌گیری سرمایه در دارایی‌های ریسکی را تعیین کند. تحلیلگران تأکید می‌کنند مدیریت ریسک پرتفوی در آستانه اعلام تصمیم ضروری است.',
    ],
    relatedAssets: ['usd'],
    url: 'https://www.reuters.com/markets/us/fed-policy-outlook/',
  },
  {
    id: 'global-2',
    category: 'جهان',
    title: 'کاهش نرخ بیکاری در آمریکا و تقویت دلار جهانی',
    summary:
      'وزارت کار آمریکا اعلام کرد نرخ بیکاری به ۳.۵ درصد کاهش یافته است که این خبر باعث تقویت شاخص دلار در بازارهای جهانی شد.',
    source: 'وال استریت ژورنال',
    time: '۳ روز پیش',
    imageUrl: 'https://picsum.photos/seed/global-usd/400/400',
    content: [
      'وزارت کار آمریکا اعلام کرد نرخ بیکاری به ۳.۵ درصد کاهش یافته است. رشد اشتغال بخش خدمات بالاتر از انتظار بازار بود.',
      'این داده باعث تقویت شاخص دلار شد و ممکن است فشار بیشتری بر ارزهای نوظهور وارد کند. تحلیلگران توصیه می‌کنند شرکت‌ها اثر تغییرات نرخ ارز را بر برنامه‌های پوشش ریسک بررسی کنند.',
    ],
    relatedAssets: ['usd'],
    url: 'https://www.wsj.com/finance/economy/us-unemployment-rate-drops',
  },
];

export const userPortfolioNewsData = sharedNewsArticles;

export const userRecentTrades: Trade[] = [
  {
    id: 't1', type: 'buy',
    asset: { id: 'ayar', name: 'صندوق طلا عیار', icon: '💰' },
    amount: 10, unit: 'واحد', pricePerUnit: 15320, currency: 'ریال',
    timestamp: 'همین الان'
  },
  {
    id: 't2', type: 'sell',
    asset: { id: 'khodro', name: 'سهام خودرو', icon: '🚗' },
    amount: 200, unit: 'سهم', pricePerUnit: 2120, currency: 'ریال',
    timestamp: '۲ ساعت پیش'
  },
  {
    id: 't3', type: 'buy',
    asset: { id: 'foolad', name: 'سهام فولاد', icon: '🏭' },
    amount: 1200, unit: 'سهم', pricePerUnit: 4500, currency: 'ریال',
    timestamp: 'دیروز'
  },
   {
    id: 't4', type: 'sell',
    asset: { id: 'webmelat', name: 'سهام وبملت', icon: '🏦' },
    amount: 100, unit: 'سهم', pricePerUnit: 3210, currency: 'ریال',
    timestamp: '۳ روز پیش'
  },
];

export const publicProfileRecentTrades: Trade[] = [
  {
    id: 'pt1', type: 'buy',
    asset: { id: 'foolad', name: 'سهام فولاد', icon: '🏭' },
    amount: 1000, unit: 'سهم', pricePerUnit: 4500, currency: 'ریال',
    timestamp: '۲ ساعت پیش'
  },
  {
    id: 'pt2', type: 'sell',
    asset: { id: 'shepna', name: 'شپنا', icon: '⛽️' },
    amount: 4000, unit: 'سهم', pricePerUnit: 755, currency: 'ریال',
    timestamp: 'دیروز'
  },
  {
    id: 'pt3', type: 'buy',
    asset: { id: 'ayar', name: 'صندوق طلا عیار', icon: '💰' },
    amount: 20, unit: 'واحد', pricePerUnit: 15300, currency: 'ریال',
    timestamp: '۳ روز پیش'
  },
];


export const leaderboardData: LeaderboardUser[] = [
    {
      id: 1, name: 'زهرا مرادی', profit: 452, rank: 1, followers: 2300, winRate: 78, risk: 'متوسط', picture: 'https://randomuser.me/api/portraits/women/44.jpg',
      rankChange: 'up', weeklyProfitValue: 12500000, favoriteAsset: { id: 'foolad', name: 'فولاد', icon: '🏭' }
    },
    { 
      id: 2, name: 'علی عبدالمالکی', profit: 359, rank: 2, followers: 1800, winRate: 65, risk: 'زیاد', picture: 'https://randomuser.me/api/portraits/men/46.jpg',
      rankChange: 'stable', weeklyProfitValue: 8900000, favoriteAsset: { id: 'khodro', name: 'خودرو', icon: '🚗' }
    },
    { 
      id: 3, name: 'مریم رضایی', profit: 321, rank: 3, followers: 1500, winRate: 85, risk: 'کم', picture: 'https://randomuser.me/api/portraits/women/68.jpg',
      rankChange: 'up', weeklyProfitValue: 7200000, favoriteAsset: { id: 'ayar', name: 'طلا عیار', icon: '💰' }
    },
    { 
      id: 4, name: 'امیرحسین احمدی', profit: 288, rank: 4, followers: 950, winRate: 71, risk: 'متوسط', picture: 'https://randomuser.me/api/portraits/men/66.jpg',
      rankChange: 'down', weeklyProfitValue: 5100000, favoriteAsset: { id: 'ayar', name: 'عیار', icon: '💰' }
    },
    { 
      id: 5, name: 'سارا حسینی', profit: 250, rank: 5, followers: 800, winRate: 68, risk: 'کم', picture: 'https://randomuser.me/api/portraits/women/55.jpg',
      rankChange: 'up', weeklyProfitValue: 4300000, favoriteAsset: { id: 'shepna', name: 'شپنا', icon: '⛽️' }
    }
];

export const followedActivityData: FollowedActivity[] = [
    {
        id: 'act-1',
        user: { id: 2, name: 'علی عبدالمالکی', picture: 'https://randomuser.me/api/portraits/men/46.jpg' },
        type: 'trade_buy',
        asset: { id: 'shepna', name: 'شپنا', icon: '⛽️' },
        timestamp: '۵ دقیقه پیش',
        tradeAmount: 5000,
        tradeUnit: 'سهم',
        tradePrice: 755,
        tradePriceCurrency: 'ریال',
    },
    {
        id: 'act-2',
        user: { id: 1, name: 'زهرا مرادی', picture: 'https://randomuser.me/api/portraits/women/44.jpg' },
        type: 'trade_sell',
        asset: { id: 'shepna', name: 'شپنا', icon: '⛽️' },
        timestamp: '۱۲ دقیقه پیش',
        tradeAmount: 1500,
        tradeUnit: 'سهم',
        tradePrice: 755,
        tradePriceCurrency: 'ریال',
    },
    {
        id: 'act-3',
        user: { id: 4, name: 'امیرحسین احمدی', picture: 'https://randomuser.me/api/portraits/men/66.jpg' },
        type: 'trade_buy',
        asset: { id: 'foolad', name: 'فولاد', icon: '🏭' },
        timestamp: '۳۰ دقیقه پیش',
        tradeAmount: 3000,
        tradeUnit: 'سهم',
        tradePrice: 4500,
        tradePriceCurrency: 'ریال',
    },
    {
        id: 'act-4',
        user: { id: 3, name: 'مریم رضایی', picture: 'https://randomuser.me/api/portraits/women/68.jpg' },
        type: 'trade_buy',
        asset: { id: 'ayar', name: 'صندوق طلا عیار', icon: '💰' },
        timestamp: '۱ ساعت پیش',
        tradeAmount: 100,
        tradeUnit: 'واحد',
        tradePrice: 15320,
        tradePriceCurrency: 'ریال',
    },
    {
        id: 'act-5',
        user: { id: 5, name: 'سارا حسینی', picture: 'https://randomuser.me/api/portraits/women/55.jpg' },
        type: 'trade_sell',
        asset: { id: 'webmelat', name: 'وبملت', icon: '🏦' },
        timestamp: '۳ ساعت پیش',
        tradeAmount: 250,
        tradeUnit: 'سهم',
        tradePrice: 3210,
        tradePriceCurrency: 'ریال',
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

export const financialNewsData = sharedNewsArticles;

export const tradingIdeasData: TradingIdea[] = [
    {
        id: 'idea-1',
        user: { id: 1, name: 'زهرا مرادی', picture: 'https://randomuser.me/api/portraits/women/44.jpg', isPremium: true },
        asset: { id: 'foolad', name: 'فولاد', icon: '🏭' },
        type: 'bullish',
        title: 'فرصت خرید فولاد پس از اصلاح',
        description: 'نمودار فولاد پس از اصلاح کوتاه‌مدت به محدوده حمایتی ۴۳۰۰ ریالی واکنش مثبت نشان داده است. با توجه به رشد صادرات و گزارش تولید قوی، احتمال برگشت به سقف ۴۸۰۰ ریالی وجود دارد.',
        likes: 125,
        comments: 12,
        predictionTimeframe: '۱ ماهه',
        userHasLiked: true,
        commentsData: [
            { id: 'c1-1', user: { name: 'علی عبدالمالکی', picture: 'https://randomuser.me/api/portraits/men/46.jpg' }, text: 'تحلیل خوبیه، منم باهاش موافقم. ورود کردم.', timestamp: '۱ ساعت پیش' },
            { id: 'c1-2', user: { name: 'کاربر مهمان', picture: 'https://randomuser.me/api/portraits/lego/1.jpg' }, text: 'به نظرم هنوز برای ورود زوده، ممکنه بیشتر بریزه.', timestamp: '۴۵ دقیقه پیش' },
        ]
    },
    {
        id: 'idea-2',
        user: { id: 2, name: 'علی عبدالمالکی', picture: 'https://randomuser.me/api/portraits/men/46.jpg' },
        asset: { id: 'khodro', name: 'خودرو', icon: '🚗' },
        type: 'bearish',
        title: 'ریسک افزایش عرضه در نماد خودرو',
        description: 'با توجه به حجم معاملات و اخبار پیش‌رو، احتمال فشار فروش و اصلاح قیمتی در نماد ایران‌خودرو وجود دارد. پیشنهاد می‌کنم فعلا نظاره‌گر باشید یا حد ضرر را فعال کنید.',
        likes: 42,
        comments: 5,
        predictionTimeframe: '۲ هفته',
        userHasLiked: false,
        commentsData: [
           { id: 'c2-1', user: { name: 'مریم رضایی', picture: 'https://randomuser.me/api/portraits/women/68.jpg' }, text: 'دقیقا، حقوقی‌ها دارن خالی می‌کنن.', timestamp: '۲ ساعت پیش' },
        ]
    },
    {
        id: 'idea-3',
        user: { id: 3, name: 'مریم رضایی', picture: 'https://randomuser.me/api/portraits/women/68.jpg', isPremium: true },
        asset: { id: 'ayar', name: 'صندوق طلا عیار', icon: '💰' },
        type: 'bullish',
        title: 'طلا، پناهگاه امن سرمایه‌گذاری',
        description: 'با توجه به نوسانات بازارهای جهانی و ریسک‌های سیستماتیک، صندوق‌های طلا می‌توانند گزینه مناسبی برای حفظ ارزش پول و کسب سود مطمئن در میان‌مدت باشند.',
        likes: 210,
        comments: 25,
        predictionTimeframe: '۳ ماهه',
        userHasLiked: false,
        commentsData: []
    },
    {
        id: 'idea-4',
        user: { id: 4, name: 'امیرحسین احمدی', picture: 'https://randomuser.me/api/portraits/men/66.jpg' },
        asset: { id: 'ayar', name: 'صندوق طلا عیار', icon: '💰' },
        type: 'bullish',
        title: 'پتانسیل رشد صندوق طلا با توجه به نوسانات جهانی',
        description: 'با توجه به افزایش قیمت اونس و رشد تقاضای داخلی برای سکه، صندوق طلا عیار می‌تواند در شش‌ماهه آینده بازدهی جذابی ثبت کند. پیشنهاد می‌شود وزن دارایی‌های امن در سبد حفظ شود.',
        likes: 98,
        comments: 18,
        predictionTimeframe: '۶ ماهه',
        userHasLiked: true,
        commentsData: []
    }
];

export const newOpportunitiesData: Stock[] = [
  { 
    id: 'ipo-aseman', 
    name: 'صندوق اهرمی آسمان', 
    value: '۱۰,۰۰۰', 
    status: 'buy', 
    statusText: 'عرضه اولیه به زودی',
    change: 'جدید',
    chartData: [ { name: 'A', value: 10000 }, { name: 'B', value: 10000 }, { name: 'C', value: 10000 }, { name: 'D', value: 10000 }, { name: 'E', value: 10000 }, { name: 'F', value: 10000 }, { name: 'G', value: 10000 } ] 
  },
  { 
    id: 'social-maroon', 
    name: 'پتروشیمی مارون', 
    value: '۱۴,۵۰۰', 
    status: 'buy', 
    statusText: 'خرید سنگین دنبال‌شوندگان',
    change: '+۳.۵٪',
    chartData: [ { name: 'A', value: 13800 }, { name: 'B', value: 13950 }, { name: 'C', value: 14100 }, { name: 'D', value: 14050 }, { name: 'E', value: 14200 }, { name: 'F', value: 14350 }, { name: 'G', value: 14500 } ] 
  },
];

export const mockUserLoans: LoanStatus[] = [
    {
        id: 'loan1',
        name: 'وام خرید خودرو',
        icon: '🚗',
        totalAmount: 800000000,
        paidAmount: 250000000,
        installmentAmount: 25000000,
        nextPaymentDate: '۱۴۰۴/۰۳/۱۵',
        interestRate: 23,
        remainingInstallments: 22,
    },
    {
        id: 'loan2',
        name: 'وام ضروری',
        icon: '💰',
        totalAmount: 50000000,
        paidAmount: 45000000,
        installmentAmount: 5000000,
        nextPaymentDate: '۱۴۰۴/۰۳/۰۵',
        interestRate: 18,
        remainingInstallments: 1,
    },
];

export const marketMapData: MarketMapSector[] = [
    {
        name: 'صندوق قابل معامله',
        stocks: [
            { name: 'یاقوت', change: 33.47, size: 'xl' },
            { name: 'افران', change: 34.07, size: 'xl' },
            { name: 'فیروزا', change: 34.37, size: 'xl' },
            { name: 'کارا', change: 33.97, size: 'lg' },
            { name: 'ماهور', change: 34.54, size: 'lg' },
            { name: 'ارکیده', change: 34.74, size: 'lg' },
            { name: 'موج', change: 33.77, size: 'lg' },
            { name: 'کمند', change: 2.26, size: 'md' },
            { name: 'کلید', change: 5.50, size: 'md' },
            { name: 'پارند', change: 2.17, size: 'md' },
            { name: 'اهرم', change: 8.62, size: 'lg' },
            { name: 'همای', change: -0.09, size: 'md' },
            { name: 'کیان', change: 33.81, size: 'lg' },
        ],
    },
    {
        name: 'بانکی',
        stocks: [
            { name: 'وبملت', change: 73.88, size: 'xl' },
            { name: 'وتجارت', change: 21.74, size: 'lg' },
            { name: 'وبصادر', change: 13.37, size: 'md' },
        ],
    },
    {
        name: 'فلزات',
        stocks: [
            { name: 'فملی', change: 24.97, size: 'lg' },
            { name: 'فولاد', change: -16.58, size: 'lg' },
            { name: 'ذوب', change: 10.24, size: 'md' },
        ],
    },
    {
        name: 'خودرویی',
        stocks: [
            { name: 'خودرو', change: 37.15, size: 'xl' },
            { name: 'خساپا', change: 35.97, size: 'lg' },
            { name: 'خگستر', change: -3.36, size: 'md' },
        ],
    },
];


const categoryMap: { [key: string]: MarketAsset['category'] } = {
    'stock': 'بورس',
    'fund': 'صندوق‌ها',
    'currency': 'ارزها',
    'commodity': 'کالا',
};

export const staticMarketData: MarketAsset[] = [
    // بورس
    {
        id: 'khodro', name: 'خودرو (ایران خودرو)', icon: '🚗', price: '۲,۱۲۰ ریال',
        aliases: ['خودرو', 'ایران خودرو'],
        description: 'شرکت ایران خودرو، بزرگترین تولیدکننده خودرو در ایران و خاورمیانه است که در سال ۱۳۴۱ تأسیس شد.',
        marketCap: '۲۵۰ هزار میلیارد ریال', volume24h: '۱.۲ هزار میلیارد ریال', circulatingSupply: '۱۲۰ میلیارد سهم',
        performance: {
            daily: { change: 1.5, chartData: generateChartData(2100, 24, 0.02, 'daily') },
            weekly: { change: -0.5, chartData: generateChartData(2150, 7, 0.05, 'weekly') },
            monthly: { change: 3.2, chartData: generateChartData(2000, 30, 0.1, 'monthly') },
            yearly: { change: 15.8, chartData: generateChartData(1800, 12, 0.15, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'shepna', name: 'شپنا (پالایش نفت اصفهان)', icon: '⛽️', price: '۷۵۵ ریال',
        aliases: ['شپنا', 'پالایش نفت اصفهان'],
        description: 'شرکت پالایش نفت اصفهان یکی از بزرگترین پالایشگاه‌های نفت ایران است.',
        marketCap: '۱۸۰ هزار میلیارد ریال', volume24h: '۸۰۰ میلیارد ریال', circulatingSupply: '۲۴۰ میلیارد سهم',
        performance: {
            daily: { change: -0.8, chartData: generateChartData(760, 24, 0.03, 'daily') },
            weekly: { change: 2.1, chartData: generateChartData(740, 7, 0.06, 'weekly') },
            monthly: { change: -1.5, chartData: generateChartData(780, 30, 0.12, 'monthly') },
            yearly: { change: 9.2, chartData: generateChartData(680, 12, 0.18, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'foolad', name: 'فولاد (فولاد مبارکه)', icon: '🏭', price: '۴,۵۰۰ ریال',
        aliases: ['فولاد', 'فولاد مبارکه'],
        description: 'شرکت فولاد مبارکه اصفهان، بزرگترین واحد صنعتی خصوصی در ایران و بزرگترین تولیدکننده فولاد در خاورمیانه و شمال آفریقا است.',
        marketCap: '۴۰۰ هزار میلیارد ریال', volume24h: '۲.۱ هزار میلیارد ریال', circulatingSupply: '۸۹ میلیارد سهم',
        performance: {
            daily: { change: 0.9, chartData: generateChartData(4450, 24, 0.02, 'daily') },
            weekly: { change: 1.8, chartData: generateChartData(4400, 7, 0.04, 'weekly') },
            monthly: { change: 4.5, chartData: generateChartData(4200, 30, 0.08, 'monthly') },
            yearly: { change: 25.0, chartData: generateChartData(3600, 12, 0.12, 'yearly') }
        },
        category: 'بورس'
    },
     {
        id: 'webmelat', name: 'وبملت (بانک ملت)', icon: '🏦', price: '۳,۲۱۰ ریال',
        aliases: ['وبملت', 'بانک ملت'],
        description: 'بانک ملت یکی از بزرگترین بانک‌های خصوصی ایران است که خدمات گسترده بانکی و مالی ارائه می‌دهد.',
        marketCap: '۱۵۰ هزار میلیارد ریال', volume24h: '۷۰۰ میلیارد ریال', circulatingSupply: '۴۶ میلیارد سهم',
        performance: {
            daily: { change: -0.2, chartData: generateChartData(3220, 24, 0.01, 'daily') },
            weekly: { change: 0.9, chartData: generateChartData(3180, 7, 0.03, 'weekly') },
            monthly: { change: -2.1, chartData: generateChartData(3300, 30, 0.05, 'monthly') },
            yearly: { change: 11.5, chartData: generateChartData(2800, 12, 0.08, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'kegol', name: 'کگل (گل‌گهر)', icon: '⛏️', price: '۱۰,۸۰۰ ریال',
        aliases: ['کگل', 'گل گهر'],
        description: 'شرکت معدنی و صنعتی گل‌گهر، یکی از بزرگترین تولیدکنندگان کنسانتره و گندله سنگ آهن در ایران است.',
        marketCap: '۳۰۰ هزار میلیارد ریال', volume24h: '۱.۵ هزار میلیارد ریال', circulatingSupply: '۲۸ میلیارد سهم',
        performance: {
            daily: { change: 2.1, chartData: generateChartData(10700, 24, 0.03, 'daily') },
            weekly: { change: 4.5, chartData: generateChartData(10300, 7, 0.06, 'weekly') },
            monthly: { change: -1.0, chartData: generateChartData(11000, 30, 0.1, 'monthly') },
            yearly: { change: 35.0, chartData: generateChartData(8000, 12, 0.15, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'kchad', name: 'کچاد (چادرملو)', icon: '🏗️', price: '۱۳,۲۰۰ ریال',
        aliases: ['کچاد', 'چادرملو'],
        description: 'شرکت معدنی و صنعتی چادرملو، تولیدکننده محصولات زنجیره فولاد از سنگ آهن تا فولاد.',
        marketCap: '۲۸۰ هزار میلیارد ریال', volume24h: '۱.۴ هزار میلیارد ریال', circulatingSupply: '۲۱ میلیارد سهم',
        performance: {
            daily: { change: 1.8, chartData: generateChartData(13000, 24, 0.025, 'daily') },
            weekly: { change: 3.2, chartData: generateChartData(12800, 7, 0.05, 'weekly') },
            monthly: { change: 0.5, chartData: generateChartData(13100, 30, 0.09, 'monthly') },
            yearly: { change: 30.0, chartData: generateChartData(10100, 12, 0.14, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'shasta', name: 'شستا (سرمایه‌گذاری تامین اجتماعی)', icon: '🏢', price: '۱,۱۰۰ ریال',
        aliases: ['شستا', 'سرمایه‌گذاری تامین اجتماعی'],
        description: 'شرکت سرمایه‌گذاری تأمین اجتماعی، بزرگترین هلدینگ چندرشته‌ای ایران.',
        marketCap: '۱۸۰ هزار میلیارد ریال', volume24h: '۹۰۰ میلیارد ریال', circulatingSupply: '۱۶۳ میلیارد سهم',
        performance: {
            daily: { change: -0.5, chartData: generateChartData(1105, 24, 0.015, 'daily') },
            weekly: { change: 0.8, chartData: generateChartData(1090, 7, 0.04, 'weekly') },
            monthly: { change: -2.5, chartData: generateChartData(1130, 30, 0.07, 'monthly') },
            yearly: { change: 5.0, chartData: generateChartData(1050, 12, 0.1, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'fameli', name: 'فملی (ملی صنایع مس ایران)', icon: '🔩', price: '۶,۳۰۰ ریال',
        description: 'شرکت ملی صنایع مس ایران، تولیدکننده محصولات مسی از معدن تا محصولات نهایی.',
        marketCap: '۳۸۰ هزار میلیارد ریال', volume24h: '۱.۹ هزار میلیارد ریال', circulatingSupply: '۶۰ میلیارد سهم',
        performance: {
            daily: { change: 1.2, chartData: generateChartData(6200, 24, 0.02, 'daily') },
            weekly: { change: 2.8, chartData: generateChartData(6100, 7, 0.05, 'weekly') },
            monthly: { change: 5.0, chartData: generateChartData(6000, 30, 0.08, 'monthly') },
            yearly: { change: 40.0, chartData: generateChartData(4500, 12, 0.13, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'vghadir', name: 'وغدیر (سرمایه‌گذاری غدیر)', icon: '🏛️', price: '۱۳,۵۰۰ ریال',
        description: 'شرکت سرمایه‌گذاری غدیر، فعال در صنایع نفت، گاز، پتروشیمی، سیمان، ساختمان و برق.',
        marketCap: '۲۰۰ هزار میلیارد ریال', volume24h: '۱ هزار میلیارد ریال', circulatingSupply: '۱۵ میلیارد سهم',
        performance: {
            daily: { change: 0.7, chartData: generateChartData(13400, 24, 0.01, 'daily') },
            weekly: { change: 1.5, chartData: generateChartData(13300, 7, 0.03, 'weekly') },
            monthly: { change: -1.0, chartData: generateChartData(13600, 30, 0.06, 'monthly') },
            yearly: { change: 20.0, chartData: generateChartData(11200, 12, 0.1, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'tapico', name: 'تاپیکو (سرمایه‌گذاری نفت و گاز و پتروشیمی تامین)', icon: '⚗️', price: '۹,۸۰۰ ریال',
        description: 'هلدینگ تخصصی در زمینه صنایع نفت، گاز، پتروشیمی، لاستیک و سلولزی.',
        marketCap: '۱۵۰ هزار میلیارد ریال', volume24h: '۸۰۰ میلیارد ریال', circulatingSupply: '۱۵.۳ میلیارد سهم',
        performance: {
            daily: { change: -0.3, chartData: generateChartData(9830, 24, 0.02, 'daily') },
            weekly: { change: 0.5, chartData: generateChartData(9750, 7, 0.04, 'weekly') },
            monthly: { change: 2.0, chartData: generateChartData(9600, 30, 0.07, 'monthly') },
            yearly: { change: 18.0, chartData: generateChartData(8300, 12, 0.11, 'yearly') }
        },
        category: 'بورس'
    },
    // صندوق‌ها
    {
        id: 'ayar', name: 'صندوق طلا عیار', icon: '💰', price: '۱۵,۳۲۰ ریال',
        aliases: ['عیار', 'صندوق طلا', 'طلا عیار'],
        description: 'صندوق سرمایه‌گذاری طلا با پشتوانه سکه طلا که امکان سرمایه‌گذاری در طلا را با مبالغ کم فراهم می‌کند.',
        marketCap: '۲ هزار میلیارد تومان', volume24h: '۵۰ میلیارد تومان', circulatingSupply: '۱.۳ میلیارد واحد',
        performance: {
            daily: { change: 0.8, chartData: generateChartData(15200, 24, 0.01, 'daily') },
            weekly: { change: 1.2, chartData: generateChartData(15100, 7, 0.02, 'weekly') },
            monthly: { change: 2.5, chartData: generateChartData(14900, 30, 0.04, 'monthly') },
            yearly: { change: 22.0, chartData: generateChartData(12500, 12, 0.06, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
     {
        id: 'dara', name: 'صندوق دارایکم', icon: '🏛️', price: '۱۸,۵۰۰ ریال',
        aliases: ['دارایکم', 'دارا یکم'],
        description: 'صندوق واسطه‌گری مالی یکم (ETF) شامل سهام بانک‌ها و بیمه‌های دولتی است که در راستای خصوصی‌سازی عرضه شد.',
        marketCap: '۳.۵ هزار میلیارد تومان', volume24h: '۲۰ میلیارد تومان', circulatingSupply: '۱.۹ میلیارد واحد',
        performance: {
            daily: { change: -0.4, chartData: generateChartData(18580, 24, 0.02, 'daily') },
            weekly: { change: 1.1, chartData: generateChartData(18300, 7, 0.04, 'weekly') },
            monthly: { change: -1.8, chartData: generateChartData(18800, 30, 0.07, 'monthly') },
            yearly: { change: 10.5, chartData: generateChartData(16700, 12, 0.1, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'kamand', name: 'صندوق درآمد ثابت کمند', icon: '🔒', price: '۱,۱۰۰ تومان',
        aliases: ['کمند', 'درآمد ثابت کمند'],
        description: 'صندوق سرمایه‌گذاری با درآمد ثابت که با سرمایه‌گذاری در اوراق بهادار کم‌ریسک، سودی پایدار و بالاتر از سپرده بانکی ایجاد می‌کند.',
        marketCap: '۵ هزار میلیارد تومان', volume24h: '۱۰ میلیارد تومان', circulatingSupply: '۴.۵ میلیارد واحد',
        performance: {
            daily: { change: 0.07, chartData: generateChartData(1100, 24, 0.001, 'daily') },
            weekly: { change: 0.5, chartData: generateChartData(1095, 7, 0.002, 'weekly') },
            monthly: { change: 2.1, chartData: generateChartData(1078, 30, 0.003, 'monthly') },
            yearly: { change: 28.0, chartData: generateChartData(860, 12, 0.004, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'palayesh', name: 'صندوق پالایشی یکم', icon: '⛽', price: '۷,۸۰۰ ریال',
        description: 'دومین صندوق ETF دولتی شامل باقی‌مانده سهام دولت در چهار پالایشگاه تهران، تبریز، اصفهان و بندرعباس.',
        marketCap: '۴ هزار میلیارد تومان', volume24h: '۳۰ میلیارد تومان', circulatingSupply: '۵.۱ میلیارد واحد',
        performance: {
            daily: { change: -1.2, chartData: generateChartData(7890, 24, 0.03, 'daily') },
            weekly: { change: 0.9, chartData: generateChartData(7700, 7, 0.05, 'weekly') },
            monthly: { change: 3.5, chartData: generateChartData(7500, 30, 0.08, 'monthly') },
            yearly: { change: 12.0, chartData: generateChartData(6900, 12, 0.12, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'shetab', name: 'صندوق اهرمی شتاب', icon: '🚀', price: '۱,۵۰۰ تومان',
        description: 'صندوق سرمایه‌گذاری اهرمی که امکان کسب سود دو برابر از رشد بازار را با ریسک بالاتر فراهم می‌کند.',
        marketCap: '۱ هزار میلیارد تومان', volume24h: '۴۰ میلیارد تومان', circulatingSupply: '۶۶۰ میلیون واحد',
        performance: {
            daily: { change: 3.5, chartData: generateChartData(1450, 24, 0.05, 'daily') },
            weekly: { change: -2.0, chartData: generateChartData(1530, 7, 0.1, 'weekly') },
            monthly: { change: 8.0, chartData: generateChartData(1380, 30, 0.15, 'monthly') },
            yearly: { change: 50.0, chartData: generateChartData(1000, 12, 0.2, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'sarv', name: 'صندوق سهامی سرو', icon: '🌲', price: '۲,۳۰۰ تومان',
        description: 'یک صندوق سرمایه‌گذاری سهامی (Active) که به دنبال کسب بازدهی بالاتر از شاخص کل است.',
        marketCap: '۵۰۰ میلیارد تومان', volume24h: '۵ میلیارد تومان', circulatingSupply: '۲۱۷ میلیون واحد',
        performance: {
            daily: { change: 1.1, chartData: generateChartData(2270, 24, 0.03, 'daily') },
            weekly: { change: 2.5, chartData: generateChartData(2240, 7, 0.06, 'weekly') },
            monthly: { change: 0.0, chartData: generateChartData(2300, 30, 0.09, 'monthly') },
            yearly: { change: 30.0, chartData: generateChartData(1770, 12, 0.14, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'zaytoon', name: 'صندوق مختلط زیتون', icon: '🫒', price: '۱,۸۰۰ تومان',
        description: 'صندوق سرمایه‌گذاری مختلط که بخشی از دارایی‌ها را در سهام و بخشی دیگر را در اوراق با درآمد ثابت سرمایه‌گذاری می‌کند.',
        marketCap: '۳۰۰ میلیارد تومان', volume24h: '۲ میلیارد تومان', circulatingSupply: '۱۶۶ میلیون واحد',
        performance: {
            daily: { change: 0.5, chartData: generateChartData(1790, 24, 0.02, 'daily') },
            weekly: { change: 1.0, chartData: generateChartData(1780, 7, 0.04, 'weekly') },
            monthly: { change: -0.5, chartData: generateChartData(1810, 30, 0.06, 'monthly') },
            yearly: { change: 25.0, chartData: generateChartData(1440, 12, 0.08, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'jasoor', name: 'صندوق جسورانه یکم', icon: '💡', price: '۱,۰۰۰ تومان',
        description: 'سرمایه‌گذاری در استارتاپ‌ها و شرکت‌های دانش‌بنیان با پتانسیل رشد بالا و ریسک زیاد.',
        marketCap: '۱۰۰ میلیارد تومان', volume24h: '۱ میلیارد تومان', circulatingSupply: '۱۰۰ میلیون واحد',
        performance: {
            daily: { change: 0.0, chartData: generateChartData(1000, 24, 0.01, 'daily') },
            weekly: { change: 0.0, chartData: generateChartData(1000, 7, 0.02, 'weekly') },
            monthly: { change: 10.0, chartData: generateChartData(900, 30, 0.1, 'monthly') },
            yearly: { change: 80.0, chartData: generateChartData(550, 12, 0.25, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'amlak', name: 'صندوق املاک و مستغلات', icon: '🏘️', price: '۱,۲۰۰ تومان',
        description: 'امکان سرمایه‌گذاری در پروژه‌های ساختمانی و املاک با نقدشوندگی بالا.',
        marketCap: '۴۰۰ میلیارد تومان', volume24h: '۳ میلیارد تومان', circulatingSupply: '۳۳۳ میلیون واحد',
        performance: {
            daily: { change: 0.2, chartData: generateChartData(1198, 24, 0.01, 'daily') },
            weekly: { change: 0.8, chartData: generateChartData(1190, 7, 0.03, 'weekly') },
            monthly: { change: 1.5, chartData: generateChartData(1180, 30, 0.05, 'monthly') },
            yearly: { change: 20.0, chartData: generateChartData(1000, 12, 0.07, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'nikookari', name: 'صندوق نیکوکاری', icon: '❤️', price: '۱,۰۰۰ تومان',
        description: 'سرمایه‌گذاری با اهداف خیرخواهانه که بخشی از سود آن صرف امور نیکوکاری می‌شود.',
        marketCap: '۵۰ میلیارد تومان', volume24h: '۵۰۰ میلیون تومان', circulatingSupply: '۵۰ میلیون واحد',
        performance: {
            daily: { change: 0.05, chartData: generateChartData(1000, 24, 0.001, 'daily') },
            weekly: { change: 0.2, chartData: generateChartData(998, 7, 0.002, 'weekly') },
            monthly: { change: 1.0, chartData: generateChartData(990, 30, 0.003, 'monthly') },
            yearly: { change: 15.0, chartData: generateChartData(870, 12, 0.005, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    // ارزها
    {
        id: 'dollar', name: 'دلار آمریکا', icon: 'https://flagcdn.com/w40/us.png', price: '۵۹,۵۰۰ تومان',
        aliases: ['دلار', 'usd', 'دلار امریکا', 'dollar'],
        description: 'نرخ برابری دلار آمریکا در برابر ریال ایران در بازار آزاد.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0.1, chartData: generateChartData(59400, 24, 0.005, 'daily') },
            weekly: { change: 0.5, chartData: generateChartData(59200, 7, 0.01, 'weekly') },
            monthly: { change: -0.8, chartData: generateChartData(60000, 30, 0.02, 'monthly') },
            yearly: { change: 15.0, chartData: generateChartData(51000, 12, 0.03, 'yearly') }
        },
        category: 'ارزها'
    },
    {
        id: 'euro', name: 'یورو', icon: 'https://flagcdn.com/w40/eu.png', price: '۶۴,۲۰۰ تومان',
        aliases: ['یورو', 'eur'],
        description: 'نرخ برابری یورو، ارز رسمی اتحادیه اروپا، در برابر ریال ایران.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0.2, chartData: generateChartData(64080, 24, 0.006, 'daily') },
            weekly: { change: 0.8, chartData: generateChartData(63700, 7, 0.012, 'weekly') },
            monthly: { change: -1.0, chartData: generateChartData(64800, 30, 0.022, 'monthly') },
            yearly: { change: 16.5, chartData: generateChartData(55100, 12, 0.035, 'yearly') }
        },
        category: 'ارزها'
    },
    {
        id: 'dirham', name: 'درهم امارات', icon: 'https://flagcdn.com/w40/ae.png', price: '۱۶,۲۰۰ تومان',
        aliases: ['درهم', 'aed'],
        description: 'نرخ برابری درهم امارات متحده عربی در برابر ریال ایران.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0, chartData: generateChartData(16200, 24, 0.004, 'daily') },
            weekly: { change: 0.3, chartData: generateChartData(16150, 7, 0.01, 'weekly') },
            monthly: { change: -0.5, chartData: generateChartData(16280, 30, 0.018, 'monthly') },
            yearly: { change: 14.8, chartData: generateChartData(14100, 12, 0.028, 'yearly') }
        },
        category: 'ارزها'
    },
    {
        id: 'pound', name: 'پوند انگلیس', icon: 'https://flagcdn.com/w40/gb.png', price: '۷۵,۰۰۰ تومان',
        aliases: ['پوند', 'gbp', 'پوند استرلینگ'],
        description: 'نرخ برابری پوند استرلینگ بریتانیا در برابر ریال ایران.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0.3, chartData: generateChartData(74775, 24, 0.007, 'daily') },
            weekly: { change: 1.2, chartData: generateChartData(74100, 7, 0.015, 'weekly') },
            monthly: { change: -0.7, chartData: generateChartData(75500, 30, 0.025, 'monthly') },
            yearly: { change: 17.0, chartData: generateChartData(64100, 12, 0.04, 'yearly') }
        },
        category: 'ارزها'
    },
    {
        id: 'try', name: 'لیر ترکیه', icon: 'https://flagcdn.com/w40/tr.png', price: '۱,۸۵۰ تومان',
        aliases: ['لیر', 'try', 'لیر ترکیه'],
        description: 'نرخ برابری لیر ترکیه در برابر ریال ایران.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: -0.5, chartData: generateChartData(1860, 24, 0.01, 'daily') },
            weekly: { change: -1.0, chartData: generateChartData(1870, 7, 0.02, 'weekly') },
            monthly: { change: 2.0, chartData: generateChartData(1810, 30, 0.04, 'monthly') },
            yearly: { change: -5.0, chartData: generateChartData(1950, 12, 0.06, 'yearly') }
        },
        category: 'ارزها'
    },
    {
        id: 'cny', name: 'یوان چین', icon: 'https://flagcdn.com/w40/cn.png', price: '۸,۲۰۰ تومان',
        aliases: ['یوان', 'cny', 'رنمینبی'],
        description: 'نرخ برابری یوان چین در برابر ریال ایران.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0.1, chartData: generateChartData(8190, 24, 0.003, 'daily') },
            weekly: { change: 0.4, chartData: generateChartData(8160, 7, 0.008, 'weekly') },
            monthly: { change: 0.0, chartData: generateChartData(8200, 30, 0.015, 'monthly') },
            yearly: { change: 12.0, chartData: generateChartData(7320, 12, 0.025, 'yearly') }
        },
        category: 'ارزها'
    },
    {
        id: 'jpy', name: 'ین ژاپن', icon: 'https://flagcdn.com/w40/jp.png', price: '۳۸۰ تومان',
        aliases: ['ین', 'jpy'],
        description: 'نرخ برابری ین ژاپن در برابر ریال ایران.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0.5, chartData: generateChartData(378, 24, 0.008, 'daily') },
            weekly: { change: 1.5, chartData: generateChartData(374, 7, 0.015, 'weekly') },
            monthly: { change: -2.0, chartData: generateChartData(388, 30, 0.03, 'monthly') },
            yearly: { change: 8.0, chartData: generateChartData(352, 12, 0.05, 'yearly') }
        },
        category: 'ارزها'
    },
    {
        id: 'chf', name: 'فرانک سوئیس', icon: 'https://flagcdn.com/w40/ch.png', price: '۶۶,۰۰۰ تومان',
        aliases: ['فرانک', 'chf'],
        description: 'نرخ برابری فرانک سوئیس در برابر ریال ایران.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0.3, chartData: generateChartData(65800, 24, 0.005, 'daily') },
            weekly: { change: 0.9, chartData: generateChartData(65400, 7, 0.01, 'weekly') },
            monthly: { change: 0.5, chartData: generateChartData(65700, 30, 0.02, 'monthly') },
            yearly: { change: 18.0, chartData: generateChartData(55900, 12, 0.04, 'yearly') }
        },
        category: 'ارزها'
    },
    {
        id: 'cad', name: 'دلار کانادا', icon: 'https://flagcdn.com/w40/ca.png', price: '۴۳,۵۰۰ تومان',
        aliases: ['دلار کانادا', 'cad'],
        description: 'نرخ برابری دلار کانادا در برابر ریال ایران.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0.2, chartData: generateChartData(43400, 24, 0.006, 'daily') },
            weekly: { change: 0.6, chartData: generateChartData(43250, 7, 0.012, 'weekly') },
            monthly: { change: -0.4, chartData: generateChartData(43700, 30, 0.022, 'monthly') },
            yearly: { change: 14.0, chartData: generateChartData(38100, 12, 0.035, 'yearly') }
        },
        category: 'ارزها'
    },
    {
        id: 'aud', name: 'دلار استرالیا', icon: 'https://flagcdn.com/w40/au.png', price: '۳۹,۸۰۰ تومان',
        aliases: ['دلار استرالیا', 'aud'],
        description: 'نرخ برابری دلار استرالیا در برابر ریال ایران.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0.4, chartData: generateChartData(39640, 24, 0.007, 'daily') },
            weekly: { change: 1.0, chartData: generateChartData(39400, 7, 0.014, 'weekly') },
            monthly: { change: -0.8, chartData: generateChartData(40100, 30, 0.024, 'monthly') },
            yearly: { change: 16.0, chartData: generateChartData(34300, 12, 0.038, 'yearly') }
        },
        category: 'ارزها'
    },
    // کالا
    { 
        id: 'saffron', name: 'زعفران نگین', icon: '🌺', price: '۱۲۰,۰۰۰ تومان/گرم', 
        description: 'زعفران نگین به عنوان با کیفیت‌ترین نوع زعفران شناخته می‌شود و در بورس کالای ایران معامله می‌شود.',
        marketCap: 'نامشخص', volume24h: '۱۵ میلیارد تومان', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 2.3, chartData: generateChartData(117000, 24, 0.03, 'daily') },
            weekly: { change: 5.1, chartData: generateChartData(114000, 7, 0.05, 'weekly') },
            monthly: { change: -1.2, chartData: generateChartData(121500, 30, 0.08, 'monthly') },
            yearly: { change: 45.0, chartData: generateChartData(82000, 12, 0.1, 'yearly') }
        },
        category: 'کالا'
    },
    { 
        id: 'pistachio', name: 'پسته فندقی', icon: '🌰', price: '۸۵۰,۰۰۰ تومان/کیلو', 
        description: 'پسته فندقی یکی از ارقام اصلی پسته صادراتی ایران است که در بورس کالا عرضه می‌شود.',
        marketCap: 'نامشخص', volume24h: '۵ میلیارد تومان', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: -0.8, chartData: generateChartData(857000, 24, 0.02, 'daily') },
            weekly: { change: 1.5, chartData: generateChartData(837000, 7, 0.04, 'weekly') },
            monthly: { change: 4.2, chartData: generateChartData(815000, 30, 0.06, 'monthly') },
            yearly: { change: 22.0, chartData: generateChartData(695000, 12, 0.08, 'yearly') }
        },
        category: 'کالا'
    },
    {
        id: 'brent_oil', name: 'نفت برنت', icon: '🛢️', price: '$۸۵/بشکه',
        description: 'نفت خام برنت یکی از مهم‌ترین مراجع قیمت‌گذاری نفت خام در جهان است.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 1.2, chartData: generateChartData(84, 24, 0.02, 'daily') },
            weekly: { change: -2.5, chartData: generateChartData(87, 7, 0.05, 'weekly') },
            monthly: { change: 5.0, chartData: generateChartData(81, 30, 0.08, 'monthly') },
            yearly: { change: 10.0, chartData: generateChartData(77, 12, 0.1, 'yearly') }
        },
        category: 'کالا'
    },
    {
        id: 'copper', name: 'مس', icon: '⛓️', price: '$۹,۸۰۰/تن',
        description: 'قیمت جهانی مس به عنوان یکی از مهم‌ترین فلزات صنعتی.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0.9, chartData: generateChartData(9700, 24, 0.03, 'daily') },
            weekly: { change: 3.1, chartData: generateChartData(9500, 7, 0.06, 'weekly') },
            monthly: { change: -1.5, chartData: generateChartData(9950, 30, 0.09, 'monthly') },
            yearly: { change: 25.0, chartData: generateChartData(7840, 12, 0.12, 'yearly') }
        },
        category: 'کالا'
    },
    {
        id: 'silver', name: 'نقره', icon: '🥈', price: '$۲۹.۵/انس',
        description: 'قیمت جهانی نقره به عنوان یک فلز گرانبها و صنعتی.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 2.1, chartData: generateChartData(29, 24, 0.04, 'daily') },
            weekly: { change: -1.0, chartData: generateChartData(30, 7, 0.07, 'weekly') },
            monthly: { change: 6.0, chartData: generateChartData(28, 30, 0.1, 'monthly') },
            yearly: { change: 30.0, chartData: generateChartData(22.7, 12, 0.15, 'yearly') }
        },
        category: 'کالا'
    },
    {
        id: 'aluminum', name: 'آلومینیوم', icon: '📄', price: '$۲,۵۰۰/تن',
        description: 'قیمت جهانی آلومینیوم، فلز سبک و پرکاربرد در صنایع مختلف.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: -0.5, chartData: generateChartData(2510, 24, 0.02, 'daily') },
            weekly: { change: 1.8, chartData: generateChartData(2460, 7, 0.04, 'weekly') },
            monthly: { change: 3.2, chartData: generateChartData(2420, 30, 0.06, 'monthly') },
            yearly: { change: 15.0, chartData: generateChartData(2170, 12, 0.08, 'yearly') }
        },
        category: 'کالا'
    },
    {
        id: 'emami_coin', name: 'سکه امامی', icon: '🪙', price: '۴۱,۵۰۰,۰۰۰ تومان',
        description: 'سکه تمام بهار آزادی طرح جدید، یکی از رایج‌ترین ابزارهای سرمایه‌گذاری در ایران.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 1.0, chartData: generateChartData(41100000, 24, 0.01, 'daily') },
            weekly: { change: 2.5, chartData: generateChartData(40500000, 7, 0.02, 'weekly') },
            monthly: { change: -0.8, chartData: generateChartData(41800000, 30, 0.04, 'monthly') },
            yearly: { change: 40.0, chartData: generateChartData(29600000, 12, 0.06, 'yearly') }
        },
        category: 'کالا'
    },
    {
        id: 'azadi_coin', name: 'سکه بهار آزادی', icon: '🪙', price: '۳۸,۰۰۰,۰۰۰ تومان',
        description: 'سکه تمام بهار آزادی طرح قدیم.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 0.9, chartData: generateChartData(37600000, 24, 0.01, 'daily') },
            weekly: { change: 2.2, chartData: generateChartData(37100000, 7, 0.02, 'weekly') },
            monthly: { change: -1.0, chartData: generateChartData(38400000, 30, 0.04, 'monthly') },
            yearly: { change: 38.0, chartData: generateChartData(27500000, 12, 0.06, 'yearly') }
        },
        category: 'کالا'
    },
    {
        id: 'half_coin', name: 'نیم سکه', icon: '🪙', price: '۲۳,۰۰۰,۰۰۰ تومان',
        description: 'نیم سکه بهار آزادی.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 1.1, chartData: generateChartData(22700000, 24, 0.015, 'daily') },
            weekly: { change: 3.0, chartData: generateChartData(22300000, 7, 0.03, 'weekly') },
            monthly: { change: 0.0, chartData: generateChartData(23000000, 30, 0.05, 'monthly') },
            yearly: { change: 42.0, chartData: generateChartData(16200000, 12, 0.07, 'yearly') }
        },
        category: 'کالا'
    },
    {
        id: 'quarter_coin', name: 'ربع سکه', icon: '🪙', price: '۱۵,۰۰۰,۰۰۰ تومان',
        description: 'ربع سکه بهار آزادی.',
        marketCap: 'نامشخص', volume24h: 'نامشخص', circulatingSupply: 'نامشخص',
        performance: {
            daily: { change: 1.3, chartData: generateChartData(14800000, 24, 0.02, 'daily') },
            weekly: { change: 3.5, chartData: generateChartData(14500000, 7, 0.04, 'weekly') },
            monthly: { change: 0.5, chartData: generateChartData(14900000, 30, 0.06, 'monthly') },
            yearly: { change: 45.0, chartData: generateChartData(10300000, 12, 0.08, 'yearly') }
        },
        category: 'کالا'
    },
];