import React, { useState, useMemo, useEffect } from 'react';
import { BellIcon } from './icons/BellIcon';
import { WalletSolidIcon } from './icons/WalletSolidIcon';
import { UserIcon } from './icons/UserIcon';
import { MenuIcon } from './icons/MenuIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import TradeList, { TradeRecord } from './TradeList';
import { composeNavItemClasses } from './designSystem';

const sampleTrades: TradeRecord[] = [
  { id: '1', type: 'buy', asset: 'فولاد', amount: 0, price: 0, status: 'ongoing', time: 'لحظاتی پیش' },
  { id: '2', type: 'sell', asset: 'خودرو', amount: 0, price: 0, status: 'done', time: '۲ ساعت پیش' },
  {
    id: '3',
    type: 'buy',
    asset: '',
    amount: 0,
    price: 0,
    status: 'ongoing',
    time: 'دیروز',
    description: 'درخواست واریز ۵۰۰,۰۰۰ تومان',
  },
  {
    id: '4',
    type: 'sell',
    asset: '',
    amount: 0,
    price: 0,
    status: 'done',
    time: 'هفته پیش',
    description: 'تسویه ۱,۰۰۰,۰۰۰ تومان',
  },
];

type SecondaryMenuItem = 'profile' | 'alerts' | 'wallet' | 'settings' | 'logout';

interface SecondaryMenuProps {
  activeItem?: SecondaryMenuItem | null;
  onProfile?: () => void;
  onAlerts?: () => void;
  onWallet?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  onTradeClick?: (trade: TradeRecord) => void;
}

const SecondaryMenu: React.FC<SecondaryMenuProps> = ({
  activeItem,
  onProfile,
  onAlerts,
  onWallet,
  onSettings,
  onLogout,
  onTradeClick,
}) => {
  const [active, setActive] = useState<SecondaryMenuItem | null>(activeItem ?? null);

  useEffect(() => {
    if (activeItem !== undefined) {
      setActive(activeItem ?? null);
    }
  }, [activeItem]);

  const menuItems = useMemo<
    ReadonlyArray<{
      id: SecondaryMenuItem;
      label: string;
      icon: React.ReactNode;
      onClick?: () => void;
    }>
  >(
    () => [
      { id: 'profile', label: 'پروفایل', icon: <UserIcon className="w-7 h-7" />, onClick: onProfile },
      { id: 'alerts', label: 'اعلان‌ها', icon: <BellIcon className="w-7 h-7" />, onClick: onAlerts },
      { id: 'wallet', label: 'کیف پول', icon: <WalletSolidIcon className="w-7 h-7" />, onClick: onWallet },
      { id: 'settings', label: 'تنظیمات', icon: <MenuIcon className="w-7 h-7" />, onClick: onSettings },
      { id: 'logout', label: 'خروج', icon: <LogoutIcon className="w-7 h-7" />, onClick: onLogout },
    ],
    [onProfile, onAlerts, onWallet, onSettings, onLogout]
  );

  const handleClick = (id: SecondaryMenuItem, onClick?: () => void) => {
    setActive(id);
    onClick?.();
  };

  return (
    <aside className="hidden md:flex fixed top-0 left-0 flex-col w-56 h-screen bg-neo-dark-2 border-r border-gray-800 px-5 py-6">
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            aria-current={active === item.id ? 'page' : undefined}
            onClick={() => handleClick(item.id, item.onClick)}
            className={composeNavItemClasses('inline', active === item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-auto border-t border-gray-800 px-2 overflow-y-auto">
        <TradeList
          trades={sampleTrades}
          limit={4}
          onSelectTrade={onTradeClick}
          variant="compact"
          showTime={false}
        />
      </div>
    </aside>
  );
};

export default SecondaryMenu;
