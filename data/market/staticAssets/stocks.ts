import type { MarketAsset } from '@/types';
import { generateChartData } from '../utils';

export const stockAssets: MarketAsset[] = [
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
