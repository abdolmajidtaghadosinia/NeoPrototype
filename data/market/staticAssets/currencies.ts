import type { MarketAsset } from '@/types';
import { generateChartData } from '../utils';

export const currencyAssets: MarketAsset[] = [
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
];
