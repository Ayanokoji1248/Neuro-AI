import { ReactNode } from "react";
import ProtectedLayoutClient from "../components/ProtectedLayoutClient";
import { getScans } from "../lib/getScans";

export default async function ProtectedLayout({
    children,
}: {
    children: ReactNode;
}) {

    console.log("ProtectedLayout - Starting");

    const scans = await getScans();
    
    console.log("ProtectedLayout - Got scans:", scans?.length || 0);

    return <ProtectedLayoutClient scans={scans}>{children}</ProtectedLayoutClient>;

}
