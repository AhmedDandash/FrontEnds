# المتابعة التلقائية — دليل الفرونت (تخطيط مساعد)

هذا الملف مخصص لفريق الواجهات. الـ Backend أعاد تشكيل **response** شاشة المتابعة التلقائية ليطابق شاشة مساعد: **الحالات على الجانب**، **التفاصيل في المنتصف**، و**البيانات المهمة ظاهرة مباشرة** من العميل / العامل / الوكيل **بدون انتظار تعبئة الموظف**.

> Breaking change: شكل `GET /dashboard` تغيّر بالكامل. لا تعتمد على الحقول المسطحة القديمة مثل `customerName` و`workerPassportNumber` في جذر العنصر.

---

## 1) الفكرة

| المنطقة في الشاشة (RTL) | المصدر في الـ JSON | ملاحظات |
|---|---|---|
| العمود الأيمن (هوية العقد) | `header` + رقم العقد + الحالة | رقم العقد كبير، اسم العميل، الجوال، التأشيرة، اسم الوكيل |
| المنتصف | `highlights` + `offer` + `customer` + `worker` + `followUpStages` | البيانات المهمة ظاهرة دائماً |
| الجانب الأيسر | `timeline` | خط زمني لحالات العقد (تم الإنشاء، موافقة الوزارة، …) |

البيانات التالية **تُملأ تلقائياً من جداول النظام** وليست حقول متابعة يدخلها الموظف:

- تاريخ ميلاد العميل
- جنسية العميل
- جنسية العامل
- رقم هوية العميل
- رقم جواز العامل
- اسم الوكيل

اعرضها على البطاقة من `highlights` حتى لو كانت مراحل المتابعة `Pending`.

---

## 2) المسارات

القاعدة: `{{BaseUrl}}/api/Mediation/MediationFollowUp`

| الغرض | Method | المسار | صلاحية |
|---|---|---|---|
| قائمة البطاقات | `GET` | `/dashboard` | `AutomaticFollowUp.View` |
| بطاقة عقد واحد (شاشة التفاصيل) | `GET` | `/dashboard/{contractId}` | `AutomaticFollowUp.View` |
| مراحل المتابعة فقط | `GET` | `/items/{contractId}` | `AutomaticFollowUp.View` |
| بند واحد | `GET` | `/item/{itemId}` | `AutomaticFollowUp.View` |
| حفظ وصف مرحلة (يُتمّ المرحلة) | `POST` | `/update-description` | `AutomaticFollowUp.Manage` |

Header مطلوب:

```http
Authorization: Bearer {{Token}}
```

فلاتر القائمة هي نفس `FilterMediationContractDto` السابقة (`Page`, `PageSize`, `Search`, رقم العقد، الهوية، الجواز، الحالة، الجنسية، …).

---

## 3) شكل عنصر القائمة / بطاقة التفاصيل

`GET /dashboard` يرجع صفحة:

```json
{
  "isSuccess": true,
  "data": {
    "items": [ { "...بطاقة واحدة..." } ],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 10
  }
}
```

`GET /dashboard/{contractId}` يرجع نفس شكل البطاقة مباشرة داخل `data`.

### 3.1 الحقول الأساسية

| JSON | الاستخدام في الواجهة |
|---|---|
| `id` | معرّف العقد (للتنقل إلى التفاصيل) |
| `contractNumber` | الرقم الكبير (مثل 7832) |
| `statusId` | كود حالة العقد |
| `statusNameAr` / `statusNameEn` | نص الحالة |
| `musanedContractNumber` | رقم مساند |
| `daysSinceCreation` | «أنشئ منذ X يوم» |
| `daysSinceLastUpdate` | «عدد الأيام منذ آخر تحديث» |
| `lastUpdatedAt` | تاريخ آخر تحديث |
| `currentFollowUpItemId` | المرحلة الحالية في المتابعة |
| `currentFollowUpStatusNameAr` | اسم المرحلة الحالية |

### 3.2 `highlights` — اعرضها دائماً على البطاقة

```json
"highlights": {
  "customerBirthDate": "1990-04-23",
  "customerBirthDateHijri": "1410/10/28",
  "customerNationality": "سعودي",
  "workerNationalityAr": "باكستان",
  "workerNationalityEn": "Pakistan",
  "customerNationalId": "1089951683",
  "workerPassportNumber": "P478999",
  "agentName": "معين"
}
```

أي قيمة `null` اعرضها `—`. لا تخفِ البطاقة ولا تطلب من الموظف تعبئة هذه الحقول.

### 3.3 `header` — العمود الأيمن

```json
"header": {
  "customerName": "مذكر زائد مذكر العتيبي",
  "customerPhone": "0558737456",
  "customerEmail": null,
  "visaNumber": "1907986088",
  "agentName": "معين",
  "workerStatusNameAr": "تحت الإجراء",
  "workerStatusNameEn": "Under processing",
  "customerCity": "جدة",
  "contractCategoryName": "Standard"
}
```

### 3.4 `offer` — المنتصف (بيانات العرض)

| JSON | المعنى |
|---|---|
| `offerAmount` | العرض |
| `otherCosts` | أخرى |
| `salary` | الراتب |
| `totalTaxValue` | الضريبة |
| `totalCost` | إجمالي العقد |
| `totalPaid` / `remainingAmount` / `paymentStatus` | حالة السداد |

### 3.5 `customer` و `worker` و `agent` و `visa`

كائنات كاملة لنفس البيانات (لشاشة التفاصيل). القائمة يمكن أن تكتفي بـ `highlights` + `header`.

من `worker`:

- `passportNumber`
- `nationalityAr`
- `age`
- `religionNameAr`
- `photoUrl`
- `isExternal` = جواز معلق والعامل غير مسجّل بعد

### 3.6 `timeline` — الجانب (حالات العقد)

مرتبة زمنياً من الأقدم إلى الأحدث. آخر عنصر `isCurrent: true`.

```json
"timeline": [
  {
    "id": "...",
    "date": "2026-09-09T00:00:00Z",
    "statusId": 2,
    "statusNameAr": "تم التوقيع",
    "statusNameEn": "Signed",
    "notes": "تم التوقيع والدفع في مساند",
    "createdByName": "...",
    "isCurrent": false
  }
]
```

اعرض: التاريخ + اسم الحالة + رقم مساند إن وُجد في العقد (`musanedContractNumber` على مستوى البطاقة).

### 3.7 `followUpStages` — مراحل المتابعة في المنتصف

نفس شكل `ContractFollowUpItemDto`. استخدمها كأزرار/قائمة مراحل (فحص طبي، تأشير، حجز تذكرة، …).

| JSON | المعنى |
|---|---|
| `id` | معرّف البند |
| `statusNameAr` / `statusNameEn` | اسم المرحلة |
| `sortOrder` | الترتيب |
| `result` | `1` قيد الانتظار، `2` مكتمل، `3` فشل، `4` متجاوز |
| `resultName` | نص عربي للعرض |
| `completedAt` | وقت الإتمام |
| `canComplete` | `false` إذا المرحلة السابقة غير مكتملة — عطّل الزر |
| `inputDescription` | وصف أدخله الموظف للمرحلة (اختياري) |

**لا تعتمد على `resultName` في المنطق.** استخدم `result` الرقمي.

المرحلة الحالية للتمييز البصري: `currentFollowUpItemId`.

---

## 4) تخطيط مقترح (مثل مساعد)

```
[RTL]

┌──────────────────┬─────────────────────────────┬─────────────────┐
│ timeline[]       │ highlights + offer           │ رقم العقد       │
│ حالات العقد      │ جنسية / هوية / جواز / وكيل   │ header.customer │
│ التاريخ + الاسم  │ followUpStages (أزرار)       │ جوال / تأشيرة   │
│                  │ worker + customer details     │ اسم الوكيل     │
└──────────────────┴─────────────────────────────┴─────────────────┘
```

شاشة القائمة: بطاقة واحدة لكل عنصر في `items`.  
شاشة التفاصيل: نفس الـ payload من `GET /dashboard/{contractId}` — لا حاجة لاستدعاءات متعددة لعرض الهوية والتايملاين. استدعِ `/items/{id}` فقط إذا احتجت تحديث المراحل بعد حفظ وصف.

---

## 5) حفظ وصف مرحلة

`POST /update-description`

```json
{
  "itemId": "guid",
  "inputDescription": "نص أو HTML"
}
```

بعد النجاح تصبح المرحلة `Completed`. أعد جلب البطاقة أو قائمة المراحل.

أرسل JSON عبر `JSON.stringify` / axios — لا تبنِ النص يدوياً إذا كان الوصف متعدد الأسطر.

---

## 6) أكواد الحالات

### حالة العقد `statusId`

| القيمة | عربي |
|---:|---|
| 1 | عقد جديد |
| 2 | تم التوقيع |
| 3 | بدء المتابعة |
| 4 | إصدار التأشيرة |
| 5 | الفحص الطبي |
| 6 | التدريب |
| 7 | موافقة الجهات |
| 8 | حجز التذكرة |
| 9 | خروج العاملة |
| 10 | وصول العاملة |
| 11 | إنشاء نموذج الاستلام |
| 12 | توقيع العميل |
| 13 | تم التسليم |
| 14 | فترة الضمان |
| 15 | اكتمال العقد |
| 16 | تم إرجاع العاملة |
| 17 | ملغي |

القائمة الافتراضية تعرض العقود من حالة التوقيع حتى ما قبل الاكتمال وغير الملغاة.

### نتيجة مرحلة المتابعة `result`

| القيمة | عربي |
|---:|---|
| 1 | قيد الانتظار |
| 2 | مكتمل |
| 3 | فشل |
| 4 | متجاوز |

لوّن المكتمل أخضر، الحالي أزرق/نشط، والباقي رمادي — بدون اشتراط وجود `inputDescription`.

---

## 7) مثال TypeScript

```ts
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

export interface FollowUpTimelineEvent {
  id?: string | null;
  date?: string | null;
  statusId: number;
  statusNameAr: string;
  statusNameEn: string;
  notes?: string | null;
  isCurrent: boolean;
}

export interface AutomaticFollowUpCard {
  id: string;
  contractNumber: number;
  statusId?: number | null;
  statusNameAr: string;
  musanedContractNumber?: string | null;
  daysSinceCreation: number;
  daysSinceLastUpdate: number;
  highlights: FollowUpHighlights;
  header: {
    customerName?: string | null;
    customerPhone?: string | null;
    visaNumber?: string | null;
    agentName?: string | null;
    workerStatusNameAr?: string | null;
    customerCity?: string | null;
  };
  offer: {
    offerAmount?: number | null;
    otherCosts?: number | null;
    salary?: number | null;
    totalCost?: number | null;
    paymentStatus: string;
  };
  customer: { nationalId?: string | null; nationality?: string | null; birthDate?: string | null };
  worker: { passportNumber?: string | null; nationalityAr?: string | null; photoUrl?: string | null };
  agent: { nameAr?: string | null };
  timeline: FollowUpTimelineEvent[];
  followUpStages: Array<{
    id: string;
    statusNameAr?: string | null;
    result?: number | null;
    canComplete: boolean;
    sortOrder?: number | null;
  }>;
  currentFollowUpItemId?: string | null;
}
```

---

## 8) قواعد واجهة مهمة

1. **البيانات المهمة من `highlights` دائماً ظاهرة** — ليست نتيجة فورم الموظف.
2. **لا تمنع عرض البطاقة** إذا كانت مراحل المتابعة فارغة أو قيد الانتظار.
3. **الجانب = `timeline`** (حالات العقد)، **المنتصف = التفاصيل + `followUpStages`**.
4. عطّل إتمام مرحلة عندما `canComplete === false`.
5. القائمة: `GET /dashboard`. التفاصيل: `GET /dashboard/{contractId}`.
6. الحقول القديمة المسطحة (`customerName` في الجذر، إلخ) **لم تعد موجودة**.
