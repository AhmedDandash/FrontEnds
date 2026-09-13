'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  InputNumber,
  Select,
  Space,
  Tag,
  Empty,
  Spin,
  Avatar,
  Modal,
  Descriptions,
  Divider,
  Image,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  TeamOutlined,
  UserOutlined,
  IdcardOutlined,
  EyeOutlined,
  StarFilled,
  ManOutlined,
  WomanOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  TrophyOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { actionLinkProps } from '@/lib/navigation/linkProps';
import { useWorker, useAvailableWorkers } from '@/hooks/api/useWorkers';
import { useNationalities } from '@/hooks/api/useNationalities';
import {
  GENDER,
  MARITAL_STATUS,
  RELIGION,
  WORKER_CONTRACT_TYPE,
  getEnumLabel,
  toSelectOptions,
} from '@/constants/enums';
import styles from './AvailableWorkers.module.css';
import { resolveImageUrl } from '@/utils/image';
import dayjs from 'dayjs';

// Translations
const translations = {
  en: {
    pageTitle: 'Available Workers',
    searchPlaceholder: 'Search by name or passport...',
    filters: 'Filters',
    totalAvailable: 'Total Available',
    mediation: 'Mediation',
    rent: 'Rent/Operation',
    sponsorship: 'Sponsorship Transfer',
    all: 'All',
    mediationWorkers: 'Mediation Workers',
    rentWorkers: 'Rent Workers',
    sponsorshipWorkers: 'Sponsorship Workers',
    nameAr: 'Name (Arabic)',
    passportNo: 'Passport No.',
    nationality: 'Nationality',
    agent: 'Agent',
    job: 'Job',
    jobname: 'Job',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    age: 'Age',
    religion: 'Religion',
    muslim: 'Muslim',
    nonMuslim: 'Non-Muslim',
    experience: 'Experience',
    hasExperience: 'Has Experience',
    noExperience: 'No Experience',
    vip: 'VIP',
    maritalStatus: 'Marital Status',
    single: 'Single',
    married: 'Married',
    view: 'View Details',
    print: 'Print',
    noWorkers: 'No workers found',
    noWorkersDesc: 'No workers match your criteria',
    createdBy: 'Created By',
    agentName: 'Agent Name',
    years: 'years',
    type: 'Type',
    personalInfo: 'Personal Info',
    workInfo: 'Work Info',
    skills: 'Skills',
    viewWorker: 'Worker Details',
    personalDetails: 'Personal Details',
    passportDetails: 'Passport Details',
    contactDetails: 'Contact Details',
    addressDetails: 'Address Details',
    close: 'Close',
    birthDate: 'Birth Date',
    childrenCount: 'Children',
    workerType: 'Worker Type',
    basicSalary: 'Basic Salary',
    boxNumber: 'Box Number',
    borderNumber: 'Border Number',
    phone: 'Phone',
    mobile: 'Mobile',
    addressAr: 'Address (Arabic)',
    addressEn: 'Address (English)',
    referenceNo: 'Reference No.',
    passportIssueDate: 'Issue Date',
    passportExpiryDate: 'Expiry Date',
    passportIssuePlaceAr: 'Issue Place (Arabic)',
    passportIssuePlaceEn: 'Issue Place (English)',
    educationLevelAr: 'Education (Arabic)',
    educationLevelEn: 'Education (English)',
    ageMin: 'Min Age',
    ageMax: 'Max Age',
    passportFilter: 'Passport No.',
    printAll: 'Print All',
    printCV: 'Print CV',
    documents: 'Documents',
    noDocuments: 'No documents uploaded',
    passportScan: 'Passport Scan / Worker Photo',
  },
  ar: {
    pageTitle: 'العمالة المتاحة للاختيار',
    searchPlaceholder: 'البحث بالاسم أو رقم الجواز...',
    filters: 'التصفيات',
    totalAvailable: 'إجمالي المتاح',
    mediation: 'التوسط',
    rent: 'التشغيل',
    sponsorship: 'نقل الكفالة',
    all: 'الكل',
    mediationWorkers: 'عمالة التوسط',
    rentWorkers: 'عمالة التشغيل',
    sponsorshipWorkers: 'عمالة نقل الكفالة',
    nameAr: 'الاسم (عربي)',
    passportNo: 'رقم الجواز',
    nationality: 'الجنسية',
    agent: 'الوكيل',
    job: 'الوظيفة',
    jobname: 'الوظيفة',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    age: 'العمر',
    religion: 'الديانة',
    muslim: 'مسلم',
    nonMuslim: 'غير مسلم',
    experience: 'الخبرة',
    hasExperience: 'سبق له العمل',
    noExperience: 'لم يسبق له العمل',
    vip: 'VIP',
    maritalStatus: 'الحالة الاجتماعية',
    single: 'أعزب',
    married: 'متزوج',
    view: 'عرض التفاصيل',
    print: 'طباعة',
    noWorkers: 'لا يوجد عمال',
    noWorkersDesc: 'لا يوجد عمال يطابقون معايير البحث',
    createdBy: 'تم الانشاء بواسطة',
    agentName: 'اسم الوكيل',
    years: 'سنة',
    type: 'النوع',
    personalInfo: 'المعلومات الشخصية',
    workInfo: 'معلومات العمل',
    skills: 'المهارات',
    viewWorker: 'تفاصيل العامل',
    personalDetails: 'البيانات الشخصية',
    passportDetails: 'بيانات الجواز',
    contactDetails: 'بيانات التواصل',
    addressDetails: 'بيانات العنوان',
    close: 'إغلاق',
    birthDate: 'تاريخ الميلاد',
    childrenCount: 'الأطفال',
    workerType: 'نوع العامل',
    basicSalary: 'الراتب الأساسي',
    boxNumber: 'رقم الصندوق',
    borderNumber: 'رقم الحدود',
    phone: 'تليفون ارضي',
    mobile: 'الجوال',
    addressAr: 'العنوان (عربي)',
    addressEn: 'العنوان (إنجليزي)',
    referenceNo: 'رقم المرجع',
    passportIssueDate: 'تاريخ الإصدار',
    passportExpiryDate: 'تاريخ الانتهاء',
    passportIssuePlaceAr: 'مكان الإصدار (عربي)',
    passportIssuePlaceEn: 'مكان الإصدار (إنجليزي)',
    educationLevelAr: 'التعليم (عربي)',
    educationLevelEn: 'التعليم (إنجليزي)',
    ageMin: 'العمر الأدنى',
    ageMax: 'العمر الأقصى',
    passportFilter: 'رقم الجواز',
    printAll: 'طباعة الكل',
    printCV: 'طباعة السيرة الذاتية',
    documents: 'المستندات',
    noDocuments: 'لا توجد مستندات محملة',
    passportScan: 'صورة الجواز / صورة العامل',
  },
};

export default function AvailableWorkersPage() {
  const language = useAuthStore((state) => state.language);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [viewingWorkerId, setViewingWorkerId] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    search?: string;
    nationality?: string;
    gender?: string;
    ageMin?: number;
    ageMax?: number;
    passportFilter?: string;
  }>({});

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  // Server-side "available" (active + not busy on any mediation/operating/
  // transfer contract) — see WORKER_EXPLAIN.md §3. Do not re-add a
  // client-side workerStatus filter on top of this; §2 explicitly warns
  // WorkerStatus === 1 ("under processing") is not "available for pick".
  const { data: workers = [], isLoading } = useAvailableWorkers();
  const { data: viewingWorker, isLoading: isViewingLoading } = useWorker(viewingWorkerId ?? undefined);
  // Nationality dropdown is sourced from the API (active only) instead of a
  // hardcoded enum, so disabled nationalities never appear.
  const { data: nationalities = [] } = useNationalities({ isActiveOnly: true, pageSize: 100 });

  // Options: value = Arabic name (the worker list only carries `nationalityName`),
  // label follows the UI language.
  const nationalityOptions = useMemo(
    () =>
      (Array.isArray(nationalities) ? nationalities : [])
        .filter((n: any) => n?.isActive !== false)
        .map((n: any) => ({
          value: n.nationalityNameAr || n.nationalityNameEn || String(n.id),
          label: (language === 'ar' ? n.nationalityNameAr : n.nationalityNameEn) ||
            n.nationalityNameAr || n.nationalityNameEn || String(n.id),
          altNames: [n.nationalityNameAr, n.nationalityNameEn].filter(Boolean).map((s: string) => s.toLowerCase()),
        })),
    [nationalities, language]
  );

  const getGenderLabel = (g?: number | null) => getEnumLabel(GENDER, g, language);
  const getMaritalLabel = (m?: number | null) => getEnumLabel(MARITAL_STATUS, m, language);

  // Filter workers (show only active workers)
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const searchLower = filters.search?.toLowerCase() || '';
      const matchesSearch =
        !searchLower ||
        worker.fullNameAr?.toLowerCase().includes(searchLower) ||
        worker.fullNameEn?.toLowerCase().includes(searchLower) ||
        worker.passportNo?.toLowerCase().includes(searchLower);

      // Worker records carry `nationalityName` (string), so match by name.
      const matchesNationality =
        !filters.nationality ||
        (worker.nationalityName || '').toLowerCase() === String(filters.nationality).toLowerCase();
      const matchesGender = !filters.gender || worker.gender === Number(filters.gender);

      const matchesAgeMin =
        filters.ageMin === undefined || (worker.age != null && worker.age >= filters.ageMin);
      const matchesAgeMax =
        filters.ageMax === undefined || (worker.age != null && worker.age <= filters.ageMax);
      const matchesPassport =
        !filters.passportFilter ||
        worker.passportNo?.toLowerCase().includes(filters.passportFilter.toLowerCase());

      // Tab filtering based on workerType
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'mediation' && worker.workerType === WORKER_CONTRACT_TYPE[0].value) ||
        (activeTab === 'rent' && worker.workerType === WORKER_CONTRACT_TYPE[1].value) ||
        (activeTab === 'sponsorship' && worker.workerType === WORKER_CONTRACT_TYPE[2].value);

      return (
        matchesSearch &&
        matchesNationality &&
        matchesGender &&
        matchesAgeMin &&
        matchesAgeMax &&
        matchesPassport &&
        matchesTab
      );
    });
  }, [workers, filters, activeTab]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: filteredWorkers.length,
      mediation: filteredWorkers.filter((w) => w.workerType === WORKER_CONTRACT_TYPE[0].value)
        .length,
      rent: filteredWorkers.filter((w) => w.workerType === WORKER_CONTRACT_TYPE[1].value).length,
      sponsorship: filteredWorkers.filter((w) => w.workerType === WORKER_CONTRACT_TYPE[2].value)
        .length,
    };
  }, [filteredWorkers]);

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintAll = async () => {
    setIsPrinting(true);
    try {
      const { printAllWorkersPDF } = await import('@/utils/pdf');
      await printAllWorkersPDF(filteredWorkers);
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePrintCV = async (workerId: number | string) => {
    const worker = filteredWorkers.find((w) => w.id === workerId);
    if (!worker) return;
    const { printWorkerCVPDF } = await import('@/utils/pdf');
    await printWorkerCVPDF(worker);
  };

  // Tab items
  const tabs = [
    { key: 'all', label: t('all'), icon: <TeamOutlined /> },
    { key: 'mediation', label: t('mediationWorkers'), icon: <FileTextOutlined /> },
    { key: 'rent', label: t('rentWorkers'), icon: <FileTextOutlined /> },
    { key: 'sponsorship', label: t('sponsorshipWorkers'), icon: <FileTextOutlined /> },
  ];

  if (isLoading) {
    return (
      <div className={styles.availablePage}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <Spin size="large" tip={language === 'ar' ? 'جاري التحميل...' : 'Loading...'} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.availablePage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <TeamOutlined className={styles.headerIcon} />
            <div>
              <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
            </div>
          </div>
          <div className={styles.headerButtons}>
            <Button
              className={styles.printButton}
              icon={<FilePdfOutlined />}
              loading={isPrinting}
              onClick={handlePrintAll}
            >
              {t('printAll')}
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Statistics */}
      <Row gutter={16} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard} onClick={() => setActiveTab('all')}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #003366 0%, #00478c 100%)' }}
              >
                <TeamOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('totalAvailable')}</p>
                <p className={styles.statValue}>{stats.total}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard} onClick={() => setActiveTab('mediation')}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #00aa64 0%, #00c478 100%)' }}
              >
                <FileTextOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('mediation')}</p>
                <p className={styles.statValue}>{stats.mediation}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard} onClick={() => setActiveTab('rent')}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
              >
                <FileTextOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('rent')}</p>
                <p className={styles.statValue}>{stats.rent}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard} onClick={() => setActiveTab('sponsorship')}>
            <div className={styles.statContent}>
              <div
                className={styles.statIcon}
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}
              >
                <FileTextOutlined style={{ color: '#ffffff', fontSize: 24 }} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{t('sponsorship')}</p>
                <p className={styles.statValue}>{stats.sponsorship}</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <Space wrap>
            <Input
              size="large"
              placeholder={t('searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ width: 300 }}
              allowClear
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? 'primary' : 'default'}
              size="large"
            >
              {t('filters')}
            </Button>
          </Space>
        </div>

        {showFilters && (
          <div className={styles.filterContent}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('nationality')}</label>
                <Select
                  size="large"
                  placeholder={t('nationality')}
                  value={filters.nationality}
                  onChange={(value) => setFilters({ ...filters, nationality: value })}
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={nationalityOptions}
                />
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('gender')}</label>
                <Select
                  size="large"
                  placeholder={t('gender')}
                  value={filters.gender}
                  onChange={(value) => setFilters({ ...filters, gender: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {toSelectOptions([...GENDER], language).map((o) => (
                    <Select.Option key={o.value} value={String(o.value)}>
                      {o.label}
                    </Select.Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} md={6}>
                <label className={styles.filterLabel}>{t('passportFilter')}</label>
                <Input
                  size="large"
                  placeholder={t('passportFilter')}
                  value={filters.passportFilter || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, passportFilter: e.target.value || undefined })
                  }
                  allowClear
                />
              </Col>

              <Col xs={24} md={3}>
                <label className={styles.filterLabel}>{t('ageMin')}</label>
                <InputNumber
                  size="large"
                  min={0}
                  max={100}
                  placeholder={t('ageMin')}
                  value={filters.ageMin}
                  onChange={(value) =>
                    setFilters({ ...filters, ageMin: value ?? undefined })
                  }
                  style={{ width: '100%' }}
                />
              </Col>

              <Col xs={24} md={3}>
                <label className={styles.filterLabel}>{t('ageMax')}</label>
                <InputNumber
                  size="large"
                  min={0}
                  max={100}
                  placeholder={t('ageMax')}
                  value={filters.ageMax}
                  onChange={(value) =>
                    setFilters({ ...filters, ageMax: value ?? undefined })
                  }
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* Workers Cards */}
      {filteredWorkers.length === 0 ? (
        <Card className={styles.emptyState}>
          <Empty description={t('noWorkersDesc')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      ) : (
        <div className={styles.workersGrid}>
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className={styles.workerCard}>
              {/* Header */}
              <div className={styles.workerCardHeader}>
                <p className={styles.workerReference}>
                  {t('referenceNo')}: {worker.referenceNo || 'N/A'}
                </p>
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  {language === 'ar' ? 'متاح' : 'Available'}
                </Tag>
              </div>

              {/* Body */}
              <div className={styles.workerCardBody}>
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  {worker.uploadImage ? (
                    <Image
                      src={resolveImageUrl(worker.uploadImage)}
                      alt={worker.fullNameAr || 'Worker'}
                      width={100}
                      height={100}
                      style={{
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #003366',
                      }}
                      preview={{ mask: <EyeOutlined style={{ fontSize: 18 }} /> }}
                    />
                  ) : (
                    <Avatar
                      size={100}
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: worker.gender === GENDER[1].value ? '#f472b6' : '#003366',
                      }}
                    />
                  )}
                </div>

                <h3 className={styles.workerName}>
                  <UserOutlined />
                  {language === 'ar' ? worker.fullNameAr : worker.fullNameEn || worker.fullNameAr}
                </h3>

                <div className={styles.workerDetails}>
                  <div className={styles.detailRow}>
                    <IdcardOutlined className={styles.detailIcon} />
                    <span className={styles.detailLabel}>{t('passportNo')}:</span>
                    <span className={styles.detailValue}>{worker.passportNo || 'N/A'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <EnvironmentOutlined className={styles.detailIcon} />
                    <span className={styles.detailLabel}>{t('nationality')}:</span>
                    <span className={styles.detailValue}>{worker.nationalityName || 'N/A'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <TrophyOutlined className={styles.detailIcon} />
                    <span className={styles.detailLabel}>{t('jobname')}:</span>
                    <span className={styles.detailValue}>{worker.jobname || 'N/A'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <CalendarOutlined className={styles.detailIcon} />
                    <span className={styles.detailLabel}>{t('age')}:</span>
                    <span className={styles.detailValue}>
                      {worker.age ? `${worker.age} ${t('years')}` : 'N/A'}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <UserOutlined className={styles.detailIcon} />
                    <span className={styles.detailLabel}>{t('agentName')}:</span>
                    <span className={styles.detailValue}>
                      {worker.agentName || worker.agentId || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className={styles.workerBadges}>
                  {worker.gender !== undefined && worker.gender !== null && (
                    <Tag
                      color={worker.gender === GENDER[0].value ? 'blue' : 'pink'}
                      icon={worker.gender === GENDER[0].value ? <ManOutlined /> : <WomanOutlined />}
                    >
                      {getEnumLabel(GENDER, worker.gender, language)}
                    </Tag>
                  )}
                  {worker.hasExperience && (
                    <Tag color="orange" icon={<StarFilled />}>
                      {t('hasExperience')}
                    </Tag>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className={styles.workerCardActions}>
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  className={styles.actionButton}
                  {...actionLinkProps(
                    `/applicants/${worker.id}`,
                    () => setViewingWorkerId(String(worker.id))
                  )}
                >
                  {t('view')}
                </Button>
                <Button
                  type="text"
                  icon={<FilePdfOutlined />}
                  className={styles.actionButton}
                  onClick={() => handlePrintCV(worker.id)}
                >
                  {t('printCV')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={
          <Space>
            <EyeOutlined />
            <span>{t('viewWorker')}</span>
          </Space>
        }
        open={!!viewingWorkerId}
        onCancel={() => setViewingWorkerId(null)}
        footer={
          <Button type="primary" onClick={() => setViewingWorkerId(null)}>
            {t('close')}
          </Button>
        }
        width={900}
      >
        {(isViewingLoading || viewingWorker) && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {viewingWorker?.uploadImage ? (
                <Image
                  src={resolveImageUrl(viewingWorker.uploadImage)}
                  alt={viewingWorker.fullNameAr || 'Worker'}
                  width={150}
                  height={150}
                  style={{ borderRadius: '50%', objectFit: 'cover', border: '4px solid #003366' }}
                  preview={{ mask: <EyeOutlined style={{ fontSize: 20 }} /> }}
                />
              ) : (
                <Avatar
                  size={150}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor:
                      viewingWorker?.gender === GENDER[1].value ? '#f472b6' : '#003366',
                  }}
                />
              )}
              <h2 style={{ margin: '12px 0 4px', color: '#003366' }}>
                {language === 'ar'
                  ? viewingWorker?.fullNameAr
                  : viewingWorker?.fullNameEn || viewingWorker?.fullNameAr}
              </h2>
              <p style={{ color: '#6b7280', margin: 0 }}>
                {language === 'ar' ? viewingWorker?.fullNameEn : viewingWorker?.fullNameAr}
              </p>
            </div>

            <Divider />

            <Descriptions
              title={t('personalDetails')}
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label={t('referenceNo')}>
                {viewingWorker?.referenceNo || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('gender')}>
                {getGenderLabel(viewingWorker?.gender)}
              </Descriptions.Item>
              <Descriptions.Item label={t('age')}>
                {viewingWorker?.age ? `${viewingWorker.age} ${t('years')}` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('birthDate')}>
                {viewingWorker?.birthDate
                  ? dayjs(viewingWorker.birthDate).format('YYYY-MM-DD')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('maritalStatus')}>
                {getMaritalLabel(viewingWorker?.maritalStatus)}
              </Descriptions.Item>
              <Descriptions.Item label={t('childrenCount')}>
                {viewingWorker?.childrenCount ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('religion')}>
                {viewingWorker?.religion
                  ? getEnumLabel(RELIGION, viewingWorker.religion, language)
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('nationality')}>
                {viewingWorker?.nationalityName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('educationLevelAr')}>
                {viewingWorker?.educationLevelAr || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('educationLevelEn')}>
                {viewingWorker?.educationLevelEn || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title={t('passportDetails')}
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label={t('passportNo')}>
                {viewingWorker?.passportNo || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('passportIssueDate')}>
                {viewingWorker?.passportIssueDate
                  ? dayjs(viewingWorker.passportIssueDate).format('YYYY-MM-DD')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('passportExpiryDate')}>
                {viewingWorker?.passportExpiryDate
                  ? dayjs(viewingWorker.passportExpiryDate).format('YYYY-MM-DD')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('passportIssuePlaceAr')}>
                {viewingWorker?.passportIssuePlaceAr || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('passportIssuePlaceEn')}>
                {viewingWorker?.passportIssuePlaceEn || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title={t('workInfo')}
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label={t('jobname')}>
                {viewingWorker?.jobname || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('basicSalary')}>
                {viewingWorker?.basicSalary || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('agentName')}>
                {viewingWorker?.agentName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('createdBy')}>
                {viewingWorker?.userName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('workerType')}>
                {viewingWorker?.workerType
                  ? getEnumLabel(WORKER_CONTRACT_TYPE, viewingWorker.workerType, language)
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('boxNumber')}>
                {viewingWorker?.boxNumber || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('borderNumber')}>
                {viewingWorker?.borderNumber || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title={t('contactDetails')}
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label={t('mobile')}>
                {viewingWorker?.mobile || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('phone')}>
                {viewingWorker?.phone || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title={t('addressDetails')}
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
            >
              <Descriptions.Item label={t('addressAr')}>
                {viewingWorker?.addressAr || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('addressEn')}>
                {viewingWorker?.addressEn || '-'}
              </Descriptions.Item>
            </Descriptions>

            {/* Documents / Attachments */}
            <Divider />
            <div style={{ marginTop: 8 }}>
              <h4 style={{ color: '#003366', marginBottom: 12 }}>{t('documents')}</h4>
              {(() => {
                const allDocs = [
                  ...(viewingWorker?.uploadImage ? [viewingWorker.uploadImage] : []),
                  ...(viewingWorker?.attachments ?? []),
                ];
                return allDocs.length > 0 ? (
                  <Image.PreviewGroup>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {allDocs.map((src, idx) => {
                        const isPdf = src.startsWith('data:application/pdf') || src.endsWith('.pdf');
                        return isPdf ? (
                          <a
                            key={idx}
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={language === 'ar' ? `مستند PDF ${idx + 1}` : `PDF document ${idx + 1}`}
                            style={{
                              width: 120, height: 120, borderRadius: 8, border: '1px solid #e2e8f0',
                              background: '#fff0f0', display: 'flex', flexDirection: 'column',
                              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                              textDecoration: 'none',
                            }}
                          >
                            <FilePdfOutlined style={{ fontSize: 36, color: '#e53e3e' }} />
                            <span style={{ fontSize: 11, color: '#718096', marginTop: 6 }}>PDF</span>
                          </a>
                        ) : (
                          <Image
                            key={idx}
                            src={src}
                            alt={`${t('documents')} ${idx + 1}`}
                            width={120}
                            height={120}
                            style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                            preview={{ mask: <EyeOutlined /> }}
                          />
                        );
                      })}
                    </div>
                  </Image.PreviewGroup>
                ) : (
                  <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>{t('noDocuments')}</p>
                );
              })()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
