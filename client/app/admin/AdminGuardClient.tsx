"use client"

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
    children: ReactNode;
};

export default function AdminGuardClient({ children }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Do not guard the admin login page itself
        if (pathname?.startsWith("/admin/login")) {
            setIsLoading(false);
            return;
        }

        const checkAdmin = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                if (!res.ok) {
                    throw new Error("Not authorized");
                }

                const data = await res.json();
                if (!data.user || data.user.role !== "admin") {
                    throw new Error("Not admin");
                }

                setIsLoading(false);
            } catch {
                router.replace("/login");
            }
        };

        checkAdmin();
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-sm font-semibold text-gray-600">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
