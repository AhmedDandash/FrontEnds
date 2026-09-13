/**
 * API Type Definitions
 * Auto-generated TypeScript types from Swagger specification
 */

// ==================== Auth Types ====================
export interface LoginDto {
  email?: string | null;
  username?: string | null;
  password?: string | null;
}

export interface RegisterDto {
  username?: string | null;
  password?: string | null;
  roles?: number[] | null;
}

export interface AddAdmin {
  email?: string | null;
  password?: string | null;
  fullName?: string | null;
}

export interface ChangePasswordRequestDTO {
  currentPassword?: string | null;
  newPassword?: string | null;
  confirmNewPassword?: string | null;
}

export interface RefreshTokenRequestDTO {
  refreshToken?: string | null;
}

export interface RevokeRefreshTokenRequestDTO {
  refreshToken?: string | null;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  message?: string;
}

export interface MeResponse {
  id?: string | null;
  username?: string | null;
  email?: string | null;
  fullName?: string | null;
  roles?: string[] | null;
  permissions?: string[] | null;
}

// ==================== Branch Types ====================
export interface Branch {
  id: number | string;
  nameAr?: string | null;
  nameEn?: string | null;
  organizationTypeAr?: number | null;
  addressAr?: string | null;
  addressEn?: string | null;
  cityAr?: number | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  branchLicense?: string | null;
  commercialRegistrationNumber?: string | null;
  commercialRegistrationDate?: string | null;
  commercialRegistrationIssuedByAr?: string | null;
  laborLicenseNumber?: string | null;
  laborLicenseDate?: string | null;
  poBox?: string | null;
  postalCode?: string | null;
  managerNameAr?: string | null;
  /** renamed from EmbassyBranch */
  philippineEmbassyBranch?: string | null;
  openingConversation?: string | null;
  whatsAppWelcomeTemplate?: string | null;
  mainBranch?: number | null;
  parentBranchId?: string | null;
  parentBranchNameAr?: string | null;
  parentBranchNameEn?: string | null;
  subBranches?: Branch[];
  taxNumber?: string | null;
  domain?: string | null;
  appUrl?: string | null;
  zaka_RegistrationNameAr?: string | null;
  zaka_Commercial_Registration_Number?: string | null;
  zaka_TaxNumber?: string | null;
  zaka_Postal_Zone?: string | null;
  zaka_City_Name?: string | null;
  zaka_DistrictAr?: string | null;
  zaka_BuildingNumber?: string | null;
  zaka_StreetAr?: string | null;
  createdAt?: string | null;
  createdDate?: string | null;
  createdBy?: string | null;
  // ── Geofencing (BranchDetailsDto) ──
  latitude?: number | null;
  longitude?: number | null;
  allowedRadiusMeters?: number | null;
}

export interface BranchDto {
  parentBranchId?: string | null;
  nameAr?: string | null;
  nameEn?: string | null;
  organizationTypeAr?: number | null;
  addressAr?: string | null;
  addressEn?: string | null;
  cityAr?: number | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  branchLicense?: string | null;
  commercialRegistrationNumber?: string | null;
  commercialRegistrationDate?: string | null;
  commercialRegistrationIssuedByAr?: string | null;
  laborLicenseNumber?: string | null;
  laborLicenseDate?: string | null;
  poBox?: string | null;
  postalCode?: string | null;
  managerNameAr?: string | null;
  /** renamed from EmbassyBranch */
  philippineEmbassyBranch?: string | null;
  openingConversation?: string | null;
  whatsAppWelcomeTemplate?: string | null;
  mainBranch?: number | null;
  taxNumber?: string | null;
  domain?: string | null;
  appUrl?: string | null;
  zaka_RegistrationNameAr?: string | null;
  zaka_Commercial_Registration_Number?: string | null;
  zaka_TaxNumber?: string | null;
  zaka_Postal_Zone?: string | null;
  zaka_City_Name?: string | null;
  zaka_DistrictAr?: string | null;
  zaka_BuildingNumber?: string | null;
  zaka_StreetAr?: string | null;
  // ── Geofencing — REQUIRED on write, unlike every other field on this DTO.
  // Confirmed live (2026-08-11 Branch-module audit): POST/PUT both 400 with
  // "AllowedRadiusMeters must be greater than 0." when omitted, and the live
  // OpenAPI spec marks only these three as non-nullable on BranchDto/
  // CreateBranchDto. The edit/create form already enforces this via its own
  // `required: true` rules — this type just now matches that reality instead
  // of contradicting it.
  latitude: number;
  longitude: number;
  allowedRadiusMeters: number;
}

// ==================== Privilege/Role Types ====================
export interface Privilege {
  id: number;
  name?: string | null;
  nameAr?: string | null;
  nameEn?: string | null;
  type?: number | null; // 0 = Employee, 1 = Agent
  typeName?: string | null;
  permissions?: string[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UpdateRoleDto {
  name?: string | null;
  relatedTp?: number | null;
  nameEn?: string | null;
  type?: number | null;
  permissions?: string[] | null;
}

// ==================== Customer Types ====================
export interface Customer {
  id: number | string;
  arabicName?: string | null;
  englishName?: string | null;
  /** UUID string — userId removed in new API */
  nationality?: string | null;
  identityType?: number | null;
  identityNumber?: string | null;
  identityIssueDate?: string | null;
  /** Preferred DOB key on the new API; legacy `birthDate` kept for read tolerance. */
  dateOfBirth?: string | null;
  birthDate?: string | null;
  /** Hijri (Umm al-Qura) rendering of the same date of birth, e.g. "1410/05/15". */
  birthDateHijri?: string | null;
  /** National ID — copied from `identityNumber` server-side when left blank. */
  nationalId?: string | null;
  /** Secondary mobile number (ErpImprovementsJul2026). */
  secondaryMobileNumber?: string | null;
  maritalStatus?: number | null;
  housingType?: number | null;
  email?: string | null;
  fax?: string | null;
  poBox?: string | null;
  districtAr?: string | null;
  districtEn?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  cityAr?: string | null;
  cityEn?: string | null;
  streetAr?: string | null;
  streetEn?: string | null;
  buildingNumber?: string | null;
  additionalNumber?: string | null;
  postalCode?: string | null;
  familyMembers?: number | null;
  childrenCount?: number | null;
  domesticWorkers?: number | null;
  floorsCount?: number | null;
  roomsPerFloor?: number | null;
  bathroomsCount?: number | null;
  emergencyContactNameAr?: string | null;
  emergencyContactNameEn?: string | null;
  emergencyContactMobile?: string | null;
  emergencyJobTitle?: string | null;
  emergencyCity?: string | null;
  emergencyCompany?: string | null;
  monthlyIncome?: number | null;
  accountOwnerName?: string | null;
  bankName?: string | null;
  iban?: string | null;
  bankAccountNumber?: string | null;
  taxNumber?: string | null;
  phones?: CustomerPhoneDto[] | null;
}

export interface CreateCustomerDto {
  arabicName?: string | null;
  englishName?: string | null;
  /** UUID string — userId removed in new API */
  nationality?: string | null;
  identityType?: number | null;
  identityNumber?: string | null;
  identityIssueDate?: string | null;
  /** Preferred DOB key on the new API. */
  dateOfBirth?: string | null;
  birthDate?: string | null;
  /** Hijri (Umm al-Qura) rendering of the same date of birth, e.g. "1410/05/15". */
  birthDateHijri?: string | null;
  /** National ID — server copies from `identityNumber` when blank. */
  nationalId?: string | null;
  /** Secondary mobile number (ErpImprovementsJul2026). */
  secondaryMobileNumber?: string | null;
  maritalStatus?: number | null;
  housingType?: number | null;
  email?: string | null;
  districtAr?: string | null;
  districtEn?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  cityAr?: string | null;
  cityEn?: string | null;
  familyMembers?: number | null;
  childrenCount?: number | null;
  domesticWorkers?: number | null;
  monthlyIncome?: number | null;
  phones?: CustomerPhoneDto[] | null;
  /** Optional branch scope. If omitted, backend uses the JWT `branchId`. */
  branchId?: string | null;
}

export interface UpdateCustomerDto {
  arabicName?: string | null;
  englishName?: string | null;
  nationality?: string | null;
  identityType?: number | null;
  identityNumber?: string | null;
  identityIssueDate?: string | null;
  /** Preferred DOB key on the new API. */
  dateOfBirth?: string | null;
  birthDate?: string | null;
  /** Hijri (Umm al-Qura) rendering of the same date of birth, e.g. "1410/05/15". */
  birthDateHijri?: string | null;
  /** National ID — server copies from `identityNumber` when blank. */
  nationalId?: string | null;
  /** Secondary mobile number (ErpImprovementsJul2026). */
  secondaryMobileNumber?: string | null;
  maritalStatus?: number | null;
  housingType?: number | null;
  email?: string | null;
  districtAr?: string | null;
  districtEn?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  cityAr?: string | null;
  cityEn?: string | null;
  familyMembers?: number | null;
  childrenCount?: number | null;
  domesticWorkers?: number | null;
  monthlyIncome?: number | null;
  phones?: CustomerPhoneDto[] | null;
}

export interface CustomerPhoneDto {
  phoneNumber?: string | null;
  /** PhoneType enum — integer 1-7 */
  type?: number | null;
  isPrimary?: boolean;
}

// ==================== Document Types ====================
export interface Document {
  id: number;
  documentNameAr?: string | null;
  documentNameEn?: string | null;
  documentTypeId?: number | null;
  dateType?: number | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  reminderPeriodMonths?: number | null;
  fileNameAr?: string | null;
  fileNameEn?: string | null;
  filePath?: string | null;
}

export interface DocumentDto {
  documentNameAr?: string | null;
  documentNameEn?: string | null;
  documentTypeId?: number | null;
  dateType?: number | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  reminderPeriodMonths?: number | null;
  fileNameAr?: string | null;
  fileNameEn?: string | null;
  filePath?: string | null;
}

// ==================== Role Types ====================
export interface Role {
  id: number;
  name?: string | null;
  relatedTo?: number | null;
}

export interface CreateRoleDto {
  name?: string | null;
  relatedTo?: number | null;
}

export interface UpdateRoleDto {
  name?: string | null;
  relatedTo?: number | null;
}

// ==================== User Types ====================
export interface User {
  id: number;
  fullName?: string | null;
  username?: string | null;
  isActive?: boolean;
  roles?: string[] | null;
}

export interface UpdateUserDto {
  username?: string | null;
  isActive: boolean;
  roleIds?: number[] | null;
}

// ==================== Common Response Types ====================
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ==================== Worker/Applicant Types ====================
export interface WorkerActionDto {
  id: number | string;
  date: string;
}

export interface MedicalExaminationDto {
  /** UUID string in new API */
  workerId: string;
  examDate?: string | null;
  medicalStatus: number;
  notes?: string | null;
}

export interface MedicalExamination extends MedicalExaminationDto {
  id: number | string;
  createdAt: string;
}

export interface WorkerDto {
  referenceNo?: string | null;
  fullNameAr?: string | null;
  fullNameEn?: string | null;
  /** Optional branch scope on create. Omitted → backend uses JWT branchId. */
  branchId?: string | null;
  /** renamed from workerSatus (typo fix) */
  workerStatus?: number | null;
  religion?: number | null;
  /** UUID string in new API */
  jobId?: string | null;
  gender?: number | null; // 1 = Male, 2 = Female (Gender enum — see BACKEND_ENUMS_README.md)
  /** UUID string in new API */
  nationalityId?: string | null;
  basicSalary?: number | null;
  /** UUID string in new API */
  agentId?: string | null;
  responsibleUserId?: string | null;
  boxNumber?: string | null;
  borderNumber?: string | null;
  birthDate?: string | null;
  age?: number | null;
  addressAr?: string | null;
  addressEn?: string | null;
  maritalStatus?: number | null; // 1=Single, 2=Married, 3=Divorced, 4=Widowed (MaritalStatus enum)
  childrenCount?: number | null;
  weight?: number | null;
  height?: number | null;
  educationLevelAr?: string | null;
  educationLevelEn?: string | null;
  mobile?: string | null;
  phone?: string | null;
  nationalId?: string | null;
  passportNo?: string | null;
  passportIssueDate?: string | null;
  passportExpiryDate?: string | null;
  passportIssuePlaceAr?: string | null;
  passportIssuePlaceEn?: string | null;
  relativeNameAr?: string | null;
  relativeNameEn?: string | null;
  relativeMobile?: string | null;
  hasExperience?: boolean | null;
  /** Single string in new API (was string[]) */
  skills?: string | null;
  arabicLanguageLevel?: number | null;
  englishLanguageLevel?: number | null;
  workerType?: number | null;
  /** renamed from uploadimage; create/update sends File via multipart/form-data */
  uploadImage?: string | File | null;
  /** Worker intro video; create/update sends File via multipart/form-data */
  uploadVideo?: string | File | null;
  /** Additional document/image uploads for create/update */
  attachments?: (string | File)[] | null;
  isActive?: boolean | null;
}

export interface Worker extends WorkerDto {
  id: number | string;
  uploadImage?: string | null;
  uploadVideo?: string | null;
  attachments?: string[] | null;
  // Read-only fields from GET response
  agentName?: string | null;
  userName?: string | null;
  /** API returns as jobName (capital N) */
  jobName?: string | null;
  /** legacy lowercase alias — prefer jobName */
  jobname?: string | null;
  /** API returns nationality name directly */
  nationalityName?: string | null;
  workerEscape?: boolean;
  workerRefusedWork?: boolean;
  workerOut?: boolean;
  workerSick?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// ==================== Agent Types ====================
export interface Agent {
  id: number;
  agentNameAr?: string | null;
  agentNameEn?: string | null;
  username?: string | null;
  nationalityId?: string | null;
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  agentLicense?: string | null;
  contractType?: number | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  companyNameAr?: string | null;
  companyNameEn?: string | null;
  followUpEmails?: string | null;
  warrantyEmails?: string | null;
  accountingEmails?: string | null;
  sendAllEmails?: boolean;
  isActive?: boolean;
  contractsCount?: number;
  filesCount?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateAgentDto {
  agentNameAr?: string | null;
  agentNameEn?: string | null;
  username?: string | null;
  nationalityId?: string | null;
  agentLicense?: string | null;
  contractType?: number | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  companyNameAr?: string | null;
  companyNameEn?: string | null;
  followUpEmails?: string | null;
  warrantyEmails?: string | null;
  accountingEmails?: string | null;
  sendAllEmails?: boolean;
  isActive?: boolean;
}

export interface UpdateAgentDto {
  /** UUID — required by new PUT /api/V1/Agent/{id} body */
  id: string;
  agentNameAr?: string | null;
  agentNameEn?: string | null;
  username?: string | null;
  nationalityId?: string | null;
  agentLicense?: string | null;
  contractType?: number | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  companyNameAr?: string | null;
  companyNameEn?: string | null;
  followUpEmails?: string | null;
  warrantyEmails?: string | null;
  accountingEmails?: string | null;
  sendAllEmails?: boolean | null;
  isActive?: boolean | null;
}

// ==================== Agent Job Types ====================
// AgentJob — per-agent, per-job cost/commission agreement (d-8-9.md).
export interface AgentJob {
  id: string;
  agentId: string;
  agentNameAr?: string | null;
  agentNameEn?: string | null;
  jobId: string;
  jobNameAr?: string | null;
  jobNameEn?: string | null;
  workerType?: number | null;
  workerTypeName?: string | null;
  previousExperience?: number | null;
  previousExperienceName?: string | null;
  cost: number;
  alternativeCost: number;
  percentAfterSelection: number;
  percentAfterVisa: number;
  percentAfterArrival: number;
  isActive: boolean;
  notes?: string | null;
  branchId?: string | null;
  createdDate?: string | null;
}

export interface CreateAgentJobDto {
  agentId: string;
  jobId: string;
  workerType?: number | null;
  previousExperience?: number | null;
  cost: number;
  alternativeCost?: number;
  percentAfterSelection: number;
  percentAfterVisa: number;
  percentAfterArrival: number;
  notes?: string | null;
  isActive?: boolean;
}

export interface UpdateAgentJobDto extends CreateAgentJobDto {
  id: string;
}

export interface ResolveAgentJobDto {
  agentId: string;
  jobId: string;
  workerType?: number | null;
  previousExperience?: number | null;
  useAlternativeCost?: boolean;
}

export interface ResolveAgentJobResult {
  found: boolean;
  jobBelongsToAgent: boolean;
  message?: string | null;
  agentJobId?: string | null;
  agentId?: string | null;
  jobId?: string | null;
  jobNameAr?: string | null;
  cost?: number | null;
  alternativeCost?: number | null;
  agentCostSAR?: number | null;
  percentAfterSelection?: number | null;
  percentAfterVisa?: number | null;
  percentAfterArrival?: number | null;
  workerType?: number | null;
  previousExperience?: number | null;
}

export interface AgentDuesSummary {
  agentId?: string | null;
  agentNameAr?: string | null;
  totalDue: number;
  accrued: number;
  paid: number;
  remainingToAccrue: number;
  remainingToPay: number;
  percentAfterSelection: number;
  percentAfterVisa: number;
  percentAfterArrival: number;
  selectionAmount: number;
  visaAmount: number;
  arrivalAmount: number;
  currency?: string | null;
}

// ==================== Job Types ====================
export interface Job {
  id: number;
  jobNameAr?: string | null;
  jobNameEn?: string | null;
  hasWorkCard?: boolean;
  workCardFees?: number | null;
  isActive?: boolean;
}

export interface CreateJobDto {
  jobNameAr?: string | null;
  jobNameEn?: string | null;
  hasWorkCard?: boolean;
  workCardFees?: number | null;
  isActive?: boolean;
}

export interface UpdateJobDto {
  jobNameAr?: string | null;
  jobNameEn?: string | null;
  hasWorkCard?: boolean;
  workCardFees?: number | null;
  isActive?: boolean;
}

// ==================== Nationality Types ====================
/** 1 = Customers catalog, 2 = Contracts catalog — separate lists (FRONTEND_NATIONALITY_API.md). */
export type NationalityType = 1 | 2;
export const NATIONALITY_TYPE_VALUES = { Customers: 1, Contracts: 2 } as const satisfies Record<string, NationalityType>;
export const NATIONALITY_TYPE_LABELS: Record<NationalityType, { ar: string; en: string }> = {
  1: { ar: 'عملاء', en: 'Customers' },
  2: { ar: 'عقود', en: 'Contracts' },
};

export interface Nationality {
  /** UUID string per swagger */
  id: string;
  /** @deprecated Not present on the current NationalityDto — resolve by `id` (GUID) instead. */
  nationalityId?: number | null;
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  isActive?: boolean;
  /** Which catalog this nationality belongs to — Customers or Contracts. */
  type?: NationalityType;
  createdDate?: string | null;
  updatedDate?: string | null;
}

// NOTE: the legacy RecruitmentRequest DTOs (RecruitmentRequest,
// CreateRecruitmentRequestDto, ChoiceCustomerDto, ChoiceWorkerDto,
// RequestActionDto) were removed alongside the `/api/RecruitmentRequest`
// service. The current recruitment view uses `RecruitmentRequestItem` (defined
// in the Mediation Contract section).

// ==================== Operating Contract Offer Types ====================
// (renamed from EmploymentContractOffer — endpoint is now /api/OperatingContractOffer)
export interface OperatingContractOffer {
  id: number | string;
  offerType?: number | null;
  offerContractType?: number | null;
  offerTitle?: string | null;
  numberOfDays?: number | null;
  /** UUID string in new API */
  nationalityId?: string | null;
  nationalityName?: string | null;
  /** UUID string in new API */
  jobId?: string | null;
  jobName?: string | null;
  duration?: number | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  showForExternalCustomers?: boolean | null;
  showForReception?: boolean | null;
  isActive?: boolean | null;
  cost?: number | null;
  costTax?: number | null;
  promissoryNoteAmount?: number | null;
  insurance?: number | null;
  previousExperience?: number | null;
  dailyPriceWithoutTax?: number | null;
  workerSalary?: number | null;
  totalCostWithTax?: number | null;
  /** UUID string in new API */
  branchId?: string | null;
  branchName?: string | null;
  offersCount?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

/** @deprecated Use OperatingContractOffer */
export type EmploymentContractOffer = OperatingContractOffer;

export interface CreateOperatingContractOfferDto {
  offerType?: number | null;
  offerContractType?: number | null;
  offerTitle?: string | null;
  numberOfDays?: number | null;
  /** UUID string */
  nationalityId?: string | null;
  /** UUID string */
  jobId?: string | null;
  duration?: number | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  showForExternalCustomers?: boolean | null;
  showForReception?: boolean | null;
  isActive?: boolean | null;
  cost?: number | null;
  costTax?: number | null;
  promissoryNoteAmount?: number | null;
  insurance?: number | null;
  previousExperience?: number | null;
  dailyPriceWithoutTax?: number | null;
  workerSalary?: number | null;
  totalCostWithTax?: number | null;
  /** UUID string */
  branchId?: string | null;
}

/** @deprecated Use CreateOperatingContractOfferDto */
export type CreateEmploymentContractOfferDto = CreateOperatingContractOfferDto;

export interface UpdateOperatingContractOfferDto extends CreateOperatingContractOfferDto {}

/** @deprecated Use UpdateOperatingContractOfferDto */
export type UpdateEmploymentContractOfferDto = UpdateOperatingContractOfferDto;

export interface EmploymentContractOfferSummary {
  nationalityId?: string | null;
  nationalityName?: string | null;
  jobId?: string | null;
  jobName?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  availableOffersCount?: number | null;
  offersCount?: number | null;
}

// ==================== Employment Operating Contract Types ====================
// ContractStatus enum: 1=Draft, 2=Signed, 3=Executing, 4=Finished
export const CONTRACT_STATUS_VALUES = {
  Draft: 1,
  Signed: 2,
  Executing: 3,
  Finished: 4,
} as const;

export interface EmploymentOperatingContract {
  id: number | string;
  contractNumber?: number | string | null;
  createdBy?: number | string | null;
  createdAt?: string | null;
  customerId?: number | string | null;
  customerNameAr?: string | null;
  /** English customer name (ErpImprovementsJul2026). */
  customerNameEn?: string | null;
  mobile?: string | null;
  /** Customer phone (ErpImprovementsJul2026). */
  customerPhone?: string | null;
  /** Customer national ID (ErpImprovementsJul2026). */
  customerNationalId?: string | null;
  customerIdentiy?: string | null;
  marketerId?: number | string | null;
  contractCategory?: number | null;
  offerId?: number | string | null;
  offerContractType?: number | null;
  offerType?: number | null;
  operationType?: number | null;
  paymentMethod?: number | null;
  /** UUID string per swagger */
  nationalityId?: string | null;
  nationalityName?: string | null;
  /** UUID string per swagger */
  jobId?: string | null;
  jobName?: string | null;
  duration?: number | null;
  /** Readable duration labels from the API (1=Monthly, 3=Quarterly, 6=Semi, 12=Annual). */
  durationNameAr?: string | null;
  durationNameEn?: string | null;
  /** Branch scoping fields (ErpImprovementsJul2026). */
  branchId?: string | null;
  branchNameAr?: string | null;
  branchNameEn?: string | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  previousExperience?: number | null;
  offerPrice?: number | null;
  workerId?: number | string | null;
  laborManagement?: number | null;
  workerNameEn?: string | null;
  workerNameAr?: string | null;
  workerPhone?: string | null;
  /** Assigned worker photo (relative R2 key — resolve via resolveImageUrl). */
  workerPhotoUrl?: string | null;
  /** FEdits-2 successor field; resolves from the same source as workerPhotoUrl. */
  workerImageUrl?: string | null;
  workersCount?: number | null;
  customerAddress?: string | null;
  cost?: number | null;
  insurance?: number | null;
  costTax?: number | null;
  totalCostWithTax?: number | null;
  // ContractStatus: 1=Draft, 2=Signed, 3=Executing, 4=Finished
  contractStatus?: number | null;
  contractStatusName?: string | null;
  isFinish?: boolean | null;
  finishBy?: string | null;
  finishDate?: string | null;
  noteFinish?: string | null;
}

export interface CreateEmploymentOperatingContractDto {
  customerId?: number | null;
  marketerId?: number | null;
  contractCategory?: number | null;
  offerId?: number | null;
  operationType?: number | null;
  paymentMethod?: number | null;
  /** UUID string per swagger */
  nationalityId?: string | null;
  /** UUID string per swagger */
  jobId?: string | null;
  duration?: number | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  previousExperience?: number | null;
  offerPrice?: number | null;
  /** UUID string per swagger — links the contract to an existing worker record */
  workerId?: string | null;
  laborManagement?: number | null;
  workerNameEn?: string | null;
  workerNameAr?: string | null;
  workerPhone?: string | null;
  workersCount?: number | null;
  cost?: number | null;
  insurance?: number | null;
  customerAddress?: string | null;
}

export interface UpdateEmploymentOperatingContractDto {
  customerId?: number | null;
  marketerId?: number | null;
  contractCategory?: number | null;
  offerId?: number | null;
  operationType?: number | null;
  paymentMethod?: number | null;
  /** UUID string per swagger */
  nationalityId?: string | null;
  /** UUID string per swagger */
  jobId?: string | null;
  duration?: number | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  previousExperience?: number | null;
  offerPrice?: number | null;
  /** UUID string per swagger — links the contract to an existing worker record */
  workerId?: string | null;
  laborManagement?: number | null;
  workerNameEn?: string | null;
  workerNameAr?: string | null;
  workerPhone?: string | null;
  workersCount?: number | null;
  cost?: number | null;
  insurance?: number | null;
  customerAddress?: string | null;
}

/** POST /api/EmploymentOperatingContract/{id}/renew */
export interface RenewContractDto {
  newEndDate: string;
}

/**
 * POST /api/EmploymentOperatingContract/{id}/terminate
 * Creates a Draft credit note (revenue reversal). When `refundAmount` > 0 the
 * credit note also credits Customer Payable; the cash is paid out separately via
 * the customer-refund endpoint.
 */
export interface TerminateContractDto {
  /** Termination reason / notes */
  note?: string | null;
  /** Amount owed back to the customer (defaults to 0) */
  refundAmount?: number | null;
}

/**
 * POST /api/EmploymentOperatingContract/{id}/customer-refund
 * Records the cash refund payment to the customer after termination.
 */
export interface CustomerRefundDto {
  /** Cash refund amount — required */
  amount: number;
  /** 1=Cash, 2=Bank, 3=Card (default 1) */
  paymentMethod?: number | null;
  /** Journal description */
  description?: string | null;
}

/**
 * GET /api/EmploymentOperatingContract/{id}/print-receipt-form
 * The endpoint returns `{ message, contract }` where `contract` is the full
 * EmploymentOperatingContract. Lookup names (customer/nationality/job) are not
 * included, so the client merges them into `display` before rendering.
 */
export interface ContractPrintReceiptData {
  message?: string | null;
  contract: EmploymentOperatingContract;
  /** Resolved display names merged client-side from the lookups */
  display?: {
    customerName?: string;
    customerPhone?: string;
    nationalityName?: string;
    jobName?: string;
  };
}

/**
 * GET /api/EmploymentOperatingContract/{id}/print-delivery-form
 * Full data for the worker-delivery (handover) form. `workerPhotoUrl` is a
 * relative R2 key — resolve via resolveImageUrl.
 */
export interface OperatingContractDeliveryFormDto {
  contractId?: string | null;
  contractNumber?: number | string | null;
  deliveryDate?: string | null;
  branchNameAr?: string | null;
  branchNameEn?: string | null;
  employeeName?: string | null;
  customerNameAr?: string | null;
  customerNameEn?: string | null;
  customerPhone?: string | null;
  customerNationalId?: string | null;
  customerAddress?: string | null;
  workerNameAr?: string | null;
  workerNameEn?: string | null;
  workerPhone?: string | null;
  workerPassportNumber?: string | null;
  workerPhotoUrl?: string | null;
  /** FEdits-2 successor field; resolves from the same source as workerPhotoUrl. */
  workerImageUrl?: string | null;
  customerSignedAt?: string | null;
  workerSignedAt?: string | null;
  companyRepresentativeSignedAt?: string | null;
  notes?: string | null;
}

/** POST /api/EmploymentOperatingContract/{id}/delivery-form */
export interface SaveDeliveryFormDto {
  deliveryDate?: string | null;
  employeeName?: string | null;
  notes?: string | null;
  customerSignedAt?: string | null;
  workerSignedAt?: string | null;
  companyRepresentativeSignedAt?: string | null;
}

// ==================== Worker Delivery Record (FEdits-2 §5) ====================
// Separate entity from OperatingContractDeliveryFormDto above — that one is the
// contract-scoped internal handover checklist (signature timestamps, blank
// print lines); this one is the signed receipt of custody, proving who
// physically took the worker (often not the contract customer — a relative,
// driver, or company rep), with a captured signature image. Both coexist.
//
// All shapes below confirmed against the LIVE API on 2026-08-03 (create via
// swagger + a real POST; read/print via a real GET on a created record —
// swagger has no response schema for those). Two corrections from an earlier
// swagger-only pass: the print DTO uses flat `workerName`/`customerName`
// (not Ar/En split) and `operationContractNumber` (not `contractNumber`);
// there is no `workerPhone`/`customerAddress` in the print response.
//
// KNOWN BACKEND BUG: `signatureImage` crashes the create/update endpoint with
// an unhandled 500 (empty response body) once the payload exceeds roughly a
// few hundred bytes of base64 — confirmed live: 638 chars → 201, 7100 chars →
// 500. Frontend mitigates with ink-bounding-box trimming (SignaturePad) plus
// a retry-without-signature fallback (WorkerDeliveryRecordModal) — but this
// is a real server defect that should be reported to the backend team (looks
// like a column-length limit throwing instead of returning 400).

export interface CreateWorkerDeliveryRecordDto {
  operationContractId: string;
  workerId: string;
  customerId: string;
  /** ISO date-time */
  deliveryDate: string;
  receiverName: string;
  receiverNationalId: string;
  notes?: string | null;
  /** data:image/png;base64,… or null. See the known-bug note above. */
  signatureImage?: string | null;
}

export interface UpdateWorkerDeliveryRecordDto {
  deliveryDate: string;
  receiverName: string;
  receiverNationalId: string;
  notes?: string | null;
  signatureImage?: string | null;
}

/** GET /api/WorkerDeliveryRecord/{id} — confirmed live. */
export interface WorkerDeliveryRecordDto {
  id: string;
  operationContractId: string;
  workerId: string;
  customerId: string;
  deliveryDate?: string | null;
  receiverName?: string | null;
  receiverNationalId?: string | null;
  notes?: string | null;
  signatureImage?: string | null;
  createdBy?: string | null;
  createdAt?: string | null;
}

/** GET /api/WorkerDeliveryRecord/{id}/print — confirmed live (flat DTO: the entity's own fields plus joined display fields). */
export interface WorkerDeliveryRecordPrintDto {
  id?: string | null;
  operationContractId?: string | null;
  operationContractNumber?: number | string | null;
  workerId?: string | null;
  workerName?: string | null;
  workerPassportNumber?: string | null;
  /** Relative R2 key — resolve via resolveImageUrl. */
  workerImageUrl?: string | null;
  customerId?: string | null;
  customerName?: string | null;
  customerNationalId?: string | null;
  customerPhone?: string | null;
  branchNameAr?: string | null;
  branchNameEn?: string | null;
  deliveryDate?: string | null;
  receiverName?: string | null;
  receiverNationalId?: string | null;
  signatureImage?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  createdAt?: string | null;
}

// ==================== Complaint Types ====================
// ComplaintSource enum (new API): 1=Customer, 2=Worker, 3=Agent, 4=Embassy, 5=Ministry, 6=Contract
// ComplaintPriority enum: 1=Green, 2=Yellow, 3=Red
// ComplaintStatus enum: 1=Open, 2=Hold, 3=Finished
export interface Complaint {
  id: number | string;
  complaintNumber?: string | null;
  // new field name (replaces old complaintFrom)
  source?: number | null;
  sourceName?: string | null;
  priority?: number | null;
  priorityName?: string | null;
  customerId?: number | string | null;
  workerId?: number | string | null;
  workerLocation?: number | null;
  workerLocationName?: string | null;
  // renamed from contractType / contractId
  relatedContractType?: number | null;
  relatedContractId?: number | string | null;
  notesAr?: string | null;
  notesEn?: string | null;
  createdAt?: string | null;
  createdDate?: string | null;
  createdBy?: number | string | null;
  updatedAt?: string | null;
  updatedBy?: number | string | null;
  // Read-only joined fields from API response
  customerName?: string | null;
  workerName?: string | null;
  contractNumber?: string | null;
  // Status flags from API
  isFinish?: boolean | null;
  finishNote?: string | null;
  ishold?: boolean | null;
  holdReason?: string | null;
  statusName?: string | null;
  hasIssue?: boolean | null;
  // GET /api/Complaint/{id} returns array of updates
  updates?: ComplaintUpdate[] | null;
  status?: number | null;
}

/** POST /api/Complaint — create a new complaint */
export interface CreateComplaintDto {
  // ComplaintSource: 1=Customer, 2=Worker, 3=Agent, 4=Embassy, 5=Ministry, 6=Contract
  source?: number | null;
  // ComplaintPriority: 1=Green, 2=Yellow, 3=Red
  priority?: number | null;
  customerId?: number | string | null;
  workerId?: number | string | null;
  workerLocation?: number | null;
  relatedContractType?: number | null;
  relatedContractId?: number | string | null;
  notesAr?: string | null;
  notesEn?: string | null;
}

/** POST /api/Complaint/update — add a note/update to an existing complaint */
export interface CreateComplaintUpdateDto {
  complaintId: number | string;
  noteAr?: string | null;
  noteEn?: string | null;
}

export interface ComplaintUpdate {
  id: number | string;
  complaintId?: number | string | null;
  noteAr?: string | null;
  noteEn?: string | null;
  createdAt?: string | null;
  createdByName?: string | null;
}

/** POST /api/Complaint/issue — multipart/form-data */
export interface AddIssueDto {
  complaintId: number | string;
  incomingNumber?: string | null;
  // SubmissionAuthority: 1=LaborOffice, 2=Court, 3=Police, 4=LaborCommittee
  submissionAuthority?: number | null;
  transactionDate?: string | null;
  // Binary file objects for multipart upload
  file1?: File | null;
  file2?: File | null;
}

export interface ComplaintIssue {
  id: number | string;
  complaintParentId?: number | string | null;
  incomingNumber?: string | null;
  submissionAuthority?: number | null;
  submissionAuthorityName?: string | null;
  submissionAuthorityNameAr?: string | null;
  submissionAuthorityNameEn?: string | null;
  transactionDate?: string | null;
  attachmentPath1?: string | null;
  attachmentPath2?: string | null;
  status?: number | null;
  createdAt?: string | null;
  createdBy?: number | string | null;
}

// ==================== Nationality Extended Types ====================
/** @deprecated Legacy — use Nationality from new API */
export interface NationalityExtended {
  id: number | string;
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  isActive?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateNationalityDto {
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  isActive?: boolean | null;
  /** Required — 1 = Customers catalog, 2 = Contracts catalog. */
  type: NationalityType;
}

export interface UpdateNationalityDto {
  /** UUID — required in new PUT body, must match the URL id */
  id: string;
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  isActive?: boolean | null;
  /** Required — 1 = Customers catalog, 2 = Contracts catalog. */
  type: NationalityType;
}

// ==================== Mediation Contract Offer Types ====================
export interface MediationContractOffer {
  id: string;
  offerNumber?: number | null;
  /** ContractNationality.id (integer PK from /api/FollowUp/ContractNationality/GetAll) */
  nationalityId?: string | null;
  /** UUID string */
  jobId?: string | null;
  workerType?: number | null;
  workerTypeName?: string | null;
  previousExperience?: number | null;
  previousExperienceName?: string | null;
  salary?: number | null;
  localCost?: number | null;
  taxLocalCost?: number | null;
  agentCostSAR?: number | null;
  totalOfferCost?: number | null;
  showForExternalCustomers?: boolean | null;
  showForReception?: boolean | null;
  isActive?: boolean | null;
  // Read-only joined fields from API response
  nationalityName?: string | null;
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  jobName?: string | null;
  jobNameAr?: string | null;
  createdAt?: string | null;
  createdDate?: string | null;
  updatedAt?: string | null;
}

/** POST /api/Mediation/MediationContractOffer/auto-fill */
export interface MediationOfferAutoFillDto {
  /** ContractNationality.id (integer PK from /api/FollowUp/ContractNationality/GetAll) */
  nationalityId?: string | null;
  /** UUID string */
  jobId?: string | null;
  workerType?: number | null;
  previousExperience?: number | null;
}

export interface CreateMediationContractOfferDto {
  /** ContractNationality.id (integer PK from /api/FollowUp/ContractNationality/GetAll), sent as string */
  nationalityId?: string | null;
  /** UUID string */
  jobId?: string | null;
  workerType?: number | null;
  previousExperience?: number | null;
  localCost?: number | null;
  agentCostSAR?: number | null;
  salary?: number | null;
  taxLocalCost?: number | null;
  showForExternalCustomers?: boolean;
  showForReception?: boolean;
}

export interface UpdateMediationContractOfferDto {
  /** UUID — required in request body per swagger (PUT /MediationContractOffer) */
  id: string;
  /** ContractNationality.id (integer PK from /api/FollowUp/ContractNationality/GetAll), sent as string */
  nationalityId?: string | null;
  /** UUID string */
  jobId?: string | null;
  workerType?: number | null;
  previousExperience?: number | null;
  localCost?: number | null;
  agentCostSAR?: number | null;
  salary?: number | null;
  taxLocalCost?: number | null;
  showForExternalCustomers?: boolean;
  showForReception?: boolean;
}

// ==================== Mediation Contract Types ====================
export interface MediationContract {
  id: string;
  contractNumber?: number | null;
  statusId?: number | null;
  statusName?: string | null;
  contractType?: number | null;
  contractTypeName?: string | null;
  customerId?: string | null;
  workerId?: string | null;
  workerName?: string | null;
  workerPassportNumber?: string | null;
  workerNationalityAr?: string | null;
  workerTypeName?: string | null;
  nationalityId?: number | null;
  customerNationalId?: string | null;
  musanedContractNumber?: string | null;
  musanedDocumentationNumber?: string | null;
  marketerId?: string | null;
  contractCategory?: number | null;
  offerId?: string | null;
  offerAmount?: number | null;
  visaType?: number | null;
  visaNumber?: string | null;
  visaStatusName?: string | null;
  visaDateHijri?: string | null;
  visaDate?: string | null;
  isComprehensiveQualificationVisa?: boolean | null;
  arrivalDestinationId?: number | null;
  arrivalDestinationName?: string | null;
  localCost?: number | null;
  agentCostSAR?: number | null;
  salary?: number | null;
  otherCosts?: number | null;
  totalTaxValue?: number | null;
  managerDiscount?: number | null;
  costDiscount?: number | null;
  totalCost?: number | null;
  costDescription?: string | null;
  hasContractInsurance?: boolean | null;
  domesticWorkerInsurance?: number | null;
  // Read-only / joined fields from API
  customerName?: string | null;
  customerNameAr?: string | null;
  customerPhone?: string | null;
  nationalityName?: string | null;
  nationalityNameAr?: string | null;
  jobName?: string | null;
  jobNameAr?: string | null;
  agentId?: string | null;
  agentName?: string | null;
  /** Stage-commission percents resolved from the linked AgentJob (d-8-9.md). */
  percentAfterSelection?: number | null;
  percentAfterVisa?: number | null;
  percentAfterArrival?: number | null;
  /** Agent payable amounts accrued/paid via journal drafts. */
  agentAccruedSAR?: number | null;
  agentPaidSAR?: number | null;
  branchName?: string | null;
  /** Branch scoping fields (ErpImprovementsJul2026). */
  branchId?: string | null;
  branchNameAr?: string | null;
  branchNameEn?: string | null;
  /** Current worker photo (relative R2 key — resolve via resolveImageUrl). */
  workerPhotoUrl?: string | null;
  /** FEdits-2 successor field; resolves from the same source as workerPhotoUrl. */
  workerImageUrl?: string | null;
  /** Nested current-worker shape returned by list/detail endpoints. */
  worker?: MediationContractWorkerInfo | null;
  /** True when a worker is currently assigned to the contract. */
  hasAssignedWorker?: boolean | null;
  /**
   * Passport number for a worker not yet in the system (no Worker row yet).
   * Set via create (workerPassportNumber without workerId) or
   * `set-pending-worker-passport`; cleared once a real worker is assigned.
   */
  pendingWorkerPassportNumber?: string | null;
  /** True when the contract's invoice has been paid. */
  isPaid?: boolean | null;
  // ── Customer-payment / financial summary fields (list + detail responses). ──
  totalPaid?: number | null;
  remainingAmount?: number | null;
  /** 0-100 percentage of the total contract value paid so far. */
  paymentPercentage?: number | null;
  /** Arabic label: "غير مدفوع" / "مدفوع جزئياً" / "مدفوع بالكامل". */
  paymentStatus?: string | null;
  /** 0=Unpaid, 1=PartiallyPaid, 2=Paid. */
  paymentStatusCode?: number | null;
  currency?: string | null;
  invoicePaymentDate?: string | null;
  contractCategoryName?: string | null;
  createdByName?: string | null;
  daysSinceCreation?: number | null;
  contractEndNote?: string | null;
  cancelBy?: number | null;
  cancelNote?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateMediationContractDto {
  contractType?: number | null;
  customerId?: string | null;
  /** Optional — omit to create without a worker (assign one later). Worker UUID. */
  workerId?: string | null;
  /**
   * Passport number. If `workerId` is set, used for identity verification.
   * If set WITHOUT `workerId`, the backend stores it as
   * `pendingWorkerPassportNumber` (worker not yet in the system).
   */
  workerPassportNumber?: string | null;
  /** Required per swagger — offer UUID */
  offerId?: string | null;
  marketerId?: string | null;
  visaNumber?: string | null;
  visaDate?: string | null;
  // visaType removed from creation (ErpImprovementsJul2026) — no longer sent.
  visaDateHijri?: string | null;
  isComprehensiveQualificationVisa?: boolean | null;
  arrivalDestinationId?: number | null;
  otherCosts?: number | null;
  managerDiscount?: number | null;
  costDiscount?: number | null;
  costDescription?: string | null;
  hasContractInsurance?: boolean | null;
  domesticWorkerInsurance?: number | null;
  attachments?: File[];
}

export interface ContractCancelDto {
  contractId: string;
  cancelBy?: number | null;
  cancelNote?: string | null;
}

// ==================== Mediation Worker Assignment ====================

/** One row of a contract's worker-assignment history (`workerAssignments[]`). */
export interface MediationWorkerAssignment {
  id?: string | null;
  workerId?: string | null;
  workerNameAr?: string | null;
  workerNameEn?: string | null;
  workerPassportNumber?: string | null;
  /** Relative R2 key — resolve via resolveImageUrl. */
  workerPhotoUrl?: string | null;
  /** FEdits-2 successor field; resolves from the same source as workerPhotoUrl. */
  workerImageUrl?: string | null;
  assignedAt?: string | null;
  endedAt?: string | null;
  endReason?: string | null;
  isActive?: boolean | null;
}

export interface MediationContractWorkerInfo {
  id?: string | null;
  name?: string | null;
  passportNumber?: string | null;
  imageUrl?: string | null;
  isExternal?: boolean | null;
}

/** POST /api/Mediation/MediationContract/end-worker-service */
export interface EndWorkerServiceDto {
  contractId: string;
  reason?: string | null;
}

/** POST /api/Mediation/MediationContract/assign-worker */
export interface AssignWorkerDto {
  contractId: string;
  workerId?: string | null;
  workerPassportNumber?: string | null;
}

/**
 * POST /api/Mediation/MediationContract/set-pending-worker-passport
 * For a worker not yet in the system. Fails if the contract already has an
 * assigned worker, or if the passport already exists as a real Worker row.
 */
export interface SetPendingWorkerPassportDto {
  contractId: string;
  workerPassportNumber: string;
}

// ==================== Mediation Contract Lifecycle DTOs ====================

/** POST /api/Mediation/MediationContract/sign */
export interface SignMediationContractDto {
  contractId: string;
  musanedContractNumber?: string | null;
  /** ISO datetime string — optional per swagger */
  invoicePaymentDate?: string | null;
}

/** POST /api/Mediation/MediationContract/delivery-form */
export interface DeliveryFormDto {
  contractId: string;
  deliveryDate?: string | null;
  notes?: string | null;
}

/** POST /api/Mediation/MediationContract/delivery-form/sign — customer receives worker */
export interface DeliveryFormSignDto {
  contractId: string;
  customerSignedAt?: string | null;
}

/** POST /api/Mediation/MediationContract/warranty-return */
export interface WarrantyReturnDto {
  contractId: string;
  returnDate: string;
  /** Enum — required */
  returnReason: number;
  /** Days worker was with customer — required (> 0) */
  daysWithCustomer: number;
  newWorkerLocation?: string | null;
  notes?: string | null;
}

/** PUT /api/Mediation/MediationContract/update-status */
export interface UpdateContractStatusDto {
  contractId: string;
  newStatus: number;
  notes?: string | null;
}

/** GET /api/Mediation/MediationContract/status-history/{contractId} */
export interface ContractStatusHistory {
  id?: string | null;
  contractId?: string | null;
  oldStatus?: number | null;
  oldStatusName?: string | null;
  newStatus?: number | null;
  newStatusName?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  createdByName?: string | null;
}

export interface ContractFollowUpItem {
  id?: string | null;
  mediationContractId?: string | null;
  followUpStatusId?: string | null;
  statusNameAr?: string | null;
  statusNameEn?: string | null;
  sortOrder?: number | null;
  dependsOnStatusName?: string | null;
  fileNameAr?: string | null;
  fileNameEn?: string | null;
  whatsappName?: string | null;
  maxDays?: number | null;
  result?: number | null;
  resultName?: string | null;
  completedAt?: string | null;
  notes?: string | null;
  canComplete?: boolean | null;
}

export interface ContractDeliveryForm {
  id?: string | null;
  contractId?: string | null;
  deliveryDate?: string | null;
  notes?: string | null;
  customerSignedAt?: string | null;
  createdAt?: string | null;
}

export interface ContractWarrantyReturn {
  id?: string | null;
  contractId?: string | null;
  returnDate?: string | null;
  returnReason?: number | null;
  returnReasonName?: string | null;
  daysWithCustomer?: number | null;
  refundAmount?: number | null;
  newWorkerLocation?: string | null;
  notes?: string | null;
  createdAt?: string | null;
}

// ==================== Mediation Contract Payments ====================

/** One recorded customer payment (`payments[]` on the detail + record-payment response). */
export interface MediationContractPayment {
  id?: string | null;
  paymentDate?: string | null;
  amount: number;
  /** PaymentMethodType enum 1-8 (see MEDIATION_PAYMENT_METHOD). */
  paymentMethod?: number | null;
  paymentMethodName?: string | null;
  referenceNumber?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  status?: number | null;
  accountingDocumentId?: string | null;
  currency?: string | null;
}

/** `financialSummary` block on the contract detail + record-payment response. */
export interface MediationContractFinancialSummary {
  offerAmount?: number | null;
  vat?: number | null;
  otherCosts?: number | null;
  salary?: number | null;
  totalContractValue?: number | null;
  totalPaid?: number | null;
  remainingAmount?: number | null;
  currency?: string | null;
}

/** POST /api/Mediation/MediationContract/customer-payment — request body. */
export interface CreateMediationContractPaymentDto {
  contractId: string;
  amount?: number | null;
  /** ISO datetime string — optional/nullable. */
  paymentDate?: string | null;
  /** PaymentMethodType enum 1-8 — optional/nullable. */
  paymentMethod?: number | null;
  bankFees?: number | null;
  referenceNumber?: string | null;
  notes?: string | null;
  description?: string | null;
}

/** POST /api/Mediation/MediationContract/customer-payment — response `data`. */
export interface RecordMediationPaymentResult {
  message?: string | null;
  totalCost?: number | null;
  totalPaid?: number | null;
  remainingAmount?: number | null;
  paymentPercentage?: number | null;
  paymentStatus?: string | null;
  paymentStatusCode?: number | null;
  financialSummary?: MediationContractFinancialSummary | null;
  payments?: MediationContractPayment[] | null;
}

/** GET /api/Mediation/MediationContract/{id} — full detail response */
export interface MediationContractDetail extends MediationContract {
  isCancel?: boolean | null;
  followUpItems?: ContractFollowUpItem[] | null;
  deliveryForm?: ContractDeliveryForm | null;
  warrantyReturn?: ContractWarrantyReturn | null;
  statusHistories?: ContractStatusHistory[] | null;
  /** Worker-assignment history (end-service / re-assign trail). */
  workerAssignments?: MediationWorkerAssignment[] | null;
  /** Recorded customer payments. */
  payments?: MediationContractPayment[] | null;
  /** Cost breakdown + paid/remaining totals. */
  financialSummary?: MediationContractFinancialSummary | null;
  /** Agent dues summary (d-8-9.md) — present when the contract has agent terms. */
  agentDues?: AgentDuesSummary | null;
  attachments?: string[] | null;
}

/** One row of GET /api/Mediation/MediationContract/recruitment-requests. */
export interface RecruitmentRequestItem {
  id: string;
  contractNumber?: number | null;
  statusName?: string | null;
  createdAt?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  costDescription?: string | null;
  branchId?: string | null;
  branchNameAr?: string | null;
  branchNameEn?: string | null;
  /**
   * True → a specific worker is attached OR a pending passport was given for
   * a worker not yet in the system; false → show `workerSelectionLabel`
   * ("any matching worker" / specs-only). Distinguish the first two cases via
   * `workerId`/`workerName` (booked) vs `pendingWorkerPassportNumber` alone
   * (worker not yet in the system).
   */
  hasSpecificWorker?: boolean | null;
  /** Displayed when `hasSpecificWorker` is false (e.g. "أي عامل مطابق"). */
  workerSelectionLabel?: string | null;
  workerId?: string | null;
  workerName?: string | null;
  workerPassportNumber?: string | null;
  /** Set when `hasSpecificWorker` is true but no real Worker exists yet. */
  pendingWorkerPassportNumber?: string | null;
  /** Relative R2 key — resolve via resolveImageUrl. */
  workerPhotoUrl?: string | null;
  /** FEdits-2 successor field; resolves from the same source as workerPhotoUrl. */
  workerImageUrl?: string | null;
  workerNationalityAr?: string | null;
  workerTypeName?: string | null;
  offerId?: string | null;
}

// ==================== Contract Creation Requirement ====================
export interface ContractCreationRequirement {
  id: number;
  nationalityId?: number | null;
  nationality_in_system?: number | null;
  jobNameAr?: string | null;
  jobId?: number | null;
  contractRequirements?: string | null;
  createdAt?: string | null;
  createdBy?: number | null;
  updatedAt?: string | null;
  updatedBy?: number | null;
  // Joined fields
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  jobNameEn?: string | null;
}

export interface CreateContractCreationRequirementDto {
  nationalityId: number;
  jobId: number;
  contractRequirements: string;
}

export interface UpdateContractCreationRequirementDto {
  nationalityId?: number | null;
  jobId?: number | null;
  contractRequirements?: string | null;
}

export interface GetRequirementFilterDto {
  nationalityId?: string | null;
  jobId?: string | null;
}


// ==================== Nationality Follow-Up Status ====================
export interface NationalityFollowUpStatus {
  id: number;
  nationalityId?: number | null;
  followUpStatusId?: number | null;
  nameAr?: string | null;
  statusOrder?: number | null;
  dependsOnStatusId?: number | null;
  fileNameEn?: string | null;
  fileNameAr?: string | null;
  whatsAppStatusName?: string | null;
  maxDays?: number | null;
  isActive?: boolean | null;
  createdAt?: string | null;
  createdBy?: number | null;
  updatedAt?: string | null;
  updatedBy?: number | null;
  // Joined fields (kept for backward compat)
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
}

export interface CreateNationalityFollowUpStatusDto {
  nationalityId: number;
  followUpStatusId: number;
  statusOrder?: number;
  dependsOnStatusId?: number | null;
  fileNameEn?: string;
  fileNameAr?: string;
  whatsAppStatusName?: string;
  maxDays?: number;
}

export interface UpdateNationalityFollowUpStatusDto {
  nationalityId?: number | null;
  followUpStatusId?: number | null;
  statusOrder?: number | null;
  dependsOnStatusId?: number | null;
  fileNameEn?: string | null;
  fileNameAr?: string | null;
  whatsAppStatusName?: string | null;
  maxDays?: number | null;
}

// ==================== Follow-Up Status (Master Data) ====================
export interface FollowUpStatus {
  id: number;
  nameAr?: string | null;
  nameEn?: string | null;
  defaultSortOrder?: number | null;
}

export interface CreateFollowUpStatusDto {
  nameAr: string;
  nameEn: string;
  defaultSortOrder?: number | null;
}

export interface UpdateFollowUpStatusDto {
  id: number;
  nameAr?: string | null;
  nameEn?: string | null;
  defaultSortOrder?: number | null;
}

// ==================== Contract Nationality ====================
export interface ContractNationality {
  id: number;
  nationalityId?: string | null;
  nameAr?: string | null;
  nameEn?: string | null;
  configuredStatusCount?: number | null;
  isActive?: boolean | null;
}

export interface CreateContractNationalityDto {
  nationalityId: string;
}

export interface UpdateContractNationalityDto {
  id: number;
  isActive: boolean;
}

// ==================== Nationality Follow-Up Config ====================
export interface NationalityFollowUpConfig {
  id: number;
  contractNationalityId?: number | null;
  followUpStatusId?: number | null;
  statusNameAr?: string | null;
  statusNameEn?: string | null;
  sortOrder?: number | null;
  dependsOnStatusId?: number | null;
  fileNameAr?: string | null;
  fileNameEn?: string | null;
  whatsAppStatusName?: string | null;
  maxDays?: number | null;
  isActive?: boolean | null;
}

export interface UpdateNationalityFollowUpConfigDto {
  id: number;
  sortOrder?: number | null;
  dependsOnStatusId?: number | null;
  fileNameAr?: string | null;
  fileNameEn?: string | null;
  whatsAppStatusName?: string | null;
  maxDays?: number | null;
  isActive?: boolean | null;
}

export interface BulkUpdateNationalityFollowUpConfigDto {
  nationalityId: number;
  configs: UpdateNationalityFollowUpConfigDto[];
}

// ==================== Marketer Types ====================
export interface Marketer {
  id: number | string;
  nameAr?: string | null;
  nameEn?: string | null;
  createdAt?: string | null;
}

export interface CreateMarketerDto {
  nameAr?: string | null;
  nameEn?: string | null;
}

export interface UpdateMarketerDto {
  nameAr?: string | null;
  nameEn?: string | null;
}

// ==================== Receipt Voucher Types ====================
export interface ReceiptVoucher {
  id: number | string;
  /** Per-contract running serial (assigned by the backend) */
  voucherSerialNumber?: number | null;
  voucherNumber?: string | null;
  voucherDate?: string | null;
  amount?: number | null;
  notes?: string | null;
  /** UUID string */
  employmentOperatingContractId?: string | null;
  /** 1=Cash, 2=Bank, 3=Card */
  paymentMethod?: number | null;
  /** VAT portion of `amount` — computed by the backend (15% inclusive) */
  vatAmount?: number | null;
  bankFees?: number | null;
  journalEntryId?: number | string | null;
  createdAt?: string | null;
}

export interface CreateReceiptVoucherDto {
  voucherNumber?: string | null;
  voucherDate: string;
  amount: number;
  notes?: string | null;
  /** UUID string */
  employmentOperatingContractId: string;
  /** 1=Cash, 2=Bank, 3=Card */
  paymentMethod?: number | null;
  /** Optional — backend computes VAT from `amount` when omitted */
  vatAmount?: number | null;
  /** Bank transfer fees, when paid by bank/card */
  bankFees?: number | null;
}

export interface UpdateReceiptVoucherDto {
  voucherNumber?: string | null;
  voucherDate?: string | null;
  amount?: number | null;
  notes?: string | null;
  employmentOperatingContractId?: string | null;
}

// ==================== Mediation Follow-Up Module Types ====================

/** Query params for GET /api/Mediation/MediationFollowUp/dashboard */
export interface MediationFollowUpDashboardParams {
  ContractNumber?: number | null;
  CustomerNationalId?: string | null;
  WorkerPassportNumber?: string | null;
  ContractId?: string | null;
  MusanedContractNumber?: string | null;
  StatusId?: number | null;
  NationalityId?: string | null;
  WorkerType?: number | null;
  DateFrom?: string | null;
  DateTo?: string | null;
  Page?: number;
  PageSize?: number;
  // Mirrors FilterMediationContractDto (same shape as MediationContract's own
  // GET params) — added per the ErpImprovementsJul2026 filter audit.
  CustomerId?: string | null;
  WorkerId?: string | null;
  CustomerName?: string | null;
  WorkerName?: string | null;
  AgentId?: string | null;
  MarketerId?: string | null;
  ContractType?: number | null;
  CustomerPhone?: string | null;
  VisaNumber?: string | null;
  WithoutAssignedWorker?: boolean | null;
  IsPaid?: boolean | null;
  IsUnpaid?: boolean | null;
  PaymentDateFrom?: string | null;
  PaymentDateTo?: string | null;
  InvoicePaymentDateFrom?: string | null;
  InvoicePaymentDateTo?: string | null;
  HasContractInsurance?: boolean | null;
  IsCancel?: boolean | null;
  BranchId?: string | null;
  IncludeSubBranches?: boolean | null;
  Search?: string | null;
  CreatedDateFrom?: string | null;
  CreatedDateTo?: string | null;
  UpdatedDateFrom?: string | null;
  UpdatedDateTo?: string | null;
  SortBy?: string | null;
  SortDescending?: boolean | null;
  VisaDateFrom?: string | null;
  VisaDateTo?: string | null;
  ExternalStatusId?: number | null;
  ManualContractStatus?: number | null;
  WorkerNumber?: string | null;
  VisaStatus?: number | null;
  IncompleteExternalStatusId?: number | null;
  PastExternalStatusId?: number | null;
  WarrantyStatus?: number | null;
  CreatedBy?: string | null;
  CancellationDateFrom?: string | null;
  CancellationDateTo?: string | null;
  ArrivalDateFrom?: string | null;
  ArrivalDateTo?: string | null;
  IsReplacement?: boolean | null;
  MusanedPaymentStatus?: 0 | 1 | 2 | null;
  ReferenceNumber?: string | null;
  WorkersAddedToday?: boolean | null;
  Religion?: 1 | 2 | 3 | null;
  HasPreviousExperience?: boolean | null;
  JobId?: string | null;
  IsVip?: boolean | null;
  ExternalStatusDateFrom?: string | null;
  ExternalStatusDateTo?: string | null;
  NotArrivedAfterArrivalDateDays?: number | null;
  NotArrivedAfterSigningDateDays?: number | null;
  CustomerEmail?: string | null;
}

/**
 * Data always shown on the card, filled automatically from system tables —
 * not follow-up fields an employee enters (Frontend_AutomaticFollowUp_README.md
 * §1/§3.2). Render even while `followUpStages` are still Pending.
 */
export interface FollowUpHighlights {
  customerBirthDate?: string | null;
  customerBirthDateHijri?: string | null;
  customerNationality?: string | null;
  workerNationalityAr?: string | null;
  workerNationalityEn?: string | null;
  customerNationalId?: string | null;
  workerPassportNumber?: string | null;
  agentName?: string | null;
}

/** Right-column identity block (§3.3). */
export interface FollowUpDashboardHeader {
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  visaNumber?: string | null;
  agentName?: string | null;
  workerStatusNameAr?: string | null;
  workerStatusNameEn?: string | null;
  customerCity?: string | null;
  contractCategoryName?: string | null;
}

/** Offer/cost figures for the middle column (§3.4). */
export interface FollowUpDashboardOffer {
  offerAmount?: number | null;
  otherCosts?: number | null;
  salary?: number | null;
  totalTaxValue?: number | null;
  totalCost?: number | null;
  totalPaid?: number | null;
  remainingAmount?: number | null;
  paymentStatus?: string | null;
}

/** Subset of customer fields the detail screen shows (§3.5/§7) — same data as `highlights`. */
export interface FollowUpDashboardCustomerInfo {
  nationalId?: string | null;
  nationality?: string | null;
  birthDate?: string | null;
}

/** Subset of agent fields the detail screen shows (§3.5/§7) — same data as `highlights.agentName`. */
export interface FollowUpDashboardAgentInfo {
  nameAr?: string | null;
}

/** Subset of worker fields the detail screen shows (§3.5). */
export interface FollowUpDashboardWorkerInfo {
  passportNumber?: string | null;
  nationalityAr?: string | null;
  age?: number | null;
  religionNameAr?: string | null;
  photoUrl?: string | null;
  /** Passport pending / worker not yet registered in the system. */
  isExternal?: boolean | null;
}

/** One entry in the contract's status history, oldest first (§3.6). */
export interface FollowUpTimelineEvent {
  id?: string | null;
  date?: string | null;
  statusId: number;
  statusNameAr: string;
  statusNameEn: string;
  notes?: string | null;
  createdByName?: string | null;
  isCurrent: boolean;
}

/**
 * Card returned by both `GET /dashboard` (list, one per item) and
 * `GET /dashboard/{contractId}` (single card / detail screen) — supersedes
 * the old flat row shape. Breaking change: old root-level fields like
 * `customerName`/`workerPassportNumber` no longer exist — read them from
 * `header`/`highlights` instead (Frontend_AutomaticFollowUp_README.md).
 */
export interface MediationFollowUpDashboardCard {
  id: string;
  contractNumber: number;
  statusId?: number | null;
  statusNameAr?: string | null;
  statusNameEn?: string | null;
  musanedContractNumber?: string | null;
  daysSinceCreation?: number | null;
  daysSinceLastUpdate?: number | null;
  lastUpdatedAt?: string | null;
  currentFollowUpItemId?: string | null;
  currentFollowUpStatusNameAr?: string | null;
  highlights: FollowUpHighlights;
  header: FollowUpDashboardHeader;
  offer: FollowUpDashboardOffer;
  /** Full detail-screen objects — the list/card view only needs highlights+header. */
  customer?: FollowUpDashboardCustomerInfo | null;
  worker?: FollowUpDashboardWorkerInfo | null;
  agent?: FollowUpDashboardAgentInfo | null;
  /**
   * The spec doc names no fields for `visa` (§3.5 only says "full objects"; the
   * §7 TypeScript sample omits it entirely) — the one documented visa datum is
   * `header.visaNumber`. Left loose on purpose: do not guess field names.
   */
  visa?: Record<string, any> | null;
  timeline: FollowUpTimelineEvent[];
  followUpStages: MediationFollowUpItem[];
}

/**
 * Single follow-up item returned by GET /items/{contractId} and GET /item/{itemId}.
 * canComplete drives the "Complete" button disabled state.
 */
export interface MediationFollowUpItem {
  id?: string | null;
  mediationContractId?: string | null;
  followUpStatusId?: string | null;
  statusNameAr?: string | null;
  statusNameEn?: string | null;
  sortOrder?: number | null;
  dependsOnStatusId?: string | null;
  dependsOnStatusName?: string | null;
  fileNameAr?: string | null;
  fileNameEn?: string | null;
  whatsAppName?: string | null;
  maxDays?: number | null;
  /** 1=Pending, 2=Completed, 3=Failed, 4=Skipped */
  result?: number | null;
  resultName?: string | null;
  completedAt?: string | null;
  notes?: string | null;
  inputDescription?: string | null;
  /** false → predecessor not yet completed → disable the Complete button */
  canComplete?: boolean | null;
}

/** POST /api/Mediation/MediationFollowUp/update-description */
export interface UpdateFollowUpItemDescriptionDto {
  itemId: string;
  inputDescription?: string | null;
}

/** POST /api/FollowUp/ContractFollowUp/CompleteItem */
export interface CompleteFollowUpItemDto {
  contractFollowUpItemId: string;
  completedAt: string;
  notes?: string | null;
  /** 2=Completed, 3=Failed, 4=Skipped */
  result: 2 | 3 | 4;
}

/** GET /api/FollowUp/ContractFollowUp/CanComplete/{itemId} */
export interface CanCompleteResponse {
  canComplete: boolean;
}

/** GET /api/FollowUp/ContractCreationRequirement/GetByNationalityAndJob */
export interface ContractCreationRequirementDto {
  id?: string | number | null;
  nationalityId?: string | null;
  jobId?: string | null;
  requirementsText?: string | null;
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  jobNameAr?: string | null;
  jobNameEn?: string | null;
  createdAt?: string | null;
}

export interface CreateContractCreationRequirementNewDto {
  nationalityId: string;
  jobId: string;
  requirementsText: string;
}

// ── New /api/FollowUp/ContractCreationRequirement/* types (UUID-based) ─────────

/** Returned by GetByNationalityAndJob and GetById */
export interface FollowUpRequirement {
  id?: string | null;
  /** ContractNationality.id (integer PK from /api/FollowUp/ContractNationality/GetAll) */
  nationalityId?: string | null;
  nationalityNameAr?: string | null;
  nationalityNameEn?: string | null;
  /** UUID */
  jobId?: string | null;
  jobName?: string | null;
  requirementsText?: string | null;
}

/** POST /api/FollowUp/ContractCreationRequirement/Create */
export interface CreateFollowUpRequirementDto {
  nationalityId: string;
  jobId: string;
  requirementsText: string;
}

/** PUT /api/FollowUp/ContractCreationRequirement/Update — id is in body */
export interface UpdateFollowUpRequirementDto {
  id: string;
  nationalityId?: string | null;
  jobId?: string | null;
  requirementsText?: string | null;
}

// ==================== Transfer Contract Types ====================
// TransferContractStatus: 1=Draft, 4=SentToAuthorities, 5=Approved, 6=Rejected, 8=TransferCompleted
// PaymentMeansCodeType: 1=Cash, 2=Check, 3=Transfer, 6=Network
export interface TransferContract {
  id: string;
  contractNumber?: number | null;
  /** UUID string */
  customerId?: string | null;
  customerName?: string | null;
  /** UUID string */
  workerId?: string | null;
  workerName?: string | null;
  workerIdNumber?: string | null;
  /** UUID string */
  marketerId?: string | null;
  marketerName?: string | null;
  transferFees?: number | null;
  governmentFees?: number | null;
  totalAmount?: number | null;
  /** Derived or returned by API — total paid so far */
  paidAmount?: number | null;
  contractStatus?: number | null;
  statusName?: string | null;
  paymentMeansCodeTypeId?: number | null;
  paymentMeansName?: string | null;
  trialPeriodDays?: number | null;
  notes?: string | null;
  requestDate?: string | null;
  approvalDate?: string | null;
  createdDate?: string | null;
  createdByName?: string | null;
}

export interface TransferContractListItem {
  id: string;
  contractNumber?: number | null;
  workerName?: string | null;
  customerName?: string | null;
  contractStatus?: number | null;
  statusName?: string | null;
  totalAmount?: number | null;
  createdDate?: string | null;
}

export interface PaginatedTransferContractsResponse {
  items: TransferContractListItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateTransferContractDto {
  /** UUID string */
  customerId: string;
  /** UUID string */
  workerId: string;
  /** UUID string (optional) */
  marketerId?: string | null;
  transferFees: number;
  governmentFees: number;
  totalAmount: number;
  /** PaymentMeansCodeType: 1=Cash, 2=Check, 3=Transfer, 6=Network */
  paymentMeansCodeTypeId: number;
  trialPeriodDays: number;
  notes?: string | null;
  /** Optional branch scope on create. Omitted → backend uses JWT branchId. */
  branchId?: string | null;
}

// ==================== Accounting Document Types ====================
// Base route: /api/Accounting/{Controller}
// Controllers: ReceiptVoucher, PaymentVoucher, CreditNote, DebitNote
// PaymentMethodType: 1=Cash, 2=Bank, 3=Card

/** Shared filter params for all accounting document list endpoints. */
export interface AccountingDocumentFilterDto {
  customerId?: string | null;
  agentId?: string | null;
  contractId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  // Branch scoping + AccountingDocumentFilterDto extensions (new edits2.md).
  branchId?: string | null;
  includeSubBranches?: boolean | null;
  search?: string | null;
  documentType?: number | null;
  documentNumber?: string | null;
  // Audit Phase 4: previously missing filter/paging/sort params (live OpenAPI).
  createdDateFrom?: string | null;
  createdDateTo?: string | null;
  updatedDateFrom?: string | null;
  updatedDateTo?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
  sortBy?: string | null;
  sortDescending?: boolean | null;
}

// ── Receipt Voucher ──────────────────────────────────────────────────────────

export interface ReceiptVoucherDetail {
  id: string;
  voucherSerialNumber?: number | null;
  voucherNumber?: string | null;
  voucherDate?: string | null;
  amount: number;
  notes?: string | null;
  employmentOperatingContractId?: string | null;
  customerId?: string | null;
  /** 1=Cash, 2=Bank, 3=Card */
  paymentMethod?: number | null;
  vatAmount?: number | null;
  bankFees?: number | null;
  journalEntryId?: string | null;
  accountingDocumentId?: string | null;
  createdAt?: string | null;
}

export interface CreateReceiptVoucherNewDto {
  voucherNumber?: string | null;
  voucherDate: string;
  amount: number;
  notes?: string | null;
  employmentOperatingContractId: string;
  /** 1=Cash, 2=Bank, 3=Card */
  paymentMethod?: number | null;
  vatAmount?: number | null;
  bankFees?: number | null;
}

// ── Payment Voucher ──────────────────────────────────────────────────────────

export interface PaymentVoucher {
  id: string;
  voucherNumber?: string | null;
  voucherDate?: string | null;
  amount: number;
  notes?: string | null;
  /** 1=Cash, 2=Bank, 3=Card */
  paymentMethod?: number | null;
  payeeId?: string | null;
  payeeType?: string | null;
  customerId?: string | null;
  sourceContractId?: string | null;
  sourceContractType?: string | null;
  journalEntryId?: string | null;
  accountingDocumentId?: string | null;
  createdAt?: string | null;
}

export interface CreatePaymentVoucherDto {
  voucherNumber?: string | null;
  voucherDate: string;
  amount: number;
  notes?: string | null;
  /** 1=Cash, 2=Bank, 3=Card */
  paymentMethod?: number | null;
  payeeId?: string | null;
  /** e.g. "Agent" */
  payeeType?: string | null;
  customerId?: string | null;
  sourceContractId?: string | null;
  sourceContractType?: string | null;
}

// ── Credit Note ──────────────────────────────────────────────────────────────

export interface CreditNote {
  id: string;
  creditNoteNumber?: string | null;
  creditNoteDate?: string | null;
  amount: number;
  vatAmount?: number | null;
  reason?: string | null;
  notes?: string | null;
  customerId?: string | null;
  sourceContractId?: string | null;
  sourceContractType?: string | null;
  journalEntryId?: string | null;
  accountingDocumentId?: string | null;
  createdAt?: string | null;
}

export interface CreateCreditNoteDto {
  creditNoteNumber?: string | null;
  creditNoteDate: string;
  amount: number;
  vatAmount?: number | null;
  reason?: string | null;
  notes?: string | null;
  customerId: string;
  sourceContractId?: string | null;
  sourceContractType?: string | null;
}

// ── Debit Note ───────────────────────────────────────────────────────────────

export interface DebitNote {
  id: string;
  debitNoteNumber?: string | null;
  debitNoteDate?: string | null;
  amount: number;
  vatAmount?: number | null;
  reason?: string | null;
  agentId?: string | null;
  sourceContractId?: string | null;
  sourceContractType?: string | null;
  journalEntryId?: string | null;
  accountingDocumentId?: string | null;
  createdAt?: string | null;
}

export interface CreateDebitNoteDto {
  debitNoteNumber?: string | null;
  debitNoteDate: string;
  amount: number;
  vatAmount?: number | null;
  reason?: string | null;
  agentId: string;
  sourceContractId?: string | null;
  sourceContractType?: string | null;
}

// ── Accounting Document Trace ────────────────────────────────────────────────

export interface AccountingDocumentTraceJournalLine {
  /** Line GUID — returned by the live trace API; used as a stable row key. */
  id?: string | null;
  accountId?: string | null;
  accountCode?: string | null;
  accountName?: string | null;
  debit: number;
  credit: number;
  description?: string | null;
}

export interface AccountingDocumentTraceJournal {
  id?: string | null;
  entryNumber?: string | null;
  date?: string | null;
  description?: string | null;
  /** 0=Draft, 1=Posted, 2=PendingApproval, 3=Cancelled */
  status?: number | null;
  sourceId?: string | null;
  customerId?: string | null;
  agentId?: string | null;
  lines?: AccountingDocumentTraceJournalLine[];
}

export interface AccountingDocumentTraceDocument {
  id?: string | null;
  /** 1=ReceiptVoucher, 2=PaymentVoucher, 3=CreditNote, 4=DebitNote */
  documentType?: number | null;
  documentNumber?: string | null;
  documentDate?: string | null;
  amount?: number | null;
  journalEntryId?: string | null;
  accountingDocumentId?: string | null;
  customerId?: string | null;
  agentId?: string | null;
  contractId?: string | null;
  contractType?: string | null;
  /** 0=Draft, 1=Posted, 2=PendingApproval, 3=Cancelled */
  journalStatus?: number | null;
}

export interface AccountingDocumentTrace {
  /** 1=ReceiptVoucher, 2=PaymentVoucher, 3=CreditNote, 4=DebitNote */
  documentType?: number | null;
  documentEntityId?: string | null;
  document?: AccountingDocumentTraceDocument | null;
  journalEntry?: AccountingDocumentTraceJournal | null;
  ledgerEntries?: unknown[];
}

// ==================== Period Closing Types ====================
//
// Period closing is now YEAR-based (previously month/year). Verified live
// (2026-07) against GET/POST /api/V1/PeriodClosing[/close|/open|/status].
// All endpoints are branch-scoped (require the X-Branch-Id header, injected
// globally by the api client).

/** A single row from GET /api/V1/PeriodClosing — one accounting year. */
export interface PeriodYearStatus {
  year: number;
  isClosed: boolean;
  /** ISO timestamp when the year was closed (null while open). */
  closedAt?: string | null;
  /** Display name of the user who closed the year (null while open). */
  closedBy?: string | null;
  /** GUID of the generated closing journal entry (null while open). */
  closingJournalEntryId?: string | null;
}

/** Body for POST /close and POST /open — year only. */
export interface ClosePeriodDto {
  year: number;
}

/** Alias kept for readability at call sites (open uses the same body). */
export type OpenPeriodDto = ClosePeriodDto;

/** Response payload of POST /close and POST /open. */
export interface PeriodClosingResult {
  year?: number | null;
  closingJournalEntryId?: string | null;
  netIncomeTransferred?: number | null;
  isClosed?: boolean | null;
}

