'use client';

import { useState, useMemo, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Select,
  Tag,
  Card,
  Row,
  Col,
  Tooltip,
  InputNumber,
  Pagination,
  Empty,
  Spin,
  Avatar,
  Modal,
  Form,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
  FileProtectOutlined,
  UserOutlined,
  IdcardOutlined,
  GlobalOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  ClockCircleOutlined,
  UserDeleteOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { AdvancedFilterPanel, DateRangeFilter } from '@/components/filters';
import { useContractActionGates } from '@/hooks/useActionPermissionGates';
import { useAgents } from '@/hooks/api/useAgents';
import { useMediationFollowUpDashboard } from '@/hooks/api/useMediationFollowUp';
import { useMediationContracts } from '@/hooks/api/useMediationContracts';
import { useNationalities } from '@/hooks/api/useNationalities';
import { useJobs } from '@/hooks/api/useJobs';
import { useUsers } from '@/hooks/api/useUsers';
import {
  MEDIATION_CONTRACT_STATUS,
  MEDIATION_CONTRACT_TYPE,
  CANCEL_BY,
  toSelectOptions,
} from '@/constants/enums';
import { linkProps } from '@/lib/navigation/linkProps';
import type {
  MediationFollowUpDashboardParams,
  MediationFollowUpDashboardCard,
  ContractCancelDto,
} from '@/types/api.types';
import { formatCurrency, formatDate } from '../_lib/format';
import styles from './AutomaticFollowUp.module.css';

type BooleanFilter = 'all' | 'true' | 'false';

// ── Translations ──────────────────────────────────────────────────────────────

function useT(language: string) {
  return useMemo(() => {
    const map: Record<string, Record<string, string>> = {
      pageTitle: { ar: 'لوحة متابعة العقود', en: 'Contract Follow-Up Dashboard' },
      pageSubtitle: { ar: 'متابعة مراحل عقود الوساطة', en: 'Track mediation contract stages' },
      contractNumber: { ar: 'رقم العقد', en: 'Contract #' },
      workerName: { ar: 'اسم العامل', en: 'Worker Name' },
      passportNumber: { ar: 'رقم الجواز', en: 'Passport No.' },
      customerName: { ar: 'اسم العميل', en: 'Customer' },
      nationalId: { ar: 'رقم هوية العميل', en: 'Customer National ID' },
      nationality: { ar: 'الجنسية', en: 'Nationality' },
      dob: { ar: 'تاريخ الميلاد', en: 'Date of Birth' },
      customerNationality: { ar: 'جنسية العميل', en: 'Customer Nationality' },
      workerNationality: { ar: 'جنسية العامل', en: 'Worker Nationality' },
      workerStatus: { ar: 'حالة العامل', en: 'Worker Status' },
      offerAmount: { ar: 'العرض', en: 'Offer' },
      musanedNumber: { ar: 'رقم مساند', en: 'Musaned No.' },
      status: { ar: 'الحالة', en: 'Status' },
      dateFrom: { ar: 'من تاريخ', en: 'Date From' },
      dateTo: { ar: 'إلى تاريخ', en: 'Date To' },
      actions: { ar: 'إجراءات', en: 'Actions' },
      viewDetails: { ar: 'عرض التفاصيل', en: 'View Details' },
      search: { ar: 'بحث', en: 'Search' },
      reset: { ar: 'إعادة ضبط', en: 'Reset' },
      refresh: { ar: 'تحديث', en: 'Refresh' },
      filterByContract: { ar: 'رقم العقد', en: 'Contract Number' },
      filterByMusaned: { ar: 'رقم مساند', en: 'Musaned No.' },
      filterByPassport: { ar: 'رقم الجواز', en: 'Passport Number' },
      filterByNationalId: { ar: 'رقم هوية العميل', en: 'Customer National ID' },
      searchPlaceholder: { ar: 'بحث...', en: 'Search...' },
      noData: { ar: 'لا توجد بيانات', en: 'No data' },
      selectStatus: { ar: 'اختر الحالة', en: 'Select Status' },
      dateRange: { ar: 'نطاق التاريخ', en: 'Date Range' },
      progress: { ar: 'التقدم', en: 'Progress' },
      createdAt: { ar: 'تاريخ الإنشاء', en: 'Created' },
      lastUpdated: { ar: 'آخر تحديث', en: 'Last Updated' },
      agent: { ar: 'الوكيل', en: 'Agent' },
      visaDateLabel: { ar: 'تاريخ التأشيرة', en: 'Visa Date' },
      dobHijri: { ar: 'تاريخ الميلاد (هجري)', en: 'Date of Birth (Hijri)' },
      customerPhone: { ar: 'جوال العميل', en: 'Customer Phone' },
      customerEmail: { ar: 'البريد الإلكتروني', en: 'Email' },
      customerCity: { ar: 'مدينة العميل', en: 'Customer City' },
      visaNumber: { ar: 'رقم التأشيرة', en: 'Visa Number' },
      workerPassport: { ar: 'رقم جواز العامل', en: 'Worker Passport No.' },
      currentStage: { ar: 'المرحلة الحالية', en: 'Current Stage' },
      daysSinceUpdate: { ar: 'أيام منذ آخر تحديث', en: 'Days Since Update' },
      workerExternal: {
        ar: 'جواز معلق — العامل غير مسجّل',
        en: 'Passport pending — worker not registered',
      },
      totalCost: { ar: 'إجمالي العقد', en: 'Total' },
      totalPaid: { ar: 'المدفوع', en: 'Paid' },
      remainingAmount: { ar: 'المتبقي', en: 'Remaining' },
      paymentStatus: { ar: 'حالة السداد', en: 'Payment Status' },
      save: { ar: 'حفظ', en: 'Save' },
      cancel: { ar: 'إلغاء', en: 'Cancel' },
      submit: { ar: 'إرسال', en: 'Submit' },
      required: { ar: 'مطلوب', en: 'Required' },
      endWorkerService: { ar: 'إنهاء خدمة العامل', en: 'End Worker Service' },
      endServiceReason: { ar: 'سبب الإنهاء (اختياري)', en: 'End Reason (optional)' },
      endServiceReasonPlaceholder: {
        ar: 'سبب إنهاء الخدمة...',
        en: 'Reason for ending service...',
      },
      cancelContract: { ar: 'إلغاء العقد (باك أوت)', en: 'Cancel Contract (Backout)' },
      cancelBy: { ar: 'إلغاء بواسطة', en: 'Cancel By' },
      cancelNote: { ar: 'سبب الإلغاء', en: 'Cancel Reason' },
      cancelNotePlaceholder: { ar: 'سبب الإلغاء...', en: 'Cancellation reason...' },
    };
    return (key: string) => map[key]?.[language] ?? map[key]?.['en'] ?? key;
  }, [language]);
}

// ── Card building blocks ──────────────────────────────────────────────────────

/**
 * One labelled row in the card's details column. A null/blank value renders as
 * "—" rather than hiding the row — Frontend_AutomaticFollowUp_README.md §3.2
 * ("أي قيمة null اعرضها —"), so the same facts sit in the same place on
 * every card regardless of how much of the contract has been filled in.
 */
function CardDetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className={styles.detailItem}>
      {icon}
      <div className={styles.detailText}>
        <span className={styles.detailLabel}>{label}</span>
        <span className={styles.detailValue}>
          {value === null || value === undefined || value === '' ? '—' : value}
        </span>
      </div>
    </div>
  );
}

/** One row of the right-hand stats breakdown. */
function CardStatRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statDot} style={{ background: color }} />
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={{ color }}>
        {value}
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AutomaticFollowUpPage() {
  const router = useRouter();
  const language = useAuthStore((state) => state.language);
  const isRTL = language === 'ar';
  const t = useT(language);

  // Filter state — live: every change re-queries directly (no Search button).
  // Converted from the previous pull-to-search pattern per architectural
  // review: this is an ordinary paginated list ("shows rows on load, one
  // filter change = one list request"), which is the idiom used everywhere
  // else in the app. See project memory for the full rationale.
  const [contractNumber, setContractNumber] = useState<number | null>(null);
  const [musanedNumber, setMusanedNumber] = useState('');
  const [customerNameFilter, setCustomerNameFilter] = useState('');
  const [workerNameFilter, setWorkerNameFilter] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [workerNumber, setWorkerNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [visaNumber, setVisaNumber] = useState('');
  const [statusId, setStatusId] = useState<number | null>(null);
  const [externalStatusId, setExternalStatusId] = useState<string>('all');
  const [manualStatus, setManualStatus] = useState<string>('all');
  const [visaStatus, setVisaStatus] = useState<number | null>(null);
  const [incompleteExternalStatusId, setIncompleteExternalStatusId] = useState<string>('all');
  const [pastExternalStatusId, setPastExternalStatusId] = useState<string>('all');
  const [warrantyStatus, setWarrantyStatus] = useState<string>('all');
  const [contractType, setContractType] = useState<string | 'all'>('all');
  const [nationalityId, setNationalityId] = useState<string | 'all'>('all');
  const [agentId, setAgentId] = useState<string | 'all'>('all');
  const [jobId, setJobId] = useState<string | 'all'>('all');
  const [createdBy, setCreatedBy] = useState<string | 'all'>('all');
  const [workerAssignmentFilter, setWorkerAssignmentFilter] =
    useState<'all' | 'assigned' | 'unassigned'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [insuranceFilter, setInsuranceFilter] = useState<'all' | 'insured' | 'uninsured'>('all');
  const [cancelStatusFilter, setCancelStatusFilter] = useState<'all' | 'cancelled' | 'active'>('all');
  const [replacementFilter, setReplacementFilter] = useState<BooleanFilter>('all');
  const [musanedPaymentStatus, setMusanedPaymentStatus] = useState<string>('all');
  const [workersAddedToday, setWorkersAddedToday] = useState<BooleanFilter>('all');
  const [religion, setReligion] = useState<string>('all');
  const [previousExperience, setPreviousExperience] = useState<BooleanFilter>('all');
  const [vipFilter, setVipFilter] = useState<BooleanFilter>('all');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notArrivedAfterArrivalDateDays, setNotArrivedAfterArrivalDateDays] = useState<number | null>(null);
  const [notArrivedAfterSigningDateDays, setNotArrivedAfterSigningDateDays] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ]);
  const [externalStatusDateRange, setExternalStatusDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ]);
  const [arrivalDateRange, setArrivalDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ]);
  const [invoicePaymentDateRange, setInvoicePaymentDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState(''); // debounced, feeds the query
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // API-backed visa date range.
  const [visaDateRange, setVisaDateRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ]);

  // Debounce the free-text search box into the live query (400ms, matching
  // the app-wide convention); every other control applies immediately.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPageNumber(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const params = useMemo((): MediationFollowUpDashboardParams => {
    const p: MediationFollowUpDashboardParams = { Page: pageNumber, PageSize: pageSize };
    if (contractNumber) p.ContractNumber = contractNumber;
    if (musanedNumber) p.MusanedContractNumber = musanedNumber;
    if (customerNameFilter) p.CustomerName = customerNameFilter;
    if (workerNameFilter) p.WorkerName = workerNameFilter;
    if (passportNumber) p.WorkerPassportNumber = passportNumber;
    if (workerNumber) p.WorkerNumber = workerNumber;
    if (nationalId) p.CustomerNationalId = nationalId;
    if (customerPhone) p.CustomerPhone = customerPhone;
    if (customerEmail) p.CustomerEmail = customerEmail;
    if (visaNumber) p.VisaNumber = visaNumber;
    if (statusId != null) p.StatusId = statusId;
    if (externalStatusId !== 'all') p.ExternalStatusId = Number(externalStatusId);
    if (manualStatus !== 'all') p.ManualContractStatus = Number(manualStatus);
    if (visaStatus != null) p.VisaStatus = visaStatus;
    if (incompleteExternalStatusId !== 'all') p.IncompleteExternalStatusId = Number(incompleteExternalStatusId);
    if (pastExternalStatusId !== 'all') p.PastExternalStatusId = Number(pastExternalStatusId);
    if (warrantyStatus !== 'all') p.WarrantyStatus = Number(warrantyStatus);
    if (contractType !== 'all') p.ContractType = Number(contractType);
    if (nationalityId !== 'all') p.NationalityId = nationalityId;
    if (agentId !== 'all') p.AgentId = agentId;
    if (jobId !== 'all') p.JobId = jobId;
    if (createdBy !== 'all') p.CreatedBy = createdBy;
    if (workerAssignmentFilter !== 'all') {
      p.WithoutAssignedWorker = workerAssignmentFilter === 'unassigned';
    }
    if (paymentFilter === 'paid') p.IsPaid = true;
    if (paymentFilter === 'unpaid') p.IsUnpaid = true;
    if (insuranceFilter !== 'all') p.HasContractInsurance = insuranceFilter === 'insured';
    if (cancelStatusFilter !== 'all') p.IsCancel = cancelStatusFilter === 'cancelled';
    if (replacementFilter !== 'all') p.IsReplacement = replacementFilter === 'true';
    if (musanedPaymentStatus !== 'all') p.MusanedPaymentStatus = Number(musanedPaymentStatus) as 0 | 1 | 2;
    if (referenceNumber) p.ReferenceNumber = referenceNumber;
    if (workersAddedToday !== 'all') p.WorkersAddedToday = workersAddedToday === 'true';
    if (religion !== 'all') p.Religion = Number(religion) as 1 | 2 | 3;
    if (previousExperience !== 'all') p.HasPreviousExperience = previousExperience === 'true';
    if (vipFilter !== 'all') p.IsVip = vipFilter === 'true';
    if (notArrivedAfterArrivalDateDays != null) p.NotArrivedAfterArrivalDateDays = notArrivedAfterArrivalDateDays;
    if (notArrivedAfterSigningDateDays != null) p.NotArrivedAfterSigningDateDays = notArrivedAfterSigningDateDays;
    if (dateRange[0]) p.CreatedDateFrom = dateRange[0];
    if (dateRange[1]) p.CreatedDateTo = dateRange[1];
    if (externalStatusDateRange[0]) p.ExternalStatusDateFrom = externalStatusDateRange[0];
    if (externalStatusDateRange[1]) p.ExternalStatusDateTo = externalStatusDateRange[1];
    if (arrivalDateRange[0]) p.ArrivalDateFrom = arrivalDateRange[0];
    if (arrivalDateRange[1]) p.ArrivalDateTo = arrivalDateRange[1];
    if (invoicePaymentDateRange[0]) p.InvoicePaymentDateFrom = invoicePaymentDateRange[0];
    if (invoicePaymentDateRange[1]) p.InvoicePaymentDateTo = invoicePaymentDateRange[1];
    if (search) p.Search = search;
    if (visaDateRange[0]) p.VisaDateFrom = visaDateRange[0];
    if (visaDateRange[1]) p.VisaDateTo = visaDateRange[1];
    return p;
  }, [
    pageNumber,
    pageSize,
    contractNumber,
    musanedNumber,
    customerNameFilter,
    workerNameFilter,
    passportNumber,
    workerNumber,
    nationalId,
    customerPhone,
    customerEmail,
    visaNumber,
    statusId,
    externalStatusId,
    manualStatus,
    visaStatus,
    incompleteExternalStatusId,
    pastExternalStatusId,
    warrantyStatus,
    contractType,
    nationalityId,
    agentId,
    jobId,
    createdBy,
    workerAssignmentFilter,
    paymentFilter,
    insuranceFilter,
    cancelStatusFilter,
    replacementFilter,
    musanedPaymentStatus,
    referenceNumber,
    workersAddedToday,
    religion,
    previousExperience,
    vipFilter,
    notArrivedAfterArrivalDateDays,
    notArrivedAfterSigningDateDays,
    dateRange,
    externalStatusDateRange,
    arrivalDateRange,
    invoicePaymentDateRange,
    search,
    visaDateRange,
  ]);

  const { data, isLoading, refetch } = useMediationFollowUpDashboard(params);
  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const displayedRows = rows;
  const { data: agents = [] } = useAgents();
  const { data: nationalities = [] } = useNationalities();
  const { data: jobs = [] } = useJobs();
  const { users = [] } = useUsers();

  // ── Contract lifecycle actions (End Worker Service / Cancel) ──────────────
  // Same gates + endpoints as the detail page and the regular contract pages.
  const contractGates = useContractActionGates();
  const { endWorkerService, cancelContract, isEndingWorkerService, isCancelling } =
    useMediationContracts({ enabled: false });
  const [endServiceRow, setEndServiceRow] = useState<MediationFollowUpDashboardCard | null>(null);
  const [cancelRow, setCancelRow] = useState<MediationFollowUpDashboardCard | null>(null);
  const [endServiceForm] = Form.useForm();
  const [cancelForm] = Form.useForm();

  const isTerminalContract = (row: MediationFollowUpDashboardCard) =>
    row.statusId === 16 || row.statusId === 17;
  const rowHasAssignedWorker = (row: MediationFollowUpDashboardCard) =>
    !!(row.highlights?.workerPassportNumber || row.worker?.passportNumber || row.worker?.photoUrl);
  const canEndWorkerService = useCallback(
    (row: MediationFollowUpDashboardCard) =>
      !isTerminalContract(row) && contractGates.canUpdate && rowHasAssignedWorker(row),
    [contractGates.canUpdate]
  );
  const canCancelContract = useCallback(
    (row: MediationFollowUpDashboardCard) => !isTerminalContract(row) && contractGates.canCancel,
    [contractGates.canCancel]
  );

  const handleEndWorkerService = async () => {
    if (!endServiceRow?.id) return;
    try {
      const values = await endServiceForm.validateFields();
      await endWorkerService({ contractId: endServiceRow.id, reason: values.reason || null });
      setEndServiceRow(null);
      endServiceForm.resetFields();
      refetch();
    } catch {
      // validation + API errors surfaced by the mutation/hook
    }
  };

  const handleCancelContract = async () => {
    if (!cancelRow?.id) return;
    try {
      const values = await cancelForm.validateFields();
      const cancelData: ContractCancelDto = {
        contractId: cancelRow.id,
        cancelBy: values.cancelBy,
        cancelNote: values.cancelNote,
      };
      await cancelContract(cancelData);
      setCancelRow(null);
      cancelForm.resetFields();
      refetch();
    } catch {
      // validation + API errors surfaced by the mutation/hook
    }
  };

  const activeFilterCount = [
    contractNumber != null,
    musanedNumber !== '',
    customerNameFilter !== '',
    workerNameFilter !== '',
    passportNumber !== '',
    workerNumber !== '',
    nationalId !== '',
    customerPhone !== '',
    customerEmail !== '',
    visaNumber !== '',
    statusId != null,
    externalStatusId !== 'all',
    manualStatus !== 'all',
    visaStatus != null,
    incompleteExternalStatusId !== 'all',
    pastExternalStatusId !== 'all',
    warrantyStatus !== 'all',
    contractType !== 'all',
    nationalityId !== 'all',
    agentId !== 'all',
    jobId !== 'all',
    createdBy !== 'all',
    workerAssignmentFilter !== 'all',
    paymentFilter !== 'all',
    insuranceFilter !== 'all',
    cancelStatusFilter !== 'all',
    replacementFilter !== 'all',
    musanedPaymentStatus !== 'all',
    referenceNumber !== '',
    workersAddedToday !== 'all',
    religion !== 'all',
    previousExperience !== 'all',
    vipFilter !== 'all',
    notArrivedAfterArrivalDateDays != null,
    notArrivedAfterSigningDateDays != null,
    Boolean(dateRange[0] || dateRange[1]),
    Boolean(externalStatusDateRange[0] || externalStatusDateRange[1]),
    Boolean(arrivalDateRange[0] || arrivalDateRange[1]),
    Boolean(invoicePaymentDateRange[0] || invoicePaymentDateRange[1]),
    Boolean(visaDateRange[0] || visaDateRange[1]),
  ].filter(Boolean).length;

  const clearFilters = useCallback(() => {
    setContractNumber(null);
    setMusanedNumber('');
    setCustomerNameFilter('');
    setWorkerNameFilter('');
    setPassportNumber('');
    setWorkerNumber('');
    setNationalId('');
    setCustomerPhone('');
    setCustomerEmail('');
    setVisaNumber('');
    setStatusId(null);
    setExternalStatusId('all');
    setManualStatus('all');
    setVisaStatus(null);
    setIncompleteExternalStatusId('all');
    setPastExternalStatusId('all');
    setWarrantyStatus('all');
    setContractType('all');
    setNationalityId('all');
    setAgentId('all');
    setJobId('all');
    setCreatedBy('all');
    setWorkerAssignmentFilter('all');
    setPaymentFilter('all');
    setInsuranceFilter('all');
    setCancelStatusFilter('all');
    setReplacementFilter('all');
    setMusanedPaymentStatus('all');
    setReferenceNumber('');
    setWorkersAddedToday('all');
    setReligion('all');
    setPreviousExperience('all');
    setVipFilter('all');
    setNotArrivedAfterArrivalDateDays(null);
    setNotArrivedAfterSigningDateDays(null);
    setDateRange([undefined, undefined]);
    setExternalStatusDateRange([undefined, undefined]);
    setArrivalDateRange([undefined, undefined]);
    setInvoicePaymentDateRange([undefined, undefined]);
    setVisaDateRange([undefined, undefined]);
    setPageNumber(1);
  }, []);
  const handlePageChange = useCallback((page: number, size: number) => {
    setPageNumber(page);
    setPageSize(size);
  }, []);

  const renderCard = useCallback(
    (row: MediationFollowUpDashboardCard) => {
      const id = row.id;
      const lang = language === 'ar' ? 'ar' : 'en';
      const statusName = language === 'ar' ? row.statusNameAr : row.statusNameEn ?? row.statusNameAr;
      const lastUpdated = row.lastUpdatedAt ? formatDate(row.lastUpdatedAt, lang) : '—';
      // `customer`/`agent` hold the same data as `highlights` (§3.5) — used as a
      // fallback so a field still shows if only one of the two is populated.
      const workerNationality =
        (language === 'ar' ? row.highlights?.workerNationalityAr : row.highlights?.workerNationalityEn) ??
        row.worker?.nationalityAr;
      const agentName = row.header?.agentName || row.highlights?.agentName || row.agent?.nameAr;
      const birthDate = row.highlights?.customerBirthDate ?? row.customer?.birthDate;
      const customerBirthDate = birthDate ? formatDate(birthDate, lang) : null;
      const customerNationality = row.highlights?.customerNationality ?? row.customer?.nationality;
      const customerNationalId = row.highlights?.customerNationalId ?? row.customer?.nationalId;
      const workerPassport = row.highlights?.workerPassportNumber ?? row.worker?.passportNumber;
      const workerStatus =
        language === 'ar' ? row.header?.workerStatusNameAr : row.header?.workerStatusNameEn ?? row.header?.workerStatusNameAr;
      const stages = row.followUpStages ?? [];
      const completedStages = stages.filter((stage) => stage.result === 2).length;

      return (
        <Card key={row.id ?? Math.random().toString()} className={styles.followUpCard} hoverable>
          <div className={styles.cardContent}>
            {/* ── Left Panel ── */}
            <div className={styles.cardLeft}>
              <div className={styles.cardHeader}>
                <div className={styles.contractNumber}>
                  <FileTextOutlined className={styles.contractIcon} />
                  <span>#{row.contractNumber ?? '—'}</span>
                  {row.musanedContractNumber && (
                    <Tag color="geekblue" style={{ marginInlineStart: 8 }}>
                      {t('musanedNumber')}: {row.musanedContractNumber}
                    </Tag>
                  )}
                </div>
              </div>

              <div className={styles.tagsSection}>
                {statusName && (
                  <Tag color="blue" className={styles.typeTag}>{statusName}</Tag>
                )}
                {row.header?.contractCategoryName && (
                  <Tag color="geekblue">{row.header.contractCategoryName}</Tag>
                )}
                {workerStatus && <Tag color="purple">{workerStatus}</Tag>}
                {row.worker?.isExternal && <Tag color="orange">{t('workerExternal')}</Tag>}
              </div>

              {/* Customer row — always shown per the highlights contract, even
                  before a worker is assigned or any stage is completed. */}
              <div className={styles.customerSection}>
                <Avatar size={44} icon={<UserOutlined />} className={styles.customerAvatar} />
                <div className={styles.customerDetails}>
                  <span className={styles.customerName}>{row.header?.customerName || '—'}</span>
                  <div className={styles.customerMeta}>
                    <IdcardOutlined />
                    <span>{t('workerPassport')}:</span>
                    <span dir="ltr">{workerPassport || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Extra details — the highlights the client asked to always show
                  up front, not gated behind stage completion: agent name, DOB
                  (+ Hijri), customer nationality, worker nationality, customer
                  national ID, worker passport (above) — plus the `header`
                  contact block (phone, email, city, visa number). Rows always
                  render, with "—" for a missing value (§3.2). */}
              <div className={styles.detailsSection}>
                <CardDetailRow
                  icon={<SolutionOutlined className={styles.detailIcon} />}
                  label={t('agent')}
                  value={agentName}
                />
                <CardDetailRow
                  icon={<CalendarOutlined className={styles.detailIcon} />}
                  label={t('dob')}
                  value={customerBirthDate}
                />
                <CardDetailRow
                  icon={<CalendarOutlined className={styles.detailIcon} />}
                  label={t('dobHijri')}
                  value={row.highlights?.customerBirthDateHijri}
                />
                <CardDetailRow
                  icon={<GlobalOutlined className={styles.detailIcon} />}
                  label={t('customerNationality')}
                  value={customerNationality}
                />
                <CardDetailRow
                  icon={<GlobalOutlined className={styles.detailIcon} />}
                  label={t('workerNationality')}
                  value={workerNationality}
                />
                <CardDetailRow
                  icon={<IdcardOutlined className={styles.detailIcon} />}
                  label={t('nationalId')}
                  value={customerNationalId}
                />
                <CardDetailRow
                  icon={<PhoneOutlined className={styles.detailIcon} />}
                  label={t('customerPhone')}
                  value={row.header?.customerPhone}
                />
                <CardDetailRow
                  icon={<MailOutlined className={styles.detailIcon} />}
                  label={t('customerEmail')}
                  value={row.header?.customerEmail}
                />
                <CardDetailRow
                  icon={<EnvironmentOutlined className={styles.detailIcon} />}
                  label={t('customerCity')}
                  value={row.header?.customerCity}
                />
                <CardDetailRow
                  icon={<SafetyCertificateOutlined className={styles.detailIcon} />}
                  label={t('visaNumber')}
                  value={row.header?.visaNumber}
                />
              </div>
            </div>

            {/* ── Right Panel ── */}
            <div className={styles.cardRight}>
              {/* Status banner */}
              <div className={styles.progressBanner}>
                <div className={styles.progressBannerMeta}>
                  <FileProtectOutlined className={styles.progressBannerIcon} />
                  <span className={styles.progressBannerLabel}>{t('status')}</span>
                </div>
                <div className={styles.progressBannerValue}>
                  {statusName || '—'}
                </div>
                {row.daysSinceCreation != null && (
                  <div className={styles.progressBannerSub}>
                    <CalendarOutlined style={{ marginInlineEnd: 4 }} />
                    {language === 'ar'
                      ? `${row.daysSinceCreation} يوم منذ الإنشاء`
                      : `${row.daysSinceCreation} days since creation`}
                  </div>
                )}
              </div>

              {/* Stats breakdown */}
              <div className={styles.statsBreakdown}>
                <CardStatRow
                  color="#003366"
                  label={t('contractNumber')}
                  value={`#${row.contractNumber ?? '—'}`}
                />
                <CardStatRow
                  color="#52c41a"
                  label={t('musanedNumber')}
                  value={<span className={styles.mono}>{row.musanedContractNumber || '—'}</span>}
                />
                <CardStatRow
                  color="#722ed1"
                  label={t('currentStage')}
                  value={row.currentFollowUpStatusNameAr || '—'}
                />
                {stages.length > 0 && (
                  <CardStatRow
                    color="#1677ff"
                    label={t('progress')}
                    value={<span dir="ltr">{completedStages}/{stages.length}</span>}
                  />
                )}
                {row.offer?.offerAmount != null && (
                  <CardStatRow
                    color="#faad14"
                    label={t('offerAmount')}
                    value={formatCurrency(row.offer.offerAmount, lang)}
                  />
                )}
                {row.offer?.totalCost != null && (
                  <CardStatRow
                    color="#003366"
                    label={t('totalCost')}
                    value={formatCurrency(row.offer.totalCost, lang)}
                  />
                )}
                {row.offer?.totalPaid != null && (
                  <CardStatRow
                    color="#52c41a"
                    label={t('totalPaid')}
                    value={formatCurrency(row.offer.totalPaid, lang)}
                  />
                )}
                {row.offer?.remainingAmount != null && (
                  <CardStatRow
                    color="#fa541c"
                    label={t('remainingAmount')}
                    value={formatCurrency(row.offer.remainingAmount, lang)}
                  />
                )}
                {row.offer?.paymentStatus && (
                  <CardStatRow
                    color="#13c2c2"
                    label={t('paymentStatus')}
                    value={row.offer.paymentStatus}
                  />
                )}
              </div>

              {/* Dates */}
              <div className={styles.datesSection}>
                <div className={styles.dateItem}>
                  <CalendarOutlined />
                  <span>{t('lastUpdated')}: {lastUpdated}</span>
                </div>
                {row.daysSinceLastUpdate != null && (
                  <div className={styles.dateItem}>
                    <ClockCircleOutlined />
                    <span>{t('daysSinceUpdate')}: {row.daysSinceLastUpdate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Bottom Action Bar ── */}
          <div className={styles.cardBottom}>
            <div className={styles.actionsList}>
              <Tooltip title={t('viewDetails')}>
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  className={styles.actionBtn}
                  disabled={!id}
                  {...(id ? linkProps(`/contracts/mediationcontract/automaticfollowup/${id}`, router) : {})}
                >
                  {t('viewDetails')}
                </Button>
              </Tooltip>
              {canEndWorkerService(row) && (
                <Tooltip title={t('endWorkerService')}>
                  <Button
                    type="link"
                    danger
                    icon={<UserDeleteOutlined />}
                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                    onClick={() => {
                      endServiceForm.resetFields();
                      setEndServiceRow(row);
                    }}
                  >
                    {t('endWorkerService')}
                  </Button>
                </Tooltip>
              )}
              {canCancelContract(row) && (
                <Tooltip title={t('cancelContract')}>
                  <Button
                    type="link"
                    danger
                    icon={<CloseCircleOutlined />}
                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                    onClick={() => {
                      cancelForm.resetFields();
                      setCancelRow(row);
                    }}
                  >
                    {t('cancelContract')}
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        </Card>
      );
    },
    [t, language, router, endServiceForm, cancelForm, canEndWorkerService, canCancelContract]
  );

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <FileProtectOutlined className={styles.headerIcon} />
          <div>
            <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
            <p className={styles.pageSubtitle}>{t('pageSubtitle')}</p>
          </div>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
          loading={isLoading}
        >
          {t('refresh')}
        </Button>
      </div>

      {/* ── Filters ── */}
      <AdvancedFilterPanel
        activeCount={activeFilterCount}
        onClear={clearFilters}
        contentLayout="block"
        quickFilters={
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
          />
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{t('filterByContract')}</label>
            <InputNumber placeholder={t('filterByContract')} value={contractNumber} onChange={(v) => { setContractNumber(v); setPageNumber(1); }} style={{ width: '100%' }} min={0} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{t('filterByMusaned')}</label>
            <Input placeholder={t('filterByMusaned')} value={musanedNumber} onChange={(e) => { setMusanedNumber(e.target.value); setPageNumber(1); }} allowClear />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'اسم العميل' : 'Client Name'}</label>
            <Input
              value={customerNameFilter}
              onChange={(e) => { setCustomerNameFilter(e.target.value); setPageNumber(1); }}
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'اسم العامل' : 'Worker Name'}</label>
            <Input
              value={workerNameFilter}
              onChange={(e) => { setWorkerNameFilter(e.target.value); setPageNumber(1); }}
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{t('filterByPassport')}</label>
            <Input placeholder={t('filterByPassport')} value={passportNumber} onChange={(e) => { setPassportNumber(e.target.value); setPageNumber(1); }} allowClear />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'رقم العامل' : 'Worker ID / Number'}</label>
            <Input value={workerNumber} onChange={(e) => { setWorkerNumber(e.target.value); setPageNumber(1); }} allowClear />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{t('filterByNationalId')}</label>
            <Input placeholder={t('filterByNationalId')} value={nationalId} onChange={(e) => { setNationalId(e.target.value); setPageNumber(1); }} allowClear />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'الجوال' : 'Mobile Number'}</label>
            <Input value={customerPhone} onChange={(e) => { setCustomerPhone(e.target.value); setPageNumber(1); }} allowClear />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <Input value={customerEmail} onChange={(e) => { setCustomerEmail(e.target.value); setPageNumber(1); }} allowClear />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'رقم التأشيرة' : 'Visa Number'}</label>
            <Input value={visaNumber} onChange={(e) => { setVisaNumber(e.target.value); setPageNumber(1); }} allowClear />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'حالة التأشيرة' : 'Visa Status'}</label>
            <InputNumber value={visaStatus} onChange={(v) => { setVisaStatus(v ?? null); setPageNumber(1); }} style={{ width: '100%' }} min={0} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{t('nationality')}</label>
            <Select
              value={nationalityId}
              onChange={(v) => { setNationalityId(v); setPageNumber(1); }}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="label"
              options={[
                { value: 'all', label: language === 'ar' ? 'جميع الجنسيات' : 'All Nationalities' },
                ...(nationalities as any[]).map((n) => ({
                  value: String(n.id),
                  label: (language === 'ar' ? n.nationalityNameAr : n.nationalityNameEn) || n.nationalityNameAr || n.nationalityNameEn || `#${n.id}`,
                })),
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'الوظيفة' : 'Occupation / Job Title'}</label>
            <Select
              value={jobId}
              onChange={(v) => { setJobId(v); setPageNumber(1); }}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="label"
              options={[
                { value: 'all', label: language === 'ar' ? 'جميع الوظائف' : 'All Jobs' },
                ...(jobs as any[]).map((j) => ({
                  value: String(j.id),
                  label: (language === 'ar' ? j.jobNameAr : j.jobNameEn) || j.jobNameAr || j.jobNameEn || `#${j.id}`,
                })),
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'الوكيل' : 'Agent'}</label>
            <Select
              value={agentId}
              onChange={(v) => { setAgentId(v); setPageNumber(1); }}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="label"
              options={[
                { value: 'all', label: language === 'ar' ? 'جميع الوكلاء' : 'All Agents' },
                ...(agents as any[]).map((a) => ({
                  value: String(a.id),
                  label: (language === 'ar' ? a.agentNameAr : a.agentNameEn) || a.agentNameAr || a.agentNameEn || `#${a.id}`,
                })),
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'تم الإنشاء بواسطة' : 'Created By'}</label>
            <Select
              value={createdBy}
              onChange={(v) => { setCreatedBy(v); setPageNumber(1); }}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="label"
              options={[
                { value: 'all', label: language === 'ar' ? 'جميع المستخدمين' : 'All Users' },
                ...(users as any[]).map((u) => ({
                  value: String(u.id),
                  label: u.fullName || u.username || `#${u.id}`,
                })),
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{t('selectStatus')}</label>
            <Select placeholder={t('selectStatus')} allowClear value={statusId} onChange={(v) => { setStatusId(v ?? null); setPageNumber(1); }} style={{ width: '100%' }} options={toSelectOptions([...MEDIATION_CONTRACT_STATUS], language)} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'الحالة الخارجية' : 'External Status'}</label>
            <Select
              value={externalStatusId}
              onChange={(v) => { setExternalStatusId(v); setPageNumber(1); }}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: language === 'ar' ? 'جميع الحالات' : 'All Statuses' },
                ...toSelectOptions([...MEDIATION_CONTRACT_STATUS], language).map((o) => ({ ...o, value: String(o.value) })),
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'حالة العقد اليدوي' : 'Manual Contract Status'}</label>
            <Select
              value={manualStatus}
              onChange={(v) => { setManualStatus(v); setPageNumber(1); }}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: language === 'ar' ? 'جميع الحالات' : 'All Statuses' },
                ...toSelectOptions([...MEDIATION_CONTRACT_STATUS], language).map((o) => ({ ...o, value: String(o.value) })),
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'حالة خارجية لم تتم' : 'Incomplete External Status'}</label>
            <Select
              value={incompleteExternalStatusId}
              onChange={(v) => { setIncompleteExternalStatusId(v); setPageNumber(1); }}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: language === 'ar' ? 'جميع الحالات' : 'All Statuses' },
                ...toSelectOptions([...MEDIATION_CONTRACT_STATUS], language).map((o) => ({ ...o, value: String(o.value) })),
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'حالة خارجية مرت على العقد' : 'Past External Status'}</label>
            <Select
              value={pastExternalStatusId}
              onChange={(v) => { setPastExternalStatusId(v); setPageNumber(1); }}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: language === 'ar' ? 'جميع الحالات' : 'All Statuses' },
                ...toSelectOptions([...MEDIATION_CONTRACT_STATUS], language).map((o) => ({ ...o, value: String(o.value) })),
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'حالات الضمان' : 'Warranty / Guarantee Status'}</label>
            <Select
              value={warrantyStatus}
              onChange={(v) => { setWarrantyStatus(v); setPageNumber(1); }}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: language === 'ar' ? 'كل حالات الضمان' : 'All Warranty Statuses' },
                { value: '14', label: language === 'ar' ? 'فترة الضمان' : 'Warranty Period' },
                { value: '16', label: language === 'ar' ? 'مرتجع' : 'Returned' },
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'نوع عقد التوسط' : 'Mediation Contract Type'}</label>
            <Select
              value={contractType}
              onChange={(v) => { setContractType(v); setPageNumber(1); }}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: language === 'ar' ? 'كل الأنواع' : 'All Types' },
                ...toSelectOptions([...MEDIATION_CONTRACT_TYPE], language).map((o) => ({ ...o, value: String(o.value) })),
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'عامل معين' : 'Designated Worker'}</label>
            <Select value={workerAssignmentFilter} onChange={(v) => { setWorkerAssignmentFilter(v); setPageNumber(1); }} style={{ width: '100%' }} options={[{ value: 'all', label: language === 'ar' ? 'الكل' : 'All' }, { value: 'assigned', label: language === 'ar' ? 'معين' : 'Assigned' }, { value: 'unassigned', label: language === 'ar' ? 'غير معين' : 'Unassigned' }]} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'حالة الدفع' : 'Payment Status'}</label>
            <Select value={paymentFilter} onChange={(v) => { setPaymentFilter(v); setPageNumber(1); }} style={{ width: '100%' }} options={[{ value: 'all', label: language === 'ar' ? 'كل حالات الدفع' : 'All Payment Statuses' }, { value: 'paid', label: language === 'ar' ? 'مدفوع' : 'Paid' }, { value: 'unpaid', label: language === 'ar' ? 'غير مدفوع' : 'Unpaid' }]} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'سداد مساند' : 'Musaned Payment'}</label>
            <Select value={musanedPaymentStatus} onChange={(v) => { setMusanedPaymentStatus(v); setPageNumber(1); }} style={{ width: '100%' }} options={[{ value: 'all', label: language === 'ar' ? 'كل حالات سداد مساند' : 'All Musaned Payment Statuses' }, { value: '0', label: language === 'ar' ? 'غير مدفوع' : 'Unpaid' }, { value: '1', label: language === 'ar' ? 'مدفوع جزئياً' : 'Partially Paid' }, { value: '2', label: language === 'ar' ? 'مدفوع' : 'Paid' }]} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'تأمين عقود العمالة المنزلية' : 'Domestic Worker Insurance'}</label>
            <Select value={insuranceFilter} onChange={(v) => { setInsuranceFilter(v); setPageNumber(1); }} style={{ width: '100%' }} options={[{ value: 'all', label: language === 'ar' ? 'الكل' : 'All' }, { value: 'insured', label: language === 'ar' ? 'مؤمن' : 'Insured' }, { value: 'uninsured', label: language === 'ar' ? 'غير مؤمن' : 'Uninsured' }]} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'باك أوت' : 'Back-out Status'}</label>
            <Select value={cancelStatusFilter} onChange={(v) => { setCancelStatusFilter(v); setPageNumber(1); }} style={{ width: '100%' }} options={[{ value: 'all', label: language === 'ar' ? 'الكل' : 'All' }, { value: 'cancelled', label: language === 'ar' ? 'ملغي' : 'Cancelled' }, { value: 'active', label: language === 'ar' ? 'غير ملغي' : 'Not Cancelled' }]} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'استبدال العقود' : 'Contract Replacement'}</label>
            <Select value={replacementFilter} onChange={(v) => { setReplacementFilter(v); setPageNumber(1); }} style={{ width: '100%' }} options={[{ value: 'all', label: language === 'ar' ? 'الكل' : 'All' }, { value: 'true', label: language === 'ar' ? 'استبدال' : 'Replacement' }, { value: 'false', label: language === 'ar' ? 'ليس استبدالاً' : 'Not Replacement' }]} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'رقم المرجع' : 'Reference Number'}</label>
            <Input value={referenceNumber} onChange={(e) => { setReferenceNumber(e.target.value); setPageNumber(1); }} allowClear />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'عمالة تمت إضافتها اليوم' : 'Workers Added Today'}</label>
            <Select value={workersAddedToday} onChange={(v) => { setWorkersAddedToday(v); setPageNumber(1); }} style={{ width: '100%' }} options={[{ value: 'all', label: language === 'ar' ? 'الكل' : 'All' }, { value: 'true', label: language === 'ar' ? 'نعم' : 'Yes' }, { value: 'false', label: language === 'ar' ? 'لا' : 'No' }]} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'الديانة' : 'Religion'}</label>
            <Select value={religion} onChange={(v) => { setReligion(v); setPageNumber(1); }} style={{ width: '100%' }} options={[{ value: 'all', label: language === 'ar' ? 'كل الديانات' : 'All Religions' }, { value: '1', label: language === 'ar' ? 'مسلم' : 'Muslim' }, { value: '2', label: language === 'ar' ? 'مسيحي' : 'Christian' }, { value: '3', label: language === 'ar' ? 'أخرى' : 'Other' }]} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'سبق له العمل' : 'Prior Experience'}</label>
            <Select value={previousExperience} onChange={(v) => { setPreviousExperience(v); setPageNumber(1); }} style={{ width: '100%' }} options={[{ value: 'all', label: language === 'ar' ? 'الكل' : 'All' }, { value: 'true', label: language === 'ar' ? 'نعم' : 'Yes' }, { value: 'false', label: language === 'ar' ? 'لا' : 'No' }]} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'عميل مهم' : 'VIP / Important Client'}</label>
            <Select value={vipFilter} onChange={(v) => { setVipFilter(v); setPageNumber(1); }} style={{ width: '100%' }} options={[{ value: 'all', label: language === 'ar' ? 'الكل' : 'All' }, { value: 'true', label: language === 'ar' ? 'مهم' : 'VIP' }, { value: 'false', label: language === 'ar' ? 'عادي' : 'Standard' }]} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'لم يصل بعد تاريخ الوصول (أيام)' : 'Not Arrived After Arrival Date Days'}</label>
            <InputNumber min={0} value={notArrivedAfterArrivalDateDays} onChange={(v) => { setNotArrivedAfterArrivalDateDays(v ?? null); setPageNumber(1); }} style={{ width: '100%' }} />
          </Col>
          <Col xs={24} md={6}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'لم يصل بعد التوقيع (أيام)' : 'Not Arrived After Signing Date Days'}</label>
            <InputNumber min={0} value={notArrivedAfterSigningDateDays} onChange={(v) => { setNotArrivedAfterSigningDateDays(v ?? null); setPageNumber(1); }} style={{ width: '100%' }} />
          </Col>
          <Col xs={24} md={12}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'تاريخ الإنشاء' : 'Creation Date'}</label>
            <DateRangeFilter value={dateRange} onChange={(v) => { setDateRange(v); setPageNumber(1); }} style={{ width: '100%' }} />
          </Col>
          <Col xs={24} md={12}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'تاريخ الحالة الخارجية' : 'External Status Date'}</label>
            <DateRangeFilter value={externalStatusDateRange} onChange={(v) => { setExternalStatusDateRange(v); setPageNumber(1); }} style={{ width: '100%' }} />
          </Col>
          <Col xs={24} md={12}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'تاريخ الوصول' : 'Arrival Date'}</label>
            <DateRangeFilter value={arrivalDateRange} onChange={(v) => { setArrivalDateRange(v); setPageNumber(1); }} style={{ width: '100%' }} />
          </Col>
          <Col xs={24} md={12}>
            <label className={styles.filterLabel}>{language === 'ar' ? 'تاريخ سداد الفاتورة' : 'Invoice Payment Date'}</label>
            <DateRangeFilter value={invoicePaymentDateRange} onChange={(v) => { setInvoicePaymentDateRange(v); setPageNumber(1); }} style={{ width: '100%' }} />
          </Col>
          <Col xs={24} md={12}>
            <label className={styles.filterLabel}>{t('visaDateLabel')}</label>
            <DateRangeFilter value={visaDateRange} onChange={(v) => { setVisaDateRange(v); setPageNumber(1); }} style={{ width: '100%' }} />
          </Col>
        </Row>
      </AdvancedFilterPanel>

      {/* ── Cards Grid ── */}
      <Spin spinning={isLoading}>
        {displayedRows.length === 0 && !isLoading ? (
          <Card className={styles.tableCard}>
            <Empty description={t('noData')} />
          </Card>
        ) : (
          <div className={styles.cardsGrid}>
            {displayedRows.map(renderCard)}
          </div>
        )}
      </Spin>

      {total > 0 && (
        <div className={styles.paginationBar}>
          <Pagination
            current={pageNumber}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['10', '15', '25', '50']}
            showTotal={(tot) =>
              isRTL ? `إجمالي ${tot} عقد` : `Total ${tot} contracts`
            }
          />
        </div>
      )}

      {/* ========== END WORKER SERVICE MODAL ========== */}
      <Modal
        title={
          <span>
            <UserDeleteOutlined style={{ marginInlineEnd: 8 }} />
            {t('endWorkerService')}
            {endServiceRow?.contractNumber != null && ` — #${endServiceRow.contractNumber}`}
          </span>
        }
        open={!!endServiceRow}
        onCancel={() => {
          setEndServiceRow(null);
          endServiceForm.resetFields();
        }}
        onOk={handleEndWorkerService}
        okText={t('save')}
        cancelText={t('cancel')}
        confirmLoading={isEndingWorkerService}
        okButtonProps={{ danger: true }}
      >
        <Form form={endServiceForm} layout="vertical">
          <Form.Item name="reason" label={t('endServiceReason')}>
            <Input.TextArea rows={3} placeholder={t('endServiceReasonPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== CANCEL CONTRACT MODAL ========== */}
      <Modal
        title={
          <span>
            <CloseCircleOutlined style={{ marginInlineEnd: 8 }} />
            {t('cancelContract')}
            {cancelRow?.contractNumber != null && ` — #${cancelRow.contractNumber}`}
          </span>
        }
        open={!!cancelRow}
        onCancel={() => {
          setCancelRow(null);
          cancelForm.resetFields();
        }}
        onOk={handleCancelContract}
        okText={t('submit')}
        cancelText={t('cancel')}
        confirmLoading={isCancelling}
        okButtonProps={{ danger: true }}
      >
        <Form form={cancelForm} layout="vertical">
          <Form.Item
            name="cancelBy"
            label={t('cancelBy')}
            rules={[{ required: true, message: t('required') }]}
          >
            <Select
              placeholder={t('cancelBy')}
              options={toSelectOptions([...CANCEL_BY], isRTL ? 'ar' : 'en')}
            />
          </Form.Item>
          <Form.Item
            name="cancelNote"
            label={t('cancelNote')}
            rules={[{ required: true, message: t('required') }]}
          >
            <Input.TextArea rows={3} placeholder={t('cancelNotePlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
