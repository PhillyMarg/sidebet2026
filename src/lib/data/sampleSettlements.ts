// Sample settlement data for development and testing
export interface BetBreakdown {
  title: string;
  amount: number;
}

export interface SettlementPerson {
  id: string;
  name: string;
  betCount: number;
  amount: number;
  bets: BetBreakdown[];
  venmoUsername: string;
  isSettled: boolean;
  settledDate?: string;
}

export interface BetToJudge {
  id: string;
  groupName: string;
  creatorName: string;
  title: string;
  description: string;
  type: 'YES_NO' | 'OVER_UNDER';
  pot: number;
  playerCount: number;
  status: 'JUDGE';
  yesPercentage: number;
  noPercentage: number;
  line?: number;
  closingDate: string;
}

export interface HistoryBet {
  id: string;
  groupName: string;
  creatorName: string;
  title: string;
  description: string;
  type: 'YES_NO' | 'OVER_UNDER';
  wager: number;
  totalPot: number;
  playerCount: number;
  yesPercentage: number;
  noPercentage: number;
  userPick: 'YES' | 'NO' | 'OVER' | 'UNDER';
  payout: number;
  closedDate: string;
  status: 'WON' | 'LOST';
  category: 'H2H' | 'GROUP';
  challenger?: string;
  challenged?: string;
}

export interface SettlementData {
  summary: {
    netBalance: number;
    youreOwed: number;
    youOwe: number;
  };
  owedToYou: SettlementPerson[];
  youOwe: SettlementPerson[];
  settled: SettlementPerson[];
  betsToJudge: BetToJudge[];
  history: HistoryBet[];
}

export const sampleSettlements: SettlementData = {
  summary: {
    netBalance: 10.00,
    youreOwed: 40.00,
    youOwe: 30.00,
  },
  owedToYou: [
    {
      id: '1',
      name: 'RYAN SMITH',
      betCount: 3,
      amount: 25.00,
      bets: [
        { title: 'Test Bet 1', amount: 15.00 },
        { title: 'Test Bet 2', amount: 35.00 },
        { title: 'Test Bet 3', amount: -25.00 },
      ],
      venmoUsername: 'RyanSmith',
      isSettled: false,
    },
    {
      id: '4',
      name: 'ALEX JOHNSON',
      betCount: 2,
      amount: 15.00,
      bets: [
        { title: 'Super Bowl Winner', amount: 20.00 },
        { title: 'World Series Pick', amount: -5.00 },
      ],
      venmoUsername: 'AlexJ',
      isSettled: false,
    },
  ],
  youOwe: [
    {
      id: '2',
      name: 'JOE SMITH',
      betCount: 3,
      amount: -15.00,
      bets: [
        { title: 'Test Bet 1', amount: -25.00 },
        { title: 'Test Bet 2', amount: 35.00 },
        { title: 'Test Bet 3', amount: -25.00 },
      ],
      venmoUsername: 'JoeSmith',
      isSettled: false,
    },
    {
      id: '5',
      name: 'MIKE WILSON',
      betCount: 1,
      amount: -15.00,
      bets: [
        { title: 'Fantasy Football Bet', amount: -15.00 },
      ],
      venmoUsername: 'MikeW',
      isSettled: false,
    },
  ],
  settled: [
    {
      id: '3',
      name: 'SARAH DAVIS',
      betCount: 3,
      amount: 25.00,
      bets: [
        { title: 'Test Bet 1', amount: 15.00 },
        { title: 'Test Bet 2', amount: 35.00 },
        { title: 'Test Bet 3', amount: -25.00 },
      ],
      venmoUsername: 'SarahD',
      isSettled: true,
      settledDate: '12/15/2025',
    },
  ],
  betsToJudge: [
    {
      id: 'j1',
      groupName: 'Test Group 1',
      creatorName: 'Phil Margevicius',
      title: 'Will TG Beat Phil in 8Ball Pool?',
      description: 'Best of 3 games at the party tonight',
      type: 'YES_NO',
      pot: 40.00,
      playerCount: 8,
      status: 'JUDGE',
      yesPercentage: 60,
      noPercentage: 40,
      closingDate: '12/15/2025',
    },
    {
      id: 'j2',
      groupName: 'Fantasy League',
      creatorName: 'Phil Margevicius',
      title: 'Did Mike finish the hot wing challenge?',
      description: 'Must finish all 10 wings in under 5 minutes',
      type: 'YES_NO',
      pot: 80.00,
      playerCount: 12,
      status: 'JUDGE',
      yesPercentage: 75,
      noPercentage: 25,
      closingDate: '12/10/2025',
    },
  ],
  history: [
    {
      id: 'h1',
      groupName: 'Test Group 1',
      creatorName: 'Phil Margevicius',
      title: 'Will the Eagles win on Sunday?',
      description: 'Regular season game vs Cowboys',
      type: 'YES_NO',
      wager: 5.00,
      totalPot: 40.00,
      playerCount: 8,
      yesPercentage: 70,
      noPercentage: 30,
      userPick: 'YES',
      payout: 10.00,
      closedDate: '12/12/2025',
      status: 'WON',
      category: 'GROUP',
    },
    {
      id: 'h2',
      groupName: 'Fantasy League',
      creatorName: 'Joe Smith',
      title: 'Over/Under 50 points in the game',
      description: 'Total combined score prediction',
      type: 'OVER_UNDER',
      wager: 10.00,
      totalPot: 60.00,
      playerCount: 6,
      yesPercentage: 50,
      noPercentage: 50,
      userPick: 'UNDER',
      payout: 0,
      closedDate: '12/08/2025',
      status: 'LOST',
      category: 'GROUP',
    },
    {
      id: 'h3',
      groupName: '',
      creatorName: 'Phil Margevicius',
      title: 'Who wins at darts?',
      description: 'First to 501',
      type: 'YES_NO',
      wager: 20.00,
      totalPot: 40.00,
      playerCount: 2,
      yesPercentage: 50,
      noPercentage: 50,
      userPick: 'YES',
      payout: 40.00,
      closedDate: '12/05/2025',
      status: 'WON',
      category: 'H2H',
      challenger: 'Phil Margevicius',
      challenged: 'Joe Smith',
    },
    {
      id: 'h4',
      groupName: '',
      creatorName: 'Ryan Smith',
      title: 'Cornhole match winner',
      description: 'Best of 5 games',
      type: 'YES_NO',
      wager: 15.00,
      totalPot: 30.00,
      playerCount: 2,
      yesPercentage: 50,
      noPercentage: 50,
      userPick: 'NO',
      payout: 0,
      closedDate: '12/01/2025',
      status: 'LOST',
      category: 'H2H',
      challenger: 'Ryan Smith',
      challenged: 'Phil Margevicius',
    },
  ],
};
