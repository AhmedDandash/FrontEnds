# Worker Availability Logic (Backend)

This document describes the **backend** rules for when a worker is considered available / busy for contract assignment. Frontend screens must follow these rules (same filters / same endpoints). Do not invent a parallel “available” definition on the client.

---

## 1) Core concepts

| Concept | Where it lives | Meaning |
|--------|----------------|---------|
| `Worker.WorkerStatus` | Column on `Worker` | Lifecycle: processing → kingdom → accommodation → customer |
| Contract links | Mediation / Operating / Transfer | Make a worker **busy** while the contract is active |

Availability for picking a worker on a contract is computed mainly from **active flag + contracts**, not from a single “available” flag.

---

## 2) `WorkerStatus` enum (source of truth)

Defined in `Sigma.Domain.Enums.WorkerStatus`:

| Value | Member | Arabic |
|------:|--------|--------|
| 1 | `UnderProcessing` | تحت الإعداد |
| 2 | `InKingdom` | داخل المملكة |
| 3 | `InAccommodation` | في السكن / متاحة |
| 4 | `AtCustomer` | عند العميل |

**Notes**
- Value `3` (`InAccommodation`) means **in accommodation / available (not at customer)**.
- Value `1` is **not** “available for pick”. It means under processing.
- Backend write endpoints accept only `1..4`.

### Typical status transitions (backend)

| Event | Resulting `WorkerStatus` |
|-------|--------------------------|
| Move to accommodation | `InAccommodation` (3) |
| Worker refusal path that returns to accommodation | `InAccommodation` (3) |
| Assigned to active operating contract | `AtCustomer` (4) if was `InAccommodation` |
| Operating contract finished / terminated | `InAccommodation` (3) |

Code references:
- `WorkerService.MoveToAccommodationAsync`
- `EmploymentOperatingContractService` (assign / terminate)

---

## 3) Available for mediation / contract assignment

### Endpoint

```http
GET /api/V1/Worker?availableForMediationContract=true
```

Optional passport search used by contract create/assign:

```http
GET /api/V1/Worker
  ?availableForMediationContract=true
  &searchByPassportOnly=true
  &passportNo={partial}
  &PageSize=50
```

Implemented in `WorkerService.ApplyWorkerFilters` when `WorkerQuery.AvailableForMediationContract == true`.

### Rule (ALL must be true)

1. `Worker.IsActive == true`
2. **Not** on a busy mediation contract  
   - has `WorkerId`  
   - `IsCancel != true`  
   - status is **not** `Completed` / `Cancelled` / `Returned`  
   - if `StatusId` is `null`, the contract is treated as **busy**
3. **Not** on a non-finished operating contract  
   - has `WorkerId`  
   - `IsFinish != true`
4. **Not** on an in-progress transfer contract  
   - status is **not** `Completed` / `TransferCompleted`

### What this filter does **not** check

- Does **not** require `WorkerStatus == 3`
- Does **not** use `WantsWork` / `WantsTransfer`

Use this endpoint whenever the UI needs “pick a free worker for a contract”.

---

## 4) Preference flags (optional list filters only)

| Flag | Meaning |
|------|---------|
| `WantsWork` | Wants operating work |
| `WantsTransfer` | Wants transfer |
| `IsReadyForDeportation` | Marked for deportation |
| `IsReadyForHandover` | Ready for handover/delivery |
| `IsResidencyIssued` | Residency issued |

These may refine lists elsewhere; they do **not** replace the contract-busy checks in §3.

---

## 5) How frontend must apply this

| UI need | Use this |
|---------|----------|
| List workers free to assign on mediation (or similar) contracts | `GET /api/V1/Worker?availableForMediationContract=true` (+ passport params if searching) |
| Show “في السكن / متاحة” as status label | `WorkerStatus == 3` (`InAccommodation`) |
| Do **not** treat `WorkerStatus == 1` as “available for pick” | `1` = `UnderProcessing` only |

Any screen titled “available workers” that needs contract-ready workers must use **§3**, not a client-only `workerStatus === 1` filter.

---

## 6) Quick decision tree

```
Need worker for a new/assign mediation contract?
  └─ availableForMediationContract=true
       └─ active AND not busy on mediation/operating/transfer

Need status label “في السكن / متاحة”?
  └─ WorkerStatus == InAccommodation (3)
```

---

## 7) Key source files

| Area | File |
|------|------|
| Mediation availability filter | `Sigma.Application/Services/WorkerService.cs` → `ApplyWorkerFilters` |
| Query DTO | `Sigma.Shared/DTO/Worker/WorkerQuery.cs` |
| API | `Sigma.API/Controllers/WorkerController.cs` (`GetAll`) |
| Enum | `Sigma.Domain/Enums/WorkerStatus.cs` |
