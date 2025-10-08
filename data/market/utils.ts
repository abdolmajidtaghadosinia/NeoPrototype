export const generateChartData = (
  base: number,
  points: number,
  volatility: number,
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly',
) => {
  const data = [] as { name: string; value: number }[];
  let currentVal = base;
  const now = Date.now();

  let intervalMillis: number;
  switch (timeframe) {
    case 'daily':
      intervalMillis = 60 * 60 * 1000;
      break;
    case 'weekly':
      intervalMillis = 24 * 60 * 60 * 1000;
      break;
    case 'monthly':
      intervalMillis = 24 * 60 * 60 * 1000;
      break;
    case 'yearly':
      intervalMillis = 30.44 * 24 * 60 * 60 * 1000;
      break;
    default:
      intervalMillis = 24 * 60 * 60 * 1000;
  }

  const startTimestamp = now - (points - 1) * intervalMillis;

  for (let i = 0; i < points; i += 1) {
    const timestamp = startTimestamp + i * intervalMillis;

    if (i > 0) {
      const change = (Math.random() - 0.5) * volatility * currentVal;
      currentVal += change;
    }

    data.push({
      name: String(Math.round(timestamp)),
      value: Math.max(0, currentVal),
    });
  }

  return data;
};
