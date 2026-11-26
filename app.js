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

// --- Egyptian Banks Catalog (34 Banks + Other Bank) ---
// Brand colors documentation:
// VERIFIED:
// - HSBC: #db0011 (official art)
// - NBK: #0e4c8c (official)
// - ADIB: #066094 (official)
// - Banque Misr: #871e35 (official site)
// - Credit Agricole: #3f8277 (official site)
// THIRD-PARTY ART / TUNED:
// - CIB: #002d62 (navy/blue, third-party art)
// - Banque du Caire: #f26a21 (graphite + orange, third-party)
// UNVERIFIED GUESSES (can be tuned or corrected by owner later):
// - QNB: #7c003d (unverified guess)
// - NBE: #0a5c3a (unverified guess)
// - NXT: #3a1d6e (unverified guess)
// - All other banks below marked verified: false (unverified dominant brand colors)
const EGYPTIAN_BANKS = [
  {
    key: 'cib',
    shortCode: 'CIB',
    nameEn: 'CIB',
    nameAr: 'البنك التجاري الدولي (CIB)',
    brandColor: '#002D62', // third-party art
    verified: false,
    types: ['credit', 'debit'],
    variants: [
      { id: 'cib_prime', nameEn: 'Prime', nameAr: 'برايم', type: 'debit', look: 'cib_prime' },
      { id: 'cib_titanium', nameEn: 'Titanium', nameAr: 'تيتانيوم', type: 'credit', look: 'cib_titanium' },
      { id: 'cib_cashback', nameEn: 'Cashback', nameAr: 'كاش باك', type: 'credit', look: 'cib_cashback' },
      { id: 'cib_gold', nameEn: 'Gold', nameAr: 'جولد', type: 'credit', look: 'cib_gold' }
    ]
  },
  {
    key: 'nbe',
    shortCode: 'NBE',
    nameEn: 'National Bank of Egypt (NBE)',
    nameAr: 'البنك الأهلي المصري',
    brandColor: '#0a5c3a', // unverified guess
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'bm',
    shortCode: 'BM',
    nameEn: 'Banque Misr',
    nameAr: 'بنك مصر',
    brandColor: '#871e35', // official site
    verified: true,
    types: ['credit', 'debit']
  },
  {
    key: 'qnb',
    shortCode: 'QNB',
    nameEn: 'QNB',
    nameAr: 'بنك قطر الوطني (QNB)',
    brandColor: '#7c003d', // unverified guess
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'hsbc',
    shortCode: 'HSBC',
    nameEn: 'HSBC',
    nameAr: 'إتش إس بي سي (HSBC)',
    brandColor: '#db0011', // official art
    verified: true,
    types: ['credit', 'debit']
  },
  {
    key: 'nbk',
    shortCode: 'NBK',
    nameEn: 'NBK (National Bank of Kuwait Egypt)',
    nameAr: 'بنك الكويت الوطني مصر (NBK)',
    brandColor: '#0e4c8c', // official
    verified: true,
    types: ['credit', 'debit'],
    variants: [
      { id: 'nbk_debit', nameEn: 'Debit', nameAr: 'ديبت', type: 'debit', look: 'nbk_debit' },
      { id: 'nbk_gold', nameEn: 'Gold', nameAr: 'جولد', type: 'credit', look: 'nbk_gold' },
      { id: 'nbk_titanium', nameEn: 'Titanium', nameAr: 'تيتانيوم', type: 'credit', look: 'nbk_titanium' }
    ]
  },
  {
    key: 'bdc',
    shortCode: 'BDC',
    nameEn: 'Banque du Caire',
    nameAr: 'بنك القاهرة',
    brandColor: '#f26a21', // third-party graphite/orange
    verified: false,
    types: ['credit', 'debit'],
    variants: [
      { id: 'bdc_debit', nameEn: 'Debit', nameAr: 'ديبت', type: 'debit', look: 'bdc_debit' },
      { id: 'bdc_titanium', nameEn: 'Titanium', nameAr: 'تيتانيوم', type: 'credit', look: 'bdc_titanium' }
    ]
  },
  {
    key: 'adib',
    shortCode: 'ADIB',
    nameEn: 'ADIB (Abu Dhabi Islamic Bank)',
    nameAr: 'مصرف أبوظبي الإسلامي (ADIB)',
    brandColor: '#066094', // official
    verified: true,
    types: ['credit', 'debit']
  },
  {
    key: 'ca',
    shortCode: 'CA',
    nameEn: 'Credit Agricole',
    nameAr: 'كريدي أجريكول مصر',
    brandColor: '#3f8277', // official site
    verified: true,
    types: ['credit', 'debit']
  },
  {
    key: 'nxt',
    shortCode: 'NXT',
    nameEn: 'NXT',
    nameAr: 'بنك نكست',
    brandColor: '#3a1d6e', // unverified guess
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'abe',
    shortCode: 'ABE',
    nameEn: 'Agricultural Bank of Egypt',
    nameAr: 'البنك الزراعي المصري',
    brandColor: '#1a5e20', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'midbank',
    shortCode: 'MID',
    nameEn: 'Midbank',
    nameAr: 'ميد بنك',
    brandColor: '#e30613', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'enbd',
    shortCode: 'ENBD',
    nameEn: 'Emirates NBD Egypt',
    nameAr: 'بنك الإمارات دبي الوطني مصر',
    brandColor: '#0b3082', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'abc',
    shortCode: 'ABC',
    nameEn: 'Arab Banking Corporation Egypt (ABC)',
    nameAr: 'بنك المؤسسة العربية المصرفية مصر (ABC)',
    brandColor: '#c20430', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'fab',
    shortCode: 'FAB',
    nameEn: 'First Abu Dhabi Bank Egypt (FAB Misr)',
    nameAr: 'بنك أبوظبي الأول مصر (FAB Misr)',
    brandColor: '#002b49', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'egbank',
    shortCode: 'EGB',
    nameEn: 'Egyptian Gulf Bank',
    nameAr: 'البنك المصري الخليجي (EG Bank)',
    brandColor: '#005596', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'aaib',
    shortCode: 'AAIB',
    nameEn: 'Arab African International Bank (AAIB)',
    nameAr: 'البنك العربي الأفريقي الدولي (AAIB)',
    brandColor: '#9b111e', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'ealb',
    shortCode: 'EALB',
    nameEn: 'Egyptian Arab Land Bank',
    nameAr: 'البنك العقاري المصري العربي',
    brandColor: '#1c355e', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'mashreq',
    shortCode: 'MASH',
    nameEn: 'Mashreq Egypt',
    nameAr: 'بنك المشرق مصر',
    brandColor: '#ff5a00', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'alex',
    shortCode: 'ALEX',
    nameEn: 'Alex Bank',
    nameAr: 'بنك الإسكندرية',
    brandColor: '#004b32', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'abk',
    shortCode: 'ABK',
    nameEn: 'Al Ahli Bank of Kuwait Egypt',
    nameAr: 'البنك الأهلي الكويتي مصر (ABK)',
    brandColor: '#004f9f', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'scb',
    shortCode: 'SCB',
    nameEn: 'Suez Canal Bank',
    nameAr: 'بنك قناة السويس',
    brandColor: '#003366', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'arabbank',
    shortCode: 'ARAB',
    nameEn: 'Arab Bank',
    nameAr: 'البنك العربي',
    brandColor: '#002b49', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'hdb',
    shortCode: 'HDB',
    nameEn: 'Housing and Development Bank',
    nameAr: 'بنك التعمير والإسكان (HDB)',
    brandColor: '#004d2c', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'saib',
    shortCode: 'SAIB',
    nameEn: 'SAIB',
    nameAr: 'بنك الشركة المصرفية العربية الدولية (SAIB)',
    brandColor: '#c49a45', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'ebank',
    shortCode: 'EBANK',
    nameEn: 'Export Development Bank of Egypt',
    nameAr: 'البنك المصري لتنمية الصادرات (EBank)',
    brandColor: '#003b70', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'aib',
    shortCode: 'AIB',
    nameEn: 'Arab International Bank',
    nameAr: 'المصرف العربي الدولي',
    brandColor: '#103058', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'adcb',
    shortCode: 'ADCB',
    nameEn: 'ADCB Egypt',
    nameAr: 'بنك أبوظبي التجاري مصر (ADCB)',
    brandColor: '#d31145', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'ub',
    shortCode: 'UB',
    nameEn: 'The United Bank',
    nameAr: 'المصرف المتحد',
    brandColor: '#005a9c', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'idb',
    shortCode: 'IDB',
    nameEn: 'Industrial Development Bank',
    nameAr: 'بنك التنمية الصناعية (IDB)',
    brandColor: '#003366', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'attijari',
    shortCode: 'AWB',
    nameEn: 'Attijariwafa Bank Egypt',
    nameAr: 'التجاري وفا بنك مصر',
    brandColor: '#f2a900', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'baraka',
    shortCode: 'BARAKA',
    nameEn: 'Al Baraka Bank Egypt',
    nameAr: 'بنك البركة مصر',
    brandColor: '#004b32', // unverified
    verified: false,
    types: ['debit'] // debit only as specified
  },
  {
    key: 'faisal',
    shortCode: 'FAISAL',
    nameEn: 'Faisal Islamic Bank',
    nameAr: 'بنك فيصل الإسلامي المصري',
    brandColor: '#155724', // unverified
    verified: false,
    types: ['debit'] // debit only as specified
  },
  {
    key: 'kfh',
    shortCode: 'KFH',
    nameEn: 'Kuwait Finance House Egypt',
    nameAr: 'بيت التمويل الكويتي مصر (KFH)',
    brandColor: '#006837', // unverified
    verified: false,
    types: ['credit', 'debit']
  },
  {
    key: 'other',
    shortCode: 'OTHER',
    nameEn: 'Other bank',
    nameAr: 'بنك آخر',
    brandColor: '#6c737c', // neutral titanium tint
    verified: false,
    types: ['credit', 'debit']
  }
];

// --- 7 Tier Styles (Drawn in code, tinted with bank brand color) ---
const CARD_TIER_STYLES = [
  { id: 'classic', key: 'tier_classic', nameEn: 'Classic', nameAr: 'كلاسيك', descEn: 'Charcoal gradient, clean', descAr: 'تدرج رمادي فحمي بدون نقوش' },
  { id: 'gold', key: 'tier_gold', nameEn: 'Gold', nameAr: 'جولد', descEn: 'Soft diagonal sheen band', descAr: 'شريط بريق ذهبي ناعم' },
  { id: 'titanium', key: 'tier_titanium', nameEn: 'Titanium', nameAr: 'تيتانيوم', descEn: 'Fine brushed metal lines', descAr: 'خطوط معدنية ناعمة مصقولة' },
  { id: 'platinum', key: 'tier_platinum', nameEn: 'Platinum', nameAr: 'بلاتينيوم', descEn: 'Thin light diagonal stripe', descAr: 'خط بلاتيني قطري رفيع' },
  { id: 'world', key: 'tier_world', nameEn: 'World', nameAr: 'ورلد', descEn: 'Subtle globe/meridian arcs', descAr: 'أقواس خطوط الطول والكرة الأرضية' },
  { id: 'cashback', key: 'tier_cashback', nameEn: 'Cashback', nameAr: 'كاش باك', descEn: 'Amber ring & chevron', descAr: 'حلقة برتقالية وأسهم كاش باك' },
  { id: 'debit', key: 'tier_debit', nameEn: 'Debit', nameAr: 'ديبت', descEn: 'Clean contactless waves', descAr: 'أمواج الدفع اللاتلامسي' }
];

// --- 9 Real Cards (Hand-tuned to match v4 sheet) ---
const REAL_CARD_LOOKS = {
  cib_prime: {
    id: 'cib_prime',
    bankKey: 'cib',
    cardType: 'debit',
    nameEn: 'CIB Prime Debit',
    nameAr: 'برايم ديبت CIB',
    variantNameEn: 'Prime',
    variantNameAr: 'برايم',
    gradient: 'linear-gradient(135deg, #1ab0d6 0%, #0780a8 100%)',
    motif: 'cib_cloud'
  },
  cib_titanium: {
    id: 'cib_titanium',
    bankKey: 'cib',
    cardType: 'credit',
    nameEn: 'CIB Titanium Credit',
    nameAr: 'تيتانيوم كريدت CIB',
    variantNameEn: 'Titanium',
    variantNameAr: 'تيتانيوم',
    gradient: 'linear-gradient(135deg, #0d4a55 0%, #0a6f73 100%)',
    motif: 'cib_concentric'
  },
  cib_cashback: {
    id: 'cib_cashback',
    bankKey: 'cib',
    cardType: 'credit',
    nameEn: 'CIB Cashback Credit',
    nameAr: 'كاش باك كريدت CIB',
    variantNameEn: 'Cashback',
    variantNameAr: 'كاش باك',
    gradient: 'linear-gradient(135deg, #0a1f6b 0%, #2a52c4 100%)',
    motif: 'cib_cashback_chevron'
  },
  cib_gold: {
    id: 'cib_gold',
    bankKey: 'cib',
    cardType: 'credit',
    nameEn: 'CIB Gold Credit',
    nameAr: 'جولد كريدت CIB',
    variantNameEn: 'Gold',
    variantNameAr: 'جولد',
    gradient: 'linear-gradient(135deg, #7a5a14 0%, #c9a23a 60%, #8a6a1c 100%)',
    motif: 'gold_sheen'
  },
  bdc_debit: {
    id: 'bdc_debit',
    bankKey: 'bdc',
    cardType: 'debit',
    nameEn: 'Banque du Caire Debit',
    nameAr: 'ديبت بنك القاهرة',
    variantNameEn: 'Debit',
    variantNameAr: 'ديبت',
    gradient: 'linear-gradient(135deg, #8fe0c8 0%, #c9f0e2 100%)',
    motif: 'bdc_arch',
    isLightMint: true
  },
  bdc_titanium: {
    id: 'bdc_titanium',
    bankKey: 'bdc',
    cardType: 'credit',
    nameEn: 'Banque du Caire Titanium Credit',
    nameAr: 'تيتانيوم كريدت بنك القاهرة',
    variantNameEn: 'Titanium',
    variantNameAr: 'تيتانيوم',
    gradient: 'linear-gradient(135deg, #6c6e72 0%, #c8cacd 55%, #808387 100%)',
    motif: 'bdc_arch'
  },
  nbk_debit: {
    id: 'nbk_debit',
    bankKey: 'nbk',
    cardType: 'debit',
    nameEn: 'NBK Debit',
    nameAr: 'ديبت بنك الكويت الوطني',
    variantNameEn: 'Debit',
    variantNameAr: 'ديبت',
    gradient: 'linear-gradient(135deg, #102a7a 0%, #4a6fd0 55%, #1a2f80 100%)',
    motif: 'nbk_wave'
  },
  nbk_gold: {
    id: 'nbk_gold',
    bankKey: 'nbk',
    cardType: 'credit',
    nameEn: 'NBK Gold Credit',
    nameAr: 'جولد كريدت بنك الكويت الوطني',
    variantNameEn: 'Gold',
    variantNameAr: 'جولد',
    gradient: 'linear-gradient(135deg, #5e4210 0%, #b8943a 55%, #6b4c14 100%)',
    motif: 'nbk_wave'
  },
  nbk_titanium: {
    id: 'nbk_titanium',
    bankKey: 'nbk',
    cardType: 'credit',
    nameEn: 'NBK Titanium Credit',
    nameAr: 'تيتانيوم كريدت بنك الكويت الوطني',
    variantNameEn: 'Titanium',
    variantNameAr: 'تيتانيوم',
    gradient: 'linear-gradient(135deg, #2a3038 0%, #7d8691 55%, #3a424b 100%)',
    motif: 'nbk_wave'
  }
};

/**
 * Returns sorted Egyptian banks for UI dropdowns.
 * Sorted alphabetically in the active language, with "Other bank / بنك آخر" placed last.
 */
function getEgyptianBanks(lang = 'ar') {
  const isEn = lang === 'en';
  const regular = EGYPTIAN_BANKS.filter(b => b.key !== 'other');
  const other = EGYPTIAN_BANKS.find(b => b.key === 'other');
  regular.sort((a, b) => {
    const nameA = isEn ? a.nameEn : a.nameAr;
    const nameB = isEn ? b.nameEn : b.nameAr;
    return nameA.localeCompare(nameB, isEn ? 'en' : 'ar', { sensitivity: 'base' });
  });
  return other ? [...regular, other] : regular;
}

/**
 * Finds a bank catalog entry by key, code, or name.
 * @param {string} query
 * @param {boolean} [exactOnly=false] - If true, only matches exact shortCode, key, or name
 */
function findBankInCatalog(query, exactOnly = false) {
  if (!query) return null;
  const q = String(query).trim().toLowerCase();
  if (!q) return null;

  // Exact match first on key, shortCode, or name (English or Arabic)
  let match = EGYPTIAN_BANKS.find(b => 
    b.key.toLowerCase() === q ||
    b.shortCode.toLowerCase() === q ||
    b.nameEn.toLowerCase() === q ||
    b.nameAr.toLowerCase() === q
  );
  if (match) return match;
  if (exactOnly) return null;

  // Substring / fuzzy match
  // 1. Never match generic words like "bank" or short queries (< 3 chars) to avoid false positives (e.g. "Bank" -> NBE, "L" -> NBE)
  const genericWords = ['bank', 'بنك'];
  if (genericWords.includes(q) || q.length < 3) return null;

  // 2. Substring match without loose single-code / short-code containment
  // (q.includes(b.shortCode) fuzzy branch removed to prevent false positives like "Cairo" -> CA)
  return EGYPTIAN_BANKS.find(b =>
    b.nameEn.toLowerCase().includes(q) ||
    b.nameAr.toLowerCase().includes(q) ||
    q.includes(b.nameEn.toLowerCase()) ||
    q.includes(b.nameAr.toLowerCase())
  ) || null;
}

/**
 * Finds a bank catalog entry strictly by exact match on shortCode, key, or name.
 */
function findBankExactMatch(query) {
  return findBankInCatalog(query, true);
}

/**
 * Resolves the visual look info for a given card.
 */
function getCardLookInfo(card, bank) {
  if (!card) return { lookKey: null, isDefault: true };

  const preset = card.colorPreset || null;
  const customColor = card.customColor || null;

  // Resolve associated bank info
  let bankBrandColor = '#6c737c'; // default neutral tint
  let bankCatalogEntry = null;

  if (bank) {
    bankCatalogEntry = findBankInCatalog(bank.shortCode, true) || findBankInCatalog(bank.name, true);
    bankBrandColor = (bankCatalogEntry && bankCatalogEntry.brandColor) || bank.accentColor || '#6c737c';
  }

  // 1. Check if matching one of the 9 Real Cards
  if (preset && REAL_CARD_LOOKS[preset]) {
    const realLook = REAL_CARD_LOOKS[preset];
    return {
      lookKey: preset,
      isRealCard: true,
      realLook,
      tierStyle: null,
      motif: realLook.motif,
      gradient: realLook.gradient,
      isLightMint: Boolean(realLook.isLightMint),
      brandColor: bankBrandColor,
      isDefault: false,
      isCustomColor: false
    };
  }

  // 2. Check if matching one of the 7 Tier Styles (e.g. 'tier_classic', 'tier_gold', or bare 'classic', etc.)
  const tierMatch = CARD_TIER_STYLES.find(t => t.key === preset || t.id === preset);
  if (tierMatch) {
    return {
      lookKey: tierMatch.key,
      isRealCard: false,
      tierStyle: tierMatch.id,
      tierInfo: tierMatch,
      motif: tierMatch.id,
      brandColor: bankBrandColor,
      isDefault: false,
      isCustomColor: false
    };
  }

  // 3. Custom color
  if (customColor) {
    return {
      lookKey: 'custom',
      isRealCard: false,
      tierStyle: null,
      isCustomColor: true,
      customColor,
      gradient: `linear-gradient(135deg, ${customColor} 0%, #0F172A 100%)`,
      brandColor: customColor,
      isDefault: false
    };
  }

  // 4. Legacy CARD_THEMES preset (if any from older version)
  if (preset && CARD_THEMES[preset]) {
    return {
      lookKey: preset,
      isLegacyPreset: true,
      gradient: CARD_THEMES[preset].gradient,
      brandColor: CARD_THEMES[preset].color || bankBrandColor,
      isDefault: false
    };
  }

  // 5. Default card face (approved dark amber look)
  return {
    lookKey: null,
    isDefault: true,
    brandColor: bankBrandColor
  };
}

// --- Card Color & Gradient Themes (Real Bank & Luxury Styles) ---
const CARD_THEMES = {
  cib: { id: 'cib', name: 'CIB Navy', gradient: 'linear-gradient(135deg, #002D62 0%, #06172E 100%)', color: '#002D62', isDark: true },
  hsbc: { id: 'hsbc', name: 'HSBC Crimson', gradient: 'linear-gradient(135deg, #DB0011 0%, #660008 100%)', color: '#DB0011', isDark: true },
  qnb: { id: 'qnb', name: 'QNB Wine', gradient: 'linear-gradient(135deg, #7C003D 0%, #3B001D 100%)', color: '#7C003D', isDark: true },
  nbe: { id: 'nbe', name: 'NBE Forest', gradient: 'linear-gradient(135deg, #006837 0%, #002816 100%)', color: '#006837', isDark: true },
  bm: { id: 'bm', name: 'Banque Misr', gradient: 'linear-gradient(135deg, #991B1E 0%, #4D090B 100%)', color: '#991B1E', isDark: true },
  enbd: { id: 'enbd', name: 'Emirates NBD', gradient: 'linear-gradient(135deg, #0B3082 0%, #051842 100%)', color: '#0B3082', isDark: true },
  indigo: { id: 'indigo', name: 'Indigo Violet', gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: '#4F46E5', isDark: true },
  midnight: { id: 'midnight', name: 'Obsidian Black', gradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#0F172A', isDark: true },
  emerald: { id: 'emerald', name: 'Emerald Teal', gradient: 'linear-gradient(135deg, #059669 0%, #044E47 100%)', color: '#059669', isDark: true },
  rose: { id: 'rose', name: 'Sunset Rose', gradient: 'linear-gradient(135deg, #E11D48 0%, #881337 100%)', color: '#E11D48', isDark: true },
  gold: { id: 'gold', name: 'Champagne Gold', gradient: 'linear-gradient(135deg, #D97706 0%, #78350F 100%)', color: '#D97706', isDark: true },
  cyan: { id: 'cyan', name: 'Electric Cyan', gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: '#0284C7', isDark: true }
};

function getCardGradientStyle(card, bank) {
  if (card && card.colorPreset && CARD_THEMES[card.colorPreset]) {
    return CARD_THEMES[card.colorPreset].gradient;
  }
  if (card && card.customColor) {
    return `linear-gradient(135deg, ${card.customColor} 0%, #0F172A 100%)`;
  }
  if (bank && bank.accentColor) {
    return `linear-gradient(135deg, ${bank.accentColor} 0%, #0F172A 100%)`;
  }
  return 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)';
}

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
      creditLimit: 50000,
      monthlyTarget: 25000,
      cycleBudgets: {},
      cycleStartDay: 25,
      cycleEndDay: 24,
      network: 'Mastercard',
      colorPreset: 'cib',
      createdAt: '2026-01-01'
    },
    {
      id: 'card_cib_debit',
      bankId: 'bank_cib',
      name: 'Plus Salary Debit',
      last4: '1044',
      cardType: 'debit',
      linkedAccountId: 'acc_cib_current',
      creditLimit: null,
      monthlyTarget: 15000,
      cycleBudgets: {},
      cycleStartDay: null,
      cycleEndDay: null,
      network: 'Visa',
      colorPreset: 'indigo',
      createdAt: '2026-01-01'
    },
    // HSBC Cards (2 cards)
    {
      id: 'card_hsbc_cashback',
      bankId: 'bank_hsbc',
      name: 'Advance Cashback',
      last4: '5521',
      cardType: 'credit',
      creditLimit: 40000,
      monthlyTarget: 20000,
      cycleBudgets: {},
      cycleStartDay: 15,
      cycleEndDay: 14,
      network: 'Visa',
      colorPreset: 'hsbc',
      createdAt: '2026-01-02'
    },
    {
      id: 'card_hsbc_premier',
      bankId: 'bank_hsbc',
      name: 'Premier Savings',
      last4: '3389',
      cardType: 'debit',
      creditLimit: null,
      monthlyTarget: 10000,
      cycleBudgets: {},
      cycleStartDay: null,
      cycleEndDay: null,
      network: 'Mastercard',
      colorPreset: 'midnight',
      createdAt: '2026-01-02'
    },
    // QNB Cards (1 card)
    {
      id: 'card_qnb_first',
      bankId: 'bank_qnb',
      name: 'First World Elite',
      last4: '7712',
      cardType: 'credit',
      creditLimit: 80000,
      monthlyTarget: 40000,
      cycleBudgets: {},
      cycleStartDay: 1,
      cycleEndDay: 30,
      network: 'Mastercard',
      colorPreset: 'qnb',
      createdAt: '2026-01-03'
    },
    // NBE Cards (3 cards - Maximum Cap Reached)
    {
      id: 'card_nbe_prepaid',
      bankId: 'bank_nbe',
      name: 'Ahly Meeza Prepaid',
      last4: '9011',
      cardType: 'prepaid',
      creditLimit: null,
      monthlyTarget: 5000,
      cycleBudgets: {},
      cycleStartDay: null,
      cycleEndDay: null,
      network: 'Meeza',
      colorPreset: 'nbe',
      createdAt: '2026-01-04'
    },
    {
      id: 'card_nbe_platinum',
      bankId: 'bank_nbe',
      name: 'Platinum Credit',
      last4: '4120',
      cardType: 'credit',
      creditLimit: 36000,
      monthlyTarget: 18000,
      cycleBudgets: {},
      cycleStartDay: 20,
      cycleEndDay: 19,
      network: 'Visa',
      colorPreset: 'gold',
      createdAt: '2026-01-04'
    },
    {
      id: 'card_nbe_gold',
      bankId: 'bank_nbe',
      name: 'Gold Master Debit',
      last4: '6310',
      cardType: 'debit',
      creditLimit: null,
      monthlyTarget: 8000,
      cycleBudgets: {},
      cycleStartDay: null,
      cycleEndDay: null,
      network: 'Mastercard',
      colorPreset: 'emerald',
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

  const accounts = [
    {
      id: 'acc_cib_current',
      bankId: 'bank_cib',
      name: 'CIB Current Account',
      identifierDigits: '1044',
      digitsPosition: 'last',
      accountNumberMasked: '•••• 1044',
      balance: 45000,
      currency: 'EGP',
      createdAt: '2026-01-01'
    }
  ];

  return { banks, cards, accounts, transactions };
}

// --- App State ---
class WalletAppStore {
  constructor() {
    this.storageKey = 'apexwallet_user_vault_v1';
    this.banks = [];
    this.cards = [];
    this.accounts = [];
    this.transactions = [];
    this.activeTab = 'dashboard';
    this.selectedAccountFilter = 'all'; // 'all' | 'bank:{id}' | 'card:{id}'
    this.selectedStatementFilter = 'all'; // 'all' | '2026-12' | '2026-11' etc.
    this.searchQuery = '';
    this.selectedCategoryFilter = 'all';
    this.loadState();
  }

  loadFromDecrypted(data) {
    if (!data) return;
    this.banks = data.banks || [];
    this.cards = data.cards || [];
    this.accounts = data.accounts || [];
    this.transactions = data.transactions || [];
  }

  loadState() {
    // Purge old demo storage keys from user browser
    try {
      localStorage.removeItem('fintech_wallet_store_v1');
    } catch (e) {}

    // If security vault is configured and locked, wait for PIN unlock
    if (typeof window !== 'undefined' && window.WalletSecurity && window.WalletSecurity.isConfigured() && window.WalletSecurity.isLocked) {
      this.banks = [];
      this.cards = [];
      this.accounts = [];
      this.transactions = [];
      return;
    }

    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.banks = parsed.banks || [];
        this.cards = parsed.cards || [];
        this.accounts = parsed.accounts || [];
        this.transactions = parsed.transactions || [];
        return;
      } catch (e) {
        console.error('Error parsing stored wallet data:', e);
      }
    }
    // Clean initial state: ZERO mock / rush / test data
    this.banks = [];
    this.cards = [];
    this.accounts = [];
    this.transactions = [];
  }

  clearAllData() {
    this.banks = [];
    this.cards = [];
    this.accounts = [];
    this.transactions = [];
    this.saveState();
  }

  saveState() {
    const payload = {
      banks: this.banks,
      cards: this.cards,
      accounts: this.accounts,
      transactions: this.transactions
    };
    if (typeof window !== 'undefined' && window.WalletSecurity && window.WalletSecurity.isConfigured() && !window.WalletSecurity.isLocked) {
      window.WalletSecurity.saveVault(payload);
    } else {
      localStorage.setItem(this.storageKey, JSON.stringify(payload));
    }
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
    const id = 'bank_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
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

  // --- Account Entity Methods (Item 6b) ---
  getAccount(accId) {
    return this.accounts.find(a => a.id === accId);
  }

  getAccountsForBank(bankId) {
    return this.accounts.filter(a => a.bankId === bankId);
  }

  addAccount({ bankId, name, identifierDigits, digitsPosition, balance, currency }) {
    if (!identifierDigits || !/^\d{4}$/.test(identifierDigits)) {
      throw new Error('Please enter exactly 4 digits identifying the account.');
    }
    const id = 'acc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const pos = digitsPosition === 'first' ? 'first' : 'last';
    const digits = identifierDigits.trim();
    const newAcc = {
      id,
      bankId,
      name: (name || 'Bank Account').trim(),
      identifierDigits: digits,
      digitsPosition: pos,
      accountNumberMasked: pos === 'first' ? `${digits} ••••` : `•••• ${digits}`,
      balance: parseFloat(balance) || 0,
      currency: currency || 'EGP',
      createdAt: new Date().toISOString()
    };
    this.accounts.push(newAcc);
    this.saveState();
    return newAcc;
  }

  deleteAccount(accId) {
    this.accounts = this.accounts.filter(a => a.id !== accId);
    // Unlink any debit cards pointing to this account
    this.cards.forEach(c => {
      if (c.linkedAccountId === accId) c.linkedAccountId = null;
    });
    this.saveState();
    return true;
  }

  updateAccount(accId, { name, newBalance, notes }) {
    const acc = this.getAccount(accId);
    if (!acc) return false;

    if (name && name.trim()) {
      acc.name = name.trim();
    }

    if (newBalance !== undefined && newBalance !== null && newBalance !== '' && !isNaN(parseFloat(newBalance))) {
      const targetBalance = parseFloat(newBalance);
      const oldBalance = acc.balance || 0;
      const diff = targetBalance - oldBalance;
      acc.balance = targetBalance;

      // If balance changed, log a visible balance adjustment transaction (Item 1)
      if (Math.abs(diff) > 0.001) {
        const isPositive = diff > 0;
        const adjTx = {
          id: 'tx_adj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
          amount: Math.abs(diff),
          direction: isPositive ? 'income' : 'expense',
          type: isPositive ? 'income' : 'expense',
          transactionType: 'balance_adjustment',
          merchant: `تسوية رصيد: ${acc.name}`,
          category: 'other',
          date: new Date().toISOString().split('T')[0],
          bankId: acc.bankId,
          cardId: null,
          accountId: acc.id,
          isBalanceAdjustment: true,
          balanceBefore: oldBalance,
          balanceAfter: targetBalance,
          notes: (notes || '').trim() || `تسوية رصيد حساب من ${oldBalance.toFixed(2)} إلى ${targetBalance.toFixed(2)} ${acc.currency || 'EGP'}`,
          createdAt: new Date().toISOString()
        };
        this.transactions.unshift(adjTx);
      }
    }

    this.saveState();
    return true;
  }

  // --- Card Methods ---
  getCard(cardId) {
    return this.cards.find(c => c.id === cardId);
  }

  addCard(data) {
    const { bankId, name, last4, cardType, monthlyTarget, creditLimit, cycleBudgets, cycleStartDay, cycleEndDay, network, colorPreset, customColor, digitsPosition, linkedAccountId } = data;
    // Strict 3-card cap enforcement
    if (!this.canAddCardToBank(bankId)) {
      throw new Error('This bank already has the maximum of 3 cards allowed.');
    }

    if (!last4 || !/^\d{4}$/.test(last4)) {
      throw new Error('Please enter exactly 4 digits for the card identifier.');
    }

    if (cardType === 'credit') {
      const start = parseInt(cycleStartDay, 10);
      const end = parseInt(cycleEndDay, 10);
      if (isNaN(start) || start < 1 || start > 31 || isNaN(end) || end < 1 || end > 31) {
        throw new Error('Cycle Start Day and End Day must be valid numbers between 1 and 31.');
      }
    }

    const id = 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const pos = digitsPosition === 'first' ? 'first' : 'last';
    const digits = last4.trim();
    const parsedTarget = parseFloat(monthlyTarget) || 0;
    const newCard = {
      id,
      bankId,
      name: name.trim(),
      last4: digits,
      identifierDigits: digits,
      digitsPosition: pos,
      linkedAccountId: linkedAccountId || null,
      cardType, // 'credit' | 'debit' | 'prepaid'
      creditLimit: cardType === 'credit'
        ? (creditLimit !== undefined && creditLimit !== null && creditLimit !== '' && !isNaN(parseFloat(creditLimit)) ? parseFloat(creditLimit) : null)
        : null,
      monthlyTarget: parsedTarget, // personal spending target / budget baseline
      cycleBudgets: cycleBudgets || {},
      acknowledgedCycles: data.acknowledgedCycles || [],
      cycleStartDay: cardType === 'credit' ? parseInt(cycleStartDay, 10) : null,
      cycleEndDay: cardType === 'credit' ? parseInt(cycleEndDay, 10) : null,
      network: network || (cardType === 'prepaid' ? 'Meeza' : 'Visa'),
      colorPreset: colorPreset || null,
      customColor: customColor || null,
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
    if (data.bankId) card.bankId = data.bankId;
    if (data.colorPreset !== undefined) card.colorPreset = data.colorPreset;
    if (data.customColor !== undefined) card.customColor = data.customColor;
    if (data.last4 && /^\d{4}$/.test(data.last4)) {
      card.last4 = data.last4.trim();
      card.identifierDigits = data.last4.trim();
    }
    if (data.digitsPosition) card.digitsPosition = data.digitsPosition;
    if (data.linkedAccountId !== undefined) card.linkedAccountId = data.linkedAccountId;
    if (data.cardType) card.cardType = data.cardType;
    if (data.monthlyTarget !== undefined) card.monthlyTarget = parseFloat(data.monthlyTarget) || 0;
    if (data.creditLimit !== undefined) {
      card.creditLimit = (data.creditLimit !== null && data.creditLimit !== '' && !isNaN(parseFloat(data.creditLimit))) ? parseFloat(data.creditLimit) : null;
    }
    if (data.cycleBudgets) card.cycleBudgets = { ...(card.cycleBudgets || {}), ...data.cycleBudgets };
    if (data.acknowledgedCycles) card.acknowledgedCycles = [...(card.acknowledgedCycles || []), ...data.acknowledgedCycles];

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

  setCardCycleBudget(cardId, statementKey, budget) {
    const card = this.getCard(cardId);
    if (!card) return false;
    card.cycleBudgets = card.cycleBudgets || {};
    card.acknowledgedCycles = card.acknowledgedCycles || [];
    const val = parseFloat(budget);
    if (!isNaN(val) && val >= 0) {
      card.cycleBudgets[statementKey] = val;
      if (!card.acknowledgedCycles.includes(statementKey)) {
        card.acknowledgedCycles.push(statementKey);
      }
      this.saveState();
      return true;
    }
    return false;
  }

  getCardsWithPendingCycleBudgetPrompt() {
    const todayIso = new Date().toISOString().split('T')[0];
    const pending = [];

    this.cards.forEach(card => {
      if (card.cardType === 'credit' && card.cycleStartDay && card.cycleEndDay) {
        const stmt = calculateBillingStatement(todayIso, card.cycleStartDay, card.cycleEndDay);
        const cycleKey = stmt.statementKey;
        card.acknowledgedCycles = card.acknowledgedCycles || [];
        card.cycleBudgets = card.cycleBudgets || {};

        // Prompt once only: if not acknowledged and no budget explicit for this cycle
        if (!card.acknowledgedCycles.includes(cycleKey) && card.cycleBudgets[cycleKey] === undefined) {
          let prevBudget = card.monthlyTarget || 0;
          const pastKeys = Object.keys(card.cycleBudgets).filter(k => k < cycleKey).sort().reverse();
          if (pastKeys.length > 0 && card.cycleBudgets[pastKeys[0]] !== undefined) {
            prevBudget = card.cycleBudgets[pastKeys[0]];
          }

          const bank = this.getBank(card.bankId);
          pending.push({
            cardId: card.id,
            cardName: card.name,
            bankName: bank ? bank.name : 'Bank',
            last4: card.last4,
            cycleKey,
            statementBadge: stmt.statementBadge,
            cycleRange: stmt.cycleRange,
            creditLimit: (card.creditLimit !== undefined && card.creditLimit !== null) ? card.creditLimit : null,
            previousBudget: prevBudget
          });
        }
      }
    });

    return pending;
  }

  confirmCycleBudget(cardId, cycleKey, budgetAmount) {
    const card = this.getCard(cardId);
    if (!card) return false;
    card.cycleBudgets = card.cycleBudgets || {};
    card.acknowledgedCycles = card.acknowledgedCycles || [];

    const num = parseFloat(budgetAmount);
    if (!isNaN(num) && num >= 0) {
      card.cycleBudgets[cycleKey] = num;
    } else {
      card.cycleBudgets[cycleKey] = card.monthlyTarget || 0;
    }

    if (!card.acknowledgedCycles.includes(cycleKey)) {
      card.acknowledgedCycles.push(cycleKey);
    }

    this.saveState();
    return true;
  }

  updateCardColor(cardId, { colorPreset, customColor }) {
    const card = this.getCard(cardId);
    if (!card) return false;
    if (colorPreset !== undefined) card.colorPreset = colorPreset;
    if (customColor !== undefined) card.customColor = customColor;
    this.saveState();
    return true;
  }

  deleteCard(cardId, keepTransactions = false) {
    this.cards = this.cards.filter(c => c.id !== cardId);
    if (keepTransactions) {
      this.transactions.forEach(t => {
        if (t.cardId === cardId) t.cardId = null;
      });
    } else {
      this.transactions = this.transactions.filter(t => t.cardId !== cardId);
    }
    this.saveState();
    return true;
  }

  // --- Transaction Methods ---
  getTransaction(txId) {
    return this.transactions.find(t => t.id === txId);
  }

  addTransaction({ amount, merchant, category, date, bankId, cardId, accountId, direction, type, transactionType, isManualAssignment, detectedBank, detectedDigits, notes, expectedAccountId, refNumber, rawMessage }) {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid positive amount.');
    }
    if (!merchant || !merchant.trim()) {
      throw new Error('Please enter a merchant or description.');
    }

    const card = cardId ? this.getCard(cardId) : null;
    let targetAccount = null;
    const txDirection = (direction === 'income' || type === 'income') ? 'income' : 'expense';
    const txAmount = parseFloat(amount);
    const txOpType = transactionType || (category === 'transfer' ? 'transfer' : 'purchase');

    // Engine-Level Account Linking & Contradiction Enforcement (Item 1 & Item 2 & Reviewer v1.4.7)
    const incomingAccountId = accountId || expectedAccountId || null;

    if (card && card.cardType === 'credit') {
      // Credit cards represent bank credit lines/obligations and NEVER deduct from a bank deposit account balance.
      // Any accountId passed alongside a credit card is strictly ignored (targetAccount = null) to protect account balances.
      targetAccount = null;
    } else if (card && card.cardType === 'debit') {
      const cardLinkedAccId = card.linkedAccountId || null;

      if (incomingAccountId) {
        if (!cardLinkedAccId) {
          throw new Error('الكارت المختار كارت دبت غير مرتبط بأي حساب بنكي، بينما العملية مخصصة لحساب بنكي. يرجى ربط الكارت بالحساب أولاً.');
        }
        if (cardLinkedAccId !== incomingAccountId) {
          throw new Error('تناقض في الحساب: العملية موجهة لحساب بنكي مختلف عن الحساب المرتبط بهذا الكارت.');
        }
        targetAccount = this.getAccount(cardLinkedAccId);
      } else if (cardLinkedAccId) {
        targetAccount = this.getAccount(cardLinkedAccId);
      } else {
        // Unlinked debit card without incoming account
        if (txOpType === 'withdrawal') {
          throw new Error('لا يمكن تسجيل عملية سحب نقدي لكارت خصم غير مرتبط بحساب بنكي. يرجى ربط الكارت بحساب أولاً لمنع ضياع الأثر المالي.');
        }
      }
    } else if (accountId) {
      targetAccount = this.getAccount(accountId);
      if (!targetAccount) {
        throw new Error('الحساب البنكي المحدد غير موجود.');
      }
    }

    // Debit cash withdrawal without a linked account CANNOT be added with zero financial effect!
    if (txOpType === 'withdrawal') {
      if (card && card.cardType === 'debit' && !targetAccount) {
        throw new Error('لا يمكن تسجيل عملية سحب نقدي لكارت خصم غير مرتبط بحساب بنكي. يرجى ربط الكارت بحساب أو اختيار حساب بنكي أولاً لمنع ضياع الأثر المالي.');
      }
      if (!card && !targetAccount) {
        throw new Error('لا يمكن تسجيل عملية سحب نقدي بدون تحديد حساب بنكي أو كارت.');
      }
    }

    const bId = bankId || (card ? card.bankId : (targetAccount ? targetAccount.bankId : null));

    // Live Account Balance Update (Item 2)
    // No double-deduction: single deduction directly on the linked account!
    if (targetAccount) {
      if (txDirection === 'income') {
        targetAccount.balance = (targetAccount.balance || 0) + txAmount;
      } else {
        targetAccount.balance = (targetAccount.balance || 0) - txAmount;
      }
    }

    const id = 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const newTx = {
      id,
      amount: txAmount,
      direction: txDirection,
      type: txDirection,
      transactionType: txOpType,
      merchant: merchant.trim(),
      category: category || 'other',
      date: date || new Date().toISOString().split('T')[0],
      bankId: bId,
      cardId: card ? card.id : null,
      accountId: targetAccount ? targetAccount.id : null,
      isManualAssignment: !!isManualAssignment,
      detectedBank: detectedBank || null,
      detectedDigits: detectedDigits || null,
      refNumber: refNumber || null,
      rawMessage: rawMessage || null,
      notes: (notes || '').trim(),
      createdAt: new Date().toISOString()
    };

    this.transactions.unshift(newTx); // most recent first
    this.saveState();
    return newTx;
  }

  deleteTransaction(txId) {
    const tx = this.getTransaction(txId);
    if (tx && tx.accountId) {
      const targetAccount = this.getAccount(tx.accountId);
      if (targetAccount) {
        if (tx.isBalanceAdjustment) {
          // Reversing balance adjustment restores balanceBefore (Item 1)
          if (tx.balanceBefore !== undefined) {
            targetAccount.balance = tx.balanceBefore;
          }
        } else {
          // Reverse effect on linked account balance
          if (tx.direction === 'income' || tx.type === 'income') {
            targetAccount.balance = (targetAccount.balance || 0) - tx.amount;
          } else {
            targetAccount.balance = (targetAccount.balance || 0) + tx.amount;
          }
        }
      }
    }
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
    let activeStatementKey = null;

    // If filtering by a specific statement key, filter accordingly;
    // Otherwise, default to the most recent statement/cycle for this card
    if (filterStatementKey && filterStatementKey !== 'all') {
      activeStatementKey = filterStatementKey;
      cardTxs = cardTxs.filter(t => t.statementInfo && t.statementInfo.statementKey === filterStatementKey);
    } else {
      if (card.cardType === 'credit' && card.cycleStartDay && card.cycleEndDay) {
        const todayIso = new Date().toISOString().split('T')[0];
        const currentStmt = calculateBillingStatement(todayIso, card.cycleStartDay, card.cycleEndDay);
        activeStatementKey = currentStmt.statementKey;
      } else {
        const todayIso = new Date().toISOString().split('T')[0];
        const parts = todayIso.split('-');
        activeStatementKey = `${parts[0]}-${parts[1]}`;
      }

      // Filter txs belonging to this active cycle
      const cycleTxs = cardTxs.filter(t => t.statementInfo && t.statementInfo.statementKey === activeStatementKey);
      if (cycleTxs.length > 0 || cardTxs.length === 0) {
        cardTxs = cycleTxs;
      } else {
        // If no transactions in current cycle yet, fallback to latest statement that has txs
        const statementKeys = cardTxs.map(t => t.statementInfo?.statementKey).filter(Boolean);
        statementKeys.sort().reverse();
        if (statementKeys[0]) {
          activeStatementKey = statementKeys[0];
          cardTxs = cardTxs.filter(t => t.statementInfo && t.statementInfo.statementKey === activeStatementKey);
        }
      }
    }

    // Item 2 & Item 5: Cash withdrawal is excluded from personal card spending budget for both debit & credit cards.
    // User Decision ("الزام"): Cash advance from a credit card is an obligation / statement debt (التزام سداد),
    // and does NOT reduce the monthly personal discretionary spending budget for consumer purchases.
    const cardExpenses = cardTxs.filter(t => {
      if (t.direction === 'income' || t.type === 'income') return false;
      if (t.transactionType === 'withdrawal') return false;
      return true;
    }).reduce((sum, t) => sum + t.amount, 0);

    const cardCashAdvance = cardTxs.filter(t => {
      if (t.direction === 'income' || t.type === 'income') return false;
      return t.transactionType === 'withdrawal';
    }).reduce((sum, t) => sum + t.amount, 0);

    const cardIncome = cardTxs.filter(t => t.direction === 'income' || t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const spent = Math.max(0, cardExpenses - cardIncome);
    const totalObligations = Math.max(0, (cardExpenses + cardCashAdvance) - cardIncome);

    // Personal Spending Budget for this cycle (cycleBudgets[key] or card.monthlyTarget)
    const target = (card.cycleBudgets && activeStatementKey && card.cycleBudgets[activeStatementKey] !== undefined)
      ? card.cycleBudgets[activeStatementKey]
      : (card.monthlyTarget || 0);

    // Bank Credit Limit: strictly user-defined, null if not entered, NEVER fabricated
    const creditLimit = (card.creditLimit !== undefined && card.creditLimit !== null && card.creditLimit !== '' && !isNaN(parseFloat(card.creditLimit)))
      ? parseFloat(card.creditLimit)
      : null;

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
      income: cardIncome,
      cashAdvance: cardCashAdvance,
      totalObligations,
      target, // Personal budget for the cycle
      creditLimit, // Bank Credit Limit
      cycleBudget: target,
      statementKey: activeStatementKey,
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
    const totalExpenses = filteredTxs.filter(t => {
      if (t.direction === 'income' || t.type === 'income') return false;
      if (t.transactionType === 'withdrawal') return false; // cash withdrawal is excluded from personal consumer spending
      return true;
    }).reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = filteredTxs.filter(t => t.direction === 'income' || t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalSpent = Math.max(0, totalExpenses - totalIncome);
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

// Export global instance (dual-export to guarantee compatibility across all modules)
if (typeof window !== 'undefined') {
  window.walletStore = new WalletAppStore();
  window.store = window.walletStore;
  window.EGYPTIAN_BANKS = EGYPTIAN_BANKS;
  window.CARD_TIER_STYLES = CARD_TIER_STYLES;
  window.REAL_CARD_LOOKS = REAL_CARD_LOOKS;
  window.getEgyptianBanks = getEgyptianBanks;
  window.findBankInCatalog = findBankInCatalog;
  window.findBankExactMatch = findBankExactMatch;
  window.getCardLookInfo = getCardLookInfo;
  window.CARD_THEMES = CARD_THEMES;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WalletAppStore,
    EGYPTIAN_BANKS,
    CARD_TIER_STYLES,
    REAL_CARD_LOOKS,
    getEgyptianBanks,
    findBankInCatalog,
    findBankExactMatch,
    getCardLookInfo,
    CARD_THEMES
  };
}
