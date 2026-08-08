"use client";

import { SaaSTransaction } from "../types/saas.types";
import { TRANSACTION_STATUS_COLORS } from "../constants/saas.constants";
import { CheckCircle2 } from "lucide-react";

interface TransactionsTableProps {
  transactions: SaaSTransaction[];
  isLoading: boolean;
  onReconcile: (invoiceId: string) => void;
}

export function TransactionsTable({
  transactions,
  isLoading,
  onReconcile,
}: TransactionsTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading transactions...</div>;
  }

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  if (safeTransactions.length === 0) {
    return (
      <div className="p-8 text-center border rounded-xl bg-gray-50 text-gray-500">
        No billing transactions or invoices recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Invoice ID</th>
            <th className="px-6 py-4">Institute</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {safeTransactions.map((tx) => {
            const statusStyle =
              TRANSACTION_STATUS_COLORS[tx.status] ?? TRANSACTION_STATUS_COLORS.PENDING;

            return (
              <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-900">
                  {tx.invoiceId}
                </td>
                <td className="px-6 py-4 text-gray-800">
                  {tx.instituteName || `School #${tx.instituteId}`}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {tx.currency} {tx.amount?.toLocaleString() ?? 0}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">
                  {tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 text-right">
                  {tx.status !== "RECONCILED" && (
                    <button
                      onClick={() => onReconcile(tx.invoiceId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-all"
                    >
                      <CheckCircle2 size={14} />
                      Reconcile
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
