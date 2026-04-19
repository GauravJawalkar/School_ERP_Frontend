"use client"
import { useState } from "react"
import { Loader2, ArrowLeft, ArrowRight, CheckIcon } from "lucide-react"
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

const STEPS = [
    { label: 'Basic info' },
    { label: 'Contact & location' },
    { label: 'Hours & pincode' },
    { label: 'Additional info' },
]

const AddSchoolForm = () => {
    const [step, setStep] = useState(0)

    const form = useForm({
        defaultValues: {
            schoolName: '',
            primaryEmail: '',
            affiliationNumber: '',
            instituteLogo: undefined as unknown as File,
            medium: '' as string,
            establishedYear: '',
            main_phone: '',
            website: '',
            city: '',
            state: '',
            address: '',
            landmark: '',
            office_hours_Mon_Fri: '',
            office_hours_Sat: '',
            pincode: '',
            founderName: '',
            missionStatement: '',
            visionStatement: '',
            coreValues: [] as string[],
            tags: [] as string[],
            boardsAffiliated: [] as string[],
            notableAlumni: [] as string[],
        } satisfies SchoolSchemaFormValues,
        onSubmit: async ({ value }) => {
            await addNewSchoolMutation.mutateAsync(value)
        }
    })

    const addNewSchool = async (data: SchoolSchemaFormValues) => {
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

        if (data.instituteLogo) formData.append('instituteLogo', data.instituteLogo)
        if (data.medium) formData.append('medium', data.medium)
        if (data.establishedYear) formData.append('establishedYear', data.establishedYear)
        if (data.founderName) formData.append('founderName', data.founderName)
        if (data.missionStatement) formData.append('missionStatement', data.missionStatement)
        if (data.visionStatement) formData.append('visionStatement', data.visionStatement)

        data.coreValues?.forEach(coreValue => formData.append('coreValues[]', coreValue))
        data.tags?.forEach(tag => formData.append('tags[]', tag))
        data.boardsAffiliated?.forEach(board => formData.append('boardsAffiliated[]', board))
        data.notableAlumni?.forEach(alumni => formData.append('notableAlumni[]', alumni))
        const res = await ApiClient.post(`${BASE_URL}/institute/createInstitute`, formData)
        return res.data?.data
    }

    const addNewSchoolMutation = useMutation({
        mutationFn: addNewSchool,
        onSuccess: () => {
            toast.success("School added successfully!");
            form.reset()  // reset form to default values
            setStep(0)  // navigate back to first step
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Something went wrong.")
    })

    const inputClass = "border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40 w-full"

    return (
        <section className="p-6 rounded-md shadow-xs border border-light-border">
            <div className="mb-8">
                <h2 className="text-base font-medium">Add New School</h2>
                <p className="text-sm text-black/50">Register or add a new school into the system from here.</p>
            </div>

            {/* Step Indicator */}
            <div className="mb-12">
                <StepIndicator steps={STEPS} current={step} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation() }}>

                {/* ── STEP 1: Basic Info ── */}
                {step === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <form.Field name="schoolName" validators={{ onChange: schoolSchema.shape.schoolName, onBlur: schoolSchema.shape.schoolName }}
                            children={(field) => <FormInput label="School Name" field={field} type="text" placeholder="eg. Delhi Public School" required />} />

                        <form.Field name="primaryEmail" validators={{ onChange: schoolSchema.shape.primaryEmail, onBlur: schoolSchema.shape.primaryEmail }}
                            children={(field) => <FormInput label="Primary Email" field={field} type="text" placeholder="school@email.com" required />} />

                        <form.Field name="affiliationNumber" validators={{ onChange: schoolSchema.shape.affiliationNumber, onBlur: schoolSchema.shape.affiliationNumber }}
                            children={(field) => <FormInput label="Affiliation Number" field={field} type="text" placeholder="eg. 1234567" required />} />

                        <form.Field name="instituteLogo" validators={{ onChange: schoolSchema.shape.instituteLogo, onBlur: schoolSchema.shape.instituteLogo }}
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Institute Logo <RequiredBadge /></label>
                                    <input type="file" accept="image/png,image/jpeg,image/jpg"
                                        onChange={(e) => field.handleChange(e.target.files?.[0] as File)}
                                        onBlur={field.handleBlur}
                                        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-gray-200/80 file:text-black/50 hover:file:bg-gray-200 hover:file:text-black border border-input-border rounded-md outline-none focus:ring-2 focus:ring-neutral-400/50 cursor-pointer" />
                                    <p className="text-xs text-black/40">PNG or JPG · max 2 MB</p>
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500">{field.state.meta.errors[0]?.message}</p>
                                    )}
                                </div>
                            )} />

                        <form.Field
                            name="medium"
                            validators={{
                                onChange: ({ value }) => undefined,  // optional, no validation needed
                            }}
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Medium <span className="text-black/30 font-normal">(optional)</span></label>
                                    <select
                                        value={(field.state.value as string) ?? ''}
                                        onChange={(e) => field.handleChange((e.target.value || undefined) as any)}
                                        className="border border-input-border text-sm p-2 outline-none rounded-md font-normal focus:shadow focus:ring-2 focus:ring-neutral-400/50 placeholder:text-black/40"
                                    >
                                        <option value="">Select medium</option>
                                        {MEDIUM_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt.charAt(0) + opt.slice(1).toLowerCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            )} />

                        <form.Field
                            name="establishedYear"
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value || value === '') return undefined        // empty = valid (optional)
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
                                    <label className="text-sm">Established Year <span className="text-black/30 font-normal">(optional)</span></label>
                                    <input type="number" min={1800} max={new Date().getFullYear()}
                                        value={field.state.value ?? ''}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="eg. 1995" className={inputClass} />
                                </div>
                            )} />
                    </div>
                )}

                {/* ── STEP 2: Contact & Location ── */}
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <form.Field name="main_phone" validators={{ onChange: schoolSchema.shape.main_phone, onBlur: schoolSchema.shape.main_phone }}
                            children={(field) => <FormInput label="Contact Number" field={field} type="tel" placeholder="9292929292" required />} />

                        <form.Field name="website" validators={{ onChange: schoolSchema.shape.website, onBlur: schoolSchema.shape.website }}
                            children={(field) => <FormInput label="Website" field={field} type="url" placeholder="https://school.com" required />} />

                        <form.Field name="city" validators={{ onChange: schoolSchema.shape.city, onBlur: schoolSchema.shape.city }}
                            children={(field) => <FormInput label="City" field={field} type="text" placeholder="Enter city" required />} />

                        <form.Field name="state" validators={{ onChange: schoolSchema.shape.state, onBlur: schoolSchema.shape.state }}
                            children={(field) => <FormInput label="State" field={field} type="text" placeholder="Enter state" required />} />

                        <form.Field name="address" validators={{ onChange: schoolSchema.shape.address, onBlur: schoolSchema.shape.address }}
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Address <RequiredBadge /></label>
                                    <textarea rows={2} value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="eg. Opposite to HP Petroleum, Near Bus Stand"
                                        className={inputClass + " slim-scrollbar"} />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-xs text-red-500">{field.state.meta.errors[0]?.message}</p>
                                    )}
                                </div>
                            )} />

                        <form.Field name="landmark"
                            children={(field) => <FormInput label="Landmark" field={field} type="text" placeholder="eg. Loni Kalbhor HP Apartments" required={false} />} />
                    </div>
                )}

                {/* ── STEP 3: Hours & Pincode ── */}
                {step === 2 && (
                    <div className="flex flex-col gap-5">
                        {(['office_hours_Mon_Fri', 'office_hours_Sat'] as const).map((name) => (
                            <form.Field key={name} name={name}
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
                                }} />
                        ))}

                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Sunday</label>
                                <input type="text" value="Off" readOnly className={inputClass + " cursor-not-allowed text-black/40"} />
                            </div>
                            <form.Field name="pincode" validators={{ onChange: schoolSchema.shape.pincode, onBlur: schoolSchema.shape.pincode }}
                                children={(field) => <FormInput label="Pincode" field={field} type="text" placeholder="eg. 412201" required />} />
                        </div>
                    </div>
                )}

                {/* ── STEP 4: Additional Info ── */}
                {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <form.Field name="founderName"
                            children={(field) => <FormInput label="Founder Name" field={field} type="text" placeholder="eg. Dr. Rajesh Sharma" required={false} />} />

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Boards Affiliated</label>
                            <form.Field name="boardsAffiliated"
                                children={(field) => (
                                    <TagChipInput value={field.state.value ?? []} onChange={field.handleChange} onBlur={field.handleBlur}
                                        placeholder="Type & press Enter…" hint="eg. CBSE · ICSE · SSC" />
                                )} />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1">
                            <label className="text-sm">Mission Statement</label>
                            <form.Field name="missionStatement"
                                children={(field) => (
                                    <textarea rows={3} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                                        placeholder="eg. To nurture young minds with quality education..."
                                        className={inputClass + " slim-scrollbar"} />
                                )} />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1">
                            <label className="text-sm">Vision Statement</label>
                            <form.Field name="visionStatement"
                                children={(field) => (
                                    <textarea rows={3} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                                        placeholder="eg. To be a centre of excellence that prepares students for a global future..."
                                        className={inputClass + " slim-scrollbar"} />
                                )} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Core Values</label>
                            <form.Field name="coreValues"
                                children={(field) => (
                                    <TagChipInput value={field.state.value ?? []} onChange={field.handleChange} onBlur={field.handleBlur}
                                        placeholder="Type & press Enter…" hint="eg. Integrity · Excellence · Discipline" />
                                )} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Tags</label>
                            <form.Field name="tags"
                                children={(field) => (
                                    <TagChipInput value={field.state.value ?? []} onChange={field.handleChange} onBlur={field.handleBlur}
                                        placeholder="Type & press Enter…" hint="eg. Co-ed · Sports · Arts · STEM" />
                                )} />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1">
                            <label className="text-sm">Notable Alumni</label>
                            <form.Field name="notableAlumni"
                                children={(field) => (
                                    <TagChipInput value={field.state.value ?? []} onChange={field.handleChange} onBlur={field.handleBlur}
                                        placeholder="Type & press Enter…" hint="Press Enter after each name" />
                                )} />
                        </div>
                    </div>
                )}

                {/* ── Navigation ── */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-neutral-100">
                    <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}
                        className="inline-flex items-center gap-2 text-sm px-4 py-2 border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <ArrowLeft size={15} /> Back
                    </button>

                    <span className="text-xs text-black/40">Step {step + 1} of {STEPS.length}</span>

                    {step < STEPS.length - 1 ? (
                        <button type="button" onClick={() => setStep(step => step + 1)}
                            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-all">
                            Next <ArrowRight size={15} />
                        </button>
                    ) : (
                        <button type="submit" disabled={addNewSchoolMutation.isPending}
                            onClick={() => form.handleSubmit()}
                            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60 transition-all">
                            {addNewSchoolMutation.isPending
                                ? <><Loader2 size={15} className="animate-spin" /> Adding...</>
                                : <><CheckIcon size={15} /> Add School</>}
                        </button>
                    )}
                </div>
            </form>
        </section>
    )
}

export default AddSchoolForm