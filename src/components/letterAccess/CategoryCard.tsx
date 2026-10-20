"use client";

import Link from "next/link";
import type { LetterCategory } from "@/store/types/LetterCategoryType";

interface CategoryCardProps {
    category: LetterCategory;
    onDelete: (category: LetterCategory) => void;
}

export default function CategoryCard({ category, onDelete }: CategoryCardProps) {
    return (
        <div className="group relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <Link href={`/admin/letter-access/${category.id}`} className="flex-1">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                            />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.nama_kategori}
                        </h3>
                        {category.deskripsi && <p className="mt-1 line-clamp-2 text-xs text-gray-500">{category.deskripsi}</p>}
                    </div>
                </div>
            </Link>

            <div className="flex justify-end border-t border-gray-100 pt-2">
                <button
                    type="button"
                    onClick={() => onDelete(category)}
                    className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                    aria-label={`Hapus kategori ${category.nama_kategori}`}
                >
                    Hapus
                </button>
            </div>
        </div>
    );
}
