import React, { memo, useState } from 'react';
import SurfaceCard from './layout/SurfaceCard';
import { metricDescription } from './designSystem';

const PremiumSection: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <SurfaceCard tone="muted" padding="lg" className="rounded-3xl space-y-5">
      <header className="space-y-2 text-right">
        <h3 className="text-lg font-bold text-[rgb(var(--neo-text-strong))]">اشتراک پرمیوم</h3>
        <p className={metricDescription}>
          با فعال‌سازی پرمیوم به تحلیل‌های پیشرفته بازار سرمایه ایران، هشدارهای شخصی‌سازی شده و گزارش‌های اختصاصی دسترسی خواهید داشت.
        </p>
      </header>

      <div className="grid gap-3 text-sm text-[rgb(var(--neo-text-secondary))] sm:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--neo-divider-color)] bg-[color:var(--neo-surface-bg)] px-4 py-3">
          <p className="font-semibold text-[rgb(var(--neo-text-strong))]">آزمایش رایگان ۷ روزه</p>
          <p className="mt-1 text-xs text-[rgb(var(--neo-text-muted))]">در صورت لغو اشتراک قبل از پایان دوره هیچ هزینه‌ای پرداخت نمی‌کنید.</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--neo-divider-color)] bg-[color:var(--neo-surface-bg)] px-4 py-3">
          <p className="font-semibold text-[rgb(var(--neo-text-strong))]">گزارش‌های روزانه پرتفوی</p>
          <p className="mt-1 text-xs text-[rgb(var(--neo-text-muted))]">هر روز صبح خلاصه وضعیت دارایی‌ها و پیشنهادهای برتر را دریافت کنید.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowInstructions((prev) => !prev)}
        className="w-full rounded-full bg-[rgb(var(--neo-accent))] py-2.5 text-sm font-bold text-[rgb(var(--neo-accent-ink))] transition hover:brightness-105"
      >
        {showInstructions ? 'پنهان کردن مراحل فعال‌سازی' : 'نحوه فعال‌سازی پرمیوم'}
      </button>

      {showInstructions && (
        <ol className="list-decimal space-y-2 pr-6 text-right text-sm text-[rgb(var(--neo-text-secondary))]">
          <li>در پرتال کارگزاری، بخش خدمات جانبی را باز کنید.</li>
          <li>فرم «درخواست سرویس پرمیوم رایا» را تکمیل و مبلغ اشتراک را واریز کنید.</li>
          <li>رسید واریز را در بخش پشتیبانی بارگذاری کنید تا دسترسی شما ظرف حداکثر ۲۴ ساعت فعال شود.</li>
        </ol>
      )}

      <footer className="text-xs text-[rgb(var(--neo-text-muted))]">
        برای دریافت تخفیف سازمانی یا پشتیبانی بیشتر با ایمیل{' '}
        <span className="font-semibold text-[rgb(var(--neo-text-secondary))]">support@raya.finance</span> در تماس باشید.
      </footer>
    </SurfaceCard>
  );
};

export default memo(PremiumSection);
