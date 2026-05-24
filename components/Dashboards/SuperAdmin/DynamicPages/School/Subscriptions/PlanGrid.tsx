"use client";

import { useState } from "react";
import { CreditCard, Check, Settings2, ShieldCheck, Zap } from "lucide-react";
import ConfigureTierDrawer from "./ConfigureTierDrawer";
import { Plan } from "@/interfaces/interface";

interface PlanGridProps {
    schools: any[];
}

export default function PlanGrid({ schools = [] }: PlanGridProps) {
    const [activePlanForDrawer, setActivePlanForDrawer] = useState<Plan | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Dynamically calculate how many schools are currently on each plan tier
    const enterpriseCount = schools.filter(s => Number(s.totalStudents) > 2500).length;
    const proCount = schools.filter(s => Number(s.totalStudents) <= 2500 && Number(s.totalStudents) > 500).length;
    const basicCount = schools.filter(s => Number(s.totalStudents) <= 500).length || schools.length - proCount - enterpriseCount;

    const [plans, setPlans] = useState<Plan[]>([
        {
            name: "Basic Tier",
            price: "₹15,000",
            billing: "per school / year",
            studentsLimit: "500",
            staffLimit: "35",
            activeCount: Math.max(basicCount, 0),
            color: "bg-white border-light-border",
            textColor: "text-black",
            features: [
                "Core LMS & Academics",
                "Attendance & Daily Tracking",
                "Basic Excel/PDF Reporting",
                "Standard Email Support (24h)"
            ]
        },
        {
            name: "Premium Growth",
            price: "₹45,000",
            billing: "per school / year",
            studentsLimit: "2500",
            staffLimit: "150",
            activeCount: Math.max(proCount, 1),
            color: "bg-black text-white border-black/90",
            textColor: "text-white",
            features: [
                "Advanced Exam & Gradebooks",
                "Custom School Domains",
                "Automated Grading Portals",
                "SMS & Push Notifications",
                "Priority 24/7 Live Support"
            ],
            popular: true
        },
        {
            name: "Enterprise Suite",
            price: "₹95,000",
            billing: "per school / year",
            studentsLimit: "Unlimited",
            staffLimit: "Unlimited",
            activeCount: Math.max(enterpriseCount, 0),
            color: "bg-white border-light-border",
            textColor: "text-black",
            features: [
                "Multi-campus Sync & Portal",
                "Custom SSO & Premium Security",
                "Dedicated Success Account Manager",
                "Direct Raw DB & REST API access",
                "Custom Features SLA Development"
            ]
        }
    ]);

    // Handle opening the configuration drawer
    const openConfigDrawer = (plan: Plan) => {
        setActivePlanForDrawer(plan);
        setIsDrawerOpen(true);
    };

    // Save configurations received back from modular drawer
    const handleSaveConfig = (updatedPlan: Plan) => {
        setPlans(prevPlans =>
            prevPlans.map(p =>
                p.name === activePlanForDrawer?.name
                    ? updatedPlan
                    : p
            )
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">Global Tier Pricing Matrices</h3>
                    <p className="text-xs text-black/40">Adjust parameters and manage plan limits across the system</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {plans.map((plan, idx) => (
                    <div
                        key={idx}
                        className={`relative rounded-xl border p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md ${plan.color}`}
                    >
                        {/* Popular Badge */}
                        {plan.popular && (
                            <span className="absolute -top-2.5 right-4 bg-white text-black text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-black/10 shadow-xs flex items-center gap-1">
                                <Zap size={8} fill="currentColor" /> Most Popular
                            </span>
                        )}

                        <div>
                            {/* Plan Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-light-border/20 mb-4">
                                <div>
                                    <h4 className="text-sm font-bold tracking-tight">{plan.name}</h4>
                                    <span className={`text-[10px] font-medium opacity-60`}>
                                        {plan.activeCount} Active Schools
                                    </span>
                                </div>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${plan.popular ? "bg-white text-black border-white/20" : "bg-gray-50 text-black border-light-border"
                                    }`}>
                                    {plan.name.includes("Enterprise") ? <ShieldCheck size={16} /> : <CreditCard size={16} />}
                                </div>
                            </div>

                            {/* Plan Price */}
                            <div className="mb-4">
                                <span className="text-2xl font-black tracking-tight">{plan.price}</span>
                                <span className="text-[10px] font-normal opacity-50 ml-1.5">{plan.billing}</span>
                            </div>

                            {/* Capacity info */}
                            <div className={`space-y-1.5 mb-5 p-2.5 rounded-lg border text-xs ${plan.popular ? "bg-neutral-800/70 text-white/90 border-light-border/10" : "bg-gray-50/50 text-black/70 border-light-border"}`}>
                                <div className={`font-semibold`}>
                                    {plan.studentsLimit === "Unlimited" ? "Unlimited Students" : `Up to ${Number(plan.studentsLimit).toLocaleString()} Students`}
                                </div>
                                <div className={`font-normal opacity-60`}>
                                    {plan.staffLimit === "Unlimited" ? "Unlimited Staff Accounts" : `Up to ${plan.staffLimit} Staff Accounts`}
                                </div>
                            </div>

                            {/* Feature List */}
                            <ul className="space-y-2 text-xs">
                                {plan.features.map((feat, fidx) => (
                                    <li key={fidx} className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? "bg-white/15 text-white" : "bg-neutral-100 text-black/80"
                                            }`}>
                                            <Check size={10} strokeWidth={3} />
                                        </div>
                                        <span className="opacity-75">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-6 pt-4 border-t border-light-border/20 flex gap-2">
                            <button
                                onClick={() => openConfigDrawer(plan)}
                                className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${plan.popular
                                    ? "bg-white text-black hover:bg-white/90"
                                    : "bg-black text-white hover:bg-black/90"
                                    }`}
                            >
                                <Settings2 size={12} /> Configure Tier
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── HIGH-END CONFIGURATION SLIDE-OVER DRAWER (MODULAR COMPONENT) ── */}
            <ConfigureTierDrawer
                plan={activePlanForDrawer}
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setActivePlanForDrawer(null);
                }}
                onSave={handleSaveConfig}
            />
        </div>
    );
}
