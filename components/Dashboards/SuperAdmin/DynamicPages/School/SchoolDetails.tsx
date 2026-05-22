"use client"

import ErrorFallback from "@/components/Commons/Errors/ErrorFallback";
import { BASE_URL } from "@/constants/constants";
import { ApiClient } from "@/interceptors/ApiClient";
import { useQuery } from "@tanstack/react-query";
import SchoolHero from "./SchoolHero";
import SchoolStats from "./SchoolStats";
import SchoolAdminsSection from "./SchoolAdminsSection";
import SchoolSubscriptionSection from "./SchoolSubscriptionSection";
import SchoolAcademicsSection from "./SchoolAcademicsSection";
import SchoolHeroSkeleton from "@/components/Commons/Skeletons/SchoolHeroSkeleton";
import SchoolStatsSkeleton from "@/components/Commons/Skeletons/SchoolStatsSkeleton";
import React from "react";

const SchoolDetails = ({ schoolSlug }: { schoolSlug: string }) => {
    const getSchoolDetails = async () => {
        const response = await ApiClient.get(`${BASE_URL}/institute/${schoolSlug}`);
        return response.data.data;
    }

    const { data: schoolDetailsData = null, isError, isSuccess, refetch, isLoading } = useQuery({
        queryFn: getSchoolDetails,
        queryKey: ['schoolDetails', schoolSlug],
        refetchOnWindowFocus: false,
    });

    if (isError) {
        return <ErrorFallback refetch={refetch} title="" />
    }

    if (isLoading || !isSuccess || !schoolDetailsData) {
        return (
            <React.Fragment>
                <SchoolHeroSkeleton />
                <SchoolStatsSkeleton />
            </React.Fragment>
        )
    }

    const heroData = {
        id: schoolDetailsData?.id,
        email: schoolDetailsData?.contactInfo?.emails?.primary,
        status: schoolDetailsData?.status,
        tags: schoolDetailsData?.additionalInfo?.tags,
        logo: schoolDetailsData?.logoUrl,
        name: schoolDetailsData?.schoolName,
        establishedIn: schoolDetailsData?.additionalInfo?.establishedYear,
        location: schoolDetailsData?.address,
        affiliationNo: schoolDetailsData?.affiliationNumber,
        classes: schoolDetailsData?.classes,
        slug: schoolDetailsData?.slug,
    }

    const schoolStatsData = {
        id: schoolDetailsData?.id,
        slug: schoolDetailsData?.slug,
        foundedIn: schoolDetailsData?.additionalInfo?.establishedYear,
        founder: schoolDetailsData?.additionalInfo?.founderName,
        students: schoolDetailsData?.totalStudents,
        boards: schoolDetailsData?.additionalInfo?.boardsAffiliated,
        staff: schoolDetailsData?.staff?.length,
        classes: schoolDetailsData?.classes?.length,
        admins: schoolDetailsData?.admins?.length,
    }

    return (
        <section className="space-y-6">
            <SchoolHero data={heroData} />
            <SchoolStats stats={schoolStatsData} />

            {/* Extended Operations Panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Operations & Billing (Col Span 2) */}
                <div className="lg:col-span-2 space-y-6">
                    <SchoolAdminsSection
                        schoolId={schoolDetailsData?.id}
                        schoolName={schoolDetailsData?.schoolName}
                        schoolEmail={schoolDetailsData?.contactInfo?.emails?.primary || ''}
                        schoolSlug={schoolSlug}
                    />
                    <SchoolSubscriptionSection
                        totalStudents={schoolDetailsData?.totalStudents || 0}
                        totalStaff={schoolDetailsData?.staff?.length || 0}
                    />
                </div>

                {/* Right Side: Academics & Contact Directory (Col Span 1) */}
                <div>
                    <SchoolAcademicsSection data={schoolDetailsData} />
                </div>
            </div>
        </section>
    )
}

export default SchoolDetails