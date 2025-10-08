
import React, { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { StarIcon } from './icons/StarIcon';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import type { PortfolioReturnInsight } from './MarketOverview';

export type HighlightTone = 'up' | 'down' | 'neutral' | 'info' | 'alert';

/**
 * Represents a piece of contextual information displayed within a tab.
 * Used to show dynamic data like portfolio returns or new item counts.
 */
export interface TabHighlight {
  /** A unique identifier for the highlight. */
  id: string;
  /** The label for the highlight (e.g., "Daily Return"). */
  label?: string;
  /** The value of the highlight (e.g., "+2.4%"). */
  value?: string;
  /** The visual tone, affecting the color scheme. */
  tone?: HighlightTone;
  /** An optional icon to display with the highlight. */
  icon?: React.ReactNode;
  /** An optional badge, often used for "NEW" tags. */
  badge?: string;
}

/**
 * Props for the FilterTabs component.
 */
interface FilterTabsProps {
  /** The name of the currently active tab. */
  activeTab: string;
  /** Callback function triggered when a tab is changed. */
  onTabChange: (tabName: string) => void;
  /** Optional array of portfolio return insights to be displayed in the "Portfolio" tab. */
  portfolioReturns?: PortfolioReturnInsight[];
  /** A record mapping tab names to an array of highlights to be displayed within them. */
  tabHighlights?: Record<string, TabHighlight[]>;
  /** The ID of the tab panel this tab list controls, for ARIA accessibility. */
  tabPanelId?: string;
  /** Callback to pass the generated ID of the active tab button for ARIA labeling. */
  onActiveTabIdChange?: (tabId: string) => void;
}

const baseHighlightClasses =
  'filter-tab-highlight text-[rgb(var(--filter-highlight-text))] backdrop-blur-sm';

const highlightToneClasses: Record<HighlightTone, string> = {
  up: 'border-emerald-400/60 shadow-[0_0_18px_rgba(16,185,129,0.35)]',
  down: 'border-rose-400/60 shadow-[0_0_18px_rgba(244,63,94,0.3)]',
  neutral: '',
  info: 'border-sky-400/60 shadow-[0_0_18px_rgba(56,189,248,0.35)]',
  alert: 'border-amber-400/60 shadow-[0_0_18px_rgba(251,191,36,0.35)]',
};

const highlightToneDotClasses: Record<HighlightTone, string> = {
  up: 'bg-emerald-400',
  down: 'bg-rose-400',
  neutral: 'bg-slate-200',
  info: 'bg-sky-400',
  alert: 'bg-amber-400',
};

const highlightValueToneClasses: Record<HighlightTone, string> = {
  up: 'text-[rgb(var(--filter-highlight-value-up))]',
  down: 'text-[rgb(var(--filter-highlight-value-down))]',
  neutral: 'text-[rgb(var(--filter-highlight-text))]',
  info: 'text-[rgb(var(--filter-highlight-value-info))]',
  alert: 'text-[rgb(var(--filter-highlight-value-alert))]',
};

const getHighlightScore = (highlight: TabHighlight): number => {
  let score = 0;

  switch (highlight.tone) {
    case 'alert':
      score += 50;
      break;
    case 'info':
      score += 40;
      break;
    case 'up':
    case 'down':
      score += 30;
      break;
    default:
      score += 10;
  }

  if (highlight.value) {
    score += 10;
  }

  if (highlight.badge) {
    score += 5;
  }

  return score;
};

const selectPrimaryHighlight = (highlights: TabHighlight[]): TabHighlight | null => {
  if (highlights.length === 0) {
    return null;
  }

  return [...highlights].sort((a, b) => getHighlightScore(b) - getHighlightScore(a))[0];
};

/**
 * Renders a set of filter tabs for the main dashboard.
 * This component is highly dynamic, capable of displaying contextual "highlights"
 * (like portfolio returns or new item counts) within each tab. It manages its own
 * state for scrolling the active tab into view and ensures keyboard accessibility
 * for navigation.
 *
 * @param {FilterTabsProps} props - The component props.
 * @returns {JSX.Element} A responsive and accessible tab system.
 */
const FilterTabs: React.FC<FilterTabsProps> = ({
  activeTab,
  onTabChange,
  portfolioReturns,
  tabHighlights,
  tabPanelId,
  onActiveTabIdChange,
}) => {
  const tabs = [
    {
      name: 'ایده‌ها',
      icon: <StarIcon className="h-5 w-5" />,
      description: 'ایده‌های تحلیلی منتخب بر اساس روند بازار',
    },
    {
      name: 'داغ‌ترین‌ها',
      icon: null,
      badge: 'NEW',
      description: 'نمادهای پربازده و پرتقاضا در ساعات اخیر',
    },
    {
      name: 'پورتفوی من',
      icon: <ChartPieIcon className="h-5 w-5" />,
      description: 'نمای کلی از ارزش و بازده پرتفو شخصی شما',
    },
    {
      name: 'نمای بازار',
      icon: <ChartBarIcon className="h-5 w-5" />,
      description: 'وضعیت شاخص‌ها و صنایع منتخب بازار سرمایه',
    },
  ];

  const idPrefix = useId();
  const tabIds = useMemo(
    () => tabs.map((_, index) => `${idPrefix}-${index}`),
    [idPrefix, tabs.length],
  );
  const activeIndex = tabs.findIndex((tab) => tab.name === activeTab);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledInitially = useRef(false);

  useEffect(() => {
    if (activeIndex >= 0) {
      onActiveTabIdChange?.(tabIds[activeIndex]);
    }
  }, [activeIndex, onActiveTabIdChange, tabIds]);

  const focusTabAtIndex = useCallback(
    (nextIndex: number) => {
      const clampedIndex = ((nextIndex % tabs.length) + tabs.length) % tabs.length;
      const nextTab = tabs[clampedIndex];
      if (!nextTab) {
        return;
      }
      onTabChange(nextTab.name);
      const focusTarget = () => {
        tabRefs.current[clampedIndex]?.focus();
      };
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.requestAnimationFrame(focusTarget);
      } else {
        focusTarget();
      }
    },
    [onTabChange, tabs],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          focusTabAtIndex(index + 1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          focusTabAtIndex(index - 1);
          break;
        case 'Home':
          event.preventDefault();
          focusTabAtIndex(0);
          break;
        case 'End':
          event.preventDefault();
          focusTabAtIndex(tabs.length - 1);
          break;
        default:
      }
    },
    [focusTabAtIndex, tabs.length],
  );

  const dailyReturn = useMemo(
    () =>
      portfolioReturns?.find(
        (insight) =>
          insight.id === 'today' ||
          insight.label.includes('امروز') ||
          insight.label.includes('روز'),
      ),
    [portfolioReturns],
  );

  const weeklyReturn = useMemo(
    () =>
      portfolioReturns?.find(
        (insight) => insight.id === 'week' || insight.label.includes('هفته'),
      ),
    [portfolioReturns],
  );

  const portfolioBadges = useMemo(() => {
    const badges: {
      id: string;
      label: string;
      value: string;
      trend: HighlightTone;
    }[] = [];

    if (dailyReturn) {
      const tone: HighlightTone =
        dailyReturn.trend === 'up'
          ? 'up'
          : dailyReturn.trend === 'down'
            ? 'down'
            : 'neutral';

      badges.push({
        id: 'daily',
        label: 'روزانه',
        value: dailyReturn.value,
        trend: tone,
      });
    }

    if (weeklyReturn) {
      const tone: HighlightTone =
        weeklyReturn.trend === 'up'
          ? 'up'
          : weeklyReturn.trend === 'down'
            ? 'down'
            : 'neutral';

      badges.push({
        id: 'weekly',
        label: 'هفتگی',
        value: weeklyReturn.value,
        trend: tone,
      });
    }

    return badges.slice(0, 1);
  }, [dailyReturn, weeklyReturn]);

  const combinedHighlights = useMemo(() => {
    const map: Record<string, TabHighlight[]> = { ...(tabHighlights ?? {}) };

    if (portfolioBadges.length > 0) {
      const mergedPortfolioHighlights = [
        ...(map['پورتفوی من'] ?? []),
        ...portfolioBadges.map(({ id, label, value, trend }) => ({
          id: `portfolio-${id}`,
          label,
          value,
          tone: trend,
        })),
      ];

      map['پورتفوی من'] = mergedPortfolioHighlights;
    }

    return map;
  }, [portfolioBadges, tabHighlights]);

  const activeTabHighlightsSignature = useMemo(() => {
    const highlightsForActiveTab = combinedHighlights[activeTab] ?? [];
    return highlightsForActiveTab
      .map((highlight) =>
        [highlight.id, highlight.label, highlight.value, highlight.badge, highlight.tone].join('-'),
      )
      .join('|');
  }, [activeTab, combinedHighlights]);

  const ensureActiveTabVisible = useCallback(
    (behaviorOverride?: ScrollBehavior) => {
      if (typeof window === 'undefined') {
        return;
      }

      const container = containerRef.current;
      const activeButton = activeIndex >= 0 ? tabRefs.current[activeIndex] : null;

      if (!container || !activeButton) {
        return;
      }

      const containerScrollable = container.scrollWidth > container.clientWidth + 4;

      if (!containerScrollable) {
        hasScrolledInitially.current = true;
        return;
      }

      const isMobileViewport = window.matchMedia
        ? window.matchMedia('(max-width: 768px)').matches
        : containerScrollable;

      if (!isMobileViewport && hasScrolledInitially.current) {
        return;
      }

      const behavior = behaviorOverride ?? 'smooth';

      const scrollHandler = () => {
        if (typeof activeButton.scrollIntoView === 'function') {
          try {
            activeButton.scrollIntoView({
              block: 'nearest',
              inline: containerScrollable ? 'center' : 'nearest',
              behavior,
            });
          } catch (error) {
            activeButton.scrollIntoView({ block: 'nearest', behavior });
          }
        } else {
          const containerWidth = container.clientWidth;
          const targetOffset =
            activeButton.offsetLeft - (containerWidth - activeButton.offsetWidth) / 2;
          container.scrollTo({
            left: Math.max(0, targetOffset),
            behavior,
          });
        }

        hasScrolledInitially.current = true;
      };

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(scrollHandler);
      } else {
        scrollHandler();
      }
    },
    [activeIndex],
  );

  useEffect(() => {
    ensureActiveTabVisible();
  }, [ensureActiveTabVisible, activeTabHighlightsSignature]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      ensureActiveTabVisible('auto');
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ensureActiveTabVisible]);

  const renderTabContent = (
    tab: { name: string; icon?: React.ReactNode; badge?: string | null; description?: string },
    highlights: TabHighlight[],
    isActive: boolean,
  ) => {
    const labelColorClass = isActive
      ? 'text-[rgb(var(--tabs-active-text))]'
      : 'text-[rgb(var(--filter-highlight-text))]';

    const header = (
      <div className="flex items-center justify-between gap-2">
        <span
          className={clsx(
            'flex items-center gap-1.5 text-sm font-semibold sm:text-base',
            labelColorClass,
          )}
        >
          <span>{tab.name.trim()}</span>
          {tab.icon}
        </span>
        {tab.badge && (
          <span
            className={clsx(
              'rounded-md bg-[color:var(--filter-highlight-chip-strong-bg)] px-2 py-0.5 text-xs font-bold',
              labelColorClass,
            )}
          >
            {tab.badge}
          </span>
        )}
      </div>
    );

    if (highlights.length === 0) {
      return (
        <div className="flex h-full w-full flex-col justify-between gap-3 text-right">
          {header}
          {tab.description && (
            <p className="text-xs leading-5 text-[rgb(var(--filter-highlight-subtext))] sm:text-sm">
              {tab.description}
            </p>
          )}
        </div>
      );
    }

    const primaryHighlight = selectPrimaryHighlight(highlights);

    if (!primaryHighlight) {
      return (
        <div className="flex h-full w-full flex-col justify-between gap-3 text-right">
          {header}
          {tab.description && (
            <p className="text-xs leading-5 text-[rgb(var(--filter-highlight-subtext))] sm:text-sm">
              {tab.description}
            </p>
          )}
        </div>
      );
    }

    const { id, label, value, tone = 'neutral', icon, badge } = primaryHighlight;

    return (
      <div className="flex h-full w-full flex-col justify-between gap-3 text-right">
        {header}
        <div
          key={id}
          className={clsx(
            'flex min-h-[3.25rem] items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-sm font-semibold leading-tight',
            baseHighlightClasses,
            highlightToneClasses[tone],
          )}
        >
          <div className="flex min-w-0 items-center gap-1.5 text-[0.72rem] font-medium text-[rgb(var(--filter-highlight-subtext))] sm:text-xs">
            <span className={`h-2 w-2 rounded-full ${highlightToneDotClasses[tone]}`} />
            {label && (
              <span className="filter-tab-highlight__label max-w-[8.5rem] truncate text-[rgb(var(--filter-highlight-text))] sm:max-w-[10rem]">
                {label}
              </span>
            )}
            {badge && (
              <span className="rounded-full bg-[color:var(--filter-highlight-chip-subtle-bg)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[rgb(var(--filter-highlight-text))]">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-base font-bold text-[rgb(var(--filter-highlight-text))] sm:text-lg">
            {icon && (
              <span className="flex items-center text-sm text-[rgb(var(--filter-highlight-text))] opacity-90">
                {icon}
              </span>
            )}
            <span
              className={clsx(
                'filter-tab-highlight__value max-w-[8.5rem] truncate text-right tracking-tight sm:max-w-[10rem]',
                highlightValueToneClasses[tone],
              )}
            >
              {value ?? label ?? '—'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-2.5">
      <div
        ref={containerRef}
        className="neo-animate-inline flex items-stretch gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory sm:flex-wrap sm:justify-between sm:gap-3 sm:overflow-visible md:grid md:grid-cols-2 md:gap-3 md:[&>*]:min-w-0 lg:grid-cols-4"
        role="tablist"
        aria-label="بخش‌های داشبورد"
      >
        {tabs.map((tab, index) => {
          const highlightsForTab = combinedHighlights[tab.name] ?? [];
          const tabId = tabIds[index];
          const isActive = activeTab === tab.name;

          return (
            <button
              key={index}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={tabPanelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.name)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={clsx(
                'filter-tabs__button group relative flex h-full min-w-[11.5rem] flex-none flex-col items-stretch justify-between rounded-3xl border px-4 py-3 text-right text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neo-green/60 snap-center sm:min-w-[13rem] sm:text-base md:w-full md:min-w-0',
                isActive && 'is-active',
                highlightsForTab.length > 0 ? 'min-h-[7.5rem]' : 'min-h-[6.5rem]',
              )}
            >
              {renderTabContent(tab, highlightsForTab, isActive)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterTabs;