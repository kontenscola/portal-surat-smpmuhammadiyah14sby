"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import CategoryCard from "./CategoryCard";
import Modal from "@/components/ui/Modal";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useStore";
import { usePageLoader } from "@/app/hooks/usePageLoader";
import { responseErrorMessage } from "@/app/libs/general";
import { deleteLetterCategory, getAllLetterCategory, saveLetterCategory } from "@/store/controllers/letterCategory.controller";
import { resetLetterCategoryResponse } from "@/store/slices/letterCategorySlice";
import type { LetterCategory, LetterCategoryPayload } from "@/store/types/LetterCategoryType";

const EMPTY_FORM: LetterCategoryPayload = {
    nama_kategori: "",
    deskripsi: "",
};

export default function CategoryGrid() {
    const dispatch = useAppDispatch();
    const { letterCategories, response } = useAppSelector((state) => state.letterCategory);
    const { isPageLoading, runWithLoader } = usePageLoader();

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<LetterCategoryPayload>(EMPTY_FORM);
    const [formError, setFormError] = useState<string | null>(null);

    const fetchLetterCategories = useCallback(() => {
        runWithLoader(() => dispatch(getAllLetterCategory()));
    }, [dispatch, runWithLoader]);

    useEffect(() => {
        fetchLetterCategories();
    }, [fetchLetterCategories]);

    useEffect(() => {
        if (response.action) {
            const actionResponse = response.action;
            dispatch(resetLetterCategoryResponse());

            if (actionResponse.status === true) {
                Swal.fire({ icon: "success", title: "Berhasil!", text: "Kategori telah ditambahkan" }).then(() => {
                    setModalOpen(false);
                    setForm(EMPTY_FORM);
                    fetchLetterCategories();
                });
            } else {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(actionResponse) });
            }
        }

        if (response.delete) {
            const deleteResponse = response.delete;
            dispatch(resetLetterCategoryResponse());

            if (deleteResponse.status === true) {
                Swal.fire({ icon: "success", title: "Terhapus!", text: "Kategori telah dihapus" });
            } else {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(deleteResponse) });
            }
        }
    }, [response, dispatch, fetchLetterCategories]);

    const handleOpenModal = () => {
        setForm(EMPTY_FORM);
        setFormError(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setFormError(null);

        if (!form.nama_kategori.trim()) {
            setFormError("Nama kategori wajib diisi");
            return;
        }

        runWithLoader(() =>
            dispatch(
                saveLetterCategory({
                    nama_kategori: form.nama_kategori.trim(),
                    deskripsi: form.deskripsi.trim(),
                }),
            ),
        );
    };

    const handleDeleteData = (letterCategory: LetterCategory) => {
        Swal.fire({
            title: "Hapus Kategori",
            text: `Hapus kategori "${letterCategory.nama_kategori}"? Kategori yang masih memiliki data surat siswa tidak dapat dihapus.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc2626",
        }).then((result) => {
            if (result.isConfirmed) {
                runWithLoader(() => dispatch(deleteLetterCategory(letterCategory.id)));
            }
        });
    };

    return (
        <div className="space-y-4">
            {isPageLoading && <Loading />}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Kategori Surat</h2>
                <button
                    type="button"
                    onClick={handleOpenModal}
                    className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <span aria-hidden="true">+</span>
                    Tambah Kategori
                </button>
            </div>

            {letterCategories.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
                    <p className="text-sm text-gray-500">Belum ada kategori surat.</p>
                    <p className="mt-1 text-xs text-gray-400">Klik &quot;+ Tambah Kategori&quot; untuk memulai.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {letterCategories.map((letterCategory) => (
                        <CategoryCard key={letterCategory.id} category={letterCategory} onDelete={handleDeleteData} />
                    ))}
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={handleCloseModal} title="Tambah Kategori Surat">
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {formError && (
                        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
                            {formError}
                        </div>
                    )}

                    <div>
                        <label htmlFor="kategori-nama" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Kategori{" "}
                            <span className="text-red-500" aria-hidden="true">
                                *
                            </span>
                        </label>
                        <input
                            id="kategori-nama"
                            type="text"
                            value={form.nama_kategori}
                            onChange={(event) => setForm({ ...form, nama_kategori: event.target.value })}
                            placeholder="Contoh: Ijazah, SKL, Transkrip"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="kategori-deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <textarea
                            id="kategori-deskripsi"
                            value={form.deskripsi}
                            onChange={(event) => setForm({ ...form, deskripsi: event.target.value })}
                            rows={3}
                            placeholder="Deskripsi singkat kategori ini"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                            Tambah Kategori
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
