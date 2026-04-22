import type { InsightType } from './api/insights';

export const insightTypeLabels: Record<InsightType, string> = {
  diversification: 'Diversification',
  risk: 'Risk',
  performance: 'Performance',
  rebalance: 'Rebalance',
  cost: 'Cost',
  behavioral: 'Behavioral',
};
