"use client";

import Link from "next/link";
import CategoryGrid from "@/components/letterAccess/CategoryGrid";
import { AppLayout } from "../../layouts/AppLayout";

export default function LetterAccessPage() {
    return (
        <AppLayout role="admin">
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali ke Dashboard Admin
                        </Link>
                    </div>
                    <CategoryGrid />
                </div>
            </div>  
        </AppLayout>
    );
}
