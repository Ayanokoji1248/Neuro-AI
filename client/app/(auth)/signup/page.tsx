import Link from 'next/link'
import { Brain } from "lucide-react"
import SignUpForm from '@/app/components/SignUpForm'

const SignUpPage = () => {
    return (
        <>
            {/* Mobile Background Decoration (Visible only on phone/tablet) */}
            <div className="absolute inset-0 lg:hidden pointer-events-none">
                <div className="absolute top-0 w-full h-full bg-linear-to-b from-blue-100/40 to-slate-50"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>


            <div className="w-full max-w-sm bg-white lg:bg-transparent rounded-3xl shadow-xl shadow-blue-900/5 lg:shadow-none p-8 lg:p-0 relative z-10">

                {/* Mobile Logo */}
                <div className="flex items-center space-x-2 mb-6 lg:hidden justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight">NeuroScan<span className="text-blue-600">AI</span></span>
                </div>

                <SignUpForm />

                <p className="mt-6 text-center text-xs font-medium text-gray-500">
                    Already have an account? <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">Sign in</Link>

                </p>
            </div>
        </>
    )
}

export default SignUpPage