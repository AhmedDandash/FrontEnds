/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {
  // Auth — all paths moved to /api/V1/Auth/*
  AUTH: {
    LOGIN: '/api/V1/Auth/login',
    LOGOUT: '/api/V1/Auth/logout',
    REFRESH_TOKEN: '/api/V1/Auth/refresh-token',
    ME: '/api/V1/Auth/me',
    CHANGE_PASSWORD: '/api/V1/Auth/change-password',
    ADD_ADMIN: '/api/V1/Auth/add-admin',
  },

  // Branch — RESTful /api/V1/Branch
  BRANCH: {
    GET_ALL: '/api/V1/Branch',
    GET_BY_ID: (id: number | string) => `/api/V1/Branch/${id}`,
    GET_SUB_BRANCHES: (id: number | string) => `/api/V1/Branch/${id}/sub-branches`,
    CREATE: '/api/V1/Branch',
    UPDATE: (id: number | string) => `/api/V1/Branch/${id}`,
    DELETE: (id: number | string) => `/api/V1/Branch/${id}`,
  },

  // Customers — RESTful /api/V1/Customer
  CUSTOMERS: {
    GET_ALL: '/api/V1/Customer',
    GET_BY_ID: (id: number | string) => `/api/V1/Customer/${id}`,
    CREATE: '/api/V1/Customer',
    UPDATE: (id: number | string) => `/api/V1/Customer/${id}`,
    DELETE: (id: number | string) => `/api/V1/Customer/${id}`,
    EXPORT: '/api/V1/Customer/export',
    // POST { arabicName } → { englishName } — auto-transliteration (V1 path only)
    GENERATE_ENGLISH_NAME: '/api/V1/Customer/generate-english-name',
  },

  // Document
  DOCUMENT: {
    GET_ALL: '/api/Document/GetAllDocument',
    GET_BY_ID: (id: number) => `/api/Document/GetDocumentById/${id}`,
    CREATE: '/api/Document/CreateDocument',
    UPDATE: (id: number) => `/api/Document/UpdateDocument/${id}`,
    DELETE: (id: number) => `/api/Document/DeleteDocument/${id}`,
  },

  // Roles
  ROLES: {
    GET_ALL: '/api/Roles/GetAllRoles',
    GET_BY_ID: (id: number) => `/api/Roles/GetRoleById/${id}`,
    CREATE: '/api/Roles/Create',
    UPDATE: (id: number) => `/api/Roles/Update/${id}`,
    DELETE: (id: number) => `/api/Roles/Delete/${id}`,
  },

  // Users
  USERS: {
    GET_BY_ID: (id: number) => `/api/Users/GetUserById/${id}`,
    GET_ALL: '/api/Users/GetAllUsers',
    CREATE: '/api/Auth/register',
    UPDATE: (id: number) => `/api/Users/UpdateUserById/${id}`,
    DELETE: (id: number) => `/api/Users/DeleteUserById/${id}`,
  },

  // Agent — RESTful /api/V1/Agent
  AGENT: {
    GET_ALL: '/api/V1/Agent',
    ME: '/api/V1/Agent/me',
    GET_BY_ID: (id: number | string) => `/api/V1/Agent/${id}`,
    CREATE: '/api/V1/Agent',
    UPDATE: (id: number | string) => `/api/V1/Agent/${id}`,
    DELETE: (id: number | string) => `/api/V1/Agent/${id}`,
  },

  // Commission — GET /api/V1/Commission/GetAll (list only; no CRUD wired here)
  COMMISSION: {
    GET_ALL: '/api/V1/Commission/GetAll',
  },

  // Agent Job — per-agent, per-job cost/commission agreement (d-8-9.md)
  AGENT_JOB: {
    GET_ALL: '/api/V1/AgentJob',
    BY_AGENT: (agentId: string) => `/api/V1/AgentJob/by-agent/${agentId}`,
    GET_BY_ID: (id: string) => `/api/V1/AgentJob/${id}`,
    CREATE: '/api/V1/AgentJob',
    UPDATE: (id: string) => `/api/V1/AgentJob/${id}`,
    DELETE: (id: string) => `/api/V1/AgentJob/${id}`,
    RESOLVE: '/api/V1/AgentJob/resolve',
  },

  // Jobs — RESTful /api/V1/Job
  JOB: {
    GET_ALL: '/api/V1/Job',
    GET_BY_ID: (id: number | string) => `/api/V1/Job/${id}`,
    CREATE: '/api/V1/Job',
    UPDATE: (id: number | string) => `/api/V1/Job/${id}`,
    DELETE: (id: number | string) => `/api/V1/Job/${id}`,
  },

  // Workers — RESTful /api/V1/Worker + lifecycle transitions
  WORKERS: {
    GET_ALL: '/api/V1/Worker',
    GET_BY_ID: (id: number | string) => `/api/V1/Worker/${id}`,
    CREATE: '/api/V1/Worker',
    UPDATE: (id: number | string) => `/api/V1/Worker/${id}`,
    DELETE: (id: number | string) => `/api/V1/Worker/${id}`,
    // Lifecycle (replaces old WorkerIsNoActive / WorkerOut / WorkerRefused)
    ACTIVATE: (id: number | string) => `/api/V1/Worker/${id}/activate`,
    MOVE_TO_ACCOMMODATION: (id: number | string) => `/api/V1/Worker/${id}/move-to-accommodation`,
    SET_REFUSAL: (id: number | string) => `/api/V1/Worker/${id}/set-refusal`,
    WANTS_TRANSFER: '/api/V1/Worker/WantsTransfer',
    EXPORT: '/api/V1/Worker/export',
  },

  // NOTE: the legacy `/api/RecruitmentRequest` endpoints were removed — the
  // recruitment-requests view now uses GET /api/Mediation/MediationContract/recruitment-requests
  // (see MEDIATION_CONTRACT.RECRUITMENT_REQUESTS below).

  // Operating Contract Offer (renamed from EmploymentContractOffers)
  OPERATING_CONTRACT_OFFER: {
    GET_ALL: '/api/OperatingContractOffer',
    CREATE: '/api/OperatingContractOffer',
    GET_BY_ID: (id: number | string) => `/api/OperatingContractOffer/${id}`,
    UPDATE: (id: number | string) => `/api/OperatingContractOffer/${id}`,
    DELETE: (id: number | string) => `/api/OperatingContractOffer/${id}`,
  },

  // Employment Operating Contract
  EMPLOYMENT_OPERATING_CONTRACT: {
    GET_ALL: '/api/EmploymentOperatingContract',
    CREATE: '/api/EmploymentOperatingContract',
    GET_BY_ID: (id: number | string) => `/api/EmploymentOperatingContract/${id}`,
    UPDATE: (id: number | string) => `/api/EmploymentOperatingContract/${id}`,
    DELETE: (id: number | string) => `/api/EmploymentOperatingContract/${id}`,
    // Lifecycle transitions (replaces old EndContract)
    SIGN: (id: number | string) => `/api/EmploymentOperatingContract/${id}/sign`,
    START_EXECUTION: (id: number | string) =>
      `/api/EmploymentOperatingContract/${id}/start-execution`,
    RENEW: (id: number | string) => `/api/EmploymentOperatingContract/${id}/renew`,
    TERMINATE: (id: number | string) => `/api/EmploymentOperatingContract/${id}/terminate`,
    // POST /{id}/customer-refund — cash returned to customer after termination
    CUSTOMER_REFUND: (id: number | string) =>
      `/api/EmploymentOperatingContract/${id}/customer-refund`,
    PRINT_RECEIPT_FORM: (id: number | string) =>
      `/api/EmploymentOperatingContract/${id}/print-receipt-form`,
    // GET — delivery-form print data (OperatingContractDeliveryFormDto)
    PRINT_DELIVERY_FORM: (id: number | string) =>
      `/api/EmploymentOperatingContract/${id}/print-delivery-form`,
    // POST — save delivery date / signatures
    DELIVERY_FORM: (id: number | string) =>
      `/api/EmploymentOperatingContract/${id}/delivery-form`,
  },

  // Worker Delivery Record — signed handover receipt (FEdits-2 §5). No list/
  // by-contract lookup endpoint exists; the frontend tracks the created id
  // itself (see useWorkerDeliveryRecord.ts).
  WORKER_DELIVERY_RECORD: {
    CREATE: '/api/WorkerDeliveryRecord',
    GET_BY_ID: (id: string) => `/api/WorkerDeliveryRecord/${id}`,
    UPDATE: (id: string) => `/api/WorkerDeliveryRecord/${id}`,
    PRINT: (id: string) => `/api/WorkerDeliveryRecord/${id}/print`,
  },

  // Complaint
  COMPLAINT: {
    GET_ALL: '/api/Complaint',
    GET_BY_ID: (id: number | string) => `/api/Complaint/${id}`,
    CREATE: '/api/Complaint',
    DELETE: (id: number | string) => `/api/Complaint/${id}`,
    // POST /api/Complaint/{id}/finish — no request body
    FINISH: (id: number | string) => `/api/Complaint/${id}/finish`,
    // POST /api/Complaint/{id}/toggle-hold?reason=... — reason is required query param
    HOLD: (id: number | string) => `/api/Complaint/${id}/toggle-hold`,
    // POST /api/Complaint/issue — multipart/form-data
    ADD_ISSUE: '/api/Complaint/issue',
    // GET /api/Complaint/{id}/issue
    GET_ISSUE: (id: number | string) => `/api/Complaint/${id}/issue`,
    // POST /api/Complaint/update — add update/note to existing complaint
    ADD_UPDATE: '/api/Complaint/update',
  },

  // Nationality — RESTful /api/V1/Nationality
  NATIONALITY: {
    GET_ALL: '/api/V1/Nationality',
    GET_BY_ID: (id: number | string) => `/api/V1/Nationality/${id}`,
    CREATE: '/api/V1/Nationality',
    UPDATE: (id: number | string) => `/api/V1/Nationality/${id}`,
    DELETE: (id: number | string) => `/api/V1/Nationality/${id}`,
    TOGGLE_STATUS: (id: number | string) => `/api/V1/Nationality/${id}/toggle-status`,
  },

  // Mediation Contract Offer
  MEDIATION_CONTRACT_OFFER: {
    GET_ALL: '/api/Mediation/MediationContractOffer',
    GET_BY_ID: (id: string) => `/api/Mediation/MediationContractOffer/${id}`,
    CREATE: '/api/Mediation/MediationContractOffer',
    UPDATE: '/api/Mediation/MediationContractOffer',
    DELETE: (id: string) => `/api/Mediation/MediationContractOffer/${id}`,
    TOGGLE_ACTIVE: (id: string) => `/api/Mediation/MediationContractOffer/${id}/toggle-active`,
    AUTO_FILL: '/api/Mediation/MediationContractOffer/auto-fill',
  },

  // Mediation Contract — endpoints per PDF spec only
  MEDIATION_CONTRACT: {
    GET_ALL: '/api/Mediation/MediationContract',
    GET_BY_ID: (id: string) => `/api/Mediation/MediationContract/${id}`,
    CREATE: '/api/Mediation/MediationContract',
    EXPORT: '/api/Mediation/MediationContract/export',
    // GET — recruitment requests view (worker vs. "any matching worker")
    RECRUITMENT_REQUESTS: '/api/Mediation/MediationContract/recruitment-requests',
    // POST { contractId, reason? } — ends the current worker's service
    END_WORKER_SERVICE: '/api/Mediation/MediationContract/end-worker-service',
    // POST { contractId, workerId, workerPassportNumber } — assigns a new worker
    ASSIGN_WORKER: '/api/Mediation/MediationContract/assign-worker',
    // POST { contractId, workerPassportNumber } — worker not yet in the system
    SET_PENDING_WORKER_PASSPORT: '/api/Mediation/MediationContract/set-pending-worker-passport',
    CONTRACT_CANCEL: '/api/Mediation/MediationContract/cancel',
    // POST { contractId, amount, ... } — records a customer payment against the contract
    CUSTOMER_PAYMENT: '/api/Mediation/MediationContract/customer-payment',
    SIGN: '/api/Mediation/MediationContract/sign',
    UPDATE_STATUS: '/api/Mediation/MediationContract/update-status',
    DELIVERY_FORM: '/api/Mediation/MediationContract/delivery-form',
    DELIVERY_FORM_SIGN: '/api/Mediation/MediationContract/delivery-form/sign',
    WARRANTY_RETURN: '/api/Mediation/MediationContract/warranty-return',
    STATUS_HISTORY: (contractId: string) =>
      `/api/Mediation/MediationContract/status-history/${contractId}`,
  },

  // Contract Creation Requirements
  CONTRACT_CREATION_REQUIREMENTS: {
    GET_ALL: '/api/ContractCreationRequirements',
    CREATE: '/api/ContractCreationRequirements',
    GET_BY_ID: (id: number) => `/api/ContractCreationRequirements/${id}`,
    UPDATE: (id: number) => `/api/ContractCreationRequirements/${id}`,
    DELETE: (id: number) => `/api/ContractCreationRequirements/${id}`,
    GET_REQUIREMENT: '/api/ContractCreationRequirements/GetRequirement',
  },

  // Nationality Follow-Up Status
  NATIONALITY_FOLLOWUP: {
    GET_ALL: '/api/Nationality/GetAllNationalityFollowUpStatus',
    GET_BY_NATIONALITY: (nationalityId: number) =>
      `/api/Nationality/GetNationalityFollowUpStatus/${nationalityId}`,
    CREATE: '/api/Nationality/CreateNationalityFollowUpStatus',
    UPDATE: (id: number) => `/api/Nationality/UpdateNationalityFollowUpStatus/${id}`,
    TOGGLE_ACTIVE: (id: number) => `/api/Nationality/NationalityFollowUpStatusIsActive/${id}`,
    DELETE: (id: number) => `/api/Nationality/DeleteNationalityFollowUpStatus/${id}`,
  },

  // Marketer — /api/V1/Marketer
  MARKETER: {
    GET_ALL: '/api/V1/Marketer',
    GET_BY_ID: (id: number | string) => `/api/V1/Marketer/${id}`,
    CREATE: '/api/V1/Marketer',
    UPDATE: (id: number | string) => `/api/V1/Marketer/${id}`,
    DELETE: (id: number | string) => `/api/V1/Marketer/${id}`,
  },

  // ─── Accounting Documents — /api/Accounting/* ─────────────────────────────
  // All documents follow the same shape: GET list/by-id/trace, POST create.
  // Filters: customerId, agentId, contractId, dateFrom, dateTo.

  // Receipt Voucher — /api/Accounting/ReceiptVoucher
  RECEIPT_VOUCHER: {
    GET_ALL: '/api/Accounting/ReceiptVoucher',
    GET_BY_ID: (id: string) => `/api/Accounting/ReceiptVoucher/${id}`,
    TRACE: (id: string) => `/api/Accounting/ReceiptVoucher/${id}/trace`,
    CREATE: '/api/Accounting/ReceiptVoucher',
  },

  // Payment Voucher — /api/Accounting/PaymentVoucher
  PAYMENT_VOUCHER: {
    GET_ALL: '/api/Accounting/PaymentVoucher',
    GET_BY_ID: (id: string) => `/api/Accounting/PaymentVoucher/${id}`,
    TRACE: (id: string) => `/api/Accounting/PaymentVoucher/${id}/trace`,
    CREATE: '/api/Accounting/PaymentVoucher',
  },

  // Credit Note — /api/Accounting/CreditNote
  CREDIT_NOTE: {
    GET_ALL: '/api/Accounting/CreditNote',
    GET_BY_ID: (id: string) => `/api/Accounting/CreditNote/${id}`,
    TRACE: (id: string) => `/api/Accounting/CreditNote/${id}/trace`,
    CREATE: '/api/Accounting/CreditNote',
  },

  // Debit Note — /api/Accounting/DebitNote
  DEBIT_NOTE: {
    GET_ALL: '/api/Accounting/DebitNote',
    GET_BY_ID: (id: string) => `/api/Accounting/DebitNote/${id}`,
    TRACE: (id: string) => `/api/Accounting/DebitNote/${id}/trace`,
    CREATE: '/api/Accounting/DebitNote',
  },

  // General Voucher — /api/Accounting/GeneralVoucher
  // Unified voucher module (6 types). Richer than the 4 legacy documents above:
  // full CRUD + lookups + export + print + attachment + balance validation.
  GENERAL_VOUCHER: {
    GET_ALL: '/api/Accounting/GeneralVoucher',
    GET_BY_ID: (id: string) => `/api/Accounting/GeneralVoucher/${id}`,
    TRACE: (id: string) => `/api/Accounting/GeneralVoucher/${id}/trace`,
    PRINT: (id: string) => `/api/Accounting/GeneralVoucher/${id}/print`,
    TYPES: '/api/Accounting/GeneralVoucher/types',
    PAYMENT_METHODS: '/api/Accounting/GeneralVoucher/payment-methods',
    EXPORT: '/api/Accounting/GeneralVoucher/export',
    CREATE: '/api/Accounting/GeneralVoucher',
    UPDATE: (id: string) => `/api/Accounting/GeneralVoucher/${id}`,
    DELETE: (id: string) => `/api/Accounting/GeneralVoucher/${id}`,
    ATTACHMENT: (id: string) => `/api/Accounting/GeneralVoucher/${id}/attachment`,
    VALIDATE_BALANCE: '/api/Accounting/GeneralVoucher/validate-balance',
  },

  // ─── Period Closing — /api/V1/PeriodClosing/* ──────────────────────────────
  PERIOD_CLOSING: {
    GET_ALL: '/api/V1/PeriodClosing',
    CLOSE: '/api/V1/PeriodClosing/close',
    OPEN: '/api/V1/PeriodClosing/open',
    STATUS: '/api/V1/PeriodClosing/status',
  },

  // Transfer Contract — /api/TransferContract
  TRANSFER_CONTRACT: {
    GET_ALL: '/api/TransferContract',
    GET_BY_ID: (id: number | string) => `/api/TransferContract/${id}`,
    CREATE: '/api/TransferContract',
    EXPORT: '/api/TransferContract/export',
    DELETE: (id: number | string) => `/api/TransferContract/${id}`,
    SIGN: (id: number | string) => `/api/TransferContract/${id}/sign`,
    COMPLETE: (id: number | string) => `/api/TransferContract/${id}/complete`,
    AUTHORITY_STATUS: (id: number | string) => `/api/TransferContract/${id}/authority-status`,
  },

  // Medical Examination — /api/V1/MedicalExamination
  MEDICAL_EXAMINATION: {
    GET_ALL: '/api/V1/MedicalExamination',
    GET_BY_ID: (id: number | string) => `/api/V1/MedicalExamination/${id}`,
    CHECK_WORKER: (workerId: number | string) => `/api/V1/MedicalExamination/check-worker/${workerId}`,
    CREATE: '/api/V1/MedicalExamination',
    UPDATE: (id: number | string) => `/api/V1/MedicalExamination/${id}`,
    DELETE: (id: number | string) => `/api/V1/MedicalExamination/${id}`,
    REPORT: (id: number | string) => `/api/V1/MedicalExamination/report/${id}`,
  },

  // ─── Follow-Up Module (new /api/FollowUp/* routes) ───────────────────────

  // Follow-Up Status — master data (settings screen)
  FOLLOWUP_STATUS: {
    GET_ALL: '/api/FollowUp/FollowUpStatus/GetAll',
    GET_BY_ID: (id: number) => `/api/FollowUp/FollowUpStatus/GetById/${id}`,
    CREATE: '/api/FollowUp/FollowUpStatus/Create',
    UPDATE: '/api/FollowUp/FollowUpStatus/Update',
    DELETE: (id: number) => `/api/FollowUp/FollowUpStatus/Delete/${id}`,
  },

  // Contract Nationality — which nationalities are enrolled in the module
  CONTRACT_NATIONALITY: {
    GET_ALL: '/api/FollowUp/ContractNationality/GetAll',
    CREATE: '/api/FollowUp/ContractNationality/Create',
    UPDATE: '/api/FollowUp/ContractNationality/Update',
    DELETE: (id: number) => `/api/FollowUp/ContractNationality/Delete/${id}`,
  },

  // Nationality Follow-Up Config — per-nationality config grid
  NATIONALITY_FOLLOWUP_CONFIG: {
    GET_BY_NATIONALITY: (contractNationalityId: number) =>
      `/api/FollowUp/NationalityFollowUpConfig/GetByNationality/${contractNationalityId}`,
    TOGGLE_ACTIVE: (id: number) => `/api/FollowUp/NationalityFollowUpConfig/ToggleActive/${id}`,
    UPDATE: '/api/FollowUp/NationalityFollowUpConfig/Update',
    BULK_UPDATE: '/api/FollowUp/NationalityFollowUpConfig/BulkUpdate',
  },

  // ─── Mediation Follow-Up Module ──────────────────────────────────────────
  // Endpoints per followup_mediationContract.txt spec

  MEDIATION_FOLLOWUP: {
    DASHBOARD: '/api/Mediation/MediationFollowUp/dashboard',
    DASHBOARD_CARD: (contractId: string) => `/api/Mediation/MediationFollowUp/dashboard/${contractId}`,
    ITEMS: (contractId: string) => `/api/Mediation/MediationFollowUp/items/${contractId}`,
    ITEM: (itemId: string) => `/api/Mediation/MediationFollowUp/item/${itemId}`,
    UPDATE_DESCRIPTION: '/api/Mediation/MediationFollowUp/update-description',
  },

  // Contract Follow-Up (per mediation_contract_settings.txt spec)
  CONTRACT_FOLLOWUP: {
    CAN_COMPLETE: (itemId: string) => `/api/FollowUp/ContractFollowUp/CanComplete/${itemId}`,
    COMPLETE_ITEM: '/api/FollowUp/ContractFollowUp/CompleteItem',
  },

  // Contract Creation Requirement (per mediation_contract_settings.txt spec)
  // All IDs are UUIDs. nationalityId = ContractNationality.nationalityId (master UUID).
  CONTRACT_CREATION_REQUIREMENT: {
    GET_BY_NATIONALITY_AND_JOB:
      '/api/FollowUp/ContractCreationRequirement/GetByNationalityAndJob',
    GET_BY_ID: (id: string) =>
      `/api/FollowUp/ContractCreationRequirement/GetById/${id}`,
    CREATE: '/api/FollowUp/ContractCreationRequirement/Create',
    UPDATE: '/api/FollowUp/ContractCreationRequirement/Update',
    DELETE: (id: string) =>
      `/api/FollowUp/ContractCreationRequirement/Delete/${id}`,
  },

  // ─── HR Module (/api/V1/*) ───────────────────────────────────────────────

  HR_EMPLOYEE: {
    GET_ALL: '/api/V1/Employee',
    GET_BY_ID: (id: string) => `/api/V1/Employee/${id}`,
    CREATE: '/api/V1/Employee',
    UPDATE: (id: string) => `/api/V1/Employee/${id}`,
    DELETE: (id: string) => `/api/V1/Employee/${id}`,
    RESET_PASSWORD: (id: string) => `/api/V1/Employee/${id}/reset-password`,
  },

  HR_ATTENDANCE: {
    CHECK_IN: '/api/V1/Attendance/CheckIn',
    CHECK_OUT: '/api/V1/Attendance/CheckOut',
    FILTER: '/api/V1/Attendance/Filter',
  },

  HR_SHIFT: {
    GET_ALL: '/api/V1/Shift',
    GET_BY_ID: (id: string) => `/api/V1/Shift/${id}`,
    CREATE: '/api/V1/Shift',
    UPDATE: (id: string) => `/api/V1/Shift/${id}`,
    SET_ACTIVE: (id: string) => `/api/V1/Shift/${id}/active`,
    ASSIGN: '/api/V1/Shift/assign',
    CURRENT_EMPLOYEE: (employeeId: string) => `/api/V1/Shift/employee/${employeeId}/current`,
    EMPLOYEE_HISTORY: (employeeId: string) => `/api/V1/Shift/employee/${employeeId}/history`,
  },

  HR_LEAVE: {
    GET_ALL: '/api/V1/Leave',
    CREATE: '/api/V1/Leave',
    GET_BY_ID: (requestId: string) => `/api/V1/Leave/${requestId}`,
    GET_BALANCE: (leaveTypeId: string) => `/api/V1/Leave/balance/${leaveTypeId}`,
    EMPLOYEE_BALANCES: '/api/V1/Leave/employee-balances',
    APPROVE: (requestId: string) => `/api/V1/Leave/${requestId}/approve`,
    REJECT: (requestId: string) => `/api/V1/Leave/${requestId}/reject`,
    WITHDRAW: (requestId: string) => `/api/V1/Leave/${requestId}/withdraw`,
    CANCEL: (requestId: string) => `/api/V1/Leave/${requestId}/cancel`,
    PRINT: (requestId: string) => `/api/V1/VacationRequest/Print/${requestId}`,
  },

  HR_LEAVE_TYPE: {
    GET_ALL: '/api/V1/LeaveType',
    GET_BY_ID: (id: string) => `/api/V1/LeaveType/${id}`,
    CREATE: '/api/V1/LeaveType',
    UPDATE: (id: string) => `/api/V1/LeaveType/${id}`,
    DELETE: (id: string) => `/api/V1/LeaveType/${id}`,
  },

  HR_PAYROLL: {
    GENERATE: '/api/V1/Payroll/generate',
    GET: '/api/V1/Payroll',
    HISTORY: '/api/V1/Payroll/history',
    EXPORT: '/api/V1/Payroll/export',
    // Workflow is Generate → Approve → Close (verified live: Close returns
    // "Payroll must be approved before closing" until the run is approved).
    APPROVE: (id: string) => `/api/V1/Payroll/${id}/approve`,
    CLOSE: (id: string) => `/api/V1/Payroll/close/${id}`,
  },

  HR_PERMISSION_REQUEST: {
    GET_ALL: '/api/V1/PermissionRequest/GetAll',
    GET_BY_ID: (id: string) => `/api/V1/PermissionRequest/${id}`,
    CREATE: '/api/V1/PermissionRequest/Create',
    APPROVE: (id: string) => `/api/V1/PermissionRequest/Approve/${id}`,
    REJECT: (id: string) => `/api/V1/PermissionRequest/Reject/${id}`,
    WITHDRAW: (id: string) => `/api/V1/PermissionRequest/Withdraw/${id}`,
    PRINT: (id: string) => `/api/V1/PermissionRequest/Print/${id}`,
  },

  HR_RESIGNATION_REQUEST: {
    GET_ALL: '/api/V1/ResignationRequest/GetAll',
    GET_BY_ID: (id: string) => `/api/V1/ResignationRequest/${id}`,
    CREATE: '/api/V1/ResignationRequest/Create',
    APPROVE: (id: string) => `/api/V1/ResignationRequest/Approve/${id}`,
    REJECT: (id: string) => `/api/V1/ResignationRequest/Reject/${id}`,
    WITHDRAW: (id: string) => `/api/V1/ResignationRequest/Withdraw/${id}`,
    PRINT: (id: string) => `/api/V1/ResignationRequest/Print/${id}`,
  },

  HR_CUSTODY_REQUEST: {
    GET_ALL: '/api/V1/CustodyRequest/GetAll',
    GET_BY_ID: (id: string) => `/api/V1/CustodyRequest/${id}`,
    CREATE: '/api/V1/CustodyRequest/Create',
    APPROVE: (id: string) => `/api/V1/CustodyRequest/Approve/${id}`,
    REJECT: (id: string) => `/api/V1/CustodyRequest/Reject/${id}`,
    WITHDRAW: (id: string) => `/api/V1/CustodyRequest/Withdraw/${id}`,
    PRINT: (id: string) => `/api/V1/CustodyRequest/Print/${id}`,
    GET_TYPES: '/api/V1/CustodyRequest/Types',
    GET_TYPE: (id: string) => `/api/V1/CustodyRequest/Types/${id}`,
    CREATE_TYPE: '/api/V1/CustodyRequest/Types/Create',
  },

  HR_REPORT: {
    EXPORT: '/api/V1/HRReport/export',
  },

  NOTIFICATIONS: {
    GET_ALL: '/api/V1/Notifications',
    UNREAD: '/api/V1/Notifications/unread',
    UNREAD_COUNT: '/api/V1/Notifications/unread-count',
    MARK_READ: (id: string) => `/api/V1/Notifications/${id}/read`,
    READ_ALL: '/api/V1/Notifications/read-all',
    DELETE: (id: string) => `/api/V1/Notifications/${id}`,
  },

  // Plumbing only — no inbox/outbox UI feature exists yet in the HR module
  // (see HRRequestsInboxService / HRRequestsOutboxService in hr.service.ts).
  HR_REQUESTS_INBOX: {
    FILTER: '/api/V1/RequestsInbox/Filter',
  },

  HR_REQUESTS_OUTBOX: {
    // NOTE: base path is `/api/HR/...`, not `/api/V1/...` (verified against spec).
    FILTER: '/api/HR/RequestsOutbox/Filter',
  },

  // ─── Department (/api/V1/Department) ─────────────────────────────────────
  // NOTE: POST uses query params (nameAr, nameEn), not a JSON body.

  DEPARTMENT: {
    GET_ALL: '/api/V1/Department',
    GET_BY_ID: (id: string) => `/api/V1/Department/${id}`,
    LOOKUP: '/api/V1/Lookup/Departments',
    CREATE: '/api/V1/Department',
    UPDATE: (id: string) => `/api/V1/Department/${id}`,
    DELETE: (id: string) => `/api/V1/Department/${id}`,
  },

  // ─── Admin API (/api/V1/Admin/*) ─────────────────────────────────────────
  // Position = Job = JobId = JobName — unified entity referenced by employees

  HR_ADMIN: {
    ADD_USER: '/api/V1/Admin/add-user',
    ASSIGN_ROLE: '/api/V1/Admin/assign-role',
    REMOVE_ROLE: '/api/V1/Admin/remove-role',
    ALL_USERS: '/api/V1/Admin/all-users',
    ALL_ROLES: '/api/V1/Admin/all-roles',
    POSITIONS: '/api/V1/Admin/positions',
    CREATE_POSITION: '/api/V1/Admin/create-position',
    DELETE_POSITION: (id: string) => `/api/V1/Admin/delete-position/${id}`,
  },

  // ─── Housing Management — /api/Housing/* ─────────────────────────────────
  HOUSING: {
    GET_ALL: '/api/Housing/GetAll',
    GET_BY_ID: (id: string) => `/api/Housing/${id}`,
    GET_ACTIVE_LIST: '/api/Housing/GetActiveList',
    CREATE: '/api/Housing',
    UPDATE: (id: string) => `/api/Housing/${id}`,
    TOGGLE_ACTIVE: (id: string) => `/api/Housing/ToggleActive/${id}`,
    DELETE: (id: string) => `/api/Housing/${id}`,
  },

  // ─── Worker Status Log — extends existing Worker routes ──────────────────
  WORKER_STATUS_LOG: {
    CREATE: '/api/V1/Worker/StatusLog',
    DELETE: (id: string) => `/api/V1/Worker/${id}/StatusLog/Last`,
    ACTIVATE_WANTS_WORK: (id: string) => `/api/V1/Worker/${id}/ActivateWantsWork`,
    ACTIVATE_WANTS_TRANSFER: (id: string) => `/api/V1/Worker/${id}/ActivateWantsTransfer`,
  },

  // ─── Worker housing/pathway actions — /api/V1/Worker/* ───────────────────
  WORKER_MASTER: {
    HOUSED: '/api/V1/Worker/Housed',
    DEPORTATION: (workerId: string) => `/api/V1/Worker/${workerId}/Deportation`,
    CANCEL_DEPORTATION: (workerId: string) => `/api/V1/Worker/${workerId}/CancelDeportation`,
    HANDOVER: (workerId: string) => `/api/V1/Worker/${workerId}/Handover`,
    ISSUE_RESIDENCY: (workerId: string) => `/api/V1/Worker/${workerId}/IssueResidency`,
    ADD_UPDATE: (workerId: string) => `/api/V1/Worker/${workerId}/AddUpdate`,
    EXIT_AND_REENTRY: (workerId: string) => `/api/V1/Worker/${workerId}/ExitAndReEntry`,
    EXIT_HOUSING: (workerId: string) => `/api/V1/Worker/${workerId}/ExitHousing`,
  },

  // ─── Accounting: Chart of Accounts — /api/V1/account/* ────────────────────
  // Account code first digit → type: 1=Asset 2=Liability 3=Equity
  // 4=Revenue 5=OpEx 6=AdminEx. All IDs are GUIDs.
  ACCOUNT: {
    // GET full hierarchical account tree (nested children)
    FULL_TREE: '/api/V1/account/full-tree-structure',
    // GET sub-tree rooted at a parent account
    SUBTREE: (parentId: string) => `/api/V1/account/subtree/${parentId}`,
    // POST create a new account (parent becomes a non-leaf node automatically)
    CREATE: '/api/V1/account/create-account',
    // PUT update an account's display name
    UPDATE: (accountId: string) => `/api/V1/account/update-account/${accountId}`,
    // PUT update income-statement / P&L side + trial-balance grouping flag
    REPORTING: (accountId: string) => `/api/V1/account/reporting/${accountId}`,
    // DELETE a leaf account (fails if it has children or financial movements)
    DELETE: (accountId: string) => `/api/V1/account/delete-account/${accountId}`,
    // GET paginated account list with report-side settings
    SETTINGS: '/api/V1/account/settings',
  },

  // ─── Accounting: Restriction (journal entry) Types — /api/V1/restrictiontype/* ──
  // NOTE: POST (create) currently returns 501 Not Implemented server-side.
  RESTRICTION_TYPE: {
    GET_ALL: '/api/V1/restrictiontype',
    GET_BY_ID: (id: string) => `/api/V1/restrictiontype/${id}`,
    CREATE: '/api/V1/restrictiontype',
    UPDATE: (id: string) => `/api/V1/restrictiontype/${id}`,
    DELETE: (id: string) => `/api/V1/restrictiontype/${id}`,
  },

  // ─── Accounting: Journal Entries — /api/V1/JournalEntries/* ───────────────
  // Manual double-entry accounting. Created as Draft; debits must equal credits.
  // Only Draft entries can be updated or deleted. All IDs are GUIDs.
  JOURNAL_ENTRIES: {
    GET_ALL: '/api/V1/JournalEntries',
    SEARCH: '/api/V1/JournalEntries/search',
    LOOKUPS: '/api/V1/JournalEntries/lookups',
    GET_BY_ID: (id: string) => `/api/V1/JournalEntries/${id}`,
    CREATE: '/api/V1/JournalEntries',
    UPDATE: (id: string) => `/api/V1/JournalEntries/${id}`,
    DELETE: (id: string) => `/api/V1/JournalEntries/${id}`,
  },

  // ─── Accounting: Posting / Unposting — /api/V1/Posting/* ──────────────────
  // Posting commits a Draft entry to the ledger; unposting reverses it to Draft.
  POSTING: {
    POST: (journalId: string) => `/api/V1/Posting/${journalId}`,
    UNPOST: (id: string) => `/api/V1/Posting/${id}/unpost`,
  },

  // ─── Accounting: Ledger & Reports — /api/V1/Ledger/* ──────────────────────
  // Read-only reports. All return ONLY Posted data and accept from/to (ISO 8601).
  LEDGER: {
    GENERAL: '/api/V1/Ledger/general-ledger',
    AGENT: '/api/V1/Ledger/agent-ledger',
    CUSTOMER: '/api/V1/Ledger/customer-ledger',
    WORKER: '/api/V1/Ledger/worker-ledger',
    TRIAL_BALANCE: '/api/V1/Ledger/trial-balance',
    INCOME_STATEMENT: '/api/V1/Ledger/income-statement',
    BALANCE_SHEET: '/api/V1/Ledger/balance-sheet',
    VAT_REPORT: '/api/V1/Ledger/vat-report',
  },

  // ─── Hourly Workers — /api/V1/HourlyWorkers/* ─────────────────────────────
  // Worker pool. Note: Activate/Deactivate are POST with NO body — pass {} so a
  // Content-Length:0 header is sent (the server returns 411 otherwise).
  HOURLY_WORKERS: {
    GET_ALL: '/api/V1/HourlyWorkers',
    GET_BY_ID: (id: string) => `/api/V1/HourlyWorkers/${id}`,
    CREATE: '/api/V1/HourlyWorkers',
    UPDATE: (id: string) => `/api/V1/HourlyWorkers/${id}`,
    DELETE: (id: string) => `/api/V1/HourlyWorkers/${id}`,
    ACTIVATE: (id: string) => `/api/V1/HourlyWorkers/${id}/Activate`,
    DEACTIVATE: (id: string) => `/api/V1/HourlyWorkers/${id}/Deactivate`,
    // Zero-footprint stub (service+type only, no UI — see architecture note).
    GET_AVAILABLE: '/api/V1/HourlyWorkers/Available',
  },

  // ─── Hourly Worker Requests — /api/V1/HourlyWorkerRequests/* ──────────────
  // Requests originate from mobile (no create endpoint). Dashboard reviews,
  // assigns one worker, and drives the lifecycle. All action POSTs take {} body
  // except Assign ({workerId}) and Reject ({notes?}).
  HOURLY_WORKER_REQUESTS: {
    GET_ALL: '/api/V1/HourlyWorkerRequests',
    GET_BY_ID: (id: string) => `/api/V1/HourlyWorkerRequests/${id}`,
    GET_DETAIL: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/Detail`,
    GET_TIMELINE: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/Timeline`,
    GET_LOGS: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/Logs`,
    GET_PAYMENTS: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/Payments`,
    GET_ASSIGNMENTS: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/Assignments`,
    UPDATE_ASSIGNMENT_STATUS: (id: string, assignmentId: string) =>
      `/api/V1/HourlyWorkerRequests/${id}/Assignments/${assignmentId}/Status`,
    DELETE_ASSIGNMENT: (id: string, assignmentId: string) =>
      `/api/V1/HourlyWorkerRequests/${id}/Assignments/${assignmentId}`,
    ADD_INTERNAL_NOTE: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/InternalNotes`,
    TRACK: (ticketNumber: string) => `/api/V1/HourlyWorkerRequests/Track/${ticketNumber}`,
    APPROVE: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/Approve`,
    REJECT: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/Reject`,
    ASSIGN: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/Assign`,
    IN_PROGRESS: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/InProgress`,
    COMPLETE: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/Complete`,
    CANCEL: (id: string) => `/api/V1/HourlyWorkerRequests/${id}/Cancel`,
  },

  // ─── Hourly Worker Orders — /api/V1/HourlyWorkerOrders/* ─────────────────────
  HOURLY_WORKER_ORDERS: {
    RECOMMENDED_WORKERS: (orderId: string) =>
      `/api/V1/HourlyWorkerOrders/${orderId}/RecommendedWorkers`,
    ASSIGN_DRIVER: (orderId: string) => `/api/V1/HourlyWorkerOrders/${orderId}/AssignDriver`,
    GET_TRACKING: (orderId: string) => `/api/V1/HourlyWorkerOrders/${orderId}/Tracking`,
    POST_TRACKING: (orderId: string) => `/api/V1/HourlyWorkerOrders/${orderId}/Tracking`,
    GET_INVOICES: (orderId: string) => `/api/V1/HourlyWorkerOrders/${orderId}/Invoices`,
    POST_INVOICE: (orderId: string) => `/api/V1/HourlyWorkerOrders/${orderId}/Invoices`,
    GET_ACCOMMODATION: (orderId: string) =>
      `/api/V1/HourlyWorkerOrders/${orderId}/Accommodation`,
    POST_ACCOMMODATION: (orderId: string) =>
      `/api/V1/HourlyWorkerOrders/${orderId}/Accommodation`,
    UPDATE_ACCOMMODATION_STATUS: (orderId: string, accommodationId: string) =>
      `/api/V1/HourlyWorkerOrders/${orderId}/Accommodation/${accommodationId}/Status`,
  },

  // ─── Hourly Drivers — /api/V1/HourlyDrivers/* ────────────────────────────────
  HOURLY_DRIVERS: {
    GET_ALL: '/api/V1/HourlyDrivers',
    GET_BY_ID: (id: string) => `/api/V1/HourlyDrivers/${id}`,
    CREATE: '/api/V1/HourlyDrivers',
    UPDATE: (id: string) => `/api/V1/HourlyDrivers/${id}`,
    DELETE: (id: string) => `/api/V1/HourlyDrivers/${id}`,
    ACTIVATE: (id: string) => `/api/V1/HourlyDrivers/${id}/Activate`,
    DEACTIVATE: (id: string) => `/api/V1/HourlyDrivers/${id}/Deactivate`,
    GET_ORDERS: (driverId: string) => `/api/V1/HourlyDrivers/${driverId}/Orders`,
    TRANSPORT_STATUS: (driverId: string, orderId: string) =>
      `/api/V1/HourlyDrivers/${driverId}/Orders/${orderId}/TransportStatus`,
  },

  // ─── Hourly Catalog — /api/V1/HourlyCatalog/* ────────────────────────────────
  HOURLY_CATALOG: {
    PACKAGES: '/api/V1/HourlyCatalog/Packages',
    SERVING_AREAS: '/api/V1/HourlyCatalog/ServingAreas',
    ADMIN_PACKAGES: '/api/V1/HourlyCatalog/Admin/Packages',
    ADMIN_PACKAGE_BY_ID: (id: string) => `/api/V1/HourlyCatalog/Admin/Packages/${id}`,
    ADMIN_UPDATE_PACKAGE: (id: string) => `/api/V1/HourlyCatalog/Admin/Packages/${id}`,
    ADMIN_DELETE_PACKAGE: (id: string) => `/api/V1/HourlyCatalog/Admin/Packages/${id}`,
    ADMIN_SERVING_AREAS: '/api/V1/HourlyCatalog/Admin/ServingAreas',
    ADMIN_SERVING_AREA_BY_ID: (id: string) => `/api/V1/HourlyCatalog/Admin/ServingAreas/${id}`,
    ADMIN_UPDATE_SERVING_AREA: (id: string) =>
      `/api/V1/HourlyCatalog/Admin/ServingAreas/${id}`,
    ADMIN_DELETE_SERVING_AREA: (id: string) =>
      `/api/V1/HourlyCatalog/Admin/ServingAreas/${id}`,
  },

  // ─── Hourly Order Payments — /api/V1/HourlyOrderPayments/* ───────────────────
  HOURLY_ORDER_PAYMENTS: {
    GET_ALL: '/api/V1/HourlyOrderPayments',
    REFUND: (id: string) => `/api/V1/HourlyOrderPayments/${id}/Refund`,
  },

  // ─── Hourly Order Notifications — /api/V1/HourlyOrderNotifications/* ──────────
  HOURLY_ORDER_NOTIFICATIONS: {
    GET_ALL: '/api/V1/HourlyOrderNotifications',
    RETRY: (id: string) => `/api/V1/HourlyOrderNotifications/${id}/Retry`,
  },

  // ─── Hourly Reports — /api/V1/HourlyWorkerReports/* ──────────────────────────
  HOURLY_REPORTS: {
    ORDERS_SUMMARY: '/api/V1/HourlyWorkerReports/OrdersSummary',
    REVENUE: '/api/V1/HourlyWorkerReports/Revenue',
    WORKER_UTILIZATION: '/api/V1/HourlyWorkerReports/WorkerUtilization',
    DRIVER_PERFORMANCE: '/api/V1/HourlyWorkerReports/DriverPerformance',
  },

  // ─── Hourly Customer — /api/V1/HourlyCustomer/* ──────────────────────────────
  // Zero-footprint stub (service+type only, no UI — see architecture note):
  // customer-facing order history, out of scope for the admin dashboard.
  HOURLY_CUSTOMER: {
    GET_ORDERS: '/api/V1/HourlyCustomer/Orders',
  },

  // ─── Hourly Worker Portal — /api/V1/HourlyWorkerPortal/* ─────────────────────
  HOURLY_WORKER_PORTAL: {
    GET_ASSIGNMENTS: (workerId: string) =>
      `/api/V1/HourlyWorkerPortal/${workerId}/Assignments`,
    // Zero-footprint stub (service+type only, no UI — see architecture note):
    // the logged-in worker's own assignments (self-service portal).
    GET_MY_ASSIGNMENTS: '/api/V1/HourlyWorkerPortal/me/Assignments',
    UPDATE_ASSIGNMENT_STATUS: (workerId: string, assignmentId: string) =>
      `/api/V1/HourlyWorkerPortal/${workerId}/Assignments/${assignmentId}/Status`,
    GET_SCHEDULE: (workerId: string) => `/api/V1/HourlyWorkerPortal/${workerId}/Schedule`,
  },

  // ─── ZATCA — /api/V1/Zatca/* ──────────────────────────────────────────────────
  // Saudi e-invoicing (Fatoora) compliance module. All GETs require a bearer
  // token (this controller enforces auth, unlike most of this backend) and take
  // `branchId` explicitly as a query param — the global X-Branch-Id header is
  // sent too but these routes don't rely on it. Status/type values are numeric;
  // resolve names via LOOKUPS, never hardcode them (see zatca.types.ts).
  ZATCA: {
    LOOKUPS: '/api/V1/Zatca/lookups',
    DASHBOARD_SUMMARY: '/api/V1/Zatca/dashboard/summary',
    HEALTH: '/api/V1/Zatca/health',
    BRANCH_CONTEXT: '/api/V1/Zatca/branch-context',
    UPDATE_BRANCH_PROFILE: '/api/V1/Zatca/branch-profile',
    EGS_UNITS: '/api/V1/Zatca/egs-units',
    IMPORT_CERTIFICATE: '/api/V1/Zatca/certificates/import',
    GENERATE_CSR: '/api/V1/Zatca/csr/generate',
    REQUEST_COMPLIANCE_CSID: '/api/V1/Zatca/csr/compliance-csid',
    REQUEST_PRODUCTION_CSID: '/api/V1/Zatca/csr/production-csid',
    GLOBAL_SETTINGS: '/api/V1/Zatca/settings/global',
    BRANCH_SETTINGS: '/api/V1/Zatca/settings/branch',
    INVOICES: '/api/V1/Zatca/invoices',
    INVOICE_BY_ID: (id: string) => `/api/V1/Zatca/invoices/${id}`,
    CSR_REQUESTS: '/api/V1/Zatca/csr',
    CERTIFICATES: '/api/V1/Zatca/certificates',
    CERTIFICATE_HISTORY: '/api/V1/Zatca/certificates/history',
    CERTIFICATE_EXPIRATION: '/api/V1/Zatca/certificates/expiration',
    CONNECTION_TEST: '/api/V1/Zatca/connection/test',
    REQUEST_LOGS: '/api/V1/Zatca/logs/requests',
    REQUEST_LOG_BY_ID: (id: string) => `/api/V1/Zatca/logs/requests/${id}`,
    SUBMISSION_LOGS: '/api/V1/Zatca/logs/submissions',
    DIAGNOSTICS: '/api/V1/Zatca/diagnostics',
  },
} as const;
