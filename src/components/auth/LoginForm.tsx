"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useStore";
import { usePageLoader } from "@/app/hooks/usePageLoader";
import { getAuthKey, homePathOf, setAuthKey } from "@/app/libs/auth";
import { responseErrorMessage } from "@/app/libs/general";
import { getProfile, loginAdmin, loginStudent } from "@/store/controllers/auth.controller";
import { resetAuthResponse } from "@/store/slices/authSlice";

export default function LoginForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { response } = useAppSelector((state) => state.auth);
    const { isPageLoading, runWithLoader } = usePageLoader();
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    useEffect(() => {
        if (!getAuthKey()) return;
        dispatch(getProfile()).then((profileAction) => {
            if (getProfile.fulfilled.match(profileAction) && profileAction.payload.status === true) {
                router.replace(homePathOf(profileAction.payload.data.role));
            }
        });
    }, [dispatch, router]);

    useEffect(() => {
        if (response.login) {
            const loginResponse = response.login;
            dispatch(resetAuthResponse());

            if (loginResponse.status === true) {
                setAuthKey(loginResponse.data.token);
                router.push(homePathOf(showAdminForm ? "admin" : "siswa"));
            } else {
                Swal.fire({ icon: "error", title: "Gagal Masuk", text: responseErrorMessage(loginResponse) });
            }
        }
    }, [response, dispatch, router, showAdminForm]);

    const handleStudentSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!username.trim() || !password) {
            setError("Username dan Password wajib diisi");
            return;
        }

        runWithLoader(() => dispatch(loginStudent({ username: username.trim(), password })));
    };

    const handleAdminSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!adminUsername.trim() || !adminPassword) {
            setError("Username dan Password wajib diisi");
            return;
        }

        runWithLoader(() => dispatch(loginAdmin({ username: adminUsername.trim(), password: adminPassword })));
    };

    return (
        <div className="w-full max-w-sm">
            {isPageLoading && <Loading />}
            <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                    <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-purple-100 opacity-60" />
                    <img
                        src="/logo-sekolah.png"
                        alt="Logo SMP Muhammadiyah 14"
                        className="relative z-10 object-contain"
                        style={{ width: "8rem", height: "8rem" }}
                    />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 mb-4">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    PORTAL SEKOLAH · AKSES SURAT
                </span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {!showAdminForm ? (
                    <>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Selamat Datang</h1>
                        <p className="text-sm text-gray-500 mb-6">Masuk untuk mengakses surat dan dokumen sekolah</p>

                        {error && (
                            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">{error}</div>
                        )}

                        <form onSubmit={handleStudentSubmit} noValidate className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    placeholder="Masukkan username kamu"
                                    disabled={isPageLoading}
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Masukkan password kamu"
                                    disabled={isPageLoading}
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPageLoading}
                                className="w-full rounded-lg bg-purple-700 py-2.5 text-sm font-semibold text-white hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isPageLoading ? "Memproses..." : "Masuk →"}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAdminForm(true);
                                    setError(null);
                                }}
                                className="text-sm text-gray-500 hover:text-purple-700 transition-colors"
                            >
                                Admin? Masuk di sini
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAdminForm(false);
                                    setError(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Kembali"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">Login Admin</h1>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">{error}</div>
                        )}

                        <form onSubmit={handleAdminSubmit} noValidate className="space-y-4">
                            <div>
                                <label htmlFor="admin-username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username / Email
                                </label>
                                <input
                                    id="admin-username"
                                    type="text"
                                    value={adminUsername}
                                    onChange={(event) => setAdminUsername(event.target.value)}
                                    placeholder="Masukkan username"
                                    disabled={isPageLoading}
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50"
                                />
                            </div>

                            <div>
                                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="admin-password"
                                    type="password"
                                    value={adminPassword}
                                    onChange={(event) => setAdminPassword(event.target.value)}
                                    placeholder="Masukkan password"
                                    disabled={isPageLoading}
                                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPageLoading}
                                className="w-full rounded-lg bg-purple-700 py-2.5 text-sm font-semibold text-white hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isPageLoading ? "Memproses..." : "Masuk →"}
                            </button>
                        </form>
                    </>
                )}
            </div>

            <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">SMP Muhammadiyah 14 · Portal Surat &amp; Dokumen</p>
                <p className="text-xs text-gray-400">© 2025 · All rights reserved</p>
            </div>
        </div>
    );
}
