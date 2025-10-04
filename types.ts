import React from 'react';

export interface Stock {
  id: number | string;
  name: string;
  value: number | string;
  status: 'buy' | 'sell' | 'up' | 'down';
  change?: string;
  chartData: { name: string; value: number }[];
  statusText?: string;
}

export interface PortfolioSlice {
  name: string;
  value: number;
  color: string;
  amount?: string;
  icon?: string;
  dailyChange?: number;
}

export interface LeaderboardUser {
  id: number;
  name:string;
  profit: number;
  followers: number;
  winRate: number;
  risk: 'کم' | 'متوسط' | 'زیاد';
  rank: number;
  picture: string;
  // New gamification fields
  rankChange: 'up' | 'down' | 'stable';
  weeklyProfitValue: number; // in Toman
  favoriteAsset: {
      id: string;
      name: string;
      icon: string;
  };
}

export type NavTab = 'home' | 'search' | 'swap' | 'wallet' | 'social';

export interface PerformanceData {
  change: number;
  chartData: { name: string; value: number }[];
}

export interface MarketAsset {
  id: string;
  name: string;
  category: 'بورس' | 'صندوق‌ها' | 'ارزها' | 'کالا';
  icon: string | React.ReactNode;
  price: string;
  aliases?: string[];
  description: string;
  marketCap: string;
  volume24h: string;
  circulatingSupply: string;
  performance: {
    daily: PerformanceData;
    weekly: PerformanceData;
    monthly: PerformanceData;
    yearly: PerformanceData;
  };
  rsi?: number;
}

export type MarketSessionStatus = 'open' | 'closed' | 'pre' | 'post';

export interface MarketSession {
  id: string;
  market: string;
  city: string;
  timezone: string;
  status: MarketSessionStatus;
  openTime: string;
  closeTime: string;
  localTime: string;
  note?: string;
}

export type SignalStance = 'bullish' | 'bearish' | 'neutral';

export interface TechnicalSignalInsight {
  id: string;
  label: string;
  stance: SignalStance;
  value: string;
  detail: string;
  timeframe: 'کوتاه‌مدت' | 'میان‌مدت' | 'بلندمدت';
}

export interface AiAction {
  label: string;
  type: 'view_profile' | 'trade';
  assetId: string;
}

export interface Message {
    role: 'user' | 'model';
    text: string;
    actions?: AiAction[];
}

export interface MarketSummaryDetails {
  volume: string;
  value: string;
  positiveCount: number;
  negativeCount: number;
  buyQueueValue: string;
  sellQueueValue: string;
}

export interface MarketSummaryItem {
  id: string;
  name: string;
  icon: string;
  performance: {
    daily: { value: string; change: number; chartData: { name: string; value: number }[] };
    weekly: { value: string; change: number; chartData: { name: string; value: number }[] };
    monthly: { value: string; change: number; chartData: { name: string; value: number }[] };
    yearly: { value: string; change: number; chartData: { name: string; value: number }[] };
  };
  details?: MarketSummaryDetails;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  logo?: string;
  address: string;
  decimals: number;
}

export interface Loan {
  amount: number;
  duration: 3 | 6 | 9;
  collateral: 'سهام' | 'صندوق' | 'طلا';
  ltv: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  recurringDeposit?: {
    amount: number;
    frequency: 'weekly' | 'monthly';
  };
}

export interface LoanStatus {
  id: string;
  name: string;
  icon: string;
  totalAmount: number;
  paidAmount: number;
  installmentAmount: number;
  nextPaymentDate: string;
  interestRate: number; 
  remainingInstallments: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  loans: LoanStatus[];
}

export interface NewsArticle {
  id: string;
  category: 'بورس' | 'جهان';
  title: string;
  summary: string;
  source: string;
  time: string;
  imageUrl: string;
  content: string[];
  relatedAssets?: string[];
  url?: string;
}

export interface IdeaComment {
  id: string;
  user: {
    name: string;
    picture: string;
  };
  text: string;
  timestamp: string;
}

export interface TradingIdea {
  id: string;
  user: {
    id: number;
    name: string;
    picture: string;
    isPremium?: boolean;
  };
  asset: {
    id: string;
    name: string;
    icon: string;
  };
  type: 'bullish' | 'bearish';
  title: string;
  description: string;
  likes: number;
  comments: number;
  predictionTimeframe: string;
  commentsData: IdeaComment[];
  userHasLiked?: boolean;
}

export interface PortfolioAnalysisData {
  radarData: { subject: string; score: number }[];
  portfolioGrowth: string;
  riskLevel: string;
  averageReturn: string;
}

export interface FollowedActivity {
  id: string;
  user: {
    id: number;
    name: string;
    picture: string;
  };
  type: 'trade_buy' | 'trade_sell' | 'new_idea';
  asset: {
    id: string;
    name: string;
    icon: string;
  };
  timestamp: string;
  details?: string; // e.g., the title of the idea
  tradeAmount?: number;
  tradeUnit?: string;
  tradePrice?: number;
  tradePriceCurrency?: 'ریال' | 'تومان';
}

export interface Trade {
  id: string;
  type: 'buy' | 'sell';
  asset: {
    id: string;
    name: string;
    icon: string;
  };
  amount: number;
  unit: string;
  pricePerUnit: number;
  currency: 'تومان' | 'ریال';
  timestamp: string;
}

export interface MarketMapStock {
  name: string;
  change: number; // e.g., 33.47 or -0.09
  size: 'xl' | 'lg' | 'md' | 'sm';
  id?: string;
}

export interface MarketMapSector {
  name: string;
  stocks: MarketMapStock[];
}

export type View =
  | { page: 'main'; tab: NavTab; section?: 'news' }
  | { page: 'trade'; payload: { asset: MarketAsset; action: 'buy' | 'sell' } }
  | { page: 'loan' }
  | { page: 'alerts' }
  | { page: 'assetProfile'; payload: { asset: MarketAsset } }
  | { page: 'publicProfile'; payload: { user: LeaderboardUser } }
  | { page: 'profile'; payload: { user: User; section?: 'settings' } }
  | { page: 'idea'; payload: { idea: TradingIdea } }
  | { page: 'quickTrade' }
  | { page: 'news'; payload: { article: NewsArticle } };