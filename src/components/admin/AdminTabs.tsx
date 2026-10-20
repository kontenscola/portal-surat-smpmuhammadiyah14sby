"use client";

import { useState } from "react";
import Link from "next/link";
import StudentTable from "@/components/admin/StudentTable";
import LetterTypeList from "@/components/admin/LetterTypeList";

type TabId = "students" | "letterTypes";

const TABS: { id: TabId; label: string }[] = [
    { id: "students", label: "Kelola Siswa" },
    { id: "letterTypes", label: "Master Surat" },
];

export default function AdminTabs() {
    const [activeTab, setActiveTab] = useState<TabId>("students");

    return (
        <div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-1 items-center" aria-label="Tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            aria-selected={activeTab === tab.id}
                            role="tab"
                        >
                            {tab.label}
                        </button>
                    ))}
                    <Link
                        href="/admin/letter-access"
                        className="ml-2 flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                        <span aria-hidden="true">✦</span>
                        Akses Surat
                    </Link>
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === "students" && <StudentTable />}
                {activeTab === "letterTypes" && <LetterTypeList />}
            </div>
        </div>
    );
}
