"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getScans = cache(async () => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token");



    if (!token) {
        return [];
    }

    try {
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



        if (scanRes.status === 401) {
            redirect("/login");
        }

        if (!scanRes.ok) {
            console.error("getScans - Failed to fetch reports:", scanRes.status);
            return [];
        }

        const data = await scanRes.json();


        return data.reports || [];
    } catch (error) {
        console.error("getScans - Error fetching reports:", error);
        return [];
    }
});