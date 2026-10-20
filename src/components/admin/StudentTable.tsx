"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "@/components/ui/Modal";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useStore";
import { usePageLoader } from "@/app/hooks/usePageLoader";
import { responseErrorMessage } from "@/app/libs/general";
import { archiveStudent, deleteStudent, getAllStudent, importStudent, saveStudent } from "@/store/controllers/student.controller";
import { resetStudentResponse } from "@/store/slices/studentSlice";
import type { Student, StudentImportResult, StudentImportRow } from "@/store/types/StudentType";

interface FormState {
    nama_lengkap: string;
    username: string;
    nis: string;
    kelas: string;
    password: string;
}

const EMPTY_FORM: FormState = {
    nama_lengkap: "",
    username: "",
    nis: "",
    kelas: "",
    password: "",
};

const PAGE_SIZE = 20;
const IMPORT_BATCH_SIZE = 20;

export default function StudentTable() {
    const dispatch = useAppDispatch();
    const { students, response } = useAppSelector((state) => state.student);
    const { isPageLoading, runWithLoader } = usePageLoader();

    const [tab, setTab] = useState<"active" | "archived">("active");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [formError, setFormError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
    const [importResult, setImportResult] = useState<StudentImportResult | null>(null);
    const [importResultOpen, setImportResultOpen] = useState(false);
    const [templateModalOpen, setTemplateModalOpen] = useState(false);

    const fetchStudents = useCallback(() => {
        runWithLoader(() => dispatch(getAllStudent()));
    }, [dispatch, runWithLoader]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    useEffect(() => {
        if (response.action) {
            const actionResponse = response.action;
            dispatch(resetStudentResponse());

            if (actionResponse.status === true) {
                Swal.fire({ icon: "success", title: "Berhasil!", text: "Data siswa telah disimpan" }).then(() => {
                    setModalOpen(false);
                    setSelectedStudent(null);
                    setForm(EMPTY_FORM);
                    fetchStudents();
                });
            } else {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(actionResponse) });
            }
        }

        if (response.archive) {
            const archiveResponse = response.archive;
            dispatch(resetStudentResponse());

            if (archiveResponse.status === true) {
                Swal.fire({ icon: "success", title: "Berhasil!", text: "Status siswa telah diperbarui" }).then(() => {
                    setSelectedIds(new Set());
                    fetchStudents();
                });
            } else {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(archiveResponse) });
            }
        }

        if (response.delete) {
            const deleteResponse = response.delete;
            dispatch(resetStudentResponse());

            if (deleteResponse.status === true) {
                Swal.fire({ icon: "success", title: "Terhapus!", text: "Data siswa telah dihapus" });
            } else {
                Swal.fire({ icon: "error", title: "Gagal", text: responseErrorMessage(deleteResponse) });
            }
        }
    }, [response, dispatch, fetchStudents]);

    const tabFiltered = useMemo(
        () => students.filter((student) => (tab === "active" ? !student.is_archived : student.is_archived)),
        [students, tab],
    );

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return tabFiltered;
        return tabFiltered.filter(
            (student) => student.nama_lengkap.toLowerCase().includes(keyword) || (student.nis ?? "").toLowerCase().includes(keyword),
        );
    }, [tabFiltered, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleTabChange = (selectedTab: "active" | "archived") => {
        setTab(selectedTab);
        setPage(1);
        setSearch("");
        setSelectedIds(new Set());
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
        setSelectedIds(new Set());
    };

    const isAllSelected = paginated.length > 0 && paginated.every((student) => selectedIds.has(student.id));
    const isIndeterminate = paginated.some((student) => selectedIds.has(student.id)) && !isAllSelected;

    const handleSelectAll = () => {
        setSelectedIds((previousIds) => {
            const nextIds = new Set(previousIds);
            paginated.forEach((student) => (isAllSelected ? nextIds.delete(student.id) : nextIds.add(student.id)));
            return nextIds;
        });
    };

    const handleSelectOne = (studentId: string) => {
        setSelectedIds((previousIds) => {
            const nextIds = new Set(previousIds);
            if (nextIds.has(studentId)) {
                nextIds.delete(studentId);
            } else {
                nextIds.add(studentId);
            }
            return nextIds;
        });
    };

    const handleBulkArchive = () => {
        if (selectedIds.size === 0) return;
        runWithLoader(() => dispatch(archiveStudent({ ids: Array.from(selectedIds), is_archived: tab === "active" })));
    };

    const handleAddStudent = () => {
        setSelectedStudent(null);
        setForm(EMPTY_FORM);
        setFormError(null);
        setModalOpen(true);
    };

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        setForm({
            nama_lengkap: student.nama_lengkap,
            username: student.username,
            nis: student.nis ?? "",
            kelas: student.kelas ?? "",
            password: "",
        });
        setFormError(null);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedStudent(null);
        setForm(EMPTY_FORM);
        setFormError(null);
    };

    const handleFormChange = (field: keyof FormState, value: string) => {
        setForm((previousForm) => ({ ...previousForm, [field]: value }));
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setFormError(null);
        if (!form.nama_lengkap.trim() || !form.username.trim() || !form.nis.trim() || !form.kelas.trim()) {
            setFormError("Semua field wajib diisi");
            return;
        }
        runWithLoader(() =>
            dispatch(
                saveStudent({
                    id: selectedStudent ? selectedStudent.id : null,
                    nama_lengkap: form.nama_lengkap.trim(),
                    username: form.username.trim(),
                    nis: form.nis.trim(),
                    kelas: form.kelas.trim(),
                    password: form.password,
                }),
            ),
        );
    };

    const handleDeleteData = (student: Student) => {
        Swal.fire({
            title: "Hapus Siswa",
            text: `Apakah Anda yakin ingin menghapus siswa "${student.nama_lengkap}"? Seluruh data akses surat milik siswa ini juga akan dihapus.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc2626",
        }).then((result) => {
            if (result.isConfirmed) {
                runWithLoader(() => dispatch(deleteStudent(student.id)));
            }
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        event.target.value = "";

        setIsImporting(true);
        try {
            const { read, utils } = await import("xlsx");
            const buffer = await file.arrayBuffer();
            const workbook = read(buffer, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows: string[][] = utils.sheet_to_json(worksheet, { header: 1, defval: "" });

            const headerRowIndex = rows.findIndex((row) => row.some((cell) => String(cell).trim().toUpperCase() === "NIS"));
            if (headerRowIndex === -1) {
                Swal.fire({ icon: "error", title: "Gagal", text: "Format file tidak sesuai. Pastikan ada kolom NIS." });
                return;
            }

            const header = rows[headerRowIndex].map((headerCell) => String(headerCell).trim().toUpperCase());
            const nameColumn = header.findIndex((headerCell) => headerCell === "NAMA");
            const nisColumn = header.findIndex((headerCell) => headerCell === "NIS");
            const classColumn = header.findIndex((headerCell) => headerCell === "KELAS");

            const importRows: StudentImportRow[] = [];
            for (let rowIndex = headerRowIndex + 1; rowIndex < rows.length; rowIndex++) {
                const row = rows[rowIndex];
                const studentName = String(row[nameColumn] ?? "").trim();
                const studentNis = String(row[nisColumn] ?? "").trim();
                const studentClass = String(row[classColumn] ?? "").trim();
                if (!studentName || !studentNis || !studentClass) continue;
                importRows.push({ nama_lengkap: studentName, nis: studentNis, kelas: studentClass });
            }

            if (importRows.length === 0) {
                Swal.fire({ icon: "error", title: "Gagal", text: "Tidak ada data siswa yang valid ditemukan di file." });
                return;
            }

            const total = importRows.length;
            setImportProgress({ current: 0, total });

            const accumulated: StudentImportResult = { imported: 0, skipped: 0, errors: [] };
            for (let batchStart = 0; batchStart < total; batchStart += IMPORT_BATCH_SIZE) {
                const batch = importRows.slice(batchStart, batchStart + IMPORT_BATCH_SIZE);
                const importResponse = await dispatch(importStudent(batch)).unwrap();
                if (importResponse.status === true) {
                    accumulated.imported += importResponse.data.imported;
                    accumulated.skipped += importResponse.data.skipped;
                    accumulated.errors.push(...importResponse.data.errors);
                } else {
                    accumulated.errors.push(...batch.map((row) => ({ nis: row.nis, message: responseErrorMessage(importResponse) })));
                }
                setImportProgress({ current: Math.min(batchStart + IMPORT_BATCH_SIZE, total), total });
            }

            setImportResult(accumulated);
            setImportResultOpen(true);
            fetchStudents();
        } catch {
            Swal.fire({ icon: "error", title: "Gagal", text: "Gagal membaca file atau terhubung ke server. Silakan coba lagi." });
        } finally {
            setIsImporting(false);
            setImportProgress({ current: 0, total: 0 });
        }
    };

    const activeCount = students.filter((student) => !student.is_archived).length;
    const archivedCount = students.filter((student) => student.is_archived).length;

    return (
        <div className="space-y-4">
            {isPageLoading && <Loading />}
            <div className="flex items-center justify-between">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                        type="button"
                        onClick={() => handleTabChange("active")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            tab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Siswa Aktif
                        <span
                            className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                                tab === "active" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-500"
                            }`}
                        >
                            {activeCount}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange("archived")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            tab === "archived" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Arsip
                        <span
                            className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                                tab === "archived" ? "bg-orange-100 text-orange-700" : "bg-gray-200 text-gray-500"
                            }`}
                        >
                            {archivedCount}
                        </span>
                    </button>
                </div>

                <div className="flex gap-2">
                    <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleFileChange} />
                    <input
                        type="text"
                        placeholder="Cari nama atau NIS..."
                        value={search}
                        onChange={(event) => handleSearchChange(event.target.value)}
                        className="w-52 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {tab === "active" && (
                        <>
                            <button
                                type="button"
                                onClick={() => setTemplateModalOpen(true)}
                                className="px-4 py-2 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50 transition-colors whitespace-nowrap"
                            >
                                Import Excel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddStudent}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                            >
                                <span aria-hidden="true">+</span>
                                Tambah Siswa
                            </button>
                        </>
                    )}
                </div>
            </div>

            {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">{selectedIds.size} siswa dipilih</span>
                    <button
                        type="button"
                        onClick={handleBulkArchive}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 ${
                            tab === "active"
                                ? "bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200"
                                : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                        }`}
                    >
                        {tab === "active" ? "Arsipkan" : "Pulihkan ke Aktif"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedIds(new Set())}
                        className="ml-auto text-xs text-gray-500 hover:text-gray-700"
                    >
                        Batalkan pilihan
                    </button>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-12 px-4 py-3 cursor-pointer" onClick={handleSelectAll}>
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={(checkbox) => {
                                        if (checkbox) checkbox.indeterminate = isIndeterminate;
                                    }}
                                    onChange={handleSelectAll}
                                    onClick={(event) => event.stopPropagation()}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    aria-label="Pilih semua"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    {search
                                        ? "Tidak ada siswa yang cocok dengan pencarian."
                                        : tab === "active"
                                          ? "Belum ada data siswa aktif."
                                          : "Belum ada siswa yang diarsipkan."}
                                </td>
                            </tr>
                        ) : (
                            paginated.map((student) => (
                                <tr
                                    key={student.id}
                                    className={`hover:bg-gray-50 transition-colors ${selectedIds.has(student.id) ? "bg-blue-50" : ""}`}
                                >
                                    <td className="px-4 py-3 cursor-pointer" onClick={() => handleSelectOne(student.id)}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(student.id)}
                                            onChange={() => handleSelectOne(student.id)}
                                            onClick={(event) => event.stopPropagation()}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-gray-900 font-medium">{student.nama_lengkap}</td>
                                    <td className="px-4 py-3 text-gray-600">{student.nis ?? "-"}</td>
                                    <td className="px-4 py-3 text-gray-600">{student.kelas ?? "-"}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(student)}
                                                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteData(student)}
                                                className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                        Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} siswa
                    </span>
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                setPage((currentPage) => Math.max(1, currentPage - 1));
                                setSelectedIds(new Set());
                            }}
                            disabled={page === 1}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            ‹
                        </button>
                        {Array.from({ length: totalPages }, (_slide, pageIndex) => pageIndex + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                type="button"
                                onClick={() => {
                                    setPage(pageNumber);
                                    setSelectedIds(new Set());
                                }}
                                className={`px-3 py-1 border rounded transition-colors ${
                                    pageNumber === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setPage((currentPage) => Math.min(totalPages, currentPage + 1));
                                setSelectedIds(new Set());
                            }}
                            disabled={page === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={handleModalClose} title={selectedStudent ? "Edit Siswa" : "Tambah Siswa"}>
                <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
                    {formError && (
                        <div role="alert" className="px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                            {formError}
                        </div>
                    )}
                    <div>
                        <label htmlFor="siswa-nama" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="siswa-nama"
                            type="text"
                            value={form.nama_lengkap}
                            onChange={(event) => handleFormChange("nama_lengkap", event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan nama lengkap"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="siswa-username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="siswa-username"
                            type="text"
                            value={form.username}
                            onChange={(event) => handleFormChange("username", event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan username"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="siswa-nis" className="block text-sm font-medium text-gray-700 mb-1">
                            NIS <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="siswa-nis"
                            type="text"
                            value={form.nis}
                            onChange={(event) => handleFormChange("nis", event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan NIS"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="siswa-kelas" className="block text-sm font-medium text-gray-700 mb-1">
                            Kelas <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="siswa-kelas"
                            type="text"
                            value={form.kelas}
                            onChange={(event) => handleFormChange("kelas", event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: XII IPA 1"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="siswa-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="siswa-password"
                            type="password"
                            value={form.password}
                            onChange={(event) => handleFormChange("password", event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                                selectedStudent ? "Kosongkan jika tidak ingin mengubah" : "Kosongkan untuk pakai NIS sebagai password"
                            }
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleModalClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {selectedStudent ? "Simpan Perubahan" : "Tambah Siswa"}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isImporting} onClose={() => {}} title="Mengimpor Data Siswa">
                {(() => {
                    const { current, total } = importProgress;
                    const progressPercent = total > 0 ? Math.round((current / total) * 100) : 0;
                    return (
                        <div className="space-y-4 py-2">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>
                                    {current} dari {total} siswa
                                </span>
                                <span className="font-semibold">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className="h-3 rounded-full bg-green-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <p className="text-xs text-gray-400 text-center">Mohon tunggu, jangan tutup halaman ini...</p>
                        </div>
                    );
                })()}
            </Modal>

            <Modal isOpen={templateModalOpen} onClose={() => setTemplateModalOpen(false)} title="Import Data Siswa">
                <div className="space-y-4 text-sm">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">File Excel (.xlsx)</label>
                        <input
                            type="file"
                            accept=".xlsx"
                            disabled={isImporting}
                            onChange={async (event) => {
                                setTemplateModalOpen(false);
                                await handleFileChange(event);
                            }}
                            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                    </div>
                    <a href="/template-import-siswa.xlsx" download className="inline-block text-sm text-blue-600 hover:underline">
                        Unduh file template
                    </a>
                </div>
            </Modal>

            <Modal isOpen={importResultOpen} onClose={() => setImportResultOpen(false)} title="Hasil Import Excel">
                {importResult && (
                    <div className="space-y-4 text-sm">
                        <div className="flex gap-4">
                            <div className="flex-1 rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                                <p className="text-2xl font-bold text-green-700">{importResult.imported}</p>
                                <p className="text-green-600">Berhasil diimpor</p>
                            </div>
                            {importResult.skipped > 0 && (
                                <div className="flex-1 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-center">
                                    <p className="text-2xl font-bold text-yellow-700">{importResult.skipped}</p>
                                    <p className="text-yellow-600">Dilewati</p>
                                </div>
                            )}
                            {importResult.errors.length > 0 && (
                                <div className="flex-1 rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                                    <p className="text-2xl font-bold text-red-700">{importResult.errors.length}</p>
                                    <p className="text-red-600">Gagal</p>
                                </div>
                            )}
                        </div>
                        {importResult.errors.length > 0 && (
                            <ul className="space-y-1 max-h-40 overflow-y-auto">
                                {importResult.errors.map((importError) => (
                                    <li key={importError.nis} className="text-red-600 bg-red-50 px-3 py-1.5 rounded text-xs">
                                        NIS {importError.nis} — {importError.message}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <p className="text-xs text-gray-500">Username dan password default = NIS masing-masing.</p>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setImportResultOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
