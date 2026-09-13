'use client';

import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Avatar,
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
  Modal,
  Form,
  Input,
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
  UserDeleteOutlined,
  IdcardOutlined,
  GlobalOutlined,
  FileProtectOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SolutionOutlined,
  HistoryOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  HeartOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { APP_PERMISSIONS } from '@/config/appPermissions';
import { useHasPermission } from '@/hooks/api/usePagePermissions';
import { useContractActionGates } from '@/hooks/useActionPermissionGates';
import {
  useMediationFollowUpDashboardCard,
  useUpdateFollowUpDescription,
} from '@/hooks/api/useMediationFollowUp';
import { useMediationContracts } from '@/hooks/api/useMediationContracts';
import { InputDescriptionModal } from '@/components/followup/InputDescriptionModal';
import {
  hasFilledInputDescription,
  detectItemFormType,
  getStatusFieldName,
  ITEM_STATUS_OPTIONS,
} from '@/types/follow-up-forms.types';
import { AUTHORIZATION_SYSTEM, CANCEL_BY, toSelectOptions } from '@/constants/enums';
import type {
  ContractCancelDto,
  MediationFollowUpItem,
  MediationFollowUpDashboardCard as FollowUpCard,
} from '@/types/api.types';
import { resolveImageUrl } from '@/utils/image';
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
      summaryLastUpdatedAt: { ar: 'تاريخ آخر تحديث', en: 'Last Updated On' },
      summaryDaysSinceCreation: { ar: 'أيام منذ الإنشاء', en: 'Days Since Creation' },
      summaryContractStatus: { ar: 'حالة العقد', en: 'Contract Status' },
      summaryVisaNumber: { ar: 'رقم التأشيرة', en: 'Visa Number' },
      summaryCustomerEmail: { ar: 'البريد الإلكتروني', en: 'Email' },
      summaryContractCategory: { ar: 'فئة العقد', en: 'Contract Category' },
      workerExternal: {
        ar: 'جواز معلق — العامل غير مسجّل',
        en: 'Passport pending — worker not registered',
      },
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

/**
 * Contract-status tag colour. Codes are the `statusId` values listed in
 * Frontend_AutomaticFollowUp_README.md §6.
 */
function contractStatusColor(statusId: number | null | undefined): string {
  switch (statusId) {
    case 13: // تم التسليم
    case 15: // اكتمال العقد
      return 'success';
    case 14: // فترة الضمان
    case 16: // تم إرجاع العاملة
      return 'warning';
    case 17: // ملغي
      return 'error';
    default:
      return 'processing';
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
  // Same gates the regular contract list/detail pages use for these two
  // lifecycle actions — CONTRACTS_UPDATE ends a worker's service,
  // CONTRACTS_DELETE cancels ("باك أوت") the contract.
  const contractGates = useContractActionGates();

  const [inputFormItem, setInputFormItem] = useState<MediationFollowUpItem | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [resultFilter, setResultFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [showEndServiceModal, setShowEndServiceModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [endServiceForm] = Form.useForm();
  const [cancelForm] = Form.useForm();

  // Single call for identity + timeline + stages — see
  // Frontend_AutomaticFollowUp_README.md §4: the detail screen uses the same
  // payload as GET /dashboard/{contractId}, no separate contract/customer/
  // nationality lookups needed.
  const { data: card, isLoading, refetch } = useMediationFollowUpDashboardCard(contractId);
  const items = useMemo(() => card?.followUpStages ?? [], [card]);

  const updateDescMutation = useUpdateFollowUpDescription(contractId);

  // Mutations only — `enabled: false` skips the contract list fetch this screen
  // has no use for.
  const { endWorkerService, cancelContract, isEndingWorkerService, isCancelling } =
    useMediationContracts({ enabled: false });

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

  // ── Contract lifecycle action gates ───────────────────────────────────────
  // Mirrors the list page: both actions disappear once the contract is in a
  // terminal state. Codes per Frontend_AutomaticFollowUp_README.md §6 —
  // 16 = تم إرجاع العاملة ("returned"), 17 = ملغي ("cancelled").
  const isTerminalContract = card?.statusId === 16 || card?.statusId === 17;
  // The end-service endpoint 400s when nothing is assigned, so mirror
  // MediationContractDetailView's "registered worker or pending passport" gate
  // using the fields this card actually carries.
  const hasAssignedWorker = !!(
    card?.highlights?.workerPassportNumber ||
    card?.worker?.passportNumber ||
    card?.worker?.photoUrl
  );
  const canEndWorkerService =
    !!card && !isTerminalContract && contractGates.canUpdate && hasAssignedWorker;
  const canCancelContract = !!card && !isTerminalContract && contractGates.canCancel;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEndWorkerService = async () => {
    if (!contractId || !canEndWorkerService) return;
    try {
      const values = await endServiceForm.validateFields();
      await endWorkerService({ contractId, reason: values.reason || null });
      setShowEndServiceModal(false);
      endServiceForm.resetFields();
      refetch();
    } catch {
      // validation + API errors surfaced by the mutation/hook
    }
  };

  const handleCancelContract = async () => {
    if (!contractId || !canCancelContract) return;
    try {
      const values = await cancelForm.validateFields();
      const data: ContractCancelDto = {
        contractId,
        cancelBy: values.cancelBy,
        cancelNote: values.cancelNote,
      };
      await cancelContract(data);
      setShowCancelModal(false);
      cancelForm.resetFields();
      refetch();
    } catch {
      // validation + API errors surfaced by the mutation/hook
    }
  };

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
      <PageHeader
        t={t}
        router={router}
        refetch={refetch}
        isLoading={isLoading}
        actions={
          <>
            {canEndWorkerService && (
              <Button
                danger
                icon={<UserDeleteOutlined />}
                onClick={() => {
                  endServiceForm.resetFields();
                  setShowEndServiceModal(true);
                }}
              >
                {t('endWorkerService')}
              </Button>
            )}
            {canCancelContract && (
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  cancelForm.resetFields();
                  setShowCancelModal(true);
                }}
              >
                {t('cancelContract')}
              </Button>
            )}
          </>
        }
      />

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
                    isCurrent={!!item.id && item.id === card?.currentFollowUpItemId}
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
                isCurrent={!!selectedItem.id && selectedItem.id === card?.currentFollowUpItemId}
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
              {/* §3.6: show the contract's Musaned number alongside the statuses. */}
              {card?.musanedContractNumber && (
                <div className={styles.sidebarSubtitle}>
                  {t('summaryMusanedNumber')}: {card.musanedContractNumber}
                </div>
              )}
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

      {/* ========== END WORKER SERVICE MODAL ========== */}
      <Modal
        title={
          <span>
            <UserDeleteOutlined style={{ marginInlineEnd: 8 }} />
            {t('endWorkerService')}
            {card?.contractNumber != null && ` — #${card.contractNumber}`}
          </span>
        }
        open={showEndServiceModal && canEndWorkerService}
        onCancel={() => {
          setShowEndServiceModal(false);
          endServiceForm.resetFields();
        }}
        onOk={canEndWorkerService ? handleEndWorkerService : undefined}
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
            {card?.contractNumber != null && ` — #${card.contractNumber}`}
          </span>
        }
        open={showCancelModal && canCancelContract}
        onCancel={() => {
          setShowCancelModal(false);
          cancelForm.resetFields();
        }}
        onOk={canCancelContract ? handleCancelContract : undefined}
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

// ── Sub-components ────────────────────────────────────────────────────────────

function PageHeader({
  t,
  router,
  refetch,
  isLoading,
  actions,
}: {
  t: (k: string) => string;
  router: ReturnType<typeof useRouter>;
  refetch: () => void;
  isLoading: boolean;
  /** Contract lifecycle actions — rendered alongside Refresh, so the summary
      card and the stages/timeline split below stay untouched. */
  actions?: ReactNode;
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
      <div className={styles.headerActions}>
        {actions}
        <Button icon={<ReloadOutlined />} onClick={refetch} loading={isLoading}>
          {t('refresh')}
        </Button>
      </div>
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
        {/* §3.2: render a null/blank value as "—", never hide the field. */}
        <span className={styles.summaryValue}>
          {value === null || value === undefined || value === '' ? '—' : value}
        </span>
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
  // `customer`/`agent` carry the same data as `highlights` (§3.5) — used as a
  // fallback so a field still shows if only one of the two blocks is populated.
  const customer = card?.customer;
  const agent = card?.agent;
  const lang = isRTL ? 'ar' : 'en';
  const birthDate = highlights?.customerBirthDate ?? customer?.birthDate;
  // Blank rather than formatDate's "-" placeholder, so SummaryItem renders "—".
  const dob = birthDate ? formatDate(birthDate, lang) : null;
  const lastUpdatedAt = card?.lastUpdatedAt ? formatDate(card.lastUpdatedAt, lang) : null;
  const nationality = highlights?.customerNationality ?? customer?.nationality;
  const nationalId = highlights?.customerNationalId ?? customer?.nationalId;
  const workerNationality =
    (isRTL ? highlights?.workerNationalityAr : highlights?.workerNationalityEn) ??
    worker?.nationalityAr;
  const workerPassport = highlights?.workerPassportNumber ?? worker?.passportNumber;
  const agentName = header?.agentName || highlights?.agentName || agent?.nameAr;
  const workerStatus = isRTL ? header?.workerStatusNameAr : header?.workerStatusNameEn ?? header?.workerStatusNameAr;
  const statusName = (isRTL ? card?.statusNameAr : card?.statusNameEn ?? card?.statusNameAr) || null;

  return (
    <Card className={styles.summaryCard} size="small" loading={loading}>
      {/* Identity strip — contract number + the contract's own status, so the
          detail screen states it without a trip back to the dashboard. */}
      <div className={styles.summaryTopRow}>
        <Avatar
          size={56}
          src={resolveImageUrl(worker?.photoUrl)}
          icon={<UserOutlined />}
          className={styles.summaryAvatar}
        />
        <div className={styles.summaryHeadline}>
          <span className={styles.summaryContractNo}>#{card?.contractNumber ?? '—'}</span>
          <span className={styles.summaryHeadlineSub}>{header?.customerName || '—'}</span>
        </div>
        <div className={styles.summaryTags}>
          <Tag color={contractStatusColor(card?.statusId)} className={styles.summaryStatusTag}>
            {statusName || '—'}
          </Tag>
          {worker?.isExternal && <Tag color="orange">{t('workerExternal')}</Tag>}
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <SummaryItem icon={<FileTextOutlined />} label={t('summaryContractNumber')} value={card?.contractNumber != null ? `#${card.contractNumber}` : '—'} />
        <SummaryItem icon={<FileTextOutlined />} label={t('summaryMusanedNumber')} value={card?.musanedContractNumber} />
        <SummaryItem icon={<FileProtectOutlined />} label={t('summaryContractStatus')} value={statusName} />
        <SummaryItem icon={<UserOutlined />} label={t('summaryCustomerName')} value={header?.customerName} />
        <SummaryItem icon={<CalendarOutlined />} label={t('summaryDob')} value={dob} />
        <SummaryItem icon={<CalendarOutlined />} label={t('summaryDobHijri')} value={highlights?.customerBirthDateHijri} />
        <SummaryItem icon={<GlobalOutlined />} label={t('summaryClientNationality')} value={nationality} />
        <SummaryItem icon={<IdcardOutlined />} label={t('summaryClientNationalId')} value={nationalId} />
        <SummaryItem icon={<PhoneOutlined />} label={t('summaryCustomerPhone')} value={header?.customerPhone} />
        <SummaryItem icon={<MailOutlined />} label={t('summaryCustomerEmail')} value={header?.customerEmail} />
        <SummaryItem icon={<EnvironmentOutlined />} label={t('summaryCustomerCity')} value={header?.customerCity} />
        <SummaryItem icon={<SafetyCertificateOutlined />} label={t('summaryVisaNumber')} value={header?.visaNumber} />
        <SummaryItem icon={<GlobalOutlined />} label={t('summaryWorkerNationality')} value={workerNationality} />
        <SummaryItem icon={<IdcardOutlined />} label={t('summaryWorkerPassport')} value={workerPassport} />
        <SummaryItem icon={<UserOutlined />} label={t('summaryWorkerStatus')} value={workerStatus} />
        <SummaryItem icon={<CalendarOutlined />} label={t('summaryWorkerAge')} value={worker?.age} />
        <SummaryItem icon={<HeartOutlined />} label={t('summaryWorkerReligion')} value={worker?.religionNameAr} />
        <SummaryItem icon={<SolutionOutlined />} label={t('summaryAgentName')} value={agentName} />
        <SummaryItem icon={<TagOutlined />} label={t('summaryContractCategory')} value={header?.contractCategoryName} />
        <SummaryItem icon={<ClockCircleOutlined />} label={t('summaryCurrentStage')} value={card?.currentFollowUpStatusNameAr} />
        <SummaryItem icon={<CalendarOutlined />} label={t('summaryDaysSinceCreation')} value={card?.daysSinceCreation} />
        <SummaryItem icon={<HistoryOutlined />} label={t('summaryDaysSinceUpdate')} value={card?.daysSinceLastUpdate} />
        <SummaryItem icon={<HistoryOutlined />} label={t('summaryLastUpdatedAt')} value={lastUpdatedAt} />
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
  isCurrent,
  onClick,
}: {
  item: MediationFollowUpItem;
  idx: number;
  isRTL: boolean;
  isActive: boolean;
  /** Matches `currentFollowUpItemId` — flagged visually per §3.7. */
  isCurrent: boolean;
  onClick: () => void;
}) {
  const name = isRTL
    ? item.statusNameAr || item.statusNameEn
    : item.statusNameEn || item.statusNameAr;
  const isSettled = item.result != null && item.result !== 1;

  return (
    <button
      type="button"
      className={`${styles.stageButton} ${isActive ? styles.stageButtonActive : ''} ${isSettled ? styles.stageButtonSettled : ''} ${isCurrent ? styles.stageButtonCurrent : ''}`}
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
  isCurrent,
  onFillForm,
  canManage,
}: {
  item: MediationFollowUpItem;
  idx: number;
  isRTL: boolean;
  t: (k: string) => string;
  /** Matches `currentFollowUpItemId` — flagged visually per §3.7. */
  isCurrent: boolean;
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
          {isCurrent && <Tag color="blue">{t('summaryCurrentStage')}</Tag>}
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
            {formatDate(item.completedAt, isRTL ? 'ar' : 'en')}
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
