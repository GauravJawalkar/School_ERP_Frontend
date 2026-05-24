"use client";

import { useState, useEffect } from "react";
import { X, Check, Info, Settings2 } from "lucide-react";
import toast from "react-hot-toast";
import { ConfigureTierDrawerProps } from "@/interfaces/interface";

export default function ConfigureTierDrawer({
    plan,
    isOpen,
    onClose,
    onSave
}: ConfigureTierDrawerProps) {
    const [formName, setFormName] = useState("");
    const [formPrice, setFormPrice] = useState("");
    const [formStudents, setFormStudents] = useState("");
    const [formStaff, setFormStaff] = useState("");
    const [formFeatures, setFormFeatures] = useState<string[]>([]);

    // Smooth transition overlay state
    const [animateIn, setAnimateIn] = useState(false);

    // Sync state when drawer is opened/changed
    useEffect(() => {
        if (plan && isOpen) {
            setFormName(plan.name);
            setFormPrice(plan.price);
            setFormStudents(plan.studentsLimit);
            setFormStaff(plan.staffLimit);
            setFormFeatures([...plan.features]);

            // Trigger entry animation
            const timer = setTimeout(() => setAnimateIn(true), 50);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
        }
    }, [plan, isOpen]);

    if (!plan || !isOpen) return null;

    // Handle closing with animation
    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300); // match transition duration
    };

    // Save configurations
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formName || !formPrice) {
            toast.error("Please fill in required tier settings.");
            return;
        }

        onSave({
            ...plan,
            name: formName,
            price: formPrice,
            studentsLimit: formStudents,
            staffLimit: formStaff,
            features: formFeatures
        });

        toast.success(`${formName} configurations saved successfully!`);
        handleClose();
    };

    // Toggle features
    const toggleFeature = (feature: string) => {
        setFormFeatures(prev =>
            prev.includes(feature)
                ? prev.filter(f => f !== feature)
                : [...prev, feature]
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${animateIn ? "opacity-100" : "opacity-0"
                    }`}
                onClick={handleClose}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                {/* Slide-over panel */}
                <div
                    className={`w-screen max-w-md bg-white border-l border-light-border shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${animateIn ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-light-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-light-border text-black">
                                <Settings2 size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-black tracking-tight">Configure {plan.name}</h3>
                                <p className="text-[10px] text-black/40 font-medium">Update global limits and pricing rules</p>
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

                    {/* Drawer Body */}
                    <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 slim-scrollbar">

                        {/* Info Box */}
                        <div className="p-3 bg-gray-50 border border-light-border rounded-lg flex gap-2.5 text-xs text-black/60 leading-relaxed">
                            <Info size={16} className="shrink-0 text-black/70 mt-0.5" />
                            <span>Changing these parameters will instantly apply new constraints and quotas to all schools currently assigned to the <strong>{plan.name}</strong>.</span>
                        </div>

                        {/* Tier Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Tier Name</label>
                            <input
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition"
                                placeholder="Plan Display Name"
                            />
                        </div>

                        {/* Pricing */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Annual Price (Recurring)</label>
                            <input
                                type="text"
                                value={formPrice}
                                onChange={(e) => setFormPrice(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-bold focus:ring-2 focus:ring-black/10 transition"
                                placeholder="eg. ₹45,000"
                            />
                        </div>

                        {/* Student Cap */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider flex items-center justify-between">
                                <span>Student License Cap</span>
                                <span className="text-[10px] text-black/40 font-medium normal-case">Or type 'Unlimited'</span>
                            </label>
                            <input
                                type="text"
                                value={formStudents}
                                onChange={(e) => setFormStudents(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition"
                                placeholder="eg. 2500"
                            />
                        </div>

                        {/* Staff Cap */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider flex items-center justify-between">
                                <span>Staff Account Cap</span>
                                <span className="text-[10px] text-black/40 font-medium normal-case">Or type 'Unlimited'</span>
                            </label>
                            <input
                                type="text"
                                value={formStaff}
                                onChange={(e) => setFormStaff(e.target.value)}
                                className="w-full border border-input-border text-xs p-2.5 outline-none rounded-lg font-medium focus:ring-2 focus:ring-black/10 transition"
                                placeholder="eg. 150"
                            />
                        </div>

                        {/* Included Features Checklist */}
                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-semibold text-black/70 block uppercase tracking-wider">Configure Feature Entitlements</label>

                            <div className="space-y-2 border border-light-border rounded-xl p-3 bg-gray-50/20">
                                {[
                                    "Core LMS & Academics",
                                    "Attendance & Daily Tracking",
                                    "Basic Excel/PDF Reporting",
                                    "Advanced Exam & Gradebooks",
                                    "Custom School Domains",
                                    "Automated Grading Portals",
                                    "SMS & Push Notifications",
                                    "Multi-campus Sync & Portal",
                                    "Custom SSO & Premium Security",
                                    "Dedicated Success Account Manager",
                                    "Standard Email Support (24h)",
                                    "Priority 24/7 Live Support"
                                ].map((feat) => {
                                    const isIncluded = formFeatures.includes(feat);
                                    return (
                                        <button
                                            type="button"
                                            key={feat}
                                            onClick={() => toggleFeature(feat)}
                                            className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition select-none cursor-pointer text-xs ${isIncluded
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-black/75 border-light-border hover:bg-gray-50"
                                                }`}
                                        >
                                            <span className="font-medium">{feat}</span>
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${isIncluded ? "bg-white text-black border-white" : "border-gray-300"
                                                }`}>
                                                {isIncluded && <Check size={10} strokeWidth={3.5} />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </form>

                    {/* Drawer Actions */}
                    <div className="p-6 border-t border-light-border bg-gray-50/50 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-1/2 py-2.5 rounded-lg border border-light-border bg-white text-xs font-semibold text-black hover:bg-neutral-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="w-1/2 py-2.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition cursor-pointer"
                        >
                            Save Configurations
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
