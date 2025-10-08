import type { MarketAsset } from '@/types';
import { generateChartData } from '../utils';

export const fundAssets: MarketAsset[] = [
    {
        id: 'zarfam', name: 'زرفام (صندوق طلا زرفام)', icon: '🪙', price: '۸۳٬۱۷۹ ریال',
        aliases: ['زرفام', 'صندوق طلا زرفام'],
        description: 'صندوق کالایی زرفام با سرمایه‌گذاری در گواهی سپرده سکه و معاملات آتی، پوشش مطمئنی برای نوسانات طلای داخلی فراهم می‌کند.',
        marketCap: '۱.۹ هزار میلیارد تومان', volume24h: '۲۲۰ میلیارد تومان', circulatingSupply: '۲۳۰ میلیون واحد',
        performance: {
            daily: { change: 0.21, chartData: generateChartData(83179, 24, 0.01, 'daily') },
            weekly: { change: 1.07, chartData: generateChartData(82000, 7, 0.015, 'weekly') },
            monthly: { change: 4.73, chartData: generateChartData(79000, 30, 0.02, 'monthly') },
            yearly: { change: 5.53, chartData: generateChartData(75000, 12, 0.03, 'yearly') }
        },
        extendedReturns: { three: 14.88, six: 19.52, nine: 6.23, twelve: 5.53 },
        category: 'صندوق‌ها'
    },
    {
        id: 'kahroba', name: 'کهربا (صندوق طلا کهربا)', icon: '🔶', price: '۱۰۸٬۲۸۱ ریال',
        aliases: ['کهربا', 'صندوق طلا کهربا'],
        description: 'صندوق طلا کهربا با تمرکز بر قراردادهای سلف و گواهی سپرده، بازدهی بالایی در دوره‌های میان‌مدت به ثبت رسانده است.',
        marketCap: '۲.۴۵ هزار میلیارد تومان', volume24h: '۳۱۰ میلیارد تومان', circulatingSupply: '۲۷۰ میلیون واحد',
        performance: {
            daily: { change: 0.34, chartData: generateChartData(108281, 24, 0.012, 'daily') },
            weekly: { change: 1.69, chartData: generateChartData(105000, 7, 0.018, 'weekly') },
            monthly: { change: 7.55, chartData: generateChartData(100000, 30, 0.025, 'monthly') },
            yearly: { change: 17.57, chartData: generateChartData(91000, 12, 0.035, 'yearly') }
        },
        extendedReturns: { three: 24.42, six: 27.66, nine: 15.62, twelve: 17.57 },
        category: 'صندوق‌ها'
    },
    {
        id: 'lotus-gold', name: 'پشتوانه طلای لوتوس', icon: '🥇', price: '۸۰۳٬۶۷۷ ریال',
        aliases: ['لوتوس طلا', 'پشتوانه طلای لوتوس'],
        description: 'صندوق کالایی پشتوانه طلای لوتوس با سبدی از گواهی سپرده سکه و اوراق خزانه، گزینه‌ای محبوب برای پوشش ریسک تورم است.',
        marketCap: '۳.۸ هزار میلیارد تومان', volume24h: '۴۵۰ میلیارد تومان', circulatingSupply: '۱۴۰ میلیون واحد',
        performance: {
            daily: { change: 0.25, chartData: generateChartData(803677, 24, 0.012, 'daily') },
            weekly: { change: 1.26, chartData: generateChartData(780000, 7, 0.017, 'weekly') },
            monthly: { change: 5.59, chartData: generateChartData(730000, 30, 0.022, 'monthly') },
            yearly: { change: 11.98, chartData: generateChartData(700000, 12, 0.032, 'yearly') }
        },
        extendedReturns: { three: 17.73, six: 22.45, nine: 10.33, twelve: 11.98 },
        category: 'صندوق‌ها'
    },
    {
        id: 'mesghal', name: 'مثقال (صندوق طلا مثقال)', icon: '⚖️', price: '۹۰٬۵۳۹ ریال',
        aliases: ['مثقال', 'صندوق طلا مثقال'],
        description: 'صندوق مثقال با استراتژی مدیریت فعال و پوشش آتی‌ها، نقدشوندگی بالا و بازدهی پایدار را هدف گرفته است.',
        marketCap: '۲.۱ هزار میلیارد تومان', volume24h: '۲۴۰ میلیارد تومان', circulatingSupply: '۲۲۰ میلیون واحد',
        performance: {
            daily: { change: 0.26, chartData: generateChartData(90539, 24, 0.011, 'daily') },
            weekly: { change: 1.31, chartData: generateChartData(89000, 7, 0.017, 'weekly') },
            monthly: { change: 5.82, chartData: generateChartData(86000, 30, 0.022, 'monthly') },
            yearly: { change: 9.3, chartData: generateChartData(82000, 12, 0.03, 'yearly') }
        },
        extendedReturns: { three: 18.48, six: 24.35, nine: 11.37, twelve: 9.3 },
        category: 'صندوق‌ها'
    },
    {
        id: 'ganj', name: 'گنج (صندوق طلا گنجینه طلا)', icon: '💰', price: '۹۵٬۹۹۸ ریال',
        aliases: ['گنج', 'صندوق گنجینه طلا'],
        description: 'صندوق گنج با تمرکز بر ابزارهای مشتقه طلا، رشد چشمگیر ۶ و ۹ ماهه را برای سرمایه‌گذاران به همراه داشته است.',
        marketCap: '۲.۸ هزار میلیارد تومان', volume24h: '۳۶۰ میلیارد تومان', circulatingSupply: '۲۴۰ میلیون واحد',
        performance: {
            daily: { change: 0.36, chartData: generateChartData(95998, 24, 0.013, 'daily') },
            weekly: { change: 1.8, chartData: generateChartData(94000, 7, 0.019, 'weekly') },
            monthly: { change: 8.04, chartData: generateChartData(90000, 30, 0.025, 'monthly') },
            yearly: { change: 21.61, chartData: generateChartData(83000, 12, 0.035, 'yearly') }
        },
        extendedReturns: { three: 26.1, six: 32.74, nine: 19.31, twelve: 21.61 },
        category: 'صندوق‌ها'
    },
    {
        id: 'gohar-gold', name: 'گوهر (صندوق طلای کیان)', icon: '🔶', price: '۵۳۸٬۰۴۰ ریال',
        aliases: ['گوهر', 'صندوق طلای کیان'],
        description: 'صندوق گوهر با ترکیب سپرده‌های طلا و سکه کیان، گزینه‌ای مناسب برای سرمایه‌گذاران بلندمدت محسوب می‌شود.',
        marketCap: '۲.۹ هزار میلیارد تومان', volume24h: '۳۳۰ میلیارد تومان', circulatingSupply: '۱۱۰ میلیون واحد',
        performance: {
            daily: { change: 0.22, chartData: generateChartData(538040, 24, 0.011, 'daily') },
            weekly: { change: 1.1, chartData: generateChartData(520000, 7, 0.016, 'weekly') },
            monthly: { change: 4.85, chartData: generateChartData(500000, 30, 0.021, 'monthly') },
            yearly: { change: 13.05, chartData: generateChartData(470000, 12, 0.03, 'yearly') }
        },
        extendedReturns: { three: 15.26, six: 20.72, nine: 7.92, twelve: 13.05 },
        category: 'صندوق‌ها'
    },
    {
        id: 'alton', name: 'آلتون (صندوق طلای زر)', icon: '🟡', price: '۳۵٬۸۷۰ ریال',
        aliases: ['آلتون', 'صندوق زر'],
        description: 'صندوق آلتون با تمرکز بر اوراق مبتنی بر طلا و استراتژی پوشش ریسک، بازدهی باثباتی در دوره‌های میان‌مدت ارائه داده است.',
        marketCap: '۱.۲ هزار میلیارد تومان', volume24h: '۱۸۰ میلیارد تومان', circulatingSupply: '۳۱۰ میلیون واحد',
        performance: {
            daily: { change: 0.33, chartData: generateChartData(35870, 24, 0.012, 'daily') },
            weekly: { change: 1.65, chartData: generateChartData(34500, 7, 0.018, 'weekly') },
            monthly: { change: 7.35, chartData: generateChartData(33000, 30, 0.024, 'monthly') },
            yearly: { change: 14.57, chartData: generateChartData(30500, 12, 0.032, 'yearly') }
        },
        extendedReturns: { three: 23.71, six: 24.64, nine: 10.91, twelve: 14.57 },
        category: 'صندوق‌ها'
    },
    {
        id: 'nafis', name: 'نفیس (صندوق طلای نفیس)', icon: '🧿', price: '۶۵٬۱۹۵ ریال',
        aliases: ['نفیس', 'صندوق طلای نفیس'],
        description: 'صندوق نفیس با ترکیب گواهی سپرده و قراردادهای آتی، رویکردی متعادل برای بهره‌گیری از نوسانات طلا ارائه می‌دهد.',
        marketCap: '۱.۶ هزار میلیارد تومان', volume24h: '۲۶۰ میلیارد تومان', circulatingSupply: '۳۴۰ میلیون واحد',
        performance: {
            daily: { change: 0.25, chartData: generateChartData(65195, 24, 0.011, 'daily') },
            weekly: { change: 1.23, chartData: generateChartData(64000, 7, 0.017, 'weekly') },
            monthly: { change: 5.45, chartData: generateChartData(61000, 30, 0.022, 'monthly') },
            yearly: { change: 19.22, chartData: generateChartData(56000, 12, 0.033, 'yearly') }
        },
        extendedReturns: { three: 17.27, six: 19.51, nine: 11.5, twelve: 19.22 },
        category: 'صندوق‌ها'
    },
    {
        id: 'zarafshan', name: 'زر افشان امید ایرانیان', icon: '✨', price: '۴۸۷٬۹۸۰ ریال',
        aliases: ['زر افشان', 'صندوق زر افشان امید ایرانیان'],
        description: 'صندوق زر افشان با تمرکز بر سکه طلا و قراردادهای مشتقه، ابزاری مناسب برای سرمایه‌گذاران محافظه‌کار است.',
        marketCap: '۲.۳ هزار میلیارد تومان', volume24h: '۲۸۰ میلیارد تومان', circulatingSupply: '۱۲۰ میلیون واحد',
        performance: {
            daily: { change: 0.23, chartData: generateChartData(487980, 24, 0.011, 'daily') },
            weekly: { change: 1.18, chartData: generateChartData(470000, 7, 0.016, 'weekly') },
            monthly: { change: 5.2, chartData: generateChartData(445000, 30, 0.021, 'monthly') },
            yearly: { change: 13.66, chartData: generateChartData(420000, 12, 0.03, 'yearly') }
        },
        extendedReturns: { three: 16.42, six: 21.18, nine: 7.95, twelve: 13.66 },
        category: 'صندوق‌ها'
    },
    {
        id: 'yaghoot', name: 'صندوق طلا یاقوت', icon: '💎', price: '۳۴,۸۰۰ ریال',
        aliases: ['یاقوت', 'صندوق یاقوت'],
        description: 'صندوق سرمایه‌گذاری طلا یاقوت با پشتوانه سکه و گواهی سپرده به دنبال ارائه بازدهی نزدیک به بازار طلای داخلی است.',
        marketCap: '۱.۸ هزار میلیارد تومان', volume24h: '۱۴۰ میلیارد تومان', circulatingSupply: '۵۲۰ میلیون واحد',
        performance: {
            daily: { change: 33.47, chartData: generateChartData(34800, 24, 0.05, 'daily') },
            weekly: { change: 45.1, chartData: generateChartData(32000, 7, 0.07, 'weekly') },
            monthly: { change: 62.3, chartData: generateChartData(29500, 30, 0.09, 'monthly') },
            yearly: { change: 128.0, chartData: generateChartData(21000, 12, 0.14, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'afran', name: 'صندوق طلا افران', icon: '🧭', price: '۳۵,۲۰۰ ریال',
        aliases: ['افران', 'صندوق افران'],
        description: 'صندوق طلا افران روی گواهی سپرده سکه و اوراق مبتنی بر طلا سرمایه‌گذاری می‌کند و مدیریت فعالی دارد.',
        marketCap: '۱.۵ هزار میلیارد تومان', volume24h: '۱۱۰ میلیارد تومان', circulatingSupply: '۴۴۰ میلیون واحد',
        performance: {
            daily: { change: 34.07, chartData: generateChartData(35200, 24, 0.05, 'daily') },
            weekly: { change: 46.4, chartData: generateChartData(32400, 7, 0.07, 'weekly') },
            monthly: { change: 59.8, chartData: generateChartData(30100, 30, 0.09, 'monthly') },
            yearly: { change: 120.0, chartData: generateChartData(21800, 12, 0.14, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'firooza', name: 'صندوق طلا فیروزا', icon: '🔷', price: '۳۵,۵۰۰ ریال',
        aliases: ['فیروزا', 'صندوق فیروزا'],
        description: 'صندوق فیروزا یکی از صندوق‌های طلا با نقدشوندگی بالا و تمرکز بر مدیریت فعال ریسک‌های بازار است.',
        marketCap: '۱.۶ هزار میلیارد تومان', volume24h: '۱۲۰ میلیارد تومان', circulatingSupply: '۴۶۰ میلیون واحد',
        performance: {
            daily: { change: 34.37, chartData: generateChartData(35500, 24, 0.05, 'daily') },
            weekly: { change: 47.0, chartData: generateChartData(32700, 7, 0.07, 'weekly') },
            monthly: { change: 61.5, chartData: generateChartData(30400, 30, 0.09, 'monthly') },
            yearly: { change: 122.0, chartData: generateChartData(22000, 12, 0.14, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'kara', name: 'صندوق سهامی کارا', icon: '🛠️', price: '۲۷,۶۰۰ ریال',
        aliases: ['کارا', 'ETF کارا'],
        description: 'صندوق سهامی کارا با تمرکز بر صنایع تولیدی و صادراتی مدیریت می‌شود و استراتژی فعال دارد.',
        marketCap: '۹۸۰ میلیارد تومان', volume24h: '۸۵ میلیارد تومان', circulatingSupply: '۳۵۵ میلیون واحد',
        performance: {
            daily: { change: 33.97, chartData: generateChartData(27600, 24, 0.045, 'daily') },
            weekly: { change: 29.4, chartData: generateChartData(25500, 7, 0.06, 'weekly') },
            monthly: { change: 48.6, chartData: generateChartData(23600, 30, 0.08, 'monthly') },
            yearly: { change: 90.0, chartData: generateChartData(18000, 12, 0.12, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'mahoor', name: 'صندوق سهامی ماهور', icon: '🎼', price: '۲۶,۹۰۰ ریال',
        aliases: ['ماهور', 'ETF ماهور'],
        description: 'صندوق ماهور ترکیبی از سهام بنیادی و صندوق‌های کالایی را برای ایجاد تعادل ریسک و بازده نگه‌داری می‌کند.',
        marketCap: '۹۲۰ میلیارد تومان', volume24h: '۷۲ میلیارد تومان', circulatingSupply: '۳۴۰ میلیون واحد',
        performance: {
            daily: { change: 34.54, chartData: generateChartData(26900, 24, 0.045, 'daily') },
            weekly: { change: 31.2, chartData: generateChartData(24800, 7, 0.06, 'weekly') },
            monthly: { change: 50.4, chartData: generateChartData(22900, 30, 0.08, 'monthly') },
            yearly: { change: 94.0, chartData: generateChartData(17600, 12, 0.12, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'orkideh', name: 'صندوق سهامی ارکیده', icon: '🌸', price: '۲۸,۴۰۰ ریال',
        aliases: ['ارکیده', 'ETF ارکیده'],
        description: 'صندوق ارکیده بر سهام شرکت‌های رشد محور بازار سرمایه ایران تمرکز دارد.',
        marketCap: '۸۸۰ میلیارد تومان', volume24h: '۶۵ میلیارد تومان', circulatingSupply: '۳۱۰ میلیون واحد',
        performance: {
            daily: { change: 34.74, chartData: generateChartData(28400, 24, 0.045, 'daily') },
            weekly: { change: 30.5, chartData: generateChartData(26200, 7, 0.06, 'weekly') },
            monthly: { change: 49.1, chartData: generateChartData(24100, 30, 0.08, 'monthly') },
            yearly: { change: 88.0, chartData: generateChartData(18200, 12, 0.12, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'moj', name: 'صندوق سهامی موج', icon: '🌊', price: '۲۵,۸۰۰ ریال',
        aliases: ['موج', 'ETF موج'],
        description: 'صندوق موج با تمرکز بر صنایع صادرات‌محور و دارایی‌های با نقدشوندگی بالا مدیریت می‌شود.',
        marketCap: '۸۴۰ میلیارد تومان', volume24h: '۶۰ میلیارد تومان', circulatingSupply: '۳۲۰ میلیون واحد',
        performance: {
            daily: { change: 33.77, chartData: generateChartData(25800, 24, 0.045, 'daily') },
            weekly: { change: 27.8, chartData: generateChartData(23800, 7, 0.06, 'weekly') },
            monthly: { change: 46.2, chartData: generateChartData(22000, 30, 0.08, 'monthly') },
            yearly: { change: 85.0, chartData: generateChartData(17000, 12, 0.12, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'kelid', name: 'صندوق درآمد ثابت کلید', icon: '🔑', price: '۲۲,۵۰۰ ریال',
        aliases: ['کلید', 'صندوق کلید'],
        description: 'صندوق درآمد ثابت کلید با ترکیب اوراق دولتی و شرکتی تلاش می‌کند سودی پایدار بالاتر از سپرده بانکی ارائه دهد.',
        marketCap: '۱.۲ هزار میلیارد تومان', volume24h: '۵۵ میلیارد تومان', circulatingSupply: '۴۱۰ میلیون واحد',
        performance: {
            daily: { change: 5.5, chartData: generateChartData(22500, 24, 0.01, 'daily') },
            weekly: { change: 7.2, chartData: generateChartData(22200, 7, 0.015, 'weekly') },
            monthly: { change: 12.8, chartData: generateChartData(21900, 30, 0.02, 'monthly') },
            yearly: { change: 32.0, chartData: generateChartData(20000, 12, 0.04, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'parand', name: 'صندوق درآمد ثابت پارند', icon: '🪶', price: '۲۱,۸۰۰ ریال',
        aliases: ['پارند', 'صندوق پارند'],
        description: 'صندوق پارند روی اوراق بدهی کوتاه‌مدت و سپرده‌های بانکی تمرکز دارد و گزینه‌ای مطمئن برای سرمایه‌گذاران محتاط است.',
        marketCap: '۹۶۰ میلیارد تومان', volume24h: '۴۰ میلیارد تومان', circulatingSupply: '۳۸۰ میلیون واحد',
        performance: {
            daily: { change: 2.17, chartData: generateChartData(21800, 24, 0.008, 'daily') },
            weekly: { change: 3.8, chartData: generateChartData(21600, 7, 0.012, 'weekly') },
            monthly: { change: 7.5, chartData: generateChartData(21300, 30, 0.018, 'monthly') },
            yearly: { change: 24.0, chartData: generateChartData(19800, 12, 0.03, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'ahram', name: 'صندوق اهرمی اهرم', icon: '⚙️', price: '۳۱,۰۰۰ ریال',
        aliases: ['اهرم', 'صندوق اهرم'],
        description: 'صندوق اهرمی با استفاده از اوراق تبعی و اعتبار، بازدهی صندوق‌های سهامی را با ریسک بالاتر هدف‌گذاری می‌کند.',
        marketCap: '۷۶۰ میلیارد تومان', volume24h: '۶۵ میلیارد تومان', circulatingSupply: '۲۴۵ میلیون واحد',
        performance: {
            daily: { change: 8.62, chartData: generateChartData(31000, 24, 0.035, 'daily') },
            weekly: { change: 12.4, chartData: generateChartData(29600, 7, 0.05, 'weekly') },
            monthly: { change: 28.5, chartData: generateChartData(27500, 30, 0.07, 'monthly') },
            yearly: { change: 70.0, chartData: generateChartData(21000, 12, 0.11, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'homay', name: 'صندوق درآمد ثابت همای', icon: '🕊️', price: '۱۸,۹۰۰ ریال',
        aliases: ['همای', 'صندوق همای'],
        description: 'صندوق همای با سیاست سرمایه‌گذاری محتاطانه و نقدشوندگی روزانه، گزینه‌ای مناسب برای مدیریت نقدینگی است.',
        marketCap: '۸۴۰ میلیارد تومان', volume24h: '۳۵ میلیارد تومان', circulatingSupply: '۳۲۰ میلیون واحد',
        performance: {
            daily: { change: -0.09, chartData: generateChartData(18900, 24, 0.005, 'daily') },
            weekly: { change: 0.8, chartData: generateChartData(18850, 7, 0.008, 'weekly') },
            monthly: { change: 3.4, chartData: generateChartData(18700, 30, 0.012, 'monthly') },
            yearly: { change: 18.0, chartData: generateChartData(17400, 12, 0.02, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'kian', name: 'صندوق سهامی کیان', icon: '🏢', price: '۲۹,۷۰۰ ریال',
        aliases: ['کیان', 'ETF کیان'],
        description: 'صندوق سهامی کیان بر سهام شرکت‌های بزرگ بازار سرمایه تمرکز دارد و با تحلیل بنیادی مدیریت می‌شود.',
        marketCap: '۱.۴ هزار میلیارد تومان', volume24h: '۱۰۰ میلیارد تومان', circulatingSupply: '۴۷۰ میلیون واحد',
        performance: {
            daily: { change: 33.81, chartData: generateChartData(29700, 24, 0.045, 'daily') },
            weekly: { change: 30.1, chartData: generateChartData(27500, 7, 0.06, 'weekly') },
            monthly: { change: 52.4, chartData: generateChartData(25200, 30, 0.08, 'monthly') },
            yearly: { change: 102.0, chartData: generateChartData(19500, 12, 0.12, 'yearly') }
        },
        category: 'صندوق‌ها'
    },
    {
        id: 'ayar', name: 'صندوق طلا عیار', icon: '💰', price: '۳۰۸٬۸۵۹ ریال',
        aliases: ['عیار', 'صندوق طلا عیار'],
        description: 'صندوق طلا عیار با ترکیب اوراق سکه و قراردادهای آتی، بازدهی متوازنی در افق‌های ۳ تا ۱۲ ماهه ارائه می‌کند.',
        marketCap: '۵.۲ هزار میلیارد تومان', volume24h: '۴۲۰ میلیارد تومان', circulatingSupply: '۱۰۰ میلیون واحد',
        performance: {
            daily: { change: 0.3, chartData: generateChartData(308859, 24, 0.012, 'daily') },
            weekly: { change: 1.52, chartData: generateChartData(300000, 7, 0.017, 'weekly') },
            monthly: { change: 6.78, chartData: generateChartData(285000, 30, 0.022, 'monthly') },
            yearly: { change: 14.1, chartData: generateChartData(270000, 12, 0.03, 'yearly') }
        },
        extendedReturns: { three: 21.74, six: 27.26, nine: 12.01, twelve: 14.1 },
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
            daily: { change: 2.26, chartData: generateChartData(1100, 24, 0.003, 'daily') },
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
];
