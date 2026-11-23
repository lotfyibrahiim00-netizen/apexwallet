/**
 * Smart Personal Finance & Bank Transaction Tracker
 * State Management, Smart Billing Cycle Engine, and Persistence
 */

// --- Currency Formatter ---
let currentCurrency = localStorage.getItem('wallet_currency') || 'EGP';

const currencySymbols = {
  EGP: 'EGP',
  USD: '$',
  EUR: '€',
  GBP: '£',
  SAR: 'SAR',
  AED: 'AED'
};

function formatCurrency(amount, currency = currentCurrency) {
  const sym = currencySymbols[currency] || currency;
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  if (sym === '$' || sym === '€' || sym === '£') {
    return `${amount < 0 ? '-' : ''}${sym}${formatted}`;
  }
  return `${amount < 0 ? '-' : ''}${formatted} ${sym}`;
}

// --- Category Definitions with Icons & Theme Colors ---
const CATEGORIES = {
  food: { name: 'Food & Dining', icon: 'utensils', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  groceries: { name: 'Groceries', icon: 'shopping-cart', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  shopping: { name: 'Shopping', icon: 'shopping-bag', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  utilities: { name: 'Bills & Utilities', icon: 'zap', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  entertainment: { name: 'Entertainment', icon: 'film', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  travel: { name: 'Travel & Commute', icon: 'plane', bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  health: { name: 'Health & Medical', icon: 'activity', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  services: { name: 'Services & Subscriptions', icon: 'briefcase', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  other: { name: 'Other', icon: 'tag', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' }
};

// --- Preset Banks with High-Fidelity Accent Colors ---
const PRESET_BANKS = [
  { name: 'CIB Egypt', code: 'CIB', color: '#002D62' },
  { name: 'HSBC', code: 'HSBC', color: '#DB0011' },
  { name: 'QNB Alahli', code: 'QNB', color: '#7C003D' },
  { name: 'National Bank of Egypt', code: 'NBE', color: '#006837' },
  { name: 'Banque Misr', code: 'BM', color: '#991B1E' },
  { name: 'Emirates NBD', code: 'ENBD', color: '#0B3082' },
  { name: 'Chase Bank', code: 'CHASE', color: '#117ACA' },
  { name: 'Barclays', code: 'BARC', color: '#00AEEF' }
];

// --- Smart Billing Cycle Engine ---
/**
 * Calculates which billing statement month a transaction falls into based on
 * transaction date vs. the credit card's Start and End cycle days.
 * 
 * Example:
 * If a cycle runs from the 25th to the 24th, a purchase on Nov 27
 * automatically tags as affecting the December Statement Cycle.
 * A purchase on Nov 10 tags as affecting the November Statement Cycle.
 */
function calculateBillingStatement(dateStr, cycleStartDay, cycleEndDay) {
  if (!dateStr || !cycleStartDay || !cycleEndDay) {
    return null;
  }

  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10); // 1-12
  const day = parseInt(parts[2], 10);

  const startDay = parseInt(cycleStartDay, 10);
  const endDay = parseInt(cycleEndDay, 10);

  let stmtYear = year;
  let stmtMonth = month;
  let cycleStartMonth = month;
  let cycleStartYear = year;
  let cycleEndMonth = month;
  let cycleEndYear = year;

  if (startDay > endDay) {
    // Cross-calendar-month billing cycle (e.g., 25th to 24th of next month)
    if (day >= startDay) {
      // Transaction is in month M, on or after startDay.
      // Cycle will close in month M+1 on endDay.
      // Therefore, the statement issued belongs to month M+1!
      cycleStartMonth = month;
      cycleStartYear = year;

      if (month === 12) {
        stmtMonth = 1;
        stmtYear = year + 1;
        cycleEndMonth = 1;
        cycleEndYear = year + 1;
      } else {
        stmtMonth = month + 1;
        stmtYear = year;
        cycleEndMonth = month + 1;
        cycleEndYear = year;
      }
    } else {
      // day < startDay (e.g., day 10, when start is 25 and end is 24)
      // Belongs to the cycle that started on month M-1 and closes in month M on endDay.
      // Statement issued is month M!
      stmtMonth = month;
      stmtYear = year;
      cycleEndMonth = month;
      cycleEndYear = year;

      if (month === 1) {
        cycleStartMonth = 12;
        cycleStartYear = year - 1;
      } else {
        cycleStartMonth = month - 1;
        cycleStartYear = year;
      }
    }
  } else {
    // Intra-month cycle (e.g. 1st to 30th or 5th to 25th of the same month)
    stmtYear = year;
    stmtMonth = month;
    cycleStartMonth = month;
    cycleStartYear = year;
    cycleEndMonth = month;
    cycleEndYear = year;
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const shortMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const stmtMonthName = monthNames[stmtMonth - 1];
  const stmtShortName = shortMonths[stmtMonth - 1];
  const cycleStartName = shortMonths[cycleStartMonth - 1];
  const cycleEndName = shortMonths[cycleEndMonth - 1];

  const statementKey = `${stmtYear}-${String(stmtMonth).padStart(2, '0')}`;
  const statementBadge = `${stmtShortName} ${stmtYear} Stmt`;
  const statementFullBadge = `${stmtMonthName} ${stmtYear} Statement Cycle`;
  const cycleRange = `${cycleStartName} ${startDay} – ${cycleEndName} ${endDay}, ${cycleEndYear}`;

  return {
    statementKey,
    statementYear: stmtYear,
    statementMonth: stmtMonth,
    statementMonthName: stmtMonthName,
    statementBadge,
    statementFullBadge,
    cycleRange,
    cycleStartDay: startDay,
    cycleEndDay: endDay
  };
}

// --- Sample Realistic Data ---
function getInitialSampleData() {
  const banks = [
    {
      id: 'bank_cib',
      name: 'CIB Egypt',
      shortCode: 'CIB',
      accentColor: '#002D62',
      createdAt: '2026-01-01'
    },
    {
      id: 'bank_hsbc',
      name: 'HSBC Egypt',
      shortCode: 'HSBC',
      accentColor: '#DB0011',
      createdAt: '2026-01-02'
    },
    {
      id: 'bank_qnb',
      name: 'QNB Alahli',
      shortCode: 'QNB',
      accentColor: '#7C003D',
      createdAt: '2026-01-03'
    },
    {
      id: 'bank_nbe',
      name: 'National Bank of Egypt',
      shortCode: 'NBE',
      accentColor: '#006837',
      createdAt: '2026-01-04'
    }
  ];

  // Notice: NBE has 3 cards (enforcing and showcasing the 3-card cap!)
  // CIB Titanium Miles has spending over limit ($28,450 vs $25,000 target) to showcase red alert banner!
  // CIB Plus Salary has 81.3% spent to showcase amber warning state!
  const cards = [
    // CIB Cards (2 cards)
    {
      id: 'card_cib_miles',
      bankId: 'bank_cib',
      name: 'Titanium Miles',
      last4: '8492',
      cardType: 'credit',
      monthlyTarget: 25000,
      cycleStartDay: 25,
      cycleEndDay: 24,
      network: 'Mastercard',
      createdAt: '2026-01-01'
    },
    {
      id: 'card_cib_debit',
      bankId: 'bank_cib',
      name: 'Plus Salary Debit',
      last4: '1044',
      cardType: 'debit',
      monthlyTarget: 15000,
      cycleStartDay: null,
      cycleEndDay: null,
      network: 'Visa',
      createdAt: '2026-01-01'
    },
    // HSBC Cards (2 cards)
    {
      id: 'card_hsbc_cashback',
      bankId: 'bank_hsbc',
      name: 'Advance Cashback',
      last4: '5521',
      cardType: 'credit',
      monthlyTarget: 20000,
      cycleStartDay: 15,
      cycleEndDay: 14,
      network: 'Visa',
      createdAt: '2026-01-02'
    },
    {
      id: 'card_hsbc_premier',
      bankId: 'bank_hsbc',
      name: 'Premier Savings',
      last4: '3389',
      cardType: 'debit',
      monthlyTarget: 10000,
      cycleStartDay: null,
      cycleEndDay: null,
      network: 'Mastercard',
      createdAt: '2026-01-02'
    },
    // QNB Cards (1 card)
    {
      id: 'card_qnb_first',
      bankId: 'bank_qnb',
      name: 'First World Elite',
      last4: '7712',
      cardType: 'credit',
      monthlyTarget: 40000,
      cycleStartDay: 1,
      cycleEndDay: 30,
      network: 'Mastercard',
      createdAt: '2026-01-03'
    },
    // NBE Cards (3 cards - Maximum Cap Reached)
    {
      id: 'card_nbe_prepaid',
      bankId: 'bank_nbe',
      name: 'Ahly Meeza Prepaid',
      last4: '9011',
      cardType: 'prepaid',
      monthlyTarget: 5000,
      cycleStartDay: null,
      cycleEndDay: null,
      network: 'Meeza',
      createdAt: '2026-01-04'
    },
    {
      id: 'card_nbe_platinum',
      bankId: 'bank_nbe',
      name: 'Platinum Credit',
      last4: '4120',
      cardType: 'credit',
      monthlyTarget: 18000,
      cycleStartDay: 20,
      cycleEndDay: 19,
      network: 'Visa',
      createdAt: '2026-01-04'
    },
    {
      id: 'card_nbe_gold',
      bankId: 'bank_nbe',
      name: 'Gold Master Debit',
      last4: '6310',
      cardType: 'debit',
      monthlyTarget: 8000,
      cycleStartDay: null,
      cycleEndDay: null,
      network: 'Mastercard',
      createdAt: '2026-01-04'
    }
  ];

  // Transactions with smart billing cycle statement tags
  const transactions = [
    // CIB Titanium Miles: Target is 25,000. Spent will exceed 28,000!
    // Billing cycle: 25th to 24th
    // Nov 27 -> Belongs to Dec 2026 Statement!
    {
      id: 'tx_1',
      amount: 14200,
      merchant: 'Apple Store Cairo',
      category: 'shopping',
      date: '2026-11-27',
      bankId: 'bank_cib',
      cardId: 'card_cib_miles',
      notes: 'New iPad & Accessories'
    },
    {
      id: 'tx_2',
      amount: 6850,
      merchant: 'Gourmet Supermarket',
      category: 'groceries',
      date: '2026-11-26',
      bankId: 'bank_cib',
      cardId: 'card_cib_miles',
      notes: 'Monthly bulk groceries'
    },
    {
      id: 'tx_3',
      amount: 7400,
      merchant: 'EgyptAir Tickets',
      category: 'travel',
      date: '2026-11-25',
      bankId: 'bank_cib',
      cardId: 'card_cib_miles',
      notes: 'Weekend flight to Hurghada'
    },
    // Total for Dec statement on CIB Miles = 14200 + 6850 + 7400 = 28,450 (Exceeded 25,000 target by 3,450!)

    // A transaction on Nov 18 on CIB Miles -> Belongs to Nov 2026 Statement! (Day 18 < 25)
    {
      id: 'tx_4',
      amount: 3200,
      merchant: 'IKEA Festival City',
      category: 'shopping',
      date: '2026-11-18',
      bankId: 'bank_cib',
      cardId: 'card_cib_miles',
      notes: 'Study desk & lamp'
    },

    // CIB Plus Salary Debit (Target: 15,000. Spent: 12,200 -> 81.3% Amber Warning)
    {
      id: 'tx_5',
      amount: 8500,
      merchant: 'Electricity & Gas Utility',
      category: 'utilities',
      date: '2026-11-20',
      bankId: 'bank_cib',
      cardId: 'card_cib_debit',
      notes: 'Monthly utility bills'
    },
    {
      id: 'tx_6',
      amount: 3700,
      merchant: 'Carrefour Hypermarket',
      category: 'groceries',
      date: '2026-11-22',
      bankId: 'bank_cib',
      cardId: 'card_cib_debit',
      notes: 'Home essentials'
    },

    // HSBC Advance Cashback (Credit, cycle 15th to 14th, Target 20,000)
    // Nov 22 -> day 22 >= 15 -> Belongs to Dec 2026 Statement!
    {
      id: 'tx_7',
      amount: 5400,
      merchant: 'Amazon Egypt',
      category: 'shopping',
      date: '2026-11-22',
      bankId: 'bank_hsbc',
      cardId: 'card_hsbc_cashback',
      notes: 'Electronics & household'
    },
    {
      id: 'tx_8',
      amount: 1950,
      merchant: 'Starbucks Arkan',
      category: 'food',
      date: '2026-11-24',
      bankId: 'bank_hsbc',
      cardId: 'card_hsbc_cashback',
      notes: 'Client coffee & pastries'
    },
    {
      id: 'tx_9',
      amount: 2450,
      merchant: 'Netflix & Spotify',
      category: 'services',
      date: '2026-11-16',
      bankId: 'bank_hsbc',
      cardId: 'card_hsbc_cashback',
      notes: 'Annual digital subscriptions'
    },

    // HSBC Premier Savings Debit
    {
      id: 'tx_10',
      amount: 2800,
      merchant: 'Cleopatra Hospital Clinic',
      category: 'health',
      date: '2026-11-15',
      bankId: 'bank_hsbc',
      cardId: 'card_hsbc_premier',
      notes: 'Annual health checkup'
    },
    {
      id: 'tx_11',
      amount: 600,
      merchant: 'Uber Rides',
      category: 'travel',
      date: '2026-11-23',
      bankId: 'bank_hsbc',
      cardId: 'card_hsbc_premier',
      notes: 'City commute'
    },

    // QNB First World Elite (Credit, cycle 1st to 30th, Target 40,000)
    {
      id: 'tx_12',
      amount: 11200,
      merchant: 'Four Seasons Hotel Dining',
      category: 'food',
      date: '2026-11-21',
      bankId: 'bank_qnb',
      cardId: 'card_qnb_first',
      notes: 'Family anniversary dinner'
    },
    {
      id: 'tx_13',
      amount: 4800,
      merchant: 'Zara & Massimo Dutti',
      category: 'shopping',
      date: '2026-11-19',
      bankId: 'bank_qnb',
      cardId: 'card_qnb_first',
      notes: 'Winter wardrobe'
    },

    // NBE Ahly Meeza Prepaid (Target 5,000)
    {
      id: 'tx_14',
      amount: 1450,
      merchant: 'Vodafone Telecom Bill',
      category: 'utilities',
      date: '2026-11-12',
      bankId: 'bank_nbe',
      cardId: 'card_nbe_prepaid',
      notes: 'Fibre broadband renewal'
    },
    {
      id: 'tx_15',
      amount: 950,
      merchant: 'Cinema Vox VIP',
      category: 'entertainment',
      date: '2026-11-14',
      bankId: 'bank_nbe',
      cardId: 'card_nbe_prepaid',
      notes: 'Movie tickets & popcorn'
    },

    // NBE Platinum Credit (Cycle 20th to 19th)
    // Nov 21 -> day 21 >= 20 -> Dec 2026 statement
    {
      id: 'tx_16',
      amount: 4200,
      merchant: 'Total Gas Station & Auto Care',
      category: 'travel',
      date: '2026-11-21',
      bankId: 'bank_nbe',
      cardId: 'card_nbe_platinum',
      notes: 'Full tank & tire rotation'
    },
    // Nov 15 -> day 15 < 20 -> Nov 2026 statement
    {
      id: 'tx_17',
      amount: 3100,
      merchant: 'El-Ezaby Pharmacy',
      category: 'health',
      date: '2026-11-15',
      bankId: 'bank_nbe',
      cardId: 'card_nbe_platinum',
      notes: 'Vitamins and skincare'
    },

    // NBE Gold Master Debit
    {
      id: 'tx_18',
      amount: 2100,
      merchant: 'Buffalo Wings & Co',
      category: 'food',
      date: '2026-11-17',
      bankId: 'bank_nbe',
      cardId: 'card_nbe_gold',
      notes: 'Team dinner'
    }
  ];

  return { banks, cards, transactions };
}

// --- App State ---
class WalletAppStore {
  constructor() {
    this.storageKey = 'fintech_wallet_store_v1';
    this.loadState();
    this.activeTab = 'dashboard';
    this.selectedAccountFilter = 'all'; // 'all' | 'bank:{id}' | 'card:{id}'
    this.selectedStatementFilter = 'all'; // 'all' | '2026-12' | '2026-11' etc.
    this.searchQuery = '';
    this.selectedCategoryFilter = 'all';
  }

  loadState() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.banks = parsed.banks || [];
        this.cards = parsed.cards || [];
        this.transactions = parsed.transactions || [];
        return;
      } catch (e) {
        console.error('Error parsing stored wallet data:', e);
      }
    }
    // Initialize sample data
    const initial = getInitialSampleData();
    this.banks = initial.banks;
    this.cards = initial.cards;
    this.transactions = initial.transactions;
    this.saveState();
  }

  saveState() {
    const payload = {
      banks: this.banks,
      cards: this.cards,
      transactions: this.transactions
    };
    localStorage.setItem(this.storageKey, JSON.stringify(payload));
  }

  resetToSampleData() {
    const initial = getInitialSampleData();
    this.banks = initial.banks;
    this.cards = initial.cards;
    this.transactions = initial.transactions;
    this.saveState();
  }

  // --- Bank Methods ---
  getBank(bankId) {
    return this.banks.find(b => b.id === bankId);
  }

  getCardsForBank(bankId) {
    return this.cards.filter(c => c.bankId === bankId);
  }

  canAddCardToBank(bankId) {
    const cards = this.getCardsForBank(bankId);
    return cards.length < 3; // Strict 3-card cap!
  }

  addBank({ name, shortCode, accentColor }) {
    const id = 'bank_' + Date.now();
    const newBank = {
      id,
      name: name.trim(),
      shortCode: (shortCode || name.substring(0, 4)).trim().toUpperCase(),
      accentColor: accentColor || '#002D62',
      createdAt: new Date().toISOString()
    };
    this.banks.push(newBank);
    this.saveState();
    return newBank;
  }

  updateBank(bankId, { name, shortCode, accentColor }) {
    const bank = this.getBank(bankId);
    if (!bank) return false;
    if (name) bank.name = name.trim();
    if (shortCode) bank.shortCode = shortCode.trim().toUpperCase();
    if (accentColor) bank.accentColor = accentColor;
    this.saveState();
    return true;
  }

  deleteBank(bankId) {
    // Delete bank, its cards, and associated transactions
    const bankCards = this.getCardsForBank(bankId);
    const cardIds = new Set(bankCards.map(c => c.id));

    this.banks = this.banks.filter(b => b.id !== bankId);
    this.cards = this.cards.filter(c => c.bankId !== bankId);
    this.transactions = this.transactions.filter(t => !cardIds.has(t.cardId) && t.bankId !== bankId);
    this.saveState();
    return true;
  }

  // --- Card Methods ---
  getCard(cardId) {
    return this.cards.find(c => c.id === cardId);
  }

  addCard({ bankId, name, last4, cardType, monthlyTarget, cycleStartDay, cycleEndDay, network }) {
    // Strict 3-card cap enforcement
    if (!this.canAddCardToBank(bankId)) {
      throw new Error('This bank already has the maximum of 3 cards allowed.');
    }

    if (!last4 || !/^\d{4}$/.test(last4)) {
      throw new Error('Please enter exactly 4 digits for the card number.');
    }

    if (cardType === 'credit') {
      const start = parseInt(cycleStartDay, 10);
      const end = parseInt(cycleEndDay, 10);
      if (isNaN(start) || start < 1 || start > 31 || isNaN(end) || end < 1 || end > 31) {
        throw new Error('Cycle Start Day and End Day must be valid numbers between 1 and 31.');
      }
    }

    const id = 'card_' + Date.now();
    const newCard = {
      id,
      bankId,
      name: name.trim(),
      last4: last4.trim(),
      cardType, // 'credit' | 'debit' | 'prepaid'
      monthlyTarget: parseFloat(monthlyTarget) || 0,
      cycleStartDay: cardType === 'credit' ? parseInt(cycleStartDay, 10) : null,
      cycleEndDay: cardType === 'credit' ? parseInt(cycleEndDay, 10) : null,
      network: network || (cardType === 'prepaid' ? 'Meeza' : 'Visa'),
      createdAt: new Date().toISOString()
    };

    this.cards.push(newCard);
    this.saveState();
    return newCard;
  }

  updateCard(cardId, data) {
    const card = this.getCard(cardId);
    if (!card) return false;

    if (data.name) card.name = data.name.trim();
    if (data.last4 && /^\d{4}$/.test(data.last4)) card.last4 = data.last4.trim();
    if (data.cardType) card.cardType = data.cardType;
    if (data.monthlyTarget !== undefined) card.monthlyTarget = parseFloat(data.monthlyTarget) || 0;

    if (card.cardType === 'credit') {
      if (data.cycleStartDay) card.cycleStartDay = parseInt(data.cycleStartDay, 10);
      if (data.cycleEndDay) card.cycleEndDay = parseInt(data.cycleEndDay, 10);
    } else {
      card.cycleStartDay = null;
      card.cycleEndDay = null;
    }

    this.saveState();
    return true;
  }

  deleteCard(cardId) {
    this.cards = this.cards.filter(c => c.id !== cardId);
    this.transactions = this.transactions.filter(t => t.cardId !== cardId);
    this.saveState();
    return true;
  }

  // --- Transaction Methods ---
  getTransaction(txId) {
    return this.transactions.find(t => t.id === txId);
  }

  addTransaction({ amount, merchant, category, date, bankId, cardId, notes }) {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid positive amount.');
    }
    if (!merchant || !merchant.trim()) {
      throw new Error('Please enter a merchant or description.');
    }
    if (!cardId) {
      throw new Error('Please select a card.');
    }

    const card = this.getCard(cardId);
    if (!card) throw new Error('Selected card was not found.');

    const bId = bankId || card.bankId;

    const id = 'tx_' + Date.now();
    const newTx = {
      id,
      amount: parseFloat(amount),
      merchant: merchant.trim(),
      category: category || 'other',
      date: date || new Date().toISOString().split('T')[0],
      bankId: bId,
      cardId: card.id,
      notes: (notes || '').trim(),
      createdAt: new Date().toISOString()
    };

    this.transactions.unshift(newTx); // most recent first
    this.saveState();
    return newTx;
  }

  deleteTransaction(txId) {
    this.transactions = this.transactions.filter(t => t.id !== txId);
    this.saveState();
    return true;
  }

  // --- Enriched Transactions with Smart Cycle Tags ---
  getEnrichedTransactions() {
    return this.transactions.map(tx => {
      const card = this.getCard(tx.cardId);
      const bank = card ? this.getBank(card.bankId) : (tx.bankId ? this.getBank(tx.bankId) : null);

      let statementInfo = null;
      if (card && card.cardType === 'credit' && card.cycleStartDay && card.cycleEndDay) {
        statementInfo = calculateBillingStatement(tx.date, card.cycleStartDay, card.cycleEndDay);
      } else {
        // Debit or prepaid or non-cycle: calendar month
        const parts = (tx.date || '').split('-');
        const year = parts[0];
        const month = parts[1];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mIdx = parseInt(month, 10) - 1;
        const shortName = shortMonths[mIdx] || '';
        const mName = monthNames[mIdx] || 'Current';
        statementInfo = {
          statementKey: `${year}-${month}`,
          statementYear: parseInt(year, 10),
          statementMonth: parseInt(month, 10),
          statementMonthName: mName,
          statementBadge: `${shortName} ${year}`,
          statementFullBadge: `${shortName} ${year} Calendar Month`,
          cycleRange: `Calendar Month ${shortName} ${year}`,
          isStandardMonth: true
        };
      }

      return {
        ...tx,
        card,
        bank,
        statementInfo
      };
    });
  }

  // --- Filtering Engine ---
  getFilteredTransactions() {
    let list = this.getEnrichedTransactions();

    // 1. Account Filter
    if (this.selectedAccountFilter !== 'all') {
      if (this.selectedAccountFilter.startsWith('bank:')) {
        const bankId = this.selectedAccountFilter.replace('bank:', '');
        list = list.filter(t => t.bankId === bankId || (t.card && t.card.bankId === bankId));
      } else if (this.selectedAccountFilter.startsWith('card:')) {
        const cardId = this.selectedAccountFilter.replace('card:', '');
        list = list.filter(t => t.cardId === cardId);
      }
    }

    // 2. Statement Month Filter
    if (this.selectedStatementFilter !== 'all') {
      list = list.filter(t => t.statementInfo && t.statementInfo.statementKey === this.selectedStatementFilter);
    }

    // 3. Category Filter
    if (this.selectedCategoryFilter !== 'all') {
      list = list.filter(t => t.category === this.selectedCategoryFilter);
    }

    // 4. Search Query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(t => {
        return (
          t.merchant.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          t.amount.toString().includes(q) ||
          (t.card && t.card.name.toLowerCase().includes(q)) ||
          (t.bank && t.bank.name.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }

  // --- Unique Available Statement Months for Dropdown ---
  getAvailableStatementMonths() {
    const enriched = this.getEnrichedTransactions();
    const map = new Map();

    enriched.forEach(tx => {
      if (tx.statementInfo && tx.statementInfo.statementKey) {
        if (!map.has(tx.statementInfo.statementKey)) {
          map.set(tx.statementInfo.statementKey, {
            key: tx.statementInfo.statementKey,
            badge: tx.statementInfo.statementBadge,
            full: tx.statementInfo.statementFullBadge
          });
        }
      }
    });

    // Sort descending by key (e.g., '2026-12', '2026-11')
    return Array.from(map.values()).sort((a, b) => b.key.localeCompare(a.key));
  }

  // --- Target & Limit Tracking per Card & Overall ---
  getCardSpendingStats(cardId, filterStatementKey = null) {
    const card = this.getCard(cardId);
    if (!card) return null;

    const enriched = this.getEnrichedTransactions();
    let cardTxs = enriched.filter(t => t.cardId === cardId);

    // If filtering by a specific statement key, filter accordingly;
    // Otherwise, default to the most recent statement/cycle for this card
    if (filterStatementKey && filterStatementKey !== 'all') {
      cardTxs = cardTxs.filter(t => t.statementInfo && t.statementInfo.statementKey === filterStatementKey);
    } else {
      // Find the latest statement key for this card to show the current active billing cycle
      const statementKeys = cardTxs.map(t => t.statementInfo?.statementKey).filter(Boolean);
      statementKeys.sort().reverse();
      const currentCycleKey = statementKeys[0];
      if (currentCycleKey) {
        cardTxs = cardTxs.filter(t => t.statementInfo && t.statementInfo.statementKey === currentCycleKey);
      }
    }

    const spent = cardTxs.reduce((sum, t) => sum + t.amount, 0);
    const target = card.monthlyTarget || 0;
    const percentage = target > 0 ? (spent / target) * 100 : 0;
    const isExceeded = target > 0 && spent > target;
    const overAmount = isExceeded ? spent - target : 0;
    const remaining = !isExceeded && target > 0 ? target - spent : 0;
    const isWarning = target > 0 && percentage >= 80 && !isExceeded;

    let status = 'normal'; // 'normal' | 'warning' | 'exceeded'
    if (isExceeded) status = 'exceeded';
    else if (isWarning) status = 'warning';

    return {
      card,
      spent,
      target,
      percentage: Math.min(percentage, 100),
      rawPercentage: percentage,
      isExceeded,
      overAmount,
      remaining,
      isWarning,
      status,
      txCount: cardTxs.length
    };
  }

  // --- Overall Dashboard Target Stats ---
  getOverallStats() {
    const filteredTxs = this.getFilteredTransactions();
    const totalSpent = filteredTxs.reduce((sum, t) => sum + t.amount, 0);
    const totalCount = filteredTxs.length;

    // Calculate total targets based on current account filter
    let activeCards = this.cards;
    if (this.selectedAccountFilter.startsWith('bank:')) {
      const bankId = this.selectedAccountFilter.replace('bank:', '');
      activeCards = this.cards.filter(c => c.bankId === bankId);
    } else if (this.selectedAccountFilter.startsWith('card:')) {
      const cardId = this.selectedAccountFilter.replace('card:', '');
      activeCards = this.cards.filter(c => c.id === cardId);
    }

    const totalTarget = activeCards.reduce((sum, c) => sum + (c.monthlyTarget || 0), 0);
    const overallPercentage = totalTarget > 0 ? (totalSpent / totalTarget) * 100 : 0;
    const isExceeded = totalTarget > 0 && totalSpent > totalTarget;
    const overAmount = isExceeded ? totalSpent - totalTarget : 0;
    const remaining = !isExceeded && totalTarget > 0 ? totalTarget - totalSpent : 0;
    const isWarning = totalTarget > 0 && overallPercentage >= 80 && !isExceeded;

    // Check if ANY active card has exceeded its limit
    const exceededCards = [];
    const warningCards = [];

    activeCards.forEach(card => {
      const stats = this.getCardSpendingStats(card.id, this.selectedStatementFilter);
      if (stats) {
        if (stats.isExceeded) exceededCards.push(stats);
        else if (stats.isWarning) warningCards.push(stats);
      }
    });

    return {
      totalSpent,
      totalCount,
      totalTarget,
      overallPercentage: Math.min(overallPercentage, 100),
      rawPercentage: overallPercentage,
      isExceeded,
      overAmount,
      remaining,
      isWarning,
      exceededCards,
      warningCards,
      activeCardsCount: activeCards.length
    };
  }
}

// Export global instance
window.walletStore = new WalletAppStore();
