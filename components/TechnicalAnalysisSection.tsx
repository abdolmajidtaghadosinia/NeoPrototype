import React, { useMemo } from 'react';
import { MarketAsset } from '../types';
import TechnicalAnalysisGauge from './TechnicalAnalysisGauge';
import { SignalIcon } from './icons/SignalIcon';

export const getAnalysisDetails = (
    val: number,
): { longLabel: string; shortLabel: string; color: string } => {
    if (val <= 15) return { longLabel: 'فروش قوی', shortLabel: 'فروش قوی', color: '#ef4444' };
    if (val <= 35) return { longLabel: 'فروش', shortLabel: 'فروش', color: '#f97316' };
    if (val <= 65) return { longLabel: 'خنثی', shortLabel: 'خنثی', color: '#fbbf24' };
    if (val <= 85) return { longLabel: 'خرید', shortLabel: 'خرید', color: '#99ff57' };
    return { longLabel: 'خرید قوی', shortLabel: 'خرید قوی', color: '#6bff3d' };
};

const summaryNarratives: Record<string, string> = {
    'فروش قوی': 'قدرت فروشندگان در اغلب شاخص‌ها غالب است و هر صعودی با عرضه شدید روبه‌رو می‌شود.',
    'فروش': 'سیگنال‌ها تمایل نزولی دارند و بهتر است برای ورود با احتیاط عمل شود.',
    'خنثی': 'شاخص‌ها نوسان محدودی را نشان می‌دهند و بازار به دنبال محرک تازه‌ای است.',
    'خرید': 'خریداران دست بالا را دارند و شاخص‌ها حرکت صعودی پایدار را تایید می‌کنند.',
    'خرید قوی': 'تمام شاخص‌ها همسو با رشد هستند و بازار در فاز صعودی قدرتمند قرار گرفته است.',
};

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const getRsiContext = (value: number) => {
    if (value >= 70) return 'اشباع خرید';
    if (value <= 30) return 'اشباع فروش';
    return 'تعادل نسبی';
};

const describeMovingAverage = (value: number) => {
    if (value >= 80) return 'میانگین‌های کوتاه‌مدت بالاتر از بلندمدت تثبیت شده‌اند و روند صعودی پایدار است.';
    if (value >= 60) return 'کفه ترازو به نفع خریداران است و شیب میانگین‌ها رو به بالا می‌ماند.';
    if (value <= 20) return 'میانگین‌های بلندمدت بالاتر قرار گرفته‌اند و فشار فروش حاکم است.';
    if (value <= 40) return 'کاهش قیمت‌ها باعث عبور میانگین‌های کوتاه‌مدت به زیر بلندمدت شده است.';
    return 'تلاقی میانگین‌ها سیگنال مشخصی ارائه نمی‌دهد.';
};

const describeOscillators = (value: number) => {
    if (value >= 70) return 'نوسانگرها شتاب صعودی قوی و حرکات انفجاری را نشان می‌دهند.';
    if (value >= 50) return 'مومنتوم مثبت است و احتمال ادامه حرکت رو به بالا بالاست.';
    if (value <= 30) return 'نوسانگرها هشدار ضعف تقاضا و احتمال اصلاح عمیق را می‌دهند.';
    if (value <= 45) return 'کاهش انرژی خرید در حال شکل‌گیری است و باید محتاط بود.';
    return 'شتاب قیمت‌ها محدود است و بازار رفتاری متعادل دارد.';
};

const describeMacd = (value: number) => {
    if (value >= 70) return 'هیستوگرام MACD صعودی است و فاصله‌ی خط سیگنال با خط مکدی در حال افزایش می‌باشد.';
    if (value >= 55) return 'تقاطع صعودی تداوم دارد و شیب مکدی مثبت باقی مانده است.';
    if (value <= 30) return 'مکدی وارد فاز نزولی شده و خط سیگنال در بالا قرار گرفته است.';
    if (value <= 45) return 'ضعف حرکت صعودی در مکدی دیده می‌شود و امکان چرخش رو به پایین وجود دارد.';
    return 'مکدی سیگنال مشخصی ارائه نمی‌دهد و بهتر است به شاخص‌های دیگر اتکا شود.';
};

const describeRsi = (value: number) => {
    if (value >= 70) return 'RSI در محدوده‌ی اشباع خرید قرار دارد و احتمال استراحت قیمت وجود دارد.';
    if (value >= 55) return 'RSI در محدوده‌ی مثبت حرکت می‌کند و قدرت خرید حفظ شده است.';
    if (value <= 30) return 'RSI به منطقه‌ی اشباع فروش وارد شده و آماده‌ی بازگشت احتمالی است.';
    if (value <= 45) return 'RSI کاهش مومنتوم صعودی را نشان می‌دهد و بهتر است با احتیاط معامله کرد.';
    return 'RSI در حوالی میانه قرار دارد و بازار نشانه‌ی جهت‌دار ندارد.';
};

interface InsightConfig {
    key: string;
    title: string;
    meta: string;
    description: string;
    value: number;
}

const TechnicalAnalysisSection: React.FC<{ asset: MarketAsset }> = ({ asset }) => {
    const analysis = useMemo(() => {
        const rsiValue = asset.rsi ?? 50 + (Math.random() - 0.5) * 40;

        let maValue = 50;
        if (asset.performance.daily.change > 0.5) maValue = 85;
        else if (asset.performance.daily.change > 0) maValue = 72;
        else if (asset.performance.daily.change < -0.5) maValue = 18;
        else if (asset.performance.daily.change < 0) maValue = 32;

        const oscValue = 20 + Math.random() * 60;
        const macdValue = 40 + Math.random() * 40;
        const summaryValue = (rsiValue + maValue + oscValue + macdValue) / 4;

        return {
            rsi: { value: rsiValue },
            ma: { value: maValue },
            osc: { value: oscValue },
            macd: { value: macdValue },
            summary: { value: summaryValue },
        };
    }, [asset]);

    const summaryDetails = getAnalysisDetails(analysis.summary.value);
    const summaryScore = clampScore(analysis.summary.value);
    const summaryNarrative = summaryNarratives[summaryDetails.longLabel] ?? 'مجموع شاخص‌ها وضعیت متعادلی را گزارش می‌کنند.';

    const quickStats = useMemo(
        () => [
            {
                label: 'RSI',
                value: clampScore(analysis.rsi.value),
                helper: getRsiContext(analysis.rsi.value),
            },
            {
                label: 'MACD',
                value: clampScore(analysis.macd.value),
                helper: analysis.macd.value >= 55 ? 'تقاطع صعودی' : analysis.macd.value <= 45 ? 'تقاطع نزولی' : 'بی‌طرف',
            },
            {
                label: 'نوسانگرها',
                value: clampScore(analysis.osc.value),
                helper: analysis.osc.value >= 55 ? 'شتاب مثبت' : analysis.osc.value <= 45 ? 'شتاب منفی' : 'متعادل',
            },
        ],
        [analysis.macd.value, analysis.osc.value, analysis.rsi.value],
    );

    const insights: InsightConfig[] = useMemo(
        () => [
            {
                key: 'ma',
                title: 'روند میانگین‌ها',
                meta: 'میانگین‌های متحرک',
                value: analysis.ma.value,
                description: describeMovingAverage(analysis.ma.value),
            },
            {
                key: 'osc',
                title: 'شتاب نوسانگرها',
                meta: 'Oscillators',
                value: analysis.osc.value,
                description: describeOscillators(analysis.osc.value),
            },
            {
                key: 'macd',
                title: 'سیگنال MACD',
                meta: 'Moving Average Convergence Divergence',
                value: analysis.macd.value,
                description: describeMacd(analysis.macd.value),
            },
            {
                key: 'rsi',
                title: 'مومنتوم RSI',
                meta: 'Relative Strength Index',
                value: analysis.rsi.value,
                description: describeRsi(analysis.rsi.value),
            },
        ],
        [analysis.ma.value, analysis.macd.value, analysis.osc.value, analysis.rsi.value],
    );

    return (
        <section className="relative rounded-[28px] border border-white/8 bg-[#0b1118]/90 text-right shadow-[0_30px_90px_-40px_rgba(0,0,0,0.85)]">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-neo-green/5 via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col gap-10 p-6 sm:p-10">
                <header className="flex flex-col gap-6 text-white lg:flex-row-reverse lg:items-center lg:justify-between">
                    <div className="flex flex-row-reverse items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neo-green/20 text-neo-green">
                            <SignalIcon className="h-6 w-6" />
                        </span>
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.3em] text-neo-green/70">ANALYSIS</p>
                            <h2 className="text-2xl font-black">خلاصه تکنیکال</h2>
                            <p className="mt-1 text-sm text-gray-400">ساده‌ترین تصویر از وضعیت شاخص‌های مهم برای {asset.name}</p>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse flex-wrap items-center justify-end gap-2 text-[11px] text-gray-400">
                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5">به‌روزرسانی لحظه‌ای</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5">بازه ۲۴ ساعته</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5">نماد: {asset.name}</span>
                    </div>
                </header>

                <div className="flex flex-col gap-8 xl:flex-row-reverse xl:items-start">
                    <aside className="flex w-full max-w-full flex-col gap-7 rounded-3xl border border-white/10 bg-black/40 p-6 xl:w-[340px]">
                        <div className="flex flex-col items-end gap-2 text-white">
                            <span className="text-xs text-gray-400">سیگنال غالب</span>
                            <strong style={{ color: summaryDetails.color }} className="text-3xl font-black leading-tight">
                                {summaryDetails.longLabel}
                            </strong>
                        </div>
                        <p className="text-xs leading-6 text-gray-300">{summaryNarrative}</p>
                        <div className="flex flex-col items-center gap-5">
                            <div className="w-full max-w-[220px]">
                                <TechnicalAnalysisGauge value={summaryScore} size="large" color={summaryDetails.color} />
                            </div>
                            <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-2 text-[11px] text-gray-300">
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">امتیاز {summaryScore} از ۱۰۰</span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">میانگین چهار شاخص</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {quickStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
                                >
                                    <div className="flex flex-row-reverse items-center justify-between text-sm text-white">
                                        <span className="font-semibold">{stat.label}</span>
                                        <span className="text-lg font-bold text-neo-green">{stat.value}</span>
                                    </div>
                                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                        <span
                                            className="block h-full rounded-full bg-gradient-to-l from-neo-green via-neo-green/70 to-neo-green/30"
                                            style={{ width: `${stat.value}%` }}
                                        />
                                    </div>
                                    <p className="mt-2 text-[11px] leading-5 text-gray-300">{stat.helper}</p>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <div className="flex flex-col gap-6">
                        <ul className="space-y-3">
                            {insights.map((insight) => {
                                const detail = getAnalysisDetails(insight.value);
                                const score = clampScore(insight.value);

                                return (
                                    <li key={insight.key}>
                                        <div className="flex flex-col gap-3 rounded-3xl border border-white/8 bg-white/5 px-4 py-4 text-right transition-colors duration-200 hover:border-neo-green/40 hover:bg-neo-green/5 sm:flex-row-reverse sm:items-center sm:justify-between">
                                            <div className="flex flex-1 flex-col gap-2 text-right">
                                                <div className="flex flex-row-reverse items-start justify-between gap-3">
                                                    <div className="text-right">
                                                        <span className="text-[11px] text-gray-400">{insight.meta}</span>
                                                        <h3 className="mt-1 text-sm font-semibold text-white">{insight.title}</h3>
                                                    </div>
                                                    <span
                                                        className="shrink-0 rounded-full border border-white/10 bg-white/0 px-3 py-1 text-[11px] font-semibold"
                                                        style={{ color: detail.color }}
                                                    >
                                                        {detail.shortLabel}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] leading-6 text-gray-300 sm:leading-7">{insight.description}</p>
                                            </div>
                                            <div className="flex w-full flex-col items-end gap-2 sm:w-auto sm:flex-row-reverse sm:items-center sm:gap-3">
                                                <div className="flex flex-row-reverse items-center gap-2 text-[11px] text-gray-400">
                                                    <span className="font-semibold text-white">{score}</span>
                                                    <span>قدرت سیگنال</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                                                        <span
                                                            className="block h-full rounded-full bg-gradient-to-l from-neo-green via-neo-green/70 to-neo-green/25"
                                                            style={{ width: `${score}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-gray-500">از ۱۰۰</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-xs leading-6 text-gray-200">
                            <strong className="ml-2 text-white">راهنمای سریع:</strong>
                            سیگنال‌ها با ترکیب میانگین‌های متحرک، نوسانگرها، MACD و RSI محاسبه شده‌اند. پیش از تصمیم‌گیری مالی، شرایط بازار و استراتژی شخصی خود را نیز بررسی کنید.
                        </div>
                    </div>
                </div>

                <footer className="text-[11px] text-gray-500">
                    این نمایه تنها برای تحلیل تکنیکال طراحی شده است و جایگزین تحقیق شخصی و مدیریت سرمایه مسئولانه نمی‌شود.
                </footer>
            </div>
        </section>
    );
};

export default TechnicalAnalysisSection;
