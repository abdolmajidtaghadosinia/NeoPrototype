

import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { GoogleGenAI, Type } from '@google/genai';
import { PortfolioSlice, PortfolioAnalysisData } from '../types';
import { toPersianDigits } from './formatters';

const mockAnalysisData: PortfolioAnalysisData = {
    radarData: [
        { subject: 'ارزش', score: 75 },
        { subject: 'نقدشوندگی', score: 85 },
        { subject: 'ثبات', score: 60 },
        { subject: 'کارایی هزینه', score: 70 },
        { subject: 'پتانسیل رشد', score: 90 },
        { subject: 'بازده', score: 80 },
        { subject: 'ریسک', score: 88 },
        { subject: 'تنوع', score: 65 },
    ],
    portfolioGrowth: '+۱۵٪ تا به امروز',
    riskLevel: 'متوسط',
    averageReturn: '+۲٪',
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    radarData: {
      type: Type.ARRAY,
      description: "An array of 8 objects, each representing a dimension of the portfolio analysis.",
      items: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING, description: "The name of the analysis dimension. Must be one of the following Persian strings: 'ارزش', 'نقدشوندگی', 'ثبات', 'کارایی هزینه', 'پتانسیل رشد', 'بازده', 'ریسک', 'تنوع'." },
          score: { type: Type.INTEGER, description: "The score for this dimension, from 1 to 100." }
        },
        required: ["subject", "score"]
      }
    },
    portfolioGrowth: {
      type: Type.STRING,
      description: "The year-to-date growth of the portfolio as a formatted Persian string (e.g., '+۱۵٪ تا به امروز')."
    },
    riskLevel: {
      type: Type.STRING,
      description: "The overall risk level of the portfolio in Persian (e.g., 'متوسط', 'زیاد', 'کم')."
    },
    averageReturn: {
      type: Type.STRING,
      description: "The average monthly return as a formatted string (e.g., '+۲٪')."
    }
  },
  required: ["radarData", "portfolioGrowth", "riskLevel", "averageReturn"]
};

interface PortfolioAnalysisProps {
  portfolioData: PortfolioSlice[];
}

const PortfolioAnalysis: React.FC<PortfolioAnalysisProps> = ({ portfolioData }) => {
    const [analysis, setAnalysis] = useState<PortfolioAnalysisData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            setIsLoading(true);
            setError(null);

            const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
            if (!apiKey) {
                console.warn('API Key not found. Using mock data.');
                setTimeout(() => {
                    setAnalysis(mockAnalysisData);
                    setIsLoading(false);
                }, 1500);
                return;
            }

            try {
                const ai = new GoogleGenAI({ apiKey });
                const portfolioSummary = portfolioData.map(p => ({ name: p.name, value: p.value }));
                const prompt = `You are a sophisticated financial portfolio analyst. Analyze the following user portfolio data, which contains assets and their percentage allocation.
                
                Portfolio Data: ${JSON.stringify(portfolioSummary)}

                Provide your analysis in a JSON object that conforms to the specified schema. Generate scores from 1 to 100 for the radar chart data. The summary metrics must be concise and in Persian. The 'subject' fields in 'radarData' must also be in Persian, matching the list in the schema. Analyze the portfolio considering factors like the high allocation to gold (Stability), the presence of volatile crypto assets (Risk, Growth Potential), and the mix of stocks/fixed income (Diversification). Provide realistic metrics.
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                         responseMimeType: "application/json",
                         responseSchema: responseSchema,
                         systemInstruction: "You are a helpful financial assistant specializing in portfolio analysis for a Persian-speaking audience. Your JSON output must strictly follow the user's provided schema and all text values, including chart subjects, must be in Persian."
                    }
                });

                const jsonStr = response.text.trim();
                const parsedAnalysis: PortfolioAnalysisData = JSON.parse(jsonStr);
                setAnalysis(parsedAnalysis);

            } catch (err) {
                console.error("Error fetching portfolio analysis:", err);
                setError("تحلیل هوشمند با خطا مواجه شد. لطفاً بعداً تلاش کنید.");
                setAnalysis(mockAnalysisData); // Fallback to mock data on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [portfolioData]);

    if (isLoading) {
        return (
            <div className="bg-neo-dark-2 rounded-2xl p-4 shadow-md my-4 animate-pulse">
                <div className="h-6 bg-gray-700 rounded-md w-1/2 mx-auto mb-4"></div>
                <div className="h-48 bg-gray-800 rounded-full w-48 mx-auto mb-4"></div>
                <div className="flex justify-around">
                    <div className="h-8 bg-gray-700 rounded-md w-1/4"></div>
                    <div className="h-8 bg-gray-700 rounded-md w-1/4"></div>
                    <div className="h-8 bg-gray-700 rounded-md w-1/4"></div>
                </div>
            </div>
        );
    }
    
    if (error && !analysis) {
        return (
             <div className="bg-neo-dark-2 rounded-2xl p-4 shadow-md my-4 text-center">
                 <p className="text-red-500 font-semibold">{error}</p>
             </div>
        );
    }
    
    if (!analysis) return null;
    
    return (
        <div className="bg-neo-dark-2 rounded-2xl p-4 shadow-md my-4" aria-labelledby="portfolio-analysis-title">
            <h2 id="portfolio-analysis-title" className="text-xl font-bold text-center text-white mb-4">تحلیل پورتفوی</h2>
            <div className="w-full h-64">
                <ResponsiveContainer>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysis.radarData}>
                        <PolarGrid stroke="#4A4A4A" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#A0A0A0', fontSize: 12, fontWeight: 500 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar 
                            name="Portfolio" 
                            dataKey="score" 
                            stroke="#D7FE43" 
                            fill="#D7FE43" 
                            fillOpacity={0.4} 
                            dot={{ stroke: '#D7FE43', fill: '#1C1C1E', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#D7FE43', fill: 'white', strokeWidth: 2 }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-2 text-center">
                 <div>
                    <p className="text-sm text-gray-400">رشد پورتفو</p>
                    <p className="font-bold text-neo-green text-lg">{toPersianDigits(analysis.portfolioGrowth)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">سطح ریسک</p>
                    <p className="font-bold text-white text-lg">{analysis.riskLevel}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">میانگین بازده ماهانه</p>
                    <p className="font-bold text-neo-green text-lg">{toPersianDigits(analysis.averageReturn)}</p>
                </div>
            </div>
        </div>
    );
};

export default PortfolioAnalysis;
