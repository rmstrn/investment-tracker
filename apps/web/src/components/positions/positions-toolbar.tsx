'use client';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SegmentedControl,
} from '@investment-tracker/ui';
import { ChevronDown, Filter } from 'lucide-react';

export type SortOption = 'value_desc' | 'pnl_desc' | 'alpha';
export type GroupOption = 'symbol' | 'account' | 'asset_type';
export type AssetFilter = 'all' | 'stock' | 'etf' | 'crypto';

export interface PositionsToolbarProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  group: GroupOption;
  onGroupChange: (group: GroupOption) => void;
  filter: AssetFilter;
  onFilterChange: (filter: AssetFilter) => void;
}

const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: 'value_desc', label: 'Value' },
  { value: 'pnl_desc', label: 'P&L' },
  { value: 'alpha', label: 'A-Z' },
];

const GROUP_LABELS: Record<GroupOption, string> = {
  symbol: 'Symbol',
  account: 'Account',
  asset_type: 'Asset type',
};

const FILTER_LABELS: Record<AssetFilter, string> = {
  all: 'All assets',
  stock: 'Stocks',
  etf: 'ETFs',
  crypto: 'Crypto',
};

const TRIGGER_CLASS =
  'inline-flex items-center gap-1 rounded-full border border-border-default bg-background-secondary px-3 h-8 text-sm text-text-primary hover:bg-background-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

export function PositionsToolbar({
  sort,
  onSortChange,
  group,
  onGroupChange,
  filter,
  onFilterChange,
}: PositionsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Sort</span>
        <SegmentedControl
          size="sm"
          options={SORT_OPTIONS}
          value={sort}
          onChange={onSortChange}
          label="Sort positions"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
          Group
        </span>
        <Dropdown>
          <DropdownTrigger className={TRIGGER_CLASS} aria-label="Group positions by">
            {GROUP_LABELS[group]} <ChevronDown size={14} aria-hidden="true" />
          </DropdownTrigger>
          <DropdownMenu>
            {(Object.keys(GROUP_LABELS) as GroupOption[]).map((g) => (
              <DropdownItem key={g} onClick={() => onGroupChange(g)}>
                {GROUP_LABELS[g]}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="ml-auto">
        <Dropdown>
          <DropdownTrigger className={TRIGGER_CLASS} aria-label="Filter positions by asset type">
            <Filter size={14} aria-hidden="true" /> {FILTER_LABELS[filter]}
          </DropdownTrigger>
          <DropdownMenu>
            {(Object.keys(FILTER_LABELS) as AssetFilter[]).map((f) => (
              <DropdownItem key={f} onClick={() => onFilterChange(f)}>
                {FILTER_LABELS[f]}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
