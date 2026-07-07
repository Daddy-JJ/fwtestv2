# FE UI Guideline

## 1. Brand Direction
- Style: light, modern, finance dashboard.
- Tone: clean, data-driven, professional.

## 2. Design Tokens

### 2.1 Colors
- Primary: #2563EB
- Primary Hover: #1D4ED8
- Accent: #0EA5E9
- Success: #10B981
- Warning: #F59E0B
- Danger: #EF4444
- Background: #F8FAFC
- Surface: #FFFFFF
- Text Primary: #0F172A
- Text Secondary: #475569
- Border: #E2E8F0

### 2.2 Typography
- Font: Inter, system sans-serif fallback.
- Headline: 24/32, 600-700.
- Section title: 18/28, 600.
- Body: 14/22, 400-500.
- Caption: 12/18.

### 2.3 Spacing
- 4, 8, 12, 16, 20, 24, 32, 40.

### 2.4 Radius and Shadow
- Radius:
  - card/input: 12px
  - button: 10px
- Shadow:
  - card: 0 1px 2px rgba(15,23,42,0.08)
  - elevated: 0 8px 24px rgba(15,23,42,0.10)

## 3. Layout Rules
- Desktop: sidebar + content area.
- Tablet: compact sidebar.
- Mobile: top nav + drawer menu.
- Grid dashboard:
  - stats cards: 4 columns desktop, 2 tablet, 1 mobile.

## 4. Component Rules
- Buttons:
  - primary, secondary, ghost, danger.
- Input/Form:
  - clear label + helper text + error text.
- Table:
  - sticky header di desktop.
- Badge Status:
  - active (warning), tp_hit (success), sl_hit (danger), manual_close (secondary).

## 5. Charts
- Area chart: smooth + subtle gradient.
- Bar chart: grouped TP/SL.
- Pie chart: jelas legend + persentase.
- Empty state wajib untuk data nol.

## 6. Accessibility
- Kontras minimum WCAG AA.
- Focus ring terlihat jelas.
- Elemen interaktif bisa diakses keyboard.
