import React, { memo } from 'react';
import clsx from 'clsx';
import SideMenu from './SideMenu';
import SecondaryMenu from './SecondaryMenu';
import BottomNav from './BottomNav';
import { NavTab } from '../types';
import type { TradeRecord } from './TradeList';
import { composePageShell } from './designSystem';

interface PageLayoutProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  children: React.ReactNode;
  showBottomNav?: boolean;
  onProfile?: () => void;
  onAlerts?: () => void;
  onWallet?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  onTradeClick?: (trade: TradeRecord) => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
  showBottomNav = true,
  onProfile,
  onAlerts,
  onWallet,
  onSettings,
  onLogout,
  onTradeClick,
}) => (
  <div className="min-h-screen font-sans text-[rgb(var(--neo-text-primary))] transition-colors duration-300 md:pl-[12rem] md:pr-[7.5rem] xl:pl-[14rem] xl:pr-[9rem]">
    <SideMenu activeTab={activeTab} onTabChange={onTabChange} />
    <SecondaryMenu
      onProfile={onProfile}
      onAlerts={onAlerts}
      onWallet={onWallet}
      onSettings={onSettings}
      onLogout={onLogout}
      onTradeClick={onTradeClick}
    />
    <div className="flex flex-col pb-24 md:pb-0">
      <div
        className={clsx(
          composePageShell(
            'w-full max-w-[120rem] mx-auto px-3 sm:px-5 lg:px-8 xl:px-10 2xl:px-12',
          ),
          'pt-6 md:pt-8',
        )}
      >
        {children}
      </div>
      {showBottomNav && (
        <div className="md:hidden">
          <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      )}
    </div>
  </div>
);

export default memo(PageLayout);
