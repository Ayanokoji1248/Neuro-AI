"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getScans = cache(async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    console.log("getScans - Token from cookies:", token ? "exists" : "missing");

    if (!token) {
        console.log("getScans - No token, returning empty array");
        return [];
    }

    try {
        console.log("getScans - Fetching reports from backend");
        const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
        const scanRes = await fetch(
            `${backendUrl}/reports/my`,
            {
                method: "GET",
                headers: {
                    Cookie: `token=${token.value}`,
                },
                cache: "no-store",
            }
        );

        console.log("getScans - Response status:", scanRes.status);

        if (scanRes.status === 401) {
            console.log("getScans - Unauthorized, redirecting to login");
            redirect("/login");
        }

        if (!scanRes.ok) {
            console.error("getScans - Failed to fetch reports:", scanRes.status);
            return [];
        }

        const data = await scanRes.json();
        console.log("getScans - Successfully fetched", data.reports?.length || 0, "reports");

        return data.reports || [];
    } catch (error) {
        console.error("getScans - Error fetching reports:", error);
        return [];
    }
});