"use client"

import ErrorFallback from "@/components/Commons/Errors/ErrorFallback";
import { BASE_URL } from "@/constants/constants";
import { ApiClient } from "@/interceptors/ApiClient";
import { useQuery } from "@tanstack/react-query";
import SchoolHero from "./SchoolHero";
import SchoolStats from "./SchoolStats";
import { Loader2 } from "lucide-react";

const SchoolDetails = ({ schoolSlug }: { schoolSlug: string }) => {
    const getSchoolDetails = async () => {
        const response = await ApiClient.get(`${BASE_URL}/institute/${schoolSlug}`);
        return response.data.data;
    }

    const { data: schoolDetailsData = [], isError, isSuccess, refetch, isLoading } = useQuery({
        queryFn: getSchoolDetails,
        queryKey: ['schoolDetails'],
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return <Loader2 className="animate-spin" />
    }

    if (isError) {
        return <ErrorFallback refetch={refetch} title="" />
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
        foundedIn: schoolDetailsData?.additionalInfo?.establishedYear,
        founder: schoolDetailsData?.additionalInfo?.founderName,
        students: schoolDetailsData?.totalStudents,
        staff: schoolDetailsData?.staff?.length,
        classes: schoolDetailsData?.classes?.length,
        admins: schoolDetailsData?.admins?.length,
    }

    return (
        <section>
            <SchoolHero data={heroData} />
            <SchoolStats stats={schoolStatsData} />
        </section>
    )
}

export default SchoolDetails