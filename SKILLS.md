# SKILLS.md - SideBet Project Knowledge

> This file contains project-specific knowledge, architecture decisions, and specifications for the SideBet app. Reference this before implementing any features.

---

## Project Overview

**SideBet** is a social betting app that enhances social gatherings through friendly competition and wagering.

- **Tagline:** "Every Party Needs Stakes"
- **Target Users:** College students and young adults at parties, tailgates, game nights
- **Key Differentiator:** Only platform combining tournament organization with integrated betting
- **Legal Model:** Ledger/tracker only - all money settles OFF-PLATFORM via Venmo or cash

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Icons | Lucide React |
| Hosting | Vercel |
| Font | Montserrat (Google Fonts) |

---

## App Structure

### Navigation

**Bottom Nav (4 tabs):**
| Tab | Icon | Purpose |
|-----|------|---------|
| Home | Home | Active bets feed |
| Groups | Users | Betting groups |
| Friends | UserPlus | Friend list, H2H challenges |
| Settle | Wallet | Balances, judging, history |

**FAB (Floating Action Button):**
- Center position, raised above nav
- Orange (#FF6B35)
- Tap opens modal: "Create Bet" | "Create Tournament"

### Pages

```
/                   → Auth (Login/Signup)
/home               → Bet feed (all active bets)
/groups             → Groups list
/groups/[id]        → Group detail + group bets
/friends            → Friends list
/settle             → Settlement (3 tabs: Balance, Judge, History)
/profile            → User profile/settings
/tournaments/[id]   → Tournament detail + bracket
```

---

## Design Tokens

### Colors

```css
/* Primary */
--sb-orange: #FF6B35;         /* Primary actions, group bets, FAB */
--sb-purple: #7B2CBF;         /* H2H bets accent */

/* Feedback */
--sb-green: #1BEC09;          /* Positive amounts, success, "Yes" */
--sb-red: #FF4444;            /* Negative amounts, errors, "No" */
--sb-white: #FFFFFF;          /* Text on dark, "Over/Under" fills */

/* Backgrounds */
--sb-black: #000000;          /* Main background */
--sb-card: #18181B;           /* Card backgrounds (zinc-900) */
--sb-card-hover: #27272A;     /* Card hover state (zinc-800) */

/* Borders & Subtle */
--sb-border: #27272A;         /* Borders (zinc-800) */
--sb-muted: #71717A;          /* Muted text (zinc-500) */
```

### Typography

```css
/* Font Family */
font-family: 'Montserrat', sans-serif;

/* Sizes */
--text-xs: 10px;
--text-sm: 12px;
--text-base: 14px;
--text-lg: 18px;
--text-xl: 24px;
--text-2xl: 32px;

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing (4px Grid)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
```

### Border Radius

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 9999px;
```

### Shadows

```css
/* Card shadow */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

/* FAB shadow */
box-shadow: 0 4px 12px rgba(243, 119, 54, 0.4);

/* Urgent bet glow */
box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
animation: pulse 2s infinite;
```

---

## Feature Specifications

### Bet Types

| Type | Description | Fields |
|------|-------------|--------|
| Yes/No | Binary outcome | question, stakes, closingTime |
| Over/Under | Numeric line | question, line, stakes, closingTime |
| H2H | 1v1 challenge | question, opponent, odds, stakes, closingTime |

### Bet Lifecycle

```
CREATED → OPEN → CLOSED → JUDGED → SETTLED
                    ↓
               (auto-close at closingTime)
```

### Bet Card Visual Rules

| Condition | Style |
|-----------|-------|
| Group bet | Orange border (#FF6B35) |
| H2H bet | Purple border (#7B2CBF) |
| Closing < 1 hour | Pulsing orange glow |
| Closed | Grayed out, "CLOSED" badge |
| Judged | Shows outcome, winner highlighted green |

### H2H Specific Rules

- Purple color theme throughout
- Odds options: 1:1, 2:1, 1:2, 3:1, 1:3, 4:1, 1:4, or custom
- Card displays: "First Last vs. First Last"
- Challenger judges the outcome
- Accept/Decline flow for challengee

### Settlement Rules

- Net balance calculated per user pair
- Consolidates multiple bets into single balance
- Venmo deep link format: `venmo://paycharge?txn=[pay|charge]&recipients=[username]&amount=[X]&note=SideBet%20settlement`
- "Mark as Settled" for cash payments

### Tournament Rules

- Any size 4+ participants
- Single or Double elimination
- Play-in games for non-power-of-2 brackets (lower seeds play in)
- Director has full control (creates, enters results)
- Auto-generated bets: "Who wins?", matchup winners
- User-created dynamic bets allowed

---

## Database Schema

### Collections

```typescript
// users/{userId}
interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  venmoUsername?: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastActive: Timestamp;
}

// groups/{groupId}
interface Group {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  members: string[];
  admins: string[];
  inviteCode: string;
  createdAt: Timestamp;
}

// bets/{betId}
interface Bet {
  id: string;
  type: 'YES_NO' | 'OVER_UNDER';
  question: string;
  description?: string;
  creatorId: string;
  groupId?: string;
  
  // H2H specific
  isH2H: boolean;
  challengerId?: string;
  challengedId?: string;
  h2hOdds?: string;
  h2hStatus?: 'pending' | 'accepted' | 'declined';
  
  // Bet details
  stakes: number;
  overUnderLine?: number;
  closingTime: Timestamp;
  
  // State
  status: 'OPEN' | 'CLOSED' | 'JUDGED' | 'CANCELLED';
  result?: 'yes' | 'no' | 'over' | 'under' | 'push';
  
  // Participants
  picks: {
    [userId: string]: {
      pick: string;
      amount: number;
      timestamp: Timestamp;
    }
  };
  
  pot: number;
  winners?: string[];
  
  createdAt: Timestamp;
  judgedAt?: Timestamp;
}

// tournaments/{tournamentId}
interface Tournament {
  id: string;
  name: string;
  type: 'single-elimination' | 'double-elimination';
  createdBy: string;
  participants: string[];
  rounds: Round[];
  status: 'setup' | 'active' | 'completed';
  winner?: string;
  createdAt: Timestamp;
}

// friendships/{friendshipId}
interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  status: 'pending' | 'accepted';
  requestedBy: string;
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
}

// transactions/{transactionId}
interface Transaction {
  id: string;
  betId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  status: 'pending' | 'settled';
  settledAt?: Timestamp;
  settledVia?: 'venmo' | 'cash';
  createdAt: Timestamp;
}
```

---

## Business Logic Rules

### Who Can Do What

| Action | Who |
|--------|-----|
| Create bet | Any authenticated user |
| Place pick | Group members (group bet) or challenged user (H2H) |
| Judge bet | Bet creator only |
| Delete bet | Bet creator only (before anyone picks) |
| Create tournament | Any authenticated user |
| Enter tournament results | Tournament director only |

### Bet Creator Restrictions

- Creator CANNOT place picks on their own bet (conflict of interest)
- Creator CAN judge their own bet (they're the authority)

### H2H Accept/Decline

- Challengee has 24 hours to accept (or until closingTime, whichever first)
- If declined or expired, bet is cancelled
- If accepted, both users' picks are locked in

### Payout Calculation

```typescript
// Group bet (Yes/No, Over/Under)
// Winner(s) split the pot proportionally to their stake

// H2H with odds
// Example: 2:1 odds, $10 stake
// Challenger risks $20 to win $10
// Challengee risks $10 to win $20
```

---

## Mobile Considerations

- **Min touch target:** 44px
- **Safe areas:** Account for notch/home indicator
- **Bottom nav height:** 64px + safe area
- **FAB position:** Center, 16px above nav
- **Keyboard handling:** Modals should adjust for keyboard

---

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | lowercase with hyphens | `group-detail.tsx` |
| Components | PascalCase | `BetCard.tsx` |
| Utilities | camelCase | `formatCurrency.ts` |
| Types | PascalCase with .types | `bet.types.ts` |
| Hooks | camelCase with use prefix | `useAuth.ts` |

---

*Last updated: January 2025*
