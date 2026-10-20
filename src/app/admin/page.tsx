"use client";

import AdminTabs from "@/components/admin/AdminTabs";
import { AppLayout } from "../layouts/AppLayout";
import { useLogout } from "../hooks/useLogout";

export default function AdminPage() {
    const handleLogout = useLogout();

    return (
        <AppLayout role="admin">
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Dashboard Admin</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Portal Surat — Manajemen Data</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminTabs />
                </main>
            </div>
        </AppLayout>
    );
}
