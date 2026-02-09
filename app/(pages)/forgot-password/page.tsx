"use client"
import { BASE_URL } from '@/constants/constants';
import ApiClient from '@/interceptors/ApiClient';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft, Loader2, MessageCircleQuestionMark } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'

const page = () => {
    const { setResetPasswordEmail } = useAuthStore();
    const router = useRouter();
    async function forgotPassword({ email }: { email: string }) {
        const res = await ApiClient.post(`${BASE_URL}/auth/forgotPassword`, { email });
        const response = { ...res.data, email }
        return response;
    }

    const forgotPasswordMutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            toast.success(data.message);
            setResetPasswordEmail(data?.email);
            router.push('/reset-password');
        },
        onError: (error: any) => {
            console.log("Forgot Password Error", error);
            if (error?.response?.data?.status === 409) {
                router.push('/reset-password');
                return toast.error(error?.response?.data?.message || "Something went wrong");
            }
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        if (email.trim() === "" || !email.includes("@")) {
            return toast.error("Please enter a valid email");
        }

        forgotPasswordMutation.mutate({ email });
    }

    return (
        <>
            <div className='flex items-center justify-center h-screen'>
                <div className='mx-auto py-5 px-10 border border-light-border rounded-xl '>
                    <div className='w-sm flex flex-col items-center justify-center gap-6'>
                        <div className=''>
                            {/* Illustration */}
                            <MessageCircleQuestionMark height={100} width={100} className='text-neutral-700' />
                        </div>
                        <div className='space-y-2 text-center'>
                            <h1 className='text-2xl font-bold text-center'>Forgot your password ?</h1>
                            <p className='text-[13px] text-neutral-600'>Enter your registered email so we can send you an otp for verification</p>
                        </div>
                        <div className='w-full mx-auto'>
                            <form onSubmit={handleSubmit} className='py-2 mx-auto'>
                                <div className="flex flex-col gap-1 mb-4 ">
                                    <label className="text-sm">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 " />
                                </div>
                                <button disabled={forgotPasswordMutation.isPending} type="submit" className="w-full cursor-pointer bg-black text-white text-sm p-2 rounded-md hover:bg-black/80 transition-all ease-linear font-normal focus:ring-2 focus:ring-neutral-400/50 flex items-center justify-center disabled:bg-black/50 disabled:cursor-not-allowed">
                                    {
                                        (forgotPasswordMutation.isPending && !forgotPasswordMutation.isError)
                                            ? <Loader2 className='animate-spin' /> : "Send OTP"
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
        </>
    )
}

export default page