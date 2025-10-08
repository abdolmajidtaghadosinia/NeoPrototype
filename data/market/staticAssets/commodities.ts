import type { MarketAsset } from '@/types';
import { generateChartData } from '../utils';

export const commodityAssets: MarketAsset[] = [
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
