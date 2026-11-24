/**
 * ApexWallet UI & Interaction Controller
 * Visual Card-First Aesthetic (Dark Charcoal & Amber Gold Direction)
 * - Hero Card: Tilted card object (-4deg in RTL, +4deg in LTR)
 * - Colors: #16171A (Dark bg), #1F2024 (Surface), #26272B (Raised / Dock), #F5B700 (Amber Accent)
 * - Text: #F3F1EC (Main), #9A9CA3 (Muted), #E6A8A8 (Destructive)
 * - Bilingual: Pure Arabic RTL / Pure English LTR
 */

// ==========================================
// BILINGUAL & I18N LAYER (Pure Arabic RTL / English LTR)
// ==========================================
const I18N = {
  ar: {
    home: 'الرئيسية',
    activity: 'النشاط',
    review: 'المراجعة',
    wallets: 'المحافظ',
    settings: 'الإعدادات',
    cards: 'الكروت',
    banks: 'البنوك',
    history: 'السجل',
    security: 'الأمان',
    sms_intake: 'استقبال الرسائل',
    backup_general: 'النسخ الاحتياطي والعام',
    left_of: 'متبقي من',
    cycle_purchases: 'مشتريات الدورة',
    cash_advance_debt: 'سحب نقدي (التزام)',
    total_owed: 'إجمالي الالتزام',
    bank_messages_ready: '{n} رسالة بنكية جاهزة',
    review_btn: 'مراجعة',
    recent_activity: 'النشاط الأخير',
    no_activity: 'لا توجد حركات مسجلة حتى الآن',
    all_history: 'عرض كل الحركات',
    pin_code: 'رمز PIN',
    digits_4: '4 أرقام',
    change: 'تغيير',
    biometric_unlock: 'فتح بالبصمة',
    not_enabled: 'غير مفعلة',
    enabled: 'مفعلة',
    auto_lock: 'القفل التلقائي',
    minutes_3: '3 دقائق',
    minutes_1: 'دقيقة واحدة',
    minutes_5: '5 دقائق',
    minutes_15: '15 دقيقة',
    immediately: 'فوراً',
    lock_wallet_now: 'قفل المحفظة الآن',
    read_bank_sms: 'قراءة رسائل البنك',
    active_perm_granted: 'مفعّل • الإذن مسموح',
    inactive_or_no_perm: 'غير مفعّل أو بدون إذن',
    allowed_banks: 'البنوك المسموحة',
    check_reception_status: 'فحص حالة الاستقبال',
    import_past_sms: 'استيراد الرسائل القديمة',
    export_encrypted_backup: 'تصدير نسخة مشفّرة',
    passphrase_8_chars: 'عبارة مرور 8 أحرف أو أكثر',
    import_backup: 'استيراد نسخة',
    replaces_data_after_confirm: 'يستبدل البيانات الحالية بعد تأكيدك',
    language: 'اللغة',
    all_screen_one_lang: 'الشاشة كلها بلغة واحدة',
    currency: 'العملة',
    export_csv: 'تصدير الحركات CSV',
    developer_tools: 'أدوات المطوّر والمحاكاة',
    clear_all_data: 'مسح كل البيانات',
    create_new: 'حركة جديدة',
    purchase: 'شراء',
    transfer: 'تحويل',
    withdrawal: 'سحب نقدي',
    amount: 'المبلغ',
    card_account: 'الكارت / الحساب',
    category: 'الفئة',
    notes: 'ملاحظة',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    approve_verified: 'اعتماد المؤكد',
    clear_all: 'مسح الكل',
    unmatched: 'غير مطابق',
    approve: 'اعتماد',
    reject: 'استبعاد',
    over_limit: 'تجاوز للميزانية',
    warning_limit: 'قارب على الحد',
    add_bank: 'إضافة بنك',
    add_card: 'إضافة كارت',
    add_account: 'إضافة حساب',
    correct_balance: 'تصحيح الرصيد',
    edit_card: 'تعديل الكارت',
    delete: 'حذف',
    your_wallet_ready: 'محفظتك جاهزة',
    no_cards_yet: 'لا توجد كروت مسجلة حتى الآن',
    no_banks_yet: 'لا توجد بنوك مسجلة حتى الآن',
    add_first_bank: 'أضف أول بنك',
    add_first_card: 'أضف أول كارت',
    card_n_of_total: '{current} من {total} كروت',
    cards_under_bank: '{n} من 3 كروت',
    max_3_reached: 'الحد الأقصى 3 كروت لهذا البنك',
    bank_accounts_count: 'الحسابات البنكية ({n})',
    no_accounts_for_bank: 'لا توجد حسابات بنكية مسجلة لهذا البنك',
    registered_cards: 'الكروت المسجلة',
    inbox_empty: 'صندوق المراجعة فارغ',
    inbox_empty_desc: 'ستظهر الرسائل البنكية الواردة الجديدة هنا تلقائياً.',
    all_cycles: 'كل الدورات',
    search_placeholder: 'بحث في الحركات أو التجار...',
    no_transactions_yet: 'لا توجد حركات مسجلة',
    log_first_expense: 'تسجيل حركة جديدة',
  },
  en: {
    home: 'Home',
    activity: 'Activity',
    review: 'Review',
    wallets: 'Wallets',
    settings: 'Settings',
    cards: 'Cards',
    banks: 'Banks',
    history: 'History',
    security: 'Security',
    sms_intake: 'SMS Intake',
    backup_general: 'Backup & General',
    left_of: 'left of',
    cycle_purchases: 'Cycle purchases',
    cash_advance_debt: 'Cash advance (debt)',
    total_owed: 'Total owed',
    bank_messages_ready: '{n} bank messages ready',
    review_btn: 'Review',
    recent_activity: 'Recent activity',
    no_activity: 'No activity recorded yet',
    all_history: 'All History',
    pin_code: 'PIN Code',
    digits_4: '4 digits',
    change: 'Change',
    biometric_unlock: 'Biometric Unlock',
    not_enabled: 'Disabled',
    enabled: 'Enabled',
    auto_lock: 'Auto-Lock',
    minutes_3: '3 minutes',
    minutes_1: '1 minute',
    minutes_5: '5 minutes',
    minutes_15: '15 minutes',
    immediately: 'Immediately',
    lock_wallet_now: 'Lock Wallet Now',
    read_bank_sms: 'Read Bank SMS',
    active_perm_granted: 'Active • Permission granted',
    inactive_or_no_perm: 'Inactive or no permission',
    allowed_banks: 'Allowed Banks',
    check_reception_status: 'Check Reception Status',
    import_past_sms: 'Import Past Messages',
    export_encrypted_backup: 'Export Encrypted Backup',
    passphrase_8_chars: 'Passphrase 8+ chars',
    import_backup: 'Import Backup',
    replaces_data_after_confirm: 'Replaces current data after confirm',
    language: 'Language',
    all_screen_one_lang: 'Entire screen in one language',
    currency: 'Currency',
    export_csv: 'Export Transactions CSV',
    developer_tools: 'Developer & Simulation Tools',
    clear_all_data: 'Clear All Data',
    create_new: 'New Transaction',
    purchase: 'Purchase',
    transfer: 'Transfer',
    withdrawal: 'Cash withdrawal',
    amount: 'Amount',
    card_account: 'Card / Account',
    category: 'Category',
    notes: 'Notes',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    approve_verified: 'Approve Verified',
    clear_all: 'Clear All',
    unmatched: 'Unmatched',
    approve: 'Approve',
    reject: 'Reject',
    over_limit: 'Over Limit',
    warning_limit: 'Near Limit',
    add_bank: 'Add Bank',
    add_card: 'Add Card',
    add_account: 'Add Account',
    correct_balance: 'Correct Balance',
    edit_card: 'Edit Card',
    delete: 'Delete',
    your_wallet_ready: 'Your Wallet is Ready',
    no_cards_yet: 'No Cards Added Yet',
    no_banks_yet: 'No Banks Added Yet',
    add_first_bank: 'Add Your Bank',
    add_first_card: 'Add Your First Card',
    card_n_of_total: '{current} of {total} cards',
    cards_under_bank: '{n} of 3 cards',
    max_3_reached: 'Maximum 3 cards reached for this bank',
    bank_accounts_count: 'Bank Accounts ({n})',
    no_accounts_for_bank: 'No bank accounts added for this bank',
    registered_cards: 'Registered Cards',
    inbox_empty: 'Review Inbox is Empty',
    inbox_empty_desc: 'New incoming bank transactions will automatically appear here.',
    all_cycles: 'All Cycles',
    search_placeholder: 'Search transactions...',
    no_transactions_yet: 'No transactions recorded yet',
    log_first_expense: 'Log First Expense',
  }
};

function getLang() {
  return localStorage.getItem('apexwallet_lang_pref') || 'ar';
}

function setLang(newLang) {
  localStorage.setItem('apexwallet_lang_pref', newLang);
  applyDocumentLanguage();
  if (typeof renderCurrentView === 'function') {
    renderCurrentView();
  }
}

function applyDocumentLanguage() {
  const lang = getLang();
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' ? 'rtl' : 'ltr');
  }
}

function t(key, params = {}) {
  const lang = getLang();
  let str = (I18N[lang] && I18N[lang][key]) || (I18N['en'] && I18N['en'][key]) || key;
  Object.keys(params).forEach(k => {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
  });
  return str;
}

window.getLang = getLang;
window.setLang = setLang;
window.t = t;

function initApp() {
  try {
    const store = window.walletStore || window.store;

  applyDocumentLanguage();

  // Selected featured card on Overview
  let activeFeaturedCardId = store.cards.length > 0 ? store.cards[0].id : null;
  let editingCardId = null;
  let previousTab = 'dashboard';

  // --- Element Selectors ---
  const views = {
    dashboard: document.getElementById('view-dashboard'),
    cards: document.getElementById('view-cards'),
    history: document.getElementById('view-history'),
    review: document.getElementById('view-review'),
    settings: document.getElementById('view-settings')
  };

  const navButtons = document.querySelectorAll('.floating-nav-tab');
  const modals = {
    transaction: document.getElementById('modal-transaction'),
    bank: document.getElementById('modal-bank'),
    card: document.getElementById('modal-card'),
    quickActions: document.getElementById('modal-quick-actions'),
    customizeCard: document.getElementById('modal-customize-card'),
    'customize-card': document.getElementById('modal-customize-card'),
    smsReview: document.getElementById('modal-sms-review'),
    'sms-review': document.getElementById('modal-sms-review'),
    smsDiagnostics: document.getElementById('modal-sms-diagnostics'),
    'sms-diagnostics': document.getElementById('modal-sms-diagnostics'),
    smsHistorical: document.getElementById('modal-sms-historical'),
    'sms-historical': document.getElementById('modal-sms-historical'),
    cycleBudgetPrompt: document.getElementById('modal-cycle-budget-prompt'),
    'cycle-budget-prompt': document.getElementById('modal-cycle-budget-prompt'),
    editAccount: document.getElementById('modal-edit-account'),
    'edit-account': document.getElementById('modal-edit-account'),
    editCard: document.getElementById('modal-edit-card'),
    'edit-card': document.getElementById('modal-edit-card')
  };

  // --- Toast System ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-[#111827] text-white' : (type === 'error' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white');
    const iconName = type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-triangle' : 'info');

    toast.className = `flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl text-xs font-semibold tracking-wide transform transition-all duration-300 translate-y-3 opacity-0 ${bgClass}`;
    toast.innerHTML = `
      <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons({ root: toast });

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
  window.showToast = showToast;

  function updateReviewBadge() {
    const count = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates) ? window.BankSmsEngine.pendingCandidates.length : 0;
    const badge = document.getElementById('dock-review-badge');
    if (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }
  window.updateReviewBadge = updateReviewBadge;

  // --- Navigation & View Switching ---
  function switchView(targetTab) {
    if (store.activeTab && store.activeTab !== 'settings') {
      previousTab = store.activeTab;
    }
    store.activeTab = targetTab;
    
    // Update floating nav buttons
    navButtons.forEach(btn => {
      const tab = btn.dataset.tab;
      const label = btn.querySelector('.tab-label');
      if (tab === targetTab) {
        btn.classList.add('active');
        if (label) label.classList.remove('hidden');
      } else {
        btn.classList.remove('active');
        if (label) label.classList.add('hidden');
      }
    });

    // Toggle view containers
    Object.keys(views).forEach(k => {
      if (views[k]) {
        if (k === targetTab) {
          views[k].classList.remove('hidden');
        } else {
          views[k].classList.add('hidden');
        }
      }
    });

    // Update Top Bar Title & Back Button
    const headerTitle = document.getElementById('header-title');
    const headerBackBtn = document.getElementById('header-back-btn');
    if (headerBackBtn) {
      if (targetTab === 'settings') {
        headerBackBtn.classList.remove('hidden');
      } else {
        headerBackBtn.classList.add('hidden');
      }
    }
    if (headerTitle) {
      if (targetTab === 'dashboard') headerTitle.textContent = t('home');
      else if (targetTab === 'cards') headerTitle.textContent = t('wallets');
      else if (targetTab === 'history') headerTitle.textContent = t('activity');
      else if (targetTab === 'review') headerTitle.textContent = t('review');
      else if (targetTab === 'settings') headerTitle.textContent = t('settings');
    }

    renderCurrentView();
    updateReviewBadge();

    // Scroll mobile viewport to top
    const scrollContainer = document.getElementById('mobile-scroll-body');
    if (scrollContainer) {
      try { scrollContainer.scrollTop = 0; } catch (e) {}
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchView(tab);
    });
  });

  const headerSettingsBtn = document.getElementById('header-settings-btn');
  if (headerSettingsBtn) {
    headerSettingsBtn.addEventListener('click', () => switchView('settings'));
  }

  const headerBackBtn = document.getElementById('header-back-btn');
  if (headerBackBtn) {
    headerBackBtn.addEventListener('click', () => {
      if (store.activeTab === 'settings') {
        switchView(previousTab || 'dashboard');
      } else {
        switchView('dashboard');
      }
    });
  }

  // --- Modal Management ---
  function openModal(modalId) {
    const modal = modals[modalId];
    if (!modal) return;
    
    modal.classList.remove('pointer-events-none', 'opacity-0');
    modal.classList.add('opacity-100');
    
    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) {
      sheet.classList.remove('translate-y-full');
      sheet.classList.add('translate-y-0');
    }

    if (modalId === 'transaction') {
      populateTransactionModalDropdowns();
      updateTxCyclePreview();
    } else if (modalId === 'card') {
      populateCardBankDropdown();
      updateCardCycleInputs();
    } else if (modalId === 'customizeCard' || modalId === 'customize-card') {
      if (!editingCardId) {
        editingCardId = activeFeaturedCardId || (store.cards[0] ? store.cards[0].id : null);
      }
      if (editingCardId) {
        const card = store.getCard(editingCardId);
        const bank = card ? store.getBank(card.bankId) : null;
        const stats = store.getCardSpendingStats(editingCardId);
        const subtitle = document.getElementById('customize-card-subtitle');
        const previewBox = document.getElementById('customize-card-preview');
        const nameEl = document.getElementById('customize-preview-name');
        const typeEl = document.getElementById('customize-preview-type');
        const amountEl = document.getElementById('customize-preview-amount');
        const last4El = document.getElementById('customize-preview-last4');
        const cycleEl = document.getElementById('customize-preview-cycle');
        if (subtitle && card) subtitle.textContent = `Customizing: ${bank ? bank.shortCode : ''} ${card.name}`;
        if (nameEl && card) nameEl.textContent = `${bank ? bank.shortCode : ''} ${card.name}`;
        if (typeEl && card) typeEl.textContent = card.cardType.toUpperCase();
        if (amountEl && card) amountEl.textContent = `${formatCurrency(stats.spent)} / ${formatCurrency(stats.target)}`;
        if (last4El && card) last4El.textContent = `•••• ${card.last4}`;
        if (cycleEl && card) cycleEl.textContent = card.cycleStartDay ? `Cycle: ${card.cycleStartDay}th → ${card.cycleEndDay}th` : card.network;
        if (previewBox && card) previewBox.style.background = getCardGradientStyle(card, bank);
      }
    }
  }

  function closeModal(modalId) {
    const modal = modals[modalId];
    if (!modal) return;

    const sheet = modal.querySelector('.modal-sheet');
    if (sheet) {
      sheet.classList.remove('translate-y-0');
      sheet.classList.add('translate-y-full');
    }

    setTimeout(() => {
      modal.classList.add('pointer-events-none', 'opacity-0');
      modal.classList.remove('opacity-100');
    }, 280);
  }

  window.openModal = openModal;
  window.closeModal = closeModal;

  // Backdrop click to close
  document.querySelectorAll('.modal-backdrop').forEach(bd => {
    bd.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-container');
      if (modal) {
        const id = modal.id.replace('modal-', '');
        closeModal(id);
      }
    });
  });

  // Close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.closeModal;
      closeModal(target);
    });
  });

  // Top Bar Circular "+" Button
  const topAddBtn = document.getElementById('top-add-btn');
  if (topAddBtn) {
    topAddBtn.addEventListener('click', () => {
      openModal('quickActions');
    });
  }

  document.getElementById('qa-add-tx')?.addEventListener('click', () => {
    closeModal('quickActions');
    if (store.cards.length === 0) {
      if (store.banks.length === 0) {
        showToast('Please add a bank first!', 'info');
        setTimeout(() => openModal('bank'), 150);
      } else {
        showToast('Please add a card first!', 'info');
        setTimeout(() => openModal('card'), 150);
      }
      return;
    }
    setTimeout(() => openModal('transaction'), 150);
  });
  document.getElementById('qa-add-card')?.addEventListener('click', () => {
    closeModal('quickActions');
    if (store.banks.length === 0) {
      showToast('Please add a bank first!', 'info');
      setTimeout(() => openModal('bank'), 150);
      return;
    }
    setTimeout(() => openModal('card'), 150);
  });
  document.getElementById('qa-add-bank')?.addEventListener('click', () => {
    closeModal('quickActions');
    setTimeout(() => openModal('bank'), 150);
  });

  // --- Dynamic Transaction Modal Billing Cycle Preview ---
  function updateTxCyclePreview() {
    const cardSelect = document.getElementById('tx-card-select');
    const dateInput = document.getElementById('tx-date');
    const previewBox = document.getElementById('tx-cycle-preview-box');
    const previewBadge = document.getElementById('tx-cycle-preview-badge');
    const previewRange = document.getElementById('tx-cycle-preview-range');

    if (!cardSelect || !dateInput || !previewBox) return;

    const cardId = cardSelect.value;
    const dateVal = dateInput.value;
    const card = store.getCard(cardId);

    if (card && card.cardType === 'credit' && card.cycleStartDay && card.cycleEndDay) {
      const info = calculateBillingStatement(dateVal, card.cycleStartDay, card.cycleEndDay);
      if (info) {
        previewBox.classList.remove('hidden');
        previewBadge.innerHTML = `
          <span class="inline-flex items-center gap-1 font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-full text-[10px] shadow-xs border border-indigo-100">
            Affects ${info.statementMonthName.substring(0, 3)} Statement
          </span>
        `;
        previewRange.innerHTML = `
          <span class="text-[11px] text-slate-500 mt-1 block">
            Cycle runs <strong>${card.cycleStartDay}th → ${card.cycleEndDay}th</strong> (${info.cycleRange}).
          </span>
        `;
      }
    } else if (card) {
      previewBox.classList.remove('hidden');
      previewBadge.innerHTML = `
        <span class="inline-flex items-center gap-1 font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-full text-[10px] shadow-xs border border-slate-200">
          ${card.cardType.toUpperCase()} Transaction
        </span>
      `;
      previewRange.innerHTML = `
        <span class="text-[11px] text-slate-500 mt-1 block">
          Standard debit/prepaid transaction logged against current date.
        </span>
      `;
    } else {
      previewBox.classList.add('hidden');
    }
  }

  document.getElementById('tx-card-select')?.addEventListener('change', () => {
    updateTxCyclePreview();
    updateTxBalancePreview();
  });
  document.getElementById('tx-date')?.addEventListener('input', updateTxCyclePreview);
  document.getElementById('tx-amount')?.addEventListener('input', updateTxBalancePreview);
  document.querySelectorAll('input[name="tx-op-type"]').forEach(r => {
    r.addEventListener('change', updateTxBalancePreview);
  });

  // --- Dynamic Transaction Modal Account Balance Preview (Item 3) ---
  function updateTxBalancePreview() {
    const cardSelect = document.getElementById('tx-card-select');
    const amountInput = document.getElementById('tx-amount');
    const balanceBox = document.getElementById('tx-balance-preview-box');
    const beforeEl = document.getElementById('tx-balance-before');
    const afterEl = document.getElementById('tx-balance-after');
    const warnEl = document.getElementById('tx-balance-negative-warn');

    if (!cardSelect || !balanceBox || !beforeEl || !afterEl || !warnEl) return;

    const rawVal = cardSelect.value;
    const amountVal = parseFloat(amountInput?.value) || 0;

    let targetAccount = null;
    if (rawVal && rawVal.startsWith('acc:')) {
      targetAccount = store.getAccount(rawVal.replace('acc:', ''));
    } else if (rawVal) {
      const card = store.getCard(rawVal);
      if (card && card.cardType === 'debit' && card.linkedAccountId) {
        targetAccount = store.getAccount(card.linkedAccountId);
      }
    }

    if (!targetAccount) {
      balanceBox.classList.add('hidden');
      return;
    }

    balanceBox.classList.remove('hidden');
    const currentBalance = targetAccount.balance || 0;
    const expectedAfter = currentBalance - amountVal;

    beforeEl.textContent = `الرصيد الحالي (${targetAccount.name}): ${formatCurrency(currentBalance)}`;
    afterEl.textContent = `الرصيد بعد العملية: ${formatCurrency(expectedAfter)}`;
    afterEl.className = expectedAfter < 0 ? 'font-mono text-rose-600 font-bold' : 'font-mono text-slate-800 font-bold';

    if (amountVal > 0 && expectedAfter < 0) {
      warnEl.classList.remove('hidden');
      warnEl.textContent = `⚠️ تحذير: هذه العملية ستجعل رصيد الحساب بالسالب (${formatCurrency(expectedAfter)})!`;
    } else {
      warnEl.classList.add('hidden');
    }
  }

  // Quick Merchant Chips
  document.querySelectorAll('.quick-merchant-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const merchantInput = document.getElementById('tx-merchant');
      const categorySelect = document.getElementById('tx-category');
      if (merchantInput) merchantInput.value = chip.dataset.merchant;
      if (categorySelect && chip.dataset.category) categorySelect.value = chip.dataset.category;
    });
  });

  // Dynamic Card Modal Cycle & Linked Account Inputs
  function updateCardCycleInputs() {
    const cardType = document.querySelector('input[name="card-type"]:checked')?.value || 'credit';
    const cycleContainer = document.getElementById('card-cycle-section');
    const creditLimitContainer = document.getElementById('card-credit-limit-section');
    const linkedAccContainer = document.getElementById('card-linked-account-section');
    const targetInput = document.getElementById('card-target');
    const targetLabel = document.getElementById('card-target-label');
    const submitBtnText = document.getElementById('card-submit-button-text');

    if (creditLimitContainer) {
      if (cardType === 'credit') {
        creditLimitContainer.classList.remove('hidden');
      } else {
        creditLimitContainer.classList.add('hidden');
      }
    }

    if (cycleContainer) {
      if (cardType === 'credit') {
        cycleContainer.classList.remove('hidden');
      } else {
        cycleContainer.classList.add('hidden');
      }
    }

    if (linkedAccContainer) {
      if (cardType === 'debit') {
        linkedAccContainer.classList.remove('hidden');
        // Populate linked accounts
        const bankId = document.getElementById('card-bank-select')?.value;
        const linkedSelect = document.getElementById('card-linked-account');
        if (linkedSelect && store.accounts) {
          const accs = bankId ? store.getAccountsForBank(bankId) : store.accounts;
          linkedSelect.innerHTML = '<option value="">None (Independent Debit)</option>' +
            accs.map(a => `<option value="${a.id}">${a.name} (${a.accountNumberMasked || a.identifierDigits})</option>`).join('');
        }
      } else {
        linkedAccContainer.classList.add('hidden');
      }
    }

    const targetHelp = document.getElementById('card-target-help');

    if (targetLabel && targetInput) {
      if (cardType === 'account') {
        targetLabel.textContent = 'الرصيد الحالي للحساب (Current Balance)';
        targetInput.placeholder = 'مثال: 25000';
        targetInput.required = false;
        if (targetHelp) {
          targetHelp.textContent = 'الرصيد يتم حسابه وتحديثه داخل التطبيق فقط وليس متزامناً مع البنك';
          targetHelp.classList.remove('hidden');
        }
      } else if (cardType === 'credit') {
        targetLabel.textContent = 'Personal Spending Budget (ميزانية الصرف للدورة)';
        targetInput.placeholder = '15000';
        targetInput.required = true;
        if (targetHelp) targetHelp.classList.add('hidden');
      } else {
        targetLabel.textContent = 'Personal Spending Budget (اختياري)';
        targetInput.placeholder = '15000';
        targetInput.required = false;
        if (targetHelp) targetHelp.classList.add('hidden');
      }
    }

    if (submitBtnText) {
      submitBtnText.textContent = cardType === 'account' ? 'Save Bank Account' : 'Save Card';
    }
  }

  document.querySelectorAll('input[name="card-type"]').forEach(radio => {
    radio.addEventListener('change', updateCardCycleInputs);
  });
  document.getElementById('card-bank-select')?.addEventListener('change', updateCardCycleInputs);

  // Color Swatch Selection for Bank Modal
  document.querySelectorAll('.bank-color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.bank-color-swatch').forEach(s => s.classList.remove('ring-4', 'ring-indigo-300', 'scale-110'));
      swatch.classList.add('ring-4', 'ring-indigo-300', 'scale-110');
      const customInput = document.getElementById('bank-color-custom');
      if (customInput) customInput.value = swatch.dataset.color;
    });
  });

  // Populate Dropdowns
  function populateTransactionModalDropdowns() {
    const select = document.getElementById('tx-card-select');
    if (!select) return;

    select.innerHTML = '';
    store.banks.forEach(bank => {
      const bankCards = store.getCardsForBank(bank.id);
      const bankAccounts = store.getAccountsForBank(bank.id);

      if (bankCards.length > 0 || bankAccounts.length > 0) {
        if (bankCards.length > 0) {
          const optgroup = document.createElement('optgroup');
          optgroup.label = `💳 ${bank.name} - Cards`;
          bankCards.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.name} (•••• ${c.last4}) - ${c.cardType.toUpperCase()}`;
            optgroup.appendChild(opt);
          });
          select.appendChild(optgroup);
        }

        if (bankAccounts.length > 0) {
          const accGroup = document.createElement('optgroup');
          accGroup.label = `🏛️ ${bank.name} - Accounts`;
          bankAccounts.forEach(a => {
            const opt = document.createElement('option');
            opt.value = `acc:${a.id}`;
            opt.textContent = `${a.name} (${a.accountNumberMasked || a.identifierDigits}) - رصيد: ${formatCurrency(a.balance || 0)}`;
            accGroup.appendChild(opt);
          });
          select.appendChild(accGroup);
        }
      }
    });

    const dateInput = document.getElementById('tx-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  }

  function populateCardBankDropdown(preselectedBankId = null) {
    const select = document.getElementById('card-bank-select');
    if (!select) return;

    select.innerHTML = '';
    store.banks.forEach(bank => {
      const cards = store.getCardsForBank(bank.id);
      const isFull = cards.length >= 3;
      const opt = document.createElement('option');
      opt.value = bank.id;
      opt.textContent = `${bank.name} (${cards.length}/3 cards)${isFull ? ' - MAX CAP REACHED' : ''}`;
      if (isFull) opt.disabled = true;
      if (preselectedBankId && bank.id === preselectedBankId && !isFull) opt.selected = true;
      select.appendChild(opt);
    });
  }

  // --- Form Handlers ---
  document.getElementById('form-add-transaction')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('tx-amount').value;
    const merchant = document.getElementById('tx-merchant').value;
    const category = document.getElementById('tx-category').value;
    const date = document.getElementById('tx-date').value;
    const rawCardVal = document.getElementById('tx-card-select').value;
    const notes = document.getElementById('tx-notes')?.value || '';
    const transactionType = document.querySelector('input[name="tx-op-type"]:checked')?.value || 'purchase';

    let cardId = null;
    let accountId = null;
    if (rawCardVal && rawCardVal.startsWith('acc:')) {
      accountId = rawCardVal.replace('acc:', '');
    } else {
      cardId = rawCardVal;
    }

    // Negative Balance Check & Confirmation (Item 3)
    let targetAccount = null;
    if (accountId) {
      targetAccount = store.getAccount(accountId);
    } else if (cardId) {
      const card = store.getCard(cardId);
      if (card && card.cardType === 'debit' && card.linkedAccountId) {
        targetAccount = store.getAccount(card.linkedAccountId);
      }
    }

    if (targetAccount) {
      const currentBalance = targetAccount.balance || 0;
      const expectedAfter = currentBalance - parseFloat(amount);
      if (expectedAfter < 0) {
        const confirmMsg = `تحذير: هذه العملية ستجعل رصيد الحساب "${targetAccount.name}" بالسالب!\n\n- الرصيد الحالي: ${formatCurrency(currentBalance)}\n- الرصيد المتوقع: ${formatCurrency(expectedAfter)}\n\nهل تريد بالتأكيد تسجيل هذه العملية؟`;
        if (typeof confirm === 'function' && !confirm(confirmMsg)) {
          return;
        }
      }
    }

    try {
      store.addTransaction({ amount, merchant, category, date, cardId, accountId, transactionType, notes });
      closeModal('transaction');
      e.target.reset();
      showToast(`Transaction of ${formatCurrency(amount)} logged!`, 'success');
      renderCurrentView();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.getElementById('form-add-bank')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bank-name').value;
    const shortCode = document.getElementById('bank-code').value;
    const accentColor = document.getElementById('bank-color-custom').value;

    try {
      store.addBank({ name, shortCode, accentColor });
      closeModal('bank');
      e.target.reset();
      showToast(`Bank "${name}" added!`, 'success');
      renderCurrentView();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.getElementById('form-add-card')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const bankId = document.getElementById('card-bank-select').value;
    const name = document.getElementById('card-name').value;
    const last4 = document.getElementById('card-last4').value;
    const cardType = document.querySelector('input[name="card-type"]:checked')?.value || 'credit';
    const digitsPosition = document.querySelector('input[name="card-digits-position"]:checked')?.value || 'last';
    const monthlyTarget = document.getElementById('card-target').value;
    const creditLimit = document.getElementById('card-credit-limit')?.value || null;
    const linkedAccountId = document.getElementById('card-linked-account')?.value || null;
    const cycleStartDay = document.getElementById('card-cycle-start')?.value || 1;
    const cycleEndDay = document.getElementById('card-cycle-end')?.value || 30;
    const network = document.getElementById('card-network')?.value || 'Visa';

    try {
      if (cardType === 'account') {
        store.addAccount({
          bankId,
          name,
          identifierDigits: last4,
          digitsPosition,
          balance: parseFloat(monthlyTarget) || 0,
          currency: currentCurrency
        });
        closeModal('card');
        e.target.reset();
        showToast(`Bank account "${name}" added!`, 'success');
        renderCurrentView();
      } else {
        const newCard = store.addCard({
          bankId,
          name,
          last4,
          cardType,
          digitsPosition,
          linkedAccountId: cardType === 'debit' ? linkedAccountId : null,
          monthlyTarget,
          creditLimit,
          cycleStartDay,
          cycleEndDay,
          network
        });
        activeFeaturedCardId = newCard.id;
        closeModal('card');
        e.target.reset();
        showToast(`Card "${name}" added!`, 'success');
        renderCurrentView();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Handle Edit Account & Balance Adjustment Form (Item 1)
  document.getElementById('form-edit-account')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const accId = document.getElementById('edit-account-id')?.value;
    if (!accId) return;
    const name = document.getElementById('edit-account-name')?.value;
    const balanceVal = parseFloat(document.getElementById('edit-account-balance')?.value);
    const notes = document.getElementById('edit-account-notes')?.value;

    if (isNaN(balanceVal)) {
      showToast('يرجى إدخال رصيد صحيح', 'error');
      return;
    }

    try {
      store.updateAccount(accId, {
        name,
        newBalance: balanceVal,
        notes
      });
      closeModal('editAccount');
      showToast('تم تحديث الحساب وتسجيل حركة تسوية الرصيد بنجاح', 'success');
      renderBanksView();
      renderCurrentView();
    } catch (err) {
      showToast(err.message || 'حدث خطأ أثناء تعديل الحساب', 'error');
    }
  });

  // Handle Edit Card Form (Item 3)
  document.getElementById('form-edit-card')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const cardId = document.getElementById('edit-card-id')?.value;
    if (!cardId) return;
    const card = store.getCard(cardId);
    if (!card) return;

    const name = document.getElementById('edit-card-name')?.value;
    const linkedAccountId = document.getElementById('edit-card-linked-account')?.value || null;
    const targetVal = parseFloat(document.getElementById('edit-card-target')?.value) || 0;
    const creditLimitRaw = document.getElementById('edit-card-credit-limit')?.value;
    const creditLimit = (creditLimitRaw !== undefined && creditLimitRaw !== '' && !isNaN(parseFloat(creditLimitRaw)))
      ? parseFloat(creditLimitRaw)
      : null;

    try {
      store.updateCard(cardId, {
        name,
        linkedAccountId: card.cardType === 'debit' ? (linkedAccountId || null) : card.linkedAccountId,
        monthlyTarget: targetVal,
        creditLimit: card.cardType === 'credit' ? creditLimit : card.creditLimit
      });
      closeModal('editCard');
      showToast('تم تحديث بيانات الكارت بنجاح', 'success');
      renderBanksView();
      renderCurrentView();
    } catch (err) {
      showToast(err.message || 'حدث خطأ أثناء تعديل الكارت', 'error');
    }
  });

  // --- Render Current View ---
  function renderCurrentView() {
    const stats = store.getOverallStats();
    const topSubtitle = document.getElementById('header-subtitle');
    if (topSubtitle) {
      topSubtitle.textContent = `${stats.totalCount} transactions • ${formatCurrency(stats.totalSpent)} spent`;
    }

    if (store.activeTab === 'dashboard') {
      renderOverviewView();
    } else if (store.activeTab === 'cards') {
      renderBanksView();
    } else if (store.activeTab === 'history') {
      renderHistoryView();
    } else if (store.activeTab === 'review') {
      renderReviewView();
    } else if (store.activeTab === 'settings') {
      renderSettingsView();
    }

    updateReviewBadge();

    if (window.lucide) {
      try { lucide.createIcons(); } catch(e) { console.warn('Lucide icon error:', e); }
    }
  }

  // --- Bank SMS Notification Banner Helper ---
  function renderSmsBannerHtml() {
    const count = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates) ? window.BankSmsEngine.pendingCandidates.length : 0;
    if (count === 0) return '';
    return `
      <div id="sms-inbox-banner" onclick="window.switchTab('review')" class="cursor-pointer bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] p-3.5 rounded-2xl shadow-md flex items-center justify-between active-press transition-all">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-[#16171A] text-[#F5B700] flex items-center justify-center shrink-0">
            <i data-lucide="mail-check" class="w-4 h-4 text-[#F5B700]"></i>
          </div>
          <div class="min-w-0 pr-1">
            <span class="text-xs font-black text-[#111111] block">${t('bank_messages_ready', { n: count })}</span>
          </div>
        </div>
        <button type="button" class="px-3.5 py-1.5 rounded-xl bg-[#16171A] text-[#F5B700] font-bold text-xs shrink-0">${t('review_btn')}</button>
      </div>
    `;
  }

  // ==========================================
  // VIEW 1: OVERVIEW (TILTED CARD OBJECT HERO)
  // ==========================================
  function renderOverviewView() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    const pendingCandidates = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates) ? window.BankSmsEngine.pendingCandidates : [];

    if (store.cards.length === 0) {
      container.innerHTML = `
        <div class="space-y-4 py-6">
          ${pendingCandidates.length > 0 ? renderSmsBannerHtml() : ''}

          <div class="bg-[#1F2024] p-8 rounded-3xl border border-[#2F3136] text-center shadow-lg space-y-4">
            <div class="w-16 h-16 mx-auto rounded-3xl bg-[#26272B] text-[#F5B700] flex items-center justify-center border border-[#3A3C42]">
              <i data-lucide="credit-card" class="w-8 h-8 text-[#F5B700]"></i>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#F3F1EC]">${store.banks.length === 0 ? t('your_wallet_ready') : t('no_cards_yet')}</h3>
              <p class="text-xs text-[#9A9CA3] mt-1 max-w-[280px] mx-auto">
                ${store.banks.length === 0 ? (getLang() === 'ar' ? 'ابدأ بإضافة البنك، ثم أضف كروتك وتتبع مصروفاتك.' : 'Start by adding your bank, then add your cards.') : (getLang() === 'ar' ? 'البنوك مسجلة. أضف كارت كريدت أو ديبت للبدء.' : 'Add your first card to begin tracking.')}
              </p>
            </div>
            <div class="pt-2 max-w-[220px] mx-auto">
              <button onclick="window.openModal('${store.banks.length === 0 ? 'bank' : 'card'}')" class="w-full py-3 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] text-xs font-extrabold rounded-full shadow-md active-press flex items-center justify-center gap-1.5 transition-all">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>${store.banks.length === 0 ? t('add_first_bank') : t('add_first_card')}</span>
              </button>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) {
        try { lucide.createIcons({ root: container }); } catch (e) {}
      }
      return;
    }

    // Ensure valid active card
    if (!activeFeaturedCardId || !store.getCard(activeFeaturedCardId)) {
      activeFeaturedCardId = store.cards[0].id;
    }
    const card = store.getCard(activeFeaturedCardId) || store.cards[0];
    const bank = store.getBank(card.bankId);
    const cardStat = store.getCardSpendingStats(card.id);

    container.innerHTML = `
      <div class="space-y-3 pb-8">
        
        <!-- 1. TILTED HERO CARD OBJECT (Direction Approved) -->
        <div class="tilted-hero-wrapper my-2" id="hero-card-touch-zone">
          <div class="tilted-card-container" id="hero-card-tilted-box">
            <div class="bank-card-face cursor-pointer" onclick="window.toggleCardStraighten(this)">
              <!-- Top Row: Bank Short Code & Card Name/Tier -->
              <div class="flex justify-between items-center z-10">
                <span class="text-sm font-black text-[#F5B700] tracking-wider">${bank ? bank.shortCode : ''}</span>
                <span class="text-xs font-bold text-[#F5B700] opacity-90">${card.name}</span>
              </div>

              <!-- Golden-Amber Chip -->
              <div class="bank-card-chip my-2 z-10"></div>

              <!-- Middle: Masked Digits -->
              <div class="flex items-center gap-2 text-xs font-mono tracking-widest text-[#9A9CA3] z-10" dir="ltr">
                <span>••••</span><span>••••</span><span>••••</span><span class="text-[#F3F1EC] font-bold">${card.last4}</span>
              </div>

              <!-- Bottom Row: Budget & Remaining Amount -->
              <div class="flex justify-between items-end mt-2 z-10">
                <div class="min-w-0 pr-2">
                  <span class="text-[11px] text-[#9A9CA3] block">
                    ${cardStat.isExceeded ? t('over_limit') : `${t('left_of')} ${formatCurrency(cardStat.target)}`}
                  </span>
                  ${cardStat.cashAdvance > 0 ? `
                    <span class="text-[10px] text-[#F5B700] block mt-0.5 font-medium">
                      ${t('cash_advance_debt')}: ${formatCurrency(cardStat.cashAdvance)}
                    </span>
                  ` : ''}
                </div>
                <div class="text-end shrink-0">
                  <span class="text-xl font-extrabold font-mono ${cardStat.isExceeded ? 'text-[#E6A8A8]' : 'text-[#F3F1EC]'}" dir="ltr">
                    ${cardStat.isExceeded ? `+${formatCurrency(cardStat.overAmount)}` : formatCurrency(cardStat.remaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicator Dots below Card -->
        ${store.cards.length > 1 ? `
          <div class="flex justify-center items-center gap-1.5 py-0.5">
            ${store.cards.map(c => `
              <button type="button" onclick="window.selectFeaturedCard('${c.id}')" class="h-1.5 rounded-full transition-all duration-300 ${
                c.id === card.id ? 'w-6 bg-[#F5B700]' : 'w-2 bg-[#3A3C42] hover:bg-[#9A9CA3]'
              }" title="${c.name}"></button>
            `).join('')}
          </div>
        ` : ''}

        <!-- 2. SUMMARY TILES (Cycle purchases, Cash advance, Total owed) -->
        <div class="grid grid-cols-3 gap-2 mt-2">
          <div class="bg-[#1F2024] border border-[#2F3136] rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
            <span class="text-[11px] text-[#9A9CA3] font-medium leading-tight">${t('cycle_purchases')}</span>
            <span class="text-sm font-extrabold text-[#F3F1EC] font-mono mt-2" dir="ltr">${formatCurrency(cardStat.spent)}</span>
          </div>
          <div class="bg-[#1F2024] border border-[#2F3136] rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
            <span class="text-[11px] text-[#9A9CA3] font-medium leading-tight">${t('cash_advance_debt')}</span>
            <span class="text-sm font-extrabold text-[#F3F1EC] font-mono mt-2" dir="ltr">${formatCurrency(cardStat.cashAdvance)}</span>
          </div>
          <div class="bg-[#1F2024] border border-[#2F3136] rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
            <span class="text-[11px] text-[#9A9CA3] font-medium leading-tight">${t('total_owed')}</span>
            <span class="text-sm font-extrabold text-[#F3F1EC] font-mono mt-2" dir="ltr">${formatCurrency(cardStat.totalObligations)}</span>
          </div>
        </div>

        <!-- 3. AMBER REVIEW ALERT BANNER (If pending messages exist) -->
        ${pendingCandidates.length > 0 ? `
          <div onclick="window.switchTab('review')" class="mt-3.5 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] p-3.5 rounded-2xl flex items-center justify-between cursor-pointer active-press shadow-md transition-all">
            <span class="font-extrabold text-xs text-[#111111]">${t('bank_messages_ready', { n: pendingCandidates.length })}</span>
            <button type="button" class="px-4 py-1.5 rounded-xl bg-[#16171A] text-[#F5B700] font-extrabold text-xs shrink-0">${t('review_btn')}</button>
          </div>
        ` : ''}

        <!-- 4. RECENT ACTIVITY LIST -->
        <div class="mt-4 space-y-2">
          <div class="flex justify-between items-center px-1">
            <span class="text-xs font-bold text-[#9A9CA3] uppercase tracking-wider">${t('recent_activity')}</span>
            <button onclick="window.switchTab('history')" class="text-xs font-bold text-[#F5B700] hover:underline">${t('all_history')} &rarr;</button>
          </div>
          <div id="overview-activity-container" class="space-y-1"></div>
        </div>

      </div>
    `;

    renderCardActivity(card.id);
    setupHeroCardSwipeListener();

    setTimeout(() => {
      checkAndPromptPendingCycleBudgets();
    }, 350);

    if (window.lucide) {
      try { lucide.createIcons({ root: container }); } catch (e) {}
    }
  }

  function setupHeroCardSwipeListener() {
    const zone = document.getElementById('hero-card-touch-zone');
    if (!zone || store.cards.length <= 1) return;

    let touchStartX = 0;
    let touchStartY = 0;

    zone.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    zone.addEventListener('touchend', (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 0.7) {
        const curIdx = store.cards.findIndex(c => c.id === activeFeaturedCardId);
        const isRtl = document.documentElement.dir === 'rtl';
        const advance = isRtl ? (deltaX > 0) : (deltaX < 0);
        let nextIdx = curIdx;
        if (advance) {
          nextIdx = (curIdx + 1) % store.cards.length;
        } else {
          nextIdx = (curIdx - 1 + store.cards.length) % store.cards.length;
        }
        if (nextIdx !== curIdx && store.cards[nextIdx]) {
          window.selectFeaturedCard(store.cards[nextIdx].id);
        }
      }
    }, { passive: true });
  }

  window.toggleCardStraighten = (el) => {
    const box = document.getElementById('hero-card-tilted-box');
    if (box) {
      box.classList.toggle('straightened');
    }
  };

  function renderSecondaryCards(activeCardId) {
    // Secondary warning states rendered cleanly if needed
  }

  function renderCardActivity(cardId) {
    const container = document.getElementById('overview-activity-container');
    if (!container) return;

    const card = store.getCard(cardId);
    if (!card) return;

    const cardTxs = store.getFilteredTransactions().filter(t => t.cardId === cardId);

    if (cardTxs.length === 0) {
      container.innerHTML = `
        <div class="bg-[#1F2024] p-5 rounded-2xl text-center border border-[#2F3136] shadow-2xs">
          <p class="text-xs text-[#9A9CA3] font-medium">${t('no_activity')}</p>
          <button onclick="window.openAddTxForCard('${card.id}')" class="mt-2.5 px-3.5 py-1.5 bg-[#26272B] hover:bg-[#3A3C42] text-[#F5B700] text-xs font-bold rounded-full transition-all inline-flex items-center gap-1 border border-[#3A3C42]">
            <span>+</span>
            <span>${t('create_new')}</span>
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = cardTxs.slice(0, 5).map(tx => {
      const isCashAdvance = tx.transactionType === 'withdrawal';
      return `
        <div class="py-3 px-2 flex justify-between items-center border-b border-[#2F3136]/60 last:border-b-0 hover:bg-[#1F2024]/40 rounded-xl transition-all">
          <div class="pr-2 min-w-0">
            <p class="text-xs font-bold text-[#F3F1EC] leading-tight truncate">${tx.merchant}</p>
            <p class="text-[10px] text-[#9A9CA3] font-medium truncate mt-0.5">
              ${card.name} ${card.last4 ? '•••• ' + card.last4 : ''} ${isCashAdvance ? '• ' + t('cash_advance_debt') : ''}
            </p>
          </div>
          <div class="text-end shrink-0 ml-2">
            <span class="text-xs font-extrabold ${tx.direction === 'income' ? 'text-[#F5B700]' : 'text-[#F3F1EC]'} font-mono tracking-tight" dir="ltr">
              ${tx.direction === 'income' ? '+' : '-'}${formatCurrency(tx.amount)}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Helper to pre-select card in Add Transaction modal
  window.openAddTxForCard = (cardId) => {
    const card = store.getCard(cardId);
    openModal('transaction');
    setTimeout(() => {
      const cardSelect = document.getElementById('tx-card-select');
      if (card && cardSelect) {
        cardSelect.value = cardId;
        updateTxCyclePreview();
      }
    }, 60);
  };

  // --- Update Active Card UI (Smooth update without DOM recreation) ---
  function updateActiveCardUI(cardId, scrollCarousel = false) {
    activeFeaturedCardId = cardId;
    renderOverviewView();
  }

  window.selectFeaturedCard = (cardId) => {
    activeFeaturedCardId = cardId;
    renderOverviewView();
  };

  // ==========================================
  // VIEW: REVIEW (DEDICATED DOCK TAB)
  // ==========================================
  function renderReviewView() {
    const container = document.getElementById('view-review');
    if (!container) return;

    const candidates = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates) ? window.BankSmsEngine.pendingCandidates : [];

    container.innerHTML = `
      <div class="space-y-4 pb-20">
        <div class="flex justify-between items-center px-1 pt-1">
          <div>
            <h2 class="text-base font-extrabold text-[#F3F1EC]">${t('review')}</h2>
            <p class="text-[11px] text-[#9A9CA3]">${t('bank_messages_ready', { n: candidates.length })}</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.openSmsDiagnostics()" class="w-8 h-8 rounded-full bg-[#1F2024] hover:bg-[#26272B] border border-[#2F3136] text-[#9A9CA3] hover:text-[#F3F1EC] flex items-center justify-center transition-colors" title="${t('check_reception_status')}">
              <i data-lucide="activity" class="w-4 h-4 text-[#F5B700]"></i>
            </button>
            <button onclick="window.openHistoricalSmsImport()" class="w-8 h-8 rounded-full bg-[#1F2024] hover:bg-[#26272B] border border-[#2F3136] text-[#9A9CA3] hover:text-[#F3F1EC] flex items-center justify-center transition-colors" title="${t('import_past_sms')}">
              <i data-lucide="history" class="w-4 h-4 text-[#9A9CA3]"></i>
            </button>
          </div>
        </div>

        <div id="view-review-candidates-container" class="space-y-3"></div>
      </div>
    `;

    renderSmsCandidatesList();
    if (window.lucide) {
      try { lucide.createIcons({ root: container }); } catch (e) {}
    }
  }

  // --- Carousel Scroll & Single-Step Swipe Controller ---
  function setupCarouselScrollListener() {
    const carousel = document.getElementById('cards-carousel');
    if (!carousel) return;

    let isGesturePaging = false;
    let gesturePagingTimer = null;

    function lockGesturePaging() {
      isGesturePaging = true;
      clearTimeout(gesturePagingTimer);
      gesturePagingTimer = setTimeout(() => {
        isGesturePaging = false;
      }, 420);
    }

    // 1. Regular scroll listener to update dots and UI when cards settle
    let scrollTimeout = null;
    carousel.addEventListener('scroll', () => {
      // If a single-step swipe is currently animating, ignore intermediate scroll events
      if (isGesturePaging) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isGesturePaging) return;

        const carouselRect = carousel.getBoundingClientRect();
        const carouselCenter = carouselRect.left + carouselRect.width / 2;

        let closestCardId = null;
        let minDistance = Infinity;

        carousel.querySelectorAll('[data-card-id]').forEach(item => {
          const rect = item.getBoundingClientRect();
          const itemCenter = rect.left + rect.width / 2;
          const distance = Math.abs(carouselCenter - itemCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestCardId = item.dataset.cardId;
          }
        });

        if (closestCardId && closestCardId !== activeFeaturedCardId) {
          updateActiveCardUI(closestCardId, false);
        }
      }, 60);
    }, { passive: true });

    // 2. Strict Single-Card Swipe Lock for Touch Devices (Advances exactly 1 card per swipe)
    let touchStartX = 0;
    let touchStartY = 0;
    let activeIndexOnStart = 0;
    let isTouching = false;

    carousel.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      activeIndexOnStart = store.cards.findIndex(c => c.id === activeFeaturedCardId);
      if (activeIndexOnStart < 0) activeIndexOnStart = 0;
      isTouching = true;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      if (!isTouching) return;
      isTouching = false;
      if (!e.changedTouches || e.changedTouches.length === 0) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Check if this was a predominantly horizontal swipe
      if (Math.abs(deltaX) > 25 && Math.abs(deltaX) > Math.abs(deltaY) * 0.7) {
        let targetIndex = activeIndexOnStart;
        if (deltaX < 0) {
          // Swiped left -> Advance to next card (+1 only, regardless of swipe velocity!)
          targetIndex = Math.min(activeIndexOnStart + 1, store.cards.length - 1);
        } else {
          // Swiped right -> Go back to previous card (-1 only!)
          targetIndex = Math.max(activeIndexOnStart - 1, 0);
        }

        const targetCard = store.cards[targetIndex];
        if (targetCard && targetIndex !== activeIndexOnStart) {
          lockGesturePaging();
          scrollToCard(targetCard.id);
        }
      }
    }, { passive: true });

    // 3. Pointer / Mouse Drag Fallback (Desktop / Emulation)
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartIndex = 0;
    let isPointerDragging = false;

    carousel.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      pointerStartIndex = store.cards.findIndex(c => c.id === activeFeaturedCardId);
      if (pointerStartIndex < 0) pointerStartIndex = 0;
      isPointerDragging = true;
    });

    window.addEventListener('pointerup', (e) => {
      if (!isPointerDragging) return;
      isPointerDragging = false;
      const deltaX = e.clientX - pointerStartX;
      const deltaY = e.clientY - pointerStartY;

      if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 0.7) {
        let targetIndex = pointerStartIndex;
        if (deltaX < 0) {
          targetIndex = Math.min(pointerStartIndex + 1, store.cards.length - 1);
        } else {
          targetIndex = Math.max(pointerStartIndex - 1, 0);
        }
        const targetCard = store.cards[targetIndex];
        if (targetCard && targetIndex !== pointerStartIndex) {
          lockGesturePaging();
          scrollToCard(targetCard.id);
        }
      }
    });

    // 4. Trackpad / Precision Wheel Horizontal Swipe Lock
    let wheelCooldown = false;
    carousel.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 15) {
        e.preventDefault();
        if (wheelCooldown) return;
        wheelCooldown = true;

        const currentIndex = store.cards.findIndex(c => c.id === activeFeaturedCardId);
        let targetIndex = currentIndex >= 0 ? currentIndex : 0;

        if (e.deltaX > 0) {
          targetIndex = Math.min(targetIndex + 1, store.cards.length - 1);
        } else {
          targetIndex = Math.max(targetIndex - 1, 0);
        }

        const targetCard = store.cards[targetIndex];
        if (targetCard) {
          lockGesturePaging();
          scrollToCard(targetCard.id);
        }

        setTimeout(() => { wheelCooldown = false; }, 400);
      }
    }, { passive: false });
  }

  // Scroll carousel smoothly to card
  window.scrollToCard = (cardId) => {
    updateActiveCardUI(cardId, true);
  };

  // --- Cycle Budget Adjustment ---
  window.promptSetCycleBudget = (cardId, e) => {
    if (e) e.stopPropagation();
    const card = store.getCard(cardId);
    if (!card) return;
    const stat = store.getCardSpendingStats(cardId);
    const stmtKey = stat.statementKey || 'current';
    const currentBudget = stat.target;
    const limitText = stat.creditLimit !== null ? `\n(الحد الائتماني البنكي للكارت: ${formatCurrency(stat.creditLimit)})` : '\n(الحد الائتماني البنكي: غير مسجل)';
    const val = prompt(`تحديد ميزانية الصرف الشخصية لدورة (${stmtKey}):${limitText}\nأدخل ميزانية الدورة:`, currentBudget);
    if (val !== null && val.trim() !== '') {
      const num = parseFloat(val);
      if (!isNaN(num) && num >= 0) {
        store.setCardCycleBudget(cardId, stmtKey, num);
        showToast(`تم تحديث ميزانية دورة (${stmtKey}) إلى ${formatCurrency(num)}`, 'success');
        renderCurrentView();
      } else {
        showToast('يرجى إدخال مبلغ صحيح', 'error');
      }
    }
  };

  // --- New Billing Cycle Budget Prompt System ---
  let activeCyclePromptCard = null;

  function checkAndPromptPendingCycleBudgets() {
    if (!store || typeof store.getCardsWithPendingCycleBudgetPrompt !== 'function') return;
    const pendingList = store.getCardsWithPendingCycleBudgetPrompt();
    if (!pendingList || pendingList.length === 0) return;

    const p = pendingList[0];
    activeCyclePromptCard = p;

    const modal = document.getElementById('modal-cycle-budget-prompt');
    if (!modal) {
      // Headless / fallback prompt
      if (typeof confirm === 'function') {
        const limitStr = p.creditLimit !== null ? `\n(الحد الائتماني البنكي للكارت: ${formatCurrency(p.creditLimit)})` : '\n(الحد الائتماني البنكي: غير مسجل)';
        const msg = `بدء دورة كشف جديدة (${p.statementBadge || p.cycleKey}) لكارت ${p.cardName} (•••• ${p.last4}):${limitStr}\nميزانية الدورة السابقة: ${formatCurrency(p.previousBudget)}\n\nاضغط OK للاستمرار على ميزانية الدورة السابقة (${formatCurrency(p.previousBudget)})\nأو اضغط Cancel لإدخال ميزانية جديدة.`;
        if (confirm(msg)) {
          store.confirmCycleBudget(p.cardId, p.cycleKey, p.previousBudget);
          showToast(`تم اعتماد استمرار ميزانية ${formatCurrency(p.previousBudget)} لدورة (${p.cycleKey})`, 'success');
          renderCurrentView();
        } else if (typeof prompt === 'function') {
          const newVal = prompt(`أدخل الميزانية الجديدة لدورة (${p.cycleKey}):`, p.previousBudget);
          if (newVal !== null && newVal.trim() !== '') {
            const num = parseFloat(newVal);
            if (!isNaN(num) && num >= 0) {
              store.confirmCycleBudget(p.cardId, p.cycleKey, num);
              showToast(`تم تعيين ميزانية جديدة ${formatCurrency(num)} لدورة (${p.cycleKey})`, 'success');
              renderCurrentView();
            }
          }
        }
      }
      return;
    }

    const nameEl = document.getElementById('cycle-prompt-card-name');
    const stmtEl = document.getElementById('cycle-prompt-statement');
    const prevEl = document.getElementById('cycle-prompt-prev-budget');
    const limitRow = document.getElementById('cycle-prompt-limit-row');
    const limitEl = document.getElementById('cycle-prompt-limit');
    const inputNew = document.getElementById('input-cycle-new-budget');
    const btnContinue = document.getElementById('btn-cycle-continue');

    if (nameEl) nameEl.textContent = `${p.cardName} (•••• ${p.last4}) - ${p.bankName}`;
    if (stmtEl) stmtEl.textContent = `${p.statementBadge || p.cycleKey} (${p.cycleRange || ''})`;
    if (prevEl) prevEl.textContent = formatCurrency(p.previousBudget);

    if (limitRow && limitEl) {
      if (p.creditLimit !== null) {
        limitRow.classList.remove('hidden');
        limitEl.textContent = formatCurrency(p.creditLimit);
      } else {
        limitRow.classList.add('hidden');
      }
    }

    if (inputNew) {
      inputNew.value = '';
      inputNew.placeholder = `مثال: ${p.previousBudget}`;
    }

    if (btnContinue) {
      btnContinue.innerHTML = `
        <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
        <span>الاستمرار على ميزانية الدورة السابقة (${formatCurrency(p.previousBudget)})</span>
      `;
    }

    if (window.lucide) {
      try { lucide.createIcons({ root: modal }); } catch (e) {}
    }

    openModal('cycleBudgetPrompt');
  }

  window.checkAndPromptPendingCycleBudgets = checkAndPromptPendingCycleBudgets;

  document.getElementById('btn-cycle-continue')?.addEventListener('click', () => {
    if (!activeCyclePromptCard) return;
    const { cardId, cycleKey, previousBudget } = activeCyclePromptCard;
    store.confirmCycleBudget(cardId, cycleKey, previousBudget);
    closeModal('cycleBudgetPrompt');
    showToast(`تم اعتماد استمرار ميزانية ${formatCurrency(previousBudget)} لدورة (${cycleKey})`, 'success');
    renderCurrentView();
    setTimeout(() => checkAndPromptPendingCycleBudgets(), 350);
  });

  document.getElementById('btn-cycle-save-new')?.addEventListener('click', () => {
    if (!activeCyclePromptCard) return;
    const { cardId, cycleKey } = activeCyclePromptCard;
    const input = document.getElementById('input-cycle-new-budget');
    const val = input ? input.value : '';
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      showToast('يرجى إدخال مبلغ ميزانية صحيح', 'error');
      return;
    }
    store.confirmCycleBudget(cardId, cycleKey, num);
    closeModal('cycleBudgetPrompt');
    showToast(`تم تعيين ميزانية جديدة ${formatCurrency(num)} لدورة (${cycleKey})`, 'success');
    renderCurrentView();
    setTimeout(() => checkAndPromptPendingCycleBudgets(), 350);
  });

  // --- Card Color Customization Functions ---
  window.openCustomizeCardModal = (cardId, e) => {
    if (e) e.stopPropagation();
    editingCardId = cardId;
    const card = store.getCard(cardId);
    if (!card) return;

    const bank = store.getBank(card.bankId);
    const stats = store.getCardSpendingStats(cardId);

    // Update modal live preview
    const subtitle = document.getElementById('customize-card-subtitle');
    const previewBox = document.getElementById('customize-card-preview');
    const nameEl = document.getElementById('customize-preview-name');
    const typeEl = document.getElementById('customize-preview-type');
    const amountEl = document.getElementById('customize-preview-amount');
    const last4El = document.getElementById('customize-preview-last4');
    const cycleEl = document.getElementById('customize-preview-cycle');
    const colorInput = document.getElementById('customize-custom-color');

    if (subtitle) subtitle.textContent = `Customizing: ${bank ? bank.shortCode : ''} ${card.name}`;
    if (nameEl) nameEl.textContent = `${bank ? bank.shortCode : ''} ${card.name}`;
    if (typeEl) typeEl.textContent = card.cardType.toUpperCase();
    if (amountEl) amountEl.textContent = `${formatCurrency(stats.spent)} / ${formatCurrency(stats.target)}`;
    if (last4El) last4El.textContent = `•••• ${card.last4}`;
    if (cycleEl) cycleEl.textContent = card.cycleStartDay ? `Cycle: ${card.cycleStartDay}th → ${card.cycleEndDay}th` : card.network;

    if (previewBox) {
      previewBox.style.background = getCardGradientStyle(card, bank);
    }

    if (colorInput && card.customColor) {
      colorInput.value = card.customColor;
    }

    openModal('customizeCard');
  };

  window.applyCardThemePreset = (presetKey) => {
    if (!editingCardId) return;
    store.updateCardColor(editingCardId, { colorPreset: presetKey, customColor: null });
    
    // Update live preview in modal
    const card = store.getCard(editingCardId);
    const bank = card ? store.getBank(card.bankId) : null;
    const previewBox = document.getElementById('customize-card-preview');
    if (previewBox && card) {
      previewBox.style.background = getCardGradientStyle(card, bank);
    }

    // Update card background in carousel directly
    const carouselCardEl = document.getElementById('card-carousel-item-' + editingCardId);
    if (carouselCardEl && card) {
      carouselCardEl.style.background = getCardGradientStyle(card, bank);
    }

    showToast(`Applied ${CARD_THEMES[presetKey]?.name || 'theme'}!`, 'success');
  };

  window.applyCardCustomColor = (hexColor) => {
    if (!editingCardId) return;
    store.updateCardColor(editingCardId, { colorPreset: null, customColor: hexColor });

    // Update live preview in modal
    const card = store.getCard(editingCardId);
    const bank = card ? store.getBank(card.bankId) : null;
    const previewBox = document.getElementById('customize-card-preview');
    if (previewBox && card) {
      previewBox.style.background = getCardGradientStyle(card, bank);
    }

    // Update card background in carousel directly
    const carouselCardEl = document.getElementById('card-carousel-item-' + editingCardId);
    if (carouselCardEl && card) {
      carouselCardEl.style.background = getCardGradientStyle(card, bank);
    }

    showToast('Custom color applied!', 'success');
  };

  // ==========================================
  // VIEW 2: BANKS (3 MAX PER BANK)
  // ==========================================
  // ==========================================
  // VIEW 2: BANKS (3 MAX PER BANK)
  // ==========================================
  function renderBanksView() {
    const container = document.getElementById('view-cards');
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-4 pb-20">
        <div class="flex justify-between items-center px-1">
          <div>
            <h2 class="text-sm font-extrabold text-[#F3F1EC]">${t('banks')} & ${t('cards')}</h2>
            <p class="text-[11px] text-[#9A9CA3]">${t('cards_under_bank', { n: '3' })}</p>
          </div>
          <button onclick="window.openModal('bank')" class="px-3.5 py-1.5 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] text-xs font-bold rounded-full shadow-xs active-press flex items-center gap-1">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>${t('add_bank')}</span>
          </button>
        </div>

        <div class="space-y-4">
          ${store.banks.length === 0 ? `
            <div class="bg-[#1F2024] p-7 rounded-3xl border border-[#2F3136] text-center shadow-xs space-y-3 mt-2">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-[#26272B] text-[#F5B700] flex items-center justify-center border border-[#3A3C42]">
                <i data-lucide="building-2" class="w-6 h-6"></i>
              </div>
              <div>
                <h3 class="text-xs font-bold text-[#F3F1EC]">${t('no_banks_yet')}</h3>
                <p class="text-[11px] text-[#9A9CA3] mt-0.5">${getLang() === 'ar' ? 'أضف بنكك لإدارة ما يصل إلى 3 كروت لكل بنك.' : 'Add your bank to manage up to 3 cards per bank.'}</p>
              </div>
              <button onclick="window.openModal('bank')" class="px-4 py-2 bg-[#F5B700] text-[#111111] text-xs font-bold rounded-full shadow-xs active-press inline-flex items-center gap-1.5 mt-1">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>${t('add_bank')}</span>
              </button>
            </div>
          ` : store.banks.map(bank => {
            const cards = store.getCardsForBank(bank.id);
            const isCapReached = cards.length >= 3;

            return `
              <div class="bg-[#1F2024] rounded-3xl p-4.5 shadow-md border border-[#2F3136] space-y-3.5">
                <!-- Bank Header -->
                <div class="flex justify-between items-center pb-2 border-b border-[#2F3136]/70">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[11px] shadow-xs" style="background-color: ${bank.accentColor || '#F5B700'}">
                      ${(bank && bank.shortCode ? bank.shortCode : 'BNK').substring(0, 3)}
                    </div>
                    <div>
                      <h3 class="text-xs font-bold text-[#F3F1EC]">${bank.name}</h3>
                      <span class="text-[10px] text-[#9A9CA3] font-mono">${bank.shortCode}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#26272B] border border-[#3A3C42] ${
                      isCapReached ? 'text-[#F5B700]' : 'text-[#9A9CA3]'
                    }">
                      ${cards.length}/3 ${t('cards')}
                    </span>
                    <button onclick="window.confirmDeleteBank('${bank.id}')" class="text-[#9A9CA3] hover:text-[#E6A8A8] p-1 transition-colors">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>

                <!-- Bank Accounts Section -->
                ${(() => {
                  const accounts = store.getAccountsForBank(bank.id);
                  return `
                    <div class="space-y-1.5 pt-0.5">
                      <div class="flex items-center justify-between px-0.5">
                        <span class="text-[11px] font-bold text-[#F3F1EC] flex items-center gap-1">
                          <i data-lucide="landmark" class="w-3.5 h-3.5 text-[#F5B700]"></i>
                          <span>${t('bank_accounts_count', { n: accounts.length })}</span>
                        </span>
                        <button onclick="window.openAddAccountForBank('${bank.id}')" class="text-[10px] font-bold text-[#F5B700] hover:underline flex items-center gap-0.5">
                          <i data-lucide="plus" class="w-3 h-3"></i>
                          <span>${t('add_account')}</span>
                        </button>
                      </div>
                      ${accounts.length === 0 ? `
                        <div class="p-2.5 rounded-2xl bg-[#26272B] border border-dashed border-[#3A3C42] text-center text-[10px] text-[#9A9CA3]">
                          ${t('no_accounts_for_bank')}
                        </div>
                      ` : accounts.map(acc => `
                        <div class="p-2.5 rounded-2xl bg-[#26272B] border border-[#3A3C42] flex justify-between items-center">
                          <div>
                            <div class="flex items-center gap-1.5">
                              <span class="text-xs font-bold text-[#F3F1EC]">${acc.name}</span>
                              <span class="text-[10px] text-[#9A9CA3] font-mono">${acc.accountNumberMasked || acc.identifierDigits}</span>
                            </div>
                          </div>
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-black font-mono px-2 py-0.5 rounded-full ${acc.balance < 0 ? 'bg-[#3A2020] text-[#E6A8A8] border border-[#E6A8A8]/30' : 'bg-[#16171A] text-[#F3F1EC] border border-[#3A3C42]'}" dir="ltr">
                              ${formatCurrency(acc.balance || 0, acc.currency || 'EGP')}
                            </span>
                            <button onclick="window.openEditAccountModal('${acc.id}')" class="text-[#9A9CA3] hover:text-[#F5B700] p-0.5 transition-colors" title="${t('correct_balance')}">
                              <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                            </button>
                            <button onclick="window.confirmDeleteAccount('${acc.id}')" class="text-[#9A9CA3] hover:text-[#E6A8A8] p-0.5 transition-colors" title="${t('delete')}">
                              <i data-lucide="x" class="w-3.5 h-3.5"></i>
                            </button>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  `;
                })()}

                <!-- Cards List -->
                <div class="space-y-2.5 pt-1 border-t border-[#2F3136]/70">
                  <div class="px-0.5 text-[11px] font-bold text-[#F3F1EC] flex items-center gap-1">
                    <i data-lucide="credit-card" class="w-3.5 h-3.5 text-[#F5B700]"></i>
                    <span>${t('registered_cards')}</span>
                  </div>
                  ${cards.map(c => {
                    const cStat = store.getCardSpendingStats(c.id);
                    const linkedAcc = c.linkedAccountId ? store.getAccount(c.linkedAccountId) : null;
                    return `
                      <div class="p-3.5 rounded-2xl bg-[#26272B] border border-[#3A3C42] flex justify-between items-center">
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-[#F3F1EC] truncate">${c.name}</span>
                            <span class="text-[9px] bg-[#16171A] border border-[#3A3C42] text-[#9A9CA3] px-2 py-0.5 rounded-full font-bold uppercase">${c.cardType}</span>
                          </div>
                          <p class="text-[10px] text-[#9A9CA3] font-mono mt-0.5">
                            •••• ${c.last4} ${c.cycleStartDay ? `• Cycle ${c.cycleStartDay}th–${c.cycleEndDay}th` : ''} ${linkedAcc ? `• ${linkedAcc.name}` : ''}
                          </p>
                          <div class="w-full bg-[#16171A] rounded-full h-1 mt-2 overflow-hidden">
                            <div class="${cStat.isExceeded ? 'bg-[#E6A8A8]' : 'bg-[#F5B700]'} h-full rounded-full" style="width: ${cStat.percentage}%;"></div>
                          </div>
                        </div>

                        <div class="text-end shrink-0 ml-3">
                          <span class="text-xs font-bold ${cStat.isExceeded ? 'text-[#E6A8A8]' : 'text-[#F3F1EC]'} font-mono block" dir="ltr">
                            ${formatCurrency(cStat.spent)}
                          </span>
                          <span class="text-[10px] text-[#9A9CA3] font-mono" dir="ltr">/ ${formatCurrency(cStat.target)}</span>
                          <div class="flex items-center justify-end gap-1.5 mt-1">
                            <button onclick="window.openEditCardModal('${c.id}')" class="p-0.5 text-[#9A9CA3] hover:text-[#F5B700] transition-colors" title="${t('edit_card')}">
                              <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                            </button>
                            <button onclick="window.openCustomizeCardModal('${c.id}', event)" class="p-0.5 text-[#9A9CA3] hover:text-[#F5B700] transition-colors" title="Customize Card Color">
                              <span class="text-xs">🎨</span>
                            </button>
                            <button onclick="window.confirmDeleteCard('${c.id}')" class="text-[#9A9CA3] hover:text-[#E6A8A8] transition-colors" title="${t('delete')}">
                              <i data-lucide="x" class="w-3.5 h-3.5"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>

                <!-- 3 Card Cap Enforcement Button -->
                ${isCapReached ? `
                  <div class="w-full py-2.5 rounded-full bg-[#26272B] border border-[#3A3C42] text-[#9A9CA3] text-[11px] font-bold text-center cursor-not-allowed">
                    🔒 ${t('max_3_reached')}
                  </div>
                ` : `
                  <button onclick="window.openAddCardForBank('${bank.id}')" class="w-full py-2.5 rounded-full bg-[#26272B] hover:bg-[#3A3C42] border border-[#3A3C42] text-[#F3F1EC] text-[11px] font-bold text-center transition-all flex items-center justify-center gap-1.5 active-press">
                    <i data-lucide="plus" class="w-3.5 h-3.5 text-[#F5B700]"></i>
                    <span>${t('add_card')} (${cards.length}/3)</span>
                  </button>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (window.lucide) {
      try { lucide.createIcons({ root: container }); } catch (e) {}
    }
  }

  // ==========================================
  // VIEW 3: HISTORY (ACTIVITY)
  // ==========================================
  function renderHistoryView() {
    const container = document.getElementById('view-history');
    if (!container) return;

    const filtered = store.getFilteredTransactions();

    container.innerHTML = `
      <div class="space-y-3 pb-20">
        <div class="flex justify-between items-center px-1">
          <div>
            <h2 class="text-sm font-extrabold text-[#F3F1EC]">${t('history')}</h2>
            <p class="text-[11px] text-[#9A9CA3]">${filtered.length} ${t('activity')}</p>
          </div>
          <button onclick="window.exportTransactionsCSV()" class="px-3 py-1 bg-[#1F2024] border border-[#2F3136] text-[#F3F1EC] text-[11px] font-bold rounded-full shadow-2xs hover:bg-[#26272B] transition-colors">
            ${t('export_csv')}
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative">
          <i data-lucide="search" class="w-3.5 h-3.5 text-[#9A9CA3] absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5"></i>
          <input type="text" id="history-search-input" value="${store.searchQuery}" placeholder="${t('search_placeholder')}" class="w-full bg-[#1F2024] border border-[#2F3136] rounded-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 text-xs font-medium text-[#F3F1EC] placeholder-[#9A9CA3] focus:outline-none focus:ring-1 focus:ring-[#F5B700] shadow-2xs">
        </div>

        <!-- Filter Chips Carousel -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button onclick="window.setFilterStatement('all')" class="px-3 py-1 rounded-full text-[10px] font-bold shrink-0 ${
            store.selectedStatementFilter === 'all' ? 'bg-[#F5B700] text-[#111111]' : 'bg-[#1F2024] text-[#9A9CA3] border border-[#2F3136]'
          }">
            ${t('all_cycles')}
          </button>
          ${store.getAvailableStatementMonths().map(m => `
            <button onclick="window.setFilterStatement('${m.key}')" class="px-3 py-1 rounded-full text-[10px] font-bold shrink-0 ${
              store.selectedStatementFilter === m.key ? 'bg-[#F5B700] text-[#111111]' : 'bg-[#1F2024] text-[#9A9CA3] border border-[#2F3136]'
            }">
              ${m.badge}
            </button>
          `).join('')}
        </div>

        <!-- Transaction Items -->
        <div class="space-y-2 pt-1">
          ${filtered.length === 0 ? `
            <div class="bg-[#1F2024] p-7 rounded-3xl text-center border border-[#2F3136] shadow-2xs space-y-3 mt-2">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-[#26272B] text-[#9A9CA3] flex items-center justify-center border border-[#3A3C42]">
                <i data-lucide="receipt" class="w-6 h-6"></i>
              </div>
              <div>
                <h3 class="text-xs font-bold text-[#F3F1EC]">${t('no_transactions_yet')}</h3>
                <p class="text-[11px] text-[#9A9CA3] mt-0.5">${getLang() === 'ar' ? 'عند تسجيل حركة جديدة ستظهر هنا تلقائياً.' : 'When you log an expense, it will appear here.'}</p>
              </div>
              <button onclick="window.openModal('transaction')" class="px-4 py-2 bg-[#F5B700] text-[#111111] text-xs font-bold rounded-full shadow-xs active-press inline-flex items-center gap-1.5 mt-1">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>${t('log_first_expense')}</span>
              </button>
            </div>
          ` : filtered.map(tx => {
            const isCredit = tx.card && tx.card.cardType === 'credit';
            const stmtName = (tx.statementInfo && tx.statementInfo.statementMonthName) ? tx.statementInfo.statementMonthName.substring(0, 3) : 'Dec';
            const isCurrentCycle = tx.statementInfo && tx.statementInfo.statementMonth === 12;
            const txType = tx.transactionType || (tx.category === 'transfer' ? 'transfer' : 'purchase');
            let typeBadge = '';
            if (tx.isBalanceAdjustment || tx.transactionType === 'balance_adjustment') {
              typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#26272B] text-[#9A9CA3] border border-[#3A3C42]">تسوية رصيد</span>';
            } else if (txType === 'withdrawal') {
              if (tx.card && tx.card.cardType === 'credit') {
                typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#26272B] text-[#E6A8A8] border border-[#E6A8A8]/30">سحب كاش كريدت</span>';
              } else {
                typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#26272B] text-[#F5B700] border border-[#F5B700]/30">سحب نقدي</span>';
              }
            } else if (txType === 'transfer') {
              typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#26272B] text-[#9A9CA3] border border-[#3A3C42]">تحويل</span>';
            } else {
              typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#26272B] text-[#F3F1EC] border border-[#3A3C42]">شراء</span>';
            }

            return `
              <div class="bg-[#1F2024] p-3.5 rounded-2xl flex justify-between items-center shadow-2xs border border-[#2F3136] hover:border-[#3A3C42] transition-all">
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-xs font-bold text-[#F3F1EC]">${tx.merchant}</p>
                    <span class="text-[10px] text-[#9A9CA3] font-mono">• ${tx.date}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-0.5">
                    ${isCredit ? `
                      <span class="text-[10px] ${isCurrentCycle ? 'text-[#F5B700]' : 'text-[#9A9CA3]'} font-semibold">
                        Affects ${stmtName}
                      </span>
                    ` : `
                      <span class="text-[10px] text-[#9A9CA3] font-medium">${tx.card?.name || 'Debit'}</span>
                    `}
                    <span class="text-[#3A3C42]">•</span>
                    <span class="text-[10px] text-[#9A9CA3] font-mono">•••• ${tx.card?.last4 || ''}</span>
                  </div>
                </div>

                <div class="flex items-center gap-1.5">
                  ${typeBadge}
                  <span class="text-xs font-bold ${tx.direction === 'income' ? 'text-[#F5B700]' : 'text-[#F3F1EC]'} font-mono" dir="ltr">${tx.direction === 'income' ? '+' : '-'}${formatCurrency(tx.amount)}</span>
                  <button onclick="window.confirmDeleteTx('${tx.id}')" class="text-[#9A9CA3] hover:text-[#E6A8A8] p-1 transition-colors">
                    <i data-lucide="trash" class="w-3 h-3"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Reattach search input listener
    document.getElementById('history-search-input')?.addEventListener('input', (e) => {
      store.searchQuery = e.target.value;
      renderHistoryView();
      if (window.lucide) lucide.createIcons();
    });

    if (window.lucide) {
      try { lucide.createIcons({ root: container }); } catch (e) {}
    }
  }

  // --- Global Helpers ---
  window.switchTab = (tab) => {
    switchView(tab);
  };

  window.setFilterStatement = (key) => {
    store.selectedStatementFilter = key;
    renderCurrentView();
  };

  window.openAddCardForBank = (bankId) => {
    populateCardBankDropdown(bankId);
    openModal('card');
  };

  window.toggleAppLanguage = () => {
    const current = getLang();
    const next = current === 'ar' ? 'en' : 'ar';
    setLang(next);
  };

  window.toggleDevSimulator = () => {
    const box = document.getElementById('settings-dev-tools-box');
    if (box) {
      box.classList.toggle('hidden');
    }
  };

  // ==========================================
  // VIEW 4: SETTINGS (EXACT MATCH TO MOCKUPS)
  // ==========================================
  async function renderSettingsView() {
    const container = document.getElementById('view-settings');
    if (!container) return;

    const isBioSupported = window.WalletSecurity ? await window.WalletSecurity.isBiometricsAvailable() : false;
    const isBioEnabled = window.WalletSecurity ? window.WalletSecurity.isBiometricsEnabled() : false;
    const timeoutMs = window.WalletSecurity ? window.WalletSecurity.getAutoLockTimeout() : 180000;
    const currentCurrency = (typeof store.currency !== 'undefined') ? store.currency : 'EGP';

    let autoLockLabel = t('minutes_3');
    if (timeoutMs === 0) autoLockLabel = t('immediately');
    else if (timeoutMs === 60000) autoLockLabel = t('minutes_1');
    else if (timeoutMs === 300000) autoLockLabel = t('minutes_5');
    else if (timeoutMs === 900000) autoLockLabel = t('minutes_15');

    container.innerHTML = `
      <div class="space-y-4 pb-24">

        <!-- Hidden File Input for Vault Backup Restore -->
        <input type="file" id="vault-backup-file-input" accept=".json" class="hidden" onchange="window.importEncryptedVaultBackup(event)">

        <!-- SECTION 1: SECURITY (الأمان) -->
        <div class="space-y-1.5">
          <p class="text-xs font-bold text-[#9A9CA3] px-1">${t('security')}</p>
          <div class="bg-[#1F2024] border border-[#2F3136] rounded-3xl divide-y divide-[#2F3136]/70 overflow-hidden shadow-md">
            
            <!-- Row: PIN Code -->
            <div class="flex items-center justify-between p-4">
              <div>
                <div class="text-xs font-bold text-[#F3F1EC]">${t('pin_code')}</div>
                <div class="text-[10px] text-[#9A9CA3] mt-0.5">${t('digits_4')}</div>
              </div>
              <button type="button" onclick="window.promptChangePin()" class="px-3.5 py-1.5 rounded-xl bg-[#26272B] hover:bg-[#3A3C42] border border-[#3A3C42] text-xs font-bold text-[#F3F1EC] active-press transition-colors">
                ${t('change')}
              </button>
            </div>

            <!-- Row: Biometric Unlock -->
            <div class="flex items-center justify-between p-4">
              <div>
                <div class="text-xs font-bold text-[#F3F1EC]">${t('biometric_unlock')}</div>
                <div class="text-[10px] text-[#9A9CA3] mt-0.5">
                  ${isBioSupported ? (isBioEnabled ? t('enabled') : t('not_enabled')) : (getLang() === 'ar' ? 'غير مدعوم في هذا المتصفح' : 'Not supported')}
                </div>
              </div>
              <label class="relative inline-flex items-center ${isBioSupported ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}">
                <input type="checkbox" id="settings-biometric-toggle" ${isBioEnabled ? 'checked' : ''} ${!isBioSupported ? 'disabled' : ''} class="sr-only peer">
                <div class="w-11 h-6 bg-[#26272B] border border-[#3A3C42] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:peer-checked:after:-translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F5B700] peer-checked:border-[#F5B700]"></div>
              </label>
            </div>

            <!-- Row: Auto-Lock -->
            <div class="flex items-center justify-between p-4">
              <div>
                <div class="text-xs font-bold text-[#F3F1EC]">${t('auto_lock')}</div>
              </div>
              <select id="settings-autolock-select" onchange="window.updateAutoLockTimeout(this.value)" class="text-xs font-bold bg-[#26272B] border border-[#3A3C42] text-[#F3F1EC] rounded-xl px-3 py-1.5 outline-none cursor-pointer">
                <option value="0" ${timeoutMs === 0 ? 'selected' : ''}>${t('immediately')}</option>
                <option value="60000" ${timeoutMs === 60000 ? 'selected' : ''}>${t('minutes_1')}</option>
                <option value="180000" ${timeoutMs === 180000 ? 'selected' : ''}>${t('minutes_3')}</option>
                <option value="300000" ${timeoutMs === 300000 ? 'selected' : ''}>${t('minutes_5')}</option>
                <option value="900000" ${timeoutMs === 900000 ? 'selected' : ''}>${t('minutes_15')}</option>
              </select>
            </div>

            <!-- Row: Lock Wallet Now -->
            <div onclick="window.WalletSecurity && window.WalletSecurity.lock()" class="flex items-center justify-between p-4 cursor-pointer hover:bg-[#26272B]/60 transition-colors active-press">
              <span class="text-xs font-bold text-[#F3F1EC]">${t('lock_wallet_now')}</span>
              <span class="text-[#9A9CA3] text-xs">&rsaquo;</span>
            </div>

          </div>
        </div>

        <!-- SECTION 2: SMS PROCESSING (استقبال الرسائل) -->
        <div class="space-y-1.5">
          <p class="text-xs font-bold text-[#9A9CA3] px-1">${t('sms_intake')}</p>
          <div class="bg-[#1F2024] border border-[#2F3136] rounded-3xl divide-y divide-[#2F3136]/70 overflow-hidden shadow-md">
            
            <!-- Row: Read Bank SMS -->
            <div class="flex items-center justify-between p-4">
              <div>
                <div class="text-xs font-bold text-[#F3F1EC]">${t('read_bank_sms')}</div>
                <div class="text-[10px] text-[#9A9CA3] mt-0.5">
                  ${(window.BankSmsEngine && window.BankSmsEngine.stats.permissionStatus === 'granted') ? t('active_perm_granted') : t('inactive_or_no_perm')}
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="settings-sms-import-toggle" ${window.BankSmsEngine && window.BankSmsEngine.stats.isSmsImportEnabled ? 'checked' : ''} onchange="window.toggleSmsImport(this.checked)" class="sr-only peer">
                <div class="w-11 h-6 bg-[#26272B] border border-[#3A3C42] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:peer-checked:after:-translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F5B700] peer-checked:border-[#F5B700]"></div>
              </label>
            </div>

            <!-- Row: Allowed Banks -->
            <div onclick="window.toggleDevSimulator()" class="flex items-center justify-between p-4 cursor-pointer hover:bg-[#26272B]/60 transition-colors active-press">
              <span class="text-xs font-bold text-[#F3F1EC]">${t('allowed_banks')}</span>
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] text-[#9A9CA3] font-mono">CIB +${Math.max(store.banks.length - 1, 0)}</span>
                <span class="text-[#9A9CA3] text-xs">&rsaquo;</span>
              </div>
            </div>

            <!-- Row: Check Reception Status -->
            <div onclick="window.openSmsDiagnostics()" class="flex items-center justify-between p-4 cursor-pointer hover:bg-[#26272B]/60 transition-colors active-press">
              <span class="text-xs font-bold text-[#F3F1EC]">${t('check_reception_status')}</span>
              <span class="text-[#9A9CA3] text-xs">&rsaquo;</span>
            </div>

            <!-- Row: Import Past SMS -->
            <div onclick="window.openHistoricalSmsImport()" class="flex items-center justify-between p-4 cursor-pointer hover:bg-[#26272B]/60 transition-colors active-press">
              <span class="text-xs font-bold text-[#F3F1EC]">${t('import_past_sms')}</span>
              <span class="text-[#9A9CA3] text-xs">&rsaquo;</span>
            </div>

          </div>
        </div>

        <!-- SECTION 3: BACKUP & GENERAL (النسخ الاحتياطي والعام) -->
        <div class="space-y-1.5">
          <p class="text-xs font-bold text-[#9A9CA3] px-1">${t('backup_general')}</p>
          <div class="bg-[#1F2024] border border-[#2F3136] rounded-3xl divide-y divide-[#2F3136]/70 overflow-hidden shadow-md">
            
            <!-- Row: Export Encrypted Backup -->
            <div onclick="window.exportEncryptedVaultBackup()" class="flex items-center justify-between p-4 cursor-pointer hover:bg-[#26272B]/60 transition-colors active-press">
              <div>
                <div class="text-xs font-bold text-[#F3F1EC]">${t('export_encrypted_backup')}</div>
                <div class="text-[10px] text-[#9A9CA3] mt-0.5">${t('passphrase_8_chars')}</div>
              </div>
              <span class="text-[#9A9CA3] text-xs">&rsaquo;</span>
            </div>

            <!-- Row: Import Backup -->
            <div onclick="document.getElementById('vault-backup-file-input').click()" class="flex items-center justify-between p-4 cursor-pointer hover:bg-[#26272B]/60 transition-colors active-press">
              <div>
                <div class="text-xs font-bold text-[#F3F1EC]">${t('import_backup')}</div>
                <div class="text-[10px] text-[#9A9CA3] mt-0.5">${t('replaces_data_after_confirm')}</div>
              </div>
              <span class="text-[#9A9CA3] text-xs">&rsaquo;</span>
            </div>

            <!-- Row: Language -->
            <div class="flex items-center justify-between p-4">
              <div>
                <div class="text-xs font-bold text-[#F3F1EC]">${t('language')}</div>
                <div class="text-[10px] text-[#9A9CA3] mt-0.5">${t('all_screen_one_lang')}</div>
              </div>
              <button type="button" onclick="window.toggleAppLanguage()" class="px-3.5 py-1.5 rounded-xl bg-[#26272B] hover:bg-[#3A3C42] border border-[#3A3C42] text-xs font-bold text-[#F3F1EC] active-press transition-colors">
                ${getLang() === 'ar' ? 'العربية' : 'English'}
              </button>
            </div>

            <!-- Row: Currency -->
            <div class="flex items-center justify-between p-4">
              <span class="text-xs font-bold text-[#F3F1EC]">${t('currency')}</span>
              <select onchange="window.switchCurrency(this.value)" class="text-xs font-bold bg-[#26272B] border border-[#3A3C42] text-[#F3F1EC] rounded-xl px-3 py-1.5 outline-none cursor-pointer">
                <option value="EGP" ${currentCurrency === 'EGP' ? 'selected' : ''}>EGP</option>
                <option value="USD" ${currentCurrency === 'USD' ? 'selected' : ''}>USD ($)</option>
                <option value="EUR" ${currentCurrency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                <option value="SAR" ${currentCurrency === 'SAR' ? 'selected' : ''}>SAR</option>
                <option value="AED" ${currentCurrency === 'AED' ? 'selected' : ''}>AED</option>
                <option value="GBP" ${currentCurrency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
              </select>
            </div>

            <!-- Row: Export CSV -->
            <div onclick="window.exportTransactionsCSV()" class="flex items-center justify-between p-4 cursor-pointer hover:bg-[#26272B]/60 transition-colors active-press">
              <span class="text-xs font-bold text-[#F3F1EC]">${t('export_csv')}</span>
              <span class="text-[#9A9CA3] text-xs">&rsaquo;</span>
            </div>

            <!-- Row: Developer Tools & Simulation -->
            <div onclick="window.toggleDevSimulator()" class="flex items-center justify-between p-4 cursor-pointer hover:bg-[#26272B]/60 transition-colors active-press">
              <span class="text-xs font-bold text-[#F3F1EC]">${t('developer_tools')}</span>
              <span class="text-[#9A9CA3] text-xs">&rsaquo;</span>
            </div>

            <!-- Row: Clear All Data -->
            <div onclick="window.clearAllData()" class="flex items-center justify-between p-4 cursor-pointer hover:bg-[#3A2020]/40 transition-colors active-press">
              <span class="text-xs font-bold text-[#E6A8A8]">${t('clear_all_data')}</span>
              <span class="text-[#E6A8A8] text-xs">&rsaquo;</span>
            </div>

          </div>
        </div>

        <!-- DEVELOPER TOOLS EXPANDABLE DRAWER -->
        <div id="settings-dev-tools-box" class="hidden bg-[#1F2024] rounded-3xl p-5 border border-[#2F3136] space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-[#2F3136]">
            <h3 class="text-xs font-extrabold text-[#F3F1EC]">${t('developer_tools')}</h3>
            <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#26272B] text-[#F5B700] border border-[#F5B700]/30">DEV / DEMO</span>
          </div>

          <!-- Bank Allowlist Manager -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-[#F3F1EC]">Allowed Bank Senders</label>
              <span class="text-[10px] text-[#9A9CA3]">{(window.BankSmsEngine && window.BankSmsEngine.allowlist.length) || 0} enabled</span>
            </div>
            <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-[#26272B] rounded-2xl border border-[#3A3C42]">
              ${(window.BankSmsEngine && window.BankSmsEngine.allowlist || []).map(b => `
                <span class="inline-flex items-center gap-1 text-[10px] font-bold bg-[#1F2024] text-[#F3F1EC] px-2 py-0.5 rounded-full border border-[#3A3C42]">
                  <span>${b}</span>
                  <button type="button" onclick="window.removeAllowedBank('${b}')" class="text-[#9A9CA3] hover:text-[#E6A8A8]">×</button>
                </span>
              `).join('')}
            </div>
            <div class="flex gap-2">
              <input type="text" id="settings-add-bank-input" placeholder="e.g. CIB, ALEXBANK" class="flex-1 text-xs bg-[#26272B] border border-[#3A3C42] rounded-xl px-2.5 py-1.5 text-[#F3F1EC] outline-none">
              <button type="button" onclick="window.addAllowedBank()" class="px-3 py-1.5 bg-[#F5B700] text-[#111111] text-[11px] font-bold rounded-xl active-press">Add</button>
            </div>
          </div>

          <!-- In-App Synthetic SMS Test Simulator -->
          <div class="border-t border-[#2F3136] pt-3 space-y-2">
            <label class="text-xs font-bold text-[#F3F1EC]">SMS Parser Test Simulator</label>
            <div class="flex gap-2">
              <select id="sms-simulator-select" class="flex-1 text-[11px] font-bold bg-[#26272B] border border-[#3A3C42] text-[#F3F1EC] rounded-xl px-2.5 py-1.5 outline-none cursor-pointer">
                <option value="0">CIB Purchase (EGP 1,250.50 at Amazon Egypt)</option>
                <option value="1">HSBC POS Debit (EGP 450.00 at Starbucks Arkan)</option>
                <option value="2">NBE Arabic (١,٤٥٠.٠٠ ج.م لدى فودافون)</option>
                <option value="3">Banque Misr Arabic (850.00 جنيه لدى كارفور)</option>
                <option value="4">Amazon Refund (EGP 600.00 Income Credit)</option>
                <option value="5">Security OTP (Must be REJECTED)</option>
              </select>
              <button type="button" onclick="window.simulatePresetSms()" class="px-3 py-1.5 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] text-[11px] font-bold rounded-xl active-press shrink-0">
                Simulate
              </button>
            </div>
          </div>

        </div>

      </div>
    `;

    // Biometric Toggle Handler
    const bioToggle = document.getElementById('settings-biometric-toggle');
    if (bioToggle && isBioSupported) {
      bioToggle.addEventListener('change', async (e) => {
        if (!window.WalletSecurity) return;
        const enabled = e.target.checked;
        if (enabled) {
          const ok = await window.WalletSecurity.enableBiometrics();
          if (!ok) {
            e.target.checked = false;
            showToast('Failed to activate biometrics', 'error');
          } else {
            showToast('Biometric unlock activated', 'success');
          }
        } else {
          window.WalletSecurity.disableBiometrics();
          showToast('Biometrics disabled', 'info');
        }
      });
    }

    if (window.lucide) {
      try { lucide.createIcons({ root: container }); } catch (e) {}
    }
  }

  window.updateAutoLockTimeout = (ms) => {
    if (window.WalletSecurity) {
      window.WalletSecurity.setAutoLockTimeout(ms);
      showToast('Auto-lock timer updated', 'success');
    }
  };

  window.confirmDeleteBank = (bankId) => {
    const bank = store.getBank(bankId);
    if (!bank) return;
    if (confirm(`Delete bank ${bank.name}? This will also delete associated cards and transactions.`)) {
      store.deleteBank(bankId);
      showToast(`Bank ${bank.name} deleted`, 'info');
      renderCurrentView();
    }
  };

  window.confirmDeleteCard = (cardId) => {
    const card = store.getCard(cardId);
    if (!card) return;
    const affectedTxs = store.transactions.filter(t => t.cardId === cardId);
    const count = affectedTxs.length;
    const msg = count > 0 
      ? `Delete card "${card.name}" (•••• ${card.last4})?\n\nWarning: There are ${count} recorded transactions linked to this card.`
      : `Delete card "${card.name}" (•••• ${card.last4})?`;
    if (confirm(msg)) {
      store.deleteCard(cardId);
      showToast(`Card deleted`, 'info');
      renderCurrentView();
    }
  };

  window.confirmDeleteTx = (txId) => {
    const tx = store.getTransaction(txId);
    if (!tx) return;
    if (confirm(`Delete transaction "${tx.merchant}"?`)) {
      store.deleteTransaction(txId);
      showToast(`Transaction deleted`, 'info');
      renderCurrentView();
    }
  };

  window.switchCurrency = (newCurr) => {
    currentCurrency = newCurr;
    localStorage.setItem('wallet_currency', newCurr);
    const currSelect = document.getElementById('header-currency-select');
    if (currSelect) currSelect.value = newCurr;
    showToast(`Currency: ${newCurr}`, 'success');
    renderCurrentView();
  };

  window.clearAllData = () => {
    if (confirm('Are you sure you want to delete all cards, banks, and transactions?')) {
      store.clearAllData();
      activeFeaturedCardId = null;
      showToast('All data cleared successfully!', 'success');
      renderCurrentView();
    }
  };

  window.resetSampleData = () => {
    if (confirm('Reset wallet to realistic demo sample data?')) {
      store.resetToSampleData();
      activeFeaturedCardId = store.cards.length > 0 ? store.cards[0].id : null;
      showToast('Wallet reset to demo data!', 'success');
      renderCurrentView();
    }
  };

  window.exportTransactionsCSV = () => {
    const txs = store.getEnrichedTransactions();
    if (txs.length === 0) {
      showToast('No transactions to export.', 'error');
      return;
    }
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Currency', 'Bank', 'Card', 'Last 4', 'Statement Cycle', 'Notes'];
    const rows = txs.map(t => [
      t.date,
      `"${t.merchant.replace(/"/g, '""')}"`,
      t.category,
      t.amount,
      currentCurrency,
      `"${(t.bank?.name || '').replace(/"/g, '""')}"`,
      `"${(t.card?.name || '').replace(/"/g, '""')}"`,
      t.card?.last4 || '',
      `"${(t.statementInfo?.statementFullBadge || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `apexwallet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV file!', 'success');
  };

  // ==========================================
  // BANK SMS IMPORT & REVIEW INBOX CONTROLLER
  // ==========================================
  function renderSmsCandidatesList() {
    const listEls = [
      document.getElementById('sms-candidates-container'),
      document.getElementById('view-review-candidates-container')
    ].filter(Boolean);
    const counterEl = document.getElementById('sms-inbox-counter');

    const candidates = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates) ? window.BankSmsEngine.pendingCandidates : [];
    if (counterEl) {
      counterEl.textContent = `${candidates.length} ${t('review_btn')}`;
    }

    if (listEls.length === 0) return;

    if (candidates.length === 0) {
      const emptyHtml = `
        <div class="py-12 text-center space-y-3 bg-[#1F2024] border border-[#2F3136] rounded-3xl p-6">
          <div class="w-12 h-12 mx-auto rounded-full bg-[#26272B] text-[#9A9CA3] flex items-center justify-center border border-[#3A3C42]">
            <i data-lucide="inbox" class="w-6 h-6"></i>
          </div>
          <p class="text-xs font-bold text-[#F3F1EC]">${t('inbox_empty')}</p>
          <p class="text-[10px] text-[#9A9CA3] max-w-[240px] mx-auto">${t('inbox_empty_desc')}</p>
        </div>
      `;
      listEls.forEach(el => {
        el.innerHTML = emptyHtml;
        if (window.lucide) {
          try { lucide.createIcons({ root: el }); } catch (e) {}
        }
      });
      return;
    }

    const cards = store.cards || [];

    const candidatesHtml = candidates.map(c => {
      const isCredit = c.type === 'income' || c.direction === 'income';
      let opTypeBadge = '';
      if (c.transactionType === 'withdrawal') {
        opTypeBadge = `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#26272B] text-[#F5B700] border border-[#F5B700]/30">🏧 ${t('withdrawal')}</span>`;
      } else if (c.transactionType === 'transfer') {
        opTypeBadge = `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#26272B] text-[#9A9CA3] border border-[#3A3C42]">🔁 ${t('transfer')}</span>`;
      } else {
        opTypeBadge = isCredit
          ? '<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#26272B] text-[#F5B700] border border-[#F5B700]/40">📥 وارد</span>'
          : `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#26272B] text-[#F3F1EC] border border-[#3A3C42]">🛍️ ${t('purchase')}</span>`;
      }

      const needsCardSelection = c.requiresCardSelection || !c.matchedCardId;

      return `
        <div id="candidate-card-${c.id}" class="bg-[#1F2024] border ${needsCardSelection ? 'border-[#F5B700] ring-1 ring-[#F5B700]/30' : 'border-[#2F3136]'} rounded-2xl p-4 space-y-3 transition-all shadow-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[11px] font-black tracking-tight text-[#F3F1EC] bg-[#26272B] px-2 py-0.5 rounded-lg border border-[#3A3C42]">${c.bank}</span>
              ${opTypeBadge}
              ${c.isHistorical ? '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#26272B] text-[#9A9CA3] border border-[#3A3C42]">استيراد قديم</span>' : ''}
              ${c.cardSuffix ? `<span class="text-[10px] font-mono text-[#9A9CA3] font-bold">•••• ${c.cardSuffix}</span>` : '<span class="text-[9px] font-bold text-[#F5B700] bg-[#26272B] border border-[#F5B700]/30 px-1.5 py-0.5 rounded">اختر الكارت</span>'}
            </div>
            <span class="text-xs font-black font-mono ${isCredit ? 'text-[#F5B700]' : 'text-[#F3F1EC]'} shrink-0 ml-2" dir="ltr">
              ${isCredit ? '+' : '-'}${c.amount.toFixed(2)} ${c.currency}
            </span>
          </div>

          ${needsCardSelection ? `
            <div class="bg-[#26272B] border border-[#F5B700]/40 rounded-xl p-2.5 space-y-1.5 text-xs text-[#F5B700]">
              <div class="flex items-start gap-1.5 font-bold text-[11px] text-[#F5B700]">
                <i data-lucide="help-circle" class="w-3.5 h-3.5 text-[#F5B700] shrink-0 mt-0.5"></i>
                <span>سبب عدم المطابقة: ${c.nonMatchReason || 'لا يوجد كارت أو حساب مسجل بهذه الأرقام لدى هذا البنك'}</span>
              </div>
              ${c.matchSuggestion ? `
                <div class="text-[10px] text-[#F3F1EC] flex items-center justify-between gap-2 pt-0.5 border-t border-[#3A3C42]">
                  <span>💡 ${c.matchSuggestion}</span>
                  ${c.suggestAddAccount ? `
                    <button type="button" onclick="window.openAddAccountPrompt('${c.suggestAddAccount.bankId || ''}', '${c.suggestAddAccount.digits || ''}', '${c.suggestAddAccount.position || 'last'}')" class="shrink-0 px-2.5 py-1 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] rounded-lg text-[10px] font-bold active-press shadow-2xs">
                      + إضافة الحساب
                    </button>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${c.isPotentialDuplicate ? `
            <div class="bg-[#26272B] border border-[#F5B700]/40 rounded-xl p-2.5 text-xs text-[#F5B700] space-y-1">
              <div class="flex items-center gap-1.5 font-bold text-[#F5B700]">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-[#F5B700]"></i>
                <span>⚠️ تكرار محتمل (Possible Duplicate)</span>
              </div>
              <p class="text-[10px] text-[#F3F1EC] leading-tight">${c.potentialDuplicateReason || 'توجد عملية سابقة مسجلة بنفس المبلغ في المحفظة.'}</p>
              <div class="text-[9px] text-[#9A9CA3] bg-[#1F2024] p-1 rounded font-mono border border-[#3A3C42]">
                المسجل سابقاً: ${c.potentialDuplicateMatch ? `${c.potentialDuplicateMatch.amount} EGP بتاريخ ${c.potentialDuplicateMatch.date} (${c.potentialDuplicateMatch.merchant})` : 'عملية بنفس القيمة'}
              </div>
            </div>
          ` : ''}

          <div class="space-y-2">
            <div>
              <label class="block text-[9px] font-bold uppercase tracking-wider text-[#9A9CA3] mb-1">Merchant / Reference</label>
              <input type="text" id="candidate-merchant-${c.id}" value="${c.merchant ? c.merchant.replace(/"/g, '&quot;') : (c.bank + ' Transaction')}" class="w-full text-xs font-bold text-[#F3F1EC] bg-[#26272B] border border-[#3A3C42] rounded-xl px-2.5 py-2 outline-none focus:border-[#F5B700]">
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[9px] font-bold uppercase tracking-wider text-[#9A9CA3] mb-1">Assign Card</label>
                <select id="candidate-card-select-${c.id}" onchange="window.onCandidateTypeChanged('${c.id}')" class="w-full text-[11px] font-bold text-[#F3F1EC] bg-[#26272B] border ${needsCardSelection ? 'border-[#F5B700] ring-1 ring-[#F5B700]/20' : 'border-[#3A3C42]'} rounded-xl px-2 py-2 outline-none cursor-pointer">
                  <option value="" ${!c.matchedCardId && !c.matchedAccountId ? 'selected disabled' : ''}>-- اختر الكارت / الحساب --</option>
                  <optgroup label="💳 الكروت (Cards)">
                    ${cards.map(card => {
                      const isSelected = card.id === c.matchedCardId;
                      return `<option value="${card.id}" ${isSelected ? 'selected' : ''}>${card.name} (•••• ${card.last4})</option>`;
                    }).join('')}
                  </optgroup>
                  ${(store.accounts && store.accounts.length > 0) ? `
                    <optgroup label="🏛️ الحسابات البنكية (Bank Accounts)">
                      ${store.accounts.map(acc => {
                        const isSelected = acc.id === c.matchedAccountId && !c.matchedCardId;
                        return `<option value="acc:${acc.id}" ${isSelected ? 'selected' : ''}>${acc.name} (${acc.accountNumberMasked || acc.identifierDigits}) • رصيد: ${formatCurrency(acc.balance || 0)}</option>`;
                      }).join('')}
                    </optgroup>
                  ` : ''}
                </select>
              </div>

              <div>
                <label class="block text-[9px] font-bold uppercase tracking-wider text-[#9A9CA3] mb-1">Category</label>
                <select id="candidate-category-select-${c.id}" class="w-full text-[11px] font-bold text-[#F3F1EC] bg-[#26272B] border border-[#3A3C42] rounded-xl px-2 py-2 outline-none cursor-pointer">
                  <option value="shopping" ${c.suggestedCategory === 'shopping' ? 'selected' : ''}>Shopping</option>
                  <option value="food" ${c.suggestedCategory === 'food' ? 'selected' : ''}>Food & Dining</option>
                  <option value="groceries" ${c.suggestedCategory === 'groceries' ? 'selected' : ''}>Groceries</option>
                  <option value="utilities" ${c.suggestedCategory === 'utilities' ? 'selected' : ''}>Utilities</option>
                  <option value="travel" ${c.suggestedCategory === 'travel' ? 'selected' : ''}>Travel / Fuel</option>
                  <option value="health" ${c.suggestedCategory === 'health' ? 'selected' : ''}>Health</option>
                  <option value="entertainment" ${c.suggestedCategory === 'entertainment' ? 'selected' : ''}>Entertainment</option>
                  <option value="services" ${c.suggestedCategory === 'services' ? 'selected' : ''}>Subscriptions</option>
                  <option value="other" ${!c.suggestedCategory || c.suggestedCategory === 'other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
            </div>

            <!-- Transaction Type Selector -->
            <div class="space-y-1">
              <label class="block text-[9px] font-bold uppercase tracking-wider text-[#9A9CA3]">نوع العملية (Transaction Type)</label>
              <div class="grid grid-cols-3 gap-1.5 p-1 bg-[#16171A] rounded-xl border border-[#3A3C42] text-center">
                <label class="flex items-center justify-center gap-1 cursor-pointer py-1 px-1.5 rounded-lg text-[10px] font-bold text-[#9A9CA3] hover:text-[#F3F1EC]">
                  <input type="radio" name="candidate-type-${c.id}" value="purchase" class="hidden peer" ${c.transactionType === 'purchase' || !c.transactionType ? 'checked' : ''} onchange="window.onCandidateTypeChanged('${c.id}')">
                  <span class="w-full py-1 rounded-md peer-checked:bg-[#F5B700] peer-checked:text-[#111111] transition-all">🛍️ شراء</span>
                </label>
                <label class="flex items-center justify-center gap-1 cursor-pointer py-1 px-1.5 rounded-lg text-[10px] font-bold text-[#9A9CA3] hover:text-[#F3F1EC]">
                  <input type="radio" name="candidate-type-${c.id}" value="transfer" class="hidden peer" ${c.transactionType === 'transfer' ? 'checked' : ''} onchange="window.onCandidateTypeChanged('${c.id}')">
                  <span class="w-full py-1 rounded-md peer-checked:bg-[#F5B700] peer-checked:text-[#111111] transition-all">🔁 تحويل</span>
                </label>
                <label class="flex items-center justify-center gap-1 cursor-pointer py-1 px-1.5 rounded-lg text-[10px] font-bold text-[#9A9CA3] hover:text-[#F3F1EC]">
                  <input type="radio" name="candidate-type-${c.id}" value="withdrawal" class="hidden peer" ${c.transactionType === 'withdrawal' ? 'checked' : ''} onchange="window.onCandidateTypeChanged('${c.id}')">
                  <span class="w-full py-1 rounded-md peer-checked:bg-[#F5B700] peer-checked:text-[#111111] transition-all">🏧 سحب نقدي</span>
                </label>
              </div>
            </div>

            <!-- Warning for unlinked debit withdrawal -->
            <div id="candidate-debit-warn-${c.id}" class="text-[10px] font-bold text-[#E6A8A8] bg-[#3A2020] border border-[#E6A8A8]/30 rounded-lg p-2 ${(() => {
              const matchedCard = c.matchedCardId ? store.getCard(c.matchedCardId) : null;
              return (c.transactionType === 'withdrawal' && matchedCard && matchedCard.cardType === 'debit' && !matchedCard.linkedAccountId && !c.matchedAccountId) ? '' : 'hidden';
            })()}">
              ⚠️ تنبيه: كارت الديبت المختار غير مرتبط بحساب بنكي. سحب الكاش يتطلب اختيار حساب بنكي أو ربط الكارت بحساب أولاً لمنع ضياع الأثر المالي.
            </div>

            <!-- Dynamic Balance Preview -->
            ${(() => {
              let candAcc = null;
              if (c.matchedAccountId) {
                candAcc = store.getAccount(c.matchedAccountId);
              } else if (c.matchedCardId) {
                const mc = store.getCard(c.matchedCardId);
                if (mc && mc.cardType === 'debit' && mc.linkedAccountId) {
                  candAcc = store.getAccount(mc.linkedAccountId);
                }
              }
              if (!candAcc) return '';
              const curBal = candAcc.balance || 0;
              const isInc = c.direction === 'income' || c.type === 'income';
              const expAfter = isInc ? curBal + c.amount : curBal - c.amount;
              const isNeg = expAfter < 0;
              return `
                <div id="candidate-balance-box-${c.id}" class="p-2 rounded-xl bg-[#26272B] border ${isNeg ? 'border-[#E6A8A8]/40 text-[#E6A8A8]' : 'border-[#3A3C42] text-[#F3F1EC]'} space-y-0.5">
                  <div class="flex items-center justify-between text-[10px] font-bold">
                    <span>الرصيد قبل (${candAcc.name}): ${formatCurrency(curBal)}</span>
                    <span class="font-mono ${isNeg ? 'text-[#E6A8A8] font-black' : ''}">بعد العملية: ${formatCurrency(expAfter)}</span>
                  </div>
                  ${isNeg ? `
                    <div class="text-[10px] font-bold text-[#E6A8A8] flex items-center gap-1">
                      <span>⚠️ تحذير: اعتماد هذه العملية سيجعل رصيد الحساب بالسالب!</span>
                    </div>
                  ` : ''}
                </div>
              `;
            })()}

            <div class="text-[9px] text-[#9A9CA3] flex items-center justify-between px-0.5 pt-0.5">
              <span>Date: ${c.transactionTime || new Date(c.receiptTime).toLocaleString()}</span>
              <span>Ref: ${(c.fingerprint || '').slice(0, 10)}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2 border-t border-[#2F3136]">
            <button type="button" onclick="window.approveSmsCandidate('${c.id}')" class="flex-1 py-2 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] text-xs font-bold rounded-xl active-press transition-all flex items-center justify-center gap-1 shadow-md">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              <span>${t('approve')}</span>
            </button>
            <button type="button" onclick="window.rejectSmsCandidate('${c.id}')" class="py-2 px-3 bg-[#26272B] hover:bg-[#3A3C42] text-[#9A9CA3] hover:text-[#E6A8A8] text-xs font-bold rounded-xl active-press transition-all flex items-center justify-center gap-1">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              <span>${t('reject')}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    listEls.forEach(el => {
      el.innerHTML = candidatesHtml;
      if (window.lucide) {
        try { lucide.createIcons({ root: el }); } catch (e) {}
      }
    });
  }

  window.openSmsReviewInbox = () => {
    openModal('smsReview');
    renderSmsCandidatesList();
  };

  window.onCandidateTypeChanged = (candidateId) => {
    const cardSelect = document.getElementById(`candidate-card-select-${candidateId}`);
    const typeRadio = document.querySelector(`input[name="candidate-type-${candidateId}"]:checked`);
    const warnEl = document.getElementById(`candidate-debit-warn-${candidateId}`);
    if (!typeRadio || !warnEl) return;

    const chosenType = typeRadio.value;
    const rawVal = cardSelect ? cardSelect.value : '';
    let isDebitUnlinked = false;

    if (rawVal && !rawVal.startsWith('acc:')) {
      const card = store.getCard(rawVal);
      if (card && card.cardType === 'debit' && !card.linkedAccountId) {
        isDebitUnlinked = true;
      }
    }

    if (chosenType === 'withdrawal' && isDebitUnlinked) {
      warnEl.classList.remove('hidden');
    } else {
      warnEl.classList.add('hidden');
    }
  };

  window.approveSmsCandidate = async (candidateId) => {
    if (!window.BankSmsEngine) return;
    const cardSelect = document.getElementById(`candidate-card-select-${candidateId}`);
    const merchInput = document.getElementById(`candidate-merchant-${candidateId}`);
    const catSelect = document.getElementById(`candidate-category-select-${candidateId}`);

    const rawVal = cardSelect ? cardSelect.value : null;
    const merchant = merchInput ? merchInput.value : '';
    const category = catSelect ? catSelect.value : 'other';

    if (!rawVal || rawVal === '') {
      showToast('يرجى اختيار الكارت أو الحساب أولاً لاعتماد العملية', 'error');
      if (cardSelect) cardSelect.focus();
      return;
    }

    let cardId = null;
    let accountId = null;
    if (rawVal.startsWith('acc:')) {
      accountId = rawVal.replace('acc:', '');
    } else {
      cardId = rawVal;
      const storeRef = window.walletStore || window.store;
      const card = storeRef ? storeRef.getCard(cardId) : null;
      if (card && card.linkedAccountId) {
        accountId = card.linkedAccountId;
      }
    }

    const candidate = window.BankSmsEngine.pendingCandidates.find(item => item.id === candidateId);
    const store = window.walletStore || window.store;
    const selectedCard = cardId ? store.getCard(cardId) : null;
    const selectedAccount = accountId ? store.getAccount(accountId) : null;

    // Item 6: Read user-selected transaction type
    const typeRadio = document.querySelector(`input[name="candidate-type-${candidateId}"]:checked`);
    const chosenType = typeRadio ? typeRadio.value : (candidate ? candidate.transactionType : 'purchase');

    // Item 4: Block debit cash withdrawal without a linked account
    if (chosenType === 'withdrawal' && selectedCard && selectedCard.cardType === 'debit' && !accountId) {
      showToast('لا يمكن اعتماد عملية سحب نقدي لكارت خصم غير مرتبط بحساب بنكي. يرجى اختيار حساب بنكي أو ربط الكارت بحساب أولاً.', 'error');
      const warn = document.getElementById(`candidate-debit-warn-${candidateId}`);
      if (warn) warn.classList.remove('hidden');
      return;
    }

    let isManualAssignment = false;
    if (candidate) {
      const candidateDigits = (candidate.identifierDigits || candidate.cardSuffix || '').trim();
      const targetDigits = selectedCard ? (selectedCard.last4 || '').trim() : (selectedAccount ? (selectedAccount.identifierDigits || '').trim() : '');
      const hasDigitMismatch = candidateDigits && targetDigits && candidateDigits !== targetDigits;

      const candidateBank = (candidate.bank || '').toUpperCase().trim();
      const targetBankId = selectedCard ? selectedCard.bankId : (selectedAccount ? selectedAccount.bankId : null);
      const targetBankObj = targetBankId ? store.getBank(targetBankId) : null;
      const targetBankName = (targetBankObj ? targetBankObj.name : '').toUpperCase().trim();
      const hasBankMismatch = candidateBank && targetBankName &&
        !targetBankName.includes(candidateBank) && !candidateBank.includes(targetBankName) &&
        candidateBank !== 'BANK';

      if (hasDigitMismatch || hasBankMismatch) {
        const mismatchDetails = [];
        if (hasBankMismatch) mismatchDetails.push(`البنك: ${candidate.bank} مقابل ${targetBankObj ? targetBankObj.name : 'الكارت/الحساب'}`);
        if (hasDigitMismatch) mismatchDetails.push(`الأرقام: ****${candidateDigits} مقابل ****${targetDigits}`);

        const confirmMsg = `تنبيه: بيانات الرسالة تختلف عن الكارت/الحساب المختار!\n(${mismatchDetails.join(' | ')})\n\nهل تريد تعيين هذه العملية يدوياً؟`;
        if (typeof confirm === 'function' && !confirm(confirmMsg)) {
          return;
        }
        isManualAssignment = true;
      }
    }

    // Negative Balance Confirmation (Item 3)
    if (selectedAccount && candidate) {
      const isIncome = candidate.direction === 'income' || candidate.type === 'income';
      if (!isIncome) {
        const currentBal = selectedAccount.balance || 0;
        const expectedAfter = currentBal - candidate.amount;
        if (expectedAfter < 0) {
          const confirmMsg = `تحذير: اعتماد هذه العملية سيجعل رصيد الحساب "${selectedAccount.name}" بالسالب!\n\n- الرصيد الحالي: ${formatCurrency(currentBal)}\n- الرصيد المتوقع بعد الاعتماد: ${formatCurrency(expectedAfter)}\n\nهل تريد بالتأكيد اعتماد هذه العملية؟`;
          if (typeof confirm === 'function' && !confirm(confirmMsg)) {
            return;
          }
        }
      }
    }

    const res = await window.BankSmsEngine.approveCandidate(candidateId, {
      cardId,
      accountId,
      merchant,
      category,
      transactionType: chosenType,
      isManualAssignment
    });
    if (res.success) {
      showToast(`تم استيراد ${res.transaction.merchant} (${formatCurrency(res.transaction.amount)})`, 'success');
      renderSmsCandidatesList();
      renderCurrentView();
    } else {
      showToast(res.error || 'Failed to approve transaction', 'error');
    }
  };

  window.openAddAccountPrompt = (bankId, digits, position) => {
    closeModal('smsReview');
    setTimeout(() => {
      populateCardBankDropdown(bankId);
      const accRadio = document.getElementById('type-account');
      if (accRadio) {
        accRadio.checked = true;
        accRadio.dispatchEvent(new Event('change'));
      }
      const digitsInput = document.getElementById('card-last4');
      if (digitsInput && digits) {
        digitsInput.value = digits;
      }
      const nameInput = document.getElementById('card-name');
      if (nameInput) {
        nameInput.value = 'Bank Account';
      }
      if (position) {
        const posRadio = document.querySelector(`input[name="card-digits-position"][value="${position}"]`);
        if (posRadio) posRadio.checked = true;
      }
      openModal('card');
    }, 200);
  };

  window.confirmDeleteAccount = (accId) => {
    const acc = store.getAccount(accId);
    if (!acc) return;
    if (confirm(`هل أنت متأكد من حذف الحساب "${acc.name}" (${acc.accountNumberMasked})؟`)) {
      store.deleteAccount(accId);
      showToast(`تم حذف الحساب "${acc.name}"`, 'info');
      renderBanksView();
    }
  };

  window.openEditAccountModal = (accId) => {
    const acc = store.getAccount(accId);
    if (!acc) return;
    const bank = store.getBank(acc.bankId);

    const idInput = document.getElementById('edit-account-id');
    const nameInput = document.getElementById('edit-account-name');
    const balanceInput = document.getElementById('edit-account-balance');
    const notesInput = document.getElementById('edit-account-notes');
    const headerEl = document.getElementById('edit-account-bank-header');

    if (idInput) idInput.value = acc.id;
    if (nameInput) nameInput.value = acc.name || '';
    if (balanceInput) balanceInput.value = (acc.balance !== undefined && acc.balance !== null) ? acc.balance : 0;
    if (notesInput) notesInput.value = '';
    if (headerEl) headerEl.textContent = `${bank ? bank.name : 'بنك'} • ${acc.accountNumberMasked || acc.identifierDigits}`;

    openModal('editAccount');
  };

  window.openEditCardModal = (cardId) => {
    const card = store.getCard(cardId);
    if (!card) return;
    const bank = store.getBank(card.bankId);

    const idInput = document.getElementById('edit-card-id');
    const nameInput = document.getElementById('edit-card-name');
    const linkedSelect = document.getElementById('edit-card-linked-account');
    const linkedSection = document.getElementById('edit-card-linked-section');
    const targetInput = document.getElementById('edit-card-target');
    const creditLimitInput = document.getElementById('edit-card-credit-limit');
    const creditLimitSection = document.getElementById('edit-card-credit-limit-section');
    const headerEl = document.getElementById('edit-card-bank-header');

    if (idInput) idInput.value = card.id;
    if (nameInput) nameInput.value = card.name || '';
    if (targetInput) targetInput.value = (card.monthlyTarget !== undefined && card.monthlyTarget !== null) ? card.monthlyTarget : '';
    if (headerEl) headerEl.textContent = `${bank ? bank.name : 'بنك'} • ${card.cardType.toUpperCase()} (•••• ${card.last4})`;

    if (card.cardType === 'debit') {
      if (linkedSection) linkedSection.classList.remove('hidden');
      if (linkedSelect) {
        const accs = card.bankId ? store.getAccountsForBank(card.bankId) : store.accounts;
        linkedSelect.innerHTML = '<option value="">-- بدون حساب مرتبط (كارت مستقل) --</option>' +
          accs.map(a => `<option value="${a.id}" ${a.id === card.linkedAccountId ? 'selected' : ''}>${a.name} (${a.accountNumberMasked || a.identifierDigits})</option>`).join('');
      }
    } else {
      if (linkedSection) linkedSection.classList.add('hidden');
    }

    if (card.cardType === 'credit') {
      if (creditLimitSection) creditLimitSection.classList.remove('hidden');
      if (creditLimitInput) creditLimitInput.value = (card.creditLimit !== undefined && card.creditLimit !== null) ? card.creditLimit : '';
    } else {
      if (creditLimitSection) creditLimitSection.classList.add('hidden');
    }

    openModal('editCard');
  };

  window.openAddAccountForBank = (bankId) => {
    populateCardBankDropdown(bankId);
    const accRadio = document.getElementById('type-account');
    if (accRadio) {
      accRadio.checked = true;
      accRadio.dispatchEvent(new Event('change'));
    }
    openModal('card');
  };

  window.rejectSmsCandidate = async (candidateId) => {
    if (!window.BankSmsEngine) return;
    await window.BankSmsEngine.rejectCandidate(candidateId);
    showToast('Transaction discarded from queue', 'info');
    renderSmsCandidatesList();
    renderCurrentView();
  };

  window.approveAllVerifiedSms = async () => {
    if (!window.BankSmsEngine) return;
    const approved = await window.BankSmsEngine.approveAllVerified();
    if (approved.length > 0) {
      showToast(`Imported ${approved.length} verified transactions!`, 'success');
      renderSmsCandidatesList();
      renderCurrentView();
    } else {
      showToast('No auto-matched transactions. Please select cards individually.', 'info');
    }
  };

  window.clearAllPendingSms = async () => {
    if (!window.BankSmsEngine) return;
    if (confirm('Clear all pending transactions from inbox?')) {
      await window.BankSmsEngine.clearAllPending();
      showToast('SMS review inbox cleared', 'info');
      renderSmsCandidatesList();
      renderCurrentView();
    }
  };

  window.toggleSmsImport = async (enabled) => {
    if (!window.BankSmsEngine) return;
    await window.BankSmsEngine.setSmsImportEnabled(enabled);
    showToast(enabled ? 'Bank SMS Import Enabled' : 'Bank SMS Import Disabled', enabled ? 'success' : 'info');
    renderCurrentView();
  };

  window.requestSmsPermission = async () => {
    if (!window.BankSmsEngine) return;
    const res = await window.BankSmsEngine.requestPermission();
    if (res.granted) {
      showToast('RECEIVE_SMS permission granted!', 'success');
    } else {
      showToast('SMS permission denied or restricted in Android settings', 'error');
    }
    renderCurrentView();
  };

  window.addBankSender = async () => {
    const input = document.getElementById('new-bank-sender-input');
    if (!input || !input.value.trim()) return;
    const sender = input.value.trim().toUpperCase();
    if (window.BankSmsEngine) {
      const current = window.BankSmsEngine.allowlist || [];
      if (!current.includes(sender)) {
        await window.BankSmsEngine.updateAllowlist([...current, sender]);
        showToast(`Added ${sender} to allowed senders`, 'success');
        input.value = '';
        renderCurrentView();
      }
    }
  };

  window.removeBankSender = async (sender) => {
    if (window.BankSmsEngine) {
      const current = window.BankSmsEngine.allowlist || [];
      const updated = current.filter(s => s !== sender);
      await window.BankSmsEngine.updateAllowlist(updated);
      showToast(`Removed ${sender}`, 'info');
      renderCurrentView();
    }
  };

  window.simulatePresetSms = async () => {
    const select = document.getElementById('sms-simulator-select');
    if (!select || !window.BankSmsEngine) return;

    const PRESETS = [
      { sender: 'CIB', body: 'Dear Customer, purchase of EGP 1,250.50 at Amazon Egypt with card ending in 8492 on 24/11/2026 14:30. Available limit EGP 23,749.50.' },
      { sender: 'HSBC', body: 'HSBC Alert: Debited EGP 450.00 for POS transaction at Starbucks Arkan from card **5521 on 24/11/2026.' },
      { sender: 'NBE', body: 'تم خصم مبلغ ١,٤٥٠.٠٠ ج.م من بطاقتكم المنتهية برقم ٩٠١١ لدى فودافون مصر بتاريخ ٢٠٢٦/١١/٢٤.' },
      { sender: 'Banque Misr', body: 'عملية شراء بمبلغ 850.00 جنيه لدى كارفور المعادي باستخدام بطاقة رقم ...4120 بتاريخ 2026/11/24.' },
      { sender: 'CIB', body: 'Refund of EGP 600.00 received from Amazon Egypt to card ending in 8492 on 24/11/2026.' },
      { sender: 'CIB', body: 'Your CIB OTP is 492011 for EGP 500 purchase. Valid for 5 mins. Do not share.' }
    ];

    const idx = parseInt(select.value, 10);
    const chosen = PRESETS[idx] || PRESETS[0];

    const res = await window.BankSmsEngine.simulateTestSms(chosen.sender, chosen.body);
    if (res.parsed) {
      showToast(`Parsed: ${res.candidate.bank} ${res.candidate.amount} ${res.candidate.currency}! Opening inbox...`, 'success');
      setTimeout(() => window.openSmsReviewInbox(), 300);
    } else {
      showToast(`Message safely rejected: ${res.reason || 'Not a valid transaction'}`, 'info');
    }
    renderCurrentView();
  };

  // ==========================================
  // SMS DIAGNOSTICS & LIVE STATUS CONTROLLER
  // ==========================================
  window.openSmsDiagnostics = async () => {
    openModal('smsDiagnostics');
    if (window.BankSmsEngine) {
      await window.BankSmsEngine.refreshPermissionStatus();
      await window.BankSmsEngine.refreshSettings();
    }
    renderSmsDiagnosticsContent();
  };

  window.refreshDiagnostics = async () => {
    if (window.BankSmsEngine) {
      await window.BankSmsEngine.refreshPermissionStatus();
      await window.BankSmsEngine.refreshSettings();
      await window.BankSmsEngine.fetchPendingTransactions();
    }
    renderSmsDiagnosticsContent();
    showToast('تم تحديث بيانات التشخيص', 'info');
  };

  window.requestSmsReceivePermission = async () => {
    if (!window.BankSmsEngine) return;
    const res = await window.BankSmsEngine.requestPermission();
    if (res.granted) {
      showToast('تم منح صلاحية RECEIVE_SMS بنجاح!', 'success');
    } else {
      showToast('تم رفض الصلاحية أو تم تقييدها في أندرويد', 'error');
    }
    await window.BankSmsEngine.refreshPermissionStatus();
    renderSmsDiagnosticsContent();
    renderCurrentView();
  };

  window.openAppSystemSettings = async () => {
    if (window.BankSmsEngine && window.BankSmsEngine.openAppSettings) {
      await window.BankSmsEngine.openAppSettings();
    } else {
      showToast('افتح إعدادات الهاتف -> التطبيقات -> ApexWallet', 'info');
    }
  };

  window.openBatteryOptimizationSettings = async () => {
    if (window.BankSmsEngine && window.BankSmsEngine.openBatterySettings) {
      await window.BankSmsEngine.openBatterySettings();
    } else {
      showToast('افتح إعدادات البطارية واختر "بدون قيود"', 'info');
    }
  };

  async function renderSmsDiagnosticsContent() {
    const container = document.getElementById('sms-diagnostics-content');
    if (!container) return;

    const stats = (window.BankSmsEngine && window.BankSmsEngine.stats) || {};
    const receiveGranted = stats.receiveSmsGranted || false;
    const readGranted = stats.readSmsGranted || false;
    const isEnabled = stats.isSmsImportEnabled || false;
    const lastBroadcast = stats.lastBroadcastAt ? new Date(stats.lastBroadcastAt).toLocaleTimeString() + ' (' + new Date(stats.lastBroadcastAt).toLocaleDateString() + ')' : 'لم يصل أي بث من أندرويد حتى الآن';
    const lastSender = stats.lastBroadcastSender || '';
    const queueCount = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates.length) || 0;
    const queueCapacity = stats.queueCapacity || 100;
    const isQueueFull = queueCount >= queueCapacity;
    const isQueueNearFull = queueCount >= 80 && !isQueueFull;
    const rejectedCapacity = stats.rejectedCapacityCount || 0;

    container.innerHTML = `
      <div class="space-y-3">
        <!-- Status Card 1: Permissions -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
              <i data-lucide="shield" class="w-3.5 h-3.5 text-indigo-600"></i>
              صلاحية الاستقبال (RECEIVE_SMS)
            </span>
            ${receiveGranted
              ? '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ممنوحة بنجاح ✅</span>'
              : '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">مرفوضة / مقيدة ❌</span>'}
          </div>

          <div class="flex items-center justify-between pt-1 border-t border-slate-200/60">
            <span class="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
              <i data-lucide="book-open" class="w-3.5 h-3.5 text-blue-600"></i>
              صلاحية الرسائل القديمة (READ_SMS)
            </span>
            ${readGranted
              ? '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">ممنوحة ✅</span>'
              : '<span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">غير مفعلة ⏸️</span>'}
          </div>

          ${!receiveGranted ? `
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900 space-y-1.5">
              <p class="font-bold">⚠️ تنبيه الصلاحيات المقيدة في أندرويد الحديث:</p>
              <p class="text-[10px] leading-relaxed">إذا كان زر تفعيل الصلاحية رمادياً وظهر تنبيه "Restricted setting / تم تقييد هذا الإعداد"، اضغط على "إعدادات التطبيق" ثم اضغط الثلاث نقاط أعلى اليمين واختر <b>"السماح بالإعدادات المقيدة" (Allow restricted settings)</b>.</p>
              <div class="flex gap-2 pt-1">
                <button type="button" onclick="window.requestSmsReceivePermission()" class="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[10px] active-press">طلب الصلاحية مجدداً</button>
                <button type="button" onclick="window.openAppSystemSettings()" class="py-1.5 px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-[10px] active-press">إعدادات التطبيق</button>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Status Card 2: Engine & Receiver Real-time State -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-slate-600 font-bold">مفتاح استيراد SMS:</span>
            <span class="font-bold ${isEnabled ? 'text-emerald-600' : 'text-slate-400'}">${isEnabled ? 'مفعل 🟢' : 'متوقف ⚪'}</span>
          </div>

          <div class="flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span class="text-slate-600 font-bold">تشفير طابور الرسائل (SMS Vault):</span>
            <span class="font-bold text-slate-800">${stats.isKeystoreProtected ? 'Hardware Keystore AES-256 🔒' : 'ذاكرة آمنة 🛡️'}</span>
          </div>

          <div class="flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span class="text-slate-600 font-bold">سعة قائمة الانتظار المشفرة:</span>
            <span class="font-bold font-mono ${isQueueFull ? 'text-rose-600' : (isQueueNearFull ? 'text-amber-600' : 'text-indigo-700')}">
              ${queueCount} من ${queueCapacity} عنصر
            </span>
          </div>

          <!-- Capacity Alert Banners -->
          ${isQueueFull ? `
            <div class="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-[10px] text-rose-900 space-y-1">
              <div class="font-bold flex items-center gap-1 text-rose-950">
                <i data-lucide="alert-octagon" class="w-3.5 h-3.5 text-rose-600"></i>
                <span>القائمة ممتلئة تماماً (100 / 100)</span>
              </div>
              <p class="leading-relaxed">
                تم إيقاف إضافة رسائل جديدة مؤقتاً لحماية رسائلك غير المراجعة من الحذف الصامت. الرسائل التي تصل الآن لا تُسجل كمكررة وستتمكن من جلبها عبر "استيراد الرسائل القديمة" فور اعتماد أو تفريغ بعض العمليات.
              </p>
            </div>
          ` : (isQueueNearFull ? `
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[10px] text-amber-900 space-y-0.5">
              <div class="font-bold flex items-center gap-1 text-amber-950">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-600"></i>
                <span>تنبيه: القائمة تقترب من الامتلاء (${queueCount} / ${queueCapacity})</span>
              </div>
              <p>يُفضل مراجعة بعض العمليات لتفريغ مساحة وضمان استقبال الرسائل اللاسلكية فوراً.</p>
            </div>
          ` : '')}

          ${rejectedCapacity > 0 ? `
            <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-2 text-[10px] text-indigo-900">
              وصلت <b>${rejectedCapacity}</b> رسالة أثناء امتلاء القائمة. يمكنك استيرادها الآن عبر فحص الرسائل القديمة بعد مراجعة الصندوق الحالي.
            </div>
          ` : ''}

          <div class="border-t border-slate-100 pt-1.5 space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-slate-600 font-bold">آخر بث (Broadcast) وصل للتطبيق:</span>
              <span class="font-bold text-[10px] text-slate-800 font-mono">${lastBroadcast}</span>
            </div>
            ${lastSender ? `<div class="text-[10px] text-slate-500 text-right">المصدر: <b class="text-slate-700">${lastSender}</b></div>` : ''}
          </div>
        </div>

        <!-- Real Telephony Verification Protocol Card -->
        <div class="bg-slate-100/80 border border-slate-200 rounded-2xl p-3 space-y-1.5 text-[10px] text-slate-600 leading-relaxed">
          <div class="font-bold text-slate-900 flex items-center gap-1">
            <i data-lucide="radio" class="w-3.5 h-3.5 text-indigo-600"></i>
            <span>دليل التحقق الواقعي على هاتفك (On-Device Test):</span>
          </div>
          <p>
            اختبارات Node.js تؤكد سلامة خوارزميات النصوص والتكرار، ولكن لإثبات مسار الاستقبال الحقيقي كاملاً على الجهاز:
          </p>
          <ol class="list-decimal list-inside space-y-0.5 text-slate-700 font-medium">
            <li>تأكد من ظهور صلاحية RECEIVE_SMS بلون أخضر أعلاه.</li>
            <li>تأكد من ضبط البطارية على "بدون قيود" (Unrestricted).</li>
            <li>أرسل أو انتظر رسالة بنكية حقيقية من أحد بنوكك المعتمدة.</li>
            <li>تحقق من تحديث وقت "آخر بث وصل للتطبيق" بالثواني الحقيقية.</li>
            <li>افتح صندوق المراجعة واعتمد العملية لتظهر في رصيد محفظتك.</li>
          </ol>
        </div>

        <!-- Battery Manager Warning Note -->
        <div class="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 space-y-1.5">
          <div class="flex items-center gap-1.5 font-bold text-blue-900 text-[11px]">
            <i data-lucide="battery-charging" class="w-3.5 h-3.5 text-blue-600"></i>
            <span>إدارة البطارية في الخلفية (Background Receiver)</span>
          </div>
          <p class="text-[10px] text-blue-800 leading-relaxed">
            لضمان استلام رسائل البنوك فوراً والشاشة مقفلة أو التطبيق مغلق، تأكد من ضبط إعدادات البطارية للتطبيق على <b>"بدون قيود" (Unrestricted)</b>.
          </p>
          <button type="button" onclick="window.openBatteryOptimizationSettings()" class="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[10px] active-press transition-all">
            فتح إعدادات توفير البطارية
          </button>
        </div>

        <!-- Quick Actions in Diagnostics -->
        <div class="pt-1 flex gap-2">
          <button type="button" onclick="window.openHistoricalSmsImport()" class="flex-1 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 active-press">
            <i data-lucide="history" class="w-3.5 h-3.5"></i>
            <span>استيراد الرسائل القديمة</span>
          </button>
          <button type="button" onclick="window.refreshDiagnostics()" class="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] active-press">
            تحديث الحالة
          </button>
        </div>
      </div>
    `;

    if (window.lucide) {
      try { lucide.createIcons({ root: container }); } catch (e) {}
    }
  }

  // ==========================================
  // HISTORICAL BANK SMS IMPORT CONTROLLER
  // ==========================================
  let historicalState = {
    days: 30,
    isScanning: false,
    scanResult: null
  };

  window.openHistoricalSmsImport = async () => {
    openModal('smsHistorical');
    if (window.BankSmsEngine) {
      await window.BankSmsEngine.refreshPermissionStatus();
    }
    renderSmsHistoricalContent(historicalState);
  };

  window.selectHistoricalDays = (days) => {
    historicalState.days = days;
    historicalState.scanResult = null;
    renderSmsHistoricalContent(historicalState);
  };

  window.requestReadSmsAndStart = async () => {
    if (!window.BankSmsEngine) return;
    const res = await window.BankSmsEngine.requestReadSmsPermission();
    if (res.granted) {
      showToast('تم منح صلاحية قراءة الرسائل بنجاح!', 'success');
      historicalState.scanResult = null;
      renderSmsHistoricalContent(historicalState);
    } else {
      showToast('تم رفض الصلاحية أو تقييدها في إعدادات أندرويد', 'error');
    }
  };

  window.startHistoricalScan = async () => {
    if (!window.BankSmsEngine || historicalState.isScanning) return;
    historicalState.isScanning = true;
    historicalState.scanResult = null;
    renderSmsHistoricalContent(historicalState);

    const res = await window.BankSmsEngine.queryHistoricalSmsBatch({
      days: historicalState.days,
      limit: 20
    });

    historicalState.isScanning = false;
    if (res.success) {
      historicalState.scanResult = res;
      showToast(`تم فحص الدفعة: عُثر على ${res.addedCount} عملية جديدة!`, 'success');
    } else {
      showToast(res.error || 'فشل فحص الرسائل القديمة', 'error');
    }
    renderSmsHistoricalContent(historicalState);
  };

  window.fetchNextHistoricalBatch = async () => {
    if (!window.BankSmsEngine || historicalState.isScanning) return;
    historicalState.isScanning = true;
    renderSmsHistoricalContent(historicalState);

    const res = await window.BankSmsEngine.queryHistoricalSmsBatch({
      days: historicalState.days,
      limit: 20
    });

    historicalState.isScanning = false;
    if (res.success) {
      historicalState.scanResult = res;
      showToast(res.addedCount > 0 ? `تم جلب دفعة جديدة: ${res.addedCount} عملية!` : 'لا توجد رسائل إضافية غير مراجعة.', 'info');
    } else {
      showToast(res.error || 'فشل فحص الدفعة التالية', 'error');
    }
    renderSmsHistoricalContent(historicalState);
  };

  async function renderSmsHistoricalContent(state = {}) {
    const container = document.getElementById('sms-historical-content');
    if (!container) return;

    const readGranted = window.BankSmsEngine && window.BankSmsEngine.stats.readSmsGranted;

    if (!readGranted) {
      container.innerHTML = `
        <div class="py-4 space-y-3 text-center">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <i data-lucide="lock" class="w-6 h-6"></i>
          </div>
          <div class="space-y-1">
            <h4 class="font-extrabold text-sm text-slate-900">مطلوب صلاحية قراءة الرسائل (READ_SMS)</h4>
            <p class="text-[11px] text-slate-500 max-w-[260px] mx-auto leading-relaxed">
              لاستيراد العمليات البنكية السابقة من صندوق الرسائل، يحتاج التطبيق لموافقتك الصريحة لقراءة الرسائل البنكية فقط محلياً على جهازك.
            </p>
          </div>

          <div class="pt-2 space-y-2">
            <button type="button" onclick="window.requestReadSmsAndStart()" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs active-press shadow-xs">
              الموافقة ومنح الصلاحية
            </button>
            <p class="text-[9px] text-slate-400">يمكنك إلغاء الصلاحية في أي وقت من إعدادات الهاتف.</p>
          </div>
        </div>
      `;
      if (window.lucide) try { lucide.createIcons({ root: container }); } catch (e) {}
      return;
    }

    const days = state.days || 30;
    const isScanning = state.isScanning || false;
    const scanResult = state.scanResult || null;

    container.innerHTML = `
      <div class="space-y-3.5">
        <!-- Date Range Selection -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-800">اختر الفترة الزمنية للاستيراد:</label>
          <div class="grid grid-cols-3 gap-2">
            <button type="button" onclick="window.selectHistoricalDays(30)" class="py-2 rounded-xl text-xs font-bold border transition-all ${days === 30 ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' : 'bg-slate-50 text-slate-700 border-slate-200'}">آخر شهر</button>
            <button type="button" onclick="window.selectHistoricalDays(90)" class="py-2 rounded-xl text-xs font-bold border transition-all ${days === 90 ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' : 'bg-slate-50 text-slate-700 border-slate-200'}">آخر ٣ شهور</button>
            <button type="button" onclick="window.selectHistoricalDays(365)" class="py-2 rounded-xl text-xs font-bold border transition-all ${days === 365 ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' : 'bg-slate-50 text-slate-700 border-slate-200'}">آخر سنة</button>
          </div>
        </div>

        <!-- Safety Notice -->
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] text-slate-600 space-y-1">
          <div class="font-bold text-slate-900 flex items-center gap-1">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600"></i>
            <span>حماية الخصوصية ومنع فقد البيانات:</span>
          </div>
          <ul class="list-disc list-inside space-y-0.5 text-slate-500">
            <li>يتم فحص المرسلين الموجودين في قائمة البنوك المعتمدة فقط.</li>
            <li>استبعاد أي رسائل OTP أو أكواد تفعيل أو إعلانات فوراً.</li>
            <li>جلب دفعات آمنة (٢٠ عملية لكل دفعة) مع حفظها ضد قفل التطبيق.</li>
            <li>المراجعة اليدوية إلزامية قبل احتساب أي عملية في الأرصدة.</li>
          </ul>
        </div>

        ${scanResult ? `
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-extrabold text-emerald-900 text-xs">نتائج فحص الدفعة:</span>
              <span class="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full font-bold text-[10px]">
                عُثر على ${scanResult.addedCount} عملية جديدة
              </span>
            </div>
            <div class="text-[10px] text-emerald-800 space-y-0.5 font-mono">
              <div>المستبعد (OTP / إعلانات): ${scanResult.rejectedCount}</div>
              <div>المكرر المرفوض تلقائياً: ${scanResult.duplicateCount}</div>
              <div>حالة الفحص: ${scanResult.hasMore ? 'توجد رسائل إضافية في هذه الفترة' : 'اكتمل فحص كافة الرسائل'}</div>
            </div>
            <div class="pt-1 flex gap-2">
              <button type="button" onclick="window.openSmsReviewInbox()" class="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs active-press">
                فتح صندوق المراجعة (${(window.BankSmsEngine && window.BankSmsEngine.pendingCandidates.length) || 0})
              </button>
              ${scanResult.hasMore ? `
                <button type="button" onclick="window.fetchNextHistoricalBatch()" class="py-1.5 px-3 bg-white border border-emerald-300 text-emerald-900 rounded-lg font-bold text-xs active-press">
                  فحص الدفعة التالية (الـ 20 التالية)
                </button>
              ` : `
                <span class="px-2.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[10px] flex items-center">
                  اكتمل الاستيراد ✅
                </span>
              `}
            </div>
          </div>
        ` : ''}

        <!-- Start Import Action Button -->
        <button type="button" id="btn-start-historical-scan" onclick="window.startHistoricalScan()" ${isScanning ? 'disabled' : ''} class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 active-press transition-all shadow-xs">
          ${isScanning ? '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>جاري الفحص الدقيق...</span>' : '<i data-lucide="scan" class="w-4 h-4"></i><span>بدء فحص واستيراد الدفعة الأولى</span>'}
        </button>
      </div>
    `;

    if (window.lucide) {
      try { lucide.createIcons({ root: container }); } catch (e) {}
    }
  }

  // --- Vault Backup & Restore Migration ---
  window.exportEncryptedVaultBackup = async () => {
    const rawVault = localStorage.getItem('apexwallet_security_vault_v1');
    const userStore = localStorage.getItem('apexwallet_user_vault_v1');
    const currency = localStorage.getItem('wallet_currency') || 'EGP';

    const rawData = {
      app: 'ApexWallet',
      version: '1.4.8',
      securityVault: rawVault ? JSON.parse(rawVault) : null,
      userStore: userStore ? JSON.parse(userStore) : null,
      currency: currency
    };

    const passphrase = prompt(
      'أدخل عبارة مرور قوية (Passphrase) مخصصة لتشفير النسخة الاحتياطية (AES-256-GCM مع 100,000 دورة PBKDF2).\n\n• يجب ألا تقل عبارة المرور عن 8 أحرف.\n• يجب أن تكون مختلفة تماماً عن رمز PIN المكون من 4 أرقام.\n• اترك الحقل فارغاً واضغط حسناً فقط إذا كنت ترغب في تصدير نسخة غير مشفرة:'
    );

    if (passphrase === null) {
      // User cancelled prompt
      return;
    }

    const trimmedPass = passphrase.trim();
    let isEncrypted = false;

    if (trimmedPass.length > 0) {
      // Enforce strength requirements: min 8 characters, not a 4-digit PIN
      if (trimmedPass.length < 8 || /^\d{4}$/.test(trimmedPass)) {
        alert('عبارة المرور ضعيفة جداً! لحماية بياناتك المالية، يجب أن تكون 8 أحرف على الأقل ولا يمكن استخدام رمز PIN المكون من 4 أرقام.');
        return;
      }
      isEncrypted = true;
    } else {
      // Explicit confirmation for plaintext export
      const confirmPlaintext = confirm(
        '⚠️ تحذير أمني هام:\n\nلم تدخل عبارة مرور. هل ترغب بالتأكيد في تصدير نسخة احتياطية غير مشفرة (نص صريح)؟\n\nتنبيه: النسخة غير المشفرة تحتوي على بياناتك المالية مكشوفة لأي شخص يصل للملف.'
      );
      if (!confirmPlaintext) {
        return;
      }
      isEncrypted = false;
    }

    try {
      let backupPayload;
      const secEngine = window.WalletSecurity || window.walletSecurity;

      if (secEngine && typeof secEngine.encryptBackup === 'function') {
        backupPayload = await secEngine.encryptBackup(rawData, isEncrypted ? trimmedPass : '');
      } else {
        backupPayload = {
          app: 'ApexWallet',
          version: '1.4.8',
          encrypted: false,
          exportedAt: new Date().toISOString(),
          data: rawData
        };
      }

      const dateStr = new Date().toISOString().split('T')[0];
      const filename = isEncrypted
        ? `apexwallet_backup_encrypted_${dateStr}.json`
        : `apexwallet_backup_UNENCRYPTED_PLAINTEXT_${dateStr}.json`;

      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (isEncrypted) {
        showToast('تم تصدير النسخة الاحتياطية بنجاح مشفرة بعبارة المرور الخاصة بك (AES-256).', 'success');
      } else {
        showToast('تنبيه أمني: تم تصدير النسخة الاحتياطية كنص صريح غير مشفر.', 'warning');
      }
    } catch (err) {
      showToast('فشل تصدير النسخة الاحتياطية: ' + err.message, 'error');
    }
  };

  window.importEncryptedVaultBackup = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!confirm('استيراد النسخة الاحتياطية سيستبدل كافة البيانات الحالية في التطبيق. هل ترغب في المتابعة؟ (يُنصح بتصدير نسخة احتياطية أولاً)')) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        let envelope;
        try {
          envelope = JSON.parse(e.target.result);
        } catch (jsonErr) {
          showToast('ملف النسخة الاحتياطية تالف أو ليس بتنسيق JSON صحيح.', 'error');
          return;
        }

        if (!envelope || envelope.app !== 'ApexWallet') {
          showToast('ملف النسخة الاحتياطية غير صالح أو ليس خاصاً بتطبيق ApexWallet.', 'error');
          return;
        }

        let restoredData = null;
        const secEngine = window.WalletSecurity || window.walletSecurity;

        // Check if file is encrypted v2
        if (envelope.format === 'apexwallet_encrypted_backup_v2' || (envelope.encrypted === true && envelope.cipher)) {
          const passphrase = prompt('هذه النسخة الاحتياطية مشفرة بعبارة مرور (AES-256).\nيرجى إدخال عبارة المرور لفك تشفيرها:');
          if (passphrase === null) {
            // Cancelled
            return;
          }
          if (!secEngine || typeof secEngine.decryptBackup !== 'function') {
            throw new Error('وحدة فك التشفير غير متاحة.');
          }
          try {
            restoredData = await secEngine.decryptBackup(envelope, passphrase);
          } catch (decErr) {
            showToast('خطأ: عبارة المرور غير صحيحة أو تم التلاعب بملف النسخة الاحتياطية.', 'error');
            return;
          }
        } else if (envelope.format === 'apexwallet_plaintext_backup_v2' || envelope.encrypted === false) {
          // Plaintext v2
          if (secEngine && typeof secEngine.decryptBackup === 'function') {
            restoredData = await secEngine.decryptBackup(envelope, '');
          } else {
            restoredData = envelope.data || envelope;
          }
        } else {
          // Legacy v1 backup format
          restoredData = envelope;
        }

        if (!restoredData || (!restoredData.securityVault && !restoredData.userStore)) {
          showToast('ملف النسخة الاحتياطية لا يحتوي على بيانات صالحة للمحفظة.', 'error');
          return;
        }

        if (restoredData.securityVault) {
          localStorage.setItem('apexwallet_security_vault_v1', JSON.stringify(restoredData.securityVault));
        }
        if (restoredData.userStore) {
          localStorage.setItem('apexwallet_user_vault_v1', JSON.stringify(restoredData.userStore));
        }
        if (restoredData.currency) {
          localStorage.setItem('wallet_currency', restoredData.currency);
        }

        showToast('تم استيراد البيانات بنجاح! جاري إعادة التحميل...', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        showToast('خطأ أثناء قراءة أو فك تشفير النسخة الاحتياطية: ' + err.message, 'error');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Real-time listener for SMS engine updates
  if (window.BankSmsEngine) {
    window.BankSmsEngine.subscribe(() => {
      if (store.activeTab === 'dashboard') renderOverviewView();
      if (store.activeTab === 'settings') renderSettingsView();
      renderSmsCandidatesList();
    });
  }

  // ==========================================
  // PIN SECURITY & BIOMETRIC LOCK CONTROLLER
  // ==========================================
  const pinOverlay = document.getElementById('pin-lock-overlay');
  const pinTitle = document.getElementById('pin-lock-title');
  const pinSubtitle = document.getElementById('pin-lock-subtitle');
  const pinDotsContainer = document.getElementById('pin-dots-container');
  const pinDots = document.querySelectorAll('.pin-dot');
  const pinFeedback = document.getElementById('pin-feedback-msg');
  const pinCancelBtn = document.getElementById('pin-cancel-btn');
  const pinBiometricBtn = document.getElementById('pin-biometric-btn');
  const pinBackspaceBtn = document.getElementById('pin-backspace-btn');
  const pinKeyButtons = document.querySelectorAll('[data-pin-key]');

  let enteredPin = '';
  let tempFirstPin = '';
  let tempOldPin = '';
  let pinFlow = 'unlock'; // 'unlock' | 'setup_initial' | 'setup_confirm' | 'change_old' | 'change_new' | 'change_confirm'
  let isPinBusy = false;

  function updatePinDots() {
    pinDots.forEach((dot, idx) => {
      if (idx < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
      dot.classList.remove('error', 'success');
    });
  }

  function flashPinDots(statusClass) {
    pinDots.forEach(dot => {
      dot.classList.remove('error', 'success');
      dot.classList.add(statusClass);
    });
  }

  function triggerPinError(msg) {
    if (pinFeedback) {
      pinFeedback.textContent = msg;
      pinFeedback.classList.remove('opacity-0');
    }
    flashPinDots('error');
    if (pinDotsContainer) {
      pinDotsContainer.classList.add('pin-shake');
      setTimeout(() => pinDotsContainer.classList.remove('pin-shake'), 450);
    }
    isPinBusy = true;
    setTimeout(() => {
      enteredPin = '';
      updatePinDots();
      isPinBusy = false;
      if (pinFeedback) pinFeedback.classList.add('opacity-0');
    }, 600);
  }

  function showPinLock(flowOverride) {
    if (!pinOverlay) return;
    const isConfigured = window.WalletSecurity ? window.WalletSecurity.isConfigured() : false;

    if (flowOverride) {
      pinFlow = flowOverride;
    } else {
      pinFlow = isConfigured ? 'unlock' : 'setup_initial';
    }

    enteredPin = '';
    tempFirstPin = '';
    tempOldPin = '';
    updatePinDots();
    if (pinFeedback) pinFeedback.classList.add('opacity-0');

    if (pinFlow === 'setup_initial') {
      if (pinTitle) pinTitle.textContent = 'Create Security PIN';
      if (pinSubtitle) pinSubtitle.textContent = 'Choose a 4-digit PIN to encrypt your wallet';
    } else if (pinFlow === 'change_old') {
      if (pinTitle) pinTitle.textContent = 'Current Security PIN';
      if (pinSubtitle) pinSubtitle.textContent = 'Enter your current 4-digit PIN';
    } else {
      if (pinTitle) pinTitle.textContent = 'ApexWallet Security';
      if (pinSubtitle) pinSubtitle.textContent = 'Enter your 4-digit PIN to access your vault';
    }

    // Toggle Cancel button for Change PIN flow
    if (pinCancelBtn) {
      if (pinFlow.startsWith('change_')) {
        pinCancelBtn.classList.remove('hidden');
      } else {
        pinCancelBtn.classList.add('hidden');
      }
    }

    pinOverlay.classList.remove('opacity-0', 'pointer-events-none');
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();

    // Check biometric availability & status
    if (window.WalletSecurity) {
      const isBioEnabled = window.WalletSecurity.isBiometricsEnabled();
      if (pinBiometricBtn) {
        if (isBioEnabled) {
          pinBiometricBtn.classList.add('bg-emerald-50', 'text-emerald-600', 'border', 'border-emerald-200');
          pinBiometricBtn.style.visibility = 'visible';
          if (pinFlow === 'unlock') {
            setTimeout(() => triggerBiometricUnlock(), 350);
          }
        } else {
          pinBiometricBtn.classList.remove('bg-emerald-50', 'text-emerald-600', 'border', 'border-emerald-200');
          window.WalletSecurity.isBiometricsAvailable().then(avail => {
            if (pinBiometricBtn) {
              pinBiometricBtn.style.visibility = avail ? 'visible' : 'hidden';
            }
          });
        }
      }
    }
  }

  function hidePinLock() {
    if (!pinOverlay) return;
    pinOverlay.classList.add('opacity-0', 'pointer-events-none');
    enteredPin = '';
    updatePinDots();
  }

  async function handlePinDigit(digit) {
    if (isPinBusy || enteredPin.length >= 4) return;
    enteredPin += digit;
    updatePinDots();

    if (enteredPin.length === 4) {
      isPinBusy = true;
      const currentInput = enteredPin;

      try {
        if (pinFlow === 'setup_initial') {
          tempFirstPin = currentInput;
          enteredPin = '';
          pinFlow = 'setup_confirm';
          if (pinTitle) pinTitle.textContent = 'Confirm Security PIN';
          if (pinSubtitle) pinSubtitle.textContent = 'Re-enter your 4-digit PIN to verify';
          updatePinDots();
          isPinBusy = false;
          return;
        }

        if (pinFlow === 'setup_confirm') {
          if (currentInput === tempFirstPin) {
            flashPinDots('success');
            await window.WalletSecurity.setupPin(currentInput);
            showToast('Security PIN created & vault encrypted!', 'success');
            setTimeout(() => {
              hidePinLock();
              isPinBusy = false;
              renderCurrentView();
            }, 300);
          } else {
            triggerPinError('PINs do not match. Try again.');
            pinFlow = 'setup_initial';
            if (pinTitle) pinTitle.textContent = 'Create Security PIN';
            if (pinSubtitle) pinSubtitle.textContent = 'Choose a 4-digit PIN to encrypt your wallet';
          }
          return;
        }

        if (pinFlow === 'unlock') {
          const res = await window.WalletSecurity.unlock(currentInput);
          if (res.success) {
            flashPinDots('success');
            store.loadFromDecrypted(res.data);
            showToast('Wallet unlocked', 'info');
            setTimeout(() => {
              hidePinLock();
              isPinBusy = false;
              renderCurrentView();
              if (localStorage.getItem('apexwallet_bio_migrated_notice') === 'true') {
                localStorage.removeItem('apexwallet_bio_migrated_notice');
                setTimeout(() => {
                  showToast('تم تحديث أمان البصمة إلى WebAuthn PRF. تم إيقاف البصمة السابقة، يرجى إعادة تفعيلها من الإعدادات.', 'info');
                }, 500);
              }
            }, 250);
          } else {
            triggerPinError('Incorrect PIN. Please try again.');
          }
          return;
        }

        if (pinFlow === 'change_old') {
          const isValid = await window.WalletSecurity.verifyPinOnly(currentInput);
          if (isValid) {
            flashPinDots('success');
            tempOldPin = currentInput;
            setTimeout(() => {
              enteredPin = '';
              pinFlow = 'change_new';
              if (pinTitle) pinTitle.textContent = 'New Security PIN';
              if (pinSubtitle) pinSubtitle.textContent = 'Enter your new 4-digit PIN';
              updatePinDots();
              isPinBusy = false;
            }, 250);
          } else {
            triggerPinError('Incorrect current PIN');
          }
          return;
        }

        if (pinFlow === 'change_new') {
          tempFirstPin = currentInput;
          flashPinDots('success');
          setTimeout(() => {
            enteredPin = '';
            pinFlow = 'change_confirm';
            if (pinTitle) pinTitle.textContent = 'Confirm New PIN';
            if (pinSubtitle) pinSubtitle.textContent = 'Re-enter your new 4-digit PIN';
            updatePinDots();
            isPinBusy = false;
          }, 250);
          return;
        }

        if (pinFlow === 'change_confirm') {
          if (currentInput === tempFirstPin) {
            flashPinDots('success');
            const res = await window.WalletSecurity.changePin(tempOldPin, currentInput);
            if (res && res.success) {
              showToast('Security PIN changed successfully!', 'success');
              setTimeout(() => {
                hidePinLock();
                isPinBusy = false;
                renderCurrentView();
              }, 300);
            } else {
              triggerPinError((res && res.error) || 'Failed to update PIN');
            }
          } else {
            triggerPinError('New PINs do not match. Try again.');
            setTimeout(() => {
              pinFlow = 'change_new';
              if (pinTitle) pinTitle.textContent = 'New Security PIN';
              if (pinSubtitle) pinSubtitle.textContent = 'Enter your new 4-digit PIN';
            }, 600);
          }
          return;
        }
      } catch (err) {
        console.error('PIN process error:', err);
        triggerPinError('Security error occurred');
      }
    }
  }

  function handlePinBackspace() {
    if (isPinBusy || enteredPin.length === 0) return;
    enteredPin = enteredPin.slice(0, -1);
    updatePinDots();
  }

  // Keypad clicks
  pinKeyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const digit = btn.getAttribute('data-pin-key');
      if (digit) handlePinDigit(digit);
    });
  });

  if (pinBackspaceBtn) {
    pinBackspaceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handlePinBackspace();
    });
  }

  async function triggerBiometricUnlock() {
    if (!window.WalletSecurity) return;
    if (!window.WalletSecurity.isBiometricsEnabled()) {
      showToast('Enable Biometrics in Settings tab first', 'info');
      return;
    }
    try {
      const res = await window.WalletSecurity.unlockWithBiometrics();
      if (res && res.success) {
        flashPinDots('success');
        store.loadFromDecrypted(res.data);
        showToast('Unlocked with Biometrics!', 'success');
        setTimeout(() => {
          hidePinLock();
          isPinBusy = false;
          renderCurrentView();
        }, 250);
      } else if (res && res.error) {
        if (!res.error.toLowerCase().includes('cancel')) {
          triggerPinError(res.error);
        } else {
          showToast('Biometric cancelled. Enter PIN.', 'info');
        }
      }
    } catch (err) {
      console.warn('Biometric unlock caught:', err);
    }
  }

  if (pinCancelBtn) {
    pinCancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hidePinLock();
    });
  }

  if (pinBiometricBtn) {
    pinBiometricBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerBiometricUnlock();
    });
  }

  // Keyboard input (0-9, Backspace)
  window.addEventListener('keydown', (e) => {
    if (pinOverlay && !pinOverlay.classList.contains('pointer-events-none')) {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handlePinDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handlePinBackspace();
      }
    }
  });

  // Connect security engine lock state
  if (window.WalletSecurity) {
    window.WalletSecurity.onLockStateChange = (locked) => {
      if (locked) {
        showPinLock('unlock');
      } else {
        hidePinLock();
      }
    };
  }

  window.promptChangePin = () => {
    showPinLock('change_old');
  };

  // Sync currency dropdown in header
  const currSelect = document.getElementById('header-currency-select');
  if (currSelect) currSelect.value = currentCurrency;

  // Check initial security lock state
  if (window.WalletSecurity && (!window.WalletSecurity.isConfigured() || window.WalletSecurity.isLocked)) {
    showPinLock();
  }

  // Initial tab & modal
  const hash = (window.location && window.location.hash) ? window.location.hash.replace('#', '') : '';
  const initialTab = hash === 'cards' || hash === 'history' || hash === 'settings' ? hash : 'dashboard';
  const initialModal = hash.startsWith('modal-') ? hash.replace('modal-', '') : null;

  switchView(initialTab);
  if (initialModal && modals[initialModal]) {
    setTimeout(() => openModal(initialModal), 200);
  }
} catch (err) {
  console.error('Fatal UI error:', err);
}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
