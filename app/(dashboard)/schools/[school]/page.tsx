import { SchoolDetails } from "@/modules/super-admin";

const page = async ({ params }: { params: Promise<{ school: string }> }) => {
  const { school } = await params;
  return (
    <div>
      <SchoolDetails schoolSlug={school} />
    </div>
  );
};

export default page;