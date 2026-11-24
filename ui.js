/**
 * ApexWallet UI & Interaction Controller
 * Visual Card-First Aesthetic (Revolut & Telda Style)
 * - rounded-3xl for primary cards & sheets
 * - rounded-full for buttons, badges, and floating bottom nav
 * - Colors: #F9FAFB, #FFFFFF, #111827 (Charcoal), #10B981 (Emerald), #F43F5E (Soft Rose)
 */

function initApp() {
  try {
    const store = window.walletStore || window.store;

  // Selected featured card on Overview
  let activeFeaturedCardId = store.cards.length > 0 ? store.cards[0].id : null;
  let editingCardId = null;

  // --- Element Selectors ---
  const views = {
    dashboard: document.getElementById('view-dashboard'),
    cards: document.getElementById('view-cards'),
    history: document.getElementById('view-history'),
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
    'cycle-budget-prompt': document.getElementById('modal-cycle-budget-prompt')
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

  // --- Navigation & View Switching ---
  function switchView(targetTab) {
    store.activeTab = targetTab;
    
    // Update floating nav buttons
    navButtons.forEach(btn => {
      const tab = btn.dataset.tab;
      if (tab === targetTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
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

    // Update Top Bar Title
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) {
      if (targetTab === 'dashboard') headerTitle.textContent = 'Cards';
      else if (targetTab === 'cards') headerTitle.textContent = 'Banks';
      else if (targetTab === 'history') headerTitle.textContent = 'History';
      else if (targetTab === 'settings') headerTitle.textContent = 'Settings';
    }

    renderCurrentView();

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

  document.getElementById('tx-card-select')?.addEventListener('change', updateTxCyclePreview);
  document.getElementById('tx-date')?.addEventListener('input', updateTxCyclePreview);

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

    if (targetLabel && targetInput) {
      if (cardType === 'credit') {
        targetLabel.textContent = 'Personal Spending Budget (ميزانية الصرف للدورة)';
        targetInput.required = true;
      } else {
        targetLabel.textContent = 'Personal Spending Budget (اختياري)';
        targetInput.required = false;
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

  // --- Render Current View ---
  function renderCurrentView() {
    // Update Top Subtitle (Total Transactions & Amount Spent)
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
    } else if (store.activeTab === 'settings') {
      renderSettingsView();
    }

    if (window.lucide) {
      try { lucide.createIcons(); } catch(e) { console.warn('Lucide icon error:', e); }
    }
  }

  // --- Bank SMS Notification Banner Helper ---
  function renderSmsBannerHtml() {
    const count = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates) ? window.BankSmsEngine.pendingCandidates.length : 0;
    if (count === 0) return '';
    return `
      <div id="sms-inbox-banner" onclick="window.openSmsReviewInbox()" class="cursor-pointer bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 rounded-3xl shadow-sm border border-indigo-700/50 flex items-center justify-between active-press transition-all hover:border-indigo-400">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <i data-lucide="mail-check" class="w-4 h-4 text-emerald-400"></i>
          </div>
          <div class="min-w-0 pr-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-extrabold text-white">Bank SMS Import</span>
              <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shrink-0">${count} Ready</span>
            </div>
            <p class="text-[10px] text-slate-300 truncate mt-0.5">Review parsed bank transactions & assign cards</p>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 shrink-0"></i>
      </div>
    `;
  }

  // ==========================================
  // VIEW 1: OVERVIEW (SWIPEABLE CARDS CAROUSEL)
  // ==========================================
  function renderOverviewView() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    if (store.cards.length === 0) {
      if (store.banks.length === 0) {
        container.innerHTML = `
          <div class="space-y-4">
            ${renderSmsBannerHtml()}
            <div class="bg-white p-7 rounded-3xl border border-slate-200/90 text-center shadow-xs space-y-4 my-auto mt-4">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
                <i data-lucide="building-2" class="w-7 h-7"></i>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-slate-900">Your Wallet is Ready</h3>
                <p class="text-xs text-slate-400 mt-1 max-w-[270px] mx-auto">Start by adding your bank, then add your cards (up to 3 per bank) and track your expenses.</p>
              </div>
              <div class="pt-2 max-w-[220px] mx-auto">
                <button onclick="window.openModal('bank')" class="w-full py-3 bg-[#111827] hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-md active-press flex items-center justify-center gap-1.5 transition-all">
                  <i data-lucide="plus" class="w-4 h-4"></i>
                  <span>Add Your Bank</span>
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="space-y-4">
            ${renderSmsBannerHtml()}
            <div class="bg-white p-7 rounded-3xl border border-slate-200/90 text-center shadow-xs space-y-4 my-auto mt-4">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                <i data-lucide="credit-card" class="w-7 h-7"></i>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-slate-900">No Cards Added Yet</h3>
                <p class="text-xs text-slate-400 mt-1 max-w-[270px] mx-auto">You have banks linked. Now add a credit, debit, or prepaid card to start tracking your statements.</p>
              </div>
              <div class="pt-2 max-w-[220px] mx-auto">
                <button onclick="window.openModal('card')" class="w-full py-3 bg-[#111827] hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-md active-press flex items-center justify-center gap-1.5 transition-all">
                  <i data-lucide="plus" class="w-4 h-4"></i>
                  <span>Add Your First Card</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }
      if (window.lucide) {
        try { lucide.createIcons({ root: container }); } catch (e) {}
      }
      return;
    }

    // Ensure valid active card
    if (!activeFeaturedCardId || !store.getCard(activeFeaturedCardId)) {
      activeFeaturedCardId = store.cards[0].id;
    }
    const activeIndex = store.cards.findIndex(c => c.id === activeFeaturedCardId);

    container.innerHTML = `
      <div class="space-y-4">
        
        <!-- PENDING BANK SMS NOTIFICATION BANNER -->
        ${renderSmsBannerHtml()}

        <!-- Header Subtitle with Active Card Info & Carousel Hint -->
        <div class="flex justify-between items-center px-1">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold text-slate-800">Your Cards</span>
            <span id="card-counter-badge" class="text-[10px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              ${activeIndex + 1}/${store.cards.length}
            </span>
          </div>
          <span class="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <span>Swipe Card or Tap Tabs</span>
            <span>&rarr;</span>
          </span>
        </div>

        <!-- Quick Card Selector Pills (Scrollable horizontally from top) -->
        <div id="card-selector-tabs" class="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5 scroll-smooth">
          ${store.cards.map((c) => {
            const isSel = c.id === activeFeaturedCardId;
            const cStat = store.getCardSpendingStats(c.id);
            return `
              <button type="button" data-tab-card-id="${c.id}" onclick="window.scrollToCard('${c.id}')" class="px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${isSel ? 'bg-[#111827] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'}">
                <span>${c.name}</span>
                ${cStat.isExceeded ? '<span class="text-rose-400 text-[10px]">⚠️</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>

        <!-- 1. SWIPEABLE CARDS CAROUSEL (EXACT DESIGN MATCH) -->
        <div id="cards-carousel" class="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1 pt-1 -mx-5 px-5 scroll-smooth">
          ${store.cards.map((card) => {
            const cardStat = store.getCardSpendingStats(card.id);
            const bank = store.getBank(card.bankId);
            const gradient = getCardGradientStyle(card, bank);
            const isCredit = card.cardType === 'credit';
            const isSelected = card.id === activeFeaturedCardId;

            return `
              <div id="card-carousel-item-${card.id}" data-card-id="${card.id}" class="min-w-[315px] w-[88%] snap-center snap-always shrink-0 p-5 rounded-3xl text-white shadow-lg shadow-slate-900/10 transition-all duration-300 relative overflow-hidden select-none cursor-pointer ${isSelected ? 'ring-2 ring-[#111827]/40 scale-100' : 'scale-[0.98] opacity-95'}" style="background: ${gradient};" onclick="window.scrollToCard('${card.id}')">
                <!-- Subtle glow circle -->
                <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

                <!-- Top Row: Bank + Nickname & Custom Color Button -->
                <div class="flex justify-between items-center relative z-10">
                  <span class="text-xs font-semibold opacity-90 tracking-wide">${bank ? bank.shortCode : ''} ${card.name}</span>
                  <div class="flex items-center gap-1.5">
                    <button type="button" onclick="window.openCustomizeCardModal('${card.id}', event)" class="px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs transition-all active:scale-95 shadow-2xs" title="Customize Card Color">
                      <span>🎨</span>
                      <span>Color</span>
                    </button>
                    <span class="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider backdrop-blur-xs">
                      ${card.cardType}
                    </span>
                  </div>
                </div>

                <!-- Spent vs Budget / Credit Limit (Dual Budget Model) -->
                ${isCredit ? `
                  <div class="mt-2.5 relative z-10">
                    <p class="text-2xl font-bold font-mono tracking-tight leading-tight">
                      ${cardStat.isExceeded 
                        ? `<span class="text-rose-200">+${formatCurrency(cardStat.overAmount)}</span> <span class="text-xs font-normal opacity-90 text-rose-200">تجاوز للميزانية</span>` 
                        : `${formatCurrency(cardStat.remaining)} <span class="text-xs font-normal opacity-90">متبقي من الميزانية</span>`}
                    </p>
                    <div class="flex items-center justify-between text-[10.5px] opacity-90 mt-1 font-medium">
                      <span>مصروف الدورة: ${formatCurrency(cardStat.spent)} من ميزانية ${formatCurrency(cardStat.target)}</span>
                      <button type="button" onclick="window.promptSetCycleBudget('${card.id}', event)" class="px-1.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-[9px] font-bold backdrop-blur-xs transition-all active:scale-95 shadow-2xs" title="تعديل ميزانية هذه الدورة">
                        تعديل
                      </button>
                    </div>
                  </div>
                ` : `
                  <div class="mt-2.5 relative z-10">
                    <p class="text-2xl font-bold font-mono tracking-tight leading-tight">
                      ${formatCurrency(cardStat.spent)}
                      ${cardStat.target > 0 ? `<span class="text-xs font-normal opacity-80">/ ${formatCurrency(cardStat.target)}</span>` : ''}
                    </p>
                    <p class="text-[10.5px] opacity-80 mt-1 font-medium">
                      ${cardStat.target > 0 ? `متبقي: ${formatCurrency(cardStat.remaining)}` : 'إجمالي المصروفات'}
                    </p>
                  </div>
                `}

                <!-- Slim Progress Bar -->
                <div class="w-full h-1.5 bg-white/20 rounded-full mt-2.5 overflow-hidden relative z-10">
                  <div class="${cardStat.isExceeded ? 'bg-rose-400' : (cardStat.isWarning ? 'bg-amber-400' : 'bg-white')} h-full rounded-full transition-all duration-500 shadow-sm" style="width: ${cardStat.percentage}%;"></div>
                </div>

                <!-- Bottom Row: Last 4 & Billing Cycle / Credit Limit Badge -->
                <div class="flex justify-between items-center text-[11px] opacity-90 mt-2.5 font-medium relative z-10">
                  <span class="font-mono">•••• ${card.last4}</span>
                  ${isCredit ? `
                    <div class="flex items-center gap-1.5">
                      <span class="px-2 py-0.5 rounded-full bg-black/25 text-[10px] font-semibold backdrop-blur-xs">
                        الحد البنكي: ${cardStat.creditLimit !== null ? formatCurrency(cardStat.creditLimit) : 'غير مسجل'}
                      </span>
                      ${card.cycleStartDay ? `
                        <span class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                          دورة ${card.cycleStartDay}
                        </span>
                      ` : ''}
                    </div>
                  ` : `
                    <span>${card.network || 'VISA'}</span>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Carousel Pagination Dots / Pills -->
        <div id="carousel-pagination-dots" class="flex justify-center items-center gap-1.5 pt-0.5">
          ${store.cards.map((c, idx) => `
            <button type="button" data-dot-card-id="${c.id}" onclick="window.scrollToCard('${c.id}')" class="h-1.5 rounded-full transition-all duration-300 ${
              c.id === activeFeaturedCardId ? 'w-6 bg-[#111827]' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }" title="Card ${idx + 1}"></button>
          `).join('')}
        </div>

        <!-- 2. SECONDARY CARD MINI PILLS (OVER LIMIT / WARNING STATES) -->
        <div id="overview-secondary-cards" class="space-y-2.5 pt-1"></div>

        <!-- 3. CLEAN ACTIVITY FOR CURRENT CARD -->
        <div id="overview-activity-container" class="space-y-2.5 pt-1"></div>

      </div>
    `;

    // Populate dynamic secondary cards & activity without re-rendering carousel
    renderSecondaryCards(activeFeaturedCardId);
    renderCardActivity(activeFeaturedCardId);

    // Attach scroll listener to carousel to auto-detect centered card
    setupCarouselScrollListener();

    // Scroll carousel to initial active card position
    const initialEl = document.getElementById('card-carousel-item-' + activeFeaturedCardId);
    if (initialEl) {
      initialEl.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
    }

    // Auto-check and prompt for any new billing cycles
    setTimeout(() => {
      checkAndPromptPendingCycleBudgets();
    }, 350);
  }

  // --- Dynamic Sub-Renderers (Smooth updates without wiping carousel DOM) ---
  function renderSecondaryCards(activeCardId) {
    const container = document.getElementById('overview-secondary-cards');
    if (!container) return;

    // Show warning/over-limit cards as alert pills (like in the design spec)
    const alertCards = store.cards.filter(c => {
      if (c.id === activeCardId) return false;
      const cStat = store.getCardSpendingStats(c.id);
      return cStat.isExceeded || cStat.isWarning;
    });

    if (alertCards.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="space-y-2">
        ${alertCards.map(c => {
          const cStat = store.getCardSpendingStats(c.id);
          const isExceeded = cStat.isExceeded;

          if (isExceeded) {
            return `
              <div onclick="window.scrollToCard('${c.id}')" class="bg-white p-3.5 rounded-2xl border border-rose-200 flex justify-between items-center shadow-2xs hover:border-rose-300 transition-all cursor-pointer active:scale-[0.99]">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-900">${c.name} ••${c.last4}</span>
                    <span class="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">Over Limit</span>
                  </div>
                  <p class="text-[11px] text-slate-400 mt-0.5">
                    ${formatCurrency(cStat.spent)} / ${formatCurrency(cStat.target)} ${c.cycleStartDay ? `• Cycle ${c.cycleStartDay}th–${c.cycleEndDay}th` : ''}
                  </p>
                </div>
                <span class="text-xs font-bold text-rose-600 font-mono">+${formatCurrency(cStat.overAmount)}</span>
              </div>
            `;
          } else {
            return `
              <div onclick="window.scrollToCard('${c.id}')" class="bg-white p-3.5 rounded-2xl border border-amber-200 flex justify-between items-center shadow-2xs hover:border-amber-300 transition-all cursor-pointer active:scale-[0.99]">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-900">${c.name} ••${c.last4}</span>
                    <span class="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">80%+ Limit</span>
                  </div>
                  <p class="text-[11px] text-slate-400 mt-0.5">
                    ${formatCurrency(cStat.spent)} / ${formatCurrency(cStat.target)} ${c.cycleStartDay ? `• Cycle ${c.cycleStartDay}th–${c.cycleEndDay}th` : ''}
                  </p>
                </div>
                <span class="text-xs font-bold text-amber-600 font-mono">${Math.round(cStat.rawPercentage)}%</span>
              </div>
            `;
          }
        }).join('')}
      </div>
    `;
  }

  function renderCardActivity(cardId) {
    const container = document.getElementById('overview-activity-container');
    if (!container) return;

    const card = store.getCard(cardId);
    if (!card) return;

    // Filter transactions: show ONLY activity for this active card
    const cardTxs = store.getFilteredTransactions().filter(t => t.cardId === cardId);
    const cardStat = store.getCardSpendingStats(cardId);

    container.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <div>
          <p class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>Activity</span>
            <span class="text-indigo-600 font-extrabold">• ${card.name}</span>
          </p>
          <p class="text-[10px] text-slate-400 font-medium">
            ${cardTxs.length} ${cardTxs.length === 1 ? 'expense' : 'expenses'} • ${formatCurrency(cardStat.spent)} total
          </p>
        </div>
        <button onclick="window.switchTab('history')" class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          All History &rarr;
        </button>
      </div>

      ${cardTxs.length === 0 ? `
        <div class="bg-white p-5 rounded-2xl text-center border border-slate-100 shadow-2xs">
          <p class="text-xs text-slate-400 font-medium">No expenses recorded for ${card.name} yet</p>
          <button onclick="window.openAddTxForCard('${card.id}')" class="mt-2.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full transition-all inline-flex items-center gap-1">
            <span>+</span>
            <span>Add Expense for this card</span>
          </button>
        </div>
      ` : `
        <div class="space-y-2.5">
          ${cardTxs.slice(0, 8).map(tx => {
            const isCredit = card.cardType === 'credit';
            const stmtName = (tx.statementInfo && tx.statementInfo.statementMonthName) ? tx.statementInfo.statementMonthName.substring(0, 3) : 'Dec';
            const isCurrentCycle = tx.statementInfo && tx.statementInfo.statementMonth === 12;
            const txType = tx.transactionType || (tx.category === 'transfer' ? 'transfer' : 'purchase');
            let typeBadge = '';
            if (txType === 'withdrawal') {
              typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">سحب نقدي</span>';
            } else if (txType === 'transfer') {
              typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">تحويل</span>';
            } else {
              typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">شراء</span>';
            }

            return `
              <div class="bg-white p-3.5 rounded-2xl flex justify-between items-center shadow-2xs border border-slate-100/80 hover:shadow-xs transition-all">
                <div class="pr-2 min-w-0">
                  <p class="text-xs font-bold text-slate-900 leading-tight truncate">${tx.merchant}</p>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    ${isCredit ? `
                      <span class="text-[10px] ${isCurrentCycle ? 'text-indigo-600 font-semibold' : 'text-slate-400 font-medium'}">
                        Affects ${stmtName} Statement
                      </span>
                    ` : `
                      <span class="text-[10px] text-slate-400 font-medium">
                        Debit Card
                      </span>
                    `}
                    <span class="text-[10px] text-slate-300">•</span>
                    <span class="text-[10px] text-slate-400 font-medium">${tx.date}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-2">
                  ${typeBadge}
                  <span class="text-xs font-bold ${tx.direction === 'income' ? 'text-emerald-600' : 'text-slate-900'} font-mono tracking-tight">
                    ${tx.direction === 'income' ? '+' : '-'}${formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
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
    const card = store.getCard(cardId);
    if (!card) return;

    // 1. Update top selector tabs
    const tabsContainer = document.getElementById('card-selector-tabs');
    if (tabsContainer) {
      tabsContainer.querySelectorAll('button[data-tab-card-id]').forEach(btn => {
        const isSel = btn.dataset.tabCardId === cardId;
        if (isSel) {
          btn.className = 'px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 bg-[#111827] text-white shadow-xs';
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          btn.className = 'px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:border-slate-300';
        }
      });
    }

    // 2. Update card highlight in carousel
    const carousel = document.getElementById('cards-carousel');
    if (carousel) {
      carousel.querySelectorAll('[data-card-id]').forEach(item => {
        const isSel = item.dataset.cardId === cardId;
        if (isSel) {
          item.classList.add('ring-2', 'ring-[#111827]/40', 'scale-100');
          item.classList.remove('scale-[0.98]', 'opacity-95');
        } else {
          item.classList.remove('ring-2', 'ring-[#111827]/40', 'scale-100');
          item.classList.add('scale-[0.98]', 'opacity-95');
        }
      });
    }

    // 3. Update pagination dots
    const dotsContainer = document.getElementById('carousel-pagination-dots');
    if (dotsContainer) {
      dotsContainer.querySelectorAll('button[data-dot-card-id]').forEach(dot => {
        const isSel = dot.dataset.dotCardId === cardId;
        dot.className = `h-1.5 rounded-full transition-all duration-300 ${isSel ? 'w-6 bg-[#111827]' : 'w-2 bg-slate-300 hover:bg-slate-400'}`;
      });
    }

    // 4. Update index counter badge (e.g. 1/8)
    const counterEl = document.getElementById('card-counter-badge');
    if (counterEl) {
      const idx = store.cards.findIndex(c => c.id === cardId);
      counterEl.textContent = `${idx + 1}/${store.cards.length}`;
    }

    // 5. Update secondary cards below
    renderSecondaryCards(cardId);

    // 6. Update card activity below
    renderCardActivity(cardId);

    // 7. If requested, smooth scroll carousel to card
    if (scrollCarousel && carousel) {
      const el = document.getElementById('card-carousel-item-' + cardId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
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
  function renderBanksView() {
    const container = document.getElementById('view-cards');
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center px-1">
          <div>
            <h2 class="text-sm font-extrabold text-slate-900">Banks & Cards</h2>
            <p class="text-[11px] text-slate-400">Enforcing maximum 3 cards per bank</p>
          </div>
          <button onclick="window.openModal('bank')" class="px-3.5 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-full shadow-xs active-press flex items-center gap-1">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>Add Bank</span>
          </button>
        </div>

        <div class="space-y-4">
          ${store.banks.length === 0 ? `
            <div class="bg-white p-7 rounded-3xl border border-slate-200/90 text-center shadow-xs space-y-3 mt-2">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-2xs">
                <i data-lucide="building-2" class="w-6 h-6"></i>
              </div>
              <div>
                <h3 class="text-xs font-bold text-slate-800">No Banks Added Yet</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">Add your bank (CIB, HSBC, QNB, NBE, Banque Misr, etc.) to manage up to 3 cards per bank.</p>
              </div>
              <button onclick="window.openModal('bank')" class="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-full shadow-xs active-press inline-flex items-center gap-1.5 mt-1">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>Add Bank</span>
              </button>
            </div>
          ` : store.banks.map(bank => {
            const cards = store.getCardsForBank(bank.id);
            const isCapReached = cards.length >= 3;

            return `
              <div class="bg-white rounded-3xl p-4 shadow-2xs border border-slate-200/90 space-y-3">
                <!-- Bank Header -->
                <div class="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[11px] shadow-xs" style="background-color: ${bank.accentColor}">
                      ${(bank && bank.shortCode ? bank.shortCode : 'BNK').substring(0, 3)}
                    </div>
                    <div>
                      <h3 class="text-xs font-bold text-slate-900">${bank.name}</h3>
                      <span class="text-[10px] text-slate-400 font-mono">${bank.shortCode}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isCapReached ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }">
                      ${cards.length}/3 Cards
                    </span>
                    <button onclick="window.confirmDeleteBank('${bank.id}')" class="text-slate-300 hover:text-rose-500 p-1 transition-colors">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>

                <!-- Bank Accounts Section (Item 2: Live Balance) -->
                ${(() => {
                  const accounts = store.getAccountsForBank(bank.id);
                  return `
                    <div class="space-y-1.5 pt-0.5">
                      <div class="flex items-center justify-between px-0.5">
                        <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <i data-lucide="landmark" class="w-3.5 h-3.5 text-slate-500"></i>
                          <span>الحسابات البنكية (${accounts.length})</span>
                        </span>
                        <button onclick="window.openAddAccountForBank('${bank.id}')" class="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5">
                          <i data-lucide="plus" class="w-3 h-3"></i>
                          <span>إضافة حساب</span>
                        </button>
                      </div>
                      ${accounts.length === 0 ? `
                        <div class="p-2 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center text-[10px] text-slate-400">
                          لا توجد حسابات بنكية مسجلة لهذا البنك
                        </div>
                      ` : accounts.map(acc => `
                        <div class="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                          <div>
                            <div class="flex items-center gap-1.5">
                              <span class="text-xs font-bold text-slate-900">${acc.name}</span>
                              <span class="text-[10px] text-slate-400 font-mono">${acc.accountNumberMasked || acc.identifierDigits}</span>
                            </div>
                          </div>
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-black font-mono px-2 py-0.5 rounded-full ${acc.balance < 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
                              الرصيد: ${formatCurrency(acc.balance || 0, acc.currency || 'EGP')}
                            </span>
                            <button onclick="window.confirmDeleteAccount('${acc.id}')" class="text-slate-300 hover:text-rose-500 p-0.5 transition-colors" title="حذف الحساب">
                              <i data-lucide="x" class="w-3.5 h-3.5"></i>
                            </button>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  `;
                })()}

                <!-- Cards List -->
                <div class="space-y-2.5 pt-1 border-t border-slate-100">
                  <div class="px-0.5 text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <i data-lucide="credit-card" class="w-3.5 h-3.5 text-slate-500"></i>
                    <span>الكروت المسجلة</span>
                  </div>
                  ${cards.map(c => {
                    const cStat = store.getCardSpendingStats(c.id);
                    const linkedAcc = c.linkedAccountId ? store.getAccount(c.linkedAccountId) : null;
                    return `
                      <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-slate-900 truncate">${c.name}</span>
                            <span class="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold uppercase">${c.cardType}</span>
                          </div>
                          <p class="text-[10px] text-slate-400 font-mono mt-0.5">
                            •••• ${c.last4} ${c.cycleStartDay ? `• Cycle ${c.cycleStartDay}th–${c.cycleEndDay}th` : ''} ${linkedAcc ? `• مرتبط بـ: ${linkedAcc.name}` : ''}
                          </p>
                          <div class="w-full bg-slate-200 rounded-full h-1 mt-2 overflow-hidden">
                            <div class="${cStat.isExceeded ? 'bg-rose-500' : 'bg-emerald-500'} h-full rounded-full" style="width: ${cStat.percentage}%;"></div>
                          </div>
                        </div>

                        <div class="text-right shrink-0 ml-3">
                          <span class="text-xs font-bold ${cStat.isExceeded ? 'text-rose-600' : 'text-slate-800'} font-mono block">
                            ${formatCurrency(cStat.spent)}
                          </span>
                          <span class="text-[10px] text-slate-400 font-mono">/ ${formatCurrency(cStat.target)}</span>
                          <div class="flex items-center justify-end gap-1.5 mt-1">
                            <button onclick="window.openCustomizeCardModal('${c.id}', event)" class="p-0.5 text-slate-400 hover:text-indigo-600 transition-colors" title="Customize Card Color">
                              <span class="text-xs">🎨</span>
                            </button>
                            <button onclick="window.confirmDeleteCard('${c.id}')" class="text-slate-300 hover:text-rose-500 transition-colors" title="Delete Card">
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
                  <div class="w-full py-2 rounded-full bg-slate-100 text-slate-400 text-[11px] font-bold text-center cursor-not-allowed">
                    🔒 Maximum 3 Cards Reached for ${bank.shortCode}
                  </div>
                ` : `
                  <button onclick="window.openAddCardForBank('${bank.id}')" class="w-full py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold text-center transition-all flex items-center justify-center gap-1.5 active-press">
                    <i data-lucide="plus" class="w-3.5 h-3.5 text-emerald-600"></i>
                    <span>Add Card (${cards.length}/3)</span>
                  </button>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW 3: HISTORY
  // ==========================================
  function renderHistoryView() {
    const container = document.getElementById('view-history');
    if (!container) return;

    const filtered = store.getFilteredTransactions();

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-center px-1">
          <div>
            <h2 class="text-sm font-extrabold text-slate-900">Transaction History</h2>
            <p class="text-[11px] text-slate-400">${filtered.length} transactions recorded</p>
          </div>
          <button onclick="window.exportTransactionsCSV()" class="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-full shadow-2xs hover:bg-slate-50">
            Export CSV
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative">
          <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
          <input type="text" id="history-search-input" value="${store.searchQuery}" placeholder="Search merchant, amount, category..." class="w-full bg-white border border-slate-200 rounded-full pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs">
        </div>

        <!-- Filter Chips Carousel -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button onclick="window.setFilterStatement('all')" class="px-3 py-1 rounded-full text-[10px] font-bold shrink-0 ${
            store.selectedStatementFilter === 'all' ? 'bg-[#111827] text-white' : 'bg-white text-slate-500 border border-slate-200'
          }">
            All Cycles
          </button>
          ${store.getAvailableStatementMonths().map(m => `
            <button onclick="window.setFilterStatement('${m.key}')" class="px-3 py-1 rounded-full text-[10px] font-bold shrink-0 ${
              store.selectedStatementFilter === m.key ? 'bg-[#111827] text-white' : 'bg-white text-slate-500 border border-slate-200'
            }">
              ${m.badge}
            </button>
          `).join('')}
        </div>

        <!-- Transaction Items -->
        <div class="space-y-2 pt-1">
          ${filtered.length === 0 ? `
            <div class="bg-white p-7 rounded-3xl text-center border border-slate-200/90 shadow-2xs space-y-3 mt-2">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shadow-2xs">
                <i data-lucide="receipt" class="w-6 h-6"></i>
              </div>
              <div>
                <h3 class="text-xs font-bold text-slate-800">No Transactions Yet</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">When you log an expense, it will appear here with automatic statement tags.</p>
              </div>
              <button onclick="window.openModal('transaction')" class="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-full shadow-xs active-press inline-flex items-center gap-1.5 mt-1">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>Log Expense</span>
              </button>
            </div>
          ` : filtered.map(tx => {
            const isCredit = tx.card && tx.card.cardType === 'credit';
            const stmtName = (tx.statementInfo && tx.statementInfo.statementMonthName) ? tx.statementInfo.statementMonthName.substring(0, 3) : 'Dec';
            const isCurrentCycle = tx.statementInfo && tx.statementInfo.statementMonth === 12;
            const txType = tx.transactionType || (tx.category === 'transfer' ? 'transfer' : 'purchase');
            let typeBadge = '';
            if (txType === 'withdrawal') {
              typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">سحب نقدي</span>';
            } else if (txType === 'transfer') {
              typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">تحويل</span>';
            } else {
              typeBadge = '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">شراء</span>';
            }

            return `
              <div class="bg-white p-3.5 rounded-2xl flex justify-between items-center shadow-2xs border border-slate-100/90 hover:shadow-xs transition-all">
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-xs font-bold text-slate-900">${tx.merchant}</p>
                    <span class="text-[10px] text-slate-400 font-mono">• ${tx.date}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-0.5">
                    ${isCredit ? `
                      <span class="text-[10px] ${isCurrentCycle ? 'text-indigo-600' : 'text-slate-400'} font-semibold">
                        Affects ${stmtName} Statement
                      </span>
                    ` : `
                      <span class="text-[10px] text-slate-400 font-medium">${tx.card?.name || 'Debit'}</span>
                    `}
                    <span class="text-slate-300">•</span>
                    <span class="text-[10px] text-slate-400 font-mono">•••• ${tx.card?.last4 || ''}</span>
                  </div>
                </div>

                <div class="flex items-center gap-1.5">
                  ${typeBadge}
                  <span class="text-xs font-bold ${tx.direction === 'income' ? 'text-emerald-600' : 'text-slate-900'} font-mono">${tx.direction === 'income' ? '+' : '-'}${formatCurrency(tx.amount)}</span>
                  <button onclick="window.confirmDeleteTx('${tx.id}')" class="text-slate-300 hover:text-rose-500 p-1">
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
  }

  // --- Global Helpers ---
  window.selectFeaturedCard = (cardId) => {
    activeFeaturedCardId = cardId;
    renderCurrentView();
  };

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

  // ==========================================
  // VIEW 4: SETTINGS & BIOMETRICS VIEW
  // ==========================================
  async function renderSettingsView() {
    const container = document.getElementById('view-settings');
    if (!container) return;

    const isBioSupported = window.WalletSecurity ? await window.WalletSecurity.isBiometricsAvailable() : false;
    const isBioEnabled = window.WalletSecurity ? window.WalletSecurity.isBiometricsEnabled() : false;
    const timeoutMs = window.WalletSecurity ? window.WalletSecurity.getAutoLockTimeout() : 180000;

    container.innerHTML = `
      <div class="space-y-3.5 pb-24">
        
        <!-- SECTION 1: SECURITY & BIOMETRIC AUTH -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div class="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div class="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-xs font-extrabold text-slate-900 tracking-tight">Security & Biometrics</h3>
              <p class="text-[10px] text-slate-400">Vault encryption and device unlock</p>
            </div>
          </div>

          <!-- Biometric Toggle Row -->
          <div class="flex items-center justify-between py-1">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <i data-lucide="fingerprint" class="w-5 h-5"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-slate-900">Biometric Unlock</div>
                <div class="text-[10px] text-slate-400">
                  ${isBioSupported ? (isBioEnabled ? 'Face ID / Fingerprint is Active' : 'Touch ID, Face ID or Fingerprint') : 'Hardware not detected in this browser'}
                </div>
              </div>
            </div>
            <div>
              <label class="relative inline-flex items-center ${isBioSupported ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}">
                <input type="checkbox" id="settings-biometric-toggle" ${isBioEnabled ? 'checked' : ''} ${!isBioSupported ? 'disabled' : ''} class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <!-- Change PIN Row -->
          <div class="flex items-center justify-between py-1 border-t border-slate-100 pt-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <i data-lucide="key-round" class="w-5 h-5"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-slate-900">4-Digit Security PIN</div>
                <div class="text-[10px] text-slate-400">Master code for AES-256 decryption</div>
              </div>
            </div>
            <button onclick="window.promptChangePin()" class="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold active-press transition-colors">
              Change PIN
            </button>
          </div>

          <!-- Auto-Lock Duration Row -->
          <div class="flex items-center justify-between py-1 border-t border-slate-100 pt-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <i data-lucide="timer" class="w-5 h-5"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-slate-900">Auto-Lock Timer</div>
                <div class="text-[10px] text-slate-400">Locks when in background</div>
              </div>
            </div>
            <select id="settings-autolock-select" onchange="window.updateAutoLockTimeout(this.value)" class="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 rounded-full px-2.5 py-1 outline-none cursor-pointer">
              <option value="0" ${timeoutMs === 0 ? 'selected' : ''}>Immediately</option>
              <option value="60000" ${timeoutMs === 60000 ? 'selected' : ''}>1 minute</option>
              <option value="180000" ${timeoutMs === 180000 ? 'selected' : ''}>3 minutes</option>
              <option value="300000" ${timeoutMs === 300000 ? 'selected' : ''}>5 minutes</option>
              <option value="900000" ${timeoutMs === 900000 ? 'selected' : ''}>15 minutes</option>
            </select>
          </div>

          <!-- Vault Security Architecture Note & Boundaries -->
          <div class="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-[10px] leading-relaxed">
            <div class="flex items-center gap-1.5 font-bold text-slate-800">
              <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-indigo-600"></i>
              <span>بنية الحماية وحدود الأنظمة (Threat Model & Security Boundaries)</span>
            </div>
            ${window.BankSmsEngine && window.BankSmsEngine.isPlatformSupported() ? `
              <div class="space-y-1 text-slate-600">
                <div class="flex items-center gap-1 font-bold text-emerald-800">
                  <i data-lucide="cpu" class="w-3 h-3 text-emerald-600"></i>
                  <span>أندرويد أصلي (Hardware Keystore TEE):</span>
                </div>
                <p>
                  مفتاح البصمة مربوط بعتاد الجهاز الآمن (Keystore) عبر BiometricPrompt.CryptoObject ولا يُفك تشفير رمز الـ PIN بدون بصمة حقيقية. طابور رسائل الـ SMS مشفر بـ MasterKey AES-256. فتح المحفظة بالـ PIN اليدوي مستقل تماماً ويضمن عدم فقدان بياناتك في حال تعديل البصمات من إعدادات النظام.
                </p>
              </div>
            ` : `
              <div class="space-y-1 text-slate-600">
                <div class="flex items-center gap-1 font-bold text-blue-800">
                  <i data-lucide="globe" class="w-3 h-3 text-blue-600"></i>
                  <span>نسخة المتصفح / PWA (Web Crypto & WebAuthn):</span>
                </div>
                <p>
                  تشفير الخزنة محلياً بـ AES-256-GCM مع اشتقاق PBKDF2 (100,000 تكرار). مصادقة WebAuthn تتأكد من وجود المستخدم، ورمز الـ PIN اليدوي هو جذر التشفير الأساسي؛ نظراً لعدم إتاحة المتصفحات وصولاً مباشراً لعتاد Keystore بدون خادم مصادقة أو امتدادات PRF.
                </p>
              </div>
            `}
          </div>
        </div>

        <!-- SECTION: BANK SMS TRANSACTION IMPORT -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <i data-lucide="message-square" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="text-xs font-extrabold text-slate-900 tracking-tight">Bank SMS Transaction Import</h3>
                <p class="text-[10px] text-slate-400">On-device parsing & Keystore queue</p>
              </div>
            </div>
            ${window.BankSmsEngine && window.BankSmsEngine.isPlatformSupported()
              ? '<span class="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Android Native</span>'
              : '<span class="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">PWA / Web View</span>'}
          </div>

          <!-- Explanation Banner -->
          <div class="bg-indigo-50/70 rounded-2xl p-3 border border-indigo-100/80 text-[10px] text-indigo-900 leading-relaxed space-y-1">
            <div class="font-extrabold flex items-center gap-1.5 text-indigo-950">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-indigo-600"></i>
              <span>Privacy & Security Guarantee</span>
            </div>
            <p class="text-indigo-800/90">
              Only incoming SMS from enabled banks are processed on-device. Raw SMS text is discarded immediately in memory. OTPs, passwords, and verification codes are strictly rejected.
            </p>
          </div>

          <!-- Toggle: Opt-In Switch -->
          <div class="flex items-center justify-between py-1">
            <div>
              <div class="text-xs font-bold text-slate-900">Enable Bank SMS Import</div>
              <div class="text-[10px] text-slate-400">Off by default • Explicit opt-in</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="settings-sms-import-toggle" ${window.BankSmsEngine && window.BankSmsEngine.stats.isSmsImportEnabled ? 'checked' : ''} onchange="window.toggleSmsImport(this.checked)" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <!-- Permission Status Row -->
          <div class="flex items-center justify-between py-1 border-t border-slate-100 pt-3">
            <div>
              <div class="text-xs font-bold text-slate-900">RECEIVE_SMS Permission</div>
              <div class="text-[10px] text-slate-400">Android runtime permission state</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                (window.BankSmsEngine && window.BankSmsEngine.stats.permissionStatus === 'granted')
                  ? 'bg-emerald-100 text-emerald-800'
                  : (window.BankSmsEngine && window.BankSmsEngine.stats.permissionStatus === 'denied')
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }">
                ${((window.BankSmsEngine && window.BankSmsEngine.stats.permissionStatus) || 'UNAVAILABLE').toUpperCase()}
              </span>
              ${window.BankSmsEngine && window.BankSmsEngine.isPlatformSupported() && window.BankSmsEngine.stats.permissionStatus !== 'granted'
                ? `<button onclick="window.requestSmsPermission()" class="text-[10px] font-bold px-2 py-1 bg-slate-900 text-white rounded-lg active-press">Request</button>`
                : ''}
            </div>
          </div>

          <!-- Keystore Protection Row -->
          <div class="flex items-center justify-between py-1 border-t border-slate-100 pt-3">
            <div>
              <div class="text-xs font-bold text-slate-900">Hardware Keystore Vault</div>
              <div class="text-[10px] text-slate-400">MasterKey AES-256-GCM queue</div>
            </div>
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              window.BankSmsEngine && window.BankSmsEngine.stats.isKeystoreProtected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }">
              ${window.BankSmsEngine && window.BankSmsEngine.stats.isKeystoreProtected ? 'ACTIVE' : 'READY / MEMORY'}
            </span>
          </div>

          <!-- Pending Queue & Review Inbox Trigger -->
          <div class="flex items-center justify-between py-1 border-t border-slate-100 pt-3">
            <div>
              <div class="text-xs font-bold text-slate-900">Pending Transactions</div>
              <div class="text-[10px] text-slate-400">${(window.BankSmsEngine && window.BankSmsEngine.pendingCandidates.length) || 0} awaiting review</div>
            </div>
            <button onclick="window.openSmsReviewInbox()" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full active-press transition-all flex items-center gap-1 shadow-xs">
              <i data-lucide="inbox" class="w-3.5 h-3.5"></i>
              <span>Review (${(window.BankSmsEngine && window.BankSmsEngine.pendingCandidates.length) || 0})</span>
            </button>
          </div>

          <!-- Real-Time Diagnostics & Historical SMS Import Actions -->
          <div class="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            <button onclick="window.openSmsDiagnostics()" class="p-2.5 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/60 text-indigo-900 text-left transition-all active-press flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <i data-lucide="activity" class="w-4 h-4 text-indigo-600"></i>
                <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-200/70 text-indigo-800">تشخيص</span>
              </div>
              <div class="text-xs font-extrabold">حالة الاستقبال لحظياً</div>
              <div class="text-[10px] text-slate-500">فحص الصلاحيات وآخر بث</div>
            </button>

            <button onclick="window.openHistoricalSmsImport()" class="p-2.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/60 text-blue-900 text-left transition-all active-press flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <i data-lucide="history" class="w-4 h-4 text-blue-600"></i>
                <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-200/70 text-blue-800">استيراد</span>
              </div>
              <div class="text-xs font-extrabold">الرسائل القديمة</div>
              <div class="text-[10px] text-slate-500">فحص آمن على دفعات</div>
            </button>
          </div>

          <!-- Bank Allowlist Manager -->
          <div class="border-t border-slate-100 pt-3 space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-900">Allowed Bank Senders</label>
              <span class="text-[10px] text-slate-400">${(window.BankSmsEngine && window.BankSmsEngine.allowlist.length) || 0} enabled</span>
            </div>
            <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-100">
              ${(window.BankSmsEngine && window.BankSmsEngine.allowlist || []).map(b => `
                <span class="inline-flex items-center gap-1 text-[10px] font-bold bg-white text-slate-800 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  <span>${b}</span>
                  <button type="button" onclick="window.removeBankSender('${b}')" class="text-slate-400 hover:text-rose-600 font-black ml-0.5">&times;</button>
                </span>
              `).join('')}
            </div>
            <div class="flex gap-1.5 pt-1">
              <input type="text" id="new-bank-sender-input" placeholder="Add bank (e.g. ALEXBANK)" class="flex-1 text-[11px] font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 uppercase">
              <button type="button" onclick="window.addBankSender()" class="px-3 py-1.5 bg-[#111827] text-white text-[11px] font-bold rounded-xl active-press">Add</button>
            </div>
          </div>

          <!-- In-App Synthetic SMS Test Simulator -->
          <div class="border-t border-slate-100 pt-3 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <i data-lucide="flask-conical" class="w-3.5 h-3.5 text-indigo-600"></i>
                <span class="text-xs font-bold text-slate-900">SMS Parser Test Simulator</span>
              </div>
              <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">Dev & Demo</span>
            </div>
            <p class="text-[10px] text-slate-400">Test fabricated English & Arabic messages through the parser pipeline:</p>
            <div class="flex gap-2">
              <select id="sms-simulator-select" class="flex-1 text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer">
                <option value="0">CIB Purchase (EGP 1,250.50 at Amazon Egypt)</option>
                <option value="1">HSBC POS Debit (EGP 450.00 at Starbucks Arkan)</option>
                <option value="2">NBE Arabic + Eastern Numerals (١,٤٥٠.٠٠ ج.م لدى فودافون)</option>
                <option value="3">Banque Misr Arabic (850.00 جنيه لدى كارفور)</option>
                <option value="4">Amazon Refund (EGP 600.00 Income Credit)</option>
                <option value="5">Security OTP (Must be REJECTED)</option>
              </select>
              <button type="button" onclick="window.simulatePresetSms()" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl active-press transition-all shrink-0">
                Simulate
              </button>
            </div>
          </div>

        </div>

        <!-- SECTION 2: PREFERENCES -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div class="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div class="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <i data-lucide="sliders" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-xs font-extrabold text-slate-900 tracking-tight">Preferences</h3>
              <p class="text-[10px] text-slate-400">Display and currency format</p>
            </div>
          </div>

          <div class="flex items-center justify-between py-1">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <i data-lucide="coins" class="w-5 h-5"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-slate-900">Wallet Currency</div>
                <div class="text-[10px] text-slate-400">Used for balances and expenses</div>
              </div>
            </div>
            <select onchange="window.switchCurrency(this.value)" class="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 rounded-full px-3 py-1 outline-none cursor-pointer">
              <option value="EGP" ${currentCurrency === 'EGP' ? 'selected' : ''}>EGP</option>
              <option value="USD" ${currentCurrency === 'USD' ? 'selected' : ''}>USD ($)</option>
              <option value="EUR" ${currentCurrency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
              <option value="SAR" ${currentCurrency === 'SAR' ? 'selected' : ''}>SAR</option>
              <option value="AED" ${currentCurrency === 'AED' ? 'selected' : ''}>AED</option>
              <option value="GBP" ${currentCurrency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
            </select>
          </div>
        </div>

        <!-- SECTION 3: DATA & ACTIONS -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2.5">
          <div class="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div class="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <i data-lucide="database" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-xs font-extrabold text-slate-900 tracking-tight">Data Management</h3>
              <p class="text-[10px] text-slate-400">Export and session actions</p>
            </div>
          </div>

          <button onclick="window.WalletSecurity && window.WalletSecurity.lock()" class="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between text-xs font-bold border border-slate-200/70 transition-all active-press">
            <div class="flex items-center gap-2.5">
              <i data-lucide="lock" class="w-4 h-4 text-slate-600"></i>
              <span>Lock Wallet Session</span>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
          </button>

          <button onclick="window.exportTransactionsCSV()" class="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between text-xs font-bold border border-slate-200/70 transition-all active-press">
            <div class="flex items-center gap-2.5">
              <i data-lucide="download" class="w-4 h-4 text-emerald-600"></i>
              <span>Export Transactions (CSV)</span>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
          </button>

          <!-- Vault Backup & Restore Migration -->
          <div class="pt-2 border-t border-slate-100 space-y-2">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vault Backup & Migration (Browser &harr; Android)</p>
            
            <button onclick="window.exportEncryptedVaultBackup()" class="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between text-xs font-bold border border-slate-200/70 transition-all active-press">
              <div class="flex items-center gap-2.5">
                <i data-lucide="hard-drive-download" class="w-4 h-4 text-indigo-600"></i>
                <span>Export Encrypted Vault Backup (JSON)</span>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
            </button>

            <label class="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between text-xs font-bold border border-slate-200/70 transition-all active-press cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i data-lucide="hard-drive-upload" class="w-4 h-4 text-emerald-600"></i>
                <span>Import Vault Backup (Restore)</span>
              </div>
              <input type="file" accept=".json" onchange="window.importEncryptedVaultBackup(event)" class="hidden">
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
            </label>
          </div>

          <button onclick="window.clearAllData()" class="w-full p-3 rounded-2xl bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-100 flex items-center justify-between text-xs font-bold transition-all active-press">
            <div class="flex items-center gap-2.5">
              <i data-lucide="trash-2" class="w-4 h-4 text-rose-600"></i>
              <span>Clear All Wallet Data</span>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-rose-400"></i>
          </button>
        </div>

        <div class="text-center pt-2 text-[10px] text-slate-400 space-y-0.5">
          <p class="font-bold text-slate-500">ApexWallet — Visual Card-First Tracker</p>
          <p>Version 1.4.5 • Keystore Protected</p>
        </div>

      </div>
    `;

    // Hook up Biometric toggle
    const bioToggle = document.getElementById('settings-biometric-toggle');
    if (bioToggle) {
      bioToggle.addEventListener('change', async (e) => {
        if (bioToggle.checked) {
          const pin = prompt('Enter your 4-digit PIN to enable Biometrics (Face ID / Fingerprint):');
          if (!pin || pin.length !== 4) {
            bioToggle.checked = false;
            showToast('Biometric setup cancelled', 'info');
            return;
          }
          showToast('Scan your fingerprint or Face ID...', 'info');
          const res = await window.WalletSecurity.enableBiometrics(pin);
          if (res && res.success) {
            showToast('Biometric unlock enabled successfully!', 'success');
            renderSettingsView();
          } else {
            bioToggle.checked = false;
            showToast((res && res.error) || 'Failed to enable Biometrics', 'error');
          }
        } else {
          window.WalletSecurity.disableBiometrics();
          showToast('Biometrics disabled', 'info');
          renderSettingsView();
        }
      });
    }

    if (window.lucide) {
      try { lucide.createIcons(); } catch (e) {}
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
    const listEl = document.getElementById('sms-candidates-container');
    const counterEl = document.getElementById('sms-inbox-counter');
    if (!listEl) return;

    const candidates = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates) ? window.BankSmsEngine.pendingCandidates : [];
    if (counterEl) {
      counterEl.textContent = `${candidates.length} New`;
    }

    if (candidates.length === 0) {
      listEl.innerHTML = `
        <div class="py-10 text-center space-y-2">
          <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <i data-lucide="inbox" class="w-6 h-6"></i>
          </div>
          <p class="text-xs font-bold text-slate-700">Inbox is empty</p>
          <p class="text-[10px] text-slate-400 max-w-[220px] mx-auto">New incoming bank transactions will automatically appear here when received via SMS.</p>
        </div>
      `;
      if (window.lucide) {
        try { lucide.createIcons({ root: listEl }); } catch (e) {}
      }
      return;
    }

    const cards = store.cards || [];

    listEl.innerHTML = candidates.map(c => {
      const isCredit = c.type === 'income' || c.direction === 'income';
      let opTypeBadge = '';
      if (c.transactionType === 'withdrawal') {
        opTypeBadge = '<span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">🏧 سحب نقدي (ATM)</span>';
      } else if (c.transactionType === 'transfer') {
        opTypeBadge = '<span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">🔁 تحويل (Transfer)</span>';
      } else {
        opTypeBadge = isCredit
          ? '<span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">📥 وارد / استرداد</span>'
          : '<span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">🛍️ شراء (Purchase)</span>';
      }

      const needsCardSelection = c.requiresCardSelection || !c.matchedCardId;

      return `
        <div id="candidate-card-${c.id}" class="bg-slate-50 border ${needsCardSelection ? 'border-amber-300 ring-1 ring-amber-300/40' : 'border-slate-200'} rounded-2xl p-3.5 space-y-2.5 transition-all">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[11px] font-black tracking-tight text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">${c.bank}</span>
              ${opTypeBadge}
              ${c.isHistorical ? '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">استيراد قديم</span>' : ''}
              ${c.cardSuffix ? `<span class="text-[10px] font-mono text-slate-500 font-bold">•••• ${c.cardSuffix}</span>` : '<span class="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">اختر الكارت</span>'}
            </div>
            <span class="text-xs font-black font-mono ${isCredit ? 'text-emerald-600' : 'text-slate-900'} shrink-0 ml-2">
              ${isCredit ? '+' : '-'}${c.amount.toFixed(2)} ${c.currency}
            </span>
          </div>

          ${needsCardSelection ? `
            <div class="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 space-y-1.5 text-xs text-amber-900">
              <div class="flex items-start gap-1.5 font-bold text-[11px] text-amber-900">
                <i data-lucide="help-circle" class="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5"></i>
                <span>سبب عدم المطابقة: ${c.nonMatchReason || 'لا يوجد كارت أو حساب مسجل بهذه الأرقام لدى هذا البنك'}</span>
              </div>
              ${c.matchSuggestion ? `
                <div class="text-[10px] text-amber-800 flex items-center justify-between gap-2 pt-0.5 border-t border-amber-200/60">
                  <span>💡 ${c.matchSuggestion}</span>
                  ${c.suggestAddAccount ? `
                    <button type="button" onclick="window.openAddAccountPrompt('${c.suggestAddAccount.bankId || ''}', '${c.suggestAddAccount.digits || ''}', '${c.suggestAddAccount.position || 'last'}')" class="shrink-0 px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-lg text-[10px] font-bold active-press shadow-2xs">
                      + إضافة الحساب
                    </button>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${c.isPotentialDuplicate ? `
            <div class="bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-xs text-amber-900 space-y-1">
              <div class="flex items-center gap-1.5 font-bold text-amber-900">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-600"></i>
                <span>⚠️ تكرار محتمل (Possible Duplicate)</span>
              </div>
              <p class="text-[10px] text-amber-800 leading-tight">${c.potentialDuplicateReason || 'توجد عملية سابقة مسجلة بنفس المبلغ في المحفظة.'}</p>
              <div class="text-[9px] text-amber-700 bg-amber-100/60 p-1 rounded font-mono">
                المسجل سابقاً: ${c.potentialDuplicateMatch ? `${c.potentialDuplicateMatch.amount} EGP بتاريخ ${c.potentialDuplicateMatch.date} (${c.potentialDuplicateMatch.merchant})` : 'عملية بنفس القيمة'}
              </div>
            </div>
          ` : ''}

          <div class="space-y-1.5">
            <div>
              <label class="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Merchant / Reference</label>
              <input type="text" id="candidate-merchant-${c.id}" value="${c.merchant ? c.merchant.replace(/"/g, '&quot;') : (c.bank + ' Transaction')}" class="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-indigo-500">
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Assign Card</label>
                <select id="candidate-card-select-${c.id}" class="w-full text-[11px] font-bold text-slate-800 bg-white border ${needsCardSelection ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'} rounded-xl px-2 py-1.5 outline-none cursor-pointer">
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
                <label class="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Category</label>
                <select id="candidate-category-select-${c.id}" class="w-full text-[11px] font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2 py-1.5 outline-none cursor-pointer">
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

            <div class="text-[9px] text-slate-400 flex items-center justify-between px-0.5 pt-0.5">
              <span>Date: ${c.transactionTime || new Date(c.receiptTime).toLocaleString()}</span>
              <span>Ref: ${(c.fingerprint || '').slice(0, 10)}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-1 border-t border-slate-200/60">
            <button type="button" onclick="window.approveSmsCandidate('${c.id}')" class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl active-press transition-all flex items-center justify-center gap-1 shadow-xs">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              <span>Approve (Import)</span>
            </button>
            <button type="button" onclick="window.rejectSmsCandidate('${c.id}')" class="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-xl active-press transition-all flex items-center justify-center gap-1">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              <span>Reject</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) {
      try { lucide.createIcons({ root: listEl }); } catch (e) {}
    }
  }

  window.openSmsReviewInbox = () => {
    openModal('smsReview');
    renderSmsCandidatesList();
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

    const res = await window.BankSmsEngine.approveCandidate(candidateId, {
      cardId,
      accountId,
      merchant,
      category,
      transactionType: candidate ? candidate.transactionType : 'purchase',
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
  window.exportEncryptedVaultBackup = () => {
    const rawVault = localStorage.getItem('apexwallet_security_vault_v1');
    const userStore = localStorage.getItem('apexwallet_user_vault_v1');
    const currency = localStorage.getItem('wallet_currency') || 'EGP';

    const backupPayload = {
      app: 'ApexWallet',
      version: '1.4.5',
      exportedAt: new Date().toISOString(),
      encryptionNote: 'Master AES-GCM vault encrypted via PBKDF2 from 4-digit PIN.',
      securityVault: rawVault ? JSON.parse(rawVault) : null,
      userStore: userStore ? JSON.parse(userStore) : null,
      currency: currency
    };

    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apexwallet_vault_backup_v1.4_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Vault backup exported successfully! (Protected by your PIN)', 'success');
  };

  window.importEncryptedVaultBackup = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!confirm('استيراد النسخة الاحتياطية سيستبدل كافة البيانات الحالية في التطبيق. هل ترغب في المتابعة؟ (يُنصح بتصدير نسخة احتياطية أولاً)')) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || data.app !== 'ApexWallet' || (!data.securityVault && !data.userStore)) {
          showToast('ملف النسخة الاحتياطية غير صالح أو تالف.', 'error');
          return;
        }

        if (data.securityVault) {
          localStorage.setItem('apexwallet_security_vault_v1', JSON.stringify(data.securityVault));
        }
        if (data.userStore) {
          localStorage.setItem('apexwallet_user_vault_v1', JSON.stringify(data.userStore));
        }
        if (data.currency) {
          localStorage.setItem('wallet_currency', data.currency);
        }

        showToast('تم استيراد البيانات بنجاح! جاري إعادة التحميل...', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        showToast('خطأ أثناء قراءة ملف النسخة الاحتياطية: ' + err.message, 'error');
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
  const hash = window.location.hash.replace('#', '');
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
