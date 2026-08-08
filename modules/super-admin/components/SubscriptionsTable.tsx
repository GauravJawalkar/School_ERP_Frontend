"use client";

import { SaaSSubscription } from "../types/saas.types";
import { SUBSCRIPTION_STATUS_COLORS } from "../constants/saas.constants";
import { RefreshCw } from "lucide-react";

interface SubscriptionsTableProps {
  subscriptions: SaaSSubscription[];
  isLoading: boolean;
}

export function SubscriptionsTable({ subscriptions, isLoading }: SubscriptionsTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading subscriptions...</div>;
  }

  const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];

  if (safeSubscriptions.length === 0) {
    return (
      <div className="p-8 text-center border rounded-xl bg-gray-50 text-gray-500">
        No active subscriptions recorded across schools.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Institute ID / Name</th>
            <th className="px-6 py-4">Assigned Plan</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Start Date</th>
            <th className="px-6 py-4">Renewal / Expiry</th>
            <th className="px-6 py-4 text-right">Auto Renew</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {safeSubscriptions.map((sub) => {
            const statusStyle =
              SUBSCRIPTION_STATUS_COLORS[sub.status] ?? SUBSCRIPTION_STATUS_COLORS.ACTIVE;

            return (
              <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {sub.instituteName || `School #${sub.instituteId}`}
                </td>
                <td className="px-6 py-4 text-gray-800 font-medium">{sub.planName || `Plan #${sub.planId}`}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">
                  {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">
                  {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <RefreshCw size={12} className={sub.autoRenew ? "text-emerald-600" : "text-gray-400"} />
                    {sub.autoRenew ? "Enabled" : "Disabled"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
