import { ReactNode } from "react";
import ProtectedLayoutClient from "../components/ProtectedLayoutClient";
import { getScans } from "../lib/getScans";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
    children,
}: {
    children: ReactNode;
}) {



    // Check if token exists
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    


    if (!token) {
        redirect("/login");
    }

    const scans = await getScans();
    


    return <ProtectedLayoutClient scans={scans}>{children}</ProtectedLayoutClient>;

}
