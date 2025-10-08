import type { MarketAsset } from '@/types';
import { generateChartData } from '../utils';

export const fundAssets: MarketAsset[] = [
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
