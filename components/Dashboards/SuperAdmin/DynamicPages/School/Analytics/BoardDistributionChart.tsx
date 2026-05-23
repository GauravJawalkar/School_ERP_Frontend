"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

interface SchoolData {
    boardsAffiliated?: string[];
}

interface BoardDistributionChartProps {
    schools: SchoolData[];
}

export default function BoardDistributionChart({ schools = [] }: BoardDistributionChartProps) {
    // Dynamically calculate board affiliations from the active school dataset
    const calculateData = () => {
        if (!schools || schools.length === 0) {
            // Fallback seed data if no schools exist
            return [
                { name: "CBSE", count: 12 },
                { name: "ICSE", count: 6 },
                { name: "State Board", count: 18 },
                { name: "IB", count: 3 },
                { name: "IGCSE", count: 2 },
            ];
        }

        const counts: Record<string, number> = {};
        schools.forEach(school => {
            const boards = school.boardsAffiliated || [];
            boards.forEach(board => {
                const normalized = board.trim().toUpperCase();
                counts[normalized] = (counts[normalized] || 0) + 1;
            });
        });

        // Map and sort in descending order
        const dataArr = Object.entries(counts).map(([name, count]) => ({
            name: name === "SSC" ? "State Board" : name,
            count
        }));

        if (dataArr.length === 0) {
            return [
                { name: "CBSE", count: 0 },
                { name: "ICSE", count: 0 },
                { name: "State Board", count: 0 }
            ];
        }

        return dataArr.sort((a, b) => b.count - a.count);
    };

    const chartData = calculateData();
    const COLORS = ["#000000", "#404040", "#737373", "#a3a3a3", "#d4d4d4"];

    return (
        <div className="w-full bg-white rounded-xl border border-light-border p-5 shadow-xs flex flex-col justify-between">
            <div>
                <h3 className="text-sm font-semibold text-black/80 uppercase tracking-wider mb-0.5">Board Affiliation</h3>
                <p className="text-xs text-black/40 mb-4">Curriculum density across institutes</p>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" horizontal={false} />
                        <XAxis
                            type="number"
                            stroke="#9ca3af"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#9ca3af"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            width={75}
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
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
