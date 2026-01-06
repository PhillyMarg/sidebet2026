'use client';

import { BalanceCard } from './BalanceCard';
import { SettlementPerson } from '@/lib/data/sampleSettlements';

interface BalanceSectionProps {
  title: string;
  type: 'owed' | 'owes';
  people: SettlementPerson[];
  onMarkSettled?: (personId: string) => void;
}

export function BalanceSection({
  title,
  type,
  people,
  onMarkSettled,
}: BalanceSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sb-muted text-xs font-semibold tracking-wide px-4">
        {title}
      </h3>
      {people.length === 0 ? (
        <div className="px-4">
          <div className="bg-sb-card/50 border border-sb-border rounded-lg p-6 text-center">
            <p className="text-sb-muted text-sm">No balances</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 px-4">
          {people.map((person) => (
            <BalanceCard
              key={person.id}
              person={person}
              type={type}
              onMarkSettled={onMarkSettled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
