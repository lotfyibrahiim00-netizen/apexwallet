/**
 * ApexWallet UI & Interaction Controller
 * Visual Card-First Aesthetic (Dark Charcoal & Amber Gold Direction)
 * - Hero Card: Tilted card object (-4deg in RTL, +4deg in LTR)
 * - Colors: #1A1B1F (Dark bg), #25262B (Surface), #2A2B31 (Raised / Dock), #F5B700 (Amber Accent)
 * - Text: #F3F1EC (Main), #9A9CA3 (Muted), #E6A8A8 (Destructive)
 * - Bilingual: Pure Arabic RTL / Pure English LTR
 */

// ==========================================
// BILINGUAL & I18N LAYER (Pure Arabic RTL / English LTR)
// ==========================================
const I18N = {
  ar: {
    home: 'الرئيسية',
    activity: 'الحركات',
    review: 'المراجعة',
    wallets: 'المحافظ',
    settings: 'الإعدادات',
    cards: 'الكروت',
    banks: 'البنوك',
    history: 'الحركات',
    back: 'رجوع',
    security: 'الأمان',
    sms_intake: 'استقبال الرسائل',
    backup_general: 'النسخ الاحتياطي والعام',
    left_of: 'المتبقي من',
    cycle_purchases: 'مشتريات الدورة',
    cash_advance_debt: 'سحب كاش (دين)',
    total_owed: 'إجمالي الالتزام',
    bank_messages_ready: '{n} رسالة بنك جاهزة',
    messages_waiting: '{n} رسالة تنتظر',
    review_btn: 'راجع',
    recent_activity: 'آخر الحركات',
    no_activity: 'لا توجد حركات مسجلة حتى الآن',
    all_history: 'عرض كل الحركات',
    cycle_budget: 'ميزانية الدورة',
    credit_limit: 'الحد الائتماني',
    not_recorded: 'غير مسجل',
    na_debit: 'بطاقة خصم',
    view_activity: 'عرض النشاط',
    edit_card: 'تعديل الكارت',
    pin_code: 'رمز PIN',
    digits_4: '4 أرقام',
    change: 'تغيير',
    biometric_unlock: 'فتح بالبصمة',
    not_enabled: 'غير مفعّلة',
    enabled: 'مفعّلة',
    bio_not_supported: 'غير مدعومة في هذا المتصفح',
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
    create_new_title: 'إضافة جديد',
    qa_subtitle: 'اختر الإجراء المطلوب',
    qa_log_tx: 'تسجيل حركة',
    qa_log_tx_desc: 'حساب تلقائي لدورة كشف الحساب',
    qa_add_card: 'إضافة كارت أو حساب',
    qa_add_card_desc: 'كريدت أو ديبت أو حساب (حتى 3 كروت للبنك)',
    qa_add_bank: 'إضافة بنك جديد',
    qa_add_bank_desc: 'تخصيص اسم البنك ولونه',
    qa_lock_desc: 'قفل الجلسة برمز PIN',
    qa_change_pin: 'تغيير رمز PIN',
    qa_change_pin_desc: 'تحديث رمز القفل الرئيسي',
    qa_clear_desc: 'إعادة تعيين كل شيء للصفر',
    purchase: 'شراء',
    transfer: 'تحويل',
    withdrawal: 'سحب نقدي',
    incoming_refund: 'وارد / استرداد',
    amount: 'المبلغ',
    merchant_label: 'التاجر / الوصف',
    merchant_placeholder: 'كارفور، طلبات، أمازون...',
    chip_carrefour: 'كارفور',
    chip_talabat: 'طلبات',
    chip_starbucks: 'ستاربكس',
    chip_amazon: 'أمازون',
    card_account: 'الكارت / الحساب',
    category: 'الفئة',
    date_label: 'التاريخ',
    notes: 'ملاحظة',
    notes_optional: 'ملاحظة (اختياري)',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    done: 'تم',
    confirm: 'تأكيد',
    batch_approve: 'اعتماد جماعي',
    clear_all: 'مسح الكل',
    unmatched: 'غير مطابق',
    approve: 'اعتماد',
    reject: 'رفض',
    edit_details: 'تعديل التفاصيل',
    over_limit: 'تجاوز للميزانية',
    warning_limit: 'قارب على الحد',
    add_bank: 'إضافة بنك',
    add_card: 'إضافة كارت',
    add_account: 'إضافة حساب',
    correct_balance: 'تصحيح الرصيد',
    delete: 'حذف',
    your_wallet_ready: 'محفظتك جاهزة',
    no_cards_yet: 'لا توجد كروت مسجلة حتى الآن',
    no_banks_yet: 'لا توجد بنوك مسجلة حتى الآن',
    add_first_bank: 'أضف أول بنك',
    add_first_card: 'أضف أول كارت',
    cards_under_bank: 'الحد الأقصى {n} كروت لكل بنك',
    max_3_reached: 'تم بلوغ الحد الأقصى (3 كروت) لهذا البنك',
    bank_accounts_count: 'الحسابات البنكية ({n})',
    no_accounts_for_bank: 'لا توجد حسابات بنكية مسجلة لهذا البنك',
    registered_cards: 'الكروت المسجلة',
    inbox_empty: 'صندوق المراجعة فارغ',
    inbox_empty_desc: 'ستظهر الرسائل البنكية الواردة هنا تلقائياً.',
    all_cycles: 'كل الدورات',
    search_placeholder: 'بحث في الحركات أو التجار...',
    no_transactions_yet: 'لا توجد حركات مسجلة',
    log_first_expense: 'تسجيل حركة جديدة',
    cat_groceries: 'بقالة',
    cat_food: 'طعام ومطاعم',
    cat_shopping: 'تسوق',
    cat_utilities: 'فواتير وخدمات',
    cat_entertainment: 'ترفيه',
    cat_travel: 'سفر ومواصلات',
    cat_health: 'صحة وطب',
    cat_services: 'اشتراكات وخدمات',
    cat_other: 'أخرى',
    max_3_per_bank_desc: 'الحد الأقصى 3 كروت لكل بنك',
    bank_name_label: 'اسم البنك',
    bank_code_label: 'الرمز المختصر',
    brand_color_label: 'لون العلامة',
    custom_color: 'لون مخصص',
    save_bank: 'حفظ البنك',
    add_card_account: 'إضافة كارت / حساب',
    add_card_account_desc: 'أضف كروتاً أو حسابات بنكية للمطابقة التلقائية',
    bank_label: 'البنك',
    type_label: 'النوع',
    card_credit: 'كريدت',
    card_debit: 'ديبت',
    card_account_type: 'حساب',
    card_prepaid: 'مسبق الدفع',
    nickname_label: 'الاسم التعريفي',
    digits_4_label: 'أرقام التعريف (4)',
    digits_pos_label: 'موضع الأرقام في رسائل البنك:',
    digits_last: 'آخر الرقم',
    digits_first: 'أول الرقم',
    digits_pos_hint: 'أدخل الأرقام المعرفة كما تظهر في رسائل بنكك النصية (مثال: المنتهي بـ 1234 أو تبدأ بـ 1234).',
    linked_account_opt: 'الحساب البنكي المرتبط (اختياري)',
    none_independent_debit: 'بدون حساب مرتبط (كارت مستقل)',
    credit_limit_label: 'الحد الائتماني البنكي',
    credit_limit_placeholder: 'اختياري (مثال: 50000)',
    cycle_budget_label: 'ميزانية الصرف للدورة',
    current_balance_label: 'الرصيد الحالي للحساب',
    balance_example_ph: 'مثال: 25000',
    balance_local_note: 'الرصيد يتم حسابه وتحديثه داخل التطبيق فقط وليس متزامناً مع البنك',
    cycle_budget_optional: 'ميزانية الصرف للدورة (اختياري)',
    billing_cycle_days: 'أيام دورة الكشف (1–31)',
    start_day: 'يوم البداية',
    end_day: 'يوم الإغلاق',
    cycle_rollover_hint: 'المشتريات بعد يوم البداية تُرحّل إلى كشف الشهر التالي.',
    save_card_account: 'حفظ الكارت / الحساب',
    save_bank_account: 'حفظ الحساب البنكي',
    save_card: 'حفظ الكارت',
    customize_card_title: 'تخصيص لون الكارت',
    customize_card_sub: 'اختر ألوان البنك الرسمية أو لوناً مخصصاً',
    official_bank_colors: 'ألوان البنوك الرسمية',
    luxury_gradients: 'تدرجات فاخرة',
    pick_custom_color: 'اختر لوناً مخصصاً',
    pick_custom_color_desc: 'توليد تدرج متناسق تلقائياً',
    review_modal_sub: 'مراجعة واعتماد عمليات رسائل البنك',
    diag_modal_title: 'تشخيص واستقبال رسائل البنوك',
    diag_modal_sub: 'سجل وحالة استقبال الرسائل لحظياً',
    hist_modal_title: 'استيراد الرسائل البنكية السابقة',
    hist_modal_sub: 'فحص آمن لصندوق الرسائل القديم بدفعات صغيرة',
    new_cycle_started_title: 'بدء دورة كشف جديدة',
    billing_cycle_label: 'دورة الفوترة:',
    prev_cycle_budget_label: 'ميزانية الدورة السابقة:',
    bank_credit_limit_colon: 'الحد الائتماني البنكي:',
    continue_prev_budget: 'الاستمرار على ميزانية الدورة السابقة',
    or_set_new_budget: 'أو تحديد ميزانية جديدة',
    new_budget_cycle_only: 'ميزانية جديدة لهذه الدورة فقط:',
    enter_amount_placeholder: 'أدخل المبلغ',
    edit_account_title: 'تعديل الحساب وتصحيح الرصيد',
    account_name_label: 'اسم الحساب',
    corrected_balance_label: 'الرصيد الفعلي الحالي',
    balance_adjust_note: 'تعديل الرصيد يُحفظ كحركة تسوية رصيد في السجل توثق الرصيد السابق والجديد دون تعديل أو حذف أي عمليات تاريخية.',
    adjust_reason_label: 'سبب التسوية / ملاحظات (اختياري)',
    adjust_reason_placeholder: 'مثال: مطابقة مع كشف حساب البنك',
    save_account_changes: 'حفظ التعديلات وتسوية الرصيد',
    edit_card_title: 'تعديل بيانات الكارت',
    card_name_label: 'اسم الكارت',
    linked_account_deduct: 'الحساب البنكي المرتبط (خصم الرصيد)',
    linked_account_future_note: 'الربط يسري على العمليات الجديدة فقط من الآن فصاعداً ولا يمس العمليات التاريخية المسجلة مسبقاً.',
    monthly_budget_label: 'ميزانية الصرف الشهرية',
    optional_leave_empty: 'اختياري (اتركه فارغاً إذا لم ترغب)',
    save_card_changes: 'حفظ تعديلات الكارت',
    summary_purchase: 'تم خصم {amount} من {card} لدى {merchant}',
    summary_withdrawal: 'سحب نقدي {amount} من ماكينة الصراف عبر {card}',
    summary_transfer: 'تحويل {amount} عبر {card} إلى {merchant}',
    summary_income: 'وارد / استرداد {amount} إلى {card} من {merchant}',
    select_card_or_account: '-- اختر الكارت / الحساب --',
    cards_optgroup: 'الكروت',
    accounts_optgroup: 'الحسابات البنكية',
    balance_word: 'رصيد',
    historical_badge: 'استيراد قديم',
    choose_card_badge: 'اختر الكارت',
    non_match_prefix: 'سبب عدم المطابقة:',
    non_match_default: 'لا يوجد كارت أو حساب مسجل بهذه الأرقام لدى هذا البنك',
    add_account_btn: '+ إضافة الحساب',
    dup_title: 'تكرار محتمل',
    dup_default: 'توجد عملية سابقة مسجلة بنفس المبلغ في المحفظة.',
    dup_prev_label: 'المسجل سابقاً:',
    dup_prev_fallback: 'عملية بنفس القيمة',
    unlinked_debit_warn: 'تنبيه: كارت الديبت المختار غير مرتبط بحساب بنكي. سحب الكاش يتطلب اختيار حساب بنكي أو ربط الكارت بحساب أولاً لمنع ضياع الأثر المالي.',
    balance_before_label: 'الرصيد قبل ({name}):',
    balance_after_label: 'بعد العملية:',
    negative_balance_cand_warn: 'تحذير: اعتماد هذه العملية سيجعل رصيد الحساب بالسالب!',
    date_prefix: 'التاريخ:',
    ref_prefix: 'المرجع:',
    allowed_senders_label: 'المرسلون المسموحون',
    enabled_count: '{n} مفعّل',
    add_sender_placeholder: 'مثال: CIB, ALEXBANK',
    add_btn: 'إضافة',
    sms_simulator_label: 'محاكي اختبار تحليل رسائل البنك',
    simulate_btn: 'محاكاة',
    reset_demo_btn: 'إعادة ضبط لبيانات تجريبية',
    sim_opt_0: 'شراء CIB (1,250.50 EGP لدى Amazon Egypt)',
    sim_opt_1: 'خصم HSBC (450.00 EGP لدى Starbucks Arkan)',
    sim_opt_2: 'رسالة البنك الأهلي بالعربية (١,٤٥٠.٠٠ ج.م لدى فودافون)',
    sim_opt_3: 'رسالة بنك مصر بالعربية (850.00 جنيه لدى كارفور)',
    sim_opt_4: 'استرداد أمازون (600.00 EGP وارد)',
    sim_opt_5: 'رمز تحقق OTP (يجب رفضه)',
    toast_add_bank_first: 'يرجى إضافة بنك أولاً',
    toast_add_card_first: 'يرجى إضافة كارت أولاً',
    toast_tx_logged: 'تم تسجيل حركة بمبلغ {amount}',
    toast_bank_added: 'تمت إضافة بنك "{name}"',
    toast_account_added: 'تمت إضافة الحساب "{name}"',
    toast_card_added: 'تمت إضافة كارت "{name}"',
    toast_invalid_balance: 'يرجى إدخال رصيد صحيح',
    toast_account_updated: 'تم تحديث الحساب وتسجيل حركة تسوية الرصيد بنجاح',
    toast_account_update_err: 'حدث خطأ أثناء تعديل الحساب',
    toast_card_updated: 'تم تحديث بيانات الكارت بنجاح',
    toast_card_update_err: 'حدث خطأ أثناء تعديل الكارت',
    toast_select_card_approve: 'يرجى اختيار الكارت أو الحساب أولاً لاعتماد العملية',
    toast_unlinked_debit_approve: 'لا يمكن اعتماد عملية سحب نقدي لكارت خصم غير مرتبط بحساب بنكي. يرجى اختيار حساب بنكي أو ربط الكارت بحساب أولاً.',
    confirm_manual_assign: 'تنبيه: بيانات الرسالة تختلف عن الكارت/الحساب المختار!\n({details})\n\nهل تريد تعيين هذه العملية يدوياً؟',
    confirm_neg_cand: 'تحذير: اعتماد هذه العملية سيجعل رصيد الحساب "{name}" بالسالب!\n\n- الرصيد الحالي: {cur}\n- الرصيد المتوقع بعد الاعتماد: {after}\n\nهل تريد بالتأكيد اعتماد هذه العملية؟',
    confirm_neg_manual: 'تحذير: هذه العملية ستجعل رصيد الحساب "{name}" بالسالب!\n\n- الرصيد الحالي: {cur}\n- الرصيد المتوقع: {after}\n\nهل تريد بالتأكيد تسجيل هذه العملية؟',
    toast_imported_tx: 'تم استيراد {merchant} ({amount})',
    toast_approve_err: 'فشل اعتماد العملية',
    toast_tx_discarded: 'تم استبعاد العملية من قائمة الانتظار',
    toast_batch_imported: 'تم اعتماد واستيراد {n} عملية موثقة',
    toast_no_auto_matched: 'لا توجد عمليات مطابقة تلقائياً. يرجى اختيار الكروت يدوياً.',
    confirm_clear_pending: 'هل تريد مسح جميع العمليات المنتظرة من صندوق المراجعة؟',
    toast_inbox_cleared: 'تم مسح صندوق المراجعة',
    toast_sms_enabled: 'تم تفعيل قراءة رسائل البنك',
    toast_sms_disabled: 'تم إيقاف قراءة رسائل البنك',
    toast_perm_granted: 'تم منح صلاحية استقبال الرسائل بنجاح',
    toast_perm_denied: 'تم رفض الصلاحية أو تقييدها في إعدادات أندرويد',
    toast_sender_added: 'تمت إضافة {sender} إلى قائمة المرسلين',
    toast_sender_removed: 'تمت إزالة {sender}',
    toast_sim_parsed: 'تم تحليل العملية: {bank} {amount} {currency}',
    toast_sim_rejected: 'تم رفض الرسالة بأمان: {reason}',
    toast_bio_failed: 'تعذر تفعيل البصمة',
    toast_bio_enabled: 'تم تفعيل الفتح بالبصمة',
    toast_bio_disabled: 'تم إيقاف الفتح بالبصمة',
    toast_bio_wrong_pin: 'رمز PIN الحالي غير صحيح',
    toast_bio_cancelled: 'تم إلغاء تفعيل البصمة',
    toast_bio_unsupported: 'البصمة غير مدعومة على هذا الجهاز أو المتصفح',
    pin_bio_verify_title: 'تأكيد رمز PIN',
    pin_bio_verify_sub: 'أدخل رمز PIN الحالي لتفعيل الفتح بالبصمة',
    pin_waiting_biometric: 'بانتظار البصمة...',
    toast_bio_busy: 'جاري إنهاء عملية البصمة الحالية، يرجى الانتظار',
    toast_bio_cleanup_failed: 'تعذر إلغاء تسجيل البصمة، أعد المحاولة',
    bio_quarantine_msg: 'تعذر إلغاء تسجيل البصمة، أعد المحاولة',
    retry_btn: 'إعادة المحاولة',
    toast_bio_cleanup_ok: 'تم تنظيف تسجيل البصمة بنجاح',
    wallet_banks: 'بنوك المحفظة',
    details: 'التفاصيل',
    hide: 'إخفاء',
    warn_bank_not_added: 'البنك غير مضاف',
    warn_no_account_digits: 'لا يوجد حساب مطابق',
    warn_no_card_or_acc: 'لا يوجد كارت مطابق',
    warn_no_linked_debit: 'حساب غير مرتبط بكارت',
    warn_multiple_matches: 'أكثر من تطابق محتمل',
    warn_missing_digits: 'بدون أرقام تعريفية',
    warn_select_card: 'اختر الكارت أو الحساب',
    toast_autolock_updated: 'تم تحديث مؤقت القفل التلقائي',
    confirm_delete_bank: 'هل تريد حذف بنك {name}؟ سيتم حذف الكروت والحركات المرتبطة به أيضاً.',
    toast_bank_deleted: 'تم حذف بنك {name}',
    confirm_delete_card_tx: 'حذف كارت "{name}" (•••• {last4})؟\n\nتنبيه: توجد {count} حركات مسجلة مرتبطة بهذا الكارت.',
    confirm_delete_card: 'حذف كارت "{name}" (•••• {last4})؟',
    toast_card_deleted: 'تم حذف الكارت',
    confirm_delete_account: 'هل أنت متأكد من حذف الحساب "{name}" ({masked})؟',
    toast_account_deleted: 'تم حذف الحساب "{name}"',
    confirm_delete_tx: 'حذف حركة "{merchant}"؟',
    toast_tx_deleted: 'تم حذف الحركة',
    toast_currency_set: 'العملة: {curr}',
    confirm_clear_all: 'هل أنت متأكد من حذف جميع الكروت والبنوك والحركات؟',
    toast_all_cleared: 'تم مسح جميع البيانات بنجاح',
    confirm_reset_demo: 'هل تريد إعادة ضبط المحفظة إلى بيانات تجريبية؟',
    toast_reset_demo: 'تمت إعادة ضبط المحفظة ببيانات تجريبية',
    toast_no_tx_export: 'لا توجد حركات للتصدير',
    toast_csv_exported: 'تم تصدير ملف CSV بنجاح',
    prompt_cycle_budget: 'تحديد ميزانية الصرف الشخصية لدورة ({stmt}):{limit}\nأدخل ميزانية الدورة:',
    toast_cycle_updated: 'تم تحديث ميزانية دورة ({stmt}) إلى {amount}',
    toast_enter_valid_amount: 'يرجى إدخال مبلغ صحيح',
    confirm_new_cycle_headless: 'بدء دورة كشف جديدة ({badge}) لكارت {name} (•••• {last4}):{limit}\nميزانية الدورة السابقة: {prev}\n\nاضغط موافق للاستمرار على ميزانية الدورة السابقة ({prev})\nأو إلغاء لإدخال ميزانية جديدة.',
    prompt_new_cycle_val: 'أدخل الميزانية الجديدة لدورة ({cycle}):',
    toast_cycle_continued: 'تم اعتماد استمرار ميزانية {amount} لدورة ({cycle})',
    toast_cycle_new_set: 'تم تعيين ميزانية جديدة {amount} لدورة ({cycle})',
    toast_theme_applied: 'تم تطبيق مظهر {name}',
    toast_custom_color_applied: 'تم تطبيق اللون المخصص',
    pin_setup_title: 'إنشاء رمز PIN',
    pin_setup_sub: 'اختر رمزاً من 4 أرقام لتشفير محفظتك',
    pin_confirm_title: 'تأكيد رمز PIN',
    pin_confirm_sub: 'أعد إدخال الرمز المكون من 4 أرقام',
    pin_change_old_title: 'رمز PIN الحالي',
    pin_change_old_sub: 'أدخل رمز PIN الحالي المكون من 4 أرقام',
    pin_change_new_title: 'رمز PIN الجديد',
    pin_change_new_sub: 'أدخل رمز PIN الجديد المكون من 4 أرقام',
    pin_change_confirm_title: 'تأكيد رمز PIN الجديد',
    pin_change_confirm_sub: 'أعد إدخال رمز PIN الجديد',
    pin_unlock_title: 'أمان ApexWallet',
    pin_unlock_sub: 'أدخل رمز PIN المكون من 4 أرقام لفتح المحفظة',
    pin_err_mismatch: 'الرمزان غير متطابقين. حاول مجدداً.',
    pin_err_wrong: 'رمز PIN غير صحيح. حاول مجدداً.',
    pin_err_wrong_old: 'رمز PIN الحالي غير صحيح',
    pin_err_generic: 'حدث خطأ أمني',
    pin_toast_created: 'تم إنشاء رمز PIN وتشفير المحفظة',
    pin_toast_unlocked: 'تم فتح المحفظة',
    pin_toast_changed: 'تم تغيير رمز PIN بنجاح',
    pin_toast_bio_enable_first: 'فعّل البصمة من الإعدادات أولاً',
    pin_toast_bio_unlocked: 'تم الفتح بالبصمة',
    pin_toast_bio_cancelled: 'تم إلغاء البصمة. أدخل رمز PIN.',
    affects_stmt: 'يؤثر على كشف {month}',
    badge_bal_adj: 'تسوية رصيد',
    badge_credit_cash: 'سحب كاش كريدت',
    badge_withdrawal: 'سحب نقدي',
    badge_transfer: 'تحويل',
    badge_purchase: 'شراء',
    cycle_word: 'دورة',
    customizing_prefix: 'تخصيص:',
    credit_limit_paren: '(الحد الائتماني البنكي للكارت: {amount})',
    credit_limit_unrecorded_paren: '(الحد الائتماني البنكي: غير مسجل)',
    example_prefix: 'مثال: {val}',
    prev_budget_btn: 'استمرار بنفس الميزانية (<span dir="ltr" class="font-mono whitespace-nowrap">{amount}</span>)',
    diag_recv_perm: 'صلاحية الاستقبال (RECEIVE_SMS)',
    diag_read_perm: 'صلاحية الرسائل القديمة (READ_SMS)',
    diag_granted: 'ممنوحة',
    diag_denied: 'مرفوضة / مقيدة',
    diag_inactive: 'غير مفعلة',
    diag_restricted_title: 'تنبيه الصلاحيات المقيدة في أندرويد:',
    diag_restricted_desc: 'إذا كان زر الصلاحية معطلاً، افتح إعدادات التطبيق ثم اختر السماح بالإعدادات المقيدة.',
    diag_req_again: 'طلب الصلاحية مجدداً',
    diag_app_settings: 'إعدادات التطبيق',
    diag_sms_switch: 'مفتاح استيراد SMS:',
    diag_vault_enc: 'تشفير طابور الرسائل:',
    diag_queue_cap: 'سعة قائمة الانتظار المشفرة:',
    diag_last_bcast: 'آخر بث وصل للتطبيق:',
    diag_no_bcast: 'لم يصل أي بث من أندرويد حتى الآن',
    diag_sender_prefix: 'المصدر:',
    diag_battery_title: 'إدارة البطارية في الخلفية',
    diag_battery_desc: 'لضمان استلام الرسائل فوراً، اضبط البطارية للتطبيق على "بدون قيود".',
    diag_battery_btn: 'فتح إعدادات توفير البطارية',
    diag_refresh_btn: 'تحديث الحالة',
    diag_items_of: '{count} من {cap}',
    hist_perm_req: 'مطلوب صلاحية قراءة الرسائل (READ_SMS)',
    hist_perm_desc: 'لاستيراد العمليات البنكية السابقة، يحتاج التطبيق لموافقتك لقراءة الرسائل البنكية محلياً فقط.',
    hist_grant_btn: 'الموافقة ومنح الصلاحية',
    hist_choose_range: 'اختر الفترة الزمنية للاستيراد:',
    hist_1m: 'آخر شهر',
    hist_3m: 'آخر 3 شهور',
    hist_1y: 'آخر سنة',
    hist_start_scan: 'بدء فحص واستيراد الدفعة الأولى',
    hist_scanning: 'جاري الفحص الدقيق...',
    hist_scan_found: 'عُثر على {n} عملية جديدة',
    hist_open_review: 'فتح المراجعة ({n})',
    hist_next_batch: 'فحص الدفعة التالية (20)',
    hist_done: 'اكتمل الفحص',
    search_bank_placeholder: 'ابحث عن البنك...',
    other_bank_name_label: 'اسم البنك',
    other_bank_name_placeholder: 'اكتب اسم البنك هنا',
    card_look_label: 'شكل وتصميم الكارت',
    tier_classic: 'كلاسيك',
    tier_gold: 'جولد',
    tier_titanium: 'تيتانيوم',
    tier_platinum: 'بلاتينيوم',
    tier_world: 'ورلد',
    tier_cashback: 'كاش باك',
    tier_debit: 'ديبت',
    default_no_look: 'افتراضي (بدون تصميم خاص)',
    bank_variants_title: 'تصاميم البنك المخصصة',
    tier_styles_title: 'أنماط الفئات الـ 7 (ملونة بلون البنك)',
    other_bank: 'بنك آخر'
  },
  en: {
    home: 'Home',
    activity: 'Activity',
    review: 'Review',
    wallets: 'Wallets',
    settings: 'Settings',
    cards: 'Cards',
    banks: 'Banks',
    history: 'Activity',
    back: 'Back',
    security: 'Security',
    sms_intake: 'SMS Intake',
    backup_general: 'Backup & General',
    left_of: 'left of',
    cycle_purchases: 'Cycle purchases',
    cash_advance_debt: 'Cash advance (debt)',
    total_owed: 'Total owed',
    bank_messages_ready: '{n} bank messages ready',
    messages_waiting: '{n} messages waiting',
    review_btn: 'Review',
    recent_activity: 'Recent activity',
    no_activity: 'No activity recorded yet',
    all_history: 'All History',
    cycle_budget: 'Cycle Budget',
    credit_limit: 'Credit Limit',
    not_recorded: 'Not set',
    na_debit: 'Debit Card',
    view_activity: 'View Activity',
    edit_card: 'Edit Card',
    pin_code: 'PIN Code',
    digits_4: '4 digits',
    change: 'Change',
    biometric_unlock: 'Biometric Unlock',
    not_enabled: 'Disabled',
    enabled: 'Enabled',
    bio_not_supported: 'Not supported in this browser',
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
    create_new_title: 'Create New',
    qa_subtitle: 'Choose an item to add',
    qa_log_tx: 'Log Transaction',
    qa_log_tx_desc: 'Auto-calculated billing statement cycle',
    qa_add_card: 'Add Bank Card / Account',
    qa_add_card_desc: 'Credit, Debit, or Account (Max 3 per bank)',
    qa_add_bank: 'Add New Bank',
    qa_add_bank_desc: 'Custom bank name and color',
    qa_lock_desc: 'Lock session with your 4-digit PIN',
    qa_change_pin: 'Change Security PIN',
    qa_change_pin_desc: 'Update your 4-digit master PIN',
    qa_clear_desc: 'Reset everything back to zero',
    purchase: 'Purchase',
    transfer: 'Transfer',
    withdrawal: 'Cash withdrawal',
    incoming_refund: 'Incoming / Refund',
    amount: 'Amount',
    merchant_label: 'Merchant / Description',
    merchant_placeholder: 'Carrefour, Talabat, Amazon...',
    chip_carrefour: 'Carrefour',
    chip_talabat: 'Talabat',
    chip_starbucks: 'Starbucks',
    chip_amazon: 'Amazon',
    card_account: 'Card / Account',
    category: 'Category',
    date_label: 'Date',
    notes: 'Notes',
    notes_optional: 'Notes (Optional)',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    done: 'Done',
    confirm: 'Confirm',
    batch_approve: 'Batch Approve',
    clear_all: 'Clear All',
    unmatched: 'Unmatched',
    approve: 'Approve',
    reject: 'Reject',
    edit_details: 'Edit details',
    over_limit: 'Over Limit',
    warning_limit: 'Near Limit',
    add_bank: 'Add Bank',
    add_card: 'Add Card',
    add_account: 'Add Account',
    correct_balance: 'Correct Balance',
    delete: 'Delete',
    your_wallet_ready: 'Your Wallet is Ready',
    no_cards_yet: 'No Cards Added Yet',
    no_banks_yet: 'No Banks Added Yet',
    add_first_bank: 'Add Your Bank',
    add_first_card: 'Add Your First Card',
    cards_under_bank: 'Max {n} cards per bank',
    max_3_reached: 'Maximum 3 cards reached for this bank',
    bank_accounts_count: 'Bank Accounts ({n})',
    no_accounts_for_bank: 'No bank accounts added for this bank',
    registered_cards: 'Registered Cards',
    inbox_empty: 'Review Inbox is Empty',
    inbox_empty_desc: 'New incoming bank transactions will automatically appear here.',
    all_cycles: 'All Cycles',
    search_placeholder: 'Search transactions...',
    no_transactions_yet: 'No transactions recorded yet',
    log_first_expense: 'Log Transaction',
    cat_groceries: 'Groceries',
    cat_food: 'Food & Dining',
    cat_shopping: 'Shopping',
    cat_utilities: 'Bills & Utilities',
    cat_entertainment: 'Entertainment',
    cat_travel: 'Travel',
    cat_health: 'Health & Medical',
    cat_services: 'Subscriptions',
    cat_other: 'Other',
    max_3_per_bank_desc: 'Max 3 cards per bank',
    bank_name_label: 'Bank Name',
    bank_code_label: 'Short Code',
    brand_color_label: 'Brand Accent Color',
    custom_color: 'Custom Color',
    save_bank: 'Save Bank',
    add_card_account: 'Add Card / Account',
    add_card_account_desc: 'Add cards or bank accounts for auto SMS matching',
    bank_label: 'Bank',
    type_label: 'Type',
    card_credit: 'Credit',
    card_debit: 'Debit',
    card_account_type: 'Account',
    card_prepaid: 'Prepaid',
    nickname_label: 'Nickname',
    digits_4_label: '4 Identifier Digits',
    digits_pos_label: 'Digits position in bank SMS:',
    digits_last: 'Last 4',
    digits_first: 'First 4',
    digits_pos_hint: 'Enter identifier digits exactly as shown in bank SMS (e.g. ending in 1234 or starting with 1234).',
    linked_account_opt: 'Linked Bank Account (Optional)',
    none_independent_debit: 'None (Independent Debit)',
    credit_limit_label: 'Bank Credit Limit',
    credit_limit_placeholder: 'Optional (e.g. 50000)',
    cycle_budget_label: 'Personal Spending Budget',
    current_balance_label: 'Current Account Balance',
    balance_example_ph: 'e.g. 25000',
    balance_local_note: 'Balance is calculated locally and not synced directly with the bank.',
    cycle_budget_optional: 'Personal Spending Budget (Optional)',
    billing_cycle_days: 'Billing Cycle Days (1–31)',
    start_day: 'Start Day',
    end_day: 'End Day',
    cycle_rollover_hint: 'Purchases after the start day roll into the next month statement.',
    save_card_account: 'Save Card / Account',
    save_bank_account: 'Save Bank Account',
    save_card: 'Save Card',
    customize_card_title: 'Customize Card Color',
    customize_card_sub: 'Choose official bank colors or custom gradient',
    official_bank_colors: 'Official Bank Colors',
    luxury_gradients: 'Luxury Gradients',
    pick_custom_color: 'Pick Custom Color',
    pick_custom_color_desc: 'Creates matching gradient automatically',
    review_modal_sub: 'Review and approve parsed bank transactions',
    diag_modal_title: 'Bank SMS Diagnostics',
    diag_modal_sub: 'Real-time SMS listener & permission state',
    hist_modal_title: 'Import Historical Bank SMS',
    hist_modal_sub: 'Safely scan past SMS inbox in small batches',
    new_cycle_started_title: 'New Statement Cycle Started',
    billing_cycle_label: 'Billing Cycle:',
    prev_cycle_budget_label: 'Previous Cycle Budget:',
    bank_credit_limit_colon: 'Bank Credit Limit:',
    continue_prev_budget: 'Continue with previous budget',
    or_set_new_budget: 'Or set a new budget',
    new_budget_cycle_only: 'New budget for this cycle only:',
    enter_amount_placeholder: 'Enter amount',
    edit_account_title: 'Edit Account & Adjust Balance',
    account_name_label: 'Account Name',
    corrected_balance_label: 'Corrected Actual Balance',
    balance_adjust_note: 'Balance adjustment records an audit entry without altering historical transactions.',
    adjust_reason_label: 'Adjustment Reason / Notes (Optional)',
    adjust_reason_placeholder: 'e.g. Bank statement reconciliation',
    save_account_changes: 'Save Changes & Adjust Balance',
    edit_card_title: 'Edit Card Details',
    card_name_label: 'Card Name',
    linked_account_deduct: 'Linked Bank Account (Deductions)',
    linked_account_future_note: 'Linking applies only to future transactions and leaves past records untouched.',
    monthly_budget_label: 'Monthly Spending Budget',
    optional_leave_empty: 'Optional (leave empty if unused)',
    save_card_changes: 'Save Card Changes',
    summary_purchase: 'Charged {amount} on {card} at {merchant}',
    summary_withdrawal: 'Cash withdrawal {amount} at ATM via {card}',
    summary_transfer: 'Transfer {amount} via {card} to {merchant}',
    summary_income: 'Incoming / Refund {amount} to {card} from {merchant}',
    select_card_or_account: '-- Select Card / Account --',
    cards_optgroup: 'Cards',
    accounts_optgroup: 'Bank Accounts',
    balance_word: 'Balance',
    historical_badge: 'Historical',
    choose_card_badge: 'Select Card',
    non_match_prefix: 'Unmatched reason:',
    non_match_default: 'No matching card or account registered for these digits at this bank',
    add_account_btn: '+ Add Account',
    dup_title: 'Possible Duplicate',
    dup_default: 'A previous transaction with the same amount already exists.',
    dup_prev_label: 'Previously logged:',
    dup_prev_fallback: 'Same amount entry',
    unlinked_debit_warn: 'Warning: Selected debit card is not linked to a bank account. Link it or pick an account to track cash withdrawal balance.',
    balance_before_label: 'Balance before ({name}):',
    balance_after_label: 'After:',
    negative_balance_cand_warn: 'Warning: Approving this will make the account balance negative!',
    date_prefix: 'Date:',
    ref_prefix: 'Ref:',
    allowed_senders_label: 'Allowed Bank Senders',
    enabled_count: '{n} enabled',
    add_sender_placeholder: 'e.g. CIB, ALEXBANK',
    add_btn: 'Add',
    sms_simulator_label: 'SMS Parser Test Simulator',
    simulate_btn: 'Simulate',
    reset_demo_btn: 'Reset Wallet to Demo Data',
    sim_opt_0: 'CIB Purchase (1,250.50 EGP at Amazon Egypt)',
    sim_opt_1: 'HSBC POS Debit (450.00 EGP at Starbucks Arkan)',
    sim_opt_2: 'NBE Arabic (١,٤٥٠.٠٠ ج.م at Vodafone)',
    sim_opt_3: 'Banque Misr Arabic (850.00 EGP at Carrefour)',
    sim_opt_4: 'Amazon Refund (600.00 EGP Income Credit)',
    sim_opt_5: 'Security OTP (Must be REJECTED)',
    toast_add_bank_first: 'Please add a bank first',
    toast_add_card_first: 'Please add a card first',
    toast_tx_logged: 'Transaction of {amount} logged',
    toast_bank_added: 'Bank "{name}" added',
    toast_account_added: 'Bank account "{name}" added',
    toast_card_added: 'Card "{name}" added',
    toast_invalid_balance: 'Please enter a valid balance',
    toast_account_updated: 'Account updated and balance adjustment logged',
    toast_account_update_err: 'Error updating account',
    toast_card_updated: 'Card details updated',
    toast_card_update_err: 'Error updating card',
    toast_select_card_approve: 'Please select a card or account before approving',
    toast_unlinked_debit_approve: 'Cannot approve cash withdrawal for unlinked debit card. Select an account or link the card first.',
    confirm_manual_assign: 'Alert: SMS details differ from the selected card/account!\n({details})\n\nAssign this transaction manually?',
    confirm_neg_cand: 'Warning: Approving this will make account "{name}" negative!\n\n- Current balance: {cur}\n- Expected after: {after}\n\nAre you sure you want to approve?',
    confirm_neg_manual: 'Warning: This transaction will make account "{name}" negative!\n\n- Current balance: {cur}\n- Expected balance: {after}\n\nAre you sure you want to log it?',
    toast_imported_tx: 'Imported {merchant} ({amount})',
    toast_approve_err: 'Failed to approve transaction',
    toast_tx_discarded: 'Transaction discarded from queue',
    toast_batch_imported: 'Imported {n} verified transactions',
    toast_no_auto_matched: 'No auto-matched transactions. Please select cards individually.',
    confirm_clear_pending: 'Clear all pending transactions from review inbox?',
    toast_inbox_cleared: 'SMS review inbox cleared',
    toast_sms_enabled: 'Bank SMS Import enabled',
    toast_sms_disabled: 'Bank SMS Import disabled',
    toast_perm_granted: 'RECEIVE_SMS permission granted',
    toast_perm_denied: 'SMS permission denied or restricted in Android settings',
    toast_sender_added: 'Added {sender} to allowed senders',
    toast_sender_removed: 'Removed {sender}',
    toast_sim_parsed: 'Parsed: {bank} {amount} {currency}',
    toast_sim_rejected: 'Message safely rejected: {reason}',
    toast_bio_failed: 'Failed to activate biometrics',
    toast_bio_enabled: 'Biometric unlock activated',
    toast_bio_disabled: 'Biometrics disabled',
    toast_autolock_updated: 'Auto-lock timer updated',
    confirm_delete_bank: 'Delete bank {name}? This will also delete associated cards and transactions.',
    toast_bank_deleted: 'Bank {name} deleted',
    confirm_delete_card_tx: 'Delete card "{name}" (•••• {last4})?\n\nWarning: {count} transactions are linked to this card.',
    confirm_delete_card: 'Delete card "{name}" (•••• {last4})?',
    toast_card_deleted: 'Card deleted',
    confirm_delete_account: 'Delete account "{name}" ({masked})?',
    toast_account_deleted: 'Account "{name}" deleted',
    confirm_delete_tx: 'Delete transaction "{merchant}"?',
    toast_tx_deleted: 'Transaction deleted',
    toast_currency_set: 'Currency: {curr}',
    confirm_clear_all: 'Are you sure you want to delete all cards, banks, and transactions?',
    toast_all_cleared: 'All data cleared',
    confirm_reset_demo: 'Reset wallet to realistic demo sample data?',
    toast_reset_demo: 'Wallet reset to demo data',
    toast_no_tx_export: 'No transactions to export',
    toast_csv_exported: 'Exported CSV file',
    prompt_cycle_budget: 'Set personal spending budget for cycle ({stmt}):{limit}\nEnter cycle budget:',
    toast_cycle_updated: 'Updated cycle ({stmt}) budget to {amount}',
    toast_enter_valid_amount: 'Please enter a valid amount',
    confirm_new_cycle_headless: 'New statement cycle ({badge}) for {name} (•••• {last4}):{limit}\nPrevious budget: {prev}\n\nPress OK to keep previous budget ({prev})\nor Cancel to enter a new budget.',
    prompt_new_cycle_val: 'Enter new budget for cycle ({cycle}):',
    toast_cycle_continued: 'Kept budget of {amount} for cycle ({cycle})',
    toast_cycle_new_set: 'Set new budget {amount} for cycle ({cycle})',
    toast_theme_applied: 'Applied {name} theme',
    toast_custom_color_applied: 'Custom color applied',
    toast_bio_wrong_pin: 'Incorrect current PIN',
    toast_bio_cancelled: 'Biometric setup cancelled',
    toast_bio_unsupported: 'Biometrics not supported on this device/browser',
    pin_bio_verify_title: 'Confirm Security PIN',
    pin_bio_verify_sub: 'Enter your current PIN to enable biometric unlock',
    pin_waiting_biometric: 'Waiting for fingerprint...',
    toast_bio_busy: 'Previous biometric operation is still finishing',
    toast_bio_cleanup_failed: 'Could not remove biometric registration, retry',
    bio_quarantine_msg: 'Could not remove biometric registration, retry',
    retry_btn: 'Retry',
    toast_bio_cleanup_ok: 'Biometric registration cleared',
    wallet_banks: 'Wallet Banks',
    details: 'Details',
    hide: 'Hide',
    warn_bank_not_added: 'Bank not added',
    warn_no_account_digits: 'No matching account',
    warn_no_card_or_acc: 'No matching card',
    warn_no_linked_debit: 'No linked debit card',
    warn_multiple_matches: 'Multiple matches',
    warn_missing_digits: 'No card digits',
    warn_select_card: 'Select card/account',
    pin_setup_title: 'Create Security PIN',
    pin_setup_sub: 'Choose a 4-digit PIN to encrypt your wallet',
    pin_confirm_title: 'Confirm Security PIN',
    pin_confirm_sub: 'Re-enter your 4-digit PIN to verify',
    pin_change_old_title: 'Current Security PIN',
    pin_change_old_sub: 'Enter your current 4-digit PIN',
    pin_change_new_title: 'New Security PIN',
    pin_change_new_sub: 'Enter your new 4-digit PIN',
    pin_change_confirm_title: 'Confirm New PIN',
    pin_change_confirm_sub: 'Re-enter your new 4-digit PIN',
    pin_unlock_title: 'ApexWallet Security',
    pin_unlock_sub: 'Enter your 4-digit PIN to unlock your vault',
    pin_err_mismatch: 'PINs do not match. Try again.',
    pin_err_wrong: 'Incorrect PIN. Please try again.',
    pin_err_wrong_old: 'Incorrect current PIN',
    pin_err_generic: 'Security error occurred',
    pin_toast_created: 'Security PIN created & vault encrypted',
    pin_toast_unlocked: 'Wallet unlocked',
    pin_toast_changed: 'Security PIN changed',
    pin_toast_bio_enable_first: 'Enable Biometrics in Settings first',
    pin_toast_bio_unlocked: 'Unlocked with Biometrics',
    pin_toast_bio_cancelled: 'Biometric cancelled. Enter PIN.',
    affects_stmt: 'Affects {month} Statement',
    badge_bal_adj: 'Adjustment',
    badge_credit_cash: 'Credit Cash',
    badge_withdrawal: 'Withdrawal',
    badge_transfer: 'Transfer',
    badge_purchase: 'Purchase',
    cycle_word: 'Cycle',
    customizing_prefix: 'Customizing:',
    credit_limit_paren: '(Bank Credit Limit: {amount})',
    credit_limit_unrecorded_paren: '(Bank Credit Limit: Not set)',
    example_prefix: 'e.g. {val}',
    prev_budget_btn: 'Continue with previous budget ({amount})',
    diag_recv_perm: 'Receive Permission (RECEIVE_SMS)',
    diag_read_perm: 'Read Past SMS (READ_SMS)',
    diag_granted: 'Granted',
    diag_denied: 'Denied / Restricted',
    diag_inactive: 'Inactive',
    diag_restricted_title: 'Android Restricted Settings Notice:',
    diag_restricted_desc: 'If permission toggle is disabled, open App Settings and tap "Allow restricted settings".',
    diag_req_again: 'Request Again',
    diag_app_settings: 'App Settings',
    diag_sms_switch: 'SMS Import Toggle:',
    diag_vault_enc: 'SMS Queue Vault:',
    diag_queue_cap: 'Encrypted Queue Capacity:',
    diag_last_bcast: 'Last Broadcast Received:',
    diag_no_bcast: 'No Android broadcast received yet',
    diag_sender_prefix: 'Sender:',
    diag_battery_title: 'Background Battery Optimization',
    diag_battery_desc: 'Set battery optimization to "Unrestricted" for reliable SMS reception.',
    diag_battery_btn: 'Open Battery Settings',
    diag_refresh_btn: 'Refresh Status',
    diag_items_of: '{count} of {cap}',
    hist_perm_req: 'READ_SMS Permission Required',
    hist_perm_desc: 'Allow local read access to scan past bank SMS transactions safely.',
    hist_grant_btn: 'Grant Permission',
    hist_choose_range: 'Select scan date range:',
    hist_1m: 'Last Month',
    hist_3m: 'Last 3 Months',
    hist_1y: 'Last Year',
    hist_start_scan: 'Start First Batch Scan',
    hist_scanning: 'Scanning...',
    hist_scan_found: 'Found {n} new transactions',
    hist_open_review: 'Open Review ({n})',
    hist_next_batch: 'Scan Next Batch (20)',
    hist_done: 'Scan Complete',
    search_bank_placeholder: 'Search bank...',
    other_bank_name_label: 'Bank Name',
    other_bank_name_placeholder: 'Type bank name here',
    card_look_label: 'Card Look & Tier Style',
    tier_classic: 'Classic',
    tier_gold: 'Gold',
    tier_titanium: 'Titanium',
    tier_platinum: 'Platinum',
    tier_world: 'World',
    tier_cashback: 'Cashback',
    tier_debit: 'Debit',
    default_no_look: 'Default (No special look)',
    bank_variants_title: 'Bank Real Card Looks',
    tier_styles_title: '7 Tier Styles (Tinted)',
    other_bank: 'Other bank'
  }
};

function getLang() {
  return localStorage.getItem('apexwallet_lang_pref') || 'ar';
}

function setLang(newLang) {
  localStorage.setItem('apexwallet_lang_pref', newLang);
  applyDocumentLanguage();
  if (typeof window.__onLanguageChanged === 'function') {
    window.__onLanguageChanged();
  }
}

function localizeStaticDom() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.setAttribute('placeholder', t(key));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.setAttribute('title', t(key));
  });
}

function applyDocumentLanguage() {
  const lang = getLang();
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' ? 'rtl' : 'ltr');
  }
  localizeStaticDom();
}

function t(key, params = {}) {
  const lang = getLang();
  let str = (I18N[lang] && I18N[lang][key]) || (I18N['en'] && I18N['en'][key]) || key;
  Object.keys(params).forEach(k => {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
  });
  return str;
}

const AR_MONTH_MAP = {
  jan: 'يناير', january: 'يناير',
  feb: 'فبراير', february: 'فبراير',
  mar: 'مارس', march: 'مارس',
  apr: 'أبريل', april: 'أبريل',
  may: 'مايو',
  jun: 'يونيو', june: 'يونيو',
  jul: 'يوليو', july: 'يوليو',
  aug: 'أغسطس', august: 'أغسطس',
  sep: 'سبتمبر', sept: 'سبتمبر', september: 'سبتمبر',
  oct: 'أكتوبر', october: 'أكتوبر',
  nov: 'نوفمبر', november: 'نوفمبر',
  dec: 'ديسمبر', december: 'ديسمبر'
};

function localizeMonthName(name) {
  if (!name) return '';
  if (getLang() !== 'ar') return String(name);
  const key = String(name).trim().toLowerCase();
  return AR_MONTH_MAP[key] || AR_MONTH_MAP[key.slice(0, 3)] || String(name);
}

function localizeCycleText(text) {
  if (!text) return '';
  if (getLang() !== 'ar') return String(text);
  let out = String(text);
  // "Dec 2026 Stmt" / "Nov 2026 Statement" -> "كشف ديسمبر 2026"
  out = out.replace(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})\s+(?:Stmt|Statement)\b/gi, (_, m, y) => {
    return `كشف ${localizeMonthName(m)} ${y}`;
  });
  // "Nov 25 – Dec 24, 2026" -> "25 نوفمبر – 24 ديسمبر 2026"
  out = out.replace(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})\s*([–-])\s*(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t|tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),?\s*(\d{4})\b/gi, (_, m1, d1, dash, m2, d2, y) => {
    return `${d1} ${localizeMonthName(m1)} ${dash} ${d2} ${localizeMonthName(m2)} ${y}`;
  });
  // Replace remaining month names
  out = out.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)\b/gi, (m) => {
    return localizeMonthName(m);
  });
  out = out.replace(/,\s*(\d{4})\b/g, ' $1');
  out = out.replace(/\b(Stmt|Statement)\b/gi, 'كشف');
  return out;
}

function formatAmountInlineHtml(amount, options = {}) {
  const {
    showPlus = false,
    prefixSign = '',
    currency = (typeof currentCurrency !== 'undefined' ? currentCurrency : 'EGP'),
    useSans = false,
    smallDecimals = false,
    numClass = '',
    decClass = 'text-[0.82em]',
    currClass = 'text-[0.68em] text-[#C8CAD0] font-semibold'
  } = options;
  const num = Number(amount) || 0;
  const formatted = formatCurrency(Math.abs(num), currency);
  const sign = prefixSign || (num < 0 ? '-' : (showPlus ? '+' : ''));
  const fontCls = useSans ? 'font-sans-num' : 'font-mono';

  function splitDec(nStr) {
    if (!smallDecimals) return nStr;
    const dotIdx = nStr.indexOf('.');
    if (dotIdx === -1) return nStr;
    return `${nStr.slice(0, dotIdx)}<span class="${decClass}">${nStr.slice(dotIdx)}</span>`;
  }

  const trailingMatch = formatted.match(/^([\d,.-]+)\s+([A-Za-z]+)$/);
  if (trailingMatch) {
    return `<span class="inline-flex items-baseline gap-[3px] whitespace-nowrap ${fontCls} amount-ltr" dir="ltr"><span class="${numClass}">${sign}${splitDec(trailingMatch[1])}</span><span class="${currClass}">${trailingMatch[2]}</span></span>`;
  }
  const leadingMatch = formatted.match(/^([$€£])([\d,.]+)$/);
  if (leadingMatch) {
    return `<span class="inline-flex items-baseline gap-[1px] whitespace-nowrap ${fontCls} amount-ltr" dir="ltr"><span class="${currClass}">${sign}${leadingMatch[1]}</span><span class="${numClass}">${splitDec(leadingMatch[2])}</span></span>`;
  }
  return `<span class="whitespace-nowrap ${fontCls} amount-ltr ${numClass}" dir="ltr">${sign}${formatted}</span>`;
}

window.localizeMonthName = localizeMonthName;
window.localizeCycleText = localizeCycleText;

window.getLang = getLang;
window.setLang = setLang;
window.t = t;
window.localizeStaticDom = localizeStaticDom;
window.formatAmountInlineHtml = formatAmountInlineHtml;

function initApp() {
  try {
    const store = window.walletStore || window.store;

  applyDocumentLanguage();

  // Selected featured card & expand state on Overview
  let activeFeaturedCardId = store.cards.length > 0 ? store.cards[0].id : null;
  let isHeroCardExpanded = false;
  let editingCardId = null;
  let previousTab = 'dashboard';
  const expandedSmsEditIds = new Set();
  const expandedSmsWarnIds = new Set();

  function escapeHtmlText(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatWalletBanksCount(count) {
    const n = Number(count) || 0;
    if (getLang() === 'ar') {
      if (n === 0) return '0 بنوك مضافة';
      if (n === 1) return 'بنك واحد مضاف';
      if (n === 2) return 'بنكان مضافان';
      if (n <= 10) return `${n} بنوك مضافة`;
      return `${n} بنكاً مضافاً`;
    }
    if (n === 1) return '1 bank';
    return `${n} banks`;
  }

  function getCalmNonMatchTitle(c) {
    const reason = (c && c.nonMatchReason) ? String(c.nonMatchReason) : '';
    if (reason.includes('غير مسجل في محفظتك')) return t('warn_bank_not_added');
    if (reason.includes('لا يوجد حساب بنكي')) return t('warn_no_account_digits');
    if (reason.includes('لا يوجد كارت أو حساب')) return t('warn_no_card_or_acc');
    if (reason.includes('لا يوجد كارت خصم مرتبط')) return t('warn_no_linked_debit');
    if (reason.includes('أكثر من تطابق')) return t('warn_multiple_matches');
    if (reason.includes('لا تحتوي على أرقام')) return t('warn_missing_digits');
    return t('warn_select_card');
  }

  window.__onLanguageChanged = () => {
    if (typeof updateHeaderTitle === 'function') updateHeaderTitle(store.activeTab);
    if (typeof switchView === 'function') {
      navButtons.forEach(btn => {
        const tab = btn.dataset.tab;
        const label = btn.querySelector('.tab-label');
        if (label) {
          if (tab === 'dashboard') label.textContent = t('home');
          else if (tab === 'history') label.textContent = t('activity');
          else if (tab === 'review') label.textContent = t('review');
          else if (tab === 'cards') label.textContent = t('wallets');
        }
      });
    }
    if (typeof renderCurrentView === 'function') renderCurrentView();
    if (typeof updateDockSlidingPill === 'function') {
      requestAnimationFrame(() => updateDockSlidingPill(store.activeTab));
    }
  };

  // --- Soft Circular Touch Ripple ---
  if (typeof document !== 'undefined' && !window.__apexRippleBound) {
    window.__apexRippleBound = true;
    document.addEventListener('pointerdown', (e) => {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const target = e.target && e.target.closest ? e.target.closest('button, .bank-card-face, .active-press, .floating-nav-tab') : null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const prevPos = window.getComputedStyle ? window.getComputedStyle(target).position : '';
      if (prevPos === 'static') target.style.position = 'relative';
      const ripple = document.createElement('span');
      ripple.className = 'touch-ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      target.appendChild(ripple);
      setTimeout(() => { try { ripple.remove(); } catch (_) {} }, 450);
    }, { passive: true });
  }

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

  // --- Navigation & Sliding Pill Controller ---
  function updateHeaderTitle(targetTab) {
    const headerTitle = document.getElementById('header-title');
    if (!headerTitle) return;
    if (targetTab === 'dashboard') headerTitle.textContent = t('home');
    else if (targetTab === 'cards') headerTitle.textContent = t('wallets');
    else if (targetTab === 'history') headerTitle.textContent = t('activity');
    else if (targetTab === 'review') headerTitle.textContent = t('review');
    else if (targetTab === 'settings') headerTitle.textContent = t('settings');
  }

  function updateDockSlidingPill(targetTab) {
    const nav = document.getElementById('floating-bottom-nav');
    const pill = document.getElementById('nav-sliding-pill');
    if (!nav || !pill || typeof nav.querySelector !== 'function') return;
    const activeBtn = nav.querySelector(`.floating-nav-tab[data-tab="${targetTab}"]`);
    if (!activeBtn) {
      pill.style.opacity = '0';
      return;
    }
    const left = activeBtn.offsetLeft;
    const width = activeBtn.offsetWidth;
    if (width > 0) {
      pill.style.width = width + 'px';
      pill.style.transform = `translateX(${left}px)`;
      pill.style.opacity = '1';
      activeBtn.classList.remove('no-pill-fallback');
    } else {
      activeBtn.classList.add('no-pill-fallback');
    }
  }

  if (typeof window !== 'undefined' && !window.__apexResizePillBound) {
    window.__apexResizePillBound = true;
    window.addEventListener('resize', () => {
      updateDockSlidingPill(store.activeTab);
    });
  }

  function switchView(targetTab) {
    const isTabChange = store.activeTab !== targetTab;
    if (store.activeTab && store.activeTab !== 'settings') {
      previousTab = store.activeTab;
    }
    store.activeTab = targetTab;

    // Update floating nav buttons + localized labels (always visible)
    navButtons.forEach(btn => {
      const tab = btn.dataset.tab;
      const label = btn.querySelector('.tab-label');
      if (label) {
        label.classList.remove('hidden');
        if (tab === 'dashboard') label.textContent = t('home');
        else if (tab === 'history') label.textContent = t('activity');
        else if (tab === 'review') label.textContent = t('review');
        else if (tab === 'cards') label.textContent = t('wallets');
      }
      if (tab === targetTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active', 'no-pill-fallback');
      }
    });

    // Toggle view containers with subtle section transition on tab change
    Object.keys(views).forEach(k => {
      if (views[k]) {
        if (k === targetTab) {
          views[k].classList.remove('hidden');
          if (isTabChange) {
            views[k].classList.remove('view-enter');
            void views[k].offsetWidth;
            views[k].classList.add('view-enter');
          }
        } else {
          views[k].classList.add('hidden');
          views[k].classList.remove('view-enter');
        }
      }
    });

    // Update Top Bar Title & Back Button
    const headerBackBtn = document.getElementById('header-back-btn');
    if (headerBackBtn) {
      if (targetTab === 'settings') {
        headerBackBtn.classList.remove('hidden');
      } else {
        headerBackBtn.classList.add('hidden');
      }
    }
    updateHeaderTitle(targetTab);

    renderCurrentView();
    updateReviewBadge();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => updateDockSlidingPill(targetTab));
    } else {
      updateDockSlidingPill(targetTab);
    }

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
        showToast(t('toast_add_bank_first'), 'info');
        setTimeout(() => openModal('bank'), 150);
      } else {
        showToast(t('toast_add_card_first'), 'info');
        setTimeout(() => openModal('card'), 150);
      }
      return;
    }
    setTimeout(() => openModal('transaction'), 150);
  });
  document.getElementById('qa-add-card')?.addEventListener('click', () => {
    closeModal('quickActions');
    if (store.banks.length === 0) {
      showToast(t('toast_add_bank_first'), 'info');
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
          <span class="inline-flex items-center gap-1 font-bold text-[#F5B700] bg-[#2A2B31] px-2.5 py-0.5 rounded-full text-[10px] border border-[#43464F]">
            ${t('affects_stmt', { month: localizeMonthName(info.statementMonthName.substring(0, 3)) })}
          </span>
        `;
        previewRange.innerHTML = `
          <span class="text-xs text-[#C8CAD0] mt-1 block">
            <span dir="ltr" class="font-mono">${card.cycleStartDay} → ${card.cycleEndDay}</span> (${localizeCycleText(info.cycleRange)})
          </span>
        `;
      }
    } else if (card) {
      previewBox.classList.remove('hidden');
      previewBadge.innerHTML = `
        <span class="inline-flex items-center gap-1 font-bold text-[#F3F1EC] bg-[#2A2B31] px-2.5 py-0.5 rounded-full text-[10px] border border-[#43464F]">
          ${t('card_' + card.cardType)}
        </span>
      `;
      previewRange.innerHTML = `
        <span class="text-xs text-[#C8CAD0] mt-1 block">
          ${getLang() === 'ar' ? 'عملية مباشرة تُسجل بتاريخ اليوم.' : 'Direct transaction logged against current date.'}
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

    beforeEl.textContent = `${t('balance_before_label', { name: targetAccount.name })} ${formatCurrency(currentBalance)}`;
    afterEl.textContent = `${t('balance_after_label')} ${formatCurrency(expectedAfter)}`;
    afterEl.className = expectedAfter < 0 ? 'font-mono text-[#E6A8A8] font-bold' : 'font-mono text-[#F3F1EC] font-bold';

    if (amountVal > 0 && expectedAfter < 0) {
      warnEl.classList.remove('hidden');
      warnEl.textContent = t('negative_balance_cand_warn');
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
          linkedSelect.innerHTML = `<option value="">${t('none_independent_debit')}</option>` +
            accs.map(a => `<option value="${a.id}">${a.name} (${a.accountNumberMasked || a.identifierDigits})</option>`).join('');
        }
      } else {
        linkedAccContainer.classList.add('hidden');
      }
    }

    const targetHelp = document.getElementById('card-target-help');

    if (targetLabel && targetInput) {
      if (cardType === 'account') {
        targetLabel.textContent = t('current_balance_label');
        targetInput.placeholder = t('balance_example_ph');
        targetInput.required = false;
        if (targetHelp) {
          targetHelp.textContent = t('balance_local_note');
          targetHelp.classList.remove('hidden');
        }
      } else if (cardType === 'credit') {
        targetLabel.textContent = t('cycle_budget_label');
        targetInput.placeholder = '15000';
        targetInput.required = true;
        if (targetHelp) targetHelp.classList.add('hidden');
      } else {
        targetLabel.textContent = t('cycle_budget_optional');
        targetInput.placeholder = '15000';
        targetInput.required = false;
        if (targetHelp) targetHelp.classList.add('hidden');
      }
    }

    if (submitBtnText) {
      submitBtnText.textContent = cardType === 'account' ? t('save_bank_account') : t('save_card');
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

  function ensureBankInStore(bankKey, isOther, customName) {
    if (isOther) {
      const cleanName = (customName || '').trim() || (getLang() === 'en' ? 'Other bank' : 'بنك آخر');
      let existing = store.banks.find(b => b.name.toLowerCase() === cleanName.toLowerCase());
      if (existing) return existing;
      const shortCode = cleanName.replace(/[^A-Za-z0-9\u0600-\u06FF]/g, '').substring(0, 4).toUpperCase() || 'OTHR';
      return store.addBank({ name: cleanName, shortCode, accentColor: '#6c737c' });
    }

    const catBanks = (typeof EGYPTIAN_BANKS !== 'undefined' ? EGYPTIAN_BANKS : (window.EGYPTIAN_BANKS || []));
    const catalogEntry = catBanks.find(b => b.key === bankKey);
    if (!catalogEntry) {
      return store.banks[0] || store.addBank({ name: 'Bank', shortCode: 'BANK', accentColor: '#6c737c' });
    }

    let existing = store.banks.find(b =>
      b.shortCode.toUpperCase() === catalogEntry.shortCode.toUpperCase() ||
      b.name.toLowerCase() === catalogEntry.nameEn.toLowerCase() ||
      b.name.toLowerCase() === catalogEntry.nameAr.toLowerCase()
    );
    if (existing) return existing;

    return store.addBank({
      name: catalogEntry.nameEn,
      shortCode: catalogEntry.shortCode,
      accentColor: catalogEntry.brandColor
    });
  }

  function populateLookDropdown(selectEl, bankKey, cardType, selectedLook = null) {
    if (!selectEl) return;
    const isEn = getLang() === 'en';
    const catBanks = (typeof EGYPTIAN_BANKS !== 'undefined' ? EGYPTIAN_BANKS : (window.EGYPTIAN_BANKS || []));
    const tierStyles = (typeof CARD_TIER_STYLES !== 'undefined' ? CARD_TIER_STYLES : (window.CARD_TIER_STYLES || []));
    const catBank = catBanks.find(b => b.key === bankKey);
    selectEl.innerHTML = '';

    // 1. Bank specific variants if available for this type
    const variants = (catBank && catBank.variants)
      ? catBank.variants.filter(v => !cardType || v.type === cardType)
      : [];

    if (variants.length > 0) {
      const grp = document.createElement('optgroup');
      grp.label = isEn ? (catBank.nameEn + ' Card Looks') : ('تصاميم ' + catBank.nameAr);
      variants.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.look;
        opt.textContent = isEn ? (catBank.nameEn + ' ' + v.nameEn) : (catBank.nameAr + ' - ' + v.nameAr);
        if (selectedLook && selectedLook === v.look) opt.selected = true;
        grp.appendChild(opt);
      });
      selectEl.appendChild(grp);
    }

    // 2. 7 Tier Styles (Tinted)
    const tierGrp = document.createElement('optgroup');
    tierGrp.label = isEn ? '7 Tier Styles (Tinted)' : 'أنماط الفئات الـ 7 (ملونة بلون البنك)';
    tierStyles.forEach(tStyle => {
      const opt = document.createElement('option');
      opt.value = tStyle.key;
      opt.textContent = isEn ? `${tStyle.nameEn} (${tStyle.descEn})` : `${tStyle.nameAr} (${tStyle.descAr})`;
      if (selectedLook && (selectedLook === tStyle.key || selectedLook === tStyle.id)) opt.selected = true;
      tierGrp.appendChild(opt);
    });
    selectEl.appendChild(tierGrp);

    // 3. Default (No Look)
    const defaultOpt = document.createElement('option');
    defaultOpt.value = 'none';
    defaultOpt.textContent = isEn ? 'Default (No special look)' : 'افتراضي (بدون تصميم خاص)';
    if (!selectedLook || selectedLook === 'none') defaultOpt.selected = true;
    selectEl.appendChild(defaultOpt);
  }

  window.ensureBankInStore = ensureBankInStore;
  window.populateLookDropdown = populateLookDropdown;

  function populateCardBankDropdown(preselectedBankId = null) {
    const select = document.getElementById('card-bank-select');
    if (!select) return;

    const isEn = getLang() === 'en';

    // Inject search filter above select if not present
    let searchInput = document.getElementById('card-bank-search');
    if (!searchInput) {
      searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.id = 'card-bank-search';
      searchInput.placeholder = t('search_bank_placeholder');
      searchInput.className = 'w-full bg-[#1A1B1F] border border-[#33353C] rounded-2xl px-3 py-1.5 text-xs font-semibold text-[#F3F1EC] mb-1.5 focus:outline-none focus:border-[#F5B700]';
      select.parentNode.insertBefore(searchInput, select);
    }

    // Inject "Other bank" text input below select if not present
    let otherContainer = document.getElementById('card-other-bank-container');
    if (!otherContainer) {
      otherContainer = document.createElement('div');
      otherContainer.id = 'card-other-bank-container';
      otherContainer.className = 'hidden mt-2';
      otherContainer.innerHTML = `
        <label class="block text-xs font-bold text-[#C8CAD0] mb-1">${t('other_bank_name_label')}</label>
        <input type="text" id="card-other-bank-name" placeholder="${t('other_bank_name_placeholder')}" class="w-full bg-[#1A1B1F] border border-[#33353C] rounded-2xl px-3 py-2 text-xs font-semibold text-[#F3F1EC] focus:outline-none focus:border-[#F5B700]">
      `;
      select.parentNode.appendChild(otherContainer);
    }

    // Inject Card Look dropdown if not present
    let lookContainer = document.getElementById('card-look-container');
    if (!lookContainer) {
      lookContainer = document.createElement('div');
      lookContainer.id = 'card-look-container';
      lookContainer.className = 'mt-2.5';
      lookContainer.innerHTML = `
        <label class="block text-xs font-bold text-[#C8CAD0] mb-1">${t('card_look_label')}</label>
        <select id="card-look-select" class="w-full bg-[#1A1B1F] border border-[#33353C] rounded-2xl px-3 py-2 text-xs font-semibold text-[#F3F1EC] focus:outline-none focus:border-[#F5B700] cursor-pointer"></select>
      `;
      const typeContainer = document.querySelector('input[name="card-type"]')?.closest('div.grid')?.parentNode;
      if (typeContainer && typeContainer.parentNode) {
        typeContainer.parentNode.insertBefore(lookContainer, typeContainer.nextSibling);
      } else {
        select.parentNode.parentNode.appendChild(lookContainer);
      }
    }

    // Fetch and render bank catalog
    const allBanks = (typeof getEgyptianBanks === 'function')
      ? getEgyptianBanks(getLang())
      : (window.EGYPTIAN_BANKS || []);

    function renderOptions(filterText = '') {
      select.innerHTML = '';
      const q = filterText.trim().toLowerCase();
      const filtered = allBanks.filter(b => {
        if (!q) return true;
        if (b.key === 'other') return true;
        return (
          b.shortCode.toLowerCase().includes(q) ||
          b.nameEn.toLowerCase().includes(q) ||
          b.nameAr.toLowerCase().includes(q)
        );
      });

      filtered.forEach(bank => {
        const opt = document.createElement('option');
        opt.value = bank.key;
        opt.textContent = isEn ? bank.nameEn : bank.nameAr;
        select.appendChild(opt);
      });
    }

    renderOptions(searchInput.value || '');

    // Select preselected bank if provided
    if (preselectedBankId) {
      const match = allBanks.find(b => b.key === preselectedBankId || b.shortCode.toLowerCase() === String(preselectedBankId).toLowerCase());
      if (match) select.value = match.key;
    }

    function updateBankState() {
      const isOther = select.value === 'other';
      if (isOther) {
        otherContainer.classList.remove('hidden');
      } else {
        otherContainer.classList.add('hidden');
      }

      // Check card types offered
      const currentBank = allBanks.find(b => b.key === select.value);
      const creditRadio = document.getElementById('type-credit');
      const debitRadio = document.getElementById('type-debit');
      if (currentBank && currentBank.types && !currentBank.types.includes('credit')) {
        if (creditRadio) {
          creditRadio.disabled = true;
          creditRadio.checked = false;
        }
        if (debitRadio) {
          debitRadio.checked = true;
        }
      } else {
        if (creditRadio) creditRadio.disabled = false;
      }

      // Update Look dropdown
      const activeType = document.querySelector('input[name="card-type"]:checked')?.value || 'credit';
      const lookSelect = document.getElementById('card-look-select');
      populateLookDropdown(lookSelect, select.value, activeType);

      // Auto-name if applicable
      const nameInput = document.getElementById('card-name');
      if (nameInput && (!nameInput.value || nameInput.dataset.autonamed === 'true')) {
        if (lookSelect && lookSelect.value && lookSelect.value !== 'none') {
          const optText = lookSelect.options[lookSelect.selectedIndex]?.textContent || '';
          const parts = optText.split(/[-–—]/);
          const autoName = parts[parts.length - 1].trim();
          nameInput.value = autoName;
          nameInput.dataset.autonamed = 'true';
        }
      }
    }

    searchInput.oninput = (e) => {
      renderOptions(e.target.value);
      updateBankState();
    };

    select.onchange = () => {
      updateBankState();
      updateCardCycleInputs();
    };

    // Listen for type change to re-filter looks
    document.querySelectorAll('input[name="card-type"]').forEach(radio => {
      radio.onchange = () => {
        updateBankState();
        updateCardCycleInputs();
      };
    });

    // Listen for look change to auto-name
    const lookSelect = document.getElementById('card-look-select');
    if (lookSelect) {
      lookSelect.onchange = () => {
        const nameInput = document.getElementById('card-name');
        if (nameInput && (!nameInput.value || nameInput.dataset.autonamed === 'true')) {
          if (lookSelect.value && lookSelect.value !== 'none') {
            const optText = lookSelect.options[lookSelect.selectedIndex]?.textContent || '';
            const parts = optText.split(/[-–—]/);
            const autoName = parts[parts.length - 1].trim();
            nameInput.value = autoName;
            nameInput.dataset.autonamed = 'true';
          }
        }
      };
    }

    const nameInput = document.getElementById('card-name');
    if (nameInput) {
      nameInput.oninput = () => {
        nameInput.dataset.autonamed = 'false';
      };
    }

    updateBankState();
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
        const confirmMsg = t('confirm_neg_manual', { name: targetAccount.name, cur: formatCurrency(currentBalance), after: formatCurrency(expectedAfter) });
        if (typeof confirm === 'function' && !confirm(confirmMsg)) {
          return;
        }
      }
    }

    try {
      store.addTransaction({ amount, merchant, category, date, cardId, accountId, transactionType, notes });
      closeModal('transaction');
      e.target.reset();
      showToast(t('toast_tx_logged', { amount: formatCurrency(amount) }), 'success');
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
      showToast(t('toast_bank_added', { name }), 'success');
      renderCurrentView();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.getElementById('form-add-card')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedBankKey = document.getElementById('card-bank-select')?.value || 'other';
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

    let targetBank = null;
    if (selectedBankKey === 'other') {
      const customBankName = (document.getElementById('card-other-bank-name')?.value || '').trim() || (getLang() === 'en' ? 'Other bank' : 'بنك آخر');
      targetBank = ensureBankInStore('other', true, customBankName);
    } else {
      targetBank = ensureBankInStore(selectedBankKey, false);
    }
    const bankId = targetBank.id;

    const lookVal = document.getElementById('card-look-select')?.value;
    const colorPreset = (lookVal && lookVal !== 'none') ? lookVal : null;

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
        showToast(t('toast_account_added', { name }), 'success');
        renderCurrentView();
      } else {
        const newCard = store.addCard({
          bankId,
          name,
          last4,
          cardType,
          colorPreset,
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
        showToast(t('toast_card_added', { name }), 'success');
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
      showToast(t('toast_invalid_balance'), 'error');
      return;
    }

    try {
      store.updateAccount(accId, {
        name,
        newBalance: balanceVal,
        notes
      });
      closeModal('editAccount');
      showToast(t('toast_account_updated'), 'success');
      renderBanksView();
      renderCurrentView();
    } catch (err) {
      showToast(err.message || t('toast_account_update_err'), 'error');
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

    const selectedBankKey = document.getElementById('edit-card-bank-select')?.value || 'other';
    let targetBank = null;
    if (selectedBankKey === 'other') {
      const customBankName = (document.getElementById('edit-card-other-bank-name')?.value || '').trim() || (store.getBank(card.bankId) ? store.getBank(card.bankId).name : 'Other');
      targetBank = ensureBankInStore('other', true, customBankName);
    } else {
      targetBank = ensureBankInStore(selectedBankKey, false);
    }

    const lookVal = document.getElementById('edit-card-look-select')?.value;
    const colorPreset = (lookVal && lookVal !== 'none') ? lookVal : null;

    try {
      store.updateCard(cardId, {
        name,
        bankId: targetBank ? targetBank.id : card.bankId,
        colorPreset: colorPreset,
        linkedAccountId: card.cardType === 'debit' ? (linkedAccountId || null) : card.linkedAccountId,
        monthlyTarget: targetVal,
        creditLimit: card.cardType === 'credit' ? creditLimit : card.creditLimit
      });
      closeModal('editCard');
      showToast(t('toast_card_updated'), 'success');
      renderBanksView();
      renderCurrentView();
    } catch (err) {
      showToast(err.message || t('toast_card_update_err'), 'error');
    }
  });

  // --- Render Current View ---
  function renderCurrentView() {
    const stats = store.getOverallStats();
    const topSubtitle = document.getElementById('header-subtitle');
    if (topSubtitle) {
      topSubtitle.textContent = `${stats.totalCount} • ${formatCurrency(stats.totalSpent)}`;
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
      <div id="sms-inbox-banner" onclick="window.switchTab('review')" class="cursor-pointer bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] px-4 py-3.5 rounded-2xl shadow-md flex items-center justify-between gap-3 card-press transition-all">
        <span class="text-[17px] font-extrabold text-[#111111] leading-snug">${t('bank_messages_ready', { n: count })}</span>
        <button type="button" class="px-5 py-2 min-h-[44px] rounded-full bg-[#1A1B1F] text-[#F5B700] font-extrabold text-[14px] shrink-0 active-press">${t('review_btn')}</button>
      </div>
    `;
  }

  // --- Card Looks Motif Artwork Generator ---
  function renderCardMotifHtml(lookInfo) {
    if (!lookInfo || lookInfo.isDefault || (!lookInfo.motif && !lookInfo.isRealCard && !lookInfo.tierStyle)) {
      return '';
    }
    const brand = lookInfo.brandColor || '#6c737c';
    let innerSvg = '';

    switch (lookInfo.motif) {
      case 'cib_cloud':
        innerSvg = `
          <rect x="180" y="32" width="135" height="46" rx="23" fill="rgba(255, 255, 255, 0.18)" />
          <circle cx="215" cy="48" r="26" fill="rgba(255, 255, 255, 0.14)" />
        `;
        break;
      case 'cib_concentric':
        innerSvg = `
          <circle cx="295" cy="100" r="32" stroke="#7fe0d4" stroke-opacity="0.32" stroke-width="1.5" fill="none" />
          <circle cx="295" cy="100" r="54" stroke="#7fe0d4" stroke-opacity="0.32" stroke-width="1.5" fill="none" />
          <circle cx="295" cy="100" r="76" stroke="#7fe0d4" stroke-opacity="0.32" stroke-width="1.5" fill="none" />
          <circle cx="295" cy="100" r="98" stroke="#7fe0d4" stroke-opacity="0.32" stroke-width="1.5" fill="none" />
        `;
        break;
      case 'cib_cashback_chevron':
        innerSvg = `
          <polygon points="175,0 240,97 175,195 215,195 280,97 215,0" fill="rgba(255, 255, 255, 0.09)" />
          <circle cx="312" cy="46" r="16" stroke="#ff8c1a" stroke-width="3.5" fill="none" />
        `;
        break;
      case 'gold_sheen':
      case 'gold':
        innerSvg = `
          <defs>
            <linearGradient id="goldSheenGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
              <stop offset="50%" stop-color="#fff" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M 120,0 L 220,0 L 160,195 L 60,195 Z" fill="url(#goldSheenGrad)" opacity="0.4" />
          <line x1="25" y1="188" x2="330" y2="188" stroke="#f5b700" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round" />
        `;
        break;
      case 'bdc_arch':
        innerSvg = `
          <path d="M 252,195 L 252,90 A 34,34 0 0,1 320,90 L 320,195" stroke="rgba(255, 255, 255, ${lookInfo.isLightMint ? '0.75' : '0.55'})" stroke-width="6.5" fill="none" stroke-linecap="round" />
        `;
        break;
      case 'nbk_wave':
        innerSvg = `
          <path d="M 0,135 C 100,75 190,185 355,80 L 355,195 L 0,195 Z" fill="rgba(255, 255, 255, 0.13)" />
          <path d="M 0,150 C 110,95 200,195 355,100" stroke="rgba(255, 255, 255, 0.22)" stroke-width="2" fill="none" />
        `;
        break;
      case 'classic':
        innerSvg = `
          <line x1="25" y1="188" x2="330" y2="188" stroke="${brand}" stroke-opacity="0.35" stroke-width="1.5" stroke-linecap="round" />
        `;
        break;
      case 'titanium':
        innerSvg = `
          <line x1="25" y1="188" x2="330" y2="188" stroke="${brand}" stroke-opacity="0.4" stroke-width="1.5" stroke-linecap="round" />
        `;
        break;
      case 'platinum':
        innerSvg = `
          <line x1="190" y1="0" x2="310" y2="195" stroke="rgba(255, 255, 255, 0.28)" stroke-width="2" />
          <line x1="202" y1="0" x2="322" y2="195" stroke="${brand}" stroke-opacity="0.4" stroke-width="1" />
        `;
        break;
      case 'world':
        innerSvg = `
          <ellipse cx="310" cy="98" rx="85" ry="85" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.2" fill="none" />
          <ellipse cx="310" cy="98" rx="55" ry="85" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.2" fill="none" />
          <ellipse cx="310" cy="98" rx="25" ry="85" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.2" fill="none" />
          <line x1="225" y1="98" x2="355" y2="98" stroke="${brand}" stroke-opacity="0.35" stroke-width="1.2" />
          <path d="M 235,60 Q 310,85 355,80" stroke="rgba(255, 255, 255, 0.07)" stroke-width="1.2" fill="none" />
          <path d="M 235,136 Q 310,111 355,116" stroke="rgba(255, 255, 255, 0.07)" stroke-width="1.2" fill="none" />
        `;
        break;
      case 'cashback':
        innerSvg = `
          <circle cx="310" cy="46" r="21" stroke="#f5b700" stroke-width="3.5" fill="none" opacity="0.95" />
          <path d="M 175,70 L 195,95 L 175,120" stroke="rgba(255, 255, 255, 0.10)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <path d="M 205,70 L 225,95 L 205,120" stroke="rgba(255, 255, 255, 0.15)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <path d="M 235,70 L 255,95 L 235,120" stroke="${brand}" stroke-opacity="0.35" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        `;
        break;
      case 'debit':
        innerSvg = `
          <path d="M 305,75 A 14,14 0 0,1 305,115" stroke="rgba(255, 255, 255, 0.22)" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path d="M 314,68 A 24,24 0 0,1 314,122" stroke="rgba(255, 255, 255, 0.22)" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path d="M 323,61 A 34,34 0 0,1 323,129" stroke="rgba(255, 255, 255, 0.22)" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path d="M 332,54 A 44,44 0 0,1 332,136" stroke="${brand}" stroke-opacity="0.5" stroke-width="2.5" stroke-linecap="round" fill="none" />
        `;
        break;
      default:
        innerSvg = '';
    }

    if (!innerSvg) return '';
    return `<div class="card-art-layer"><svg viewBox="0 0 355 195" fill="none" xmlns="http://www.w3.org/2000/svg">${innerSvg}</svg></div>`;
  }

  // ==========================================
  // VIEW 1: OVERVIEW (TILTED CARD OBJECT HERO)
  // ==========================================
  function renderOverviewView() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    const pendingCandidates = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates) ? window.BankSmsEngine.pendingCandidates : [];

    if (store.cards.length === 0) {
      isHeroCardExpanded = false;
      container.innerHTML = `
        <div class="space-y-4 py-6">
          ${pendingCandidates.length > 0 ? renderSmsBannerHtml() : ''}

          <div class="bg-[#25262B] p-8 rounded-3xl border border-[#33353C] text-center shadow-lg space-y-4">
            <div class="w-16 h-16 mx-auto rounded-3xl bg-[#2A2B31] text-[#F5B700] flex items-center justify-center border border-[#43464F]">
              <i data-lucide="credit-card" class="w-8 h-8 text-[#F5B700]"></i>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#F3F1EC]">${store.banks.length === 0 ? t('your_wallet_ready') : t('no_cards_yet')}</h3>
              <p class="text-xs text-[#C8CAD0] mt-1 max-w-[280px] mx-auto">
                ${store.banks.length === 0 ? t('add_card_account_desc') : t('no_cards_yet')}
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

    if (!activeFeaturedCardId || !store.getCard(activeFeaturedCardId)) {
      activeFeaturedCardId = store.cards[0].id;
    }
    const card = store.getCard(activeFeaturedCardId) || store.cards[0];
    const bank = store.getBank(card.bankId);
    const cardStat = store.getCardSpendingStats(card.id);
    const isRtl = getLang() === 'ar';

    const lookInfo = (typeof getCardLookInfo === 'function')
      ? getCardLookInfo(card, bank)
      : (window.getCardLookInfo ? window.getCardLookInfo(card, bank) : { isDefault: true });

    let lookClass = '';
    let faceInlineStyle = '';
    if (lookInfo.isRealCard) {
      lookClass = `card-look-${lookInfo.lookKey}`;
    } else if (lookInfo.tierStyle) {
      lookClass = `card-tier-${lookInfo.tierStyle}`;
      faceInlineStyle = `--bank-brand: ${lookInfo.brandColor || '#6c737c'};`;
    } else if (lookInfo.isCustomColor) {
      faceInlineStyle = `background: ${lookInfo.gradient};`;
    } else if (lookInfo.isLegacyPreset) {
      faceInlineStyle = `background: ${lookInfo.gradient};`;
    }
    const cardMotifHtml = renderCardMotifHtml(lookInfo);

    container.innerHTML = `
      <div class="space-y-3 pb-8">
        
        <!-- 1. TILTED HERO CARD OBJECT (Reference Match: Lighter Sheen, Flat Tilt, Flat Chip, Bold Sans Balance) -->
        <div class="tilted-hero-wrapper" id="hero-card-touch-zone">
          <div class="tilted-card-container ${isHeroCardExpanded ? 'straightened' : ''}" id="hero-card-tilted-box">
            <div class="bank-card-face ${lookClass} cursor-pointer" style="${faceInlineStyle}" onclick="window.toggleCardStraighten(this)">
              ${cardMotifHtml}
              <!-- Top Row (dir=ltr): Bank Code FAR LEFT, Card Name FAR RIGHT -->
              <div class="flex justify-between items-center z-10" dir="ltr">
                <span class="card-bank-code text-[14px] font-extrabold text-[#F5B700] tracking-wider uppercase">${bank ? bank.shortCode : ''}</span>
                <span class="card-name-text text-[14px] font-bold text-[#F5B700] truncate max-w-[65%]">${card.name}</span>
              </div>

              <!-- Middle-Left: Flat Solid Amber EMV Chip -->
              <div class="my-auto flex items-center justify-start z-10" dir="ltr">
                <div class="bank-card-chip"></div>
              </div>

              <!-- Masked Card Digits (Larger Brighter Dots + Large Mono Last 4) -->
              <div class="flex items-center justify-center gap-3.5 z-10" dir="ltr">
                <span class="inline-flex items-center gap-1.5"><span class="card-mask-dot"></span><span class="card-mask-dot"></span><span class="card-mask-dot"></span><span class="card-mask-dot"></span></span>
                <span class="inline-flex items-center gap-1.5"><span class="card-mask-dot"></span><span class="card-mask-dot"></span><span class="card-mask-dot"></span><span class="card-mask-dot"></span></span>
                <span class="inline-flex items-center gap-1.5"><span class="card-mask-dot"></span><span class="card-mask-dot"></span><span class="card-mask-dot"></span><span class="card-mask-dot"></span></span>
                <span class="card-digits-text text-[15px] font-mono font-bold tracking-[0.16em] text-[#F3F1EC] ml-1">${card.last4}</span>
              </div>

              <!-- Bottom Row (dir=ltr): Remaining label BOTTOM LEFT, Big Bold Sans Balance BOTTOM RIGHT -->
              <div class="flex items-baseline justify-between gap-1.5 pt-1.5 z-10" dir="ltr">
                <div class="min-w-0">
                  <span class="card-remaining-label text-[12px] text-[#C8CAD0] font-medium block truncate" dir="${isRtl ? 'rtl' : 'ltr'}">
                    ${cardStat.isExceeded
                      ? t('over_limit')
                      : `${t('left_of')} <span dir="ltr" class="font-sans-num">${formatCurrency(cardStat.target)}</span>`}
                  </span>
                </div>
                <div class="shrink-0">
                  ${formatAmountInlineHtml(cardStat.isExceeded ? cardStat.overAmount : cardStat.remaining, {
                    useSans: true,
                    prefixSign: cardStat.isExceeded ? '+' : '',
                    numClass: `card-balance-num text-[24px] leading-none font-extrabold ${cardStat.isExceeded ? 'text-[#E6A8A8]' : 'text-[#F3F1EC]'}`,
                    currClass: `card-currency-code text-[13px] font-bold ${cardStat.isExceeded ? 'text-[#E6A8A8]/85' : 'text-[#D1D5DB]'}`
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Expandable Card Details Drawer (Opens when hero card is tapped) -->
        <div id="hero-card-details-drawer" class="hero-details-drawer ${isHeroCardExpanded ? 'expanded' : ''}">
          <div class="hero-details-inner">
            <div class="bg-[#25262B] border border-[#33353C] rounded-2xl p-3.5 space-y-2 shadow-lg">
              <div class="flex items-center justify-between text-xs py-1 border-b border-[#33353C]/60">
                <span class="text-[#C8CAD0] font-medium">${t('cycle_budget')}</span>
                <div class="flex items-center gap-2">
                  ${formatAmountInlineHtml(cardStat.target, { numClass: 'text-xs font-bold text-[#F3F1EC]' })}
                  <button type="button" onclick="window.promptSetCycleBudget('${card.id}', event)" class="px-2.5 py-1 rounded-lg bg-[#2A2B31] hover:bg-[#43464F] text-[#F5B700] text-xs font-bold border border-[#43464F]">${t('change')}</button>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs py-1 border-b border-[#33353C]/60">
                <span class="text-[#C8CAD0] font-medium">${t('credit_limit')}</span>
                <span class="text-xs font-bold text-[#F3F1EC]">
                  ${card.cardType === 'credit'
                    ? (cardStat.creditLimit !== null ? formatAmountInlineHtml(cardStat.creditLimit, { numClass: 'text-xs font-bold text-[#F3F1EC]' }) : t('not_recorded'))
                    : t('na_debit')}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs py-1 border-b border-[#33353C]/60">
                <span class="text-[#C8CAD0] font-medium">${t('cycle_purchases')}</span>
                ${formatAmountInlineHtml(cardStat.spent, { numClass: 'text-xs font-bold text-[#F3F1EC]' })}
              </div>
              <div class="flex items-center justify-between text-xs py-1 border-b border-[#33353C]/60">
                <span class="text-[#C8CAD0] font-medium">${t('cash_advance_debt')}</span>
                ${formatAmountInlineHtml(cardStat.cashAdvance, { numClass: 'text-xs font-bold text-[#F3F1EC]' })}
              </div>
              <div class="flex items-center justify-between text-xs py-1">
                <span class="text-[#C8CAD0] font-medium">${t('total_owed')}</span>
                ${formatAmountInlineHtml(cardStat.totalObligations, { numClass: 'text-xs font-extrabold text-[#F5B700]' })}
              </div>
              <div class="grid grid-cols-2 gap-2 pt-1.5">
                <button type="button" onclick="window.switchTab('history')" class="py-2.5 min-h-[44px] rounded-xl bg-[#2A2B31] hover:bg-[#43464F] border border-[#43464F] text-[#F3F1EC] text-xs font-bold active-press">${t('view_activity')}</button>
                <button type="button" onclick="window.openEditCardModal('${card.id}')" class="py-2.5 min-h-[44px] rounded-xl bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] text-xs font-bold active-press">${t('edit_card')}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicator Dots below Card -->
        ${store.cards.length > 1 ? `
          <div class="flex justify-center items-center gap-1.5 py-0.5">
            ${store.cards.map(c => `
              <button type="button" onclick="window.selectFeaturedCard('${c.id}')" class="h-1.5 rounded-full transition-all duration-300 ${
                c.id === card.id ? 'w-6 bg-[#F5B700]' : 'w-2 bg-[#43464F] hover:bg-[#C8CAD0]'
              }" title="${c.name}"></button>
            `).join('')}
          </div>
        ` : ''}

        <!-- 2. SUMMARY TILES (Single-Line Full Precision Bold Sans Amount + 12.5px #C8CAD0 Labels) -->
        <div class="grid grid-cols-3 gap-2.5 mt-1">
          <div class="bg-[#25262B] border border-[#33353C] rounded-2xl p-3 flex flex-col justify-between shadow-2xs min-w-0 card-press">
            <span class="text-[12.5px] text-[#C8CAD0] font-medium leading-snug">${t('cycle_purchases')}</span>
            <div class="mt-2 truncate">
              ${formatAmountInlineHtml(cardStat.spent, { useSans: true, smallDecimals: true, numClass: 'tile-amount-num font-extrabold text-[#F3F1EC]', decClass: 'text-[0.8em] text-[#C8CAD0] font-bold', currClass: 'tile-amount-curr text-[#C8CAD0] font-semibold' })}
            </div>
          </div>
          <div class="bg-[#25262B] border border-[#33353C] rounded-2xl p-3 flex flex-col justify-between shadow-2xs min-w-0 card-press">
            <span class="text-[12.5px] text-[#C8CAD0] font-medium leading-snug">${t('cash_advance_debt')}</span>
            <div class="mt-2 truncate">
              ${formatAmountInlineHtml(cardStat.cashAdvance, { useSans: true, smallDecimals: true, numClass: 'tile-amount-num font-extrabold text-[#F3F1EC]', decClass: 'text-[0.8em] text-[#C8CAD0] font-bold', currClass: 'tile-amount-curr text-[#C8CAD0] font-semibold' })}
            </div>
          </div>
          <div class="bg-[#25262B] border border-[#33353C] rounded-2xl p-3 flex flex-col justify-between shadow-2xs min-w-0 card-press">
            <span class="text-[12.5px] text-[#C8CAD0] font-medium leading-snug">${t('total_owed')}</span>
            <div class="mt-2 truncate">
              ${formatAmountInlineHtml(cardStat.totalObligations, { useSans: true, smallDecimals: true, numClass: 'tile-amount-num font-extrabold text-[#F3F1EC]', decClass: 'text-[0.8em] text-[#C8CAD0] font-bold', currClass: 'tile-amount-curr text-[#C8CAD0] font-semibold' })}
            </div>
          </div>
        </div>

        <!-- 3. AMBER REVIEW ALERT BANNER (If pending messages exist) -->
        ${pendingCandidates.length > 0 ? renderSmsBannerHtml() : ''}

        <!-- 4. RECENT ACTIVITY LIST -->
        <div class="mt-3 space-y-1.5">
          <div class="flex justify-between items-center px-1">
            <span class="text-[17px] font-extrabold text-[#F3F1EC]">${t('recent_activity')}</span>
            <button onclick="window.switchTab('history')" class="text-[13.5px] font-bold text-[#F5B700] hover:underline min-h-[44px] inline-flex items-center px-1 active-press">${t('all_history')}</button>
          </div>
          <div id="overview-activity-container" class="space-y-0.5"></div>
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

  let heroSwipeOccurred = false;
  function setupHeroCardSwipeListener() {
    const zone = document.getElementById('hero-card-touch-zone');
    if (!zone || store.cards.length <= 1) return;

    let touchStartX = 0;
    let touchStartY = 0;

    zone.addEventListener('touchstart', (e) => {
      heroSwipeOccurred = false;
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    zone.addEventListener('touchend', (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 0.7) {
        heroSwipeOccurred = true;
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

  window.toggleCardStraighten = () => {
    if (heroSwipeOccurred) {
      heroSwipeOccurred = false;
      return;
    }
    isHeroCardExpanded = !isHeroCardExpanded;
    const box = document.getElementById('hero-card-tilted-box');
    const drawer = document.getElementById('hero-card-details-drawer');
    if (box) box.classList.toggle('straightened', isHeroCardExpanded);
    if (drawer) drawer.classList.toggle('expanded', isHeroCardExpanded);
  };

  function renderSecondaryCards(activeCardId) {}

  function renderCardActivity(cardId) {
    const container = document.getElementById('overview-activity-container');
    if (!container) return;

    const card = store.getCard(cardId);
    if (!card) return;
    const bank = store.getBank(card.bankId);

    const cardTxs = store.getFilteredTransactions().filter(t => t.cardId === cardId);

    if (cardTxs.length === 0) {
      container.innerHTML = `
        <div class="bg-[#25262B] p-5 rounded-2xl text-center border border-[#33353C] shadow-2xs">
          <p class="text-xs text-[#C8CAD0] font-medium">${t('no_activity')}</p>
          <button onclick="window.openAddTxForCard('${card.id}')" class="mt-2.5 px-3.5 py-1.5 bg-[#2A2B31] hover:bg-[#43464F] text-[#F5B700] text-xs font-bold rounded-full transition-all inline-flex items-center gap-1 border border-[#43464F]">
            <span>+</span>
            <span>${t('create_new')}</span>
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = cardTxs.slice(0, 5).map(tx => {
      const isCashAdvance = tx.transactionType === 'withdrawal';
      const isInc = tx.direction === 'income';
      return `
        <div class="py-3 px-2.5 flex justify-between items-center border-b border-[#33353C]/70 last:border-b-0 hover:bg-[#25262B]/60 rounded-xl transition-all card-press">
          <div class="min-w-0 flex-1 pr-2 rtl:pr-0 rtl:pl-2">
            <p class="text-[16px] font-bold text-[#F3F1EC] leading-tight truncate">${tx.merchant}</p>
            <p class="text-[13px] text-[#C8CAD0] font-medium truncate mt-1">
              ${bank ? bank.shortCode + ' ' : ''}${card.name} ${card.last4 ? card.last4 : ''} ${isCashAdvance ? '• ' + t('cash_advance_debt') : ''}
            </p>
          </div>
          <div class="shrink-0">
            ${formatAmountInlineHtml(tx.amount, {
              useSans: true,
              prefixSign: isInc ? '+' : '-',
              numClass: `text-[16px] font-extrabold ${isInc ? 'text-[#F5B700]' : 'text-[#F3F1EC]'}`,
              currClass: 'text-[11px] text-[#C8CAD0] font-semibold'
            })}
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

  function updateActiveCardUI(cardId) {
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
      <div class="space-y-3.5 pb-24">
        <!-- Top Row: Counter + Batch Approve + Clear All + Diagnostics/History Icons -->
        <div class="flex items-center justify-between gap-2 px-0.5 pt-1 flex-wrap">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-[14px] font-bold text-[#C8CAD0] whitespace-nowrap">${t('messages_waiting', { n: candidates.length })}</span>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            ${candidates.length > 0 ? `
              <button type="button" onclick="window.approveAllVerifiedSms()" class="px-3.5 py-2 min-h-[44px] rounded-full bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] text-[12.5px] font-extrabold active-press shadow-sm whitespace-nowrap">
                ${t('batch_approve')}
              </button>
              <button type="button" onclick="window.clearAllPendingSms()" class="px-3.5 py-2 min-h-[44px] rounded-full bg-[#2A2B31] hover:bg-[#43464F] border border-[#43464F] text-[#F3F1EC] text-[12.5px] font-bold active-press whitespace-nowrap">
                ${t('clear_all')}
              </button>
            ` : ''}
            <button type="button" onclick="window.openSmsDiagnostics()" class="w-11 h-11 rounded-full bg-[#25262B] hover:bg-[#2A2B31] border border-[#33353C] text-[#F5B700] flex items-center justify-center transition-colors shrink-0 active-press" title="${t('check_reception_status')}">
              <i data-lucide="activity" class="w-4 h-4"></i>
            </button>
            <button type="button" onclick="window.openHistoricalSmsImport()" class="w-11 h-11 rounded-full bg-[#25262B] hover:bg-[#2A2B31] border border-[#33353C] text-[#C8CAD0] hover:text-[#F3F1EC] flex items-center justify-center transition-colors shrink-0 active-press" title="${t('import_past_sms')}">
              <i data-lucide="history" class="w-4 h-4"></i>
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
    const limitText = stat.creditLimit !== null
      ? `\n${t('credit_limit_paren', { amount: formatCurrency(stat.creditLimit) })}`
      : `\n${t('credit_limit_unrecorded_paren')}`;
    const val = prompt(t('prompt_cycle_budget', { stmt: stmtKey, limit: limitText }), currentBudget);
    if (val !== null && val.trim() !== '') {
      const num = parseFloat(val);
      if (!isNaN(num) && num >= 0) {
        store.setCardCycleBudget(cardId, stmtKey, num);
        showToast(t('toast_cycle_updated', { stmt: stmtKey, amount: formatCurrency(num) }), 'success');
        renderCurrentView();
      } else {
        showToast(t('toast_enter_valid_amount'), 'error');
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
      if (typeof confirm === 'function') {
        const limitStr = p.creditLimit !== null
          ? `\n${t('credit_limit_paren', { amount: formatCurrency(p.creditLimit) })}`
          : `\n${t('credit_limit_unrecorded_paren')}`;
        const msg = t('confirm_new_cycle_headless', {
          badge: localizeCycleText(p.statementBadge || p.cycleKey),
          name: p.cardName,
          last4: p.last4,
          limit: limitStr,
          prev: formatCurrency(p.previousBudget)
        });
        if (confirm(msg)) {
          store.confirmCycleBudget(p.cardId, p.cycleKey, p.previousBudget);
          showToast(t('toast_cycle_continued', { amount: formatCurrency(p.previousBudget), cycle: p.cycleKey }), 'success');
          renderCurrentView();
        } else if (typeof prompt === 'function') {
          const newVal = prompt(t('prompt_new_cycle_val', { cycle: p.cycleKey }), p.previousBudget);
          if (newVal !== null && newVal.trim() !== '') {
            const num = parseFloat(newVal);
            if (!isNaN(num) && num >= 0) {
              store.confirmCycleBudget(p.cardId, p.cycleKey, num);
              showToast(t('toast_cycle_new_set', { amount: formatCurrency(num), cycle: p.cycleKey }), 'success');
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
    if (stmtEl) stmtEl.textContent = `${localizeCycleText(p.statementBadge || p.cycleKey)} ${p.cycleRange ? `(${localizeCycleText(p.cycleRange)})` : ''}`;
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
      inputNew.placeholder = t('example_prefix', { val: p.previousBudget });
    }

    if (btnContinue) {
      btnContinue.innerHTML = `
        <i data-lucide="check" class="w-4 h-4 text-[#111111] shrink-0"></i>
        <span class="text-[11.5px] whitespace-nowrap">${t('prev_budget_btn', { amount: formatCurrency(p.previousBudget) })}</span>
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
    showToast(t('toast_cycle_continued', { amount: formatCurrency(previousBudget), cycle: cycleKey }), 'success');
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
      showToast(t('toast_enter_valid_amount'), 'error');
      return;
    }
    store.confirmCycleBudget(cardId, cycleKey, num);
    closeModal('cycleBudgetPrompt');
    showToast(t('toast_cycle_new_set', { amount: formatCurrency(num), cycle: cycleKey }), 'success');
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

    const subtitle = document.getElementById('customize-card-subtitle');
    const previewBox = document.getElementById('customize-card-preview');
    const nameEl = document.getElementById('customize-preview-name');
    const typeEl = document.getElementById('customize-preview-type');
    const amountEl = document.getElementById('customize-preview-amount');
    const last4El = document.getElementById('customize-preview-last4');
    const cycleEl = document.getElementById('customize-preview-cycle');
    const colorInput = document.getElementById('customize-custom-color');

    if (subtitle) subtitle.textContent = `${t('customizing_prefix')} ${bank ? bank.shortCode : ''} ${card.name}`;
    if (nameEl) nameEl.textContent = `${bank ? bank.shortCode : ''} ${card.name}`;
    if (typeEl) typeEl.textContent = t('card_' + (card.cardType || 'credit'));
    if (amountEl) amountEl.textContent = `${formatCurrency(stats.spent)} / ${formatCurrency(stats.target)}`;
    if (last4El) last4El.textContent = `•••• ${card.last4}`;
    if (cycleEl) cycleEl.textContent = card.cycleStartDay ? `${card.cycleStartDay} → ${card.cycleEndDay}` : card.network;

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
    
    const card = store.getCard(editingCardId);
    const bank = card ? store.getBank(card.bankId) : null;
    const previewBox = document.getElementById('customize-card-preview');
    if (previewBox && card) {
      previewBox.style.background = getCardGradientStyle(card, bank);
    }

    showToast(t('toast_theme_applied', { name: CARD_THEMES[presetKey]?.name || '' }), 'success');
  };

  window.applyCardCustomColor = (hexColor) => {
    if (!editingCardId) return;
    store.updateCardColor(editingCardId, { colorPreset: null, customColor: hexColor });

    const card = store.getCard(editingCardId);
    const bank = card ? store.getBank(card.bankId) : null;
    const previewBox = document.getElementById('customize-card-preview');
    if (previewBox && card) {
      previewBox.style.background = getCardGradientStyle(card, bank);
    }

    showToast(t('toast_custom_color_applied'), 'success');
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
            <h2 class="text-[17px] font-extrabold text-[#F3F1EC]">${t('wallets')}</h2>
            <p class="text-xs text-[#C8CAD0]">${t('cards_under_bank', { n: '3' })}</p>
          </div>
          <button onclick="window.openModal('bank')" class="px-4 py-2 min-h-[44px] bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] text-[13px] font-extrabold rounded-full shadow-xs active-press flex items-center gap-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>${t('add_bank')}</span>
          </button>
        </div>

        <div class="space-y-4">
          ${store.banks.length === 0 ? `
            <div class="bg-[#25262B] p-7 rounded-3xl border border-[#33353C] text-center shadow-xs space-y-3 mt-2">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-[#2A2B31] text-[#F5B700] flex items-center justify-center border border-[#43464F]">
                <i data-lucide="building-2" class="w-6 h-6"></i>
              </div>
              <div>
                <h3 class="text-[15px] font-bold text-[#F3F1EC]">${t('no_banks_yet')}</h3>
                <p class="text-xs text-[#C8CAD0] mt-1">${getLang() === 'ar' ? 'أضف بنكك لإدارة ما يصل إلى 3 كروت لكل بنك.' : 'Add your bank to manage up to 3 cards per bank.'}</p>
              </div>
              <button onclick="window.openModal('bank')" class="px-5 py-2.5 min-h-[44px] bg-[#F5B700] text-[#111111] text-[13px] font-extrabold rounded-full shadow-xs active-press inline-flex items-center gap-1.5 mt-1">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>${t('add_bank')}</span>
              </button>
            </div>
          ` : store.banks.map(bank => {
            const cards = store.getCardsForBank(bank.id);
            const isCapReached = cards.length >= 3;

            return `
              <div class="bg-[#25262B] rounded-3xl p-4.5 shadow-md border border-[#33353C] space-y-3.5">
                <!-- Bank Header -->
                <div class="flex justify-between items-center pb-2.5 border-b border-[#33353C]/70">
                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-xs" style="background-color: ${bank.accentColor || '#F5B700'}">
                      ${(bank && bank.shortCode ? bank.shortCode : 'BNK').substring(0, 3)}
                    </div>
                    <div>
                      <h3 class="text-[16px] font-bold text-[#F3F1EC]">${bank.name}</h3>
                      <span class="text-xs text-[#C8CAD0] font-mono">${bank.shortCode}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-[#2A2B31] border border-[#43464F] ${
                      isCapReached ? 'text-[#F5B700]' : 'text-[#C8CAD0]'
                    }">
                      ${cards.length}/3 ${t('cards')}
                    </span>
                    <button onclick="window.confirmDeleteBank('${bank.id}')" class="text-[#C8CAD0] hover:text-[#E6A8A8] w-10 h-10 flex items-center justify-center rounded-full transition-colors">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </div>
                </div>

                <!-- Bank Accounts Section -->
                ${(() => {
                  const accounts = store.getAccountsForBank(bank.id);
                  return `
                    <div class="space-y-2 pt-0.5">
                      <div class="flex items-center justify-between px-0.5">
                        <span class="text-[13px] font-bold text-[#F3F1EC] flex items-center gap-1.5">
                          <i data-lucide="landmark" class="w-4 h-4 text-[#F5B700]"></i>
                          <span>${t('bank_accounts_count', { n: accounts.length })}</span>
                        </span>
                        <button onclick="window.openAddAccountForBank('${bank.id}')" class="text-xs font-bold text-[#F5B700] hover:underline flex items-center gap-1 min-h-[36px] px-1">
                          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                          <span>${t('add_account')}</span>
                        </button>
                      </div>
                      ${accounts.length === 0 ? `
                        <div class="p-3 rounded-2xl bg-[#2A2B31] border border-dashed border-[#43464F] text-center text-xs text-[#C8CAD0]">
                          ${t('no_accounts_for_bank')}
                        </div>
                      ` : accounts.map(acc => `
                        <div class="p-3 rounded-2xl bg-[#2A2B31] border border-[#43464F] flex justify-between items-center card-press">
                          <div>
                            <div class="flex items-center gap-1.5 flex-wrap">
                              <span class="text-[14px] font-bold text-[#F3F1EC]">${acc.name}</span>
                              <span class="text-xs text-[#C8CAD0] font-mono">${acc.accountNumberMasked || acc.identifierDigits}</span>
                            </div>
                          </div>
                          <div class="flex items-center gap-2 shrink-0">
                            <span class="text-[13px] font-black font-mono px-2.5 py-1 rounded-full ${acc.balance < 0 ? 'bg-[#3A2020] text-[#E6A8A8] border border-[#E6A8A8]/30' : 'bg-[#1A1B1F] text-[#F3F1EC] border border-[#43464F]'}" dir="ltr">
                              ${formatCurrency(acc.balance || 0, acc.currency || 'EGP')}
                            </span>
                            <button onclick="window.openEditAccountModal('${acc.id}')" class="text-[#C8CAD0] hover:text-[#F5B700] w-8 h-8 flex items-center justify-center rounded-full transition-colors" title="${t('correct_balance')}">
                              <i data-lucide="edit-2" class="w-4 h-4"></i>
                            </button>
                            <button onclick="window.confirmDeleteAccount('${acc.id}')" class="text-[#C8CAD0] hover:text-[#E6A8A8] w-8 h-8 flex items-center justify-center rounded-full transition-colors" title="${t('delete')}">
                              <i data-lucide="x" class="w-4 h-4"></i>
                            </button>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  `;
                })()}

                <!-- Cards List -->
                <div class="space-y-2.5 pt-1.5 border-t border-[#33353C]/70">
                  <div class="px-0.5 text-[13px] font-bold text-[#F3F1EC] flex items-center gap-1.5">
                    <i data-lucide="credit-card" class="w-4 h-4 text-[#F5B700]"></i>
                    <span>${t('registered_cards')}</span>
                  </div>
                  ${cards.map(c => {
                    const cStat = store.getCardSpendingStats(c.id);
                    const linkedAcc = c.linkedAccountId ? store.getAccount(c.linkedAccountId) : null;
                    return `
                      <div class="p-3.5 rounded-2xl bg-[#2A2B31] border border-[#43464F] flex justify-between items-center card-press">
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center gap-2">
                            <span class="text-[15px] font-bold text-[#F3F1EC] truncate">${c.name}</span>
                            <span class="text-[11px] bg-[#1A1B1F] border border-[#43464F] text-[#C8CAD0] px-2 py-0.5 rounded-full font-bold shrink-0">${t('card_' + (c.cardType || 'credit'))}</span>
                          </div>
                          <p class="text-xs text-[#C8CAD0] font-mono mt-1">
                            •••• ${c.last4} ${c.cycleStartDay ? `• ${t('cycle_word')} ${c.cycleStartDay}–${c.cycleEndDay}` : ''} ${linkedAcc ? `• ${linkedAcc.name}` : ''}
                          </p>
                          <div class="w-full bg-[#1A1B1F] rounded-full h-1.5 mt-2 overflow-hidden">
                            <div class="${cStat.isExceeded ? 'bg-[#E6A8A8]' : 'bg-[#F5B700]'} h-full rounded-full" style="width: ${cStat.percentage}%;"></div>
                          </div>
                        </div>

                        <div class="text-end shrink-0 ml-3 rtl:ml-0 rtl:mr-3">
                          <span class="text-[14.5px] font-extrabold ${cStat.isExceeded ? 'text-[#E6A8A8]' : 'text-[#F3F1EC]'} font-sans-num block" dir="ltr">
                            ${formatCurrency(cStat.spent)}
                          </span>
                          <span class="text-xs text-[#C8CAD0] font-sans-num" dir="ltr">/ ${formatCurrency(cStat.target)}</span>
                          <div class="flex items-center justify-end gap-1.5 mt-1.5">
                            <button onclick="window.openEditCardModal('${c.id}')" class="p-1 text-[#C8CAD0] hover:text-[#F5B700] transition-colors" title="${t('edit_card')}">
                              <i data-lucide="edit-2" class="w-4 h-4"></i>
                            </button>
                            <button onclick="window.openCustomizeCardModal('${c.id}', event)" class="p-1 text-[#C8CAD0] hover:text-[#F5B700] transition-colors" title="Customize Card Color">
                              <span class="text-xs">🎨</span>
                            </button>
                            <button onclick="window.confirmDeleteCard('${c.id}')" class="p-1 text-[#C8CAD0] hover:text-[#E6A8A8] transition-colors" title="${t('delete')}">
                              <i data-lucide="x" class="w-4 h-4"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>

                <!-- 3 Card Cap Enforcement Button -->
                ${isCapReached ? `
                  <div class="w-full py-3 rounded-full bg-[#2A2B31] border border-[#43464F] text-[#C8CAD0] text-xs font-bold text-center cursor-not-allowed">
                    🔒 ${t('max_3_reached')}
                  </div>
                ` : `
                  <button onclick="window.openAddCardForBank('${bank.id}')" class="w-full py-3 min-h-[44px] rounded-full bg-[#2A2B31] hover:bg-[#43464F] border border-[#43464F] text-[#F3F1EC] text-[13px] font-bold text-center transition-all flex items-center justify-center gap-1.5 active-press">
                    <i data-lucide="plus" class="w-4 h-4 text-[#F5B700]"></i>
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
            <h2 class="text-[17px] font-extrabold text-[#F3F1EC]">${t('history')}</h2>
            <p class="text-xs text-[#C8CAD0]">${filtered.length} ${t('activity')}</p>
          </div>
          <button onclick="window.exportTransactionsCSV()" class="px-3.5 py-2 min-h-[44px] bg-[#25262B] border border-[#33353C] text-[#F3F1EC] text-[12.5px] font-bold rounded-full shadow-2xs hover:bg-[#2A2B31] transition-colors active-press">
            ${t('export_csv')}
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative">
          <i data-lucide="search" class="w-4 h-4 text-[#C8CAD0] absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5"></i>
          <input type="text" id="history-search-input" value="${store.searchQuery}" placeholder="${t('search_placeholder')}" class="w-full bg-[#25262B] border border-[#33353C] rounded-full pl-10 pr-3 rtl:pr-10 rtl:pl-3 py-2.5 text-sm font-medium text-[#F3F1EC] placeholder-[#C8CAD0] focus:outline-none focus:ring-1 focus:ring-[#F5B700] shadow-2xs">
        </div>

        <!-- Filter Chips Carousel -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button onclick="window.setFilterStatement('all')" class="px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 active-press ${
            store.selectedStatementFilter === 'all' ? 'bg-[#F5B700] text-[#111111]' : 'bg-[#25262B] text-[#C8CAD0] border border-[#33353C]'
          }">
            ${t('all_cycles')}
          </button>
          ${store.getAvailableStatementMonths().map(m => `
            <button onclick="window.setFilterStatement('${m.key}')" class="px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 active-press ${
              store.selectedStatementFilter === m.key ? 'bg-[#F5B700] text-[#111111]' : 'bg-[#25262B] text-[#C8CAD0] border border-[#33353C]'
            }">
              ${localizeCycleText(m.badge)}
            </button>
          `).join('')}
        </div>

        <!-- Transaction Items -->
        <div class="space-y-2.5 pt-1">
          ${filtered.length === 0 ? `
            <div class="bg-[#25262B] p-7 rounded-3xl text-center border border-[#33353C] shadow-2xs space-y-3 mt-2">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-[#2A2B31] text-[#C8CAD0] flex items-center justify-center border border-[#43464F]">
                <i data-lucide="receipt" class="w-6 h-6"></i>
              </div>
              <div>
                <h3 class="text-[15px] font-bold text-[#F3F1EC]">${t('no_transactions_yet')}</h3>
                <p class="text-xs text-[#C8CAD0] mt-1">${getLang() === 'ar' ? 'عند تسجيل حركة جديدة ستظهر هنا تلقائياً.' : 'When you log an expense, it will appear here.'}</p>
              </div>
              <button onclick="window.openModal('transaction')" class="px-5 py-2.5 min-h-[44px] bg-[#F5B700] text-[#111111] text-[13px] font-bold rounded-full shadow-xs active-press inline-flex items-center gap-1.5 mt-1">
                <i data-lucide="plus" class="w-4 h-4"></i>
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
              typeBadge = `<span class="text-[11px] font-bold px-2 py-0.5 rounded bg-[#2A2B31] text-[#C8CAD0] border border-[#43464F]">${t('badge_bal_adj')}</span>`;
            } else if (txType === 'withdrawal') {
              if (tx.card && tx.card.cardType === 'credit') {
                typeBadge = `<span class="text-[11px] font-bold px-2 py-0.5 rounded bg-[#2A2B31] text-[#E6A8A8] border border-[#E6A8A8]/30">${t('badge_credit_cash')}</span>`;
              } else {
                typeBadge = `<span class="text-[11px] font-bold px-2 py-0.5 rounded bg-[#2A2B31] text-[#F5B700] border border-[#F5B700]/30">${t('badge_withdrawal')}</span>`;
              }
            } else if (txType === 'transfer') {
              typeBadge = `<span class="text-[11px] font-bold px-2 py-0.5 rounded bg-[#2A2B31] text-[#C8CAD0] border border-[#43464F]">${t('badge_transfer')}</span>`;
            } else {
              typeBadge = `<span class="text-[11px] font-bold px-2 py-0.5 rounded bg-[#2A2B31] text-[#F3F1EC] border border-[#43464F]">${t('badge_purchase')}</span>`;
            }

            return `
              <div class="bg-[#25262B] p-3.5 rounded-2xl shadow-2xs border border-[#33353C] hover:border-[#43464F] transition-all card-press space-y-1.5">
                <div class="flex justify-between items-center gap-2">
                  <p class="text-[16px] font-bold text-[#F3F1EC] truncate min-w-0 flex-1" dir="auto">${tx.merchant}</p>
                  <div class="flex items-center gap-1 shrink-0">
                    ${formatAmountInlineHtml(tx.amount, {
                      useSans: true,
                      prefixSign: tx.direction === 'income' ? '+' : '-',
                      numClass: `text-[15.5px] font-extrabold ${tx.direction === 'income' ? 'text-[#F5B700]' : 'text-[#F3F1EC]'}`,
                      currClass: 'text-[11px] text-[#C8CAD0] font-semibold'
                    })}
                    <button onclick="window.confirmDeleteTx('${tx.id}')" class="text-[#C8CAD0] hover:text-[#E6A8A8] w-8 h-8 flex items-center justify-center rounded-full transition-colors">
                      <i data-lucide="trash" class="w-4 h-4"></i>
                    </button>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-[#C8CAD0] min-w-0">
                  <span class="font-mono whitespace-nowrap shrink-0" dir="ltr">${tx.date}</span>
                  <span class="text-[#565963] shrink-0">·</span>
                  ${tx.card?.name ? `<span class="truncate">${tx.card.name}</span>` : ''}
                  <span class="font-mono whitespace-nowrap shrink-0" dir="ltr">•••• ${tx.card?.last4 || ''}</span>
                </div>
                <div class="flex items-center justify-between gap-2 pt-0.5">
                  ${isCredit ? `
                    <p class="text-xs ${isCurrentCycle ? 'text-[#F5B700]' : 'text-[#C8CAD0]'} font-semibold whitespace-nowrap">
                      ${t('affects_stmt', { month: localizeMonthName(stmtName) })}
                    </p>
                  ` : '<span></span>'}
                  <span class="shrink-0">${typeBadge}</span>
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

    if (window.WalletSecurity && typeof window.WalletSecurity.isBiometricsQuarantined === 'function' &&
        window.WalletSecurity.isBiometricsQuarantined() && !bioEnrollmentInFlight) {
      bioEnrollmentInFlight = true;
      try {
        await window.WalletSecurity.retryBiometricCleanup();
      } finally {
        bioEnrollmentInFlight = false;
      }
    }

    const isBioSupported = window.WalletSecurity ? await window.WalletSecurity.isBiometricsAvailable() : false;
    lastBioSupported = isBioSupported;
    const isBioQuarantined = (window.WalletSecurity && typeof window.WalletSecurity.isBiometricsQuarantined === 'function')
      ? window.WalletSecurity.isBiometricsQuarantined()
      : false;
    const isBioEnabled = window.WalletSecurity ? window.WalletSecurity.isBiometricsEnabled() : false;
    const canToggleBio = isBioSupported && !bioEnrollmentInFlight && !isBioQuarantined;
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
        <div class="space-y-2">
          <p class="text-[17px] font-extrabold text-[#F3F1EC] px-1">${t('security')}</p>
          <div class="bg-[#25262B] border border-[#33353C] rounded-3xl divide-y divide-[#33353C]/80 overflow-hidden shadow-md">
            
            <!-- Row: PIN Code -->
            <div class="flex items-center justify-between p-4 gap-3">
              <div>
                <div class="text-[15px] font-bold text-[#F3F1EC]">${t('pin_code')}</div>
                <div class="text-xs text-[#C8CAD0] mt-0.5">${t('digits_4')}</div>
              </div>
              <button type="button" onclick="window.promptChangePin()" class="px-4 py-2 min-h-[44px] rounded-xl bg-[#2A2B31] hover:bg-[#43464F] border border-[#43464F] text-[13px] font-bold text-[#F3F1EC] active-press transition-colors shrink-0">
                ${t('change')}
              </button>
            </div>

            <!-- Row: Biometric Unlock -->
            <div class="flex items-center justify-between p-4 gap-3">
              <div class="min-w-0 flex-1">
                <div class="text-[15px] font-bold text-[#F3F1EC]">${t('biometric_unlock')}</div>
                <div id="settings-biometric-status" class="text-xs ${isBioQuarantined ? 'text-[#E6A8A8] font-semibold' : 'text-[#C8CAD0]'} mt-0.5">
                  ${isBioQuarantined
                    ? t('bio_quarantine_msg')
                    : (isBioSupported ? (isBioEnabled ? t('enabled') : t('not_enabled')) : (getLang() === 'ar' ? 'غير مدعوم في هذا المتصفح' : 'Not supported'))}
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button type="button" id="settings-biometric-retry-btn" onclick="window.retryBiometricCleanupAction()" class="${isBioQuarantined ? '' : 'hidden'} px-3 py-2 min-h-[44px] rounded-xl bg-[#2A2B31] hover:bg-[#43464F] border border-[#E6A8A8]/50 text-[#E6A8A8] text-xs font-bold active-press">
                  ${t('retry_btn')}
                </button>
                <label id="settings-biometric-label" class="relative inline-flex items-center min-h-[44px] shrink-0 ${canToggleBio ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}">
                  <input type="checkbox" id="settings-biometric-toggle" ${isBioEnabled ? 'checked' : ''} ${!canToggleBio ? 'disabled' : ''} class="sr-only peer">
                  <div class="relative w-11 h-6 bg-[#2A2B31] border border-[#43464F] peer-focus:outline-none rounded-full peer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5 peer-checked:after:border-white peer-checked:bg-[#F5B700] peer-checked:border-[#F5B700]"></div>
                </label>
              </div>
            </div>

            <!-- Row: Auto-Lock -->
            <div class="flex items-center justify-between p-4 gap-3">
              <div>
                <div class="text-[15px] font-bold text-[#F3F1EC]">${t('auto_lock')}</div>
              </div>
              <select id="settings-autolock-select" onchange="window.updateAutoLockTimeout(this.value)" class="text-[13px] font-bold bg-[#2A2B31] border border-[#43464F] text-[#F3F1EC] rounded-xl px-3 py-2 min-h-[44px] outline-none cursor-pointer shrink-0">
                <option value="0" ${timeoutMs === 0 ? 'selected' : ''}>${t('immediately')}</option>
                <option value="60000" ${timeoutMs === 60000 ? 'selected' : ''}>${t('minutes_1')}</option>
                <option value="180000" ${timeoutMs === 180000 ? 'selected' : ''}>${t('minutes_3')}</option>
                <option value="300000" ${timeoutMs === 300000 ? 'selected' : ''}>${t('minutes_5')}</option>
                <option value="900000" ${timeoutMs === 900000 ? 'selected' : ''}>${t('minutes_15')}</option>
              </select>
            </div>

            <!-- Row: Lock Wallet Now -->
            <div onclick="window.WalletSecurity && window.WalletSecurity.lock()" class="flex items-center justify-between p-4 min-h-[52px] cursor-pointer hover:bg-[#2A2B31]/60 transition-colors active-press">
              <span class="text-[15px] font-bold text-[#F3F1EC]">${t('lock_wallet_now')}</span>
              <span class="text-[#C8CAD0] text-sm">&rsaquo;</span>
            </div>

          </div>
        </div>

        <!-- SECTION 2: SMS PROCESSING (استقبال الرسائل) -->
        <div class="space-y-2">
          <p class="text-[17px] font-extrabold text-[#F3F1EC] px-1">${t('sms_intake')}</p>
          <div class="bg-[#25262B] border border-[#33353C] rounded-3xl divide-y divide-[#33353C]/80 overflow-hidden shadow-md">
            
            <!-- Row: Read Bank SMS -->
            <div class="flex items-center justify-between p-4 gap-3">
              <div>
                <div class="text-[15px] font-bold text-[#F3F1EC]">${t('read_bank_sms')}</div>
                <div class="text-xs text-[#C8CAD0] mt-0.5">
                  ${(window.BankSmsEngine && window.BankSmsEngine.stats.permissionStatus === 'granted') ? t('active_perm_granted') : t('inactive_or_no_perm')}
                </div>
              </div>
              <label class="relative inline-flex items-center min-h-[44px] shrink-0 cursor-pointer">
                <input type="checkbox" id="settings-sms-import-toggle" ${window.BankSmsEngine && window.BankSmsEngine.stats.isSmsImportEnabled ? 'checked' : ''} onchange="window.toggleSmsImport(this.checked)" class="sr-only peer">
                <div class="relative w-11 h-6 bg-[#2A2B31] border border-[#43464F] peer-focus:outline-none rounded-full peer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5 peer-checked:after:border-white peer-checked:bg-[#F5B700] peer-checked:border-[#F5B700]"></div>
              </label>
            </div>

            <!-- Row: Wallet Banks (Actual registered banks in wallet, disconnected from Dev Simulator) -->
            <div onclick="window.switchTab('cards')" class="flex items-center justify-between p-4 min-h-[52px] cursor-pointer hover:bg-[#2A2B31]/60 transition-colors active-press">
              <span class="text-[15px] font-bold text-[#F3F1EC]">${t('wallet_banks')}</span>
              <div class="flex items-center gap-2">
                <span class="text-xs text-[#C8CAD0]">${formatWalletBanksCount(store.banks.length)}</span>
                <span class="text-[#C8CAD0] text-sm">&rsaquo;</span>
              </div>
            </div>

            <!-- Row: Check Reception Status -->
            <div onclick="window.openSmsDiagnostics()" class="flex items-center justify-between p-4 min-h-[52px] cursor-pointer hover:bg-[#2A2B31]/60 transition-colors active-press">
              <span class="text-[15px] font-bold text-[#F3F1EC]">${t('check_reception_status')}</span>
              <span class="text-[#C8CAD0] text-sm">&rsaquo;</span>
            </div>

            <!-- Row: Import Past SMS -->
            <div onclick="window.openHistoricalSmsImport()" class="flex items-center justify-between p-4 min-h-[52px] cursor-pointer hover:bg-[#2A2B31]/60 transition-colors active-press">
              <span class="text-[15px] font-bold text-[#F3F1EC]">${t('import_past_sms')}</span>
              <span class="text-[#C8CAD0] text-sm">&rsaquo;</span>
            </div>

          </div>
        </div>

        <!-- SECTION 3: BACKUP & GENERAL (النسخ الاحتياطي والعام) -->
        <div class="space-y-2">
          <p class="text-[17px] font-extrabold text-[#F3F1EC] px-1">${t('backup_general')}</p>
          <div class="bg-[#25262B] border border-[#33353C] rounded-3xl divide-y divide-[#33353C]/80 overflow-hidden shadow-md">
            
            <!-- Row: Export Encrypted Backup -->
            <div onclick="window.exportEncryptedVaultBackup()" class="flex items-center justify-between p-4 min-h-[56px] cursor-pointer hover:bg-[#2A2B31]/60 transition-colors active-press gap-3">
              <div>
                <div class="text-[15px] font-bold text-[#F3F1EC]">${t('export_encrypted_backup')}</div>
                <div class="text-xs text-[#C8CAD0] mt-0.5">${t('passphrase_8_chars')}</div>
              </div>
              <span class="text-[#C8CAD0] text-sm shrink-0">&rsaquo;</span>
            </div>

            <!-- Row: Import Backup -->
            <div onclick="document.getElementById('vault-backup-file-input').click()" class="flex items-center justify-between p-4 min-h-[56px] cursor-pointer hover:bg-[#2A2B31]/60 transition-colors active-press gap-3">
              <div>
                <div class="text-[15px] font-bold text-[#F3F1EC]">${t('import_backup')}</div>
                <div class="text-xs text-[#C8CAD0] mt-0.5">${t('replaces_data_after_confirm')}</div>
              </div>
              <span class="text-[#C8CAD0] text-sm shrink-0">&rsaquo;</span>
            </div>

            <!-- Row: Language -->
            <div class="flex items-center justify-between p-4 gap-3">
              <div>
                <div class="text-[15px] font-bold text-[#F3F1EC]">${t('language')}</div>
                <div class="text-xs text-[#C8CAD0] mt-0.5">${t('all_screen_one_lang')}</div>
              </div>
              <button type="button" onclick="window.toggleAppLanguage()" class="px-4 py-2 min-h-[44px] rounded-xl bg-[#2A2B31] hover:bg-[#43464F] border border-[#43464F] text-[13px] font-bold text-[#F3F1EC] active-press transition-colors shrink-0">
                ${getLang() === 'ar' ? 'العربية' : 'English'}
              </button>
            </div>

            <!-- Row: Currency -->
            <div class="flex items-center justify-between p-4 gap-3">
              <span class="text-[15px] font-bold text-[#F3F1EC]">${t('currency')}</span>
              <select onchange="window.switchCurrency(this.value)" class="text-[13px] font-bold bg-[#2A2B31] border border-[#43464F] text-[#F3F1EC] rounded-xl px-3 py-2 min-h-[44px] outline-none cursor-pointer shrink-0">
                <option value="EGP" ${currentCurrency === 'EGP' ? 'selected' : ''}>EGP</option>
                <option value="USD" ${currentCurrency === 'USD' ? 'selected' : ''}>USD ($)</option>
                <option value="EUR" ${currentCurrency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                <option value="SAR" ${currentCurrency === 'SAR' ? 'selected' : ''}>SAR</option>
                <option value="AED" ${currentCurrency === 'AED' ? 'selected' : ''}>AED</option>
                <option value="GBP" ${currentCurrency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
              </select>
            </div>

            <!-- Row: Export CSV -->
            <div onclick="window.exportTransactionsCSV()" class="flex items-center justify-between p-4 min-h-[52px] cursor-pointer hover:bg-[#2A2B31]/60 transition-colors active-press">
              <span class="text-[15px] font-bold text-[#F3F1EC]">${t('export_csv')}</span>
              <span class="text-[#C8CAD0] text-sm">&rsaquo;</span>
            </div>

            <!-- Row: Developer Tools & Simulation -->
            <div onclick="window.toggleDevSimulator()" class="flex items-center justify-between p-4 min-h-[52px] cursor-pointer hover:bg-[#2A2B31]/60 transition-colors active-press">
              <span class="text-[15px] font-bold text-[#F3F1EC]">${t('developer_tools')}</span>
              <span class="text-[#C8CAD0] text-sm">&rsaquo;</span>
            </div>

            <!-- Row: Clear All Data -->
            <div onclick="window.clearAllData()" class="flex items-center justify-between p-4 min-h-[52px] cursor-pointer hover:bg-[#3A2020]/40 transition-colors active-press">
              <span class="text-[15px] font-bold text-[#E6A8A8]">${t('clear_all_data')}</span>
              <span class="text-[#E6A8A8] text-sm">&rsaquo;</span>
            </div>

          </div>
        </div>

        <!-- DEVELOPER TOOLS EXPANDABLE DRAWER -->
        <div id="settings-dev-tools-box" class="hidden bg-[#25262B] rounded-3xl p-5 border border-[#33353C] space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-[#33353C]">
            <h3 class="text-xs font-extrabold text-[#F3F1EC]">${t('developer_tools')}</h3>
            <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#2A2B31] text-[#F5B700] border border-[#F5B700]/30">DEV</span>
          </div>

          <!-- Bank Allowlist Manager -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-[#F3F1EC]">${t('allowed_senders_label')}</label>
              <span class="text-xs text-[#C8CAD0]">${t('enabled_count', { n: (window.BankSmsEngine && window.BankSmsEngine.allowlist.length) || 0 })}</span>
            </div>
            <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-[#2A2B31] rounded-2xl border border-[#43464F]">
              ${(window.BankSmsEngine && window.BankSmsEngine.allowlist || []).map(b => `
                <span class="inline-flex items-center gap-1 text-[10px] font-bold bg-[#25262B] text-[#F3F1EC] px-2 py-0.5 rounded-full border border-[#43464F]" dir="ltr">
                  <span>${b}</span>
                  <button type="button" onclick="window.removeBankSender('${b}')" class="text-[#C8CAD0] hover:text-[#E6A8A8]">×</button>
                </span>
              `).join('')}
            </div>
            <div class="flex gap-2">
              <input type="text" id="settings-add-bank-input" placeholder="${t('add_sender_placeholder')}" class="flex-1 text-xs bg-[#2A2B31] border border-[#43464F] rounded-xl px-2.5 py-1.5 text-[#F3F1EC] outline-none">
              <button type="button" onclick="window.addBankSender()" class="px-3 py-1.5 bg-[#F5B700] text-[#111111] text-[11px] font-bold rounded-xl active-press">${t('add_btn')}</button>
            </div>
          </div>

          <!-- In-App Synthetic SMS Test Simulator -->
          <div class="border-t border-[#33353C] pt-3 space-y-2">
            <label class="text-xs font-bold text-[#F3F1EC]">${t('sms_simulator_label')}</label>
            <div class="flex gap-2">
              <select id="sms-simulator-select" class="flex-1 text-[11px] font-bold bg-[#2A2B31] border border-[#43464F] text-[#F3F1EC] rounded-xl px-2.5 py-1.5 outline-none cursor-pointer">
                <option value="0">${t('sim_opt_0')}</option>
                <option value="1">${t('sim_opt_1')}</option>
                <option value="2">${t('sim_opt_2')}</option>
                <option value="3">${t('sim_opt_3')}</option>
                <option value="4">${t('sim_opt_4')}</option>
                <option value="5">${t('sim_opt_5')}</option>
              </select>
              <button type="button" onclick="window.simulatePresetSms()" class="px-3 py-1.5 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] text-[11px] font-bold rounded-xl active-press shrink-0">
                ${t('simulate_btn')}
              </button>
            </div>
          </div>

          <!-- Reset to Demo Data -->
          <div class="border-t border-[#33353C] pt-3">
            <button type="button" onclick="window.resetSampleData()" class="w-full py-2 px-3 bg-[#2A2B31] hover:bg-[#43464F] border border-[#43464F] text-[#F3F1EC] text-[11px] font-bold rounded-xl active-press">
              ${t('reset_demo_btn')}
            </button>
          </div>
        </div>

      </div>
    `;

    // Biometric Toggle Handler (Serialized lifecycle + PIN verification + strict verified cleanup)
    const bioToggle = document.getElementById('settings-biometric-toggle');
    if (bioToggle && isBioSupported) {
      bioToggle.addEventListener('change', async (e) => {
        if (!window.WalletSecurity) {
          e.target.checked = false;
          return;
        }
        const isQuarantinedNow = typeof window.WalletSecurity.isBiometricsQuarantined === 'function' && window.WalletSecurity.isBiometricsQuarantined();
        if (bioEnrollmentInFlight || isQuarantinedNow) {
          syncSettingsBiometricDom();
          showToast(isQuarantinedNow ? t('toast_bio_cleanup_failed') : t('toast_bio_busy'), 'error');
          return;
        }
        const enabled = e.target.checked;
        if (enabled) {
          // Keep toggle visually OFF until PIN + biometric enrollment truly succeed
          e.target.checked = false;
          showPinLock('verify_biometric');
        } else {
          bioEnrollmentInFlight = true;
          syncSettingsBiometricDom();
          try {
            const disRes = await window.WalletSecurity.disableBiometrics();
            if (disRes && disRes.success === true) {
              showToast(t('toast_bio_disabled'), 'info');
            } else {
              showToast(t('toast_bio_cleanup_failed'), 'error');
            }
          } catch (err) {
            showToast(t('toast_bio_cleanup_failed'), 'error');
          } finally {
            bioEnrollmentInFlight = false;
            syncSettingsBiometricDom();
          }
        }
      });
    }

    window.retryBiometricCleanupAction = async () => {
      if (!window.WalletSecurity || bioEnrollmentInFlight) return;
      bioEnrollmentInFlight = true;
      const retryBtn = document.getElementById('settings-biometric-retry-btn');
      if (retryBtn) retryBtn.disabled = true;
      syncSettingsBiometricDom();
      try {
        const res = await window.WalletSecurity.retryBiometricCleanup();
        if (res && res.success === true) {
          showToast(t('toast_bio_cleanup_ok'), 'success');
        } else {
          showToast(t('toast_bio_cleanup_failed'), 'error');
        }
      } catch (err) {
        showToast(t('toast_bio_cleanup_failed'), 'error');
      } finally {
        bioEnrollmentInFlight = false;
        if (retryBtn) retryBtn.disabled = false;
        syncSettingsBiometricDom();
      }
    };

    if (window.lucide) {
      try { lucide.createIcons({ root: container }); } catch (e) {}
    }
  }

  window.updateAutoLockTimeout = (ms) => {
    if (window.WalletSecurity) {
      window.WalletSecurity.setAutoLockTimeout(ms);
      showToast(t('toast_autolock_updated'), 'success');
    }
  };

  window.confirmDeleteBank = (bankId) => {
    const bank = store.getBank(bankId);
    if (!bank) return;
    if (confirm(t('confirm_delete_bank', { name: bank.name }))) {
      store.deleteBank(bankId);
      showToast(t('toast_bank_deleted', { name: bank.name }), 'info');
      renderCurrentView();
    }
  };

  window.confirmDeleteCard = (cardId) => {
    const card = store.getCard(cardId);
    if (!card) return;
    const affectedTxs = store.transactions.filter(t => t.cardId === cardId);
    const count = affectedTxs.length;
    const msg = count > 0
      ? t('confirm_delete_card_tx', { name: card.name, last4: card.last4, count })
      : t('confirm_delete_card', { name: card.name, last4: card.last4 });
    if (confirm(msg)) {
      store.deleteCard(cardId);
      showToast(t('toast_card_deleted'), 'info');
      renderCurrentView();
    }
  };

  window.confirmDeleteTx = (txId) => {
    const tx = store.getTransaction(txId);
    if (!tx) return;
    if (confirm(t('confirm_delete_tx', { merchant: tx.merchant }))) {
      store.deleteTransaction(txId);
      showToast(t('toast_tx_deleted'), 'info');
      renderCurrentView();
    }
  };

  window.switchCurrency = (newCurr) => {
    currentCurrency = newCurr;
    localStorage.setItem('wallet_currency', newCurr);
    const currSelect = document.getElementById('header-currency-select');
    if (currSelect) currSelect.value = newCurr;
    showToast(t('toast_currency_set', { curr: newCurr }), 'success');
    renderCurrentView();
  };

  window.clearAllData = () => {
    if (confirm(t('confirm_clear_all'))) {
      store.clearAllData();
      activeFeaturedCardId = null;
      showToast(t('toast_all_cleared'), 'success');
      renderCurrentView();
    }
  };

  window.resetSampleData = () => {
    if (confirm(t('confirm_reset_demo'))) {
      store.resetToSampleData();
      activeFeaturedCardId = store.cards.length > 0 ? store.cards[0].id : null;
      showToast(t('toast_reset_demo'), 'success');
      renderCurrentView();
    }
  };

  window.exportTransactionsCSV = () => {
    const txs = store.getEnrichedTransactions();
    if (txs.length === 0) {
      showToast(t('toast_no_tx_export'), 'error');
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
    showToast(t('toast_csv_exported'), 'success');
  };

  // ==========================================
  // BANK SMS IMPORT & REVIEW INBOX CONTROLLER
  // ==========================================
  window.toggleCandidateEditDetails = (candidateId) => {
    if (expandedSmsEditIds.has(candidateId)) expandedSmsEditIds.delete(candidateId);
    else expandedSmsEditIds.add(candidateId);
    const el = document.getElementById(`candidate-extra-edit-${candidateId}`);
    if (el) el.classList.toggle('hidden');
  };

  window.toggleCandidateWarningDetails = (candidateId) => {
    if (expandedSmsWarnIds.has(candidateId)) expandedSmsWarnIds.delete(candidateId);
    else expandedSmsWarnIds.add(candidateId);
    const isExpanded = expandedSmsWarnIds.has(candidateId);
    const box = document.getElementById(`candidate-warn-details-${candidateId}`);
    const labelEl = document.getElementById(`candidate-warn-btn-label-${candidateId}`);
    const chevEl = document.getElementById(`candidate-warn-btn-chev-${candidateId}`);
    if (box) box.classList.toggle('hidden', !isExpanded);
    if (labelEl) labelEl.textContent = isExpanded ? t('hide') : t('details');
    if (chevEl) chevEl.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
  };

  function buildCandidateSummarySentence(c) {
    const isInc = c.type === 'income' || c.direction === 'income';
    const amtStr = `<span class="font-mono font-bold text-[#F3F1EC]" dir="ltr">${formatCurrency(c.amount, c.currency || currentCurrency)}</span>`;
    let cardDisplay = c.cardSuffix ? (getLang() === 'ar' ? `كارت ${c.cardSuffix}` : `card ${c.cardSuffix}`) : (getLang() === 'ar' ? 'الحساب' : 'account');
    if (c.matchedCardId) {
      const mc = store.getCard(c.matchedCardId);
      if (mc) cardDisplay = `${mc.name} ${mc.last4}`;
    } else if (c.matchedAccountId) {
      const ma = store.getAccount(c.matchedAccountId);
      if (ma) cardDisplay = ma.name;
    }
    const merchStr = c.merchant || c.bank || '—';

    if (isInc) return t('summary_income', { amount: amtStr, card: cardDisplay, merchant: merchStr });
    if (c.transactionType === 'withdrawal') return t('summary_withdrawal', { amount: amtStr, card: cardDisplay });
    if (c.transactionType === 'transfer') return t('summary_transfer', { amount: amtStr, card: cardDisplay, merchant: merchStr });
    return t('summary_purchase', { amount: amtStr, card: cardDisplay, merchant: merchStr });
  }

  function renderSmsCandidatesList() {
    const listEls = [
      document.getElementById('sms-candidates-container'),
      document.getElementById('view-review-candidates-container')
    ].filter(Boolean);
    const counterEl = document.getElementById('sms-inbox-counter');

    const candidates = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates) ? window.BankSmsEngine.pendingCandidates : [];
    if (counterEl) {
      counterEl.textContent = String(candidates.length);
    }

    if (listEls.length === 0) return;

    if (candidates.length === 0) {
      const emptyHtml = `
        <div class="py-12 text-center space-y-3 bg-[#25262B] border border-[#33353C] rounded-3xl p-6">
          <div class="w-12 h-12 mx-auto rounded-full bg-[#2A2B31] text-[#C8CAD0] flex items-center justify-center border border-[#43464F]">
            <i data-lucide="inbox" class="w-6 h-6"></i>
          </div>
          <p class="text-[15px] font-bold text-[#F3F1EC]">${t('inbox_empty')}</p>
          <p class="text-xs text-[#C8CAD0] max-w-[260px] mx-auto">${t('inbox_empty_desc')}</p>
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
      const needsCardSelection = c.requiresCardSelection || !c.matchedCardId;
      const isExtraOpen = expandedSmsEditIds.has(c.id);
      const isWarnOpen = expandedSmsWarnIds.has(c.id);
      const messageBodyHtml = c.rawMessage ? escapeHtmlText(c.rawMessage) : buildCandidateSummarySentence(c);
      const calmWarnTitle = getCalmNonMatchTitle(c);

      return `
        <div id="candidate-card-${c.id}" class="bg-[#25262B] border border-[#33353C] rounded-2xl p-4 space-y-3 transition-all shadow-md card-press">
          <!-- Row 1: Bank + Card/Tags & Amount LTR -->
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 flex-wrap min-w-0">
              <span class="text-[15px] font-black tracking-tight text-[#F3F1EC]" dir="ltr">${c.bank}</span>
              ${c.cardSuffix ? `<span class="text-[13px] font-mono text-[#C8CAD0]" dir="ltr">•••• ${c.cardSuffix}</span>` : ''}
              ${c.isHistorical ? `<span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#2A2B31] text-[#C8CAD0] border border-[#43464F]">${t('historical_badge')}</span>` : ''}
            </div>
            <div class="shrink-0">
              ${formatAmountInlineHtml(c.amount, {
                useSans: true,
                prefixSign: isCredit ? '+' : '-',
                currency: c.currency || currentCurrency,
                numClass: `text-[17px] font-extrabold ${isCredit ? 'text-[#F5B700]' : 'text-[#F3F1EC]'}`,
                currClass: 'text-[11.5px] text-[#C8CAD0] font-semibold'
              })}
            </div>
          </div>

          <!-- Row 2: Original SMS Text (Hero Readability 16.5px) + Edit Toggle -->
          <div class="flex items-start justify-between gap-2.5">
            <p class="text-[16.5px] font-normal text-[#F3F1EC] leading-relaxed flex-1 min-w-0" dir="auto">${messageBodyHtml}</p>
            <button type="button" onclick="window.toggleCandidateEditDetails('${c.id}')" class="w-11 h-11 rounded-xl bg-transparent hover:bg-[#2A2B31] border border-transparent hover:border-[#43464F] text-[#C8CAD0] hover:text-[#F5B700] shrink-0 flex items-center justify-center transition-colors active-press" title="${t('edit_details')}">
              <i data-lucide="sliders-horizontal" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Collapsible Edit Details (Merchant, Category, Date/Ref) — Always in DOM for approveSmsCandidate -->
          <div id="candidate-extra-edit-${c.id}" class="${isExtraOpen ? '' : 'hidden'} space-y-2.5 bg-[#1A1B1F] border border-[#33353C] rounded-xl p-3">
            <div>
              <label class="block text-xs font-bold text-[#C8CAD0] mb-1">${t('merchant_label')}</label>
              <input type="text" id="candidate-merchant-${c.id}" value="${c.merchant ? c.merchant.replace(/"/g, '&quot;') : (c.bank + ' Transaction')}" class="w-full text-[13px] font-bold text-[#F3F1EC] bg-[#2A2B31] border border-[#43464F] rounded-xl px-3 py-2 outline-none focus:border-[#F5B700]">
            </div>
            <div>
              <label class="block text-xs font-bold text-[#C8CAD0] mb-1">${t('category')}</label>
              <select id="candidate-category-select-${c.id}" class="w-full text-[13px] font-bold text-[#F3F1EC] bg-[#2A2B31] border border-[#43464F] rounded-xl px-2.5 py-2 outline-none cursor-pointer">
                <option value="shopping" ${c.suggestedCategory === 'shopping' ? 'selected' : ''}>${t('cat_shopping')}</option>
                <option value="food" ${c.suggestedCategory === 'food' ? 'selected' : ''}>${t('cat_food')}</option>
                <option value="groceries" ${c.suggestedCategory === 'groceries' ? 'selected' : ''}>${t('cat_groceries')}</option>
                <option value="utilities" ${c.suggestedCategory === 'utilities' ? 'selected' : ''}>${t('cat_utilities')}</option>
                <option value="travel" ${c.suggestedCategory === 'travel' ? 'selected' : ''}>${t('cat_travel')}</option>
                <option value="health" ${c.suggestedCategory === 'health' ? 'selected' : ''}>${t('cat_health')}</option>
                <option value="entertainment" ${c.suggestedCategory === 'entertainment' ? 'selected' : ''}>${t('cat_entertainment')}</option>
                <option value="services" ${c.suggestedCategory === 'services' ? 'selected' : ''}>${t('cat_services')}</option>
                <option value="other" ${!c.suggestedCategory || c.suggestedCategory === 'other' ? 'selected' : ''}>${t('cat_other')}</option>
              </select>
            </div>
            <div class="text-xs text-[#C8CAD0] flex items-center justify-between pt-0.5">
              <span>${t('date_prefix')} <span dir="ltr" class="font-mono">${c.transactionTime || new Date(c.receiptTime).toLocaleString()}</span></span>
              <span>${t('ref_prefix')} <span dir="ltr" class="font-mono">${(c.fingerprint || '').slice(0, 10)}</span></span>
            </div>
          </div>

          ${needsCardSelection ? `
            <div class="bg-[#1E2025] border border-[#33353C] rounded-xl px-3.5 py-2 text-xs">
              <div class="flex items-center justify-between gap-2 min-h-[36px]">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-2 h-2 rounded-full bg-[#F5B700] shrink-0"></span>
                  <span class="text-[13px] font-bold text-[#F5B700] truncate">${calmWarnTitle}</span>
                </div>
                <button type="button" onclick="window.toggleCandidateWarningDetails('${c.id}')" class="min-h-[36px] px-2 inline-flex items-center gap-1 text-xs font-bold text-[#C8CAD0] hover:text-[#F3F1EC] shrink-0 active-press">
                  <span id="candidate-warn-btn-label-${c.id}">${isWarnOpen ? t('hide') : t('details')}</span>
                  <i id="candidate-warn-btn-chev-${c.id}" data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform" style="transform: ${isWarnOpen ? 'rotate(180deg)' : 'rotate(0deg)'}"></i>
                </button>
              </div>
              <div id="candidate-warn-details-${c.id}" class="${isWarnOpen ? '' : 'hidden'} pt-2 mt-1.5 border-t border-[#33353C] space-y-2 text-[13px] text-[#C8CAD0] leading-relaxed">
                <p>${c.nonMatchReason || t('non_match_default')}</p>
                ${c.matchSuggestion ? `
                  <div class="text-[#C8CAD0] flex items-center justify-between gap-2 pt-1.5 border-t border-[#33353C]/70">
                    <span>${c.matchSuggestion}</span>
                    ${c.suggestAddAccount ? `
                      <button type="button" onclick="window.openAddAccountPrompt('${c.suggestAddAccount.bankId || ''}', '${c.suggestAddAccount.digits || ''}', '${c.suggestAddAccount.position || 'last'}')" class="shrink-0 px-3 py-2 min-h-[44px] bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] rounded-xl text-xs font-bold active-press">
                        ${t('add_account_btn')}
                      </button>
                    ` : ''}
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}

          ${c.isPotentialDuplicate ? `
            <div class="bg-[#1E2025] border border-[#33353C] rounded-xl p-3 text-xs text-[#F5B700] space-y-1.5">
              <div class="flex items-center gap-2 font-bold">
                <span class="w-2 h-2 rounded-full bg-[#F5B700] shrink-0"></span>
                <span>${t('dup_title')}</span>
              </div>
              <p class="text-[13px] text-[#C8CAD0] leading-snug">${c.potentialDuplicateReason || t('dup_default')}</p>
              <div class="text-xs text-[#C8CAD0] bg-[#1A1B1F] p-2 rounded-lg font-mono border border-[#33353C]">
                ${t('dup_prev_label')} ${c.potentialDuplicateMatch ? `${c.potentialDuplicateMatch.amount} • ${c.potentialDuplicateMatch.date} (${c.potentialDuplicateMatch.merchant})` : t('dup_prev_fallback')}
              </div>
            </div>
          ` : ''}

          <!-- Row 3: Segmented Operation Type Control (Purchase / Cash Withdrawal / Transfer) -->
          <div class="grid grid-cols-3 bg-[#1A1B1F] border border-[#33353C] rounded-2xl p-1 gap-1">
            <label class="cursor-pointer">
              <input type="radio" name="candidate-type-${c.id}" value="purchase" class="hidden peer" ${c.transactionType === 'purchase' || !c.transactionType ? 'checked' : ''} onchange="window.onCandidateTypeChanged('${c.id}')">
              <span class="flex items-center justify-center min-h-[44px] px-1 rounded-xl text-[12px] font-bold text-[#C8CAD0] border border-transparent peer-checked:bg-[#2A2B31] peer-checked:border-[#43464F] peer-checked:text-[#F3F1EC] peer-checked:shadow-xs transition-all whitespace-nowrap">${t('purchase')}</span>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="candidate-type-${c.id}" value="withdrawal" class="hidden peer" ${c.transactionType === 'withdrawal' ? 'checked' : ''} onchange="window.onCandidateTypeChanged('${c.id}')">
              <span class="flex items-center justify-center min-h-[44px] px-1 rounded-xl text-[12px] font-bold text-[#C8CAD0] border border-transparent peer-checked:bg-[#2A2B31] peer-checked:border-[#43464F] peer-checked:text-[#F3F1EC] peer-checked:shadow-xs transition-all whitespace-nowrap">${t('withdrawal')}</span>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="candidate-type-${c.id}" value="transfer" class="hidden peer" ${c.transactionType === 'transfer' ? 'checked' : ''} onchange="window.onCandidateTypeChanged('${c.id}')">
              <span class="flex items-center justify-center min-h-[44px] px-1 rounded-xl text-[12px] font-bold text-[#C8CAD0] border border-transparent peer-checked:bg-[#2A2B31] peer-checked:border-[#43464F] peer-checked:text-[#F3F1EC] peer-checked:shadow-xs transition-all whitespace-nowrap">${t('transfer')}</span>
            </label>
          </div>

          <!-- Row 4: Neutral Card / Account Selector -->
          <div>
            <select id="candidate-card-select-${c.id}" onchange="window.onCandidateTypeChanged('${c.id}')" class="w-full text-[13.5px] font-bold text-[#F3F1EC] bg-[#1A1B1F] border border-[#33353C] focus:border-[#43464F] rounded-xl px-3.5 py-2.5 min-h-[44px] outline-none cursor-pointer">
              <option value="" ${!c.matchedCardId && !c.matchedAccountId ? 'selected disabled' : ''}>${t('select_card_or_account')}</option>
              <optgroup label="${t('cards_optgroup')}">
                ${cards.map(card => {
                  const isSelected = card.id === c.matchedCardId;
                  return `<option value="${card.id}" ${isSelected ? 'selected' : ''}>${card.name} (•••• ${card.last4})</option>`;
                }).join('')}
              </optgroup>
              ${(store.accounts && store.accounts.length > 0) ? `
                <optgroup label="${t('accounts_optgroup')}">
                  ${store.accounts.map(acc => {
                    const isSelected = acc.id === c.matchedAccountId && !c.matchedCardId;
                    return `<option value="acc:${acc.id}" ${isSelected ? 'selected' : ''}>${acc.name} (${acc.accountNumberMasked || acc.identifierDigits}) • ${t('balance_word')}: ${formatCurrency(acc.balance || 0)}</option>`;
                  }).join('')}
                </optgroup>
              ` : ''}
            </select>
          </div>

          <!-- Warning for unlinked debit withdrawal -->
          <div id="candidate-debit-warn-${c.id}" class="text-xs font-bold text-[#E6A8A8] bg-[#3A2020] border border-[#E6A8A8]/30 rounded-lg p-2.5 ${(() => {
            const matchedCard = c.matchedCardId ? store.getCard(c.matchedCardId) : null;
            return (c.transactionType === 'withdrawal' && matchedCard && matchedCard.cardType === 'debit' && !matchedCard.linkedAccountId && !c.matchedAccountId) ? '' : 'hidden';
          })()}">
            ${t('unlinked_debit_warn')}
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
              <div id="candidate-balance-box-${c.id}" class="p-2.5 rounded-xl bg-[#2A2B31] border ${isNeg ? 'border-[#E6A8A8]/40 text-[#E6A8A8]' : 'border-[#43464F] text-[#F3F1EC]'} space-y-1">
                <div class="flex items-center justify-between text-xs font-bold">
                  <span>${t('balance_before_label', { name: candAcc.name })} <span dir="ltr" class="font-mono">${formatCurrency(curBal)}</span></span>
                  <span>${t('balance_after_label')} <span dir="ltr" class="font-mono ${isNeg ? 'text-[#E6A8A8] font-black' : ''}">${formatCurrency(expAfter)}</span></span>
                </div>
                ${isNeg ? `
                  <div class="text-xs font-bold text-[#E6A8A8]">${t('negative_balance_cand_warn')}</div>
                ` : ''}
              </div>
            `;
          })()}

          <!-- Row 5: Approve (Amber) + Reject (Bordered) -->
          <div class="grid grid-cols-3 gap-2 pt-1">
            <button type="button" onclick="window.approveSmsCandidate('${c.id}')" class="col-span-2 py-2.5 min-h-[44px] bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] text-[14px] font-extrabold rounded-xl active-press transition-all flex items-center justify-center gap-1 shadow-md">
              <span>${t('approve')}</span>
            </button>
            <button type="button" onclick="window.rejectSmsCandidate('${c.id}')" class="col-span-1 py-2.5 min-h-[44px] bg-[#2A2B31] hover:bg-[#43464F] border border-[#43464F] text-[#F3F1EC] hover:text-[#E6A8A8] text-[13px] font-bold rounded-xl active-press transition-all flex items-center justify-center gap-1">
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
    switchView('review');
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
      showToast(t('toast_select_card_approve'), 'error');
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
      showToast(t('toast_unlinked_debit_approve'), 'error');
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

        const confirmMsg = t('confirm_manual_assign', { details: mismatchDetails.join(' | ') });
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
          const confirmMsg = t('confirm_neg_cand', { name: selectedAccount.name, cur: formatCurrency(currentBal), after: formatCurrency(expectedAfter) });
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
      showToast(t('toast_imported_tx', { merchant: res.transaction.merchant, amount: formatCurrency(res.transaction.amount) }), 'success');
      renderSmsCandidatesList();
      renderCurrentView();
    } else {
      showToast(res.error || t('toast_approve_err'), 'error');
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
    if (confirm(t('confirm_delete_account', { name: acc.name, masked: acc.accountNumberMasked }))) {
      store.deleteAccount(accId);
      showToast(t('toast_account_deleted', { name: acc.name }), 'info');
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
    const isEn = getLang() === 'en';

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
    if (headerEl) headerEl.textContent = `${bank ? bank.name : 'Bank'} • ${card.cardType.toUpperCase()} (•••• ${card.last4})`;

    // Inject Bank & Look section into form-edit-card if not present
    let editBankSection = document.getElementById('edit-card-bank-section');
    if (!editBankSection) {
      editBankSection = document.createElement('div');
      editBankSection.id = 'edit-card-bank-section';
      editBankSection.className = 'space-y-2 pb-2 border-b border-[#33353C]/60';
      editBankSection.innerHTML = `
        <div>
          <label class="block text-xs font-bold text-[#C8CAD0] mb-1">${t('bank_label') || 'البنك'}</label>
          <input type="text" id="edit-card-bank-search" placeholder="${t('search_bank_placeholder')}" class="w-full bg-[#1A1B1F] border border-[#33353C] rounded-2xl px-3 py-1.5 text-xs font-semibold text-[#F3F1EC] mb-1.5 focus:outline-none focus:border-[#F5B700]">
          <select id="edit-card-bank-select" class="w-full bg-[#1A1B1F] border border-[#33353C] rounded-2xl px-3 py-2 text-xs font-semibold text-[#F3F1EC] focus:outline-none focus:border-[#F5B700] cursor-pointer"></select>
        </div>
        <div id="edit-card-other-bank-container" class="hidden">
          <label class="block text-xs font-bold text-[#C8CAD0] mb-1">${t('other_bank_name_label')}</label>
          <input type="text" id="edit-card-other-bank-name" placeholder="${t('other_bank_name_placeholder')}" class="w-full bg-[#1A1B1F] border border-[#33353C] rounded-2xl px-3 py-2 text-xs font-semibold text-[#F3F1EC] focus:outline-none focus:border-[#F5B700]">
        </div>
        <div id="edit-card-look-container">
          <label class="block text-xs font-bold text-[#C8CAD0] mb-1">${t('card_look_label')}</label>
          <select id="edit-card-look-select" class="w-full bg-[#1A1B1F] border border-[#33353C] rounded-2xl px-3 py-2 text-xs font-semibold text-[#F3F1EC] focus:outline-none focus:border-[#F5B700] cursor-pointer"></select>
        </div>
      `;
      const formEdit = document.getElementById('form-edit-card');
      if (formEdit) {
        formEdit.insertBefore(editBankSection, formEdit.children[1] || formEdit.firstChild);
      }
    }

    const editBankSelect = document.getElementById('edit-card-bank-select');
    const editBankSearch = document.getElementById('edit-card-bank-search');
    const editOtherContainer = document.getElementById('edit-card-other-bank-container');
    const editOtherNameInput = document.getElementById('edit-card-other-bank-name');
    const editLookSelect = document.getElementById('edit-card-look-select');

    const allBanks = (typeof getEgyptianBanks === 'function')
      ? getEgyptianBanks(getLang())
      : (window.EGYPTIAN_BANKS || []);

    function renderEditBankOptions(filterText = '') {
      editBankSelect.innerHTML = '';
      const q = filterText.trim().toLowerCase();
      const filtered = allBanks.filter(b => {
        if (!q) return true;
        if (b.key === 'other') return true;
        return (
          b.shortCode.toLowerCase().includes(q) ||
          b.nameEn.toLowerCase().includes(q) ||
          b.nameAr.toLowerCase().includes(q)
        );
      });
      filtered.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.key;
        opt.textContent = isEn ? b.nameEn : b.nameAr;
        editBankSelect.appendChild(opt);
      });
    }

    renderEditBankOptions('');

    // Determine current bank match
    const catalogMatch = bank ? (findBankInCatalog(bank.shortCode) || findBankInCatalog(bank.name)) : null;
    if (catalogMatch && catalogMatch.key !== 'other') {
      editBankSelect.value = catalogMatch.key;
      editOtherContainer.classList.add('hidden');
      if (editOtherNameInput) editOtherNameInput.value = '';
    } else {
      // Unmatched or custom bank (e.g. "LL") -> "Other bank" with text preserved
      editBankSelect.value = 'other';
      editOtherContainer.classList.remove('hidden');
      if (editOtherNameInput) editOtherNameInput.value = bank ? bank.name : '';
    }

    function updateEditLooks() {
      const isOther = editBankSelect.value === 'other';
      if (isOther) {
        editOtherContainer.classList.remove('hidden');
      } else {
        editOtherContainer.classList.add('hidden');
      }
      populateLookDropdown(editLookSelect, editBankSelect.value, card.cardType, card.colorPreset);
    }

    if (editBankSearch) {
      editBankSearch.value = '';
      editBankSearch.oninput = (e) => {
        renderEditBankOptions(e.target.value);
        updateEditLooks();
      };
    }

    if (editBankSelect) {
      editBankSelect.onchange = () => {
        updateEditLooks();
      };
    }

    updateEditLooks();

    if (card.cardType === 'debit') {
      if (linkedSection) linkedSection.classList.remove('hidden');
      if (linkedSelect) {
        const accs = card.bankId ? store.getAccountsForBank(card.bankId) : store.accounts;
        linkedSelect.innerHTML = `<option value="">${t('none_independent_debit')}</option>` +
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
    showToast(t('toast_tx_discarded'), 'info');
    renderSmsCandidatesList();
    renderCurrentView();
  };

  window.approveAllVerifiedSms = async () => {
    if (!window.BankSmsEngine) return;
    const approved = await window.BankSmsEngine.approveAllVerified();
    if (approved.length > 0) {
      showToast(t('toast_batch_imported', { n: approved.length }), 'success');
      renderSmsCandidatesList();
      renderCurrentView();
    } else {
      showToast(t('toast_no_auto_matched'), 'info');
    }
  };

  window.clearAllPendingSms = async () => {
    if (!window.BankSmsEngine) return;
    if (confirm(t('confirm_clear_pending'))) {
      await window.BankSmsEngine.clearAllPending();
      showToast(t('toast_inbox_cleared'), 'info');
      renderSmsCandidatesList();
      renderCurrentView();
    }
  };

  window.toggleSmsImport = async (enabled) => {
    if (!window.BankSmsEngine) return;
    await window.BankSmsEngine.setSmsImportEnabled(enabled);
    showToast(enabled ? t('toast_sms_enabled') : t('toast_sms_disabled'), enabled ? 'success' : 'info');
    renderCurrentView();
  };

  window.requestSmsPermission = async () => {
    if (!window.BankSmsEngine) return;
    const res = await window.BankSmsEngine.requestPermission();
    if (res.granted) {
      showToast(t('toast_perm_granted'), 'success');
    } else {
      showToast(t('toast_perm_denied'), 'error');
    }
    renderCurrentView();
  };

  window.addBankSender = async () => {
    const input = document.getElementById('settings-add-bank-input') || document.getElementById('new-bank-sender-input');
    if (!input || !input.value.trim()) return;
    const sender = input.value.trim().toUpperCase();
    if (window.BankSmsEngine) {
      const current = window.BankSmsEngine.allowlist || [];
      if (!current.includes(sender)) {
        await window.BankSmsEngine.updateAllowlist([...current, sender]);
        showToast(t('toast_sender_added', { sender }), 'success');
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
      showToast(t('toast_sender_removed', { sender }), 'info');
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
      showToast(t('toast_sim_parsed', { bank: res.candidate.bank, amount: res.candidate.amount, currency: res.candidate.currency }), 'success');
      setTimeout(() => window.openSmsReviewInbox(), 300);
    } else {
      showToast(t('toast_sim_rejected', { reason: res.reason || '' }), 'info');
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
    const lastBroadcast = stats.lastBroadcastAt ? new Date(stats.lastBroadcastAt).toLocaleTimeString() + ' (' + new Date(stats.lastBroadcastAt).toLocaleDateString() + ')' : t('diag_no_bcast');
    const lastSender = stats.lastBroadcastSender || '';
    const queueCount = (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates.length) || 0;
    const queueCapacity = stats.queueCapacity || 100;
    const isQueueFull = queueCount >= queueCapacity;

    container.innerHTML = `
      <div class="space-y-3">
        <div class="bg-[#1A1B1F] border border-[#33353C] rounded-2xl p-3.5 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-[#F3F1EC] flex items-center gap-1.5 text-xs">
              <i data-lucide="shield" class="w-3.5 h-3.5 text-[#F5B700]"></i>
              ${t('diag_recv_perm')}
            </span>
            ${receiveGranted
              ? `<span class="px-2 py-0.5 rounded-full bg-[#2A2B31] text-[#F5B700] border border-[#F5B700]/40 text-[10px] font-bold">${t('diag_granted')}</span>`
              : `<span class="px-2 py-0.5 rounded-full bg-[#3A2020] text-[#E6A8A8] border border-[#E6A8A8]/30 text-[10px] font-bold">${t('diag_denied')}</span>`}
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-[#33353C]">
            <span class="font-extrabold text-[#F3F1EC] flex items-center gap-1.5 text-xs">
              <i data-lucide="book-open" class="w-3.5 h-3.5 text-[#F5B700]"></i>
              ${t('diag_read_perm')}
            </span>
            ${readGranted
              ? `<span class="px-2 py-0.5 rounded-full bg-[#2A2B31] text-[#F5B700] border border-[#F5B700]/40 text-[10px] font-bold">${t('diag_granted')}</span>`
              : `<span class="px-2 py-0.5 rounded-full bg-[#2A2B31] text-[#C8CAD0] border border-[#43464F] text-[10px] font-bold">${t('diag_inactive')}</span>`}
          </div>

          ${!receiveGranted ? `
            <div class="bg-[#2A2B31] border border-[#F5B700]/40 rounded-xl p-2.5 text-[11px] text-[#F5B700] space-y-1.5">
              <p class="font-bold">${t('diag_restricted_title')}</p>
              <p class="text-[10px] text-[#C8CAD0] leading-relaxed">${t('diag_restricted_desc')}</p>
              <div class="flex gap-2 pt-1">
                <button type="button" onclick="window.requestSmsReceivePermission()" class="flex-1 py-1.5 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] rounded-lg font-bold text-[10px] active-press">${t('diag_req_again')}</button>
                <button type="button" onclick="window.openAppSystemSettings()" class="py-1.5 px-2.5 bg-[#25262B] border border-[#43464F] text-[#F3F1EC] rounded-lg font-bold text-[10px] active-press">${t('diag_app_settings')}</button>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="bg-[#1A1B1F] border border-[#33353C] rounded-2xl p-3.5 space-y-2 text-[11px]">
          <div class="flex items-center justify-between">
            <span class="text-[#C8CAD0] font-bold">${t('diag_sms_switch')}</span>
            <span class="font-bold ${isEnabled ? 'text-[#F5B700]' : 'text-[#C8CAD0]'}">${isEnabled ? t('enabled') : t('not_enabled')}</span>
          </div>
          <div class="flex items-center justify-between border-t border-[#33353C] pt-2">
            <span class="text-[#C8CAD0] font-bold">${t('diag_vault_enc')}</span>
            <span class="font-bold text-[#F3F1EC] font-mono" dir="ltr">${stats.isKeystoreProtected ? 'Keystore AES-256' : 'Memory'}</span>
          </div>
          <div class="flex items-center justify-between border-t border-[#33353C] pt-2">
            <span class="text-[#C8CAD0] font-bold">${t('diag_queue_cap')}</span>
            <span class="font-bold font-mono ${isQueueFull ? 'text-[#E6A8A8]' : 'text-[#F5B700]'}" dir="ltr">${queueCount} / ${queueCapacity}</span>
          </div>
          <div class="border-t border-[#33353C] pt-2 space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[#C8CAD0] font-bold">${t('diag_last_bcast')}</span>
              <span class="font-bold text-[10px] text-[#F3F1EC] font-mono" dir="ltr">${lastBroadcast}</span>
            </div>
            ${lastSender ? `<div class="text-xs text-[#C8CAD0]">${t('diag_sender_prefix')} <b class="text-[#F3F1EC]">${lastSender}</b></div>` : ''}
          </div>
        </div>

        <div class="bg-[#1A1B1F] border border-[#33353C] rounded-2xl p-3 space-y-1.5">
          <div class="flex items-center gap-1.5 font-bold text-[#F5B700] text-[11px]">
            <i data-lucide="battery-charging" class="w-3.5 h-3.5"></i>
            <span>${t('diag_battery_title')}</span>
          </div>
          <p class="text-[10px] text-[#C8CAD0] leading-relaxed">${t('diag_battery_desc')}</p>
          <button type="button" onclick="window.openBatteryOptimizationSettings()" class="w-full py-2 bg-[#2A2B31] hover:bg-[#43464F] border border-[#43464F] text-[#F3F1EC] rounded-xl font-bold text-[10px] active-press transition-all">
            ${t('diag_battery_btn')}
          </button>
        </div>

        <div class="pt-1 flex gap-2">
          <button type="button" onclick="window.closeModal('smsDiagnostics'); window.openHistoricalSmsImport()" class="flex-1 py-2 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 active-press">
            <i data-lucide="history" class="w-3.5 h-3.5"></i>
            <span>${t('import_past_sms')}</span>
          </button>
          <button type="button" onclick="window.refreshDiagnostics()" class="py-2 px-3 bg-[#2A2B31] hover:bg-[#43464F] border border-[#43464F] text-[#F3F1EC] rounded-xl font-bold text-[11px] active-press">
            ${t('diag_refresh_btn')}
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
          <div class="w-12 h-12 mx-auto rounded-2xl bg-[#2A2B31] border border-[#43464F] text-[#F5B700] flex items-center justify-center">
            <i data-lucide="lock" class="w-6 h-6"></i>
          </div>
          <div class="space-y-1">
            <h4 class="font-extrabold text-sm text-[#F3F1EC]">${t('hist_perm_req')}</h4>
            <p class="text-xs text-[#C8CAD0] max-w-[260px] mx-auto leading-relaxed">${t('hist_perm_desc')}</p>
          </div>
          <div class="pt-2">
            <button type="button" onclick="window.requestReadSmsAndStart()" class="w-full py-2.5 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] rounded-xl font-bold text-xs active-press">
              ${t('hist_grant_btn')}
            </button>
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
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-[#F3F1EC]">${t('hist_choose_range')}</label>
          <div class="grid grid-cols-3 gap-2">
            <button type="button" onclick="window.selectHistoricalDays(30)" class="py-2 rounded-xl text-xs font-bold border transition-all ${days === 30 ? 'bg-[#F5B700] text-[#111111] border-[#F5B700]' : 'bg-[#1A1B1F] text-[#C8CAD0] border-[#33353C]'}">${t('hist_1m')}</button>
            <button type="button" onclick="window.selectHistoricalDays(90)" class="py-2 rounded-xl text-xs font-bold border transition-all ${days === 90 ? 'bg-[#F5B700] text-[#111111] border-[#F5B700]' : 'bg-[#1A1B1F] text-[#C8CAD0] border-[#33353C]'}">${t('hist_3m')}</button>
            <button type="button" onclick="window.selectHistoricalDays(365)" class="py-2 rounded-xl text-xs font-bold border transition-all ${days === 365 ? 'bg-[#F5B700] text-[#111111] border-[#F5B700]' : 'bg-[#1A1B1F] text-[#C8CAD0] border-[#33353C]'}">${t('hist_1y')}</button>
          </div>
        </div>

        ${scanResult ? `
          <div class="bg-[#1A1B1F] border border-[#F5B700]/40 rounded-xl p-3 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-extrabold text-[#F5B700] text-xs">${t('hist_scan_found', { n: scanResult.addedCount })}</span>
            </div>
            <div class="pt-1 flex gap-2">
              <button type="button" onclick="window.closeModal('smsHistorical'); window.switchTab('review')" class="flex-1 py-2 bg-[#F5B700] hover:bg-[#e0a600] text-[#111111] rounded-lg font-bold text-xs active-press">
                ${t('hist_open_review', { n: (window.BankSmsEngine && window.BankSmsEngine.pendingCandidates.length) || 0 })}
              </button>
              ${scanResult.hasMore ? `
                <button type="button" onclick="window.fetchNextHistoricalBatch()" class="py-2 px-3 bg-[#2A2B31] border border-[#43464F] text-[#F3F1EC] rounded-lg font-bold text-xs active-press">
                  ${t('hist_next_batch')}
                </button>
              ` : `
                <span class="px-2.5 py-2 bg-[#2A2B31] text-[#F5B700] rounded-lg font-bold text-[10px] flex items-center">${t('hist_done')}</span>
              `}
            </div>
          </div>
        ` : ''}

        <button type="button" id="btn-start-historical-scan" onclick="window.startHistoricalScan()" ${isScanning ? 'disabled' : ''} class="w-full py-2.5 bg-[#F5B700] hover:bg-[#e0a600] disabled:opacity-50 text-[#111111] rounded-xl font-bold text-xs flex items-center justify-center gap-2 active-press transition-all">
          ${isScanning ? `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>${t('hist_scanning')}</span>` : `<i data-lucide="scan" class="w-4 h-4"></i><span>${t('hist_start_scan')}</span>`}
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
  let pinFlow = 'unlock'; // 'unlock' | 'setup_initial' | 'setup_confirm' | 'change_old' | 'change_new' | 'change_confirm' | 'verify_biometric'
  let isPinBusy = false;
  let bioAttemptCounter = 0;
  let bioEnrollmentInFlight = false;
  let lastBioSupported = false;
  let activeBioAttempt = null; // { token, cancelled, lockedDuringWait }

  function setPinCancelDisabled(disabled) {
    if (!pinCancelBtn) return;
    pinCancelBtn.disabled = !!disabled;
    if (disabled) {
      pinCancelBtn.classList.add('opacity-40', 'pointer-events-none');
    } else {
      pinCancelBtn.classList.remove('opacity-40', 'pointer-events-none');
    }
  }

  function syncSettingsBiometricDom() {
    const bioToggleEl = document.getElementById('settings-biometric-toggle');
    const bioLabelEl = document.getElementById('settings-biometric-label');
    const bioStatusEl = document.getElementById('settings-biometric-status');
    const retryBtn = document.getElementById('settings-biometric-retry-btn');
    const actualEnabled = window.WalletSecurity ? window.WalletSecurity.isBiometricsEnabled() : false;
    const isQuarantined = (window.WalletSecurity && typeof window.WalletSecurity.isBiometricsQuarantined === 'function')
      ? window.WalletSecurity.isBiometricsQuarantined()
      : false;
    const canToggle = lastBioSupported && !bioEnrollmentInFlight && !isQuarantined;

    if (bioToggleEl) {
      bioToggleEl.checked = actualEnabled;
      bioToggleEl.disabled = !canToggle;
    }
    if (bioLabelEl) {
      bioLabelEl.classList.toggle('cursor-pointer', canToggle);
      bioLabelEl.classList.toggle('opacity-40', !canToggle);
      bioLabelEl.classList.toggle('cursor-not-allowed', !canToggle);
    }
    if (retryBtn) {
      retryBtn.classList.toggle('hidden', !isQuarantined);
    }
    if (bioStatusEl) {
      bioStatusEl.classList.toggle('text-[#E6A8A8]', isQuarantined);
      bioStatusEl.classList.toggle('font-semibold', isQuarantined);
      bioStatusEl.classList.toggle('text-[#C8CAD0]', !isQuarantined);
      if (isQuarantined) {
        bioStatusEl.textContent = t('bio_quarantine_msg');
      } else if (!lastBioSupported) {
        bioStatusEl.textContent = getLang() === 'ar' ? 'غير مدعوم في هذا المتصفح' : 'Not supported';
      } else {
        bioStatusEl.textContent = actualEnabled ? t('enabled') : t('not_enabled');
      }
    }
  }

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
      if (pinTitle) pinTitle.textContent = t('pin_setup_title');
      if (pinSubtitle) pinSubtitle.textContent = t('pin_setup_sub');
    } else if (pinFlow === 'change_old') {
      if (pinTitle) pinTitle.textContent = t('pin_change_old_title');
      if (pinSubtitle) pinSubtitle.textContent = t('pin_change_old_sub');
    } else if (pinFlow === 'verify_biometric') {
      if (pinTitle) pinTitle.textContent = t('pin_bio_verify_title');
      if (pinSubtitle) pinSubtitle.textContent = t('pin_bio_verify_sub');
    } else {
      if (pinTitle) pinTitle.textContent = t('pin_unlock_title');
      if (pinSubtitle) pinSubtitle.textContent = t('pin_unlock_sub');
    }

    // Toggle Cancel button for Change PIN & Verify Biometric flows
    setPinCancelDisabled(false);
    isPinBusy = false;
    if (pinCancelBtn) {
      if (pinFlow.startsWith('change_') || pinFlow === 'verify_biometric') {
        pinCancelBtn.classList.remove('hidden');
      } else {
        pinCancelBtn.classList.add('hidden');
      }
    }

    pinOverlay.classList.remove('opacity-0', 'pointer-events-none');
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();

    // Check biometric availability & status (fail-closed: hide biometric button when quarantined)
    if (window.WalletSecurity) {
      const isBioQuarantined = (typeof window.WalletSecurity.isBiometricsQuarantined === 'function')
        ? window.WalletSecurity.isBiometricsQuarantined()
        : false;
      const isBioEnabled = window.WalletSecurity.isBiometricsEnabled();
      if (pinBiometricBtn) {
        if (pinFlow === 'verify_biometric' || pinFlow.startsWith('change_') || isBioQuarantined) {
          pinBiometricBtn.classList.remove('bg-emerald-50', 'text-emerald-600', 'border', 'border-emerald-200');
          pinBiometricBtn.style.visibility = 'hidden';
        } else if (isBioEnabled) {
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
          if (pinTitle) pinTitle.textContent = t('pin_confirm_title');
          if (pinSubtitle) pinSubtitle.textContent = t('pin_confirm_sub');
          updatePinDots();
          isPinBusy = false;
          return;
        }

        if (pinFlow === 'setup_confirm') {
          if (currentInput === tempFirstPin) {
            flashPinDots('success');
            await window.WalletSecurity.setupPin(currentInput);
            showToast(t('pin_toast_created'), 'success');
            setTimeout(() => {
              if (pinFlow === 'setup_confirm' && !(window.WalletSecurity && window.WalletSecurity.isLocked)) {
                hidePinLock();
                isPinBusy = false;
                renderCurrentView();
              }
            }, 300);
          } else {
            triggerPinError(t('pin_err_mismatch'));
            pinFlow = 'setup_initial';
            if (pinTitle) pinTitle.textContent = t('pin_setup_title');
            if (pinSubtitle) pinSubtitle.textContent = t('pin_setup_sub');
          }
          return;
        }

        if (pinFlow === 'unlock') {
          const res = await window.WalletSecurity.unlock(currentInput);
          if (res.success) {
            flashPinDots('success');
            store.loadFromDecrypted(res.data);
            showToast(t('pin_toast_unlocked'), 'info');
            setTimeout(() => {
              if (pinFlow === 'unlock' && !(window.WalletSecurity && window.WalletSecurity.isLocked)) {
                hidePinLock();
                isPinBusy = false;
                renderCurrentView();
                if (localStorage.getItem('apexwallet_bio_migrated_notice') === 'true') {
                  localStorage.removeItem('apexwallet_bio_migrated_notice');
                  setTimeout(() => {
                    showToast('تم تحديث أمان البصمة إلى WebAuthn PRF. تم إيقاف البصمة السابقة، يرجى إعادة تفعيلها من الإعدادات.', 'info');
                  }, 500);
                }
              }
            }, 250);
          } else {
            triggerPinError(t('pin_err_wrong'));
          }
          return;
        }

        if (pinFlow === 'verify_biometric') {
          const isQuarantinedNow = typeof window.WalletSecurity.isBiometricsQuarantined === 'function' && window.WalletSecurity.isBiometricsQuarantined();
          if (bioEnrollmentInFlight || isQuarantinedNow) {
            if (pinFlow === 'verify_biometric' && !(window.WalletSecurity && window.WalletSecurity.isLocked)) {
              hidePinLock();
              isPinBusy = false;
            }
            syncSettingsBiometricDom();
            showToast(isQuarantinedNow ? t('toast_bio_cleanup_failed') : t('toast_bio_busy'), 'error');
            return;
          }

          // Verify PIN first so wrong PIN fails immediately without touching native Keystore/BiometricPrompt
          const pinOk = await window.WalletSecurity.verifyPinOnly(currentInput);
          if (pinFlow !== 'verify_biometric' || (window.WalletSecurity && window.WalletSecurity.isLocked)) {
            enteredPin = '';
            return;
          }
          if (!pinOk) {
            triggerPinError(t('toast_bio_wrong_pin'));
            return;
          }

          // Enter serialized native biometric wait state: disable keypad + Cancel + settings toggle while OS BiometricPrompt owns cancellation
          const token = ++bioAttemptCounter;
          const attempt = { token, cancelled: false, lockedDuringWait: false };
          activeBioAttempt = attempt;
          bioEnrollmentInFlight = true;
          enteredPin = '';
          setPinCancelDisabled(true);
          syncSettingsBiometricDom();
          if (pinSubtitle) pinSubtitle.textContent = t('pin_waiting_biometric');

          let res = null;
          let caughtErr = null;
          try {
            res = await window.WalletSecurity.enableBiometrics(currentInput);
          } catch (err) {
            caughtErr = err;
          }

          const isStillValid = (
            activeBioAttempt === attempt &&
            attempt.token === token &&
            !attempt.cancelled &&
            !attempt.lockedDuringWait &&
            pinFlow === 'verify_biometric' &&
            !(window.WalletSecurity && window.WalletSecurity.isLocked)
          );

          // If attempt became invalid (cancelled or wallet locked while waiting) AND enrollment succeeded,
          // serialize verified cleanup before releasing bioEnrollmentInFlight so no newer enrollment can overlap.
          if (!isStillValid) {
            if (!caughtErr && res && res.success === true) {
              try {
                await window.WalletSecurity.disableBiometrics();
              } catch (rbErr) {
                console.warn('Biometric rollback threw:', rbErr && rbErr.message ? rbErr.message : 'error');
              }
            }
            if (activeBioAttempt === attempt) activeBioAttempt = null;
            bioEnrollmentInFlight = false;
            setPinCancelDisabled(false);
            if (!(window.WalletSecurity && window.WalletSecurity.isLocked)) {
              syncSettingsBiometricDom();
            }
            return;
          }

          // Valid in-flight attempt completed while still on verify_biometric & unlocked
          activeBioAttempt = null;
          bioEnrollmentInFlight = false;
          setPinCancelDisabled(false);

          if (caughtErr) {
            isPinBusy = false;
            hidePinLock();
            syncSettingsBiometricDom();
            showToast(t('toast_bio_failed'), 'error');
            return;
          }

          if (res && res.success === true) {
            flashPinDots('success');
            syncSettingsBiometricDom();
            showToast(t('toast_bio_enabled'), 'success');
            setTimeout(() => {
              if (
                pinFlow === 'verify_biometric' &&
                !(window.WalletSecurity && window.WalletSecurity.isLocked) &&
                !attempt.lockedDuringWait &&
                !attempt.cancelled &&
                bioAttemptCounter === token
              ) {
                hidePinLock();
                isPinBusy = false;
                syncSettingsBiometricDom();
              }
            }, 250);
          } else {
            hidePinLock();
            isPinBusy = false;
            syncSettingsBiometricDom();
            const rawErr = (res && res.error) ? String(res.error) : '';
            if (res && res.cancelled === true) {
              showToast(t('toast_bio_cancelled'), 'info');
            } else if (/not supported|PRF/i.test(rawErr)) {
              showToast(rawErr.includes('WebAuthn PRF') ? rawErr : t('toast_bio_unsupported'), 'error');
            } else if (/cancel|إلغاء/i.test(rawErr)) {
              showToast(t('toast_bio_cancelled'), 'info');
            } else if (rawErr === 'Incorrect PIN') {
              showToast(t('toast_bio_wrong_pin'), 'error');
            } else {
              showToast(rawErr || t('toast_bio_failed'), 'error');
            }
          }
          return;
        }

        if (pinFlow === 'change_old') {
          const isValid = await window.WalletSecurity.verifyPinOnly(currentInput);
          if (isValid) {
            flashPinDots('success');
            tempOldPin = currentInput;
            setTimeout(() => {
              if (pinFlow === 'change_old' && !(window.WalletSecurity && window.WalletSecurity.isLocked)) {
                enteredPin = '';
                pinFlow = 'change_new';
                if (pinTitle) pinTitle.textContent = t('pin_change_new_title');
                if (pinSubtitle) pinSubtitle.textContent = t('pin_change_new_sub');
                updatePinDots();
                isPinBusy = false;
              }
            }, 250);
          } else {
            triggerPinError(t('pin_err_wrong_old'));
          }
          return;
        }

        if (pinFlow === 'change_new') {
          tempFirstPin = currentInput;
          flashPinDots('success');
          setTimeout(() => {
            if (pinFlow === 'change_new' && !(window.WalletSecurity && window.WalletSecurity.isLocked)) {
              enteredPin = '';
              pinFlow = 'change_confirm';
              if (pinTitle) pinTitle.textContent = t('pin_change_confirm_title');
              if (pinSubtitle) pinSubtitle.textContent = t('pin_change_confirm_sub');
              updatePinDots();
              isPinBusy = false;
            }
          }, 250);
          return;
        }

        if (pinFlow === 'change_confirm') {
          if (currentInput === tempFirstPin) {
            flashPinDots('success');
            const res = await window.WalletSecurity.changePin(tempOldPin, currentInput);
            if (res && res.success) {
              showToast(t('pin_toast_changed'), 'success');
              setTimeout(() => {
                if (pinFlow === 'change_confirm' && !(window.WalletSecurity && window.WalletSecurity.isLocked)) {
                  hidePinLock();
                  isPinBusy = false;
                  renderCurrentView();
                }
              }, 300);
            } else {
              triggerPinError((res && res.error) || 'Failed to update PIN');
            }
          } else {
            triggerPinError(t('pin_err_mismatch'));
            setTimeout(() => {
              if (pinFlow === 'change_confirm' && !(window.WalletSecurity && window.WalletSecurity.isLocked)) {
                pinFlow = 'change_new';
                if (pinTitle) pinTitle.textContent = t('pin_change_new_title');
                if (pinSubtitle) pinSubtitle.textContent = t('pin_change_new_sub');
              }
            }, 600);
          }
          return;
        }
      } catch (err) {
        console.error('PIN process error:', err);
        triggerPinError(t('pin_err_generic'));
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
    if (!window.WalletSecurity || pinFlow !== 'unlock' || !window.WalletSecurity.isLocked) return;
    if (typeof window.WalletSecurity.isBiometricsQuarantined === 'function' && window.WalletSecurity.isBiometricsQuarantined()) {
      return;
    }
    if (!window.WalletSecurity.isBiometricsEnabled()) {
      showToast(t('pin_toast_bio_enable_first'), 'info');
      return;
    }
    try {
      const res = await window.WalletSecurity.unlockWithBiometrics();
      if (res && res.success) {
        flashPinDots('success');
        store.loadFromDecrypted(res.data);
        showToast(t('pin_toast_bio_unlocked'), 'success');
        setTimeout(() => {
          if (pinFlow === 'unlock' && !(window.WalletSecurity && window.WalletSecurity.isLocked)) {
            hidePinLock();
            isPinBusy = false;
            renderCurrentView();
          }
        }, 250);
      } else if (res && (res.cancelled || res.error)) {
        if (res.cancelled === true || /cancel|إلغاء/i.test(res.error || '')) {
          showToast(t('pin_toast_bio_cancelled'), 'info');
        } else {
          triggerPinError(res.error);
        }
      }
    } catch (err) {
      console.warn('Biometric unlock caught:', err);
    }
  }

  if (pinCancelBtn) {
    pinCancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (pinCancelBtn.disabled) return;
      if (pinFlow === 'verify_biometric') {
        if (activeBioAttempt) {
          activeBioAttempt.cancelled = true;
        }
        syncSettingsBiometricDom();
        showToast(t('toast_bio_cancelled'), 'info');
      }
      isPinBusy = false;
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
        if (activeBioAttempt) {
          activeBioAttempt.lockedDuringWait = true;
        }
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

  // Check initial security lock state & run verified biometric cleanup if quarantined from prior failure
  if (window.WalletSecurity && typeof window.WalletSecurity.isBiometricsQuarantined === 'function' &&
      window.WalletSecurity.isBiometricsQuarantined() && !bioEnrollmentInFlight) {
    bioEnrollmentInFlight = true;
    Promise.resolve(window.WalletSecurity.retryBiometricCleanup()).finally(() => {
      bioEnrollmentInFlight = false;
      syncSettingsBiometricDom();
    });
  }
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
