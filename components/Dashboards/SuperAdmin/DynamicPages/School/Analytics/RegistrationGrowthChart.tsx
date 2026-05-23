"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const data = [
    { month: "Dec", registrations: 4 },
    { month: "Jan", registrations: 8 },
    { month: "Feb", registrations: 12 },
    { month: "Mar", registrations: 19 },
    { month: "Apr", registrations: 26 },
    { month: "May", registrations: 34 }
];

export default function RegistrationGrowthChart() {
    return (
        <div className="w-full bg-white rounded-xl border border-light-border p-5 shadow-xs flex flex-col justify-between">
            <div>
                <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">School Registration Growth</h3>
                <p className="text-xs text-black/40 mb-4">Monthly trend of onboarding institutions</p>
            </div>
            
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#000000" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#000000" stopOpacity={0.0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="month" 
                            stroke="#9ca3af" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke="#9ca3af" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <Tooltip
                            contentStyle={{
                                background: "#ffffff",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                fontSize: "11px",
                                padding: "6px 10px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                            }}
                            labelStyle={{ fontWeight: "bold", color: "#000000" }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="registrations" 
                            stroke="#000000" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorReg)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
