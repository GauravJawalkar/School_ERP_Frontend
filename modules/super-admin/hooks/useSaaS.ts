import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saasService } from "../api/saas.service";
import { CreatePlanDTO, AssignSubscriptionDTO, IssueInvoiceDTO } from "../types/saas.types";

export const SAAS_QUERY_KEYS = {
  PLANS: ["saas", "plans"],
  SUBSCRIPTIONS: ["saas", "subscriptions"],
  TRANSACTIONS: ["saas", "transactions"],
};

export function useSaaSPlans() {
  return useQuery({
    queryKey: SAAS_QUERY_KEYS.PLANS,
    queryFn: saasService.getPlans,
  });
}

export function useSaaSSubscriptions() {
  return useQuery({
    queryKey: SAAS_QUERY_KEYS.SUBSCRIPTIONS,
    queryFn: saasService.getAllSubscriptions,
  });
}

export function useSaaSTransactions() {
  return useQuery({
    queryKey: SAAS_QUERY_KEYS.TRANSACTIONS,
    queryFn: saasService.getAllTransactions,
  });
}

export function useSaaSMutations() {
  const queryClient = useQueryClient();

  const createPlan = useMutation({
    mutationFn: (dto: CreatePlanDTO) => saasService.createPlan(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAAS_QUERY_KEYS.PLANS });
    },
  });

  const deletePlan = useMutation({
    mutationFn: (id: number) => saasService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAAS_QUERY_KEYS.PLANS });
    },
  });

  const assignSubscription = useMutation({
    mutationFn: (dto: AssignSubscriptionDTO) => saasService.assignSubscription(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAAS_QUERY_KEYS.SUBSCRIPTIONS });
    },
  });

  const reconcileTransaction = useMutation({
    mutationFn: (invoiceId: string) => saasService.reconcileTransaction(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAAS_QUERY_KEYS.TRANSACTIONS });
    },
  });

  const issueInvoice = useMutation({
    mutationFn: (dto: IssueInvoiceDTO) => saasService.issueInvoice(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAAS_QUERY_KEYS.TRANSACTIONS });
    },
  });

  return {
    createPlan,
    deletePlan,
    assignSubscription,
    reconcileTransaction,
    issueInvoice,
  };
}
