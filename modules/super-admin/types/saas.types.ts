export interface SaaSPlan {
  id: number;
  name: string;
  code: string;
  description?: string;
  maxStudents: number;
  maxTeachers: number;
  maxStorageGb: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  prices?: SaaSPrice[];
}

export interface SaaSPrice {
  id: number;
  planId: number;
  billingCycle: "MONTHLY" | "QUARTERLY" | "ANNUALLY";
  amount: number;
  currency: string;
  isActive: boolean;
}

export interface SaaSSubscription {
  id: number;
  instituteId: number;
  instituteName?: string;
  planId: number;
  planName?: string;
  status: "ACTIVE" | "TRIAL" | "PAST_DUE" | "CANCELLED" | "EXPIRED";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface SaaSTransaction {
  id: number;
  invoiceId: string;
  instituteId: number;
  instituteName?: string;
  amount: number;
  currency: string;
  status: "PAID" | "PENDING" | "FAILED" | "RECONCILED";
  paymentMethod?: string;
  transactionDate: string;
  dueDate?: string;
}

export interface CreatePlanDTO {
  name: string;
  code: string;
  description?: string;
  maxStudents: number;
  maxTeachers: number;
  maxStorageGb: number;
  features: string[];
}

export interface AssignSubscriptionDTO {
  instituteId: number;
  planId: number;
  priceId: number;
  billingCycle: "MONTHLY" | "QUARTERLY" | "ANNUALLY";
}

export interface IssueInvoiceDTO {
  instituteId: number;
  amount: number;
  dueDate: string;
  description: string;
}
