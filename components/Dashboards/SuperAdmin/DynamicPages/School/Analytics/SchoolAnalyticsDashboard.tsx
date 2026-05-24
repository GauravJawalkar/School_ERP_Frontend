"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { CanAccess } from "@/components/Auth/CanAccess";
import { ArrowLeft, Loader2, RefreshCw, SlidersHorizontal, Search } from "lucide-react";
import Link from "next/link";

// Child component imports
import AnalyticsStatsGrid from "./AnalyticsStatsGrid";
import RegistrationGrowthChart from "./RegistrationGrowthChart";
import BoardDistributionChart from "./BoardDistributionChart";
import TierMarketShareChart from "./TierMarketShareChart";
import TopEnrollmentList from "./TopEnrollmentList";

export default function SchoolAnalyticsDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBoard, setSelectedBoard] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    // Fetch the live list of enrolled schools using TanStack Query
    const getAllSchools = async () => {
        const response = await ApiClient.get(`${BASE_URL}/institute/allSchools`);
        return response.data.data;
    };

    const { data: allSchools = [], isLoading, isRefetching, refetch } = useQuery({
        queryKey: ["getAllSchools"],
        queryFn: getAllSchools,
        refetchOnWindowFocus: false,
    });

    // Dynamically resolve unique cities from the active dataset for filter options
    const uniqueCities = useMemo(() => {
        const cities = new Set<string>();
        allSchools.forEach((school: any) => {
            const city = school.city || school.schoolInfo?.address_details?.city;
            if (city) cities.add(city.trim());
        });
        return Array.from(cities).sort();
    }, [allSchools]);

    // Dynamically resolve unique boards from the active dataset for filter options
    const uniqueBoards = useMemo(() => {
        const boards = new Set<string>();
        allSchools.forEach((school: any) => {
            if (school.boardsAffiliated) {
                school.boardsAffiliated.forEach((b: string) => boards.add(b.trim().toUpperCase()));
            }
        });
        return Array.from(boards).sort();
    }, [allSchools]);

    // Reactive filtering logic
    const filteredSchools = useMemo(() => {
        return allSchools.filter((school: any) => {
            const matchesSearch = school.schoolName.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesBoard = !selectedBoard ||
                school.boardsAffiliated?.some((b: string) => b.trim().toUpperCase() === selectedBoard.toUpperCase());

            const city = school.city || school.schoolInfo?.address_details?.city || "";
            const matchesCity = !selectedCity ||
                city.toLowerCase() === selectedCity.toLowerCase();

            const status = school.schoolStatus || school.status || "";
            const matchesStatus = !selectedStatus ||
                status.toUpperCase() === selectedStatus.toUpperCase();

            return matchesSearch && matchesBoard && matchesCity && matchesStatus;
        });
    }, [allSchools, searchQuery, selectedBoard, selectedCity, selectedStatus]);

    // Compute key statistics reactively
    const computedStats = useMemo(() => {
        let totalStudents = 0;
        let totalStaff = 0;
        let activeCount = 0;

        filteredSchools.forEach((school: any) => {
            totalStudents += Number(school.totalStudents || school.students || 0);
            totalStaff += Number(school.totalStaff || school.staff || 0);
            const status = school.schoolStatus || school.status;
            if (status === "ACTIVE") activeCount++;
        });

        return {
            totalSchools: filteredSchools.length,
            activeSchools: activeCount,
            totalStudents,
            totalStaff
        };
    }, [filteredSchools]);

    if (isLoading) {
        return (
            <div className="h-[75vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-sm font-medium text-black/50 tracking-wide uppercase">Assembling analytics workspace...</span>
            </div>
        );
    }

    return (
        <CanAccess role="SUPER_ADMIN">
            <div className="space-y-6 max-w-7xl mx-auto pb-10">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-light-border pb-5">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-black ">School Management Analytics</h1>
                            <p className="text-xs text-black/50">Monitor schools registered across all tiers and boards</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => refetch()}
                            disabled={isRefetching}
                            className="h-9 px-3 rounded-lg border border-light-border bg-white flex items-center gap-2 text-xs font-semibold text-black/70 hover:text-black transition shadow-xs hover:bg-neutral-50">
                            <RefreshCw size={12} className={isRefetching ? "animate-spin" : ""} />
                            {isRefetching ? "Syncing..." : "Sync Live Data"}
                        </button>
                    </div>
                </div>

                {/* Filter Controls Panel */}
                <div className="bg-white border border-light-border rounded-xl p-4 shadow-xs">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-50">
                        <SlidersHorizontal size={14} className="text-black/60" />
                        <span className="text-xs font-medium text-black uppercase tracking-wider">Dynamic Segmentation</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-black/40" />
                            <input
                                type="text"
                                placeholder="Search by school name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 w-full text-xs border border-input-border rounded-lg outline-none font-medium focus:ring-2 focus:ring-black/10 placeholder:text-black/30"
                            />
                        </div>

                        {/* Curriculum Board Dropdown */}
                        <select
                            value={selectedBoard}
                            onChange={(e) => setSelectedBoard(e.target.value)}
                            className="px-3 py-2 w-full text-xs border border-input-border rounded-lg outline-none font-medium text-black/70 bg-white focus:ring-2 focus:ring-black/10">
                            <option value="">All Affiliated Boards</option>
                            {uniqueBoards.map((board) => (
                                <option key={board} value={board}>{board}</option>
                            ))}
                        </select>

                        {/* City Dropdown */}
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="px-3 py-2 w-full text-xs border border-input-border rounded-lg outline-none font-medium text-black/70 bg-white focus:ring-2 focus:ring-black/10">
                            <option value="">All Cities</option>
                            {uniqueCities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>

                        {/* Status Dropdown */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 w-full text-xs border border-input-border rounded-lg outline-none font-medium text-black/70 bg-white focus:ring-2 focus:ring-black/10">
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* KPI Highlights Grid */}
                <AnalyticsStatsGrid {...computedStats} />

                {/* Analytical Charts Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Growth Line chart (Area span 2) */}
                    <div className="lg:col-span-2">
                        <RegistrationGrowthChart />
                    </div>

                    {/* Tier market share donut */}
                    <div>
                        <TierMarketShareChart />
                    </div>

                    {/* Board affiliation counts */}
                    <div>
                        <BoardDistributionChart schools={filteredSchools} />
                    </div>

                    {/* Top enrollment list (span 2) */}
                    <div className="lg:col-span-2">
                        <TopEnrollmentList schools={filteredSchools} />
                    </div>
                </div>

            </div>
        </CanAccess>
    );
}
