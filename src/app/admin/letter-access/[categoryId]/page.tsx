"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CategoryStudentTable from "@/components/letterAccess/CategoryStudentTable";
import { AppLayout } from "../../../layouts/AppLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks/useStore";
import { getDetailLetterCategory } from "@/store/controllers/letterCategory.controller";

function CategoryDetail({ categoryId }: { categoryId: string }) {
    const dispatch = useAppDispatch();
    const { letterCategory } = useAppSelector((state) => state.letterCategory);
    const [isCategoryMissing, setIsCategoryMissing] = useState(false);

    useEffect(() => {
        dispatch(getDetailLetterCategory(categoryId)).then((detailAction) => {
            if (getDetailLetterCategory.fulfilled.match(detailAction) && detailAction.payload.status !== true) {
                setIsCategoryMissing(true);
            }
        });
    }, [dispatch, categoryId]);

    if (isCategoryMissing) {
        return (
            <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
                <p className="text-sm text-gray-500">Kategori tidak ditemukan.</p>
                <Link href="/admin/letter-access" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                    Kembali ke Akses Surat
                </Link>
            </div>
        );
    }

    if (!letterCategory || letterCategory.id !== categoryId) {
        return null;
    }

    return (
        <>
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin/letter-access" className="hover:text-blue-600 transition-colors">
                    Akses Surat
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{letterCategory.nama_kategori}</span>
            </nav>

            <CategoryStudentTable categoryId={categoryId} categoryName={letterCategory.nama_kategori} />
        </>
    );
}

export default function CategoryDetailPage() {
    const { categoryId } = useParams<{ categoryId: string }>();

    return (
        <AppLayout role="admin">
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <CategoryDetail categoryId={categoryId} />
                </div>
            </div>
        </AppLayout>
    );
}
