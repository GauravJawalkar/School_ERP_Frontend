
import { Infinity } from "lucide-react"
import Link from "next/link"

const LoginPage = () => {
    return (
        <section className="min-h-screen flex items-center justify-center antialiased flex-col max-w-5xl mx-auto">
            <div className="grid grid-cols-2 gap-5 w-full rounded-xl border border-neutral-300  ">
                <div className="bg-neutral-100 rounded-tl-xl rounded-bl-xl p-5 h-auto justify-between flex flex-col">
                    <div className="flex items-center justify-start gap-2">
                        <Infinity height={35} width={35} />
                        <h1 className="font-medium">School ERP</h1>
                    </div>
                    <div>
                        <q> For accessing the school ERP software login here with your registered email id </q>
                    </div>
                </div>
                <div className="flex justify-center mx-auto flex-col gap-2 w-full p-5 py-20">
                    <div className="text-center space-y-2">
                        <h1 className="text-xl font-semibold">
                            Login Into School_ERP
                        </h1>
                    </div>
                    <div className="mx-auto w-[80%] py-5">
                        <form action="">
                            <div className="flex flex-col gap-1 mb-4">
                                <label className="text-sm">Email</label>
                                <input
                                    type="email"
                                    name=""
                                    id=""
                                    placeholder="name@example.com"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50" />
                            </div>
                            <div className="flex flex-col gap-1 mb-4">
                                <label className="text-sm">Password</label>
                                <input
                                    type="password"
                                    name=""
                                    id=""
                                    placeholder="example@Pas***rd"
                                    className="border border-input-border text-sm p-2 outline-none rounded-md font-medium focus:shadow focus:ring-2 focus:ring-neutral-400/50" />
                            </div>
                            <div>
                                <button className="text-sm text-neutral-500 hover:underline underline-offset-2 outline-none focus:underline">Forgot Password?</button>
                            </div>
                            <div className="mt-5">
                                <button className="w-full cursor-pointer bg-black text-white text-sm p-2 rounded-md hover:bg-black/80 transition-all ease-linear font-normal focus:ring-2 focus:ring-neutral-400/50">
                                    Sign In with Email
                                </button>
                            </div>
                        </form>
                        {/* Continue with google section */}
                        <div className="w-full">
                            <div className="relative flex items-center my-4">
                                <div className="grow border-t border-gray-300"></div>
                                <span className="shrink mx-4 text-gray-500 text-sm">
                                    or continue with
                                </span>
                                <div className="grow border-t border-gray-300"></div>
                            </div>
                            <div>
                                <button className="w-full cursor-pointer flex items-center justify-center gap-4 border border-gray-300 p-2 rounded-md hover:bg-neutral-100 transition-all ease-linear text-sm font-medium focus:ring-2 focus:ring-neutral-400/50">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </button>
                            </div>
                            <div className="text-center mt-5">
                                <p className="text-xs text-neutral-500">By clicking continue, you agree to our <Link href="/terms" className="underline underline-offset-3 hover:text-black cursor-pointer">Terms of Service</Link> and <Link href="/policy" className="underline underline-offset-3 hover:text-black cursor-pointer">Privacy Policy</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginPage