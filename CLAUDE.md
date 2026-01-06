# CLAUDE.md - How to Work on SideBet

> This file defines how Claude should approach coding, prompting, and modifications for the SideBet project. Read this before making ANY changes.

---

## Core Principles

### 1. Design First, Code Second
- Always reference Figma designs or screenshots before implementing
- Match designs exactly - pixel-perfect when specs are provided
- Ask for clarification if designs are ambiguous

### 2. Surgical Precision
- Make the minimum changes necessary
- Never modify files outside the specified scope
- If a change might affect other areas, ASK first

### 3. Verify Before Declaring Done
- Test the specific functionality you changed
- Check that nothing else broke
- Confirm against the checklist provided

---

## Coding Standards

### TypeScript

```typescript
// ✅ DO: Use explicit types
interface BetCardProps {
  bet: Bet;
  onExpand: (id: string) => void;
}

// ❌ DON'T: Use `any`
const handleClick = (data: any) => { ... }

// ✅ DO: Use type guards
if (bet.type === 'YES_NO') { ... }

// ❌ DON'T: Use non-null assertions carelessly
const name = user!.displayName!;
```

### React Components

```typescript
// ✅ DO: Functional components with explicit return types
export function BetCard({ bet, onExpand }: BetCardProps): JSX.Element {
  return ( ... );
}

// ✅ DO: Destructure props
function BetCard({ bet, onExpand }: BetCardProps) { ... }

// ❌ DON'T: Use default exports for components
export default function BetCard() { ... }

// ✅ DO: Use named exports
export function BetCard() { ... }
```

### File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth group (login, signup)
│   ├── (main)/            # Main app group (requires auth)
│   │   ├── home/
│   │   ├── groups/
│   │   ├── friends/
│   │   └── settle/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── bet/               # Bet-related components
│   │   ├── BetCard.tsx
│   │   ├── CreateBetWizard.tsx
│   │   └── ...
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   └── FAB.tsx
│   └── ...
├── lib/
│   ├── firebase/
│   │   ├── client.ts      # Firebase client config
│   │   ├── auth.ts        # Auth helpers
│   │   └── db.ts          # Firestore helpers
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBets.ts
│   │   └── ...
│   ├── types/
│   │   ├── bet.types.ts
│   │   ├── user.types.ts
│   │   └── ...
│   └── utils/
│       ├── formatters.ts
│       └── validators.ts
└── styles/
    └── globals.css
```

### Tailwind CSS

```typescript
// ✅ DO: Use design tokens via Tailwind config
className="bg-sb-orange text-white"

// ✅ DO: Use consistent spacing
className="p-4 mb-6"  // 16px padding, 24px margin-bottom

// ❌ DON'T: Use arbitrary values when tokens exist
className="bg-[#FF6B35]"  // Use bg-sb-orange instead

// ✅ DO: Mobile-first responsive
className="text-sm md:text-base"

// ✅ DO: Group related classes logically
className={`
  flex items-center justify-between
  p-4 rounded-lg
  bg-sb-card border border-sb-border
  hover:bg-sb-card-hover transition-colors
`}
```

### Comments

```typescript
// ✅ DO: Explain WHY, not WHAT
// Delay navigation to allow animation to complete
await new Promise(resolve => setTimeout(resolve, 300));

// ❌ DON'T: State the obvious
// Set loading to true
setLoading(true);

// ✅ DO: Mark TODOs with context
// TODO(Phil): Add error handling for network failures

// ✅ DO: Document complex business logic
/**
 * Calculate net balance between two users
 * Positive = they owe you, Negative = you owe them
 */
function calculateNetBalance(userId: string, otherUserId: string): number {
```

---

## Prompt Format for Changes

When requesting changes, use this structure:

```markdown
## Task
[One sentence describing what to do]

## Files to Modify
- `src/components/bet/BetCard.tsx` - [what changes]
- `src/lib/types/bet.types.ts` - [what changes]

## Exact Changes

### File: src/components/bet/BetCard.tsx

**Find this code:**
```tsx
[existing code to find]
```

**Replace with:**
```tsx
[new code]
```

## Protected (DO NOT MODIFY)
- `src/lib/firebase/client.ts`
- Any imports not mentioned
- Any functions not mentioned

## Verification Checklist
- [ ] BetCard renders correctly
- [ ] Expand/collapse still works
- [ ] No TypeScript errors
- [ ] No console errors
```

---

## What to Protect

### Never Modify Without Asking
- `src/lib/firebase/client.ts` - Firebase config
- `tailwind.config.ts` - Unless adding new tokens
- `next.config.js` - Core Next.js config
- `.env.local` - Environment variables
- Any authentication logic

### Always Preserve
- Existing imports (unless explicitly removing)
- Export statements
- TypeScript types already in use
- Error handling patterns
- Loading states

---

## Common Patterns

### Loading States

```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      const data = await getData();
      setData(data);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
```

### Firebase Queries

```typescript
// Real-time listener pattern
useEffect(() => {
  const q = query(
    collection(db, 'bets'),
    where('groupId', '==', groupId),
    where('status', '==', 'OPEN'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const bets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Bet[];
    setBets(bets);
    setLoading(false);
  });

  return () => unsubscribe();
}, [groupId]);
```

### Modal/Wizard Pattern

```typescript
const [isOpen, setIsOpen] = useState(false);
const [step, setStep] = useState(1);

const handleNext = () => setStep(s => s + 1);
const handleBack = () => setStep(s => s - 1);
const handleClose = () => {
  setIsOpen(false);
  setStep(1); // Reset on close
};
```

### Form Handling

```typescript
const [formData, setFormData] = useState({
  question: '',
  stakes: 10,
  closingTime: null as Date | null,
});

const handleChange = (field: keyof typeof formData, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  // Submit logic
};
```

---

## Error Handling

### User-Facing Errors

```typescript
// ✅ DO: Show helpful messages
toast.error('Could not create bet. Please try again.');

// ❌ DON'T: Show technical errors
toast.error(error.message); // "Firebase: Error (auth/network-request-failed)"
```

### Console Logging

```typescript
// ✅ DO: Log with context
console.error('[BetCard] Failed to place pick:', { betId, userId, error });

// ❌ DON'T: Log without context
console.error(error);
```

---

## Testing Checklist Template

Before marking any task complete:

```markdown
## Functionality
- [ ] Feature works as specified
- [ ] Edge cases handled (empty states, errors)
- [ ] Loading states display correctly

## Visual
- [ ] Matches Figma design
- [ ] Responsive on mobile (375px width)
- [ ] Dark mode colors correct
- [ ] Spacing/padding matches design tokens

## Code Quality
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] No unused imports
- [ ] Follows project patterns

## Integration
- [ ] Doesn't break existing features
- [ ] Firebase reads/writes work
- [ ] Navigation works correctly
```

---

## Questions to Ask Before Coding

1. **Do I have the design?** If not, ask for screenshots.
2. **Is the scope clear?** If not, clarify what's included/excluded.
3. **What should NOT change?** Identify protected areas.
4. **How will this be tested?** Know the success criteria.
5. **Are there related features?** Understand dependencies.

---

## Red Flags - Stop and Ask

- Prompt asks to modify auth or Firebase config
- Change would affect more than 3 files
- Requirements seem to contradict existing patterns
- Design doesn't exist for requested feature
- Scope creep ("while you're at it, also...")

---

## Communication Style

### When Responding

```markdown
✅ DO:
- Confirm understanding before coding
- Show code changes clearly with before/after
- List what was modified
- Provide verification steps

❌ DON'T:
- Make assumptions about unclear requirements
- Modify files not mentioned in the request
- Skip verification steps
- Add features not requested
```

### When Stuck

```markdown
"I need clarification on X before proceeding:
1. Should [option A] or [option B]?
2. Does this also need to handle [edge case]?
3. Is there a design for [component]?"
```

---

*Last updated: January 2025*
