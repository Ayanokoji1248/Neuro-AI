"use client";

import { Loader2, Mail, Shield, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../interface";
import { updateProfileSchema } from "../validations/profile";

type ProfileModalProps = {
    user: UserProfile;
    setOpen: (value: boolean) => void;
    onProfileUpdated: (user: UserProfile) => void;
};

const ProfileModal = ({ user, setOpen, onProfileUpdated }: ProfileModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        fullName: user.fullName,
        email: user.email,
    });

    useEffect(() => {
        setFormData({
            fullName: user.fullName,
            email: user.email,
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => {
            const nextErrors = { ...prev };
            delete nextErrors[name];
            return nextErrors;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const result = updateProfileSchema.safeParse(formData);

        if (!result.success) {
            const nextErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const path = issue.path[0];

                if (typeof path === "string") {
                    nextErrors[path] = issue.message;
                }
            });

            setErrors(nextErrors);
            toast.error("Please fix the highlighted fields");
            return;
        }

        try {
            setIsLoading(true);

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(result.data),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data?.errors && typeof data.errors === "object") {
                    const nextErrors: Record<string, string> = {};

                    Object.entries(data.errors).forEach(([key, value]) => {
                        if (Array.isArray(value) && typeof value[0] === "string") {
                            nextErrors[key] = value[0];
                        }
                    });

                    setErrors(nextErrors);
                }

                throw new Error(data?.message || "Failed to update profile");
            }

            onProfileUpdated({
                fullName: data.user.fullName,
                email: data.user.email,
                role: data.user.role,
            });

            toast.success("Profile updated successfully");
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="relative bg-linear-to-br from-slate-900 via-slate-800 to-indigo-700 px-8 py-6">
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute right-4 top-4 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl font-black uppercase text-white backdrop-blur-sm">
                            {user.fullName
                                .split(" ")
                                .map((part) => part[0] ?? "")
                                .join("")
                                .slice(0, 2)}
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-white">Your Profile</h2>
                            <p className="mt-1 text-sm font-medium text-indigo-100">
                                Review and update your account details
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-8">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                            Current Access
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Shield className="h-4 w-4 text-indigo-500" />
                            <span>{user.role.replace(/\b\w/g, (char) => char.toUpperCase())}</span>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full rounded-xl border bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 ${
                                    errors.fullName
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                                }`}
                                placeholder="Enter your full name"
                            />
                        </div>
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full rounded-xl border bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 ${
                                    errors.email
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                                }`}
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-black text-slate-600 transition-colors hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
