// Sample data for friends - used for development and testing

export interface FriendRecord {
  wins: number;
  losses: number;
  ties: number;
}

export interface PendingRequest {
  id: string;
  name: string;
  username: string;
}

export interface MyFriend {
  id: string;
  name: string;
  username: string;
  record: FriendRecord;
}

export interface SuggestedFriend {
  id: string;
  name: string;
  username: string;
  source: string;
}

export interface SentRequest {
  id: string;
  name: string;
  username: string;
}

export interface SampleFriendsData {
  pendingRequests: PendingRequest[];
  myFriends: MyFriend[];
  suggested: SuggestedFriend[];
  sentRequests: SentRequest[];
}

export const sampleFriends: SampleFriendsData = {
  pendingRequests: [
    { id: '1', name: 'Tim Jones', username: 'TimJones' },
    { id: '2', name: 'Tom Jones', username: 'TomJones' },
  ],
  myFriends: [
    { id: '3', name: 'Joe Smith', username: 'JoeSmith', record: { wins: 3, losses: 1, ties: 0 } },
    { id: '4', name: 'John Smith', username: 'JohnSmith', record: { wins: 4, losses: 1, ties: 0 } },
  ],
  suggested: [
    { id: '5', name: 'Tom Ray', username: 'TomRay', source: 'GOAT Fantasy League' },
  ],
  sentRequests: [
    { id: '6', name: 'Rick Smith', username: 'RickSmith' },
  ],
};

export const currentUser = {
  username: 'PHILMARG',
};
