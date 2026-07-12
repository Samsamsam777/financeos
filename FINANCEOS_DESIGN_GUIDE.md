# FinanceOS Design Guide 4.0

## Identity

FinanceOS is calm, private, direct and trustworthy.

- Status first, detail second.
- Color communicates meaning.
- Motion confirms actions and preserves orientation.
- The dashboard is an entry point, not a report.
- New screens are composed from existing components.

## Material levels

1. Background
2. Surface
3. Raised Surface
4. Overlay
5. Sheet

Cards do not receive decorative shadows or borders beyond the material token.

## Typography roles

- Display: primary financial value
- Title: page title and FinanceOS title
- Section: dashboard section headings
- Headline: card and row titles
- Body: ordinary values
- Caption: metadata
- Micro: navigation labels

No new arbitrary font sizes may be introduced.

## Components

- AppHeader
- HeroCard
- SummaryCard
- SectionHeader
- GroupedCard
- LoanRow
- BudgetRow
- TransactionRow
- PendingBar
- MaterialCard
- ModalSheet
- NavigationBar
- FloatingActionButton

## Motion

- Press: 100 ms
- Fast state: 160 ms
- Page: 220 ms
- Sheet: 280 ms
- Progress: 520 ms

Navigation never begins on touch-down. It begins after a completed tap.

## Frozen after validation

After user testing and a score of at least 9.5/10, the following are frozen:

- Dashboard structure
- Navigation structure
- Typography scale
- Material scale
- Core component geometry

A frozen component changes only for measurable UX or functional benefit.
