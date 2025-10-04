import React, { memo, useState } from 'react';

const PremiumSection: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="bg-neo-dark-2 rounded-xl p-4 space-y-4">
      <div className="flex flex-col gap-2 text-right">
        <h3 className="text-lg font-bold text-white">اشتراک پرمیوم</h3>
        <p className="text-sm text-gray-300 leading-6">
          با فعال‌سازی پرمیوم، به تحلیل‌های تخصصی‌تر بازار سرمایه ایران، هشدارهای هوشمند و گزارش‌های اختصاصی دسترسی خواهید داشت.
          این سرویس از طریق قرارداد واریز ریالی به حساب کارگزاری فعال می‌شود.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setShowInstructions((prev) => !prev)}
        className="w-full rounded-lg bg-neo-green py-2 font-semibold text-black transition hover:bg-lime-300"
      >
        {showInstructions ? 'پنهان کردن مراحل' : 'نحوه فعال‌سازی پرمیوم'}
      </button>
      {showInstructions && (
        <ol className="list-decimal space-y-2 pr-6 text-sm text-gray-200">
          <li>در پرتال کارگزاری خود، بخش خدمات جانبی را باز کنید.</li>
          <li>فرم «درخواست سرویس پرمیوم رایا» را تکمیل و مبلغ اشتراک را واریز کنید.</li>
          <li>رسید واریز را در بخش پشتیبانی بارگذاری کنید تا دسترسی شما ظرف حداکثر ۲۴ ساعت فعال شود.</li>
        </ol>
      )}
      <p className="text-xs text-gray-400 text-right">
        برای دریافت تخفیف سازمانی یا پشتیبانی بیشتر با ایمیل <span className="text-neo-green">support@raya.finance</span> در تماس باشید.
      </p>
    </div>
  );
};

export default memo(PremiumSection);
