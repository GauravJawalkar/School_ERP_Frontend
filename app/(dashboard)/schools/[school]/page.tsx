
const page = async ({ params }: { params: { school: string } }) => {
    const { school } = await params;
    return (
        <div>This School Is :  {school} </div>
    )
}

export default page