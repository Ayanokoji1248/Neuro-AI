"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
};

type ChartDatum = {
    key: string;
    label: string;
    value: number;
    fullDate?: string;
};

type RecentReport = {
    _id: string;
    patientName: string;
    patientGender: string;
    result: string;
    confidence: number | null;
    createdAt: string;
};

type Contributor = {
    _id: string;
    fullName: string;
    role: string;
    reportCount: number;
};

type DashboardPayload = {
    users: User[];
    dashboard: {
        overview: {
            totalUsers: number;
            totalReports: number;
            tumorCases: number;
            pendingReports: number;
            avgConfidence: number;
        };
        userRoles: ChartDatum[];
        reportResults: ChartDatum[];
        genderDistribution: ChartDatum[];
        ageDistribution: ChartDatum[];
        weeklyReports: ChartDatum[];
        monthlySignups: ChartDatum[];
        recentSignups: User[];
        recentReports: RecentReport[];
        topContributors: Contributor[];
    };
};

const roles = ["all", "admin", "doctor", "radiologist", "patient"] as const;
type Role = (typeof roles)[number];

const palette = {
    admin: "#4f46e5",
    doctor: "#2563eb",
    radiologist: "#7c3aed",
    patient: "#0f172a",
    Tumor: "#dc2626",
    "No Tumor": "#16a34a",
    Pending: "#f59e0b",
    Male: "#2563eb",
    Female: "#4f46e5",
    Other: "#8b5cf6",
    neutral: "#94a3b8",
};

const badgeClasses: Record<string, string> = {
    admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
    doctor: "bg-blue-50 text-blue-700 border-blue-200",
    radiologist: "bg-violet-50 text-violet-700 border-violet-200",
    patient: "bg-slate-100 text-slate-700 border-slate-200",
    Tumor: "bg-red-100 text-red-700 border-red-200",
    "No Tumor": "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
};

async function requestDashboardData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/dashboard`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to load admin dashboard");
    }

    return res.json() as Promise<DashboardPayload>;
}

function formatRole(role: string) {
    return role.charAt(0).toUpperCase() + role.slice(1);
}

function buildDonutGradient(items: ChartDatum[]) {
    const total = items.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
        return `conic-gradient(${palette.neutral} 0 100%)`;
    }

    let cursor = 0;

    const stops = items.map((item) => {
        const start = cursor;
        const slice = (item.value / total) * 100;
        cursor += slice;
        const color = palette[item.key as keyof typeof palette] ?? palette.neutral;
        return `${color} ${start}% ${cursor}%`;
    });

    return `conic-gradient(${stops.join(", ")})`;
}

function StatCard({
    label,
    value,
    note,
    accent,
}: {
    label: string;
    value: string;
    note: string;
    accent: string;
}) {
    return (
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: accent }} />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
            <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{note}</p>
        </div>
    );
}

function SectionCard({
    title,
    subtitle,
    className = "",
    children,
}: {
    title: string;
    subtitle: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <section className={`rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>
            {children}
        </section>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
            {message}
        </div>
    );
}

function DonutChart({
    items,
    centerLabel,
    centerValue,
}: {
    items: ChartDatum[];
    centerLabel: string;
    centerValue: string;
}) {
    const total = items.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
            <div
                className="mx-auto flex h-[220px] w-[220px] items-center justify-center rounded-full"
                style={{ background: buildDonutGradient(items) }}
            >
                <div className="flex h-[134px] w-[134px] flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{centerLabel}</span>
                    <span className="mt-2 text-3xl font-black text-slate-900">{centerValue}</span>
                    <span className="mt-1 text-xs text-slate-500">{total} records</span>
                </div>
            </div>

            <div className="space-y-4">
                {items.map((item) => {
                    const percent = total === 0 ? 0 : Math.round((item.value / total) * 100);
                    const color = palette[item.key as keyof typeof palette] ?? palette.neutral;

                    return (
                        <div key={item.key} className="rounded-2xl bg-slate-50/80 p-4">
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900">{item.value}</span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-white">
                                <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                            </div>
                            <p className="mt-2 text-xs text-slate-500">{percent}% share</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function VerticalBars({
    items,
    accent,
}: {
    items: ChartDatum[];
    accent: string;
}) {
    const max = Math.max(...items.map((item) => item.value), 1);

    return (
        <div
            className="grid gap-3 sm:gap-4"
            style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
            {items.map((item) => {
                const height = `${Math.max((item.value / max) * 100, item.value > 0 ? 12 : 4)}%`;

                return (
                    <div key={item.key} className="flex flex-col items-center gap-3">
                        <div className="flex h-44 w-full items-end rounded-[24px] bg-slate-50 px-2 py-3">
                            <div className="w-full rounded-[18px] shadow-[0_10px_30px_-18px_rgba(15,23,42,0.55)]" style={{ height, background: accent }} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-900">{item.value}</p>
                            <p className="text-xs font-medium text-slate-500">{item.label}</p>
                            {item.fullDate ? <p className="mt-1 text-[11px] text-slate-400">{item.fullDate}</p> : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function HorizontalDistribution({
    items,
    usePalette = true,
}: {
    items: ChartDatum[];
    usePalette?: boolean;
}) {
    const total = items.reduce((sum, item) => sum + item.value, 0);
    const max = Math.max(...items.map((item) => item.value), 1);

    return (
        <div className="space-y-4">
            {items.map((item, index) => {
                const percentOfTotal = total === 0 ? 0 : Math.round((item.value / total) * 100);
                const width = Math.round((item.value / max) * 100);
                const fill = usePalette
                    ? palette[item.key as keyof typeof palette] ?? palette.neutral
                    : `linear-gradient(90deg, #0f766e ${20 + index * 8}%, #38bdf8 100%)`;

                return (
                    <div key={item.key} className="rounded-2xl bg-slate-50/80 p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                            <div className="text-right">
                                <span className="block text-sm font-bold text-slate-900">{item.value}</span>
                                <span className="text-xs text-slate-500">{percentOfTotal}%</span>
                            </div>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-white">
                            <div className="h-full rounded-full" style={{ width: `${width}%`, background: fill }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [dashboard, setDashboard] = useState<DashboardPayload["dashboard"] | null>(null);
    const [roleFilter, setRoleFilter] = useState<Role>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await requestDashboardData();
            setUsers(data.users ?? []);
            setDashboard(data.dashboard);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadDashboard = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await requestDashboardData();
                setUsers(data.users ?? []);
                setDashboard(data.dashboard);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };

        void loadDashboard();
    }, []);

    const filteredUsers = useMemo(() => {
        if (roleFilter === "all") return users;
        return users.filter((user) => user.role === roleFilter);
    }, [roleFilter, users]);

    const topRole = useMemo(() => {
        if (!dashboard?.userRoles.length) return null;
        return [...dashboard.userRoles].sort((a, b) => b.value - a.value)[0] ?? null;
    }, [dashboard]);

    const highestAgeGroup = useMemo(() => {
        if (!dashboard?.ageDistribution.length) return null;
        return [...dashboard.ageDistribution].sort((a, b) => b.value - a.value)[0] ?? null;
    }, [dashboard]);

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } finally {
            router.replace("/login");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <header className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
                    <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-indigo-100/70 blur-3xl" />
                    <div className="absolute bottom-0 left-12 h-24 w-24 rounded-full bg-blue-100/80 blur-2xl" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-black uppercase tracking-[0.28em] text-indigo-600">NeuroScan AI Admin</p>
                            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                MRI analytics, users, and platform activity in one place
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                                Track user growth, report outcomes, confidence trends, and patient demographics from one place.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={fetchDashboard}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                                Refresh Dashboard
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="mt-8 rounded-[32px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
                        <p className="mt-5 text-sm font-medium text-slate-600">Loading dashboard analytics...</p>
                    </div>
                ) : error || !dashboard ? (
                    <div className="mt-8 rounded-[32px] border border-red-100 bg-red-50/90 px-6 py-14 text-center shadow-sm">
                        <p className="text-base font-semibold text-red-700">{error ?? "Dashboard data is unavailable."}</p>
                        <button
                            type="button"
                            onClick={fetchDashboard}
                            className="mt-4 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                label="Total users"
                                value={String(dashboard.overview.totalUsers)}
                                note={`${filteredUsers.length} visible in the current filter.`}
                                accent="linear-gradient(90deg, #1e293b 0%, #4f46e5 100%)"
                            />
                            <StatCard
                                label="Reports processed"
                                value={String(dashboard.overview.totalReports)}
                                note={`${dashboard.overview.pendingReports} reports still pending review.`}
                                accent="linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)"
                            />
                            <StatCard
                                label="Tumor detections"
                                value={String(dashboard.overview.tumorCases)}
                                note="Cases currently marked as Tumor by the AI pipeline."
                                accent="linear-gradient(90deg, #991b1b 0%, #ef4444 100%)"
                            />
                            <StatCard
                                label="Average confidence"
                                value={`${dashboard.overview.avgConfidence}%`}
                                note="Calculated from reports with a confidence score."
                                accent="linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)"
                            />
                        </section>

                        <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                            <SectionCard
                                title="User role composition"
                                subtitle={topRole ? `${topRole.label} is currently the largest group.` : "Distribution of registered user roles."}
                            >
                                <DonutChart
                                    items={dashboard.userRoles}
                                    centerLabel="Top role"
                                    centerValue={topRole?.label ?? "N/A"}
                                />
                            </SectionCard>

                            <SectionCard
                                title="Report status breakdown"
                                subtitle="Outcome mix across all stored MRI reports."
                            >
                                <HorizontalDistribution items={dashboard.reportResults} />
                            </SectionCard>
                        </section>

                        <section className="mt-6 grid gap-6 xl:grid-cols-3">
                            <SectionCard
                                title="Weekly scan activity"
                                subtitle="Reports created over the last seven days."
                            >
                                <VerticalBars
                                    items={dashboard.weeklyReports}
                                    accent="linear-gradient(180deg, #2563eb 0%, #4f46e5 100%)"
                                />
                            </SectionCard>

                            <SectionCard
                                title="Monthly user growth"
                                subtitle="New users added in the last six months."
                            >
                                <VerticalBars
                                    items={dashboard.monthlySignups}
                                    accent="linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%)"
                                />
                            </SectionCard>

                            <SectionCard
                                title="Patient gender mix"
                                subtitle="Distribution of report subjects by gender."
                            >
                                <DonutChart
                                    items={dashboard.genderDistribution}
                                    centerLabel="Reports"
                                    centerValue={String(dashboard.overview.totalReports)}
                                />
                            </SectionCard>
                        </section>

                        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
                            <SectionCard
                                title="Age band distribution"
                                subtitle={highestAgeGroup ? `${highestAgeGroup.label} is the most frequent patient age range.` : "Patient ages grouped into reporting bands."}
                            >
                                <HorizontalDistribution items={dashboard.ageDistribution} usePalette={false} />
                            </SectionCard>

                            <SectionCard
                                title="Top report contributors"
                                subtitle="Users who have created the most reports."
                            >
                                {dashboard.topContributors.length === 0 ? (
                                    <EmptyState message="No report contributors yet." />
                                ) : (
                                    <div className="space-y-3">
                                        {dashboard.topContributors.map((user, index) => (
                                            <div key={user._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-100">
                                                        #{index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                                                        <p className="text-xs text-slate-500">{formatRole(user.role)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-slate-900">{user.reportCount}</p>
                                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">reports</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SectionCard>
                        </section>

                        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
                            <SectionCard
                                title="Recent signups"
                                subtitle="Newest accounts added to the platform."
                            >
                                {dashboard.recentSignups.length === 0 ? (
                                    <EmptyState message="No recent signups yet." />
                                ) : (
                                    <div className="space-y-3">
                                        {dashboard.recentSignups.map((user) => (
                                            <div key={user._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-100">
                                                        {user.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                                                        <p className="text-xs text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClasses[user.role] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
                                                        {formatRole(user.role)}
                                                    </span>
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SectionCard>

                            <SectionCard
                                title="Recent MRI reports"
                                subtitle="Latest report records generated in the system."
                            >
                                {dashboard.recentReports.length === 0 ? (
                                    <EmptyState message="No reports available yet." />
                                ) : (
                                    <div className="space-y-3">
                                        {dashboard.recentReports.map((report) => (
                                            <div key={report._id} className="rounded-2xl bg-slate-50 px-4 py-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{report.patientName}</p>
                                                        <p className="mt-1 text-xs text-slate-500">{report.patientGender}</p>
                                                    </div>
                                                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                        Hidden
                                                    </span>
                                                </div>
                                                <div className="mt-4 flex items-end justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Result</p>
                                                        <p className="text-lg font-black text-slate-900">
                                                            Hidden
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(report.createdAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SectionCard>
                        </section>

                        <SectionCard
                            title="User directory"
                            subtitle="Filter the user table without losing the overall dashboard context."
                            className="mt-6"
                        >
                            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-sm font-semibold text-slate-700">Filter by role</span>
                                    <div className="flex flex-wrap gap-2">
                                        {roles.map((role) => {
                                            const isActive = roleFilter === role;
                                            return (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => setRoleFilter(role)}
                                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                        isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                                                    }`}
                                                >
                                                    {role === "all" ? "All roles" : formatRole(role)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    Showing <span className="font-bold text-slate-900">{filteredUsers.length}</span> of{" "}
                                    <span className="font-bold text-slate-900">{users.length}</span> users
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-[28px] border border-slate-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50/90">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">User</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Role</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 bg-white">
                                            {filteredUsers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-16 text-center text-sm text-slate-500">
                                                        No users found for the selected role.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredUsers.map((user) => (
                                                    <tr key={user._id} className="transition hover:bg-slate-50/90">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-sm font-black text-indigo-600">
                                                                    {user.fullName.charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="text-sm font-semibold text-slate-900">{user.fullName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClasses[user.role] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
                                                                {formatRole(user.role)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-500">
                                                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </SectionCard>
                    </>
                )}
            </div>
        </div>
    );
}
