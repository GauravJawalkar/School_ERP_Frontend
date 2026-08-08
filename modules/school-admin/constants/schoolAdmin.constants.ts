export const ACADEMIC_YEAR_STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  INACTIVE: "bg-neutral-50 text-neutral-600 border-neutral-200",
  UPCOMING: "bg-blue-50 text-blue-700 border-blue-200",
  ARCHIVED: "bg-amber-50 text-amber-700 border-amber-200",
};

export const SCHOOL_STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  INACTIVE: "bg-neutral-50 text-neutral-600 border-neutral-200",
  SUSPENDED: "bg-red-50 text-red-700 border-red-200",
  PENDING_APPROVAL: "bg-amber-50 text-amber-700 border-amber-200",
};

export const FEE_FREQUENCIES = [
  { label: "One Time", value: "ONE_TIME" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Quarterly", value: "QUARTERLY" },
  { label: "Half Yearly", value: "HALF_YEARLY" },
  { label: "Annually", value: "ANNUALLY" },
];

export const FEE_COMPONENT_TYPES = [
  { label: "Academic", value: "ACADEMIC" },
  { label: "Transport", value: "TRANSPORT" },
  { label: "Library", value: "LIBRARY" },
  { label: "Exam", value: "EXAM" },
  { label: "Other Component", value: "OTHER" },
];

export const SECTION_ALPHABETS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
