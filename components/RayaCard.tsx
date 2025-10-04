
import React from 'react';
import { CardNetworkIcon } from './icons/CardNetworkIcon';

const toPersianDigits = (n: string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return n.toString().replace(/[0-9]/g, (w) => persianDigits[parseInt(w)]);
};

const RayaCard: React.FC = () => {
    return (
        <div className="bg-neo-dark-3 text-white rounded-2xl p-5 shadow-lg grid grid-rows-4 h-52 my-4 font-sans">
            {/* Row 1: Bank name and logos */}
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{toPersianDigits('بانک پاسارگاد')}</h3>
                <div className="flex items-center gap-2">
                    <CardNetworkIcon className="w-7 h-7" />
                </div>
            </div>

            {/* Row 2: Card number */}
            <div className="flex justify-between items-center text-2xl font-sans tracking-wider" dir="ltr">
                <span>{toPersianDigits('9709')}</span>
                <span>{toPersianDigits('3670')}</span>
                <span>{toPersianDigits('2940')}</span>
                <span>{toPersianDigits('5022')}</span>
            </div>
            
            {/* Row 3: Expiry and Name */}
            <div className="flex justify-between items-center">
                 <div className="text-right">
                    <p className="font-semibold text-base">{toPersianDigits('نوید امیدیان')}</p>
                </div>
                <div className="text-left">
                    <p className="text-xs opacity-80">{toPersianDigits('انقضا:')}</p>
                    <p className="font-semibold text-base">{toPersianDigits('06/03')}</p>
                </div>
            </div>

            {/* Row 4: Balance */}
            <div className="flex justify-center items-end">
                <p className="font-semibold text-base">{toPersianDigits('موجودی: ۰ تومان')}</p>
            </div>
        </div>
    );
};

export default RayaCard;