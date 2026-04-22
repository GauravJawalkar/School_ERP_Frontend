import EditSchoolDetails from "@/components/Dashboards/SuperAdmin/DynamicPages/School/EditSchoolDetails";

const EditSchoolPage = async ({ params }: { params: Promise<{ school: string }> }) => {
    const { school } = await params;

    return (
        <div>
            <EditSchoolDetails schoolSlug={school} />
        </div>
    )
}

export default EditSchoolPage 