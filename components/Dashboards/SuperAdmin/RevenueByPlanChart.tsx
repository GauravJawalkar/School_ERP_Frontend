"use client";

import { CanAccess } from "@/components/Auth/CanAccess";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const planData = [
    { name: "Basic", value: 10000 },
    { name: "Pro", value: 20000 },
    { name: "Enterprise", value: 30000 },
];

const COLORS = ["#525252", "#737373", "#a3a3a3"];

export default function RevenueByPlanChart() {
    return (
        <CanAccess permission={'saas.billing.view'}>
            <div className="w-full h-87.5 bg-white rounded-2xl border border-light-border p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg">Revenue By Plan</h2>
                </div>

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                    className="pt-5 pb-10 text-sm"
                >
                    <PieChart>
                        <Pie
                            data={planData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={4}
                            stroke="none"
                            isAnimationActive={true}
                        >
                            {planData.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index]}
                                    style={{ outline: "none" }} // ✅ kills focus outline
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                fontSize: "12px",
                                padding: "6px 10px",
                            }}
                            formatter={(value) =>
                                value !== undefined ? `₹${value.toLocaleString()}` : ""
                            }
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </CanAccess>
    );
}