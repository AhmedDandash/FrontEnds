import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { MediationFollowUpService } from '@/services/mediation-followup.service';
import { getApiErrorMessage } from '@/utils/api-error';
import type {
  MediationFollowUpDashboardParams,
  MediationFollowUpDashboardCard,
  MediationFollowUpItem,
  UpdateFollowUpItemDescriptionDto,
  CompleteFollowUpItemDto,
  CanCompleteResponse,
} from '@/types/api.types';

const KEYS = {
  dashboard: 'mediation-followup-dashboard',
  dashboardCard: 'mediation-followup-dashboard-card',
  items: 'mediation-followup-items',
  item: 'mediation-followup-item',
} as const;

// ── Dashboard (list) ─────────────────────────────────────────────────────────

export function useMediationFollowUpDashboard(params?: MediationFollowUpDashboardParams) {
  return useQuery({
    queryKey: [KEYS.dashboard, params],
    queryFn: () => MediationFollowUpService.getDashboard(params),
    placeholderData: (previous) => previous,
  });
}

// ── Single card (detail screen) — identity + timeline + stages in one call ───

export function useMediationFollowUpDashboardCard(contractId?: string | null) {
  return useQuery<MediationFollowUpDashboardCard>({
    queryKey: [KEYS.dashboardCard, contractId],
    queryFn: () => MediationFollowUpService.getDashboardCard(contractId!),
    enabled: !!contractId,
  });
}

// ── Contract items ────────────────────────────────────────────────────────────

export function useMediationFollowUpItems(contractId?: string | null) {
  return useQuery<MediationFollowUpItem[]>({
    queryKey: [KEYS.items, contractId],
    queryFn: () => MediationFollowUpService.getItems(contractId!),
    enabled: !!contractId,
  });
}

// ── Single item detail ────────────────────────────────────────────────────────

export function useMediationFollowUpItem(itemId?: string | null) {
  return useQuery<MediationFollowUpItem>({
    queryKey: [KEYS.item, itemId],
    queryFn: () => MediationFollowUpService.getItem(itemId!),
    enabled: !!itemId,
  });
}

// ── Update description (completes the item automatically on the backend) ──────

export function useUpdateFollowUpDescription(contractId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateFollowUpItemDescriptionDto) =>
      MediationFollowUpService.updateDescription(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.items, contractId] });
      queryClient.invalidateQueries({ queryKey: [KEYS.dashboardCard, contractId] });
      queryClient.invalidateQueries({ queryKey: [KEYS.dashboard] });
      message.success('تم تحديث المرحلة بنجاح / Stage updated successfully');
    },
    onError: (error: any) => {
      message.error(
        getApiErrorMessage(error, 'فشل تحديث المرحلة / Failed to update stage')
      );
    },
  });
}

// ── CanComplete check — called imperatively before submitting completion ──────

export function useCanComplete() {
  return useMutation<CanCompleteResponse, Error, string>({
    mutationFn: (itemId: string) => MediationFollowUpService.canComplete(itemId),
  });
}

// ── Complete item via ContractFollowUp module ─────────────────────────────────

export function useCompleteFollowUpItem(contractId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CompleteFollowUpItemDto) =>
      MediationFollowUpService.completeItem(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.items, contractId] });
      queryClient.invalidateQueries({ queryKey: [KEYS.dashboardCard, contractId] });
      queryClient.invalidateQueries({ queryKey: [KEYS.dashboard] });
      message.success('تم إتمام المرحلة بنجاح / Stage completed successfully');
    },
    onError: (error: any) => {
      message.error(
        getApiErrorMessage(error, 'فشل إتمام المرحلة / Failed to complete stage')
      );
    },
  });
}
