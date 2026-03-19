"use client"
import { Loader2, PlusIcon } from "lucide-react"
import { schoolSchema, SchoolSchemaFormValues } from "@/validations/school.validation"
import { useForm } from "@tanstack/react-form"
import FormInput from "@/components/Forms/FormInput"
import { RequiredBadge } from "@/components/Commons/RequiredBadge"

const AddSchoolForm = () => {
    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            contact: '',
            city: '',
            state: '',
            logo: undefined as unknown as File,
            affiliationNumber: '',
            website: '',
            address: '',
            landmark: '',
            officeHoursMondayToFridayFrom: '',
            officeHoursMondayToFridayTo: '',
            officeHoursSaturday: '',
            pincode: '',
            startTime: '',
            endTime: '',
        } satisfies SchoolSchemaFormValues,
        onSubmit: async ({ value }) => {
            console.log("Form Data is : ", value);
        }
    })
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
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation()
                        form.handleSubmit();
                    }}>
                    <div className="grid grid-cols-1  md:grid-cols-2 gap-5 py-10">
                        {/* School Name */}
                        <form.Field
                            name="name"
                            validators={{
                                onChange: schoolSchema.shape.name,
                                onBlur: schoolSchema.shape.name,
                                onChangeAsyncDebounceMs: 500
                            }}
                            children={(field) => {
                                return (
                                    <FormInput
                                        label="School Name"
                                        field={field}
                                        type="text"
                                        placeholder="Enter School Name"
                                        required
                                    />
                                )
                            }}
                        />

                        {/* School Email */}
                        <form.Field
                            name="email"
                            validators={{
                                onChange: schoolSchema.shape.email,
                                onBlur: schoolSchema.shape.email,
                                onChangeAsyncDebounceMs: 500
                            }}
                            children={(field) => {
                                return (
                                    <FormInput
                                        label="Primary Email"
                                        field={field}
                                        type="text"
                                        placeholder="school@email.com"
                                        required
                                    />
                                )
                            }}
                        />

                        {/* Location Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <form.Field
                                name="city"
                                validators={{
                                    onChange: schoolSchema.shape.city,
                                    onBlur: schoolSchema.shape.city,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <FormInput
                                            label="City"
                                            field={field}
                                            type="text"
                                            placeholder="Enter City"
                                            required
                                        />
                                    )
                                }}
                            />
                            <form.Field
                                name="state"
                                validators={{
                                    onChange: schoolSchema.shape.state,
                                    onBlur: schoolSchema.shape.state,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <FormInput
                                            label="State"
                                            field={field}
                                            type="text"
                                            placeholder="Enter State"
                                            required
                                        />
                                    )
                                }}
                            />
                        </div>

                        {/* Logo */}
                        <form.Field
                            name="logo"
                            validators={{
                                onChange: schoolSchema.shape.logo,
                                onBlur: schoolSchema.shape.logo,
                            }}
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Logo</label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"   // ← good UX, restricts file picker
                                        onChange={(e) => field.handleChange(e.target.files?.[0] as File)}
                                        onBlur={field.handleBlur}
                                        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-gray-200/80 file:text-black/50 hover:file:bg-gray-200 hover:file:text-black relative border border-input-border rounded-md outline-none focus:shadow focus:ring-2 focus:ring-neutral-400/50 transition-colors cursor-pointer"
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500">
                                            {field.state.meta.errors[0]?.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />

                        {/* Affiliation  Number */}
                        <form.Field
                            name="affiliationNumber"
                            validators={{
                                onChange: schoolSchema.shape.affiliationNumber,
                                onBlur: schoolSchema.shape.affiliationNumber,
                                onChangeAsyncDebounceMs: 500
                            }}
                            children={(field) => {
                                return (
                                    <FormInput
                                        label="Affiliation Number"
                                        field={field}
                                        type="text"
                                        placeholder="Enter School Affiliation Number"
                                        required
                                    />
                                )
                            }}

                        />
                        {/* Contact & Website */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <form.Field
                                name="contact"
                                validators={{
                                    onChange: schoolSchema.shape.contact,
                                    onBlur: schoolSchema.shape.contact,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <FormInput
                                            label="Contact"
                                            field={field}
                                            type="tel"
                                            placeholder="+91 9292929292"
                                            required
                                        />
                                    )
                                }}
                            />
                            <form.Field
                                name="website"
                                validators={{
                                    onChange: schoolSchema.shape.website,
                                    onBlur: schoolSchema.shape.website,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <FormInput
                                            label="Website"
                                            field={field}
                                            type="url"
                                            placeholder="https://school.com"
                                            required={false}
                                        />
                                    )
                                }}
                            />
                        </div>
                        {/* Address , Landmark and Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <form.Field
                                name="address"
                                validators={{
                                    onChange: schoolSchema.shape.address,
                                    onBlur: schoolSchema.shape.address,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm">Address <RequiredBadge /></label>
                                            <textarea
                                                name="address"
                                                rows={1.1}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                placeholder="eg. Opposite to Hp Petroleum"
                                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50  placeholder:text-black/40 slim-scrollbar" />
                                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                                <p className="text-xs text-red-500">
                                                    {field.state.meta.errors[0]?.message}
                                                </p>
                                            )}
                                        </div>
                                    )
                                }}
                            />

                            <form.Field
                                name="landmark"
                                validators={{
                                    onChange: schoolSchema.shape.landmark,
                                    onBlur: schoolSchema.shape.landmark,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <FormInput
                                            label="Landmark"
                                            field={field}
                                            type="text"
                                            placeholder="Loni Kalbhor HP Apartments"
                                            required={false}
                                        />
                                    )
                                }}
                            />
                        </div>

                        {/* PinCode , schools-hours */}

                        <div className="flex flex-col gap-1">
                            <div className="flex w-full items-center justify-center gap-2">
                                <form.Field
                                    name="officeHoursMondayToFridayFrom"
                                    validators={{
                                        onChange: schoolSchema.shape.officeHoursMondayToFridayFrom,
                                        onBlur: schoolSchema.shape.officeHoursMondayToFridayFrom,
                                        onChangeAsyncDebounceMs: 500
                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <FormInput
                                                    label="Start Time (Mon-Fri)"
                                                    field={field}
                                                    type="time"
                                                    placeholder="Loni Kalbhor HP Apartments"
                                                    required
                                                />
                                            </>
                                        )
                                    }}
                                />
                                <span className="text-sm text-black/50">to</span>
                                <form.Field
                                    name="officeHoursMondayToFridayTo"
                                    validators={{
                                        onChange: schoolSchema.shape.officeHoursMondayToFridayTo,
                                        onBlur: schoolSchema.shape.officeHoursMondayToFridayTo,
                                        onChangeAsyncDebounceMs: 500
                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <FormInput
                                                    label="End Time (Mon-Fri)"
                                                    field={field}
                                                    type="time"
                                                    placeholder="Loni Kalbhor HP Apartments"
                                                    required
                                                />
                                            </>
                                        )
                                    }}
                                />

                            </div>
                        </div>

                        {/* Office Hours Sat-Sun */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <form.Field
                                name="officeHoursSaturday"
                                validators={{
                                    onChange: schoolSchema.shape.officeHoursSaturday,
                                    onBlur: schoolSchema.shape.officeHoursSaturday,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <FormInput
                                            label="Start Time (Saturday)"
                                            field={field}
                                            type="time"
                                            placeholder=""
                                            required
                                        />
                                    )
                                }}
                            />
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
                        <form.Field
                            name="pincode"
                            validators={{
                                onChange: schoolSchema.shape.pincode,
                                onBlur: schoolSchema.shape.pincode,
                                onChangeAsyncDebounceMs: 500
                            }}
                            children={(field) => {
                                return (
                                    <FormInput
                                        label="Pincode"
                                        field={field}
                                        type="number"
                                        placeholder="eg. 412201"
                                        required
                                    />
                                )
                            }}
                        />
                    </div>
                    <div>
                        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                            {
                                ([canSubmit, isSubmitting]) => (
                                    <button
                                        type="submit"
                                        disabled={!canSubmit || isSubmitting}
                                        title="Add New School"
                                        className="w-fit cursor-pointer disabled:cursor-not-allowed bg-black text-white text-sm py-2 px-4 rounded-md hover:bg-black/80 transition-all ease-linear font-normal focus:ring-2 focus:ring-neutral-400/50 inline-flex items-center justify-center gap-2">
                                        {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : <PlusIcon size={17} />}
                                        {isSubmitting ? 'Adding...' : 'Add School'}
                                    </button>
                                )
                            }
                        </form.Subscribe>
                    </div>
                </form>
            </div >
        </section >
    )
}

export default AddSchoolForm