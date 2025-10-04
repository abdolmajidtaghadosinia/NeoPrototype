
import React from 'react';

interface TechnicalAnalysisGaugeProps {
  value: number; // 0 to 100
  size?: 'large' | 'small';
  color: string;
}

// Function to convert polar coordinates to Cartesian for SVG paths
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
};

// Function to describe an SVG arc path
const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    // To prevent the arc from disappearing at 180 degrees
    if (endAngle >= 180) endAngle = 179.99;
    
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
    return d;
};


const TechnicalAnalysisGauge: React.FC<TechnicalAnalysisGaugeProps> = ({ value, size = 'large', color }) => {
    const isLarge = size === 'large';
    const viewBoxSize = isLarge ? 240 : 120;
    const center = viewBoxSize / 2;
    const radius = isLarge ? 100 : 50;
    const strokeWidth = isLarge ? 20 : 12;
    const needleHeight = isLarge ? 85 : 42;
    const needleBase = isLarge ? 12 : 6;
    const pivotRadius = isLarge ? 10 : 5;
    
    // Angle for the needle, from -90 (left) to 90 (right)
    const angle = (value / 100) * 180 - 90;
    
    // Path for the background arc
    const backgroundArcPath = describeArc(center, center, radius, 0, 180);
    
    // Path for the value arc
    const valueEndAngle = (Math.max(0, Math.min(100, value)) / 100) * 180;
    const valueArcPath = describeArc(center, center, radius, 0, valueEndAngle);
    
    const tickMarks = [];
    for (let i = 0; i <= 10; i++) {
        const tickAngle = i * 18;
        const startPoint = polarToCartesian(center, center, radius + strokeWidth/2 + 2, tickAngle);
        const endPoint = polarToCartesian(center, center, radius + strokeWidth/2 + (isLarge ? 8 : 4), tickAngle);
        tickMarks.push(
            <line 
                key={i} 
                x1={startPoint.x} 
                y1={startPoint.y} 
                x2={endPoint.x} 
                y2={endPoint.y} 
                stroke="#4A4A4A" 
                strokeWidth={i % 5 === 0 ? (isLarge ? 2 : 1.5) : 1}
            />
        );
    }

    return (
        <svg 
            width="100%" 
            viewBox={`0 0 ${viewBoxSize} ${center + 15}`} 
            className="overflow-visible"
            aria-valuenow={value}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
        >
            {/* Ticks */}
            <g>{tickMarks}</g>
            
            {/* Background Arc */}
            <path
                d={backgroundArcPath}
                stroke="#2C2C2E"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
            />
            
            {/* Value Arc */}
            {value > 0 && (
                <path
                    d={valueArcPath}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />
            )}

            {/* Needle */}
            <g transform={`rotate(${angle} ${center} ${center})`}>
                <path 
                    d={`M ${center - needleBase/2} ${center} L ${center + needleBase/2} ${center} L ${center} ${center - needleHeight} Z`}
                    fill="#E5E7EB"
                />
            </g>
            
            {/* Needle Pivot */}
            <circle cx={center} cy={center} r={pivotRadius} fill="#E5E7EB" stroke="#1C1C1E" strokeWidth="2" />
        </svg>
    );
};

export default TechnicalAnalysisGauge;
