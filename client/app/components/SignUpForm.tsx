"use client"

import { Loader, Lock, Mail, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react"
import { toast } from "sonner";

const SignUpForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        setError("")

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ fullName, email, password }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || "SignUp failed")
            }

            toast.success("SignUp Successful")
            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            console.log(error)
            toast.error("SignUp Failed")
            setError(error instanceof Error ? error.message : "Something went wrong")

        } finally {
            setIsLoading(false)
            setFullName("")
            setEmail("")
            setPassword("")
        }
    }

    return (
        <>
            {/* Header */}
            <div className="text-center lg:text-left">
                <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                    Start your journey towards better medical insights.
                </p>
            </div>

            {/* /* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 flex shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Full Name</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            onChange={(e) => setFullName(e.target.value)}
                            value={fullName}
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
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
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
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
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
                    {isLoading ?
                        <Loader />
                        :
                        "Sign Up"
                    }
                </button>
            </form>
        </>
    )
}

export default SignUpForm