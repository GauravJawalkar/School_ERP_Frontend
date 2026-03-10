import { Asterisk } from "lucide-react"

export const RequiredBadge = () => {
    return (
        <span className="inline-flex">
            <Asterisk size={10} color="red" />
        </span>
    )
}

const AddSchoolPage = () => {
    return (
        <section>
            <div>
                <div className="text-sm">
                    <h2 className="text-base font-medium">Add New School</h2>
                    <p className="text-black/50">Register or add a new school into the system from here.</p>
                </div>
            </div>
            {/* Form To Add School Here */}
            <div className="py-10">
                <form>
                    <div className="grid grid-cols-1  md:grid-cols-2 gap-5">
                        {/* School Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">School Name <RequiredBadge /> </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter School Name"
                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50" />
                        </div>
                        {/* School Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Email  <RequiredBadge /></label>
                            <input
                                type="email"
                                name="email"
                                placeholder="school@email.com"
                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50" />
                        </div>
                        {/* Location Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Enter City"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="Enter State"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50" />
                            </div>
                        </div>
                        {/* Logo */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Logo</label>
                            <input
                                type="file"
                                name="logo"
                                placeholder="Upload Your Logo Here"
                                className="block w-full text-sm text-transparent file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-gray-200/80 file:text-black/50 hover:file:bg-gray-200 hover:file:text-black before:content-['Upload_Your_Logo_Here'] before:text-black/50 before:absolute before:left-30 before:top-2 relative border border-input-border rounded-md outline-none  focus:shadow focus:ring-2 focus:ring-neutral-400/50 transition-colors cursor-pointer" />
                        </div>
                        {/* Affiliation  Number */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Affiliation Number</label>
                            <input
                                type="text"
                                name="affiliationNumber"
                                placeholder="Enter School Affiliation Number"
                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50" />
                        </div>
                        {/* Contact & Website */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Contact No</label>
                                <input
                                    type="tel"
                                    name="contact"
                                    placeholder="+91 929..."
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    placeholder="https://school.com"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default AddSchoolPage