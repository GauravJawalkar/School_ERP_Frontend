"use client";

import { CanAccess } from "@/components/Auth/CanAccess";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const trendData = [
    { month: "Apr", revenue: 12000 },
    { month: "May", revenue: 13500 },
    { month: "Jun", revenue: 17000 },
    { month: "Jul", revenue: 21000 },
    { month: "Aug", revenue: 24000 },
    { month: "Sep", revenue: 27000 },
    { month: "Oct", revenue: 31000 },
    { month: "Nov", revenue: 34000 },
    { month: "Dec", revenue: 36500 },
    { month: "Jan", revenue: 39500 },
    { month: "Feb", revenue: 42000 },
    { month: "Mar", revenue: 45000 },
];

export default function RevenueTrendChart() {
    return (
        <CanAccess permission={'saas.billing.view'}>
            <div className="w-full h-87.5 bg-white rounded-2xl border border-light-border p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg">Revenue Trend</h2>
                </div>

                <ResponsiveContainer width="100%" height="100%" className="pt-5 pb-10 text-sm">
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />

                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
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
                                textTransform: "capitalize",
                            }}
                            formatter={(value) => value !== undefined ? `₹${value.toLocaleString()}` : ""}
                        />

                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#262626"
                            strokeWidth={2.5}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                            tabIndex={-1}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </CanAccess>
    );
}