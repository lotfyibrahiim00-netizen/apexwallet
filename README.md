# ApexWallet — Mobile-First Personal Finance & Bank Transaction Tracker

A clean, modern, mobile-first personal finance and credit/debit card transaction tracker built for a smartphone viewport (`max-width: 430px`, centered on desktop with mobile app navigation). Built with a crisp light-mode fintech aesthetic (**Slate #F8FAFC**, pure white cards **#FFFFFF**, subtle borders, high-contrast typography, and emerald, amber, and rose status indicators).

---

## 🌟 Key Features

### 1. 🏛️ Banks & Cards Hierarchy
- **Multiple Banks**: Add banks (e.g. CIB Egypt, HSBC, QNB Alahli, National Bank of Egypt, Barclays, Chase) with custom accent colors via color picker or curated banking presets.
- **Strict 3-Card Maximum Cap**: Enforced in both logic and UI:
  - Banks track `(X / 3 cards)`.
  - Once 3 cards are reached, the "+ Add Card" button is disabled with a lock icon and explanatory badge, and form validation blocks adding a 4th card.
- **Card Metadata**: Card Name/Nickname, Last 4 Digits (`•••• 1234`), Card Type (`Credit`, `Debit`, `Prepaid`), Monthly Spending Target/Limit, and Network brand (`Visa`, `Mastercard`, `Meeza`, `Amex`).
- **Credit Card Billing Cycle**: When `Card Type = Credit`, requires Cycle Start Day (1–31) and Cycle End Day (1–31) with real-time rollover explanation.

---

### 2. ⚡ Smart Billing Cycle Engine
- Automatically calculates and tags which **Billing Statement Month** a purchase falls into based on transaction date vs. the card's Start and End cycle days.
- **Rollover Mechanics**:
  - Example: If a cycle runs from the 25th to the 24th, a purchase on **Nov 27** automatically tags as affecting the **December Statement Cycle** (Cycle: Nov 25 – Dec 24).
  - A purchase on **Nov 10** automatically tags as affecting the **November Statement Cycle** (Cycle: Oct 25 – Nov 24).
  - Automatically handles year rollovers (e.g., December to January next year).
- **Instant Preview**: When logging a transaction, selecting a Credit Card dynamically displays an interactive badge showing the exact statement month and cycle range before saving.
- **Badges Everywhere**: Prominently displayed on cards, transaction history, and dashboard activity rows.

---

### 3. 📊 Dashboard & Target Limit Tracker
- **Top Summary Cards**: Total Transactions Count and Total Amount Spent with dynamic average per transaction.
- **Multi-Level Filters**:
  - Filter by **All Accounts**, specific **Bank**, or specific **Card**.
  - Filter by **Statement Month** (e.g., `Dec 2026 Stmt`, `Nov 2026 Stmt`).
- **Visual Target & Limit Tracker**:
  - **Healthy (< 80%)**: Crisp emerald progress bar with remaining safe budget.
  - **Warning (80% – 99%)**: Amber status indicator alerting the user that the budget is nearing its limit.
  - **Target Exceeded (≥ 100%)**: High-contrast rose/red progress bar, pulse-animated alert banner at the top of the dashboard showing the exact over-limit amount and percentage used.
- **Per-Card Spending Cards**: Individual progress bars for each card with spend vs. limit comparisons.

---

### 4. 📱 Mobile-First UX & Persistence
- **Smartphone Viewport**: Framed in a 430px mobile chassis on desktop with Dynamic Island, live status bar clock, and battery indicator. Automatically expands to 100% full screen on actual mobile devices.
- **Bottom App Navigation Bar**:
  - **Dashboard** (`Home` / Overview)
  - **Cards & Banks** (Hierarchy & Virtual Cards)
  - **Add +** (Center elevated action button with quick slide-up actions)
  - **History** (Full transaction list with search, grouping, and deletion)
- **Smooth Slide-Up Modals**: Native bottom-sheet modals with backdrop blur.
- **localStorage Persistence**: Persists all banks, cards, transactions, and selected currency.
- **Pre-loaded Realistic Sample Data**: Pre-configured with CIB, HSBC, QNB, and NBE with cards in normal, warning (81.3%), and over-limit (113.8%) states for instant testing.
- **Reset & Export**: One-click "Reset Demo Data" and "Export CSV" buttons.

---

## 🚀 How to Run

1. Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Safari, Firefox).
2. Direct navigation shortcuts supported:
   - Dashboard: `index.html#dashboard`
   - Cards & Banks: `index.html#cards`
   - History: `index.html#history`
   - Log Transaction Modal: `index.html#modal-transaction`
   - Add Card Modal: `index.html#modal-card`
   - Add Bank Modal: `index.html#modal-bank`
