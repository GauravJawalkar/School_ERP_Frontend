export const BILLING_CYCLES = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Quarterly", value: "QUARTERLY" },
  { label: "Annually", value: "ANNUALLY" },
] as const;

export const SUBSCRIPTION_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "bg-emerald-100", text: "text-emerald-800" },
  TRIAL: { bg: "bg-blue-100", text: "text-blue-800" },
  PAST_DUE: { bg: "bg-amber-100", text: "text-amber-800" },
  CANCELED: { bg: "bg-gray-100", text: "text-gray-800" },
  CANCELLED: { bg: "bg-gray-100", text: "text-gray-800" },
  EXPIRED: { bg: "bg-red-100", text: "text-red-800" },
};

export const TRANSACTION_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PAID: { bg: "bg-emerald-100", text: "text-emerald-800" },
  PENDING: { bg: "bg-amber-100", text: "text-amber-800" },
  FAILED: { bg: "bg-red-100", text: "text-red-800" },
  RECONCILED: { bg: "bg-purple-100", text: "text-purple-800" },
  UNPAID: { bg: "bg-amber-100", text: "text-amber-800" },
};
