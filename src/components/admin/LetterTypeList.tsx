"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Toggle from "@/components/ui/Toggle";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useStore";
import { usePageLoader } from "@/app/hooks/usePageLoader";
import { responseErrorMessage } from "@/app/libs/general";
import { deleteLetterType, getAllLetterType, saveLetterType, toggleLetterType } from "@/store/controllers/letterType.controller";
import { resetLetterTypeResponse } from "@/store/slices/letterTypeSlice";
import type { LetterType, LetterTypePayload } from "@/store/types/LetterTypeType";

const EMPTY_FORM: LetterTypePayload = {
    nama_surat: "",
    kode: "",
    deskripsi: "",
};

export default function LetterTypeList() {
    const dispatch = useAppDispatch();
    const { letterTypes, response } = useAppSelector((state) => state.letterType);
    const { isPageLoading, runWithLoader } = usePageLoader();

    const [modalOpen, setModalOpen] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [form, setForm] = useState<LetterTypePayload>(EMPTY_FORM);

    const fetchLetterTypes = useCallback(() => {
        runWithLoader(() => dispatch(getAllLetterType()));
    }, [dispatch, runWithLoader]);

    useEffect(() => {
        fetchLetterTypes();
    }, [fetchLetterTypes]);

    useEffect(() => {
        if (response.action) {
            const actionResponse = response.action;
            dispatch(resetLetterTypeResponse());

            if (actionResponse.status === true) {
                Swal.fire({ icon: "success", title: "Berhasil!", text: "Jenis surat telah ditambahkan" }).then(() => {
                    setModalOpen(false);
                    setForm(EMPTY_FORM);
                    fetchLetterTypes();
                });
            } else {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(actionResponse) });
            }
        }

        if (response.toggle) {
            const toggleResponse = response.toggle;
            dispatch(resetLetterTypeResponse());

            if (toggleResponse.status !== true) {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(toggleResponse) });
            }
        }

        if (response.delete) {
            const deleteResponse = response.delete;
            dispatch(resetLetterTypeResponse());

            if (deleteResponse.status === true) {
                Swal.fire({ icon: "success", title: "Terhapus!", text: "Jenis surat telah dihapus" });
            } else {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(deleteResponse) });
            }
        }
    }, [response, dispatch, fetchLetterTypes]);

    const handleAddLetterType = () => {
        setForm(EMPTY_FORM);
        setFormError(null);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setForm(EMPTY_FORM);
        setFormError(null);
    };

    const handleFormChange = (field: keyof LetterTypePayload, value: string) => {
        setForm((previousForm) => ({ ...previousForm, [field]: value }));
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setFormError(null);

        if (!form.nama_surat.trim()) {
            setFormError("Nama surat wajib diisi");
            return;
        }
        if (!form.kode.trim()) {
            setFormError("Kode wajib diisi");
            return;
        }
        if (!/^[A-Z]+$/.test(form.kode.trim())) {
            setFormError("Kode harus huruf kapital semua");
            return;
        }

        runWithLoader(() =>
            dispatch(
                saveLetterType({
                    nama_surat: form.nama_surat.trim(),
                    kode: form.kode.trim(),
                    deskripsi: form.deskripsi.trim(),
                }),
            ),
        );
    };

    const handleToggle = (letterType: LetterType) => {
        runWithLoader(() => dispatch(toggleLetterType(letterType.id)));
    };

    const handleDeleteData = (letterType: LetterType) => {
        Swal.fire({
            title: "Hapus Jenis Surat",
            text: `Apakah Anda yakin ingin menghapus jenis surat "${letterType.nama_surat}" (${letterType.kode})? Jenis surat yang sudah memiliki data akses tidak dapat dihapus.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc2626",
        }).then((result) => {
            if (result.isConfirmed) {
                runWithLoader(() => dispatch(deleteLetterType(letterType.id)));
            }
        });
    };

    return (
        <div className="space-y-4">
            {isPageLoading && <Loading />}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleAddLetterType}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                    <span aria-hidden="true">+</span>
                    Tambah Jenis
                </button>
            </div>

            {letterTypes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Belum ada jenis surat.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {letterTypes.map((letterType) => (
                        <div key={letterType.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{letterType.nama_surat}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-mono font-medium text-gray-600 bg-gray-100 rounded">
                                        {letterType.kode}
                                    </span>
                                </div>
                                <Badge variant={letterType.is_active ? "active" : "inactive"} />
                            </div>

                            {letterType.deskripsi && <p className="text-xs text-gray-500 line-clamp-2">{letterType.deskripsi}</p>}

                            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                                <Toggle
                                    checked={letterType.is_active}
                                    onChange={() => handleToggle(letterType)}
                                    label={letterType.is_active ? "Aktif" : "Nonaktif"}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteData(letterType)}
                                    className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                                    aria-label={`Hapus jenis surat ${letterType.nama_surat}`}
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={handleModalClose} title="Tambah Jenis Surat">
                <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
                    {formError && (
                        <div role="alert" className="px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                            {formError}
                        </div>
                    )}

                    <div>
                        <label htmlFor="surat-type-nama" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Surat{" "}
                            <span className="text-red-500" aria-hidden="true">
                                *
                            </span>
                        </label>
                        <input
                            id="surat-type-nama"
                            type="text"
                            value={form.nama_surat}
                            onChange={(event) => handleFormChange("nama_surat", event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Contoh: Surat Keterangan Lulus"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="surat-type-kode" className="block text-sm font-medium text-gray-700 mb-1">
                            Kode{" "}
                            <span className="text-red-500" aria-hidden="true">
                                *
                            </span>
                        </label>
                        <input
                            id="surat-type-kode"
                            type="text"
                            value={form.kode}
                            onChange={(event) => handleFormChange("kode", event.target.value.toUpperCase())}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Contoh: SKL"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">Harus berupa huruf kapital semua (A–Z).</p>
                    </div>

                    <div>
                        <label htmlFor="surat-type-deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <textarea
                            id="surat-type-deskripsi"
                            value={form.deskripsi}
                            onChange={(event) => handleFormChange("deskripsi", event.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Deskripsi singkat jenis surat ini"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleModalClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Tambah Jenis
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
