"use client"

import { useEffect, useMemo, useState } from "react";

type User = {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
};

const roles = ["all", "admin", "doctor", "radiologist", "patient"] as const;

type Role = (typeof roles)[number];

import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [roleFilter, setRoleFilter] = useState<Role>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async (role: Role) => {
        setIsLoading(true);
        setError(null);
        try {
            const query = role === "all" ? "" : `?role=${role}`;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/users${query}`,
                {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body?.message || "Failed to load users");
            }

            const data = await res.json();
            setUsers(data.users ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(roleFilter);
    }, [roleFilter]);

    const filteredUsers = useMemo(() => {
        if (roleFilter === "all") return users;
        return users.filter((u) => u.role === roleFilter);
    }, [users, roleFilter]);

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
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen font-sans">
            {/* Page Header */}
            <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                        Team Members
                    </h1>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
                        Manage your team members, view their account permissions, and track when they joined.
                    </p>
                </div>
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:text-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                {/* Table Toolbar */}
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <label htmlFor="role-filter" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                            Filter by role:
                        </label>
                        <div className="relative">
                            <select
                                id="role-filter"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value as Role)}
                                className="appearance-none rounded-lg border border-slate-300 bg-white pl-4 pr-10 py-2 text-sm text-slate-700 shadow-sm hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer min-w-[140px]"
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => fetchUsers(roleFilter)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Joined Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-14 text-center">
                                        <svg className="animate-spin mx-auto h-8 w-8 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="text-sm font-medium text-slate-600">Loading team members...</p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-red-600 bg-red-50/50">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-8 h-8 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {error}
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-14 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-900">No users found</h3>
                                            <p className="mt-1 text-sm text-slate-500">Try adjusting your role filter or refresh the list.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/80 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0 shadow-inner">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="text-sm font-semibold text-slate-900">{user.fullName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold border ${user.role === "admin"
                                                        ? "bg-purple-50 text-purple-700 border-purple-200/80"
                                                        : user.role === "doctor"
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                                            : user.role === "radiologist"
                                                                ? "bg-blue-50 text-blue-700 border-blue-200/80"
                                                                : "bg-slate-50 text-slate-700 border-slate-200"
                                                    }`}
                                            >
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <footer className="mt-6 flex items-center justify-between text-xs text-slate-500">
                <p>Displays all registered users currently in the database.</p>
                <p>Admin privileges required.</p>
            </footer>
        </div>
    );
}
