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
import { Eye, EyeOff, Loader2, PlusIcon, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface School {
    schoolName: string;
    schoolId: number;
    schoolEmail: string;
}

const AddAdminModal = ({ isOpen, school, onClose }: { isOpen: boolean, school: School, onClose: () => void }) => {
    console.log("🚀 ~ AddAdminModal ~ school:", school)
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
            console.log("submitted value:", value);
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
        console.log("🚀 ~ addSchoolAdmin ~ data:", data)
        const response = await ApiClient.post(`${BASE_URL}/institute/createSchoolAdmin`, data);
        return response.data.data;
    }

    const addSchoolAdminMutation = useMutation({
        mutationFn: addSchoolAdmin,
        onSuccess: () => {
            toast.success("Admin Added!");
            queryClient.invalidateQueries({ queryKey: ['getSchoolAdmis'] })
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
        <section className="inset-0 absolute flex items-center justify-center z-50 bg-black/50">
            <div className="p-4 bg-white rounded-lg w-md border border-light-border overflow-y-auto slim-scrollbar">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-lg font-semibold">Add Admin</h1>
                        <p className="text-xs text-black/50">Enter admin details for : <b>{school.schoolName}</b>.</p>
                    </div>
                    <button type="button" onClick={() => onClose()}>
                        <X size={17} className="cursor-pointer" />
                    </button>
                </div>
                <div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}>
                        <div className="space-y-4">
                            {/* FirstName */}
                            <form.Field
                                name="firstName"
                                validators={{
                                    onChange: addAdminSchema.shape.firstName,
                                    onBlur: addAdminSchema.shape.firstName,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <FormInput
                                            label="First Name"
                                            field={field}
                                            placeholder="Enter first name"
                                            type="text"
                                            required
                                        />
                                    )
                                }}
                            />

                            {/* LastName */}
                            <form.Field
                                name="lastName"
                                validators={{
                                    onChange: addAdminSchema.shape.lastName,
                                    onBlur: addAdminSchema.shape.lastName,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <FormInput
                                            label="Last Name"
                                            field={field}
                                            placeholder="Enter last name"
                                            type="text"
                                            required
                                        />
                                    )
                                }}
                            />

                            {/* Email */}
                            <form.Field
                                name="email"
                                validators={{
                                    onChange: addAdminSchema.shape.email,
                                    onBlur: addAdminSchema.shape.email,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <FormInput
                                            label="Email"
                                            field={field}
                                            placeholder="eg.adminName@gmail.com"
                                            type="email"
                                            required
                                        />
                                    )
                                }}
                            />

                            {/* phone */}
                            <form.Field
                                name="phone"
                                validators={{
                                    onChange: addAdminSchema.shape.phone,
                                    onBlur: addAdminSchema.shape.phone,
                                    onChangeAsyncDebounceMs: 500
                                }}
                                children={(field) => {
                                    return (
                                        <FormInput
                                            label="Phone"
                                            field={field}
                                            placeholder="eg.9246578901"
                                            type="tel"
                                            required
                                        />
                                    )
                                }}
                            />

                            <div className="grid grid-cols-2 place-items-center gap-4">
                                {/* Gender */}
                                <form.Field
                                    name="gender"
                                    validators={{
                                        onChange: addAdminSchema.shape.gender,
                                        onBlur: addAdminSchema.shape.gender,
                                    }}
                                    children={(field) => {
                                        return (
                                            <div className="flex flex-col w-full gap-1">
                                                <label className="text-sm">Gender <RequiredBadge /></label>
                                                <select
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-normal focus:shadow focus:ring-2 focus:ring-neutral-400/50">
                                                    <option value="">Select gender</option>
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                                {field.state.meta.errors?.length > 0 && (
                                                    <p className="text-xs text-red-500 mt-0.5">
                                                        {field.state.meta.errors[0]?.message}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    }}
                                />

                                {/* Is Active */}
                                <form.Field
                                    name="isActive"
                                    children={(field) => {
                                        const isActive = field.state.value;
                                        return (
                                            <div className="flex flex-col w-full gap-1">
                                                <label className="text-sm">Status <RequiredBadge /> </label>
                                                {/* Toggle */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => field.handleChange(!isActive)}
                                                        onBlur={field.handleBlur}
                                                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isActive ? 'bg-black' : 'bg-gray-300'}`}>
                                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                                                    </button>
                                                    {/* Label */}
                                                    <span className="text-sm font-medium">
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
                                children={(field) => {
                                    return (
                                        <div className="flex flex-col gap-1 mb-4">
                                            <label className="text-sm">Password <RequiredBadge /></label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    onBlur={field.handleBlur}
                                                    placeholder="example@Pas***rd"
                                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 w-full" />
                                                <button
                                                    type="button"
                                                    onClick={handlePasswordVisibility}
                                                    className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-3">
                                                    {
                                                        showPassword ?
                                                            <Eye height={20} width={20} /> :
                                                            <EyeOff height={20} width={20} />
                                                    }
                                                </button>
                                            </div>
                                            {field.state.meta.errors?.length > 0 && (
                                                <p className="text-xs text-red-500 mt-0.5">
                                                    {field.state.meta.errors[0]?.message}
                                                </p>
                                            )}
                                        </div>
                                    )
                                }}
                            />
                            <form.Subscribe
                                selector={(state) => state.errors}
                                children={(errors) => (
                                    errors.length > 0 && (
                                        <p className="text-xs text-red-500">{JSON.stringify(errors)}</p>
                                    )
                                )}
                            />
                            <button
                                type="submit"
                                disabled={addSchoolAdminMutation.isPending}
                                title="Add New School Admin"
                                className="w-full cursor-pointer disabled:cursor-not-allowed bg-black text-white text-sm py-2 px-4 rounded-md hover:bg-black/80 transition-all ease-linear font-normal focus:ring-2 focus:ring-neutral-400/50 inline-flex items-center justify-center gap-2">
                                {(addSchoolAdminMutation.isPending && !addSchoolAdminMutation.isError) ?
                                    <Loader2 size={17} className="animate-spin" /> :
                                    <PlusIcon size={17} />}
                                {(addSchoolAdminMutation.isPending && !addSchoolAdminMutation.isError) ?
                                    'Adding...' :
                                    'Add Admin'}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </section >
    )
}

export default AddAdminModal