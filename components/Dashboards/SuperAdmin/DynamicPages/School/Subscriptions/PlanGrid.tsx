"use client";

import { CreditCard, Check, Settings2, ShieldCheck, Zap } from "lucide-react";

interface Plan {
    name: string;
    price: string;
    billing: string;
    studentsLimit: string;
    staffLimit: string;
    activeCount: number;
    color: string;
    textColor: string;
    features: string[];
    popular?: boolean;
}

interface PlanGridProps {
    schools: any[];
}

export default function PlanGrid({ schools = [] }: PlanGridProps) {
    // Dynamically calculate how many schools are currently on each plan tier
    const enterpriseCount = schools.filter(s => Number(s.totalStudents) > 2500).length;
    const proCount = schools.filter(s => Number(s.totalStudents) <= 2500 && Number(s.totalStudents) > 500).length;
    const basicCount = schools.filter(s => Number(s.totalStudents) <= 500).length || schools.length - proCount - enterpriseCount;

    const PLANS: Plan[] = [
        {
            name: "Basic Tier",
            price: "₹15,000",
            billing: "per school / year",
            studentsLimit: "Up to 500 Students",
            staffLimit: "Up to 35 Staff Accounts",
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
            studentsLimit: "Up to 2,500 Students",
            staffLimit: "Up to 150 Staff Accounts",
            activeCount: Math.max(proCount, 1), // Default to 1 (Angel High is here)
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
            studentsLimit: "Unlimited Students",
            staffLimit: "Unlimited Staff Accounts",
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
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">Global Tier Pricing Matrices</h3>
                    <p className="text-xs text-black/40">Adjust parameters and manage plan limits across the system</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PLANS.map((plan, idx) => (
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
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                                    plan.popular ? "bg-white text-black border-white/20" : "bg-gray-50 text-black border-light-border"
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
                            <div className="space-y-1.5 mb-5 bg-gray-50/50 p-2.5 rounded-lg border border-light-border/10 text-xs">
                                <div className={`font-semibold ${plan.textColor}`}>{plan.studentsLimit}</div>
                                <div className={`font-normal opacity-60`}>{plan.staffLimit}</div>
                            </div>

                            {/* Feature List */}
                            <ul className="space-y-2 text-xs">
                                {plan.features.map((feat, fidx) => (
                                    <li key={fidx} className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                            plan.popular ? "bg-white/15 text-white" : "bg-neutral-100 text-black/80"
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
                            <button className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                                plan.popular 
                                    ? "bg-white text-black hover:bg-white/90" 
                                    : "bg-black text-white hover:bg-black/90"
                            }`}>
                                <Settings2 size={12} /> Configure Tier
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
