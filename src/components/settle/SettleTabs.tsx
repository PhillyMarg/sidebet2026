'use client';

export type SettleTab = 'balance' | 'judge' | 'history';

interface SettleTabsProps {
  activeTab: SettleTab;
  onTabChange: (tab: SettleTab) => void;
}

const TABS: { key: SettleTab; label: string }[] = [
  { key: 'balance', label: 'BALANCE' },
  { key: 'judge', label: 'JUDGE' },
  { key: 'history', label: 'HISTORY' },
];

export function SettleTabs({ activeTab, onTabChange }: SettleTabsProps) {
  return (
    <div className="flex gap-2 px-4 py-3">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              flex-1 px-4 py-2 rounded-full text-xs font-bold
              transition-colors border
              ${
                isActive
                  ? 'border-sb-orange text-sb-orange'
                  : 'border-white/30 text-white hover:border-white/50'
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
