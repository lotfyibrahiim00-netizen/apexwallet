/**
 * UI Renderer & Interactions Controller
 * Handles View Switching, Modals, Dynamic Previews, and Dom Updates
 */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.walletStore;

  // --- Element Selectors ---
  const views = {
    dashboard: document.getElementById('view-dashboard'),
    cards: document.getElementById('view-cards'),
    history: document.getElementById('view-history'),
    analytics: document.getElementById('view-analytics')
  };

  const navButtons = document.querySelectorAll('.nav-btn');
  const modals = {
    transaction: document.getElementById('modal-transaction'),
    bank: document.getElementById('modal-bank'),
    card: document.getElementById('modal-card'),
    quickActions: document.getElementById('modal-quick-actions'),
    cardDetails: document.getElementById('modal-card-details')
  };

  // --- Toast System ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-slate-900 text-white' : (type === 'error' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white');
    const iconName = type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-triangle' : 'info');

    toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-medium tracking-wide transform transition-all duration-300 translate-y-3 opacity-0 ${bgClass}`;
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
    
    // Update nav buttons
    navButtons.forEach(btn => {
      const tab = btn.dataset.tab;
      const icon = btn.querySelector('.nav-icon-wrapper');
      const label = btn.querySelector('.nav-label');
      
      if (tab === targetTab) {
        btn.classList.add('text-emerald-600');
        btn.classList.remove('text-slate-400');
        if (icon) icon.classList.add('bg-emerald-50', 'text-emerald-600');
      } else {
        btn.classList.remove('text-emerald-600');
        btn.classList.add('text-slate-400');
        if (icon) icon.classList.remove('bg-emerald-50', 'text-emerald-600');
      }
    });

    // Toggle views
    Object.keys(views).forEach(k => {
      if (views[k]) {
        if (k === targetTab) {
          views[k].classList.remove('hidden');
        } else {
          views[k].classList.add('hidden');
        }
      }
    });

    // Re-render current view
    renderCurrentView();

    // Scroll mobile viewport to top smoothly
    const scrollContainer = document.getElementById('mobile-scroll-body');
    if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Refresh dynamic dropdowns or icons if needed
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

  // Center "+" Action Button: Open Action Sheet or Transaction modal
  const fabBtn = document.getElementById('fab-add-btn');
  if (fabBtn) {
    fabBtn.addEventListener('click', () => {
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
    const previewIcon = document.getElementById('tx-cycle-preview-icon');

    if (!cardSelect || !dateInput || !previewBox) return;

    const cardId = cardSelect.value;
    const dateVal = dateInput.value;
    const card = store.getCard(cardId);

    if (card && card.cardType === 'credit' && card.cycleStartDay && card.cycleEndDay) {
      const info = calculateBillingStatement(dateVal, card.cycleStartDay, card.cycleEndDay);
      if (info) {
        previewBox.classList.remove('hidden');
        previewBox.className = 'mt-3 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/60 text-indigo-950 flex items-start gap-2.5 transition-all';
        previewIcon.className = 'w-4 h-4 text-indigo-600 mt-0.5 shrink-0';
        previewBadge.innerHTML = `
          <span class="inline-flex items-center gap-1 font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded-full text-[11px] shadow-sm border border-indigo-100">
            ⚡ ${info.statementFullBadge}
          </span>
        `;
        previewRange.innerHTML = `
          <span class="text-[11px] text-slate-600 mt-0.5 block">
            Billing Period: <strong>${info.cycleRange}</strong>. Automatically grouped into this month's statement.
          </span>
        `;
      }
    } else if (card) {
      previewBox.classList.remove('hidden');
      previewBox.className = 'mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2.5 transition-all';
      previewIcon.className = 'w-4 h-4 text-slate-500 mt-0.5 shrink-0';
      const parts = (dateVal || '').split('-');
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const mName = monthNames[parseInt(parts[1], 10) - 1] || 'Current';
      previewBadge.innerHTML = `
        <span class="inline-flex items-center gap-1 font-medium text-slate-700 bg-white px-2 py-0.5 rounded-full text-[11px] shadow-sm border border-slate-200">
          💳 ${card.cardType.toUpperCase()} • ${mName} ${parts[0]}
        </span>
      `;
      previewRange.innerHTML = `
        <span class="text-[11px] text-slate-500 mt-0.5 block">
          Direct debit/prepaid debit logged against calendar month.
        </span>
      `;
    } else {
      previewBox.classList.add('hidden');
    }
  }

  document.getElementById('tx-card-select')?.addEventListener('change', updateTxCyclePreview);
  document.getElementById('tx-date')?.addEventListener('input', updateTxCyclePreview);

  // Quick Merchant Chips in Transaction Modal
  document.querySelectorAll('.quick-merchant-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const merchantInput = document.getElementById('tx-merchant');
      const categorySelect = document.getElementById('tx-category');
      if (merchantInput) merchantInput.value = chip.dataset.merchant;
      if (categorySelect && chip.dataset.category) categorySelect.value = chip.dataset.category;
    });
  });

  // --- Dynamic Card Modal Cycle Inputs ---
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
      document.querySelectorAll('.bank-color-swatch').forEach(s => s.classList.remove('ring-4', 'ring-indigo-200', 'scale-110'));
      swatch.classList.add('ring-4', 'ring-indigo-200', 'scale-110');
      const customInput = document.getElementById('bank-color-custom');
      if (customInput) customInput.value = swatch.dataset.color;
    });
  });

  // --- Populate Dropdowns ---
  function populateTransactionModalDropdowns() {
    const select = document.getElementById('tx-card-select');
    if (!select) return;

    select.innerHTML = '';
    
    // Group cards by bank
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

    // Default date to today
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
      opt.textContent = `${bank.name} (${cards.length}/3 cards)${isFull ? ' - CAP REACHED' : ''}`;
      if (isFull) {
        opt.disabled = true;
      }
      if (preselectedBankId && bank.id === preselectedBankId && !isFull) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });
  }

  // --- Form Handlers ---
  // 1. Transaction Form
  document.getElementById('form-add-transaction')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('tx-amount').value;
    const merchant = document.getElementById('tx-merchant').value;
    const category = document.getElementById('tx-category').value;
    const date = document.getElementById('tx-date').value;
    const cardId = document.getElementById('tx-card-select').value;
    const notes = document.getElementById('tx-notes')?.value || '';

    try {
      store.addTransaction({
        amount,
        merchant,
        category,
        date,
        cardId,
        notes
      });

      closeModal('transaction');
      e.target.reset();
      showToast(`Transaction of ${formatCurrency(amount)} logged!`, 'success');
      renderCurrentView();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // 2. Bank Form
  document.getElementById('form-add-bank')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bank-name').value;
    const shortCode = document.getElementById('bank-code').value;
    const accentColor = document.getElementById('bank-color-custom').value;

    try {
      store.addBank({ name, shortCode, accentColor });
      closeModal('bank');
      e.target.reset();
      showToast(`Bank "${name}" added successfully!`, 'success');
      renderCurrentView();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // 3. Card Form
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
      store.addCard({
        bankId,
        name,
        last4,
        cardType,
        monthlyTarget,
        cycleStartDay,
        cycleEndDay,
        network
      });

      closeModal('card');
      e.target.reset();
      showToast(`Card "${name}" (•••• ${last4}) added!`, 'success');
      renderCurrentView();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // --- Filter Dropdown Population & Change Listeners ---
  function setupFilterBar() {
    const accountFilter = document.getElementById('filter-account');
    const statementFilter = document.getElementById('filter-statement');

    if (accountFilter) {
      // Keep value if possible
      const prevVal = store.selectedAccountFilter;
      accountFilter.innerHTML = '<option value="all">💳 All Accounts</option>';

      // Banks group
      const bankGroup = document.createElement('optgroup');
      bankGroup.label = '── Banks ──';
      store.banks.forEach(b => {
        const opt = document.createElement('option');
        opt.value = `bank:${b.id}`;
        opt.textContent = `🏛️ Bank: ${b.name}`;
        bankGroup.appendChild(opt);
      });
      accountFilter.appendChild(bankGroup);

      // Cards group
      const cardGroup = document.createElement('optgroup');
      cardGroup.label = '── Specific Cards ──';
      store.cards.forEach(c => {
        const bank = store.getBank(c.bankId);
        const opt = document.createElement('option');
        opt.value = `card:${c.id}`;
        opt.textContent = `💳 ${c.name} (•••• ${c.last4}) [${bank ? bank.shortCode : ''}]`;
        cardGroup.appendChild(opt);
      });
      accountFilter.appendChild(cardGroup);

      accountFilter.value = prevVal;

      accountFilter.onchange = (e) => {
        store.selectedAccountFilter = e.target.value;
        renderCurrentView();
      };
    }

    if (statementFilter) {
      const prevVal = store.selectedStatementFilter;
      statementFilter.innerHTML = '<option value="all">🗓️ All Periods</option>';

      const months = store.getAvailableStatementMonths();
      months.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.key;
        opt.textContent = `⚡ ${m.badge}`;
        statementFilter.appendChild(opt);
      });

      statementFilter.value = prevVal;

      statementFilter.onchange = (e) => {
        store.selectedStatementFilter = e.target.value;
        renderCurrentView();
      };
    }
  }

  // --- Rendering Core Views ---
  function renderCurrentView() {
    setupFilterBar();
    
    if (store.activeTab === 'dashboard') {
      renderDashboard();
    } else if (store.activeTab === 'cards') {
      renderCardsView();
    } else if (store.activeTab === 'history') {
      renderHistoryView();
    }

    if (window.lucide) lucide.createIcons();
  }

  // ==========================================
  // VIEW 1: DASHBOARD
  // ==========================================
  function renderDashboard() {
    const stats = store.getOverallStats();
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    // 1. Alert Banner for Exceeded Target
    const alertBannerContainer = document.getElementById('dashboard-alert-banner');
    if (alertBannerContainer) {
      if (stats.exceededCards.length > 0) {
        const topExceeded = stats.exceededCards[0];
        alertBannerContainer.innerHTML = `
          <div class="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 shadow-sm animate-pulse-subtle flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
              <i data-lucide="alert-triangle" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-rose-800 uppercase tracking-wider">Target Exceeded</span>
                <span class="text-[10px] font-semibold bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                  ${Math.round(topExceeded.rawPercentage)}% Used
                </span>
              </div>
              <p class="text-xs text-rose-900 mt-1 font-medium leading-relaxed">
                <strong>${topExceeded.card.name}</strong> has surpassed its limit of ${formatCurrency(topExceeded.target)}.
              </p>
              <div class="mt-2 flex items-center justify-between pt-1 border-t border-rose-200/60 text-xs">
                <span class="text-rose-700 font-semibold">Over-limit by ${formatCurrency(topExceeded.overAmount)}</span>
                <button onclick="window.filterByCard('${topExceeded.card.id}')" class="text-rose-800 underline font-semibold text-[11px] hover:text-rose-950">
                  Inspect Card &rarr;
                </button>
              </div>
            </div>
          </div>
        `;
      } else if (stats.warningCards.length > 0) {
        const topWarn = stats.warningCards[0];
        alertBannerContainer.innerHTML = `
          <div class="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-sm flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
              <i data-lucide="alert-circle" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-amber-800 uppercase tracking-wider">Nearing Target (80%+)</span>
                <span class="text-[10px] font-semibold bg-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                  ${Math.round(topWarn.rawPercentage)}%
                </span>
              </div>
              <p class="text-xs text-amber-900 mt-1 font-medium">
                <strong>${topWarn.card.name}</strong> is close to limit. Only ${formatCurrency(topWarn.remaining)} left.
              </p>
            </div>
          </div>
        `;
      } else {
        alertBannerContainer.innerHTML = '';
      }
    }

    // 2. Summary Metrics Cards
    const totalSpentEl = document.getElementById('stat-total-spent');
    const totalCountEl = document.getElementById('stat-total-count');
    const subtitleSpentEl = document.getElementById('stat-spent-subtitle');
    const subtitleCountEl = document.getElementById('stat-count-subtitle');

    if (totalSpentEl) totalSpentEl.textContent = formatCurrency(stats.totalSpent);
    if (totalCountEl) totalCountEl.textContent = stats.totalCount;

    if (subtitleSpentEl) {
      if (store.selectedStatementFilter !== 'all') {
        const monthObj = store.getAvailableStatementMonths().find(m => m.key === store.selectedStatementFilter);
        subtitleSpentEl.textContent = `In ${monthObj ? monthObj.badge : store.selectedStatementFilter}`;
      } else {
        subtitleSpentEl.textContent = `Across filtered period`;
      }
    }

    if (subtitleCountEl) {
      const avg = stats.totalCount > 0 ? (stats.totalSpent / stats.totalCount) : 0;
      subtitleCountEl.textContent = `Avg ${formatCurrency(avg)}/tx`;
    }

    // 3. Target & Limit Progress Tracker
    const overallProgressContainer = document.getElementById('target-limit-tracker');
    if (overallProgressContainer) {
      const percent = Math.min(stats.rawPercentage, 100);
      let barColor = 'bg-emerald-500';
      let statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">Healthy (${Math.round(stats.rawPercentage)}%)</span>`;

      if (stats.isExceeded) {
        barColor = 'bg-rose-500';
        statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">🚨 Exceeded (+${formatCurrency(stats.overAmount)})</span>`;
      } else if (stats.isWarning) {
        barColor = 'bg-amber-500';
        statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">⚠️ Warning (${Math.round(stats.rawPercentage)}%)</span>`;
      }

      overallProgressContainer.innerHTML = `
        <div class="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 mb-4">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-xs font-bold text-slate-800 tracking-wide uppercase">Monthly Target Tracker</h3>
              <p class="text-[11px] text-slate-400">Combined budget across ${stats.activeCardsCount} cards</p>
            </div>
            ${statusBadge}
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-slate-100 rounded-full h-3.5 p-0.5 overflow-hidden my-3 border border-slate-200/60">
            <div class="${barColor} h-full rounded-full transition-all duration-500 shadow-inner" style="width: ${percent}%;"></div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-600">
            <div>
              <span class="text-[10px] text-slate-400 block font-medium">TOTAL SPENT</span>
              <span class="font-bold text-slate-900">${formatCurrency(stats.totalSpent)}</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-slate-400 block font-medium">MONTHLY TARGET</span>
              <span class="font-bold text-slate-900">${formatCurrency(stats.totalTarget)}</span>
            </div>
          </div>

          ${stats.isExceeded ? `
            <div class="mt-3 py-2 px-3 bg-rose-50 rounded-xl border border-rose-200/60 text-[11px] font-semibold text-rose-800 flex items-center justify-between">
              <span>Over Budget Amount:</span>
              <span class="text-rose-900 font-bold">${formatCurrency(stats.overAmount)}</span>
            </div>
          ` : `
            <div class="mt-3 py-1.5 px-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
              <span>Remaining Safe Budget:</span>
              <span class="text-emerald-700 font-semibold">${formatCurrency(stats.remaining)}</span>
            </div>
          `}
        </div>

        <!-- Per Card Breakdown Mini Cards -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2.5 px-1">
            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Per-Card Spending vs Limits</h4>
            <span class="text-[11px] text-slate-400 font-medium">${store.cards.length} active cards</span>
          </div>
          <div class="space-y-2.5">
            ${store.cards.map(card => {
              const cardStat = store.getCardSpendingStats(card.id, store.selectedStatementFilter);
              const bank = store.getBank(card.bankId);
              let cBar = 'bg-emerald-500';
              let badge = `<span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">${Math.round(cardStat.rawPercentage)}%</span>`;

              if (cardStat.isExceeded) {
                cBar = 'bg-rose-500';
                badge = `<span class="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Exceeded (+${formatCurrency(cardStat.overAmount)})</span>`;
              } else if (cardStat.isWarning) {
                cBar = 'bg-amber-500';
                badge = `<span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Warning ${Math.round(cardStat.rawPercentage)}%</span>`;
              }

              return `
                <div class="bg-white p-3 rounded-2xl border border-slate-200/70 shadow-2xs hover:shadow-xs transition-all">
                  <div class="flex items-center justify-between mb-1.5">
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="w-3 h-3 rounded-full shrink-0" style="background-color: ${bank ? bank.accentColor : '#002D62'}"></div>
                      <span class="text-xs font-bold text-slate-800 truncate">${card.name}</span>
                      <span class="text-[10px] text-slate-400 font-mono">•••• ${card.last4}</span>
                    </div>
                    ${badge}
                  </div>

                  <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1.5">
                    <div class="${cBar} h-full rounded-full transition-all duration-300" style="width: ${cardStat.percentage}%;"></div>
                  </div>

                  <div class="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Spent: <strong class="text-slate-800">${formatCurrency(cardStat.spent)}</strong></span>
                    <span>Target: <strong class="text-slate-700">${formatCurrency(cardStat.target)}</strong></span>
                  </div>

                  ${card.cardType === 'credit' && card.cycleStartDay ? `
                    <div class="mt-1.5 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Cycle: Day ${card.cycleStartDay}–${card.cycleEndDay}</span>
                      <span class="text-indigo-600 font-medium">Smart Statement Active</span>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // 4. Recent Transactions Preview (Top 5)
    const recentTxContainer = document.getElementById('dashboard-recent-tx-list');
    if (recentTxContainer) {
      const recentTxs = store.getFilteredTransactions().slice(0, 5);

      if (recentTxs.length === 0) {
        recentTxContainer.innerHTML = `
          <div class="p-8 text-center bg-white rounded-3xl border border-slate-200/80">
            <div class="w-12 h-12 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-2">
              <i data-lucide="receipt" class="w-6 h-6"></i>
            </div>
            <p class="text-xs font-semibold text-slate-600">No transactions recorded</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Tap + to log your first transaction</p>
          </div>
        `;
      } else {
        recentTxContainer.innerHTML = recentTxs.map(tx => renderTransactionItemHTML(tx, true)).join('');
      }
    }
  }

  // ==========================================
  // VIEW 2: CARDS & BANKS
  // ==========================================
  function renderCardsView() {
    const container = document.getElementById('cards-banks-list');
    if (!container) return;

    if (store.banks.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center bg-white rounded-3xl border border-slate-200">
          <p class="text-xs font-semibold text-slate-600">No banks added yet</p>
          <button onclick="window.openModal('bank')" class="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-2xl">
            Add Your First Bank
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = store.banks.map(bank => {
      const cards = store.getCardsForBank(bank.id);
      const isCapReached = cards.length >= 3; // 3-CARD CAP ENFORCED!
      const capBadge = isCapReached 
        ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">3/3 Max Cap</span>`
        : `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">${cards.length}/3 Cards</span>`;

      return `
        <div class="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 mb-4 transition-all">
          <!-- Bank Header -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-xs" style="background-color: ${bank.accentColor}">
                ${bank.shortCode.substring(0, 3)}
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 leading-tight">${bank.name}</h3>
                <span class="text-[10px] text-slate-400 font-mono tracking-wider">${bank.shortCode}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              ${capBadge}
              <!-- Bank Options / Delete -->
              <button onclick="window.confirmDeleteBank('${bank.id}')" class="text-slate-300 hover:text-rose-500 p-1 transition-colors" title="Delete Bank">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- Cards List for this Bank -->
          <div class="space-y-3">
            ${cards.map(card => renderVirtualCardHTML(card, bank)).join('')}
          </div>

          <!-- Add Card Button for this Bank (Disabled if 3 cards already exist) -->
          <div class="mt-3.5 pt-2">
            ${isCapReached ? `
              <div class="w-full py-2.5 px-3 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-400 text-xs font-medium cursor-not-allowed flex items-center justify-center gap-2">
                <i data-lucide="lock" class="w-3.5 h-3.5"></i>
                <span>3 Cards Maximum Reached for ${bank.shortCode}</span>
              </div>
            ` : `
              <button onclick="window.openAddCardForBank('${bank.id}')" class="w-full py-2.5 px-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 text-center text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-98">
                <i data-lucide="plus" class="w-4 h-4 text-emerald-600"></i>
                <span>Add Card (${cards.length}/3)</span>
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  // Virtual Luxury Card Template
  function renderVirtualCardHTML(card, bank) {
    const stats = store.getCardSpendingStats(card.id);
    const accent = bank ? bank.accentColor : '#002D62';
    
    // Card gradient styling based on accent color
    const isCredit = card.cardType === 'credit';
    const typeLabel = card.cardType.toUpperCase();
    
    return `
      <div class="relative overflow-hidden rounded-2xl p-4 text-white shadow-md transition-all hover:scale-[1.01]" style="background: linear-gradient(135deg, ${accent} 0%, #0F172A 100%);">
        <!-- Background subtle chip pattern -->
        <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

        <!-- Top Row: Bank Code & Type Badge -->
        <div class="flex items-center justify-between mb-3 relative z-10">
          <span class="text-xs font-black tracking-widest uppercase opacity-90">${bank ? bank.shortCode : 'BANK'}</span>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider">
              ${typeLabel}
            </span>
            <button onclick="window.confirmDeleteCard('${card.id}')" class="text-white/60 hover:text-white p-0.5 transition-colors" title="Delete Card">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- Middle Row: Chip & Contactless -->
        <div class="flex items-center justify-between my-2 relative z-10">
          <!-- Metallic EMV Chip -->
          <div class="w-9 h-6 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 shadow-inner border border-amber-300 flex items-center justify-center">
            <div class="w-7 h-4 border border-amber-600/40 rounded-[2px] grid grid-cols-2 gap-0.5 opacity-60">
              <div class="border-r border-amber-700/40"></div>
              <div></div>
            </div>
          </div>
          <!-- Contactless Symbol -->
          <i data-lucide="wifi" class="w-4 h-4 text-white/70 rotate-90"></i>
        </div>

        <!-- Card Number Emboss -->
        <div class="my-2 tracking-[0.2em] font-mono text-sm font-bold text-white/90 drop-shadow-sm relative z-10">
          •••• •••• •••• ${card.last4}
        </div>

        <!-- Bottom Row: Cardholder Nickname & Network -->
        <div class="flex items-end justify-between mt-2 pt-2 border-t border-white/10 relative z-10">
          <div>
            <div class="text-[9px] uppercase tracking-wider text-white/60">Card Nickname</div>
            <div class="text-xs font-bold tracking-wide">${card.name}</div>
          </div>
          <div class="text-right">
            <span class="text-[10px] font-bold tracking-widest text-white/90 uppercase">${card.network || 'VISA'}</span>
          </div>
        </div>

        <!-- Card Spending & Smart Cycle Footer Pill -->
        <div class="mt-3 pt-2.5 border-t border-white/15 text-[11px] relative z-10">
          <div class="flex items-center justify-between mb-1">
            <span class="text-white/70">Limit: ${formatCurrency(card.monthlyTarget)}</span>
            <span class="${stats.isExceeded ? 'text-rose-300 font-bold' : (stats.isWarning ? 'text-amber-300 font-bold' : 'text-emerald-300 font-semibold')}">
              ${stats.isExceeded ? `🚨 Over: +${formatCurrency(stats.overAmount)}` : `Spent: ${formatCurrency(stats.spent)}`}
            </span>
          </div>

          <!-- Micro Progress Bar on Card -->
          <div class="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div class="${stats.isExceeded ? 'bg-rose-400' : (stats.isWarning ? 'bg-amber-400' : 'bg-emerald-400')} h-full" style="width: ${stats.percentage}%;"></div>
          </div>

          ${isCredit && card.cycleStartDay ? `
            <div class="mt-2 flex items-center justify-between text-[10px] text-white/80">
              <span>🗓️ Cycle: Day ${card.cycleStartDay} to ${card.cycleEndDay}</span>
              <span class="underline decoration-white/40 cursor-pointer" onclick="window.filterByCard('${card.id}')">View Transactions &rarr;</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // ==========================================
  // VIEW 3: HISTORY
  // ==========================================
  function renderHistoryView() {
    const listContainer = document.getElementById('history-tx-list');
    const summaryBadge = document.getElementById('history-count-badge');
    if (!listContainer) return;

    const filtered = store.getFilteredTransactions();
    const totalSum = filtered.reduce((acc, t) => acc + t.amount, 0);

    if (summaryBadge) {
      summaryBadge.innerHTML = `<strong>${filtered.length}</strong> transactions • <strong>${formatCurrency(totalSum)}</strong>`;
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="p-8 text-center bg-white rounded-3xl border border-slate-200/80">
          <div class="w-12 h-12 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-2">
            <i data-lucide="search-x" class="w-6 h-6"></i>
          </div>
          <p class="text-xs font-semibold text-slate-600">No matching transactions</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Try clearing your filters or search terms</p>
          <button onclick="window.resetFilters()" class="mt-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl">
            Reset Filters
          </button>
        </div>
      `;
      return;
    }

    // Group transactions by date
    const groups = {};
    filtered.forEach(tx => {
      const d = tx.date;
      if (!groups[d]) groups[d] = [];
      groups[d].push(tx);
    });

    const sortedDates = Object.keys(groups).sort().reverse();

    listContainer.innerHTML = sortedDates.map(dateKey => {
      const txs = groups[dateKey];
      const dateLabel = formatDateHeader(dateKey);

      return `
        <div class="mb-4">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
            <span>${dateLabel}</span>
            <span>${txs.length} items</span>
          </div>
          <div class="space-y-2">
            ${txs.map(t => renderTransactionItemHTML(t, false)).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  function formatDateHeader(dateStr) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';

    const parts = dateStr.split('-');
    const dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Single Transaction HTML Row
  function renderTransactionItemHTML(tx, compact = false) {
    const cat = CATEGORIES[tx.category] || CATEGORIES.other;
    const isCredit = tx.card && tx.card.cardType === 'credit';
    const stmt = tx.statementInfo;
    const bank = tx.bank;

    return `
      <div class="bg-white p-3 rounded-2xl border border-slate-200/70 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3">
        <!-- Category Icon Box -->
        <div class="w-10 h-10 rounded-2xl ${cat.bg} border ${cat.border} flex items-center justify-center shrink-0 ${cat.text}">
          <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
        </div>

        <!-- Middle Details -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-slate-900 truncate">${tx.merchant}</h4>
            <span class="text-xs font-extrabold text-slate-900 font-mono tracking-tight shrink-0 ml-2">
              -${formatCurrency(tx.amount)}
            </span>
          </div>

          <!-- Bank & Card & Category Subtitle -->
          <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span class="text-[10px] text-slate-500 font-medium">
              ${bank ? bank.shortCode : ''} • ${tx.card ? tx.card.name : 'Unknown Card'}
            </span>
            <span class="text-slate-300">•</span>
            <span class="text-[10px] text-slate-400 font-mono">•••• ${tx.card ? tx.card.last4 : '0000'}</span>
          </div>

          <!-- SMART STATEMENT CYCLE BADGE -->
          <div class="mt-1.5 flex items-center gap-1.5 flex-wrap">
            ${isCredit && stmt ? `
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs" title="${stmt.cycleRange}">
                <i data-lucide="zap" class="w-2.5 h-2.5 text-indigo-500"></i>
                <span>${stmt.statementBadge}</span>
              </span>
            ` : `
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                <i data-lucide="credit-card" class="w-2.5 h-2.5 text-slate-400"></i>
                <span>${tx.card ? tx.card.cardType.toUpperCase() : 'DEBIT'}</span>
              </span>
            `}

            ${tx.notes ? `
              <span class="text-[10px] text-slate-400 italic truncate max-w-[140px]">"${tx.notes}"</span>
            ` : ''}
          </div>
        </div>

        <!-- Delete Action -->
        ${!compact ? `
          <button onclick="window.confirmDeleteTx('${tx.id}')" class="text-slate-300 hover:text-rose-500 p-1 shrink-0 transition-colors" title="Delete">
            <i data-lucide="trash" class="w-3.5 h-3.5"></i>
          </button>
        ` : ''}
      </div>
    `;
  }

  // --- Search Input Listener in History ---
  const searchInput = document.getElementById('history-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      store.searchQuery = e.target.value;
      renderHistoryView();
      if (window.lucide) lucide.createIcons();
    });
  }

  // --- Global Helper Actions for Onclick Handlers ---
  window.resetFilters = () => {
    store.selectedAccountFilter = 'all';
    store.selectedStatementFilter = 'all';
    store.searchQuery = '';
    if (searchInput) searchInput.value = '';
    const acc = document.getElementById('filter-account');
    const stmt = document.getElementById('filter-statement');
    if (acc) acc.value = 'all';
    if (stmt) stmt.value = 'all';
    renderCurrentView();
  };

  window.filterByCard = (cardId) => {
    store.selectedAccountFilter = `card:${cardId}`;
    const acc = document.getElementById('filter-account');
    if (acc) acc.value = `card:${cardId}`;
    switchView('history');
  };

  window.openAddCardForBank = (bankId) => {
    populateCardBankDropdown(bankId);
    openModal('card');
  };

  window.confirmDeleteBank = (bankId) => {
    const bank = store.getBank(bankId);
    if (!bank) return;
    if (confirm(`Are you sure you want to delete ${bank.name}? This will also remove its associated cards and transactions.`)) {
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
      showToast(`Card "${card.name}" deleted`, 'info');
      renderCurrentView();
    }
  };

  window.confirmDeleteTx = (txId) => {
    const tx = store.getTransaction(txId);
    if (!tx) return;
    if (confirm(`Delete transaction "${tx.merchant}" (${formatCurrency(tx.amount)})?`)) {
      store.deleteTransaction(txId);
      showToast(`Transaction deleted`, 'info');
      renderCurrentView();
    }
  };

  // Currency Switcher
  window.switchCurrency = (newCurr) => {
    currentCurrency = newCurr;
    localStorage.setItem('wallet_currency', newCurr);
    const currBadge = document.getElementById('current-currency-display');
    if (currBadge) currBadge.textContent = newCurr;
    showToast(`Currency updated to ${newCurr}`, 'success');
    renderCurrentView();
  };

  // Reset to Sample Data
  window.resetSampleData = () => {
    if (confirm('Reset wallet to realistic demo sample data?')) {
      store.resetToSampleData();
      showToast('Wallet restored to demo data!', 'success');
      renderCurrentView();
    }
  };

  // Export to CSV
  window.exportTransactionsCSV = () => {
    const txs = store.getEnrichedTransactions();
    if (txs.length === 0) {
      showToast('No transactions to export.', 'error');
      return;
    }

    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Currency', 'Bank', 'Card', 'Card Type', 'Last 4', 'Statement Cycle', 'Notes'];
    const rows = txs.map(t => [
      t.date,
      `"${t.merchant.replace(/"/g, '""')}"`,
      t.category,
      t.amount,
      currentCurrency,
      `"${(t.bank?.name || '').replace(/"/g, '""')}"`,
      `"${(t.card?.name || '').replace(/"/g, '""')}"`,
      t.card?.cardType || '',
      t.card?.last4 || '',
      `"${(t.statementInfo?.statementFullBadge || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wallet_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV file!', 'success');
  };

  // Update live clock in mobile status bar
  function updateStatusBarClock() {
    const clockEl = document.getElementById('status-bar-clock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  }
  updateStatusBarClock();
  setInterval(updateStatusBarClock, 30000);

  // Handle URL hash / search params for direct tab or modal view
  const urlParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace('#', '');
  const initialTab = urlParams.get('tab') || (hash === 'cards' || hash === 'history' ? hash : 'dashboard');
  const initialModal = urlParams.get('modal') || (hash.startsWith('modal-') ? hash.replace('modal-', '') : null);

  switchView(initialTab);

  if (initialModal && modals[initialModal]) {
    setTimeout(() => openModal(initialModal), 200);
  }
});
