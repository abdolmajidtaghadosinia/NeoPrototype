

import React, { useCallback } from 'react';
import { NewsArticle } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { AiIcon } from '../icons/AiIcon';
import { toPersianDigits } from '../formatters';
import { composePageShell, composeSurfaceClasses, SurfacePadding, SurfaceTone } from '../designSystem';

/**
 * Props for the NewsArticlePage component.
 */
interface NewsArticlePageProps {
  /** The news article object to be displayed. */
  article: NewsArticle;
  /** Callback function to navigate back to the previous view. */
  onBack: () => void;
  /** Callback function to trigger an AI analysis of the article. */
  onAnalyze: (article: NewsArticle) => void;
}

/**
 * Renders a full-page view of a single news article.
 * This component displays the article's image, title, summary, and full content.
 * It includes metadata like source and category, and provides a button
 * to trigger an AI-powered analysis of the article content.
 *
 * @param {NewsArticlePageProps} props - The component props.
 * @returns {JSX.Element} The news article page component.
 */
const NewsArticlePage: React.FC<NewsArticlePageProps> = ({ article, onBack, onAnalyze }) => {
  const surface = useCallback(
    (extra = '', tone: SurfaceTone = 'base', padding: SurfacePadding = 'md') =>
      composeSurfaceClasses(tone, padding, extra),
    [],
  );

  return (
    <div className={composePageShell('pt-4 h-screen flex flex-col bg-neo-dark-1 text-white', 'narrow')}>
      <header className="flex items-center justify-between mb-4 px-4">
        <div className="w-8"></div>
        <h1 className="text-xl font-bold text-white text-center truncate px-2">{article.title}</h1>
        <button onClick={onBack} className="p-2 text-gray-300 hover:text-neo-green flex-shrink-0">
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-grow overflow-y-auto pb-24 px-4 space-y-4">
        <img src={article.imageUrl} alt={article.title} className="w-full h-56 object-cover rounded-xl" />

        <div className={surface('bg-neo-dark-2', 'muted', 'md')}>
          <h2 className="text-2xl font-bold text-white text-right mb-3">{article.title}</h2>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-4 pb-4 border-b border-gray-800">
             <span className="bg-amber-500/20 text-amber-400 font-semibold px-3 py-1 rounded-full text-xs">{article.category}</span>
             <div className="flex items-center gap-2">
                 <p>{article.source}</p>
                 <div className="flex items-center gap-1">
                     <span>{toPersianDigits(article.time)}</span>
                     <ClockIcon className="w-4 h-4"/>
                 </div>
              </div>
          </div>
          <p className="text-gray-300 text-base leading-loose text-right">
            {article.summary}
          </p>
          <div className="mt-4 space-y-4 text-right">
            {article.content.map((paragraph, index) => (
              <p key={index} className="text-gray-300 text-base leading-loose">
                {paragraph}
              </p>
            ))}
          </div>
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 self-end text-sm font-semibold text-neo-green transition hover:text-neo-green/80"
            >
              مشاهده منبع اصلی
            </a>
          )}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-neo-dark-1/90 backdrop-blur-sm p-4 border-t border-gray-800">
          <button 
            onClick={() => onAnalyze(article)} 
            className="w-full max-w-md mx-auto flex items-center justify-center gap-2 py-3.5 px-4 bg-neo-green text-black font-bold rounded-xl text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-neo-green/20"
          >
            <AiIcon className="w-6 h-6"/>
            <span>تحلیل با هوش مصنوعی</span>
          </button>
      </div>
    </div>
  );
};

export default NewsArticlePage;
