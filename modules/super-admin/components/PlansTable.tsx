"use client";

import { SaaSPlan } from "../types/saas.types";
import { Trash2, CheckCircle } from "lucide-react";

interface PlansTableProps {
  plans: SaaSPlan[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export function PlansTable({ plans, isLoading, onDelete }: PlansTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading SaaS plans...</div>;
  }

  const safePlans = Array.isArray(plans) ? plans : [];

  if (safePlans.length === 0) {
    return (
      <div className="p-8 text-center border rounded-xl bg-gray-50 text-gray-500">
        No subscription plans found. Create your first plan above.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Plan Name</th>
            <th className="px-6 py-4">Code</th>
            <th className="px-6 py-4">Student Limit</th>
            <th className="px-6 py-4">Teacher Limit</th>
            <th className="px-6 py-4">Storage (GB)</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {safePlans.map((plan) => (
            <tr key={plan.id} className="hover:bg-gray-50/80 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{plan.name}</td>
              <td className="px-6 py-4 font-mono text-xs text-gray-600">{plan.code}</td>
              <td className="px-6 py-4">{plan.maxStudents?.toLocaleString() ?? 0}</td>
              <td className="px-6 py-4">{plan.maxTeachers?.toLocaleString() ?? 0}</td>
              <td className="px-6 py-4">{plan.maxStorageGb ?? 0} GB</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    plan.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <CheckCircle size={12} />
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onDelete(plan.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Plan"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
