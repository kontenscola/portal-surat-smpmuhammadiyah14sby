"use client";

import { useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import MyLetterList from "@/components/letterAccess/MyLetterList";
import Loading from "@/components/Loading";
import { AppLayout } from "../layouts/AppLayout";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import { usePageLoader } from "../hooks/usePageLoader";
import { useLogout } from "../hooks/useLogout";
import { responseErrorMessage } from "../libs/general";
import { downloadMyLetter, getAllMyLetter } from "@/store/controllers/myLetter.controller";
import { resetMyLetterResponse } from "@/store/slices/myLetterSlice";
import type { MyLetter } from "@/store/types/MyLetterType";

function MyLettersContent() {
    const dispatch = useAppDispatch();
    const handleLogout = useLogout();
    const { profile } = useAppSelector((state) => state.auth);
    const { myLetters, response } = useAppSelector((state) => state.myLetter);
    const { isPageLoading, runWithLoader } = usePageLoader();

    const fetchMyLetters = useCallback(() => {
        runWithLoader(() => dispatch(getAllMyLetter()));
    }, [dispatch, runWithLoader]);

    useEffect(() => {
        fetchMyLetters();
    }, [fetchMyLetters]);

    useEffect(() => {
        if (response.download) {
            const downloadResponse = response.download;
            dispatch(resetMyLetterResponse());

            if (downloadResponse.status !== true) {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(downloadResponse) });
            }
        }
    }, [response, dispatch]);

    const handleDownload = (myLetter: MyLetter) => {
        runWithLoader(() => dispatch(downloadMyLetter(myLetter)));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {isPageLoading && <Loading />}
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">{profile?.nama_lengkap}</h1>
                            <p className="mt-0.5 text-sm text-gray-500">
                                Kelas {profile?.kelas} &middot; NIS {profile?.nis}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <div className="mb-10 text-center">
                    <p className="text-base text-gray-700">Selamat Anda telah dinyatakan</p>
                    <p className="mt-5 mb-5 text-5xl font-bold text-gray-900 tracking-wide">LULUS</p>
                    <p className="text-base text-gray-700">dari SMP Muhammadiyah 14</p>
                    <p className="mt-1 text-base text-gray-700">Tahun Ajaran 2025/2026.</p>
                </div>

                <h2 className="mb-6 text-lg font-medium text-gray-700">Surat Saya</h2>
                <MyLetterList myLetters={myLetters} onDownload={handleDownload} />
            </main>
        </div>
    );
}

export default function MyLettersPage() {
    return (
        <AppLayout role="siswa">
            <MyLettersContent />
        </AppLayout>
    );
}
