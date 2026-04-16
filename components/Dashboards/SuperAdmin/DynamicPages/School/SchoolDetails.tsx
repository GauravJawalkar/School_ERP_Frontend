"use client"

import ErrorFallback from "@/components/Commons/Errors/ErrorFallback";
import { BASE_URL } from "@/constants/constants";
import { ApiClient } from "@/interceptors/ApiClient";
import { useQuery } from "@tanstack/react-query";
import SchoolHero from "./SchoolHero";
import SchoolStats from "./SchoolStats";

const SchoolDetails = ({ schoolSlug }: { schoolSlug: string }) => {
    const getSchoolDetails = async () => {
        const response = await ApiClient.get(`${BASE_URL}/institute/${schoolSlug}`);
        return response.data.data;
    }

    const { data: schoolDetailsData = [], isError, isSuccess, refetch, isPending } = useQuery({
        queryFn: getSchoolDetails,
        queryKey: ['schoolDetails'],
        refetchOnWindowFocus: false,
    });

    if (isError) {
        return <ErrorFallback refetch={refetch} title="" />
    }

    return (
        <section>
            <SchoolHero />
            <SchoolStats />
        </section>
    )
}

export default SchoolDetails