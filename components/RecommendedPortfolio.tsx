import React from 'react';
import { composeSurfaceClasses } from './designSystem';
import { toPersianDigits } from './formatters';

interface RecommendationItem {
    id: string;
    title: string;
    targetAllocation: number;
    currentAllocation?: number;
    insight: string;
    action: 'increase' | 'decrease' | 'hold';
}

interface RecommendedPortfolioProps {
    totalValue: number;
    recommendations: RecommendationItem[];
}

const surfaceClasses = composeSurfaceClasses('muted', 'lg', 'rounded-3xl space-y-5');

const actionLabels: Record<RecommendationItem['action'], string> = {
    increase: 'افزایش وزن',
    decrease: 'کاهش وزن',
    hold: 'حفظ وضعیت',
};

const actionAccent: Record<RecommendationItem['action'], string> = {
    increase: 'bg-[rgba(var(--neo-success-bg),0.16)] text-[rgb(var(--neo-success-ink))]',
    decrease: 'bg-[rgba(var(--neo-alert-bg),0.18)] text-[rgb(var(--neo-alert-ink))]',
    hold: 'bg-[rgba(var(--neo-info-bg),0.18)] text-[rgb(var(--neo-info-ink))]',
};

const RecommendedPortfolio: React.FC<RecommendedPortfolioProps> = ({ totalValue, recommendations }) => {
    return (
        <section className={surfaceClasses}>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold tracking-wide text-[rgb(var(--neo-text-secondary))]">پیشنهاد هوش مصنوعی</p>
                    <h2 className="mt-1 text-lg font-bold text-[rgb(var(--neo-text-strong))] sm:text-xl">پورتفوی پیشنهادی امروز</h2>
                </div>
                <span className="shrink-0 rounded-full border border-[rgba(var(--neo-accent-ink),0.25)] bg-[rgba(var(--neo-accent),0.08)] px-4 py-1 text-xs font-semibold text-[rgb(var(--neo-accent-ink))]">
                    ارزش کل: {toPersianDigits(totalValue.toLocaleString())} تومان
                </span>
            </div>

            <p className="text-sm leading-6 text-[rgb(var(--neo-text-secondary))]">
                تحلیل‌گر نئواب با توجه به رفتار معاملاتی اخیر و وضعیت بازار، ترکیب زیر را برای حداکثرسازی بازدهی و کنترل ریسک پیشنهاد می‌کند. نسبت‌ها برای پایان امروز معتبر هستند.
            </p>

            <div className="space-y-4">
                {recommendations.map((item) => (
                    <article
                        key={item.id}
                        className="rounded-2xl border border-[color:var(--neo-surface-border)] bg-[color:var(--neo-surface-ghost-bg)] px-4 py-3 shadow-[var(--neo-surface-shadow)] transition-transform duration-200 hover:-translate-y-0.5"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-[rgb(var(--neo-text-strong))]">{item.title}</span>
                                <span className="text-xs text-[rgb(var(--neo-text-tertiary))]">{item.insight}</span>
                            </div>
                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${actionAccent[item.action]}`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                                {actionLabels[item.action]}
                            </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-[rgb(var(--neo-text-secondary))] sm:grid-cols-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium text-[rgb(var(--neo-text-tertiary))]">هدف پیشنهادی</span>
                                <span className="text-sm font-bold text-[rgb(var(--neo-text-strong))]">{toPersianDigits(item.targetAllocation)}٪</span>
                            </div>
                            {item.currentAllocation !== undefined && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-[rgb(var(--neo-text-tertiary))]">سهم فعلی شما</span>
                                    <span className="text-sm font-semibold">{toPersianDigits(item.currentAllocation)}٪</span>
                                </div>
                            )}
                            <div className="col-span-2 flex flex-col gap-1 sm:col-span-2">
                                <span className="text-[11px] font-medium text-[rgb(var(--neo-text-tertiary))]">توصیه عملیاتی</span>
                                <p className="text-sm leading-6 text-[rgb(var(--neo-text-secondary))]">
                                    {item.action === 'increase' && 'با خرید تدریجی تا پایان روز مقدار سرمایه در این طبقه را افزایش دهید.'}
                                    {item.action === 'decrease' && 'بخشی از موقعیت را آزاد کنید تا نقدینگی لازم برای فرصت‌های کم‌ریسک فراهم شود.'}
                                    {item.action === 'hold' && 'ترکیب فعلی متعادل است؛ صرفاً وضعیت را مانیتور و در صورت تغییر شرایط اقدام کنید.'}
                                </p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default RecommendedPortfolio;
