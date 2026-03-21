"use client"
import { Loader2, PlusIcon } from "lucide-react"
import { schoolSchema, SchoolSchemaFormValues } from "@/validations/school.validation"
import { useForm } from "@tanstack/react-form"
import FormInput from "@/components/Forms/FormInput"
import { RequiredBadge } from "@/components/Commons/RequiredBadge"
import { ApiClient } from "@/interceptors/ApiClient"
import { BASE_URL } from "@/constants/constants"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

const AddSchoolForm = () => {
    const form = useForm({
        defaultValues: {
            schoolName: '',
            primaryEmail: '',
            main_phone: '',
            city: '',
            state: '',
            instituteLogo: undefined as unknown as File,
            affiliationNumber: '',
            website: '',
            address: '',
            landmark: '',
            office_hours_Mon_Fri: '',
            office_hours_Sat: '',
            pincode: '',
        } satisfies SchoolSchemaFormValues,
        onSubmit: async ({ value }) => {
            console.log("Form Data is : ", value);
            await addNewSchoolMutation.mutateAsync(value);
        }
    })

    const addNewSchool = async (data: SchoolSchemaFormValues) => {
        const formData = new FormData();
        formData.append('schoolName', data.schoolName)
        formData.append('primaryEmail', data.primaryEmail)
        formData.append('main_phone', data.main_phone)
        formData.append('city', data.city)
        formData.append('state', data.state)
        formData.append('affiliationNumber', data.affiliationNumber)
        formData.append('website', data.website ?? '')
        formData.append('address', data.address)
        formData.append('landmark', data.landmark ?? '')
        formData.append('pincode', data.pincode)
        formData.append('office_hours_Mon_Fri', data.office_hours_Mon_Fri)
        formData.append('office_hours_Sat', data.office_hours_Sat)

        if (data.instituteLogo) {
            formData.append('instituteLogo', data.instituteLogo)
        }
        console.log("New School Data is : ", data);
        const response = await ApiClient.post(`${BASE_URL}/institute/createInstitute`, formData);
        return response.data?.data;
    }

    const addNewSchoolMutation = useMutation({
        mutationFn: addNewSchool,
        onSuccess: () => {
            toast.success("School Added Successful!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Something Went Wrong! Please try again.");
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
                            name="schoolName"
                            validators={{
                                onChange: schoolSchema.shape.schoolName,
                                onBlur: schoolSchema.shape.schoolName,
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
                            name="primaryEmail"
                            validators={{
                                onChange: schoolSchema.shape.primaryEmail,
                                onBlur: schoolSchema.shape.primaryEmail,
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
                            name="instituteLogo"
                            validators={{
                                onChange: schoolSchema.shape.instituteLogo,
                                onBlur: schoolSchema.shape.instituteLogo,
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
                                name="main_phone"
                                validators={{
                                    onChange: schoolSchema.shape.main_phone,
                                    onBlur: schoolSchema.shape.main_phone,
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

                        {/* Office Hours Mon-Fri */}
                        <form.Field
                            name="office_hours_Mon_Fri"
                            validators={{
                                onChange: schoolSchema.shape.office_hours_Mon_Fri,
                                onBlur: schoolSchema.shape.office_hours_Mon_Fri,
                            }}
                            children={(field) => {
                                // parse existing value back to from/to for the inputs
                                const [from = '', to = ''] = field.state.value?.split(' - ') ?? []

                                return (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm">
                                            Office Hours (Mon–Fri) <RequiredBadge />
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={from}
                                                onChange={(e) => {
                                                    field.handleChange(`${e.target.value} - ${to}`)
                                                }}
                                                onBlur={field.handleBlur}
                                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:ring-2 focus:ring-neutral-400/50 w-full"
                                            />
                                            <span className="text-sm text-black/50 shrink-0">to</span>
                                            <input
                                                type="time"
                                                value={to}
                                                onChange={(e) => {
                                                    field.handleChange(`${from} - ${e.target.value}`)
                                                }}
                                                onBlur={field.handleBlur}
                                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:ring-2 focus:ring-neutral-400/50 w-full"
                                            />
                                        </div>
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
                            name="office_hours_Sat"
                            validators={{
                                onChange: schoolSchema.shape.office_hours_Sat,
                                onBlur: schoolSchema.shape.office_hours_Sat,
                            }}
                            children={(field) => {
                                const [from = '', to = ''] = field.state.value?.split(' - ') ?? []

                                return (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm">Office Hours (Saturday)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={from}
                                                onChange={(e) => field.handleChange(`${e.target.value} - ${to}`)}
                                                onBlur={field.handleBlur}
                                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:ring-2 focus:ring-neutral-400/50 w-full"
                                            />
                                            <span className="text-sm text-black/50 shrink-0">to</span>
                                            <input
                                                type="time"
                                                value={to}
                                                onChange={(e) => field.handleChange(`${from} - ${e.target.value}`)}
                                                onBlur={field.handleBlur}
                                                className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:ring-2 focus:ring-neutral-400/50 w-full"
                                            />
                                        </div>
                                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-red-500">
                                                {field.state.meta.errors[0]?.message}
                                            </p>
                                        )}
                                    </div>
                                )
                            }}
                        />

                        {/* Sunday — static, not a form field */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Office Hours (Sunday)</label>
                                <input
                                    type="text"
                                    placeholder="Off"
                                    readOnly
                                    className="border border-input-border text-sm p-2 rounded-md cursor-not-allowed text-black/40"
                                />
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
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={addNewSchoolMutation.isPending}
                            title="Add New School"
                            className="w-fit cursor-pointer disabled:cursor-not-allowed bg-black text-white text-sm py-2 px-4 rounded-md hover:bg-black/80 transition-all ease-linear font-normal focus:ring-2 focus:ring-neutral-400/50 inline-flex items-center justify-center gap-2">
                            {(addNewSchoolMutation.isPending && !addNewSchoolMutation.isError) ? <Loader2 size={17} className="animate-spin" /> : <PlusIcon size={17} />}
                            {(addNewSchoolMutation.isPending && !addNewSchoolMutation.isError) ? 'Adding...' : 'Add School'}
                        </button>


                    </div>
                </form>
            </div >
        </section >
    )
}

export default AddSchoolForm