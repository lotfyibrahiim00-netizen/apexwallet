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
    'ENBD', 'FABMISR', 'FAB', 'ALEXBANK', 'ADIB', 'AAIB', 'FAISAL'
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
    { cat: 'services', keywords: ['subscription', 'apple.com', 'google', 'cloud', 'hosting', 'خدمة', 'اشتراك'] }
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
     * Safely migrates any legacy plaintext staged candidates from localStorage into
     * the Keystore-backed native queue and permanently deletes the unencrypted key.
     */
    async migrateAndPurgeStagedPlaintext() {
      try {
        if (typeof localStorage === 'undefined') return;
        const raw = localStorage.getItem('apexwallet_sms_pending_staged_v1');
        if (!raw) return;

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const plugin = getNativePlugin();
          if (plugin && typeof plugin.enqueueCandidates === 'function') {
            await plugin.enqueueCandidates({ candidates: parsed });
          }
        }
        // Permanently purge unencrypted plaintext staging
        localStorage.removeItem('apexwallet_sms_pending_staged_v1');
      } catch (e) {
        console.warn('Error during staged SMS plaintext purge/migration:', e);
        try { localStorage.removeItem('apexwallet_sms_pending_staged_v1'); } catch (ignored) {}
      }
    }

    async fetchPendingTransactions() {
      // 1. Run migration and purge of legacy plaintext staging
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
        this.pendingCandidates = this.loadWebQueue();
      }

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
      if (!window.store) return;
      const allCards = window.store.cards || [];
      const allBanks = window.store.banks || [];
      const allTransactions = window.store.transactions || [];

      for (const c of this.pendingCandidates) {
        // Suggested category
        if (!c.suggestedCategory) {
          c.suggestedCategory = inferCategory(c.merchant);
        }

        // Match card by last4 digits & bank
        let matchingCards = [];
        if (c.cardSuffix && c.cardSuffix.length === 4) {
          matchingCards = allCards.filter(card => card.last4 === c.cardSuffix);
        }

        // If no match by last4, try matching by bank name/shortCode
        if (matchingCards.length === 0 && c.bank) {
          const bLower = c.bank.toLowerCase();
          const candidateBank = allBanks.find(b =>
            b.name.toLowerCase().includes(bLower) ||
            b.shortCode.toLowerCase().includes(bLower) ||
            bLower.includes(b.shortCode.toLowerCase())
          );
          if (candidateBank) {
            matchingCards = allCards.filter(card => card.bankId === candidateBank.id);
          }
        }

        if (matchingCards.length === 1) {
          c.matchedCardId = matchingCards[0].id;
          c.confidence = 'high';
          c.requiresCardSelection = false;
        } else if (matchingCards.length > 1) {
          c.matchedCardId = matchingCards[0].id; // default to first, but require confirmation
          c.confidence = 'multiple';
          c.requiresCardSelection = true;
          c.candidateCards = matchingCards.map(mc => mc.id);
        } else {
          c.matchedCardId = allCards.length > 0 ? allCards[0].id : null;
          c.confidence = 'unknown';
          c.requiresCardSelection = true;
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
              const txCard = window.store.getCard(tx.cardId);
              const isCardOrBankRelated = (c.matchedCardId && c.matchedCardId === tx.cardId) ||
                                         (txCard && c.cardSuffix && txCard.last4 === c.cardSuffix) ||
                                         (txCard && c.bank && txCard.bankName && txCard.bankName.toLowerCase().includes(c.bank.toLowerCase())) ||
                                         (!c.cardSuffix);

              if (isCardOrBankRelated) {
                c.isPotentialDuplicate = true;
                c.potentialDuplicateMatch = {
                  id: tx.id,
                  merchant: tx.merchant,
                  amount: tx.amount,
                  date: tx.date,
                  cardName: txCard ? `${txCard.bankName} •••• ${txCard.last4}` : 'Wallet Card'
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

      const c = this.pendingCandidates[idx];
      const cardId = overrides.cardId || c.matchedCardId;
      if (!cardId) {
        return { success: false, error: 'Please select a card to assign this transaction.' };
      }

      const card = window.store.getCard(cardId);
      if (!card) {
        return { success: false, error: 'Selected card does not exist in wallet.' };
      }

      const amount = parseFloat(overrides.amount !== undefined ? overrides.amount : c.amount);
      const merchant = (overrides.merchant || c.merchant || (c.bank + ' SMS Transaction')).trim();
      const category = overrides.category || c.suggestedCategory || 'other';
      const date = overrides.date || (c.transactionTime ? c.transactionTime.split(' ')[0] : new Date(c.receiptTime || Date.now()).toISOString().split('T')[0]);
      const notes = overrides.notes !== undefined
        ? overrides.notes
        : `[SMS Import] Bank: ${c.bank} | Card: **${c.cardSuffix || 'N/A'} | Ref: ${(c.fingerprint || '').slice(0, 8)}`;

      try {
        // Add to main ledger
        const newTx = window.store.addTransaction({
          amount,
          merchant,
          category,
          date,
          bankId: card.bankId,
          cardId: card.id,
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
          this.pendingCandidates = JSON.parse(raw);
          this.enrichCandidates();
          this.stats.pendingCount = this.pendingCandidates.length;
        }
      } catch (e) {}
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
    normalizeNumerals: function (str) {
      if (!str) return '';
      return str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
                .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
                .replace(/[\u066b]/g, '.')
                .replace(/[\u066c]/g, ',');
    },

    parse: function (sender, body) {
      if (!body) return null;
      const normalized = this.normalizeNumerals(body);

      // OTP & Promo negative filters
      const isOtp = /\b(otp|one\s*time\s*password|verification\s*code|security\s*code|activation\s*code|login\s*code|passcode)\b|رمز\s*التحقق|كود\s*التحقق|رمز\s*التأكيد|كلمة\s*السر\s*المؤقتة|رمز\s*سري|لا\s*تشارك|do\s*not\s*share/i.test(normalized);
      if (isOtp) return null;

      const isPromo = /\b(special\s*offer|congratulations|discount\s*up\s*to|loan\s*approval|apply\s*now|promo\s*code)\b|عرض\s*خاص|مبروك|قسط|خصم\s*يصل/i.test(normalized);
      if (isPromo) return null;

      // Type
      const isDebit = /\b(purchase|paid|debited|spent|withdrawn|charge|pos|online|atm|cash\s*out)\b|شراء|خصم|مدين|سحب|دفع|عملية\s*خصم|تسوق|شحن/i.test(normalized);
      const isCredit = /\b(refund|refunded|deposited|credited|reversed|cash\s*in|transfer\s*received)\b|استرداد|إيداع|ايداع|دائن|اضافة|إضافة|تحويل\s*وارد/i.test(normalized);
      if (!isDebit && !isCredit) return null;
      const type = (isCredit && !isDebit) ? 'income' : 'expense';

      // Amount & Currency
      const amtMatch = normalized.match(/(?:(EGP|LE|L\.E|USD|EUR|GBP|AED|SAR|ج\.م|جنيه|\$|€|£|د\.إ|ر\.س)\s*)?([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(EGP|LE|L\.E|USD|EUR|GBP|AED|SAR|ج\.م|جنيه|\$|€|£|د\.إ|ر\.س)?/i);
      if (!amtMatch || !amtMatch[2]) return null;
      const rawNum = amtMatch[2].replace(/,/g, '');
      const amount = parseFloat(rawNum);
      if (isNaN(amount) || amount <= 0 || amount > 10000000) return null;

      let currency = 'EGP';
      const rawCurr = amtMatch[1] || amtMatch[3];
      if (rawCurr) {
        const u = rawCurr.toUpperCase();
        if (['LE', 'L.E', 'ج.م', 'جنيه', 'EGP'].includes(u)) currency = 'EGP';
        else if (['USD', '$'].includes(u)) currency = 'USD';
        else if (['EUR', '€'].includes(u)) currency = 'EUR';
        else if (['GBP', '£'].includes(u)) currency = 'GBP';
        else if (['AED', 'د.إ'].includes(u)) currency = 'AED';
        else if (['SAR', 'ر.س'].includes(u)) currency = 'SAR';
      }

      // Card Suffix
      let cardSuffix = '';
      const cardMatch = normalized.match(/(?:card|account|بطاقة|بطاقتكم|بطاقتك|كارت)[^\d]{0,35}?(?:\*+|\.{2,}|ending\s+in|تنتهي\s+بـ?|المنتهية\s+بـ?(?:رقم)?|رقم)?\s*(\d{4})|(?:\*+|x{2,})(\d{4})/i);
      if (cardMatch) {
        cardSuffix = cardMatch[1] || cardMatch[2] || '';
      }

      // Merchant
      let merchant = '';
      const merchMatch = normalized.match(/(?:at|لدى|عند|merchant|store|من\s+ماكينة|from\s+atm)\s*[:\-]?\s*([^,\r\n;]+)/i);
      if (merchMatch && merchMatch[1]) {
        let m = merchMatch[1].trim();
        m = m.split(/\s+(?:with\s+card|from\s+card|with\s+credit|with\s+debit|using\s+card|on\s+\d|باستخدام\s+بطاقة|من\s+بطاقة|بتاريخ|في\s+\d)/i)[0].trim();
        m = m.replace(/\s+(?:with|on|from|in)$/i, '').trim();
        merchant = m.replace(/\s+/g, ' ');
      }

      // Date
      let transactionTime = null;
      const dateMatch = normalized.match(/(?:on|بتاريخ|في|date)?\s*(\d{1,4}[/-]\d{1,2}[/-]\d{2,4}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/i);
      if (dateMatch && dateMatch[1]) {
        transactionTime = dateMatch[1].trim();
      }

      // Bank
      let bank = (sender || 'Bank').trim();
      const sUp = bank.toUpperCase();
      if (sUp.includes('CIB')) bank = 'CIB';
      else if (sUp.includes('HSBC')) bank = 'HSBC';
      else if (sUp.includes('QNB')) bank = 'QNB';
      else if (sUp.includes('NBE') || sUp.includes('AHLI')) bank = 'NBE';
      else if (sUp.includes('MISR') || sUp.includes('BM')) bank = 'Banque Misr';
      else if (sUp.includes('ENBD')) bank = 'Emirates NBD';
      else if (sUp.includes('FAB')) bank = 'FABMISR';
      else if (sUp.includes('ALEX')) bank = 'AlexBank';

      const fingerprint = btoa(`${bank}|${cardSuffix}|${type}|${amount}|${currency}|${merchant}|${transactionTime || Date.now()}`);

      return {
        id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        bank,
        cardSuffix,
        type,
        amount,
        currency,
        merchant,
        transactionTime,
        receiptTime: Date.now(),
        fingerprint,
        status: 'pending',
        requiresCardSelection: !cardSuffix
      };
    }
  };

  // Expose global instance
  window.BankSmsEngine = new BankSmsEngine();
  window.WebFallbackParser = WebFallbackParser;

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.BankSmsEngine.init());
  } else {
    window.BankSmsEngine.init();
  }
})();
