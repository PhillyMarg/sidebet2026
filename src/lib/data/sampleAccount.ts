export interface AccountUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  memberSince: string;
  initials: string;
  venmoConnected: boolean;
  pushNotifications: boolean;
}

export interface AccountStats {
  overallRecord: {
    wins: number;
    losses: number;
    ties: number;
  };
  winRate: number;
  totalWinnings: number;
  totalLosses: number;
  h2hRecord: {
    wins: number;
    losses: number;
  };
  totalBets: number;
}

export interface AccountData {
  user: AccountUser;
  stats: AccountStats;
}

export const sampleAccount: AccountData = {
  user: {
    id: 'user1',
    name: 'Phil Margevicius',
    username: 'PhilMarg',
    email: 'philmargevicius@email.com',
    password: 'Spb13083',
    memberSince: 'Nov. 2024',
    initials: 'PM',
    venmoConnected: false,
    pushNotifications: true,
  },
  stats: {
    overallRecord: {
      wins: 23,
      losses: 15,
      ties: 2,
    },
    winRate: 57.5,
    totalWinnings: 142.00,
    totalLosses: 87.00,
    h2hRecord: {
      wins: 12,
      losses: 8,
    },
    totalBets: 40,
  },
};
