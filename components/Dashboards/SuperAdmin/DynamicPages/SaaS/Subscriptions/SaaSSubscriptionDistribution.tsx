"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface SaaSSubscriptionDistributionProps {
    contracts: any[];
}

export default function SaaSSubscriptionDistribution({ contracts = [] }: SaaSSubscriptionDistributionProps) {
    // Count active plans
    let basicCount = 0;
    let premiumCount = 0;
    let enterpriseCount = 0;

    contracts.forEach(c => {
        if (c.billingStatus === "ACTIVE") {
            if (c.tierName.toLowerCase().includes("basic")) basicCount++;
            else if (c.tierName.toLowerCase().includes("premium") || c.tierName.toLowerCase().includes("growth")) premiumCount++;
            else if (c.tierName.toLowerCase().includes("enterprise")) enterpriseCount++;
        }
    });

    const totalCount = basicCount + premiumCount + enterpriseCount || 1;

    const data = [
        { name: "Basic Tier", value: basicCount, color: "#8E8E8E", percentage: Math.round((basicCount / totalCount) * 100) },
        { name: "Premium Growth", value: premiumCount, color: "#111111", percentage: Math.round((premiumCount / totalCount) * 100) },
        { name: "Enterprise Suite", value: enterpriseCount, color: "#4E4E4E", percentage: Math.round((enterpriseCount / totalCount) * 100) }
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <div className="bg-black text-white text-[10px] p-2 border border-black rounded-lg shadow-xl font-medium tracking-tight">
                    <div className="font-bold">{dataPoint.name}</div>
                    <div>{dataPoint.value} Active Institutes ({dataPoint.percentage}%)</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white border border-light-border rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-center gap-5">
            <div className="w-full md:w-1/2">
                <h3 className="text-xs font-semibold text-black/80 uppercase tracking-wider mb-0.5">SaaS Tier Market Share</h3>
                <p className="text-[11px] text-black/40 mb-4">Distribution of subscription quotas across current active platform clusters</p>
                
                <div className="space-y-3">
                    {data.map((tier, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-light-border/40 hover:bg-neutral-50 transition text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm border border-light-border" style={{ backgroundColor: tier.color }} />
                                <span className="font-semibold text-black/80">{tier.name}</span>
                            </div>
                            <div className="font-bold text-black flex items-center gap-1.5">
                                <span>{tier.value} clients</span>
                                <span className="text-[10px] text-black/40 font-normal">({tier.percentage}%)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full md:w-1/2 h-44 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Concentric absolute label center */}
                <div className="absolute text-center flex flex-col">
                    <span className="text-xl font-black text-black tracking-tighter">{totalCount}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-black/30">Total SaaS</span>
                </div>
            </div>
        </div>
    );
}
