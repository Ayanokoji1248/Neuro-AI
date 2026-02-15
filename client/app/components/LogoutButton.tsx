"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const LogoutButton = () => {

    const router = useRouter()

    const logout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
                method: "POST",
                credentials: "include"
            })

            if (!res.ok) {
                throw new Error("Logged Out failed")
            }

            router.push('/login')
            router.refresh()

        } catch (error) {
            console.log(error)
            toast.error("Logged Out failed")
        }

    }

    return (
        <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 text-slate-400 py-2 font-bold hover:text-red-500 transition-colors"
        >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign out</span>
        </button>
    )
}

export default LogoutButton