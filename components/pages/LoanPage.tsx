import React, { useState, useMemo, useCallback } from 'react';
import { Loan } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { TetherIcon } from '../icons/TetherIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { ExclamationCircleIcon } from '../icons/ExclamationCircleIcon';
import { toPersianDigits, toPersianFormatted } from '../formatters';
import { composeSurfaceClasses, SurfacePadding, SurfaceTone } from '../designSystem';
import AssetIcon, { deriveAssetSymbol } from '../AssetIcon';

interface PortfolioAsset {
    id: string;
    name: string;
    type: 'stock' | 'fund' | 'commodity';
    icon: string;
    balance: number; 
    unit: string; 
    pricePerUnitToman: number;
    ltv: number; 
}

// Mock data representing the user's portfolio with more details for calculation
const userPortfolio: PortfolioAsset[] = [
    { id: 'khodro', name: 'سهام خودرو', type: 'stock', icon: '🚗', balance: 540, unit: 'سهم', pricePerUnitToman: 2120, ltv: 55 },
    { id: 'webmelat', name: 'سهام وبملت', type: 'stock', icon: '🏦', balance: 120, unit: 'سهم', pricePerUnitToman: 3210, ltv: 58 },
    { id: 'kamand', name: 'صندوق درآمدثابت کمند', type: 'fund', icon: '📈', balance: 50, unit: 'واحد', pricePerUnitToman: 11000, ltv: 75 },
    { id: 'ayar', name: 'صندوق طلا عیار', type: 'commodity', icon: '💰', balance: 25, unit: 'واحد', pricePerUnitToman: 153200, ltv: 70 },
    { id: 'goldcoin', name: 'سکه تمام بهار', type: 'commodity', icon: '🪙', balance: 6, unit: 'عدد', pricePerUnitToman: 35500000, ltv: 60 },
];

const portfolioVariantMap: Record<PortfolioAsset['type'], NonNullable<React.ComponentProps<typeof AssetIcon>['variant']>> = {
    stock: 'stock',
    fund: 'fund',
    commodity: 'commodity',
};

const formatToman = (n: number): string => {
    return toPersianFormatted(n);
};

/**
 * Renders the loan application page.
 * This component allows users to specify a loan amount and duration,
 * select an asset from their portfolio as collateral, and view the
 * required collateral amount based on the asset's LTV (Loan-to-Value) ratio.
 * It provides real-time validation to ensure the user has sufficient balance.
 *
 * @param {object} props - The component props.
 * @param {() => void} props.onBack - A callback function to handle navigating back to the previous page.
 * @returns {JSX.Element} The loan application page component.
 */
const LoanPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const minAmount = 5000000;
    const maxAmount = 100000000;

    const [loan, setLoan] = useState<Omit<Loan, 'collateral' | 'ltv'>>({
        amount: 50000000,
        duration: 6,
    });
    const [collateralType, setCollateralType] = useState<'commodity' | 'stock' | 'fund' | ''>('');
    const [selectedAssetId, setSelectedAssetId] = useState<string>('');
    
    const filteredAssets = useMemo(() => {
        if (!collateralType) return [];
        return userPortfolio.filter(asset => asset.type === collateralType);
    }, [collateralType]);

    const selectedAsset = useMemo(() => {
        return userPortfolio.find(asset => asset.id === selectedAssetId) || null;
    }, [selectedAssetId]);

    const requiredCollateral = useMemo(() => {
        if (!selectedAsset) return { toman: 0, units: 0 };

        const requiredToman = loan.amount / (selectedAsset.ltv / 100);
        const requiredUnits = requiredToman / selectedAsset.pricePerUnitToman;
        return {
            toman: requiredToman,
            units: requiredUnits,
        };
    }, [loan.amount, selectedAsset]);

    const hasSufficientBalance = useMemo(() => {
        if (!selectedAsset) return false;
        return selectedAsset.balance >= requiredCollateral.units;
    }, [selectedAsset, requiredCollateral.units]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoan({ ...loan, amount: Number(e.target.value) });
    };

    const handleDurationChange = (duration: 3 | 6 | 9) => {
        setLoan({ ...loan, duration });
    };

    const handleCollateralTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCollateralType(e.target.value as any);
        setSelectedAssetId(''); // Reset selected asset when type changes
    };

    const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAssetId(e.target.value);
    };
    
    const increaseAmount = () => {
        setLoan(prev => ({ ...prev, amount: Math.min(prev.amount + 1000000, maxAmount) }));
    };

    const decreaseAmount = () => {
        setLoan(prev => ({ ...prev, amount: Math.max(prev.amount - 1000000, minAmount) }));
    };

    const surface = useCallback(
        (extra = '', tone: SurfaceTone = 'base', padding: SurfacePadding = 'md') =>
            composeSurfaceClasses(tone, padding, extra),
        [],
    );

    return (
        <div className="pt-4 h-screen flex flex-col bg-neo-dark-1 text-white">
            <header className="flex items-center justify-between mb-4 px-0">
                <div className="w-8"></div>
                <h1 className="text-xl font-bold text-white">دریافت وام</h1>
                <button onClick={onBack} className="p-2 text-gray-300 hover:text-neo-green">
                    <ArrowLeftIcon className="w-7 h-7" />
                </button>
            </header>

            <div className="flex-grow overflow-y-auto pb-8">
                
                <div className={surface('mt-4 bg-neo-dark-2', 'muted', 'sm')}>
                    <p className="font-bold text-gray-200 text-right mb-4 text-lg">مبلغ وام درخواستی</p>

                    <div className="flex items-center justify-between mb-3">
                         <button onClick={decreaseAmount} className="w-10 h-10 flex items-center justify-center bg-neo-dark-3 rounded-full text-2xl text-gray-300 hover:bg-neo-dark-1">-</button>
                         <p className="text-3xl font-bold text-white">{formatToman(loan.amount)} <span className="text-lg font-medium text-gray-400">تومان</span></p>
                         <button onClick={increaseAmount} className="w-10 h-10 flex items-center justify-center bg-neo-dark-3 rounded-full text-2xl text-gray-300 hover:bg-neo-dark-1">+</button>
                    </div>

                    <div className="mb-6">
                        <input type="range" min={minAmount} max={maxAmount} value={loan.amount} onChange={handleAmountChange} step="1000000" className="w-full h-2 bg-neo-dark-3 rounded-lg appearance-none cursor-pointer accent-neo-green" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>{formatToman(minAmount)} تومان</span>
                            <span>{formatToman(maxAmount)} تومان</span>
                        </div>
                    </div>

                    <div className="mb-4">
                         <p className="text-right text-sm font-semibold text-gray-300 mb-2">مدت زمان بازپرداخت</p>
                         <div className="flex items-center bg-neo-dark-3 rounded-xl p-1">
                            {[9, 6, 3].map(month => (
                                <button key={month} onClick={() => handleDurationChange(month as 3|6|9)} className={`w-full py-2.5 text-sm font-bold rounded-lg transition-colors ${loan.duration === month ? 'bg-neo-green text-black shadow-md' : 'text-gray-400'}`}>
                                    {toPersianDigits(month)} ماهه
                                </button>
                            ))}
                         </div>
                    </div>
                </div>

                <div className={surface('mt-4 bg-neo-dark-2', 'muted', 'sm')}>
                     <p className="font-bold text-gray-200 text-right mb-4 text-lg">انتخاب وثیقه</p>
                     
                    <div className="space-y-3">
                         <div className="relative">
                             <label className="text-right text-sm font-semibold text-gray-300 mb-2 block">۱. نوع وثیقه</label>
                             <select onChange={handleCollateralTypeChange} value={collateralType} className="w-full appearance-none text-right bg-neo-dark-3 rounded-lg p-3 pr-4 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-neo-green">
                                <option value="">انتخاب کنید...</option>
                                <option value="commodity">طلا و سکه</option>
                                <option value="stock">سهام</option>
                                <option value="fund">صندوق</option>
                             </select>
                             <ChevronDownIcon className="absolute left-4 top-11 w-5 h-5 text-gray-400 pointer-events-none" />
                         </div>
                         <div className="relative">
                             <label className="text-right text-sm font-semibold text-gray-300 mb-2 block">۲. دارایی</label>
                             <select onChange={handleAssetChange} value={selectedAssetId} disabled={!collateralType || filteredAssets.length === 0} className="w-full appearance-none text-right bg-neo-dark-3 rounded-lg p-3 pr-4 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-neo-green disabled:bg-neo-dark-3/50 disabled:text-gray-500 disabled:cursor-not-allowed">
                                <option value="">انتخاب کنید...</option>
                                {filteredAssets.map(asset => (
                                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                                ))}
                             </select>
                             <ChevronDownIcon className="absolute left-4 top-11 w-5 h-5 text-gray-400 pointer-events-none" />
                         </div>
                    </div>
                     
                     {selectedAsset && (
                         <div className="text-right border-t border-gray-700 pt-4 mt-4 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 font-semibold text-gray-100">
                                    <AssetIcon
                                        icon={selectedAsset.icon}
                                        name={selectedAsset.name}
                                        symbol={deriveAssetSymbol(selectedAsset.name)}
                                        size="xs"
                                        variant={portfolioVariantMap[selectedAsset.type]}
                                    />
                                    <span>{selectedAsset.name}</span>
                                </span>
                                <span className="text-gray-400">دارایی انتخابی</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold">{toPersianDigits(selectedAsset.ltv)}٪</span>
                                <span className="text-gray-400">نسبت ارزش به وام (LTV)</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-neo-green">{toPersianDigits(requiredCollateral.units.toLocaleString('en-US', {maximumFractionDigits: 6}))} {selectedAsset.unit}</span>
                                <span className="text-gray-400">وثیقه مورد نیاز</span>
                            </div>
                             <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>(معادل {formatToman(Math.round(requiredCollateral.toman))} تومان)</span>
                                <span>موجودی شما: {toPersianDigits(selectedAsset.balance.toLocaleString())} {selectedAsset.unit}</span>
                            </div>
                         </div>
                     )}
                </div>
                
                <div className="mt-6 space-y-3">
                    {!hasSufficientBalance && selectedAsset && (
                        <div className="flex items-center justify-end p-3 bg-red-500/20 text-red-400 rounded-lg gap-2">
                            <p className="font-medium text-sm">موجودی برای این وثیقه کافی نیست</p>
                            <ExclamationCircleIcon className="w-5 h-5"/>
                        </div>
                    )}
                    <button 
                        className="w-full bg-neo-green text-black font-bold py-4 rounded-xl text-lg hover:bg-opacity-90 transition-colors disabled:bg-neo-dark-3 disabled:text-gray-500 disabled:cursor-not-allowed"
                        disabled={!selectedAsset || !hasSufficientBalance}
                    >
                        ثبت درخواست وام
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoanPage;
