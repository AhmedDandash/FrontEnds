/**
 * useCustomers Hook
 * React Query hooks for customer operations
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { message } from 'antd';
import { CustomerService } from '@/services';
import type { Customer, CreateCustomerDto, UpdateCustomerDto } from '@/types/api.types';
import type { CustomerQuery } from '@/types/filters.types';
import { getApiErrorMessage } from '@/utils/api-error';

const QUERY_KEY = 'customers';

/** Fetch a single customer by ID — standalone (doesn't pull the full list). */
export function useCustomerById(id: number | string | undefined | null) {
  return useQuery<Customer>({
    queryKey: [QUERY_KEY, id],
    queryFn: () => CustomerService.getById(id!),
    enabled: !!id,
  });
}

/**
 * Server-side filtered + paginated customers (branch scoping, search, dates).
 * Kept separate from `useCustomers` so the mutation hook and lookups are
 * unaffected. `keepPreviousData` avoids a flash of empty state while paging.
 */
export function useCustomersFiltered(query: CustomerQuery) {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY, 'filtered', query],
    queryFn: () => CustomerService.getPaged(query),
    placeholderData: keepPreviousData,
  });

  return {
    customers: data?.items ?? [],
    total: data?.totalCount ?? 0,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}

export function useCustomers() {
  const queryClient = useQueryClient();

  // Get all customers
  const {
    data: customers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => CustomerService.getAll(),
  });

  // Get customer by ID
  const useCustomer = (id: number | string) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => CustomerService.getById(id),
      enabled: !!id,
    });
  };

  // Create customer
  const createMutation = useMutation({
    mutationFn: (data: CreateCustomerDto) => CustomerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تمت إضافة العميل بنجاح / Customer created successfully');
    },
    onError: (error: any) => {
      message.error(getApiErrorMessage(error, 'فشل إضافة العميل / Failed to create customer'));
    },
  });

  // Update customer
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateCustomerDto }) =>
      CustomerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم تحديث العميل بنجاح / Customer updated successfully');
    },
    onError: (error: any) => {
      message.error(getApiErrorMessage(error, 'فشل تحديث العميل / Failed to update customer'));
    },
  });

  // Delete customer
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => CustomerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      message.success('تم حذف العميل بنجاح / Customer deleted successfully');
    },
    onError: (error: any) => {
      message.error(getApiErrorMessage(error, 'فشل حذف العميل / Failed to delete customer'));
    },
  });

  // // Get all customer phones
  // const { data: customerPhones, isLoading: isPhonesLoading } = useQuery({
  //   queryKey: [QUERY_KEY, 'phones'],
  //   queryFn: () => CustomerService.getAllPhones(),
  // });

  // // Create customer phone
  // const createPhoneMutation = useMutation({
  //   mutationFn: (data: CustomerPhoneDto) => CustomerService.createPhone(data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [QUERY_KEY, 'phones'] });
  //     message.success('تمت إضافة الهاتف بنجاح / Phone created successfully');
  //   },
  //   onError: (error: any) => {
  //     message.error(error.response?.data?.message || 'فشل إضافة الهاتف / Failed to create phone');
  //   },
  // });

  return {
    customers,
    isLoading,
    error,
    refetch,
    useCustomer,
    createCustomer: createMutation.mutate,
    updateCustomer: updateMutation.mutate,
    deleteCustomer: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    // customerPhones,
    // isPhonesLoading,
    // createPhone: createPhoneMutation.mutate,
    // isCreatingPhone: createPhoneMutation.isPending,
  };
}
