"use client";

import { useState, useEffect } from "react";
import { X, Sliders, Info, Calendar } from "lucide-react";

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

interface SaaSContractDrawerProps {
    contract: Contract | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedContract: Contract) => void;
}

export default function SaaSContractDrawer({
    contract,
    isOpen,
    onClose,
    onSave
}: SaaSContractDrawerProps) {
    const [price, setPrice] = useState<number>(0);
    const [billingCycle, setBillingCycle] = useState("");
    const [billingStatus, setBillingStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [renewalDate, setRenewalDate] = useState("");
    
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (contract && isOpen) {
            setPrice(contract.price);
            setBillingCycle(contract.billingCycle);
            setBillingStatus(contract.billingStatus);
            setStartDate(contract.startDate);
            setRenewalDate(contract.renewalDate);
            
            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [contract, isOpen]);

    if (!contract || !isOpen) return null;

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...contract,
            price,
            billingCycle,
            billingStatus,
            startDate,
            renewalDate
        });
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
                    animateIn ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                {/* Slide-over panel */}
                <div 
                    className={`w-screen max-w-md bg-white border-l border-light-border shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
                        animateIn ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-light-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border text-black">
                                <Calendar size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-black tracking-tight">Configure Contract Details</h3>
                                <p className="text-[10px] text-black/40 font-medium">Override financial terms & agreements</p>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={handleClose}
                            className="h-8 w-8 rounded-lg border border-light-border bg-white flex items-center justify-center text-black/50 hover:text-black transition hover:bg-neutral-50 shadow-xs cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 slim-scrollbar">
                        
                        <div className="p-3 bg-gray-50 border border-light-border rounded-lg flex gap-2.5 text-xs text-black/60 leading-relaxed">
                            <Info size={16} className="shrink-0 text-black/70 mt-0.5" />
                            <span>Updating custom pricing rules or renewing subscription cycle parameters for <strong className="text-black">{contract.schoolName}</strong> takes effect on the next recurring automated generation run.</span>
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Contract Billing Price (₹)</label>
                            <input 
                                type="number" 
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition"
                            />
                        </div>

                        {/* Billing Cycle */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Billing Interval</label>
                            <select 
                                value={billingCycle}
                                onChange={(e) => setBillingCycle(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition bg-white"
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="ANNUALLY">Annually</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Billing Standing Status</label>
                            <select 
                                value={billingStatus}
                                onChange={(e) => setBillingStatus(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition bg-white"
                            >
                                <option value="ACTIVE">Active (Good Standing)</option>
                                <option value="OVERDUE">Overdue (Payment Delinquent)</option>
                                <option value="SUSPENDED">Suspended (System Blocked)</option>
                            </select>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Start Date</label>
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Renewal Date</label>
                                <input 
                                    type="date" 
                                    value={renewalDate}
                                    onChange={(e) => setRenewalDate(e.target.value)}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition"
                                />
                            </div>
                        </div>

                    </form>

                    {/* Actions */}
                    <div className="p-6 border-t border-light-border bg-gray-50/50 flex gap-3">
                        <button 
                            type="button"
                            onClick={handleClose}
                            className="w-1/2 py-2.5 rounded-lg border border-light-border bg-white text-xs font-semibold text-black hover:bg-neutral-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            onClick={handleSave}
                            className="w-1/2 py-2.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer"
                        >
                            Save Terms
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
