// lib/getReports.ts
"use server"
import { cache } from 'react';
import { cookies } from 'next/headers';

export const getScans = cache(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const scanRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/my`, {
        method: "GET",
        headers: {
            Cookie: `token=${token?.value}`
        },
        cache: "no-store"
    });

    const data = await scanRes.json();
    return data.reports;
});