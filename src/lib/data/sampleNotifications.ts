// Sample data for notifications - used for development and testing

export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'BET_CHALLENGE'
  | 'BET_CLOSING'
  | 'BET_WON'
  | 'BET_LOST'
  | 'PAYMENT_REQUEST';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  metadata?: {
    name?: string;
    betTitle?: string;
    amount?: number;
  };
}

export const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'FRIEND_REQUEST',
    message: 'Tim Jones sent you a friend request',
    time: '2m ago',
    read: false,
    link: '/friends',
    metadata: { name: 'Tim Jones' },
  },
  {
    id: '2',
    type: 'BET_CHALLENGE',
    message: 'Joe Smith challenged you to a bet: Will TG Beat Phil?',
    time: '15m ago',
    read: false,
    link: '/home',
    metadata: { name: 'Joe Smith', betTitle: 'Will TG Beat Phil?' },
  },
  {
    id: '3',
    type: 'BET_CLOSING',
    message: 'Super Bowl Winner closes in 1 hour - Vote now!',
    time: '45m ago',
    read: false,
    link: '/home',
    metadata: { betTitle: 'Super Bowl Winner' },
  },
  {
    id: '4',
    type: 'BET_WON',
    message: 'You won March Madness Finals - Collect $15.00!',
    time: '1h ago',
    read: true,
    link: '/settle',
    metadata: { betTitle: 'March Madness Finals', amount: 15.00 },
  },
  {
    id: '5',
    type: 'PAYMENT_REQUEST',
    message: 'Ryan Smith requested $15.00 for Beer Pong Champ',
    time: '2d ago',
    read: true,
    link: '/settle',
    metadata: { name: 'Ryan Smith', betTitle: 'Beer Pong Champ', amount: 15.00 },
  },
  {
    id: '6',
    type: 'BET_LOST',
    message: 'You lost Cornhole Tournament - Pay $5.00 to Alex Brown',
    time: '3h ago',
    read: true,
    link: '/settle',
    metadata: { name: 'Alex Brown', betTitle: 'Cornhole Tournament', amount: 5.00 },
  },
];
