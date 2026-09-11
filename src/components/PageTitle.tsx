'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

/**
 * Updates the browser tab title (`document.title`) based on the current route,
 * so the tab reflects the page you're on instead of a single static site name.
 *
 * Titles are matched by longest route-prefix, so detail/nested routes (e.g.
 * `/hourly-workers/requests/123`) inherit their section's title.
 */

type Title = { ar: string; en: string };

const SITE = { ar: 'سيجما للاستقدام', en: 'Sigma' };

// Ordered from most specific to least — longest matching prefix wins.
const ROUTE_TITLES: Array<[string, Title]> = [
  // Auth / misc
  ['/login', { ar: 'تسجيل الدخول', en: 'Login' }],
  ['/register', { ar: 'إضافة مسؤول', en: 'Add Admin' }],
  ['/change-password', { ar: 'تغيير كلمة المرور', en: 'Change Password' }],
  ['/dashboard', { ar: 'الرئيسية', en: 'Dashboard' }],
  ['/notifications', { ar: 'الإشعارات', en: 'Notifications' }],

  // Branches
  ['/branch/management', { ar: 'إدارة الفروع', en: 'Branches' }],

  // Workers
  ['/applicants/available', { ar: 'العمال المتاحون', en: 'Available Workers' }],
  ['/applicants/followup', { ar: 'متابعة العمال', en: 'Workers Follow-up' }],
  ['/applicants', { ar: 'جميع العمال', en: 'All Workers' }],

  // Housing
  ['/housing/management', { ar: 'إدارة السكنات', en: 'Housing Management' }],
  ['/housing/applicants', { ar: 'العمال بالسكن', en: 'Housing Applicants' }],

  // Hourly workers
  ['/hourly-workers/track', { ar: 'تتبع طلب العمل بالساعة', en: 'Track Hourly Request' }],
  ['/hourly-workers/requests', { ar: 'طلبات العمل بالساعة', en: 'Service Requests' }],
  ['/hourly-workers/drivers', { ar: 'السائقون', en: 'Drivers' }],
  ['/hourly-workers/packages', { ar: 'باقات الخدمة', en: 'Service Packages' }],
  ['/hourly-workers/serving-areas', { ar: 'مناطق الخدمة', en: 'Serving Areas' }],
  ['/hourly-workers/payments', { ar: 'مدفوعات العمل بالساعة', en: 'Hourly Payments' }],
  ['/hourly-workers/notifications', { ar: 'الإشعارات', en: 'Notifications' }],
  ['/hourly-workers/reports', { ar: 'تقارير العمل بالساعة', en: 'Hourly Reports' }],
  ['/hourly-workers', { ar: 'قائمة العمال بالساعة', en: 'Hourly Workers Pool' }],

  // Customers / Agents / Transfer / Complaints
  ['/customers', { ar: 'العملاء', en: 'Customers' }],
  ['/agents', { ar: 'الوكلاء', en: 'Agents' }],
  ['/sponsorship-transfer', { ar: 'نقل الكفالة', en: 'Sponsorship Transfer' }],
  ['/complaints', { ar: 'الشكاوى', en: 'Complaints' }],

  // Contracts — mediation
  ['/contracts/mediationcontract/automaticfollowup', { ar: 'متابعة العقود', en: 'Contract Follow-Up' }],
  ['/contracts/mediationcontract/offers', { ar: 'عروض عقود الاستقدام', en: 'Mediation Offers' }],
  ['/contracts/mediationcontract/add', { ar: 'إضافة عقد استقدام', en: 'New Mediation Contract' }],
  ['/contracts/mediationcontract', { ar: 'عقود الاستقدام', en: 'Mediation Contracts' }],
  ['/contracts/mediationrequests', { ar: 'طلبات عقود التوسط', en: 'Mediation Requests' }],

  // Contracts — operation
  ['/contracts/operation/collection-renewal', { ar: 'التحصيل والتجديد', en: 'Collection & Renewal' }],
  ['/contracts/operation/rent-prices-offers', { ar: 'أسعار وعروض التشغيل', en: 'Rent Prices & Offers' }],
  ['/contracts/operation/rent', { ar: 'عقود العاملات المقيمة', en: 'Operation Contracts' }],

  // HR
  ['/hr/employees', { ar: 'الموظفون', en: 'Employees' }],
  ['/hr/positions', { ar: 'المسميات الوظيفية', en: 'Positions' }],
  ['/hr/departments', { ar: 'الأقسام', en: 'Departments' }],
  ['/hr/attendance', { ar: 'الحضور والانصراف', en: 'Attendance' }],
  ['/hr/shifts', { ar: 'الورديات', en: 'Shifts' }],
  ['/hr/reports', { ar: 'تقارير الموارد البشرية', en: 'HR Reports' }],
  ['/hr/leave-types', { ar: 'أنواع الإجازات', en: 'Leave Types' }],
  ['/hr/leave', { ar: 'طلبات الإجازات', en: 'Leave Requests' }],
  ['/hr/payroll', { ar: 'الرواتب', en: 'Payroll' }],
  ['/hr/admin-users', { ar: 'أدوار المستخدمين', en: 'User Roles' }],
  ['/hr/permission-requests', { ar: 'سجل طلبات الاستئذان', en: 'Permission History' }],
  ['/hr/permission-request', { ar: 'طلب استئذان', en: 'Permission Request' }],
  ['/hr/resignation-requests', { ar: 'سجل طلبات الاستقالة', en: 'Resignation History' }],
  ['/hr/resignation-request', { ar: 'طلب استقالة', en: 'Resignation Request' }],
  ['/hr/custody-requests', { ar: 'سجل طلبات العهد', en: 'Custody History' }],
  ['/hr/custody-request', { ar: 'طلب عهدة', en: 'Custody Request' }],

  // Accounting — ledger (before generic /accounting)
  ['/accounting/ledger/general-ledger', { ar: 'دفتر الأستاذ العام', en: 'General Ledger' }],
  ['/accounting/ledger/agent-ledger', { ar: 'كشف حساب الوكيل', en: 'Agent Ledger' }],
  ['/accounting/ledger/customer-ledger', { ar: 'كشف حساب العميل', en: 'Customer Ledger' }],
  ['/accounting/ledger/worker-ledger', { ar: 'كشف حساب العامل', en: 'Worker Ledger' }],
  ['/accounting/ledger/trial-balance', { ar: 'ميزان المراجعة', en: 'Trial Balance' }],
  ['/accounting/ledger/income-statement', { ar: 'قائمة الدخل', en: 'Income Statement' }],
  ['/accounting/ledger/balance-sheet', { ar: 'الميزانية العمومية', en: 'Balance Sheet' }],
  ['/accounting/ledger/vat-report', { ar: 'تقرير ضريبة القيمة المضافة', en: 'VAT Report' }],

  // Accounting — documents & settings
  ['/accounting/journal-entries', { ar: 'قيود اليومية', en: 'Journal Entries' }],
  ['/accounting/chart-of-accounts', { ar: 'شجرة الحسابات', en: 'Chart of Accounts' }],
  ['/accounting/account-settings', { ar: 'إعدادات الحسابات', en: 'Account Settings' }],
  ['/accounting/restriction-types', { ar: 'أنواع القيود', en: 'Restriction Types' }],
  ['/accounting/receipt-vouchers', { ar: 'سندات القبض', en: 'Receipt Vouchers' }],
  ['/accounting/payment-vouchers', { ar: 'سندات الصرف', en: 'Payment Vouchers' }],
  ['/accounting/credit-notes', { ar: 'إشعارات الدائن', en: 'Credit Notes' }],
  ['/accounting/debit-notes', { ar: 'إشعارات المدين', en: 'Debit Notes' }],
  ['/accounting/period-closing', { ar: 'إغلاق الفترة المحاسبية', en: 'Period Closing' }],

  // Settings
  ['/settings/mediation', { ar: 'إعدادات عقود الاستقدام', en: 'Mediation Settings' }],
  ['/settings/marketer', { ar: 'المسوقون', en: 'Marketers' }],
  ['/settings/custody-types', { ar: 'أنواع العهد', en: 'Custody Types' }],
  ['/settings/nationalities', { ar: 'الجنسيات', en: 'Nationalities' }],
  ['/settings/permissions', { ar: 'صلاحيات الصفحات', en: 'Page Permissions' }],
];

function resolveTitle(pathname: string): Title | null {
  if (pathname === '/') return { ar: 'الرئيسية', en: 'Dashboard' };
  let best: Title | null = null;
  let bestLen = -1;
  for (const [prefix, title] of ROUTE_TITLES) {
    if ((pathname === prefix || pathname.startsWith(prefix + '/')) && prefix.length > bestLen) {
      best = title;
      bestLen = prefix.length;
    }
  }
  return best;
}

export function PageTitle() {
  const pathname = usePathname();
  const language = useAuthStore((s) => s.language);

  useEffect(() => {
    const lang = language === 'en' ? 'en' : 'ar';
    const match = resolveTitle(pathname || '/');
    const site = SITE[lang];
    document.title = match ? `${match[lang]} | ${site}` : `${site} | Sigma Recruitment Company`;
  }, [pathname, language]);

  return null;
}
