"use client";

import { useState, useEffect } from "react";
import { X, FileText, Info } from "lucide-react";

interface SaaSInvoiceDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (newInvoice: any) => void;
}

export default function SaaSInvoiceDrawer({
    isOpen,
    onClose,
    onGenerate
}: SaaSInvoiceDrawerProps) {
    const [schoolName, setSchoolName] = useState("");
    const [schoolSlug, setSchoolSlug] = useState("");
    const [amount, setAmount] = useState<number>(15000);
    const [paymentMethod, setPaymentMethod] = useState("STRIPE");
    const [dueDate, setDueDate] = useState("");
    
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSchoolName("");
            setSchoolSlug("");
            setAmount(15000);
            setPaymentMethod("STRIPE");
            
            // Set standard next-week due date
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            setDueDate(nextWeek.toISOString().split("T")[0]);

            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!schoolName || !schoolSlug) {
            alert("Please complete the required Client details.");
            return;
        }

        onGenerate({
            invoiceId: `INV-${Date.now().toString().slice(-5)}`,
            schoolName,
            schoolSlug: schoolSlug.toLowerCase().replace(/\s+/g, "-"),
            amount,
            paymentMethod,
            status: "UNPAID",
            invoiceDate: new Date().toISOString().split("T")[0],
            dueDate
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
                                <FileText size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-black tracking-tight">Generate SaaS Invoice</h3>
                                <p className="text-[10px] text-black/40 font-medium">Issue manual one-off client statements</p>
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
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                        
                        <div className="p-3 bg-gray-50 border border-light-border rounded-lg flex gap-2.5 text-xs text-black/60 leading-relaxed">
                            <Info size={16} className="shrink-0 text-black/70 mt-0.5" />
                            <span>Issuing a manual invoice adds a debit entry to the target school subdomain balance. The school administrators will receive email notifications with payment gateway details.</span>
                        </div>

                        {/* School Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Client School Name</label>
                            <input 
                                type="text" 
                                required
                                value={schoolName}
                                onChange={(e) => setSchoolName(e.target.value)}
                                placeholder="e.g. Angel High School"
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition"
                            />
                        </div>

                        {/* School Slug */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Subdomain Lookup Slug</label>
                            <input 
                                type="text" 
                                required
                                value={schoolSlug}
                                onChange={(e) => setSchoolSlug(e.target.value)}
                                placeholder="e.g. angel-high-school"
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-mono focus:ring-2 focus:ring-black/10 transition lowercase"
                            />
                        </div>

                        {/* Amount */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Invoice Statement Amount (₹)</label>
                            <input 
                                type="number" 
                                required
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition"
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Proposed Gateway Method</label>
                            <select 
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition bg-white"
                            >
                                <option value="STRIPE">Stripe Link</option>
                                <option value="RAZORPAY">Razorpay UPI</option>
                                <option value="BANK_TRANSFER">Direct Bank Settlement</option>
                                <option value="MANUAL">Manual Cash/Offline</option>
                            </select>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Payment Due Date</label>
                            <input 
                                type="date" 
                                required
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition"
                            />
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
                            onClick={handleSubmit}
                            className="w-1/2 py-2.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer"
                        >
                            Issue Statement
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
