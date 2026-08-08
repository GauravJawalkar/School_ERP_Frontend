"use client";

import { useSaaSPlans, useSaaSMutations } from "../hooks/useSaaS";
import { PlansTable } from "../components/PlansTable";
import { CreatePlanModal } from "../components/CreatePlanModal";
import { CreatePlanDTO } from "../types/saas.types";
import { toast } from "react-hot-toast";

export function SaaSPlansPage() {
  const { data: plans = [], isLoading } = useSaaSPlans();
  const { createPlan, deletePlan } = useSaaSMutations();

  const handleCreatePlan = async (dto: CreatePlanDTO) => {
    try {
      await createPlan.mutateAsync(dto);
      toast.success("SaaS Subscription Plan created successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create plan");
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subscription plan?")) return;
    try {
      await deletePlan.mutateAsync(id);
      toast.success("Plan deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete plan");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SaaS Subscription Plans</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage multi-tenant subscription tiers, student/teacher limits, and storage quotas.
          </p>
        </div>
        <CreatePlanModal onSubmit={handleCreatePlan} isLoading={createPlan.isPending} />
      </div>

      <PlansTable plans={plans} isLoading={isLoading} onDelete={handleDeletePlan} />
    </div>
  );
}
