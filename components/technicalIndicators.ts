
/**
 * Calculates the Relative Strength Index (RSI) for a given series of prices.
 * RSI is a momentum indicator that measures the speed and change of price movements.
 *
 * @param {number[]} prices - An array of price points, ordered from oldest to newest.
 * @param {number} [period=14] - The time period to use for the RSI calculation.
 * @returns {number | null} The calculated RSI value (from 0 to 100), or null if there is not enough price data for the given period.
 */
export const calculateRSI = (prices: number[], period: number = 14): number | null => {
    if (prices.length <= period) {
        return null; // Not enough data
    }

    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const initialGains = changes.slice(0, period).filter(change => change > 0).reduce((acc, gain) => acc + gain, 0);
    const initialLosses = changes.slice(0, period).filter(change => change < 0).reduce((acc, loss) => acc - loss, 0);

    let avgGain = initialGains / period;
    let avgLoss = initialLosses / period;

    for (let i = period; i < changes.length; i++) {
        const change = changes[i];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;
        
        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    if (avgLoss === 0) {
        return 100; // RSI is 100 if average loss is zero
    }

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
};
