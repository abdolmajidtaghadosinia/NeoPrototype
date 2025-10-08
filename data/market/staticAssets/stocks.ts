import type { MarketAsset } from '@/types';
import { generateChartData } from '../utils';

export const stockAssets: MarketAsset[] = [
    {
        id: 'fars',
        name: 'فارس (صنایع پتروشیمی خلیج فارس)',
        icon: '🛢️',
        price: '۸٬۴۲۰ ریال',
        aliases: ['فارس', 'صنایع پتروشیمی خلیج فارس'],
        description: 'هلدینگ صنایع پتروشیمی خلیج فارس بزرگ‌ترین مجموعه پتروشیمی کشور است و تأمین‌کننده اصلی خوراک زنجیره پلیمرها و مواد شیمیایی به شمار می‌رود.',
        marketCap: '۷۲۰ هزار میلیارد ریال',
        volume24h: '۳٬۴۵۰ میلیارد ریال',
        circulatingSupply: '۸۵ میلیارد سهم',
        performance: {
            daily: { change: 8.65, chartData: generateChartData(8420, 24, 0.025, 'daily') },
            weekly: { change: 10.07, chartData: generateChartData(7650, 7, 0.04, 'weekly') },
            monthly: { change: 21.33, chartData: generateChartData(6940, 30, 0.055, 'monthly') },
            yearly: { change: 36.31, chartData: generateChartData(6175, 12, 0.07, 'yearly') }
        },
        category: 'بورس'
    },
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
        id: 'shepna',
        name: 'شپنا (پالایش نفت اصفهان)',
        icon: '⛽️',
        price: '۴٬۴۶۱ ریال',
        aliases: ['شپنا', 'پالایش نفت اصفهان'],
        description: 'شرکت پالایش نفت اصفهان یکی از بزرگترین پالایشگاه‌های نفت ایران است و نقش کلیدی در تأمین فرآورده‌های سوختی کشور دارد.',
        marketCap: '۲۴۰ هزار میلیارد ریال',
        volume24h: '۱٬۱۵۰ میلیارد ریال',
        circulatingSupply: '۲۴۰ میلیارد سهم',
        performance: {
            daily: { change: 7.08, chartData: generateChartData(4461, 24, 0.025, 'daily') },
            weekly: { change: 6.44, chartData: generateChartData(4191, 7, 0.04, 'weekly') },
            monthly: { change: 30.74, chartData: generateChartData(3412, 30, 0.065, 'monthly') },
            yearly: { change: 51.77, chartData: generateChartData(2940, 12, 0.08, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'foolad',
        name: 'فولاد (فولاد مبارکه اصفهان)',
        icon: '🏭',
        price: '۲٬۶۷۷ ریال',
        aliases: ['فولاد', 'فولاد مبارکه'],
        description: 'شرکت فولاد مبارکه اصفهان بزرگترین تولیدکننده فولاد تخت در خاورمیانه است و نقش اصلی در زنجیره تأمین فولاد کشور دارد.',
        marketCap: '۵۸۰ هزار میلیارد ریال',
        volume24h: '۲٬۱۰۰ میلیارد ریال',
        circulatingSupply: '۱۰۰ میلیارد سهم',
        performance: {
            daily: { change: 5.02, chartData: generateChartData(2677, 24, 0.02, 'daily') },
            weekly: { change: 11.17, chartData: generateChartData(2408, 7, 0.035, 'weekly') },
            monthly: { change: 13.14, chartData: generateChartData(2366, 30, 0.05, 'monthly') },
            yearly: { change: 51.18, chartData: generateChartData(1770, 12, 0.08, 'yearly') }
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
        id: 'kegol',
        name: 'کگل (معدنی و صنعتی گل‌گهر)',
        icon: '⛏️',
        price: '۱٬۹۹۵ ریال',
        aliases: ['کگل', 'گل‌گهر'],
        description: 'شرکت معدنی و صنعتی گل‌گهر از مهم‌ترین تولیدکنندگان کنسانتره و گندله سنگ آهن کشور است و زنجیره فولاد را تغذیه می‌کند.',
        marketCap: '۲۹۰ هزار میلیارد ریال',
        volume24h: '۹۸۰ میلیارد ریال',
        circulatingSupply: '۲۰ میلیارد سهم',
        performance: {
            daily: { change: 8.19, chartData: generateChartData(1995, 24, 0.03, 'daily') },
            weekly: { change: 13.35, chartData: generateChartData(1760, 7, 0.045, 'weekly') },
            monthly: { change: 15.12, chartData: generateChartData(1733, 30, 0.05, 'monthly') },
            yearly: { change: 7.7, chartData: generateChartData(1850, 12, 0.035, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'kchad',
        name: 'کچاد (معدنی و صنعتی چادرملو)',
        icon: '🏗️',
        price: '۲٬۲۲۷ ریال',
        aliases: ['کچاد', 'چادرملو'],
        description: 'شرکت معدنی و صنعتی چادرملو از بزرگ‌ترین معادن سنگ آهن ایران است و زنجیره تولید فولاد کشور را تغذیه می‌کند.',
        marketCap: '۳۲۰ هزار میلیارد ریال',
        volume24h: '۱٬۱۰۵ میلیارد ریال',
        circulatingSupply: '۱۸ میلیارد سهم',
        performance: {
            daily: { change: 10.03, chartData: generateChartData(2227, 24, 0.03, 'daily') },
            weekly: { change: 13.91, chartData: generateChartData(1955, 7, 0.045, 'weekly') },
            monthly: { change: 15.81, chartData: generateChartData(1923, 30, 0.05, 'monthly') },
            yearly: { change: 23.83, chartData: generateChartData(1800, 12, 0.06, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'midco',
        name: 'میدکو (توسعه معادن و صنایع معدنی خاورمیانه)',
        icon: '🪨',
        price: '۳٬۸۱۰ ریال',
        aliases: ['میدکو', 'توسعه معادن خاورمیانه'],
        description: 'شرکت میدکو هلدینگی معدنی-فلزی است که از استخراج مواد خام تا تولید محصولات فولادی و مسی زنجیره ارزش را مدیریت می‌کند.',
        marketCap: '۲۶۰ هزار میلیارد ریال',
        volume24h: '۷۵۰ میلیارد ریال',
        circulatingSupply: '۲۱ میلیارد سهم',
        performance: {
            daily: { change: 1.52, chartData: generateChartData(3810, 24, 0.015, 'daily') },
            weekly: { change: 1.6, chartData: generateChartData(3750, 7, 0.02, 'weekly') },
            monthly: { change: -0.68, chartData: generateChartData(3836, 30, 0.03, 'monthly') },
            yearly: { change: 21.19, chartData: generateChartData(3140, 12, 0.05, 'yearly') }
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
        id: 'fameli',
        name: 'فملی (ملی صنایع مس ایران)',
        icon: '🔩',
        price: '۷٬۷۰۰ ریال',
        aliases: ['فملی', 'ملی مس ایران'],
        description: 'شرکت ملی صنایع مس ایران از استخراج تا فرآوری محصولات مسی را در اختیار دارد و یکی از بزرگ‌ترین صادركنندگان فلزات اساسی کشور است.',
        marketCap: '۶۲۰ هزار میلیارد ریال',
        volume24h: '۲٬۴۵۰ میلیارد ریال',
        circulatingSupply: '۷۵ میلیارد سهم',
        performance: {
            daily: { change: 15.27, chartData: generateChartData(7700, 24, 0.03, 'daily') },
            weekly: { change: 14.58, chartData: generateChartData(6720, 7, 0.045, 'weekly') },
            monthly: { change: 31.18, chartData: generateChartData(5870, 30, 0.055, 'monthly') },
            yearly: { change: 48.09, chartData: generateChartData(5200, 12, 0.08, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'vghadir',
        name: 'وغدیر (سرمایه‌گذاری غدیر)',
        icon: '🏛️',
        price: '۹٬۸۴۰ ریال',
        aliases: ['وغدیر', 'سرمایه‌گذاری غدیر'],
        description: 'هلدینگ سرمایه‌گذاری غدیر در حوزه‌های انرژی، پتروشیمی و زیرساخت فعال است و یکی از بزرگ‌ترین هلدینگ‌های چندرشته‌ای بورس تهران محسوب می‌شود.',
        marketCap: '۳۴۰ هزار میلیارد ریال',
        volume24h: '۱٬۲۵۰ میلیارد ریال',
        circulatingSupply: '۱۴ میلیارد سهم',
        performance: {
            daily: { change: -1.8, chartData: generateChartData(9840, 24, 0.018, 'daily') },
            weekly: { change: 3.25, chartData: generateChartData(9530, 7, 0.03, 'weekly') },
            monthly: { change: 13.23, chartData: generateChartData(8690, 30, 0.045, 'monthly') },
            yearly: { change: 38.26, chartData: generateChartData(7115, 12, 0.07, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'shbandar',
        name: 'شبندر (پالایش نفت بندرعباس)',
        icon: '🛢️',
        price: '۱۱٬۹۹۰ ریال',
        aliases: ['شبندر', 'پالایش نفت بندرعباس'],
        description: 'پالایش نفت بندرعباس با ظرفیت پالایشی بالا بخش عمده‌ای از سوخت کشور را تأمین می‌کند و از اصلی‌ترین نمادهای پالایشی بورس است.',
        marketCap: '۳۰۰ هزار میلیارد ریال',
        volume24h: '۱٬۴۲۰ میلیارد ریال',
        circulatingSupply: '۱۶ میلیارد سهم',
        performance: {
            daily: { change: -4.16, chartData: generateChartData(11990, 24, 0.022, 'daily') },
            weekly: { change: 1.1, chartData: generateChartData(11860, 7, 0.03, 'weekly') },
            monthly: { change: 20.99, chartData: generateChartData(9910, 30, 0.045, 'monthly') },
            yearly: { change: 34.98, chartData: generateChartData(8880, 12, 0.07, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'tapico',
        name: 'تاپیکو (سرمایه‌گذاری نفت و گاز و پتروشیمی تأمین)',
        icon: '⚗️',
        price: '۱۶٬۶۸۰ ریال',
        aliases: ['تاپیکو', 'سرمایه‌گذاری تاپیکو'],
        description: 'هلدینگ تاپیکو با سبد متنوعی از شرکت‌های پتروشیمی، لاستیک و سلولزی از بزرگ‌ترین بازیگران بورس کالا محور است.',
        marketCap: '۳۸۰ هزار میلیارد ریال',
        volume24h: '۱٬۸۰۰ میلیارد ریال',
        circulatingSupply: '۲۳ میلیارد سهم',
        performance: {
            daily: { change: 6.51, chartData: generateChartData(16680, 24, 0.02, 'daily') },
            weekly: { change: 7.2, chartData: generateChartData(15560, 7, 0.035, 'weekly') },
            monthly: { change: 9.52, chartData: generateChartData(15230, 30, 0.045, 'monthly') },
            yearly: { change: 46.59, chartData: generateChartData(11380, 12, 0.075, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'tejarat', name: 'وتجارت (بانک تجارت)', icon: '🏦', price: '۱,۸۹۰ ریال',
        aliases: ['وتجارت', 'بانک تجارت'],
        description: 'بانک تجارت یکی از بانک‌های بزرگ تجاری ایران است که شبکه گسترده‌ای از شعب را در سراسر کشور اداره می‌کند.',
        marketCap: '۱۱۰ هزار میلیارد ریال', volume24h: '۶۲۰ میلیارد ریال', circulatingSupply: '۵۸ میلیارد سهم',
        performance: {
            daily: { change: 21.74, chartData: generateChartData(1890, 24, 0.05, 'daily') },
            weekly: { change: 18.2, chartData: generateChartData(1750, 7, 0.06, 'weekly') },
            monthly: { change: 35.4, chartData: generateChartData(1620, 30, 0.08, 'monthly') },
            yearly: { change: 82.0, chartData: generateChartData(1180, 12, 0.12, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'saderat', name: 'وبصادر (بانک صادرات ایران)', icon: '🏛️', price: '۱,۵۲۰ ریال',
        aliases: ['وبصادر', 'بانک صادرات'],
        description: 'بانک صادرات ایران از قدیمی‌ترین بانک‌های کشور است و خدمات ارزی و ریالی گسترده‌ای ارائه می‌دهد.',
        marketCap: '۹۵ هزار میلیارد ریال', volume24h: '۴۴۰ میلیارد ریال', circulatingSupply: '۶۵ میلیارد سهم',
        performance: {
            daily: { change: 13.37, chartData: generateChartData(1520, 24, 0.035, 'daily') },
            weekly: { change: 10.4, chartData: generateChartData(1450, 7, 0.05, 'weekly') },
            monthly: { change: 22.8, chartData: generateChartData(1340, 30, 0.07, 'monthly') },
            yearly: { change: 64.0, chartData: generateChartData(980, 12, 0.11, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'zoob', name: 'ذوب (ذوب آهن اصفهان)', icon: '🔥', price: '۲,۸۴۰ ریال',
        aliases: ['ذوب', 'ذوب آهن'],
        description: 'شرکت ذوب آهن اصفهان تولیدکننده محصولات فولادی طویل و ریل راه‌آهن در ایران است.',
        marketCap: '۹۰ هزار میلیارد ریال', volume24h: '۵۸۰ میلیارد ریال', circulatingSupply: '۳۲ میلیارد سهم',
        performance: {
            daily: { change: 10.24, chartData: generateChartData(2840, 24, 0.028, 'daily') },
            weekly: { change: 6.5, chartData: generateChartData(2700, 7, 0.04, 'weekly') },
            monthly: { change: 14.2, chartData: generateChartData(2550, 30, 0.06, 'monthly') },
            yearly: { change: 48.0, chartData: generateChartData(2000, 12, 0.1, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'khsaipa', name: 'خساپا (سایپا)', icon: '🚙', price: '۱,۸۶۰ ریال',
        aliases: ['خساپا', 'سایپا'],
        description: 'شرکت خودروسازی سایپا دومین خودروساز بزرگ ایران است و محصولات متنوع سواری و تجاری عرضه می‌کند.',
        marketCap: '۱۳۰ هزار میلیارد ریال', volume24h: '۸۱۰ میلیارد ریال', circulatingSupply: '۷۰ میلیارد سهم',
        performance: {
            daily: { change: 35.97, chartData: generateChartData(1860, 24, 0.06, 'daily') },
            weekly: { change: 28.5, chartData: generateChartData(1700, 7, 0.07, 'weekly') },
            monthly: { change: 41.2, chartData: generateChartData(1550, 30, 0.09, 'monthly') },
            yearly: { change: 95.0, chartData: generateChartData(1100, 12, 0.14, 'yearly') }
        },
        category: 'بورس'
    },
    {
        id: 'khgostar', name: 'خگستر (گسترش سرمایه‌گذاری ایران خودرو)', icon: '🧩', price: '۶,۷۲۰ ریال',
        aliases: ['خگستر', 'سرمایه‌گذاری ایران خودرو'],
        description: 'شرکت گسترش سرمایه‌گذاری ایران خودرو بازوی سرمایه‌گذاری و مالی گروه ایران خودرو است.',
        marketCap: '۷۵ هزار میلیارد ریال', volume24h: '۳۹۰ میلیارد ریال', circulatingSupply: '۱۱ میلیارد سهم',
        performance: {
            daily: { change: -3.36, chartData: generateChartData(6720, 24, 0.025, 'daily') },
            weekly: { change: 2.5, chartData: generateChartData(6600, 7, 0.04, 'weekly') },
            monthly: { change: 7.8, chartData: generateChartData(6400, 30, 0.06, 'monthly') },
            yearly: { change: 38.0, chartData: generateChartData(5200, 12, 0.1, 'yearly') }
        },
        category: 'بورس'
    },
];
