import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../components/pages/HomePage';
import AssetProfilePage from '../components/pages/AssetProfilePage';
import LoanPage from '../components/pages/LoanPage';
import LoginPage from '../components/pages/LoginPage';
import NewsArticlePage from '../components/pages/NewsArticlePage';
import ProfilePage from '../components/pages/ProfilePage';
import PublicProfilePage from '../components/pages/PublicProfilePage';
import QuickSellPage from '../components/pages/QuickSellPage';
import QuickTradePage from '../components/pages/QuickTradePage';
import SearchPage from '../components/pages/SearchPage';
import NotificationsPage, { NotificationItem } from '../components/pages/NotificationsPage';
import SocialTradingPage from '../components/pages/SocialTradingPage';
import SwapPage from '../components/pages/SwapPage';
import TradePage from '../components/pages/TradePage';
import TradingIdeaPage from '../components/pages/TradingIdeaPage';
import WalletPage from '../components/pages/WalletPage';
import { staticMarketData, tradingIdeasData, userPortfolioData, leaderboardData, financialNewsData } from '../data/marketData';
import { User } from '../types';

const noop = () => {};

const mockUser: User = {
  id: '1',
  name: 'کاربر آزمایشی',
  email: 'test@example.com',
  picture: 'https://example.com/avatar.png',
  loans: [],
};

describe('Page components render', () => {
  test('HomePage renders', async () => {
    render(
      <HomePage
        onQuickTradeClick={noop}
        onStockSelect={noop}
        onPortfolioSliceSelect={noop}
        onMarketSummarySelect={noop}
        onIdeaSelect={noop}
        marketAssets={staticMarketData}
        isLoading={false}
        tradingIdeas={tradingIdeasData}
        onLikeIdea={noop}
        newsArticles={financialNewsData}
        onNewsSelect={noop}
        onViewAllNews={noop}
      />
    );
    expect(screen.getByText('پورتفوی من')).toBeInTheDocument();
  });

  test('AssetProfilePage renders', () => {
    render(
      <AssetProfilePage
        asset={staticMarketData[0]}
        onBack={noop}
        onBuy={noop}
        onSell={noop}
      />
    );
    expect(screen.getByText(staticMarketData[0].name)).toBeInTheDocument();
  });

  test('LoanPage renders', () => {
    render(<LoanPage onBack={noop} />);
    expect(screen.getByText('ثبت درخواست وام')).toBeInTheDocument();
  });

  test('LoginPage renders', () => {
    render(<LoginPage onLoginSuccess={noop as any} />);
    expect(screen.getByText('به رایا خوش آمدید')).toBeInTheDocument();
  });

  test('NewsArticlePage renders', () => {
    render(
      <NewsArticlePage
        article={financialNewsData[0]}
        onBack={noop}
        onAnalyze={noop}
      />
    );
    expect(
      screen.getAllByText((content) => content.includes(financialNewsData[0].title)).length,
    ).toBeGreaterThan(0);
  });

  test('ProfilePage renders', () => {
    render(<ProfilePage user={mockUser} onBack={noop} />);
    expect(screen.getByText('پروفایل کاربری')).toBeInTheDocument();
  });

  test('PublicProfilePage renders', () => {
    render(<PublicProfilePage user={leaderboardData[0]} onBack={noop} isFollowing={false} onToggleFollow={noop as any} />);
    expect(screen.getByText(/پروفایل/)).toBeInTheDocument();
  });

  test('QuickSellPage renders', () => {
    render(<QuickSellPage asset={userPortfolioData[0]} onBack={noop} />);
    expect(screen.getByText('فروش سریع')).toBeInTheDocument();
  });

  test('QuickTradePage renders', () => {
    render(<QuickTradePage onBack={noop} />);
    expect(screen.getByText('حساب‌های وکالتی فعال')).toBeInTheDocument();
  });

  test('SearchPage renders', () => {
    render(
      <SearchPage
        portfolioAssets={userPortfolioData}
        messages={[]}
        isLoading={false}
        onSubmit={noop}
        onActionClick={noop}
      />
    );
    expect(screen.getByText('دارایی‌های شما')).toBeInTheDocument();
  });

  test('NotificationsPage renders', () => {
    const notifs: NotificationItem[] = [
      { id: 1, type: 'trade', message: 'نمونه', time: 'لحظاتی پیش', read: false },
    ];
    render(
      <NotificationsPage
        notifications={notifs}
        onBack={noop}
        onMarkAllRead={noop}
        onAction={noop as any}
      />
    );
    expect(screen.getByText('اعلان‌ها')).toBeInTheDocument();
  });

  test('SocialTradingPage renders', () => {
    render(
      <SocialTradingPage
        onUserSelect={noop}
        onIdeaSelect={noop}
        onNewsSelect={noop}
        onCopyTrade={noop}
        onAssetSelect={noop}
        tradingIdeas={tradingIdeasData}
        onLikeIdea={noop}
        onAddIdea={noop}
        assets={staticMarketData}
        currentUser={mockUser}
        followedUserIds={[]}
        onToggleFollow={noop}
      />
    );
    expect(screen.getByText('اخبار و تحلیل‌ها')).toBeInTheDocument();
  });

  test('SwapPage renders', () => {
    render(
      <SwapPage
        onAssetSelect={noop}
        allAssets={staticMarketData}
        isLoading={false}
        error={null}
      />
    );
    expect(screen.getByText('بورس')).toBeInTheDocument();
  });

  test('TradePage renders', () => {
    render(
      <TradePage
        assetInfo={{ asset: staticMarketData[0], action: 'buy' }}
        onBack={noop}
      />
    );
    expect(screen.getByText(staticMarketData[0].name)).toBeInTheDocument();
    expect(screen.getByText('چک‌لیست پیش از ارسال')).toBeInTheDocument();
  });

  test('TradingIdeaPage renders', () => {
    render(
      <TradingIdeaPage
        idea={tradingIdeasData[0]}
        onBack={noop}
        onUserSelect={noop}
        onAssetSelect={noop}
        onLikeIdea={noop}
        onAddComment={noop}
      />
    );
    expect(
      screen
        .getAllByText((content) => content.includes(tradingIdeasData[0].title))
        .length,
    ).toBeGreaterThan(0);
  });

  test('WalletPage renders', () => {
    render(
      <WalletPage
        onSellClick={noop}
        onLoanRequestClick={noop}
        onQuickTradeClick={noop}
        onPortfolioSliceSelect={noop}
      />
    );
    expect(screen.getByText('روند ارزش پورتفوی')).toBeInTheDocument();
  });
});
