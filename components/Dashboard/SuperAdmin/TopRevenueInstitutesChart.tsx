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

const topInstitutes = [
    { name: "Delhi Public School", revenue: 85000 },
    { name: "Ryan International", revenue: 72000 },
    { name: "Podar International School", revenue: 68000 },
    { name: "Orchid International School", revenue: 61000 },
    { name: "Global Academy of Excellence", revenue: 54000 },
];

export default function TopRevenueInstitutesChart() {
    return (
        <div className="w-full h-87.5 bg-white rounded-2xl border border-light-border p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg">Top Revenue Institutes</h2>
            </div>

            <ResponsiveContainer width="100%" height="100%" className="pt-5 pb-10 text-sm">
                <BarChart layout="vertical" data={topInstitutes} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `₹ ${value / 1000}K`}
                    />

                    <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        width={220}
                        tick={{ fontSize: 12, textAnchor: "end" }}
                        tickFormatter={(value) =>
                            value.length > 22 ? value.slice(0, 22) + "..." : value
                        }
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

                    <Bar
                        dataKey="revenue"
                        fill="bg-black/50"
                        radius={[0, 6, 6, 0]}
                        barSize={20}
                        tabIndex={-1}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}