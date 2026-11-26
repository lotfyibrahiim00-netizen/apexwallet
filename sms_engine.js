/**
 * ApexWallet - SMS Transaction Import Engine
 * Handles platform detection, native Capacitor bridge communication,
 * intelligent card matching, category inference, deduplication, and review inbox state.
 */

(function () {
  'use strict';

  // --- Platform Detection ---
  const isNativeAndroid = () => {
    return (
      typeof window !== 'undefined' &&
      window.Capacitor &&
      typeof window.Capacitor.isNativePlatform === 'function' &&
      window.Capacitor.isNativePlatform() &&
      window.Capacitor.getPlatform() === 'android'
    );
  };

  const getNativePlugin = () => {
    if (isNativeAndroid() && window.Capacitor.Plugins && window.Capacitor.Plugins.BankSms) {
      return window.Capacitor.Plugins.BankSms;
    }
    return null;
  };

  // Default Bank Sender Allowlist
  const DEFAULT_ALLOWLIST = [
    'CIB', 'HSBC', 'QNB', 'NBE', 'BM', 'BANQUEMISR', 'EMIRATESNBD',
    'ENBD', 'FABMISR', 'FAB', 'ALEXBANK', 'ADIB', 'AAIB', 'FAISAL',
    'INSTAPAY', 'IPN', 'INSTA'
  ];

  // Category Auto-Inference Rules from Merchant/Reference keywords
  const CATEGORY_RULES = [
    { cat: 'groceries', keywords: ['carrefour', 'hyperone', 'lulu', 'spinneys', 'seoudi', 'kheir zaman', 'supermarket', 'grocery', 'ماركت', 'هايبر', 'سعودي', 'سبينس', 'كارفور', 'خير زمان'] },
    { cat: 'food', keywords: ['starbucks', 'mcdonalds', 'kfc', 'buffalo', 'costa', 'restaurant', 'cafe', 'coffee', 'مطعم', 'كافيه', 'قهوة', 'برجر'] },
    { cat: 'shopping', keywords: ['amazon', 'noon', 'zara', 'h&m', 'ikea', 'jumia', 'mall', 'fashion', 'store', 'retail', 'جوميا', 'نون', 'امازون', 'زارا', 'ايكيا'] },
    { cat: 'utilities', keywords: ['vodafone', 'orange', 'etisalat', 'we', 'telecom', 'electricity', 'water', 'gas', 'bill', 'فاتورة', 'كهرباء', 'مياه', 'غاز', 'فودافون', 'اورنج', 'اتصالات', 'وي'] },
    { cat: 'travel', keywords: ['uber', 'careem', 'total', 'gas station', 'shell', 'chillout', 'petrol', 'flight', 'airline', 'بنزين', 'اوبر', 'كريم', 'طيران', 'محطة'] },
    { cat: 'health', keywords: ['pharmacy', 'hospital', 'clinic', 'ezaby', 'roshdy', '19011', 'صيدلية', 'مستشفى', 'عيادة', 'العزبي', 'رشدي'] },
    { cat: 'entertainment', keywords: ['cinema', 'vox', 'netflix', 'spotify', 'movie', 'theatre', 'سينما', 'نتفلكس', 'سبوتيفاي'] },
    { cat: 'services', keywords: ['subscription', 'apple.com', 'google', 'cloud', 'hosting', 'خدمة', 'اشتراك'] },
    { cat: 'transfers', keywords: ['instapay', 'إنستاباي', 'انستاباي', 'ipn', 'تحويل', 'transfer'] }
  ];

  function inferCategory(merchantName) {
    if (!merchantName) return 'other';
    const lower = merchantName.toLowerCase();
    for (const rule of CATEGORY_RULES) {
      for (const kw of rule.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          return rule.cat;
        }
      }
    }
    return 'other';
  }

  // --- Bank SMS Engine Class ---
  class BankSmsEngine {
    constructor() {
      this.pendingCandidates = [];
      this.listeners = [];
      this.stats = {
        isSmsImportEnabled: false,
        isKeystoreProtected: false,
        pendingCount: 0,
        queueCapacity: 100,
        isQueueNearFull: false,
        isQueueFull: false,
        rejectedCapacityCount: 0,
        totalReceived: 0,
        lastReceivedAt: 0,
        lastBroadcastAt: 0,
        lastBroadcastSender: '',
        permissionStatus: 'unavailable',
        receiveSmsGranted: false,
        readSmsGranted: false
      };
      this.allowlist = [...DEFAULT_ALLOWLIST];
      this.initialized = false;
    }

    /**
     * Initializes engine and registers Capacitor native listeners if on Android.
     */
    async init() {
      if (this.initialized) return;
      this.initialized = true;

      if (isNativeAndroid()) {
        const plugin = getNativePlugin();
        if (plugin) {
          try {
            await this.refreshPermissionStatus();
            await this.refreshSettings();
            await this.fetchPendingTransactions();

            // Listen for real-time SMS candidate notifications from native receiver
            plugin.addListener('onNewCandidate', (candidate) => {
              this.handleIncomingCandidate(candidate);
            });
          } catch (e) {
            console.error('Error initializing native BankSms plugin:', e);
          }
        }
      } else {
        // Browser/PWA mode fallback state
        this.stats.permissionStatus = 'unavailable';
        this.loadWebQueue();
      }
    }

    isPlatformSupported() {
      return isNativeAndroid();
    }

    // --- State & Queue Operations ---

    async refreshPermissionStatus() {
      const plugin = getNativePlugin();
      if (!plugin) {
        this.stats.permissionStatus = 'unavailable';
        return this.stats.permissionStatus;
      }
      try {
        const res = await plugin.checkPermission();
        this.stats.receiveSmsGranted = !!(res && (res.receiveSms || res.granted));
        this.stats.readSmsGranted = !!(res && res.readSms);
        this.stats.permissionStatus = this.stats.receiveSmsGranted ? 'granted' : (res.status || 'denied');
        return this.stats.permissionStatus;
      } catch (e) {
        this.stats.permissionStatus = 'error';
        return 'error';
      }
    }

    async requestPermission() {
      const plugin = getNativePlugin();
      if (!plugin) {
        return { granted: false, status: 'unavailable' };
      }
      try {
        const res = await plugin.requestPermission();
        this.stats.receiveSmsGranted = !!(res && (res.receiveSms || res.granted));
        this.stats.permissionStatus = this.stats.receiveSmsGranted ? 'granted' : (res.status || 'denied');
        this.notifyChange();
        return res;
      } catch (e) {
        console.error('Error requesting SMS permission:', e);
        return { granted: false, status: 'denied', error: e.message };
      }
    }

    async requestReadSmsPermission() {
      const plugin = getNativePlugin();
      if (!plugin) {
        return { granted: false, status: 'unavailable' };
      }
      try {
        const res = await plugin.requestReadSmsPermission();
        this.stats.readSmsGranted = !!(res && (res.readSms || res.granted));
        this.notifyChange();
        return res;
      } catch (e) {
        console.error('Error requesting READ_SMS permission:', e);
        return { granted: false, status: 'denied', error: e.message };
      }
    }

    async openAppSettings() {
      const plugin = getNativePlugin();
      if (plugin && typeof plugin.openAppSettings === 'function') {
        try {
          return await plugin.openAppSettings();
        } catch (e) {
          console.warn('Could not open app settings:', e);
        }
      }
    }

    async openBatterySettings() {
      const plugin = getNativePlugin();
      if (plugin && typeof plugin.openBatterySettings === 'function') {
        try {
          return await plugin.openBatterySettings();
        } catch (e) {
          console.warn('Could not open battery settings:', e);
        }
      }
    }

    async setSmsImportEnabled(enabled) {
      const plugin = getNativePlugin();
      if (plugin) {
        try {
          await plugin.setSmsImportEnabled({ enabled });
          this.stats.isSmsImportEnabled = enabled;
          this.notifyChange();
        } catch (e) {
          console.error('Error setting SMS import state:', e);
        }
      } else {
        this.stats.isSmsImportEnabled = enabled;
        this.saveWebQueue();
        this.notifyChange();
      }
    }

    async refreshSettings() {
      const plugin = getNativePlugin();
      if (plugin) {
        try {
          const statsRes = await plugin.getStats();
          this.stats.isSmsImportEnabled = statsRes.isSmsImportEnabled || false;
          this.stats.isKeystoreProtected = statsRes.isKeystoreProtected || false;
          this.stats.pendingCount = statsRes.pendingCount || 0;
          this.stats.queueCapacity = statsRes.queueCapacity || 100;
          this.stats.isQueueNearFull = !!statsRes.isQueueNearFull;
          this.stats.isQueueFull = !!statsRes.isQueueFull;
          this.stats.rejectedCapacityCount = statsRes.rejectedCapacityCount || 0;
          this.stats.totalReceived = statsRes.totalReceived || 0;
          this.stats.lastReceivedAt = statsRes.lastReceivedAt || 0;
          this.stats.lastBroadcastAt = statsRes.lastBroadcastAt || 0;
          this.stats.lastBroadcastSender = statsRes.lastBroadcastSender || '';

          const allowRes = await plugin.getAllowlist();
          if (allowRes && allowRes.allowlist) {
            this.allowlist = allowRes.allowlist;
          }
        } catch (e) {
          console.error('Error fetching SMS plugin settings:', e);
        }
      }
      this.notifyChange();
    }

    isSenderAllowed(sender) {
      return WebFallbackParser.isSenderAllowed(sender, this.allowlist);
    }

    async updateAllowlist(newAllowlist) {
      this.allowlist = [...newAllowlist];
      const plugin = getNativePlugin();
      if (plugin) {
        try {
          await plugin.setAllowlist({ allowlist: this.allowlist });
        } catch (e) {
          console.error('Error setting allowlist on native plugin:', e);
        }
      }
      this.notifyChange();
    }

    /**
     * Safely migrates legacy staged candidates from localStorage into
     * the Keystore-backed native queue.
     * ZERO-LOSS GUARANTEE: Never deletes any candidate from localStorage unless
     * its persistence in the Keystore queue is positively confirmed.
     * Retains any remaining unmigrated candidates (e.g. on capacity exhaustion or plugin error)
     * so they are preserved and retried automatically.
     */
    async migrateAndPurgeStagedPlaintext() {
      try {
        if (typeof localStorage === 'undefined') return;
        const raw = localStorage.getItem('apexwallet_sms_pending_staged_v1');
        if (!raw) return;

        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (e) {
          console.warn('Could not parse staged candidates JSON:', e);
          return; // Retain data intact on parse error
        }

        if (!Array.isArray(parsed) || parsed.length === 0) {
          localStorage.removeItem('apexwallet_sms_pending_staged_v1');
          return;
        }

        const plugin = getNativePlugin();
        if (plugin && typeof plugin.enqueueCandidates === 'function') {
          try {
            const res = await plugin.enqueueCandidates({ candidates: parsed });
            if (res && res.success) {
              const confirmedList = res.confirmedFingerprints || [];
              const confirmedSet = new Set(confirmedList);

              // Only purge items whose fingerprints are confirmed stored in Keystore!
              const remaining = parsed.filter(c => !confirmedSet.has(c.fingerprint));
              if (remaining.length === 0) {
                localStorage.removeItem('apexwallet_sms_pending_staged_v1');
                console.log(`[Safe Migration] Successfully migrated all ${parsed.length} candidates to Keystore.`);
              } else {
                localStorage.setItem('apexwallet_sms_pending_staged_v1', JSON.stringify(remaining));
                console.warn(`[Safe Migration] Partial migration: ${confirmedSet.size} confirmed, ${remaining.length} retained in localStorage.`);
              }
            } else {
              console.warn('[Safe Migration] Plugin enqueue returned non-success; retaining all items in localStorage.');
            }
          } catch (pluginErr) {
            console.error('[Safe Migration] Plugin call threw error; retaining all staged items in localStorage:', pluginErr);
          }
        }
      } catch (e) {
        console.warn('Error during staged SMS plaintext safe migration:', e);
        // CRITICAL: NEVER delete unmigrated items in catch block!
      }
    }

    async fetchPendingTransactions() {
      // 1. Run safe migration
      await this.migrateAndPurgeStagedPlaintext();

      const plugin = getNativePlugin();
      if (plugin) {
        try {
          const res = await plugin.getPendingTransactions();
          this.pendingCandidates = (res && res.pending) ? res.pending : [];
        } catch (e) {
          console.error('Error fetching pending transactions from native plugin:', e);
          this.pendingCandidates = [];
        }
      } else {
        this.loadWebQueue();
      }
      if (!Array.isArray(this.pendingCandidates)) {
        this.pendingCandidates = [];
      }

      // 2. If any unmigrated staged candidates remain in localStorage (e.g. queue was at capacity),
      // merge them safely into pendingCandidates in memory so the user sees all items!
      try {
        if (typeof localStorage !== 'undefined') {
          const remainingRaw = localStorage.getItem('apexwallet_sms_pending_staged_v1');
          if (remainingRaw) {
            const remaining = JSON.parse(remainingRaw);
            if (Array.isArray(remaining)) {
              for (const rem of remaining) {
                if (!this.pendingCandidates.some(c => c.fingerprint === rem.fingerprint || c.id === rem.id)) {
                  this.pendingCandidates.push(rem);
                }
              }
            }
          }
        }
      } catch (e) {}

      this.enrichCandidates();
      this.stats.pendingCount = this.pendingCandidates.length;
      this.notifyChange();
      return this.pendingCandidates;
    }

    handleIncomingCandidate(candidate) {
      if (!candidate) return;
      // Deduplicate locally
      const exists = this.pendingCandidates.some(c => c.fingerprint === candidate.fingerprint || c.id === candidate.id);
      if (!exists) {
        this.pendingCandidates.unshift(candidate);
        this.enrichCandidates();
        this.stats.pendingCount = this.pendingCandidates.length;
        this.stats.lastReceivedAt = Date.now();
        this.notifyChange();
      }
    }

    /**
     * Enriches candidates with intelligent card matching from user's wallet store,
     * and performs Level B Potential Duplicate Detection against existing manual/ledger transactions.
     */
    enrichCandidates() {
      const store = typeof window !== 'undefined' ? (window.walletStore || window.store) : (typeof global !== 'undefined' ? (global.walletStore || global.store) : null);
      if (!store) return;
      const allCards = store.cards || [];
      const allBanks = store.banks || [];
      const allAccounts = store.accounts || [];
      const allTransactions = store.transactions || [];

      for (const c of this.pendingCandidates) {
        // Suggested category
        if (!c.suggestedCategory) {
          c.suggestedCategory = inferCategory(c.merchant);
        }

        const candidateDigits = c.identifierDigits || c.cardSuffix || '';
        const candidatePos = c.digitsPosition || 'last';
        const candidateEntity = c.entityType || 'card';

        // Resolve Bank
        let candidateBank = null;
        if (c.bank) {
          const bLower = c.bank.toLowerCase().trim();
          candidateBank = allBanks.find(b =>
            b.name.toLowerCase().includes(bLower) ||
            b.shortCode.toLowerCase().includes(bLower) ||
            bLower.includes(b.shortCode.toLowerCase()) ||
            bLower.includes(b.name.toLowerCase())
          );
        }

        let matchingCards = [];
        let matchingAccounts = [];

        if (candidateBank && candidateDigits && candidateDigits.length === 4) {
          if (candidateEntity === 'account') {
            matchingAccounts = allAccounts.filter(acc =>
              acc.bankId === candidateBank.id &&
              acc.identifierDigits === candidateDigits &&
              (acc.digitsPosition || 'last') === candidatePos
            );
            // Also check debit cards linked to matching account or matching debit cards
            matchingCards = allCards.filter(card =>
              card.bankId === candidateBank.id &&
              (card.cardType === 'debit') &&
              (card.identifierDigits === candidateDigits || card.last4 === candidateDigits) &&
              (card.digitsPosition || 'last') === candidatePos
            );
          } else {
            // Card entity
            matchingCards = allCards.filter(card =>
              card.bankId === candidateBank.id &&
              (card.identifierDigits === candidateDigits || card.last4 === candidateDigits) &&
              (card.digitsPosition || 'last') === candidatePos
            );
          }
        }

        c.nonMatchReason = null;
        c.matchSuggestion = null;
        c.suggestAddAccount = null;

        // Strict Matching: Automatic match ONLY when exactly 1 match on all 4 dimensions
        if (matchingCards.length === 1 && matchingAccounts.length <= 1) {
          c.matchedCardId = matchingCards[0].id;
          c.matchedAccountId = matchingAccounts.length === 1 ? matchingAccounts[0].id : (matchingCards[0].linkedAccountId || null);
          c.confidence = 'high';
          c.requiresCardSelection = false;
        } else if (matchingAccounts.length === 1 && matchingCards.length === 0) {
          c.matchedCardId = null;
          c.matchedAccountId = matchingAccounts[0].id;
          // If a card is linked to this account, suggest it
          const linkedCard = allCards.find(cd => cd.linkedAccountId === matchingAccounts[0].id);
          if (linkedCard) {
            c.matchedCardId = linkedCard.id;
            c.confidence = 'high';
            c.requiresCardSelection = false;
          } else {
            c.confidence = 'account_only';
            c.requiresCardSelection = true;
            c.nonMatchReason = `تمت مطابقة الحساب البنكي (${matchingAccounts[0].name})، ولكن لا يوجد كارت خصم مرتبط به.`;
            c.matchSuggestion = `يمكنك اعتماد العملية على الحساب مباشرة، أو ربط الحساب بكارت خصم من شاشة الكروت.`;
          }
        } else if (matchingCards.length > 1 || matchingAccounts.length > 1) {
          // Ambiguous / Multiple: MUST require user confirmation without guessing
          c.matchedCardId = null;
          c.matchedAccountId = null;
          c.confidence = 'multiple';
          c.requiresCardSelection = true;
          c.candidateCards = matchingCards.map(mc => mc.id);
          const totalMatches = matchingCards.length + matchingAccounts.length;
          c.nonMatchReason = `يوجد أكثر من تطابق محتمل (${totalMatches} كروت أو حسابات تنتهي بنفس الأرقام لدى ${candidateBank ? candidateBank.name : (c.bank || 'هذا البنك')}).`;
          c.matchSuggestion = `يرجى اختيار الكارت المقصود يدوياً لمنع أي التباس في تسجيل المصروف.`;
        } else {
          // Zero match: Never fallback to first card
          c.matchedCardId = null;
          c.matchedAccountId = null;
          c.confidence = 'unknown';
          c.requiresCardSelection = true;

          if (!candidateBank) {
            c.nonMatchReason = `البنك الوارد في الرسالة (${c.bank || 'غير محدد'}) غير مسجل في محفظتك.`;
            c.matchSuggestion = `أضف البنك أولاً من شاشة البنوك لتتمكن من إضافة كروته ومطابقة عملياته تلقائياً.`;
          } else if (!candidateDigits || candidateDigits.length !== 4) {
            c.nonMatchReason = `الرسالة لا تحتوي على أرقام تعريفية للكارت أو الحساب (4 أرقام).`;
            c.matchSuggestion = `يرجى اختيار الكارت أو الحساب يدوياً من القائمة.`;
          } else {
            const bankName = candidateBank ? candidateBank.name : (c.bank || 'هذا البنك');
            if (candidateEntity === 'account') {
              c.nonMatchReason = `لا يوجد حساب بنكي أو كارت خصم مسجل بهذه الأرقام (${candidateDigits}) لدى ${bankName}.`;
              c.matchSuggestion = `يمكنك إضافة هذا الحساب من شاشة البنوك أو ربطه بكارت خصم موجود لتفعيل المطابقة التلقائية.`;
              c.suggestAddAccount = {
                bankId: candidateBank.id,
                digits: candidateDigits,
                position: candidatePos
              };
            } else {
              c.nonMatchReason = `لا يوجد كارت أو حساب مسجل بهذه الأرقام (${candidateDigits}) لدى ${bankName}.`;
              c.matchSuggestion = `يمكنك إضافة هذا الكارت من شاشة البنوك والكروت لتفعيل المطابقة التلقائية مستقبلاً.`;
              c.suggestAddAccount = {
                bankId: candidateBank.id,
                digits: candidateDigits,
                position: candidatePos
              };
            }
          }
        }

        // --- LEVEL B: Potential Duplicate Check against manual/existing wallet transactions ---
        c.isPotentialDuplicate = false;
        c.potentialDuplicateReason = null;
        c.potentialDuplicateMatch = null;

        const candidateAmount = parseFloat(c.amount);
        const candidateDateStr = (c.transactionTime ? c.transactionTime.split(' ')[0] : new Date(c.receiptTime || Date.now()).toISOString().split('T')[0]);
        const candidateTimestamp = new Date(candidateDateStr).getTime();

        for (const tx of allTransactions) {
          const txAmount = parseFloat(tx.amount);
          // Check if exact or near-identical amount
          if (Math.abs(txAmount - candidateAmount) < 0.01) {
            const txTimestamp = new Date(tx.date).getTime();
            const diffDays = Math.abs(txTimestamp - candidateTimestamp) / (1000 * 60 * 60 * 24);

            // Within 2-day transaction clearance / post window
            if (diffDays <= 2) {
              const txCard = tx.cardId ? store.getCard(tx.cardId) : null;
              const isCardOrBankRelated = (c.matchedCardId && c.matchedCardId === tx.cardId) ||
                                         (txCard && candidateDigits && (txCard.last4 === candidateDigits || txCard.identifierDigits === candidateDigits)) ||
                                         (txCard && c.bank && txCard.bankName && txCard.bankName.toLowerCase().includes(c.bank.toLowerCase())) ||
                                         (!candidateDigits);

              if (isCardOrBankRelated) {
                c.isPotentialDuplicate = true;
                c.potentialDuplicateMatch = {
                  id: tx.id,
                  merchant: tx.merchant,
                  amount: tx.amount,
                  date: tx.date,
                  cardName: txCard ? `${txCard.name || txCard.bankName} •••• ${txCard.last4}` : 'Wallet Card'
                };
                c.potentialDuplicateReason = `توجد عملية سابقة بنفس المبلغ (${tx.amount} ${c.currency || 'EGP'}) بتاريخ ${tx.date} (${tx.merchant || 'بدون اسم'}).`;
                break;
              }
            }
          }
        }
      }
    }

    /**
     * Scans past bank SMS in bounded batches (max 20 per batch).
     * Does NOT silently overflow or drop items.
     * Eliminates numerical offset skipping by passing excludeFingerprints of unreviewed items.
     */
    async queryHistoricalSmsBatch(options = {}) {
      const days = options.days || 30;
      const limit = options.limit || 20;

      const plugin = getNativePlugin();
      if (!plugin) {
        return { success: false, error: 'Historical import is only available on native Android.' };
      }

      // Collect fingerprints of all candidates currently waiting in review inbox
      const excludeFingerprints = this.pendingCandidates
        .map(c => c.fingerprint)
        .filter(Boolean);

      try {
        const res = await plugin.queryHistoricalSms({ days, limit, excludeFingerprints });
        if (res && res.success) {
          const batch = res.candidates || [];
          let addedCount = 0;
          for (const item of batch) {
            const exists = this.pendingCandidates.some(c => c.fingerprint === item.fingerprint || c.id === item.id);
            if (!exists) {
              item.isHistorical = true;
              this.pendingCandidates.push(item);
              addedCount++;
            }
          }
          this.enrichCandidates();
          this.stats.pendingCount = this.pendingCandidates.length;
          this.notifyChange();

          return {
            success: true,
            addedCount,
            batchCount: batch.length,
            hasMore: !!res.hasMore,
            rejectedCount: res.rejectedCount || 0,
            duplicateCount: res.duplicateCount || 0
          };
        } else {
          return { success: false, error: (res && res.error) || 'Failed to query historical SMS' };
        }
      } catch (e) {
        console.error('Error in queryHistoricalSmsBatch:', e);
        return { success: false, error: e.message };
      }
    }

    // --- Approval and Rejection Flow ---

    /**
     * Approves a candidate and writes it into WalletAppStore.
     */
    async approveCandidate(candidateId, overrides = {}) {
      const idx = this.pendingCandidates.findIndex(c => c.id === candidateId);
      if (idx === -1) return { success: false, error: 'Candidate not found' };

      const store = typeof window !== 'undefined' ? (window.walletStore || window.store) : (typeof global !== 'undefined' ? (global.walletStore || global.store) : null);
      if (!store) {
        return { success: false, error: 'Wallet storage is not initialized.' };
      }

      const c = this.pendingCandidates[idx];
      const cardId = overrides.cardId !== undefined ? overrides.cardId : c.matchedCardId;
      const explicitAccountId = overrides.accountId !== undefined ? overrides.accountId : null;
      const candidateAccountId = c.matchedAccountId || null;

      if (!cardId && !explicitAccountId && !candidateAccountId) {
        return { success: false, error: 'يرجى اختيار كارت أو حساب لتعيين هذه العملية. (Please select a card or account to assign this transaction)' };
      }

      const card = cardId ? store.getCard(cardId) : null;
      let accountId = explicitAccountId;
      const candidateOpType = overrides.transactionType || c.transactionType || 'purchase';

      // Engine-Level Account Linking & Contradiction Enforcement (Item 1 & Item 2)
      if (card && card.cardType === 'debit') {
        const cardLinkedAccId = card.linkedAccountId || null;
        const targetAccId = explicitAccountId || candidateAccountId;

        if (targetAccId) {
          // If transaction or candidate was associated with an account:
          if (!cardLinkedAccId) {
            return {
              success: false,
              error: 'كارت الخصم (Debit) المختار غير مرتبط بأي حساب بنكي، بينما العملية موجهة لحساب بنكي. يرجى ربط الكارت بالحساب أولاً.'
            };
          }
          if (cardLinkedAccId !== targetAccId) {
            return {
              success: false,
              error: 'تناقض في ربط الحساب: العملية موجهة لحساب بنكي مختلف عن الحساب المرتبط بهذا الكارت.'
            };
          }
          accountId = cardLinkedAccId;
        } else if (cardLinkedAccId) {
          accountId = cardLinkedAccId;
        } else {
          // Unlinked debit card
          accountId = null;
          if (candidateOpType === 'withdrawal') {
            return {
              success: false,
              error: 'لا يمكن اعتماد عملية سحب نقدي لكارت خصم غير مرتبط بحساب بنكي. يرجى اختيار حساب بنكي أو ربط الكارت بحساب أولاً لمنع ضياع الأثر المالي.'
            };
          }
        }
      } else if (card && card.cardType === 'credit') {
        // Credit card does not deduct from account
        accountId = null;
      } else if (explicitAccountId) {
        accountId = explicitAccountId;
      } else if (candidateAccountId && !cardId) {
        accountId = candidateAccountId;
      }

      // Cash withdrawal validation
      if (candidateOpType === 'withdrawal') {
        if (card && card.cardType === 'debit' && !accountId) {
          return {
            success: false,
            error: 'لا يمكن اعتماد عملية سحب نقدي لكارت خصم غير مرتبط بحساب بنكي. يرجى اختيار حساب بنكي أو ربط الكارت بحساب أولاً لمنع ضياع الأثر المالي.'
          };
        }
      }

      const amount = parseFloat(overrides.amount !== undefined ? overrides.amount : c.amount);
      const merchant = (overrides.merchant || c.merchant || (c.bank + ' SMS Transaction')).trim();
      const category = overrides.category || c.suggestedCategory || 'other';
      const date = overrides.date || (c.transactionTime ? c.transactionTime.split(' ')[0] : new Date(c.receiptTime || Date.now()).toISOString().split('T')[0]);
      const txDirection = overrides.direction || overrides.type || c.type || c.direction || 'expense';
      const refNote = c.refNumber ? ` | Ref#: ${c.refNumber}` : ` | Ref: ${(c.fingerprint || '').slice(0, 8)}`;
      const isManual = !!overrides.isManualAssignment;
      const manualTag = isManual ? ` [Manual Override: Detected ${c.bank} **${c.identifierDigits || c.cardSuffix || 'N/A'}]` : '';
      const notes = overrides.notes !== undefined
        ? overrides.notes
        : `[SMS Import] Bank: ${c.bank} | Card/Acc: **${c.identifierDigits || c.cardSuffix || 'N/A'}${refNote}${manualTag}`;

      try {
        // Add to main ledger
        const newTx = store.addTransaction({
          amount,
          merchant,
          category,
          date,
          bankId: card ? card.bankId : null,
          cardId: card ? card.id : null,
          accountId: accountId,
          expectedAccountId: candidateAccountId,
          direction: txDirection,
          type: txDirection,
          transactionType: overrides.transactionType || c.transactionType || 'purchase',
          isManualAssignment: isManual,
          detectedBank: c.bank,
          detectedDigits: c.identifierDigits || c.cardSuffix,
          refNumber: c.refNumber || null,
          rawMessage: c.rawMessage || c.body || null,
          notes
        });

        // Acknowledge from native queue
        await this.acknowledgeIds([c.id, c.fingerprint]);

        // Remove from memory
        this.pendingCandidates.splice(idx, 1);
        this.stats.pendingCount = this.pendingCandidates.length;
        this.notifyChange();

        return { success: true, transaction: newTx };
      } catch (err) {
        console.error('Error approving SMS candidate:', err);
        return { success: false, error: err.message };
      }
    }

    /**
     * Rejects/Discards a candidate transaction.
     */
    async rejectCandidate(candidateId) {
      const idx = this.pendingCandidates.findIndex(c => c.id === candidateId);
      if (idx === -1) return false;

      const c = this.pendingCandidates[idx];
      await this.acknowledgeIds([c.id, c.fingerprint]);
      this.pendingCandidates.splice(idx, 1);
      this.stats.pendingCount = this.pendingCandidates.length;
      this.notifyChange();
      return true;
    }

    /**
     * Approves all candidates with high-confidence unique card matches.
     */
    async approveAllVerified() {
      const approved = [];
      const highConfidenceList = this.pendingCandidates.filter(c => c.confidence === 'high' && c.matchedCardId);

      for (const c of highConfidenceList) {
        const res = await this.approveCandidate(c.id);
        if (res.success) approved.push(res.transaction);
      }
      return approved;
    }

    /**
     * Clears all pending candidates from queue.
     */
    async clearAllPending() {
      const plugin = getNativePlugin();
      if (plugin) {
        try {
          await plugin.clearQueue();
        } catch (e) {
          console.error('Error clearing native queue:', e);
        }
      }
      this.pendingCandidates = [];
      this.stats.pendingCount = 0;
      this.saveWebQueue();
      this.notifyChange();
    }

    async acknowledgeIds(ids) {
      // Also purge acknowledged IDs / fingerprints from staged storage if present
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem('apexwallet_sms_pending_staged_v1');
          if (raw) {
            let list = JSON.parse(raw);
            if (Array.isArray(list)) {
              const idSet = new Set(ids);
              list = list.filter(c => !idSet.has(c.id) && !idSet.has(c.fingerprint));
              if (list.length === 0) {
                localStorage.removeItem('apexwallet_sms_pending_staged_v1');
              } else {
                localStorage.setItem('apexwallet_sms_pending_staged_v1', JSON.stringify(list));
              }
            }
          }
        }
      } catch (e) {}

      const plugin = getNativePlugin();
      if (plugin) {
        try {
          await plugin.acknowledgeTransactions({ ids });
        } catch (e) {
          console.error('Error acknowledging transactions to native plugin:', e);
        }
      } else {
        this.saveWebQueue();
      }
    }

    // --- Synthetic SMS Simulation for Testing & Demo ---
    async simulateTestSms(sender, body) {
      const plugin = getNativePlugin();
      if (plugin) {
        try {
          const res = await plugin.simulateSms({ sender, body });
          if (res.parsed && res.candidate) {
            this.handleIncomingCandidate(res.candidate);
          }
          return res;
        } catch (e) {
          return { parsed: false, error: e.message };
        }
      } else {
        // Pure web simulation parser
        const candidate = WebFallbackParser.parse(sender, body);
        if (candidate) {
          this.handleIncomingCandidate(candidate);
          this.saveWebQueue();
          return { parsed: true, enqueued: true, candidate };
        } else {
          return { parsed: false, reason: 'Rejected: OTP, promo, or invalid format' };
        }
      }
    }

    // --- Web Storage Fallback (for browser testing / PWA) ---
    loadWebQueue() {
      try {
        const raw = localStorage.getItem('apex_web_sms_candidates');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            this.pendingCandidates = parsed;
            this.enrichCandidates();
            this.stats.pendingCount = this.pendingCandidates.length;
          }
        }
      } catch (e) {}
      if (!Array.isArray(this.pendingCandidates)) {
        this.pendingCandidates = [];
      }
      return this.pendingCandidates;
    }

    saveWebQueue() {
      try {
        localStorage.setItem('apex_web_sms_candidates', JSON.stringify(this.pendingCandidates));
      } catch (e) {}
    }

    // --- Observers ---
    subscribe(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
    }

    unsubscribe(callback) {
      this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyChange() {
      for (const listener of this.listeners) {
        try {
          listener(this);
        } catch (e) {}
      }
    }
  }

  // --- Web Fallback Parser (Identical Logic to BankSmsParser.java for browser parity) ---
  const WebFallbackParser = {
    DEFAULT_ALLOWLIST: [...DEFAULT_ALLOWLIST],

    isSenderAllowed: function (sender, customAllowlist = null) {
      if (!sender) return false;
      const list = customAllowlist || this.DEFAULT_ALLOWLIST || DEFAULT_ALLOWLIST;
      const clean = sender.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      return list.some(allowed => {
        const cleanAllowed = allowed.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        return clean.includes(cleanAllowed) || cleanAllowed.includes(clean);
      });
    },

    normalizeNumerals: function (str) {
      if (!str) return '';
      return str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
                .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
                .replace(/[\u066b]/g, '.')
                .replace(/[\u066c]/g, ',');
    },

    normalizeCurrency: function (curr) {
      if (!curr) return 'EGP';
      const c = curr.trim().toUpperCase();
      if (['LE', 'L.E', 'ج.م', 'جم', 'جنيه', 'EGP'].includes(c)) return 'EGP';
      if (['USD', '$'].includes(c)) return 'USD';
      if (['EUR', '€'].includes(c)) return 'EUR';
      if (['GBP', '£'].includes(c)) return 'GBP';
      if (['AED', 'د.إ'].includes(c)) return 'AED';
      if (['SAR', 'ر.س'].includes(c)) return 'SAR';
      return c;
    },

    normalizeDate: function (d) {
      if (!d) return null;
      const clean = d.replace(/\//g, '-');
      const parts = clean.split('-');
      if (parts.length !== 3) return null;
      let year, month, day;
      if (parts[0].length === 4) {
        year = parts[0];
        month = parts[1].padStart(2, '0');
        day = parts[2].padStart(2, '0');
      } else {
        day = parts[0].padStart(2, '0');
        month = parts[1].padStart(2, '0');
        year = parts[2];
        if (year.length === 2) {
          year = '20' + year;
        }
      }
      return `${year}-${month}-${day}`;
    },

    extractDateTime: function (text) {
      const pDateTime = /(?:on|بتاريخ|في)?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})(?:\s+(?:at|الساعة|في)?\s*(\d{1,2}:\d{2}(?::\d{2})?))?/i;
      const m = text.match(pDateTime);
      if (m && m[1] && m[1].length >= 6) {
        const normDate = this.normalizeDate(m[1]);
        if (normDate) {
          if (m[2]) {
            return normDate + ' ' + m[2].substring(0, 5);
          }
          return normDate;
        }
      }
      return null;
    },

    extractTypedIdentifier: function (text) {
      const lower = text.toLowerCase();
      let entityType = 'card';
      if (text.includes('حساب') || lower.includes('account')) {
        entityType = 'account';
      } else if (text.includes('بطاق') || text.includes('كارت') || lower.includes('card')) {
        entityType = 'card';
      } else {
        entityType = 'unknown';
      }

      // First digits
      const pFirst = /(?:starting\s+with|تبدأ\s+بـ?)\s*(\d{4})|(\d{4})(?:\*+|x{2,}|\.{2,})/i;
      const mFirst = text.match(pFirst);
      if (mFirst) {
        const d = mFirst[1] || mFirst[2];
        if (d && d.length === 4) {
          return { entityType, digits: d, position: 'first' };
        }
      }

      // Last digits
      const pLast = /(?:ending\s+with(?:\s*#)?|ending\s+in|تنتهي\s+بـ?|المنتهي(?:ة)?\s+بـ?(?:رقم)?)\s*[:#*.]*\s*(\d{4})|(?:\*+|x{2,}|\.{2,})\s*(\d{4})\b|(?:card|account|بطاقة|حساب)[^\d]{0,25}?(\d{4})\b/i;
      const mLast = text.match(pLast);
      if (mLast) {
        const d = mLast[1] || mLast[2] || mLast[3];
        if (d && d.length === 4) {
          return { entityType, digits: d, position: 'last' };
        }
      }

      return { entityType, digits: '', position: 'last' };
    },

    extractTransactionAmount: function (text) {
      const pCurr = /(?:(?:was\s*charged\s*for|charged\s*for|purchase\s*of|paid|بمبلغ|مبلغ)\s+)?(?:(EGP|LE|L\.E|USD|EUR|GBP|AED|SAR|ج\.م|جم|جنيه|\$|€|£|د\.إ|ر\.س)\s*)?([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(EGP|LE|L\.E|USD|EUR|GBP|AED|SAR|ج\.م|جم|جنيه|\$|€|£|د\.إ|ر\.س)?/gi;
      let m;
      while ((m = pCurr.exec(text)) !== null) {
        const matchStart = m.index;
        const prefixCurr = m[1];
        const numStr = m[2];
        const suffixCurr = m[3];

        if (!prefixCurr && !suffixCurr) continue;

        const textBefore = text.substring(Math.max(0, matchStart - 35), matchStart).toLowerCase();
        if (textBefore.includes('limit') || textBefore.includes('balance') ||
            textBefore.includes('الحد المتاح') || textBefore.includes('رصيد متاح') || textBefore.includes('رصيدك')) {
          continue;
        }

        const trimmedBefore = textBefore.trim();
        if (trimmedBefore.endsWith('ending with#') || trimmedBefore.endsWith('ending with') ||
            trimmedBefore.endsWith('ending in') || trimmedBefore.endsWith('منتهي بـ') ||
            trimmedBefore.endsWith('بطاقة رقم') || trimmedBefore.endsWith('حساب رقم')) {
          continue;
        }

        if (numStr) {
          const val = parseFloat(numStr.replace(/,/g, ''));
          if (val > 0 && val < 10000000) {
            const curr = prefixCurr ? this.normalizeCurrency(prefixCurr) : this.normalizeCurrency(suffixCurr);
            return { amount: val, currency: curr };
          }
        }
      }
      return null;
    },

    parse: function (sender, body) {
      if (!body) return null;
      const normalized = this.normalizeNumerals(body);

      // OTP & Promo negative filters
      const isOtp = /\b(otp|one\s*time\s*password|verification\s*code|security\s*code|activation\s*code|login\s*code|passcode)\b|رمز\s*التحقق|كود\s*التحقق|رمز\s*التأكيد|كلمة\s*السر\s*المؤقتة|رمز\s*سري|لا\s*تشارك|do\s*not\s*share/i.test(normalized);
      if (isOtp) return null;

      const isPromo = /\b(special\s*offer|congratulations|discount\s*up\s*to|loan\s*approval|apply\s*now|promo\s*code)\b|عرض\s*خاص|مبروك|قسط|تمت?\s*الموافقة\s*على\s*القرض|خصم\s*يصل/i.test(normalized);
      if (isPromo) return null;

      const isBalanceInquiry = /^\s*(your\s*balance\s*is|available\s*balance\s*is|رصيدكم\s*الحالي|رصيدك\s*هو)\b/i.test(normalized);
      if (isBalanceInquiry) return null;

      // Detect "money into the user's own account" (incoming destination)
      const isToUserAccount = /(?:(?:إلى|الى|في|لـ|ل)\s*[:\-]?\s*(?:حسابك(?:م)?|بطاقتك(?:م)?|كارتك(?:م)?|محفظتك(?:م)?|حساب[^\r\n,;]{0,40}?(?:الخاص\s+بك|المنتهي(?:ة)?\s+بـ?|تنتهي\s+بـ?))|\b(?:to|into)\s+your\s+(?:account|card|wallet)\b)/i.test(normalized);
      const isFromUserAccount = /(?:من\s+(?:حسابك|بطاقتك|كارتك|محفظتك)|\bfrom\s+your\s+(?:account|card|wallet)\b)/i.test(normalized);
      const isMoneyIntoUserAccount = isToUserAccount && !isFromUserAccount;

      // Type
      const isExplicitIncoming = isMoneyIntoUserAccount || /\b(refund|refunded|deposited|deposit|credited|credit|reversed|reversal|cash\s*in|transfer\s*received|received|received\s*from)\b|استرداد|إيداع|ايداع|دائن|اضافة|إضافة|تحويل\s*وارد|تم\s*استلام\s*تحويل|استلام\s*مبلغ|استقبلت|تم\s*استقبال|تمت?\s*إضافة/i.test(normalized);
      const isDebit = /\b(purchase|purchased|paid|debit|debited|spent|withdrawn|withdraw|charge|charged|was\s*charged|transferred|transfer|sent|pos|online|atm|cash\s*out)\b|شراء|خصم|مدين|سحب|دفع|تمت?\s*عملية|عملية\s*خصم|تسوق|شحن|تحويل(?:\s*صادر|\s*لحظي|\s*إلى|\s*الى)?|تم\s*(?:تنفيذ\s*)?تحويل|أرسلت|ارسلت|تم\s*ارسال/i.test(normalized);
      const isCredit = isExplicitIncoming;

      if (!isDebit && !isCredit) return null;

      let type = 'expense';
      if (isMoneyIntoUserAccount) {
        type = 'income';
      } else if (isExplicitIncoming && !/\b(purchase|purchased|paid|spent|withdrawn|withdraw|charged)\b|شراء|سحب|دفع|شحن/i.test(normalized)) {
        type = 'income';
      }

      // Amount & Currency
      const amtResult = this.extractTransactionAmount(normalized);
      if (!amtResult || amtResult.amount <= 0) return null;
      const amount = amtResult.amount;
      const currency = amtResult.currency;

      // Typed Identifier
      const ident = this.extractTypedIdentifier(normalized);
      const entityType = ident.entityType;
      const identifierDigits = ident.digits;
      const digitsPosition = ident.position;
      const cardSuffix = identifierDigits;

      // Reference number - with word boundary so it won't match inside "Carrefour"
      let refNumber = '';
      const refMatch = normalized.match(/(?:برقم\s*مرجعي|كود\s*مرجعي|رقم\s*(?:المرجع|العملية)|مرجع|\bref(?:erence)?\s*(?:no|num|number)?|\btxn\s*id|\brrn)\s*[:#]?\s*([a-zA-Z0-9]+)/i);
      if (refMatch && refMatch[1]) {
        refNumber = refMatch[1].trim();
      }

      const cleanMerchantString = (str) => {
        if (!str) return '';
        let m = str.trim();
        // Remove trailing reference tags like "ref# 123456", "كود مرجعي: 88712", etc.
        m = m.replace(/\s+(?:برقم\s*مرجعي|كود\s*مرجعي|رقم\s*(?:المرجع|العملية)|مرجع|\bref(?:erence)?(?:\s*(?:no|num|number))?|\btxn\s*id|\brrn)(?:[\s:#\-].*)?$/i, '').trim();
        if (refNumber) {
          const esc = refNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          m = m.replace(new RegExp(`(?:\\s+|[:#\\-])*${esc}\\s*$`, 'i'), '').trim();
        }
        m = m.replace(/[\s\-:#.,;]+$/, '').trim();
        return m.replace(/\s+/g, ' ');
      };

      // Merchant & Counterparty extraction
      let merchant = '';
      const isTransferOrInsta = /(?:instapay|ipn|إنستاباي|انستاباي|تحويل|transfer|transferred|sent|received)/i.test(normalized);
      const hasInstaPay = /(?:instapay|ipn|إنستاباي|انستاباي)/i.test(normalized) || (sender && /insta/i.test(sender));

      if (isTransferOrInsta) {
        if (type === 'income') {
          const inMatch = normalized.match(/(?:من\s+المحول|من\s+العميل|(?:\s|^)من(?!(?:\s+بطاقة|\s+كارت|\s+حسابك|\s+حساب|\s+ماكينة|\s+atm|\s+card|\s+account))|\bfrom\b|\breceived\s+from\b)\s*[:\-]?\s*([^\r\n,;]+?)(?=\s+(?:عبر|من\s+خلال|باستخدام|\bvia\b|\busing\b|\bon\b|بتاريخ|في|\bref\b|برقم|\bto\b|\d{1,2}[/-])|$)/i);
          if (inMatch && inMatch[1]) {
            let party = inMatch[1].trim().replace(/\s+(?:بنجاح|ناجح|ناجحة|تمت|successful|successfully)$/i, '').replace(/\s+/g, ' ');
            party = party.replace(/\s+(?:مبلغ|بمبلغ|\bamount\b)[\s:#].*$/i, '');
            party = party.replace(/\s+(?:[0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(?:EGP|LE|L\.E|USD|EUR|GBP|AED|SAR|ج\.م|جم|جنيه|\$|€|£|د\.إ|ر\.س)?$/i, '');
            party = party.replace(/\s+(?:EGP|LE|L\.E|USD|EUR|GBP|AED|SAR|ج\.م|جم|جنيه|\$|€|£|د\.إ|ر\.س)\s*(?:[0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)?$/i, '');
            party = cleanMerchantString(party);
            if (party.length > 40) party = party.substring(0, 40).trim();
            if (party) {
              merchant = hasInstaPay ? ('InstaPay: ' + party) : ('تحويل من: ' + party);
            }
          }
        } else {
          const outMatch = normalized.match(/(?:إلى|الى|لحساب|للمستفيد|\bto\b|\bsent\s+to\b)\s*[:\-]?\s*([^\r\n,;]+?)(?=\s+(?:عبر|من\s+خلال|باستخدام|\bvia\b|\busing\b|\bon\b|بتاريخ|في|\bref\b|برقم|\bfrom\b|\d{1,2}[/-])|$)/i);
          if (outMatch && outMatch[1]) {
            let party = outMatch[1].trim().replace(/\s+(?:بنجاح|ناجح|ناجحة|تمت|successful|successfully)$/i, '').replace(/\s+/g, ' ');
            party = cleanMerchantString(party);
            if (party.length > 40) party = party.substring(0, 40).trim();
            if (party) {
              merchant = hasInstaPay ? ('InstaPay: ' + party) : ('تحويل إلى: ' + party);
            }
          }
        }
        if (!merchant && hasInstaPay) {
          merchant = 'InstaPay';
        }
      }

      if (!merchant) {
        const merchMatch = normalized.match(/(?:at|لدى|عند|merchant|store|من\s+ماكينة|from\s+atm)\s*[:\-]?\s*([^,\r\n;]+)/i);
        if (merchMatch && merchMatch[1]) {
          let m = merchMatch[1].trim();
          m = m.split(/\s+(?:with\s+card|from\s+card|with\s+credit|with\s+debit|using|on\s+\d|باستخدام|من\s+بطاقة|من\s+حساب|بتاريخ|في\s+\d)/i)[0].trim();
          m = cleanMerchantString(m);
          if (m.length > 50) m = m.substring(0, 50).trim();
          merchant = m.replace(/\s+/g, ' ');
        }
      }

      // Date and Time
      const transactionTime = this.extractDateTime(normalized);

      // Bank
      let bank = (sender || 'Bank').trim();
      const sUp = bank.toUpperCase();
      if (sUp.includes('INSTAPAY') || sUp.includes('IPN') || sUp.includes('INSTA')) bank = 'InstaPay';
      else if (sUp.includes('CIB')) bank = 'CIB';
      else if (sUp.includes('HSBC')) bank = 'HSBC';
      else if (sUp.includes('QNB')) bank = 'QNB';
      else if (sUp.includes('NBE') || sUp.includes('AHLI')) bank = 'NBE';
      else if (sUp.includes('MISR') || sUp.includes('BM')) bank = 'Banque Misr';
      else if (sUp.includes('ENBD') || sUp.includes('EMIRATES')) bank = 'Emirates NBD';
      else if (sUp.includes('FAB')) bank = 'FABMISR';
      else if (sUp.includes('ALEX')) bank = 'AlexBank';
      else if (sUp.includes('ADIB')) bank = 'ADIB';
      else if (sUp.includes('AAIB')) bank = 'AAIB';
      else if (sUp.includes('FAISAL')) bank = 'Faisal';

      const rawKey = `${bank}|${entityType}:${identifierDigits}:${digitsPosition}|${type}|${amount.toFixed(2)}|${currency}|${transactionTime || ''}|${refNumber}`;
      let fingerprint = '';
      try {
        fingerprint = btoa(unescape(encodeURIComponent(rawKey)));
      } catch (e) {
        fingerprint = 'fp_' + Math.abs(rawKey.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0));
      }

      // Transaction Operation Type (purchase | transfer | withdrawal)
      let transactionType = 'purchase';
      if (/\b(atm|cash\s*withdrawal|withdrawn|withdraw|cash\s*out)\b|سحب\s*نقدي|سحب|صراف\s*آلي|من\s*ماكينة/i.test(normalized)) {
        transactionType = 'withdrawal';
      } else if (isTransferOrInsta) {
        transactionType = 'transfer';
      } else {
        transactionType = 'purchase';
      }

      return {
        id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        bank,
        cardSuffix,
        identifierDigits,
        entityType,
        digitsPosition,
        refNumber: refNumber || null,
        type,
        direction: type,
        transactionType,
        amount,
        currency,
        merchant,
        rawMessage: body,
        body: body,
        transactionTime,
        receiptTime: Date.now(),
        fingerprint,
        status: 'pending',
        requiresCardSelection: !identifierDigits
      };
    }
  };

  // Expose global instance
  if (typeof window !== 'undefined') {
    window.BankSmsEngine = new BankSmsEngine();
    window.WebFallbackParser = WebFallbackParser;
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.BankSmsEngine.init());
      } else {
        window.BankSmsEngine.init();
      }
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BankSmsEngine, WebFallbackParser };
  }
})();
