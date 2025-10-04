
import React, { useMemo, useState, memo } from 'react';
import { NewsArticle } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { toPersianDigits } from './formatters';

interface NewsSectionProps {
  news: NewsArticle[];
  onArticleSelect: (article: NewsArticle) => void;
  title?: string;
}

const NewsSection: React.FC<NewsSectionProps> = ({ news, onArticleSelect, title = 'اخبار و تحلیل‌ها' }) => {
  type NewsCategory = 'بورس' | 'کریپتو' | 'جهان';
  const [activeTab, setActiveTab] = useState<NewsCategory>('بورس');

  const newsCategories: NewsCategory[] = ['بورس', 'کریپتو', 'جهان'];

  const generateMockArticles = (count: number, category: NewsCategory): NewsArticle[] =>
    Array.from({ length: count }).map((_, i) => ({
      id: `mock-${category}-${i}`,
      category,
      title: `خبر آزمایشی ${i + 1}`,
      summary: 'این یک متن آزمایشی برای پر کردن لیست اخبار است.',
      source: 'منبع آزمایشی',
      time: 'همین حالا',
      imageUrl: `https://picsum.photos/seed/${category}-mock-${i}/400/400`,
    }));

  const filteredNews = useMemo(
    () => news.filter((article) => article.category === activeTab),
    [activeTab, news]
  );

  const articles = useMemo(() => {
    if (filteredNews.length === 0) {
      return generateMockArticles(5, activeTab);
    }
    if (filteredNews.length < 5) {
      return [
        ...filteredNews,
        ...generateMockArticles(5 - filteredNews.length, activeTab),
      ];
    }
    return filteredNews.slice(0, 5);
  }, [activeTab, filteredNews]);

  const [featuredArticle, ...secondaryArticles] = articles;

  const orderedArticles = useMemo(
    () =>
      [featuredArticle, ...secondaryArticles].filter(
        (article): article is NewsArticle => Boolean(article)
      ),
    [featuredArticle, secondaryArticles]
  );

  const formatMeta = (article: NewsArticle) => (
    <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-400">
      <span className="inline-flex items-center rounded-full border border-gray-700/70 bg-neo-dark-1/70 px-2.5 py-0.5 text-[11px] text-gray-300">
        {article.source}
      </span>
      <span className="flex flex-row-reverse items-center gap-1">
        <ClockIcon className="h-3.5 w-3.5" />
        <span>{toPersianDigits(article.time)}</span>
      </span>
    </div>
  );

  const resolveImage = (article?: NewsArticle, fallbackSeed = 'news') => {
    if (!article) {
      return `https://picsum.photos/seed/${fallbackSeed}/600/400`;
    }
    return article.imageUrl || `https://picsum.photos/seed/${article.id}/600/400`;
  };

  return (
    <div className="rounded-3xl border border-gray-800/70 bg-gradient-to-br from-neo-dark-1/90 via-neo-dark-2/90 to-neo-dark-3/90 p-6 shadow-[0_28px_60px_-35px_rgba(0,0,0,0.75)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-semibold text-neo-green">تازه‌ترین رویدادها</span>
          <h2 className="mt-2 text-lg font-bold text-white md:text-xl">{title}</h2>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-gray-800/70 bg-neo-dark-1/70 p-1">
          {newsCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                activeTab === cat
                  ? 'bg-neo-green text-black shadow-[0_10px_25px_-15px_rgba(215,254,67,0.9)]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {orderedArticles.map((article, index) => (
          <button
            key={article.id}
            type="button"
            onClick={() => onArticleSelect(article)}
            className="group block w-full text-right"
          >
            <div
              className={`flex flex-col gap-6 rounded-[1.75rem] border border-gray-800/70 bg-gradient-to-br from-neo-dark-2/70 via-neo-dark-3/60 to-neo-dark-4/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-gray-600/70 hover:shadow-[0_30px_80px_-45px_rgba(0,0,0,0.85)] ${
                index === 0
                  ? 'lg:flex-row-reverse lg:items-stretch lg:p-8'
                  : 'lg:flex-row-reverse lg:items-center'
              }`}
            >
              <div
                className={`relative overflow-hidden rounded-3xl border border-gray-800/60 bg-black/30 shadow-inner transition-transform duration-500 group-hover:shadow-[0_25px_60px_-40px_rgba(0,0,0,0.9)] ${
                  index === 0
                    ? 'h-48 w-full lg:h-auto lg:min-h-[18rem] lg:w-2/5'
                    : 'h-36 w-full lg:h-40 lg:w-56'
                }`}
              >
                <img
                  src={resolveImage(article, index === 0 ? 'featured' : 'secondary')}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                <span className="absolute bottom-3 left-3 rounded-full border border-gray-700/60 bg-black/40 px-3 py-1 text-[11px] font-medium text-gray-200">
                  {article.category}
                </span>
              </div>

              <div className={`flex-1 space-y-3 ${index === 0 ? 'lg:space-y-4' : ''}`}>
                <h3
                  className={`font-bold leading-8 text-white ${
                    index === 0 ? 'text-lg md:text-xl' : 'text-base md:text-lg'
                  }`}
                >
                  {article.title}
                </h3>
                <p
                  className={`text-sm leading-7 text-gray-300 ${
                    index === 0 ? 'md:text-[15px]' : 'text-xs md:text-sm'
                  }`}
                >
                  {article.summary}
                </p>
                {formatMeta(article)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(NewsSection);
