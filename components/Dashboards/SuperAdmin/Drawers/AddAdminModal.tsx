"use client"
import { RequiredBadge } from "@/components/Commons/RequiredBadge";
import FormInput from "@/components/Forms/FormInput";
import { BASE_URL } from "@/constants/constants";
import { schoolAdmin } from "@/constants/roles.constants";
import { ApiClient } from "@/interceptors/ApiClient";
import { AddAdminFormData } from "@/interfaces/interface";
import { addAdminSchema } from "@/validations/addAdmin.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Plus, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface School {
    schoolName: string;
    schoolId: number;
    schoolEmail: string;
}

const AddAdminModal = ({ isOpen, school, onClose }: { isOpen: boolean, school: School, onClose: () => void }) => {
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            instituteId: school.schoolId,
            phone: '',
            gender: '' as string,
            password: '',
            isActive: true as boolean,
            roleName: schoolAdmin
        },
        validators: {
            onSubmit: addAdminSchema,
        },
        onSubmit: async ({ value }) => {
            if (!value.instituteId) return;
            addSchoolAdminMutation.mutate(value, {
                onSuccess: () => onClose(),
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Something Went Wrong! Please try again.");
                    onClose();
                }
            });
        }
    });

    const addSchoolAdmin = async (data: AddAdminFormData) => {
        const response = await ApiClient.post(`${BASE_URL}/institute/createSchoolAdmin`, data);
        return response.data.data;
    }

    const addSchoolAdminMutation = useMutation({
        mutationFn: addSchoolAdmin,
        onSuccess: (data) => {
            toast.success("Admin Added!");
            queryClient.invalidateQueries({ queryKey: ['schoolAdmins', data.schoolId] })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Something Went Wrong! Please try again.");
        }
    })

    const handlePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }

    if (!isOpen) return null;

    return (
        <section className="fixed inset-0 z-50 flex items-start justify-end sm:p-0">
            {/* Backdrop with elegant blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="relative w-full sm:w-[500px] bg-white h-full sm:h-dvh shadow-2xl flex flex-col sm:rounded-l-lg overflow-hidden border-l border-neutral-200 transition-transform transform"
                style={{ animation: 'slideInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                {/* Keyframes inline for guaranteed animation without config changes */}
                <style>{`
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `}</style>

                {/* Header */}
                <div className="flex-none px-6 py-5 border-b border-neutral-100 bg-white z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center text-white shadow-sm">
                            <ShieldCheck size={20} strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-base font-medium text-black tracking-tight">Create Administrator</h2>
                            <p className="text-xs text-black/60 font-normal">For {school.schoolName}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-md text-black/50 hover:text-black hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 slim-scrollbar">
                    <form id="add-admin-form" onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}>
                        <div className="space-y-5">

                            {/* Two Column Layout for Names */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* FirstName */}
                                <form.Field
                                    name="firstName"
                                    validators={{
                                        onChange: addAdminSchema.shape.firstName,
                                        onBlur: addAdminSchema.shape.firstName,
                                        onChangeAsyncDebounceMs: 500
                                    }}
                                    children={(field) => (
                                        <div className="space-y-1.5">
                                            <FormInput
                                                label="First Name"
                                                field={field}
                                                placeholder="e.g. John"
                                                type="text"
                                                required
                                            />
                                        </div>
                                    )}
                                />

                                {/* LastName */}
                                <form.Field
                                    name="lastName"
                                    validators={{
                                        onChange: addAdminSchema.shape.lastName,
                                        onBlur: addAdminSchema.shape.lastName,
                                        onChangeAsyncDebounceMs: 500
                                    }}
                                    children={(field) => (
                                        <div className="space-y-1.5">
                                            <FormInput
                                                label="Last Name"
                                                field={field}
                                                placeholder="e.g. Doe"
                                                type="text"
                                                required
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Email */}
                            <form.Field
                                name="email"
                                validators={{
                                    onChange: addAdminSchema.shape.email,
                                    onBlur: addAdminSchema.shape.email,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => (
                                    <div className="space-y-1.5">
                                        <FormInput
                                            label="Email Address"
                                            field={field}
                                            placeholder="admin@school.com"
                                            type="email"
                                            required
                                        />
                                    </div>
                                )}
                            />

                            {/* Phone */}
                            <form.Field
                                name="phone"
                                validators={{
                                    onChange: addAdminSchema.shape.phone,
                                    onBlur: addAdminSchema.shape.phone,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => (
                                    <div className="space-y-1.5">
                                        <FormInput
                                            label="Phone Number"
                                            field={field}
                                            placeholder="+1 (555) 000-0000"
                                            type="tel"
                                            required
                                        />
                                    </div>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4 pt-1">
                                {/* Gender */}
                                <form.Field
                                    name="gender"
                                    validators={{
                                        onChange: addAdminSchema.shape.gender,
                                        onBlur: addAdminSchema.shape.gender,
                                    }}
                                    children={(field) => (
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[13px] font-medium text-black flex items-center gap-1">
                                                Gender <RequiredBadge />
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                    className="w-full bg-white border border-neutral-200 text-black text-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all appearance-none">
                                                    <option value="" disabled className="text-black/50">Select gender</option>
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black/50">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                            {field.state.meta.errors?.length > 0 && (
                                                <p className="text-xs text-red-500 mt-1 font-medium">
                                                    {field.state.meta.errors[0]?.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />

                                {/* Is Active */}
                                <form.Field
                                    name="isActive"
                                    children={(field) => {
                                        const isActive = field.state.value;
                                        return (
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[13px] font-medium text-black flex items-center gap-1">
                                                    Account Status <RequiredBadge />
                                                </label>
                                                <div className="flex items-center gap-3 h-[42px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => field.handleChange(!isActive)}
                                                        onBlur={field.handleBlur}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-1 ${isActive ? 'bg-black' : 'bg-neutral-300'}`}
                                                    >
                                                        <span className="sr-only">Toggle status</span>
                                                        <span
                                                            aria-hidden="true"
                                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`}
                                                        />
                                                    </button>
                                                    <span className={`text-[13px] font-medium transition-colors ${isActive ? 'text-black' : 'text-black/50'}`}>
                                                        {isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            </div>

                            {/* Password */}
                            <form.Field
                                name="password"
                                validators={{
                                    onChange: addAdminSchema.shape.password,
                                    onBlur: addAdminSchema.shape.password
                                }}
                                children={(field) => (
                                    <div className="flex flex-col gap-1.5 pt-1">
                                        <label className="text-sm font-medium text-black flex items-center gap-1">
                                            Temporary Password <RequiredBadge />
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                placeholder="e.g. Secure@Pass123"
                                                className="w-full bg-white border border-neutral-200 text-black text-sm py-2 pl-3 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all placeholder:text-black/40 group-hover:border-black/30"
                                            />
                                            <button
                                                type="button"
                                                onClick={handlePasswordVisibility}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-black/40 hover:text-black transition-colors focus:outline-none"
                                            >
                                                {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                                            </button>
                                        </div>
                                        {field.state.meta.errors?.length > 0 && (
                                            <p className="text-xs text-red-500 mt-1 font-medium">
                                                {field.state.meta.errors[0]?.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            <form.Subscribe
                                selector={(state) => state.errors}
                                children={(errors) => (
                                    errors.length > 0 && (
                                        <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                                            <p className="text-xs font-medium text-red-600">Please fix the errors above before proceeding.</p>
                                        </div>
                                    )
                                )}
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex-none px-6 py-4 flex items-center justify-end gap-3 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-xs font-normal cursor-pointer text-black/70 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 hover:text-black transition-all focus:ring-2 focus:ring-black/10">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-admin-form"
                        disabled={addSchoolAdminMutation.isPending}
                        className="px-5 py-2 text-xs font-normal cursor-pointer text-white bg-black rounded-md hover:bg-black/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 focus:ring-2 focus:ring-black/20 focus:ring-offset-1">
                        {(addSchoolAdminMutation.isPending && !addSchoolAdminMutation.isError) ?
                            <Loader2 size={16} className="animate-spin" /> :
                            <Plus size={16} strokeWidth={2.5} />}
                        {(addSchoolAdminMutation.isPending && !addSchoolAdminMutation.isError) ?
                            'Creating...' :
                            'Create Admin'}
                    </button>
                </div>
            </div>
        </section>
    )
}

export default AddAdminModal