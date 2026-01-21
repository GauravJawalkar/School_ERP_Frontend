import { Infinity } from "lucide-react"

const LoginPage = () => {
    return (
        <section className="min-h-screen flex items-center justify-center antialiased flex-col max-w-5xl mx-auto">
            <div className="grid grid-cols-2 gap-5 w-full rounded-xl border border-neutral-300  ">
                <div className="bg-neutral-100 rounded-tl-xl rounded-bl-xl p-5 h-75 justify-between flex flex-col">
                    <div className="flex items-center justify-start gap-2">
                        <Infinity height={35} width={35} />
                        <h1 className="font-medium">School ERP</h1>
                    </div>
                    <div>
                        <q> This is a school ERP software login here with your registered email id </q>
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-semibold">
                        Login Into School_ERP
                    </h1>
                </div>
            </div>
        </section>
    )
}

export default LoginPage