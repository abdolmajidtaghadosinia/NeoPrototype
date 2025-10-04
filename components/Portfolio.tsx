
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PortfolioSlice } from '../types';
import { toPersianDigits } from './formatters';

// Helper function to determine if a color is dark
const isColorDark = (hexColor: string): boolean => {
    if (!hexColor || !hexColor.startsWith('#')) return false;

    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hexColor = hexColor.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    if (!result) return false;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luma < 128; // Threshold for considering a color "dark"
};

interface PortfolioProps {
  data: PortfolioSlice[];
  totalValue?: number;
  changePercentage?: number;
  showCenterText?: boolean;
  showPercentageOnLabel?: boolean;
  onQuickTradeClick?: () => void;
  onSliceClick?: (sliceData: PortfolioSlice) => void;
  variant?: 'default' | 'highlight';
  centerTitle?: string;
  centerValue?: string;
  centerSubtitle?: string;
  centerValueTone?: 'positive' | 'negative' | 'neutral';
}

interface CustomLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  name?: string;
  percent?: number;
  dailyChange?: number;
  showPercentageOnLabel?: boolean;
  isHighlight?: boolean;
  color?: string;
  payload?: {
    color?: string;
    fill?: string;
    [key: string]: unknown;
  };
}

const CustomLabel: React.FC<CustomLabelProps> = (props) => {
    const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        name,
        percent,
        dailyChange,
        showPercentageOnLabel,
        isHighlight,
        color,
        payload,
    } = props;
    if (cx === undefined || cy === undefined || midAngle === undefined || innerRadius === undefined || outerRadius === undefined || name === undefined || percent === undefined) {
        return null;
    }
    
    const RADIAN = Math.PI / 180;

    // Position for inner label (name & portfolio percentage)
    const innerRadiusPoint = innerRadius + (outerRadius - innerRadius) * 0.5;
    const innerX = cx + innerRadiusPoint * Math.cos(-midAngle * RADIAN);
    const innerY = cy + innerRadiusPoint * Math.sin(-midAngle * RADIAN);

    // Position for outer label (daily change)
    const labelRadius = outerRadius + 25; // Increase distance from chart for readability
    const textX = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const textY = cy + labelRadius * Math.sin(-midAngle * RADIAN);

    const lineStartRadius = outerRadius + 2;
    const lineEndRadius = outerRadius + 20; // Make the line longer to reach the text
    const lineStartX = cx + lineStartRadius * Math.cos(-midAngle * RADIAN);
    const lineStartY = cy + lineStartRadius * Math.sin(-midAngle * RADIAN);
    const lineEndX = cx + lineEndRadius * Math.cos(-midAngle * RADIAN);
    const lineEndY = cy + lineEndRadius * Math.sin(-midAngle * RADIAN);

    const sliceColor = color ?? payload?.color ?? payload?.fill;

    let finalLabelColor = isHighlight ? '#1C1C1E' : 'white';
    if (isHighlight && sliceColor && isColorDark(sliceColor)) {
        finalLabelColor = 'white';
    }


    // Special label for PublicProfilePage
    if (showPercentageOnLabel) {
        return (
            <text x={innerX} y={innerY} fill={finalLabelColor} textAnchor="middle" dominantBaseline="central" className="text-base font-bold pointer-events-none">
                {toPersianDigits(Math.round(percent * 100))}%
            </text>
        );
    }

    const isPositive = dailyChange !== undefined && dailyChange >= 0;
    const changeColor = isPositive ? (isHighlight ? '#365314' : '#D7FE43') : '#ef4444'; // Dark green on light background
    const parts = name.split(' ');
    const lineColor = isHighlight ? '#4A4A4A' : "#9ca3af";

    return (
        <g>
            {/* Inner label: Name and portfolio percentage */}
            <text x={innerX} y={innerY} fill={finalLabelColor} textAnchor="middle" dominantBaseline="central" className="text-[11px] sm:text-xs font-semibold leading-tight pointer-events-none">
                <tspan x={innerX} dy={parts.length > 1 ? '-0.8em' : '-0.5em'}>{parts[0]}</tspan>
                {parts.length > 1 && <tspan x={innerX} dy="1.2em">{parts.slice(1).join(' ')}</tspan>}
                <tspan x={innerX} dy="1.3em" className="font-bold opacity-80">{toPersianDigits(Math.round(percent * 100))}%</tspan>
            </text>
            
            {/* Outer label: Daily change */}
            {dailyChange !== undefined && (
                <>
                    <line x1={lineStartX} y1={lineStartY} x2={lineEndX} y2={lineEndY} stroke={lineColor} strokeWidth="1" />
                    <text
                        x={textX + (textX > cx ? 3 : -3)}
                        y={textY}
                        fill={changeColor}
                        textAnchor={textX > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-xs font-bold"
                    >
                      {`${isPositive ? '+' : ''}${toPersianDigits(dailyChange.toFixed(1))}%`}
                    </text>
                </>
            )}
        </g>
    );
};


const Portfolio: React.FC<PortfolioProps> = ({
  data,
  totalValue,
  changePercentage,
  showCenterText = true,
  showPercentageOnLabel = false,
  onQuickTradeClick,
  onSliceClick,
  variant = 'default',
  centerTitle,
  centerValue,
  centerSubtitle,
  centerValueTone = 'neutral',
}) => {
  const isHighlight = variant === 'highlight';
  const centerTitleClass = isHighlight ? 'text-black/70' : 'text-gray-400';
  const centerSubtitleClass = isHighlight ? 'text-black/60' : 'text-gray-400';
  const centerValueClass = centerValueTone === 'positive'
    ? (isHighlight ? 'text-black' : 'text-neo-green')
    : centerValueTone === 'negative'
      ? 'text-red-500'
      : (isHighlight ? 'text-black/70' : 'text-white');
  return (
    <div className={`${isHighlight ? 'bg-neo-green text-black' : 'bg-neo-dark-3 text-white'} relative w-full rounded-2xl p-4`}>
      {onQuickTradeClick && showCenterText && (
        <button onClick={onQuickTradeClick} className="absolute top-4 right-4 bg-black text-white px-3 py-1.5 rounded-full text-xs font-semibold z-20">
            معامله سریع
        </button>
      )}

      {showCenterText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10 px-4">
            {centerTitle || centerValue || centerSubtitle ? (
                <>
                    {centerTitle && (
                        <h2 className={`text-lg font-semibold mb-1 ${centerTitleClass}`}>
                            {centerTitle}
                        </h2>
                    )}
                    {centerValue && (
                        <p className={`text-3xl font-black ${centerValueClass}`}>
                            {centerValue}
                        </p>
                    )}
                    {centerSubtitle && (
                        <p className={`mt-2 text-xs font-medium ${centerSubtitleClass}`}>
                            {centerSubtitle}
                        </p>
                    )}
                </>
            ) : onQuickTradeClick ? (
                <>
                    <h2 className={`text-xl font-bold ${isHighlight ? 'text-black/80' : 'text-gray-200'}`}>ارزش پورتفو</h2>
                    {totalValue !== undefined && (
                        <p className={`text-xl font-bold ${isHighlight ? 'text-black' : 'text-white'} mt-1`}>
                          {toPersianDigits(totalValue.toLocaleString('fa-IR'))}
                          <span className={`text-base font-medium ${isHighlight ? 'text-black/60' : 'text-gray-400'} mr-1`}>تومان</span>
                        </p>
                    )}
                </>
            ) : (
                <>
                    <h2 className={`text-lg font-semibold ${isHighlight ? 'text-black/70' : 'text-gray-400'} mb-1`}>عملکرد ۲۴ ساعته</h2>
                    {changePercentage !== undefined && (
                        <p className={`text-3xl font-bold ${
                            changePercentage >= 0
                            ? (isHighlight ? 'text-black' : 'text-neo-green')
                            : 'text-red-500'
                        }`}>
                            {changePercentage >= 0 ? '+' : ''}{toPersianDigits(changePercentage.toFixed(2))}%
                        </p>
                    )}
                </>
            )}
        </div>
      )}
      
      <div className="relative w-full aspect-square max-h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={'43%'}
              outerRadius={'75%'}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={(props) => <CustomLabel {...props} showPercentageOnLabel={showPercentageOnLabel} isHighlight={isHighlight} />}
              onClick={(_, index) => onSliceClick && onSliceClick(data[index])}
              style={{ cursor: onSliceClick ? 'pointer' : 'default' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Portfolio;
