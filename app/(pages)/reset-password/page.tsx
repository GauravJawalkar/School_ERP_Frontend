"use client"

import { useAuthStore } from '@/store/authStore'
import { ChevronLeft, Loader2, MessageCircleQuestionMark, TimerReset } from 'lucide-react';
import Link from 'next/link';

const page = () => {
    const { resetPasswordEmail } = useAuthStore();

    const handleSubmit = () => {

    }
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='mx-auto py-5 px-10 border border-light-border rounded-xl '>
                <div className='w-md flex flex-col items-center justify-center gap-6'>
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
                                    inputMode='numeric'
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    name="otp"
                                    onChange={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                                    id=""
                                    placeholder="6 digit OTP"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 appearance-none" />
                            </div>
                            <div className="flex flex-col gap-1 ">
                                <label className="text-sm">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id=""
                                    placeholder="Pas***rd"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 " />
                            </div>
                            <div className="flex flex-col gap-1 ">
                                <label className="text-sm">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id=""
                                    placeholder="Pas***rd"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 " />
                            </div>
                            <button type="submit" className="w-full cursor-pointer bg-black text-white text-sm p-2 rounded-md hover:bg-black/80 transition-all ease-linear font-normal focus:ring-2 focus:ring-neutral-400/50 flex items-center justify-center disabled:bg-black/50 disabled:cursor-not-allowed">
                                Reset Password
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