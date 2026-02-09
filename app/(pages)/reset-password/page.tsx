"use client"

import { BASE_URL } from '@/constants/constants';
import ApiClient from '@/interceptors/ApiClient';
import { useAuthStore } from '@/store/authStore'
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft, Eye, EyeOff, Loader2, TimerReset } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const page = () => {
    const { resetPasswordEmail, setResetPasswordEmail } = useAuthStore();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)

    async function resetPassword({ otp, newPassword }: { otp: string, newPassword: string }) {
        const response = await ApiClient.post(`${BASE_URL}/auth/resetPassword`, { email: resetPasswordEmail, otp, newPassword });
        return response.data;
    }

    const resetPasswordMutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            toast.success(data?.message || "Password reseted ! Login Again");
            setResetPasswordEmail("");
            router.push('/login');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const otp = formData.get('otp') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword.trim() !== confirmPassword.trim()) {
            return toast.error("Please confirm your password is correct");
        }

        resetPasswordMutation.mutate({ otp, newPassword });

    }

    const handlePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }

    const handleConfirmedPasswordVisibility = () => {
        setShowConfirmedPassword((prev) => !prev);
    }

    useEffect(() => {
        if (!resetPasswordEmail) router.replace('/forgot-password')
    }, [resetPasswordEmail, router]);

    return (
        <div className='items-center flex justify-center h-screen'>
            <div className='mx-auto py-5 px-10 border border-light-border rounded-xl '>
                <div className='w-sm flex flex-col items-center justify-center gap-6'>
                    <div className=''>
                        {/* Illustration */}
                        <TimerReset height={100} width={100} className='text-neutral-700' />
                    </div>
                    <div className='space-y-2 text-center'>
                        <h1 className='text-2xl font-bold text-center'>Reset Password !</h1>
                        <p className='text-[13px] text-neutral-600'>Enter your otp and new password to reset for <strong>{resetPasswordEmail}</strong> </p>
                    </div>
                    <div className='w-full mx-auto'>
                        <form onSubmit={handleSubmit} className='py-2 mx-auto space-y-4'>
                            <div className="flex flex-col gap-1 ">
                                <label className="text-sm">OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    id=""
                                    inputMode='numeric'
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    onChange={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                                    placeholder="6 digit OTP"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 appearance-none" />
                            </div>
                            <div className="flex flex-col gap-1 ">
                                <label className="text-sm">New Password</label>
                                <div className='relative'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="newPassword"
                                        id=""
                                        placeholder="Pas***rd"
                                        className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 w-full" />
                                    <button type="button" onClick={handlePasswordVisibility} className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-3">
                                        {
                                            showPassword ?
                                                <Eye height={20} width={20} /> :
                                                <EyeOff height={20} width={20} />
                                        }
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 ">
                                <label className="text-sm">Confirm Password</label>
                                <div className='relative'>
                                    <input
                                        type={showConfirmedPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        id=""
                                        placeholder="Pas***rd"
                                        className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 w-full" />
                                    <button type="button" onClick={handleConfirmedPasswordVisibility} className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-3">
                                        {
                                            showConfirmedPassword ?
                                                <Eye height={20} width={20} /> :
                                                <EyeOff height={20} width={20} />
                                        }
                                    </button>
                                </div>
                            </div>
                            <button
                                disabled={resetPasswordMutation.isPending}
                                type="submit"
                                className="w-full cursor-pointer bg-black text-white text-sm p-2 rounded-md hover:bg-black/80 transition-all ease-linear font-normal focus:ring-2 focus:ring-neutral-400/50 flex items-center justify-center disabled:bg-black/50 disabled:cursor-not-allowed">
                                {
                                    (resetPasswordMutation.isPending && !resetPasswordMutation.isError)
                                        ? <Loader2 className='animate-spin' /> : "Reset Password"
                                }
                            </button>
                        </form>
                        <div className='w-full flex items-center justify-center '>
                            <Link href="/login" className='flex items-center justify-center gap-1 my-5 w-fit text-sm text-neutral-600 hover:text-black hover:underline underline-offset-3'>
                                <ChevronLeft /> Back To Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page