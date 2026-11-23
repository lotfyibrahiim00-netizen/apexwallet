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
    quickActions: document.getElementById('modal-quick-actions')
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
    
    modal.classList.remove('pointer-events-none');
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
      modal.classList.add('pointer-events-none');
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
    setTimeout(() => openModal('transaction'), 150);
  });
  document.getElementById('qa-add-card')?.addEventListener('click', () => {
    closeModal('quickActions');
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
  // VIEW 1: OVERVIEW (VISUAL CARD-FIRST)
  // ==========================================
  function renderOverviewView() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    // Pick the active featured card (fallback to first card)
    let featuredCard = store.getCard(activeFeaturedCardId);
    if (!featuredCard && store.cards.length > 0) {
      featuredCard = store.cards[0];
      activeFeaturedCardId = featuredCard.id;
    }

    const featuredStats = featuredCard ? store.getCardSpendingStats(featuredCard.id) : null;
    const bank = featuredCard ? store.getBank(featuredCard.bankId) : null;

    // Build Secondary Cards Mini Pills (cards that are over limit or nearing limit or other cards)
    const otherCards = store.cards.filter(c => !featuredCard || c.id !== featuredCard.id);
    
    // Recent 5 transactions
    const recentTxs = store.getFilteredTransactions().slice(0, 5);

    container.innerHTML = `
      <div class="space-y-4">
        
        <!-- Quick Card Switcher Chips -->
        ${store.cards.length > 1 ? `
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            ${store.cards.map(c => {
              const isSelected = c.id === activeFeaturedCardId;
              const cStat = store.getCardSpendingStats(c.id);
              return `
                <button onclick="window.selectFeaturedCard('${c.id}')" class="px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                  isSelected 
                    ? 'bg-[#111827] text-white shadow-xs' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }">
                  ${c.name} ${cStat.isExceeded ? '⚠️' : ''}
                </button>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- 1. FEATURED CREDIT CARD VISUAL (EXACT DESIGN MATCH) -->
        ${featuredCard ? `
          <div class="bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white p-5 rounded-3xl shadow-lg shadow-indigo-200/50 relative overflow-hidden">
            <!-- Subtle glow circle -->
            <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

            <div class="flex justify-between items-center relative z-10">
              <span class="text-xs font-semibold opacity-85 tracking-wide">${bank ? bank.shortCode : ''} ${featuredCard.name}</span>
              <span class="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider backdrop-blur-xs">
                ${featuredCard.cardType}
              </span>
            </div>

            <p class="text-2xl font-bold mt-4 font-mono tracking-tight relative z-10">
              ${formatCurrency(featuredStats.spent)} 
              <span class="text-xs font-normal opacity-80">/ ${formatCurrency(featuredStats.target)}</span>
            </p>

            <!-- Slim Progress Bar -->
            <div class="w-full h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden relative z-10">
              <div class="${featuredStats.isExceeded ? 'bg-rose-400' : 'bg-white'} h-full rounded-full transition-all duration-500 shadow-sm" style="width: ${featuredStats.percentage}%;"></div>
            </div>

            <div class="flex justify-between text-[11px] opacity-80 mt-3 font-medium relative z-10">
              <span class="font-mono">•••• ${featuredCard.last4}</span>
              ${featuredCard.cardType === 'credit' && featuredCard.cycleStartDay ? `
                <span>Cycle: ${featuredCard.cycleStartDay}th → ${featuredCard.cycleEndDay}th</span>
              ` : `
                <span>${featuredCard.network || 'VISA'}</span>
              `}
            </div>
          </div>
        ` : `
          <div class="bg-white p-6 rounded-3xl border border-slate-200 text-center">
            <p class="text-xs text-slate-500 font-semibold">No cards added yet</p>
            <button onclick="window.openModal('card')" class="mt-3 px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-full">
              + Add First Card
            </button>
          </div>
        `}

        <!-- 2. SECONDARY CARD MINI PILLS (OVER LIMIT / WARNING STATES) -->
        <div class="space-y-2.5">
          ${otherCards.map(c => {
            const cStat = store.getCardSpendingStats(c.id);
            const isExceeded = cStat.isExceeded;
            const isWarning = cStat.isWarning;

            if (isExceeded) {
              return `
                <div onclick="window.selectFeaturedCard('${c.id}')" class="bg-white p-4 rounded-2xl border border-rose-200 flex justify-between items-center shadow-2xs hover:border-rose-300 transition-all cursor-pointer">
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
            } else if (isWarning) {
              return `
                <div onclick="window.selectFeaturedCard('${c.id}')" class="bg-white p-4 rounded-2xl border border-amber-200 flex justify-between items-center shadow-2xs hover:border-amber-300 transition-all cursor-pointer">
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
            } else {
              return `
                <div onclick="window.selectFeaturedCard('${c.id}')" class="bg-white p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center shadow-2xs hover:border-slate-200 transition-all cursor-pointer">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-slate-800">${c.name} ••${c.last4}</span>
                      <span class="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Safe</span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-0.5">
                      ${formatCurrency(cStat.spent)} / ${formatCurrency(cStat.target)}
                    </p>
                  </div>
                  <span class="text-xs font-semibold text-slate-600 font-mono">${Math.round(cStat.rawPercentage)}%</span>
                </div>
              `;
            }
          }).join('')}
        </div>

        <!-- 3. CLEAN ACTIVITY (EXACT DESIGN MATCH) -->
        <div class="space-y-2.5 pt-1">
          <div class="flex justify-between items-center">
            <p class="text-xs font-bold text-slate-800 uppercase tracking-wider">Card Activity</p>
            <button onclick="window.switchTab('history')" class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800">
              See All &rarr;
            </button>
          </div>

          ${recentTxs.length === 0 ? `
            <div class="bg-white p-4 rounded-2xl text-center text-xs text-slate-400 border border-slate-100">
              No transactions logged yet
            </div>
          ` : recentTxs.map(tx => {
            const isCredit = tx.card && tx.card.cardType === 'credit';
            const stmtName = (tx.statementInfo && tx.statementInfo.statementMonthName) ? tx.statementInfo.statementMonthName.substring(0, 3) : 'Dec';
            const isCurrentCycle = tx.statementInfo && tx.statementInfo.statementMonth === 12;

            return `
              <div class="bg-white p-3.5 rounded-2xl flex justify-between items-center shadow-2xs border border-slate-100/80 hover:shadow-xs transition-all">
                <div>
                  <p class="text-xs font-bold text-slate-900 leading-tight">${tx.merchant}</p>
                  ${isCredit ? `
                    <span class="text-[10px] ${isCurrentCycle ? 'text-indigo-600' : 'text-slate-400'} font-semibold">
                      Affects ${stmtName} Statement
                    </span>
                  ` : `
                    <span class="text-[10px] text-slate-400 font-medium">
                      Debit Card • ${tx.card ? tx.card.name : ''}
                    </span>
                  `}
                </div>
                <span class="text-xs font-bold text-slate-900 font-mono tracking-tight shrink-0 ml-2">
                  -${formatCurrency(tx.amount)}
                </span>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  }

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
          ${store.banks.map(bank => {
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
                          <button onclick="window.confirmDeleteCard('${c.id}')" class="text-slate-300 hover:text-rose-500 block ml-auto mt-1">
                            <i data-lucide="x" class="w-3 h-3"></i>
                          </button>
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
            <div class="bg-white p-6 rounded-3xl text-center text-xs text-slate-400 border border-slate-200">
              No matching transactions found
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
    const currBadge = document.getElementById('current-currency-display');
    if (currBadge) currBadge.textContent = newCurr;
    showToast(`Currency: ${newCurr}`, 'success');
    renderCurrentView();
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
