# FinanceOS Design Principles

## Product principles

1. FinanceOS is calm, fast, and trustworthy.
2. Offline-first and privacy are defaults, not optional features.
3. Every screen has one primary purpose.
4. Dashboard modules are previews, not full reports.
5. Information appears once. Duplicate information is removed.
6. New features must solve a recurring real-world problem.
7. Color communicates meaning; it is not decoration.
8. Animation supports orientation and feedback; it never distracts.
9. No advertising, gamification, engagement tricks, or artificial urgency.
10. The app must remain understandable after years of development.

## Visual system

### Spacing
- 6 px
- 10 px
- 14 px
- 20 px
- 28 px

### Radius
- Small controls: 13 px
- Standard cards: 18 px
- Hero and sheets: 24 px
- Floating primary action: circular

### Surfaces
- Background is darkest.
- Cards are lighter than the background.
- Cards do not use visible decorative borders.
- Shadows are reserved for floating elements.

### Color
- Violet: primary action and navigation state
- Green: positive financial meaning
- Red: negative financial meaning
- Amber: unresolved or warning state
- Neutral surfaces dominate the interface

## Motion system

- Press feedback: 90 ms
- Page transition: 220 ms
- Bottom sheet: 280 ms
- Toast transition: 220 ms
- Number animation: 420 ms
- Loan progress: 520 ms

Motion uses transform and opacity where possible.  
`prefers-reduced-motion` is always respected.

## Interaction principles

- Every tappable card visibly responds to touch.
- Saving produces clear feedback.
- Destructive actions require confirmation.
- Bottom sheets preserve context.
- The primary `+` action is always reachable.
- Long press may expose quick details, but must not hide required functionality.

## Technical constraints

FinanceOS is a PWA. Native iOS haptics are not exposed to browser apps.
A haptic abstraction is included and uses `navigator.vibrate` where supported.
On iPhone, visual press states and motion provide the interaction feedback.


## Responsive principles

1. No screen is designed for one specific iPhone model.
2. Safe areas are mandatory at top and bottom.
3. Component sizes use tokens and `clamp()` where appropriate.
4. Touch targets remain at least 44 px.
5. Layouts must support narrow screens down to 320 px.
6. Layouts must not become excessively wide on tablets or desktop.
7. Dynamic viewport units are preferred when supported.
8. High contrast and reduced motion preferences are respected.
9. A new device must require testing, not a redesign.


## UI patch 2.1.1 decisions

- The title may sit close to the upper safe area because the hardware island already creates visual whitespace.
- Secondary notification counts are plain colored text, not filled badges.
- The right side of split summary cards receives additional center spacing for optical balance.
- Loan gradients reserve green/turquoise for late-stage repayment.
- Navigation distributes optical whitespace evenly above and below the label.
- Ambient background color must remain visibly present while surfaces stay calm.
