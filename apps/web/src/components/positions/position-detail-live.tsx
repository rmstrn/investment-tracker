'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@investment-tracker/ui';
import { usePosition } from '../../hooks/usePosition';
import type { PositionTransactionsPage } from '../../hooks/usePositionTransactions';
import type { Position } from '../../lib/api/positions';
import { PositionHeader } from './position-header';
import { PositionOverviewTab } from './position-overview-tab';
import { PositionPriceChart } from './position-price-chart';
import { PositionTransactionsTab } from './position-transactions-tab';

export interface PositionDetailLiveProps {
  id: string;
  initialPosition: Position;
  initialTransactions?: PositionTransactionsPage;
}

export function PositionDetailLive({
  id,
  initialPosition,
  initialTransactions,
}: PositionDetailLiveProps) {
  const { data } = usePosition({ id, initialData: initialPosition });
  const position = data ?? initialPosition;

  return (
    <div className="space-y-6">
      <PositionHeader position={position} />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="space-y-4">
            <PositionOverviewTab position={position} />
            <PositionPriceChart position={position} />
          </div>
        </TabsContent>
        <TabsContent value="transactions">
          <PositionTransactionsTab positionId={id} initialPage={initialTransactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
