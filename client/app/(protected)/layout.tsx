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

    console.log("ProtectedLayout - Starting");

    // Check if token exists
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    
    console.log("ProtectedLayout - Token from cookies:", token ? "exists" : "missing");

    if (!token) {
        console.log("ProtectedLayout - No token found, redirecting to login");
        redirect("/login");
    }

    const scans = await getScans();
    
    console.log("ProtectedLayout - Got scans:", scans?.length || 0);

    return <ProtectedLayoutClient scans={scans}>{children}</ProtectedLayoutClient>;

}
