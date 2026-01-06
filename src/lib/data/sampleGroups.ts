// Sample data for groups - used for development and testing

export interface GroupMember {
  id: string;
  name: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface SampleGroup {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string;
  inviteCode: string;
  maxWager: number;
  playerCount: number;
  activeBets: number;
  lastBetTime: string;
  members: GroupMember[];
}

export const sampleGroups: SampleGroup[] = [
  {
    id: '1',
    name: 'TEST GROUP 1',
    description: 'Group Description',
    creatorId: 'user1',
    creatorName: 'Joe Smith',
    inviteCode: 'XTV13W',
    maxWager: 15,
    playerCount: 8,
    activeBets: 3,
    lastBetTime: '2h ago',
    members: [
      { id: 'user1', name: 'Phil Margevicius', role: 'admin', joinedAt: 'Creator/Admin' },
      { id: 'user2', name: 'Joe Smith', role: 'member', joinedAt: '1h ago' },
      { id: 'user3', name: 'Joe Smith', role: 'member', joinedAt: '1d ago' },
      { id: 'user4', name: 'Joe Smith', role: 'member', joinedAt: '1w ago' },
      { id: 'user5', name: 'Joe Smith', role: 'member', joinedAt: '1y ago' },
    ]
  },
  {
    id: '2',
    name: 'GOAT Fantasy League',
    description: 'Nothing to See',
    creatorId: 'user1',
    creatorName: 'Phil Margevicius',
    inviteCode: 'SD1456',
    maxWager: 20,
    playerCount: 12,
    activeBets: 0,
    lastBetTime: '12h ago',
    members: []
  }
];
