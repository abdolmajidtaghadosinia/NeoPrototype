import type { MarketAsset } from '@/types';

import { stockAssets } from './stocks';
import { fundAssets } from './funds';
import { currencyAssets } from './currencies';
import { commodityAssets } from './commodities';

export const staticMarketData: MarketAsset[] = [
  ...stockAssets,
  ...fundAssets,
  ...currencyAssets,
  ...commodityAssets,
];
