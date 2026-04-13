import SchoolDetails from "@/components/Dashboards/SuperAdmin/DynamicPages/School/SchoolDetails";

const page = async ({ params }: { params: { school: string } }) => {
    const { school } = await params;
    return (
        <div>
            <SchoolDetails schoolSlug={school} />
        </div>
    )
}

export default page