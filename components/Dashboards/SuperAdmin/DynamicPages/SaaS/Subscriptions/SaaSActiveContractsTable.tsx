"use client";

import { useState } from "react";
import { Search, Globe, CreditCard, Mail, Sliders, CheckCircle2, ShieldAlert, AlertTriangle } from "lucide-react";
import SaaSContractDrawer from "./SaaSContractDrawer";

interface Contract {
    contractId: string;
    schoolName: string;
    schoolSlug: string;
    tierName: string;
    billingCycle: string;
    price: number;
    billingStatus: string;
    startDate: string;
    renewalDate: string;
    lastPaymentTxId?: string;
}

interface SaaSActiveContractsTableProps {
    contracts: Contract[];
    onUpdateContract: (updatedContract: Contract) => void;
    onTriggerEmailAlert: (schoolName: string) => void;
}

export default function SaaSActiveContractsTable({
    contracts = [],
    onUpdateContract,
    onTriggerEmailAlert
}: SaaSActiveContractsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const filtered = contracts.filter(c =>
        c.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tierName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPlanStyles = (tier: string) => {
        if (tier.toLowerCase().includes("enterprise")) {
            return "bg-neutral-100 text-black border-neutral-200";
        } else if (tier.toLowerCase().includes("premium") || tier.toLowerCase().includes("growth")) {
            return "bg-black text-white border-black/90";
        } else {
            return "bg-gray-50 text-black/60 border-light-border";
        }
    };

    return (
        <div className="bg-white border border-light-border rounded-xl p-5 shadow-xs space-y-4">
            
            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">Active Client Subscription Contracts</h3>
                    <p className="text-xs text-black/40">Audit financial commitments, pricing contracts, and renewal states</p>
                </div>
                
                <div className="relative min-w-xs">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search active client contracts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-1.5 w-full text-xs border border-input-border rounded-lg outline-none font-medium focus:ring-2 focus:ring-black/10 placeholder:text-black/30"
                    />
                </div>
            </div>

            {/* Contracts Table */}
            <div className="overflow-x-auto border border-light-border rounded-lg">
                <table className="w-full text-xs min-w-max">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-light-border text-left text-black/60 font-semibold uppercase tracking-wider text-[10px]">
                            <th className="px-4 py-3">Client Institute</th>
                            <th className="px-4 py-3">Assigned Plan</th>
                            <th className="px-4 py-3">Recurring Contract Fee</th>
                            <th className="px-4 py-3">Contract Span (Start - Renewal)</th>
                            <th className="px-4 py-3">Billing Health</th>
                            <th className="px-4 py-3 text-right">Administrative Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border bg-white text-black/70">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-black/30 font-medium">
                                    No contracts match your search parameters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((contract) => {
                                const cycleLabel = contract.billingCycle === "ANNUALLY" ? "yr" : "mo";
                                const formattedStartDate = new Date(contract.startDate).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                });
                                const formattedRenewalDate = new Date(contract.renewalDate).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                });

                                return (
                                    <tr key={contract.contractId} className="hover:bg-gray-50/40 transition">
                                        
                                        {/* School name & domain */}
                                        <td className="px-4 py-3.5">
                                            <div>
                                                <span className="font-bold text-black text-sm block tracking-tight">
                                                    {contract.schoolName}
                                                </span>
                                                <span className="text-xs text-black/40 font-medium flex items-center gap-1 mt-0.5 lowercase font-mono">
                                                    <Globe size={11} className="text-black/30 shrink-0" />
                                                    {contract.schoolSlug}.layernlooms.com
                                                </span>
                                            </div>
                                        </td>

                                        {/* Assigned Tier */}
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPlanStyles(contract.tierName)}`}>
                                                {contract.tierName}
                                            </span>
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-black">
                                                    ₹{contract.price.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-black/40 font-medium capitalize">
                                                    Billing cycle: {contract.billingCycle.toLowerCase()}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Contract dates */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-col gap-0.5 text-black/80 font-medium">
                                                <span>Start: {formattedStartDate}</span>
                                                <span className="text-[10px] text-black/40">Renewal: {formattedRenewalDate}</span>
                                            </div>
                                        </td>

                                        {/* Billing Status */}
                                        <td className="px-4 py-3.5">
                                            {contract.billingStatus === "ACTIVE" && (
                                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-green-200">
                                                    <CheckCircle2 size={10} /> Good Standing
                                                </span>
                                            )}
                                            {contract.billingStatus === "OVERDUE" && (
                                                <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-yellow-200">
                                                    <AlertTriangle size={10} /> Delinquent alert
                                                </span>
                                            )}
                                            {contract.billingStatus === "SUSPENDED" && (
                                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-red-200">
                                                    <ShieldAlert size={10} /> Account suspended
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    title="Trigger Email Alert"
                                                    onClick={() => onTriggerEmailAlert(contract.schoolName)}
                                                    className="h-8 w-8 rounded-lg border border-light-border bg-white flex items-center justify-center text-black/60 hover:text-black hover:bg-neutral-50 shadow-xs cursor-pointer transition"
                                                >
                                                    <Mail size={13} />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Override Contract"
                                                    onClick={() => {
                                                        setSelectedContract(contract);
                                                        setIsDrawerOpen(true);
                                                    }}
                                                    className="h-8 w-8 rounded-lg border border-light-border bg-white flex items-center justify-center text-black/60 hover:text-black hover:bg-neutral-50 shadow-xs cursor-pointer transition animate-in fade-in duration-100"
                                                >
                                                    <Sliders size={13} />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── HIGH-END CONFIGURATION SLIDE-OVER DRAWER ── */}
            <SaaSContractDrawer
                contract={selectedContract}
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setSelectedContract(null);
                }}
                onSave={onUpdateContract}
            />

        </div>
    );
}
