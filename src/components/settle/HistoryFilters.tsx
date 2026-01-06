'use client';

export type HistoryFilter = 'ALL' | 'WON' | 'LOST' | 'H2H';

interface HistoryFiltersProps {
  activeFilter: HistoryFilter;
  onFilterChange: (filter: HistoryFilter) => void;
}

const FILTERS: HistoryFilter[] = ['ALL', 'WON', 'LOST', 'H2H'];

export function HistoryFilters({
  activeFilter,
  onFilterChange,
}: HistoryFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
      {FILTERS.map((filter) => {
        const isSelected = filter === activeFilter;
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`
              px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap
              transition-colors border
              ${
                isSelected
                  ? 'border-sb-orange text-sb-orange'
                  : 'border-white/30 text-white hover:border-white/50'
              }
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
