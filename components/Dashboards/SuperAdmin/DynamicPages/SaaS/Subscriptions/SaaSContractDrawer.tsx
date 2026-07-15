"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Info } from "lucide-react";

interface Contract {
    contractId: string;
    instituteId: number;
    schoolName: string;
    schoolSlug: string;
    tierName: string;
    billingCycle: string;
    price: number;
    billingStatus: string;
    startDate: string;
    renewalDate: string;
}

interface SaaSPlan {
    planId: string;
    name: string;
    price: number;
    billingCycle: string;
    studentLimit: number;
    staffLimit: number;
    features: string[];
    isActive: boolean;
    dbPlanId: number;
    dbPriceId: number;
}

interface SaaSContractDrawerProps {
    contract: Contract | null;
    plans: SaaSPlan[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: {
        instituteId: number;
        planId: number;
        priceId: number;
        billingPeriod: string;
        amount: number;
        paymentGateway: string;
        gatewayTransactionId: string;
    }) => void;
}

export default function SaaSContractDrawer({
    contract,
    plans = [],
    isOpen,
    onClose,
    onSave
}: SaaSContractDrawerProps) {
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");
    const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<string>("MONTHLY");
    const [amount, setAmount] = useState<number>(0);
    const [paymentGateway, setPaymentGateway] = useState("MANUAL");
    const [gatewayTransactionId, setGatewayTransactionId] = useState("");
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (contract && isOpen && plans.length > 0) {
            const matchedPlan = plans.find(p => p.name.toLowerCase() === contract.tierName.toLowerCase()) || plans[0];
            if (matchedPlan) {
                setSelectedPlanId(matchedPlan.planId);
                setSelectedBillingPeriod(contract.billingCycle);
                setAmount(contract.price);
            }
            setPaymentGateway("MANUAL");
            setGatewayTransactionId("");
            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [contract, isOpen, plans]);

    if (!contract || !isOpen) return null;

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handlePlanChange = (planId: string) => {
        setSelectedPlanId(planId);
        const plan = plans.find(p => p.planId === planId);
        if (plan) {
            setAmount(plan.price);
            setSelectedBillingPeriod(plan.billingCycle);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const plan = plans.find(p => p.planId === selectedPlanId);
        if (!plan) return;

        onSave({
            instituteId: contract.instituteId,
            planId: plan.dbPlanId,
            priceId: plan.dbPriceId,
            billingPeriod: selectedBillingPeriod,
            amount,
            paymentGateway,
            gatewayTransactionId
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
                                <h3 className="text-sm font-bold text-black tracking-tight">Assign/Upgrade Subscription</h3>
                                <p className="text-[10px] text-black/40 font-medium">Override plan quotas & log transaction</p>
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
                        
                        <div className="p-3 bg-neutral-50 border border-light-border rounded-lg flex gap-2.5 text-xs text-black/60 leading-relaxed">
                            <Info size={16} className="shrink-0 text-black/70 mt-0.5" />
                            <span>Updating the subscription tier for <strong className="text-black">{contract.schoolName}</strong> will immediately supersede any previous active plans and update the resource caps.</span>
                        </div>

                        {/* Plan Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Select Tier Plan</label>
                            <select 
                                value={selectedPlanId}
                                onChange={(e) => handlePlanChange(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-semibold focus:ring-2 focus:ring-black/10 transition bg-white text-black"
                            >
                                {plans.map(plan => (
                                    <option key={plan.planId} value={plan.planId}>{plan.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Billing Cycle */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Billing Interval</label>
                            <select 
                                value={selectedBillingPeriod}
                                onChange={(e) => setSelectedBillingPeriod(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-semibold focus:ring-2 focus:ring-black/10 transition bg-white text-black"
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="HALF_YEARLY">Half Yearly</option>
                                <option value="ANNUALLY">Annually</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Contract Price Amount (₹)</label>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition text-black"
                            />
                        </div>

                        <div className="border-t border-light-border/40 my-2 pt-4">
                            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-3">Audit Trail Ledger Details</span>
                            
                            {/* Gateway */}
                            <div className="space-y-1.5 mb-4">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Payment Method</label>
                                <select 
                                    value={paymentGateway}
                                    onChange={(e) => setPaymentGateway(e.target.value)}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-semibold focus:ring-2 focus:ring-black/10 transition bg-white text-black"
                                >
                                    <option value="MANUAL">Manual Settlement (Cash/Bank Transfer)</option>
                                    <option value="RAZORPAY">Razorpay Gateway Integration</option>
                                    <option value="STRIPE">Stripe Checkout Node</option>
                                </select>
                            </div>

                            {/* Txn ID */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Gateway Transaction ID (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. TXN-90210-987"
                                    value={gatewayTransactionId}
                                    onChange={(e) => setGatewayTransactionId(e.target.value)}
                                    className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-semibold focus:ring-2 focus:ring-black/10 transition text-black placeholder:text-black/30"
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
                            Save & Activate
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
