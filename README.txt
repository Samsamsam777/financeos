FinanceOS 4.0.1 – Design System Refinement

FinanceOS 4.0 restructures the UI architecture rather than adding features.

Architecture:
- src/design/tokens.css
- src/design/base.css
- src/components/components.css
- src/components/components.js
- src/screens/screens.css
- FINANCEOS_DESIGN_GUIDE.md

Implemented:
- centralized color, spacing, radius, typography, material and motion tokens
- reusable SectionHeader, GroupedCard and MaterialCard helpers
- one shared grouped-row language for credits, budgets and transactions
- credits made substantially flatter:
  no percentage, rate or interest on the dashboard
- budgets made substantially flatter
- transaction spacing normalized
- add-booking screen aligned to the same material and typography system
- sheets, navbar, FAB and forms aligned to the same token system
- existing local data and storage key remain compatible

Testing:
- all JavaScript modules are syntax-checked
- the UI should be tested on the iPhone before the frozen-state decision

Commit:
FinanceOS 4.0 Design System


4.0.1 refinement:
- Plus action now opens a native-style FinanceOS bottom sheet
- entry form uses the same material, typography, spacing and motion tokens
- type and amount are grouped compactly
- page headings normalized across credits, settings and dashboard configuration


FinanceOS 4.0.2:
- vollständige Produkt- und Designphilosophie in FINANCEOS_DESIGN_GUIDE.md
- Entwicklungsphasen und Roadmap dokumentiert
- Freeze-, Sprint- und Feedback-Regeln verbindlich festgehalten
