"use client"

import React, { FormEvent, useState } from "react"
import { Loader, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type LoginFormProps = {
    redirectTo?: string
}

const LoginForm = ({ redirectTo = "/dashboard" }: LoginFormProps) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [loginSessionId, setLoginSessionId] = useState<string | null>(null)
    // derive six individual digits every render (always length 6)
    const otpInputs = Array.from({ length: 6 }, (_, i) => otp[i] || "");
    // stable refs to each input
    const inputRefs = React.useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

    // debug
    // console.log("render, loginSessionId", loginSessionId, "otpInputs", otpInputs, "len", otpInputs.length);
    const [error, setError] = useState("")
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        setError("")

        try {
            if (!loginSessionId) {
                // first step: credentials
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({ email, password }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                const data = await res.json()
                console.log("login response", data)
                if (!res.ok) {
                    throw new Error(data.message || "Login failed")
                }

                if (!data.loginSessionId) {
                    throw new Error("No loginSessionId returned from server")
                }
                // got session id for OTP
                setLoginSessionId(data.loginSessionId)
                toast.success("OTP sent to your email")
                // clear password but keep email in case it's needed
                setPassword("")
            } else {
                // second step: verify OTP
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ loginSessionId, otp })
                })

                const data = await res.json()
                if (!res.ok) {
                    throw new Error(data.message || "OTP verification failed")
                }

                // After login, determine where to redirect based on role
                const meRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
                    method: "GET",
                    credentials: "include",
                })

                const meData = await meRes.json()
                const role = meData?.user?.role

                toast.success("Login successful")

                if (role === "admin") {
                    router.replace("/admin")
                } else {
                    router.replace(redirectTo)
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("Login Failed")
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setIsLoading(false)
            if (!loginSessionId) {
                setEmail("")
                setPassword("")
            } else {
                setOtp("")
            }
        }
    }

    return (
        <>
            {/* Header */}
            <div className="text-center lg:text-left">
                <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                    Please enter your details to sign in.
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
                {!loginSessionId ? (
                    <>
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
                    </>
                ) : (
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 text-center">
                            Enter the 6-digit verification code
                        </label>

                        <div className="flex justify-center gap-3">
                            {otpInputs.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => { inputRefs.current[idx] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                        if (!val) return;

                                        const newOtp = otp.split("");
                                        newOtp[idx] = val;
                                        setOtp(newOtp.join(""));

                                        if (idx < 5) {
                                            inputRefs.current[idx + 1]?.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace") {
                                            const newOtp = otp.split("");
                                            newOtp[idx] = "";
                                            setOtp(newOtp.join(""));

                                            if (idx > 0) {
                                                inputRefs.current[idx - 1]?.focus();
                                            }
                                        }
                                    }}
                                    className="
          w-12 h-14
          text-xl font-semibold text-center
          bg-white
          border border-gray-300
          rounded-xl
          shadow-sm
          transition-all duration-200
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-500/20
          outline-none
        "
                                />
                            ))}
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            Code expires in 5 minutes
                        </p>
                    </div>
                )}

                <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] mt-2 flex items-center justify-center"
                >
                    {isLoading ?
                        <Loader />
                        :
                        loginSessionId ? "Verify OTP" : "Sign In"
                    }
                </button>
            </form>

        </>
    )
}

export default LoginForm