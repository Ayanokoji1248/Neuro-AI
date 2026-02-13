import Link from 'next/link'
import { Brain, Lock, Mail, UserIcon } from "lucide-react"

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

                {/* Header */}
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-gray-500 mb-6 font-medium">
                        Start your journey towards better medical insights.
                    </p>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                required
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 lg:bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="email"
                                required
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 lg:bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="text-xs font-bold text-gray-900">Password</label>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                required
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 lg:bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] mt-2 flex items-center justify-center"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-xs font-medium text-gray-500">
                    Already have an account? <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">Sign in</Link>

                </p>
            </div>
        </>
    )
}

export default SignUpPage