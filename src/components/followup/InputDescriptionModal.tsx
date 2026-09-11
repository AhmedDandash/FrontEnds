'use client';

import { useEffect } from 'react';
import { Modal, Form, Input, Select, Divider } from 'antd';
import type { MediationFollowUpItem } from '@/types/api.types';
import {
  detectItemFormType,
  ITEM_STATUS_OPTIONS,
  getStatusFieldName,
  type ItemFormType,
} from '@/types/follow-up-forms.types';
import { AUTHORIZATION_SYSTEM, toSelectOptions } from '@/constants/enums';

const { TextArea } = Input;
const { Option } = Select;

// ── Airline companies (static until a real API endpoint is available) ─────────
const AIRLINE_OPTIONS = [
  { value: '1', label: 'الخطوط السعودية' },
  { value: '2', label: 'طيران الإمارات' },
  { value: '3', label: 'الخطوط القطرية' },
  { value: '4', label: 'الخطوط الكويتية' },
  { value: '5', label: 'الخطوط الأردنية' },
  { value: '6', label: 'فلاي دبي' },
  { value: '7', label: 'العربية للطيران' },
];

const BANK_OPTIONS = [
  'مصرف الراجحي',
  'البنك الأهلي السعودي',
  'بنك الرياض',
  'البنك السعودي الفرنسي',
  'البنك السعودي الأول',
  'البنك العربي الوطني',
  'بنك البلاد',
  'مصرف الإنماء',
].map((name) => ({ value: name, label: name }));

// ── Parse existing inputDescription JSON (or treat as empty) ─────────────────
function parseInitialValues(inputDescription?: string | null): Record<string, unknown> {
  if (!inputDescription) return {};
  try {
    const parsed = JSON.parse(inputDescription);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

// ── Sub-form: Standard (ActionDate + status + Notes) ─────────────────────────
function StandardForm({ type }: { type: ItemFormType }) {
  const options = ITEM_STATUS_OPTIONS[type] ?? [];
  const statusField = getStatusFieldName(type);

  const labelMap: Record<string, string> = {
    medical: 'الحالة الطبية',
    musand: 'الحالة',
  };
  const statusLabel = labelMap[type] ?? 'الحالة';

  return (
    <>
      <Form.Item
        name="ActionDate"
        label="تاريخ الإجراء"
        rules={[{ required: true, message: 'يجب إدخال تاريخ الإجراء' }]}
      >
        <Input type="date" />
      </Form.Item>

      <Form.Item
        name={statusField}
        label={statusLabel}
        rules={[{ required: true, message: 'يجب اختيار الحالة' }]}
      >
        <Select placeholder="اختر الحالة" allowClear>
          {options.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.labelAr}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="Notes" label="ملاحظات">
        <TextArea rows={3} placeholder="أدخل ملاحظاتك هنا..." />
      </Form.Item>

      {type === 'musand' && <AuthorizationFields required={false} />}
    </>
  );
}

function AuthorizationFields({ required }: { required: boolean }) {
  return (
    <>
      <Divider style={{ margin: '8px 0' }} />
      <Form.Item
        name="authorizationSystem"
        label="نظام التفويض"
        rules={required ? [{ required: true, message: 'يجب اختيار نظام التفويض' }] : undefined}
      >
        <Select
          placeholder="اختر نظام التفويض"
          allowClear
          options={toSelectOptions([...AUTHORIZATION_SYSTEM], 'ar')}
        />
      </Form.Item>
      <Form.Item
        name="authorizationBankName"
        label="البنك"
        dependencies={['authorizationSystem']}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const system = getFieldValue('authorizationSystem');
              if (!required && !system) return Promise.resolve();
              if (value) return Promise.resolve();
              return Promise.reject(new Error('يجب اختيار البنك'));
            },
          }),
        ]}
      >
        <Select
          placeholder="اختر البنك"
          allowClear
          showSearch
          optionFilterProp="label"
          options={BANK_OPTIONS}
        />
      </Form.Item>
    </>
  );
}

function AuthorizationForm() {
  return (
    <>
      <Form.Item
        name="ActionDate"
        label="تاريخ الإجراء"
        rules={[{ required: true, message: 'يجب إدخال تاريخ الإجراء' }]}
      >
        <Input type="date" />
      </Form.Item>
      <AuthorizationFields required />
      <Form.Item name="Notes" label="ملاحظات">
        <TextArea rows={3} placeholder="أدخل ملاحظاتك هنا..." />
      </Form.Item>
    </>
  );
}

// ── Sub-form: Flight Ticket ───────────────────────────────────────────────────
function FlightForm() {
  return (
    <>
      <Form.Item
        name="arrivalDate"
        label="تاريخ الوصول"
        rules={[{ required: true, message: 'يجب إدخال تاريخ الوصول' }]}
      >
        <Input type="date" />
      </Form.Item>

      <Form.Item name="AirlineCompanyId" label="شركة الطيران">
        <Select placeholder="اختر شركة الطيران" allowClear>
          {AIRLINE_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="CarrierLines" label="اسم الناقل (يدوي)">
        <Input placeholder="أدخل اسم الناقل إذا لم يكن في القائمة" />
      </Form.Item>

      <Form.Item name="FlightNumber" label="رقم الرحلة">
        <Input placeholder="مثال: SV123" />
      </Form.Item>

      <Form.Item name="FlightPlaceId" label="مكان الرحلة / المطار">
        <Input placeholder="مثال: مطار الملك خالد" />
      </Form.Item>

      <Divider style={{ margin: '8px 0' }} />

      <Form.Item name="time" label="وقت الإقلاع">
        <Input type="time" />
      </Form.Item>

      <Form.Item name="DayReceipt" label="تاريخ استلام التذكرة">
        <Input type="date" />
      </Form.Item>

      <Form.Item name="TimeReceipt" label="وقت استلام التذكرة">
        <Input type="time" />
      </Form.Item>
    </>
  );
}

// ── Title per type ────────────────────────────────────────────────────────────
const MODAL_TITLE: Record<ItemFormType, string> = {
  medical: 'بيانات الفحص الطبي',
  musand: 'بيانات عقد مساند',
  polo: 'بيانات عقد POLO',
  tesda: 'بيانات TESDA',
  owwa: 'بيانات OWWA',
  oce: 'بيانات تصريح السفر (OCE)',
  'visa-stamp': 'بيانات التأشير',
  flight: 'بيانات تذكرة الطيران',
  biometric: 'بيانات البصمة',
  authorization: 'بيانات التفويض',
};

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  item: MediationFollowUpItem | null;
  open: boolean;
  onCancel: () => void;
  /** Called with JSON-stringified form data on successful validation */
  onSave: (jsonData: string) => void;
  loading?: boolean;
}

export function InputDescriptionModal({ item, open, onCancel, onSave, loading }: Props) {
  const [form] = Form.useForm();
  const formType = item ? detectItemFormType(item) : null;

  // Pre-populate when opening an already-saved item
  useEffect(() => {
    if (open && item) {
      const initial = parseInitialValues(item.inputDescription);
      form.resetFields();
      form.setFieldsValue(initial);
    }
  }, [open, item, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(JSON.stringify(values));
    } catch {
      // Ant Design shows field-level errors automatically
    }
  };

  const title = formType ? MODAL_TITLE[formType] : 'تعبئة بيانات المرحلة';

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={handleOk}
      okText="حفظ البيانات"
      cancelText="إلغاء"
      confirmLoading={loading}
      destroyOnHidden
      width={560}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }} dir="rtl">
        {!formType ? (
          <p style={{ color: '#888', textAlign: 'center' }}>
            لا يوجد نموذج محدد لهذا النوع من المراحل
          </p>
        ) : formType === 'flight' ? (
          <FlightForm />
        ) : formType === 'authorization' ? (
          <AuthorizationForm />
        ) : (
          <StandardForm type={formType} />
        )}
      </Form>
    </Modal>
  );
}
