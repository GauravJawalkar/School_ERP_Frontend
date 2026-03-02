"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

type RevenueData = {
    month: string;
    revenue: number;
};

interface RevenueChartProps {
    data: RevenueData[];
}

const revenueData = [
    { month: "Apr", revenue: 12000 },
    { month: "May", revenue: 18000 },
    { month: "Jun", revenue: 15000 },
    { month: "Jul", revenue: 22000 },
    { month: "Aug", revenue: 26000 },
    { month: "Sep", revenue: 24000 },
    { month: "Oct", revenue: 30000 },
    { month: "Nov", revenue: 28000 },
    { month: "Dec", revenue: 35000 },
    { month: "Jan", revenue: 40000 },
    { month: "Feb", revenue: 37000 },
    { month: "Mar", revenue: 42000 },
];


export default function RevenueChart() {
    return (
        <div className="w-full h-87.5 bg-white rounded-2xl border border-light-border p-4 focus:outline-none">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg">Revenue Analytics</h2>
                <div className="flex items-center gap-2">
                    <select className="text-sm appearance-auto outline-none p-1.5 border border-light-border rounded-md">
                        <option value="">Year</option>
                        <option value="">2026</option>
                    </select>
                </div>
            </div>
            <ResponsiveContainer width="100%" height="100%" className={"pt-5 pb-10 text-sm"}>
                <BarChart data={revenueData} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        dataKey={"revenue"}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `₹ ${value / 1000}K`}
                    />

                    <Tooltip
                        contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            fontSize: "12px",
                            padding: "6px 10px",
                            textTransform: "capitalize"
                        }}
                        labelStyle={{
                            fontSize: "11px",
                            color: "text-black/70",
                        }}
                        itemStyle={{
                            fontSize: "12px",
                            fontWeight: 500,
                        }}
                        cursor={{ fill: "rgba(0,0,0,0.05)" }}
                        formatter={(value) => value !== undefined ? `₹${value.toLocaleString()}` : ""}
                    />

                    <Bar
                        dataKey="revenue"
                        radius={[6, 6, 0, 0]}
                        className="fill-neutral-800"
                        tabIndex={-1}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}