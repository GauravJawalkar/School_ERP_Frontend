"use client"
import { useState } from "react"
import { Loader2, ArrowLeft, ArrowRight, CheckIcon, Upload, Trash2 } from "lucide-react"
import { schoolSchema, SchoolSchemaFormValues, MEDIUM_OPTIONS } from "@/validations/school.validation"
import { useForm } from "@tanstack/react-form"
import FormInput from "@/components/Forms/FormInput"
import TagChipInput from "@/components/Forms/TagChipInput"
import StepIndicator from "@/components/Forms/StepIndicator"
import { RequiredBadge } from "@/components/Commons/RequiredBadge"
import { ApiClient } from "@/interceptors/ApiClient"
import { BASE_URL } from "@/constants/constants"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { AddSchoolFormProps } from "@/interfaces/interface"

const STEPS = [
    { label: 'Basic info' },
    { label: 'Contact & location' },
    { label: 'Hours & pincode' },
    { label: 'Additional info' },
]

const AddSchoolForm = ({ mode, schoolSlug, defaultData }: AddSchoolFormProps) => {
    const [step, setStep] = useState(0)

    const form = useForm({
        defaultValues: {
            schoolName: defaultData?.schoolName || '',
            primaryEmail: defaultData?.primaryEmail || '',
            affiliationNumber: defaultData?.affiliationNumber || '',
            instituteLogo: undefined as unknown as File,
            medium: defaultData?.medium || '',
            establishedYear: defaultData?.establishedYear || '',
            main_phone: defaultData?.main_phone || '',
            website: defaultData?.website || '',
            city: defaultData?.city || '',
            state: defaultData?.state || '',
            address: defaultData?.address || '',
            landmark: defaultData?.landmark || '',
            office_hours_Mon_Fri: defaultData?.office_hours_Mon_Fri || '',
            office_hours_Sat: defaultData?.office_hours_Sat || '',
            pincode: defaultData?.pincode || '',
            founderName: defaultData?.founderName || '',
            missionStatement: defaultData?.missionStatement || '',
            visionStatement: defaultData?.visionStatement || '',
            coreValues: defaultData?.coreValues || [] as string[],
            tags: defaultData?.tags || [] as string[],
            boardsAffiliated: defaultData?.boardsAffiliated || [] as string[],
            notableAlumni: defaultData?.notableAlumni || [] as string[],
        } satisfies SchoolSchemaFormValues,
        onSubmit: async ({ value }) => {
            await addNewSchoolMutation.mutateAsync(value)
        }
    })

    // Checks if add or edit school details
    const submitSchool = async (data: SchoolSchemaFormValues) => {
        const formData = new FormData()
        formData.append('schoolName', data.schoolName)
        formData.append('primaryEmail', data.primaryEmail)
        formData.append('affiliationNumber', data.affiliationNumber)
        formData.append('main_phone', data.main_phone)
        formData.append('website', data.website)
        formData.append('city', data.city)
        formData.append('state', data.state)
        formData.append('address', data.address)
        formData.append('landmark', data.landmark ?? '')
        formData.append('office_hours_Mon_Fri', data.office_hours_Mon_Fri)
        formData.append('office_hours_Sat', data.office_hours_Sat)
        formData.append('pincode', data.pincode)

        // only upload logo if a new file was selected
        if (data.instituteLogo instanceof File) formData.append('instituteLogo', data.instituteLogo)

        if (data.medium) formData.append('medium', data.medium)
        if (data.establishedYear) formData.append('establishedYear', data.establishedYear)
        if (data.founderName) formData.append('founderName', data.founderName)
        if (data.missionStatement) formData.append('missionStatement', data.missionStatement)
        if (data.visionStatement) formData.append('visionStatement', data.visionStatement)

        data.coreValues?.forEach(v => formData.append('coreValues[]', v))
        data.tags?.forEach(v => formData.append('tags[]', v))
        data.boardsAffiliated?.forEach(v => formData.append('boardsAffiliated[]', v))
        data.notableAlumni?.forEach(v => formData.append('notableAlumni[]', v))

        const res = mode === 'edit'
            ? await ApiClient.patch(`${BASE_URL}/institute/update/${schoolSlug}`, formData)
            : await ApiClient.post(`${BASE_URL}/institute/createInstitute`, formData)

        return res.data?.data
    }

    const addNewSchoolMutation = useMutation({
        mutationFn: submitSchool,
        onSuccess: () => {
            if (mode === 'edit') {
                toast.success("School details updated!")
            } else {
                toast.success("School added successfully!")
                form.reset()
                setStep(0)
            }
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Something went wrong.")
    })

    const inputClass = "border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40 w-full"

    return (
        <section className="p-6 rounded-md shadow-xs border border-light-border">
            <div className="mb-8">
                <h2 className="text-base font-medium">
                    {mode === 'edit' ? 'Edit School Details' : 'Add New School'}
                </h2>
                <p className="text-sm text-black/50">
                    {mode === 'edit'
                        ? 'Update the school information below.'
                        : 'Register or add a new school into the system from here.'}
                </p>
            </div>

            {/* Step Indicator */}
            <div className="mb-12">
                <StepIndicator steps={STEPS} current={step} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation() }}>

                {/* ── STEP 1: Basic Info ── */}
                {step === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <form.Field
                            name="schoolName"
                            validators={{ onChange: schoolSchema.shape.schoolName, onBlur: schoolSchema.shape.schoolName }}
                            children={(field) => (
                                <FormInput label="School Name" field={field} type="text" placeholder="eg. Delhi Public School" required />
                            )}
                        />

                        <form.Field
                            name="primaryEmail"
                            validators={{ onChange: schoolSchema.shape.primaryEmail, onBlur: schoolSchema.shape.primaryEmail }}
                            children={(field) => (
                                <FormInput label="Primary Email" field={field} type="text" placeholder="school@email.com" required />
                            )}
                        />

                        <form.Field
                            name="affiliationNumber"
                            validators={{ onChange: schoolSchema.shape.affiliationNumber, onBlur: schoolSchema.shape.affiliationNumber }}
                            children={(field) => (
                                <FormInput label="Affiliation Number" field={field} type="text" placeholder="eg. 1234567" required />
                            )}
                        />

                        {/* Logo */}
                        <form.Field
                            name="instituteLogo"
                            validators={{
                                onChange: mode === 'edit' ? undefined : schoolSchema.shape.instituteLogo,
                                onBlur: mode === 'edit' ? undefined : schoolSchema.shape.instituteLogo,
                            }}
                            children={(field) => {
                                const selectedFile = field.state.value as unknown as File;

                                // Dynamic local preview URL if a File is selected
                                const previewUrl = selectedFile instanceof File
                                    ? URL.createObjectURL(selectedFile)
                                    : (mode === 'edit' && defaultData?.instituteLogo ? (defaultData.instituteLogo as unknown as string) : "");

                                const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.handleChange(file);
                                    }
                                };

                                const handleRemove = () => {
                                    field.handleChange(undefined as unknown as File);
                                };

                                return (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-black">
                                            Institute Logo {mode === 'create' && <RequiredBadge />}
                                        </label>

                                        <div className="flex items-center gap-4 bg-gray-50/50 p-4 border border-light-border rounded-xl">
                                            {/* Preview Image / Placeholder Box */}
                                            <div className="relative w-16 h-16 rounded-xl border border-light-border bg-white flex items-center justify-center overflow-hidden shrink-0">
                                                {previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Logo preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-black/30">
                                                        <svg
                                                            className="w-6 h-6"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Triggers */}
                                            <div className="flex-1 flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <label className="cursor-pointer bg-black text-white hover:bg-black/85 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 select-none">
                                                        <Upload className="w-3.5 h-3.5" />
                                                        Upload Image
                                                        <input
                                                            type="file"
                                                            accept="image/png,image/jpeg,image/jpg"
                                                            onChange={handleFileChange}
                                                            onBlur={field.handleBlur}
                                                            className="hidden"
                                                        />
                                                    </label>

                                                    {previewUrl && (
                                                        <button
                                                            type="button"
                                                            onClick={handleRemove}
                                                            className="bg-white text-black/60 hover:text-black border border-light-border px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-black/40 font-medium">
                                                    PNG, JPG or JPEG. Max size 2 MB.
                                                </span>
                                            </div>
                                        </div>

                                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-red-500 font-medium">{field.state.meta.errors[0]?.message}</p>
                                        )}
                                    </div>
                                );
                            }}
                        />

                        {/* Medium */}
                        <form.Field
                            name="medium"
                            validators={{ onChange: ({ value }) => undefined }}
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">
                                        Medium <span className="text-black/30 font-normal">(optional)</span>
                                    </label>
                                    <select
                                        value={(field.state.value as string) ?? ''}
                                        onChange={(e) => field.handleChange((e.target.value || undefined) as any)}
                                        className="border border-input-border text-sm p-2 outline-none rounded-md font-normal focus:shadow focus:ring-2 focus:ring-neutral-400/50">
                                        <option value="">Select medium</option>
                                        {MEDIUM_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>
                                                {opt.charAt(0) + opt.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        />

                        {/* Established Year */}
                        <form.Field
                            name="establishedYear"
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value || value === '') return undefined
                                    if (!/^\d{4}$/.test(value)) return 'Enter a valid 4-digit year'
                                    return undefined
                                },
                                onBlur: ({ value }) => {
                                    if (!value || value === '') return undefined
                                    if (!/^\d{4}$/.test(value)) return 'Enter a valid 4-digit year'
                                    return undefined
                                },
                            }}
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">
                                        Established Year <span className="text-black/30 font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="number"
                                        min={1800}
                                        max={new Date().getFullYear()}
                                        value={field.state.value ?? ''}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="eg. 1995"
                                        className={inputClass} />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500">{field.state.meta.errors[0] as string}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                )}

                {/* ── STEP 2: Contact & Location ── */}
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <form.Field
                            name="main_phone"
                            validators={{ onChange: schoolSchema.shape.main_phone, onBlur: schoolSchema.shape.main_phone }}
                            children={(field) => (
                                <FormInput label="Contact Number" field={field} type="tel" placeholder="9292929292" required />
                            )}
                        />

                        <form.Field
                            name="website"
                            validators={{ onChange: schoolSchema.shape.website, onBlur: schoolSchema.shape.website }}
                            children={(field) => (
                                <FormInput label="Website" field={field} type="url" placeholder="https://school.com" required />
                            )}
                        />

                        <form.Field
                            name="city"
                            validators={{ onChange: schoolSchema.shape.city, onBlur: schoolSchema.shape.city }}
                            children={(field) => (
                                <FormInput label="City" field={field} type="text" placeholder="Enter city" required />
                            )}
                        />

                        <form.Field
                            name="state"
                            validators={{ onChange: schoolSchema.shape.state, onBlur: schoolSchema.shape.state }}
                            children={(field) => (
                                <FormInput label="State" field={field} type="text" placeholder="Enter state" required />
                            )}
                        />

                        <form.Field
                            name="address"
                            validators={{ onChange: schoolSchema.shape.address, onBlur: schoolSchema.shape.address }}
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Address <RequiredBadge /></label>
                                    <textarea
                                        rows={2}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="eg. Opposite to HP Petroleum, Near Bus Stand"
                                        className={inputClass + " slim-scrollbar"} />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500">{field.state.meta.errors[0]?.message}</p>
                                    )}
                                </div>
                            )}
                        />

                        <form.Field
                            name="landmark"
                            children={(field) => (
                                <FormInput label="Landmark" field={field} type="text" placeholder="eg. Loni Kalbhor HP Apartments" required={false} />
                            )}
                        />
                    </div>
                )}

                {/* ── STEP 3: Hours & Pincode ── */}
                {step === 2 && (
                    <div className="flex flex-col gap-5">
                        {(['office_hours_Mon_Fri', 'office_hours_Sat'] as const).map((name) => (
                            <form.Field
                                key={name}
                                name={name}
                                validators={{ onChange: schoolSchema.shape[name], onBlur: schoolSchema.shape[name] }}
                                children={(field) => {
                                    const [from = '', to = ''] = field.state.value?.split(' - ') ?? []
                                    return (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm">
                                                {name === 'office_hours_Mon_Fri' ? 'Monday – Friday' : 'Saturday'} <RequiredBadge />
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input type="time" value={from} onChange={(e) => field.handleChange(`${e.target.value} - ${to}`)} onBlur={field.handleBlur} className={inputClass} />
                                                <span className="text-sm text-black/40 shrink-0">to</span>
                                                <input type="time" value={to} onChange={(e) => field.handleChange(`${from} - ${e.target.value}`)} onBlur={field.handleBlur} className={inputClass} />
                                            </div>
                                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                                <p className="text-xs text-red-500">{field.state.meta.errors[0]?.message}</p>
                                            )}
                                        </div>
                                    )
                                }}
                            />
                        ))}

                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Sunday</label>
                                <input type="text" value="Off" readOnly className={inputClass + " cursor-not-allowed text-black/40"} />
                            </div>
                            <form.Field
                                name="pincode"
                                validators={{ onChange: schoolSchema.shape.pincode, onBlur: schoolSchema.shape.pincode }}
                                children={(field) => (
                                    <FormInput label="Pincode" field={field} type="text" placeholder="eg. 412201" required />
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* ── STEP 4: Additional Info ── */}
                {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <form.Field
                            name="founderName"
                            children={(field) => (
                                <FormInput label="Founder Name" field={field} type="text" placeholder="eg. Dr. Rajesh Sharma" required={false} />
                            )}
                        />

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Boards Affiliated</label>
                            <form.Field
                                name="boardsAffiliated"
                                children={(field) => (
                                    <TagChipInput
                                        value={field.state.value ?? []}
                                        onChange={field.handleChange}
                                        onBlur={field.handleBlur}
                                        placeholder="Type & press Enter…"
                                        hint="eg. CBSE · ICSE · SSC"
                                    />
                                )}
                            />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1">
                            <label className="text-sm">Mission Statement</label>
                            <form.Field
                                name="missionStatement"
                                children={(field) => (
                                    <textarea
                                        rows={3}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="eg. To nurture young minds with quality education..."
                                        className={inputClass + " slim-scrollbar"}
                                    />
                                )}
                            />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1">
                            <label className="text-sm">Vision Statement</label>
                            <form.Field
                                name="visionStatement"
                                children={(field) => (
                                    <textarea
                                        rows={3}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="eg. To be a centre of excellence that prepares students for a global future..."
                                        className={inputClass + " slim-scrollbar"}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Core Values</label>
                            <form.Field
                                name="coreValues"
                                children={(field) => (
                                    <TagChipInput
                                        value={field.state.value ?? []}
                                        onChange={field.handleChange}
                                        onBlur={field.handleBlur}
                                        placeholder="Type & press Enter…"
                                        hint="eg. Integrity · Excellence · Discipline"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Tags</label>
                            <form.Field
                                name="tags"
                                children={(field) => (
                                    <TagChipInput
                                        value={field.state.value ?? []}
                                        onChange={field.handleChange}
                                        onBlur={field.handleBlur}
                                        placeholder="Type & press Enter…"
                                        hint="eg. Co-ed · Sports · Arts · STEM"
                                    />
                                )}
                            />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1">
                            <label className="text-sm">Notable Alumni</label>
                            <form.Field
                                name="notableAlumni"
                                children={(field) => (
                                    <TagChipInput
                                        value={field.state.value ?? []}
                                        onChange={field.handleChange}
                                        onBlur={field.handleBlur}
                                        placeholder="Type & press Enter…"
                                        hint="Press Enter after each name"
                                    />
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* ── Navigation ── */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-neutral-100">
                    <button
                        type="button"
                        onClick={() => setStep(s => s - 1)}
                        disabled={step === 0}
                        className="inline-flex items-center gap-2 text-sm px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <ArrowLeft size={15} /> Back
                    </button>

                    <span className="text-xs text-black/40">Step {step + 1} of {STEPS.length}</span>

                    {step < STEPS.length - 1 ? (
                        <button
                            type="button"
                            onClick={() => setStep(s => s + 1)}
                            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-all">
                            Next <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={addNewSchoolMutation.isPending}
                            onClick={() => form.handleSubmit()}
                            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60 transition-all">
                            {addNewSchoolMutation.isPending
                                ? <><Loader2 size={15} className="animate-spin" /> {mode === 'edit' ? 'Saving...' : 'Adding...'}</>
                                : <><CheckIcon size={15} /> {mode === 'edit' ? 'Save Changes' : 'Add School'}</>
                            }
                        </button>
                    )}
                </div>
            </form>
        </section>
    )
}

export default AddSchoolForm