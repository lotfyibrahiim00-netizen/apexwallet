/**
 * ApexWallet UI & Interaction Controller
 * Visual Card-First Aesthetic (Revolut & Telda Style)
 * - rounded-3xl for primary cards & sheets
 * - rounded-full for buttons, badges, and floating bottom nav
 * - Colors: #F9FAFB, #FFFFFF, #111827 (Charcoal), #10B981 (Emerald), #F43F5E (Soft Rose)
 */

function initApp() {
  try {
    const store = window.walletStore;

  // Selected featured card on Overview
  let activeFeaturedCardId = store.cards.length > 0 ? store.cards[0].id : null;
  let editingCardId = null;

  // --- Element Selectors ---
  const views = {
    dashboard: document.getElementById('view-dashboard'),
    cards: document.getElementById('view-cards'),
    history: document.getElementById('view-history')
  };

  const navButtons = document.querySelectorAll('.floating-nav-tab');
  const modals = {
    transaction: document.getElementById('modal-transaction'),
    bank: document.getElementById('modal-bank'),
    card: document.getElementById('modal-card'),
    quickActions: document.getElementById('modal-quick-actions'),
    customizeCard: document.getElementById('modal-customize-card'),
    'customize-card': document.getElementById('modal-customize-card')
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

  // Dynamic Card Modal Cycle Inputs
  function updateCardCycleInputs() {
    const cardType = document.querySelector('input[name="card-type"]:checked')?.value || 'credit';
    const cycleContainer = document.getElementById('card-cycle-section');
    if (!cycleContainer) return;

    if (cardType === 'credit') {
      cycleContainer.classList.remove('hidden');
    } else {
      cycleContainer.classList.add('hidden');
    }
  }

  document.querySelectorAll('input[name="card-type"]').forEach(radio => {
    radio.addEventListener('change', updateCardCycleInputs);
  });

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
      if (bankCards.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = `${bank.name} (${bankCards.length} cards)`;
        
        bankCards.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = `${c.name} (•••• ${c.last4}) - ${c.cardType.toUpperCase()}`;
          optgroup.appendChild(opt);
        });
        select.appendChild(optgroup);
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
    const cardId = document.getElementById('tx-card-select').value;
    const notes = document.getElementById('tx-notes')?.value || '';

    try {
      store.addTransaction({ amount, merchant, category, date, cardId, notes });
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
    const monthlyTarget = document.getElementById('card-target').value;
    const cycleStartDay = document.getElementById('card-cycle-start')?.value || 1;
    const cycleEndDay = document.getElementById('card-cycle-end')?.value || 30;
    const network = document.getElementById('card-network')?.value || 'Visa';

    try {
      const newCard = store.addCard({ bankId, name, last4, cardType, monthlyTarget, cycleStartDay, cycleEndDay, network });
      activeFeaturedCardId = newCard.id;
      closeModal('card');
      e.target.reset();
      showToast(`Card "${name}" added!`, 'success');
      renderCurrentView();
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
    }

    if (window.lucide) {
      try { lucide.createIcons(); } catch(e) { console.warn('Lucide icon error:', e); }
    }
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
        `;
      } else {
        container.innerHTML = `
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

                <!-- Spent vs Limit -->
                <p class="text-2xl font-bold mt-3.5 font-mono tracking-tight relative z-10">
                  ${formatCurrency(cardStat.spent)} 
                  <span class="text-xs font-normal opacity-80">/ ${formatCurrency(cardStat.target)}</span>
                </p>

                <!-- Slim Progress Bar -->
                <div class="w-full h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden relative z-10">
                  <div class="${cardStat.isExceeded ? 'bg-rose-400' : (cardStat.isWarning ? 'bg-amber-400' : 'bg-white')} h-full rounded-full transition-all duration-500 shadow-sm" style="width: ${cardStat.percentage}%;"></div>
                </div>

                <!-- Bottom Row: Last 4 & Billing Cycle -->
                <div class="flex justify-between text-[11px] opacity-80 mt-3 font-medium relative z-10">
                  <span class="font-mono">•••• ${card.last4}</span>
                  ${isCredit && card.cycleStartDay ? `
                    <span>Cycle: ${card.cycleStartDay}th → ${card.cycleEndDay}th</span>
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
                <span class="text-xs font-bold text-slate-900 font-mono tracking-tight shrink-0 ml-2">
                  -${formatCurrency(tx.amount)}
                </span>
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

                <!-- Cards List -->
                <div class="space-y-2.5">
                  ${cards.map(c => {
                    const cStat = store.getCardSpendingStats(c.id);
                    return `
                      <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-slate-900 truncate">${c.name}</span>
                            <span class="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold uppercase">${c.cardType}</span>
                          </div>
                          <p class="text-[10px] text-slate-400 font-mono mt-0.5">
                            •••• ${c.last4} ${c.cycleStartDay ? `• Cycle ${c.cycleStartDay}th–${c.cycleEndDay}th` : ''}
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

                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-900 font-mono">-${formatCurrency(tx.amount)}</span>
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
    if (confirm(`Delete card "${card.name}" (•••• ${card.last4})?`)) {
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

  // Sync currency dropdown in header
  const currSelect = document.getElementById('header-currency-select');
  if (currSelect) currSelect.value = currentCurrency;

  // Initial tab & modal
  const hash = window.location.hash.replace('#', '');
  const initialTab = hash === 'cards' || hash === 'history' ? hash : 'dashboard';
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
