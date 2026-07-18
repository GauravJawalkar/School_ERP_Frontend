"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/components/Auth/CanAccess";
import { Loader2, RefreshCw, FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";

// Child imports
import SaaSBillingStats from "./SaaSBillingStats";
import SaaSBillingHistoryChart from "./SaaSBillingHistoryChart";
import SaaSTransactionsTable from "./SaaSTransactionsTable";
import SaaSInvoiceDrawer from "./SaaSInvoiceDrawer";

interface Transaction {
    invoiceId: string;
    schoolName: string;
    schoolSlug: string;
    amount: number;
    paymentMethod: string;
    status: string;
    invoiceDate: string;
    dueDate: string;
}

export default function SaaSBillingDashboard() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const queryClient = useQueryClient();

    // Fetch all invoice statement transactions
    const getAllTransactions = async (): Promise<Transaction[]> => {
        const response = await ApiClient.get(`${BASE_URL}/saas/billing/allTransactions`);
        return response.data.data;
    };

    const { data: transactions = [], isLoading, isRefetching, refetch } = useQuery({
        queryKey: ["getAllTransactions"],
        queryFn: getAllTransactions,
        refetchOnWindowFocus: false,
    });

    // 1. Mutation: Reconcile Outstanding Statement
    const reconcileMutation = useMutation({
        mutationFn: async (invoiceId: string) => {
            const res = await ApiClient.patch(`${BASE_URL}/saas/billing/reconcile/${invoiceId}`);
            return res.data;
        },
        onSuccess: (_, invoiceId) => {
            toast.success(`Statement ${invoiceId} has been successfully settled & cleared!`);
            queryClient.invalidateQueries({ queryKey: ["getAllTransactions"] });
        },
        onError: (error: any, invoiceId) => {
            const errMsg = error.response?.data?.message || "Failed to reconcile statement.";
            toast.error(errMsg);
        }
    });

    // 2. Mutation: Re-email statement
    const resendMutation = useMutation({
        mutationFn: async ({ invoiceId }: { invoiceId: string; schoolName: string }) => {
            const res = await ApiClient.post(`${BASE_URL}/saas/billing/resendAlert`, { invoiceId });
            return res.data;
        },
        onSuccess: (_, variables) => {
            toast.success(`Statement reminder successfully dispatched to ${variables.schoolName}.`);
        },
        onError: (error: any) => {
            const errMsg = error.response?.data?.message || "Failed to dispatch email reminder.";
            toast.error(errMsg);
        }
    });

    // 3. Mutation: Manually issue statement
    const generateInvoiceMutation = useMutation({
        mutationFn: async (newInvoice: Transaction) => {
            const res = await ApiClient.post(`${BASE_URL}/saas/billing/issue`, newInvoice);
            return res.data;
        },
        onSuccess: () => {
            toast.success("New manual SaaS invoice issued!");
            queryClient.invalidateQueries({ queryKey: ["getAllTransactions"] });
        },
        onError: (error: any) => {
            const errMsg = error.response?.data?.message || "Failed to issue SaaS invoice.";
            toast.error(errMsg);
        }
    });

    if (isLoading) {
        return (
            <div className="h-[75vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-sm font-medium text-black/50 tracking-wide uppercase">Assembling platform balance sheets...</span>
            </div>
        );
    }

    return (
        <CanAccess role="SUPER_ADMIN">
            <div className="space-y-7 max-w-7xl mx-auto pb-10">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-light-border pb-5">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-black">SaaS Billing Ledger</h1>
                            <p className="text-xs text-black/50">Audit transaction payouts, issue manual client statements, and reconcile platform collections</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(true)}
                            className="h-9 px-3.5 rounded-lg bg-black text-white text-xs font-bold hover:bg-black/90 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <Plus size={13} /> Issue Invoice
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => refetch()}
                            disabled={isRefetching}
                            className="h-9 px-3 rounded-lg border border-light-border bg-white flex items-center gap-2 text-xs font-semibold text-black/70 hover:text-black transition shadow-xs hover:bg-neutral-50 cursor-pointer"
                        >
                            <RefreshCw size={12} className={isRefetching ? "animate-spin" : ""} />
                            {isRefetching ? "Syncing..." : "Refresh Ledger"}
                        </button>
                    </div>
                </div>

                {/* KPI block grids */}
                <SaaSBillingStats transactions={transactions} />

                {/* Recharts area chart monthly overview */}
                <SaaSBillingHistoryChart />

                {/* Issued Invoices Registry Table */}
                <SaaSTransactionsTable 
                    transactions={transactions}
                    onReconcile={(id) => reconcileMutation.mutate(id)}
                    onResendInvoice={(id, name) => resendMutation.mutate({ invoiceId: id, schoolName: name })}
                />

                {/* ── MANUAL INVOICE GENERATOR SLIDE-OVER DRAWER ── */}
                <SaaSInvoiceDrawer 
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onGenerate={(newInv) => generateInvoiceMutation.mutate(newInv)}
                />

            </div>
        </CanAccess>
    );
}
