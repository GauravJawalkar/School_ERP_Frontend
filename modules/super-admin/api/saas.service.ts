import { ApiClient } from "@/interceptors/ApiClient";
import {
  SaaSPlan,
  SaaSSubscription,
  SaaSTransaction,
  CreatePlanDTO,
  AssignSubscriptionDTO,
  IssueInvoiceDTO,
} from "../types/saas.types";

export const saasService = {
  // Plans & Pricing
  getPlans: async (): Promise<SaaSPlan[]> => {
    const res = await ApiClient.get("/saas/plans");
    const rawData = res.data?.data ?? res.data;
    const list = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.plans)
      ? rawData.plans
      : [];

    return list.map((plan: any) => ({
      id: plan.id,
      name: plan.name,
      code: plan.slug || plan.code || `PLAN-${plan.id}`,
      description: plan.description,
      maxStudents: plan.maxStudents ?? -1,
      maxTeachers: plan.maxStaff ?? plan.maxTeachers ?? -1,
      maxStorageGb: plan.maxStorageGb ?? 50,
      features: Array.isArray(plan.features) ? plan.features : (plan.features?.modules || []),
      isActive: plan.isActive ?? true,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      prices: plan.prices || [],
    }));
  },

  createPlan: async (plan: CreatePlanDTO): Promise<SaaSPlan> => {
    const res = await ApiClient.post("/saas/plans", {
      name: plan.name,
      slug: plan.code?.toLowerCase().replace(/\s+/g, "-") || plan.name.toLowerCase().replace(/\s+/g, "-"),
      description: plan.description,
      maxStudents: plan.maxStudents,
      maxStaff: plan.maxTeachers,
      features: { modules: plan.features || ["STUDENTS", "STAFF"] },
    });
    return res.data?.data ?? res.data;
  },

  updatePlan: async (id: number, plan: Partial<CreatePlanDTO>): Promise<SaaSPlan> => {
    const res = await ApiClient.put(`/saas/plans/${id}`, plan);
    return res.data?.data ?? res.data;
  },

  deletePlan: async (id: number): Promise<void> => {
    await ApiClient.delete(`/saas/plans/${id}`);
  },

  // Subscriptions
  getAllSubscriptions: async (): Promise<SaaSSubscription[]> => {
    const res = await ApiClient.get("/saas/subscriptions");
    const rawData = res.data?.data ?? res.data;
    const list = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.subscriptions)
      ? rawData.subscriptions
      : [];

    return list.map((item: any) => ({
      id: item.contractId || item.id,
      instituteId: item.instituteId,
      instituteName: item.schoolName || item.instituteName || `School #${item.instituteId}`,
      planId: item.planId || 0,
      planName: item.tierName || item.planName || "Standard Plan",
      status: item.billingStatus || item.status || "ACTIVE",
      startDate: item.startDate,
      endDate: item.renewalDate || item.endDate,
      autoRenew: item.autoRenew ?? true,
    }));
  },

  assignSubscription: async (dto: AssignSubscriptionDTO): Promise<SaaSSubscription> => {
    const res = await ApiClient.post("/saas/subscriptions/assign", dto);
    return res.data?.data ?? res.data;
  },

  // Billing Ledger & Transactions
  getAllTransactions: async (): Promise<SaaSTransaction[]> => {
    const res = await ApiClient.get("/saas/billing/allTransactions");
    const rawData = res.data?.data ?? res.data;
    const list = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.transactions)
      ? rawData.transactions
      : [];

    return list.map((tx: any, idx: number) => ({
      id: tx.id || idx + 1,
      invoiceId: tx.invoiceId || tx.gatewayTxId || `INV-${idx + 1}`,
      instituteId: tx.instituteId || 0,
      instituteName: tx.schoolName || tx.instituteName,
      amount: tx.amount || 0,
      currency: tx.currency || "INR",
      status: tx.status || "PENDING",
      paymentMethod: tx.paymentMethod || tx.paymentGateway,
      transactionDate: tx.invoiceDate || tx.transactionDate || new Date().toISOString(),
      dueDate: tx.dueDate,
    }));
  },

  reconcileTransaction: async (invoiceId: string): Promise<void> => {
    await ApiClient.patch(`/saas/billing/reconcile/${invoiceId}`);
  },

  resendAlert: async (instituteId: number): Promise<void> => {
    await ApiClient.post("/saas/billing/resendAlert", { instituteId });
  },

  issueInvoice: async (dto: IssueInvoiceDTO): Promise<void> => {
    await ApiClient.post("/saas/billing/issue", dto);
  },
};
