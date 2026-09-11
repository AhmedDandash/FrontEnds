/**
 * Page Permissions Configuration
 *
 * Single source of truth for the application's manageable pages/modules and the
 * pure helpers used to decide whether a set of roles may access a given page.
 *
 * Background: the Sigma backend is the authorization source of truth and now
 * returns both roles and permissions from `GET /api/V1/Auth/me`. This matrix is
 * the frontend UX layer for menu/route visibility. It defaults to the backend
 * RBAC matrix and may be widened/narrowed by an admin's saved local override.
 */

/** localStorage key under which the PermissionMatrix is persisted. */
export const PERMISSIONS_STORAGE_KEY = 'pagePermissions';

/**
 * Roles that always have full access and can never be locked out of any page.
 * Matched case-insensitively.
 */
export const ADMIN_ROLES = ['Admin', 'Owner', 'SuperAdmin'] as const;

/** A single navigable page/module that access can be granted/revoked on. */
export interface PageDef {
  /** Route path — also the Sidebar menu key. Used as the matrix lookup key. */
  key: string;
  labelAr: string;
  labelEn: string;
  /** Stable group id (also a Sidebar group key where applicable). */
  group: string;
  groupAr: string;
  groupEn: string;
}

/**
 * Map of pageKey → list of role names allowed to access it.
 * Semantics (see `canAccessPage`):
 *  - key absent           → unknown/unregistered page → denied by default
 *  - key present, []       → restricted to admins/owners only
 *  - key present, [roles]  → admins/owners + any listed role
 */
export type PermissionMatrix = Record<string, string[]>;

/**
 * Catalogue of every manageable page, grouped by module. Mirrors the Sidebar
 * navigation so the permissions screen and the menu stay aligned.
 */
export const PAGE_REGISTRY: PageDef[] = [
  // ── Core ──
  { key: '/dashboard', labelAr: 'الرئيسية', labelEn: 'Dashboard', group: 'core', groupAr: 'عام', groupEn: 'General' },
  { key: '/notifications', labelAr: 'الإشعارات', labelEn: 'Notifications', group: 'core', groupAr: 'عام', groupEn: 'General' },
  { key: '/branch/management', labelAr: 'الفروع', labelEn: 'Branches', group: 'core', groupAr: 'عام', groupEn: 'General' },
  { key: '/customers', labelAr: 'العملاء', labelEn: 'Customers', group: 'core', groupAr: 'عام', groupEn: 'General' },
  { key: '/complaints', labelAr: 'الشكاوى', labelEn: 'Complaints', group: 'core', groupAr: 'عام', groupEn: 'General' },
  { key: '/sponsorship-transfer', labelAr: 'نقل الكفالة', labelEn: 'Sponsorship Transfer', group: 'core', groupAr: 'عام', groupEn: 'General' },

  // ── Workers ──
  { key: '/applicants', labelAr: 'جميع العمال', labelEn: 'All Workers', group: 'workers', groupAr: 'العمالة', groupEn: 'Workers' },
  { key: '/applicants/available', labelAr: 'العمال المتاحون', labelEn: 'Available Workers', group: 'workers', groupAr: 'العمالة', groupEn: 'Workers' },

  // ── Housing ──
  { key: '/housing/management', labelAr: 'إدارة السكنات', labelEn: 'Housing Management', group: 'housing', groupAr: 'السكن', groupEn: 'Housing' },
  { key: '/housing/applicants', labelAr: 'العمال بالسكن', labelEn: 'Housing Applicants', group: 'housing', groupAr: 'السكن', groupEn: 'Housing' },

  // ── Hourly Workers ──
  { key: '/hourly-workers', labelAr: 'قائمة العمال', labelEn: 'Workers Pool', group: 'hourly', groupAr: 'العمالة بالساعة', groupEn: 'Hourly Workers' },
  { key: '/hourly-workers/requests', labelAr: 'طلبات العمل', labelEn: 'Service Requests', group: 'hourly', groupAr: 'العمالة بالساعة', groupEn: 'Hourly Workers' },
  { key: '/hourly-workers/drivers', labelAr: 'السائقون', labelEn: 'Drivers', group: 'hourly', groupAr: 'العمالة بالساعة', groupEn: 'Hourly Workers' },
  { key: '/hourly-workers/packages', labelAr: 'باقات الخدمة', labelEn: 'Service Packages', group: 'hourly', groupAr: 'العمالة بالساعة', groupEn: 'Hourly Workers' },
  { key: '/hourly-workers/serving-areas', labelAr: 'مناطق الخدمة', labelEn: 'Serving Areas', group: 'hourly', groupAr: 'العمالة بالساعة', groupEn: 'Hourly Workers' },
  { key: '/hourly-workers/payments', labelAr: 'المدفوعات', labelEn: 'Payments', group: 'hourly', groupAr: 'العمالة بالساعة', groupEn: 'Hourly Workers' },
  { key: '/hourly-workers/notifications', labelAr: 'الإشعارات', labelEn: 'Notifications', group: 'hourly', groupAr: 'العمالة بالساعة', groupEn: 'Hourly Workers' },
  { key: '/hourly-workers/reports', labelAr: 'التقارير', labelEn: 'Reports', group: 'hourly', groupAr: 'العمالة بالساعة', groupEn: 'Hourly Workers' },

  // ── Contracts ──
  { key: '/contracts/mediationcontract', labelAr: 'عقود الاستقدام', labelEn: 'Mediation Contracts', group: 'contracts', groupAr: 'العقود', groupEn: 'Contracts' },
  { key: '/contracts/mediationcontract/automaticfollowup', labelAr: 'متابعة العقود', labelEn: 'Contract Follow-Up', group: 'contracts', groupAr: 'العقود', groupEn: 'Contracts' },
  { key: '/contracts/mediationcontract/offers', labelAr: 'عروض عقود الاستقدام', labelEn: 'Mediation Offers', group: 'contracts', groupAr: 'العقود', groupEn: 'Contracts' },
  { key: '/contracts/mediationrequests', labelAr: 'طلب عقد توسط', labelEn: 'Mediation Requests', group: 'contracts', groupAr: 'العقود', groupEn: 'Contracts' },
  { key: '/contracts/operation/rent', labelAr: 'عقود العاملات المقيمة', labelEn: 'Operation Contracts', group: 'contracts', groupAr: 'العقود', groupEn: 'Contracts' },
  { key: '/contracts/operation/collection-renewal', labelAr: 'التحصيل والتجديد', labelEn: 'Collection & Renewal', group: 'contracts', groupAr: 'العقود', groupEn: 'Contracts' },
  { key: '/contracts/operation/rent-prices-offers', labelAr: 'أسعار وعروض التشغيل', labelEn: 'Rent Prices & Offers', group: 'contracts', groupAr: 'العقود', groupEn: 'Contracts' },

  // ── Agents ──
  { key: '/agents', labelAr: 'جميع الوكلاء', labelEn: 'All Agents', group: 'agents', groupAr: 'الوكلاء', groupEn: 'Agents' },

  // ── Human Resources ──
  { key: '/hr/employees', labelAr: 'الموظفون', labelEn: 'Employees', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/positions', labelAr: 'المسميات الوظيفية', labelEn: 'Positions', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/departments', labelAr: 'الأقسام', labelEn: 'Departments', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/attendance', labelAr: 'الحضور والانصراف', labelEn: 'Attendance', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/shifts', labelAr: 'الورديات', labelEn: 'Shifts', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/reports', labelAr: 'تقارير الموارد البشرية', labelEn: 'HR Reports', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/leave', labelAr: 'طلبات الإجازات', labelEn: 'Leave Requests', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/leave-types', labelAr: 'أنواع الإجازات', labelEn: 'Leave Types', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/payroll', labelAr: 'الرواتب', labelEn: 'Payroll', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/admin-users', labelAr: 'أدوار المستخدمين', labelEn: 'User Roles', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/permission-request', labelAr: 'طلب استئذان', labelEn: 'Permission Request', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/permission-requests', labelAr: 'سجل طلبات الاستئذان', labelEn: 'Permission History', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/resignation-request', labelAr: 'طلب استقالة', labelEn: 'Resignation Request', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/resignation-requests', labelAr: 'سجل طلبات الاستقالة', labelEn: 'Resignation History', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/custody-request', labelAr: 'طلب عهدة', labelEn: 'Custody Request', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },
  { key: '/hr/custody-requests', labelAr: 'سجل طلبات العهد', labelEn: 'Custody History', group: 'hr', groupAr: 'الموارد البشرية', groupEn: 'Human Resources' },

  // ── Accounting ──
  { key: '/accounting/journal-entries', labelAr: 'قيود اليومية', labelEn: 'Journal Entries', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/chart-of-accounts', labelAr: 'شجرة الحسابات', labelEn: 'Chart of Accounts', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/account-settings', labelAr: 'إعدادات الحسابات', labelEn: 'Account Settings', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/restriction-types', labelAr: 'أنواع القيود', labelEn: 'Restriction Types', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/general-vouchers', labelAr: 'السندات العامة', labelEn: 'General Vouchers', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/receipt-vouchers', labelAr: 'سندات القبض', labelEn: 'Receipt Vouchers', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/payment-vouchers', labelAr: 'سندات الصرف', labelEn: 'Payment Vouchers', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/credit-notes', labelAr: 'إشعارات الدائن', labelEn: 'Credit Notes', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/debit-notes', labelAr: 'إشعارات المدين', labelEn: 'Debit Notes', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/period-closing', labelAr: 'إغلاق الفترة المحاسبية', labelEn: 'Period Closing', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/ledger/general-ledger', labelAr: 'دفتر الأستاذ العام', labelEn: 'General Ledger', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/ledger/agent-ledger', labelAr: 'كشف حساب الوكيل', labelEn: 'Agent Ledger', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/ledger/customer-ledger', labelAr: 'كشف حساب العميل', labelEn: 'Customer Ledger', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/ledger/worker-ledger', labelAr: 'كشف حساب العامل', labelEn: 'Worker Ledger', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/ledger/trial-balance', labelAr: 'ميزان المراجعة', labelEn: 'Trial Balance', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/ledger/income-statement', labelAr: 'قائمة الدخل', labelEn: 'Income Statement', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/ledger/balance-sheet', labelAr: 'الميزانية العمومية', labelEn: 'Balance Sheet', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },
  { key: '/accounting/ledger/vat-report', labelAr: 'تقرير ضريبة القيمة المضافة', labelEn: 'VAT Report', group: 'accounting', groupAr: 'المحاسبة', groupEn: 'Accounting' },

  // ── Settings ──
  { key: '/settings/mediation', labelAr: 'إعدادات عقود الاستقدام', labelEn: 'Mediation Settings', group: 'settings', groupAr: 'الإعدادات', groupEn: 'Settings' },
  { key: '/settings/marketer', labelAr: 'المسوقون', labelEn: 'Marketers', group: 'settings', groupAr: 'الإعدادات', groupEn: 'Settings' },
  { key: '/settings/custody-types', labelAr: 'أنواع العهد', labelEn: 'Custody Types', group: 'settings', groupAr: 'الإعدادات', groupEn: 'Settings' },
  { key: '/settings/nationalities', labelAr: 'الجنسيات', labelEn: 'Nationalities', group: 'settings', groupAr: 'الإعدادات', groupEn: 'Settings' },
  { key: '/register', labelAr: 'إضافة مسؤول', labelEn: 'Add Admin', group: 'settings', groupAr: 'الإعدادات', groupEn: 'Settings' },
  { key: '/settings/permissions', labelAr: 'صلاحيات الصفحات', labelEn: 'Page Permissions', group: 'settings', groupAr: 'الإعدادات', groupEn: 'Settings' },

  // ── ZATCA ──
  { key: '/zatca', labelAr: 'لوحة زاتكا', labelEn: 'ZATCA Dashboard', group: 'zatca', groupAr: 'زاتكا', groupEn: 'ZATCA' },
  { key: '/zatca/invoices', labelAr: 'الفواتير', labelEn: 'Invoices', group: 'zatca', groupAr: 'زاتكا', groupEn: 'ZATCA' },
  { key: '/zatca/branch-setup', labelAr: 'إعداد الفرع', labelEn: 'Branch Setup', group: 'zatca', groupAr: 'زاتكا', groupEn: 'ZATCA' },
  { key: '/zatca/csr', labelAr: 'طلبات CSR', labelEn: 'CSR Requests', group: 'zatca', groupAr: 'زاتكا', groupEn: 'ZATCA' },
  { key: '/zatca/certificates', labelAr: 'الشهادات', labelEn: 'Certificates', group: 'zatca', groupAr: 'زاتكا', groupEn: 'ZATCA' },
  { key: '/zatca/settings', labelAr: 'الإعدادات', labelEn: 'Settings', group: 'zatca', groupAr: 'زاتكا', groupEn: 'ZATCA' },
  { key: '/zatca/connection', labelAr: 'الاتصال والتشخيص', labelEn: 'Connection & Diagnostics', group: 'zatca', groupAr: 'زاتكا', groupEn: 'ZATCA' },
  { key: '/zatca/logs', labelAr: 'السجلات', labelEn: 'Logs', group: 'zatca', groupAr: 'زاتكا', groupEn: 'ZATCA' },
];

/** True if any of `roles` is an always-allowed admin role (case-insensitive). */
export function isAdminRole(roles: string[]): boolean {
  const lower = roles.map((r) => r.toLowerCase());
  return ADMIN_ROLES.some((a) => lower.includes(a.toLowerCase()));
}

/**
 * Kept for backward-compatible imports. The real default matrix now lives in
 * `defaultRolePageMatrix.ts` and is merged by `PermissionService`.
 */
export const DEFAULT_RESTRICTED_PAGES: PermissionMatrix = {
  '/register': [],
};

/**
 * True if `pageKey` has an explicit matrix entry OR a secure-by-default
 * restriction. Callers must gate on this BEFORE treating a missing matrix
 * entry as "unconfigured → open" — `canAccessPage`'s own fallback to
 * `DEFAULT_RESTRICTED_PAGES` is unreachable if the caller already short-
 * circuited to 'allow' on `matrix[pageKey] === undefined`.
 */
export function isPageConfigured(pageKey: string, matrix: PermissionMatrix): boolean {
  return matrix[pageKey] !== undefined || DEFAULT_RESTRICTED_PAGES[pageKey] !== undefined;
}

/**
 * Resolve a pathname to the most specific registered page key (longest prefix
 * match), so sub-routes like `/hr/employees/123` map to `/hr/employees`.
 * Returns null when the path maps to no registered page.
 */
export function resolvePageKey(pathname: string): string | null {
  let best: string | null = null;
  for (const page of PAGE_REGISTRY) {
    if (pathname === page.key || pathname.startsWith(`${page.key}/`)) {
      if (!best || page.key.length > best.length) best = page.key;
    }
  }
  return best;
}

/**
 * Pure access decision for a single page key.
 *  - admins/owners always pass
 *  - known pages must have an entry in the merged default/admin matrix
 *  - unknown routes are allowed so technical pages that are not registered do
 *    not get caught by the module-level RBAC layer
 *  - otherwise the user must hold at least one of the page's allowed roles
 */
export function canAccessPage(
  pageKey: string | null,
  roles: string[],
  matrix: PermissionMatrix
): boolean {
  if (!pageKey) return true;
  if (isAdminRole(roles)) return true;
  const allowed = matrix[pageKey] ?? DEFAULT_RESTRICTED_PAGES[pageKey];
  if (allowed === undefined) return false;
  return roles.some((r) => allowed.includes(r));
}
