'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, Badge } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  WarningOutlined,
  SettingOutlined,
  ShopOutlined,
  HomeOutlined,
  IdcardOutlined,
  BankOutlined,
  FieldTimeOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCanAccess } from '@/hooks/api/usePagePermissions';
import Image from 'next/image';
import styles from './Sidebar.module.css';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  mobileDrawerVisible: boolean;
  onMobileDrawerClose: () => void;
}

type MenuItem = Required<MenuProps>['items'][number];

export default function Sidebar({
  collapsed,
  mobileDrawerVisible,
  onMobileDrawerClose,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const language = useAuthStore((state) => state.language);
  const { check } = useCanAccess();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    // Set selected and open keys based on current path
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      setSelectedKeys([pathname]);
      if (pathParts.length > 1) {
        const keys = [pathParts[0]];
        // Open nested groups.
        if (pathParts[0] === 'accounting' && pathParts[1] === 'ledger') {
          keys.push('ledger-reports');
        }
        if (
          pathParts[0] === 'accounting' &&
          ['general-vouchers', 'receipt-vouchers', 'payment-vouchers', 'credit-notes', 'debit-notes'].includes(
            pathParts[1]
          )
        ) {
          keys.push('accounting-documents');
        }
        if (pathParts[0] === 'contracts') {
          if (pathParts[1] === 'operation') {
            keys.push('contracts-operation');
          } else {
            keys.push('contracts-mediation');
          }
        }
        if (pathParts[0] === 'hourly-workers') {
          keys.push('hourly-workers');
        }
        if (pathParts[0] === 'zatca') {
          keys.push('zatca');
        }
        setOpenKeys(keys);
      }
    }
  }, [pathname]);

  const menuItems: MenuItem[] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: language === 'ar' ? 'الرئيسية' : 'Dashboard',
    },
    {
      key: '/branch/management',
      icon: <ShopOutlined />,
      label: language === 'ar' ? 'الفروع' : 'Branches',
    },
    // {
    //   key: 'statistics',
    //   icon: <BarChartOutlined />,
    //   label: language === 'ar' ? 'الإحصائيات' : 'Statistics',
    //   children: [
    //     {
    //       key: '/statistics/agent-productivity',
    //       label: language === 'ar' ? 'إنتاجية الوكلاء' : 'Agent Productivity',
    //     },
    //     {
    //       key: '/statistics/office-productivity',
    //       label: language === 'ar' ? 'إنتاجية المكتب' : 'Office Productivity',
    //     },
    //     {
    //       key: '/statistics/followup',
    //       label: language === 'ar' ? 'إحصائيات المتابعة' : 'Follow-up Stats',
    //     },
    //     {
    //       key: '/statistics/applicants',
    //       label: language === 'ar' ? 'إحصائيات المتقدمين' : 'Applicant Stats',
    //     },
    //     {
    //       key: '/statistics/visas',
    //       label: language === 'ar' ? 'إحصائيات التأشيرات' : 'Visa Stats',
    //     },
    //   ],
    // },
    {
      key: 'Workers',
      icon: <TeamOutlined />,
      label: language === 'ar' ? 'العمالة' : 'Workers',
      children: [
        {
          key: '/applicants',
          label: language === 'ar' ? 'جميع العمال' : 'All Workers',
        },
        {
          key: '/applicants/available',
          label: language === 'ar' ? 'العمال المتاحون' : 'Available Workers',
        },
      ],
    },
    {
      key: 'housing',
      icon: <HomeOutlined />,
      label: language === 'ar' ? 'السكن' : 'Housing',
      children: [
        {
          key: '/housing/management',
          label: language === 'ar' ? 'إدارة السكنات' : 'Housing Management',
        },
        {
          key: '/housing/applicants',
          label: language === 'ar' ? 'العمال بالسكن' : 'Housing Applicants',
        },
      ],
    },
    {
      key: 'hourly-workers',
      icon: <FieldTimeOutlined />,
      label: language === 'ar' ? 'العمالة بالساعة' : 'Hourly Workers',
      children: [
        {
          key: '/hourly-workers/requests',
          label: language === 'ar' ? 'طلبات العمل' : 'Service Requests',
        },
        {
          key: '/hourly-workers',
          label: language === 'ar' ? 'قائمة العمال' : 'Workers Pool',
        },
        {
          key: '/hourly-workers/drivers',
          label: language === 'ar' ? 'السائقون' : 'Drivers',
        },
        {
          key: '/hourly-workers/packages',
          label: language === 'ar' ? 'باقات الخدمة' : 'Service Packages',
        },
        {
          key: '/hourly-workers/serving-areas',
          label: language === 'ar' ? 'مناطق الخدمة' : 'Serving Areas',
        },
        {
          key: '/hourly-workers/payments',
          label: language === 'ar' ? 'المدفوعات' : 'Payments',
        },
        {
          key: '/hourly-workers/notifications',
          label: language === 'ar' ? 'الإشعارات' : 'Notifications',
        },
        {
          key: '/hourly-workers/reports',
          label: language === 'ar' ? 'التقارير' : 'Reports',
        },
      ],
    },
    {
      key: '/customers',
      icon: <ShopOutlined />,
      label: language === 'ar' ? 'العملاء' : 'Customers',
    },
    {
      key: 'contracts',
      icon: <FileTextOutlined />,
      label: language === 'ar' ? 'العقود' : 'Contracts',
      children: [
        /* ───── Mediation contracts ───── */
        {
          key: 'contracts-mediation',
          label: language === 'ar' ? 'عقود الاستقدام ' : 'Mediation',
          children: [
            {
              key: '/contracts/mediationcontract',
              label: language === 'ar' ? 'عقود الاستقدام ' : 'Mediation Contracts',
            },
            {
              key: '/contracts/mediationcontract/automaticfollowup',
              label: language === 'ar' ? 'متابعة العقود' : 'Contract Follow-Up',
            },
            {
              key: '/contracts/mediationcontract/offers',
              label: language === 'ar' ? 'عروض عقود الاستقدام ' : 'Mediation Offers',
            },
            {
              key: '/contracts/mediationrequests',
              label: language === 'ar' ? 'طلب عقد توسط' : 'Mediation Requests',
            },
          ],
        },
        /* ───── Operation contracts ───── */
        {
          key: 'contracts-operation',
          label: language === 'ar' ? 'عقود العاملات المقيمة' : 'Operation Contracts',
          children: [
            {
              key: '/contracts/operation/rent',
              label: language === 'ar' ? 'عقود العاملات المقيمة' : 'Operation Contracts',
            },
            {
              key: '/contracts/operation/collection-renewal',
              label: language === 'ar' ? 'التحصيل والتجديد' : 'Collection & Renewal Operations',
            },
            {
              key: '/contracts/operation/rent-prices-offers',
              label: language === 'ar' ? 'أسعار وعروض التشغيل' : 'Rent Prices & Offers',
            },
          ],
        },
      ],
    },
    // {
    //   key: 'recruitment',
    //   icon: <UserAddOutlined />,
    //   label: language === 'ar' ? 'طلبات الاستقدام' : 'Recruitment',
    //   children: [
    //     {
    //       key: '/recruitment/requests',
    //       label: language === 'ar' ? 'طلبات الاستقدام' : 'Recruitment',
    //     },
    //     {
    //       key: '/recruitment/applicants',
    //       label: language === 'ar' ? 'المتقدمون المتاحون' : 'Available Applicants',
    //     },
    //     {
    //       key: '/recruitment/visas',
    //       label: language === 'ar' ? 'إدارة التأشيرات' : 'Visa Management',
    //     },
    //   ],
    // },
    // {
    //   key: 'followup',
    //   icon: <CalendarOutlined />,
    //   label: language === 'ar' ? 'المتابعة' : 'Follow-up',
    //   children: [
    //     { key: '/followup/none', label: language === 'ar' ? 'بدون متابعة' : 'No Follow-up' },
    //     { key: '/followup/warranty', label: language === 'ar' ? 'الضمان' : 'Warranty' },
    //   ],
    // },
    // {
    //   key: 'reports',
    //   icon: <FileSearchOutlined />,
    //   label: language === 'ar' ? 'التقارير' : 'Reports',
    //   children: [
    //     { key: '/reports/arrival', label: language === 'ar' ? 'تقرير الوصول' : 'Arrival Report' },
    //     {
    //       key: '/reports/alternatives',
    //       label: language === 'ar' ? 'تقرير البدائل' : 'Alternatives Report',
    //     },
    //     {
    //       key: '/reports/employees-productivity',
    //       label: language === 'ar' ? 'إنتاجية الموظفين' : 'Employee Productivity',
    //     },
    //   ],
    // },
    // {
    //   key: 'offers',
    //   icon: <GiftOutlined />,
    //   label: language === 'ar' ? 'العروض' : 'Offers',
    //   children: [
    //     {
    //       key: '/offers/mediation',
    //       label: language === 'ar' ? 'عروض واسعار التوسط الوساطة' : 'Mediation Offers',
    //     },
    //     { key: '/offers/rent', label: language === 'ar' ? 'عروض الإيجار' : 'Rent Offers' },
    //     {
    //       key: '/offers/rent-prices',
    //       label: language === 'ar' ? 'عروض أسعار الإيجار' : 'Rent Price Offers',
    //     },
    //   ],
    // },
    // {
    //   key: 'communication',
    //   icon: <MessageOutlined />,
    //   label: language === 'ar' ? 'التواصل' : 'Communication',
    //   children: [
    //     { key: '/communication/sms', label: language === 'ar' ? 'رسائل العملاء' : 'Customer SMS' },
    //     {
    //       key: '/communication/email',
    //       label: language === 'ar' ? 'إرسال بريد إلكتروني' : 'Send Email',
    //     },
    //     {
    //       key: '/communication/templates-sms',
    //       label: language === 'ar' ? 'إعدادات قوالب الرسائل' : 'SMS Templates Settings',
    //     },
    //     {
    //       key: '/communication/tracking-sms',
    //       label: language === 'ar' ? 'إعدادات قوالب الرسائل' : 'SMS Templates Settings',
    //     },
    //   ],
    // },
    {
      key: '/sponsorship-transfer',
      icon: <ShopOutlined />,
      label: language === 'ar' ? 'نقل الكفالة' : 'Sponsorship Transfer',
    },
    {
      key: 'agents',
      icon: <UserOutlined />,
      label: language === 'ar' ? 'الوكلاء' : 'Agents',
      children: [
        { key: '/agents', label: language === 'ar' ? 'جميع الوكلاء' : 'All Agents' },
        // { key: '/agents/assignment', label: language === 'ar' ? 'تعيين الوكلاء' : 'Assignment' },
      ],
    },
    {
      key: 'hr',
      icon: <IdcardOutlined />,
      label: language === 'ar' ? 'الموارد البشرية' : 'Human Resources',
      children: [
        {
          key: '/hr/employees',
          label: language === 'ar' ? 'الموظفون' : 'Employees',
        },
        {
          key: '/hr/positions',
          label: language === 'ar' ? 'المسميات الوظيفية' : 'Positions',
        },
        {
          key: '/hr/departments',
          label: language === 'ar' ? 'الأقسام' : 'Departments',
        },
        {
          key: '/hr/attendance',
          label: language === 'ar' ? 'الحضور والانصراف' : 'Attendance',
        },
        {
          key: '/hr/shifts',
          label: language === 'ar' ? 'الورديات' : 'Shifts',
        },
        {
          key: '/hr/reports',
          label: language === 'ar' ? 'تقارير الموارد البشرية' : 'HR Reports',
        },
        {
          key: '/hr/leave',
          label: language === 'ar' ? 'طلبات الإجازات' : 'Leave Requests',
        },
        {
          key: '/hr/leave-types',
          label: language === 'ar' ? 'أنواع الإجازات' : 'Leave Types',
        },
        {
          key: '/hr/payroll',
          label: language === 'ar' ? 'الرواتب' : 'Payroll',
        },
        {
          key: '/hr/admin-users',
          label: language === 'ar' ? 'أدوار المستخدمين' : 'User Roles',
        },
        {
          key: '/hr/permission-request',
          label: language === 'ar' ? 'طلب استئذان' : 'Permission Request',
        },
        {
          key: '/hr/permission-requests',
          label: language === 'ar' ? 'سجل طلبات الاستئذان' : 'Permission History',
        },
        {
          key: '/hr/resignation-request',
          label: language === 'ar' ? 'طلب استقالة' : 'Resignation Request',
        },
        {
          key: '/hr/resignation-requests',
          label: language === 'ar' ? 'سجل طلبات الاستقالة' : 'Resignation History',
        },
        {
          key: '/hr/custody-request',
          label: language === 'ar' ? 'طلب عهدة' : 'Custody Request',
        },
        {
          key: '/hr/custody-requests',
          label: language === 'ar' ? 'سجل طلبات العهد' : 'Custody History',
        },
      ],
    },
    {
      key: 'accounting',
      icon: <BankOutlined />,
      label: language === 'ar' ? 'المحاسبة' : 'Accounting',
      children: [
        {
          key: '/accounting/journal-entries',
          label: language === 'ar' ? 'قيود اليومية' : 'Journal Entries',
        },
        {
          key: '/accounting/chart-of-accounts',
          label: language === 'ar' ? 'شجرة الحسابات' : 'Chart of Accounts',
        },
        {
          key: '/accounting/account-settings',
          label: language === 'ar' ? 'إعدادات الحسابات' : 'Account Settings',
        },
        {
          key: '/accounting/restriction-types',
          label: language === 'ar' ? 'أنواع القيود' : 'Restriction Types',
        },
        {
          key: 'accounting-documents',
          label: language === 'ar' ? 'المستندات المحاسبية' : 'Accounting Documents',
          children: [
            {
              key: '/accounting/general-vouchers',
              label: language === 'ar' ? 'السندات العامة' : 'General Vouchers',
            },
            {
              key: '/accounting/receipt-vouchers',
              label: language === 'ar' ? 'سندات القبض' : 'Receipt Vouchers',
            },
            {
              key: '/accounting/payment-vouchers',
              label: language === 'ar' ? 'سندات الصرف' : 'Payment Vouchers',
            },
            {
              key: '/accounting/credit-notes',
              label: language === 'ar' ? 'إشعارات الدائن' : 'Credit Notes',
            },
            {
              key: '/accounting/debit-notes',
              label: language === 'ar' ? 'إشعارات المدين' : 'Debit Notes',
            },
          ],
        },
        {
          key: '/accounting/period-closing',
          label: language === 'ar' ? 'إغلاق الفترة المحاسبية' : 'Period Closing',
        },
        {
          key: 'ledger-reports',
          label: language === 'ar' ? 'دفتر الأستاذ والتقارير' : 'Ledger & Reports',
          children: [
            {
              key: '/accounting/ledger/general-ledger',
              label: language === 'ar' ? 'دفتر الأستاذ العام' : 'General Ledger',
            },
            {
              key: '/accounting/ledger/agent-ledger',
              label: language === 'ar' ? 'كشف حساب الوكيل' : 'Agent Ledger',
            },
            {
              key: '/accounting/ledger/customer-ledger',
              label: language === 'ar' ? 'كشف حساب العميل' : 'Customer Ledger',
            },
            {
              key: '/accounting/ledger/worker-ledger',
              label: language === 'ar' ? 'كشف حساب العامل' : 'Worker Ledger',
            },
            {
              key: '/accounting/ledger/trial-balance',
              label: language === 'ar' ? 'ميزان المراجعة' : 'Trial Balance',
            },
            {
              key: '/accounting/ledger/income-statement',
              label: language === 'ar' ? 'قائمة الدخل' : 'Income Statement',
            },
            {
              key: '/accounting/ledger/balance-sheet',
              label: language === 'ar' ? 'الميزانية العمومية' : 'Balance Sheet',
            },
            {
              key: '/accounting/ledger/vat-report',
              label: language === 'ar' ? 'تقرير ضريبة القيمة المضافة' : 'VAT Report',
            },
          ],
        },
      ],
    },
    {
      key: 'zatca',
      icon: <SafetyCertificateOutlined />,
      label: language === 'ar' ? 'زاتكا' : 'ZATCA',
      children: [
        { key: '/zatca', label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard' },
        { key: '/zatca/invoices', label: language === 'ar' ? 'الفواتير' : 'Invoices' },
        { key: '/zatca/branch-setup', label: language === 'ar' ? 'إعداد الفرع' : 'Branch Setup' },
        { key: '/zatca/csr', label: language === 'ar' ? 'طلبات CSR' : 'CSR Requests' },
        { key: '/zatca/certificates', label: language === 'ar' ? 'الشهادات' : 'Certificates' },
        { key: '/zatca/settings', label: language === 'ar' ? 'الإعدادات' : 'Settings' },
        { key: '/zatca/connection', label: language === 'ar' ? 'الاتصال والتشخيص' : 'Connection & Diagnostics' },
        { key: '/zatca/logs', label: language === 'ar' ? 'السجلات' : 'Logs' },
      ],
    },
    {
      key: '/complaints',
      icon: <WarningOutlined />,
      label: (
        <Badge offset={[10, 0]} size="small">
          {language === 'ar' ? 'الشكاوى' : 'Complaints'}
        </Badge>
      ),
      onClick: () => router.push('/complaints'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: language === 'ar' ? 'الإعدادات' : 'Settings',
      children: [
        // { key: '/settings/users', label: language === 'ar' ? 'المستخدمين' : 'Users' },
        // {
        //   key: '/settings/privileges',
        //   label: language === 'ar' ? 'صلاحيات المستخدمين' : 'User Privileges',
        // },
        // { key: '/settings/themes', label: language === 'ar' ? 'المظهر' : 'Themes' },
        // {
        //   key: '/settings/webpage',
        //   label: language === 'ar' ? 'إعدادات الموقع' : 'Webpage Settings',
        // },
        // { key: '/settings/sms', label: language === 'ar' ? 'إعدادات الرسائل' : 'SMS Settings' },
       
        {
          key: '/settings/mediation',
          label: language === 'ar' ? 'إعدادات عقود الاستقدام' : 'Mediation Settings',
        },
        {
          key: '/settings/marketer',
          label: language === 'ar' ? 'المسوقون ' : 'Marketers',
        },
        {
          key: '/register',
          label: language === 'ar' ? 'إضافة مسؤول' : 'Add Admin',
        },
        {
          key: '/settings/custody-types',
          label: language === 'ar' ? 'أنواع العهد' : 'Custody Types',
        },
        {
          key: '/settings/nationalities',
          label: language === 'ar' ? 'الجنسيات' : 'Nationalities',
        },
      ],
    },
    // {
    //   key: 'system-settings',
    //   icon: <SettingOutlined />,
    //   label: language === 'ar' ? 'إعدادات النظام' : 'System Settings',
    //   children: [
    //     {
    //       key: 'general-settings',
    //       label: language === 'ar' ? 'الإعدادات العامة' : 'General Settings',
    //       children: [
    //         {
    //           key: '/system/system-entities',
    //           label: language === 'ar' ? 'كيانات النظام' : 'System Entities',
    //         },
    //         {
    //           key: '/system/airline-companies',
    //           label: language === 'ar' ? 'شركات الطيران' : 'Airline Companies',
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];

  // Hide menu entries the current user's roles/permissions may not access.
  // Leaf items (route keys) are checked directly; group items are kept only if
  // at least one child survives. Pending auth claims are hidden so users never
  // briefly see modules they are not allowed to use.
  const filterMenu = (items: MenuItem[]): MenuItem[] =>
    items.reduce<MenuItem[]>((acc, item) => {
      if (!item) return acc;
      const node = item as MenuItem & { key?: React.Key; children?: MenuItem[] };

      if (node.children) {
        const children = filterMenu(node.children);
        if (children.length > 0) acc.push({ ...node, children } as MenuItem);
        return acc;
      }

      const key = String(node.key ?? '');
      if (key.startsWith('/') && check(key) !== 'allow') return acc;
      acc.push(item);
      return acc;
    }, []);

  const visibleMenuItems = filterMenu(menuItems);

  const handleMenuClick = (e: { key: string }) => {
    router.push(e.key);
    // Close mobile drawer on navigation
    onMobileDrawerClose();
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const menuContent = (
    <>
      <div className={styles.logoContainer}>
        <Image
          src="/images/logonavbar.png"
          alt="Logo"
          fill
          className={styles.logoImage}
          sizes={collapsed ? '60px' : '200px'}
        />
      </div>

      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        items={visibleMenuItems}
        onClick={handleMenuClick}
        className={styles.menu}
        inlineCollapsed={collapsed}
      />
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`${styles.sidebar} ${styles.desktopSidebar}`}
        width={260}
        collapsedWidth={80}
      >
        {menuContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement={language === 'ar' ? 'right' : 'left'}
        onClose={onMobileDrawerClose}
        open={mobileDrawerVisible}
        className={styles.mobileDrawer}
        size="default"
        closeIcon={null}
        styles={{ body: { padding: 0 } }}
      >
        <div className={styles.mobileSidebarContent}>{menuContent}</div>
      </Drawer>
    </>
  );
}
