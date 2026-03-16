import { Asterisk, PlusIcon } from "lucide-react"

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
            <div className="">
                <form>
                    <div className="grid grid-cols-1  md:grid-cols-2 gap-5 py-10">
                        {/* School Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">School Name <RequiredBadge /> </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter School Name"
                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40" />
                        </div>
                        {/* School Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Primary Email  <RequiredBadge /></label>
                            <input
                                type="email"
                                name="email"
                                placeholder="school@email.com"
                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40" />
                        </div>
                        {/* Location Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Enter City"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="Enter State"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40" />
                            </div>
                        </div>
                        {/* Logo */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Logo</label>
                            <input
                                type="file"
                                name="logo"
                                placeholder="Upload Your Logo Here"
                                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-gray-200/80 file:text-black/50 hover:file:bg-gray-200 hover:file:text-black relative border border-input-border rounded-md outline-none focus:shadow focus:ring-2 focus:ring-neutral-400/50 transition-colors cursor-pointer" />
                        </div>
                        {/* Affiliation  Number */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Affiliation Number <RequiredBadge /></label>
                            <input
                                type="text"
                                name="affiliationNumber"
                                placeholder="Enter School Affiliation Number"
                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40" />
                        </div>
                        {/* Contact & Website */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Contact No <RequiredBadge /></label>
                                <input
                                    type="tel"
                                    name="contact"
                                    placeholder="+91 9292929292"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    placeholder="https://school.com"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40" />
                            </div>
                        </div>
                        {/* Address , Landmark and Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Address <RequiredBadge /></label>
                                <textarea
                                    name="address"
                                    rows={1.1}
                                    placeholder="eg. Opposite to Hp Petroleum"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50  placeholder:text-black/40 slim-scrollbar" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Landmark</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    placeholder="eg. hp petrol pump"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50  placeholder:text-black/40" />
                            </div>
                        </div>

                        {/* PinCode , schools-hours */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">
                                Office Hours (Mon-Fri) <RequiredBadge />
                            </label>
                            <div className="flex w-full items-center gap-2">
                                <input
                                    name="officeHoursMondayToFridayFrom"
                                    type="time"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40 slim-scrollbar w-full"
                                />
                                <span className="text-sm text-black/50">to</span>
                                <input
                                    name="officeHoursMondayToFridayTo"
                                    type="time"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40 slim-scrollbar w-full"
                                />
                            </div>
                        </div>

                        {/* Office Hours Sat-Sun */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Office Hours (Saturday)</label>
                                <input
                                    name="officeHoursSaturday"
                                    type="time"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40 slim-scrollbar w-full"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Office Hours (Sunday)</label>
                                <input
                                    name="officeHoursSunday"
                                    type="text"
                                    placeholder="Off"
                                    readOnly
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40 slim-scrollbar w-full cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Pincode */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                placeholder="eg. 412201"
                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" title="Add New School" className="w-fit cursor-pointer bg-black text-white text-sm py-2 px-4 rounded-md hover:bg-black/80 transition-all ease-linear font-normal focus:ring-2 focus:ring-neutral-400/50 inline-flex items-center justify-center gap-2">
                            <PlusIcon size={17} />
                            Add New School</button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default AddSchoolPage