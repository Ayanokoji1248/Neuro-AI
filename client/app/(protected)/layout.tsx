import { ReactNode } from "react";
import ProtectedLayoutClient from "../components/ProtectedLayoutClient";
import { cookies } from "next/headers";

export default async function ProtectedLayout({
    children,
}: {
    children: ReactNode;
}) {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    const scanRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/my`, {
        method: "GET",
        headers: {
            Cookie: `token=${token?.value}`
        },
        cache: "no-store"
    })

    const scans = (await scanRes.json()).reports;

    return <ProtectedLayoutClient scans={scans}>{children}</ProtectedLayoutClient>;

}
