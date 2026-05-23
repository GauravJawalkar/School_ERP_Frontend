"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Enterprise", value: 8, color: "#000000" },
    { name: "Pro Plan", value: 18, color: "#525252" },
    { name: "Basic Tier", value: 14, color: "#a3a3a3" }
];

export default function TierMarketShareChart() {
    const totalCount = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="w-full bg-white rounded-xl border border-light-border p-5 shadow-xs flex flex-col justify-between">
            <div>
                <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">Subscription Breakdown</h3>
                <p className="text-xs text-black/40 mb-4">Tier market share & active licenses</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
                {/* Donut Chart Container */}
                <div className="relative w-44 h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={55}
                                outerRadius={75}
                                paddingAngle={3}
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: "#ffffff",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    fontSize: "11px",
                                    padding: "6px 10px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Total Stat */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-extrabold text-black tracking-tight">{totalCount}</span>
                        <span className="text-[9px] font-semibold text-black/40 uppercase tracking-wider">Schools</span>
                    </div>
                </div>

                {/* side Legend list */}
                <div className="flex flex-col gap-2.5 flex-1 w-full sm:w-auto">
                    {data.map((entry, idx) => {
                        const pct = Math.round((entry.value / totalCount) * 100);
                        return (
                            <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-2.5 h-2.5 rounded-sm shrink-0" 
                                        style={{ backgroundColor: entry.color }} 
                                    />
                                    <span className="text-xs font-semibold text-black/70">{entry.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-black">{entry.value}</span>
                                    <span className="text-[10px] text-black/40 font-medium ml-1.5">({pct}%)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
