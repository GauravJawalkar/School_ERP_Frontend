"use client";

import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, Shield, Landmark, Key, Edit2, Check, Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/interceptors/ApiClient";
import { BASE_URL } from "@/constants/constants";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

interface UserProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function UserProfileDrawer({ isOpen, onClose, user }: UserProfileDrawerProps) {
    const { setUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const canEdit = user?.permissions?.includes("user.update") || false;

    // Form states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("MALE");

    // Populate form on open or when user changes
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setGender(user.gender || "MALE");
        }
    }, [user, isOpen]);

    // Mutation: Update Profile
    const updateProfileMutation = useMutation({
        mutationFn: async (payload: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            gender: string;
        }) => {
            const response = await ApiClient.patch(`${BASE_URL}/auth/updateProfile`, payload);
            return response.data;
        },
        onSuccess: (res) => {
            toast.success("Profile updated successfully!");

            // Sync local storage / state store
            setUser({
                ...user,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                phone: res.data.phone,
                gender: res.data.gender
            });

            setIsEditing(false);
        },
        onError: (err: any) => {
            const msg = err?.response?.data?.message || "Failed to update profile details.";
            toast.error(msg);
        }
    });

    if (!isOpen || !user) return null;

    // Helper to format role names
    function formatRole(role?: string) {
        return role
            ?.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validations
        if ([firstName, lastName, email, phone].some(field => !field.trim())) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (phone.length !== 10 || isNaN(Number(phone))) {
            toast.error("Phone number must be exactly 10 digits.");
            return;
        }

        updateProfileMutation.mutate({
            firstName,
            lastName,
            email,
            phone,
            gender
        });
    };

    return (
        <div className="fixed inset-0 z-100 flex justify-end">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/35 backdrop-blur-xs transition-opacity duration-300"
            />

            {/* Slide-over Content */}
            <form
                onSubmit={handleSave}
                className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in border-l border-light-border"
            >
                {/* Header */}
                <div className="p-5 border-b border-light-border flex items-center justify-between bg-neutral-50">
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="p-1.5 rounded-lg hover:bg-neutral-200 transition text-black/60 hover:text-black cursor-pointer mr-1"
                            >
                                <ArrowLeft size={16} />
                            </button>
                        ) : (
                            <div className="p-2 rounded-lg bg-black text-white">
                                <User size={16} />
                            </div>
                        )}
                        <div>
                            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
                                {isEditing ? "Edit Credentials" : "Account Profile"}
                            </h2>
                            <p className="text-[10px] text-black/45 font-medium mt-0.5">
                                {isEditing ? "Modify your login details and contact info" : "Personal dashboard credentials and roles"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 transition text-black/50 hover:text-black cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Profile Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* User Card (Only show in read mode) */}
                    {!isEditing && (
                        <div className="flex flex-col items-center text-center p-6 bg-neutral-50 rounded-xl border border-light-border relative overflow-hidden">
                            <div className="w-16 h-16 rounded-full bg-black text-white font-bold text-lg flex items-center justify-center border border-light-border shadow-xs mb-3">
                                {user?.firstName?.[0] || ""}{user?.lastName?.[0] || ""}
                            </div>
                            <h3 className="font-bold text-base text-black">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <p className="text-xs text-black/45 font-medium mt-0.5">{user?.email}</p>

                            {/* Role Badge */}
                            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                                <Shield size={10} />
                                {user?.roles?.[0] ? formatRole(user.roles[0]) : "User"}
                            </div>
                        </div>
                    )}

                    {/* Edit Form Fields */}
                    {isEditing ? (
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-black/45 uppercase tracking-widest border-b border-light-border pb-1.5">
                                Personal Details
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-black/50 uppercase">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white font-semibold"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-black/50 uppercase">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white font-semibold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black/50 uppercase">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white font-semibold"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black/50 uppercase">Phone Number</label>
                                <input
                                    type="text"
                                    maxLength={10}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white font-semibold font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-black/50 uppercase">Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full border border-input-border text-xs px-3 py-2 outline-none rounded-lg focus:ring-2 focus:ring-black/10 bg-white font-semibold cursor-pointer"
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        /* Read Only Details */
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-light-border pb-1.5">
                                <h4 className="text-[10px] font-bold text-black/45 uppercase tracking-widest">
                                    Contact Information
                                </h4>
                                {canEdit && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="text-[11px] font-medium text-black hover:opacity-70 flex items-center gap-1 cursor-pointer"
                                    >
                                        <Edit2 size={10} />
                                        Modify Profile
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-xs">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50 border border-light-border/60">
                                    <span className="text-black/50 flex items-center gap-1.5 font-medium">
                                        <Mail size={12} className="text-black/40" />
                                        Email Address
                                    </span>
                                    <span className="font-medium text-black">{user?.email || "N/A"}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50 border border-light-border/60">
                                    <span className="text-black/50 flex items-center gap-1.5 font-medium">
                                        <Phone size={12} className="text-black/40" />
                                        Phone Number
                                    </span>
                                    <span className="font-medium text-black">{user?.phone || "N/A"}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50 border border-light-border/60">
                                    <span className="text-black/50 flex items-center gap-1.5 font-medium">
                                        <User size={12} className="text-black/40" />
                                        Gender Profile
                                    </span>
                                    <span className="font-medium text-black capitalize">{user?.gender?.toLowerCase() || "N/A"}</span>
                                </div>
                            </div>

                            {!canEdit && (
                                <div className="p-3.5 bg-neutral-50/80 border border-light-border rounded-xl flex items-start gap-2.5">
                                    <ShieldAlert size={14} className="text-black/60 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-black uppercase tracking-wider">Read-Only Account</p>
                                        <p className="text-[10px] text-black/45 mt-0.5 leading-relaxed">Self-service updates are restricted. Please contact your school administrator to modify email or contact credentials.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Organization Scope (Only in Read mode) */}
                    {!isEditing && user?.instituteDetails && (
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-black/45 uppercase tracking-widest border-b border-light-border pb-1.5">
                                Institutional Scope
                            </h4>

                            <div className="p-4 rounded-lg bg-neutral-50/50 border border-light-border/60 space-y-3">
                                <div className="flex items-center gap-2 text-xs">
                                    <Landmark size={14} className="text-black/60 shrink-0" />
                                    <div>
                                        <p className="font-bold text-black">{user?.instituteDetails?.schoolName}</p>
                                        <p className="text-[10px] text-black/40 mt-0.5">Affiliation: {user?.instituteDetails?.affiliationNumber || "State/Local Registry"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Permissions (Only in Read mode) */}
                    {!isEditing && user?.permissions && user.permissions.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-black/45 uppercase tracking-widest border-b border-light-border pb-1.5 flex items-center gap-1">
                                <Key size={12} className="text-black/40" />
                                Granted Access Scope ({user.permissions.length})
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {user.permissions.map((perm: string) => (
                                    <span
                                        key={perm}
                                        className="text-[9px] font-bold text-black/75 bg-neutral-100 border border-light-border px-2 py-0.5 rounded-sm uppercase tracking-wide"
                                    >
                                        {perm.replace(/\./g, " / ")}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer action buttons in Edit Mode */}
                {isEditing && (
                    <div className="p-4 border-t border-light-border bg-neutral-50 flex items-center justify-end gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="h-8 px-4 rounded-lg border border-light-border bg-white hover:bg-neutral-100 font-bold text-xs text-black transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="h-8 px-4 rounded-lg bg-black text-white hover:bg-black/90 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {updateProfileMutation.isPending ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check size={12} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
