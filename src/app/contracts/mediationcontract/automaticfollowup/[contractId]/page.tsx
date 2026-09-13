'use client';

import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Button,
  Spin,
  Empty,
  Tag,
  Tooltip,
  Alert,
  Descriptions,
  Card,
  Select,
  Divider,
  Timeline,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  EditOutlined,
  ReloadOutlined,
  UserOutlined,
  IdcardOutlined,
  GlobalOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SolutionOutlined,
  HistoryOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { APP_PERMISSIONS } from '@/config/appPermissions';
import { useHasPermission } from '@/hooks/api/usePagePermissions';
import {
  useMediationFollowUpDashboardCard,
  useUpdateFollowUpDescription,
} from '@/hooks/api/useMediationFollowUp';
import { InputDescriptionModal } from '@/components/followup/InputDescriptionModal';
import {
  hasFilledInputDescription,
  detectItemFormType,
  getStatusFieldName,
  ITEM_STATUS_OPTIONS,
} from '@/types/follow-up-forms.types';
import { AUTHORIZATION_SYSTEM } from '@/constants/enums';
import type {
  MediationFollowUpItem,
  MediationFollowUpDashboardCard as FollowUpCard,
} from '@/types/api.types';
import { formatDate, formatCurrency } from '../../_lib/format';
import styles from './ContractFollowUpDetail.module.css';

// ── Translations ──────────────────────────────────────────────────────────────

function useT(language: string) {
  return useMemo(() => {
    const map: Record<string, Record<string, string>> = {
      pageTitle: { ar: 'مراحل متابعة العقد', en: 'Contract Follow-Up Stages' },
      backToDashboard: { ar: 'العودة للوحة المتابعة', en: 'Back to Dashboard' },
      refresh: { ar: 'تحديث', en: 'Refresh' },
      fillForm: { ar: 'تعبئة البيانات', en: 'Fill Data' },
      description: { ar: 'الوصف / الملاحظات', en: 'Description / Notes' },
      statusPending: { ar: 'قيد الانتظار', en: 'Pending' },
      statusCompleted: { ar: 'مكتمل', en: 'Completed' },
      statusFailed: { ar: 'فشل', en: 'Failed' },
      statusSkipped: { ar: 'متجاوز', en: 'Skipped' },
      dependsOn: { ar: 'تعتمد على', en: 'Depends on' },
      maxDays: { ar: 'الحد الأقصى (يوم)', en: 'Max Days' },
      completedAt: { ar: 'تاريخ الإتمام', en: 'Completed At' },
      cannotCompleteMsg: {
        ar: 'لا يمكن تغيير الحالة حتى تكتمل المرحلة السابقة',
        en: 'Cannot change status until the previous stage is finished',
      },
      noItems: { ar: 'لا توجد مراحل متابعة لهذا العقد', en: 'No follow-up stages for this contract' },
      noItemsForFilter: { ar: 'لا توجد مراحل مطابقة لهذه التصفية', en: 'No stages match this filter' },
      inputDescription: { ar: 'البيانات المدخلة', en: 'Input Data' },
      loading: { ar: 'جاري التحميل...', en: 'Loading...' },
      dataSaved: { ar: 'تم حفظ بيانات المرحلة بنجاح', en: 'Stage data saved successfully' },
      stagesListTitle: { ar: 'مراحل المتابعة', en: 'Follow-Up Stages' },
      filterByResult: { ar: 'تصفية حسب الحالة', en: 'Filter by Status' },
      filterAll: { ar: 'جميع الحالات', en: 'All Statuses' },
      selectStagePrompt: {
        ar: 'اختر مرحلة من القائمة لعرض تفاصيلها',
        en: 'Select a stage from the list to view its details',
      },
      summaryCustomerName: { ar: 'اسم العميل', en: 'Customer Name' },
      summaryDob: { ar: 'تاريخ الميلاد', en: 'Date of Birth' },
      summaryDobHijri: { ar: 'تاريخ الميلاد (هجري)', en: 'Date of Birth (Hijri)' },
      summaryClientNationality: { ar: 'جنسية العميل', en: 'Client Nationality' },
      summaryClientNationalId: { ar: 'رقم هوية العميل', en: 'Client National ID' },
      summaryWorkerNationality: { ar: 'جنسية العامل', en: 'Worker Nationality' },
      summaryWorkerPassport: { ar: 'رقم جواز العامل', en: 'Worker Passport No.' },
      summaryAgentName: { ar: 'اسم الوكيل', en: 'Agent Name' },
      summaryContractNumber: { ar: 'رقم العقد', en: 'Contract No.' },
      summaryMusanedNumber: { ar: 'رقم مساند', en: 'Musaned No.' },
      summaryCustomerPhone: { ar: 'جوال العميل', en: 'Customer Phone' },
      summaryCustomerCity: { ar: 'مدينة العميل', en: 'Customer City' },
      summaryWorkerStatus: { ar: 'حالة العامل', en: 'Worker Status' },
      summaryWorkerAge: { ar: 'عمر العامل', en: 'Worker Age' },
      summaryWorkerReligion: { ar: 'ديانة العامل', en: 'Worker Religion' },
      summaryCurrentStage: { ar: 'المرحلة الحالية', en: 'Current Stage' },
      summaryDaysSinceUpdate: { ar: 'أيام منذ آخر تحديث', en: 'Days Since Last Update' },
      timelineTitle: { ar: 'الجدول الزمني للعقد', en: 'Contract Timeline' },
      noTimeline: { ar: 'لا يوجد سجل حالات لهذا العقد', en: 'No status history for this contract' },
      offerTitle: { ar: 'بيانات العرض', en: 'Offer Details' },
      offerAmount: { ar: 'العرض', en: 'Offer' },
      otherCosts: { ar: 'أخرى', en: 'Other Costs' },
      offerSalary: { ar: 'الراتب', en: 'Salary' },
      taxValue: { ar: 'الضريبة', en: 'Tax' },
      offerTotalCost: { ar: 'الإجمالي', en: 'Total' },
      totalPaid: { ar: 'المدفوع', en: 'Paid' },
      remainingAmount: { ar: 'المتبقي', en: 'Remaining' },
      offerPaymentStatus: { ar: 'حالة السداد', en: 'Payment Status' },
    };
    return (key: string) => map[key]?.[language] ?? map[key]?.['en'] ?? key;
  }, [language]);
}

// ── Result helpers ────────────────────────────────────────────────────────────

function resultTag(result: number | null | undefined, t: (k: string) => string) {
  switch (result) {
    case 2:
      return <Tag icon={<CheckCircleOutlined />} color="success">{t('statusCompleted')}</Tag>;
    case 3:
      return <Tag icon={<CloseCircleOutlined />} color="error">{t('statusFailed')}</Tag>;
    case 4:
      return <Tag icon={<MinusCircleOutlined />} color="default">{t('statusSkipped')}</Tag>;
    default:
      return <Tag icon={<ClockCircleOutlined />} color="processing">{t('statusPending')}</Tag>;
  }
}

function resultDotColor(result: number | null | undefined): string {
  switch (result) {
    case 2: return '#52c41a';
    case 3: return '#ff4d4f';
    case 4: return '#8c8c8c';
    default: return '#1677ff';
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContractFollowUpDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params?.contractId as string;
  const language = useAuthStore((state) => state.language);
  const isRTL = language === 'ar';
  const t = useT(language);
  const { has } = useHasPermission();
  const canManageFollowUp = has(APP_PERMISSIONS.AUTOMATIC_FOLLOW_UP_MANAGE);

  const [inputFormItem, setInputFormItem] = useState<MediationFollowUpItem | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [resultFilter, setResultFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');

  // Single call for identity + timeline + stages — see
  // Frontend_AutomaticFollowUp_README.md §4: the detail screen uses the same
  // payload as GET /dashboard/{contractId}, no separate contract/customer/
  // nationality lookups needed.
  const { data: card, isLoading, refetch } = useMediationFollowUpDashboardCard(contractId);
  const items = useMemo(() => card?.followUpStages ?? [], [card]);

  const updateDescMutation = useUpdateFollowUpDescription(contractId);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (resultFilter === 'all') return sortedItems;
    return sortedItems.filter((item) => String(item.result ?? 1) === resultFilter);
  }, [sortedItems, resultFilter]);

  // Keep a valid selection: default to the first stage, and re-pick when the
  // active filter hides the currently selected one.
  useEffect(() => {
    if (filteredItems.length === 0) {
      if (selectedItemId !== null) setSelectedItemId(null);
      return;
    }
    if (!filteredItems.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(filteredItems[0].id ?? null);
    }
  }, [filteredItems, selectedItemId]);

  const selectedItem = useMemo(
    () => sortedItems.find((item) => item.id === selectedItemId) ?? null,
    [sortedItems, selectedItemId]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openInputForm = (item: MediationFollowUpItem) => {
    if (!canManageFollowUp) return;
    setInputFormItem(item);
  };

  const handleInputFormSave = async (jsonData: string) => {
    if (!inputFormItem?.id) return;
    if (!canManageFollowUp) return;
    await updateDescMutation.mutateAsync({
      itemId: inputFormItem.id,
      inputDescription: jsonData,
    });
    setInputFormItem(null);
    message.success(t('dataSaved'));
    refetch();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className={styles.centered}>
        <Spin size="large" tip={t('loading')} />
      </div>
    );
  }

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── Header ── */}
      <PageHeader t={t} router={router} refetch={refetch} isLoading={isLoading} />

      {/* ── Summary bar — always visible, independent of stage data being filled;
          highlights (DOB, nationalities, national ID, passport, agent) shown up
          front, per the client's "مثل شاشة مساعد" request ── */}
      <SummaryHeader t={t} isRTL={isRTL} card={card} loading={isLoading && !card} />
      <OfferSummary t={t} isRTL={isRTL} card={card} loading={isLoading && !card} />

      {!isLoading && sortedItems.length === 0 ? (
        <div className={styles.centered}>
          <Empty description={t('noItems')} />
        </div>
      ) : (
        <div className={styles.layout}>
          {/* ── Middle: stages (as buttons) + selected stage's details ── */}
          <main className={styles.mainDetail}>
            <div className={styles.stagesHeader}>
              <span className={styles.sidebarTitle}>{t('stagesListTitle')}</span>
              <Select
                className={styles.stagesFilter}
                value={resultFilter}
                onChange={(v) => setResultFilter(v)}
                options={[
                  { value: 'all', label: t('filterAll') },
                  { value: '1', label: t('statusPending') },
                  { value: '2', label: t('statusCompleted') },
                  { value: '3', label: t('statusFailed') },
                  { value: '4', label: t('statusSkipped') },
                ]}
              />
            </div>
            <div className={styles.stageButtonsRow}>
              {filteredItems.length === 0 ? (
                <Empty description={t('noItemsForFilter')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                filteredItems.map((item) => (
                  <StageChip
                    key={item.id}
                    item={item}
                    idx={sortedItems.findIndex((i) => i.id === item.id)}
                    isRTL={isRTL}
                    isActive={item.id === selectedItemId}
                    onClick={() => setSelectedItemId(item.id ?? null)}
                  />
                ))
              )}
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {selectedItem ? (
              <StageDetailPanel
                item={selectedItem}
                idx={sortedItems.findIndex((i) => i.id === selectedItem.id)}
                isRTL={isRTL}
                t={t}
                onFillForm={openInputForm}
                canManage={canManageFollowUp}
              />
            ) : (
              <Card className={styles.mainDetailCard}>
                <Empty description={t('selectStagePrompt')} />
              </Card>
            )}
          </main>

          {/* ── Side: contract status timeline (§3.6 — "الحالات على جنب") ── */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarTitle}>
                <HistoryOutlined style={{ marginInlineEnd: 8 }} />
                {t('timelineTitle')}
              </span>
            </div>
            {card?.timeline && card.timeline.length > 0 ? (
              <div className={styles.timelineScroll}>
                <Timeline
                  items={card.timeline.map((event) => ({
                    color: event.isCurrent ? 'blue' : 'gray',
                    children: (
                      <div>
                        <div style={{ fontWeight: event.isCurrent ? 700 : 400 }}>
                          {(isRTL ? event.statusNameAr : event.statusNameEn) || '—'}
                        </div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                          {formatDate(event.date, isRTL ? 'ar' : 'en')}
                          {event.createdByName ? ` · ${event.createdByName}` : ''}
                        </div>
                        {event.notes && (
                          <div style={{ fontSize: 12, color: '#595959' }}>{event.notes}</div>
                        )}
                      </div>
                    ),
                  }))}
                />
              </div>
            ) : (
              <Empty description={t('noTimeline')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </aside>
        </div>
      )}

      {/* ── Input Description (structured) Modal ── */}
      <InputDescriptionModal
        item={inputFormItem}
        open={!!inputFormItem}
        onCancel={() => setInputFormItem(null)}
        onSave={handleInputFormSave}
        loading={updateDescMutation.isPending}
      />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PageHeader({
  t,
  router,
  refetch,
  isLoading,
}: {
  t: (k: string) => string;
  router: ReturnType<typeof useRouter>;
  refetch: () => void;
  isLoading: boolean;
}) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerLeft}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/contracts/mediationcontract/automaticfollowup')}
          type="text"
        >
          {t('backToDashboard')}
        </Button>
        <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
      </div>
      <Button icon={<ReloadOutlined />} onClick={refetch} loading={isLoading}>
        {t('refresh')}
      </Button>
    </div>
  );
}

// ── Summary header: key contract/customer/worker/agent facts, always shown ────

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className={styles.summaryItem}>
      <span className={styles.summaryIcon}>{icon}</span>
      <div className={styles.summaryText}>
        <span className={styles.summaryLabel}>{label}</span>
        <span className={styles.summaryValue}>{value ?? '—'}</span>
      </div>
    </div>
  );
}

function SummaryHeader({
  t,
  isRTL,
  card,
  loading,
}: {
  t: (k: string) => string;
  isRTL: boolean;
  card: FollowUpCard | undefined;
  loading: boolean;
}) {
  const highlights = card?.highlights;
  const header = card?.header;
  const worker = card?.worker;
  const dob = formatDate(highlights?.customerBirthDate, isRTL ? 'ar' : 'en');
  const nationality = highlights?.customerNationality;
  const workerNationality = isRTL ? highlights?.workerNationalityAr : highlights?.workerNationalityEn;
  const agentName = header?.agentName || highlights?.agentName;
  const workerStatus = isRTL ? header?.workerStatusNameAr : header?.workerStatusNameEn ?? header?.workerStatusNameAr;

  return (
    <Card className={styles.summaryCard} size="small" loading={loading}>
      <div className={styles.summaryGrid}>
        {card?.contractNumber != null && (
          <SummaryItem icon={<FileTextOutlined />} label={t('summaryContractNumber')} value={`#${card.contractNumber}`} />
        )}
        {card?.musanedContractNumber && (
          <SummaryItem icon={<FileTextOutlined />} label={t('summaryMusanedNumber')} value={card.musanedContractNumber} />
        )}
        <SummaryItem icon={<UserOutlined />} label={t('summaryCustomerName')} value={header?.customerName} />
        <SummaryItem icon={<CalendarOutlined />} label={t('summaryDob')} value={dob} />
        {highlights?.customerBirthDateHijri && (
          <SummaryItem icon={<CalendarOutlined />} label={t('summaryDobHijri')} value={highlights.customerBirthDateHijri} />
        )}
        <SummaryItem icon={<GlobalOutlined />} label={t('summaryClientNationality')} value={nationality} />
        <SummaryItem icon={<IdcardOutlined />} label={t('summaryClientNationalId')} value={highlights?.customerNationalId} />
        <SummaryItem icon={<PhoneOutlined />} label={t('summaryCustomerPhone')} value={header?.customerPhone} />
        <SummaryItem icon={<EnvironmentOutlined />} label={t('summaryCustomerCity')} value={header?.customerCity} />
        <SummaryItem icon={<GlobalOutlined />} label={t('summaryWorkerNationality')} value={workerNationality} />
        <SummaryItem icon={<IdcardOutlined />} label={t('summaryWorkerPassport')} value={highlights?.workerPassportNumber} />
        <SummaryItem icon={<UserOutlined />} label={t('summaryWorkerStatus')} value={workerStatus} />
        <SummaryItem icon={<CalendarOutlined />} label={t('summaryWorkerAge')} value={worker?.age} />
        <SummaryItem icon={<HeartOutlined />} label={t('summaryWorkerReligion')} value={worker?.religionNameAr} />
        <SummaryItem icon={<SolutionOutlined />} label={t('summaryAgentName')} value={agentName} />
        <SummaryItem icon={<ClockCircleOutlined />} label={t('summaryCurrentStage')} value={card?.currentFollowUpStatusNameAr} />
        <SummaryItem icon={<HistoryOutlined />} label={t('summaryDaysSinceUpdate')} value={card?.daysSinceLastUpdate} />
      </div>
    </Card>
  );
}

// ── Offer figures — Frontend_AutomaticFollowUp_README.md §3.4 ─────────────────

function OfferSummary({
  t,
  isRTL,
  card,
  loading,
}: {
  t: (k: string) => string;
  isRTL: boolean;
  card: FollowUpCard | undefined;
  loading: boolean;
}) {
  const offer = card?.offer;
  if (!loading && !offer) return null;
  const fmt = (v: number | null | undefined) => formatCurrency(v, isRTL ? 'ar' : 'en');

  return (
    <Card
      className={styles.summaryCard}
      size="small"
      loading={loading}
      title={
        <span>
          <DollarOutlined style={{ marginInlineEnd: 8 }} />
          {t('offerTitle')}
        </span>
      }
    >
      <Descriptions column={{ xs: 1, sm: 2, md: 4 }} size="small" bordered>
        <Descriptions.Item label={t('offerAmount')}>{fmt(offer?.offerAmount)}</Descriptions.Item>
        <Descriptions.Item label={t('otherCosts')}>{fmt(offer?.otherCosts)}</Descriptions.Item>
        <Descriptions.Item label={t('offerSalary')}>{fmt(offer?.salary)}</Descriptions.Item>
        <Descriptions.Item label={t('taxValue')}>{fmt(offer?.totalTaxValue)}</Descriptions.Item>
        <Descriptions.Item label={t('offerTotalCost')}>{fmt(offer?.totalCost)}</Descriptions.Item>
        <Descriptions.Item label={t('totalPaid')}>{fmt(offer?.totalPaid)}</Descriptions.Item>
        <Descriptions.Item label={t('remainingAmount')}>{fmt(offer?.remainingAmount)}</Descriptions.Item>
        <Descriptions.Item label={t('offerPaymentStatus')}>{offer?.paymentStatus || '—'}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

// ── Extract status label from inputDescription JSON ───────────────────────────

function getInputDescriptionStatusLabel(item: MediationFollowUpItem): string | null {
  if (!item.inputDescription) return null;
  let parsed: Record<string, unknown> | null = null;
  try {
    const p = JSON.parse(item.inputDescription);
    if (p && typeof p === 'object') parsed = p as Record<string, unknown>;
  } catch {
    return null;
  }
  if (!parsed) return null;

  const formType = detectItemFormType(item);
  if (!formType) return null;

  const fieldName = getStatusFieldName(formType);
  const value = parsed[fieldName];
  if (value == null) return null;

  if (fieldName === 'authorizationSystem') {
    const found = AUTHORIZATION_SYSTEM.find((o) => o.value === Number(value));
    return found?.labelAr ?? String(value);
  }

  const options = ITEM_STATUS_OPTIONS[formType] ?? [];
  const found = options.find((o) => o.value === value);
  return found?.labelAr ?? String(value);
}

// ── Stage chip — "أزرار" per Frontend_AutomaticFollowUp_README.md §3.7/§4 ─────

function StageChip({
  item,
  idx,
  isRTL,
  isActive,
  onClick,
}: {
  item: MediationFollowUpItem;
  idx: number;
  isRTL: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  const name = isRTL
    ? item.statusNameAr || item.statusNameEn
    : item.statusNameEn || item.statusNameAr;
  const isSettled = item.result != null && item.result !== 1;

  return (
    <button
      type="button"
      className={`${styles.stageButton} ${isActive ? styles.stageButtonActive : ''} ${isSettled ? styles.stageButtonSettled : ''}`}
      onClick={onClick}
    >
      <span className={styles.sidebarItemIndex}>{idx + 1}</span>
      <span>{name || '—'}</span>
      <span className={styles.sidebarItemDot} style={{ background: resultDotColor(item.result) }} />
    </button>
  );
}

// ── Human-readable label map for every JSON key ──────────────────────────────
const FIELD_LABELS: Record<string, { ar: string; en: string }> = {
  ActionDate:            { ar: 'تاريخ الإجراء',        en: 'Action Date' },
  arrivalDate:           { ar: 'تاريخ الوصول',          en: 'Arrival Date' },
  medicalStatus:         { ar: 'الحالة الطبية',          en: 'Medical Status' },
  status:                { ar: 'الحالة',                 en: 'Status' },
  contractAgentStatusId: { ar: 'الحالة',                 en: 'Status' },
  Notes:                 { ar: 'الملاحظات',              en: 'Notes' },
  authorizationSystem:   { ar: 'نظام التفويض',            en: 'Authorization System' },
  authorizationBankName: { ar: 'البنك',                   en: 'Bank' },
  AirlineCompanyId:      { ar: 'شركة الطيران',           en: 'Airline Company' },
  CarrierLines:          { ar: 'اسم الناقل',             en: 'Carrier Lines' },
  FlightNumber:          { ar: 'رقم الرحلة',             en: 'Flight Number' },
  FlightPlaceId:         { ar: 'مكان الرحلة',            en: 'Flight Place' },
  time:                  { ar: 'وقت الإقلاع',            en: 'Departure Time' },
  DayReceipt:            { ar: 'تاريخ استلام التذكرة',   en: 'Ticket Receipt Date' },
  TimeReceipt:           { ar: 'وقت استلام التذكرة',     en: 'Receipt Time' },
};

// All status options merged — used to resolve a numeric code to its label
const ALL_STATUS_OPTIONS = Object.values(ITEM_STATUS_OPTIONS).flat();

function resolveStatusValue(key: string, value: unknown): string {
  if (key === 'authorizationSystem') {
    const found = AUTHORIZATION_SYSTEM.find((o) => o.value === Number(value));
    return found?.labelAr ?? String(value);
  }
  const isStatusField =
    key === 'contractAgentStatusId' || key === 'medicalStatus' || key === 'status';
  if (isStatusField && typeof value === 'number') {
    const found = ALL_STATUS_OPTIONS.find((o) => o.value === value);
    if (found) return found.labelAr;
  }
  return String(value);
}

function ItemDetailContent({
  item,
  isRTL,
}: {
  item: MediationFollowUpItem;
  isRTL: boolean;
  t: (k: string) => string;
}) {
  if (!item.inputDescription) {
    return (
      <p style={{ color: '#aaa', textAlign: 'center', margin: '24px 0' }}>
        لا توجد بيانات مدخلة بعد
      </p>
    );
  }

  let parsed: Record<string, unknown> | null = null;
  try {
    const p = JSON.parse(item.inputDescription);
    if (p && typeof p === 'object') parsed = p as Record<string, unknown>;
  } catch {
    // legacy HTML
  }

  if (parsed) {
    return (
      <Descriptions column={1} bordered size="small" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        {Object.entries(parsed).map(([key, value]) => {
          if (value == null || value === '') return null;
          const labels = FIELD_LABELS[key];
          const label = labels
            ? isRTL
              ? labels.ar
              : `${labels.en} / ${labels.ar}`
            : key;
          return (
            <Descriptions.Item key={key} label={label}>
              {resolveStatusValue(key, value)}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    );
  }

  // Legacy HTML content
  return (
    <div
      style={{ padding: '8px 0' }}
      dangerouslySetInnerHTML={{ __html: item.inputDescription }}
    />
  );
}

// ── Center panel: full detail of the selected stage ───────────────────────────

function StageDetailPanel({
  item,
  idx,
  isRTL,
  t,
  onFillForm,
  canManage,
}: {
  item: MediationFollowUpItem;
  idx: number;
  isRTL: boolean;
  t: (k: string) => string;
  onFillForm: (item: MediationFollowUpItem) => void;
  canManage: boolean;
}) {
  const name = isRTL
    ? item.statusNameAr || item.statusNameEn
    : item.statusNameEn || item.statusNameAr;

  const dependencyOk = item.canComplete === true;
  const formFilled = hasFilledInputDescription(item.inputDescription);
  const isSettled = item.result != null && item.result !== 1;
  const inputStatusLabel = getInputDescriptionStatusLabel(item);

  return (
    <Card className={styles.mainDetailCard}>
      <div className={styles.mainDetailHeader}>
        <div className={styles.mainDetailHeaderLeft}>
          <span className={styles.mainDetailIndex}>{idx + 1}</span>
          <h2 className={styles.mainDetailTitle}>{name || '—'}</h2>
        </div>
        {inputStatusLabel ? <Tag color="blue">{inputStatusLabel}</Tag> : resultTag(item.result, t)}
      </div>

      {!dependencyOk && !isSettled && (
        <Alert
          type="warning"
          showIcon
          message={t('cannotCompleteMsg')}
          className={styles.dependsAlert}
          banner
        />
      )}

      <div className={styles.itemMeta}>
        {item.dependsOnStatusName && (
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>{t('dependsOn')}:</span>{' '}
            {item.dependsOnStatusName}
          </span>
        )}
        {item.maxDays != null && (
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>{t('maxDays')}:</span> {item.maxDays}
          </span>
        )}
        {item.completedAt && (
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>{t('completedAt')}:</span>{' '}
            {new Date(item.completedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div className={styles.mainDetailBody}>
        <div className={styles.fieldLabel}>{t('inputDescription')}</div>
        <ItemDetailContent item={item} isRTL={isRTL} t={t} />
      </div>

      {canManage && (
        <div className={styles.mainDetailActions}>
          <Tooltip title={t('fillForm')}>
            <Button
              icon={<EditOutlined />}
              onClick={() => onFillForm(item)}
              type={formFilled ? 'default' : 'primary'}
            >
              {t('fillForm')}
            </Button>
          </Tooltip>
        </div>
      )}
    </Card>
  );
}
