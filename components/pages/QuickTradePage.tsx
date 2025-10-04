import React from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { BitcoinIcon } from '../icons/BitcoinIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { BankIcon } from '../icons/BankIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { BoltIcon } from '../icons/BoltIcon';
import { DesktopComputerIcon } from '../icons/DesktopComputerIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';

/**
 * A card component for displaying a single deposit method.
 * It shows an icon, title, details, and optional tags, and can be disabled.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.icon - The icon for the deposit method.
 * @param {string} props.title - The title of the deposit method.
 * @param {string} [props.details] - Additional details like transfer limits or speed.
 * @param {string} [props.description] - A longer description for the method.
 * @param {string} [props.tag] - An optional tag (e.g., "New").
 * @param {boolean} [props.instant] - If true, shows a "bolt" icon indicating an instant transaction.
 * @param {boolean} [props.disabled=false] - If true, the card is visually disabled and non-interactive.
 * @returns {JSX.Element} A button component styled as a deposit method card.
 */
const DepositMethodCard = ({ icon, title, details, tag, instant, disabled = false, description }: {
    icon: React.ReactNode;
    title: string;
    details?: string;
    description?: string;
    tag?: string;
    instant?: boolean;
    disabled?: boolean;
}) => {
    return (
        <button
            disabled={disabled}
            className={`w-full flex items-center justify-between text-right p-4 rounded-xl transition-colors ${
                disabled 
                ? 'bg-neo-dark-3 opacity-50 cursor-not-allowed' 
                : 'bg-neo-dark-2 hover:bg-neo-dark-3 focus:outline-none focus:ring-2 focus:ring-neo-green focus:ring-offset-2 focus:ring-offset-neo-dark-1'
            }`}
        >
            <div className="flex items-center gap-4 flex-grow">
                <div className="bg-neo-dark-3 p-3 rounded-lg flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    {icon}
                </div>
                <div className="flex-grow">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{title}</p>
                        {tag && <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">{tag}</span>}
                    </div>
                    {details && (
                        <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                            {details}
                            {instant && <BoltIcon className="w-4 h-4 text-blue-500" />}
                        </p>
                    )}
                     {description && (
                        <p className="text-sm text-gray-400 mt-0.5">{description}</p>
                    )}
                </div>
            </div>
            <ChevronLeftIcon className="h-6 w-6 text-gray-500" />
        </button>
    );
};

/**
 * Renders a page for selecting a deposit method, categorized into "Crypto" and "Toman".
 * This page acts as a gateway for users to add funds to their account.
 *
 * @param {object} props - The component props.
 * @param {() => void} props.onBack - Callback function to navigate to the previous screen.
 * @returns {JSX.Element} The deposit method selection page.
 */
const QuickTradePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {

    const cryptoMethods = [
        {
            icon: <BitcoinIcon className="w-7 h-7 text-gray-300" />,
            title: 'واریز رمزارز',
            description: 'واریز به کیف پول از طریق شبکه بلاکچین',
        },
    ];

    const tomanMethods = [
         {
            icon: <CreditCardIcon className="w-7 h-7 text-gray-300" />,
            title: 'کارت به کارت',
            details: 'تا ۱۰ میلیون تومان | کمتر از ۱۰ دقیقه',
        },
         {
            icon: <BankIcon className="w-7 h-7 text-gray-300" />,
            title: 'بانکی (پایا - ساتنا)',
            details: 'بیشتر از ۱۰ میلیون تومان | سیکل‌های پایا و ساتنا',
        },
        {
            icon: <UserCircleIcon className="w-7 h-7 text-gray-300" />,
            title: 'حساب به حساب',
            details: 'بیشتر از ۱۰ میلیون تومان | کمتر از ۱۰ دقیقه',
            tag: 'جدید',
        },
        {
            icon: <CreditCardIcon className="w-7 h-7 text-gray-300" />,
            title: 'واریز مستقیم',
            details: 'تا ۱۵ میلیون تومان | در لحظه',
            instant: true,
        },
        {
            icon: <DesktopComputerIcon className="w-7 h-7 text-gray-300" />,
            title: 'درگاه آنلاین',
            details: 'تا ۲۵ میلیون تومان | در لحظه',
            instant: true,
            disabled: true,
        },
    ];

    return (
        <div className="pt-4 h-screen flex flex-col bg-neo-dark-1 text-white">
            <header className="flex items-center justify-between mb-8 px-4">
                <div className="w-8"></div>
                <h1 className="text-xl font-bold text-white">انتخاب روش واریز</h1>
                <button onClick={onBack} className="p-2 text-gray-300 hover:text-neo-green">
                    <ArrowLeftIcon className="w-7 h-7" />
                </button>
            </header>

            <div className="flex-grow overflow-y-auto space-y-6 px-4 pb-4">
                <div>
                    <h2 className="text-sm font-semibold text-gray-400 mb-3 text-right px-2">رمزارزی</h2>
                    {cryptoMethods.map((method, i) => (
                        <DepositMethodCard key={i} {...method} />
                    ))}
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-gray-400 mb-3 text-right px-2">تومانی</h2>
                    <div className="space-y-3">
                        {tomanMethods.map((method, i) => (
                            <DepositMethodCard key={i} {...method} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickTradePage;