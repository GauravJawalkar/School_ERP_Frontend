import { DashboardStata } from "@/interfaces/interface";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CanAccess } from "../Auth/CanAccess";

const Stats = ({ dashboardStats }: { dashboardStats: DashboardStata[] }) => {
    return (
        <CanAccess permission="dashboard.admin">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {
                    dashboardStats?.map(({ id, title, value, subtitle, change }) => {
                        return (

                            <div key={id} className="p-4 rounded-xl border border-light-border">
                                <div className="text-sm text-black/50 flex items-center justify-between">
                                    <h2>{title}</h2>
                                    <p className="py-0.5 px-2 flex items-center gap-2 text-xs border border-light-border rounded-full w-fit">
                                        {change >= 0 ? <TrendingUp size={15} className="text-black/90" /> : <TrendingDown size={15} className="text-black/90" />}
                                        <span className="font-medium text-black/90">{change}%</span>
                                    </p>
                                </div>
                                <div className="py-3">
                                    <h1 className="text-xl text-black font-semibold">{value}</h1>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-black/80">{subtitle}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </CanAccess>
    )
}

export default Stats