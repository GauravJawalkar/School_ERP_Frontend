import { ChevronLeft, Mailbox, MailQuestionMark } from 'lucide-react'
import Link from 'next/link'

const page = () => {
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='mx-auto py-5 px-10 border border-light-border rounded-xl '>
                <div className='w-full flex flex-col items-center justify-center gap-6'>
                    <div className=''>
                        {/* Illustration */}
                        <MailQuestionMark height={160} width={160} strokeWidth={1.2} className='text-neutral-700' />
                    </div>
                    <div className='space-y-2 text-center'>
                        <h1 className='text-2xl font-bold text-center tracking-wide'>Forgot your password ?</h1>
                        <p className='text-[13px] text-neutral-600'>Enter your registered email so we can send you an otp for verification</p>
                    </div>
                    <div className='w-full mx-auto'>
                        <form className='py-2 mx-auto'>
                            <div className="flex flex-col gap-1 mb-4 ">
                                <label className="text-sm">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50 " />
                            </div>
                            <button type="submit" className="w-full cursor-pointer bg-black text-white text-sm p-2 rounded-md hover:bg-black/80 transition-all ease-linear font-normal focus:ring-2 focus:ring-neutral-400/50">
                                Send OTP
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