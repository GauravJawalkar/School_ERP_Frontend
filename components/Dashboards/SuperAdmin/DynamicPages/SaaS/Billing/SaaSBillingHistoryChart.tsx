"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
    { name: "Jan", revenue: 45000 },
    { name: "Feb", revenue: 90000 },
    { name: "Mar", revenue: 135000 },
    { name: "Apr", revenue: 150000 },
    { name: "May", revenue: 195000 }
];

export default function SaaSBillingHistoryChart() {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black text-white text-[10px] p-2.5 border border-black rounded-lg shadow-xl font-medium tracking-tight">
                    <div className="font-bold uppercase tracking-wider text-[8px] text-white/50 mb-0.5">SaaS Collections</div>
                    <div>₹{payload[0].value.toLocaleString()} cleared</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white border border-light-border rounded-xl p-5 shadow-xs">
            <div className="mb-6">
                <h3 className="text-xs font-semibold text-black/80 uppercase tracking-wider mb-0.5">Settlement Volume History</h3>
                <p className="text-[11px] text-black/40">Gross platform collections cleared and reconciled Month-over-Month</p>
            </div>

            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#000000" stopOpacity={0.06} />
                                <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                        <XAxis 
                            dataKey="name" 
                            stroke="#8E8E8E" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke="#8E8E8E" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `₹${value / 1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#000000" 
                            strokeWidth={1.5}
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
