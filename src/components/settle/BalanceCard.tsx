'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VenmoButton } from './VenmoButton';
import { SettlementPerson, BetBreakdown } from '@/lib/data/sampleSettlements';

interface BalanceCardProps {
  person: SettlementPerson;
  type: 'owed' | 'owes'; // owed = they owe you, owes = you owe them
  onMarkSettled?: (personId: string) => void;
}

export function BalanceCard({ person, type, onMarkSettled }: BalanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number, includeSign: boolean = false) => {
    const absAmount = Math.abs(amount).toFixed(2);
    if (includeSign) {
      return amount >= 0 ? `+$${absAmount}` : `-$${absAmount}`;
    }
    return `$${absAmount}`;
  };

  const borderColor = type === 'owed' ? 'border-l-sb-green' : 'border-l-sb-red';
  const totalAmountColor = person.amount >= 0 ? 'text-sb-green' : 'text-sb-red';
  const totalAmount = type === 'owed' ? Math.abs(person.amount) : -Math.abs(person.amount);

  const handleMarkSettled = () => {
    onMarkSettled?.(person.id);
  };

  return (
    <div
      className={`
        bg-sb-card border border-sb-border rounded-lg overflow-hidden
        border-l-4 ${borderColor}
      `}
    >
      {/* Collapsed Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-sb-card-hover/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-bold text-sm">{person.name}</span>
              <span className="text-sb-orange text-xs font-medium">
                {person.betCount} {person.betCount === 1 ? 'Bet' : 'Bets'}
              </span>
            </div>
            {person.isSettled ? (
              <span className="text-sb-muted text-xs">
                Settled {formatCurrency(Math.abs(person.amount))}
              </span>
            ) : (
              <span className="text-sb-muted text-xs">
                {type === 'owed' ? 'Owes you' : 'You owe'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-lg ${totalAmountColor}`}>
              {formatCurrency(totalAmount, true)}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-sb-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-sb-muted" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Bet Breakdown List */}
          <div className="space-y-2">
            {person.bets.map((bet: BetBreakdown, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-sb-border last:border-b-0"
              >
                <span className="text-white text-sm">{bet.title}</span>
                <span
                  className={`font-semibold text-sm ${
                    bet.amount >= 0 ? 'text-sb-green' : 'text-sb-red'
                  }`}
                >
                  {formatCurrency(bet.amount, true)}
                </span>
              </div>
            ))}
          </div>

          {/* Total Line */}
          <div className="flex items-center justify-between pt-2 border-t border-sb-border">
            <span className="text-white font-semibold">Total</span>
            <span className={`font-bold text-lg ${totalAmountColor}`}>
              {formatCurrency(totalAmount, true)}
            </span>
          </div>

          {/* Action Buttons */}
          {person.isSettled ? (
            <div className="text-center py-2">
              <span className="text-sb-muted text-sm">
                Settled On {person.settledDate}
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <VenmoButton
                type={type === 'owed' ? 'request' : 'send'}
                amount={Math.abs(person.amount)}
                venmoUsername={person.venmoUsername}
              />
              <button
                onClick={handleMarkSettled}
                className="
                  w-full py-3 rounded-lg
                  bg-transparent border border-sb-border
                  text-white font-semibold text-sm
                  hover:bg-sb-card-hover transition-colors
                "
              >
                Mark as Settled
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
