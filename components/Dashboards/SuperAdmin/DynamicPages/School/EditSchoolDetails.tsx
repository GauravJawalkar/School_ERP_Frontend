"use client"
import ErrorFallback from '@/components/Commons/Errors/ErrorFallback'
import EditSchoolDetailsSkeleton from '@/components/Commons/Skeletons/EditSchoolDetailsSkeleton'
import AddSchoolForm from '@/components/Dashboards/SchoolAdmin/AddSchoolForm'
import { BASE_URL } from '@/constants/constants'
import { ApiClient } from '@/interceptors/ApiClient'
import { useQuery } from '@tanstack/react-query'

export const fetchSchoolData = async (slug: string) => {
    const response = await ApiClient.get(`${BASE_URL}/institute/${slug}`);
    return response.data.data;
}

const EditSchoolDetails = ({ schoolSlug }: { schoolSlug: string }) => {

    const { data: schoolDetails, isLoading, isError, refetch } = useQuery({
        queryFn: () => fetchSchoolData(schoolSlug),
        queryKey: ['schoolDetails', schoolSlug],
        refetchOnWindowFocus: false
    });

    if (isLoading) return <EditSchoolDetailsSkeleton />

    if (isError || !schoolDetails) return <ErrorFallback refetch={refetch} title='Error Loading School Details' />

    const { contactInfo, additionalInfo, ...rest } = schoolDetails || {};

    const schoolData = {
        schoolName: rest.schoolName || '',
        primaryEmail: contactInfo?.emails?.primary || '',
        affiliationNumber: rest.affiliationNumber || '',
        instituteLogo: rest.logoUrl || '',
        medium: rest.medium || '',
        establishedYear: String(additionalInfo?.establishedYear || '') || '',
        main_phone: contactInfo?.main_phone || '',
        website: contactInfo?.website || '',
        city: contactInfo?.address_details?.city || '',
        state: contactInfo?.address_details?.state || '',
        address: rest.address || '',
        landmark: contactInfo?.address_details?.landmark || '',
        office_hours_Mon_Fri:
            contactInfo?.office_hours?.monday_to_friday || '',
        office_hours_Sat:
            contactInfo?.office_hours?.saturday || '',
        pincode: contactInfo?.address_details?.pincode || '',
        founderName: additionalInfo?.founderName || '',
        missionStatement: additionalInfo?.missionStatement || '',
        visionStatement: additionalInfo?.visionStatement || '',
        coreValues: additionalInfo?.coreValues || [],
        tags: additionalInfo?.tags || [],
        boardsAffiliated: additionalInfo?.boardsAffiliated || [],
        notableAlumni: additionalInfo?.notableAlumni || [],
    };

    return (
        <AddSchoolForm
            mode="edit"
            schoolSlug={schoolSlug}
            defaultData={schoolData}
        />
    )
}

export default EditSchoolDetails