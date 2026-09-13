import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  MediationFollowUpDashboardParams,
  MediationFollowUpDashboardCard,
  MediationFollowUpItem,
  UpdateFollowUpItemDescriptionDto,
  CompleteFollowUpItemDto,
  CanCompleteResponse,
} from '@/types/api.types';

export class MediationFollowUpService {
  private static normalizeKeys<T extends Record<string, any>>(item: T): T {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
    return Object.entries(item).reduce<Record<string, any>>((acc, [key, value]) => {
      acc[key] = value;
      acc[key.charAt(0).toLowerCase() + key.slice(1)] = value;
      return acc;
    }, {}) as T;
  }

  private static unwrap<T>(payload: any): T {
    return this.normalizeKeys(
      payload?.data?.value ?? payload?.value ?? payload?.data ?? payload
    ) as T;
  }

  private static unwrapList<T>(payload: any): T[] {
    const candidates = [
      payload,
      payload?.data,
      payload?.data?.value,
      payload?.value,
      payload?.result,
      payload?.data?.result,
      payload?.items,
      payload?.data?.items,
      payload?.value?.items,
      payload?.records,
      payload?.data?.records,
    ];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate.map((item: any) => this.normalizeKeys(item)) as T[];
      }
      if (Array.isArray(candidate?.$values)) {
        return candidate.$values.map((item: any) => this.normalizeKeys(item)) as T[];
      }
    }
    console.warn('[MediationFollowUpService] Unexpected response shape:', payload);
    return [];
  }

  // ── Dashboard ────────────────────────────────────────────────────────────

  static async getDashboard(
    params?: MediationFollowUpDashboardParams
  ): Promise<{ rows: MediationFollowUpDashboardCard[]; total: number }> {
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value != null && value !== '') cleanParams[key] = value;
      });
    }
    const response = await api.get<any>(API_ENDPOINTS.MEDIATION_FOLLOWUP.DASHBOARD, {
      params: cleanParams,
    });

    const payload = response.data;
    const rows = this.unwrapList<MediationFollowUpDashboardCard>(payload);

    // Try to extract pagination total from various response shapes
    const total: number =
      payload?.total ??
      payload?.data?.total ??
      payload?.value?.total ??
      payload?.totalCount ??
      payload?.data?.totalCount ??
      rows.length;

    return { rows, total };
  }

  // ── Single card / detail screen — one call for identity + timeline + stages ──

  static async getDashboardCard(contractId: string): Promise<MediationFollowUpDashboardCard> {
    const response = await api.get<any>(API_ENDPOINTS.MEDIATION_FOLLOWUP.DASHBOARD_CARD(contractId));
    return this.unwrap<MediationFollowUpDashboardCard>(response.data);
  }

  // ── Items list for a contract ─────────────────────────────────────────────

  static async getItems(contractId: string): Promise<MediationFollowUpItem[]> {
    const response = await api.get<any>(API_ENDPOINTS.MEDIATION_FOLLOWUP.ITEMS(contractId));
    return this.unwrapList<MediationFollowUpItem>(response.data);
  }

  // ── Single item detail ────────────────────────────────────────────────────

  static async getItem(itemId: string): Promise<MediationFollowUpItem> {
    const response = await api.get<any>(API_ENDPOINTS.MEDIATION_FOLLOWUP.ITEM(itemId));
    return this.unwrap<MediationFollowUpItem>(response.data);
  }

  // ── Update description (auto-completes the item on the backend) ──────────
  // CRITICAL: Always use JSON.stringify via the http client — never string-concatenate JSON.
  // The inputDescription field may contain HTML with quotes and newlines.

  static async updateDescription(dto: UpdateFollowUpItemDescriptionDto): Promise<any> {
    const payload: UpdateFollowUpItemDescriptionDto = {
      itemId: dto.itemId,
      inputDescription: dto.inputDescription ?? null,
    };
    const response = await api.post<any>(
      API_ENDPOINTS.MEDIATION_FOLLOWUP.UPDATE_DESCRIPTION,
      payload
    );
    return this.unwrap<any>(response.data);
  }

  // ── Complete item (ContractFollowUp module) ───────────────────────────────

  static async completeItem(dto: CompleteFollowUpItemDto): Promise<any> {
    const payload: CompleteFollowUpItemDto = {
      contractFollowUpItemId: dto.contractFollowUpItemId,
      completedAt: dto.completedAt,
      notes: dto.notes ?? null,
      result: dto.result,
    };
    const response = await api.post<any>(API_ENDPOINTS.CONTRACT_FOLLOWUP.COMPLETE_ITEM, payload);
    return this.unwrap<any>(response.data);
  }

  // ── CanComplete check ─────────────────────────────────────────────────────

  static async canComplete(itemId: string): Promise<CanCompleteResponse> {
    const response = await api.get<any>(API_ENDPOINTS.CONTRACT_FOLLOWUP.CAN_COMPLETE(itemId));
    return this.unwrap<CanCompleteResponse>(response.data);
  }
}
