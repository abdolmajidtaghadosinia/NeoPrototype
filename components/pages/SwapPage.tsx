
import React, { useMemo, useState, useId } from 'react';
import clsx from 'clsx';
import { MarketAsset } from '../../types';
import MarketAssetRow from '../MarketAssetRow';
import MarketAssetRowSkeleton from '../MarketAssetRowSkeleton';
import MarketHighlights from '../MarketHighlights';
import { SearchIcon } from '../icons/SearchIcon';
import { normalizeText } from '../../utils/normalizeText';

/**
 * Props for the SwapPage component.
 */
interface SwapPageProps {
    /** Callback function triggered when a user selects an asset, usually to view its profile. */
    onAssetSelect: (asset: MarketAsset) => void;
    /** An array of all available market assets to be displayed and filtered. */
    allAssets: MarketAsset[];
    /** A boolean indicating if the asset data is currently being loaded. */
    isLoading: boolean;
    /** An error message string if fetching asset data failed, or null otherwise. */
    error: string | null;
}

/**
 * Renders the market browsing page, allowing users to discover and search for assets.
 * The component features a sidebar for category-based filtering and a main content area
 * displaying a list of assets. It includes a powerful search bar that filters across all
 * categories and displays results in real-time.
 *
 * @param {SwapPageProps} props - The component props.
 * @returns {JSX.Element} The market browsing and search page.
 */
const SwapPage: React.FC<SwapPageProps> = ({ onAssetSelect, allAssets, isLoading, error }) => {
    const marketCategories: MarketAsset['category'][] = ['بورس', 'صندوق‌ها', 'ارزها', 'کالا'];
    const [activeCategory, setActiveCategory] = useState<MarketAsset['category']>('بورس');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'highlights'>('list');
    const searchFieldId = useId();
    const helperTextId = `${searchFieldId}-hint`;

    const hasAnyAssets = allAssets.length > 0;

    const marketStatuses = useMemo(() => {
        const statuses: { [key: string]: 'up' | 'down' } = {};
        marketCategories.forEach(category => {
            const assetsInCategory = allAssets.filter(asset => asset.category === category);
            if (assetsInCategory.length > 0) {
                const totalChange = assetsInCategory.reduce((sum, asset) => sum + asset.performance.daily.change, 0);
                const avgChange = totalChange / assetsInCategory.length;
                statuses[category] = avgChange >= 0 ? 'up' : 'down';
            } else {
                statuses[category] = 'up'; // Default for empty categories
            }
        });
        return statuses;
    }, [allAssets, marketCategories]);

    const displayedAssets = useMemo(() => {
        const normalizedQuery = normalizeText(searchQuery);

        if (normalizedQuery) {
            const matchesQuery = (asset: MarketAsset) => {
                const symbolMatch = asset.name.match(/\(([^)]+)\)/);
                const baseName = asset.name.includes('(') ? asset.name.split('(')[0] : asset.name;
                const candidateValues: Array<string> = [asset.name, baseName, asset.id];

                if (symbolMatch) {
                    candidateValues.push(symbolMatch[1]);
                }

                if (asset.aliases?.length) {
                    candidateValues.push(...asset.aliases);
                }

                return candidateValues.some((value) => normalizeText(value).includes(normalizedQuery));
            };

            return allAssets.filter(matchesQuery);
        }

        return allAssets.filter(asset => asset.category === activeCategory);
    }, [searchQuery, activeCategory, allAssets]);

    const isFiltering = Boolean(searchQuery.trim());
    const listPanelId = 'market-view-list';
    const highlightPanelId = 'market-view-highlights';
    const viewTabs: Array<{ id: 'list' | 'highlights'; label: string; description: string }> = [
        {
            id: 'list',
            label: 'فهرست دارایی‌ها',
            description: 'مرور و جستجوی همه نمادهای بازار',
        },
        {
            id: 'highlights',
            label: 'شاخص‌سازان و صندوق‌های طلا',
            description: 'نگاه سریع به نمادهای اثرگذار و صندوق‌های پربازده',
        },
    ];


    const renderListContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <MarketAssetRowSkeleton key={i} />
                    ))}
                </div>
            );
        }
        if (!hasAnyAssets) {
            return (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-sm text-rose-200">
                    {error ? `خطا در دریافت اطلاعات: ${error}` : 'هیچ داده‌ای برای نمایش در دسترس نیست.'}
                </div>
            );
        }

        if (displayedAssets.length === 0) {
            return (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-gray-300">
                    {searchQuery ? `هیچ نتیجه‌ای برای "${searchQuery}" یافت نشد.` : 'دارایی برای نمایش در این دسته وجود ندارد.'}
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {displayedAssets.map(asset => (
                    <button
                        key={asset.id}
                        onClick={() => onAssetSelect(asset)}
                        type="button"
                        className="group w-full rounded-2xl border border-white/8 bg-white/0 text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-neo-green/40 hover:bg-neo-green/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-green/60"
                        aria-label={`مشاهده جزئیات ${asset.name}`}
                    >
                        <MarketAssetRow
                            asset={asset}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6 pb-4 pt-4 lg:flex-row lg:items-start lg:gap-8">
            <aside className="lg:w-72 lg:flex-shrink-0">
                <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-transparent p-5 text-right shadow-[0_24px_60px_-36px_rgba(0,0,0,0.85)] backdrop-blur-sm">
                    <div className="space-y-5">
                        {error && hasAnyAssets && viewMode === 'list' && (
                            <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-right text-[12px] leading-6 text-amber-100">
                                <p className="font-semibold text-amber-200">اتصال زنده بازارها در دسترس نبود.</p>
                                <p className="mt-1 text-amber-100/90">در حال نمایش داده‌های ذخیره‌شده است. لطفاً بعداً دوباره تلاش کنید.</p>
                            </div>
                        )}

                        {viewMode === 'list' ? (
                            <>
                                <div className="space-y-3">
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-[11px] font-medium text-gray-400">جستجو در بازارها</p>
                                        <label htmlFor={searchFieldId} className="text-sm font-semibold text-white">
                                            نماد مدنظر خود را پیدا کنید
                                        </label>
                                    </div>
                                    <div className="group flex flex-row-reverse items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2.5 text-sm transition focus-within:border-neo-green/60 focus-within:bg-black/10 focus-within:shadow-[0_0_0_2px_rgba(107,255,110,0.12)]">
                                        <SearchIcon className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-neo-green" />
                                        <input
                                            id={searchFieldId}
                                            type="text"
                                            placeholder="جستجوی نماد در تمام بازارها..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            aria-describedby={helperTextId}
                                            className="w-full border-none bg-transparent text-right text-sm text-white placeholder:text-gray-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <p id={helperTextId} className="text-[11px] leading-6 text-gray-400">
                                    می‌توانید نام فارسی، انگلیسی یا نماد اختصاری (مثل «فولاد»، «FOOLAD» یا «وبملت») را جستجو کنید. نتایج بر اساس موجودی همه بازارها پیشنهاد می‌شوند.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-400">دسته‌بندی بازارها</span>
                                    {isFiltering && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="rounded-full border border-neo-green/40 bg-neo-green/10 px-3 py-1 text-[10px] font-semibold text-neo-green transition hover:bg-neo-green/15"
                                        >
                                            پاکسازی جستجو
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                                    {marketCategories.map((category) => {
                                        const status = marketStatuses[category];
                                        const isActive = activeCategory === category && !isFiltering;
                                        const statusLabel = status === 'up' ? 'روند صعودی امروز' : 'روند نزولی امروز';

                                        return (
                                            <button
                                                key={category}
                                                type="button"
                                                onClick={() => {
                                                    setActiveCategory(category);
                                                    setSearchQuery('');
                                                }}
                                                aria-pressed={isActive}
                                                className={clsx(
                                                    'group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200',
                                                    isActive
                                                        ? 'border-neo-green/50 bg-neo-green/10 text-neo-green shadow-[0_18px_42px_-24px_rgba(107,255,110,0.75)]'
                                                        : 'border-white/8 bg-white/0 text-gray-200 hover:border-white/18 hover:bg-white/5',
                                                )}
                                            >
                                                <span className="flex flex-col items-end gap-1 text-right">
                                                    <span>{category}</span>
                                                    <span className="text-[10px] font-medium text-gray-400">{statusLabel}</span>
                                                </span>
                                                <span
                                                    className={clsx(
                                                        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition-colors',
                                                        status === 'up'
                                                            ? 'border border-neo-green/35 bg-neo-green/15 text-neo-green'
                                                            : 'border border-rose-400/40 bg-rose-500/15 text-rose-200',
                                                    )}
                                                >
                                                    <span
                                                        className={clsx(
                                                            'h-1.5 w-1.5 rounded-full',
                                                            status === 'up' ? 'bg-neo-green' : 'bg-rose-400',
                                                        )}
                                                    />
                                                    {status === 'up' ? 'مثبت' : 'منفی'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex flex-col items-end gap-1">
                                    <p className="text-[11px] font-medium text-gray-400">گزارش ویژه بازار</p>
                                    <h2 className="text-sm font-semibold text-white">شاخص‌سازان و صندوق‌های طلا</h2>
                                </div>
                                <p className="text-[12px] leading-6 text-gray-300">
                                    این تب به‌روزرسانی تازه‌ای از نمادهای شاخص‌ساز بورس تهران و صندوق‌های کالایی طلا ارائه می‌دهد. با انتخاب هر کارت می‌توانید جزئیات نماد را مشاهده کنید.
                                </p>
                                <ul className="space-y-2 text-[11px] leading-6 text-gray-400">
                                    <li>• مقایسه بازده روزانه تا سالانه بزرگ‌ترین نمادهای شاخص‌ساز</li>
                                    <li>• بررسی عملکرد ۳ تا ۱۲ ماهه صندوق‌های طلایی پرمعامله</li>
                                    <li>• امکان ناوبری سریع به پروفایل هر نماد تنها با یک کلیک</li>
                                </ul>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-neo-green/40 hover:bg-neo-green/10 hover:text-neo-green"
                                >
                                    بازگشت به فهرست دارایی‌ها
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <section className="flex-1">
                <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 text-right shadow-[0_24px_60px_-36px_rgba(0,0,0,0.85)] backdrop-blur-sm sm:p-5">
                    <nav className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" role="tablist" aria-label="حالت نمایش بازار">
                        <div className="flex flex-1 flex-wrap justify-end gap-2">
                            {viewTabs.map((tab) => {
                                const isActive = viewMode === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        id={`market-tab-${tab.id}`}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-controls={tab.id === 'list' ? listPanelId : highlightPanelId}
                                        onClick={() => setViewMode(tab.id)}
                                        className={clsx(
                                            'min-w-[10.5rem] rounded-2xl border px-4 py-3 text-right transition-all duration-200',
                                            isActive
                                                ? 'border-neo-green/55 bg-neo-green/10 text-neo-green shadow-[0_18px_42px_-24px_rgba(107,255,110,0.65)]'
                                                : 'border-white/12 bg-white/0 text-gray-200 hover:border-white/20 hover:bg-white/5',
                                        )}
                                    >
                                        <span className="block text-sm font-semibold">{tab.label}</span>
                                        <span className="mt-1 block text-[11px] leading-5 text-gray-400">{tab.description}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </nav>
                    <div
                        id={viewMode === 'list' ? listPanelId : highlightPanelId}
                        role="tabpanel"
                        aria-labelledby={`market-tab-${viewMode}`}
                        className={clsx(viewMode === 'highlights' ? 'space-y-5' : 'space-y-3')}
                    >
                        {viewMode === 'list'
                            ? renderListContent()
                            : (
                                <MarketHighlights
                                    marketAssets={allAssets}
                                    onAssetSelect={onAssetSelect}
                                />
                            )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SwapPage;
