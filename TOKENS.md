> Legacy reference. Verbindliche Designregeln stehen in
> `docs/04_DESIGN_GUIDE.md`; die Implementierung liegt in
> `src/design/tokens.css`.

# FinanceOS Design Tokens

All visual decisions should use the tokens in `src/design/tokens.css`.

## Color tokens
- `--color-bg`
- `--color-surface-1`
- `--color-surface-2`
- `--color-surface-3`
- `--color-text`
- `--color-muted`
- `--color-accent`
- `--color-positive`
- `--color-negative`
- `--color-warning`

## Spacing tokens
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-page-inline`

Spacing tokens use `clamp()` so the app adapts across screen sizes.

## Radius tokens
- `--radius-control`
- `--radius-card`
- `--radius-hero`
- `--radius-pill`

## Typography tokens
- `--font-xs`
- `--font-sm`
- `--font-md`
- `--font-lg`
- `--font-xl`

## Component size tokens
- `--nav-height`
- `--fab-size`
- `--icon-sm`
- `--icon-md`
- `--tap-min`

## Motion tokens
- `--motion-press`
- `--motion-page`
- `--motion-sheet`
- `--motion-toast`
- `--motion-number`
- `--motion-progress`

Hardcoded values should only be introduced when a component has a unique,
documented requirement that cannot be represented by an existing token.
